package com.example.plugin.nordicdfu;

import android.content.Context;
import android.os.Build;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.getcapacitor.JSObject;
import no.nordicsemi.android.dfu.DfuProgressListener;
import no.nordicsemi.android.dfu.DfuProgressListenerAdapter;
import no.nordicsemi.android.dfu.DfuServiceInitiator;
import no.nordicsemi.android.dfu.DfuServiceListenerHelper;

public class NordicDfu {

    /**
     * This interface is used to send events back to the JS layer.
     */
    interface DfuEventListener {
        void onDfuEvent(String state, @Nullable JSObject data);
    }

    /**
     * This method is used to get the event listener.
     * @return The event listener.
     */
    @Nullable
    public DfuEventListener getDFUEventListener() {
        return dfuEventListener;
    }

    /**
     * This method is used to set the event listener.
     * @param dfuEventListener The event listener.
     */
    public void setDFUEventListener(@Nullable DfuEventListener dfuEventListener) {
        this.dfuEventListener = dfuEventListener;
    }

    /**
     * The event listener used to send events back to the JS layer.
     */
    @Nullable
    private DfuEventListener dfuEventListener;

    /**
     * The constructor for the NordicDfu class.
     * @param context The context.
     */
    public NordicDfu(Context context) {
        /**
         * Register the notification channel for Android Oreo and above.
         */
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            DfuServiceInitiator.createDfuNotificationChannel(context);
        }
    }

    /**
     * Listener for status, progress and error events. This listener should be used instead of
     * creating the BroadcastReceiver on your own.
     *
     * @see DfuServiceListenerHelper
     */
    final DfuProgressListener dfuProgressListener = new DfuProgressListenerAdapter() {
        /**
         * Method called when the DFU service started connecting with the DFU target.
         *
         * @param deviceAddress the target device address.
         */
        @Override
        public void onDeviceConnecting(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DEVICE_CONNECTING", ret);
        }

        /**
         * Method called when the service has successfully connected, discovered services and found
         * DFU service on the DFU target.
         *
         * @param deviceAddress the target device address.
         */
        @Override
        public void onDeviceConnected(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DEVICE_CONNECTED", ret);
        }

        /**
         * Method called when the DFU process is starting. This includes reading the DFU Version
         * characteristic, sending DFU_START command as well as the Init packet, if set.
         *
         * @param deviceAddress the target device address.
         */
        @Override
        public void onDfuProcessStarting(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DFU_PROCESS_STARTING", ret);
        }

        /**
         * Method called when the DFU process was started and bytes about to be sent.
         *
         * @param deviceAddress the target device address
         */
        @Override
        public void onDfuProcessStarted(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DFU_PROCESS_STARTED", ret);
        }

        /**
         * Method called when the service discovered that the DFU target is in the application mode
         * and must be switched to DFU mode. The switch command will be sent and the DFU process
         * should start again. There will be no {@link #onDeviceDisconnected(String)} event following
         * this call.
         *
         * @param deviceAddress the target device address.
         */
        @Override
        public void onEnablingDfuMode(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("ENABLING_DFU_MODE", ret);
        }

        /**
         * Method called during uploading the firmware. It will not be called twice with the same
         * value of percent, however, in case of small firmware files, some values may be omitted.
         *
         * @param deviceAddress the target device address.
         * @param percent       the current status of upload (0-99).
         * @param speed         the current speed in bytes per millisecond.
         * @param avgSpeed      the average speed in bytes per millisecond
         * @param currentPart   the number pf part being sent. In case the ZIP file contains a Soft Device
         *                      and/or a Bootloader together with the application the SD+BL are sent as part 1,
         *                      then the service starts again and send the application as part 2.
         * @param partsTotal    total number of parts.
         */
        @Override
        public void onProgressChanged(
            @NonNull final String deviceAddress,
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
            dfuEventListener.onDfuEvent("DFU_PROGRESS", ret);
        }

        /**
         * Method called when the new firmware is being validated on the target device.
         *
         * @param deviceAddress the target device address.
         */
        @Override
        public void onFirmwareValidating(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("VALIDATING_FIRMWARE", ret);
        }

        /**
         * Method called when the service started to disconnect from the target device.
         *
         * @param deviceAddress the target device address.
         */
        @Override
        public void onDeviceDisconnecting(final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DEVICE_DISCONNECTING", ret);
        }

        /**
         * Method called when the service disconnected from the device. The device has been reset.
         *
         * @param deviceAddress the target device address.
         */
        @Override
        public void onDeviceDisconnected(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DEVICE_DISCONNECTED", ret);
        }

        /**
         * Method called when the DFU process succeeded.
         *
         * @param deviceAddress the target device address.
         */
        @Override
        public void onDfuCompleted(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DFU_COMPLETED", ret);
        }

        /**
         * Method called when the DFU process has been aborted.
         *
         * @param deviceAddress the target device address.
         */
        @Override
        public void onDfuAborted(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DFU_ABORTED", ret);
        }

        /**
         * Method called when an error occur.
         *
         * @param deviceAddress the target device address.
         * @param error         error number.
         * @param errorType     the error type, one of
         *                      {@link DfuBaseService#ERROR_TYPE_COMMUNICATION_STATE},
         *                      {@link DfuBaseService#ERROR_TYPE_COMMUNICATION},
         *                      {@link DfuBaseService#ERROR_TYPE_DFU_REMOTE},
         *                      {@link DfuBaseService#ERROR_TYPE_OTHER}.
         * @param message       the error message.
         */
        @Override
        public void onError(@NonNull final String deviceAddress, final int error, final int errorType, final String message) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            ret.put("error", error);
            ret.put("errorType", errorType);
            ret.put("message", message);
            dfuEventListener.onDfuEvent("DFU_FAILED", ret);
        }
    };

    public void onResume(Context context) {
        DfuServiceListenerHelper.registerProgressListener(context, dfuProgressListener);
    }

    public void onPause(Context context) {
        DfuServiceListenerHelper.registerProgressListener(context, dfuProgressListener);
    }
}
