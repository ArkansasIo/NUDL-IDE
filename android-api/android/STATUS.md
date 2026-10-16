# Android integration status

The branch contains a Kotlin client scaffold, but it is intentionally not presented as a complete Android Studio application yet.

## Ready

- REST contract
- TypeScript NUDL pipeline adapter
- Express development server
- Android Retrofit service
- Android request/diagnostic models
- Repository abstraction
- Target list
- Editor state/view-model scaffold
- Workspace model and persistence abstraction
- Integration tests

## Next assembly step

Create the Android Studio application module and wire the supplied Kotlin package into a Jetpack Compose editor screen. The API service can then be configured for emulator, LAN, or production HTTPS endpoints.
