/* eslint-disable @typescript-eslint/consistent-type-imports */
import { WebPlugin, type PluginResultError, ListenerCallback, PluginListenerHandle } from '@capacitor/core';

import type { DfuUpdateOptions, NordicDfuPlugin } from './definitions';

export class NordicDfuWeb extends WebPlugin implements NordicDfuPlugin {
  startDFU(_dfuUpdateOptions: DfuUpdateOptions): Promise<void | PluginResultError> {
    throw this.unavailable('Method not available in this browser.');
  }
  addListener(
    _eventName: string,
    _listenerFunc: ListenerCallback
  ): Promise<PluginListenerHandle> & PluginListenerHandle {
    throw this.unavailable('Method not available in this browser.');
  }
}
