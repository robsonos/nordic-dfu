import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingController = inject(LoadingController);

  loading!: HTMLIonLoadingElement | null;

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
