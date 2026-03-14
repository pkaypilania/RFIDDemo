package com.rfiddemo.rfid

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class RfidPackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == RfidModule.NAME) {
      RfidModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos = HashMap<String, ReactModuleInfo>()
      moduleInfos[RfidModule.NAME] = ReactModuleInfo(
        RfidModule.NAME,
        RfidModule::class.java.name,
        false,
        false,
        true,
        false,
        true,
      )
      moduleInfos
    }
  }
}
