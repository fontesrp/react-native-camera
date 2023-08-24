import React from 'react'
import {
  findNodeHandle,
  NativeModules,
  Platform,
  requireNativeComponent,
  StyleSheet,
  View
} from 'react-native'

import PropTypes from 'prop-types'

import type {
  CameraManagerInterface,
  EventCallbackArgumentsType,
  PictureOptions,
  PropsType,
  RecordingOptions,
  RNCameraNativeProps
} from '../types/RNCamera'

const CameraManager: CameraManagerInterface = NativeModules.RNCameraModule || {
  stubbed: true,
  Type: { back: 1 },
  AutoFocus: { on: 1 },
  FlashMode: { off: 1 },
  WhiteBalance: {},
  BarCodeType: {},
  FaceDetection: { fast: 1, Mode: {}, Landmarks: { none: 0 }, Classifications: { none: 0 } },
  GoogleVisionBarcodeDetection: { BarcodeType: 0, BarcodeMode: 0 }
}

const EventThrottleMs = 500

const mapValues = (input: any, mapper: any): { [key: string]: any } => {
  const result = {}
  Object.entries(input).map(([key, value]) => {
    result[key] = mapper(value, key)
  })
  return result
}

const hasTorch = () => CameraManager.hasTorch()

const RNCamera = requireNativeComponent<RNCameraNativeProps>('RNCamera')

class Camera extends React.Component<PropsType> {
  static Constants = {
    AutoFocus: CameraManager.AutoFocus,
    BarCodeType: CameraManager.BarCodeType,
    CaptureTarget: CameraManager.CaptureTarget,
    FaceDetection: CameraManager.FaceDetection,
    FlashMode: CameraManager.FlashMode,
    GoogleVisionBarcodeDetection: CameraManager.GoogleVisionBarcodeDetection,
    ImageType: CameraManager.ImageType,
    Orientation: {
      auto: 'auto',
      landscapeLeft: 'landscapeLeft',
      landscapeRight: 'landscapeRight',
      portrait: 'portrait',
      portraitUpsideDown: 'portraitUpsideDown'
    },
    Type: CameraManager.Type,
    VideoCodec: CameraManager.VideoCodec,
    VideoQuality: CameraManager.VideoQuality,
    VideoStabilization: CameraManager.VideoStabilization,
    WhiteBalance: CameraManager.WhiteBalance
  }

  // Values under keys from this object will be transformed to native options
  static ConversionTables = {
    autoFocus: CameraManager.AutoFocus,
    exposure: CameraManager.Exposure,
    faceDetectionClassifications: (CameraManager.FaceDetection || {}).Classifications,
    faceDetectionLandmarks: (CameraManager.FaceDetection || {}).Landmarks,
    faceDetectionMode: (CameraManager.FaceDetection || {}).Mode,
    flashMode: CameraManager.FlashMode,
    googleVisionBarcodeMode: (CameraManager.GoogleVisionBarcodeDetection || {}).BarcodeMode,
    googleVisionBarcodeType: (CameraManager.GoogleVisionBarcodeDetection || {}).BarcodeType,
    type: CameraManager.Type,
    videoStabilizationMode: CameraManager.VideoStabilization || {},
    whiteBalance: CameraManager.WhiteBalance
  }

