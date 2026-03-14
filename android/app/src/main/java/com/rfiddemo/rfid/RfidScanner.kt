package com.rfiddemo.rfid

interface RfidScanner {
  fun isHardwareAvailable(): Boolean
  @Throws(Exception::class)
  fun initialize()
  @Throws(Exception::class)
  fun setPower(level: Int)
  @Throws(Exception::class)
  fun readSingleTag(): RfidTag?
  fun release()
}
