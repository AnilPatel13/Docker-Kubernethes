@echo off
SET target=%1
SET interval=%2

IF "%target%"=="" (
    echo Usage: %0 ^<target^> ^<interval-in-seconds^>
    exit /b 1
)
IF "%interval%"=="" (
    echo Usage: %0 ^<target^> ^<interval-in-seconds^>
    exit /b 1
)

echo Sending request to %target% every %interval% seconds..

:loop
set requestTime=%date% %time%
curl -s %target%
echo %requestTime%
REM timeout only accepts whole seconds
timeout /t %interval% >nul
goto loop
