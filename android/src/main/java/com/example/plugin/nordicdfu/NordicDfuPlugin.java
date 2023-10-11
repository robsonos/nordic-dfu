package com.example.plugin.nordicdfu;

import android.Manifest;
import android.app.NotificationManager;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.List;
import no.nordicsemi.android.dfu.DfuBaseService;
import no.nordicsemi.android.dfu.DfuProgressListener;
import no.nordicsemi.android.dfu.DfuProgressListenerAdapter;
import no.nordicsemi.android.dfu.DfuServiceController;
import no.nordicsemi.android.dfu.DfuServiceInitiator;
import no.nordicsemi.android.dfu.DfuServiceListenerHelper;

@CapacitorPlugin(
    name = "NordicDfu",
    permissions = {
        @Permission(
            strings = {
                Manifest.permission.BLUETOOTH,
                Manifest.permission.BLUETOOTH_ADMIN,
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.BLUETOOTH_CONNECT,
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.WRITE_EXTERNAL_STORAGE
            },
            alias = "nordicdfu"
        )
    }
)
public class NordicDfuPlugin extends Plugin {

    private NordicDfu implementation;
    public static final String DFU_CHANGE_EVENT = "DFUStateChanged";
    public static final String LOG_TAG = NordicDfuPlugin.class.getSimpleName();

    // private String[] aliases;

    // /**
    //  * Clean up callback to prevent leaks.
    //  */
    // @Override
    // protected void handleOnDestroy() {
    //     implementation.setStatusChangeListener(null);
    // }

    // @PluginMethod
    // public void initialize(PluginCall call) {
    //     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) { // 31 is Android 12 (S)
    //         boolean neverForLocation = call.getBoolean("androidNeverForLocation", false);
    //         if (neverForLocation) {
    //             aliases = new String[] { "BLUETOOTH_SCAN", "BLUETOOTH_CONNECT", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE" };
    //         } else {
    //             aliases =
    //                 new String[] {
    //                     "BLUETOOTH_SCAN",
    //                     "BLUETOOTH_CONNECT",
    //                     "ACCESS_FINE_LOCATION",
    //                     "READ_EXTERNAL_STORAGE",
    //                     "WRITE_EXTERNAL_STORAGE"
    //                 };
    //         }
    //     } else {
    //         aliases =
    //             new String[] {
    //                 "ACCESS_COARSE_LOCATION",
    //                 "ACCESS_FINE_LOCATION",
    //                 "BLUETOOTH",
    //                 "BLUETOOTH_ADMIN",
    //                 "READ_EXTERNAL_STORAGE",
    //                 "WRITE_EXTERNAL_STORAGE"
    //             };
    //     }
    //     requestPermissionForAliases(aliases, call, "checkPermission");
    // }
    //
    // @PermissionCallback
    // private void checkPermission(PluginCall call) {
    //     List<Boolean> granted = new ArrayList<>();
    //     for (String alias : aliases) {
    //         granted.add(getPermissionState(alias) == PermissionState.GRANTED);
    //     }
    //
    //     // Check if all permissions are granted
    //     if (!granted.contains(false)) {
    //         runInitialization(call);
    //     } else {
    //         call.reject("Permission denied.");
    //     }
    // }
    //
    // private void runInitialization(PluginCall call) {
    //     if (!getBridge().getActivity().getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
    //         call.reject("BLE is not supported.");
    //         return;
    //     }
    //
    //     BluetoothManager bluetoothManager = (BluetoothManager) getBridge().getActivity().getSystemService(Context.BLUETOOTH_SERVICE);
    //     BluetoothAdapter bluetoothAdapter = bluetoothManager.getAdapter();
    //
    //     if (bluetoothAdapter == null) {
    //         call.reject("BLE is not available.");
    //         return;
    //     }
    //     call.resolve();
    // }

    @Override
    public void load() {
        implementation = new NordicDfu(getContext());
        implementation.setDFUEventListener(this::sendStateUpdate);
    }

    @PluginMethod
    public void startDFU(PluginCall call) {
        String deviceAddress = call.getString("deviceAddress");
        String deviceName = call.getString("deviceName", null);
        String filePath = call.getString("filePath");

        if (deviceAddress == null || deviceAddress.isEmpty()) {
            call.reject("deviceAddress is required");
            return;
        }

        if (!BluetoothAdapter.checkBluetoothAddress(deviceAddress)) {
            call.reject("Invalid Bluetooth address: " + deviceAddress);
            return;
        }

        if (filePath == null || filePath.isEmpty()) {
            call.reject("filePath is required");
            return;
        }

        if (filePath.startsWith("file://")) {
            filePath = filePath.replace("file://", "");
        }

        File file = new File(filePath);
        if (!file.exists()) {
            call.reject("File not found: " + filePath);
            return;
        }

        List<String> supportedFileTypes = Arrays.asList(".bin", ".hex", ".zip");

        boolean isFileTypeSupported = false;
        for (String type : supportedFileTypes) {
            if (filePath.endsWith(type)) {
                isFileTypeSupported = true;
                break;
            }
        }

        if (!isFileTypeSupported) {
            call.reject("File type not supported");
            return;
        }

        final DfuServiceInitiator starter = new DfuServiceInitiator(deviceAddress).setKeepBond(false);

        //        if (options.hasKey("retries")) {
        //            int retries = options.getInt("retries");
        //            starter.setNumberOfRetries(retries);
        //        }

        //        if (options.hasKey("maxMtu")) {
        //            int mtu = options.getInt("maxMtu");
        //            starter.setMtu(mtu);
        //        }

        if (deviceName != null) {
            starter.setDeviceName(deviceName);
        }

        // mimic behavior of iOSDFULibrary when packetReceiptNotificationParameter is set to `0` - see: https://github.com/NordicSemiconductor/IOS-Pods-DFU-Library/blob/master/iOSDFULibrary/Classes/Implementation/DFUServiceInitiator.swift#L115
        //        if (packetReceiptNotificationParameter > 0) {
        //            starter.setPacketsReceiptNotificationsValue(packetReceiptNotificationParameter);
        //        } else {
        starter.setPacketsReceiptNotificationsValue(1);
        //        }

        starter.setUnsafeExperimentalButtonlessServiceInSecureDfuEnabled(true);

        //        if (fileType == DfuBaseService.TYPE_AUTO) // TODO:
        //            throw new UnsupportedOperationException("You must specify the file type");

        if (filePath.endsWith(".bin") || filePath.endsWith(".hex")) {
            starter.setBinOrHex(DfuBaseService.TYPE_APPLICATION, filePath).setInitFile(null, null);
        } else {
            starter.setZip(filePath);
        }

        final DfuServiceController controller = starter.start(getContext(), DfuService.class);

        // // Optionally delete the file after DFU completes if it's no longer needed
        // file.delete();

        // Send back some success or status message to JS
        call.resolve();
    }

    private void sendStateUpdate(String state, @Nullable JSObject data) { //, String deviceAddress) {
        JSObject ret = new JSObject();

        if (data == null) {
            data = new JSObject();
        }

        ret.put("state", state);
        ret.put("data", data);
        notifyListeners(DFU_CHANGE_EVENT, ret);
    }

    @Override
    protected void handleOnResume() {
        super.handleOnResume();
        implementation.onResume(getContext());
    }

    @Override
    protected void handleOnPause() {
        super.handleOnPause();
        implementation.onPause(getContext());
    }
}
