let inputCheck = function () {
    const dt = document.getElementById("date");
    const ct = document.getElementById("category");
    const items = document.getElementsByName("item");
    let cutDate = dt.value.replace(/\-/g,"");
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location.href = './login.pug';
        } else {
            console.log(items[1].value);
            if(items[1].value.match(/[^0-9]+/) ){
                window.alert('priceの値に数字以外が入力されています');
            }else if(cutDate !== "" && ct.value !== "" && items[0] !== "" && items[1]!== ""){
                let object = { "uid":user.uid, "category":ct.value, "date":cutDate, "item":items[0].value, "price":items[1].value, "place": items[2].value,"comment":items[3].value };
                writeDb(object);
            }else{
                window.alert("入力されていない必須項目があるか日付が無効な値です");
            }
        }
    });
};

let clearTextBox = function () {
        let inputs = document.getElementsByTagName("input");
        console.log(inputs);
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].type === "text") {
                inputs[i].value = "";
            }
        }
};

let writeDb = function (object) {
    console.log(object);
    const userId = object["uid"];
    const category = object["category"];
    const date = object["date"];
    const item = object["item"];
    const price = object["price"];
    const place = object["place"];
    const comment = object["comment"];

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
