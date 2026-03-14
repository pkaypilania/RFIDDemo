import { DeviceEventEmitter, Platform } from 'react-native';
import RfidModuleSpec, {
  type RfidTag,
  type Spec,
} from '../specs/NativeRfidModule';

export type ScanListener = (tag: RfidTag) => void;
export type ErrorListener = (error: {
  code?: string;
  message?: string;
}) => void;

const isAndroid = Platform.OS === 'android';

function ensureAndroid() {
  if (!isAndroid) {
    throw new Error('RFID is only supported on Android.');
  }
  if (!RfidModuleSpec) {
    throw new Error(
      'RfidModule native binding is unavailable. Rebuild Android app.',
    );
  }
}

function nativeModule(): Spec {
  ensureAndroid();
  return RfidModuleSpec as Spec;
}

export const RfidModule = {
  async initialize() {
    return nativeModule().initialize();
  },

  async release() {
    return nativeModule().release();
  },

  async isHardwareAvailable() {
    return nativeModule().isHardwareAvailable();
  },

  async setMockMode(enabled: boolean) {
    return nativeModule().setMockMode(enabled);
  },

  async getMode() {
    return nativeModule().getMode();
  },

  async setPower(level: number) {
    return nativeModule().setPower(level);
  },

  async readSingleTag() {
    return nativeModule().readSingleTag();
  },

  async startContinuousScan(intervalMs: number) {
    return nativeModule().startContinuousScan(intervalMs);
  },

  async stopContinuousScan() {
    return nativeModule().stopContinuousScan();
  },

  onTagScanned(listener: ScanListener) {
    ensureAndroid();
    return DeviceEventEmitter.addListener('rfid:onTag', listener);
  },

  onError(listener: ErrorListener) {
    ensureAndroid();
    return DeviceEventEmitter.addListener('rfid:onError', listener);
  },
};

export type { RfidTag };
