package com.example.plugin.nordicdfu;

import android.util.Log;

public class NordicDfu {

    public String echo(String value) {
        Log.i("Echo", value);
        return value;
    }
}