  static propTypes = {
    autoFocus: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    autoFocusPointOfInterest: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
    barCodeTypes: PropTypes.arrayOf(PropTypes.string),
    cameraId: PropTypes.string,
    captureAudio: PropTypes.bool,
    defaultVideoQuality: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    exposure: PropTypes.number,
    faceDetectionClassifications: PropTypes.number,
    faceDetectionLandmarks: PropTypes.number,
    faceDetectionMode: PropTypes.number,
    flashMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    focusDepth: PropTypes.number,
    googleVisionBarcodeMode: PropTypes.number,
    googleVisionBarcodeType: PropTypes.number,
    keepAudioSession: PropTypes.bool,
    maxZoom: PropTypes.number,
    mirrorVideo: PropTypes.bool,
    onAudioConnected: PropTypes.func,
    onAudioInterrupted: PropTypes.func,
    onBarCodeRead: PropTypes.func,
    onCameraReady: PropTypes.func,
    onDoubleTap: PropTypes.func,
    onFacesDetected: PropTypes.func,
    onGoogleVisionBarcodesDetected: PropTypes.func,
    onMountError: PropTypes.func,
    onPictureSaved: PropTypes.func,
    onPictureTaken: PropTypes.func,
    onRecordingEnd: PropTypes.func,
    onRecordingStart: PropTypes.func,
    onSubjectAreaChanged: PropTypes.func,
    onTap: PropTypes.func,
    onTextRecognized: PropTypes.func,
    permissionDialogMessage: PropTypes.string,
    permissionDialogTitle: PropTypes.string,
    pictureSize: PropTypes.string,
    playSoundOnCapture: PropTypes.bool,
    playSoundOnRecord: PropTypes.bool,
    ratio: PropTypes.string,
    rectOfInterest: PropTypes.any,
    trackingEnabled: PropTypes.bool,
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    useCamera2Api: PropTypes.bool,
    useNativeZoom: PropTypes.bool,
    videoStabilizationMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    whiteBalance: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({
        blueGainOffset: PropTypes.number,
        greenGainOffset: PropTypes.number,
        redGainOffset: PropTypes.number,
        temperature: PropTypes.number,
        tint: PropTypes.number
      })
    ]),
    zoom: PropTypes.number
  }

  static defaultProps: Object = {
    autoFocus: CameraManager.AutoFocus.on,
    barCodeTypes: Object.values(CameraManager.BarCodeType),
    cameraId: '',
    captureAudio: true,
    exposure: -1,
    faceDetectionClassifications: CameraManager.FaceDetection?.Classifications?.none,
    faceDetectionLandmarks: CameraManager.FaceDetection?.Landmarks?.none,
    faceDetectionMode: CameraManager.FaceDetection?.fast,
    flashMode: CameraManager.FlashMode.off,
    focusDepth: 0,
    googleVisionBarcodeMode: CameraManager.GoogleVisionBarcodeDetection?.BarcodeMode?.NORMAL,
    googleVisionBarcodeType: CameraManager.GoogleVisionBarcodeDetection?.BarcodeType?.None,
    keepAudioSession: false,
    maxZoom: 0,
    mirrorVideo: false,
    permissionDialogMessage: '',
    permissionDialogTitle: '',
    pictureSize: 'None',
    playSoundOnCapture: false,
    playSoundOnRecord: false,
    ratio: '4:3',
    type: CameraManager.Type.back,
    useCamera2Api: false,
    useNativeZoom: false,
    videoStabilizationMode: 0,
    whiteBalance: CameraManager.WhiteBalance.auto,
    zoom: 0
  }

  static async checkIfVideoIsValid(path) {
    if (Platform.OS === 'android') {
      return await CameraManager.checkIfVideoIsValid(path)
    } else {
      return true // iOS: not implemented
    }
  }

  _cameraHandle?: number | null
  _cameraRef?: Object | null
  _lastEvents: { [key: string]: string }
  _lastEventsTimes: { [key: string]: Date }

  constructor(props: PropsType) {
    super(props)
    this._lastEvents = {}
    this._lastEventsTimes = {}
  }

  _convertNativeProps({ children, ...props }: PropsType): { [key: string]: any } {
    const newProps = mapValues(props, this._convertProp)

    if (props.onBarCodeRead) {
      newProps.barCodeScannerEnabled = true
    }

    if (props.onGoogleVisionBarcodesDetected) {
      newProps.googleVisionBarcodeDetectorEnabled = true
    }

    if (props.onFacesDetected) {
      newProps.faceDetectorEnabled = true
    }

    if (props.onTap || props.onDoubleTap) {
      newProps.touchDetectorEnabled = true
    }

    if (props.onTextRecognized) {
      newProps.textRecognizerEnabled = true
    }

    if (Platform.OS === 'ios') {
      delete newProps.ratio
    }

    return newProps
  }

  _convertProp(value: any, key: string) {
    if (typeof value === 'string' && Camera.ConversionTables[key]) {
      return Camera.ConversionTables[key][value]
    }

    return value
  }

  _onAudioConnected = () => {
    this.props.onAudioConnected?.()
  }

  _onAudioInterrupted = () => {
    this.props.onAudioInterrupted?.()
  }

  _onCameraReady = () => {
    this.props.onCameraReady?.()
  }

  _onMountError = ({ nativeEvent }: EventCallbackArgumentsType) => {
    if (this.props.onMountError) {
      this.props.onMountError(nativeEvent)
    }
  }

  _onObjectDetected =
    (callback?: Function) =>
    ({ nativeEvent }: EventCallbackArgumentsType) => {
      const { type } = nativeEvent
      if (
        this._lastEvents[type] &&
        this._lastEventsTimes[type] &&
        JSON.stringify(nativeEvent) === this._lastEvents[type] &&
        new Date().getTime() - this._lastEventsTimes[type].getTime() < EventThrottleMs
      ) {
        return
      }

      if (callback) {
        callback(nativeEvent)
        this._lastEventsTimes[type] = new Date()
        this._lastEvents[type] = JSON.stringify(nativeEvent)
      }
    }

  _onPictureSaved = ({ nativeEvent }: EventCallbackArgumentsType) => {
    this.props.onPictureSaved?.(nativeEvent)
  }

  _onTouch = ({ nativeEvent }: EventCallbackArgumentsType) => {
    if (this.props.onTap && !nativeEvent.isDoubleTap) {
      this.props.onTap(nativeEvent.touchOrigin)
    }
    if (this.props.onDoubleTap && nativeEvent.isDoubleTap) {
      this.props.onDoubleTap(nativeEvent.touchOrigin)
    }
  }

  _onSubjectAreaChanged = e => {
    if (this.props.onSubjectAreaChanged) {
      this.props.onSubjectAreaChanged(e)
    }
  }

  _setReference = (ref?: any) => {
    if (ref) {
      this._cameraRef = ref
      this._cameraHandle = findNodeHandle(ref)
    } else {
      this._cameraRef = null
      this._cameraHandle = null
    }
  }

  getAvailablePictureSizes = async (): Promise<string[]> => {
    //$FlowFixMe
    return await CameraManager.getAvailablePictureSizes(this.props.ratio, this._cameraHandle)
  }

  async getCameraIdsAsync() {
    if (Platform.OS === 'android') {
      return await CameraManager.getCameraIds(this._cameraHandle)
    } else {
      return await CameraManager.getCameraIds() // iOS does not need a camera instance
    }
  }

  getSupportedPreviewFpsRange = async (): Promise<string[]> => {
    if (Platform.OS === 'android') {
      return await CameraManager.getSupportedPreviewFpsRange(this._cameraHandle)
    } else {
      throw new Error('getSupportedPreviewFpsRange is not supported on iOS')
    }
  }

  async getSupportedRatiosAsync() {
    if (Platform.OS === 'android') {
      return await CameraManager.getSupportedRatios(this._cameraHandle)
    } else {
      throw new Error('Ratio is not supported on iOS')
    }
  }

  // FaCC = Function as Child Component;
  hasFaCC = () => typeof this.props.children === 'function'

  isRecording() {
    return CameraManager.isRecording(this._cameraHandle)
  }

  pausePreview() {
    CameraManager.pausePreview(this._cameraHandle)
  }

  pauseRecording() {
    CameraManager.pauseRecording(this._cameraHandle)
  }

  async recordAsync(options?: RecordingOptions) {
    if (!options || typeof options !== 'object') {
      options = {}
    } else if (typeof options.quality === 'string') {
      options.quality = Camera.Constants.VideoQuality[options.quality]
    }
    if (options.orientation) {
      if (typeof options.orientation !== 'number') {
        const { orientation } = options
        options.orientation = CameraManager.Orientation[orientation]
        if (__DEV__) {
          if (typeof options.orientation !== 'number') {
            // eslint-disable-next-line no-console
            console.warn(`Orientation '${orientation}' is invalid.`)
          }
        }
      }
    }

    if (__DEV__) {
      if (options.videoBitrate && typeof options.videoBitrate !== 'number') {
        // eslint-disable-next-line no-console
        console.warn('Video Bitrate should be a positive integer')
      }
    }

    const { captureAudio } = this.props

    options.mute = !captureAudio

    return await CameraManager.record(options, this._cameraHandle)
  }

  renderChildren = () => {
    if (this.hasFaCC()) {
      const children = this.props.children as Function
      return children?.({ camera: this })
    }
    return this.props.children
  }

  resumePreview() {
    CameraManager.resumePreview(this._cameraHandle)
  }

  resumeRecording() {
    CameraManager.resumeRecording(this._cameraHandle)
  }

  stopRecording() {
    CameraManager.stopRecording(this._cameraHandle)
  }

  async takePictureAsync(options?: PictureOptions) {
    if (!options) {
      options = {}
    }
    if (!options.quality) {
      options.quality = 1
    }

    if (options.orientation) {
      if (typeof options.orientation !== 'number') {
        const { orientation } = options
        options.orientation = CameraManager.Orientation[orientation]
        if (__DEV__) {
          if (typeof options.orientation !== 'number') {
            // eslint-disable-next-line no-console
            console.warn(`Orientation '${orientation}' is invalid.`)
          }
        }
      }
    }

    if (options.pauseAfterCapture === undefined) {
      options.pauseAfterCapture = false
    }

    if (!this._cameraHandle) {
      throw 'Camera handle cannot be null'
    }

    return await CameraManager.takePicture(options, this._cameraHandle)
  }

  render() {
    const { style, ...nativeProps } = this._convertNativeProps(this.props)

    return (
      <View style={style}>
        <RNCamera
          {...nativeProps}
          onAudioConnected={this._onAudioConnected}
          onAudioInterrupted={this._onAudioInterrupted}
          onBarCodeRead={this._onObjectDetected(this.props.onBarCodeRead)}
          onCameraReady={this._onObjectDetected(this._onCameraReady)}
          onFacesDetected={this._onObjectDetected(this.props.onFacesDetected)}
          onGoogleVisionBarcodesDetected={this._onObjectDetected(
            this.props.onGoogleVisionBarcodesDetected
          )}
          onMountError={this._onMountError}
          onPictureSaved={this._onPictureSaved}
          onSubjectAreaChanged={this._onSubjectAreaChanged}
          onTextRecognized={this._onObjectDetected(this.props.onTextRecognized)}
          onTouch={this._onTouch}
          ref={this._setReference}
          style={StyleSheet.absoluteFill}
        />
        {this.renderChildren()}
      </View>
    )
  }
}

const CameraConstants = Camera.Constants

export { Camera as default, CameraConstants as Constants, hasTorch }
