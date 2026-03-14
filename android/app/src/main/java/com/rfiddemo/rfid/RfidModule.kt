package com.rfiddemo.rfid

import com.rfiddemo.NativeRfidModuleSpec
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit

@ReactModule(name = RfidModule.NAME)
class RfidModule(reactContext: ReactApplicationContext) : NativeRfidModuleSpec(reactContext) {

  private var scanner: RfidScanner = DeviceRfidScanner()
  private var mockMode = false
  private var initialized = false
  private var scheduler: ScheduledExecutorService? = null

  companion object {
    const val NAME = "RfidModule"
    const val EVENT_TAG_SCANNED = "rfid:onTag"
  }

  override fun getName(): String = NAME

  @ReactMethod
  override fun initialize(promise: Promise) {
    runCatching {
      scanner.initialize()
      initialized = true
      true
    }.onSuccess {
      promise.resolve(it)
    }.onFailure {
      initialized = false

      // Some OEM SDK builds can throw runtime NPEs during init on unsupported devices.
      // Keep app stable by falling back to mock mode automatically.
      if (!mockMode) {
        runCatching {
          scanner.release()
          scanner = MockRfidScanner()
          scanner.initialize()
          mockMode = true
          initialized = true
          emitWarning("Hardware initialization failed. Switched to mock mode.")
          true
        }.onSuccess {
          promise.resolve(it)
        }.onFailure { fallbackError ->
          promise.reject("INIT_FAILED", safeError(fallbackError), fallbackError)
        }
      } else {
        promise.reject("INIT_FAILED", safeError(it), it)
      }
    }
  }

  @ReactMethod
  override fun release(promise: Promise) {
    stopContinuousInternal()
    runCatching {
      scanner.release()
      initialized = false
      true
    }.onSuccess {
      promise.resolve(it)
    }.onFailure {
      promise.reject("RELEASE_FAILED", safeError(it), it)
    }
  }

  @ReactMethod
  override fun isHardwareAvailable(promise: Promise) {
    promise.resolve(DeviceRfidScanner().isHardwareAvailable())
  }

  @ReactMethod
  override fun setMockMode(enabled: Boolean, promise: Promise) {
    stopContinuousInternal()

    runCatching {
      scanner.release()
    }

    scanner = if (enabled) MockRfidScanner() else DeviceRfidScanner()
    mockMode = enabled
    initialized = false
    promise.resolve(mockMode)
  }

  @ReactMethod
  override fun getMode(promise: Promise) {
    promise.resolve(if (mockMode) "mock" else "hardware")
  }

  @ReactMethod
  override fun setPower(level: Double, promise: Promise) {
    if (!initialized) {
      promise.reject("NOT_INITIALIZED", "Reader is not initialized")
      return
    }

    runCatching {
      val safeLevel = level.toInt().coerceIn(1, 30)
      scanner.setPower(safeLevel)
      safeLevel
    }.onSuccess {
      promise.resolve(it)
    }.onFailure {
      promise.reject("SET_POWER_FAILED", safeError(it), it)
    }
  }

  @ReactMethod
  override fun readSingleTag(promise: Promise) {
    if (!initialized) {
      promise.reject("NOT_INITIALIZED", "Reader is not initialized")
      return
    }

    runCatching {
      scanner.readSingleTag()?.toWritableMap()
    }.onSuccess {
      promise.resolve(it)
    }.onFailure {
      promise.reject("READ_FAILED", safeError(it), it)
    }
  }

  @ReactMethod
  override fun startContinuousScan(intervalMs: Double, promise: Promise) {
    if (!initialized) {
      promise.reject("NOT_INITIALIZED", "Reader is not initialized")
      return
    }

    stopContinuousInternal()

    val period = intervalMs.toLong().coerceIn(80L, 1000L)
    scheduler = Executors.newSingleThreadScheduledExecutor()
    scheduler?.scheduleWithFixedDelay({
      runCatching { scanner.readSingleTag() }
        .onSuccess { tag ->
          if (tag != null) {
            emitTag(tag)
          }
        }
        .onFailure { err ->
          emitError(err)
          stopContinuousInternal()
        }
    }, 0L, period, TimeUnit.MILLISECONDS)

    promise.resolve(true)
  }

  @ReactMethod
  override fun stopContinuousScan(promise: Promise) {
    stopContinuousInternal()
    promise.resolve(true)
  }

  @ReactMethod
  override fun addListener(eventName: String) {
    // Required for RN Event Emitter compatibility.
  }

  @ReactMethod
  override fun removeListeners(count: Double) {
    // Required for RN Event Emitter compatibility.
  }

  override fun invalidate() {
    stopContinuousInternal()
    runCatching { scanner.release() }
    initialized = false
    super.invalidate()
  }

  private fun stopContinuousInternal() {
    scheduler?.shutdownNow()
    scheduler = null
  }

  private fun emitTag(tag: RfidTag) {
    val map = tag.toWritableMap()
    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(EVENT_TAG_SCANNED, map)
  }

  private fun emitError(error: Throwable) {
    val map = Arguments.createMap().apply {
      putString("code", "SCAN_ERROR")
      putString("message", safeError(error))
    }
    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("rfid:onError", map)
  }

  private fun emitWarning(message: String) {
    val map = Arguments.createMap().apply {
      putString("code", "SCAN_WARNING")
      putString("message", message)
    }
    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("rfid:onError", map)
  }

  private fun safeError(error: Throwable): String {
    val msg = error.message
    return if (msg.isNullOrBlank()) error.javaClass.simpleName else msg
  }

  private fun RfidTag.toWritableMap(): WritableMap {
    return Arguments.createMap().apply {
      putString("epc", epc)
      putInt("rssi", rssi)
      putDouble("timestampMs", timestampMs.toDouble())
    }
  }
}
