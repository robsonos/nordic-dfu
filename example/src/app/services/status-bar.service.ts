import { Injectable } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';

@Injectable({
  providedIn: 'root',
})
export class StatusBarService {
  async setStatusBarStyleDark() {
    await StatusBar.setStyle({ style: Style.Dark });
  }

  async setStatusBarStyleLight() {
    await StatusBar.setStyle({ style: Style.Light });
  }

  async hideStatusBar() {
    await StatusBar.hide();
  }

  async showStatusBar() {
    await StatusBar.show();
  }
}
