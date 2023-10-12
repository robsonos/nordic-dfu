/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { type PluginResultError } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import {
  BleClient,
  dataViewToText,
  textToDataView,
  type BleDevice,
  type ScanResult,
} from '@capacitor-community/bluetooth-le';
import { NordicDfu, type DfuUpdateOptions, DfuOptions } from '@capacitor-community/nordic-dfu';
import { FilePicker, type PickedFile } from '@capawesome/capacitor-file-picker';
import { IonicModule, Platform } from '@ionic/angular';

import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { CONSTANTS } from '../../shared/constants';

@Component({
  selector: 'app-dfu',
  templateUrl: 'dfu.page.html',
  styleUrls: ['dfu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DfuComponent {
  public device!: BleDevice;
  public file!: PickedFile | undefined;
  // public path: string | undefined;

  constructor(
    public platform: Platform,
    private router: Router,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) {
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

  async connectToDevice(): Promise<void> {
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

  async readCharacteristic(service: string, characteristic: string): Promise<string> {
    try {
      const result = await BleClient.read(this.device.deviceId, service, characteristic);
      return dataViewToText(result);
    } catch (error) {
      console.error(error);
      this.toastService.presentErrorToast(`Error reading characteristic: ${JSON.stringify(error)}`);
      return '';
    }
  }

  async sendBluetoothWriteCommand(command: string): Promise<void> {
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

  async triggerBluetoothPairing(): Promise<void> {
    try {
      const pin = this.crc16ccitt(this.device.name as string);
      await this.sendBluetoothWriteCommand(pin);
    } catch (error) {
      console.error(error);
      this.toastService.presentErrorToast(`Error triggering pair procedure on device: ${JSON.stringify(error)}`);
    }
  }

  crc16ccitt(data: string): string {
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

  async ionViewWillEnter(): Promise<void> {
    await this.connectToDevice();

    NordicDfu.addListener('DFUStateChanged', ({ state, data }) => {
      console.log(`DFU: state: ${state}, data: ${JSON.stringify(data)}`);
    });
  }

  async ionViewWillLeave(): Promise<void> {
    NordicDfu.removeAllListeners();
  }

  async updateFirmware(): Promise<void> {
    if (!this.file || !this.file.path) {
      this.toastService.presentErrorToast('Pick a file first');
      return;
    }

    const dfuOptions: DfuOptions = {
      forceDfu: false,
      mtu: 23,
      currentMtu: 23,
      keepBond: true,
      restoreBond: true,
      unsafeExperimentalButtonlessServiceInSecureDfuEnabled: false,
      packetReceiptNotificationsEnabled: false,
    };

    const dfuUpdateOptions: DfuUpdateOptions = {
      deviceAddress: this.device.deviceId,
      deviceName: this.device.name,
      filePath: this.file.path,
      dfuOptions: dfuOptions,
    };

    NordicDfu.startDFU(dfuUpdateOptions).then(
      () => this.toastService.presentInfoToast('DFU started'),
      (error: PluginResultError) => {
        console.error(error);
        this.toastService.presentErrorToast(`Error starting DFU: ${JSON.stringify(error)}`);
      }
    );
  }

  async pickFile(): Promise<void> {
    this.file = undefined;
    await Filesystem.requestPermissions();
    const { files } = await FilePicker.pickFiles({
      readData: true,
    });

    this.file = files[0];

    if (this.file.data) {
      await Filesystem.writeFile({
        data: this.file.data,
        path: this.file.name,
        directory: Directory.Library,
      });
      const { uri } = await Filesystem.getUri({
        path: this.file.name,
        directory: Directory.Library,
      });

      this.file.path = uri;
    }
  }
}
