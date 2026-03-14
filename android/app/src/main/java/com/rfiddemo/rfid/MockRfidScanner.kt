package com.rfiddemo.rfid

import kotlin.random.Random

class MockRfidScanner : RfidScanner {
  private var initialized = false

  override fun isHardwareAvailable(): Boolean = true

  override fun initialize() {
    initialized = true
  }

  override fun setPower(level: Int) {
    if (!initialized) {
      throw IllegalStateException("Mock scanner not initialized")
    }
  }

  override fun readSingleTag(): RfidTag {
    if (!initialized) {
      throw IllegalStateException("Mock scanner not initialized")
    }

    val epc = buildString {
      repeat(4) {
        append(Random.nextInt(0, 0xFFFF).toString(16).padStart(4, '0').uppercase())
      }
    }
    val rssi = -70 + Random.nextInt(35)
    return RfidTag(epc = epc, rssi = rssi, timestampMs = System.currentTimeMillis())
  }

  override fun release() {
    initialized = false
  }
}
