'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const db = require("./database/databaseManager.js");

const locals = {/* ...*/};
const pug = require('electron-pug')({pretty: true}, locals);

let mainWindow = null;
app.on('ready', () => {
    // mainWindowを作成（windowの大きさや、Kioskモードにするかどうかなどもここで定義できる）
    mainWindow = new BrowserWindow({
            width: 1000,
            height: 800,
            webPreferences: {
                nodeIntegration: false
            }
        }
    );
// Electronに表示するhtmlを絶対パスで指定（相対パスだと動かない）
    mainWindow.loadURL('file://' + __dirname + '/login.pug');

    // mainWindow.webContents.openDevTools();
    db.writeDb();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
