import { useEffect, useMemo, useRef, useState } from 'react';
import { RfidModule, type RfidTag } from '../../native/RfidModule';

type TagItem = {
  epc: string;
  rssi: number;
  lastSeen: number;
  seenCount: number;
};

const SCAN_INTERVAL_MS = 120;
const MAX_TAGS = 500;

export default function useDashboard() {
  const [mode, setMode] = useState<'hardware' | 'mock'>('hardware');
  const [status, setStatus] = useState('Ready');
  const [power, setPower] = useState(10);
  const [isMockMode, setIsMockMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isContinuousScanning, setIsContinuousScanning] = useState(false);
  const [totalReads, setTotalReads] = useState(0);
  const [tagsVersion, setTagsVersion] = useState(0);

  const tagsMapRef = useRef<Map<string, TagItem>>(new Map());

  const tags = useMemo(() => {
    const values = Array.from(tagsMapRef.current.values());
    values.sort((a, b) => b.lastSeen - a.lastSeen);
    return values;
  }, [tagsVersion]);

  useEffect(() => {
    let mounted = true;

    const tagSub = RfidModule.onTagScanned(tag => {
      if (!mounted) {
        return;
      }
      ingestTag(tag);
      setStatus(`Scanned ${tag.epc}`);
    });

    const errSub = RfidModule.onError(err => {
      if (!mounted) {
        return;
      }
      setStatus(`Scan error: ${err.message ?? 'Unknown error'}`);
      setIsContinuousScanning(false);
    });

    (async () => {
      try {
        const available = await RfidModule.isHardwareAvailable();
        if (!available) {
          await RfidModule.setMockMode(true);
          setIsMockMode(true);
          setMode('mock');
          setStatus('RFID hardware not detected. Switched to mock mode.');
        } else {
          setMode('hardware');
          setStatus('RFID hardware detected. Initialize reader to start.');
        }
      } catch (error) {
        setStatus(`Startup error: ${(error as Error).message}`);
      }
    })();

    return () => {
      mounted = false;
      tagSub.remove();
      errSub.remove();
      RfidModule.stopContinuousScan().catch(() => undefined);
      RfidModule.release().catch(() => undefined);
    };
  }, []);

  const ingestTag = (tag: RfidTag) => {
    const map = tagsMapRef.current;
    const existing = map.get(tag.epc);

    if (existing) {
      existing.lastSeen = tag.timestampMs;
      existing.rssi = tag.rssi;
      existing.seenCount += 1;
    } else {
      if (map.size >= MAX_TAGS) {
        const first = map.keys().next().value;
        if (first) {
          map.delete(first);
        }
      }
      map.set(tag.epc, {
        epc: tag.epc,
        rssi: tag.rssi,
        lastSeen: tag.timestampMs,
        seenCount: 1,
      });
    }

    setTotalReads(prev => prev + 1);
    setTagsVersion(prev => prev + 1);
  };

  const initialize = async () => {
    try {
      await RfidModule.initialize();
      const currentMode = await RfidModule.getMode();
      setMode(currentMode === 'mock' ? 'mock' : 'hardware');
      setIsMockMode(currentMode === 'mock');
      setIsInitialized(true);

      if (currentMode === 'mock') {
        setStatus('Hardware init failed or unavailable. Running in mock mode.');
      } else {
        await RfidModule.setPower(power);
        setStatus('Reader initialized successfully.');
      }
    } catch (error) {
      setIsInitialized(false);
      setStatus(`Initialize failed: ${(error as Error).message}`);
    }
  };

  const setPowerDelta = async (delta: number) => {
    const next = Math.min(30, Math.max(1, power + delta));
    setPower(next);
    if (!isInitialized) {
      return;
    }
    try {
      await RfidModule.setPower(next);
      setStatus(`Power set to ${next}`);
    } catch (error) {
      setStatus(`Set power failed: ${(error as Error).message}`);
    }
  };

  const singleScan = async () => {
    if (!isInitialized) {
      setStatus('Initialize reader first.');
      return;
    }

    try {
      const tag = await RfidModule.readSingleTag();
      if (!tag) {
        setStatus('No tag found in range.');
        return;
      }
      ingestTag(tag);
      setStatus(`Single scan: ${tag.epc}`);
    } catch (error) {
      setStatus(`Single scan failed: ${(error as Error).message}`);
    }
  };

  const startContinuous = async () => {
    if (!isInitialized) {
      setStatus('Initialize reader first.');
      return;
    }

    try {
      await RfidModule.startContinuousScan(SCAN_INTERVAL_MS);
      setIsContinuousScanning(true);
      setStatus('Continuous scan started.');
    } catch (error) {
      setIsContinuousScanning(false);
      setStatus(`Start scan failed: ${(error as Error).message}`);
    }
  };

  const stopContinuous = async () => {
    try {
      await RfidModule.stopContinuousScan();
      setIsContinuousScanning(false);
      setStatus('Continuous scan stopped.');
    } catch (error) {
      setStatus(`Stop scan failed: ${(error as Error).message}`);
    }
  };

  const toggleMockMode = async (enabled: boolean) => {
    try {
      await RfidModule.stopContinuousScan();
      await RfidModule.release();
      await RfidModule.setMockMode(enabled);
      setIsMockMode(enabled);
      setMode(enabled ? 'mock' : 'hardware');
      setIsInitialized(false);
      setIsContinuousScanning(false);
      setStatus(enabled ? 'Mock mode enabled.' : 'Hardware mode selected.');
    } catch (error) {
      setStatus(`Mode change failed: ${(error as Error).message}`);
    }
  };

  const clearList = () => {
    tagsMapRef.current.clear();
    setTotalReads(0);
    setTagsVersion(prev => prev + 1);
    setStatus('Tag list cleared.');
  };

  return {
    mode,
    status,
    power,
    isMockMode,
    isInitialized,
    isContinuousScanning,
    totalReads,
    tags,
    initialize,
    setPowerDelta,
    singleScan,
    startContinuous,
    stopContinuous,
    toggleMockMode,
    clearList,
  };
}
