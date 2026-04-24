Set WshShell = CreateObject("WScript.Shell")

' Thống báo dạng Popup ngắn hạn khoảng 3 giây
WshShell.Popup "Dang kiem tra du lieu va khoi dong Nullifierverse Rhythm..." & vbCrLf & "Vui long cho trong giay lat (10-15s)...", 3, "Nullifierverse Game Launcher", 64

' Chạy file bat ở chế độ ẩn (số 0)
WshShell.Run "cmd /c """"Nullifierverse Rhythm.bat""""", 0, False
