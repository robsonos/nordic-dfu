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

    private static final String name = "NordicDfuPlugin";
    public static final String LOG_TAG = name;
    private final String dfuStateEvent = "DFUStateChanged";
    private final String progressEvent = "DFUProgress";
    private PluginCall savedCall;
    private String[] aliases;

    @PluginMethod
    public void initialize(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) { // 31 is Android 12 (S)
            boolean neverForLocation = call.getBoolean("androidNeverForLocation", false);
            if (neverForLocation) {
                aliases = new String[] { "BLUETOOTH_SCAN", "BLUETOOTH_CONNECT", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE" };
            } else {
                aliases =
                    new String[] {
                        "BLUETOOTH_SCAN",
                        "BLUETOOTH_CONNECT",
                        "ACCESS_FINE_LOCATION",
                        "READ_EXTERNAL_STORAGE",
                        "WRITE_EXTERNAL_STORAGE"
                    };
            }
        } else {
            aliases =
                new String[] {
                    "ACCESS_COARSE_LOCATION",
                    "ACCESS_FINE_LOCATION",
                    "BLUETOOTH",
                    "BLUETOOTH_ADMIN",
                    "READ_EXTERNAL_STORAGE",
                    "WRITE_EXTERNAL_STORAGE"
                };
        }
        requestPermissionForAliases(aliases, call, "checkPermission");
    }

    @PermissionCallback
    private void checkPermission(PluginCall call) {
        List<Boolean> granted = new ArrayList<>();
        for (String alias : aliases) {
            granted.add(getPermissionState(alias) == PermissionState.GRANTED);
        }

        // Check if all permissions are granted
        if (!granted.contains(false)) {
            runInitialization(call);
        } else {
            call.reject("Permission denied.");
        }
    }

    private void runInitialization(PluginCall call) {
        if (!getBridge().getActivity().getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
            call.reject("BLE is not supported.");
            return;
        }

        BluetoothManager bluetoothManager = (BluetoothManager) getBridge().getActivity().getSystemService(Context.BLUETOOTH_SERVICE);
        BluetoothAdapter bluetoothAdapter = bluetoothManager.getAdapter();

        if (bluetoothAdapter == null) {
            call.reject("BLE is not available.");
            return;
        }
        call.resolve();
    }

    @PluginMethod
    public void startDFU(PluginCall call) {
        this.savedCall = call;

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

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            DfuServiceInitiator.createDfuNotificationChannel(getContext());
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

        //        if (fileType == DfuBaseService.TYPE_AUTO)
        //            throw new UnsupportedOperationException("You must specify the file type");

        if (filePath.endsWith(".bin") || filePath.endsWith(".hex")) {
            starter.setBinOrHex(DfuBaseService.TYPE_APPLICATION, filePath).setInitFile(null, null);
        } else {
            starter.setZip(filePath);
        }

        final DfuServiceController controller = starter.start(getContext(), DfuService.class);

        // Send back some success or status message to JS
        call.resolve();
    }

    private void sendEvent(String eventName, @Nullable JSObject data) {
        if (data == null) {
            data = new JSObject();
        }
        notifyListeners(eventName, data);
    }

    private void sendStateUpdate(String state, String deviceAddress) {
        JSObject ret = new JSObject();
        Log.d(LOG_TAG, "State: " + state);
        ret.put("state", state);
        ret.put("deviceAddress", deviceAddress);
        notifyListeners(dfuStateEvent, ret, true);
    }

    public void onHostResume() {
        DfuServiceListenerHelper.registerProgressListener(getContext(), mDfuProgressListener);
    }

    public void onHostPause() {
        // Currently, this does nothing but you can add logic here if needed.
    }

    public void onHostDestroy() {
        DfuServiceListenerHelper.unregisterProgressListener(getContext(), mDfuProgressListener);
    }

    private final DfuProgressListener mDfuProgressListener = new DfuProgressListener() {
        @Override
        public void onDeviceConnecting(final String deviceAddress) {
            sendStateUpdate("CONNECTING", deviceAddress);
        }

        @Override
        public void onDeviceConnected(@NonNull String deviceAddress) {}

        @Override
        public void onDfuProcessStarting(final String deviceAddress) {
            sendStateUpdate("DFU_PROCESS_STARTING", deviceAddress);
        }

        @Override
        public void onDfuProcessStarted(@NonNull String deviceAddress) {}

        @Override
        public void onEnablingDfuMode(final String deviceAddress) {
            sendStateUpdate("ENABLING_DFU_MODE", deviceAddress);
        }

        @Override
        public void onFirmwareValidating(final String deviceAddress) {
            sendStateUpdate("FIRMWARE_VALIDATING", deviceAddress);
        }

        @Override
        public void onDeviceDisconnecting(final String deviceAddress) {
            sendStateUpdate("DEVICE_DISCONNECTING", deviceAddress);
        }

        @Override
        public void onDeviceDisconnected(@NonNull String deviceAddress) {}

        @Override
        public void onDfuCompleted(final String deviceAddress) {
            if (savedCall != null) {
                JSObject ret = new JSObject();
                ret.put("deviceAddress", deviceAddress);
                savedCall.resolve(ret);
                savedCall = null;
            }
            sendStateUpdate("DFU_COMPLETED", deviceAddress);

            new Handler()
                .postDelayed(
                    new Runnable() {
                        @Override
                        public void run() {
                            final NotificationManager manager = (NotificationManager) getBridge()
                                .getActivity()
                                .getSystemService(Context.NOTIFICATION_SERVICE);
                            manager.cancel(DfuService.NOTIFICATION_ID);
                        }
                    },
                    200
                );
        }

        @Override
        public void onDfuAborted(final String deviceAddress) {
            sendStateUpdate("DFU_ABORTED", deviceAddress);
            if (savedCall != null) {
                savedCall.reject("2", "DFU ABORTED");
                savedCall = null;
            }
        }

        @Override
        public void onProgressChanged(
            final String deviceAddress,
            final int percent,
            final float speed,
            final float avgSpeed,
            final int currentPart,
            final int partsTotal
        ) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            ret.put("percent", percent);
            ret.put("speed", speed);
            ret.put("avgSpeed", avgSpeed);
            ret.put("currentPart", currentPart);
            ret.put("partsTotal", partsTotal);
            sendEvent(progressEvent, ret);
        }

        @Override
        public void onError(final String deviceAddress, final int error, final int errorType, final String message) {
            sendStateUpdate("DFU_FAILED", deviceAddress);
            if (savedCall != null) {
                savedCall.reject(Integer.toString(error), message);
                savedCall = null;
            }
        }
    };
}
