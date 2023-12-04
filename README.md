<p align="center"><br><img src="https://user-images.githubusercontent.com/236501/85893648-1c92e880-b7a8-11ea-926d-95355b8175c7.png" width="128" height="128" /></p>
<h3 align="center">Nordic DFU</h3>
<p align="center"><strong><code>@capacitor-community/nordic-dfu</code></strong></p>
<p align="center">
  Capacitor plugin to interface with Nordic DFU's [IOS-DFU-Library](https://github.com/NordicSemiconductor/IOS-DFU-Library) and [Android-DFU-Library](https://github.com/NordicSemiconductor/Android-DFU-Library).
</p>

<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2020?style=flat-square" />
  <a href="https://github.com/capacitor-community/example/actions?query=workflow%3A%22CI%22"><img src="https://img.shields.io/github/workflow/status/capacitor-community/example/CI?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@capacitor-community/example"><img src="https://img.shields.io/npm/l/@capacitor-community/example?style=flat-square" /></a>
<br>
  <a href="https://www.npmjs.com/package/@capacitor-community/example"><img src="https://img.shields.io/npm/dw/@capacitor-community/example?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@capacitor-community/example"><img src="https://img.shields.io/npm/v/@capacitor-community/example?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors-"><img src="https://img.shields.io/badge/all%20contributors-0-orange?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
</p>

## Table of Contents

