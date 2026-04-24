@echo off
title Nullifierverse Rhythm
color 0A
echo ===================================================
echo      KHOI DONG NULLIFIERVERSE RHYTHM GAME
echo ===================================================
echo.
echo Dang kiem tra va cai dat cac thu vien (neu thieu)...
call npm install --no-audit --no-fund
echo.
echo Dang chay game duoi dang ung dung doc lap... 
echo (Vui long giu nguyen cua so nay khi dang choi)
echo.
call npm run electron:dev
pause
