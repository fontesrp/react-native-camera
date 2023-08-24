import { NativeModules } from 'react-native'

import type { Constants, Face } from '../types'

type DetectionOptions = {
  mode?: string
  detectLandmarks?: string
  runClassifications?: string
}

type FaceDetectorModuleType = Constants['FaceDetection'] & {
  detectFaces: (value: DetectionOptions & { uri: string }) => Promise<Face[]>
}

const faceDetectionDisabledMessage = 'Face detection has not been included in this build.'

const FaceDetectorModule: FaceDetectorModuleType = NativeModules.RNFaceDetector || {
  stubbed: true,
  Mode: {},
  Landmarks: {},
  Classifications: {},
  detectFaces: () => new Promise((_, reject) => reject(faceDetectionDisabledMessage))
}

type Point = { x: number; y: number }

export type FaceFeature = {
  bounds: {
    size: {
      width: number
      height: number
    }
    origin: Point
  }
  smilingProbability?: number
  leftEarPosition?: Point
  rightEarPosition?: Point
  leftEyePosition?: Point
  leftEyeOpenProbability?: number
  rightEyePosition?: Point
  rightEyeOpenProbability?: number
  leftCheekPosition?: Point
  rightCheekPosition?: Point
  leftMouthPosition?: Point
  mouthPosition?: Point
  rightMouthPosition?: Point
  bottomMouthPosition?: Point
  noseBasePosition?: Point
  yawAngle?: number
  rollAngle?: number
}

export default class FaceDetector {
  static Constants: Constants['FaceDetection'] = {
    Mode: FaceDetectorModule.Mode,
    Landmarks: FaceDetectorModule.Landmarks,
    Classifications: FaceDetectorModule.Classifications
  }

  static detectFacesAsync(uri: string, options?: DetectionOptions): Promise<Array<FaceFeature>> {
    return FaceDetectorModule.detectFaces({ ...options, uri })
  }
}

const FaceDetectorConstants = FaceDetector.Constants

export { FaceDetectorConstants as Constants }
