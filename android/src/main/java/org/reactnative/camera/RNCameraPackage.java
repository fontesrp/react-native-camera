package org.reactnative.camera;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.lwansbrough.RCTCamera.RCTCameraModule;
import com.lwansbrough.RCTCamera.RCTCameraViewManager;

import org.reactnative.facedetector.FaceDetectorModule;

import java.util.Arrays;
import java.util.List;

public class RNCameraPackage implements ReactPackage {
  @NonNull
  @Override
  public List<NativeModule> createNativeModules(
    @NonNull ReactApplicationContext reactApplicationContext
  ) {
    return Arrays.asList(
      new RCTCameraModule(reactApplicationContext),
      new CameraModule(reactApplicationContext),
      new FaceDetectorModule(reactApplicationContext)
    );
  }

  @NonNull
  @Override
  @SuppressWarnings("rawtypes")
  public List<ViewManager> createViewManagers(
    @NonNull ReactApplicationContext reactApplicationContext
  ) {
    return Arrays.asList(
      new RCTCameraViewManager(),
      new CameraViewManager()
    );
  }
}
