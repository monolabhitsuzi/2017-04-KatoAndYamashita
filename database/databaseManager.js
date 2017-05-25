/**
 * Created by zf7he on 2017/05/25.
 */
let firebase = require("firebase");

//DB設定情報
let config = {
    apiKey: "AIzaSyC6W4-fEr3trERePWrgGrp49SP62fFcvyQ",
    authDomain: "money-5bd5f.firebaseapp.com",
    databaseURL: "https://money-5bd5f.firebaseio.com",
    projectId: "money-5bd5f",
    storageBucket: "money-5bd5f.appspot.com",
    messagingSenderId: "1102198358"
};

firebase.initializeApp(config);

exports.writeDb = function () {
    const userName = "メールアドレスにする予定";
    const category = "お寿司";
    const dateYear = 2016;
    const dateMonth = 7;
    const dateDay = 21;

    const date = "" + dateYear + dateMonth + dateDay;

    const item = "さんま";
    const price = 1000;
    const place = "イケヤ";
    const comment = "値切った結果";

    const datas = [{"品目": item, "価格": price, "購入場所": place, "備考": comment}];

    const a = new DataContainer();

    //datas: [{}]
    //配列型のオブジェクト[{}]　書き込み専用
    const datasPath = firebase.database().ref(userName + "/" + category + "/" + date);
    datasPath.once('value').then(function (snapshot) {
        if (snapshot.val() === null) {
            a.setDatas(datas);
        } else {
            oldDatas = snapshot.val();
            for (let i = 0; i < datas.length; i++) {
                oldDatas.push(datas[i]);
            }
            a.setDatas(oldDatas);
        }
        //set( [{}] )
        firebase.database().ref(userName).child(category).child(date).set(a.getDatas());
    });

    console.log("aa");

};

//書き込み用クラス
//datas: [{}]
const DataContainer = (function () {
    // コンストラクタ
    const DataContainer = function () {
        if (!(this instanceof DataContainer)) {
            return new DataContainer();
        }
        //保存されるフィールド
        this.datas = [];
    };
    const p = DataContainer.prototype;
    // プロトタイプ内でメソッドを定義
    p.setDatas = function (datas) {
        for (let i = 0; i < datas.length; i++) {
            this.datas.push(datas[i]);
        }
    };
    p.getDatas = function () {
        return this.datas;
    };
    return DataContainer;
})();
