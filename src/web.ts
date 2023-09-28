import { WebPlugin } from '@capacitor/core';

import type { NordicDfuPlugin } from './definitions';

export class NordicDfuWeb extends WebPlugin implements NordicDfuPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
