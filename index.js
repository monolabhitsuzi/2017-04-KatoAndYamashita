const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const database = require("./databaseManager.js");

let mainWindow = null;
app.on('ready', () => {
    // mainWindowを作成（windowの大きさや、Kioskモードにするかどうかなどもここで定義できる）
    mainWindow = new BrowserWindow({width: 400, height: 300});
// Electronに表示するhtmlを絶対パスで指定（相対パスだと動かない）
    mainWindow.loadURL('file://' + __dirname + '/index.html');

// ChromiumのDevツールを開く
    mainWindow.webContents.openDevTools();

    database.writeDb();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
