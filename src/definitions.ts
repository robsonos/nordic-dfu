import type { PluginListenerHandle, PluginResultError } from '@capacitor/core';

/**
 * The update object that is passed to the DFUProgress event
 */
export interface IDfuUpdate {
  percent?: number;
  currentPart?: number;
  partsTotal?: number;
  avgSpeed?: number;
  speed?: number;
  state?: string;
}

/**
 * The options for the DFU process
 */
export interface IDfuUpdateOptions {
  deviceAddress: string;
  deviceName?: string;
  filePath: string | null;
  alternativeAdvertisingNameEnabled?: boolean;
  packetReceiptNotificationParameter?: number;
  retries?: number;
  maxMtu?: number;
}

/**
 * The plugin definition for the Nordic DFU plugin
 */
export interface NordicDfuPlugin {
  /**
   *  Starts the DFU process
   *
   * @param dfuUpdateOptions The options for the DFU process
   * @returns A promise that resolves when the DFU process is complete or rejects with PluginResultError
   * @example startDFU({ deviceAddress: '00:00:00:00:00:00', filePath: 'path/to/file.zip' })
   *
   */
  startDFU(dfuUpdateOptions: IDfuUpdateOptions): Promise<void | PluginResultError>;

  /**
   * Listen for when the DFU state changes
   *
   * @param eventName The name of the event to listen for
   * @param handler The handler function that will be called when the event is fired
   * @returns A promise that resolves with a PluginListenerHandle that can be used to remove the listener
   * @example addListener('DFUStateChanged', (update) => { console.log(update) })
   *
   */
  addListener(
    eventName: 'DFUStateChanged',
    handler: (update: IDfuUpdate) => void
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  /**
   * Removes all listeners for the DFUProgress event
   *
   * @returns A promise that resolves when all listeners are removed
   * @example removeAllListeners()
   */
  removeAllListeners(): Promise<void>;
}
