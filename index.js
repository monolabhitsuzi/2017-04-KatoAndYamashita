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

    database.writeDb("メールアドレスにする予定","カテゴリ3","2017618",[{"品目": "あじ", "価格": 500, "購入場所": "とれとれ市場", "備考": "活きがいい"}]);
    database.readCategory() ;

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
