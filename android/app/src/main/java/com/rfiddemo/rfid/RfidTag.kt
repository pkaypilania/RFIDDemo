package com.rfiddemo.rfid

data class RfidTag(
  val epc: String,
  val rssi: Int,
  val timestampMs: Long,
)
