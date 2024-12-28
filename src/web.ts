/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebPlugin, type PluginResultError, type ListenerCallback, type PluginListenerHandle } from '@capacitor/core';

import type { DfuUpdateOptions, NordicDfuPlugin, PermissionStatus } from './definitions';

export class NordicDfuWeb extends WebPlugin implements NordicDfuPlugin {
  removeAllListeners(): Promise<void> {
    throw this.unavailable('Method not available in this browser.');
  }
  startDFU(_dfuUpdateOptions: DfuUpdateOptions): Promise<void | PluginResultError> {
    throw this.unavailable('Method not available in this browser.');
  }
  checkPermissions(): Promise<PermissionStatus> {
    throw this.unavailable('Method not available in this browser.');
  }
  requestPermissions(): Promise<PermissionStatus> {
    throw this.unavailable('Method not available in this browser.');
  }
  addListener(
    _eventName: string,
    _listenerFunc: ListenerCallback,
  ): Promise<PluginListenerHandle> & PluginListenerHandle {
    throw this.unavailable('Method not available in this browser.');
  }
}
