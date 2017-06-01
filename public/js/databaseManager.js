/**
 * Created by zf7he on 2017/05/25.
 */
let config = require('./databaseConfig').config;
const $ = require('jquery');

// let firebase = require('firebase');
firebase.initializeApp(config);

// ログアウト処理
$('#logout').on('click', () => {
    firebase.auth().signOut();
});

//認証状態の確認
firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
        window.location.href = './login.pug';
    } else {
        console.log(user.email);
    }
});

exports.writeDb = function (mail) {
    const userName = mail;
    const category = "わあああああああ";
    const dateYear = 2017;
    const dateMonth = 3;
    const dateDay = 21;

    const date = "" + dateYear + dateMonth + dateDay;

    const item = "さんまままま";
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
        // firebase.database().ref(userName).child(category).child(date).set(a.getDatas());
        firebase.database().ref(userName).child(category).child(date).set(a.getDatas());
    });
};
