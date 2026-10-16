@echo off
setlocal
set ROOT=%~dp0..
cd /d "%ROOT%"

echo === Noodle IDE 1.5 Pre-Alpha / P20 Pro Build ===
call npm run lint || exit /b 1
call npm test || exit /b 1
call npm run build || exit /b 1

if exist android-api\gradlew.bat (
  echo Building Android debug APK...
  call android-api\gradlew.bat -p android-api assembleDebug || exit /b 1
) else (
  echo Android Gradle wrapper not present; web/API validation completed.
)

echo === Build validation complete ===
endlocal
