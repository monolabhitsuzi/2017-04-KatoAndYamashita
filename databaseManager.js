const firebase = require("firebase");

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



exports.foo = function(){
    console.log("foo");
    let data = {"id2": {"message": "りんごはお好きですか"}};
    firebase.database().ref("enquetes").set(data);
}
