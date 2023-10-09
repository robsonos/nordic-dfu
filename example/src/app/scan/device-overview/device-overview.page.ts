/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import type { PluginResultError } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import type { BleDevice, ScanResult } from '@capacitor-community/bluetooth-le';
import { BleClient, textToDataView } from '@capacitor-community/bluetooth-le';
import type { IDfuUpdateOptions } from '@capacitor-community/nordic-dfu';
import { NordicDfu } from '@capacitor-community/nordic-dfu';
import type { PickedFile } from '@capawesome/capacitor-file-picker';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { IonicModule } from '@ionic/angular';

import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { CONSTANTS } from '../../shared/constants';

@Component({
  selector: 'app-device-overview',
  templateUrl: 'device-overview.page.html',
  styleUrls: ['device-overview.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DeviceOverviewPageComponent {
  device!: BleDevice;

  constructor(private router: Router, private toastService: ToastService, private loadingService: LoadingService) {
    const navigation = this.router.getCurrentNavigation();

    if (!navigation) {
      this.toastService.presentErrorToast('No navigation provided');
      this.router.navigate(['/scan']);
      return;
    }

    const state = navigation.extras.state as { device: ScanResult };

    if (!state) {
      this.toastService.presentErrorToast('No state provided');
      this.router.navigate(['/scan']);
      return;
    }

    const device = state.device;

    if (!device.device) {
      this.toastService.presentErrorToast('No device provided');
      this.router.navigate(['/scan']);
      return;
    }

    if (!device.device.deviceId) {
      this.toastService.presentErrorToast('No device id provided');
      this.router.navigate(['/scan']);
      return;
    }
    if (!device.device.name) {
      this.toastService.presentErrorToast('No device name provided');
      this.router.navigate(['/scan']);
      return;
    }

    this.device = device.device;
  }

  async ionViewWillEnter() {
    await this.connectToDevice();
  }

  async connectToDevice() {
    try {
      const deviceId = this.device.name ?? this.device.deviceId;

      await this.loadingService.presentLoading(`Connecting to ${deviceId}`);
      await BleClient.connect(this.device.deviceId);
      await this.loadingService.dismissLoading();

      await this.toastService.presentSuccessToast(`Connected to device ${deviceId}`);
      await this.triggerBluetoothPairing();
    } catch (error) {
      console.error(error);
      this.toastService.presentErrorToast(`Error connecting to device: ${JSON.stringify(error)}`);
      this.router.navigate(['/scan']);
    }
  }

  async sendBluetoothWriteCommand(command: string) {
    try {
      await BleClient.write(
        this.device.deviceId,
        CONSTANTS.UUID128_SVC_NORDIC_UART,
        CONSTANTS.UUID128_SVC_NORDIC_UART_CHAR_RXD,
        textToDataView(command)
      );
    } catch (error) {
      console.error(error);
      this.toastService.presentErrorToast(`Error writing command to device: ${JSON.stringify(error)}`);
    }
  }

  async triggerBluetoothPairing() {
    try {
      const pin = this.crc16ccitt(this.device.name as string);
      await this.sendBluetoothWriteCommand(pin);
    } catch (error) {
      console.error(error);
      this.toastService.presentErrorToast(`Error triggering pair procedure on device: ${JSON.stringify(error)}`);
    }
  }

  crc16ccitt(data: string) {
    let crc = 0xffff; // Initial value as per CCITT
    const polynomial = 0x1021;

    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc <<= 1;
        }
        crc &= 0xffff;
      }
    }
    return crc.toString().padStart(6, '0');
  }
}
