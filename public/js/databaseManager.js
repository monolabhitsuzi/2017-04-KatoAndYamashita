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
        console.log("start");
        //--------------------test------------------------------------
        //writeDb();
        //deleteDb();
        //readDbList();
        lineBarGraph();
    }
});

//リスト表示用
//return: [ {} ] 日付で昇順ソート済み
let readDbList = function () {
    let categoryRef = firebase.database().ref('test');
    categoryRef.once('value').then(function (snapshot) {
        console.log(snapshot.val());//返却された全てのデータを含むJSON
        let readdatas = snapshot.val();
        let displayList = [];
        for(category in snapshot.val()){
            for(date in readdatas[category]){
                for(let i = 0; i < readdatas[category][date].length; i++){
                    let dataCont = readdatas[category][date][i]; //必要な階層の要素を抽出
                    if(!("none" === dataCont["index"])){ //消されたことになっているデータを弾く
                        dataCont["date"] = date;
                        displayList.push(dataCont);
                    }
                }
            }
        }
        //日付順昇順ソート
        displayList.sort(function (a, b) {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return 0;
        });
        console.log(displayList);
        return displayList;
    });
};

//データ削除用　indexをnoneに変換するこれを読み込み時に弾く
let deleteDb = function (objectDelete) {
    // const  uI = objectDelete[uid];
    // const  cG = objectDelete[category];
    // const  dt = objectDelete[date];
    // const index = objectDelete[index];

    let uI = "test";
    let cG = "category2";
    let dT = "20080228";
    let index = "1";

    firebase.database().ref(uI).child(cG).child(dT).child(index).update({"index":"none"});//消した状態のシグナルを与える
};

//データパスを作成して直接新規のデータを保存していく
//object : { , , , , , , ,}
let writeDb = function () {
    // const userId = object[uid];
    // const category = object[category];
    // const date = object[date];
    // const item = object[item];
    // const price = object[price];
    // const place = object[place];
    // const comment = object[comment];

    const userId = "test";
    const category = "category2";
    const date = "20080229";
    const item = "おかし";
    const price = "2300";
    const place = "岡山";
    const comment = "遠い";

    let datas = [{"品目": item, "価格": price, "購入場所": place, "備考": comment}];
    const dataContainer = new DataContainer();
    //datas: [{}]
    //配列型のオブジェクト[{}]　書き込み専用
    const datasPath = firebase.database().ref(userId + "/" + category + "/" + date);
    datasPath.once('value').then(function (snapshot) {
        if (snapshot.val() === null) {//初回更新判定
            datas[0]["index"] = 0;//採番追加
            dataContainer.setDatas(datas);
        } else {
            let oldDatas = snapshot.val();
            datas[0]["index"] = oldDatas.length;//採番追加
            oldDatas.push(datas[0]);
            dataContainer.setDatas(oldDatas);
        }
        //set( [{}] )
        firebase.database().ref(userId).child(category).child(date).set(dataContainer.getDatas());
    });
};


//書き込み用クラス 結論必要なかった
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

