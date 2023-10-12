import type { PluginListenerHandle, PluginResultError } from '@capacitor/core';

/**
 * The DFU state that is passed to the DfuUpdate
 */
export enum DfuState {
  DEVICE_CONNECTING = 'DEVICE_CONNECTING',
  DEVICE_CONNECTED = 'DEVICE_CONNECTED',
  DFU_PROCESS_STARTING = 'DFU_PROCESS_STARTING',
  DFU_PROCESS_STARTED = 'DFU_PROCESS_STARTED',
  ENABLING_DFU_MODE = 'ENABLING_DFU_MODE',
  DFU_PROGRESS = 'DFU_PROGRESS',
  VALIDATING_FIRMWARE = 'VALIDATING_FIRMWARE',
  DEVICE_DISCONNECTING = 'DEVICE_DISCONNECTING',
  DEVICE_DISCONNECTED = 'DEVICE_DISCONNECTED',
  DFU_COMPLETED = 'DFU_COMPLETED',
  DFU_ABORTED = 'DFU_ABORTED',
  DFU_FAILED = 'DFU_FAILED',
}

/**
 * The DFU data that is passed to the DfuUpdate object
 */
export interface DfuUpdateData {
  deviceAddress: string;
  percent?: number;
  speed?: number;
  avgSpeed?: number;
  currentPart?: number;
  partsTotal?: number;
}

/**
 * The DFU update object that is passed to the DFUStateChanged event
 */
export interface DfuUpdate {
  state: DfuState;
  data: DfuUpdateData;
}

export interface DfuOptions {
  /**
   * Sets whether the progress notification in the status bar should be disabled.
   *
   * Defaults to false.
   */
  disableNotification?: boolean;

  /**
   * Sets whether the progress notification in the status bar should be disabled.
   *
   * Defaults to false.
   */
  startAsForegroundService?: boolean;

  /**
   * Sets whether the bond information should be preserver after flashing new application.
   *
   * Defaults to false.
   */
  keepBond?: boolean;

  /**
   * Sets whether a new bond should be created after the DFU is complete. The old bond
   * information will be removed before.
   *
   * Defaults to false.
   */
  restoreBond?: boolean;

  /**
   * Sets the initial delay (in milliseconds) that the service will wait before sending each data object.
   *
   * Defaults to 0.
   */
  dataObjectDelay?: number;

  /**
   * Enables or disables the Packet Receipt Notification (PRN) procedure.
   *
   * By default the PRNs are disabled on devices with Android Marshmallow or newer and enabled on
   * older ones.
   */
  packetReceiptNotificationsEnabled?: boolean;

  /**
   * If Packet Receipt Notification procedure is enabled, this method sets the number of packets to be sent before
   * receiving a PRN.
   *
   * Defaults to 12.
   */
  packetsReceiptNotificationsValue?: number;

  /**
   * Setting force DFU to true will prevent from jumping to the DFU Bootloader
   * mode in case there is no DFU Version characteristic (Legacy DFU only!).
   * Use this if the DFU operation can be handled by your device running in the application mode.
   * This method is ignored in Secure DFU.
   *
   * Defaults to false.
   */
  forceDfu?: boolean;

  /**
   * Sets the time (in milliseconds) required by the device to reboot. The library will wait for this time before
   * scanning for the device in bootloader mode.
   *
   * Defaults to 0 ms.
   */
  rebootTime?: number;

  /**
   * Sets the scan duration (in milliseconds) when scanning for DFU Bootloader.
   *
   * Defaults to 5000.
   */
  scanTimeout?: number;

  /**
   * When this is set to true, the Legacy Buttonless Service will scan for the device advertising
   * with an incremented MAC address, instead of trying to reconnect to the same device.
   *
   * Defaults to false.
   */
  forceScanningForNewAddressInLegacyDfu?: boolean;

  /**
   * Sets the number of retries that the DFU service will use to complete DFU.
   * Defaults to 0.
   */
  numberOfRetries?: number;

  /**
   * Sets the Maximum Transfer Unit (MTU) value that the Secure DFU service will try to request
   * before performing DFU.
   *
   * By default, value 517 will be used, which is the highest supported y Android. However, as the
   * highest supported MTU by the Secure DFU from SDK 15 (first which supports higher MTU) is 247,
   * the sides will agree on using MTU = 247 instead if the phone supports it (Lollipop or newer device).
   */
  mtu?: number;

  /**
   * Sets the current MTU value. This method should be used only if the device is already
   * connected and MTU has been requested before DFU service is started.
   *
   * Defaults to 23.
   */
  currentMtu?: number;

  /**
   * This method allows to narrow the update to selected parts from the ZIP, for example
   * to allow only application update from a ZIP file that has SD+BL+App. System components scope
   * include the Softdevice and/or the Bootloader (they can't be separated as they are packed in
   * a single bin file and the library does not know whether it contains only the softdevice,
   * the bootloader or both) Application scope includes the application only.
   *
   *
   */
  scope?: number; // TODO: scope enum and more info

  /**
   * This method sets the size of an MBR (Master Boot Record). It should be used only
   * when updating a file from a HEX file. If you use BIN or ZIP, value set here will
   * be ignored.
   *
   * Defaults to 4096 (0x1000) bytes.
   */
  mbrSize?: number;

  /**
   * Set this flag to true to enable experimental buttonless feature in Secure DFU. When the
   * experimental Buttonless DFU Service is found on a device, the service will use it to
   * switch the device to the bootloader mode, connect to it in that mode and proceed with DFU.
   *
   * Defaults to false.
   */
  unsafeExperimentalButtonlessServiceInSecureDfuEnabled?: boolean;
  // customUuidsForLegacyDfu // TODO: figure out how to do this
  // customUuidsForSecureDfu // TODO: figure out how to do this
  // customUuidsForExperimentalButtonlessDfu // TODO: figure out how to do this
  // customUuidsForButtonlessDfuWithBondSharing // TODO: figure out how to do this
  // customUuidsForButtonlessDfuWithoutBondSharing // TODO: figure out how to do this
}

/**
 * The options for the DFU process
 */
export interface DfuUpdateOptions {
  deviceAddress: string;
  deviceName?: string;
  filePath: string | null;
  dfuOptions?: DfuOptions;
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
  startDFU(dfuUpdateOptions: DfuUpdateOptions): Promise<void | PluginResultError>;

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
    handler: (update: DfuUpdate) => void
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  /**
   * Removes all listeners for the DFUStateChanged event
   *
   * @returns A promise that resolves when all listeners are removed
   * @example removeAllListeners()
   */
  removeAllListeners(): Promise<void>;
}
