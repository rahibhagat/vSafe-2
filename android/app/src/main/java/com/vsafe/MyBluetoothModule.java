package com.vSafe;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.ScanCallback;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;
import androidx.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;

import java.lang.reflect.Method;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class MyBluetoothModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
  
    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";
    public static final String LOG_TAG = "ReactNativeMyBluetoothModule";
  
    MyBluetoothModule(ReactApplicationContext context) {
      super(context);
      reactContext = context;
    }

    @Override
  public String getName() {
    return "MyBluetoothModuleExample";
  }

  @ReactMethod
  public void getLocalDeviceBluetoothAddress(
      Callback successCallback,
      Callback errorCallback) {
    try {
        String macAddress = android.provider.Settings.Secure.getString(reactContext.getContentResolver(), "bluetooth_address");
      successCallback.invoke(macAddress,macAddress);
    } catch (Exception e) {
      errorCallback.invoke(e.getMessage());
    }
  }

//   @ReactMethod
//   public void getAvailableBlutoothDevice(
//       Callback successCallback,
//       Callback errorCallback) {
//     try {
//         BluetoothAdapter bAdapter = BluetoothAdapter.getDefaultAdapter();
//         BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
//         BluetoothLeScanner scanner = adapter.getBluetoothLeScanner();

// if (scanner != null) {
//     scanner.startScan(filters, scanSettings, scanCallback);
//     Log.d(LOG_TAG, "scan started");
// }  else {
//     Log.e(LOG_TAG, "could not get scanner object");
// }
//     } catch (Exception e) {
//       errorCallback.invoke(e.getMessage());
//     }
//   }

//   private final ScanCallback scanCallback = new ScanCallback() {
//     @Override
//     public void onScanResult(int callbackType, ScanResult result) {
//         BluetoothDevice device = result.getDevice();
//         Log.i(LOG_TAG, "DiscoverPeripheral: " + device.getName());
//         // ...do whatever you want with this found device
//     }

//     @Override
//     public void onBatchScanResults(List<ScanResult> results) {
//         // Ignore for now
//     }

//     @Override
//     public void onScanFailed(int errorCode) {
//         // Ignore for now
//         Log.i(LOG_TAG, "Scan Failed: ");
//     }
// };
  }