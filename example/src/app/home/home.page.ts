import { Component } from '@angular/core';
import { NordicDfu } from '@capacitor-community/nordic-dfu';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomePage {
  public echoResult = '';

  async testDfu(): Promise<void> {
    try {
      const result = await NordicDfu.echo({ value: 'Test Value' });
      this.echoResult = 'Echoed Value: ' + result.value;
    } catch (e: any) {
      console.warn('DFU Test failed', e);
      this.echoResult = `Error: ${e.message}`;
    }
  }
}
