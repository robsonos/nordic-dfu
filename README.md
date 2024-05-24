<p align="center"><br><img src="https://user-images.githubusercontent.com/236501/85893648-1c92e880-b7a8-11ea-926d-95355b8175c7.png" width="128" height="128" /></p>
<h3 align="center">Nordic DFU</h3>
<p align="center"><strong><code>capacitor-community-nordic-dfu</code></strong></p>
<p align="center">
  Capacitor plugin to interface with Nordic DFU's <a href="https://github.com/NordicSemiconductor/IOS-DFU-Library">IOS-DFU-Library</a> and <a href="https://github.com/NordicSemiconductor/Android-DFU-Library">Android-DFU-Library</a>.
</p>

<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2024?style=flat-square" />
  <a href="https://github.com/robsonos/nordic-dfu/actions/workflows/ci.yaml"
    ><img
      alt="GitHub Workflow Status (with event)"
      src="https://img.shields.io/github/actions/workflow/status/robsonos/nordic-dfu/ci.yaml"
  /></a>
  <a href="https://www.npmjs.com/package/capacitor-community-nordic-dfu"
    ><img src="https://img.shields.io/npm/l/capacitor-community-nordic-dfu?style=flat-square"
  /></a>
  <br />
  <a href="https://www.npmjs.com/package/capacitor-community-nordic-dfu"
    ><img
      alt="Downloads from npmjs"
      src="https://img.shields.io/npm/dw/capacitor-community-nordic-dfu?style=flat-square"
  /></a>
  <a href="https://www.npmjs.com/package/capacitor-community-nordic-dfu"
    ><img alt="Version from npmjs" src="https://img.shields.io/npm/v/capacitor-community-nordic-dfu?style=flat-square"
  /></a>
  <a href="#contributors"
    ><img
      alt="GitHub contributors from allcontributors.org"
      src="https://img.shields.io/github/all-contributors/robsonos/nordic-dfu"
  /></a>
</p>

## Table of Contents

