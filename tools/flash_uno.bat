@echo off
break ON
rem fichiers BAT et fork cr��s par S�bastien CANET
SET currentpath=%~dp1
cd %currentpath%B@electron\arduino
cls
arduino-cli.exe upload ..\..\tools\FirmataPlus -p COM13 --fqbn arduino:avr:uno
pause