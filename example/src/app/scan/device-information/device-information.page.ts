/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import type { PluginResultError } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import type { BleDevice, ScanResult } from '@capacitor-community/bluetooth-le';
import { BleClient, ConnectionPriority, dataViewToText, textToDataView } from '@capacitor-community/bluetooth-le';
import { NordicDfu, type DfuUpdateOptions } from '@capacitor-community/nordic-dfu';
import type { PickedFile } from '@capawesome/capacitor-file-picker';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { IonicModule, Platform } from '@ionic/angular';
import { Subject } from 'rxjs';

import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { CONSTANTS } from '../../shared/constants';

interface DeviceInformation {
  modelNumber: string;
  serialNumber: string;
  firmwareVersion: string;
  hardwareVersion: string;
}

@Component({
  selector: 'app-device-information',
  templateUrl: 'device-information.page.html',
  styleUrls: ['device-information.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DeviceInformationPageComponent {
  device!: BleDevice;
  deviceInformationSubject = new Subject<DeviceInformation | null>();
  deviceInformation$ = this.deviceInformationSubject.asObservable();

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

  async ionViewWillEnter(): Promise<void> {
    await this.connectToDevice();
  }

  async connectToDevice(): Promise<void> {
    try {
      const deviceId = this.device.name ?? this.device.deviceId;

      await this.loadingService.presentLoading(`Connecting to ${deviceId}`);
      await BleClient.connect(this.device.deviceId);
      await BleClient.requestConnectionPriority(this.device.deviceId, ConnectionPriority.CONNECTION_PRIORITY_HIGH); // Android only
      await this.loadingService.dismissLoading();

      await this.toastService.presentSuccessToast(`Connected to device ${deviceId}`);
      await this.triggerBluetoothPairing();
      await this.readDeviceInformation();
    } catch (error) {
      console.error(error);
      this.toastService.presentErrorToast(`Error connecting to device: ${JSON.stringify(error)}`);
      this.router.navigate(['/scan']);
    }
  }

  async readDeviceInformation(): Promise<void> {
    try {
      // const services = await BleClient.getServices(this.device.deviceId);
      // for (const service of services) {
      //   console.log(service.uuid);
      //   const characteristics = service.characteristics;
      //   for (const characteristic of characteristics) {
      //     console.log(characteristic.uuid);
      //   }
      // }

      const isAndroid = this.platform.is('android');

      const deviceInformation: DeviceInformation = {
        modelNumber: '',
        serialNumber: '',
        firmwareVersion: '',
        hardwareVersion: '',
      };

      deviceInformation.modelNumber = await this.readCharacteristic(
        isAndroid
          ? CONSTANTS.UUID16_SVC_DEVICE_INFORMATION
          : CONSTANTS.UUID16_SVC_DEVICE_INFORMATION.toLocaleUpperCase(),
        isAndroid
          ? CONSTANTS.UUID16_SVC_DEVICE_INFORMATION_CHAR_MODEL_NUMBER
          : CONSTANTS.UUID16_SVC_DEVICE_INFORMATION_CHAR_MODEL_NUMBER.toLocaleUpperCase()
      );

      deviceInformation.serialNumber = await this.readCharacteristic(
        isAndroid
          ? CONSTANTS.UUID16_SVC_DEVICE_INFORMATION
          : CONSTANTS.UUID16_SVC_DEVICE_INFORMATION.toLocaleUpperCase(),
        isAndroid
          ? CONSTANTS.UUID16_SVC_DEVICE_INFORMATION_CHAR_SERIAL_NUMBER
          : CONSTANTS.UUID16_SVC_DEVICE_INFORMATION_CHAR_SERIAL_NUMBER.toLocaleUpperCase()
      );

      deviceInformation.firmwareVersion = await this.readCharacteristic(
        isAndroid
          ? CONSTANTS.UUID16_SVC_DEVICE_INFORMATION
          : CONSTANTS.UUID16_SVC_DEVICE_INFORMATION.toLocaleUpperCase(),
        isAndroid
          ? CONSTANTS.UUID16_SVC_DEVICE_INFORMATION_CHAR_FIRMWARE_VERSION
          : CONSTANTS.UUID16_SVC_DEVICE_INFORMATION_CHAR_FIRMWARE_VERSION.toLocaleUpperCase()
      );

      deviceInformation.hardwareVersion = await this.readCharacteristic(
        isAndroid
          ? CONSTANTS.UUID16_SVC_DEVICE_INFORMATION
          : CONSTANTS.UUID16_SVC_DEVICE_INFORMATION.toLocaleUpperCase(),
        isAndroid
          ? CONSTANTS.UUID16_SVC_DEVICE_INFORMATION_CHAR_HARDWARE_VERSION
          : CONSTANTS.UUID16_SVC_DEVICE_INFORMATION_CHAR_HARDWARE_VERSION.toLocaleUpperCase()
      );

      this.deviceInformationSubject.next(deviceInformation);
    } catch (error) {
      console.error(error);
      this.toastService.presentErrorToast(`Error reading device information: ${JSON.stringify(error)}`);
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

  // file!: PickedFile;

  // bluetoothIsScanning = false;

  // bluetoothConnectedDevice?: ScanResult;

  // scanResultSubject = new Subject<ScanResult | null>();

  // scanResults$ = this.scanResultSubject.asObservable().pipe(
  //   scan((acc: ScanResult[], curr: any) => {
  //     if (curr === null) return [];
  //     return [...acc, curr];
  //   }, [])
  // );

  // constructor(private ngZone: NgZone, public toastController: ToastController) {}

  // async scanForBluetoothDevices(): Promise<void> {
  //   console.log('scan started');

  //   try {
  //     await BleClient.initialize();

  //     this.bluetoothIsScanning = true;

  //     // clear scan results in scanResults$ observable before starting a new scan to avoid duplicates
  //     this.scanResultSubject.next(null);

  //     // passing goProControlAndQueryServiceUUID will show only GoPro devices
  //     // read more here https://github.com/gopro/OpenGoPro/discussions/41#discussion-3530421
  //     // but if you pass empty array to services it will show all nearby bluetooth devices
  //     await BleClient.requestLEScan(
  //       {
  //         services: [NORDIC_DFU_SERVICE],
  //         scanMode: ScanMode.SCAN_MODE_LOW_LATENCY,
  //       },
  //       this.onBluetoothDeviceFound.bind(this)
  //     );

  //     const stopScanAfterMilliSeconds = 7000;
  //     setTimeout(async () => {
  //       await BleClient.stopLEScan();
  //       this.bluetoothIsScanning = false;
  //       console.log('stopped scanning');
  //     }, stopScanAfterMilliSeconds);
  //   } catch (error) {
  //     this.bluetoothIsScanning = false;
  //     console.error('scanForBluetoothDevices', error);
  //   }
  // }

  // onBluetoothDeviceFound(result: any) {
  //   console.log('received new scan result', result);
  //   this.ngZone.run(() => {
  //     this.scanResultSubject.next(result);
  //   });
  // }

  // async connectToBluetoothDevice(scanResult: ScanResult) {
  //   const device = scanResult.device;

  //   try {
  //     await BleClient.connect(device.deviceId, this.onBluetooDeviceDisconnected.bind(this));

  //     this.bluetoothConnectedDevice = scanResult;
  //     await this.triggerBluetoothPairing();

  //     const deviceName = device.name ?? device.deviceId;
  //     this.presentToast(`connected to device ${deviceName}`);
  //   } catch (error) {
  //     console.error('connectToDevice', error);
  //     this.presentToast(JSON.stringify(error));
  //   }
  // }

  // async triggerBluetoothPairing() {
  //   // When we first connect to go pro device we need to pair it.
  //   // One way of tirgger pairing is to try to send any bluetooth command
  //   // to Go Pro Device. Here I send enableGoProWiFiCommand
  //   // you can choose other command if you want.
  //   // await this.sendBluetoothWriteCommand(this.enableGoProWiFiCommand);
  // }

  // async disconnectFromBluetoothDevice(scanResult: ScanResult) {
  //   const device = scanResult.device;
  //   try {
  //     await BleClient.disconnect(scanResult.device.deviceId);
  //     const deviceName = device.name ?? device.deviceId;
  //     alert(`disconnected from device ${deviceName}`);
  //   } catch (error) {
  //     console.error('disconnectFromDevice', error);
  //   }
  // }

  // onBluetooDeviceDisconnected(disconnectedDeviceId: string) {
  //   alert(`Disconnected ${disconnectedDeviceId}`);
  //   this.bluetoothConnectedDevice = undefined;
  // }

  // async presentToast(message: string) {
  //   const toast = await this.toastController.create({
  //     message,
  //     duration: 1700,
  //   });
  //   toast.present();
  // }

  // async updateFirmware(): Promise<void> {
  //   if (!this.file || !this.file.path) {
  //     this.presentToast('Pick a file first');
  //     return;
  //   }

  //   const contentUri = this.file.path;

  //   // Convert content URI to a file path
  //   const file = await Filesystem.getUri({
  //     path: contentUri,
  //     directory: Directory.Documents,
  //   });

  //   console.log(file);

  //   const filePath = Capacitor.convertFileSrc(file.uri);
  //   console.log(filePath);

  //   const options: IDfuUpdateOptions = {
  //     deviceAddress: 'someAddress',
  //     deviceName: 'someName',
  //     filePath: filePath,
  //   };

  //   NordicDfu.startDFU(options).then(
  //     (result) => console.log('ok', result),
  //     (result) => console.error(result)
  //   );
  // }

  // async pickFile(): Promise<void> {
  //   const result = await FilePicker.pickFiles({
  //     types: ['application/zip'],
  //     multiple: false,
  //   });

  //   this.file = result.files[0];

  //   console.log(result);
  // }
}
