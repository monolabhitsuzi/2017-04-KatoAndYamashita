const d3 = require('d3');
const $ = require('jquery');
window.addEventListener("load", function() {

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
            circle(n)
        }
    );

},false);

const circle = function (datas) {
    let itemCounter = 0;
    let categoryDatas = [];
    for(categorys in datas){
        for (date in datas[categorys]){
            console.log(date);
            itemCounter += datas[categorys][date].length;
        }
        categoryDatas.push({category : categorys, item : itemCounter});
        itemCounter = 0;
    }

    let radius = 200;
    let width = "100%";
    let height = "100%";
    let canvas = d3.select("#circle");

    //svg定義
    const svg = canvas
        .append("svg")//描画設定
        .attr("width", width)
        .attr("height", height)
        .append("g");//グラフ全体
    // svg
    //     .attr("transform", "translate(70%, 50%)");
    //切り捨て
    function floatFormat(number, n) {
        let _pow = Math.pow(10, n);

        return Math.floor(number * _pow) / _pow;
    }
    //昇順
    categoryDatas.sort(function (a, b) {
        if (a.item < b.item) return -1;
        if (a.item > b.item) return 1;
        return 0;
    });
    //合計値
    let total = 0;
    for (tmp in categoryDatas) {
        total = total + categoryDatas[tmp].item;
    }
    //カラー設定
    function colorGen(index) {
        let hue = 360 - (35 * index);
        let luminance = 70;
        let satuation = 85;
        return "hsl(" + hue + "," + satuation + "%," + luminance + "%)";
    }

    let colors = [];
    for (let i = 0; i < categoryDatas.length; i++) {
        colors.push(colorGen(i));
    }
    //パイの定義
    let pie = d3.layout.pie()
        .startAngle(0)
        .endAngle(Math.PI * 2)
        .value(function (d) {
            return d.item
        })
        .sort(null);
    //円弧の定義
    let arc = d3.svg.arc()
        .innerRadius(70)
        .outerRadius(radius);

    //データの設定
    let g = svg.selectAll("path")
        .data(pie(categoryDatas))
        .enter();
    //各値のパイの設定
    g
        .append("path")
        .attr("d", arc)
        .attr("fill", function (d, i) {
            return colors[i]
        })
        .attr("stroke", "white");
    //各パイの割合の表示
    g
        .append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function (d) {
            word = "*";
            rate = d.data.item / total * 100;
            if (rate > 4) {
                word = floatFormat(rate, 1) + "%"
            }
            return word
        });
    svg
        .append("text")
        .attr("class", "total")
        .attr("dy", ".50em")
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .text("Category Rate");
    //-----------------------------------------------------------------------------------------------

    //降順
    categoryDatas.sort(function (a, b) {
        if (a.item < b.item) return 1;
        if (a.item > b.item) return -1;
        return 0;
    });
    //ラベル数制限
    flag = false;
    while (!(categoryDatas.length < 15)) {
        categoryDatas.pop();
        flag = true;
    }
    //制限後の最大文字数取得
    let maxLength = 0;
    for (tmp in categoryDatas) {
        if (maxLength < categoryDatas[tmp].category.length) maxLength = categoryDatas[tmp].category.length;
    }
    maxLength = maxLength + 2;
    //ラベル名表示欄
    svg.selectAll("rect")
        .data(categoryDatas)
        .enter()
        .append("rect")
        .attr({
            x: 220,
            y: function (d, i) {
                return -200 + (i * 25);
            },
            width: function (d, i) {
                return 20 * maxLength;
            },
            height: 20
        })
        .attr("fill", function (d, i) {
            return colors[colors.length - 1 - i]
        });
    //各項目の名前と割合の表示
    svg.selectAll("text.name")
        .data(categoryDatas).enter().append("text")
        .attr("x", function (d, i) {
            return 223
        })
        .attr("y", function (d, i) {
            return -183 + (i * 25);
        })
        .attr("font-weight", "bold")
        .attr("font-family", "selif")
        .text(function (d, i) {
            return d.category + " " + d.item + "%"
        })
        .attr("fill", "white");
    //表示限界がある場合の代変え表示
    if (flag) {
        spaceBox = [0, 0, 0];
        svg.selectAll("text.name")
            .data(spaceBox).enter().append("text")
            .attr("x", function (d, i) {
                return 223 + 8 * maxLength
            })
            //.attr("y", function(d, i){return -183 + ((i+37) * 10);})
            .attr("y", function (d, i) {
                return -183 + ((i + 34) * 10);
            })
            .attr("font-weight", "bold")
            .attr("font-family", "selif")
            .text(function (d, i) {
                return "."
            })
            .attr("fill", "black");
    }
};
