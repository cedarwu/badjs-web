/**
 * @info 图表统计js
 * @author coverguo
 * */


require('w2ui/w2ui-1.4.3.min.js');
require('w2ui/w2ui-1.4.3.min.css');


var allIds = '',
    listParams = getListParams();


function getListParams() {
    var $options = $("#select-chartBusiness option"),
        ret = {};

    for (var i = 1, l = $options.length, id; i < l; i++) {
        id = $options.eq(i).val()|0;
        ret[id] = $options.eq(i).text();
        allIds += id + ',';
    }

    allIds = allIds.replace(/,$/, '');

    return ret
}


var statistics = {
    init: function () {
        window.w2ui = {};
        this.bindEvent();
    },
    renderTable: function (data) {
        renderTable(data);
        //$('#chart-table').html(statisticsTpl({item: chart_projects}));
    },
    bindEvent: function () {
        var self = this;

        $('#showCharts').bind("click", function (e) {
            var id = $("#select-chartBusiness").val();
            id = id == -1 ? allIds : id;
            var param = {
                id: id,
                timeScope: $("#select-timeScope").val()
            };
            $.getJSON("/errorCount/queryProjectTotal", param, function (data) {
                var ret = self.processData(data.data || data);
                self.renderTable(ret);
            });
        }).click();
    },
    processData: function(data) {
        var firstCircle = 1;
        var ret = {
            name: 'grid',
            columnGroups: [{span: 1, caption: ''}],
            columns: [{
                field: 'projectName',
                caption: '项目名称',
                size: '100px',
                sortable: false,
                attr: 'align=center',
                resizable: true
            }],
            records: []
        };

        Object.keys(data || {}).forEach(function(id){  //id次循环
            var item = data[id] || {},
                record = {};
            record['projectName'] = listParams[id];
            record['recid'] = id;

            Object.keys(item).forEach(function(date){  //5次循环
                var dayObj = item[date],
                    totalName = 'total' + date,
                    pvName = 'pv' + date,
                    centName = 'cent' + date;
                if(firstCircle) {
                    ret.columnGroups.push({
                        span: 3,
                        caption: date
                    });

                    ret.columns.push({
                        field: totalName,
                        caption: 'total',
                        sortable: true,
                        attr: 'align=center',
                        resizable: true
                    });
                    ret.columns.push({
                        field: pvName,
                        caption: 'pv',
                        sortable: true,
                        attr: 'align=center',
                        resizable: true
                    });
                    ret.columns.push({
                        field: centName,
                        caption: 'total/pv',
                        sortable: true,
                        attr: 'align=center',
                        resizable: true
                    });
                }

                record[totalName] = dayObj['total'];
                record[pvName] = dayObj['pv'];
                record[centName] = dayObj['cent'];
            });

            firstCircle = 0;

            ret.records.push(record);
        });


        return ret;
    }

};

function renderTable(data) {
    console.log(data);
    //console.log(typeof w2ui.grid != 'undefined'&&(data.projectId != -1));
    if(w2ui.grid){
        w2ui.grid.clear();
        w2ui.grid.columns = data.columns;
        w2ui.grid.columnGroups = data.columnGroups;
        w2ui.grid.records = data.records;
        w2ui.grid.refresh();
        return;
    }
    $('#grid').w2grid(data);
}


module.exports = statistics;