- [Maintainers](#maintainers)
- [Installation](#installation)
- [Permissions](#permissions)
- [API](#api)
- [Contributors](#contributors)

## Maintainers

| Maintainer | GitHub                                  | Active |
| ---------- | --------------------------------------- | ------ |
| robsonos   | [robsonos](https://github.com/robsonos) | yes    |

## Installation

```bash
npm install capacitor-community-nordic-dfu
npx cap sync
```

## Permissions

Please check the sample permissions in [Android](./example/android/app/src/main/AndroidManifest.xml) and [iOS](./example/ios/App/App/Info.plist) folders.

## API

<docgen-index>

* [`startDFU(...)`](#startdfu)
* [`checkPermissions()`](#checkpermissions)
* [`requestPermissions()`](#requestpermissions)
* [`addListener('DFUStateChanged', ...)`](#addlistenerdfustatechanged)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

Defines the plugin for handling Nordic DFU processes.
Includes methods to start the DFU process, check permissions, and manage event listeners.

### startDFU(...)

```typescript
startDFU(dfuUpdateOptions: DfuUpdateOptions) => Promise<void | PluginResultError>
```

Initiates the DFU process with the specified options.

| Param                  | Type                                                          | Description                  |
| ---------------------- | ------------------------------------------------------------- | ---------------------------- |
| **`dfuUpdateOptions`** | <code><a href="#dfuupdateoptions">DfuUpdateOptions</a></code> | Options for the DFU process. |

**Returns:** <code>Promise&lt;void | <a href="#pluginresulterror">PluginResultError</a>&gt;</code>

**Since:** 1.0.0

--------------------


### checkPermissions()

```typescript
checkPermissions() => Promise<PermissionStatus>
```

Check status of permissions needed by the plugin

**Returns:** <code>Promise&lt;<a href="#permissionstatus">PermissionStatus</a>&gt;</code>

**Since:** 1.0.0

--------------------


### requestPermissions()

```typescript
requestPermissions() => Promise<PermissionStatus>
```

Request permissions needed by the plugin

**Returns:** <code>Promise&lt;<a href="#permissionstatus">PermissionStatus</a>&gt;</code>

**Since:** 1.0.0

--------------------


### addListener('DFUStateChanged', ...)

```typescript
addListener(eventName: 'DFUStateChanged', handler: (update: DfuUpdate) => void) => Promise<PluginListenerHandle> & PluginListenerHandle
```

Listen for when the DFU state changes

| Param           | Type                                                                 | Description                                                      |
| --------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **`eventName`** | <code>'DFUStateChanged'</code>                                       | The name of the event to listen for                              |
| **`handler`**   | <code>(update: <a href="#dfuupdate">DfuUpdate</a>) =&gt; void</code> | The handler function that will be called when the event is fired |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

**Since:** 1.0.0

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Removes all listeners for the DFUStateChanged event

**Since:** 1.0.0

--------------------


### Interfaces


#### PluginResultError

| Prop          | Type                |
| ------------- | ------------------- |
| **`message`** | <code>string</code> |


#### DfuUpdateOptions

Specifies the options required for initiating the DFU process.

| Prop                | Type                                              | Description                                                                                                                               | Since |
| ------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **`deviceAddress`** | <code>string</code>                               | The target device address. On **Android** this is the BLE MAC address. On **iOS** and **web** it is a randomly generated UUID identifier. | 1.0.0 |
| **`deviceName`**    | <code>string</code>                               | The name of the device                                                                                                                    | 1.0.0 |
| **`filePath`**      | <code>string</code>                               | The path to the firmware file                                                                                                             | 1.0.0 |
| **`dfuOptions`**    | <code><a href="#dfuoptions">DfuOptions</a></code> | The additional options for the DFU process                                                                                                | 1.0.0 |


#### DfuOptions

Outlines additional options for configuring the DFU process.

| Prop                                                        | Type                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                        | Default            | Since |
| ----------------------------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----- |
| **`disableNotification`**                                   | <code>boolean</code> | Sets whether the progress notification in the status bar should be disabled.                                                                                                                                                                                                                                                                                                                                                                       | <code>false</code> | 1.0.0 |
| **`startAsForegroundService`**                              | <code>boolean</code> | Sets whether the progress notification in the status bar should be disabled.                                                                                                                                                                                                                                                                                                                                                                       | <code>false</code> | 1.0.0 |
| **`keepBond`**                                              | <code>boolean</code> | Sets whether the bond information should be preserver after flashing new application.                                                                                                                                                                                                                                                                                                                                                              | <code>false</code> | 1.0.0 |
| **`restoreBond`**                                           | <code>boolean</code> | Sets whether a new bond should be created after the DFU is complete. The old bond information will be removed before.                                                                                                                                                                                                                                                                                                                              | <code>false</code> | 1.0.0 |
| **`dataObjectDelay`**                                       | <code>number</code>  | Sets the initial delay (in milliseconds) that the service will wait before sending each data object.                                                                                                                                                                                                                                                                                                                                               | <code>0</code>     | 1.0.0 |
| **`packetReceiptNotificationsEnabled`**                     | <code>boolean</code> | Enables or disables the Packet Receipt Notification (PRN) procedure. By default the PRNs are disabled on devices with Android Marshmallow or newer and enabled on older ones.                                                                                                                                                                                                                                                                      |                    | 1.0.0 |
| **`packetsReceiptNotificationsValue`**                      | <code>number</code>  | If Packet Receipt Notification procedure is enabled, this method sets the number of packets to be sent before receiving a PRN.                                                                                                                                                                                                                                                                                                                     | <code>12</code>    | 1.0.0 |
| **`forceDfu`**                                              | <code>boolean</code> | Setting force DFU to true will prevent from jumping to the DFU Bootloader mode in case there is no DFU Version characteristic (Legacy DFU only!). Use this if the DFU operation can be handled by your device running in the application mode. This method is ignored in Secure DFU.                                                                                                                                                               | <code>false</code> | 1.0.0 |
| **`rebootTime`**                                            | <code>number</code>  | Sets the time (in milliseconds) required by the device to reboot. The library will wait for this time before scanning for the device in bootloader mode.                                                                                                                                                                                                                                                                                           | <code>0</code>     | 1.0.0 |
| **`scanTimeout`**                                           | <code>number</code>  | Sets the scan duration (in milliseconds) when scanning for DFU Bootloader.                                                                                                                                                                                                                                                                                                                                                                         | <code>5000</code>  | 1.0.0 |
| **`forceScanningForNewAddressInLegacyDfu`**                 | <code>boolean</code> | When this is set to true, the Legacy Buttonless Service will scan for the device advertising with an incremented MAC address, instead of trying to reconnect to the same device.                                                                                                                                                                                                                                                                   | <code>false</code> | 1.0.0 |
| **`disableResume`**                                         | <code>boolean</code> | This options allows to disable the resume feature in Secure DFU. When the extra value is set to true, the DFU will send Init Packet and Data again, despite the firmware might have been send partially before. By default, without setting this extra, or by setting it to false, the DFU will resume the previously cancelled upload if CRC values match.                                                                                        | <code>false</code> | 1.4.0 |
| **`numberOfRetries`**                                       | <code>number</code>  | Sets the number of retries that the DFU service will use to complete DFU.                                                                                                                                                                                                                                                                                                                                                                          | <code>0</code>     | 1.0.0 |
| **`mtu`**                                                   | <code>number</code>  | Sets the Maximum Transfer Unit (MTU) value that the Secure DFU service will try to request before performing DFU. **Available for Android only.** By default, value 517 will be used, which is the highest supported y Android. However, as the highest supported MTU by the Secure DFU from SDK 15 (first which supports higher MTU) is 247, the sides will agree on using MTU = 247 instead if the phone supports it (Lollipop or newer device). |                    | 1.0.0 |
| **`currentMtu`**                                            | <code>number</code>  | Sets the current MTU value. This method should be used only if the device is already connected and MTU has been requested before DFU service is started. **Available for Android only.**                                                                                                                                                                                                                                                           | <code>23</code>    | 1.0.0 |
| **`disableMtuRequest`**                                     | <code>boolean</code> | Disables MTU request. **Available for Android only.**                                                                                                                                                                                                                                                                                                                                                                                              | <code>false</code> | 1.4.0 |
| **`scope`**                                                 | <code>number</code>  | This method allows to narrow the update to selected parts from the ZIP, for example to allow only application update from a ZIP file that has SD+BL+App. System components scope include the Softdevice and/or the Bootloader (they can't be separated as they are packed in a single bin file and the library does not know whether it contains only the softdevice, the bootloader or both) Application scope includes the application only.     |                    | 1.0.0 |
| **`mbrSize`**                                               | <code>number</code>  | This method sets the size of an MBR (Master Boot Record). It should be used only when updating a file from a HEX file. If you use BIN or ZIP, value set here will be ignored.                                                                                                                                                                                                                                                                      | <code>4096</code>  | 1.0.0 |
| **`unsafeExperimentalButtonlessServiceInSecureDfuEnabled`** | <code>boolean</code> | Set this flag to true to enable experimental buttonless feature in Secure DFU. When the experimental Buttonless DFU Service is found on a device, the service will use it to switch the device to the bootloader mode, connect to it in that mode and proceed with DFU.                                                                                                                                                                            | <code>false</code> | 1.0.0 |


#### PermissionStatus

Represents the current status of permissions in the plugin.

| Prop                | Type                                                        | Description                                      | Since |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------ | ----- |
| **`notifications`** | <code><a href="#permissionstate">PermissionState</a></code> | Indicates the permission state of notifications. | 1.0.0 |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### DfuUpdate

The DFU update object that is passed to the DFUStateChanged event

| Prop        | Type                                                    | Description                                                                          | Since |
| ----------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----- |
| **`state`** | <code><a href="#dfustate">DfuState</a></code>           | Defines the structure for the DFU update object passed to the DFUStateChanged event. | 1.0.0 |
| **`data`**  | <code><a href="#dfuupdatedata">DfuUpdateData</a></code> | The DFU data that is passed to the <a href="#dfuupdate">DfuUpdate</a> object         | 1.0.0 |


#### DfuUpdateData

Contains data related to the DFU update process, such as progress and speed.

| Prop                | Type                | Description                                                                                                                                                                                                                   | Since |
| ------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **`percent`**       | <code>number</code> | The current status of upload (0-99).                                                                                                                                                                                          | 1.0.0 |
| **`speed`**         | <code>number</code> | The current speed in bytes per millisecond.                                                                                                                                                                                   | 1.0.0 |
| **`avgSpeed`**      | <code>number</code> | The average speed in bytes per millisecond.                                                                                                                                                                                   | 1.0.0 |
| **`currentPart`**   | <code>number</code> | The number of parts being sent. In case the ZIP file contains a Soft Device and/or a Bootloader together with the application the SD+BL are sent as part 1, then the service starts again and send the application as part 2. | 1.0.0 |
| **`partsTotal`**    | <code>number</code> | The total number of parts.                                                                                                                                                                                                    | 1.0.0 |
| **`duration`**      | <code>number</code> | The total time elapsed since the start of the DFU process in milliseconds                                                                                                                                                     | 1.1.0 |
| **`remainingTime`** | <code>number</code> | The estimated remaining time to the end of the DFU process in milliseconds                                                                                                                                                    | 1.1.0 |


### Type Aliases


#### PermissionState

<code>'prompt' | 'prompt-with-rationale' | 'granted' | 'denied'</code>


### Enums


#### DfuState

| Members                    | Value                               | Description                                                            | Since |
| -------------------------- | ----------------------------------- | ---------------------------------------------------------------------- | ----- |
| **`DEVICE_CONNECTING`**    | <code>'DEVICE_CONNECTING'</code>    | The device is currently connecting.                                    | 1.0.0 |
| **`DEVICE_CONNECTED`**     | <code>'DEVICE_CONNECTED'</code>     | The device has successfully connected. **Available for Android only.** | 1.0.0 |
| **`DFU_PROCESS_STARTING`** | <code>'DFU_PROCESS_STARTING'</code> | The DFU process is about to start.                                     | 1.0.0 |
| **`DFU_PROCESS_STARTED`**  | <code>'DFU_PROCESS_STARTED'</code>  | The DFU process has started. **Available for Android only.**           | 1.0.0 |
| **`ENABLING_DFU_MODE`**    | <code>'ENABLING_DFU_MODE'</code>    | The device is enabling DFU mode.                                       | 1.0.0 |
| **`DFU_PROGRESS`**         | <code>'DFU_PROGRESS'</code>         | The DFU process is in progress.                                        | 1.0.0 |
| **`VALIDATING_FIRMWARE`**  | <code>'VALIDATING_FIRMWARE'</code>  | The firmware is currently being validated.                             | 1.0.0 |
| **`DEVICE_DISCONNECTING`** | <code>'DEVICE_DISCONNECTING'</code> | The device is disconnecting.                                           | 1.0.0 |
| **`DEVICE_DISCONNECTED`**  | <code>'DEVICE_DISCONNECTED'</code>  | The device has disconnected. **Available for Android only.**           | 1.0.0 |
| **`DFU_COMPLETED`**        | <code>'DFU_COMPLETED'</code>        | The DFU process has completed successfully.                            | 1.0.0 |
| **`DFU_ABORTED`**          | <code>'DFU_ABORTED'</code>          | The DFU process has been aborted.                                      | 1.0.0 |
| **`DFU_FAILED`**           | <code>'DFU_FAILED'</code>           | The DFU process has failed.                                            | 1.0.0 |

</docgen-api>

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
