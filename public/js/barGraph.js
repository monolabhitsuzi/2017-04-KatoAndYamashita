const d3 = require('d3');
const $ = require('jquery');

window.addEventListener("load", function() {

    let config = {
        apiKey: "AIzaSyC6W4-fEr3trERePWrgGrp49SP62fFcvyQ",
        authDomain: "money-5bd5f.firebaseapp.com",
        databaseURL: "https://money-5bd5f.firebaseio.com",
        projectId: "money-5bd5f",
        storageBucket: "money-5bd5f.appspot.com",
        messagingSenderId: "1102198358"
    };
    firebase.initializeApp(config);

    //----------------------------------------初回時だけ現在年月していするように分岐必要
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = nowDate.getMonth()+1;

    //データベース情報取得
    const readDb = function (resolve, reject) {
        let categoryRef = firebase.database().ref('メールアドレスにする予定');
        categoryRef.once('value').then(function (snapshot) {
            return resolve(snapshot.val());
        });
    };
    //同期処理
    const p1 = new Promise(
        function (resolve, reject) {
            readDb(resolve, reject);
        }
    );
    p1.then(
        function (n) {
            bar(n, year, month)
        }
    );
},false);

const bar = function (datas, displayYear , displayMonth) {
    let dataObject = { "年" : { "月" : [ {"品目":"値段"} ] }  };
    for(categorys in datas){//カテゴリの回数ループ
        for (date in datas[categorys]){//カテゴリ内の日付の回数ループ
            for(let i = 0; i < datas[categorys][date].length; i++){//カテゴリ内の日付内の品目の回数ループ
                let itemName = datas[categorys][date][i]["品目"];
                let price = datas[categorys][date][i]["価格"];
                let runCheck = datas[categorys][date][i]["index"];
                let year = date.substring(0,4);
                let month = date.substring(4,6);

                if(! ("none" === runCheck) ){//消した状態の値の除外
                    if (year in dataObject) {
                        if(month in dataObject[year]){
                            dataObject[year][month].push({"item":itemName,"price":price});
                        }else{
                            dataObject[year][month] = [{"item":itemName,"price":price}];
                        }
                    }else{
                        dataObject[year] = { [month] : [ {"item":itemName,"price":price} ] };
                    }
                }
            }
        }
    }

    console.log(dataObject);
    //-------------------------------------------------------以下で表示する年月を選択
    barDataArray = dataFilter(displayYear, displayMonth);
    // [ { item:ふぐ , price:2000 } ]
    function dataFilter(year , month) {
        let barDatas = [];
        //指定された年の月の商品を全検索
        for(let i = 0; i < dataObject[year][month].length; i++){
            if(i===0){//初回のみ即追加する
                barDatas.push( dataObject[year][month][i] );
            }else{
                let writeFlag = false;//通常書き込みの有無
                let itemKey = dataObject[year][month][i]["item"];
                for(let j = 0; j < barDatas.length; j++){
                    if(itemKey === barDatas[j]["item"]){//一致した商品があった場合
                        barDatas[j]["price"] = barDatas[j]["price"] +  dataObject[year][month][i]["price"];
                        writeFlag = false;
                        break;
                    }else{
                        writeFlag = true;
                    }
                }
                if(writeFlag){
                    barDatas.push( dataObject[year][month][i] );
                }
            }
        }
        return barDatas;
    }
    //値段の降順にソート
    barDataArray.sort(function (a, b) {
        if (a.price < b.price) return 1;
        if (a.price > b.price) return -1;
        return 0;
    });
    //10件まで制限
    while (!(barDataArray.length <= 10)) {
        barDataArray.pop();
    }
    //昇順
    barDataArray.sort(function (a, b) {
        if (a.price < b.price) return -1;
        if (a.price > b.price) return 1;
        return 0;
    });
    let priceDatas =[];//プライスデータセット
    let itemDatas = [];//名前データセット
    for(let i = 0; i < barDataArray.length ; i++){
        priceDatas.push(barDataArray[i]["price"]);
        itemDatas.push(barDataArray[i]["item"]);
    }
    //----------------------------------------------------------------------------
    const width = 700;
    const height = 500;
    const svgHeight = 320; //svg要素の高さ
    const xOffset = 80; //Ｘ座標のずれ具合
    const yOffset = 10; //Ｙ座標のずれ具合
    const canvas = d3.select("#graph");
    //カラー設定
    function colorGen(index) {
        let hue = 290 - (36 * index);
        let luminance = 70;
        let satuation = 85;
        return "hsl(" + hue + "," + satuation + "%," + luminance + "%)";
    }
    let colors = [];
    for (let i = 0; i < 10; i++) {
        colors.push(colorGen(i));
    }
    //svg定義
    const svg = canvas
        .append("svg")//描画設定
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + width / 10 + "," + height / 10 + ")");
    //データ設定
    let bar = svg
        .selectAll("rect")
        .data(priceDatas);
    //目盛り表示の為の縮尺設定
    let yScale = d3.scale.linear()
        .domain([0, barDataArray[barDataArray.length-1]["price"] + barDataArray[barDataArray.length-1]["price"]/10])
        .range([300, 0]);
    //棒グラフ位置設定
    bar.enter()
        .append("rect")
        .attr("height", function (d, i) {
            return (svgHeight - yOffset * 2) - yScale(d);
        })
        .attr("width", 20)
        .attr("fill", function (d, i) {
            return colors[i];
        })
        .attr("x", function (d, i) {
            return i * 50 + xOffset;
        })
        .attr("y", function (d, i) {
            return yScale(d) + yOffset;
        });
    //---------------------------------------------------------------------------------------------
    //スケールの文字設定
    svg
        .append("g")
        .attr("transform", "translate(" + xOffset + ", " + ((svgHeight - 300) - yOffset) + ")")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("font-family", "sans-serif")
        .attr("font-size", 13)
        .call(
            d3.svg.axis()
                .scale(yScale)
                .ticks(6)
                .orient("left")
                .innerTickSize(-1 * (svgHeight + 195))
        )
        .selectAll("text")
        .text(function (d, i) {
            return "¥ " + d;
        })
        .attr("transform", "translate(" + -10 + ", " + 0 + ")");
    svg.selectAll("g")
        .selectAll(".tick")
        .select("line")
        .style("opacity", 0.2);
    //横方向の線を設定
    svg
        .append("rect")
        .attr("width", svgHeight + 200)
        .attr("height", 1)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("transform", "translate(" + (xOffset - 7) + ", " + (svgHeight - yOffset ) + ")");
    //------------------------------------------------------------------------------------------
    //棒グラフの数値を設定
    bar.enter()
        .append("text")//text要素を追加
        .attr("x", function (d, i) {
            return i * 50 + 17 + xOffset;
        })
        .attr("y", svgHeight - 5 - yOffset)//Ｙ座標を指定
        .attr("font-size", "12")
        .attr("text-anchor", "middle")
        .text(function (d, i) {
            return "¥" + d;
        });
    //棒のラベルを設定
    bar.enter()
        .append("text")
        .attr("x", function (d, i) {
            return i * 50 + 205 + xOffset + i * -14;
        })
        .attr("y", function (d, i) {
            return svgHeight - yOffset - 115 + i * -36;
        })
        .attr("font-size", 14)
        .attr("stroke", function (d, i) {
            return colors[i];
        })
        .style('text-anchor', 'start')
        .attr('transform', 'rotate(45 -10 10)' + "translate(" + 0 + ", " + -25 + ")")
        .text(function (d, i) {
            let labelText = itemDatas[i];
            if (labelText.length > 10) {
                labelText = labelText.substring(0, 10) + ". . .";
            }
            return labelText;
        })
};
