import type { PluginResultError } from '@capacitor/core';

export interface IDfuUpdate {
  percent?: number;
  currentPart?: number;
  partsTotal?: number;
  avgSpeed?: number;
  speed?: number;
  state?: string;
}

export interface IDfuUpdateOptions {
  deviceAddress: string;
  deviceName?: string;
  filePath: string | null;
  alternativeAdvertisingNameEnabled?: boolean;
  packetReceiptNotificationParameter?: number;
  retries?: number;
  maxMtu?: number;
}

export interface NordicDfuPlugin {
  startDFU(dfuUpdateOptions: IDfuUpdateOptions): Promise<void | PluginResultError>;
}

export interface DFUEmitter {
  addListener(name: 'DFUProgress' | 'DFUStateChanged', handler: (update: IDfuUpdate) => void): void;
  removeAllListeners(name: 'DFUProgress' | 'DFUStateChanged'): void;
}
