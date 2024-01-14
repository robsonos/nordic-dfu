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

    interface DfuEventListener {
        void onDfuEvent(String state, @Nullable JSObject data);
    }

    @Nullable
    public DfuEventListener getDFUEventListener() {
        return dfuEventListener;
    }

    public void setDFUEventListener(@Nullable DfuEventListener dfuEventListener) {
        this.dfuEventListener = dfuEventListener;
    }

    @Nullable
    private DfuEventListener dfuEventListener;

    private long startTime = 0;

    public NordicDfu(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            DfuServiceInitiator.createDfuNotificationChannel(context);
        }
    }

    final DfuProgressListener dfuProgressListener = new DfuProgressListenerAdapter() {
        @Override
        public void onDeviceConnecting(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DEVICE_CONNECTING", ret);
        }

        @Override
        public void onDeviceConnected(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DEVICE_CONNECTED", ret);
        }

        @Override
        public void onDfuProcessStarting(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DFU_PROCESS_STARTING", ret);
        }

        @Override
        public void onDfuProcessStarted(@NonNull final String deviceAddress) {
            startTime = System.currentTimeMillis();

            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DFU_PROCESS_STARTED", ret);
        }

        @Override
        public void onEnablingDfuMode(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("ENABLING_DFU_MODE", ret);
        }

        @Override
        public void onProgressChanged(
            @NonNull final String deviceAddress,
            final int percent,
            final float speed,
            final float avgSpeed,
            final int currentPart,
            final int partsTotal
        ) {
            long currentTime = System.currentTimeMillis();
            long duration = currentTime - startTime;
            long remainingTime = 0;

            if (percent > 0) {
                long estimatedTotalTime = (duration * 100) / percent;
                remainingTime = estimatedTotalTime - duration;
            }

            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            ret.put("percent", percent);
            ret.put("speed", speed);
            ret.put("avgSpeed", avgSpeed);
            ret.put("currentPart", currentPart);
            ret.put("partsTotal", partsTotal);
            ret.put("duration", duration);
            ret.put("remainingTime", remainingTime);
            dfuEventListener.onDfuEvent("DFU_PROGRESS", ret);
        }

        @Override
        public void onFirmwareValidating(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("VALIDATING_FIRMWARE", ret);
        }

        @Override
        public void onDeviceDisconnecting(final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DEVICE_DISCONNECTING", ret);
        }

        @Override
        public void onDeviceDisconnected(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DEVICE_DISCONNECTED", ret);
        }

        @Override
        public void onDfuCompleted(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DFU_COMPLETED", ret);
            // TODO: end activity
            // new Handler()
            // .postDelayed(
            // new Runnable() {
            // @Override
            // public void run() {
            // // if this activity is still open and upload process was completed, cancel
            // the notification
            // final NotificationManager manager = (NotificationManager)
            // reactContext.getSystemService(
            // Context.NOTIFICATION_SERVICE
            // );
            // manager.cancel(DfuService.NOTIFICATION_ID);
            // }
            // },
            // 200
            // );
        }

        @Override
        public void onDfuAborted(@NonNull final String deviceAddress) {
            JSObject ret = new JSObject();
            ret.put("deviceAddress", deviceAddress);
            dfuEventListener.onDfuEvent("DFU_ABORTED", ret);
        }

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

    public void onPause(Context context) {}

    public void onDestroy(Context context) {
        DfuServiceListenerHelper.unregisterProgressListener(context, dfuProgressListener);
    }
}
