import { AsyncPipe } from '@angular/common';
import { Component, inject, viewChild, type OnDestroy, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BleClient, ScanMode, type ScanResult } from '@capacitor-community/bluetooth-le';
import {
  IonRouterLink,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonNote,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { scan } from 'rxjs/operators';

import { ToastService } from '../services/toast.service';
import { CONSTANTS } from '../shared/constants';

// import { ToastService } from '../../../services/toast.service';
// import { CONSTANTS } from '../../shared/constants';
// import type { RefresherCustomEvent } from '../../shared/custom-event.interface';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss'],
  imports: [
    AsyncPipe,
    IonRouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonGrid,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonNote,
    IonProgressBar,
    IonRefresher,
    IonRefresherContent,
    RouterLink,
  ],
})
export class ScanPage implements OnDestroy, OnInit {
  private readonly toastService = inject(ToastService);
  // private readonly ngZone = inject(NgZone);

  /* This is used for stopping the scan before the user leaves the page */
  scanRefresher = viewChild.required<IonRefresher>('scanRefresher');

  scanInterval!: ReturnType<typeof setInterval>;
  scanProgress = 0;
  scanResultSubject = new Subject<ScanResult | null>();
  scanResults$ = this.scanResultSubject.asObservable().pipe(
    scan((acc: ScanResult[], curr: ScanResult | null) => {
      if (curr === null) return [];
      return [...acc, curr];
    }, []),
  );

  async ngOnInit(): Promise<void> {
    try {
      await BleClient.initialize({ androidNeverForLocation: true });
    } catch (error) {
      this.toastService.presentErrorToast(`Error initializing bluetooth: ${JSON.stringify(error)}`);
    }
  }

  async ngOnDestroy(): Promise<void> {
    await this.stopScanForBluetoothDevices();
  }

  async scanForBluetoothDevices(event: any): Promise<void> {
    try {
      const isEnabled = await BleClient.isEnabled();

      if (!isEnabled) {
        event.target.complete();
        this.toastService.presentErrorToast('Please enable bluetooth');
        return;
      }
      const stopScanAfterMilliSeconds = CONSTANTS.SCAN_DURATION;

      this.scanResultSubject.next(null);

      await BleClient.requestLEScan(
        {
          services: [CONSTANTS.UUID128_SVC_NORDIC_UART],
          scanMode: ScanMode.SCAN_MODE_LOW_LATENCY,
        },
        this.onBluetoothDeviceFound.bind(this),
      );

      this.scanInterval = setInterval(() => {
        this.scanProgress += 0.01;
      }, stopScanAfterMilliSeconds * 0.01);

      setTimeout(async () => {
        event.target.complete();
        this.stopScanForBluetoothDevices();
      }, stopScanAfterMilliSeconds);
    } catch (error) {
      console.error(error);
      this.toastService.presentErrorToast(`Error scanning for devices: ${error}`);
      this.stopScanForBluetoothDevices();
    }
  }

  async stopScanForBluetoothDevices(): Promise<void> {
    await BleClient.stopLEScan();
    this.scanRefresher().complete();
    this.scanProgress = 0;
    clearInterval(this.scanInterval);
  }

  onBluetoothDeviceFound(result: ScanResult): void {
    // this.ngZone.run(() => {
    this.scanResultSubject.next(result);
    // });
  }

  getRssiIcon(rssi: number): string {
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
