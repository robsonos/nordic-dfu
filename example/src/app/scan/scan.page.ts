/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CommonModule } from '@angular/common';
import { Component, Inject, NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BleClient, ScanMode, type ScanResult } from '@capacitor-community/bluetooth-le';
import { IonicModule } from '@ionic/angular';
import { Subject } from 'rxjs';
import { scan } from 'rxjs/operators';

import { ToastService } from '../services/toast.service';
import { CONSTANTS } from '../shared/constants';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class ScanPageComponent {
  bluetoothIsScanning = false;
  scanInterval: any;
  scanProgress = 0;
  scanResultSubject = new Subject<ScanResult | null>();
  scanResults$ = this.scanResultSubject.asObservable().pipe(
    scan((acc: ScanResult[], curr: any) => {
      if (curr === null) return [];
      return [...acc, curr];
    }, [])
  );

  constructor(@Inject(NgZone) private ngZone: NgZone, private toastService: ToastService) {}

  async ionViewWillEnter() {
    try {
      await BleClient.initialize();
    } catch (error) {
      this.toastService.presentErrorToast(`Error initializing bluetooth: ${JSON.stringify(error)}`);
    }
  }

  async scanForBluetoothDevices(): Promise<void> {
    try {
      const isEnabled = await BleClient.isEnabled();

      if (!isEnabled) {
        this.toastService.presentErrorToast('Please enable bluetooth');
        return;
      }
      const stopScanAfterMilliSeconds = 10000;

      this.scanResultSubject.next(null);

      this.bluetoothIsScanning = true;
      this.toastService.presentInfoToast('Scanning for devices');

      await BleClient.requestLEScan(
        {
          services: [CONSTANTS.UUID128_SVC_NORDIC_UART],
          scanMode: ScanMode.SCAN_MODE_LOW_LATENCY,
        },
        this.onBluetoothDeviceFound.bind(this)
      );

      this.scanInterval = setInterval(() => {
        this.scanProgress += 0.01;
      }, stopScanAfterMilliSeconds * 0.01);

      setTimeout(async () => {
        this.stopScanForBluetoothDevices();
      }, stopScanAfterMilliSeconds);
    } catch (error) {
      this.bluetoothIsScanning = false;
      this.toastService.presentErrorToast(`Error scanning for devices: ${JSON.stringify(error)}`);
    }
  }

  async stopScanForBluetoothDevices(): Promise<void> {
    if (this.bluetoothIsScanning) {
      await BleClient.stopLEScan();
      this.bluetoothIsScanning = false;
      this.scanProgress = 0;
      clearInterval(this.scanInterval);
      this.toastService.presentInfoToast('Scan stopped');
    }
  }

  onBluetoothDeviceFound(result: ScanResult) {
    this.ngZone.run(() => {
      this.scanResultSubject.next(result);
    });
  }

  getRssiIcon(rssi: number) {
    if (rssi >= -40) {
      return '/assets/svg/wifi_5.svg';
    } else if (rssi >= -50) {
      return '/assets/svg/wifi_4.svg';
    } else if (rssi >= -60) {
      return '/assets/svg/wifi_3.svg';
    } else if (rssi >= -70) {
      return '/assets/svg/wifi_2.svg';
    } else if (rssi >= -80) {
      return '/assets/svg/wifi_1.svg';
    } else {
      return '/assets/svg/wifi_0.svg';
    }
  }
}
