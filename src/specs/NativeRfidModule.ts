import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type RfidTag = {
  epc: string;
  rssi: number;
  timestampMs: number;
};

export interface Spec extends TurboModule {
  initialize(): Promise<boolean>;
  release(): Promise<boolean>;
  isHardwareAvailable(): Promise<boolean>;
  setMockMode(enabled: boolean): Promise<boolean>;
  getMode(): Promise<string>;
  setPower(level: number): Promise<number>;
  readSingleTag(): Promise<RfidTag | null>;
  startContinuousScan(intervalMs: number): Promise<boolean>;
  stopContinuousScan(): Promise<boolean>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.get<Spec>('RfidModule');
