import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

import type { FaceFeature } from '../src/FaceDetector';
import type {
  Constants,
  HardwareCamera,
  RecordResponse,
  RNCameraProps,
  TakePictureResponse
} from './index';

type Orientation = 'auto' | 'landscapeLeft' | 'landscapeRight' | 'portrait' | 'portraitUpsideDown';
type OrientationNumber = 1 | 2 | 3 | 4;

type PictureOptions = {
  quality?: number;
  orientation?: Orientation | OrientationNumber;
  base64?: boolean;
  mirrorImage?: boolean;
  exif?: boolean;
  writeExif?: boolean | { [name: string]: any };
  width?: number;
  fixOrientation?: boolean;
  forceUpOrientation?: boolean;
  pauseAfterCapture?: boolean;
};

type TrackedFaceFeature = FaceFeature & {
  faceID?: number;
};

type TrackedTextFeature = {
  type: string;
  bounds: {
    size: {
      width: number;
      height: number;
    };
    origin: {
      x: number;
      y: number;
    };
  };
  value: string;
  components: Array<TrackedTextFeature>;
};

type TrackedBarcodeFeature = {
  bounds: {
    size: {
      width: number;
      height: number;
    };
    origin: {
      x: number;
      y: number;
    };
  };
  data: string;
  dataRaw: string;
  type: BarcodeType;
  format?: string;
  addresses?: {
    addressesType?: 'UNKNOWN' | 'Work' | 'Home';
    addressLines?: string[];
  }[];
  emails?: Email[];
  phones?: Phone[];
  urls?: string[];
  name?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    prefix?: string;
    pronounciation?: string;
    suffix?: string;
    formattedName?: string;
  };
  phone?: Phone;
  organization?: string;
  latitude?: number;
  longitude?: number;
  ssid?: string;
  password?: string;
  encryptionType?: string;
  title?: string;
  url?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  addressCity?: string;
  addressState?: string;
  addressStreet?: string;
  addressZip?: string;
  birthDate?: string;
  documentType?: string;
  licenseNumber?: string;
  expiryDate?: string;
  issuingDate?: string;
  issuingCountry?: string;
  eventDescription?: string;
  location?: string;
  organizer?: string;
  status?: string;
  summary?: string;
  start?: string;
  end?: string;
  email?: Email;
  phoneNumber?: string;
  message?: string;
};

type BarcodeType =
  | 'EMAIL'
  | 'PHONE'
  | 'CALENDAR_EVENT'
  | 'DRIVER_LICENSE'
  | 'GEO'
  | 'SMS'
  | 'CONTACT_INFO'
  | 'WIFI'
  | 'TEXT'
  | 'ISBN'
  | 'PRODUCT'
  | 'URL';

type Email = {
  address?: string;
  body?: string;
  subject?: string;
  emailType?: 'UNKNOWN' | 'Work' | 'Home';
};

type Phone = {
  number?: string;
  phoneType?: 'UNKNOWN' | 'Work' | 'Home' | 'Fax' | 'Mobile';
};

type RecordingOptions = {
  maxDuration?: number;
  maxFileSize?: number;
  orientation?: Orientation;
  quality?: number | string;
  fps?: number;
  codec?: string;
  mute?: boolean;
  path?: string;
  videoBitrate?: number;
};

