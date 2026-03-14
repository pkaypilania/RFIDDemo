# React Native RFID Demo (Android)

[![Platform](https://img.shields.io/badge/platform-Android-green)](https://developer.android.com/)
[![React Native](https://img.shields.io/badge/React%20Native-0.84-blue)](https://reactnative.dev/)
[![RFID](https://img.shields.io/badge/use%20case-RFID%20Scanning-orange)](#)

Production-ready React Native RFID demo for Android handheld scanners, built with a TurboModule-compatible native bridge and a mock fallback mode.

If you are searching for terms like **react native rfid**, **android rfid sdk**, **rfid handheld scanner app**, or **warehouse asset tracking demo**, this repository is designed as a practical reference implementation.

## Discoverability Checklist (GitHub SEO)
To maximize search visibility for this public repo, configure these in GitHub repository settings:
- Repository name: include `rfid` and `react-native` terms
- Description: mention `React Native RFID Android TurboModule demo`
- Topics: add `react-native`, `rfid`, `android`, `turbomodule`, `inventory-management`, `asset-tracking`, `warehouse`
- Social preview image: add a dashboard screenshot
- Releases: publish tagged releases with clear notes (`v0.1.0`, `v0.2.0`)

These settings are indexed by both GitHub search and external search engines.

## Executive Summary
This project is a production-grade React Native RFID demo designed for real warehouse and asset-tracking scenarios.

It combines:
- A modern React Native UI
- Android native RFID integration through a TurboModule-compatible architecture
- High reliability fallback behavior for non-supported devices
- Fast, memory-conscious tag processing suitable for live demos and field tests

## What Makes This Demo Ready
- Native-feel performance with React Native New Architecture enabled
- Real hardware mode for supported RFID handhelds
- Mock mode fallback for unsupported devices, ensuring demo continuity
- Defensive error handling across initialization, scanning, and mode transitions
- Clean code separation: screen UI, styles, and business logic split by responsibility

## Demo Highlights
### 1. Hardware Compatibility Intelligence
The app detects hardware capability and can switch to mock mode if hardware init fails.

Client impact:
- No demo dead-ends
- Stable behavior even on mixed test devices

### 2. Real-Time RFID Workflows
Supported interactions:
- Initialize reader
- Single tag scan
- Continuous scanning loop
- Stop scan
- Clear session list
- Power tuning (1-30)

Client impact:
- Demonstrates practical floor operations
- Shows tunable performance controls for different environments

### 3. Live Operational Metrics
Dashboard tracks and renders:
- Total reads
- Unique tags
- Per-tag RSSI
- Seen count
- Last seen timestamp

Client impact:
- Instant visibility into scan quality and throughput
- Easy to explain operational behavior during presentations

## Architecture Overview
### Frontend (React Native)
- Dashboard screen: `src/screens/Dashboard/index.tsx`
- Dashboard logic hook: `src/screens/Dashboard/useDashboard.ts`
- Dashboard styles: `src/screens/Dashboard/style.ts`
- App bootstrap: `App.tsx`

### Native Bridge (Android)
- JS wrapper: `src/native/RfidModule.ts`
- TurboModule spec: `src/specs/NativeRfidModule.ts`
- Native module: `android/app/src/main/java/com/rfiddemo/rfid/RfidModule.kt`
- Package registration: `android/app/src/main/java/com/rfiddemo/rfid/RfidPackage.kt`
- Device scanner: `android/app/src/main/java/com/rfiddemo/rfid/DeviceRfidScanner.kt`
- Mock scanner: `android/app/src/main/java/com/rfiddemo/rfid/MockRfidScanner.kt`

### RFID SDK Integration
- Vendor AAR: `android/app/libs/DeviceAPI_ver20231208_release.aar`

## AAR Setup Requirement
This repository does not include the vendor RFID SDK AAR in Git.

This demo is for Android only.

You must manually add the SDK file before building Android:
- Required path: `android/app/libs/DeviceAPI_ver20231208_release.aar`
- Required filename: `DeviceAPI_ver20231208_release.aar` (exact match)

Reason:
- The AAR is intentionally not committed for legal/compliance safety.

Important:
- Android build will fail if this AAR is missing.
- Do not push this AAR to public repositories.
- Share the AAR only through approved internal channels.
- RFID features are supported only on Android devices with compatible hardware.

## Quick Setup (New Developers)
1. Clone this repository.
2. Create the `android/app/libs` folder if it does not exist.
3. Copy `DeviceAPI_ver20231208_release.aar` into `android/app/libs`.
4. Install dependencies with `npm install`.
5. Start Metro with `npm run start`.
6. Run Android with `npm run android`.

## Reliability and Safety Practices
- Reader lifecycle is controlled (initialize/release)
- Continuous scan task runs off the UI thread
- Scan failures are surfaced through structured events
- Initialization failures can fall back to mock mode
- Tag list is bounded to avoid unbounded memory growth

## Performance Considerations
- In-memory tag map updates are O(1) average
- Rendering list data via FlatList for efficient UI updates
- Scan interval configured for responsive yet stable continuous mode
- Minimal allocations in critical scanning paths where possible

## Demo Flow (Suggested for Client Meeting)
1. Open app and explain mode indicator (hardware/mock)
2. Press Initialize
3. Show power adjustment and explain range vs precision trade-off
4. Run Single Scan to verify reader path
5. Start Continuous Scan and present live counters
6. Stop scan and review collected tags
7. Toggle Mock Mode and repeat quickly to prove fallback resilience

## Practical Talking Points for Stakeholders
- "This is not a toy UI; it is structured for maintainability and scale."
- "The module design supports future migration to dedicated JSI/C++ optimizations if required."
- "The fallback strategy ensures operational continuity across diverse device fleets."
- "The current implementation is ready to integrate with backend inventory APIs as a next step."

## Known Scope Boundaries
- RFID scanning support is Android-specific due to vendor SDK constraints
- iOS path is currently non-RFID (can be extended separately)

## Next Phase Recommendations
- Add export (CSV/JSON) for scanned sessions
- Add domain-specific validation rules per tag category
- Add role-based workflow modes (operator, supervisor, auditor)
- Add telemetry and crash analytics for production rollout

## Build and Run
From project root:

```bash
npm install
npm run start
npm run android
```

## Search Keywords
This repository is relevant for the following search intents:
- react native rfid demo
- react native android rfid integration
- android handheld rfid scanner app
- rfid inventory tracking mobile app
- react native turbomodule native module example
- uhf rfid reader sdk integration

Use these terms naturally in pull requests, release notes, and shared technical articles that reference this repo to improve discoverability over time.

## Conclusion
This demo is engineered to be presentation-safe, operationally realistic, and technically credible.
It demonstrates both immediate business value and a clear path to production implementation.
