/**
 * Created by zf7he on 2017/05/25.
 */
//Firebase初期設定
let config = {
    apiKey: "AIzaSyC6W4-fEr3trERePWrgGrp49SP62fFcvyQ",
    authDomain: "money-5bd5f.firebaseapp.com",
    databaseURL: "https://money-5bd5f.firebaseio.com",
    projectId: "money-5bd5f",
    storageBucket: "money-5bd5f.appspot.com",
    messagingSenderId: "1102198358"
};

firebase.initializeApp(config);

//DOM取得
let inputarea = document.getElementById('input');
let newuser = document.getElementById('newuser');
let login = document.getElementById('login');
let info = document.getElementById('info');

//新規登録処理
newuser.addEventListener('click', function(e) {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
            alert('登録できません（' + error.message + '）');
        });
});

//ログイン処理
login.addEventListener('click', function(e) {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            alert('ログインできません（' + error.message + '）');
        });
});

//認証状態の確認
firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        loginDisplay();
    }
});

function loginDisplay() {
    info.textContent = "ログイン中です！";
    window.location.href = './index.pug';
}
