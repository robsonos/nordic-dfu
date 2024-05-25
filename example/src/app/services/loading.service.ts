/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loading!: HTMLIonLoadingElement | null;

  constructor(private loadingController: LoadingController) {}

  async presentLoading(message: string): Promise<void> {
    this.loading = await this.loadingController.create({
      message,
    });
    await this.loading.present();
  }

  async dismissLoading(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
