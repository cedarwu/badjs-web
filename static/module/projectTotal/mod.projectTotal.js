/**
 * @info 图表统计js
 * @author coverguo
 * */


require('w2ui/w2ui-1.4.3.min.js');
require('w2ui/w2ui-1.4.3.min.css');


var dayNumber = 0,
    days = [];

var chart_title, chart_projects = [];
var statistics = {
    init: function () {
        window.w2ui = {};
        this.bindEvent();

    },
    setChart: function (data) {
        /*  $('#chartsContainer').highcharts({                   //图表展示容器，与div的id保持一致
         chart: {
         type: 'line'                         //指定图表的类型，默认是折线图（line）
         },
         title: {
         text: ""  //指定图表标题
         },
         xAxis: {
         categories: setChartX(dayNumber)
         },
         yAxis: {
         title: {
         text: '报错数量'                  //指定y轴的标题
         }
         },
         series: chart_projects
         });*/
    },
    renderTable: function (data) {
        renderTable(data);
        //$('#chart-table').html(statisticsTpl({item: chart_projects}));
    },
    bindEvent: function () {
        var self = this;


        $('#showCharts').bind("click", function (e) {
            var param = {
                projectId: $("#select-chartBusiness").val(),
                timeScope: $("#select-timeScope").val()
            };
            $.getJSON("/controller/statisticsAction/queryByChartForAdmin.do", param, function (data) {
                //chart_projects = [];
                dayNumber = param.timeScope == 1 ? 5 : 30;
                console.log(dayNumber);
                data.groups = getformateTime(dayNumber);
                data.columns = getColumns(data.groups);
                data.nameListObj = getNameList(param.projectId);
                data.projectId = param.projectId;
                chart_title = $("#select-chartBusiness").find("option:selected").text() + $("#select-timeScope").find("option:selected").text() + "统计";
                data.data = sortData(data.data,data.nameListObj);
                //sortChartData(data.data);
                console.log('project', chart_projects);
                //  self.setChart();
                self.renderTable(data);
                console.log(w2ui);
            });
        });

        $('#showCharts').click();

    }

};
/*

 function setChartX(number) {
 var days = [];
 var nowDay = new Date() - 0;

 for (var i = number; i > 0; i--) {
 var day = nowDay - i * 1000 * 60 * 60 * 24;
 days.push(_.formatDate(new Date(day), 'MM-DD'));
 }
 return days;
 };
 function setDefaultTotal(arr, number) {
 for (var i = number; i > 0; i--) {
 arr.push(0);
 }
 };
 function whichDayIndex(day1) {
 for (var i = 0, len = days.length; i < len; i++) {
 if (day1 == days[i]) {
 return i;
 }
 }
 return false;
 }
 */
//

function sortChartData(data) {

    for (var i = 0, len = data.length; i < len; i++) {
        data[i].startDate = _.formatDate(new Date(data[i].startDate), 'MM-DD');
        for (var j = 0, length = chart_projects.length; j < length; j++) {
            if (data[i].projectId == chart_projects[j].projectId) {
                chart_projects[j]['data'][whichDayIndex(data[i].startDate)] = data[i].total;
            }
        }
    }
    ;
}

function getNameList(projectId) {
    console.log(projectId);
    var $options = $("#select-chartBusiness option"),
        projectLength = $options.length,
        project = {};
    for (var i = 1; i < projectLength; i++) {
        project[$options.eq(i).val() - 0] = $options.eq(i).text();
    }
    if (projectId == -1) {
        return project;
    } else {
        var resultObj = {};
        resultObj[projectId] = project[projectId];
        return resultObj;
    }
}


function formateTime(time) {
    var DateObj = new Date(time),
        year = DateObj.getFullYear(),
        month = DateObj.getMonth() - -1,
        date = DateObj.getDate() - 0;
    return year + (month > 9 ? month : 0 + '' + month) + (date > 9 ? date : 0 + '' + date);
}

function getformateTime(day) {
    var dayObj = new Date(),
        dayTime = 1000 * 60 * 60 * 24,
        today = Date.parse(dayObj.getFullYear() + '-' + (dayObj.getMonth() -1) + '-' + (dayObj.getDate() - 1)),
        groups = [];
    groups.push({caption: ' ', span: 1});
    for (var i = day; i--;) {
        var item = {};
        item.caption = formateTime(today - i * dayTime);
        item.span = 3;
        groups.push(item);
    }
    console.log(groups, 'groups');
    return groups;
}

function sortData(data,nameList) {
    var result = [], resultObj = {}, nameListObj = nameList;
    data.forEach(function (item) {
            if (nameListObj.hasOwnProperty(item.projectId)) {
                if (!resultObj.hasOwnProperty(item.projectId)) {
                    resultObj[item.projectId] = {};
                    resultObj[item.projectId]['recid'] = item.projectId;
                }
                resultObj[item.projectId][formateTime(item.startDate) + '-total'] = item.total;
                resultObj[item.projectId][formateTime(item.startDate) + '-pv'] = item.pv;
                resultObj[item.projectId][formateTime(item.startDate) + '-rate'] = item.rate;
                resultObj[item.projectId]['name'] = nameListObj[item.projectId];

            }
        }
    )
    ;
    for (var key in resultObj) {
        result.push(resultObj[key]);
    }
    console.log(result);
    return result;
}

function getColumns(groups) {
    var columns = [];
    columns.push({
        field: 'name',
        caption: '项目名称',
        size: '100px',
        sortable: false,
        attr: 'align=center',
        resizable: true
    });

    groups.slice(1).forEach(function (item) {
        var columnTotal = {caption: 'total', size: '13%', sortable: true, attr: 'align=center', resizable: true},
            columnPv = {caption: 'pv', size: '13%', sortable: true, attr: 'align=center', resizable: true},
            columnRate = {caption: 'total/pv', size: '13%', sortable: true, attr: 'align=center', resizable: true};
        console.log(item);
        columnTotal['field'] = item.caption + '-total';
        columnPv['field'] = item.caption + '-pv';
        columnRate['field'] = item.caption + '-rate';
        columns.push(columnTotal);
        columns.push(columnPv);
        columns.push(columnRate);
    });
    console.log(columns);
    return columns;
}

function renderTable(data) {
    console.log(typeof w2ui.grid != 'undefined'&&(data.projectId != -1));
    if(w2ui.grid&&data.projectId != -1){
        w2ui.grid.clear();
        w2ui.grid.records = data.data;
        w2ui.grid.refresh();
        return;
    }
    $('#grid').w2grid({
        name: 'grid',
        show: {footer: true},
        sortData: [
            {field: getformateTime(1)[1]['caption'] + '-pv', direction: "DASC"}
        ],
        columnGroups: data.groups,
        columns: data.columns,
        records: data.data,

    });
}


module.exports = statistics;
