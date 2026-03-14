package com.rfiddemo.rfid

import com.rscja.deviceapi.RFIDWithUHFUART
import com.rscja.deviceapi.entity.UHFTAGInfo

class DeviceRfidScanner : RfidScanner {
  private var reader: RFIDWithUHFUART? = null

  override fun isHardwareAvailable(): Boolean {
    return try {
      RFIDWithUHFUART.getInstance() != null
    } catch (_: Throwable) {
      false
    }
  }

  override fun initialize() {
    val instance = RFIDWithUHFUART.getInstance()
      ?: throw IllegalStateException("RFID reader instance is null")
    instance.init()
    reader = instance
  }

  override fun setPower(level: Int) {
    val safeLevel = level.coerceIn(1, 30)
    val instance = reader ?: throw IllegalStateException("Reader not initialized")

    try {
      val setPowerMethod = instance.javaClass.getMethod("setPower", Int::class.javaPrimitiveType)
      setPowerMethod.invoke(instance, safeLevel)
      return
    } catch (_: NoSuchMethodException) {
      // Fall back to direct field when SDK exposes power as property.
    }

    val powerField = instance.javaClass.getField("power")
    powerField.setInt(instance, safeLevel)
  }

  override fun readSingleTag(): RfidTag? {
    val instance = reader ?: throw IllegalStateException("Reader not initialized")
    val info = instance.inventorySingleTag() ?: return null

    val epc = readEpc(info)?.trim().orEmpty()
    if (epc.isEmpty()) {
      return null
    }

    return RfidTag(
      epc = epc,
      rssi = readRssi(info) ?: 0,
      timestampMs = System.currentTimeMillis(),
    )
  }

  override fun release() {
    val instance = reader ?: return
    try {
      instance.stopInventory()
    } catch (_: Throwable) {
    }
    try {
      instance.free()
    } catch (_: Throwable) {
    }
    reader = null
  }

  private fun readEpc(info: UHFTAGInfo): String? {
    return readViaMethod(info, "getEPC")
      ?: readViaMethod(info, "getEpc")
      ?: readViaField(info, "epc")
  }

  private fun readRssi(info: UHFTAGInfo): Int? {
    return readViaMethod(info, "getRssi")?.toIntOrNull()
      ?: readViaMethod(info, "getRSSI")?.toIntOrNull()
      ?: readViaField(info, "rssi")?.toIntOrNull()
  }

  private fun readViaMethod(target: Any, methodName: String): String? {
    return try {
      val method = target.javaClass.getMethod(methodName)
      method.invoke(target)?.toString()
    } catch (_: Throwable) {
      null
    }
  }

  private fun readViaField(target: Any, fieldName: String): String? {
    return try {
      val field = target.javaClass.getField(fieldName)
      field.get(target)?.toString()
    } catch (_: Throwable) {
      null
    }
  }
}
