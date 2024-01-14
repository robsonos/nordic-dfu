import type { PluginListenerHandle, PluginResultError, PermissionState } from '@capacitor/core';

/**
 * Represents the current status of permissions in the plugin.
 *
 * @since 1.0.0
 */
export interface PermissionStatus {
  /**
   * Indicates the permission state of notifications.
   *
   * @since 1.0.0
   */
  notifications: PermissionState;
}

/**
 * Enumerates the various states in the DFU process. This helps in tracking the progress and status of the
 * firmware update.
 *
 * @since 1.0.0
 */
export enum DfuState {
  /**
   * The device is currently connecting.
   *
   * @since 1.0.0
   */
  DEVICE_CONNECTING = 'DEVICE_CONNECTING',

  /**
   * The device has successfully connected. **Available for Android only.**
   *
   * @since 1.0.0
   */
  DEVICE_CONNECTED = 'DEVICE_CONNECTED',

  /**
   * The DFU process is about to start.
   *
   * @since 1.0.0
   */
  DFU_PROCESS_STARTING = 'DFU_PROCESS_STARTING',

  /**
   * The DFU process has started. **Available for Android only.**
   *
   * @since 1.0.0
   */
  DFU_PROCESS_STARTED = 'DFU_PROCESS_STARTED',

  /**
   * The device is enabling DFU mode.
   *
   * @since 1.0.0
   */
  ENABLING_DFU_MODE = 'ENABLING_DFU_MODE',

  /**
   * The DFU process is in progress.
   *
   * @since 1.0.0
   */
  DFU_PROGRESS = 'DFU_PROGRESS',

  /**
   * The firmware is currently being validated.
   *
   * @since 1.0.0
   */
  VALIDATING_FIRMWARE = 'VALIDATING_FIRMWARE',

  /**
   * The device is disconnecting.
   *
   * @since 1.0.0
   */
  DEVICE_DISCONNECTING = 'DEVICE_DISCONNECTING',

  /**
   * The device has disconnected. **Available for Android only.**
   *
   * @since 1.0.0
   */
  DEVICE_DISCONNECTED = 'DEVICE_DISCONNECTED',

  /**
   * The DFU process has completed successfully.
   *
   * @since 1.0.0
   */
  DFU_COMPLETED = 'DFU_COMPLETED',

  /**
   * The DFU process has been aborted.
   *
   * @since 1.0.0
   */
  DFU_ABORTED = 'DFU_ABORTED',

  /**
   * The DFU process has failed.
   *
   * @since 1.0.0
   */
  DFU_FAILED = 'DFU_FAILED',
}

/**
 * Contains data related to the DFU update process, such as progress and speed.
 *
 * @since 1.0.0
 */
export interface DfuUpdateData {
  /**
   * The current status of upload (0-99).
   *
   * @since 1.0.0
   */
  percent?: number;

  /**
   * The current speed in bytes per millisecond.
   *
   * @since 1.0.0
   */
  speed?: number;

  /**
   * The average speed in bytes per millisecond.
   *
   * @since 1.0.0
   */
  avgSpeed?: number;

  /**
   * The number of parts being sent. In case the ZIP file contains a Soft Device and/or a Bootloader together
   * with the application the SD+BL are sent as part 1, then the service starts again and send the application
   * as part 2.
   *
   * @since 1.0.0
   */
  currentPart?: number;

  /**
   * The total number of parts.
   *
   * @since 1.0.0
   */
  partsTotal?: number;

  /**
   * The total time elapsed since the start of the DFU process in milliseconds
   *
   * @since 1.1.0
   */
  duration?: number;

  /**
   * The estimated remaining time to the end of the DFU process in milliseconds
   *
   * @since 1.1.0
   */
  remainingTime?: number;
}

/**
 * The DFU update object that is passed to the DFUStateChanged event
 *
 * @since 1.0.0
 */
export interface DfuUpdate {
  /**
   * Defines the structure for the DFU update object passed to the DFUStateChanged event.
   *
   * @since 1.0.0
   */
  state: DfuState;

  /**
   * The DFU data that is passed to the DfuUpdate object
   *
   * @since 1.0.0
   */
  data: DfuUpdateData;
}

