package org.reactnative.camera.tasks;

import com.facebook.react.bridge.WritableArray;

import org.reactnative.facedetector.RNFaceDetector;

public interface FaceDetectorAsyncTaskDelegate {
  void onFacesDetected(WritableArray faces);
  void onFaceDetectionError(RNFaceDetector faceDetector);
  void onFaceDetectingTaskCompleted();
}
