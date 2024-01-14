/* eslint-disable @typescript-eslint/consistent-type-imports */
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, Inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { type PluginResultError } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { type BleDevice, type ScanResult } from '@capacitor-community/bluetooth-le';
import { FilePicker, type PickedFile } from '@capawesome/capacitor-file-picker';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonButton,
  IonButtons,
  IonBackButton,
  IonLabel,
  IonText,
  IonNote,
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { NordicDfu, type DfuUpdateOptions, DfuOptions, DfuUpdate } from 'capacitor-community-nordic-dfu';

import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dfu',
  templateUrl: 'dfu.page.html',
  styleUrls: ['dfu.page.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    DecimalPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonButton,
    IonButtons,
    IonBackButton,
    IonLabel,
    IonText,
    IonNote,
    IonProgressBar,
    IonSegment,
    IonSegmentButton,
  ],
})
export class DfuPage {
  public device!: BleDevice;
  public file!: PickedFile | undefined;
  public update: DfuUpdate | undefined;

  constructor(@Inject(NgZone) private ngZone: NgZone, private router: Router, private toastService: ToastService) {
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
    await NordicDfu.addListener('DFUStateChanged', async (update: DfuUpdate) => {
      console.log(`DFU: state: ${update.state}, data: ${JSON.stringify(update.data)}`);
      this.ngZone.run(() => {
        this.update = update;
      });
    });
  }

  async ionViewWillLeave(): Promise<void> {
    await NordicDfu.removeAllListeners();
  }

  async updateFirmware(): Promise<void> {
    if (!this.file || !this.file.path) {
      this.toastService.presentErrorToast('Pick a file first!');
      return;
    }

    const request = await NordicDfu.checkPermissions();
    if (request.notifications !== 'granted') {
      const request = await NordicDfu.requestPermissions();
      if (request.notifications !== 'granted') {
        this.toastService.presentErrorToast('Please allow notification access!');
        return;
      }
    }

    const dfuOptions: DfuOptions = {
      mtu: 23,
      currentMtu: 23,
      packetReceiptNotificationsEnabled: false,
    };

    const dfuUpdateOptions: DfuUpdateOptions = {
      deviceAddress: this.device.deviceId,
      deviceName: this.device.name,
      filePath: this.file.path,
      dfuOptions: dfuOptions,
    };

    NordicDfu.startDFU(dfuUpdateOptions).then(
      () => this.toastService.presentInfoToast('Starting DFU...'),
      (error: PluginResultError) => {
        console.error(error);
        this.toastService.presentErrorToast(`Error starting DFU: ${JSON.stringify(error)}`);
      }
    );
  }

  async pickFile(): Promise<void> {
    this.file = undefined;

    const request = await Filesystem.checkPermissions();
    if (request.publicStorage !== 'granted') {
      const request = await Filesystem.requestPermissions();
      if (request.publicStorage !== 'granted') {
        this.toastService.presentErrorToast('Please allow file system access!');
        return;
      }
    }

    try {
      const { files } = await FilePicker.pickFiles({
        readData: true,
        types: ['application/zip'],
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
    } catch (error: any) {
      if (error.message !== 'pickFiles canceled.') {
        console.error(error);
        this.toastService.presentErrorToast(`Error picking file: ${JSON.stringify(error)}`);
      }
    }
  }
}
