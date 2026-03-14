import React from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDashboard from './useDashboard';
import styles from './style';

function formatTime(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleTimeString();
}

export default function Dashboard() {
  const {
    mode,
    status,
    power,
    isMockMode,
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
  } = useDashboard();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />
      <View style={styles.container}>
        <Text style={styles.title}>RFID Demo</Text>
        <Text style={styles.mode}>Mode: {mode.toUpperCase()}</Text>
        <Text style={styles.status}>{status}</Text>
        <Text style={styles.summary}>
          Total Reads: {totalReads} | Unique Tags: {tags.length}
        </Text>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Use Mock Mode</Text>
          <Switch value={isMockMode} onValueChange={toggleMockMode} />
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Power: {power}</Text>
          <View style={styles.rowButtons}>
            <Pressable
              style={styles.smallButton}
              onPress={() => setPowerDelta(-1)}
            >
              <Text style={styles.buttonText}>-</Text>
            </Pressable>
            <Pressable
              style={styles.smallButton}
              onPress={() => setPowerDelta(1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.rowButtons}>
          <Pressable style={styles.button} onPress={initialize}>
            <Text style={styles.buttonText}>Initialize</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={singleScan}>
            <Text style={styles.buttonText}>Single Scan</Text>
          </Pressable>
        </View>

        <View style={styles.rowButtons}>
          <Pressable
            style={[styles.button, isContinuousScanning && styles.buttonMuted]}
            onPress={startContinuous}
          >
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={stopContinuous}>
            <Text style={styles.buttonText}>Stop</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={clearList}>
            <Text style={styles.buttonText}>Clear</Text>
          </Pressable>
        </View>

        <FlatList
          style={styles.list}
          data={tags}
          keyExtractor={item => item.epc}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.epc}>{item.epc}</Text>
              <Text style={styles.meta}>RSSI: {item.rssi}</Text>
              <Text style={styles.meta}>Seen: {item.seenCount}</Text>
              <Text style={styles.meta}>Last: {formatTime(item.lastSeen)}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
