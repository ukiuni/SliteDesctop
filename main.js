var app = require('app');
var ipc = require('ipc');
var BrowserWindow = require('browser-window');
require('crash-reporter').start();
var mainWindow = null;
app.on('window-all-closed', function() {
	if (true || process.platform != 'darwin') {// ALL Quit
		app.quit();
	}
});
if (/^win/.test(process.platform) && (process.env.HTTP_PROXY || process.env.http_proxy)) {
	var randomPort = Math.floor(Math.random() * (65535 - 10000 + 1)) + 10000;
	app.commandLine.appendSwitch('proxy-server', 'http://127.0.0.1:' + randomPort);
	require("node-local-proxy").listen(randomPort, "127.0.0.1", process.env.HTTP_PROXY || process.env.http_proxy);
}
app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width : 1200,
		height : 600,
		title : "Slite",
		"web-preferences" : {
			"web-security" : false
		}
	});
	mainWindow.setTitle("Slite");
	// mainWindow.loadUrl('file://' + __dirname + '/index.html');
	mainWindow.loadUrl(process.env.TARGET || 'https://slite.ukiuni.com');
	mainWindow.webContents.on("did-fail-load", function() {
		mainWindow.loadUrl('file://' + __dirname + '/index.html');
	})
	ipc.on("reload", function(event, arg) {
		mainWindow.loadUrl(arg);
	});
	// Open the DevTools.
	if (process.env.DEV) {
		mainWindow.webContents.openDevTools();
	}
	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
	var Menu = require("menu");
	var template = [ {
		label : "Application",
		submenu : [ {
			label : "About Application",
			selector : "orderFrontStandardAboutPanel:"
		}, {
			type : "separator"
		}, {
			label : "Quit",
			accelerator : "Command+Q",
			click : function() {
				app.quit();
			}
		} ]
	}, {
		label : "Edit",
		submenu : [ {
			label : "Undo",
			accelerator : "CmdOrCtrl+Z",
			selector : "undo:"
		}, {
			label : "Redo",
			accelerator : "Shift+CmdOrCtrl+Z",
			selector : "redo:"
		}, {
			type : "separator"
		}, {
			label : "Cut",
			accelerator : "CmdOrCtrl+X",
			selector : "cut:"
		}, {
			label : "Copy",
			accelerator : "CmdOrCtrl+C",
			selector : "copy:"
		}, {
			label : "Paste",
			accelerator : "CmdOrCtrl+V",
			selector : "paste:"
		}, {
			label : "Select All",
			accelerator : "CmdOrCtrl+A",
			selector : "selectAll:"
		} ]
	} ];
	Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});
