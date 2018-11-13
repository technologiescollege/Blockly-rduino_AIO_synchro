const electron = require('electron')
const {ipcMain} = require('electron')
const app = electron.app

const BrowserWindow = electron.BrowserWindow
const path = require('path')
const userDataPath = app.getPath ('userData')

//read INI file
const fs = require('fs-extra')
var fileSettings = "./Blockly@rduino.json"
var Settings = ""
var Settings_blank = {"arg":""}

if(!fs.existsSync(fileSettings)) {
	console.log("File not found")
	fs.writeFileSync(fileSettings, JSON.stringify(Settings_blank), (err) => {
        if(err){
            console.log("An error ocurred creating the file "+ err.message)
        }                    
        console.log("The file has been succesfully saved")
	})
} else {
	Settings = fs.readFileSync(fileSettings, 'utf8', (err, Settings) => {
		if(err){
			console.log("An error occured reading the file :" + err.message)
			return
		}
	Settings = JSON.parse(Settings)
	console.log("The file Settings is : " + Settings)
	})
}

let mainWindow
let termWindow
let factoryWindow

app.setPath ('userData', app.getAppPath())

app.on('window-all-closed', () => {
	mainWindow.webContents.session.clearStorageData()
	mainWindow.webContents.clearHistory()
    app.quit()
})

function createWindow () {
	mainWindow = new BrowserWindow({
		width:1280,
		height:800,
		titleBarStyle: 'hidden',
		icon:'./favicon.ico',
		"webPreferences":{
			"webSecurity":false,
			"allowRunningInsecureContent":true
			}
		})
	if (Settings == "" || Settings == "undefined") {
		if (process.platform == 'win32' && process.argv.length >= 2) {
			if (((process.argv[1]).substring(0, 9)) == "index_AIO") {
				mainWindow.loadURL(path.join(__dirname, '../../www/' + process.argv[1]))
			}
			else {
				mainWindow.loadURL(path.join(__dirname, '../../www/index_electron.html?' + process.argv[1]))
			}
		} else {
			mainWindow.loadURL(path.join(__dirname, '../../www/index_electron.html'))
		}
	} else {
		mainWindow.loadURL(path.join(__dirname, '../../www/index_electron.html?' + JSON.parse(Settings).arg))
		fs.writeFileSync("error-log.json", JSON.parse(Settings).arg, (err) => {
			if(err){
				console.log("An error ocurred creating the file "+ err.message)
			}                    
			console.log("The file has been succesfully saved")
		})
	}
	mainWindow.setMenu(null);
	mainWindow.webContents.openDevTools();
	mainWindow.on('closed', function () {
		mainWindow = null
	})
}

app.on('ready', createWindow)
app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
})
	
function createTerm() {
	termWindow = new BrowserWindow({
		width: 660,
		height: 660,
		'parent':mainWindow,
		resizable:false,
		movable:true,
		frame:true,
		modal:false
		}) 
	// termWindow.webContents.openDevTools();
	termWindow.loadURL(path.join(__dirname, "../../www/tools/serialconsole/serialconsole.html"))
	termWindow.setMenu(null);
	termWindow.on('closed', function () { 
		termWindow = null 
	})
}
ipcMain.on("prompt", function () {
	createTerm()       
});

function createfactory() {
	factoryWindow = new BrowserWindow({
		width:1200,
		height:800,
		'parent':mainWindow,
		resizable:true,
		movable:true,
		frame:true,
		modal:true
		}) 
	factoryWindow.loadURL(path.join(__dirname, "../../www/tools/factory/block_factory.html"))
	factoryWindow.setMenu(null);
	factoryWindow.on('closed', function () { 
		factoryWindow = null 
	})
}
ipcMain.on("factory", function () {
	createfactory()       
});