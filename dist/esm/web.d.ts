import { WebPlugin, type PluginResultError, type ListenerCallback, type PluginListenerHandle } from '@capacitor/core';
import type { DfuUpdateOptions, NordicDfuPlugin, PermissionStatus } from './definitions';
export declare class NordicDfuWeb extends WebPlugin implements NordicDfuPlugin {
    removeAllListeners(): Promise<void>;
    startDFU(_dfuUpdateOptions: DfuUpdateOptions): Promise<void | PluginResultError>;
    checkPermissions(): Promise<PermissionStatus>;
    requestPermissions(): Promise<PermissionStatus>;
    addListener(_eventName: string, _listenerFunc: ListenerCallback): Promise<PluginListenerHandle> & PluginListenerHandle;
}