- [Maintainers](#maintainers)
- [Installation](#installation)
- [API](#api)

## Maintainers

| Maintainer | GitHub                                  | Active |
| ---------- | --------------------------------------- | ------ |
| robsonos   | [robsonos](https://github.com/robsonos) | yes    |

## Installation

```bash
npm install @capacitor-community/nordic-dfu
npx cap sync
```

## API

<docgen-index>

- [`startDFU(...)`](#startdfu)
- [`checkPermissions()`](#checkpermissions)
- [`requestPermissions()`](#requestpermissions)
- [`addListener('DFUStateChanged', ...)`](#addlistenerdfustatechanged)
- [`removeAllListeners()`](#removealllisteners)
- [Interfaces](#interfaces)
- [Type Aliases](#type-aliases)
- [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

The plugin definition for the Nordic DFU plugin

### startDFU(...)

```typescript
startDFU(dfuUpdateOptions: DfuUpdateOptions) => Promise<void | PluginResultError>
```

Starts the DFU process

| Param                  | Type                                                          | Description                     |
| ---------------------- | ------------------------------------------------------------- | ------------------------------- |
| **`dfuUpdateOptions`** | <code><a href="#dfuupdateoptions">DfuUpdateOptions</a></code> | The options for the DFU process |

**Returns:** <code>Promise&lt;void | <a href="#pluginresulterror">PluginResultError</a>&gt;</code>

---

### checkPermissions()

```typescript
checkPermissions() => Promise<PermissionStatus>
```

Check plugin permissions

**Returns:** <code>Promise&lt;<a href="#permissionstatus">PermissionStatus</a>&gt;</code>

---

### requestPermissions()

```typescript
requestPermissions() => Promise<PermissionStatus>
```

Request permissions needed bu the plugin

**Returns:** <code>Promise&lt;<a href="#permissionstatus">PermissionStatus</a>&gt;</code>

---

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

---

### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Removes all listeners for the DFUStateChanged event

---

### Interfaces

#### PluginResultError

| Prop          | Type                |
| ------------- | ------------------- |
| **`message`** | <code>string</code> |

#### DfuUpdateOptions

The options for the DFU process

| Prop                | Type                                              | Description                                                                                                                               |
| ------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **`deviceAddress`** | <code>string</code>                               | The target device address. On **Android** this is the BLE MAC address. On **iOS** and **web** it is a randomly generated UUID identifier. |
| **`deviceName`**    | <code>string</code>                               | The name of the device                                                                                                                    |
| **`filePath`**      | <code>string</code>                               | The path to the firmware file                                                                                                             |
| **`dfuOptions`**    | <code><a href="#dfuoptions">DfuOptions</a></code> | The options for the DFU process                                                                                                           |

#### DfuOptions

| Prop                                                        | Type                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`disableNotification`**                                   | <code>boolean</code> | Sets whether the progress notification in the status bar should be disabled. Defaults to false.                                                                                                                                                                                                                                                                                                                                                |
| **`startAsForegroundService`**                              | <code>boolean</code> | Sets whether the progress notification in the status bar should be disabled. Defaults to false.                                                                                                                                                                                                                                                                                                                                                |
| **`keepBond`**                                              | <code>boolean</code> | Sets whether the bond information should be preserver after flashing new application. Defaults to false.                                                                                                                                                                                                                                                                                                                                       |
| **`restoreBond`**                                           | <code>boolean</code> | Sets whether a new bond should be created after the DFU is complete. The old bond information will be removed before. Defaults to false.                                                                                                                                                                                                                                                                                                       |
| **`dataObjectDelay`**                                       | <code>number</code>  | Sets the initial delay (in milliseconds) that the service will wait before sending each data object. Defaults to 0.                                                                                                                                                                                                                                                                                                                            |
| **`packetReceiptNotificationsEnabled`**                     | <code>boolean</code> | Enables or disables the Packet Receipt Notification (PRN) procedure. By default the PRNs are disabled on devices with Android Marshmallow or newer and enabled on older ones.                                                                                                                                                                                                                                                                  |
| **`packetsReceiptNotificationsValue`**                      | <code>number</code>  | If Packet Receipt Notification procedure is enabled, this method sets the number of packets to be sent before receiving a PRN. Defaults to 12.                                                                                                                                                                                                                                                                                                 |
| **`forceDfu`**                                              | <code>boolean</code> | Setting force DFU to true will prevent from jumping to the DFU Bootloader mode in case there is no DFU Version characteristic (Legacy DFU only!). Use this if the DFU operation can be handled by your device running in the application mode. This method is ignored in Secure DFU. Defaults to false.                                                                                                                                        |
| **`rebootTime`**                                            | <code>number</code>  | Sets the time (in milliseconds) required by the device to reboot. The library will wait for this time before scanning for the device in bootloader mode. Defaults to 0 ms.                                                                                                                                                                                                                                                                     |
| **`scanTimeout`**                                           | <code>number</code>  | Sets the scan duration (in milliseconds) when scanning for DFU Bootloader. Defaults to 5000.                                                                                                                                                                                                                                                                                                                                                   |
| **`forceScanningForNewAddressInLegacyDfu`**                 | <code>boolean</code> | When this is set to true, the Legacy Buttonless Service will scan for the device advertising with an incremented MAC address, instead of trying to reconnect to the same device. Defaults to false.                                                                                                                                                                                                                                            |
| **`numberOfRetries`**                                       | <code>number</code>  | Sets the number of retries that the DFU service will use to complete DFU. Defaults to 0.                                                                                                                                                                                                                                                                                                                                                       |
| **`mtu`**                                                   | <code>number</code>  | Sets the Maximum Transfer Unit (MTU) value that the Secure DFU service will try to request before performing DFU. By default, value 517 will be used, which is the highest supported y Android. However, as the highest supported MTU by the Secure DFU from SDK 15 (first which supports higher MTU) is 247, the sides will agree on using MTU = 247 instead if the phone supports it (Lollipop or newer device).                             |
| **`currentMtu`**                                            | <code>number</code>  | Sets the current MTU value. This method should be used only if the device is already connected and MTU has been requested before DFU service is started. Defaults to 23.                                                                                                                                                                                                                                                                       |
| **`scope`**                                                 | <code>number</code>  | This method allows to narrow the update to selected parts from the ZIP, for example to allow only application update from a ZIP file that has SD+BL+App. System components scope include the Softdevice and/or the Bootloader (they can't be separated as they are packed in a single bin file and the library does not know whether it contains only the softdevice, the bootloader or both) Application scope includes the application only. |
| **`mbrSize`**                                               | <code>number</code>  | This method sets the size of an MBR (Master Boot Record). It should be used only when updating a file from a HEX file. If you use BIN or ZIP, value set here will be ignored. Defaults to 4096 (0x1000) bytes.                                                                                                                                                                                                                                 |
| **`unsafeExperimentalButtonlessServiceInSecureDfuEnabled`** | <code>boolean</code> | Set this flag to true to enable experimental buttonless feature in Secure DFU. When the experimental Buttonless DFU Service is found on a device, the service will use it to switch the device to the bootloader mode, connect to it in that mode and proceed with DFU. Defaults to false.                                                                                                                                                     |

#### PermissionStatus

The current status of permissions in the plugin

| Prop                | Type                                                        | Description                        |
| ------------------- | ----------------------------------------------------------- | ---------------------------------- |
| **`notifications`** | <code><a href="#permissionstate">PermissionState</a></code> | Permission state of notifications. |

#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |

#### DfuUpdate

The DFU update object that is passed to the DFUStateChanged event

| Prop        | Type                                                    | Description                                                                  |
| ----------- | ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **`state`** | <code><a href="#dfustate">DfuState</a></code>           | The DFU state that is passed to the <a href="#dfuupdate">DfuUpdate</a>       |
| **`data`**  | <code><a href="#dfuupdatedata">DfuUpdateData</a></code> | The DFU data that is passed to the <a href="#dfuupdate">DfuUpdate</a> object |

#### DfuUpdateData

The DFU data that is passed to the <a href="#dfuupdate">DfuUpdate</a> object

| Prop              | Type                | Description                                                                                                                                                                                                                  |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`percent`**     | <code>number</code> | The current status of upload (0-99).                                                                                                                                                                                         |
| **`speed`**       | <code>number</code> | The current speed in bytes per millisecond.                                                                                                                                                                                  |
| **`avgSpeed`**    | <code>number</code> | The average speed in bytes per millisecond.                                                                                                                                                                                  |
| **`currentPart`** | <code>number</code> | The number pf part being sent. In case the ZIP file contains a Soft Device and/or a Bootloader together with the application the SD+BL are sent as part 1, then the service starts again and send the application as part 2. |
| **`partsTotal`**  | <code>number</code> | The total number of parts.                                                                                                                                                                                                   |

### Type Aliases

#### PermissionState

<code>'prompt' | 'prompt-with-rationale' | 'granted' | 'denied'</code>

### Enums

#### DfuState

| Members                    | Value                               | Description                                                        |
| -------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| **`DEVICE_CONNECTING`**    | <code>'DEVICE_CONNECTING'</code>    | The device is currently connecting.                                |
| **`DEVICE_CONNECTED`**     | <code>'DEVICE_CONNECTED'</code>     | The device has successfully connected. Available for Android only. |
| **`DFU_PROCESS_STARTING`** | <code>'DFU_PROCESS_STARTING'</code> | The DFU process is about to start.                                 |
| **`DFU_PROCESS_STARTED`**  | <code>'DFU_PROCESS_STARTED'</code>  | The DFU process has started. Available for Android only.           |
| **`ENABLING_DFU_MODE`**    | <code>'ENABLING_DFU_MODE'</code>    | The device is enabling DFU mode.                                   |
| **`DFU_PROGRESS`**         | <code>'DFU_PROGRESS'</code>         | The DFU process is in progress.                                    |
| **`VALIDATING_FIRMWARE`**  | <code>'VALIDATING_FIRMWARE'</code>  | The firmware is currently being validated.                         |
| **`DEVICE_DISCONNECTING`** | <code>'DEVICE_DISCONNECTING'</code> | The device is disconnecting.                                       |
| **`DEVICE_DISCONNECTED`**  | <code>'DEVICE_DISCONNECTED'</code>  | The device has disconnected. Available for Android only.           |
| **`DFU_COMPLETED`**        | <code>'DFU_COMPLETED'</code>        | The DFU process has completed successfully.                        |
| **`DFU_ABORTED`**          | <code>'DFU_ABORTED'</code>          | The DFU process has been aborted.                                  |
| **`DFU_FAILED`**           | <code>'DFU_FAILED'</code>           | The DFU process has failed.                                        |

</docgen-api>

### List of Error Codes and Meanings

<!-- TODO -->

When an error is thrown, one of the following codes (as a string value) will be used.

|  Code | Description          |
| ----: | :------------------- |
|   '1' | `INTERNAL_ERROR`     |
|   '2' | `INVALID_ARGUMENT`   |
| ' '8' | `FILE_NOT_SUPPORTED` |
|   '9' | `FILE_NOT_FOUND`     |
|  '10' | `UNKNOWN`            |

### Android

<!-- TODO -->

If you app needs to open files in the external directories, then within your `AndroidManifest.xml` file, change the following:

```diff
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.example">

+  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

</manifest>
```

### iOS

<!-- TODO -->

You'll need to set ios/App/Podfile to version 13 or higher (for more details please [see](https://capacitorjs.com/docs/ios#ios-support))

```
platform :ios '13.0'
```

then `npx cap sync ios`
