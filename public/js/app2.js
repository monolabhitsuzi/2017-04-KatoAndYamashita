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
        console.log(firebase.auth().currentUser.email);
    }
});
