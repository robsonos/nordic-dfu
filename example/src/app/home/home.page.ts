import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import type { ScanResult } from '@capacitor-community/bluetooth-le';
import { BleClient, ScanMode } from '@capacitor-community/bluetooth-le';
import { NordicDfu } from '@capacitor-community/nordic-dfu';
import { IonicModule, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { scan } from 'rxjs/operators';

const NORDIC_DFU_SERVICE = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage {
  bluetoothIsScanning = false;

  bluetoothConnectedDevice?: ScanResult;

  scanResultSubject = new Subject<ScanResult | null>();

  scanResults$ = this.scanResultSubject.asObservable().pipe(
    scan((acc: ScanResult[], curr: any) => {
      if (curr === null) return [];
      return [...acc, curr];
    }, [])
  );

  constructor(private ngZone: NgZone, public toastController: ToastController) {}

  async scanForBluetoothDevices(): Promise<void> {
    console.log('scan started');

    try {
      await BleClient.initialize();

      this.bluetoothIsScanning = true;

      // clear scan results in scanResults$ observable before starting a new scan to avoid duplicates
      this.scanResultSubject.next(null);

      // passing goProControlAndQueryServiceUUID will show only GoPro devices
      // read more here https://github.com/gopro/OpenGoPro/discussions/41#discussion-3530421
      // but if you pass empty array to services it will show all nearby bluetooth devices
      await BleClient.requestLEScan(
        {
          services: [NORDIC_DFU_SERVICE],
          scanMode: ScanMode.SCAN_MODE_LOW_LATENCY,
        },
        this.onBluetoothDeviceFound.bind(this)
      );

      const stopScanAfterMilliSeconds = 7000;
      setTimeout(async () => {
        await BleClient.stopLEScan();
        this.bluetoothIsScanning = false;
        console.log('stopped scanning');
      }, stopScanAfterMilliSeconds);
    } catch (error) {
      this.bluetoothIsScanning = false;
      console.error('scanForBluetoothDevices', error);
    }
  }

  onBluetoothDeviceFound(result: any) {
    console.log('received new scan result', result);
    this.ngZone.run(() => {
      this.scanResultSubject.next(result);
    });
  }

  async connectToBluetoothDevice(scanResult: ScanResult) {
    const device = scanResult.device;

    try {
      await BleClient.connect(device.deviceId, this.onBluetooDeviceDisconnected.bind(this));

      this.bluetoothConnectedDevice = scanResult;
      await this.triggerBluetoothPairing();

      const deviceName = device.name ?? device.deviceId;
      this.presentToast(`connected to device ${deviceName}`);
    } catch (error) {
      console.error('connectToDevice', error);
      this.presentToast(JSON.stringify(error));
    }
  }

  async triggerBluetoothPairing() {
    // When we first connect to go pro device we need to pair it.
    // One way of tirgger pairing is to try to send any bluetooth command
    // to Go Pro Device. Here I send enableGoProWiFiCommand
    // you can choose other command if you want.
    // await this.sendBluetoothWriteCommand(this.enableGoProWiFiCommand);
  }

  async disconnectFromBluetoothDevice(scanResult: ScanResult) {
    const device = scanResult.device;
    try {
      await BleClient.disconnect(scanResult.device.deviceId);
      const deviceName = device.name ?? device.deviceId;
      alert(`disconnected from device ${deviceName}`);
    } catch (error) {
      console.error('disconnectFromDevice', error);
    }
  }

  onBluetooDeviceDisconnected(disconnectedDeviceId: string) {
    alert(`Disconnected ${disconnectedDeviceId}`);
    this.bluetoothConnectedDevice = undefined;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1700,
    });
    toast.present();
  }
}
