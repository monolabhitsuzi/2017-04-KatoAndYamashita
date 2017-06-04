/**
 * Created by zf7he on 2017/05/24.
 */
const data = require('./testData').testData;
const dbManage = require('./databaseManager');
const $ = require('jquery');


// const circleGraph = require('./circleGraph.js');

function onClickButton(target, display) {
    $("#" + target).on("click", () => {
        $.ajax({
            type: 'POST',
            dataType: 'text',
            url: display,
            data: {
                id: '00001',
                Flg: true
            }
        }).done((data) => {
            // ajax ok
            $("#mainPanel").html(data);
        }).fail((data) => {
            // ajax error
            $("#mainPanel").html('Error');
        }).always((data) => {
            // ajax complete
        });
    });
}

onClickButton("リスト", "./public/pug/listView.pug");

$("#円グラフ").on("click", () => {
    $.ajax({
        type: 'POST',
        dataType: 'text',
        url: "./public/pug/circleGraph.pug",
        data: {
            id: '00001',
            Flg: true
        }
    }).done((data) => {
        // ajax ok
        $("#mainPanel").html(data);
        let circleGraph = require('./circleGraph.js');
        circleGraph.run();
    }).fail((data) => {
        // ajax error
        $("#mainPanel").html('Error');
    }).always((data) => {
        // ajax complete
    });
});
