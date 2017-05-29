/**
 * Created by zf7he on 2017/05/25.
 */
let config = {
    apiKey: "AIzaSyC6W4-fEr3trERePWrgGrp49SP62fFcvyQ",
    authDomain: "money-5bd5f.firebaseapp.com",
    databaseURL: "https://money-5bd5f.firebaseio.com",
    projectId: "money-5bd5f",
    storageBucket: "money-5bd5f.appspot.com",
    messagingSenderId: "1102198358"
};

firebase.initializeApp(config);

let logout = document.getElementById('logout');

//ログアウト処理
logout.addEventListener('click', function () {
    firebase.auth().signOut();
});

//認証状態の確認
firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
        window.location.href = './login.pug';
    } else {
        console.log(user.email);
        readCategory('メールアドレスにする予定');
        console.log('aaaaaa');
        // writeTest(user.email);

        // Promise.resolve().then(writeTest(user.email));
    }
});

function readCategory(mail) {
    let categoryRef = firebase.database().ref(mail);

    categoryRef.once('value').then(function (snapshot) {
        // return new Promise((resolve) => {
        console.log(snapshot.val());
        // });
    });
}

function writeTest(mail) {
    const userName = mail;
    const category = "さかなさかな";
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
        console.log("aa");
        //set( [{}] )
        firebase.database().ref(userName).child(category).child(date).set(a.getDatas());
    });


}
