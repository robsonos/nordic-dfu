package com.example.plugin.nordicdfu;

import android.app.Activity;
import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import no.nordicsemi.android.dfu.DfuBaseService;

public class DfuService extends DfuBaseService {

    private static volatile boolean loggingEnabled = false;

    /**
     * Sets whether the DFU library writes its verbose output to LogCat.
     *
     * The service is instantiated by the system rather than by the plugin, so the value is
     * held statically and must be set before {@code DfuServiceInitiator.start(...)}. Only one
     * DFU can run at a time, so a single static is sufficient.
     */
    public static void setLoggingEnabled(final boolean enabled) {
        loggingEnabled = enabled;
    }

    @Override
    protected Class<? extends Activity> getNotificationTarget() {
        /*
         * As a target activity the NotificationActivity is returned, not the
         * MainActivity. This is because the notification must create a new task:
         *
         * intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
         *
         * when you press it. You can use NotificationActivity to check whether the new
         * activity is a root activity (that means no other activity was open earlier)
         * or that some other activity is already open. In the latter case the
         * NotificationActivity will just be closed. The system will restore the
         * previous activity. However, if the application has been closed during upload
         * and you click the notification, a NotificationActivity will be launched as a
         * root activity. It will create and start the main activity and terminate
         * itself.
         *
         * This method may be used to restore the target activity in case the
         * application was closed or is open. It may also be used to recreate an
         * activity history using startActivities(...).
         */
        return NotificationActivity.class;
    }

    @Override
    protected boolean isDebug() {
        /*
         * Use dfuOptions.loggingEnabled plugin option if you want the service to print 
         * more logs in LogCat.
         */
        return loggingEnabled;
    }

    @Override
    protected void updateForegroundNotification(@NonNull final NotificationCompat.Builder builder) {
        /*
         * Customize the foreground service notification here.
         */
    }
}