/**
 * Outlines additional options for configuring the DFU process.
 *
 * @since 1.0.0
 */
export interface DfuOptions {
  /**
   * Sets whether the progress notification in the status bar should be disabled.
   *
   * @default false
   * @since 1.0.0
   */
  disableNotification?: boolean;

  /**
   * Sets whether the progress notification in the status bar should be disabled.
   *
   * @default  false
   * @since 1.0.0
   */
  startAsForegroundService?: boolean;

  /**
   * Sets whether the bond information should be preserver after flashing new application.
   *
   * @default false
   * @since 1.0.0
   */
  keepBond?: boolean;

  /**
   * Sets whether a new bond should be created after the DFU is complete. The old bond
   * information will be removed before.
   *
   * @default false
   * @since 1.0.0
   */
  restoreBond?: boolean;

  /**
   * Sets the initial delay (in milliseconds) that the service will wait before sending each data object.
   *
   * @default 0
   * @since 1.0.0
   */
  dataObjectDelay?: number;

  /**
   * Enables or disables the Packet Receipt Notification (PRN) procedure.
   *
   * By default the PRNs are disabled on devices with Android Marshmallow or newer and enabled on
   * older ones.
   *
   * @since 1.0.0
   */
  packetReceiptNotificationsEnabled?: boolean;

  /**
   * If Packet Receipt Notification procedure is enabled, this method sets the number of packets to be sent before
   * receiving a PRN.
   *
   * @default 12
   * @since 1.0.0
   */
  packetsReceiptNotificationsValue?: number;

  /**
   * Setting force DFU to true will prevent from jumping to the DFU Bootloader
   * mode in case there is no DFU Version characteristic (Legacy DFU only!).
   * Use this if the DFU operation can be handled by your device running in the application mode.
   * This method is ignored in Secure DFU.
   *
   * @default false
   * @since 1.0.0
   */
  forceDfu?: boolean;

  /**
   * Sets the time (in milliseconds) required by the device to reboot. The library will wait for this time before
   * scanning for the device in bootloader mode.
   *
   * @default 0
   * @since 1.0.0
   */
  rebootTime?: number;

  /**
   * Sets the scan duration (in milliseconds) when scanning for DFU Bootloader.
   *
   * @default 5000
   * @since 1.0.0
   */
  scanTimeout?: number;

  /**
   * When this is set to true, the Legacy Buttonless Service will scan for the device advertising
   * with an incremented MAC address, instead of trying to reconnect to the same device.
   *
   * @default false
   * @since 1.0.0
   */
  forceScanningForNewAddressInLegacyDfu?: boolean;

  /**
   * This options allows to disable the resume feature in Secure DFU. When the extra value is set to true, the DFU will
   * send Init Packet and Data again, despite the firmware might have been send partially before. By default, without
   * setting this extra, or by setting it to false, the DFU will resume the previously cancelled upload if CRC values
   * match.
   *
   * @default false
   * @since 1.4.0
   */
  disableResume?: boolean;

  /**
   * Sets the number of retries that the DFU service will use to complete DFU.
   *
   * @default 0
   * @since 1.0.0
   */
  numberOfRetries?: number;

  /**
   * Sets the Maximum Transfer Unit (MTU) value that the Secure DFU service will try to request
   * before performing DFU. **Available for Android only.**
   *
   * By default, value 517 will be used, which is the highest supported y Android. However, as the
   * highest supported MTU by the Secure DFU from SDK 15 (first which supports higher MTU) is 247,
   * the sides will agree on using MTU = 247 instead if the phone supports it (Lollipop or newer device).
   *
   * @since 1.0.0
   */
  mtu?: number;

  /**
   * Sets the current MTU value. This method should be used only if the device is already
   * connected and MTU has been requested before DFU service is started. **Available for Android only.**
   *
   * @default 23
   * @since 1.0.0
   */
  currentMtu?: number;

  /**
   * Disables MTU request. **Available for Android only.**
   *
   * @default false
   * @since 1.4.0
   */
  disableMtuRequest?: boolean;

