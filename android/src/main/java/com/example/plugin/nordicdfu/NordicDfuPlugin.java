package com.example.plugin.nordicdfu;

import android.bluetooth.BluetoothAdapter;
import android.util.Log;
import androidx.annotation.Nullable;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.util.Arrays;
import java.util.List;
import no.nordicsemi.android.dfu.DfuBaseService;
import no.nordicsemi.android.dfu.DfuServiceController;
import no.nordicsemi.android.dfu.DfuServiceInitiator;
import org.json.JSONException;
import org.json.JSONObject;

@CapacitorPlugin(
    name = "NordicDfu"
    //        permissions = {
    //                @Permission(
    //                        strings = {
    //                                Manifest.permission.BLUETOOTH,
    //                                Manifest.permission.BLUETOOTH_ADMIN,
    //                                Manifest.permission.ACCESS_COARSE_LOCATION,
    //                                Manifest.permission.ACCESS_FINE_LOCATION,
    //                                Manifest.permission.BLUETOOTH_CONNECT,
    //                                Manifest.permission.READ_EXTERNAL_STORAGE,
    //                                Manifest.permission.WRITE_EXTERNAL_STORAGE
    //                        },
    //                        alias = "nordicdfu"
    //                )
    //        }
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
    //         return;
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
        JSObject data = call.getData();
        String deviceAddress = (String) data.opt("deviceAddress");
        String deviceName = (String) data.opt("deviceName");
        String filePath = (String) data.opt("filePath");

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

        final DfuServiceInitiator starter = new DfuServiceInitiator(deviceAddress);

        // Default settings
        if (deviceName != null) {
            starter.setDeviceName(deviceName);
        }
        starter.setKeepBond(false);
        starter.setForceDfu(true);
        starter.setUnsafeExperimentalButtonlessServiceInSecureDfuEnabled(true);
        starter.setPacketsReceiptNotificationsEnabled(true);
        starter.setNumberOfRetries(10);
        starter.setMtu(23);
        starter.setPacketsReceiptNotificationsValue(1);

        if (data.has("dfuOptions")) {
            Log.d(LOG_TAG, "dfuOptions: " + data.opt("dfuOptions"));

            JSObject dfuOptions = null;
            try {
                JSONObject jsonDfuOptions = data.optJSONObject("dfuOptions");
                if (jsonDfuOptions != null) {
                    dfuOptions = new JSObject(jsonDfuOptions.toString());
                }
            } catch (JSONException e) {
                call.reject("Invalid dfuOptions: " + e.getMessage());
                return;
            }

            if (dfuOptions.has("disableNotification")) {
                starter.setDisableNotification(dfuOptions.optBoolean("disableNotification"));
            }

            if (dfuOptions.has("startAsForegroundService")) {
                starter.setForeground(dfuOptions.optBoolean("startAsForegroundService"));
            }

            if (dfuOptions.has("keepBond")) {
                starter.setKeepBond(dfuOptions.optBoolean("keepBond"));
            }

            if (dfuOptions.has("restoreBond")) {
                starter.setRestoreBond(dfuOptions.optBoolean("restoreBond"));
            }

            if (dfuOptions.has("dataObjectDelay")) {
                starter.setPrepareDataObjectDelay(dfuOptions.optInt("dataObjectDelay"));
            }

            if (dfuOptions.has("packetReceiptNotificationsEnabled")) {
                starter.setPacketsReceiptNotificationsEnabled(dfuOptions.optBoolean("packetReceiptNotificationsEnabled"));
            }

            if (dfuOptions.has("packetsReceiptNotificationsValue")) {
                starter.setPacketsReceiptNotificationsValue(dfuOptions.optInt("packetReceiptNotificationsEnabled"));
            }

            if (dfuOptions.has("forceDfu")) {
                starter.setForceDfu(dfuOptions.optBoolean("forceDfu"));
            }

            if (dfuOptions.has("rebootTime")) {
                starter.setRebootTime(dfuOptions.optInt("rebootTime"));
            }

            if (dfuOptions.has("scanTimeout")) {
                starter.setScanTimeout(dfuOptions.optInt("scanTimeout"));
            }

            if (dfuOptions.has("forceScanningForNewAddressInLegacyDfu")) {
                starter.setForceScanningForNewAddressInLegacyDfu(dfuOptions.optBoolean("forceScanningForNewAddressInLegacyDfu"));
            }

            if (dfuOptions.has("numberOfRetries")) {
                starter.setNumberOfRetries(dfuOptions.optInt("numberOfRetries"));
            }

            if (dfuOptions.has("mtu")) {
                starter.setMtu(dfuOptions.optInt("mtu"));
            }

            if (dfuOptions.has("currentMtu")) {
                starter.setCurrentMtu(dfuOptions.optInt("currentMtu"));
            }

            if (dfuOptions.has("scope")) {
                starter.setScope(dfuOptions.optInt("scope"));
            }

            if (dfuOptions.has("mbrSize")) {
                starter.setMbrSize(dfuOptions.optInt("mbrSize"));
            }

            if (dfuOptions.has("unsafeExperimentalButtonlessServiceInSecureDfuEnabled")) {
                starter.setUnsafeExperimentalButtonlessServiceInSecureDfuEnabled(
                    dfuOptions.optBoolean("unsafeExperimentalButtonlessServiceInSecureDfuEnabled")
                );
            }
        }

        if (filePath.endsWith(".bin") || filePath.endsWith(".hex")) {
            starter.setBinOrHex(DfuBaseService.TYPE_APPLICATION, filePath).setInitFile(null, null);
        } else {
            starter.setZip(filePath);
        }

        final DfuServiceController controller = starter.start(getContext(), DfuService.class);

        // file.delete(); // TODO:implement this

        call.resolve();
    }

    private void sendStateUpdate(String state, @Nullable JSObject data) {
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
