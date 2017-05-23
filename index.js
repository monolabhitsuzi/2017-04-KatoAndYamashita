'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const locals = {/* ...*/};
const pug = require('electron-pug')({pretty: true}, locals);

let mainWindow = null;
app.on('ready', () => {
    // mainWindowを作成（windowの大きさや、Kioskモードにするかどうかなどもここで定義できる）
    mainWindow = new BrowserWindow({
            width: 800,
            height: 1000,
        }
    );
// Electronに表示するhtmlを絶対パスで指定（相対パスだと動かない）
    mainWindow.loadURL('file://' + __dirname + '/index.pug');

    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
