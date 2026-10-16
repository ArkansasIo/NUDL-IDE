# Android NUDL Client

The Android client calls the REST service defined by `android-api/openapi.yaml`.

Recommended stack:

- Kotlin
- Jetpack Compose
- Retrofit + OkHttp
- Kotlin serialization or Gson

The client keeps the NUDL source editor and workspace state on-device while delegating compiler/interpreter operations to the NUDL API service.

For an emulator, a server running on the development machine is normally addressed through `10.0.2.2` rather than `localhost`.
