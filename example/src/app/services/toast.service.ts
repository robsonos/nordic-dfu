/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async presentToast(message: string, color = 'primary', header = ''): Promise<void> {
    const toast = await this.toastController.create({
      header,
      message,
      color,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  async presentSuccessToast(message: string): Promise<void> {
    await this.presentToast(message, 'success', 'Success');
  }

  async presentErrorToast(message: string): Promise<void> {
    await this.presentToast(message, 'danger', 'Error');
  }

  async presentInfoToast(message: string): Promise<void> {
    await this.presentToast(message, 'warning', '');
  }
}
