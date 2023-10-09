import type { PluginResultError } from '@capacitor/core';
import { WebPlugin } from '@capacitor/core';

import type { IDfuUpdateOptions, NordicDfuPlugin } from './definitions';

export class NordicDfuWeb extends WebPlugin implements NordicDfuPlugin {
  startDFU(_dfuUpdateOptions: IDfuUpdateOptions): Promise<void | PluginResultError> {
    throw this.unavailable('Method not available in this browser.');
  }
}