  /**
   * This method allows to narrow the update to selected parts from the ZIP, for example
   * to allow only application update from a ZIP file that has SD+BL+App. System components scope
   * include the Softdevice and/or the Bootloader (they can't be separated as they are packed in
   * a single bin file and the library does not know whether it contains only the softdevice,
   * the bootloader or both) Application scope includes the application only.
   *
   * @since 1.0.0
   */
  scope?: number;

  /**
   * This method sets the size of an MBR (Master Boot Record). It should be used only
   * when updating a file from a HEX file. If you use BIN or ZIP, value set here will
   * be ignored.
   *
   * @default 4096
   * @since 1.0.0
   */
  mbrSize?: number;

  /**
   * Set this flag to true to enable experimental buttonless feature in Secure DFU. When the
   * experimental Buttonless DFU Service is found on a device, the service will use it to
   * switch the device to the bootloader mode, connect to it in that mode and proceed with DFU.
   *
   * @default false
   * @since 1.0.0
   */
  unsafeExperimentalButtonlessServiceInSecureDfuEnabled?: boolean;
}

/**
 * Specifies the options required for initiating the DFU process.
 *
 * @since 1.0.0
 */
export interface DfuUpdateOptions {
  /**
   * The target device address.
   * On **Android** this is the BLE MAC address.
   * On **iOS** and **web** it is a randomly generated UUID identifier.
   *
   * @since 1.0.0
   */
  deviceAddress: string;

  /**
   * The name of the device
   *
   * @since 1.0.0
   */
  deviceName?: string;

  /**
   * The path to the firmware file
   *
   * @since 1.0.0
   */
  filePath: string;

  /**
   * The additional options for the DFU process
   *
   * @since 1.0.0
   */
  dfuOptions?: DfuOptions;
}

/**
 * Defines the plugin for handling Nordic DFU processes.
 * Includes methods to start the DFU process, check permissions, and manage event listeners.
 *
 * @since 1.0.0
 */
export interface NordicDfuPlugin {
  /**
   * Initiates the DFU process with the specified options.
   *
   * @param dfuUpdateOptions Options for the DFU process.
   * @returns A promise that resolves on successful completion of the DFU process or rejects with a PluginResultError.
   * @example
   * const dfuOptions: DfuOptions = {
   *   mtu: 23,
   *   currentMtu: 23,
   *   packetReceiptNotificationsEnabled: false,
   * };
   *
   * const dfuUpdateOptions: DfuUpdateOptions = {
   *   deviceAddress: this.device.deviceId,
   *   deviceName: this.device.name,
   *   filePath: this.file.path,
   *   dfuOptions: dfuOptions,
   * };
   *
   * NordicDfu.startDFU(dfuUpdateOptions).then(
   *   () => console.log,
   *   (error: PluginResultError) => console.error
   * );
   * @since 1.0.0
   */
  startDFU(dfuUpdateOptions: DfuUpdateOptions): Promise<void | PluginResultError>;

  /**
   * Check status of permissions needed by the plugin
   *
   * @example
   * const request = await NordicDfu.checkPermissions();
   * console.log(request)
   * @since 1.0.0
   */
  checkPermissions(): Promise<PermissionStatus>;

  /**
   * Request permissions needed by the plugin
   *
   * @example
   * const request = await NordicDfu.requestPermissions();
   * console.log(request)
   * @since 1.0.0
   */
  requestPermissions(): Promise<PermissionStatus>;

  /**
   * Listen for when the DFU state changes
   *
   * @param eventName The name of the event to listen for
   * @param handler The handler function that will be called when the event is fired
   * @returns A promise that resolves with a PluginListenerHandle that can be used to remove the listener
   * @example
   * NordicDfu.addListener('DFUStateChanged', async (update: DfuUpdate) => {
   *   console.log(`DFU: state: ${update.state}, data: ${JSON.stringify(update.data)}`);
   * }
   * @since 1.0.0
   */
  addListener(
    eventName: 'DFUStateChanged',
    handler: (update: DfuUpdate) => void
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  /**
   * Removes all listeners for the DFUStateChanged event
   *
   * @returns A promise that resolves when all listeners are removed
   * @example
   * NordicDfu.removeAllListeners();
   * @since 1.0.0
   */
  removeAllListeners(): Promise<void>;
}