type EventCallbackArgumentsType = {
  nativeEvent: { [key: string]: any };
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface GoogleVisionBarcodesDetectedParams {
  barcodes: Array<TrackedBarcodeFeature>;
}

interface SubjectAreaChangedPreviousPoint {
  x: number;
  y: number;
}

interface SubjectAreaChangedNativeEvent {
  prevPoint: SubjectAreaChangedPreviousPoint;
}

interface SubjectAreaChangedParams {
  nativeEvent: SubjectAreaChangedNativeEvent;
}

interface FacesDetectedParams {
  faces: Array<TrackedFaceFeature>;
}

interface TextRecognizedParams {
  textBlocks: Array<TrackedTextFeature>;
}

type PropsType = ViewProps & {
  children: ViewProps['children'] | Function;
  zoom?: number;
  useNativeZoom?: boolean;
  maxZoom?: number;
  ratio?: string;
  focusDepth?: number;
  type?: number | string;
  onCameraReady?: Function;
  onAudioInterrupted?: Function;
  onAudioConnected?: Function;
  onBarCodeRead?: Function;
  onMountError?: (value: EventCallbackArgumentsType['nativeEvent']) => void;
  onPictureTaken?: Function;
  onPictureSaved?: Function;
  onRecordingStart?: Function;
  onRecordingEnd?: Function;
  onTap?: Function;
  onDoubleTap?: Function;
  onGoogleVisionBarcodesDetected?: (value: GoogleVisionBarcodesDetectedParams) => void;
  onSubjectAreaChanged?: (value: SubjectAreaChangedParams) => void;
  faceDetectionMode?: number;
  trackingEnabled?: boolean;
  flashMode?: number | string;
  exposure?: number;
  barCodeTypes?: Array<string>;
  googleVisionBarcodeType?: number;
  googleVisionBarcodeMode?: number;
  whiteBalance?:
    | number
    | string
    | {
        temperature: number;
        tint: number;
        redGainOffset?: number;
        greenGainOffset?: number;
        blueGainOffset?: number;
      };
  faceDetectionLandmarks?: number;
  autoFocus?: string | boolean | number;
  autoFocusPointOfInterest?: { x: number; y: number };
  faceDetectionClassifications?: number;
  onFacesDetected?: (value: FacesDetectedParams) => void;
  onTextRecognized?: (value: TextRecognizedParams) => void;
  captureAudio?: boolean;
  keepAudioSession?: boolean;
  useCamera2Api?: boolean;
  playSoundOnCapture?: boolean;
  playSoundOnRecord?: boolean;
  videoStabilizationMode?: number | string;
  pictureSize?: string;
  rectOfInterest: Rect;
  permissionDialogTitle: string;
  permissionDialogMessage: string;
  androidCameraPermissionOptions: RNCameraProps['androidCameraPermissionOptions'];
  androidRecordAudioPermissionOptions: RNCameraProps['androidRecordAudioPermissionOptions'];
};

type FaceDetectionOverride = Constants['FaceDetection'] & {
  fast: number;
};

type GoogleVisionBarcodeDetectionOverride = Constants['GoogleVisionBarcodeDetection'] & {
  BarcodeType: Constants['GoogleVisionBarcodeDetection']['BarcodeType'] & { None: number };
};

interface CameraManagerInterface extends Constants {
  CaptureTarget: number;
  Exposure: number;
  FaceDetection: FaceDetectionOverride;
  GoogleVisionBarcodeDetection: GoogleVisionBarcodeDetectionOverride;
  takePicture: (
    options: PictureOptions,
    cameraHandle?: number | null
  ) => Promise<TakePictureResponse>;
  getSupportedRatios: (cameraHandle?: number | null) => Promise<string[]>;
  getCameraIds: (cameraHandle?: number | null) => Promise<HardwareCamera[]>;
  checkIfVideoIsValid: (path: string) => Promise<boolean>;
  getSupportedPreviewFpsRange: (cameraHandle?: number | null) => Promise<string[]>;
  getAvailablePictureSizes: (ratio?: string, cameraHandle?: number | null) => Promise<string[]>;
  record: (options: RecordingOptions, cameraHandle?: number | null) => Promise<RecordResponse>;
  stopRecording: (cameraHandle?: number | null) => void;
  pauseRecording: (cameraHandle?: number | null) => void;
  resumeRecording: (cameraHandle?: number | null) => void;
  pausePreview: (cameraHandle?: number | null) => void;
  isRecording: (cameraHandle?: number | null) => void;
  resumePreview: (cameraHandle?: number | null) => void;
  hasTorch: () => Promise<boolean>;
}

interface RNCameraNativeProps {
  style: Object;
  onMountError: (value: EventCallbackArgumentsType) => void;
  onCameraReady: (value: EventCallbackArgumentsType) => void;
  onAudioInterrupted: () => void;
  onAudioConnected: () => void;
  onGoogleVisionBarcodesDetected: (value: EventCallbackArgumentsType) => void;
  onBarCodeRead: (value: EventCallbackArgumentsType) => void;
  onTouch: (value: EventCallbackArgumentsType) => void;
  onFacesDetected: (value: EventCallbackArgumentsType) => void;
  onTextRecognized: (value: EventCallbackArgumentsType) => void;
  onPictureSaved: (value: EventCallbackArgumentsType) => void;
  onSubjectAreaChanged: (value: any) => void;
}
