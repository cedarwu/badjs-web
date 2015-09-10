webpackJsonp([10],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	var projectTotal = __webpack_require__(14);

	projectTotal.init();

/***/ },

/***/ 14:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, _) {/**
	 * @info 图表统计js
	 * @author coverguo
	 * */


	__webpack_require__(18);
	__webpack_require__(21);
	__webpack_require__(22);
	__webpack_require__(23);
	__webpack_require__(119);
	var Dialog = __webpack_require__(20);
	var statisticsTpl = __webpack_require__(117);


	var dayNumber = 0,
	    days = [];

	var chart_title, chart_projects = [];
	var statistics = {
	    init: function () {

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
	                dayNumber = param.timeScope == 1 ? 7 : 30;
	                console.log(dayNumber);
	                data.groups = getformateTime(dayNumber);
	                data.columns = getColumns(data.groups);
	                /* if (param.projectId == -1) {
	                 var projectLength = $options.length;
	                 for (var i = 1; i < projectLength; i++) {
	                 var defaultData1 = [];
	                 setDefaultTotal(defaultData1, dayNumber);
	                 var project = {
	                 name: $options.eq(i).text(),
	                 projectId: $options.eq(i).val() - 0,
	                 date: days,
	                 data: defaultData1
	                 };
	                 chart_projects.push(project);
	                 }
	                 } else {
	                 var defaultData2 = [];
	                 setDefaultTotal(defaultData2, dayNumber);
	                 var project = {
	                 name: $selectedOption.text(),
	                 projectId: $("#select-chartBusiness").val() - 0,
	                 date: days,
	                 data: defaultData2
	                 };
	                 chart_projects.push(project)
	                 };

	                 //设置表格title*/
	                chart_title = $("#select-chartBusiness").find("option:selected").text() + $("#select-timeScope").find("option:selected").text() + "统计";
	                data.data = sortData(data.data);
	                //sortChartData(data.data);
	                console.log('project', chart_projects);
	                //  self.setChart();
	                self.renderTable(data);
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

	function getNameList() {
	    var $options = $("#select-chartBusiness option"),
	        projectLength = $options.length,
	        project = {};
	    for (var i = 1; i < projectLength; i++) {
	        project[$options.eq(i).val() - 0] = $options.eq(i).text();
	    }
	    return project;
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
	        today = Date.parse(dayObj.getFullYear() + '-' + (dayObj.getMonth() - -1) + '-' + (dayObj.getDate() - 1)),
	        groups = [];
	    groups.push({caption: '', span: 1});
	    for (var i = day; i--;) {
	        var item = {};
	        item.caption = formateTime(today - i * dayTime);
	        item.span = 3;
	        groups.push(item);
	    }
	    return groups;
	}

	function sortData(data) {
	    var result = [], resultObj = {}, nameListObj = getNameList();
	    data.forEach(function (item) {
	        if (!resultObj.hasOwnProperty(item.projectId)) {
	            resultObj[item.projectId] = {};
	            resultObj[item.projectId]['recid'] = item.projectId;
	        }
	        resultObj[item.projectId][formateTime(item.startDate) + '-total'] = item.total;
	        resultObj[item.projectId][formateTime(item.startDate) + '-pv'] = item.pv;
	        resultObj[item.projectId][formateTime(item.startDate) + '-rate'] = item.rate;
	        resultObj[item.projectId]['name'] = nameListObj[item.projectId];

	    });
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
	        size: '9%',
	        sortable: false,
	        attr: 'align=center',
	        resizable: false
	    });
	    groups.forEach(function (item) {
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
	    $('#grid').w2grid({
	        name: 'grid',
	        searches: [
	            {field: 'lname', caption: 'Last Name', type: 'text'},
	            {field: 'fname', caption: 'First Name', type: 'text'},
	            {field: 'email', caption: 'Email', type: 'text'},
	        ],
	        show: {footer: true},
	        columnGroups: data.groups,
	        columns: data.columns,
	        records: data.data,
	        sort: [
	            { "field": getformateTime(1)[1]['caption']+'-pv', "direction": "DASC" },
	        ]
	    });
	}


	module.exports = statistics;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(1)))

/***/ },

/***/ 18:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(jQuery) {/**
	 * @preserve jQuery DateTimePicker plugin v2.4.1
	 * @homepage http://xdsoft.net/jqplugins/datetimepicker/
	 * (c) 2014, Chupurnov Valeriy.
	 */
	/*global document,window,jQuery,setTimeout,clearTimeout*/
	(function ($) {
		'use strict';
		var default_options  = {
			i18n: {
				ar: { // Arabic
					months: [
						"كانون الثاني", "شباط", "آذار", "نيسان", "مايو", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"
					],
					dayOfWeek: [
						"ن", "ث", "ع", "خ", "ج", "س", "ح"
					]
				},
				ro: { // Romanian
					months: [
						"ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"
					],
					dayOfWeek: [
						"l", "ma", "mi", "j", "v", "s", "d"
					]
				},
				id: { // Indonesian
					months: [
						"Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
					],
					dayOfWeek: [
						"Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"
					]
				},
				bg: { // Bulgarian
					months: [
						"Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"
					],
					dayOfWeek: [
						"Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"
					]
				},
				fa: { // Persian/Farsi
					months: [
						'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
					],
					dayOfWeek: [
						'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'
					]
				},
				ru: { // Russian
					months: [
						'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
					],
					dayOfWeek: [
						"Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"
					]
				},
				uk: { // Ukrainian
					months: [
						'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
					],
					dayOfWeek: [
						"Ндл", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт"
					]
				},
				en: { // English
					months: [
						"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
					],
					dayOfWeek: [
						"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
					]
				},
				el: { // Ελληνικά
					months: [
						"Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"
					],
					dayOfWeek: [
						"Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"
					]
				},
				de: { // German
					months: [
						'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
					],
					dayOfWeek: [
						"So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"
					]
				},
				nl: { // Dutch
					months: [
						"januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"
					],
					dayOfWeek: [
						"zo", "ma", "di", "wo", "do", "vr", "za"
					]
				},
				tr: { // Turkish
					months: [
						"Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
					],
					dayOfWeek: [
						"Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cts"
					]
				},
				fr: { //French
					months: [
						"Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
					],
					dayOfWeek: [
						"Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"
					]
				},
				es: { // Spanish
					months: [
						"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
					],
					dayOfWeek: [
						"Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"
					]
				},
				th: { // Thai
					months: [
						'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
					],
					dayOfWeek: [
						'อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'
					]
				},
				pl: { // Polish
					months: [
						"styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"
					],
					dayOfWeek: [
						"nd", "pn", "wt", "śr", "cz", "pt", "sb"
					]
				},
				pt: { // Portuguese
					months: [
						"Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
					],
					dayOfWeek: [
						"Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"
					]
				},
				ch: { // Simplified Chinese
					months: [
						"一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
					],
					dayOfWeek: [
						"日", "一", "二", "三", "四", "五", "六"
					]
				},
				se: { // Swedish
					months: [
						"Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September",  "Oktober", "November", "December"
					],
					dayOfWeek: [
						"Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"
					]
				},
				kr: { // Korean
					months: [
						"1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
					],
					dayOfWeek: [
						"일", "월", "화", "수", "목", "금", "토"
					]
				},
				it: { // Italian
					months: [
						"Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
					],
					dayOfWeek: [
						"Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"
					]
				},
				da: { // Dansk
					months: [
						"January", "Februar", "Marts", "April", "Maj", "Juni", "July", "August", "September", "Oktober", "November", "December"
					],
					dayOfWeek: [
						"Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"
					]
				},
				no: { // Norwegian
					months: [
						"Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"
					],
					dayOfWeek: [
						"Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"
					]
				},
				ja: { // Japanese
					months: [
						"1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"
					],
					dayOfWeek: [
						"日", "月", "火", "水", "木", "金", "土"
					]
				},
				vi: { // Vietnamese
					months: [
						"Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
					],
					dayOfWeek: [
						"CN", "T2", "T3", "T4", "T5", "T6", "T7"
					]
				},
				sl: { // Slovenščina
					months: [
						"Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"
					],
					dayOfWeek: [
						"Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"
					]
				},
				cs: { // Čeština
					months: [
						"Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
					],
					dayOfWeek: [
						"Ne", "Po", "Út", "St", "Čt", "Pá", "So"
					]
				},
				hu: { // Hungarian
					months: [
						"Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"
					],
					dayOfWeek: [
						"Va", "Hé", "Ke", "Sze", "Cs", "Pé", "Szo"
					]
				},
				az: { //Azerbaijanian (Azeri)
					months: [
						"Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
					],
					dayOfWeek: [
						"B", "Be", "Ça", "Ç", "Ca", "C", "Ş"
					]
				},
				bs: { //Bosanski
					months: [
						"Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
					],
					dayOfWeek: [
						"Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"
					]
				},
				ca: { //Català
					months: [
						"Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
					],
					dayOfWeek: [
						"Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"
					]
				},
				'en-GB': { //English (British)
					months: [
						"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
					],
					dayOfWeek: [
						"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
					]
				},
				et: { //"Eesti"
					months: [
						"Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"
					],
					dayOfWeek: [
						"P", "E", "T", "K", "N", "R", "L"
					]
				},
				eu: { //Euskara
					months: [
						"Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"
					],
					dayOfWeek: [
						"Ig.", "Al.", "Ar.", "Az.", "Og.", "Or.", "La."
					]
				},
				fi: { //Finnish (Suomi)
					months: [
						"Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
					],
					dayOfWeek: [
						"Su", "Ma", "Ti", "Ke", "To", "Pe", "La"
					]
				},
				gl: { //Galego
					months: [
						"Xan", "Feb", "Maz", "Abr", "Mai", "Xun", "Xul", "Ago", "Set", "Out", "Nov", "Dec"
					],
					dayOfWeek: [
						"Dom", "Lun", "Mar", "Mer", "Xov", "Ven", "Sab"
					]
				},
				hr: { //Hrvatski
					months: [
						"Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"
					],
					dayOfWeek: [
						"Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"
					]
				},
				ko: { //Korean (한국어)
					months: [
						"1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
					],
					dayOfWeek: [
						"일", "월", "화", "수", "목", "금", "토"
					]
				},
				lt: { //Lithuanian (lietuvių)
					months: [
						"Sausio", "Vasario", "Kovo", "Balandžio", "Gegužės", "Birželio", "Liepos", "Rugpjūčio", "Rugsėjo", "Spalio", "Lapkričio", "Gruodžio"
					],
					dayOfWeek: [
						"Sek", "Pir", "Ant", "Tre", "Ket", "Pen", "Šeš"
					]
				},
				lv: { //Latvian (Latviešu)
					months: [
						"Janvāris", "Februāris", "Marts", "Aprīlis ", "Maijs", "Jūnijs", "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"
					],
					dayOfWeek: [
						"Sv", "Pr", "Ot", "Tr", "Ct", "Pk", "St"
					]
				},
				mk: { //Macedonian (Македонски)
					months: [
						"јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"
					],
					dayOfWeek: [
						"нед", "пон", "вто", "сре", "чет", "пет", "саб"
					]
				},
				mn: { //Mongolian (Монгол)
					months: [
						"1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"
					],
					dayOfWeek: [
						"Дав", "Мяг", "Лха", "Пүр", "Бсн", "Бям", "Ням"
					]
				},
				'pt-BR': { //Português(Brasil)
					months: [
						"Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
					],
					dayOfWeek: [
						"Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"
					]
				},
				sk: { //Slovenčina
					months: [
						"Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"
					],
					dayOfWeek: [
						"Ne", "Po", "Ut", "St", "Št", "Pi", "So"
					]
				},
				sq: { //Albanian (Shqip)
					months: [
						"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
					],
					dayOfWeek: [
						"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
					]
				},
				'sr-YU': { //Serbian (Srpski)
					months: [
						"Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
					],
					dayOfWeek: [
						"Ned", "Pon", "Uto", "Sre", "čet", "Pet", "Sub"
					]
				},
				sr: { //Serbian Cyrillic (Српски)
					months: [
						"јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар"
					],
					dayOfWeek: [
						"нед", "пон", "уто", "сре", "чет", "пет", "суб"
					]
				},
				sv: { //Svenska
					months: [
						"Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"
					],
					dayOfWeek: [
						"Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"
					]
				},
				'zh-TW': { //Traditional Chinese (繁體中文)
					months: [
						"一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
					],
					dayOfWeek: [
						"日", "一", "二", "三", "四", "五", "六"
					]
				},
				zh: { //Simplified Chinese (简体中文)
					months: [
						"一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
					],
					dayOfWeek: [
						"日", "一", "二", "三", "四", "五", "六"
					]
				},
				he: { //Hebrew (עברית)
					months: [
						'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
					],
					dayOfWeek: [
						'א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'
					]
				}
			},
			value: '',
			lang: 'en',

			format:	'Y/m/d H:i',
			formatTime:	'H:i',
			formatDate:	'Y/m/d',

			startDate:	false, // new Date(), '1986/12/08', '-1970/01/05','-1970/01/05',
			step: 60,
			monthChangeSpinner: true,

			closeOnDateSelect: false,
			closeOnWithoutClick: true,
			closeOnInputClick: true,

			timepicker: true,
			datepicker: true,
			weeks: false,

			defaultTime: false,	// use formatTime format (ex. '10:00' for formatTime:	'H:i')
			defaultDate: false,	// use formatDate format (ex new Date() or '1986/12/08' or '-1970/01/05' or '-1970/01/05')

			minDate: false,
			maxDate: false,
			minTime: false,
			maxTime: false,

			allowTimes: [],
			opened: false,
			initTime: true,
			inline: false,
			theme: '',

			onSelectDate: function () {},
			onSelectTime: function () {},
			onChangeMonth: function () {},
			onChangeYear: function () {},
			onChangeDateTime: function () {},
			onShow: function () {},
			onClose: function () {},
			onGenerate: function () {},

			withoutCopyright: true,
			inverseButton: false,
			hours12: false,
			next:	'xdsoft_next',
			prev : 'xdsoft_prev',
			dayOfWeekStart: 0,
			parentID: 'body',
			timeHeightInTimePicker: 25,
			timepickerScrollbar: true,
			todayButton: true,
			defaultSelect: true,

			scrollMonth: true,
			scrollTime: true,
			scrollInput: true,

			lazyInit: false,
			mask: false,
			validateOnBlur: true,
			allowBlank: true,
			yearStart: 1950,
			yearEnd: 2050,
			style: '',
			id: '',
			fixed: false,
			roundTime: 'round', // ceil, floor
			className: '',
			weekends: [],
			disabledDates : [],
			yearOffset: 0,
			beforeShowDay: null,

			enterLikeTab: true
		};
		// fix for ie8
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (obj, start) {
				var i, j;
				for (i = (start || 0), j = this.length; i < j; i += 1) {
					if (this[i] === obj) { return i; }
				}
				return -1;
			};
		}
		Date.prototype.countDaysInMonth = function () {
			return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
		};
		$.fn.extend ( "xdsoftScroller"   ,  function (percent) {
			return this.each(function () {
				var timeboxparent = $(this),
					pointerEventToXY = function (e) {
						var out = {x: 0, y: 0},
							touch;
						if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
							touch  = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
							out.x = touch.clientX;
							out.y = touch.clientY;
						} else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
							out.x = e.clientX;
							out.y = e.clientY;
						}
						return out;
					},
					move = 0,
					timebox,
					parentHeight,
					height,
					scrollbar,
					scroller,
					maximumOffset = 100,
					start = false,
					startY = 0,
					startTop = 0,
					h1 = 0,
					touchStart = false,
					startTopScroll = 0,
					calcOffset = function () {};
				if (percent === 'hide') {
					timeboxparent.find('.xdsoft_scrollbar').hide();
					return;
				}
				if (!$(this).hasClass('xdsoft_scroller_box')) {
					timebox = timeboxparent.children().eq(0);
					parentHeight = timeboxparent[0].clientHeight;
					height = timebox[0].offsetHeight;
					scrollbar = $('<div class="xdsoft_scrollbar"></div>');
					scroller = $('<div class="xdsoft_scroller"></div>');
					scrollbar.append(scroller);

					timeboxparent.addClass('xdsoft_scroller_box').append(scrollbar);
					calcOffset = function calcOffset(event) {
						var offset = pointerEventToXY(event).y - startY + startTopScroll;
						if (offset < 0) {
							offset = 0;
						}
						if (offset + scroller[0].offsetHeight > h1) {
							offset = h1 - scroller[0].offsetHeight;
						}
						timeboxparent.trigger('scroll_element.xdsoft_scroller', [maximumOffset ? offset / maximumOffset : 0]);
					};

					scroller
						.on('touchstart.xdsoft_scroller mousedown.xdsoft_scroller', function (event) {
							if (!parentHeight) {
								timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent]);
							}

							startY = pointerEventToXY(event).y;
							startTopScroll = parseInt(scroller.css('margin-top'), 10);
							h1 = scrollbar[0].offsetHeight;

							if (event.type === 'mousedown') {
								if (document) {
									$(document.body).addClass('xdsoft_noselect');
								}
								$([document.body, window]).on('mouseup.xdsoft_scroller', function arguments_callee() {
									$([document.body, window]).off('mouseup.xdsoft_scroller', arguments_callee)
										.off('mousemove.xdsoft_scroller', calcOffset)
										.removeClass('xdsoft_noselect');
								});
								$(document.body).on('mousemove.xdsoft_scroller', calcOffset);
							} else {
								touchStart = true;
								event.stopPropagation();
								event.preventDefault();
							}
						})
						.on('touchmove', function (event) {
							if (touchStart) {
								event.preventDefault();
								calcOffset(event);
							}
						})
						.on('touchend touchcancel', function (event) {
							touchStart =  false;
							startTopScroll = 0;
						});

					timeboxparent
						.on('scroll_element.xdsoft_scroller', function (event, percentage) {
							if (!parentHeight) {
								timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percentage, true]);
							}
							percentage = percentage > 1 ? 1 : (percentage < 0 || isNaN(percentage)) ? 0 : percentage;

							scroller.css('margin-top', maximumOffset * percentage);

							setTimeout(function () {
								timebox.css('marginTop', -parseInt((timebox[0].offsetHeight - parentHeight) * percentage, 10));
							}, 10);
						})
						.on('resize_scroll.xdsoft_scroller', function (event, percentage, noTriggerScroll) {
							var percent, sh;
							parentHeight = timeboxparent[0].clientHeight;
							height = timebox[0].offsetHeight;
							percent = parentHeight / height;
							sh = percent * scrollbar[0].offsetHeight;
							if (percent > 1) {
								scroller.hide();
							} else {
								scroller.show();
								scroller.css('height', parseInt(sh > 10 ? sh : 10, 10));
								maximumOffset = scrollbar[0].offsetHeight - scroller[0].offsetHeight;
								if (noTriggerScroll !== true) {
									timeboxparent.trigger('scroll_element.xdsoft_scroller', [percentage || Math.abs(parseInt(timebox.css('marginTop'), 10)) / (height - parentHeight)]);
								}
							}
						});

					timeboxparent.on('mousewheel', function (event) {
						var top = Math.abs(parseInt(timebox.css('marginTop'), 10));

						top = top - (event.deltaY * 20);
						if (top < 0) {
							top = 0;
						}

						timeboxparent.trigger('scroll_element.xdsoft_scroller', [top / (height - parentHeight)]);
						event.stopPropagation();
						return false;
					});

					timeboxparent.on('touchstart', function (event) {
						start = pointerEventToXY(event);
						startTop = Math.abs(parseInt(timebox.css('marginTop'), 10));
					});

					timeboxparent.on('touchmove', function (event) {
						if (start) {
							event.preventDefault();
							var coord = pointerEventToXY(event);
							timeboxparent.trigger('scroll_element.xdsoft_scroller', [(startTop - (coord.y - start.y)) / (height - parentHeight)]);
						}
					});

					timeboxparent.on('touchend touchcancel', function (event) {
						start = false;
						startTop = 0;
					});
				}
				timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent]);
			});
		});

		$.fn.extend ( "datetimepicker" , function (opt) {
			var KEY0 = 48,
				KEY9 = 57,
				_KEY0 = 96,
				_KEY9 = 105,
				CTRLKEY = 17,
				DEL = 46,
				ENTER = 13,
				ESC = 27,
				BACKSPACE = 8,
				ARROWLEFT = 37,
				ARROWUP = 38,
				ARROWRIGHT = 39,
				ARROWDOWN = 40,
				TAB = 9,
				F5 = 116,
				AKEY = 65,
				CKEY = 67,
				VKEY = 86,
				ZKEY = 90,
				YKEY = 89,
				ctrlDown	=	false,
				options = ($.isPlainObject(opt) || !opt) ? $.extend(true, {}, default_options, opt) : $.extend(true, {}, default_options),

				lazyInitTimer = 0,
				createDateTimePicker,
				destroyDateTimePicker,
				_xdsoft_datetime,

				lazyInit = function (input) {
					input
						.on('open.xdsoft focusin.xdsoft mousedown.xdsoft', function initOnActionCallback(event) {
							if (input.is(':disabled') || input.is(':hidden') || !input.is(':visible') || input.data('xdsoft_datetimepicker')) {
								return;
							}
							clearTimeout(lazyInitTimer);
							lazyInitTimer = setTimeout(function () {

								if (!input.data('xdsoft_datetimepicker')) {
									createDateTimePicker(input);
								}
								input
									.off('open.xdsoft focusin.xdsoft mousedown.xdsoft', initOnActionCallback)
									.trigger('open.xdsoft');
							}, 100);
						});
				};

			createDateTimePicker = function (input) {
				var datetimepicker = $('<div ' + (options.id ? 'id="' + options.id + '"' : '') + ' ' + (options.style ? 'style="' + options.style + '"' : '') + ' class="xdsoft_datetimepicker xdsoft_' + options.theme + ' xdsoft_noselect ' + (options.weeks ? ' xdsoft_showweeks' : '') + options.className + '"></div>'),
					xdsoft_copyright = $('<div class="xdsoft_copyright"><a target="_blank" href="http://xdsoft.net/jqplugins/datetimepicker/">xdsoft.net</a></div>'),
					datepicker = $('<div class="xdsoft_datepicker active"></div>'),
					mounth_picker = $('<div class="xdsoft_mounthpicker"><button type="button" class="xdsoft_prev"></button><button type="button" class="xdsoft_today_button"></button>' +
						'<div class="xdsoft_label xdsoft_month"><span></span><i></i></div>' +
						'<div class="xdsoft_label xdsoft_year"><span></span><i></i></div>' +
						'<button type="button" class="xdsoft_next"></button></div>'),
					calendar = $('<div class="xdsoft_calendar"></div>'),
					timepicker = $('<div class="xdsoft_timepicker active"><button type="button" class="xdsoft_prev"></button><div class="xdsoft_time_box"></div><button type="button" class="xdsoft_next"></button></div>'),
					timeboxparent = timepicker.find('.xdsoft_time_box').eq(0),
					timebox = $('<div class="xdsoft_time_variant"></div>'),
					/*scrollbar = $('<div class="xdsoft_scrollbar"></div>'),
					scroller = $('<div class="xdsoft_scroller"></div>'),*/
					monthselect = $('<div class="xdsoft_select xdsoft_monthselect"><div></div></div>'),
					yearselect = $('<div class="xdsoft_select xdsoft_yearselect"><div></div></div>'),
					triggerAfterOpen = false,
					XDSoft_datetime,
					//scroll_element,
					xchangeTimer,
					timerclick,
					current_time_index,
					setPos,
					timer = 0,
					timer1 = 0;

				mounth_picker
					.find('.xdsoft_month span')
						.after(monthselect);
				mounth_picker
					.find('.xdsoft_year span')
						.after(yearselect);

				mounth_picker
					.find('.xdsoft_month,.xdsoft_year')
						.on('mousedown.xdsoft', function (event) {
						var select = $(this).find('.xdsoft_select').eq(0),
							val = 0,
							top = 0,
							visible = select.is(':visible'),
							items,
							i;

						mounth_picker
							.find('.xdsoft_select')
								.hide();
						if (_xdsoft_datetime.currentTime) {
							val = _xdsoft_datetime.currentTime[$(this).hasClass('xdsoft_month') ? 'getMonth' : 'getFullYear']();
						}

						select[visible ? 'hide' : 'show']();
						for (items = select.find('div.xdsoft_option'), i = 0; i < items.length; i += 1) {
							if (items.eq(i).data('value') === val) {
								break;
							} else {
								top += items[0].offsetHeight;
							}
						}

						select.xdsoftScroller(top / (select.children()[0].offsetHeight - (select[0].clientHeight)));
						event.stopPropagation();
						return false;
					});

				mounth_picker
					.find('.xdsoft_select')
						.xdsoftScroller()
					.on('mousedown.xdsoft', function (event) {
						event.stopPropagation();
						event.preventDefault();
					})
					.on('mousedown.xdsoft', '.xdsoft_option', function (event) {
						var year = _xdsoft_datetime.currentTime.getFullYear();
						if (_xdsoft_datetime && _xdsoft_datetime.currentTime) {
							_xdsoft_datetime.currentTime[$(this).parent().parent().hasClass('xdsoft_monthselect') ? 'setMonth' : 'setFullYear']($(this).data('value'));
						}

						$(this).parent().parent().hide();

						datetimepicker.trigger('xchange.xdsoft');
						if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
							options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
						}

						if (year !== _xdsoft_datetime.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
							options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
						}
					});

				datetimepicker.setOptions = function (_options) {
					options = $.extend(true, {}, options, _options);

					if (_options.allowTimes && $.isArray(_options.allowTimes) && _options.allowTimes.length) {
						options.allowTimes = $.extend(true, [], _options.allowTimes);
					}

					if (_options.weekends && $.isArray(_options.weekends) && _options.weekends.length) {
						options.weekends = $.extend(true, [], _options.weekends);
					}

					if (_options.disabledDates && $.isArray(_options.disabledDates) && _options.disabledDates.length) {
	                    options.disabledDates = $.extend(true, [], _options.disabledDates);
	                }

					if ((options.open || options.opened) && (!options.inline)) {
						input.trigger('open.xdsoft');
					}

					if (options.inline) {
						triggerAfterOpen = true;
						datetimepicker.addClass('xdsoft_inline');
						input.after(datetimepicker).hide();
					}

					if (options.inverseButton) {
						options.next = 'xdsoft_prev';
						options.prev = 'xdsoft_next';
					}

					if (options.datepicker) {
						datepicker.addClass('active');
					} else {
						datepicker.removeClass('active');
					}

					if (options.timepicker) {
						timepicker.addClass('active');
					} else {
						timepicker.removeClass('active');
					}

					if (options.value) {
						if (input && input.val) {
							input.val(options.value);
						}
						_xdsoft_datetime.setCurrentTime(options.value);
					}

					if (isNaN(options.dayOfWeekStart)) {
						options.dayOfWeekStart = 0;
					} else {
						options.dayOfWeekStart = parseInt(options.dayOfWeekStart, 10) % 7;
					}

					if (!options.timepickerScrollbar) {
						timeboxparent.xdsoftScroller('hide');
					}

					if (options.minDate && /^-(.*)$/.test(options.minDate)) {
						options.minDate = _xdsoft_datetime.strToDateTime(options.minDate).dateFormat(options.formatDate);
					}

					if (options.maxDate &&  /^\+(.*)$/.test(options.maxDate)) {
						options.maxDate = _xdsoft_datetime.strToDateTime(options.maxDate).dateFormat(options.formatDate);
					}

					mounth_picker
						.find('.xdsoft_today_button')
							.css('visibility', !options.todayButton ? 'hidden' : 'visible');

					if (options.mask) {
						var e,
							getCaretPos = function (input) {
								try {
									if (document.selection && document.selection.createRange) {
										var range = document.selection.createRange();
										return range.getBookmark().charCodeAt(2) - 2;
									}
									if (input.setSelectionRange) {
										return input.selectionStart;
									}
								} catch (e) {
									return 0;
								}
							},
							setCaretPos = function (node, pos) {
								node = (typeof node === "string" || node instanceof String) ? document.getElementById(node) : node;
								if (!node) {
									return false;
								}
								if (node.createTextRange) {
									var textRange = node.createTextRange();
									textRange.collapse(true);
									textRange.moveEnd('character', pos);
									textRange.moveStart('character', pos);
									textRange.select();
									return true;
								}
								if (node.setSelectionRange) {
									node.setSelectionRange(pos, pos);
									return true;
								}
								return false;
							},
							isValidValue = function (mask, value) {
								var reg = mask
									.replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g, '\\$1')
									.replace(/_/g, '{digit+}')
									.replace(/([0-9]{1})/g, '{digit$1}')
									.replace(/\{digit([0-9]{1})\}/g, '[0-$1_]{1}')
									.replace(/\{digit[\+]\}/g, '[0-9_]{1}');
								return (new RegExp(reg)).test(value);
							};
						input.off('keydown.xdsoft');

						if (options.mask === true) {
							options.mask = options.format
								.replace(/Y/g, '9999')
								.replace(/F/g, '9999')
								.replace(/m/g, '19')
								.replace(/d/g, '39')
								.replace(/H/g, '29')
								.replace(/i/g, '59')
								.replace(/s/g, '59');
						}

						if ($.type(options.mask) === 'string') {
							if (!isValidValue(options.mask, input.val())) {
								input.val(options.mask.replace(/[0-9]/g, '_'));
							}

							input.on('keydown.xdsoft', function (event) {
								var val = this.value,
									key = event.which,
									pos,
									digit;

								if (((key >= KEY0 && key <= KEY9) || (key >= _KEY0 && key <= _KEY9)) || (key === BACKSPACE || key === DEL)) {
									pos = getCaretPos(this);
									digit = (key !== BACKSPACE && key !== DEL) ? String.fromCharCode((_KEY0 <= key && key <= _KEY9) ? key - KEY0 : key) : '_';

									if ((key === BACKSPACE || key === DEL) && pos) {
										pos -= 1;
										digit = '_';
									}

									while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
										pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
									}

									val = val.substr(0, pos) + digit + val.substr(pos + 1);
									if ($.trim(val) === '') {
										val = options.mask.replace(/[0-9]/g, '_');
									} else {
										if (pos === options.mask.length) {
											event.preventDefault();
											return false;
										}
									}

									pos += (key === BACKSPACE || key === DEL) ? 0 : 1;
									while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
										pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
									}

									if (isValidValue(options.mask, val)) {
										this.value = val;
										setCaretPos(this, pos);
									} else if ($.trim(val) === '') {
										this.value = options.mask.replace(/[0-9]/g, '_');
									} else {
										input.trigger('error_input.xdsoft');
									}
								} else {
									if (([AKEY, CKEY, VKEY, ZKEY, YKEY].indexOf(key) !== -1 && ctrlDown) || [ESC, ARROWUP, ARROWDOWN, ARROWLEFT, ARROWRIGHT, F5, CTRLKEY, TAB, ENTER].indexOf(key) !== -1) {
										return true;
									}
								}

								event.preventDefault();
								return false;
							});
						}
					}
					if (options.validateOnBlur) {
						input
							.off('blur.xdsoft')
							.on('blur.xdsoft', function () {
								if (options.allowBlank && !$.trim($(this).val()).length) {
									$(this).val(null);
									datetimepicker.data('xdsoft_datetime').empty();
								} else if (!Date.parseDate($(this).val(), options.format)) {
									$(this).val((_xdsoft_datetime.now()).dateFormat(options.format));
									datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
								} else {
									datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
								}
								datetimepicker.trigger('changedatetime.xdsoft');
							});
					}
					options.dayOfWeekStartPrev = (options.dayOfWeekStart === 0) ? 6 : options.dayOfWeekStart - 1;

					datetimepicker
						.trigger('xchange.xdsoft')
						.trigger('afterOpen.xdsoft');
				};

				datetimepicker
					.data('options', options)
					.on('mousedown.xdsoft', function (event) {
						event.stopPropagation();
						event.preventDefault();
						yearselect.hide();
						monthselect.hide();
						return false;
					});

				//scroll_element = timepicker.find('.xdsoft_time_box');
				timeboxparent.append(timebox);
				timeboxparent.xdsoftScroller();

				datetimepicker.on('afterOpen.xdsoft', function () {
					timeboxparent.xdsoftScroller();
				});

				datetimepicker
					.append(datepicker)
					.append(timepicker);

				if (options.withoutCopyright !== true) {
					datetimepicker
						.append(xdsoft_copyright);
				}

				datepicker
					.append(mounth_picker)
					.append(calendar);

				$(options.parentID)
					.append(datetimepicker);

				XDSoft_datetime = function () {
					var _this = this;
					_this.now = function (norecursion) {
						var d = new Date(),
							date,
							time;

						if (!norecursion && options.defaultDate) {
							date = _this.strToDate(options.defaultDate);
							d.setFullYear(date.getFullYear());
							d.setMonth(date.getMonth());
							d.setDate(date.getDate());
						}

						if (options.yearOffset) {
							d.setFullYear(d.getFullYear() + options.yearOffset);
						}

						if (!norecursion && options.defaultTime) {
							time = _this.strtotime(options.defaultTime);
							d.setHours(time.getHours());
							d.setMinutes(time.getMinutes());
						}

						return d;
					};

					_this.isValidDate = function (d) {
						if (Object.prototype.toString.call(d) !== "[object Date]") {
							return false;
						}
						return !isNaN(d.getTime());
					};

					_this.setCurrentTime = function (dTime) {
						_this.currentTime = (typeof dTime === 'string') ? _this.strToDateTime(dTime) : _this.isValidDate(dTime) ? dTime : _this.now();
						datetimepicker.trigger('xchange.xdsoft');
					};

					_this.empty = function () {
						_this.currentTime = null;
					};

					_this.getCurrentTime = function (dTime) {
						return _this.currentTime;
					};

					_this.nextMonth = function () {
						var month = _this.currentTime.getMonth() + 1,
							year;
						if (month === 12) {
							_this.currentTime.setFullYear(_this.currentTime.getFullYear() + 1);
							month = 0;
						}

						year = _this.currentTime.getFullYear();

						_this.currentTime.setDate(
							Math.min(
								new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
								_this.currentTime.getDate()
							)
						);
						_this.currentTime.setMonth(month);

						if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
							options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
						}

						if (year !== _this.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
							options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
						}

						datetimepicker.trigger('xchange.xdsoft');
						return month;
					};

					_this.prevMonth = function () {
						var month = _this.currentTime.getMonth() - 1;
						if (month === -1) {
							_this.currentTime.setFullYear(_this.currentTime.getFullYear() - 1);
							month = 11;
						}
						_this.currentTime.setDate(
							Math.min(
								new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
								_this.currentTime.getDate()
							)
						);
						_this.currentTime.setMonth(month);
						if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
							options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
						}
						datetimepicker.trigger('xchange.xdsoft');
						return month;
					};

					_this.getWeekOfYear = function (datetime) {
						var onejan = new Date(datetime.getFullYear(), 0, 1);
						return Math.ceil((((datetime - onejan) / 86400000) + onejan.getDay() + 1) / 7);
					};

					_this.strToDateTime = function (sDateTime) {
						var tmpDate = [], timeOffset, currentTime;

						if (sDateTime && sDateTime instanceof Date && _this.isValidDate(sDateTime)) {
							return sDateTime;
						}

						tmpDate = /^(\+|\-)(.*)$/.exec(sDateTime);
						if (tmpDate) {
							tmpDate[2] = Date.parseDate(tmpDate[2], options.formatDate);
						}
						if (tmpDate  && tmpDate[2]) {
							timeOffset = tmpDate[2].getTime() - (tmpDate[2].getTimezoneOffset()) * 60000;
							currentTime = new Date((_xdsoft_datetime.now()).getTime() + parseInt(tmpDate[1] + '1', 10) * timeOffset);
						} else {
							currentTime = sDateTime ? Date.parseDate(sDateTime, options.format) : _this.now();
						}

						if (!_this.isValidDate(currentTime)) {
							currentTime = _this.now();
						}

						return currentTime;
					};

					_this.strToDate = function (sDate) {
						if (sDate && sDate instanceof Date && _this.isValidDate(sDate)) {
							return sDate;
						}

						var currentTime = sDate ? Date.parseDate(sDate, options.formatDate) : _this.now(true);
						if (!_this.isValidDate(currentTime)) {
							currentTime = _this.now(true);
						}
						return currentTime;
					};

					_this.strtotime = function (sTime) {
						if (sTime && sTime instanceof Date && _this.isValidDate(sTime)) {
							return sTime;
						}
						var currentTime = sTime ? Date.parseDate(sTime, options.formatTime) : _this.now(true);
						if (!_this.isValidDate(currentTime)) {
							currentTime = _this.now(true);
						}
						return currentTime;
					};

					_this.str = function () {
						return _this.currentTime.dateFormat(options.format);
					};
					_this.currentTime = this.now();
				};

				_xdsoft_datetime = new XDSoft_datetime();

				mounth_picker
					.find('.xdsoft_today_button')
					.on('mousedown.xdsoft', function () {
						datetimepicker.data('changed', true);
						_xdsoft_datetime.setCurrentTime(0);
						datetimepicker.trigger('afterOpen.xdsoft');
					}).on('dblclick.xdsoft', function () {
						input.val(_xdsoft_datetime.str());
						datetimepicker.trigger('close.xdsoft');
					});
				mounth_picker
					.find('.xdsoft_prev,.xdsoft_next')
					.on('mousedown.xdsoft', function () {
						var $this = $(this),
							timer = 0,
							stop = false;

						(function arguments_callee1(v) {
							var month =  _xdsoft_datetime.currentTime.getMonth();
							if ($this.hasClass(options.next)) {
								_xdsoft_datetime.nextMonth();
							} else if ($this.hasClass(options.prev)) {
								_xdsoft_datetime.prevMonth();
							}
							if (options.monthChangeSpinner) {
								if (!stop) {
									timer = setTimeout(arguments_callee1, v || 100);
								}
							}
						}(500));

						$([document.body, window]).on('mouseup.xdsoft', function arguments_callee2() {
							clearTimeout(timer);
							stop = true;
							$([document.body, window]).off('mouseup.xdsoft', arguments_callee2);
						});
					});

				timepicker
					.find('.xdsoft_prev,.xdsoft_next')
					.on('mousedown.xdsoft', function () {
						var $this = $(this),
							timer = 0,
							stop = false,
							period = 110;
						(function arguments_callee4(v) {
							var pheight = timeboxparent[0].clientHeight,
								height = timebox[0].offsetHeight,
								top = Math.abs(parseInt(timebox.css('marginTop'), 10));
							if ($this.hasClass(options.next) && (height - pheight) - options.timeHeightInTimePicker >= top) {
								timebox.css('marginTop', '-' + (top + options.timeHeightInTimePicker) + 'px');
							} else if ($this.hasClass(options.prev) && top - options.timeHeightInTimePicker >= 0) {
								timebox.css('marginTop', '-' + (top - options.timeHeightInTimePicker) + 'px');
							}
							timeboxparent.trigger('scroll_element.xdsoft_scroller', [Math.abs(parseInt(timebox.css('marginTop'), 10) / (height - pheight))]);
							period = (period > 10) ? 10 : period - 10;
							if (!stop) {
								timer = setTimeout(arguments_callee4, v || period);
							}
						}(500));
						$([document.body, window]).on('mouseup.xdsoft', function arguments_callee5() {
							clearTimeout(timer);
							stop = true;
							$([document.body, window])
								.off('mouseup.xdsoft', arguments_callee5);
						});
					});

				xchangeTimer = 0;
				// base handler - generating a calendar and timepicker
				datetimepicker
					.on('xchange.xdsoft', function (event) {
						clearTimeout(xchangeTimer);
						xchangeTimer = setTimeout(function () {
							var table =	'',
								start = new Date(_xdsoft_datetime.currentTime.getFullYear(), _xdsoft_datetime.currentTime.getMonth(), 1, 12, 0, 0),
								i = 0,
								j,
								today = _xdsoft_datetime.now(),
								maxDate = false,
								minDate = false,
								d,
								y,
								m,
								w,
								classes = [],
								customDateSettings,
								newRow = true,
								time = '',
								h = '',
								line_time;

							while (start.getDay() !== options.dayOfWeekStart) {
								start.setDate(start.getDate() - 1);
							}

							table += '<table><thead><tr>';

							if (options.weeks) {
								table += '<th></th>';
							}

							for (j = 0; j < 7; j += 1) {
								table += '<th>' + options.i18n[options.lang].dayOfWeek[(j + options.dayOfWeekStart) % 7] + '</th>';
							}

							table += '</tr></thead>';
							table += '<tbody>';

							if (options.maxDate !== false) {
								maxDate = _xdsoft_datetime.strToDate(options.maxDate);
								maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999);
							}

							if (options.minDate !== false) {
								minDate = _xdsoft_datetime.strToDate(options.minDate);
								minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
							}

							while (i < _xdsoft_datetime.currentTime.countDaysInMonth() || start.getDay() !== options.dayOfWeekStart || _xdsoft_datetime.currentTime.getMonth() === start.getMonth()) {
								classes = [];
								i += 1;

								d = start.getDate();
								y = start.getFullYear();
								m = start.getMonth();
								w = _xdsoft_datetime.getWeekOfYear(start);

								classes.push('xdsoft_date');

								if (options.beforeShowDay && $.isFunction(options.beforeShowDay.call)) {
									customDateSettings = options.beforeShowDay.call(datetimepicker, start);
								} else {
									customDateSettings = null;
								}

								if ((maxDate !== false && start > maxDate) || (minDate !== false && start < minDate) || (customDateSettings && customDateSettings[0] === false)) {
									classes.push('xdsoft_disabled');
								} else if (options.disabledDates.indexOf(start.dateFormat(options.formatDate)) !== -1) {
									classes.push('xdsoft_disabled');
								}

								if (customDateSettings && customDateSettings[1] !== "") {
									classes.push(customDateSettings[1]);
								}

								if (_xdsoft_datetime.currentTime.getMonth() !== m) {
									classes.push('xdsoft_other_month');
								}

								if ((options.defaultSelect || datetimepicker.data('changed')) && _xdsoft_datetime.currentTime.dateFormat(options.formatDate) === start.dateFormat(options.formatDate)) {
									classes.push('xdsoft_current');
								}

								if (today.dateFormat(options.formatDate) === start.dateFormat(options.formatDate)) {
									classes.push('xdsoft_today');
								}

								if (start.getDay() === 0 || start.getDay() === 6 || options.weekends.indexOf(start.dateFormat(options.formatDate)) === -1) {
									classes.push('xdsoft_weekend');
								}

								if (options.beforeShowDay && $.isFunction(options.beforeShowDay)) {
									classes.push(options.beforeShowDay(start));
								}

								if (newRow) {
									table += '<tr>';
									newRow = false;
									if (options.weeks) {
										table += '<th>' + w + '</th>';
									}
								}

								table += '<td data-date="' + d + '" data-month="' + m + '" data-year="' + y + '"' + ' class="xdsoft_date xdsoft_day_of_week' + start.getDay() + ' ' + classes.join(' ') + '">' +
											'<div>' + d + '</div>' +
										'</td>';

								if (start.getDay() === options.dayOfWeekStartPrev) {
									table += '</tr>';
									newRow = true;
								}

								start.setDate(d + 1);
							}
							table += '</tbody></table>';

							calendar.html(table);

							mounth_picker.find('.xdsoft_label span').eq(0).text(options.i18n[options.lang].months[_xdsoft_datetime.currentTime.getMonth()]);
							mounth_picker.find('.xdsoft_label span').eq(1).text(_xdsoft_datetime.currentTime.getFullYear());

							// generate timebox
							time = '';
							h = '';
							m = '';
							line_time = function line_time(h, m) {
								var now = _xdsoft_datetime.now();
								now.setHours(h);
								h = parseInt(now.getHours(), 10);
								now.setMinutes(m);
								m = parseInt(now.getMinutes(), 10);
								var optionDateTime = new Date(_xdsoft_datetime.currentTime)
								optionDateTime.setHours(h);
								optionDateTime.setMinutes(m);
								classes = [];
								if((options.minDateTime !== false && options.minDateTime > optionDateTime) || (options.maxTime !== false && _xdsoft_datetime.strtotime(options.maxTime).getTime() < now.getTime()) || (options.minTime !== false && _xdsoft_datetime.strtotime(options.minTime).getTime() > now.getTime())) {
									classes.push('xdsoft_disabled');
								}
								if ((options.initTime || options.defaultSelect || datetimepicker.data('changed')) && parseInt(_xdsoft_datetime.currentTime.getHours(), 10) === parseInt(h, 10) && (options.step > 59 || Math[options.roundTime](_xdsoft_datetime.currentTime.getMinutes() / options.step) * options.step === parseInt(m, 10))) {
									if (options.defaultSelect || datetimepicker.data('changed')) {
										classes.push('xdsoft_current');
									} else if (options.initTime) {
										classes.push('xdsoft_init_time');
									}
								}
								if (parseInt(today.getHours(), 10) === parseInt(h, 10) && parseInt(today.getMinutes(), 10) === parseInt(m, 10)) {
									classes.push('xdsoft_today');
								}
								time += '<div class="xdsoft_time ' + classes.join(' ') + '" data-hour="' + h + '" data-minute="' + m + '">' + now.dateFormat(options.formatTime) + '</div>';
							};

							if (!options.allowTimes || !$.isArray(options.allowTimes) || !options.allowTimes.length) {
								for (i = 0, j = 0; i < (options.hours12 ? 12 : 24); i += 1) {
									for (j = 0; j < 60; j += options.step) {
										h = (i < 10 ? '0' : '') + i;
										m = (j < 10 ? '0' : '') + j;
										line_time(h, m);
									}
								}
							} else {
								for (i = 0; i < options.allowTimes.length; i += 1) {
									h = _xdsoft_datetime.strtotime(options.allowTimes[i]).getHours();
									m = _xdsoft_datetime.strtotime(options.allowTimes[i]).getMinutes();
									line_time(h, m);
								}
							}

							timebox.html(time);

							opt = '';
							i = 0;

							for (i = parseInt(options.yearStart, 10) + options.yearOffset; i <= parseInt(options.yearEnd, 10) + options.yearOffset; i += 1) {
								opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getFullYear() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + i + '</div>';
							}
							yearselect.children().eq(0)
													.html(opt);

							for (i = 0, opt = ''; i <= 11; i += 1) {
								opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getMonth() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + options.i18n[options.lang].months[i] + '</div>';
							}
							monthselect.children().eq(0).html(opt);
							$(datetimepicker)
								.trigger('generate.xdsoft');
						}, 10);
						event.stopPropagation();
					})
					.on('afterOpen.xdsoft', function () {
						if (options.timepicker) {
							var classType, pheight, height, top;
							if (timebox.find('.xdsoft_current').length) {
								classType = '.xdsoft_current';
							} else if (timebox.find('.xdsoft_init_time').length) {
								classType = '.xdsoft_init_time';
							}
							if (classType) {
								pheight = timeboxparent[0].clientHeight;
								height = timebox[0].offsetHeight;
								top = timebox.find(classType).index() * options.timeHeightInTimePicker + 1;
								if ((height - pheight) < top) {
									top = height - pheight;
								}
								timeboxparent.trigger('scroll_element.xdsoft_scroller', [parseInt(top, 10) / (height - pheight)]);
							} else {
								timeboxparent.trigger('scroll_element.xdsoft_scroller', [0]);
							}
						}
					});

				timerclick = 0;
				calendar
					.on('click.xdsoft', 'td', function (xdevent) {
						xdevent.stopPropagation();  // Prevents closing of Pop-ups, Modals and Flyouts in Bootstrap
						timerclick += 1;
						var $this = $(this),
							currentTime = _xdsoft_datetime.currentTime;

						if (currentTime === undefined || currentTime === null) {
							_xdsoft_datetime.currentTime = _xdsoft_datetime.now();
							currentTime = _xdsoft_datetime.currentTime;
						}

						if ($this.hasClass('xdsoft_disabled')) {
							return false;
						}

						currentTime.setDate(1);
						currentTime.setFullYear($this.data('year'));
						currentTime.setMonth($this.data('month'));
						currentTime.setDate($this.data('date'));

						datetimepicker.trigger('select.xdsoft', [currentTime]);

						input.val(_xdsoft_datetime.str());
						if ((timerclick > 1 || (options.closeOnDateSelect === true || (options.closeOnDateSelect === 0 && !options.timepicker))) && !options.inline) {
							datetimepicker.trigger('close.xdsoft');
						}

						if (options.onSelectDate &&	$.isFunction(options.onSelectDate)) {
							options.onSelectDate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
						}

						datetimepicker.data('changed', true);
						datetimepicker.trigger('xchange.xdsoft');
						datetimepicker.trigger('changedatetime.xdsoft');
						setTimeout(function () {
							timerclick = 0;
						}, 200);
					});

				timebox
					.on('click.xdsoft', 'div', function (xdevent) {
						xdevent.stopPropagation();
						var $this = $(this),
							currentTime = _xdsoft_datetime.currentTime;

						if (currentTime === undefined || currentTime === null) {
							_xdsoft_datetime.currentTime = _xdsoft_datetime.now();
							currentTime = _xdsoft_datetime.currentTime;
						}

						if ($this.hasClass('xdsoft_disabled')) {
							return false;
						}
						currentTime.setHours($this.data('hour'));
						currentTime.setMinutes($this.data('minute'));
						datetimepicker.trigger('select.xdsoft', [currentTime]);

						datetimepicker.data('input').val(_xdsoft_datetime.str());
						if (!options.inline) {
							datetimepicker.trigger('close.xdsoft');
						}

						if (options.onSelectTime && $.isFunction(options.onSelectTime)) {
							options.onSelectTime.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
						}
						datetimepicker.data('changed', true);
						datetimepicker.trigger('xchange.xdsoft');
						datetimepicker.trigger('changedatetime.xdsoft');
					});


				datepicker
					.on('mousewheel.xdsoft', function (event) {
						if (!options.scrollMonth) {
							return true;
						}
						if (event.deltaY < 0) {
							_xdsoft_datetime.nextMonth();
						} else {
							_xdsoft_datetime.prevMonth();
						}
						return false;
					});

				input
					.on('mousewheel.xdsoft', function (event) {
						if (!options.scrollInput) {
							return true;
						}
						if (!options.datepicker && options.timepicker) {
							current_time_index = timebox.find('.xdsoft_current').length ? timebox.find('.xdsoft_current').eq(0).index() : 0;
							if (current_time_index + event.deltaY >= 0 && current_time_index + event.deltaY < timebox.children().length) {
								current_time_index += event.deltaY;
							}
							if (timebox.children().eq(current_time_index).length) {
								timebox.children().eq(current_time_index).trigger('mousedown');
							}
							return false;
						}
						if (options.datepicker && !options.timepicker) {
							datepicker.trigger(event, [event.deltaY, event.deltaX, event.deltaY]);
							if (input.val) {
								input.val(_xdsoft_datetime.str());
							}
							datetimepicker.trigger('changedatetime.xdsoft');
							return false;
						}
					});

				datetimepicker
					.on('changedatetime.xdsoft', function (event) {
						if (options.onChangeDateTime && $.isFunction(options.onChangeDateTime)) {
							var $input = datetimepicker.data('input');
							options.onChangeDateTime.call(datetimepicker, _xdsoft_datetime.currentTime, $input, event);
							delete options.value;
							$input.trigger('change');
						}
					})
					.on('generate.xdsoft', function () {
						if (options.onGenerate && $.isFunction(options.onGenerate)) {
							options.onGenerate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
						}
						if (triggerAfterOpen) {
							datetimepicker.trigger('afterOpen.xdsoft');
							triggerAfterOpen = false;
						}
					})
					.on('click.xdsoft', function (xdevent) {
						xdevent.stopPropagation();
					});

				current_time_index = 0;

				setPos = function () {
					var offset = datetimepicker.data('input').offset(), top = offset.top + datetimepicker.data('input')[0].offsetHeight - 1, left = offset.left, position = "absolute";
					if (options.fixed) {
						top -= $(window).scrollTop();
						left -= $(window).scrollLeft();
						position = "fixed";
					} else {
						if (top + datetimepicker[0].offsetHeight > $(window).height() + $(window).scrollTop()) {
							top = offset.top - datetimepicker[0].offsetHeight + 1;
						}
						if (top < 0) {
							top = 0;
						}
						if (left + datetimepicker[0].offsetWidth > $(window).width()) {
							left = $(window).width() - datetimepicker[0].offsetWidth;
						}
					}
					datetimepicker.css({
						left: left,
						top: top,
						position: position
					});
				};
				datetimepicker
					.on('open.xdsoft', function (event) {
						var onShow = true;
						if (options.onShow && $.isFunction(options.onShow)) {
							onShow = options.onShow.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
						}
						if (onShow !== false) {
							datetimepicker.show();
							setPos();
							$(window)
								.off('resize.xdsoft', setPos)
								.on('resize.xdsoft', setPos);

							if (options.closeOnWithoutClick) {
								$([document.body, window]).on('mousedown.xdsoft', function arguments_callee6() {
									datetimepicker.trigger('close.xdsoft');
									$([document.body, window]).off('mousedown.xdsoft', arguments_callee6);
								});
							}
						}
					})
					.on('close.xdsoft', function (event) {
						var onClose = true;
						mounth_picker
							.find('.xdsoft_month,.xdsoft_year')
								.find('.xdsoft_select')
									.hide();
						if (options.onClose && $.isFunction(options.onClose)) {
							onClose = options.onClose.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
						}
						if (onClose !== false && !options.opened && !options.inline) {
							datetimepicker.hide();
						}
						event.stopPropagation();
					})
					.on('toggle.xdsoft', function (event) {
						if (datetimepicker.is(':visible')) {
							datetimepicker.trigger('close.xdsoft');
						} else {
							datetimepicker.trigger('open.xdsoft');
						}
					})
					.data('input', input);

				timer = 0;
				timer1 = 0;

				datetimepicker.data('xdsoft_datetime', _xdsoft_datetime);
				datetimepicker.setOptions(options);

				function getCurrentValue() {

					var ct = false, time;

					if (options.startDate) {
						ct = _xdsoft_datetime.strToDate(options.startDate);
					} else {
						ct = options.value || ((input && input.val && input.val()) ? input.val() : '');
						if (ct) {
							ct = _xdsoft_datetime.strToDateTime(ct);
						} else if (options.defaultDate) {
							ct = _xdsoft_datetime.strToDate(options.defaultDate);
							if (options.defaultTime) {
								time = _xdsoft_datetime.strtotime(options.defaultTime);
								ct.setHours(time.getHours());
								ct.setMinutes(time.getMinutes());
							}
						}
					}

					if (ct && _xdsoft_datetime.isValidDate(ct)) {
						datetimepicker.data('changed', true);
					} else {
						ct = '';
					}

					return ct || 0;
				}

				_xdsoft_datetime.setCurrentTime(getCurrentValue());

				input
					.data('xdsoft_datetimepicker', datetimepicker)
					.on('open.xdsoft focusin.xdsoft mousedown.xdsoft', function (event) {
						if (input.is(':disabled') || input.is(':hidden') || !input.is(':visible') || (input.data('xdsoft_datetimepicker').is(':visible') && options.closeOnInputClick)) {
							return;
						}
						clearTimeout(timer);
						timer = setTimeout(function () {
							if (input.is(':disabled') || input.is(':hidden') || !input.is(':visible')) {
								return;
							}

							triggerAfterOpen = true;
							_xdsoft_datetime.setCurrentTime(getCurrentValue());

							datetimepicker.trigger('open.xdsoft');
						}, 100);
					})
					.on('keydown.xdsoft', function (event) {
						var val = this.value, elementSelector,
							key = event.which;
						if ([ENTER].indexOf(key) !== -1 && options.enterLikeTab) {
							elementSelector = $("input:visible,textarea:visible");
							datetimepicker.trigger('close.xdsoft');
							elementSelector.eq(elementSelector.index(this) + 1).focus();
							return false;
						}
						if ([TAB].indexOf(key) !== -1) {
							datetimepicker.trigger('close.xdsoft');
							return true;
						}
					});
			};
			destroyDateTimePicker = function (input) {
				var datetimepicker = input.data('xdsoft_datetimepicker');
				if (datetimepicker) {
					datetimepicker.data('xdsoft_datetime', null);
					datetimepicker.remove();
					input
						.data('xdsoft_datetimepicker', null)
						.off('.xdsoft');
					$(window).off('resize.xdsoft');
					$([window, document.body]).off('mousedown.xdsoft');
					if (input.unmousewheel) {
						input.unmousewheel();
					}
				}
			};
			$(document)
				.off('keydown.xdsoftctrl keyup.xdsoftctrl')
				.on('keydown.xdsoftctrl', function (e) {
					if (e.keyCode === CTRLKEY) {
						ctrlDown = true;
					}
				})
				.on('keyup.xdsoftctrl', function (e) {
					if (e.keyCode === CTRLKEY) {
						ctrlDown = false;
					}
				});
			return this.each(function () {
				var datetimepicker = $(this).data('xdsoft_datetimepicker');
				if (datetimepicker) {
					if ($.type(opt) === 'string') {
						switch (opt) {
						case 'show':
							$(this).select().focus();
							datetimepicker.trigger('open.xdsoft');
							break;
						case 'hide':
							datetimepicker.trigger('close.xdsoft');
							break;
						case 'toggle':
							datetimepicker.trigger('toggle.xdsoft');
							break;
						case 'destroy':
							destroyDateTimePicker($(this));
							break;
						case 'reset':
							this.value = this.defaultValue;
							if (!this.value || !datetimepicker.data('xdsoft_datetime').isValidDate(Date.parseDate(this.value, options.format))) {
								datetimepicker.data('changed', false);
							}
							datetimepicker.data('xdsoft_datetime').setCurrentTime(this.value);
							break;
						}
					} else {
						datetimepicker
							.setOptions(opt);
					}
					return 0;
				}
				if ($.type(opt) !== 'string') {
					if (!options.lazyInit || options.open || options.inline) {
						createDateTimePicker($(this));
					} else {
						lazyInit($(this));
					}
				}
			});
		});
		$.fn.extend ( "datetimepicker.defaults" , default_options);
	}(jQuery));
	(function () {

	/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
	 * Licensed under the MIT License (LICENSE.txt).
	 *
	 * Version: 3.1.12
	 *
	 * Requires: jQuery 1.2.2+
	 */
	!function(a){true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (a), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});

	// Parse and Format Library
	//http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
	/*
	 * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
	 *
	 * This program is free software; you can redistribute it and/or modify it
	 * under the terms of the GNU Lesser General Public License as published by the
	 * Free Software Foundation, version 2.1.
	 *
	 * This program is distributed in the hope that it will be useful, but WITHOUT
	 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
	 * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
	 * details.
	 */
	Date.parseFunctions={count:0};Date.parseRegexes=[];Date.formatFunctions={count:0};Date.prototype.dateFormat=function(b){if(b=="unixtime"){return parseInt(this.getTime()/1000);}if(Date.formatFunctions[b]==null){Date.createNewFormat(b);}var a=Date.formatFunctions[b];return this[a]();};Date.createNewFormat=function(format){var funcName="format"+Date.formatFunctions.count++;Date.formatFunctions[format]=funcName;var code="Date.prototype."+funcName+" = function() {return ";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}else{if(special){special=false;code+="'"+String.escape(ch)+"' + ";}else{code+=Date.getFormatCode(ch);}}}eval(code.substring(0,code.length-3)+";}");};Date.getFormatCode=function(a){switch(a){case"d":return"String.leftPad(this.getDate(), 2, '0') + ";case"D":return"Date.dayNames[this.getDay()].substring(0, 3) + ";case"j":return"this.getDate() + ";case"l":return"Date.dayNames[this.getDay()] + ";case"S":return"this.getSuffix() + ";case"w":return"this.getDay() + ";case"z":return"this.getDayOfYear() + ";case"W":return"this.getWeekOfYear() + ";case"F":return"Date.monthNames[this.getMonth()] + ";case"m":return"String.leftPad(this.getMonth() + 1, 2, '0') + ";case"M":return"Date.monthNames[this.getMonth()].substring(0, 3) + ";case"n":return"(this.getMonth() + 1) + ";case"t":return"this.getDaysInMonth() + ";case"L":return"(this.isLeapYear() ? 1 : 0) + ";case"Y":return"this.getFullYear() + ";case"y":return"('' + this.getFullYear()).substring(2, 4) + ";case"a":return"(this.getHours() < 12 ? 'am' : 'pm') + ";case"A":return"(this.getHours() < 12 ? 'AM' : 'PM') + ";case"g":return"((this.getHours() %12) ? this.getHours() % 12 : 12) + ";case"G":return"this.getHours() + ";case"h":return"String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";case"H":return"String.leftPad(this.getHours(), 2, '0') + ";case"i":return"String.leftPad(this.getMinutes(), 2, '0') + ";case"s":return"String.leftPad(this.getSeconds(), 2, '0') + ";case"O":return"this.getGMTOffset() + ";case"T":return"this.getTimezone() + ";case"Z":return"(this.getTimezoneOffset() * -60) + ";default:return"'"+String.escape(a)+"' + ";}};Date.parseDate=function(a,c){if(c=="unixtime"){return new Date(!isNaN(parseInt(a))?parseInt(a)*1000:0);}if(Date.parseFunctions[c]==null){Date.createParser(c);}var b=Date.parseFunctions[c];return Date[b](a);};Date.createParser=function(format){var funcName="parse"+Date.parseFunctions.count++;var regexNum=Date.parseRegexes.length;var currentGroup=1;Date.parseFunctions[format]=funcName;var code="Date."+funcName+" = function(input) {\nvar y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, z = -1;\nvar d = new Date();\ny = d.getFullYear();\nm = d.getMonth();\nd = d.getDate();\nvar results = input.match(Date.parseRegexes["+regexNum+"]);\nif (results && results.length > 0) {";var regex="";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}else{if(special){special=false;regex+=String.escape(ch);}else{obj=Date.formatCodeToRegex(ch,currentGroup);currentGroup+=obj.g;regex+=obj.s;if(obj.g&&obj.c){code+=obj.c;}}}}code+="if (y > 0 && z > 0){\nvar doyDate = new Date(y,0);\ndoyDate.setDate(z);\nm = doyDate.getMonth();\nd = doyDate.getDate();\n}";code+="if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n{return new Date(y, m, d, h, i, s);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n{return new Date(y, m, d, h, i);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0)\n{return new Date(y, m, d, h);}\nelse if (y > 0 && m >= 0 && d > 0)\n{return new Date(y, m, d);}\nelse if (y > 0 && m >= 0)\n{return new Date(y, m);}\nelse if (y > 0)\n{return new Date(y);}\n}return null;}";Date.parseRegexes[regexNum]=new RegExp("^"+regex+"$");eval(code);};Date.formatCodeToRegex=function(b,a){switch(b){case"D":return{g:0,c:null,s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};case"j":case"d":return{g:1,c:"d = parseInt(results["+a+"], 10);\n",s:"(\\d{1,2})"};case"l":return{g:0,c:null,s:"(?:"+Date.dayNames.join("|")+")"};case"S":return{g:0,c:null,s:"(?:st|nd|rd|th)"};case"w":return{g:0,c:null,s:"\\d"};case"z":return{g:1,c:"z = parseInt(results["+a+"], 10);\n",s:"(\\d{1,3})"};case"W":return{g:0,c:null,s:"(?:\\d{2})"};case"F":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+a+"].substring(0, 3)], 10);\n",s:"("+Date.monthNames.join("|")+")"};case"M":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+a+"]], 10);\n",s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};case"n":case"m":return{g:1,c:"m = parseInt(results["+a+"], 10) - 1;\n",s:"(\\d{1,2})"};case"t":return{g:0,c:null,s:"\\d{1,2}"};case"L":return{g:0,c:null,s:"(?:1|0)"};case"Y":return{g:1,c:"y = parseInt(results["+a+"], 10);\n",s:"(\\d{4})"};case"y":return{g:1,c:"var ty = parseInt(results["+a+"], 10);\ny = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",s:"(\\d{1,2})"};case"a":return{g:1,c:"if (results["+a+"] == 'am') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",s:"(am|pm)"};case"A":return{g:1,c:"if (results["+a+"] == 'AM') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",s:"(AM|PM)"};case"g":case"G":case"h":case"H":return{g:1,c:"h = parseInt(results["+a+"], 10);\n",s:"(\\d{1,2})"};case"i":return{g:1,c:"i = parseInt(results["+a+"], 10);\n",s:"(\\d{2})"};case"s":return{g:1,c:"s = parseInt(results["+a+"], 10);\n",s:"(\\d{2})"};case"O":return{g:0,c:null,s:"[+-]\\d{4}"};case"T":return{g:0,c:null,s:"[A-Z]{3}"};case"Z":return{g:0,c:null,s:"[+-]\\d{1,5}"};default:return{g:0,c:null,s:String.escape(b)};}};Date.prototype.getTimezone=function(){return this.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/,"$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/,"$1$2$3");};Date.prototype.getGMTOffset=function(){return(this.getTimezoneOffset()>0?"-":"+")+String.leftPad(Math.floor(Math.abs(this.getTimezoneOffset())/60),2,"0")+String.leftPad(Math.abs(this.getTimezoneOffset())%60,2,"0");};Date.prototype.getDayOfYear=function(){var a=0;Date.daysInMonth[1]=this.isLeapYear()?29:28;for(var b=0;b<this.getMonth();++b){a+=Date.daysInMonth[b];}return a+this.getDate();};Date.prototype.getWeekOfYear=function(){var b=this.getDayOfYear()+(4-this.getDay());var a=new Date(this.getFullYear(),0,1);var c=(7-a.getDay()+4);return String.leftPad(Math.ceil((b-c)/7)+1,2,"0");};Date.prototype.isLeapYear=function(){var a=this.getFullYear();return((a&3)==0&&(a%100||(a%400==0&&a)));};Date.prototype.getFirstDayOfMonth=function(){var a=(this.getDay()-(this.getDate()-1))%7;return(a<0)?(a+7):a;};Date.prototype.getLastDayOfMonth=function(){var a=(this.getDay()+(Date.daysInMonth[this.getMonth()]-this.getDate()))%7;return(a<0)?(a+7):a;};Date.prototype.getDaysInMonth=function(){Date.daysInMonth[1]=this.isLeapYear()?29:28;return Date.daysInMonth[this.getMonth()];};Date.prototype.getSuffix=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};String.escape=function(a){return a.replace(/('|\\)/g,"\\$1");};String.leftPad=function(d,b,c){var a=new String(d);if(c==null){c=" ";}while(a.length<b){a=c+a;}return a;};Date.daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];Date.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];Date.dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];Date.y2kYear=50;Date.monthNumbers={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};Date.patterns={ISO8601LongPattern:"Y-m-d H:i:s",ISO8601ShortPattern:"Y-m-d",ShortDatePattern:"n/j/Y",LongDatePattern:"l, F d, Y",FullDateTimePattern:"l, F d, Y g:i:s A",MonthDayPattern:"F d",ShortTimePattern:"g:i A",LongTimePattern:"g:i:s A",SortableDateTimePattern:"Y-m-d\\TH:i:s",UniversalSortableDateTimePattern:"Y-m-d H:i:sO",YearMonthPattern:"F, Y"};
	}());

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },

/***/ 19:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * Map
	 * @class
	 */
	function Map() {
	    this.map = {};
	    this.length = 0;
	}
	Map.prototype = {
	    constructor: Map,
	    /**
	     * has
	     * @param {String} key
	     * @returns {Boolean}
	     */
	    has: function (key) {
	        return (key in this.map);
	    },
	    /**
	     * get
	     * @param {String} key
	     * @returns {Any}
	     */
	    get: function (key) {
	        return this.map[key];
	    },
	    /**
	     * set
	     * @param {String} key
	     * @param {Any} value
	     */
	    set: function (key, value) {
	        !this.has(key) && this.length++;
	        return (this.map[key] = value);
	    },
	    /**
	     * count
	     * @returns {Number}
	     */
	    count: function () {
	        return this.length;
	    },
	    /**
	     * remove
	     * @param {String} key
	     */
	    remove: function (key) {
	        if (this.has(key)) {
	            this.map[key] = null;
	            delete this.map[key];
	            this.length--;
	        }
	    }
	};

	var cache = new Map(), set = cache.set, uid = 0;
	cache.set = function (node, value) {
	    if (!value) {
	        value = node;
	        set.call(cache, ++uid + '', value);
	        return uid;
	    } else {
	        typeof node === 'string' &&
	        (node = $(node)[0]);
	        $.data(node, 'event-data', value);
	        return this;
	    }
	};

	function _key(arr) {
	    if (!arr) return {};
	    arr = arr.split(' ');
	    var obj = {};
	    for (var i = 0, l = arr.length; i < l; i++) {
	        obj[arr[i]] = true;
	    }
	    return obj;
	}

	/**
	 * Delegator
	 * @class
	 * @param {Selector} container
	 */
	function Delegator(container) {
	    this.container = $(container);
	    this.listenerMap = new Map();
	}

	/**
	 * getKey
	 * @param {Any} value
	 * @returns {Number}
	 */
	Delegator.set = cache.set;
	/**
	 * cache
	 * @class
	 * @static
	 */
	Delegator.cache = cache;

	Delegator.prototype = {
	    constructor: Delegator,
	    _getListener: function (type) {
	        if (this.listenerMap.has(type)) {
	            return this.listenerMap.get(type);
	        }
	        function listener(e) {
	            var data = $.data(this),
	                routes = data['event-' + type + '-routes'],
	                eventData = data['event-data'], handle, dataKey;

	            // preprocessing
	            if (!routes && (routes = this.getAttribute('data-event-' + type))) {
	                (routes = routes.split(' ')) &&
	                (data['event-' + type + '-routes'] = routes);
	                !eventData &&
	                (dataKey = this.getAttribute('data-event-data')) &&
	                (eventData = cache.get(dataKey)) &&
	                (data['event-data'] = eventData) &&
	                (cache.remove(dataKey));
	                !data['event-stop-propagation'] &&
	                (data['event-stop-propagation'] = _key(this.getAttribute('data-event-stop-propagation')));
	            }

	            if (routes) {
	                for (var i = 0, l = routes.length; i < l; i++) {
	                    handle = listener.handleMap.get(routes[i]);

	                    if (handle) {
	                        handle.call(this, e, eventData);
	                    }
	                    data['event-stop-propagation'][type] &&
	                    e.stopPropagation();
	                }
	            }
	        }

	        listener.handleMap = new Map();
	        this.listenerMap.set(type, listener);
	        this.container.on(type, '[data-event-' + type + ']', listener);
	        return listener;
	    },
	    /**
	     * on
	     * @param {String} type
	     * @param {String} name
	     * @param {Function} handle
	     */
	    on: function (type, name, handle) {
	        var listener = this._getListener(type);
	        listener.handleMap.set(name, handle);
	        return this;
	    },
	    /**
	     * off
	     * @param {String} type
	     * @param {String} name
	     */
	    off: function (type, name) {
	        var listener = this._getListener(type),
	            handleMap = listener.handleMap;
	        handleMap.remove(name);
	        if (!handleMap.count()) {
	            this.container.off(type, '[data-event-' + type + ']', listener);
	            this.listenerMap.remove(type);
	        }
	    }
	};

	module.exports = Delegator;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },

/***/ 20:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var Delegator = __webpack_require__(19);
	var modal = __webpack_require__(118);

	    var container;

	    function hide() {
	        container.removeClass('in');
	        container.find('.modal-backdrop').removeClass('in');
	        setTimeout(function () {
	            container.remove();
	            container = undefined;
	        }, 300);
	    }

	    function Dialog (param) {
	        if (container) {
	            container.remove();
	            container = undefined;
	        }
	        container = $(modal({it :param}))
	            .appendTo(document.body)
	            .show();

	        var key,
	            action,
	            delegator,
	            on = param.on || {};

	        delegator = (new Delegator(container))
	            .on('click', 'close', hide);

	        for (key in on) {
	            action = key.split('/');
	            delegator.on(action[0], action[1], on[key]);
	        }

	        setTimeout(function () {
	            container.addClass('in');
	            container.find('.modal-backdrop').addClass('in');
	        }, 0);
	    }

	    Dialog.hide = hide;

	module.exports =  Dialog;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },

/***/ 21:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery) {/*
	 Highcharts JS v4.0.1 (2014-04-24)

	 (c) 2009-2014 Torstein Honsi

	 License: www.highcharts.com/license
	*/
	(function(){function q(a,b){var c;a||(a={});for(c in b)a[c]=b[c];return a}function w(){var a,b=arguments,c,d={},e=function(a,b){var c,d;typeof a!=="object"&&(a={});for(d in b)b.hasOwnProperty(d)&&(c=b[d],a[d]=c&&typeof c==="object"&&Object.prototype.toString.call(c)!=="[object Array]"&&d!=="renderTo"&&typeof c.nodeType!=="number"?e(a[d]||{},c):b[d]);return a};b[0]===!0&&(d=b[1],b=Array.prototype.slice.call(b,2));c=b.length;for(a=0;a<c;a++)d=e(d,b[a]);return d}function z(a,b){return parseInt(a,b||
	10)}function Fa(a){return typeof a==="string"}function ca(a){return typeof a==="object"}function La(a){return Object.prototype.toString.call(a)==="[object Array]"}function ha(a){return typeof a==="number"}function za(a){return U.log(a)/U.LN10}function ia(a){return U.pow(10,a)}function ja(a,b){for(var c=a.length;c--;)if(a[c]===b){a.splice(c,1);break}}function r(a){return a!==t&&a!==null}function H(a,b,c){var d,e;if(Fa(b))r(c)?a.setAttribute(b,c):a&&a.getAttribute&&(e=a.getAttribute(b));else if(r(b)&&
	ca(b))for(d in b)a.setAttribute(d,b[d]);return e}function qa(a){return La(a)?a:[a]}function m(){var a=arguments,b,c,d=a.length;for(b=0;b<d;b++)if(c=a[b],typeof c!=="undefined"&&c!==null)return c}function G(a,b){if(Aa&&!aa&&b&&b.opacity!==t)b.filter="alpha(opacity="+b.opacity*100+")";q(a.style,b)}function Y(a,b,c,d,e){a=y.createElement(a);b&&q(a,b);e&&G(a,{padding:0,border:Q,margin:0});c&&G(a,c);d&&d.appendChild(a);return a}function ka(a,b){var c=function(){};c.prototype=new a;q(c.prototype,b);return c}
	function Ga(a,b,c,d){var e=E.lang,a=+a||0,f=b===-1?(a.toString().split(".")[1]||"").length:isNaN(b=M(b))?2:b,b=c===void 0?e.decimalPoint:c,d=d===void 0?e.thousandsSep:d,e=a<0?"-":"",c=String(z(a=M(a).toFixed(f))),g=c.length>3?c.length%3:0;return e+(g?c.substr(0,g)+d:"")+c.substr(g).replace(/(\d{3})(?=\d)/g,"$1"+d)+(f?b+M(a-c).toFixed(f).slice(2):"")}function Ha(a,b){return Array((b||2)+1-String(a).length).join(0)+a}function Ma(a,b,c){var d=a[b];a[b]=function(){var a=Array.prototype.slice.call(arguments);
	a.unshift(d);return c.apply(this,a)}}function Ia(a,b){for(var c="{",d=!1,e,f,g,h,i,j=[];(c=a.indexOf(c))!==-1;){e=a.slice(0,c);if(d){f=e.split(":");g=f.shift().split(".");i=g.length;e=b;for(h=0;h<i;h++)e=e[g[h]];if(f.length)f=f.join(":"),g=/\.([0-9])/,h=E.lang,i=void 0,/f$/.test(f)?(i=(i=f.match(g))?i[1]:-1,e!==null&&(e=Ga(e,i,h.decimalPoint,f.indexOf(",")>-1?h.thousandsSep:""))):e=cb(f,e)}j.push(e);a=a.slice(c+1);c=(d=!d)?"}":"{"}j.push(a);return j.join("")}function mb(a){return U.pow(10,T(U.log(a)/
	U.LN10))}function nb(a,b,c,d){var e,c=m(c,1);e=a/c;b||(b=[1,2,2.5,5,10],d&&d.allowDecimals===!1&&(c===1?b=[1,2,5,10]:c<=0.1&&(b=[1/c])));for(d=0;d<b.length;d++)if(a=b[d],e<=(b[d]+(b[d+1]||b[d]))/2)break;a*=c;return a}function Bb(){this.symbol=this.color=0}function ob(a,b){var c=a.length,d,e;for(e=0;e<c;e++)a[e].ss_i=e;a.sort(function(a,c){d=b(a,c);return d===0?a.ss_i-c.ss_i:d});for(e=0;e<c;e++)delete a[e].ss_i}function Na(a){for(var b=a.length,c=a[0];b--;)a[b]<c&&(c=a[b]);return c}function Ba(a){for(var b=
	a.length,c=a[0];b--;)a[b]>c&&(c=a[b]);return c}function Oa(a,b){for(var c in a)a[c]&&a[c]!==b&&a[c].destroy&&a[c].destroy(),delete a[c]}function Pa(a){db||(db=Y(Ja));a&&db.appendChild(a);db.innerHTML=""}function ra(a,b){var c="Highcharts error #"+a+": www.highcharts.com/errors/"+a;if(b)throw c;else I.console&&console.log(c)}function da(a){return parseFloat(a.toPrecision(14))}function Qa(a,b){va=m(a,b.animation)}function Cb(){var a=E.global.useUTC,b=a?"getUTC":"get",c=a?"setUTC":"set";Ra=(a&&E.global.timezoneOffset||
	0)*6E4;eb=a?Date.UTC:function(a,b,c,g,h,i){return(new Date(a,b,m(c,1),m(g,0),m(h,0),m(i,0))).getTime()};pb=b+"Minutes";qb=b+"Hours";rb=b+"Day";Xa=b+"Date";fb=b+"Month";gb=b+"FullYear";Db=c+"Minutes";Eb=c+"Hours";sb=c+"Date";Fb=c+"Month";Gb=c+"FullYear"}function P(){}function Sa(a,b,c,d){this.axis=a;this.pos=b;this.type=c||"";this.isNew=!0;!c&&!d&&this.addLabel()}function la(){this.init.apply(this,arguments)}function Ya(){this.init.apply(this,arguments)}function Hb(a,b,c,d,e){var f=a.chart.inverted;
	this.axis=a;this.isNegative=c;this.options=b;this.x=d;this.total=null;this.points={};this.stack=e;this.alignOptions={align:b.align||(f?c?"left":"right":"center"),verticalAlign:b.verticalAlign||(f?"middle":c?"bottom":"top"),y:m(b.y,f?4:c?14:-6),x:m(b.x,f?c?-6:6:0)};this.textAlign=b.textAlign||(f?c?"right":"left":"center")}var t,y=document,I=window,U=Math,u=U.round,T=U.floor,Ka=U.ceil,v=U.max,C=U.min,M=U.abs,Z=U.cos,ea=U.sin,ma=U.PI,Ca=ma*2/360,wa=navigator.userAgent,Ib=I.opera,Aa=/msie/i.test(wa)&&
	!Ib,hb=y.documentMode===8,ib=/AppleWebKit/.test(wa),Ta=/Firefox/.test(wa),Jb=/(Mobile|Android|Windows Phone)/.test(wa),xa="http://www.w3.org/2000/svg",aa=!!y.createElementNS&&!!y.createElementNS(xa,"svg").createSVGRect,Nb=Ta&&parseInt(wa.split("Firefox/")[1],10)<4,fa=!aa&&!Aa&&!!y.createElement("canvas").getContext,Za,$a,Kb={},tb=0,db,E,cb,va,ub,A,sa=function(){},V=[],ab=0,Ja="div",Q="none",Ob=/^[0-9]+$/,Pb="stroke-width",eb,Ra,pb,qb,rb,Xa,fb,gb,Db,Eb,sb,Fb,Gb,F={},R=I.Highcharts=I.Highcharts?ra(16,
	!0):{};cb=function(a,b,c){if(!r(b)||isNaN(b))return"Invalid date";var a=m(a,"%Y-%m-%d %H:%M:%S"),d=new Date(b-Ra),e,f=d[qb](),g=d[rb](),h=d[Xa](),i=d[fb](),j=d[gb](),k=E.lang,l=k.weekdays,d=q({a:l[g].substr(0,3),A:l[g],d:Ha(h),e:h,b:k.shortMonths[i],B:k.months[i],m:Ha(i+1),y:j.toString().substr(2,2),Y:j,H:Ha(f),I:Ha(f%12||12),l:f%12||12,M:Ha(d[pb]()),p:f<12?"AM":"PM",P:f<12?"am":"pm",S:Ha(d.getSeconds()),L:Ha(u(b%1E3),3)},R.dateFormats);for(e in d)for(;a.indexOf("%"+e)!==-1;)a=a.replace("%"+e,typeof d[e]===
	"function"?d[e](b):d[e]);return c?a.substr(0,1).toUpperCase()+a.substr(1):a};Bb.prototype={wrapColor:function(a){if(this.color>=a)this.color=0},wrapSymbol:function(a){if(this.symbol>=a)this.symbol=0}};A=function(){for(var a=0,b=arguments,c=b.length,d={};a<c;a++)d[b[a++]]=b[a];return d}("millisecond",1,"second",1E3,"minute",6E4,"hour",36E5,"day",864E5,"week",6048E5,"month",26784E5,"year",31556952E3);ub={init:function(a,b,c){var b=b||"",d=a.shift,e=b.indexOf("C")>-1,f=e?7:3,g,b=b.split(" "),c=[].concat(c),
	h,i,j=function(a){for(g=a.length;g--;)a[g]==="M"&&a.splice(g+1,0,a[g+1],a[g+2],a[g+1],a[g+2])};e&&(j(b),j(c));a.isArea&&(h=b.splice(b.length-6,6),i=c.splice(c.length-6,6));if(d<=c.length/f&&b.length===c.length)for(;d--;)c=[].concat(c).splice(0,f).concat(c);a.shift=0;if(b.length)for(a=c.length;b.length<a;)d=[].concat(b).splice(b.length-f,f),e&&(d[f-6]=d[f-2],d[f-5]=d[f-1]),b=b.concat(d);h&&(b=b.concat(h),c=c.concat(i));return[b,c]},step:function(a,b,c,d){var e=[],f=a.length;if(c===1)e=d;else if(f===
	b.length&&c<1)for(;f--;)d=parseFloat(a[f]),e[f]=isNaN(d)?a[f]:c*parseFloat(b[f]-d)+d;else e=b;return e}};(function(a){I.HighchartsAdapter=I.HighchartsAdapter||a&&{init:function(b){var c=a.fx,d=c.step,e,f=a.Tween,g=f&&f.propHooks;e=a.cssHooks.opacity;a.extend(a.easing,{easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c}});a.each(["cur","_default","width","height","opacity"],function(a,b){var e=d,k;b==="cur"?e=c.prototype:b==="_default"&&f&&(e=g[b],b="set");(k=e[b])&&(e[b]=function(c){var d,c=
	a?c:this;if(c.prop!=="align")return d=c.elem,d.attr?d.attr(c.prop,b==="cur"?t:c.now):k.apply(this,arguments)})});Ma(e,"get",function(a,b,c){return b.attr?b.opacity||0:a.call(this,b,c)});e=function(a){var c=a.elem,d;if(!a.started)d=b.init(c,c.d,c.toD),a.start=d[0],a.end=d[1],a.started=!0;c.attr("d",b.step(a.start,a.end,a.pos,c.toD))};f?g.d={set:e}:d.d=e;this.each=Array.prototype.forEach?function(a,b){return Array.prototype.forEach.call(a,b)}:function(a,b){for(var c=0,d=a.length;c<d;c++)if(b.call(a[c],
	a[c],c,a)===!1)return c};a.fn.highcharts=function(){var a="Chart",b=arguments,c,d;if(this[0]){Fa(b[0])&&(a=b[0],b=Array.prototype.slice.call(b,1));c=b[0];if(c!==t)c.chart=c.chart||{},c.chart.renderTo=this[0],new R[a](c,b[1]),d=this;c===t&&(d=V[H(this[0],"data-highcharts-chart")])}return d}},getScript:a.getScript,inArray:a.inArray,adapterRun:function(b,c){return a(b)[c]()},grep:a.grep,map:function(a,c){for(var d=[],e=0,f=a.length;e<f;e++)d[e]=c.call(a[e],a[e],e,a);return d},offset:function(b){return a(b).offset()},
	addEvent:function(b,c,d){a(b).bind(c,d)},removeEvent:function(b,c,d){var e=y.removeEventListener?"removeEventListener":"detachEvent";y[e]&&b&&!b[e]&&(b[e]=function(){});a(b).unbind(c,d)},fireEvent:function(b,c,d,e){var f=a.Event(c),g="detached"+c,h;!Aa&&d&&(delete d.layerX,delete d.layerY,delete d.returnValue);q(f,d);b[c]&&(b[g]=b[c],b[c]=null);a.each(["preventDefault","stopPropagation"],function(a,b){var c=f[b];f[b]=function(){try{c.call(f)}catch(a){b==="preventDefault"&&(h=!0)}}});a(b).trigger(f);
	b[g]&&(b[c]=b[g],b[g]=null);e&&!f.isDefaultPrevented()&&!h&&e(f)},washMouseEvent:function(a){var c=a.originalEvent||a;if(c.pageX===t)c.pageX=a.pageX,c.pageY=a.pageY;return c},animate:function(b,c,d){var e=a(b);if(!b.style)b.style={};if(c.d)b.toD=c.d,c.d=1;e.stop();c.opacity!==t&&b.attr&&(c.opacity+="px");e.animate(c,d)},stop:function(b){a(b).stop()}}})(__webpack_provided_window_dot_jQuery);var S=I.HighchartsAdapter,N=S||{};S&&S.init.call(S,ub);var jb=N.adapterRun,Qb=N.getScript,Da=N.inArray,p=N.each,vb=N.grep,Rb=N.offset,Ua=
	N.map,K=N.addEvent,W=N.removeEvent,D=N.fireEvent,Sb=N.washMouseEvent,kb=N.animate,bb=N.stop,N={enabled:!0,x:0,y:15,style:{color:"#606060",cursor:"default",fontSize:"11px"}};E={colors:"#7cb5ec,#434348,#90ed7d,#f7a35c,#8085e9,#f15c80,#e4d354,#8085e8,#8d4653,#91e8e1".split(","),symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),shortMonths:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
	weekdays:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),decimalPoint:".",numericSymbols:"k,M,G,T,P,E".split(","),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:","},global:{useUTC:!0,canvasToolsURL:"http://code.highcharts.com/4.0.1/modules/canvas-tools.js",VMLRadialGradientURL:"http://code.highcharts.com/4.0.1/gfx/vml-radial-gradient.png"},chart:{borderColor:"#4572A7",borderRadius:0,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,
	10],backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0",resetZoomButton:{theme:{zIndex:20},position:{align:"right",x:-10,y:10}}},title:{text:"Chart title",align:"center",margin:15,style:{color:"#333333",fontSize:"18px"}},subtitle:{text:"",align:"center",style:{color:"#555555"}},plotOptions:{line:{allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},lineWidth:2,marker:{lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{enabled:!0},select:{fillColor:"#FFFFFF",lineColor:"#000000",
	lineWidth:2}}},point:{events:{}},dataLabels:w(N,{align:"center",enabled:!1,formatter:function(){return this.y===null?"":Ga(this.y,-1)},verticalAlign:"bottom",y:0}),cropThreshold:300,pointRange:0,states:{hover:{marker:{},halo:{size:10,opacity:0.25}},select:{marker:{}}},stickyTracking:!0,turboThreshold:1E3}},labels:{style:{position:"absolute",color:"#3E576F"}},legend:{enabled:!0,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#909090",borderRadius:0,navigation:{activeColor:"#274b6d",
	inactiveColor:"#CCC"},shadow:!1,itemStyle:{color:"#333333",fontSize:"12px",fontWeight:"bold"},itemHoverStyle:{color:"#000"},itemHiddenStyle:{color:"#CCC"},itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"1em"},style:{position:"absolute",backgroundColor:"white",opacity:0.5,textAlign:"center"}},tooltip:{enabled:!0,animation:aa,backgroundColor:"rgba(249, 249, 249, .85)",
	borderWidth:1,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{series.color}">●</span> {series.name}: <b>{point.y}</b><br/>',shadow:!0,snap:Jb?25:10,style:{color:"#333333",cursor:"default",fontSize:"12px",padding:"8px",
	whiteSpace:"nowrap"}},credits:{enabled:!0,text:"Highcharts.com",href:"http://www.highcharts.com",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#909090",fontSize:"9px"}}};var ba=E.plotOptions,S=ba.line;Cb();var Tb=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,Ub=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,Vb=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,ya=function(a){var b=[],c,
	d;(function(a){a&&a.stops?d=Ua(a.stops,function(a){return ya(a[1])}):(c=Tb.exec(a))?b=[z(c[1]),z(c[2]),z(c[3]),parseFloat(c[4],10)]:(c=Ub.exec(a))?b=[z(c[1],16),z(c[2],16),z(c[3],16),1]:(c=Vb.exec(a))&&(b=[z(c[1]),z(c[2]),z(c[3]),1])})(a);return{get:function(c){var f;d?(f=w(a),f.stops=[].concat(f.stops),p(d,function(a,b){f.stops[b]=[f.stops[b][0],a.get(c)]})):f=b&&!isNaN(b[0])?c==="rgb"?"rgb("+b[0]+","+b[1]+","+b[2]+")":c==="a"?b[3]:"rgba("+b.join(",")+")":a;return f},brighten:function(a){if(d)p(d,
	function(b){b.brighten(a)});else if(ha(a)&&a!==0){var c;for(c=0;c<3;c++)b[c]+=z(a*255),b[c]<0&&(b[c]=0),b[c]>255&&(b[c]=255)}return this},rgba:b,setOpacity:function(a){b[3]=a;return this}}};P.prototype={init:function(a,b){this.element=b==="span"?Y(b):y.createElementNS(xa,b);this.renderer=a},opacity:1,animate:function(a,b,c){b=m(b,va,!0);bb(this);if(b){b=w(b,{});if(c)b.complete=c;kb(this,a,b)}else this.attr(a),c&&c()},colorGradient:function(a,b,c){var d=this.renderer,e,f,g,h,i,j,k,l,o,n,s=[];a.linearGradient?
	f="linearGradient":a.radialGradient&&(f="radialGradient");if(f){g=a[f];h=d.gradients;j=a.stops;o=c.radialReference;La(g)&&(a[f]=g={x1:g[0],y1:g[1],x2:g[2],y2:g[3],gradientUnits:"userSpaceOnUse"});f==="radialGradient"&&o&&!r(g.gradientUnits)&&(g=w(g,{cx:o[0]-o[2]/2+g.cx*o[2],cy:o[1]-o[2]/2+g.cy*o[2],r:g.r*o[2],gradientUnits:"userSpaceOnUse"}));for(n in g)n!=="id"&&s.push(n,g[n]);for(n in j)s.push(j[n]);s=s.join(",");h[s]?a=h[s].attr("id"):(g.id=a="highcharts-"+tb++,h[s]=i=d.createElement(f).attr(g).add(d.defs),
	i.stops=[],p(j,function(a){a[1].indexOf("rgba")===0?(e=ya(a[1]),k=e.get("rgb"),l=e.get("a")):(k=a[1],l=1);a=d.createElement("stop").attr({offset:a[0],"stop-color":k,"stop-opacity":l}).add(i);i.stops.push(a)}));c.setAttribute(b,"url("+d.url+"#"+a+")")}},attr:function(a,b){var c,d,e=this.element,f,g=this,h;typeof a==="string"&&b!==t&&(c=a,a={},a[c]=b);if(typeof a==="string")g=(this[a+"Getter"]||this._defaultGetter).call(this,a,e);else{for(c in a){d=a[c];h=!1;this.symbolName&&/^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(c)&&
	(f||(this.symbolAttr(a),f=!0),h=!0);if(this.rotation&&(c==="x"||c==="y"))this.doTransform=!0;h||(this[c+"Setter"]||this._defaultSetter).call(this,d,c,e);this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(c)&&this.updateShadows(c,d)}if(this.doTransform)this.updateTransform(),this.doTransform=!1}return g},updateShadows:function(a,b){for(var c=this.shadows,d=c.length;d--;)c[d].setAttribute(a,a==="height"?v(b-(c[d].cutHeight||0),0):a==="d"?this.d:b)},addClass:function(a){var b=this.element,
	c=H(b,"class")||"";c.indexOf(a)===-1&&H(b,"class",c+" "+a);return this},symbolAttr:function(a){var b=this;p("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","),function(c){b[c]=m(a[c],b[c])});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.width,b.height,b)})},clip:function(a){return this.attr("clip-path",a?"url("+this.renderer.url+"#"+a.id+")":Q)},crisp:function(a){var b,c={},d,e=a.strokeWidth||this.strokeWidth||this.attr&&this.attr("stroke-width")||0;d=u(e)%2/2;a.x=T(a.x||this.x||
	0)+d;a.y=T(a.y||this.y||0)+d;a.width=T((a.width||this.width||0)-2*d);a.height=T((a.height||this.height||0)-2*d);a.strokeWidth=e;for(b in a)this[b]!==a[b]&&(this[b]=c[b]=a[b]);return c},css:function(a){var b=this.styles,c={},d=this.element,e,f,g="";e=!b;if(a&&a.color)a.fill=a.color;if(b)for(f in a)a[f]!==b[f]&&(c[f]=a[f],e=!0);if(e){e=this.textWidth=a&&a.width&&d.nodeName.toLowerCase()==="text"&&z(a.width);b&&(a=q(b,c));this.styles=a;e&&(fa||!aa&&this.renderer.forExport)&&delete a.width;if(Aa&&!aa)G(this.element,
	a);else{b=function(a,b){return"-"+b.toLowerCase()};for(f in a)g+=f.replace(/([A-Z])/g,b)+":"+a[f]+";";H(d,"style",g)}e&&this.added&&this.renderer.buildText(this)}return this},on:function(a,b){var c=this,d=c.element;$a&&a==="click"?(d.ontouchstart=function(a){c.touchEventFired=Date.now();a.preventDefault();b.call(d,a)},d.onclick=function(a){(wa.indexOf("Android")===-1||Date.now()-(c.touchEventFired||0)>1100)&&b.call(d,a)}):d["on"+a]=b;return this},setRadialReference:function(a){this.element.radialReference=
	a;return this},translate:function(a,b){return this.attr({translateX:a,translateY:b})},invert:function(){this.inverted=!0;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,b=this.translateY||0,c=this.scaleX,d=this.scaleY,e=this.inverted,f=this.rotation,g=this.element;e&&(a+=this.attr("width"),b+=this.attr("height"));a=["translate("+a+","+b+")"];e?a.push("rotate(90) scale(-1,1)"):f&&a.push("rotate("+f+" "+(g.getAttribute("x")||0)+" "+(g.getAttribute("y")||0)+")");
	(r(c)||r(d))&&a.push("scale("+m(c,1)+" "+m(d,1)+")");a.length&&g.setAttribute("transform",a.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,b,c){var d,e,f,g,h={};e=this.renderer;f=e.alignedObjects;if(a){if(this.alignOptions=a,this.alignByTranslate=b,!c||Fa(c))this.alignTo=d=c||"renderer",ja(f,this),f.push(this),c=null}else a=this.alignOptions,b=this.alignByTranslate,d=this.alignTo;c=m(c,e[d],e);d=a.align;e=a.verticalAlign;f=(c.x||0)+(a.x||
	0);g=(c.y||0)+(a.y||0);if(d==="right"||d==="center")f+=(c.width-(a.width||0))/{right:1,center:2}[d];h[b?"translateX":"x"]=u(f);if(e==="bottom"||e==="middle")g+=(c.height-(a.height||0))/({bottom:1,middle:2}[e]||1);h[b?"translateY":"y"]=u(g);this[this.placed?"animate":"attr"](h);this.placed=!0;this.alignAttr=h;return this},getBBox:function(){var a=this.bBox,b=this.renderer,c,d,e=this.rotation;c=this.element;var f=this.styles,g=e*Ca;d=this.textStr;var h;if(d===""||Ob.test(d))h="num."+d.toString().length+
	(f?"|"+f.fontSize+"|"+f.fontFamily:"");h&&(a=b.cache[h]);if(!a){if(c.namespaceURI===xa||b.forExport){try{a=c.getBBox?q({},c.getBBox()):{width:c.offsetWidth,height:c.offsetHeight}}catch(i){}if(!a||a.width<0)a={width:0,height:0}}else a=this.htmlGetBBox();if(b.isSVG){c=a.width;d=a.height;if(Aa&&f&&f.fontSize==="11px"&&d.toPrecision(3)==="16.9")a.height=d=14;if(e)a.width=M(d*ea(g))+M(c*Z(g)),a.height=M(d*Z(g))+M(c*ea(g))}this.bBox=a;h&&(b.cache[h]=a)}return a},show:function(a){return a&&this.element.namespaceURI===
	xa?(this.element.removeAttribute("visibility"),this):this.attr({visibility:a?"inherit":"visible"})},hide:function(){return this.attr({visibility:"hidden"})},fadeOut:function(a){var b=this;b.animate({opacity:0},{duration:a||150,complete:function(){b.hide()}})},add:function(a){var b=this.renderer,c=a||b,d=c.element||b.box,e=this.element,f=this.zIndex,g,h;if(a)this.parentGroup=a;this.parentInverted=a&&a.inverted;this.textStr!==void 0&&b.buildText(this);if(f)c.handleZ=!0,f=z(f);if(c.handleZ){a=d.childNodes;
	for(g=0;g<a.length;g++)if(b=a[g],c=H(b,"zIndex"),b!==e&&(z(c)>f||!r(f)&&r(c))){d.insertBefore(e,b);h=!0;break}}h||d.appendChild(e);this.added=!0;if(this.onAdd)this.onAdd();return this},safeRemoveChild:function(a){var b=a.parentNode;b&&b.removeChild(a)},destroy:function(){var a=this,b=a.element||{},c=a.shadows,d=a.renderer.isSVG&&b.nodeName==="SPAN"&&a.parentGroup,e,f;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=b.point=null;bb(a);if(a.clipPath)a.clipPath=a.clipPath.destroy();if(a.stops){for(f=
	0;f<a.stops.length;f++)a.stops[f]=a.stops[f].destroy();a.stops=null}a.safeRemoveChild(b);for(c&&p(c,function(b){a.safeRemoveChild(b)});d&&d.div.childNodes.length===0;)b=d.parentGroup,a.safeRemoveChild(d.div),delete d.div,d=b;a.alignTo&&ja(a.renderer.alignedObjects,a);for(e in a)delete a[e];return null},shadow:function(a,b,c){var d=[],e,f,g=this.element,h,i,j,k;if(a){i=m(a.width,3);j=(a.opacity||0.15)/i;k=this.parentInverted?"(-1,-1)":"("+m(a.offsetX,1)+", "+m(a.offsetY,1)+")";for(e=1;e<=i;e++){f=
	g.cloneNode(0);h=i*2+1-2*e;H(f,{isShadow:"true",stroke:a.color||"black","stroke-opacity":j*e,"stroke-width":h,transform:"translate"+k,fill:Q});if(c)H(f,"height",v(H(f,"height")-h,0)),f.cutHeight=h;b?b.element.appendChild(f):g.parentNode.insertBefore(f,g);d.push(f)}this.shadows=d}return this},xGetter:function(a){this.element.nodeName==="circle"&&(a={x:"cx",y:"cy"}[a]||a);return this._defaultGetter(a)},_defaultGetter:function(a){a=m(this[a],this.element?this.element.getAttribute(a):null,0);/^[0-9\.]+$/.test(a)&&
	(a=parseFloat(a));return a},dSetter:function(a,b,c){a&&a.join&&(a=a.join(" "));/(NaN| {2}|^$)/.test(a)&&(a="M 0 0");c.setAttribute(b,a);this[b]=a},dashstyleSetter:function(a){var b;if(a=a&&a.toLowerCase()){a=a.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(b=a.length;b--;)a[b]=z(a[b])*this.element.getAttribute("stroke-width");
	a=a.join(",");this.element.setAttribute("stroke-dasharray",a)}},alignSetter:function(a){this.element.setAttribute("text-anchor",{left:"start",center:"middle",right:"end"}[a])},opacitySetter:function(a,b,c){this[b]=a;c.setAttribute(b,a)},"stroke-widthSetter":function(a,b,c){a===0&&(a=1.0E-5);this.strokeWidth=a;c.setAttribute(b,a)},titleSetter:function(a){var b=this.element.getElementsByTagName("title")[0];b||(b=y.createElementNS(xa,"title"),this.element.appendChild(b));b.textContent=a},textSetter:function(a){if(a!==
	this.textStr)delete this.bBox,this.textStr=a,this.added&&this.renderer.buildText(this)},fillSetter:function(a,b,c){typeof a==="string"?c.setAttribute(b,a):a&&this.colorGradient(a,b,c)},zIndexSetter:function(a,b,c){c.setAttribute(b,a);this[b]=a},_defaultSetter:function(a,b,c){c.setAttribute(b,a)}};P.prototype.yGetter=P.prototype.xGetter;P.prototype.translateXSetter=P.prototype.translateYSetter=P.prototype.rotationSetter=P.prototype.verticalAlignSetter=P.prototype.scaleXSetter=P.prototype.scaleYSetter=
	function(a,b){this[b]=a;this.doTransform=!0};P.prototype.strokeSetter=P.prototype.fillSetter;var ta=function(){this.init.apply(this,arguments)};ta.prototype={Element:P,init:function(a,b,c,d,e){var f=location,g,d=this.createElement("svg").attr({version:"1.1"}).css(this.getStyle(d));g=d.element;a.appendChild(g);a.innerHTML.indexOf("xmlns")===-1&&H(g,"xmlns",xa);this.isSVG=!0;this.box=g;this.boxWrapper=d;this.alignedObjects=[];this.url=(Ta||ib)&&y.getElementsByTagName("base").length?f.href.replace(/#.*?$/,
	"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.createElement("desc").add().element.appendChild(y.createTextNode("Created with Highcharts 4.0.1"));this.defs=this.createElement("defs").add();this.forExport=e;this.gradients={};this.cache={};this.setSize(b,c,!1);var h;if(Ta&&a.getBoundingClientRect)this.subPixelFix=b=function(){G(a,{left:0,top:0});h=a.getBoundingClientRect();G(a,{left:Ka(h.left)-h.left+"px",top:Ka(h.top)-h.top+"px"})},b(),K(I,"resize",b)},getStyle:function(a){return this.style=
	q({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},a)},isHidden:function(){return!this.boxWrapper.getBBox().width},destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();Oa(this.gradients||{});this.gradients=null;if(a)this.defs=a.destroy();this.subPixelFix&&W(I,"resize",this.subPixelFix);return this.alignedObjects=null},createElement:function(a){var b=new this.Element;b.init(this,a);return b},draw:function(){},
	buildText:function(a){for(var b=a.element,c=this,d=c.forExport,e=m(a.textStr,"").toString(),f=e.indexOf("<")!==-1,g=b.childNodes,h,i,j=H(b,"x"),k=a.styles,l=a.textWidth,o=k&&k.lineHeight,n=g.length,s=function(a){return o?z(o):c.fontMetrics(/(px|em)$/.test(a&&a.style.fontSize)?a.style.fontSize:k&&k.fontSize||c.style.fontSize||12).h};n--;)b.removeChild(g[n]);!f&&e.indexOf(" ")===-1?b.appendChild(y.createTextNode(e)):(h=/<.*style="([^"]+)".*>/,i=/<.*href="(http[^"]+)".*>/,l&&!a.added&&this.box.appendChild(b),
	e=f?e.replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,"</span>").split(/<br.*?>/g):[e],e[e.length-1]===""&&e.pop(),p(e,function(e,f){var g,n=0,e=e.replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");g=e.split("|||");p(g,function(e){if(e!==""||g.length===1){var o={},m=y.createElementNS(xa,"tspan"),p;h.test(e)&&(p=e.match(h)[1].replace(/(;| |^)color([ :])/,"$1fill$2"),
	H(m,"style",p));i.test(e)&&!d&&(H(m,"onclick",'location.href="'+e.match(i)[1]+'"'),G(m,{cursor:"pointer"}));e=(e.replace(/<(.|\n)*?>/g,"")||" ").replace(/&lt;/g,"<").replace(/&gt;/g,">");if(e!==" "){m.appendChild(y.createTextNode(e));if(n)o.dx=0;else if(f&&j!==null)o.x=j;H(m,o);!n&&f&&(!aa&&d&&G(m,{display:"block"}),H(m,"dy",s(m),ib&&m.offsetHeight));b.appendChild(m);n++;if(l)for(var e=e.replace(/([^\^])-/g,"$1- ").split(" "),o=e.length>1&&k.whiteSpace!=="nowrap",$,r,B=a._clipHeight,q=[],v=s(),t=
	1;o&&(e.length||q.length);)delete a.bBox,$=a.getBBox(),r=$.width,!aa&&c.forExport&&(r=c.measureSpanWidth(m.firstChild.data,a.styles)),$=r>l,!$||e.length===1?(e=q,q=[],e.length&&(t++,B&&t*v>B?(e=["..."],a.attr("title",a.textStr)):(m=y.createElementNS(xa,"tspan"),H(m,{dy:v,x:j}),p&&H(m,"style",p),b.appendChild(m),r>l&&(l=r)))):(m.removeChild(m.firstChild),q.unshift(e.pop())),e.length&&m.appendChild(y.createTextNode(e.join(" ").replace(/- /g,"-")))}}})}))},button:function(a,b,c,d,e,f,g,h,i){var j=this.label(a,
	b,c,i,null,null,null,null,"button"),k=0,l,o,n,s,m,p,a={x1:0,y1:0,x2:0,y2:1},e=w({"stroke-width":1,stroke:"#CCCCCC",fill:{linearGradient:a,stops:[[0,"#FEFEFE"],[1,"#F6F6F6"]]},r:2,padding:5,style:{color:"black"}},e);n=e.style;delete e.style;f=w(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,"#FFF"],[1,"#ACF"]]}},f);s=f.style;delete f.style;g=w(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,"#9BD"],[1,"#CDF"]]}},g);m=g.style;delete g.style;h=w(e,{style:{color:"#CCC"}},h);p=h.style;delete h.style;
	K(j.element,Aa?"mouseover":"mouseenter",function(){k!==3&&j.attr(f).css(s)});K(j.element,Aa?"mouseout":"mouseleave",function(){k!==3&&(l=[e,f,g][k],o=[n,s,m][k],j.attr(l).css(o))});j.setState=function(a){(j.state=k=a)?a===2?j.attr(g).css(m):a===3&&j.attr(h).css(p):j.attr(e).css(n)};return j.on("click",function(){k!==3&&d.call(j)}).attr(e).css(q({cursor:"default"},n))},crispLine:function(a,b){a[1]===a[4]&&(a[1]=a[4]=u(a[1])-b%2/2);a[2]===a[5]&&(a[2]=a[5]=u(a[2])+b%2/2);return a},path:function(a){var b=
	{fill:Q};La(a)?b.d=a:ca(a)&&q(b,a);return this.createElement("path").attr(b)},circle:function(a,b,c){a=ca(a)?a:{x:a,y:b,r:c};b=this.createElement("circle");b.xSetter=function(a){this.element.setAttribute("cx",a)};b.ySetter=function(a){this.element.setAttribute("cy",a)};return b.attr(a)},arc:function(a,b,c,d,e,f){if(ca(a))b=a.y,c=a.r,d=a.innerR,e=a.start,f=a.end,a=a.x;a=this.symbol("arc",a||0,b||0,c||0,c||0,{innerR:d||0,start:e||0,end:f||0});a.r=c;return a},rect:function(a,b,c,d,e,f){var e=ca(a)?a.r:
	e,g=this.createElement("rect"),a=ca(a)?a:a===t?{}:{x:a,y:b,width:v(c,0),height:v(d,0)};if(f!==t)a.strokeWidth=f,a=g.crisp(a);if(e)a.r=e;g.rSetter=function(a){H(this.element,{rx:a,ry:a})};return g.attr(a)},setSize:function(a,b,c){var d=this.alignedObjects,e=d.length;this.width=a;this.height=b;for(this.boxWrapper[m(c,!0)?"animate":"attr"]({width:a,height:b});e--;)d[e].align()},g:function(a){var b=this.createElement("g");return r(a)?b.attr({"class":"highcharts-"+a}):b},image:function(a,b,c,d,e){var f=
	{preserveAspectRatio:Q};arguments.length>1&&q(f,{x:b,y:c,width:d,height:e});f=this.createElement("image").attr(f);f.element.setAttributeNS?f.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):f.element.setAttribute("hc-svg-href",a);return f},symbol:function(a,b,c,d,e,f){var g,h=this.symbols[a],h=h&&h(u(b),u(c),d,e,f),i=/^url\((.*?)\)$/,j,k;if(h)g=this.path(h),q(g,{symbolName:a,x:b,y:c,width:d,height:e}),f&&q(g,f);else if(i.test(a))k=function(a,b){a.element&&(a.attr({width:b[0],height:b[1]}),
	a.alignByTranslate||a.translate(u((d-b[0])/2),u((e-b[1])/2)))},j=a.match(i)[1],a=Kb[j],g=this.image(j).attr({x:b,y:c}),g.isImg=!0,a?k(g,a):(g.attr({width:0,height:0}),Y("img",{onload:function(){k(g,Kb[j]=[this.width,this.height])},src:j}));return g},symbols:{circle:function(a,b,c,d){var e=0.166*c;return["M",a+c/2,b,"C",a+c+e,b,a+c+e,b+d,a+c/2,b+d,"C",a-e,b+d,a-e,b,a+c/2,b,"Z"]},square:function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c,b+d,a,b+d,"Z"]},triangle:function(a,b,c,d){return["M",a+c/2,b,"L",
	a+c,b+d,a,b+d,"Z"]},"triangle-down":function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c/2,b+d,"Z"]},diamond:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d/2,a+c/2,b+d,a,b+d/2,"Z"]},arc:function(a,b,c,d,e){var f=e.start,c=e.r||c||d,g=e.end-0.001,d=e.innerR,h=e.open,i=Z(f),j=ea(f),k=Z(g),g=ea(g),e=e.end-f<ma?0:1;return["M",a+c*i,b+c*j,"A",c,c,0,e,1,a+c*k,b+c*g,h?"M":"L",a+d*k,b+d*g,"A",d,d,0,e,0,a+d*i,b+d*j,h?"":"Z"]},callout:function(a,b,c,d,e){var f=C(e&&e.r||0,c,d),g=f+6,h=e&&e.anchorX,i=e&&e.anchorY,
	e=u(e.strokeWidth||0)%2/2;a+=e;b+=e;e=["M",a+f,b,"L",a+c-f,b,"C",a+c,b,a+c,b,a+c,b+f,"L",a+c,b+d-f,"C",a+c,b+d,a+c,b+d,a+c-f,b+d,"L",a+f,b+d,"C",a,b+d,a,b+d,a,b+d-f,"L",a,b+f,"C",a,b,a,b,a+f,b];h&&h>c&&i>b+g&&i<b+d-g?e.splice(13,3,"L",a+c,i-6,a+c+6,i,a+c,i+6,a+c,b+d-f):h&&h<0&&i>b+g&&i<b+d-g?e.splice(33,3,"L",a,i+6,a-6,i,a,i-6,a,b+f):i&&i>d&&h>a+g&&h<a+c-g?e.splice(23,3,"L",h+6,b+d,h,b+d+6,h-6,b+d,a+f,b+d):i&&i<0&&h>a+g&&h<a+c-g&&e.splice(3,3,"L",h-6,b,h,b-6,h+6,b,c-f,b);return e}},clipRect:function(a,
	b,c,d){var e="highcharts-"+tb++,f=this.createElement("clipPath").attr({id:e}).add(this.defs),a=this.rect(a,b,c,d,0).add(f);a.id=e;a.clipPath=f;return a},text:function(a,b,c,d){var e=fa||!aa&&this.forExport,f={};if(d&&!this.forExport)return this.html(a,b,c);f.x=Math.round(b||0);if(c)f.y=Math.round(c);if(a||a===0)f.text=a;a=this.createElement("text").attr(f);e&&a.css({position:"absolute"});if(!d)a.xSetter=function(a,b,c){var d=c.childNodes,e,f;for(f=1;f<d.length;f++)e=d[f],e.getAttribute("x")===c.getAttribute("x")&&
	e.setAttribute("x",a);c.setAttribute(b,a)};return a},fontMetrics:function(a){var a=a||this.style.fontSize,a=/px/.test(a)?z(a):/em/.test(a)?parseFloat(a)*12:12,a=a<24?a+4:u(a*1.2),b=u(a*0.8);return{h:a,b:b}},label:function(a,b,c,d,e,f,g,h,i){function j(){var a,b;a=s.element.style;J=(Va===void 0||wb===void 0||n.styles.textAlign)&&s.textStr&&s.getBBox();n.width=(Va||J.width||0)+2*x+v;n.height=(wb||J.height||0)+2*x;na=x+o.fontMetrics(a&&a.fontSize).b;if(z){if(!m)a=u(-L*x),b=h?-na:0,n.box=m=d?o.symbol(d,
	a,b,n.width,n.height,B):o.rect(a,b,n.width,n.height,0,B[Pb]),m.attr("fill",Q).add(n);m.isImg||m.attr(q({width:u(n.width),height:u(n.height)},B));B=null}}function k(){var a=n.styles,a=a&&a.textAlign,b=v+x*(1-L),c;c=h?0:na;if(r(Va)&&J&&(a==="center"||a==="right"))b+={center:0.5,right:1}[a]*(Va-J.width);if(b!==s.x||c!==s.y)s.attr("x",b),c!==t&&s.attr("y",c);s.x=b;s.y=c}function l(a,b){m?m.attr(a,b):B[a]=b}var o=this,n=o.g(i),s=o.text("",0,0,g).attr({zIndex:1}),m,J,L=0,x=3,v=0,Va,wb,xb,yb,y=0,B={},na,
	z;n.onAdd=function(){s.add(n);n.attr({text:a||"",x:b,y:c});m&&r(e)&&n.attr({anchorX:e,anchorY:f})};n.widthSetter=function(a){Va=a};n.heightSetter=function(a){wb=a};n.paddingSetter=function(a){r(a)&&a!==x&&(x=a,k())};n.paddingLeftSetter=function(a){r(a)&&a!==v&&(v=a,k())};n.alignSetter=function(a){L={left:0,center:0.5,right:1}[a]};n.textSetter=function(a){a!==t&&s.textSetter(a);j();k()};n["stroke-widthSetter"]=function(a,b){a&&(z=!0);y=a%2/2;l(b,a)};n.strokeSetter=n.fillSetter=n.rSetter=function(a,
	b){b==="fill"&&a&&(z=!0);l(b,a)};n.anchorXSetter=function(a,b){e=a;l(b,a+y-xb)};n.anchorYSetter=function(a,b){f=a;l(b,a-yb)};n.xSetter=function(a){n.x=a;L&&(a-=L*((Va||J.width)+x));xb=u(a);n.attr("translateX",xb)};n.ySetter=function(a){yb=n.y=u(a);n.attr("translateY",yb)};var A=n.css;return q(n,{css:function(a){if(a){var b={},a=w(a);p("fontSize,fontWeight,fontFamily,color,lineHeight,width,textDecoration,textShadow".split(","),function(c){a[c]!==t&&(b[c]=a[c],delete a[c])});s.css(b)}return A.call(n,
	a)},getBBox:function(){return{width:J.width+2*x,height:J.height+2*x,x:J.x-x,y:J.y-x}},shadow:function(a){m&&m.shadow(a);return n},destroy:function(){W(n.element,"mouseenter");W(n.element,"mouseleave");s&&(s=s.destroy());m&&(m=m.destroy());P.prototype.destroy.call(n);n=o=j=k=l=null}})}};Za=ta;q(P.prototype,{htmlCss:function(a){var b=this.element;if(b=a&&b.tagName==="SPAN"&&a.width)delete a.width,this.textWidth=b,this.updateTransform();this.styles=q(this.styles,a);G(this.element,a);return this},htmlGetBBox:function(){var a=
	this.element,b=this.bBox;if(!b){if(a.nodeName==="text")a.style.position="absolute";b=this.bBox={x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight}}return b},htmlUpdateTransform:function(){if(this.added){var a=this.renderer,b=this.element,c=this.translateX||0,d=this.translateY||0,e=this.x||0,f=this.y||0,g=this.textAlign||"left",h={left:0,center:0.5,right:1}[g],i=this.shadows;G(b,{marginLeft:c,marginTop:d});i&&p(i,function(a){G(a,{marginLeft:c+1,marginTop:d+1})});this.inverted&&
	p(b.childNodes,function(c){a.invertChild(c,b)});if(b.tagName==="SPAN"){var j=this.rotation,k,l=z(this.textWidth),o=[j,g,b.innerHTML,this.textWidth].join(",");if(o!==this.cTT){k=a.fontMetrics(b.style.fontSize).b;r(j)&&this.setSpanRotation(j,h,k);i=m(this.elemWidth,b.offsetWidth);if(i>l&&/[ \-]/.test(b.textContent||b.innerText))G(b,{width:l+"px",display:"block",whiteSpace:"normal"}),i=l;this.getSpanCorrection(i,k,h,j,g)}G(b,{left:e+(this.xCorr||0)+"px",top:f+(this.yCorr||0)+"px"});if(ib)k=b.offsetHeight;
	this.cTT=o}}else this.alignOnAdd=!0},setSpanRotation:function(a,b,c){var d={},e=Aa?"-ms-transform":ib?"-webkit-transform":Ta?"MozTransform":Ib?"-o-transform":"";d[e]=d.transform="rotate("+a+"deg)";d[e+(Ta?"Origin":"-origin")]=d.transformOrigin=b*100+"% "+c+"px";G(this.element,d)},getSpanCorrection:function(a,b,c){this.xCorr=-a*c;this.yCorr=-b}});q(ta.prototype,{html:function(a,b,c){var d=this.createElement("span"),e=d.element,f=d.renderer;d.textSetter=function(a){a!==e.innerHTML&&delete this.bBox;
	e.innerHTML=this.textStr=a};d.xSetter=d.ySetter=d.alignSetter=d.rotationSetter=function(a,b){b==="align"&&(b="textAlign");d[b]=a;d.htmlUpdateTransform()};d.attr({text:a,x:u(b),y:u(c)}).css({position:"absolute",whiteSpace:"nowrap",fontFamily:this.style.fontFamily,fontSize:this.style.fontSize});d.css=d.htmlCss;if(f.isSVG)d.add=function(a){var b,c=f.box.parentNode,j=[];if(this.parentGroup=a){if(b=a.div,!b){for(;a;)j.push(a),a=a.parentGroup;p(j.reverse(),function(a){var d;b=a.div=a.div||Y(Ja,{className:H(a.element,
	"class")},{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px"},b||c);d=b.style;q(a,{translateXSetter:function(b,c){d.left=b+"px";a[c]=b;a.doTransform=!0},translateYSetter:function(b,c){d.top=b+"px";a[c]=b;a.doTransform=!0},visibilitySetter:function(a,b){d[b]=a}})})}}else b=c;b.appendChild(e);d.added=!0;d.alignOnAdd&&d.htmlUpdateTransform();return d};return d}});var X;if(!aa&&!fa){R.VMLElement=X={init:function(a,b){var c=["<",b,' filled="f" stroked="f"'],d=["position: ","absolute",
	";"],e=b===Ja;(b==="shape"||e)&&d.push("left:0;top:0;width:1px;height:1px;");d.push("visibility: ",e?"hidden":"visible");c.push(' style="',d.join(""),'"/>');if(b)c=e||b==="span"||b==="img"?c.join(""):a.prepVML(c),this.element=Y(c);this.renderer=a},add:function(a){var b=this.renderer,c=this.element,d=b.box,d=a?a.element||a:d;a&&a.inverted&&b.invertChild(c,d);d.appendChild(c);this.added=!0;this.alignOnAdd&&!this.deferUpdateTransform&&this.updateTransform();if(this.onAdd)this.onAdd();return this},updateTransform:P.prototype.htmlUpdateTransform,
	setSpanRotation:function(){var a=this.rotation,b=Z(a*Ca),c=ea(a*Ca);G(this.element,{filter:a?["progid:DXImageTransform.Microsoft.Matrix(M11=",b,", M12=",-c,", M21=",c,", M22=",b,", sizingMethod='auto expand')"].join(""):Q})},getSpanCorrection:function(a,b,c,d,e){var f=d?Z(d*Ca):1,g=d?ea(d*Ca):0,h=m(this.elemHeight,this.element.offsetHeight),i;this.xCorr=f<0&&-a;this.yCorr=g<0&&-h;i=f*g<0;this.xCorr+=g*b*(i?1-c:c);this.yCorr-=f*b*(d?i?c:1-c:1);e&&e!=="left"&&(this.xCorr-=a*c*(f<0?-1:1),d&&(this.yCorr-=
	h*c*(g<0?-1:1)),G(this.element,{textAlign:e}))},pathToVML:function(a){for(var b=a.length,c=[];b--;)if(ha(a[b]))c[b]=u(a[b]*10)-5;else if(a[b]==="Z")c[b]="x";else if(c[b]=a[b],a.isArc&&(a[b]==="wa"||a[b]==="at"))c[b+5]===c[b+7]&&(c[b+7]+=a[b+7]>a[b+5]?1:-1),c[b+6]===c[b+8]&&(c[b+8]+=a[b+8]>a[b+6]?1:-1);return c.join(" ")||"x"},clip:function(a){var b=this,c;a?(c=a.members,ja(c,b),c.push(b),b.destroyClip=function(){ja(c,b)},a=a.getCSS(b)):(b.destroyClip&&b.destroyClip(),a={clip:hb?"inherit":"rect(auto)"});
	return b.css(a)},css:P.prototype.htmlCss,safeRemoveChild:function(a){a.parentNode&&Pa(a)},destroy:function(){this.destroyClip&&this.destroyClip();return P.prototype.destroy.apply(this)},on:function(a,b){this.element["on"+a]=function(){var a=I.event;a.target=a.srcElement;b(a)};return this},cutOffPath:function(a,b){var c,a=a.split(/[ ,]/);c=a.length;if(c===9||c===11)a[c-4]=a[c-2]=z(a[c-2])-10*b;return a.join(" ")},shadow:function(a,b,c){var d=[],e,f=this.element,g=this.renderer,h,i=f.style,j,k=f.path,
	l,o,n,s;k&&typeof k.value!=="string"&&(k="x");o=k;if(a){n=m(a.width,3);s=(a.opacity||0.15)/n;for(e=1;e<=3;e++){l=n*2+1-2*e;c&&(o=this.cutOffPath(k.value,l+0.5));j=['<shape isShadow="true" strokeweight="',l,'" filled="false" path="',o,'" coordsize="10 10" style="',f.style.cssText,'" />'];h=Y(g.prepVML(j),null,{left:z(i.left)+m(a.offsetX,1),top:z(i.top)+m(a.offsetY,1)});if(c)h.cutOff=l+1;j=['<stroke color="',a.color||"black",'" opacity="',s*e,'"/>'];Y(g.prepVML(j),null,null,h);b?b.element.appendChild(h):
	f.parentNode.insertBefore(h,f);d.push(h)}this.shadows=d}return this},updateShadows:sa,setAttr:function(a,b){hb?this.element[a]=b:this.element.setAttribute(a,b)},classSetter:function(a){this.element.className=a},dashstyleSetter:function(a,b,c){(c.getElementsByTagName("stroke")[0]||Y(this.renderer.prepVML(["<stroke/>"]),null,null,c))[b]=a||"solid";this[b]=a},dSetter:function(a,b,c){var d=this.shadows,a=a||[];this.d=a.join(" ");c.path=a=this.pathToVML(a);if(d)for(c=d.length;c--;)d[c].path=d[c].cutOff?
	this.cutOffPath(a,d[c].cutOff):a;this.setAttr(b,a)},fillSetter:function(a,b,c){var d=c.nodeName;if(d==="SPAN")c.style.color=a;else if(d!=="IMG")c.filled=a!==Q,this.setAttr("fillcolor",this.renderer.color(a,c,b,this))},opacitySetter:sa,rotationSetter:function(a,b,c){c=c.style;this[b]=c[b]=a;c.left=-u(ea(a*Ca)+1)+"px";c.top=u(Z(a*Ca))+"px"},strokeSetter:function(a,b,c){this.setAttr("strokecolor",this.renderer.color(a,c,b))},"stroke-widthSetter":function(a,b,c){c.stroked=!!a;this[b]=a;ha(a)&&(a+="px");
	this.setAttr("strokeweight",a)},titleSetter:function(a,b){this.setAttr(b,a)},visibilitySetter:function(a,b,c){a==="inherit"&&(a="visible");this.shadows&&p(this.shadows,function(c){c.style[b]=a});c.nodeName==="DIV"&&(a=a==="hidden"?"-999em":0,hb||(c.style[b]=a?"visible":"hidden"),b="top");c.style[b]=a},xSetter:function(a,b,c){this[b]=a;b==="x"?b="left":b==="y"&&(b="top");this.updateClipping?(this[b]=a,this.updateClipping()):c.style[b]=a},zIndexSetter:function(a,b,c){c.style[b]=a}};X=ka(P,X);X.prototype.ySetter=
	X.prototype.widthSetter=X.prototype.heightSetter=X.prototype.xSetter;var ga={Element:X,isIE8:wa.indexOf("MSIE 8.0")>-1,init:function(a,b,c,d){var e;this.alignedObjects=[];d=this.createElement(Ja).css(q(this.getStyle(d),{position:"relative"}));e=d.element;a.appendChild(d.element);this.isVML=!0;this.box=e;this.boxWrapper=d;this.cache={};this.setSize(b,c,!1);if(!y.namespaces.hcv){y.namespaces.add("hcv","urn:schemas-microsoft-com:vml");try{y.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}catch(f){y.styleSheets[0].cssText+=
	"hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}}},isHidden:function(){return!this.box.offsetWidth},clipRect:function(a,b,c,d){var e=this.createElement(),f=ca(a);return q(e,{members:[],left:(f?a.x:a)+1,top:(f?a.y:b)+1,width:(f?a.width:c)-1,height:(f?a.height:d)-1,getCSS:function(a){var b=a.element,c=b.nodeName,a=a.inverted,d=this.top-(c==="shape"?b.offsetTop:0),e=this.left,b=e+this.width,f=d+this.height,d={clip:"rect("+u(a?e:d)+"px,"+u(a?
	f:b)+"px,"+u(a?b:f)+"px,"+u(a?d:e)+"px)"};!a&&hb&&c==="DIV"&&q(d,{width:b+"px",height:f+"px"});return d},updateClipping:function(){p(e.members,function(a){a.element&&a.css(e.getCSS(a))})}})},color:function(a,b,c,d){var e=this,f,g=/^rgba/,h,i,j=Q;a&&a.linearGradient?i="gradient":a&&a.radialGradient&&(i="pattern");if(i){var k,l,o=a.linearGradient||a.radialGradient,n,s,m,J,L,x="",a=a.stops,r,v=[],q=function(){h=['<fill colors="'+v.join(",")+'" opacity="',m,'" o:opacity2="',s,'" type="',i,'" ',x,'focus="100%" method="any" />'];
	Y(e.prepVML(h),null,null,b)};n=a[0];r=a[a.length-1];n[0]>0&&a.unshift([0,n[1]]);r[0]<1&&a.push([1,r[1]]);p(a,function(a,b){g.test(a[1])?(f=ya(a[1]),k=f.get("rgb"),l=f.get("a")):(k=a[1],l=1);v.push(a[0]*100+"% "+k);b?(m=l,J=k):(s=l,L=k)});if(c==="fill")if(i==="gradient")c=o.x1||o[0]||0,a=o.y1||o[1]||0,n=o.x2||o[2]||0,o=o.y2||o[3]||0,x='angle="'+(90-U.atan((o-a)/(n-c))*180/ma)+'"',q();else{var j=o.r,t=j*2,u=j*2,y=o.cx,B=o.cy,na=b.radialReference,w,j=function(){na&&(w=d.getBBox(),y+=(na[0]-w.x)/w.width-
	0.5,B+=(na[1]-w.y)/w.height-0.5,t*=na[2]/w.width,u*=na[2]/w.height);x='src="'+E.global.VMLRadialGradientURL+'" size="'+t+","+u+'" origin="0.5,0.5" position="'+y+","+B+'" color2="'+L+'" ';q()};d.added?j():d.onAdd=j;j=J}else j=k}else if(g.test(a)&&b.tagName!=="IMG")f=ya(a),h=["<",c,' opacity="',f.get("a"),'"/>'],Y(this.prepVML(h),null,null,b),j=f.get("rgb");else{j=b.getElementsByTagName(c);if(j.length)j[0].opacity=1,j[0].type="solid";j=a}return j},prepVML:function(a){var b=this.isIE8,a=a.join("");b?
	(a=a.replace("/>",' xmlns="urn:schemas-microsoft-com:vml" />'),a=a.indexOf('style="')===-1?a.replace("/>",' style="display:inline-block;behavior:url(#default#VML);" />'):a.replace('style="','style="display:inline-block;behavior:url(#default#VML);')):a=a.replace("<","<hcv:");return a},text:ta.prototype.html,path:function(a){var b={coordsize:"10 10"};La(a)?b.d=a:ca(a)&&q(b,a);return this.createElement("shape").attr(b)},circle:function(a,b,c){var d=this.symbol("circle");if(ca(a))c=a.r,b=a.y,a=a.x;d.isCircle=
	!0;d.r=c;return d.attr({x:a,y:b})},g:function(a){var b;a&&(b={className:"highcharts-"+a,"class":"highcharts-"+a});return this.createElement(Ja).attr(b)},image:function(a,b,c,d,e){var f=this.createElement("img").attr({src:a});arguments.length>1&&f.attr({x:b,y:c,width:d,height:e});return f},createElement:function(a){return a==="rect"?this.symbol(a):ta.prototype.createElement.call(this,a)},invertChild:function(a,b){var c=this,d=b.style,e=a.tagName==="IMG"&&a.style;G(a,{flip:"x",left:z(d.width)-(e?z(e.top):
	1),top:z(d.height)-(e?z(e.left):1),rotation:-90});p(a.childNodes,function(b){c.invertChild(b,a)})},symbols:{arc:function(a,b,c,d,e){var f=e.start,g=e.end,h=e.r||c||d,c=e.innerR,d=Z(f),i=ea(f),j=Z(g),k=ea(g);if(g-f===0)return["x"];f=["wa",a-h,b-h,a+h,b+h,a+h*d,b+h*i,a+h*j,b+h*k];e.open&&!c&&f.push("e","M",a,b);f.push("at",a-c,b-c,a+c,b+c,a+c*j,b+c*k,a+c*d,b+c*i,"x","e");f.isArc=!0;return f},circle:function(a,b,c,d,e){e&&(c=d=2*e.r);e&&e.isCircle&&(a-=c/2,b-=d/2);return["wa",a,b,a+c,b+d,a+c,b+d/2,a+
	c,b+d/2,"e"]},rect:function(a,b,c,d,e){return ta.prototype.symbols[!r(e)||!e.r?"square":"callout"].call(0,a,b,c,d,e)}}};R.VMLRenderer=X=function(){this.init.apply(this,arguments)};X.prototype=w(ta.prototype,ga);Za=X}ta.prototype.measureSpanWidth=function(a,b){var c=y.createElement("span"),d;d=y.createTextNode(a);c.appendChild(d);G(c,b);this.box.appendChild(c);d=c.offsetWidth;Pa(c);return d};var Lb;if(fa)R.CanVGRenderer=X=function(){xa="http://www.w3.org/1999/xhtml"},X.prototype.symbols={},Lb=function(){function a(){var a=
	b.length,d;for(d=0;d<a;d++)b[d]();b=[]}var b=[];return{push:function(c,d){b.length===0&&Qb(d,a);b.push(c)}}}(),Za=X;Sa.prototype={addLabel:function(){var a=this.axis,b=a.options,c=a.chart,d=a.horiz,e=a.categories,f=a.names,g=this.pos,h=b.labels,i=a.tickPositions,d=d&&e&&!h.step&&!h.staggerLines&&!h.rotation&&c.plotWidth/i.length||!d&&(c.margin[3]||c.chartWidth*0.33),j=g===i[0],k=g===i[i.length-1],l,f=e?m(e[g],f[g],g):g,e=this.label,o=i.info;a.isDatetimeAxis&&o&&(l=b.dateTimeLabelFormats[o.higherRanks[g]||
	o.unitName]);this.isFirst=j;this.isLast=k;b=a.labelFormatter.call({axis:a,chart:c,isFirst:j,isLast:k,dateTimeLabelFormat:l,value:a.isLog?da(ia(f)):f});g=d&&{width:v(1,u(d-2*(h.padding||10)))+"px"};g=q(g,h.style);if(r(e))e&&e.attr({text:b}).css(g);else{l={align:a.labelAlign};if(ha(h.rotation))l.rotation=h.rotation;if(d&&h.ellipsis)l._clipHeight=a.len/i.length;this.label=r(b)&&h.enabled?c.renderer.text(b,0,0,h.useHTML).attr(l).css(g).add(a.labelGroup):null}},getLabelSize:function(){var a=this.label,
	b=this.axis;return a?a.getBBox()[b.horiz?"height":"width"]:0},getLabelSides:function(){var a=this.label.getBBox(),b=this.axis,c=b.horiz,d=b.options.labels,a=c?a.width:a.height,b=c?d.x-a*{left:0,center:0.5,right:1}[b.labelAlign]:0;return[b,c?a+b:a]},handleOverflow:function(a,b){var c=!0,d=this.axis,e=this.isFirst,f=this.isLast,g=d.horiz?b.x:b.y,h=d.reversed,i=d.tickPositions,j=this.getLabelSides(),k=j[0],j=j[1],l,o,n,s=this.label.line||0;l=d.labelEdge;o=d.justifyLabels&&(e||f);l[s]===t||g+k>l[s]?l[s]=
	g+j:o||(c=!1);if(o){l=(o=d.justifyToPlot)?d.pos:0;o=o?l+d.len:d.chart.chartWidth;do a+=e?1:-1,n=d.ticks[i[a]];while(i[a]&&(!n||n.label.line!==s));d=n&&n.label.xy&&n.label.xy.x+n.getLabelSides()[e?0:1];e&&!h||f&&h?g+k<l&&(g=l-k,n&&g+j>d&&(c=!1)):g+j>o&&(g=o-j,n&&g+k<d&&(c=!1));b.x=g}return c},getPosition:function(a,b,c,d){var e=this.axis,f=e.chart,g=d&&f.oldChartHeight||f.chartHeight;return{x:a?e.translate(b+c,null,null,d)+e.transB:e.left+e.offset+(e.opposite?(d&&f.oldChartWidth||f.chartWidth)-e.right-
	e.left:0),y:a?g-e.bottom+e.offset-(e.opposite?e.height:0):g-e.translate(b+c,null,null,d)-e.transB}},getLabelPosition:function(a,b,c,d,e,f,g,h){var i=this.axis,j=i.transA,k=i.reversed,l=i.staggerLines,o=i.chart.renderer.fontMetrics(e.style.fontSize).b,n=e.rotation,a=a+e.x-(f&&d?f*j*(k?-1:1):0),b=b+e.y-(f&&!d?f*j*(k?1:-1):0);n&&i.side===2&&(b-=o-o*Z(n*Ca));!r(e.y)&&!n&&(b+=o-c.getBBox().height/2);if(l)c.line=g/(h||1)%l,b+=c.line*(i.labelOffset/l);return{x:a,y:b}},getMarkPath:function(a,b,c,d,e,f){return f.crispLine(["M",
	a,b,"L",a+(e?0:-c),b+(e?c:0)],d)},render:function(a,b,c){var d=this.axis,e=d.options,f=d.chart.renderer,g=d.horiz,h=this.type,i=this.label,j=this.pos,k=e.labels,l=this.gridLine,o=h?h+"Grid":"grid",n=h?h+"Tick":"tick",s=e[o+"LineWidth"],p=e[o+"LineColor"],J=e[o+"LineDashStyle"],L=e[n+"Length"],o=e[n+"Width"]||0,x=e[n+"Color"],r=e[n+"Position"],n=this.mark,v=k.step,q=!0,u=d.tickmarkOffset,w=this.getPosition(g,j,u,b),y=w.x,w=w.y,B=g&&y===d.pos+d.len||!g&&w===d.pos?-1:1;this.isActive=!0;if(s){j=d.getPlotLinePath(j+
	u,s*B,b,!0);if(l===t){l={stroke:p,"stroke-width":s};if(J)l.dashstyle=J;if(!h)l.zIndex=1;if(b)l.opacity=0;this.gridLine=l=s?f.path(j).attr(l).add(d.gridGroup):null}if(!b&&l&&j)l[this.isNew?"attr":"animate"]({d:j,opacity:c})}if(o&&L)r==="inside"&&(L=-L),d.opposite&&(L=-L),h=this.getMarkPath(y,w,L,o*B,g,f),n?n.animate({d:h,opacity:c}):this.mark=f.path(h).attr({stroke:x,"stroke-width":o,opacity:c}).add(d.axisGroup);if(i&&!isNaN(y))i.xy=w=this.getLabelPosition(y,w,i,g,k,u,a,v),this.isFirst&&!this.isLast&&
	!m(e.showFirstLabel,1)||this.isLast&&!this.isFirst&&!m(e.showLastLabel,1)?q=!1:!d.isRadial&&!k.step&&!k.rotation&&!b&&c!==0&&(q=this.handleOverflow(a,w)),v&&a%v&&(q=!1),q&&!isNaN(w.y)?(w.opacity=c,i[this.isNew?"attr":"animate"](w),this.isNew=!1):i.attr("y",-9999)},destroy:function(){Oa(this,this.axis)}};R.PlotLineOrBand=function(a,b){this.axis=a;if(b)this.options=b,this.id=b.id};R.PlotLineOrBand.prototype={render:function(){var a=this,b=a.axis,c=b.horiz,d=(b.pointRange||0)/2,e=a.options,f=e.label,
	g=a.label,h=e.width,i=e.to,j=e.from,k=r(j)&&r(i),l=e.value,o=e.dashStyle,n=a.svgElem,s=[],p,J=e.color,L=e.zIndex,x=e.events,q={},t=b.chart.renderer;b.isLog&&(j=za(j),i=za(i),l=za(l));if(h){if(s=b.getPlotLinePath(l,h),q={stroke:J,"stroke-width":h},o)q.dashstyle=o}else if(k){j=v(j,b.min-d);i=C(i,b.max+d);s=b.getPlotBandPath(j,i,e);if(J)q.fill=J;if(e.borderWidth)q.stroke=e.borderColor,q["stroke-width"]=e.borderWidth}else return;if(r(L))q.zIndex=L;if(n)if(s)n.animate({d:s},null,n.onGetPath);else{if(n.hide(),
	n.onGetPath=function(){n.show()},g)a.label=g=g.destroy()}else if(s&&s.length&&(a.svgElem=n=t.path(s).attr(q).add(),x))for(p in d=function(b){n.on(b,function(c){x[b].apply(a,[c])})},x)d(p);if(f&&r(f.text)&&s&&s.length&&b.width>0&&b.height>0){f=w({align:c&&k&&"center",x:c?!k&&4:10,verticalAlign:!c&&k&&"middle",y:c?k?16:10:k?6:-4,rotation:c&&!k&&90},f);if(!g){q={align:f.textAlign||f.align,rotation:f.rotation};if(r(L))q.zIndex=L;a.label=g=t.text(f.text,0,0,f.useHTML).attr(q).css(f.style).add()}b=[s[1],
	s[4],m(s[6],s[1])];s=[s[2],s[5],m(s[7],s[2])];c=Na(b);k=Na(s);g.align(f,!1,{x:c,y:k,width:Ba(b)-c,height:Ba(s)-k});g.show()}else g&&g.hide();return a},destroy:function(){ja(this.axis.plotLinesAndBands,this);delete this.axis;Oa(this)}};la.prototype={defaultOptions:{dateTimeLabelFormats:{millisecond:"%H:%M:%S.%L",second:"%H:%M:%S",minute:"%H:%M",hour:"%H:%M",day:"%e. %b",week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:!1,gridLineColor:"#C0C0C0",labels:N,lineColor:"#C0D0E0",lineWidth:1,minPadding:0.01,
	maxPadding:0.01,minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",startOfWeek:1,startOnTick:!1,tickColor:"#C0D0E0",tickLength:10,tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",tickWidth:1,title:{align:"middle",style:{color:"#707070"}},type:"linear"},defaultYAxisOptions:{endOnTick:!0,gridLineWidth:1,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8,y:3},lineWidth:0,maxPadding:0.05,minPadding:0.05,startOnTick:!0,
	tickWidth:0,title:{rotation:270,text:"Values"},stackLabels:{enabled:!1,formatter:function(){return Ga(this.total,-1)},style:N.style}},defaultLeftAxisOptions:{labels:{x:-15,y:null},title:{rotation:270}},defaultRightAxisOptions:{labels:{x:15,y:null},title:{rotation:90}},defaultBottomAxisOptions:{labels:{x:0,y:20},title:{rotation:0}},defaultTopAxisOptions:{labels:{x:0,y:-15},title:{rotation:0}},init:function(a,b){var c=b.isX;this.horiz=a.inverted?!c:c;this.coll=(this.isXAxis=c)?"xAxis":"yAxis";this.opposite=
	b.opposite;this.side=b.side||(this.horiz?this.opposite?0:2:this.opposite?1:3);this.setOptions(b);var d=this.options,e=d.type;this.labelFormatter=d.labels.formatter||this.defaultLabelFormatter;this.userOptions=b;this.minPixelPadding=0;this.chart=a;this.reversed=d.reversed;this.zoomEnabled=d.zoomEnabled!==!1;this.categories=d.categories||e==="category";this.names=[];this.isLog=e==="logarithmic";this.isDatetimeAxis=e==="datetime";this.isLinked=r(d.linkedTo);this.tickmarkOffset=this.categories&&d.tickmarkPlacement===
	"between"?0.5:0;this.ticks={};this.labelEdge=[];this.minorTicks={};this.plotLinesAndBands=[];this.alternateBands={};this.len=0;this.minRange=this.userMinRange=d.minRange||d.maxZoom;this.range=d.range;this.offset=d.offset||0;this.stacks={};this.oldStacks={};this.min=this.max=null;this.crosshair=m(d.crosshair,qa(a.options.tooltip.crosshairs)[c?0:1],!1);var f,d=this.options.events;Da(this,a.axes)===-1&&(c&&!this.isColorAxis?a.axes.splice(a.xAxis.length,0,this):a.axes.push(this),a[this.coll].push(this));
	this.series=this.series||[];if(a.inverted&&c&&this.reversed===t)this.reversed=!0;this.removePlotLine=this.removePlotBand=this.removePlotBandOrLine;for(f in d)K(this,f,d[f]);if(this.isLog)this.val2lin=za,this.lin2val=ia},setOptions:function(a){this.options=w(this.defaultOptions,this.isXAxis?{}:this.defaultYAxisOptions,[this.defaultTopAxisOptions,this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],w(E[this.coll],a))},defaultLabelFormatter:function(){var a=
	this.axis,b=this.value,c=a.categories,d=this.dateTimeLabelFormat,e=E.lang.numericSymbols,f=e&&e.length,g,h=a.options.labels.format,a=a.isLog?b:a.tickInterval;if(h)g=Ia(h,this);else if(c)g=b;else if(d)g=cb(d,b);else if(f&&a>=1E3)for(;f--&&g===t;)c=Math.pow(1E3,f+1),a>=c&&e[f]!==null&&(g=Ga(b/c,-1)+e[f]);g===t&&(g=M(b)>=1E4?Ga(b,0):Ga(b,-1,t,""));return g},getSeriesExtremes:function(){var a=this,b=a.chart;a.hasVisibleSeries=!1;a.dataMin=a.dataMax=null;a.buildStacks&&a.buildStacks();p(a.series,function(c){if(c.visible||
	!b.options.chart.ignoreHiddenSeries){var d;d=c.options.threshold;var e;a.hasVisibleSeries=!0;a.isLog&&d<=0&&(d=null);if(a.isXAxis){if(d=c.xData,d.length)a.dataMin=C(m(a.dataMin,d[0]),Na(d)),a.dataMax=v(m(a.dataMax,d[0]),Ba(d))}else{c.getExtremes();e=c.dataMax;c=c.dataMin;if(r(c)&&r(e))a.dataMin=C(m(a.dataMin,c),c),a.dataMax=v(m(a.dataMax,e),e);if(r(d))if(a.dataMin>=d)a.dataMin=d,a.ignoreMinPadding=!0;else if(a.dataMax<d)a.dataMax=d,a.ignoreMaxPadding=!0}}})},translate:function(a,b,c,d,e,f){var g=
	1,h=0,i=d?this.oldTransA:this.transA,d=d?this.oldMin:this.min,j=this.minPixelPadding,e=(this.options.ordinal||this.isLog&&e)&&this.lin2val;if(!i)i=this.transA;if(c)g*=-1,h=this.len;this.reversed&&(g*=-1,h-=g*(this.sector||this.len));b?(a=a*g+h,a-=j,a=a/i+d,e&&(a=this.lin2val(a))):(e&&(a=this.val2lin(a)),f==="between"&&(f=0.5),a=g*(a-d)*i+h+g*j+(ha(f)?i*f*this.pointRange:0));return a},toPixels:function(a,b){return this.translate(a,!1,!this.horiz,null,!0)+(b?0:this.pos)},toValue:function(a,b){return this.translate(a-
	(b?0:this.pos),!0,!this.horiz,null,!0)},getPlotLinePath:function(a,b,c,d,e){var f=this.chart,g=this.left,h=this.top,i,j,k=c&&f.oldChartHeight||f.chartHeight,l=c&&f.oldChartWidth||f.chartWidth,o;i=this.transB;e=m(e,this.translate(a,null,null,c));a=c=u(e+i);i=j=u(k-e-i);if(isNaN(e))o=!0;else if(this.horiz){if(i=h,j=k-this.bottom,a<g||a>g+this.width)o=!0}else if(a=g,c=l-this.right,i<h||i>h+this.height)o=!0;return o&&!d?null:f.renderer.crispLine(["M",a,i,"L",c,j],b||1)},getLinearTickPositions:function(a,
	b,c){var d,e=da(T(b/a)*a),f=da(Ka(c/a)*a),g=[];if(b===c&&ha(b))return[b];for(b=e;b<=f;){g.push(b);b=da(b+a);if(b===d)break;d=b}return g},getMinorTickPositions:function(){var a=this.options,b=this.tickPositions,c=this.minorTickInterval,d=[],e;if(this.isLog){e=b.length;for(a=1;a<e;a++)d=d.concat(this.getLogTickPositions(c,b[a-1],b[a],!0))}else if(this.isDatetimeAxis&&a.minorTickInterval==="auto")d=d.concat(this.getTimeTicks(this.normalizeTimeTickInterval(c),this.min,this.max,a.startOfWeek)),d[0]<this.min&&
	d.shift();else for(b=this.min+(b[0]-this.min)%c;b<=this.max;b+=c)d.push(b);return d},adjustForMinRange:function(){var a=this.options,b=this.min,c=this.max,d,e=this.dataMax-this.dataMin>=this.minRange,f,g,h,i,j;if(this.isXAxis&&this.minRange===t&&!this.isLog)r(a.min)||r(a.max)?this.minRange=null:(p(this.series,function(a){i=a.xData;for(g=j=a.xIncrement?1:i.length-1;g>0;g--)if(h=i[g]-i[g-1],f===t||h<f)f=h}),this.minRange=C(f*5,this.dataMax-this.dataMin));if(c-b<this.minRange){var k=this.minRange;d=
	(k-c+b)/2;d=[b-d,m(a.min,b-d)];if(e)d[2]=this.dataMin;b=Ba(d);c=[b+k,m(a.max,b+k)];if(e)c[2]=this.dataMax;c=Na(c);c-b<k&&(d[0]=c-k,d[1]=m(a.min,c-k),b=Ba(d))}this.min=b;this.max=c},setAxisTranslation:function(a){var b=this,c=b.max-b.min,d=b.axisPointRange||0,e,f=0,g=0,h=b.linkedParent,i=!!b.categories,j=b.transA;if(b.isXAxis||i||d)h?(f=h.minPointOffset,g=h.pointRangePadding):p(b.series,function(a){var h=i?1:b.isXAxis?a.pointRange:b.axisPointRange||0,j=a.options.pointPlacement,n=a.closestPointRange;
	h>c&&(h=0);d=v(d,h);f=v(f,Fa(j)?0:h/2);g=v(g,j==="on"?0:h);!a.noSharedTooltip&&r(n)&&(e=r(e)?C(e,n):n)}),h=b.ordinalSlope&&e?b.ordinalSlope/e:1,b.minPointOffset=f*=h,b.pointRangePadding=g*=h,b.pointRange=C(d,c),b.closestPointRange=e;if(a)b.oldTransA=j;b.translationSlope=b.transA=j=b.len/(c+g||1);b.transB=b.horiz?b.left:b.bottom;b.minPixelPadding=j*f},setTickPositions:function(a){var b=this,c=b.chart,d=b.options,e=b.isLog,f=b.isDatetimeAxis,g=b.isXAxis,h=b.isLinked,i=b.options.tickPositioner,j=d.maxPadding,
	k=d.minPadding,l=d.tickInterval,o=d.minTickInterval,n=d.tickPixelInterval,s,$=b.categories;h?(b.linkedParent=c[b.coll][d.linkedTo],c=b.linkedParent.getExtremes(),b.min=m(c.min,c.dataMin),b.max=m(c.max,c.dataMax),d.type!==b.linkedParent.options.type&&ra(11,1)):(b.min=m(b.userMin,d.min,b.dataMin),b.max=m(b.userMax,d.max,b.dataMax));if(e)!a&&C(b.min,m(b.dataMin,b.min))<=0&&ra(10,1),b.min=da(za(b.min)),b.max=da(za(b.max));if(b.range&&r(b.max))b.userMin=b.min=v(b.min,b.max-b.range),b.userMax=b.max,b.range=
	null;b.beforePadding&&b.beforePadding();b.adjustForMinRange();if(!$&&!b.axisPointRange&&!b.usePercentage&&!h&&r(b.min)&&r(b.max)&&(c=b.max-b.min)){if(!r(d.min)&&!r(b.userMin)&&k&&(b.dataMin<0||!b.ignoreMinPadding))b.min-=c*k;if(!r(d.max)&&!r(b.userMax)&&j&&(b.dataMax>0||!b.ignoreMaxPadding))b.max+=c*j}if(ha(d.floor))b.min=v(b.min,d.floor);if(ha(d.ceiling))b.max=C(b.max,d.ceiling);b.min===b.max||b.min===void 0||b.max===void 0?b.tickInterval=1:h&&!l&&n===b.linkedParent.options.tickPixelInterval?b.tickInterval=
	b.linkedParent.tickInterval:(b.tickInterval=m(l,$?1:(b.max-b.min)*n/v(b.len,n)),!r(l)&&b.len<n&&!this.isRadial&&!this.isLog&&!$&&d.startOnTick&&d.endOnTick&&(s=!0,b.tickInterval/=4));g&&!a&&p(b.series,function(a){a.processData(b.min!==b.oldMin||b.max!==b.oldMax)});b.setAxisTranslation(!0);b.beforeSetTickPositions&&b.beforeSetTickPositions();if(b.postProcessTickInterval)b.tickInterval=b.postProcessTickInterval(b.tickInterval);if(b.pointRange)b.tickInterval=v(b.pointRange,b.tickInterval);if(!l&&b.tickInterval<
	o)b.tickInterval=o;if(!f&&!e&&!l)b.tickInterval=nb(b.tickInterval,null,mb(b.tickInterval),d);b.minorTickInterval=d.minorTickInterval==="auto"&&b.tickInterval?b.tickInterval/5:d.minorTickInterval;b.tickPositions=a=d.tickPositions?[].concat(d.tickPositions):i&&i.apply(b,[b.min,b.max]);if(!a)!b.ordinalPositions&&(b.max-b.min)/b.tickInterval>v(2*b.len,200)&&ra(19,!0),a=f?b.getTimeTicks(b.normalizeTimeTickInterval(b.tickInterval,d.units),b.min,b.max,d.startOfWeek,b.ordinalPositions,b.closestPointRange,
	!0):e?b.getLogTickPositions(b.tickInterval,b.min,b.max):b.getLinearTickPositions(b.tickInterval,b.min,b.max),s&&a.splice(1,a.length-2),b.tickPositions=a;if(!h)e=a[0],f=a[a.length-1],h=b.minPointOffset||0,d.startOnTick?b.min=e:b.min-h>e&&a.shift(),d.endOnTick?b.max=f:b.max+h<f&&a.pop(),a.length===1&&(d=M(b.max)>1E13?1:0.001,b.min-=d,b.max+=d)},setMaxTicks:function(){var a=this.chart,b=a.maxTicks||{},c=this.tickPositions,d=this._maxTicksKey=[this.coll,this.pos,this.len].join("-");if(!this.isLinked&&
	!this.isDatetimeAxis&&c&&c.length>(b[d]||0)&&this.options.alignTicks!==!1)b[d]=c.length;a.maxTicks=b},adjustTickAmount:function(){var a=this._maxTicksKey,b=this.tickPositions,c=this.chart.maxTicks;if(c&&c[a]&&!this.isDatetimeAxis&&!this.categories&&!this.isLinked&&this.options.alignTicks!==!1&&this.min!==t){var d=this.tickAmount,e=b.length;this.tickAmount=a=c[a];if(e<a){for(;b.length<a;)b.push(da(b[b.length-1]+this.tickInterval));this.transA*=(e-1)/(a-1);this.max=b[b.length-1]}if(r(d)&&a!==d)this.isDirty=
	!0}},setScale:function(){var a=this.stacks,b,c,d,e;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;this.setAxisSize();e=this.len!==this.oldAxisLength;p(this.series,function(a){if(a.isDirtyData||a.isDirty||a.xAxis.isDirty)d=!0});if(e||d||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax){if(!this.isXAxis)for(b in a)for(c in a[b])a[b][c].total=null,a[b][c].cum=0;this.forceRedraw=!1;this.getSeriesExtremes();this.setTickPositions();this.oldUserMin=
	this.userMin;this.oldUserMax=this.userMax;if(!this.isDirty)this.isDirty=e||this.min!==this.oldMin||this.max!==this.oldMax}else if(!this.isXAxis){if(this.oldStacks)a=this.stacks=this.oldStacks;for(b in a)for(c in a[b])a[b][c].cum=a[b][c].total}this.setMaxTicks()},setExtremes:function(a,b,c,d,e){var f=this,g=f.chart,c=m(c,!0),e=q(e,{min:a,max:b});D(f,"setExtremes",e,function(){f.userMin=a;f.userMax=b;f.eventArgs=e;f.isDirtyExtremes=!0;c&&g.redraw(d)})},zoom:function(a,b){var c=this.dataMin,d=this.dataMax,
	e=this.options;this.allowZoomOutside||(r(c)&&a<=C(c,m(e.min,c))&&(a=t),r(d)&&b>=v(d,m(e.max,d))&&(b=t));this.displayBtn=a!==t||b!==t;this.setExtremes(a,b,!1,t,{trigger:"zoom"});return!0},setAxisSize:function(){var a=this.chart,b=this.options,c=b.offsetLeft||0,d=this.horiz,e=m(b.width,a.plotWidth-c+(b.offsetRight||0)),f=m(b.height,a.plotHeight),g=m(b.top,a.plotTop),b=m(b.left,a.plotLeft+c),c=/%$/;c.test(f)&&(f=parseInt(f,10)/100*a.plotHeight);c.test(g)&&(g=parseInt(g,10)/100*a.plotHeight+a.plotTop);
	this.left=b;this.top=g;this.width=e;this.height=f;this.bottom=a.chartHeight-f-g;this.right=a.chartWidth-e-b;this.len=v(d?e:f,0);this.pos=d?b:g},getExtremes:function(){var a=this.isLog;return{min:a?da(ia(this.min)):this.min,max:a?da(ia(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var b=this.isLog,c=b?ia(this.min):this.min,b=b?ia(this.max):this.max;c>a||a===null?a=c:b<a&&(a=b);return this.translate(a,0,1,0,1)},autoLabelAlign:function(a){a=
	(m(a,0)-this.side*90+720)%360;return a>15&&a<165?"right":a>195&&a<345?"left":"center"},getOffset:function(){var a=this,b=a.chart,c=b.renderer,d=a.options,e=a.tickPositions,f=a.ticks,g=a.horiz,h=a.side,i=b.inverted?[1,0,3,2][h]:h,j,k=0,l,o=0,n=d.title,s=d.labels,$=0,J=b.axisOffset,L=b.clipOffset,x=[-1,1,1,-1][h],q,u=1,w=m(s.maxStaggerLines,5),y,z,A,B,na=h===2?c.fontMetrics(s.style.fontSize).b:0;a.hasData=j=a.hasVisibleSeries||r(a.min)&&r(a.max)&&!!e;a.showAxis=b=j||m(d.showEmpty,!0);a.staggerLines=
	a.horiz&&s.staggerLines;if(!a.axisGroup)a.gridGroup=c.g("grid").attr({zIndex:d.gridZIndex||1}).add(),a.axisGroup=c.g("axis").attr({zIndex:d.zIndex||2}).add(),a.labelGroup=c.g("axis-labels").attr({zIndex:s.zIndex||7}).addClass("highcharts-"+a.coll.toLowerCase()+"-labels").add();if(j||a.isLinked){a.labelAlign=m(s.align||a.autoLabelAlign(s.rotation));p(e,function(b){f[b]?f[b].addLabel():f[b]=new Sa(a,b)});if(a.horiz&&!a.staggerLines&&w&&!s.rotation){for(q=a.reversed?[].concat(e).reverse():e;u<w;){j=
	[];y=!1;for(s=0;s<q.length;s++)z=q[s],A=(A=f[z].label&&f[z].label.getBBox())?A.width:0,B=s%u,A&&(z=a.translate(z),j[B]!==t&&z<j[B]&&(y=!0),j[B]=z+A);if(y)u++;else break}if(u>1)a.staggerLines=u}p(e,function(b){if(h===0||h===2||{1:"left",3:"right"}[h]===a.labelAlign)$=v(f[b].getLabelSize(),$)});if(a.staggerLines)$*=a.staggerLines,a.labelOffset=$}else for(q in f)f[q].destroy(),delete f[q];if(n&&n.text&&n.enabled!==!1){if(!a.axisTitle)a.axisTitle=c.text(n.text,0,0,n.useHTML).attr({zIndex:7,rotation:n.rotation||
	0,align:n.textAlign||{low:"left",middle:"center",high:"right"}[n.align]}).addClass("highcharts-"+this.coll.toLowerCase()+"-title").css(n.style).add(a.axisGroup),a.axisTitle.isNew=!0;if(b)k=a.axisTitle.getBBox()[g?"height":"width"],o=m(n.margin,g?5:10),l=n.offset;a.axisTitle[b?"show":"hide"]()}a.offset=x*m(d.offset,J[h]);a.axisTitleMargin=m(l,$+o+($&&x*d.labels[g?"y":"x"]-na));J[h]=v(J[h],a.axisTitleMargin+k+x*a.offset);L[i]=v(L[i],T(d.lineWidth/2)*2)},getLinePath:function(a){var b=this.chart,c=this.opposite,
	d=this.offset,e=this.horiz,f=this.left+(c?this.width:0)+d,d=b.chartHeight-this.bottom-(c?this.height:0)+d;c&&(a*=-1);return b.renderer.crispLine(["M",e?this.left:f,e?d:this.top,"L",e?b.chartWidth-this.right:f,e?d:b.chartHeight-this.bottom],a)},getTitlePosition:function(){var a=this.horiz,b=this.left,c=this.top,d=this.len,e=this.options.title,f=a?b:c,g=this.opposite,h=this.offset,i=z(e.style.fontSize||12),d={low:f+(a?0:d),middle:f+d/2,high:f+(a?d:0)}[e.align],b=(a?c+this.height:b)+(a?1:-1)*(g?-1:1)*
	this.axisTitleMargin+(this.side===2?i:0);return{x:a?d:b+(g?this.width:0)+h+(e.x||0),y:a?b-(g?this.height:0)+h:d+(e.y||0)}},render:function(){var a=this,b=a.horiz,c=a.reversed,d=a.chart,e=d.renderer,f=a.options,g=a.isLog,h=a.isLinked,i=a.tickPositions,j,k=a.axisTitle,l=a.ticks,o=a.minorTicks,n=a.alternateBands,s=f.stackLabels,m=f.alternateGridColor,J=a.tickmarkOffset,L=f.lineWidth,x=d.hasRendered&&r(a.oldMin)&&!isNaN(a.oldMin),q=a.hasData,v=a.showAxis,u,w=f.labels.overflow,y=a.justifyLabels=b&&w!==
	!1,z;a.labelEdge.length=0;a.justifyToPlot=w==="justify";p([l,o,n],function(a){for(var b in a)a[b].isActive=!1});if(q||h)if(a.minorTickInterval&&!a.categories&&p(a.getMinorTickPositions(),function(b){o[b]||(o[b]=new Sa(a,b,"minor"));x&&o[b].isNew&&o[b].render(null,!0);o[b].render(null,!1,1)}),i.length&&(j=i.slice(),(b&&c||!b&&!c)&&j.reverse(),y&&(j=j.slice(1).concat([j[0]])),p(j,function(b,c){y&&(c=c===j.length-1?0:c+1);if(!h||b>=a.min&&b<=a.max)l[b]||(l[b]=new Sa(a,b)),x&&l[b].isNew&&l[b].render(c,
	!0,0.1),l[b].render(c,!1,1)}),J&&a.min===0&&(l[-1]||(l[-1]=new Sa(a,-1,null,!0)),l[-1].render(-1))),m&&p(i,function(b,c){if(c%2===0&&b<a.max)n[b]||(n[b]=new R.PlotLineOrBand(a)),u=b+J,z=i[c+1]!==t?i[c+1]+J:a.max,n[b].options={from:g?ia(u):u,to:g?ia(z):z,color:m},n[b].render(),n[b].isActive=!0}),!a._addedPlotLB)p((f.plotLines||[]).concat(f.plotBands||[]),function(b){a.addPlotBandOrLine(b)}),a._addedPlotLB=!0;p([l,o,n],function(a){var b,c,e=[],f=va?va.duration||500:0,g=function(){for(c=e.length;c--;)a[e[c]]&&
	!a[e[c]].isActive&&(a[e[c]].destroy(),delete a[e[c]])};for(b in a)if(!a[b].isActive)a[b].render(b,!1,0),a[b].isActive=!1,e.push(b);a===n||!d.hasRendered||!f?g():f&&setTimeout(g,f)});if(L)b=a.getLinePath(L),a.axisLine?a.axisLine.animate({d:b}):a.axisLine=e.path(b).attr({stroke:f.lineColor,"stroke-width":L,zIndex:7}).add(a.axisGroup),a.axisLine[v?"show":"hide"]();if(k&&v)k[k.isNew?"attr":"animate"](a.getTitlePosition()),k.isNew=!1;s&&s.enabled&&a.renderStackTotals();a.isDirty=!1},redraw:function(){var a=
	this.chart.pointer;a&&a.reset(!0);this.render();p(this.plotLinesAndBands,function(a){a.render()});p(this.series,function(a){a.isDirty=!0})},destroy:function(a){var b=this,c=b.stacks,d,e=b.plotLinesAndBands;a||W(b);for(d in c)Oa(c[d]),c[d]=null;p([b.ticks,b.minorTicks,b.alternateBands],function(a){Oa(a)});for(a=e.length;a--;)e[a].destroy();p("stackTotalGroup,axisLine,axisTitle,axisGroup,cross,gridGroup,labelGroup".split(","),function(a){b[a]&&(b[a]=b[a].destroy())});this.cross&&this.cross.destroy()},
	drawCrosshair:function(a,b){if(this.crosshair)if((r(b)||!m(this.crosshair.snap,!0))===!1)this.hideCrosshair();else{var c,d=this.crosshair,e=d.animation;m(d.snap,!0)?r(b)&&(c=this.chart.inverted!=this.horiz?b.plotX:this.len-b.plotY):c=this.horiz?a.chartX-this.pos:this.len-a.chartY+this.pos;c=this.isRadial?this.getPlotLinePath(this.isXAxis?b.x:m(b.stackY,b.y)):this.getPlotLinePath(null,null,null,null,c);if(c===null)this.hideCrosshair();else if(this.cross)this.cross.attr({visibility:"visible"})[e?"animate":
	"attr"]({d:c},e);else{e={"stroke-width":d.width||1,stroke:d.color||"#C0C0C0",zIndex:d.zIndex||2};if(d.dashStyle)e.dashstyle=d.dashStyle;this.cross=this.chart.renderer.path(c).attr(e).add()}}},hideCrosshair:function(){this.cross&&this.cross.hide()}};q(la.prototype,{getPlotBandPath:function(a,b){var c=this.getPlotLinePath(b),d=this.getPlotLinePath(a);d&&c?d.push(c[4],c[5],c[1],c[2]):d=null;return d},addPlotBand:function(a){this.addPlotBandOrLine(a,"plotBands")},addPlotLine:function(a){this.addPlotBandOrLine(a,
	"plotLines")},addPlotBandOrLine:function(a,b){var c=(new R.PlotLineOrBand(this,a)).render(),d=this.userOptions;c&&(b&&(d[b]=d[b]||[],d[b].push(a)),this.plotLinesAndBands.push(c));return c},removePlotBandOrLine:function(a){for(var b=this.plotLinesAndBands,c=this.options,d=this.userOptions,e=b.length;e--;)b[e].id===a&&b[e].destroy();p([c.plotLines||[],d.plotLines||[],c.plotBands||[],d.plotBands||[]],function(b){for(e=b.length;e--;)b[e].id===a&&ja(b,b[e])})}});la.prototype.getTimeTicks=function(a,b,
	c,d){var e=[],f={},g=E.global.useUTC,h,i=new Date(b-Ra),j=a.unitRange,k=a.count;if(r(b)){j>=A.second&&(i.setMilliseconds(0),i.setSeconds(j>=A.minute?0:k*T(i.getSeconds()/k)));if(j>=A.minute)i[Db](j>=A.hour?0:k*T(i[pb]()/k));if(j>=A.hour)i[Eb](j>=A.day?0:k*T(i[qb]()/k));if(j>=A.day)i[sb](j>=A.month?1:k*T(i[Xa]()/k));j>=A.month&&(i[Fb](j>=A.year?0:k*T(i[fb]()/k)),h=i[gb]());j>=A.year&&(h-=h%k,i[Gb](h));if(j===A.week)i[sb](i[Xa]()-i[rb]()+m(d,1));b=1;Ra&&(i=new Date(i.getTime()+Ra));h=i[gb]();for(var d=
	i.getTime(),l=i[fb](),o=i[Xa](),n=g?Ra:(864E5+i.getTimezoneOffset()*6E4)%864E5;d<c;)e.push(d),j===A.year?d=eb(h+b*k,0):j===A.month?d=eb(h,l+b*k):!g&&(j===A.day||j===A.week)?d=eb(h,l,o+b*k*(j===A.day?1:7)):d+=j*k,b++;e.push(d);p(vb(e,function(a){return j<=A.hour&&a%A.day===n}),function(a){f[a]="day"})}e.info=q(a,{higherRanks:f,totalRange:j*k});return e};la.prototype.normalizeTimeTickInterval=function(a,b){var c=b||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",
	[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]],d=c[c.length-1],e=A[d[0]],f=d[1],g;for(g=0;g<c.length;g++)if(d=c[g],e=A[d[0]],f=d[1],c[g+1]&&a<=(e*f[f.length-1]+A[c[g+1][0]])/2)break;e===A.year&&a<5*e&&(f=[1,2,5]);c=nb(a/e,f,d[0]==="year"?v(mb(a/e),1):1);return{unitRange:e,count:c,unitName:d[0]}};la.prototype.getLogTickPositions=function(a,b,c,d){var e=this.options,f=this.len,g=[];if(!d)this._minorAutoInterval=null;if(a>=0.5)a=u(a),g=this.getLinearTickPositions(a,
	b,c);else if(a>=0.08)for(var f=T(b),h,i,j,k,l,e=a>0.3?[1,2,4]:a>0.15?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];f<c+1&&!l;f++){i=e.length;for(h=0;h<i&&!l;h++)j=za(ia(f)*e[h]),j>b&&(!d||k<=c)&&g.push(k),k>c&&(l=!0),k=j}else if(b=ia(b),c=ia(c),a=e[d?"minorTickInterval":"tickInterval"],a=m(a==="auto"?null:a,this._minorAutoInterval,(c-b)*(e.tickPixelInterval/(d?5:1))/((d?f/this.tickPositions.length:f)||1)),a=nb(a,null,mb(a)),g=Ua(this.getLinearTickPositions(a,b,c),za),!d)this._minorAutoInterval=a/5;if(!d)this.tickInterval=
	a;return g};var Mb=R.Tooltip=function(){this.init.apply(this,arguments)};Mb.prototype={init:function(a,b){var c=b.borderWidth,d=b.style,e=z(d.padding);this.chart=a;this.options=b;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.label=a.renderer.label("",0,0,b.shape||"callout",null,null,b.useHTML,null,"tooltip").attr({padding:e,fill:b.backgroundColor,"stroke-width":c,r:b.borderRadius,zIndex:8}).css(d).css({padding:0}).add().attr({y:-9999});fa||this.label.shadow(b.shadow);this.shared=b.shared},
	destroy:function(){if(this.label)this.label=this.label.destroy();clearTimeout(this.hideTimer);clearTimeout(this.tooltipTimeout)},move:function(a,b,c,d){var e=this,f=e.now,g=e.options.animation!==!1&&!e.isHidden,h=e.followPointer||e.len>1;q(f,{x:g?(2*f.x+a)/3:a,y:g?(f.y+b)/2:b,anchorX:h?t:g?(2*f.anchorX+c)/3:c,anchorY:h?t:g?(f.anchorY+d)/2:d});e.label.attr(f);if(g&&(M(a-f.x)>1||M(b-f.y)>1))clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){e&&e.move(a,b,c,d)},32)},hide:function(){var a=
	this,b;clearTimeout(this.hideTimer);if(!this.isHidden)b=this.chart.hoverPoints,this.hideTimer=setTimeout(function(){a.label.fadeOut();a.isHidden=!0},m(this.options.hideDelay,500)),b&&p(b,function(a){a.setState()}),this.chart.hoverPoints=null},getAnchor:function(a,b){var c,d=this.chart,e=d.inverted,f=d.plotTop,g=0,h=0,i,a=qa(a);c=a[0].tooltipPos;this.followPointer&&b&&(b.chartX===t&&(b=d.pointer.normalize(b)),c=[b.chartX-d.plotLeft,b.chartY-f]);c||(p(a,function(a){i=a.series.yAxis;g+=a.plotX;h+=(a.plotLow?
	(a.plotLow+a.plotHigh)/2:a.plotY)+(!e&&i?i.top-f:0)}),g/=a.length,h/=a.length,c=[e?d.plotWidth-h:g,this.shared&&!e&&a.length>1&&b?b.chartY-f:e?d.plotHeight-g:h]);return Ua(c,u)},getPosition:function(a,b,c){var d=this.chart,e=this.distance,f={},g,h=["y",d.chartHeight,b,c.plotY+d.plotTop],i=["x",d.chartWidth,a,c.plotX+d.plotLeft],j=c.ttBelow||d.inverted&&!c.negative||!d.inverted&&c.negative,k=function(a,b,c,d){var g=c<d-e,b=d+e+c<b,c=d-e-c;d+=e;if(j&&b)f[a]=d;else if(!j&&g)f[a]=c;else if(g)f[a]=c;else if(b)f[a]=
	d;else return!1},l=function(a,b,c,d){if(d<e||d>b-e)return!1;else f[a]=d<c/2?1:d>b-c/2?b-c-2:d-c/2},o=function(a){var b=h;h=i;i=b;g=a},n=function(){k.apply(0,h)!==!1?l.apply(0,i)===!1&&!g&&(o(!0),n()):g?f.x=f.y=0:(o(!0),n())};(d.inverted||this.len>1)&&o();n();return f},defaultFormatter:function(a){var b=this.points||qa(this),c=b[0].series,d;d=[a.tooltipHeaderFormatter(b[0])];p(b,function(a){c=a.series;d.push(c.tooltipFormatter&&c.tooltipFormatter(a)||a.point.tooltipFormatter(c.tooltipOptions.pointFormat))});
	d.push(a.options.footerFormat||"");return d.join("")},refresh:function(a,b){var c=this.chart,d=this.label,e=this.options,f,g,h={},i,j=[];i=e.formatter||this.defaultFormatter;var h=c.hoverPoints,k,l=this.shared;clearTimeout(this.hideTimer);this.followPointer=qa(a)[0].series.tooltipOptions.followPointer;g=this.getAnchor(a,b);f=g[0];g=g[1];l&&(!a.series||!a.series.noSharedTooltip)?(c.hoverPoints=a,h&&p(h,function(a){a.setState()}),p(a,function(a){a.setState("hover");j.push(a.getLabelConfig())}),h={x:a[0].category,
	y:a[0].y},h.points=j,this.len=j.length,a=a[0]):h=a.getLabelConfig();i=i.call(h,this);h=a.series;this.distance=m(h.tooltipOptions.distance,16);i===!1?this.hide():(this.isHidden&&(bb(d),d.attr("opacity",1).show()),d.attr({text:i}),k=e.borderColor||a.color||h.color||"#606060",d.attr({stroke:k}),this.updatePosition({plotX:f,plotY:g,negative:a.negative,ttBelow:a.ttBelow}),this.isHidden=!1);D(c,"tooltipRefresh",{text:i,x:f+c.plotLeft,y:g+c.plotTop,borderColor:k})},updatePosition:function(a){var b=this.chart,
	c=this.label,c=(this.options.positioner||this.getPosition).call(this,c.width,c.height,a);this.move(u(c.x),u(c.y),a.plotX+b.plotLeft,a.plotY+b.plotTop)},tooltipHeaderFormatter:function(a){var b=a.series,c=b.tooltipOptions,d=c.dateTimeLabelFormats,e=c.xDateFormat,f=b.xAxis,g=f&&f.options.type==="datetime"&&ha(a.key),c=c.headerFormat,f=f&&f.closestPointRange,h;if(g&&!e){if(f)for(h in A){if(A[h]>=f||A[h]<=A.day&&a.key%A[h]>0){e=d[h];break}}else e=d.day;e=e||d.year}g&&e&&(c=c.replace("{point.key}","{point.key:"+
	e+"}"));return Ia(c,{point:a,series:b})}};var oa;$a=y.documentElement.ontouchstart!==t;var Wa=R.Pointer=function(a,b){this.init(a,b)};Wa.prototype={init:function(a,b){var c=b.chart,d=c.events,e=fa?"":c.zoomType,c=a.inverted,f;this.options=b;this.chart=a;this.zoomX=f=/x/.test(e);this.zoomY=e=/y/.test(e);this.zoomHor=f&&!c||e&&c;this.zoomVert=e&&!c||f&&c;this.hasZoom=f||e;this.runChartClick=d&&!!d.click;this.pinchDown=[];this.lastValidTouch={};if(R.Tooltip&&b.tooltip.enabled)a.tooltip=new Mb(a,b.tooltip),
	this.followTouchMove=b.tooltip.followTouchMove;this.setDOMEvents()},normalize:function(a,b){var c,d,a=a||window.event,a=Sb(a);if(!a.target)a.target=a.srcElement;d=a.touches?a.touches.length?a.touches.item(0):a.changedTouches[0]:a;if(!b)this.chartPosition=b=Rb(this.chart.container);d.pageX===t?(c=v(a.x,a.clientX-b.left),d=a.y):(c=d.pageX-b.left,d=d.pageY-b.top);return q(a,{chartX:u(c),chartY:u(d)})},getCoordinates:function(a){var b={xAxis:[],yAxis:[]};p(this.chart.axes,function(c){b[c.isXAxis?"xAxis":
	"yAxis"].push({axis:c,value:c.toValue(a[c.horiz?"chartX":"chartY"])})});return b},getIndex:function(a){var b=this.chart;return b.inverted?b.plotHeight+b.plotTop-a.chartY:a.chartX-b.plotLeft},runPointActions:function(a){var b=this.chart,c=b.series,d=b.tooltip,e,f,g=b.hoverPoint,h=b.hoverSeries,i,j,k=b.chartWidth,l=this.getIndex(a);if(d&&this.options.tooltip.shared&&(!h||!h.noSharedTooltip)){f=[];i=c.length;for(j=0;j<i;j++)if(c[j].visible&&c[j].options.enableMouseTracking!==!1&&!c[j].noSharedTooltip&&
	c[j].singularTooltips!==!0&&c[j].tooltipPoints.length&&(e=c[j].tooltipPoints[l])&&e.series)e._dist=M(l-e.clientX),k=C(k,e._dist),f.push(e);for(i=f.length;i--;)f[i]._dist>k&&f.splice(i,1);if(f.length&&f[0].clientX!==this.hoverX)d.refresh(f,a),this.hoverX=f[0].clientX}c=h&&h.tooltipOptions.followPointer;if(h&&h.tracker&&!c){if((e=h.tooltipPoints[l])&&e!==g)e.onMouseOver(a)}else d&&c&&!d.isHidden&&(h=d.getAnchor([{}],a),d.updatePosition({plotX:h[0],plotY:h[1]}));if(d&&!this._onDocumentMouseMove)this._onDocumentMouseMove=
	function(a){if(V[oa])V[oa].pointer.onDocumentMouseMove(a)},K(y,"mousemove",this._onDocumentMouseMove);p(b.axes,function(b){b.drawCrosshair(a,m(e,g))})},reset:function(a){var b=this.chart,c=b.hoverSeries,d=b.hoverPoint,e=b.tooltip,f=e&&e.shared?b.hoverPoints:d;(a=a&&e&&f)&&qa(f)[0].plotX===t&&(a=!1);if(a)e.refresh(f),d&&d.setState(d.state,!0);else{if(d)d.onMouseOut();if(c)c.onMouseOut();e&&e.hide();if(this._onDocumentMouseMove)W(y,"mousemove",this._onDocumentMouseMove),this._onDocumentMouseMove=null;
	p(b.axes,function(a){a.hideCrosshair()});this.hoverX=null}},scaleGroups:function(a,b){var c=this.chart,d;p(c.series,function(e){d=a||e.getPlotBox();e.xAxis&&e.xAxis.zoomEnabled&&(e.group.attr(d),e.markerGroup&&(e.markerGroup.attr(d),e.markerGroup.clip(b?c.clipRect:null)),e.dataLabelsGroup&&e.dataLabelsGroup.attr(d))});c.clipRect.attr(b||c.clipBox)},dragStart:function(a){var b=this.chart;b.mouseIsDown=a.type;b.cancelClick=!1;b.mouseDownX=this.mouseDownX=a.chartX;b.mouseDownY=this.mouseDownY=a.chartY},
	drag:function(a){var b=this.chart,c=b.options.chart,d=a.chartX,e=a.chartY,f=this.zoomHor,g=this.zoomVert,h=b.plotLeft,i=b.plotTop,j=b.plotWidth,k=b.plotHeight,l,o=this.mouseDownX,n=this.mouseDownY;d<h?d=h:d>h+j&&(d=h+j);e<i?e=i:e>i+k&&(e=i+k);this.hasDragged=Math.sqrt(Math.pow(o-d,2)+Math.pow(n-e,2));if(this.hasDragged>10){l=b.isInsidePlot(o-h,n-i);if(b.hasCartesianSeries&&(this.zoomX||this.zoomY)&&l&&!this.selectionMarker)this.selectionMarker=b.renderer.rect(h,i,f?1:j,g?1:k,0).attr({fill:c.selectionMarkerFill||
	"rgba(69,114,167,0.25)",zIndex:7}).add();this.selectionMarker&&f&&(d-=o,this.selectionMarker.attr({width:M(d),x:(d>0?0:d)+o}));this.selectionMarker&&g&&(d=e-n,this.selectionMarker.attr({height:M(d),y:(d>0?0:d)+n}));l&&!this.selectionMarker&&c.panning&&b.pan(a,c.panning)}},drop:function(a){var b=this.chart,c=this.hasPinched;if(this.selectionMarker){var d={xAxis:[],yAxis:[],originalEvent:a.originalEvent||a},a=this.selectionMarker,e=a.attr?a.attr("x"):a.x,f=a.attr?a.attr("y"):a.y,g=a.attr?a.attr("width"):
	a.width,h=a.attr?a.attr("height"):a.height,i;if(this.hasDragged||c)p(b.axes,function(a){if(a.zoomEnabled){var b=a.horiz,c=a.toValue(b?e:f),b=a.toValue(b?e+g:f+h);!isNaN(c)&&!isNaN(b)&&(d[a.coll].push({axis:a,min:C(c,b),max:v(c,b)}),i=!0)}}),i&&D(b,"selection",d,function(a){b.zoom(q(a,c?{animation:!1}:null))});this.selectionMarker=this.selectionMarker.destroy();c&&this.scaleGroups()}if(b)G(b.container,{cursor:b._cursor}),b.cancelClick=this.hasDragged>10,b.mouseIsDown=this.hasDragged=this.hasPinched=
	!1,this.pinchDown=[]},onContainerMouseDown:function(a){a=this.normalize(a);a.preventDefault&&a.preventDefault();this.dragStart(a)},onDocumentMouseUp:function(a){V[oa]&&V[oa].pointer.drop(a)},onDocumentMouseMove:function(a){var b=this.chart,c=this.chartPosition,d=b.hoverSeries,a=this.normalize(a,c);c&&d&&!this.inClass(a.target,"highcharts-tracker")&&!b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)&&this.reset()},onContainerMouseLeave:function(){var a=V[oa];if(a)a.pointer.reset(),a.pointer.chartPosition=
	null},onContainerMouseMove:function(a){var b=this.chart;oa=b.index;a=this.normalize(a);b.mouseIsDown==="mousedown"&&this.drag(a);(this.inClass(a.target,"highcharts-tracker")||b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop))&&!b.openMenu&&this.runPointActions(a)},inClass:function(a,b){for(var c;a;){if(c=H(a,"class"))if(c.indexOf(b)!==-1)return!0;else if(c.indexOf("highcharts-container")!==-1)return!1;a=a.parentNode}},onTrackerMouseOut:function(a){var b=this.chart.hoverSeries,c=(a=a.relatedTarget||
	a.toElement)&&a.point&&a.point.series;if(b&&!b.options.stickyTracking&&!this.inClass(a,"highcharts-tooltip")&&c!==b)b.onMouseOut()},onContainerClick:function(a){var b=this.chart,c=b.hoverPoint,d=b.plotLeft,e=b.plotTop,a=this.normalize(a);a.cancelBubble=!0;b.cancelClick||(c&&this.inClass(a.target,"highcharts-tracker")?(D(c.series,"click",q(a,{point:c})),b.hoverPoint&&c.firePointEvent("click",a)):(q(a,this.getCoordinates(a)),b.isInsidePlot(a.chartX-d,a.chartY-e)&&D(b,"click",a)))},setDOMEvents:function(){var a=
	this,b=a.chart.container;b.onmousedown=function(b){a.onContainerMouseDown(b)};b.onmousemove=function(b){a.onContainerMouseMove(b)};b.onclick=function(b){a.onContainerClick(b)};K(b,"mouseleave",a.onContainerMouseLeave);ab===1&&K(y,"mouseup",a.onDocumentMouseUp);if($a)b.ontouchstart=function(b){a.onContainerTouchStart(b)},b.ontouchmove=function(b){a.onContainerTouchMove(b)},ab===1&&K(y,"touchend",a.onDocumentTouchEnd)},destroy:function(){var a;W(this.chart.container,"mouseleave",this.onContainerMouseLeave);
	ab||(W(y,"mouseup",this.onDocumentMouseUp),W(y,"touchend",this.onDocumentTouchEnd));clearInterval(this.tooltipTimeout);for(a in this)this[a]=null}};q(R.Pointer.prototype,{pinchTranslate:function(a,b,c,d,e,f){(this.zoomHor||this.pinchHor)&&this.pinchTranslateDirection(!0,a,b,c,d,e,f);(this.zoomVert||this.pinchVert)&&this.pinchTranslateDirection(!1,a,b,c,d,e,f)},pinchTranslateDirection:function(a,b,c,d,e,f,g,h){var i=this.chart,j=a?"x":"y",k=a?"X":"Y",l="chart"+k,o=a?"width":"height",n=i["plot"+(a?
	"Left":"Top")],s,m,p=h||1,q=i.inverted,x=i.bounds[a?"h":"v"],r=b.length===1,v=b[0][l],u=c[0][l],t=!r&&b[1][l],w=!r&&c[1][l],y,c=function(){!r&&M(v-t)>20&&(p=h||M(u-w)/M(v-t));m=(n-u)/p+v;s=i["plot"+(a?"Width":"Height")]/p};c();b=m;b<x.min?(b=x.min,y=!0):b+s>x.max&&(b=x.max-s,y=!0);y?(u-=0.8*(u-g[j][0]),r||(w-=0.8*(w-g[j][1])),c()):g[j]=[u,w];q||(f[j]=m-n,f[o]=s);f=q?1/p:p;e[o]=s;e[j]=b;d[q?a?"scaleY":"scaleX":"scale"+k]=p;d["translate"+k]=f*n+(u-f*v)},pinch:function(a){var b=this,c=b.chart,d=b.pinchDown,
	e=b.followTouchMove,f=a.touches,g=f.length,h=b.lastValidTouch,i=b.hasZoom,j=b.selectionMarker,k={},l=g===1&&(b.inClass(a.target,"highcharts-tracker")&&c.runTrackerClick||c.runChartClick),o={};(i||e)&&!l&&a.preventDefault();Ua(f,function(a){return b.normalize(a)});if(a.type==="touchstart")p(f,function(a,b){d[b]={chartX:a.chartX,chartY:a.chartY}}),h.x=[d[0].chartX,d[1]&&d[1].chartX],h.y=[d[0].chartY,d[1]&&d[1].chartY],p(c.axes,function(a){if(a.zoomEnabled){var b=c.bounds[a.horiz?"h":"v"],d=a.minPixelPadding,
	e=a.toPixels(a.dataMin),f=a.toPixels(a.dataMax),g=C(e,f),e=v(e,f);b.min=C(a.pos,g-d);b.max=v(a.pos+a.len,e+d)}});else if(d.length){if(!j)b.selectionMarker=j=q({destroy:sa},c.plotBox);b.pinchTranslate(d,f,k,j,o,h);b.hasPinched=i;b.scaleGroups(k,o);!i&&e&&g===1&&this.runPointActions(b.normalize(a))}},onContainerTouchStart:function(a){var b=this.chart;oa=b.index;a.touches.length===1?(a=this.normalize(a),b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)?(this.runPointActions(a),this.pinch(a)):this.reset()):
	a.touches.length===2&&this.pinch(a)},onContainerTouchMove:function(a){(a.touches.length===1||a.touches.length===2)&&this.pinch(a)},onDocumentTouchEnd:function(a){V[oa]&&V[oa].pointer.drop(a)}});if(I.PointerEvent||I.MSPointerEvent){var ua={},zb=!!I.PointerEvent,Wb=function(){var a,b=[];b.item=function(a){return this[a]};for(a in ua)ua.hasOwnProperty(a)&&b.push({pageX:ua[a].pageX,pageY:ua[a].pageY,target:ua[a].target});return b},Ab=function(a,b,c,d){a=a.originalEvent||a;if((a.pointerType==="touch"||
	a.pointerType===a.MSPOINTER_TYPE_TOUCH)&&V[oa])d(a),d=V[oa].pointer,d[b]({type:c,target:a.currentTarget,preventDefault:sa,touches:Wb()})};q(Wa.prototype,{onContainerPointerDown:function(a){Ab(a,"onContainerTouchStart","touchstart",function(a){ua[a.pointerId]={pageX:a.pageX,pageY:a.pageY,target:a.currentTarget}})},onContainerPointerMove:function(a){Ab(a,"onContainerTouchMove","touchmove",function(a){ua[a.pointerId]={pageX:a.pageX,pageY:a.pageY};if(!ua[a.pointerId].target)ua[a.pointerId].target=a.currentTarget})},
	onDocumentPointerUp:function(a){Ab(a,"onContainerTouchEnd","touchend",function(a){delete ua[a.pointerId]})},batchMSEvents:function(a){a(this.chart.container,zb?"pointerdown":"MSPointerDown",this.onContainerPointerDown);a(this.chart.container,zb?"pointermove":"MSPointerMove",this.onContainerPointerMove);a(y,zb?"pointerup":"MSPointerUp",this.onDocumentPointerUp)}});Ma(Wa.prototype,"init",function(a,b,c){a.call(this,b,c);(this.hasZoom||this.followTouchMove)&&G(b.container,{"-ms-touch-action":Q,"touch-action":Q})});
	Ma(Wa.prototype,"setDOMEvents",function(a){a.apply(this);(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(K)});Ma(Wa.prototype,"destroy",function(a){this.batchMSEvents(W);a.call(this)})}var lb=R.Legend=function(a,b){this.init(a,b)};lb.prototype={init:function(a,b){var c=this,d=b.itemStyle,e=m(b.padding,8),f=b.itemMarginTop||0;this.options=b;if(b.enabled)c.baseline=z(d.fontSize)+3+f,c.itemStyle=d,c.itemHiddenStyle=w(d,b.itemHiddenStyle),c.itemMarginTop=f,c.padding=e,c.initialItemX=e,c.initialItemY=
	e-5,c.maxItemWidth=0,c.chart=a,c.itemHeight=0,c.lastLineHeight=0,c.symbolWidth=m(b.symbolWidth,16),c.pages=[],c.render(),K(c.chart,"endResize",function(){c.positionCheckboxes()})},colorizeItem:function(a,b){var c=this.options,d=a.legendItem,e=a.legendLine,f=a.legendSymbol,g=this.itemHiddenStyle.color,c=b?c.itemStyle.color:g,h=b?a.legendColor||a.color||"#CCC":g,g=a.options&&a.options.marker,i={fill:h},j;d&&d.css({fill:c,color:c});e&&e.attr({stroke:h});if(f){if(g&&f.isMarker)for(j in i.stroke=h,g=a.convertAttribs(g),
	g)d=g[j],d!==t&&(i[j]=d);f.attr(i)}},positionItem:function(a){var b=this.options,c=b.symbolPadding,b=!b.rtl,d=a._legendItemPos,e=d[0],d=d[1],f=a.checkbox;a.legendGroup&&a.legendGroup.translate(b?e:this.legendWidth-e-2*c-4,d);if(f)f.x=e,f.y=d},destroyItem:function(a){var b=a.checkbox;p(["legendItem","legendLine","legendSymbol","legendGroup"],function(b){a[b]&&(a[b]=a[b].destroy())});b&&Pa(a.checkbox)},destroy:function(){var a=this.group,b=this.box;if(b)this.box=b.destroy();if(a)this.group=a.destroy()},
	positionCheckboxes:function(a){var b=this.group.alignAttr,c,d=this.clipHeight||this.legendHeight;if(b)c=b.translateY,p(this.allItems,function(e){var f=e.checkbox,g;f&&(g=c+f.y+(a||0)+3,G(f,{left:b.translateX+e.checkboxOffset+f.x-20+"px",top:g+"px",display:g>c-6&&g<c+d-6?"":Q}))})},renderTitle:function(){var a=this.padding,b=this.options.title,c=0;if(b.text){if(!this.title)this.title=this.chart.renderer.label(b.text,a-3,a-4,null,null,null,null,null,"legend-title").attr({zIndex:1}).css(b.style).add(this.group);
	a=this.title.getBBox();c=a.height;this.offsetWidth=a.width;this.contentGroup.attr({translateY:c})}this.titleHeight=c},renderItem:function(a){var b=this.chart,c=b.renderer,d=this.options,e=d.layout==="horizontal",f=this.symbolWidth,g=d.symbolPadding,h=this.itemStyle,i=this.itemHiddenStyle,j=this.padding,k=e?m(d.itemDistance,20):0,l=!d.rtl,o=d.width,n=d.itemMarginBottom||0,s=this.itemMarginTop,p=this.initialItemX,q=a.legendItem,r=a.series&&a.series.drawLegendSymbol?a.series:a,x=r.options,x=this.createCheckboxForItem&&
	x&&x.showCheckbox,t=d.useHTML;if(!q)a.legendGroup=c.g("legend-item").attr({zIndex:1}).add(this.scrollGroup),r.drawLegendSymbol(this,a),a.legendItem=q=c.text(d.labelFormat?Ia(d.labelFormat,a):d.labelFormatter.call(a),l?f+g:-g,this.baseline,t).css(w(a.visible?h:i)).attr({align:l?"left":"right",zIndex:2}).add(a.legendGroup),this.setItemEvents&&this.setItemEvents(a,q,t,h,i),this.colorizeItem(a,a.visible),x&&this.createCheckboxForItem(a);c=q.getBBox();f=a.checkboxOffset=d.itemWidth||a.legendItemWidth||
	f+g+c.width+k+(x?20:0);this.itemHeight=g=u(a.legendItemHeight||c.height);if(e&&this.itemX-p+f>(o||b.chartWidth-2*j-p-d.x))this.itemX=p,this.itemY+=s+this.lastLineHeight+n,this.lastLineHeight=0;this.maxItemWidth=v(this.maxItemWidth,f);this.lastItemY=s+this.itemY+n;this.lastLineHeight=v(g,this.lastLineHeight);a._legendItemPos=[this.itemX,this.itemY];e?this.itemX+=f:(this.itemY+=s+g+n,this.lastLineHeight=g);this.offsetWidth=o||v((e?this.itemX-p-k:f)+j,this.offsetWidth)},getAllItems:function(){var a=
	[];p(this.chart.series,function(b){var c=b.options;if(m(c.showInLegend,!r(c.linkedTo)?t:!1,!0))a=a.concat(b.legendItems||(c.legendType==="point"?b.data:b))});return a},render:function(){var a=this,b=a.chart,c=b.renderer,d=a.group,e,f,g,h,i=a.box,j=a.options,k=a.padding,l=j.borderWidth,o=j.backgroundColor;a.itemX=a.initialItemX;a.itemY=a.initialItemY;a.offsetWidth=0;a.lastItemY=0;if(!d)a.group=d=c.g("legend").attr({zIndex:7}).add(),a.contentGroup=c.g().attr({zIndex:1}).add(d),a.scrollGroup=c.g().add(a.contentGroup);
	a.renderTitle();e=a.getAllItems();ob(e,function(a,b){return(a.options&&a.options.legendIndex||0)-(b.options&&b.options.legendIndex||0)});j.reversed&&e.reverse();a.allItems=e;a.display=f=!!e.length;p(e,function(b){a.renderItem(b)});g=j.width||a.offsetWidth;h=a.lastItemY+a.lastLineHeight+a.titleHeight;h=a.handleOverflow(h);if(l||o){g+=k;h+=k;if(i){if(g>0&&h>0)i[i.isNew?"attr":"animate"](i.crisp({width:g,height:h})),i.isNew=!1}else a.box=i=c.rect(0,0,g,h,j.borderRadius,l||0).attr({stroke:j.borderColor,
	"stroke-width":l||0,fill:o||Q}).add(d).shadow(j.shadow),i.isNew=!0;i[f?"show":"hide"]()}a.legendWidth=g;a.legendHeight=h;p(e,function(b){a.positionItem(b)});f&&d.align(q({width:g,height:h},j),!0,"spacingBox");b.isResizing||this.positionCheckboxes()},handleOverflow:function(a){var b=this,c=this.chart,d=c.renderer,e=this.options,f=e.y,f=c.spacingBox.height+(e.verticalAlign==="top"?-f:f)-this.padding,g=e.maxHeight,h,i=this.clipRect,j=e.navigation,k=m(j.animation,!0),l=j.arrowSize||12,o=this.nav,n=this.pages,
	s,q=this.allItems;e.layout==="horizontal"&&(f/=2);g&&(f=C(f,g));n.length=0;if(a>f&&!e.useHTML){this.clipHeight=h=f-20-this.titleHeight-this.padding;this.currentPage=m(this.currentPage,1);this.fullHeight=a;p(q,function(a,b){var c=a._legendItemPos[1],d=u(a.legendItem.getBBox().height),e=n.length;if(!e||c-n[e-1]>h&&(s||c)!==n[e-1])n.push(s||c),e++;b===q.length-1&&c+d-n[e-1]>h&&n.push(c);c!==s&&(s=c)});if(!i)i=b.clipRect=d.clipRect(0,this.padding,9999,0),b.contentGroup.clip(i);i.attr({height:h});if(!o)this.nav=
	o=d.g().attr({zIndex:1}).add(this.group),this.up=d.symbol("triangle",0,0,l,l).on("click",function(){b.scroll(-1,k)}).add(o),this.pager=d.text("",15,10).css(j.style).add(o),this.down=d.symbol("triangle-down",0,0,l,l).on("click",function(){b.scroll(1,k)}).add(o);b.scroll(0);a=f}else if(o)i.attr({height:c.chartHeight}),o.hide(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0;return a},scroll:function(a,b){var c=this.pages,d=c.length,e=this.currentPage+a,f=this.clipHeight,g=this.options.navigation,
	h=g.activeColor,g=g.inactiveColor,i=this.pager,j=this.padding;e>d&&(e=d);if(e>0)b!==t&&Qa(b,this.chart),this.nav.attr({translateX:j,translateY:f+this.padding+7+this.titleHeight,visibility:"visible"}),this.up.attr({fill:e===1?g:h}).css({cursor:e===1?"default":"pointer"}),i.attr({text:e+"/"+d}),this.down.attr({x:18+this.pager.getBBox().width,fill:e===d?g:h}).css({cursor:e===d?"default":"pointer"}),c=-c[e-1]+this.initialItemY,this.scrollGroup.animate({translateY:c}),this.currentPage=e,this.positionCheckboxes(c)}};
	N=R.LegendSymbolMixin={drawRectangle:function(a,b){var c=a.options.symbolHeight||12;b.legendSymbol=this.chart.renderer.rect(0,a.baseline-5-c/2,a.symbolWidth,c,a.options.symbolRadius||0).attr({zIndex:3}).add(b.legendGroup)},drawLineMarker:function(a){var b=this.options,c=b.marker,d;d=a.symbolWidth;var e=this.chart.renderer,f=this.legendGroup,a=a.baseline-u(e.fontMetrics(a.options.itemStyle.fontSize).b*0.3),g;if(b.lineWidth){g={"stroke-width":b.lineWidth};if(b.dashStyle)g.dashstyle=b.dashStyle;this.legendLine=
	e.path(["M",0,a,"L",d,a]).attr(g).add(f)}if(c&&c.enabled!==!1)b=c.radius,this.legendSymbol=d=e.symbol(this.symbol,d/2-b,a-b,2*b,2*b).add(f),d.isMarker=!0}};(/Trident\/7\.0/.test(wa)||Ta)&&Ma(lb.prototype,"positionItem",function(a,b){var c=this,d=function(){b._legendItemPos&&a.call(c,b)};d();setTimeout(d)});Ya.prototype={init:function(a,b){var c,d=a.series;a.series=null;c=w(E,a);c.series=a.series=d;this.userOptions=a;d=c.chart;this.margin=this.splashArray("margin",d);this.spacing=this.splashArray("spacing",
	d);var e=d.events;this.bounds={h:{},v:{}};this.callback=b;this.isResizing=0;this.options=c;this.axes=[];this.series=[];this.hasCartesianSeries=d.showAxes;var f=this,g;f.index=V.length;V.push(f);ab++;d.reflow!==!1&&K(f,"load",function(){f.initReflow()});if(e)for(g in e)K(f,g,e[g]);f.xAxis=[];f.yAxis=[];f.animation=fa?!1:m(d.animation,!0);f.pointCount=0;f.counters=new Bb;f.firstRender()},initSeries:function(a){var b=this.options.chart;(b=F[a.type||b.type||b.defaultSeriesType])||ra(17,!0);b=new b;b.init(this,
	a);return b},isInsidePlot:function(a,b,c){var d=c?b:a,a=c?a:b;return d>=0&&d<=this.plotWidth&&a>=0&&a<=this.plotHeight},adjustTickAmounts:function(){this.options.chart.alignTicks!==!1&&p(this.axes,function(a){a.adjustTickAmount()});this.maxTicks=null},redraw:function(a){var b=this.axes,c=this.series,d=this.pointer,e=this.legend,f=this.isDirtyLegend,g,h,i=this.isDirtyBox,j=c.length,k=j,l=this.renderer,o=l.isHidden(),n=[];Qa(a,this);o&&this.cloneRenderTo();for(this.layOutTitles();k--;)if(a=c[k],a.options.stacking&&
	(g=!0,a.isDirty)){h=!0;break}if(h)for(k=j;k--;)if(a=c[k],a.options.stacking)a.isDirty=!0;p(c,function(a){a.isDirty&&a.options.legendType==="point"&&(f=!0)});if(f&&e.options.enabled)e.render(),this.isDirtyLegend=!1;g&&this.getStacks();if(this.hasCartesianSeries){if(!this.isResizing)this.maxTicks=null,p(b,function(a){a.setScale()});this.adjustTickAmounts();this.getMargins();p(b,function(a){a.isDirty&&(i=!0)});p(b,function(a){if(a.isDirtyExtremes)a.isDirtyExtremes=!1,n.push(function(){D(a,"afterSetExtremes",
	q(a.eventArgs,a.getExtremes()));delete a.eventArgs});(i||g)&&a.redraw()})}i&&this.drawChartBox();p(c,function(a){a.isDirty&&a.visible&&(!a.isCartesian||a.xAxis)&&a.redraw()});d&&d.reset(!0);l.draw();D(this,"redraw");o&&this.cloneRenderTo(!0);p(n,function(a){a.call()})},get:function(a){var b=this.axes,c=this.series,d,e;for(d=0;d<b.length;d++)if(b[d].options.id===a)return b[d];for(d=0;d<c.length;d++)if(c[d].options.id===a)return c[d];for(d=0;d<c.length;d++){e=c[d].points||[];for(b=0;b<e.length;b++)if(e[b].id===
	a)return e[b]}return null},getAxes:function(){var a=this,b=this.options,c=b.xAxis=qa(b.xAxis||{}),b=b.yAxis=qa(b.yAxis||{});p(c,function(a,b){a.index=b;a.isX=!0});p(b,function(a,b){a.index=b});c=c.concat(b);p(c,function(b){new la(a,b)});a.adjustTickAmounts()},getSelectedPoints:function(){var a=[];p(this.series,function(b){a=a.concat(vb(b.points||[],function(a){return a.selected}))});return a},getSelectedSeries:function(){return vb(this.series,function(a){return a.selected})},getStacks:function(){var a=
	this;p(a.yAxis,function(a){if(a.stacks&&a.hasVisibleSeries)a.oldStacks=a.stacks});p(a.series,function(b){if(b.options.stacking&&(b.visible===!0||a.options.chart.ignoreHiddenSeries===!1))b.stackKey=b.type+m(b.options.stack,"")})},setTitle:function(a,b,c){var g;var d=this,e=d.options,f;f=e.title=w(e.title,a);g=e.subtitle=w(e.subtitle,b),e=g;p([["title",a,f],["subtitle",b,e]],function(a){var b=a[0],c=d[b],e=a[1],a=a[2];c&&e&&(d[b]=c=c.destroy());a&&a.text&&!c&&(d[b]=d.renderer.text(a.text,0,0,a.useHTML).attr({align:a.align,
	"class":"highcharts-"+b,zIndex:a.zIndex||4}).css(a.style).add())});d.layOutTitles(c)},layOutTitles:function(a){var b=0,c=this.title,d=this.subtitle,e=this.options,f=e.title,e=e.subtitle,g=this.spacingBox.width-44;if(c&&(c.css({width:(f.width||g)+"px"}).align(q({y:15},f),!1,"spacingBox"),!f.floating&&!f.verticalAlign))b=c.getBBox().height;d&&(d.css({width:(e.width||g)+"px"}).align(q({y:b+f.margin},e),!1,"spacingBox"),!e.floating&&!e.verticalAlign&&(b=Ka(b+d.getBBox().height)));c=this.titleOffset!==
	b;this.titleOffset=b;if(!this.isDirtyBox&&c)this.isDirtyBox=c,this.hasRendered&&m(a,!0)&&this.isDirtyBox&&this.redraw()},getChartSize:function(){var a=this.options.chart,b=a.width,a=a.height,c=this.renderToClone||this.renderTo;if(!r(b))this.containerWidth=jb(c,"width");if(!r(a))this.containerHeight=jb(c,"height");this.chartWidth=v(0,b||this.containerWidth||600);this.chartHeight=v(0,m(a,this.containerHeight>19?this.containerHeight:400))},cloneRenderTo:function(a){var b=this.renderToClone,c=this.container;
	a?b&&(this.renderTo.appendChild(c),Pa(b),delete this.renderToClone):(c&&c.parentNode===this.renderTo&&this.renderTo.removeChild(c),this.renderToClone=b=this.renderTo.cloneNode(0),G(b,{position:"absolute",top:"-9999px",display:"block"}),b.style.setProperty&&b.style.setProperty("display","block","important"),y.body.appendChild(b),c&&b.appendChild(c))},getContainer:function(){var a,b=this.options.chart,c,d,e;this.renderTo=a=b.renderTo;e="highcharts-"+tb++;if(Fa(a))this.renderTo=a=y.getElementById(a);
	a||ra(13,!0);c=z(H(a,"data-highcharts-chart"));!isNaN(c)&&V[c]&&V[c].hasRendered&&V[c].destroy();H(a,"data-highcharts-chart",this.index);a.innerHTML="";!b.skipClone&&!a.offsetWidth&&this.cloneRenderTo();this.getChartSize();c=this.chartWidth;d=this.chartHeight;this.container=a=Y(Ja,{className:"highcharts-container"+(b.className?" "+b.className:""),id:e},q({position:"relative",overflow:"hidden",width:c+"px",height:d+"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},
	b.style),this.renderToClone||a);this._cursor=a.style.cursor;this.renderer=b.forExport?new ta(a,c,d,b.style,!0):new Za(a,c,d,b.style);fa&&this.renderer.create(this,a,c,d)},getMargins:function(){var a=this.spacing,b,c=this.legend,d=this.margin,e=this.options.legend,f=m(e.margin,20),g=e.x,h=e.y,i=e.align,j=e.verticalAlign,k=this.titleOffset;this.resetMargins();b=this.axisOffset;if(k&&!r(d[0]))this.plotTop=v(this.plotTop,k+this.options.title.margin+a[0]);if(c.display&&!e.floating)if(i==="right"){if(!r(d[1]))this.marginRight=
	v(this.marginRight,c.legendWidth-g+f+a[1])}else if(i==="left"){if(!r(d[3]))this.plotLeft=v(this.plotLeft,c.legendWidth+g+f+a[3])}else if(j==="top"){if(!r(d[0]))this.plotTop=v(this.plotTop,c.legendHeight+h+f+a[0])}else if(j==="bottom"&&!r(d[2]))this.marginBottom=v(this.marginBottom,c.legendHeight-h+f+a[2]);this.extraBottomMargin&&(this.marginBottom+=this.extraBottomMargin);this.extraTopMargin&&(this.plotTop+=this.extraTopMargin);this.hasCartesianSeries&&p(this.axes,function(a){a.getOffset()});r(d[3])||
	(this.plotLeft+=b[3]);r(d[0])||(this.plotTop+=b[0]);r(d[2])||(this.marginBottom+=b[2]);r(d[1])||(this.marginRight+=b[1]);this.setChartSize()},reflow:function(a){var b=this,c=b.options.chart,d=b.renderTo,e=c.width||jb(d,"width"),f=c.height||jb(d,"height"),c=a?a.target:I,d=function(){if(b.container)b.setSize(e,f,!1),b.hasUserSize=null};if(!b.hasUserSize&&e&&f&&(c===I||c===y)){if(e!==b.containerWidth||f!==b.containerHeight)clearTimeout(b.reflowTimeout),a?b.reflowTimeout=setTimeout(d,100):d();b.containerWidth=
	e;b.containerHeight=f}},initReflow:function(){var a=this,b=function(b){a.reflow(b)};K(I,"resize",b);K(a,"destroy",function(){W(I,"resize",b)})},setSize:function(a,b,c){var d=this,e,f,g;d.isResizing+=1;g=function(){d&&D(d,"endResize",null,function(){d.isResizing-=1})};Qa(c,d);d.oldChartHeight=d.chartHeight;d.oldChartWidth=d.chartWidth;if(r(a))d.chartWidth=e=v(0,u(a)),d.hasUserSize=!!e;if(r(b))d.chartHeight=f=v(0,u(b));(va?kb:G)(d.container,{width:e+"px",height:f+"px"},va);d.setChartSize(!0);d.renderer.setSize(e,
	f,c);d.maxTicks=null;p(d.axes,function(a){a.isDirty=!0;a.setScale()});p(d.series,function(a){a.isDirty=!0});d.isDirtyLegend=!0;d.isDirtyBox=!0;d.layOutTitles();d.getMargins();d.redraw(c);d.oldChartHeight=null;D(d,"resize");va===!1?g():setTimeout(g,va&&va.duration||500)},setChartSize:function(a){var b=this.inverted,c=this.renderer,d=this.chartWidth,e=this.chartHeight,f=this.options.chart,g=this.spacing,h=this.clipOffset,i,j,k,l;this.plotLeft=i=u(this.plotLeft);this.plotTop=j=u(this.plotTop);this.plotWidth=
	k=v(0,u(d-i-this.marginRight));this.plotHeight=l=v(0,u(e-j-this.marginBottom));this.plotSizeX=b?l:k;this.plotSizeY=b?k:l;this.plotBorderWidth=f.plotBorderWidth||0;this.spacingBox=c.spacingBox={x:g[3],y:g[0],width:d-g[3]-g[1],height:e-g[0]-g[2]};this.plotBox=c.plotBox={x:i,y:j,width:k,height:l};d=2*T(this.plotBorderWidth/2);b=Ka(v(d,h[3])/2);c=Ka(v(d,h[0])/2);this.clipBox={x:b,y:c,width:T(this.plotSizeX-v(d,h[1])/2-b),height:T(this.plotSizeY-v(d,h[2])/2-c)};a||p(this.axes,function(a){a.setAxisSize();
	a.setAxisTranslation()})},resetMargins:function(){var a=this.spacing,b=this.margin;this.plotTop=m(b[0],a[0]);this.marginRight=m(b[1],a[1]);this.marginBottom=m(b[2],a[2]);this.plotLeft=m(b[3],a[3]);this.axisOffset=[0,0,0,0];this.clipOffset=[0,0,0,0]},drawChartBox:function(){var a=this.options.chart,b=this.renderer,c=this.chartWidth,d=this.chartHeight,e=this.chartBackground,f=this.plotBackground,g=this.plotBorder,h=this.plotBGImage,i=a.borderWidth||0,j=a.backgroundColor,k=a.plotBackgroundColor,l=a.plotBackgroundImage,
	o=a.plotBorderWidth||0,n,s=this.plotLeft,m=this.plotTop,p=this.plotWidth,q=this.plotHeight,r=this.plotBox,v=this.clipRect,u=this.clipBox;n=i+(a.shadow?8:0);if(i||j)if(e)e.animate(e.crisp({width:c-n,height:d-n}));else{e={fill:j||Q};if(i)e.stroke=a.borderColor,e["stroke-width"]=i;this.chartBackground=b.rect(n/2,n/2,c-n,d-n,a.borderRadius,i).attr(e).addClass("highcharts-background").add().shadow(a.shadow)}if(k)f?f.animate(r):this.plotBackground=b.rect(s,m,p,q,0).attr({fill:k}).add().shadow(a.plotShadow);
	if(l)h?h.animate(r):this.plotBGImage=b.image(l,s,m,p,q).add();v?v.animate({width:u.width,height:u.height}):this.clipRect=b.clipRect(u);if(o)g?g.animate(g.crisp({x:s,y:m,width:p,height:q})):this.plotBorder=b.rect(s,m,p,q,0,-o).attr({stroke:a.plotBorderColor,"stroke-width":o,fill:Q,zIndex:1}).add();this.isDirtyBox=!1},propFromSeries:function(){var a=this,b=a.options.chart,c,d=a.options.series,e,f;p(["inverted","angular","polar"],function(g){c=F[b.type||b.defaultSeriesType];f=a[g]||b[g]||c&&c.prototype[g];
	for(e=d&&d.length;!f&&e--;)(c=F[d[e].type])&&c.prototype[g]&&(f=!0);a[g]=f})},linkSeries:function(){var a=this,b=a.series;p(b,function(a){a.linkedSeries.length=0});p(b,function(b){var d=b.options.linkedTo;if(Fa(d)&&(d=d===":previous"?a.series[b.index-1]:a.get(d)))d.linkedSeries.push(b),b.linkedParent=d})},renderSeries:function(){p(this.series,function(a){a.translate();a.setTooltipPoints&&a.setTooltipPoints();a.render()})},render:function(){var a=this,b=a.axes,c=a.renderer,d=a.options,e=d.labels,f=
	d.credits,g;a.setTitle();a.legend=new lb(a,d.legend);a.getStacks();p(b,function(a){a.setScale()});a.getMargins();a.maxTicks=null;p(b,function(a){a.setTickPositions(!0);a.setMaxTicks()});a.adjustTickAmounts();a.getMargins();a.drawChartBox();a.hasCartesianSeries&&p(b,function(a){a.render()});if(!a.seriesGroup)a.seriesGroup=c.g("series-group").attr({zIndex:3}).add();a.renderSeries();e.items&&p(e.items,function(b){var d=q(e.style,b.style),f=z(d.left)+a.plotLeft,g=z(d.top)+a.plotTop+12;delete d.left;delete d.top;
	c.text(b.html,f,g).attr({zIndex:2}).css(d).add()});if(f.enabled&&!a.credits)g=f.href,a.credits=c.text(f.text,0,0).on("click",function(){if(g)location.href=g}).attr({align:f.position.align,zIndex:8}).css(f.style).add().align(f.position);a.hasRendered=!0},destroy:function(){var a=this,b=a.axes,c=a.series,d=a.container,e,f=d&&d.parentNode;D(a,"destroy");V[a.index]=t;ab--;a.renderTo.removeAttribute("data-highcharts-chart");W(a);for(e=b.length;e--;)b[e]=b[e].destroy();for(e=c.length;e--;)c[e]=c[e].destroy();
	p("title,subtitle,chartBackground,plotBackground,plotBGImage,plotBorder,seriesGroup,clipRect,credits,pointer,scroller,rangeSelector,legend,resetZoomButton,tooltip,renderer".split(","),function(b){var c=a[b];c&&c.destroy&&(a[b]=c.destroy())});if(d)d.innerHTML="",W(d),f&&Pa(d);for(e in a)delete a[e]},isReadyToRender:function(){var a=this;return!aa&&I==I.top&&y.readyState!=="complete"||fa&&!I.canvg?(fa?Lb.push(function(){a.firstRender()},a.options.global.canvasToolsURL):y.attachEvent("onreadystatechange",
	function(){y.detachEvent("onreadystatechange",a.firstRender);y.readyState==="complete"&&a.firstRender()}),!1):!0},firstRender:function(){var a=this,b=a.options,c=a.callback;if(a.isReadyToRender()){a.getContainer();D(a,"init");a.resetMargins();a.setChartSize();a.propFromSeries();a.getAxes();p(b.series||[],function(b){a.initSeries(b)});a.linkSeries();D(a,"beforeRender");if(R.Pointer)a.pointer=new Wa(a,b);a.render();a.renderer.draw();c&&c.apply(a,[a]);p(a.callbacks,function(b){b.apply(a,[a])});a.cloneRenderTo(!0);
	D(a,"load")}},splashArray:function(a,b){var c=b[a],c=ca(c)?c:[c,c,c,c];return[m(b[a+"Top"],c[0]),m(b[a+"Right"],c[1]),m(b[a+"Bottom"],c[2]),m(b[a+"Left"],c[3])]}};Ya.prototype.callbacks=[];X=R.CenteredSeriesMixin={getCenter:function(){var a=this.options,b=this.chart,c=2*(a.slicedOffset||0),d,e=b.plotWidth-2*c,f=b.plotHeight-2*c,b=a.center,a=[m(b[0],"50%"),m(b[1],"50%"),a.size||"100%",a.innerSize||0],g=C(e,f),h;return Ua(a,function(a,b){h=/%$/.test(a);d=b<2||b===2&&h;return(h?[e,f,g,g][b]*z(a)/100:
	a)+(d?c:0)})}};var Ea=function(){};Ea.prototype={init:function(a,b,c){this.series=a;this.applyOptions(b,c);this.pointAttr={};if(a.options.colorByPoint&&(b=a.options.colors||a.chart.options.colors,this.color=this.color||b[a.colorCounter++],a.colorCounter===b.length))a.colorCounter=0;a.chart.pointCount++;return this},applyOptions:function(a,b){var c=this.series,d=c.pointValKey,a=Ea.prototype.optionsToObject.call(this,a);q(this,a);this.options=this.options?q(this.options,a):a;if(d)this.y=this[d];if(this.x===
	t&&c)this.x=b===t?c.autoIncrement():b;return this},optionsToObject:function(a){var b={},c=this.series,d=c.pointArrayMap||["y"],e=d.length,f=0,g=0;if(typeof a==="number"||a===null)b[d[0]]=a;else if(La(a)){if(a.length>e){c=typeof a[0];if(c==="string")b.name=a[0];else if(c==="number")b.x=a[0];f++}for(;g<e;)b[d[g++]]=a[f++]}else if(typeof a==="object"){b=a;if(a.dataLabels)c._hasPointLabels=!0;if(a.marker)c._hasPointMarkers=!0}return b},destroy:function(){var a=this.series.chart,b=a.hoverPoints,c;a.pointCount--;
	if(b&&(this.setState(),ja(b,this),!b.length))a.hoverPoints=null;if(this===a.hoverPoint)this.onMouseOut();if(this.graphic||this.dataLabel)W(this),this.destroyElements();this.legendItem&&a.legend.destroyItem(this);for(c in this)this[c]=null},destroyElements:function(){for(var a="graphic,dataLabel,dataLabelUpper,group,connector,shadowGroup".split(","),b,c=6;c--;)b=a[c],this[b]&&(this[b]=this[b].destroy())},getLabelConfig:function(){return{x:this.category,y:this.y,key:this.name||this.category,series:this.series,
	point:this,percentage:this.percentage,total:this.total||this.stackTotal}},tooltipFormatter:function(a){var b=this.series,c=b.tooltipOptions,d=m(c.valueDecimals,""),e=c.valuePrefix||"",f=c.valueSuffix||"";p(b.pointArrayMap||["y"],function(b){b="{point."+b;if(e||f)a=a.replace(b+"}",e+b+"}"+f);a=a.replace(b+"}",b+":,."+d+"f}")});return Ia(a,{point:this,series:this.series})},firePointEvent:function(a,b,c){var d=this,e=this.series.options;(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&
	this.importEvents();a==="click"&&e.allowPointSelect&&(c=function(a){d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});D(this,a,b,c)}};var O=function(){};O.prototype={isCartesian:!0,type:"line",pointClass:Ea,sorted:!0,requireSorting:!0,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},axisTypes:["xAxis","yAxis"],colorCounter:0,parallelArrays:["x","y"],init:function(a,b){var c=this,d,e,f=a.series,g=function(a,b){return m(a.options.index,a._i)-m(b.options.index,
	b._i)};c.chart=a;c.options=b=c.setOptions(b);c.linkedSeries=[];c.bindAxes();q(c,{name:b.name,state:"",pointAttr:{},visible:b.visible!==!1,selected:b.selected===!0});if(fa)b.animation=!1;e=b.events;for(d in e)K(c,d,e[d]);if(e&&e.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;c.getColor();c.getSymbol();p(c.parallelArrays,function(a){c[a+"Data"]=[]});c.setData(b.data,!1);if(c.isCartesian)a.hasCartesianSeries=!0;f.push(c);c._i=f.length-1;ob(f,g);this.yAxis&&
	ob(this.yAxis.series,g);p(f,function(a,b){a.index=b;a.name=a.name||"Series "+(b+1)})},bindAxes:function(){var a=this,b=a.options,c=a.chart,d;p(a.axisTypes||[],function(e){p(c[e],function(c){d=c.options;if(b[e]===d.index||b[e]!==t&&b[e]===d.id||b[e]===t&&d.index===0)c.series.push(a),a[e]=c,c.isDirty=!0});!a[e]&&a.optionalAxis!==e&&ra(18,!0)})},updateParallelArrays:function(a,b){var c=a.series,d=arguments;p(c.parallelArrays,typeof b==="number"?function(d){var f=d==="y"&&c.toYData?c.toYData(a):a[d];
	c[d+"Data"][b]=f}:function(a){Array.prototype[b].apply(c[a+"Data"],Array.prototype.slice.call(d,2))})},autoIncrement:function(){var a=this.options,b=this.xIncrement,b=m(b,a.pointStart,0);this.pointInterval=m(this.pointInterval,a.pointInterval,1);this.xIncrement=b+this.pointInterval;return b},getSegments:function(){var a=-1,b=[],c,d=this.points,e=d.length;if(e)if(this.options.connectNulls){for(c=e;c--;)d[c].y===null&&d.splice(c,1);d.length&&(b=[d])}else p(d,function(c,g){c.y===null?(g>a+1&&b.push(d.slice(a+
	1,g)),a=g):g===e-1&&b.push(d.slice(a+1,g+1))});this.segments=b},setOptions:function(a){var b=this.chart,c=b.options.plotOptions,b=b.userOptions||{},d=b.plotOptions||{},e=c[this.type];this.userOptions=a;c=w(e,c.series,a);this.tooltipOptions=w(E.tooltip,E.plotOptions[this.type].tooltip,b.tooltip,d.series&&d.series.tooltip,d[this.type]&&d[this.type].tooltip,a.tooltip);e.marker===null&&delete c.marker;return c},getColor:function(){var a=this.options,b=this.userOptions,c=this.chart.options.colors,d=this.chart.counters,
	e;e=a.color||ba[this.type].color;if(!e&&!a.colorByPoint)r(b._colorIndex)?a=b._colorIndex:(b._colorIndex=d.color,a=d.color++),e=c[a];this.color=e;d.wrapColor(c.length)},getSymbol:function(){var a=this.userOptions,b=this.options.marker,c=this.chart,d=c.options.symbols,c=c.counters;this.symbol=b.symbol;if(!this.symbol)r(a._symbolIndex)?a=a._symbolIndex:(a._symbolIndex=c.symbol,a=c.symbol++),this.symbol=d[a];if(/^url/.test(this.symbol))b.radius=0;c.wrapSymbol(d.length)},drawLegendSymbol:N.drawLineMarker,
	setData:function(a,b,c,d){var e=this,f=e.points,g=f&&f.length||0,h,i=e.options,j=e.chart,k=null,l=e.xAxis,o=l&&!!l.categories,n=e.tooltipPoints,s=i.turboThreshold,q=this.xData,r=this.yData,v=(h=e.pointArrayMap)&&h.length,a=a||[];h=a.length;b=m(b,!0);if(d!==!1&&h&&g===h&&!e.cropped&&!e.hasGroupedData)p(a,function(a,b){f[b].update(a,!1)});else{e.xIncrement=null;e.pointRange=o?1:i.pointRange;e.colorCounter=0;p(this.parallelArrays,function(a){e[a+"Data"].length=0});if(s&&h>s){for(c=0;k===null&&c<h;)k=
	a[c],c++;if(ha(k)){o=m(i.pointStart,0);i=m(i.pointInterval,1);for(c=0;c<h;c++)q[c]=o,r[c]=a[c],o+=i;e.xIncrement=o}else if(La(k))if(v)for(c=0;c<h;c++)i=a[c],q[c]=i[0],r[c]=i.slice(1,v+1);else for(c=0;c<h;c++)i=a[c],q[c]=i[0],r[c]=i[1];else ra(12)}else for(c=0;c<h;c++)if(a[c]!==t&&(i={series:e},e.pointClass.prototype.applyOptions.apply(i,[a[c]]),e.updateParallelArrays(i,c),o&&i.name))l.names[i.x]=i.name;Fa(r[0])&&ra(14,!0);e.data=[];e.options.data=a;for(c=g;c--;)f[c]&&f[c].destroy&&f[c].destroy();
	if(n)n.length=0;if(l)l.minRange=l.userMinRange;e.isDirty=e.isDirtyData=j.isDirtyBox=!0;c=!1}b&&j.redraw(c)},processData:function(a){var b=this.xData,c=this.yData,d=b.length,e;e=0;var f,g,h=this.xAxis,i=this.options,j=i.cropThreshold,k=0,l=this.isCartesian,o,n;if(l&&!this.isDirty&&!h.isDirty&&!this.yAxis.isDirty&&!a)return!1;if(l&&this.sorted&&(!j||d>j||this.forceCrop))if(o=h.min,n=h.max,b[d-1]<o||b[0]>n)b=[],c=[];else if(b[0]<o||b[d-1]>n)e=this.cropData(this.xData,this.yData,o,n),b=e.xData,c=e.yData,
	e=e.start,f=!0,k=b.length;for(d=b.length-1;d>=0;d--)a=b[d]-b[d-1],!f&&b[d]>o&&b[d]<n&&k++,a>0&&(g===t||a<g)?g=a:a<0&&this.requireSorting&&ra(15);this.cropped=f;this.cropStart=e;this.processedXData=b;this.processedYData=c;this.activePointCount=k;if(i.pointRange===null)this.pointRange=g||1;this.closestPointRange=g},cropData:function(a,b,c,d){var e=a.length,f=0,g=e,h=m(this.cropShoulder,1),i;for(i=0;i<e;i++)if(a[i]>=c){f=v(0,i-h);break}for(;i<e;i++)if(a[i]>d){g=i+h;break}return{xData:a.slice(f,g),yData:b.slice(f,
	g),start:f,end:g}},generatePoints:function(){var a=this.options.data,b=this.data,c,d=this.processedXData,e=this.processedYData,f=this.pointClass,g=d.length,h=this.cropStart||0,i,j=this.hasGroupedData,k,l=[],o;if(!b&&!j)b=[],b.length=a.length,b=this.data=b;for(o=0;o<g;o++)i=h+o,j?l[o]=(new f).init(this,[d[o]].concat(qa(e[o]))):(b[i]?k=b[i]:a[i]!==t&&(b[i]=k=(new f).init(this,a[i],d[o])),l[o]=k);if(b&&(g!==(c=b.length)||j))for(o=0;o<c;o++)if(o===h&&!j&&(o+=g),b[o])b[o].destroyElements(),b[o].plotX=
	t;this.data=b;this.points=l},getExtremes:function(a){var b=this.yAxis,c=this.processedXData,d,e=[],f=0;d=this.xAxis.getExtremes();var g=d.min,h=d.max,i,j,k,l,a=a||this.stackedYData||this.processedYData;d=a.length;for(l=0;l<d;l++)if(j=c[l],k=a[l],i=k!==null&&k!==t&&(!b.isLog||k.length||k>0),j=this.getExtremesFromAll||this.cropped||(c[l+1]||j)>=g&&(c[l-1]||j)<=h,i&&j)if(i=k.length)for(;i--;)k[i]!==null&&(e[f++]=k[i]);else e[f++]=k;this.dataMin=m(void 0,Na(e));this.dataMax=m(void 0,Ba(e))},translate:function(){this.processedXData||
	this.processData();this.generatePoints();for(var a=this.options,b=a.stacking,c=this.xAxis,d=c.categories,e=this.yAxis,f=this.points,g=f.length,h=!!this.modifyValue,i=a.pointPlacement,j=i==="between"||ha(i),k=a.threshold,a=0;a<g;a++){var l=f[a],o=l.x,n=l.y,s=l.low,p=b&&e.stacks[(this.negStacks&&n<k?"-":"")+this.stackKey];if(e.isLog&&n<=0)l.y=n=null;l.plotX=c.translate(o,0,0,0,1,i,this.type==="flags");if(b&&this.visible&&p&&p[o])p=p[o],n=p.points[this.index+","+a],s=n[0],n=n[1],s===0&&(s=m(k,e.min)),
	e.isLog&&s<=0&&(s=null),l.total=l.stackTotal=p.total,l.percentage=p.total&&l.y/p.total*100,l.stackY=n,p.setOffset(this.pointXOffset||0,this.barW||0);l.yBottom=r(s)?e.translate(s,0,1,0,1):null;h&&(n=this.modifyValue(n,l));l.plotY=typeof n==="number"&&n!==Infinity?e.translate(n,0,1,0,1):t;l.clientX=j?c.translate(o,0,0,0,1):l.plotX;l.negative=l.y<(k||0);l.category=d&&d[l.x]!==t?d[l.x]:l.x}this.getSegments()},animate:function(a){var b=this.chart,c=b.renderer,d;d=this.options.animation;var e=this.clipBox||
	b.clipBox,f=b.inverted,g;if(d&&!ca(d))d=ba[this.type].animation;g=["_sharedClip",d.duration,d.easing,e.height].join(",");a?(a=b[g],d=b[g+"m"],a||(b[g]=a=c.clipRect(q(e,{width:0})),b[g+"m"]=d=c.clipRect(-99,f?-b.plotLeft:-b.plotTop,99,f?b.chartWidth:b.chartHeight)),this.group.clip(a),this.markerGroup.clip(d),this.sharedClipKey=g):((a=b[g])&&a.animate({width:b.plotSizeX},d),b[g+"m"]&&b[g+"m"].animate({width:b.plotSizeX+99},d),this.animate=null)},afterAnimate:function(){var a=this.chart,b=this.sharedClipKey,
	c=this.group,d=this.clipBox;if(c&&this.options.clip!==!1){if(!b||!d)c.clip(d?a.renderer.clipRect(d):a.clipRect);this.markerGroup.clip()}D(this,"afterAnimate");setTimeout(function(){b&&a[b]&&(d||(a[b]=a[b].destroy()),a[b+"m"]&&(a[b+"m"]=a[b+"m"].destroy()))},100)},drawPoints:function(){var a,b=this.points,c=this.chart,d,e,f,g,h,i,j,k;d=this.options.marker;var l=this.pointAttr[""],o,n=this.markerGroup,s=m(d.enabled,this.activePointCount<0.5*this.xAxis.len/d.radius);if(d.enabled!==!1||this._hasPointMarkers)for(f=
	b.length;f--;)if(g=b[f],d=T(g.plotX),e=g.plotY,k=g.graphic,i=g.marker||{},a=s&&i.enabled===t||i.enabled,o=c.isInsidePlot(u(d),e,c.inverted),a&&e!==t&&!isNaN(e)&&g.y!==null)if(a=g.pointAttr[g.selected?"select":""]||l,h=a.r,i=m(i.symbol,this.symbol),j=i.indexOf("url")===0,k)k[o?"show":"hide"](!0).animate(q({x:d-h,y:e-h},k.symbolName?{width:2*h,height:2*h}:{}));else{if(o&&(h>0||j))g.graphic=c.renderer.symbol(i,d-h,e-h,2*h,2*h).attr(a).add(n)}else if(k)g.graphic=k.destroy()},convertAttribs:function(a,
	b,c,d){var e=this.pointAttrToOptions,f,g,h={},a=a||{},b=b||{},c=c||{},d=d||{};for(f in e)g=e[f],h[f]=m(a[g],b[f],c[f],d[f]);return h},getAttribs:function(){var a=this,b=a.options,c=ba[a.type].marker?b.marker:b,d=c.states,e=d.hover,f,g=a.color;f={stroke:g,fill:g};var h=a.points||[],i,j=[],k,l=a.pointAttrToOptions;k=a.hasPointSpecificOptions;var o=b.negativeColor,n=c.lineColor,s=c.fillColor;i=b.turboThreshold;var m;b.marker?(e.radius=e.radius||c.radius+2,e.lineWidth=e.lineWidth||c.lineWidth+1):e.color=
	e.color||ya(e.color||g).brighten(e.brightness).get();j[""]=a.convertAttribs(c,f);p(["hover","select"],function(b){j[b]=a.convertAttribs(d[b],j[""])});a.pointAttr=j;g=h.length;if(!i||g<i||k)for(;g--;){i=h[g];if((c=i.options&&i.options.marker||i.options)&&c.enabled===!1)c.radius=0;if(i.negative&&o)i.color=i.fillColor=o;k=b.colorByPoint||i.color;if(i.options)for(m in l)r(c[l[m]])&&(k=!0);if(k){c=c||{};k=[];d=c.states||{};f=d.hover=d.hover||{};if(!b.marker)f.color=f.color||!i.options.color&&e.color||
	ya(i.color).brighten(f.brightness||e.brightness).get();f={color:i.color};if(!s)f.fillColor=i.color;if(!n)f.lineColor=i.color;k[""]=a.convertAttribs(q(f,c),j[""]);k.hover=a.convertAttribs(d.hover,j.hover,k[""]);k.select=a.convertAttribs(d.select,j.select,k[""])}else k=j;i.pointAttr=k}},destroy:function(){var a=this,b=a.chart,c=/AppleWebKit\/533/.test(wa),d,e,f=a.data||[],g,h,i;D(a,"destroy");W(a);p(a.axisTypes||[],function(b){if(i=a[b])ja(i.series,a),i.isDirty=i.forceRedraw=!0});a.legendItem&&a.chart.legend.destroyItem(a);
	for(e=f.length;e--;)(g=f[e])&&g.destroy&&g.destroy();a.points=null;clearTimeout(a.animationTimeout);p("area,graph,dataLabelsGroup,group,markerGroup,tracker,graphNeg,areaNeg,posClip,negClip".split(","),function(b){a[b]&&(d=c&&b==="group"?"hide":"destroy",a[b][d]())});if(b.hoverSeries===a)b.hoverSeries=null;ja(b.series,a);for(h in a)delete a[h]},getSegmentPath:function(a){var b=this,c=[],d=b.options.step;p(a,function(e,f){var g=e.plotX,h=e.plotY,i;b.getPointSpline?c.push.apply(c,b.getPointSpline(a,
	e,f)):(c.push(f?"L":"M"),d&&f&&(i=a[f-1],d==="right"?c.push(i.plotX,h):d==="center"?c.push((i.plotX+g)/2,i.plotY,(i.plotX+g)/2,h):c.push(g,i.plotY)),c.push(e.plotX,e.plotY))});return c},getGraphPath:function(){var a=this,b=[],c,d=[];p(a.segments,function(e){c=a.getSegmentPath(e);e.length>1?b=b.concat(c):d.push(e[0])});a.singlePoints=d;return a.graphPath=b},drawGraph:function(){var a=this,b=this.options,c=[["graph",b.lineColor||this.color]],d=b.lineWidth,e=b.dashStyle,f=b.linecap!=="square",g=this.getGraphPath(),
	h=b.negativeColor;h&&c.push(["graphNeg",h]);p(c,function(c,h){var k=c[0],l=a[k];if(l)bb(l),l.animate({d:g});else if(d&&g.length)l={stroke:c[1],"stroke-width":d,fill:Q,zIndex:1},e?l.dashstyle=e:f&&(l["stroke-linecap"]=l["stroke-linejoin"]="round"),a[k]=a.chart.renderer.path(g).attr(l).add(a.group).shadow(!h&&b.shadow)})},clipNeg:function(){var a=this.options,b=this.chart,c=b.renderer,d=a.negativeColor||a.negativeFillColor,e,f=this.graph,g=this.area,h=this.posClip,i=this.negClip;e=b.chartWidth;var j=
	b.chartHeight,k=v(e,j),l=this.yAxis;if(d&&(f||g)){d=u(l.toPixels(a.threshold||0,!0));d<0&&(k-=d);a={x:0,y:0,width:k,height:d};k={x:0,y:d,width:k,height:k};if(b.inverted)a.height=k.y=b.plotWidth-d,c.isVML&&(a={x:b.plotWidth-d-b.plotLeft,y:0,width:e,height:j},k={x:d+b.plotLeft-e,y:0,width:b.plotLeft+d,height:e});l.reversed?(b=k,e=a):(b=a,e=k);h?(h.animate(b),i.animate(e)):(this.posClip=h=c.clipRect(b),this.negClip=i=c.clipRect(e),f&&this.graphNeg&&(f.clip(h),this.graphNeg.clip(i)),g&&(g.clip(h),this.areaNeg.clip(i)))}},
	invertGroups:function(){function a(){var a={width:b.yAxis.len,height:b.xAxis.len};p(["group","markerGroup"],function(c){b[c]&&b[c].attr(a).invert()})}var b=this,c=b.chart;if(b.xAxis)K(c,"resize",a),K(b,"destroy",function(){W(c,"resize",a)}),a(),b.invertGroups=a},plotGroup:function(a,b,c,d,e){var f=this[a],g=!f;g&&(this[a]=f=this.chart.renderer.g(b).attr({visibility:c,zIndex:d||0.1}).add(e));f[g?"attr":"animate"](this.getPlotBox());return f},getPlotBox:function(){var a=this.chart,b=this.xAxis,c=this.yAxis;
	if(a.inverted)b=c,c=this.xAxis;return{translateX:b?b.left:a.plotLeft,translateY:c?c.top:a.plotTop,scaleX:1,scaleY:1}},render:function(){var a=this,b=a.chart,c,d=a.options,e=(c=d.animation)&&!!a.animate&&b.renderer.isSVG&&m(c.duration,500)||0,f=a.visible?"visible":"hidden",g=d.zIndex,h=a.hasRendered,i=b.seriesGroup;c=a.plotGroup("group","series",f,g,i);a.markerGroup=a.plotGroup("markerGroup","markers",f,g,i);e&&a.animate(!0);a.getAttribs();c.inverted=a.isCartesian?b.inverted:!1;a.drawGraph&&(a.drawGraph(),
	a.clipNeg());a.drawDataLabels&&a.drawDataLabels();a.visible&&a.drawPoints();a.drawTracker&&a.options.enableMouseTracking!==!1&&a.drawTracker();b.inverted&&a.invertGroups();d.clip!==!1&&!a.sharedClipKey&&!h&&c.clip(b.clipRect);e&&a.animate();if(!h)e?a.animationTimeout=setTimeout(function(){a.afterAnimate()},e):a.afterAnimate();a.isDirty=a.isDirtyData=!1;a.hasRendered=!0},redraw:function(){var a=this.chart,b=this.isDirtyData,c=this.group,d=this.xAxis,e=this.yAxis;c&&(a.inverted&&c.attr({width:a.plotWidth,
	height:a.plotHeight}),c.animate({translateX:m(d&&d.left,a.plotLeft),translateY:m(e&&e.top,a.plotTop)}));this.translate();this.setTooltipPoints&&this.setTooltipPoints(!0);this.render();b&&D(this,"updatedData")}};Hb.prototype={destroy:function(){Oa(this,this.axis)},render:function(a){var b=this.options,c=b.format,c=c?Ia(c,this):b.formatter.call(this);this.label?this.label.attr({text:c,visibility:"hidden"}):this.label=this.axis.chart.renderer.text(c,null,null,b.useHTML).css(b.style).attr({align:this.textAlign,
	rotation:b.rotation,visibility:"hidden"}).add(a)},setOffset:function(a,b){var c=this.axis,d=c.chart,e=d.inverted,f=this.isNegative,g=c.translate(c.usePercentage?100:this.total,0,0,0,1),c=c.translate(0),c=M(g-c),h=d.xAxis[0].translate(this.x)+a,i=d.plotHeight,f={x:e?f?g:g-c:h,y:e?i-h-b:f?i-g-c:i-g,width:e?c:b,height:e?b:c};if(e=this.label)e.align(this.alignOptions,null,f),f=e.alignAttr,e[this.options.crop===!1||d.isInsidePlot(f.x,f.y)?"show":"hide"](!0)}};la.prototype.buildStacks=function(){var a=
	this.series,b=m(this.options.reversedStacks,!0),c=a.length;if(!this.isXAxis){for(this.usePercentage=!1;c--;)a[b?c:a.length-c-1].setStackedPoints();if(this.usePercentage)for(c=0;c<a.length;c++)a[c].setPercentStacks()}};la.prototype.renderStackTotals=function(){var a=this.chart,b=a.renderer,c=this.stacks,d,e,f=this.stackTotalGroup;if(!f)this.stackTotalGroup=f=b.g("stack-labels").attr({visibility:"visible",zIndex:6}).add();f.translate(a.plotLeft,a.plotTop);for(d in c)for(e in a=c[d],a)a[e].render(f)};
	O.prototype.setStackedPoints=function(){if(this.options.stacking&&!(this.visible!==!0&&this.chart.options.chart.ignoreHiddenSeries!==!1)){var a=this.processedXData,b=this.processedYData,c=[],d=b.length,e=this.options,f=e.threshold,g=e.stack,e=e.stacking,h=this.stackKey,i="-"+h,j=this.negStacks,k=this.yAxis,l=k.stacks,o=k.oldStacks,n,m,p,q,r,u;for(q=0;q<d;q++){r=a[q];u=b[q];p=this.index+","+q;m=(n=j&&u<f)?i:h;l[m]||(l[m]={});if(!l[m][r])o[m]&&o[m][r]?(l[m][r]=o[m][r],l[m][r].total=null):l[m][r]=new Hb(k,
	k.options.stackLabels,n,r,g);m=l[m][r];m.points[p]=[m.cum||0];e==="percent"?(n=n?h:i,j&&l[n]&&l[n][r]?(n=l[n][r],m.total=n.total=v(n.total,m.total)+M(u)||0):m.total=da(m.total+(M(u)||0))):m.total=da(m.total+(u||0));m.cum=(m.cum||0)+(u||0);m.points[p].push(m.cum);c[q]=m.cum}if(e==="percent")k.usePercentage=!0;this.stackedYData=c;k.oldStacks={}}};O.prototype.setPercentStacks=function(){var a=this,b=a.stackKey,c=a.yAxis.stacks,d=a.processedXData;p([b,"-"+b],function(b){var e;for(var f=d.length,g,h;f--;)if(g=
	d[f],e=(h=c[b]&&c[b][g])&&h.points[a.index+","+f],g=e)h=h.total?100/h.total:0,g[0]=da(g[0]*h),g[1]=da(g[1]*h),a.stackedYData[f]=g[1]})};q(Ya.prototype,{addSeries:function(a,b,c){var d,e=this;a&&(b=m(b,!0),D(e,"addSeries",{options:a},function(){d=e.initSeries(a);e.isDirtyLegend=!0;e.linkSeries();b&&e.redraw(c)}));return d},addAxis:function(a,b,c,d){var e=b?"xAxis":"yAxis",f=this.options;new la(this,w(a,{index:this[e].length,isX:b}));f[e]=qa(f[e]||{});f[e].push(a);m(c,!0)&&this.redraw(d)},showLoading:function(a){var b=
	this.options,c=this.loadingDiv,d=b.loading;if(!c)this.loadingDiv=c=Y(Ja,{className:"highcharts-loading"},q(d.style,{zIndex:10,display:Q}),this.container),this.loadingSpan=Y("span",null,d.labelStyle,c);this.loadingSpan.innerHTML=a||b.lang.loading;if(!this.loadingShown)G(c,{opacity:0,display:"",left:this.plotLeft+"px",top:this.plotTop+"px",width:this.plotWidth+"px",height:this.plotHeight+"px"}),kb(c,{opacity:d.style.opacity},{duration:d.showDuration||0}),this.loadingShown=!0},hideLoading:function(){var a=
	this.options,b=this.loadingDiv;b&&kb(b,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){G(b,{display:Q})}});this.loadingShown=!1}});q(Ea.prototype,{update:function(a,b,c){var d=this,e=d.series,f=d.graphic,g,h=e.data,i=e.chart,j=e.options,b=m(b,!0);d.firePointEvent("update",{options:a},function(){d.applyOptions(a);if(ca(a)){e.getAttribs();if(f)a&&a.marker&&a.marker.symbol?d.graphic=f.destroy():f.attr(d.pointAttr[d.state||""]);if(a&&a.dataLabels&&d.dataLabel)d.dataLabel=d.dataLabel.destroy()}g=
	Da(d,h);e.updateParallelArrays(d,g);j.data[g]=d.options;e.isDirty=e.isDirtyData=!0;if(!e.fixedBox&&e.hasCartesianSeries)i.isDirtyBox=!0;j.legendType==="point"&&i.legend.destroyItem(d);b&&i.redraw(c)})},remove:function(a,b){var c=this,d=c.series,e=d.points,f=d.chart,g,h=d.data;Qa(b,f);a=m(a,!0);c.firePointEvent("remove",null,function(){g=Da(c,h);h.length===e.length&&e.splice(g,1);h.splice(g,1);d.options.data.splice(g,1);d.updateParallelArrays(c,"splice",g,1);c.destroy();d.isDirty=!0;d.isDirtyData=
	!0;a&&f.redraw()})}});q(O.prototype,{addPoint:function(a,b,c,d){var e=this.options,f=this.data,g=this.graph,h=this.area,i=this.chart,j=this.xAxis&&this.xAxis.names,k=g&&g.shift||0,l=e.data,o,n=this.xData;Qa(d,i);c&&p([g,h,this.graphNeg,this.areaNeg],function(a){if(a)a.shift=k+1});if(h)h.isArea=!0;b=m(b,!0);d={series:this};this.pointClass.prototype.applyOptions.apply(d,[a]);g=d.x;h=n.length;if(this.requireSorting&&g<n[h-1])for(o=!0;h&&n[h-1]>g;)h--;this.updateParallelArrays(d,"splice",h,0,0);this.updateParallelArrays(d,
	h);if(j)j[g]=d.name;l.splice(h,0,a);o&&(this.data.splice(h,0,null),this.processData());e.legendType==="point"&&this.generatePoints();c&&(f[0]&&f[0].remove?f[0].remove(!1):(f.shift(),this.updateParallelArrays(d,"shift"),l.shift()));this.isDirtyData=this.isDirty=!0;b&&(this.getAttribs(),i.redraw())},remove:function(a,b){var c=this,d=c.chart,a=m(a,!0);if(!c.isRemoving)c.isRemoving=!0,D(c,"remove",null,function(){c.destroy();d.isDirtyLegend=d.isDirtyBox=!0;d.linkSeries();a&&d.redraw(b)});c.isRemoving=
	!1},update:function(a,b){var c=this.chart,d=this.type,e=F[d].prototype,f,a=w(this.userOptions,{animation:!1,index:this.index,pointStart:this.xData[0]},{data:this.options.data},a);this.remove(!1);for(f in e)e.hasOwnProperty(f)&&(this[f]=t);q(this,F[a.type||d].prototype);this.init(c,a);m(b,!0)&&c.redraw(!1)}});q(la.prototype,{update:function(a,b){var c=this.chart,a=c.options[this.coll][this.options.index]=w(this.userOptions,a);this.destroy(!0);this._addedPlotLB=t;this.init(c,q(a,{events:t}));c.isDirtyBox=
	!0;m(b,!0)&&c.redraw()},remove:function(a){for(var b=this.chart,c=this.coll,d=this.series,e=d.length;e--;)d[e]&&d[e].remove(!1);ja(b.axes,this);ja(b[c],this);b.options[c].splice(this.options.index,1);p(b[c],function(a,b){a.options.index=b});this.destroy();b.isDirtyBox=!0;m(a,!0)&&b.redraw()},setTitle:function(a,b){this.update({title:a},b)},setCategories:function(a,b){this.update({categories:a},b)}});ga=ka(O);F.line=ga;ba.area=w(S,{threshold:0});var pa=ka(O,{type:"area",getSegments:function(){var a=
	[],b=[],c=[],d=this.xAxis,e=this.yAxis,f=e.stacks[this.stackKey],g={},h,i,j=this.points,k=this.options.connectNulls,l,o,n;if(this.options.stacking&&!this.cropped){for(o=0;o<j.length;o++)g[j[o].x]=j[o];for(n in f)f[n].total!==null&&c.push(+n);c.sort(function(a,b){return a-b});p(c,function(a){if(!k||g[a]&&g[a].y!==null)g[a]?b.push(g[a]):(h=d.translate(a),l=f[a].percent?f[a].total?f[a].cum*100/f[a].total:0:f[a].cum,i=e.toPixels(l,!0),b.push({y:null,plotX:h,clientX:h,plotY:i,yBottom:i,onMouseOver:sa}))});
	b.length&&a.push(b)}else O.prototype.getSegments.call(this),a=this.segments;this.segments=a},getSegmentPath:function(a){var b=O.prototype.getSegmentPath.call(this,a),c=[].concat(b),d,e=this.options;d=b.length;var f=this.yAxis.getThreshold(e.threshold),g;d===3&&c.push("L",b[1],b[2]);if(e.stacking&&!this.closedStacks)for(d=a.length-1;d>=0;d--)g=m(a[d].yBottom,f),d<a.length-1&&e.step&&c.push(a[d+1].plotX,g),c.push(a[d].plotX,g);else this.closeSegment(c,a,f);this.areaPath=this.areaPath.concat(c);return b},
	closeSegment:function(a,b,c){a.push("L",b[b.length-1].plotX,c,"L",b[0].plotX,c)},drawGraph:function(){this.areaPath=[];O.prototype.drawGraph.apply(this);var a=this,b=this.areaPath,c=this.options,d=c.negativeColor,e=c.negativeFillColor,f=[["area",this.color,c.fillColor]];(d||e)&&f.push(["areaNeg",d,e]);p(f,function(d){var e=d[0],f=a[e];f?f.animate({d:b}):a[e]=a.chart.renderer.path(b).attr({fill:m(d[2],ya(d[1]).setOpacity(m(c.fillOpacity,0.75)).get()),zIndex:0}).add(a.group)})},drawLegendSymbol:N.drawRectangle});
	F.area=pa;ba.spline=w(S);ga=ka(O,{type:"spline",getPointSpline:function(a,b,c){var d=b.plotX,e=b.plotY,f=a[c-1],g=a[c+1],h,i,j,k;if(f&&g){a=f.plotY;j=g.plotX;var g=g.plotY,l;h=(1.5*d+f.plotX)/2.5;i=(1.5*e+a)/2.5;j=(1.5*d+j)/2.5;k=(1.5*e+g)/2.5;l=(k-i)*(j-d)/(j-h)+e-k;i+=l;k+=l;i>a&&i>e?(i=v(a,e),k=2*e-i):i<a&&i<e&&(i=C(a,e),k=2*e-i);k>g&&k>e?(k=v(g,e),i=2*e-k):k<g&&k<e&&(k=C(g,e),i=2*e-k);b.rightContX=j;b.rightContY=k}c?(b=["C",f.rightContX||f.plotX,f.rightContY||f.plotY,h||d,i||e,d,e],f.rightContX=
	f.rightContY=null):b=["M",d,e];return b}});F.spline=ga;ba.areaspline=w(ba.area);pa=pa.prototype;ga=ka(ga,{type:"areaspline",closedStacks:!0,getSegmentPath:pa.getSegmentPath,closeSegment:pa.closeSegment,drawGraph:pa.drawGraph,drawLegendSymbol:N.drawRectangle});F.areaspline=ga;ba.column=w(S,{borderColor:"#FFFFFF",borderRadius:0,groupPadding:0.2,marker:null,pointPadding:0.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{brightness:0.1,shadow:!1,halo:!1},select:{color:"#C0C0C0",borderColor:"#000000",
	shadow:!1}},dataLabels:{align:null,verticalAlign:null,y:null},stickyTracking:!1,tooltip:{distance:6},threshold:0});ga=ka(O,{type:"column",pointAttrToOptions:{stroke:"borderColor",fill:"color",r:"borderRadius"},cropShoulder:0,trackerGroups:["group","dataLabelsGroup"],negStacks:!0,init:function(){O.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasRendered&&p(b.series,function(b){if(b.type===a.type)b.isDirty=!0})},getColumnMetrics:function(){var a=this,b=a.options,c=a.xAxis,d=a.yAxis,e=
	c.reversed,f,g={},h,i=0;b.grouping===!1?i=1:p(a.chart.series,function(b){var c=b.options,e=b.yAxis;if(b.type===a.type&&b.visible&&d.len===e.len&&d.pos===e.pos)c.stacking?(f=b.stackKey,g[f]===t&&(g[f]=i++),h=g[f]):c.grouping!==!1&&(h=i++),b.columnIndex=h});var c=C(M(c.transA)*(c.ordinalSlope||b.pointRange||c.closestPointRange||c.tickInterval||1),c.len),j=c*b.groupPadding,k=(c-2*j)/i,l=b.pointWidth,b=r(l)?(k-l)/2:k*b.pointPadding,l=m(l,k-2*b);return a.columnMetrics={width:l,offset:b+(j+((e?i-(a.columnIndex||
	0):a.columnIndex)||0)*k-c/2)*(e?-1:1)}},translate:function(){var a=this,b=a.chart,c=a.options,d=a.borderWidth=m(c.borderWidth,a.activePointCount>0.5*a.xAxis.len?0:1),e=a.yAxis,f=a.translatedThreshold=e.getThreshold(c.threshold),g=m(c.minPointLength,5),c=a.getColumnMetrics(),h=c.width,i=a.barW=Ka(v(h,1+2*d)),j=a.pointXOffset=c.offset,k=-(d%2?0.5:0),l=d%2?0.5:1;b.renderer.isVML&&b.inverted&&(l+=1);O.prototype.translate.apply(a);p(a.points,function(c){var d=m(c.yBottom,f),p=C(v(-999-d,c.plotY),e.len+
	999+d),q=c.plotX+j,r=i,t=C(p,d),x;x=v(p,d)-t;M(x)<g&&g&&(x=g,t=u(M(t-f)>g?d-g:f-(e.translate(c.y,0,1,0,1)<=f?g:0)));c.barX=q;c.pointWidth=h;c.tooltipPos=b.inverted?[e.len-p,a.xAxis.len-q-r/2]:[q+r/2,p];d=M(q)<0.5;r=u(q+r)+k;q=u(q)+k;r-=q;p=M(t)<0.5;x=u(t+x)+l;t=u(t)+l;x-=t;d&&(q+=1,r-=1);p&&(t-=1,x+=1);c.shapeType="rect";c.shapeArgs={x:q,y:t,width:r,height:x}})},getSymbol:sa,drawLegendSymbol:N.drawRectangle,drawGraph:sa,drawPoints:function(){var a=this,b=this.chart,c=a.options,d=b.renderer,e=c.animationLimit||
	250,f,g,h;p(a.points,function(i){var j=i.plotY,k=i.graphic;if(j!==t&&!isNaN(j)&&i.y!==null)f=i.shapeArgs,h=r(a.borderWidth)?{"stroke-width":a.borderWidth}:{},g=i.pointAttr[i.selected?"select":""]||a.pointAttr[""],k?(bb(k),k.attr(h)[b.pointCount<e?"animate":"attr"](w(f))):i.graphic=d[i.shapeType](f).attr(g).attr(h).add(a.group).shadow(c.shadow,null,c.stacking&&!c.borderRadius);else if(k)i.graphic=k.destroy()})},animate:function(a){var b=this.yAxis,c=this.options,d=this.chart.inverted,e={};if(aa)a?
	(e.scaleY=0.001,a=C(b.pos+b.len,v(b.pos,b.toPixels(c.threshold))),d?e.translateX=a-b.len:e.translateY=a,this.group.attr(e)):(e.scaleY=1,e[d?"translateX":"translateY"]=b.pos,this.group.animate(e,this.options.animation),this.animate=null)},remove:function(){var a=this,b=a.chart;b.hasRendered&&p(b.series,function(b){if(b.type===a.type)b.isDirty=!0});O.prototype.remove.apply(a,arguments)}});F.column=ga;ba.bar=w(ba.column);pa=ka(ga,{type:"bar",inverted:!0});F.bar=pa;ba.scatter=w(S,{lineWidth:0,tooltip:{headerFormat:'<span style="color:{series.color}">●</span> <span style="font-size: 10px;"> {series.name}</span><br/>',
	pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"},stickyTracking:!1});pa=ka(O,{type:"scatter",sorted:!1,requireSorting:!1,noSharedTooltip:!0,trackerGroups:["markerGroup"],takeOrdinalPosition:!1,singularTooltips:!0,drawGraph:function(){this.options.lineWidth&&O.prototype.drawGraph.call(this)}});F.scatter=pa;ba.pie=w(S,{borderColor:"#FFFFFF",borderWidth:1,center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{distance:30,enabled:!0,formatter:function(){return this.point.name}},ignoreHiddenPoint:!0,
	legendType:"point",marker:null,size:null,showInLegend:!1,slicedOffset:10,states:{hover:{brightness:0.1,shadow:!1}},stickyTracking:!1,tooltip:{followPointer:!0}});S={type:"pie",isCartesian:!1,pointClass:ka(Ea,{init:function(){Ea.prototype.init.apply(this,arguments);var a=this,b;if(a.y<0)a.y=null;q(a,{visible:a.visible!==!1,name:m(a.name,"Slice")});b=function(b){a.slice(b.type==="select")};K(a,"select",b);K(a,"unselect",b);return a},setVisible:function(a){var b=this,c=b.series,d=c.chart;b.visible=b.options.visible=
	a=a===t?!b.visible:a;c.options.data[Da(b,c.data)]=b.options;p(["graphic","dataLabel","connector","shadowGroup"],function(c){if(b[c])b[c][a?"show":"hide"](!0)});b.legendItem&&d.legend.colorizeItem(b,a);if(!c.isDirty&&c.options.ignoreHiddenPoint)c.isDirty=!0,d.redraw()},slice:function(a,b,c){var d=this.series;Qa(c,d.chart);m(b,!0);this.sliced=this.options.sliced=a=r(a)?a:!this.sliced;d.options.data[Da(this,d.data)]=this.options;a=a?this.slicedTranslation:{translateX:0,translateY:0};this.graphic.animate(a);
	this.shadowGroup&&this.shadowGroup.animate(a)},haloPath:function(a){var b=this.shapeArgs,c=this.series.chart;return this.series.chart.renderer.symbols.arc(c.plotLeft+b.x,c.plotTop+b.y,b.r+a,b.r+a,{innerR:this.shapeArgs.r,start:b.start,end:b.end})}}),requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],axisTypes:[],pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color"},singularTooltips:!0,getColor:sa,animate:function(a){var b=this,c=b.points,d=
	b.startAngleRad;if(!a)p(c,function(a){var c=a.graphic,a=a.shapeArgs;c&&(c.attr({r:b.center[3]/2,start:d,end:d}),c.animate({r:a.r,start:a.start,end:a.end},b.options.animation))}),b.animate=null},setData:function(a,b,c,d){O.prototype.setData.call(this,a,!1,c,d);this.processData();this.generatePoints();m(b,!0)&&this.chart.redraw(c)},generatePoints:function(){var a,b=0,c,d,e,f=this.options.ignoreHiddenPoint;O.prototype.generatePoints.call(this);c=this.points;d=c.length;for(a=0;a<d;a++)e=c[a],b+=f&&!e.visible?
	0:e.y;this.total=b;for(a=0;a<d;a++)e=c[a],e.percentage=b>0?e.y/b*100:0,e.total=b},translate:function(a){this.generatePoints();var b=0,c=this.options,d=c.slicedOffset,e=d+c.borderWidth,f,g,h,i=c.startAngle||0,j=this.startAngleRad=ma/180*(i-90),i=(this.endAngleRad=ma/180*(m(c.endAngle,i+360)-90))-j,k=this.points,l=c.dataLabels.distance,c=c.ignoreHiddenPoint,o,n=k.length,p;if(!a)this.center=a=this.getCenter();this.getX=function(b,c){h=U.asin(C((b-a[1])/(a[2]/2+l),1));return a[0]+(c?-1:1)*Z(h)*(a[2]/
	2+l)};for(o=0;o<n;o++){p=k[o];f=j+b*i;if(!c||p.visible)b+=p.percentage/100;g=j+b*i;p.shapeType="arc";p.shapeArgs={x:a[0],y:a[1],r:a[2]/2,innerR:a[3]/2,start:u(f*1E3)/1E3,end:u(g*1E3)/1E3};h=(g+f)/2;h>1.5*ma?h-=2*ma:h<-ma/2&&(h+=2*ma);p.slicedTranslation={translateX:u(Z(h)*d),translateY:u(ea(h)*d)};f=Z(h)*a[2]/2;g=ea(h)*a[2]/2;p.tooltipPos=[a[0]+f*0.7,a[1]+g*0.7];p.half=h<-ma/2||h>ma/2?1:0;p.angle=h;e=C(e,l/2);p.labelPos=[a[0]+f+Z(h)*l,a[1]+g+ea(h)*l,a[0]+f+Z(h)*e,a[1]+g+ea(h)*e,a[0]+f,a[1]+g,l<0?
	"center":p.half?"right":"left",h]}},drawGraph:null,drawPoints:function(){var a=this,b=a.chart.renderer,c,d,e=a.options.shadow,f,g;if(e&&!a.shadowGroup)a.shadowGroup=b.g("shadow").add(a.group);p(a.points,function(h){d=h.graphic;g=h.shapeArgs;f=h.shadowGroup;if(e&&!f)f=h.shadowGroup=b.g("shadow").add(a.shadowGroup);c=h.sliced?h.slicedTranslation:{translateX:0,translateY:0};f&&f.attr(c);d?d.animate(q(g,c)):h.graphic=d=b[h.shapeType](g).setRadialReference(a.center).attr(h.pointAttr[h.selected?"select":
	""]).attr({"stroke-linejoin":"round"}).attr(c).add(a.group).shadow(e,f);h.visible!==void 0&&h.setVisible(h.visible)})},sortByAngle:function(a,b){a.sort(function(a,d){return a.angle!==void 0&&(d.angle-a.angle)*b})},drawLegendSymbol:N.drawRectangle,getCenter:X.getCenter,getSymbol:sa};S=ka(O,S);F.pie=S;O.prototype.drawDataLabels=function(){var a=this,b=a.options,c=b.cursor,d=b.dataLabels,e=a.points,f,g,h,i;if(d.enabled||a._hasPointLabels)a.dlProcessOptions&&a.dlProcessOptions(d),i=a.plotGroup("dataLabelsGroup",
	"data-labels","hidden",d.zIndex||6),!a.hasRendered&&m(d.defer,!0)&&(i.attr({opacity:0}),K(a,"afterAnimate",function(){a.dataLabelsGroup.show()[b.animation?"animate":"attr"]({opacity:1},{duration:200})})),g=d,p(e,function(b){var e,l=b.dataLabel,o,n,p=b.connector,u=!0;f=b.options&&b.options.dataLabels;e=m(f&&f.enabled,g.enabled);if(l&&!e)b.dataLabel=l.destroy();else if(e){d=w(g,f);e=d.rotation;o=b.getLabelConfig();h=d.format?Ia(d.format,o):d.formatter.call(o,d);d.style.color=m(d.color,d.style.color,
	a.color,"black");if(l)if(r(h))l.attr({text:h}),u=!1;else{if(b.dataLabel=l=l.destroy(),p)b.connector=p.destroy()}else if(r(h)){l={fill:d.backgroundColor,stroke:d.borderColor,"stroke-width":d.borderWidth,r:d.borderRadius||0,rotation:e,padding:d.padding,zIndex:1};for(n in l)l[n]===t&&delete l[n];l=b.dataLabel=a.chart.renderer[e?"text":"label"](h,0,-999,null,null,null,d.useHTML).attr(l).css(q(d.style,c&&{cursor:c})).add(i).shadow(d.shadow)}l&&a.alignDataLabel(b,l,d,null,u)}})};O.prototype.alignDataLabel=
	function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=m(a.plotX,-999),i=m(a.plotY,-999),j=b.getBBox();if(a=this.visible&&(a.series.forceDL||f.isInsidePlot(h,u(i),g)||d&&f.isInsidePlot(h,g?d.x+1:d.y+d.height-1,g)))d=q({x:g?f.plotWidth-i:h,y:u(g?f.plotHeight-h:i),width:0,height:0},d),q(c,{width:j.width,height:j.height}),c.rotation?(g={align:c.align,x:d.x+c.x+d.width/2,y:d.y+c.y+d.height/2},b[e?"attr":"animate"](g)):(b.align(c,null,d),g=b.alignAttr,m(c.overflow,"justify")==="justify"?this.justifyDataLabel(b,
	c,g,j,d,e):m(c.crop,!0)&&(a=f.isInsidePlot(g.x,g.y)&&f.isInsidePlot(g.x+j.width,g.y+j.height)));if(!a)b.attr({y:-999}),b.placed=!1};O.prototype.justifyDataLabel=function(a,b,c,d,e,f){var g=this.chart,h=b.align,i=b.verticalAlign,j,k;j=c.x;if(j<0)h==="right"?b.align="left":b.x=-j,k=!0;j=c.x+d.width;if(j>g.plotWidth)h==="left"?b.align="right":b.x=g.plotWidth-j,k=!0;j=c.y;if(j<0)i==="bottom"?b.verticalAlign="top":b.y=-j,k=!0;j=c.y+d.height;if(j>g.plotHeight)i==="top"?b.verticalAlign="bottom":b.y=g.plotHeight-
	j,k=!0;if(k)a.placed=!f,a.align(b,null,e)};if(F.pie)F.pie.prototype.drawDataLabels=function(){var a=this,b=a.data,c,d=a.chart,e=a.options.dataLabels,f=m(e.connectorPadding,10),g=m(e.connectorWidth,1),h=d.plotWidth,d=d.plotHeight,i,j,k=m(e.softConnector,!0),l=e.distance,o=a.center,n=o[2]/2,q=o[1],r=l>0,t,w,x,y,z=[[],[]],A,C,G,D,B,F=[0,0,0,0],N=function(a,b){return b.y-a.y};if(a.visible&&(e.enabled||a._hasPointLabels)){O.prototype.drawDataLabels.apply(a);p(b,function(a){a.dataLabel&&a.visible&&z[a.half].push(a)});
	for(D=0;!y&&b[D];)y=b[D]&&b[D].dataLabel&&(b[D].dataLabel.getBBox().height||21),D++;for(D=2;D--;){var b=[],K=[],H=z[D],I=H.length,E;a.sortByAngle(H,D-0.5);if(l>0){for(B=q-n-l;B<=q+n+l;B+=y)b.push(B);w=b.length;if(I>w){c=[].concat(H);c.sort(N);for(B=I;B--;)c[B].rank=B;for(B=I;B--;)H[B].rank>=w&&H.splice(B,1);I=H.length}for(B=0;B<I;B++){c=H[B];x=c.labelPos;c=9999;var Q,P;for(P=0;P<w;P++)Q=M(b[P]-x[1]),Q<c&&(c=Q,E=P);if(E<B&&b[B]!==null)E=B;else for(w<I-B+E&&b[B]!==null&&(E=w-I+B);b[E]===null;)E++;K.push({i:E,
	y:b[E]});b[E]=null}K.sort(N)}for(B=0;B<I;B++){c=H[B];x=c.labelPos;t=c.dataLabel;G=c.visible===!1?"hidden":"visible";c=x[1];if(l>0){if(w=K.pop(),E=w.i,C=w.y,c>C&&b[E+1]!==null||c<C&&b[E-1]!==null)C=c}else C=c;A=e.justify?o[0]+(D?-1:1)*(n+l):a.getX(E===0||E===b.length-1?c:C,D);t._attr={visibility:G,align:x[6]};t._pos={x:A+e.x+({left:f,right:-f}[x[6]]||0),y:C+e.y-10};t.connX=A;t.connY=C;if(this.options.size===null)w=t.width,A-w<f?F[3]=v(u(w-A+f),F[3]):A+w>h-f&&(F[1]=v(u(A+w-h+f),F[1])),C-y/2<0?F[0]=
	v(u(-C+y/2),F[0]):C+y/2>d&&(F[2]=v(u(C+y/2-d),F[2]))}}if(Ba(F)===0||this.verifyDataLabelOverflow(F))this.placeDataLabels(),r&&g&&p(this.points,function(b){i=b.connector;x=b.labelPos;if((t=b.dataLabel)&&t._pos)G=t._attr.visibility,A=t.connX,C=t.connY,j=k?["M",A+(x[6]==="left"?5:-5),C,"C",A,C,2*x[2]-x[4],2*x[3]-x[5],x[2],x[3],"L",x[4],x[5]]:["M",A+(x[6]==="left"?5:-5),C,"L",x[2],x[3],"L",x[4],x[5]],i?(i.animate({d:j}),i.attr("visibility",G)):b.connector=i=a.chart.renderer.path(j).attr({"stroke-width":g,
	stroke:e.connectorColor||b.color||"#606060",visibility:G}).add(a.dataLabelsGroup);else if(i)b.connector=i.destroy()})}},F.pie.prototype.placeDataLabels=function(){p(this.points,function(a){var a=a.dataLabel,b;if(a)(b=a._pos)?(a.attr(a._attr),a[a.moved?"animate":"attr"](b),a.moved=!0):a&&a.attr({y:-999})})},F.pie.prototype.alignDataLabel=sa,F.pie.prototype.verifyDataLabelOverflow=function(a){var b=this.center,c=this.options,d=c.center,e=c=c.minSize||80,f;d[0]!==null?e=v(b[2]-v(a[1],a[3]),c):(e=v(b[2]-
	a[1]-a[3],c),b[0]+=(a[3]-a[1])/2);d[1]!==null?e=v(C(e,b[2]-v(a[0],a[2])),c):(e=v(C(e,b[2]-a[0]-a[2]),c),b[1]+=(a[0]-a[2])/2);e<b[2]?(b[2]=e,this.translate(b),p(this.points,function(a){if(a.dataLabel)a.dataLabel._pos=null}),this.drawDataLabels&&this.drawDataLabels()):f=!0;return f};if(F.column)F.column.prototype.alignDataLabel=function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=a.dlBox||a.shapeArgs,i=a.below||a.plotY>m(this.translatedThreshold,f.plotSizeY),j=m(c.inside,!!this.options.stacking);if(h&&
	(d=w(h),g&&(d={x:f.plotWidth-d.y-d.height,y:f.plotHeight-d.x-d.width,width:d.height,height:d.width}),!j))g?(d.x+=i?0:d.width,d.width=0):(d.y+=i?d.height:0,d.height=0);c.align=m(c.align,!g||j?"center":i?"right":"left");c.verticalAlign=m(c.verticalAlign,g||j?"middle":i?"top":"bottom");O.prototype.alignDataLabel.call(this,a,b,c,d,e)};S=R.TrackerMixin={drawTrackerPoint:function(){var a=this,b=a.chart,c=b.pointer,d=a.options.cursor,e=d&&{cursor:d},f=function(c){var d=c.target,e;if(b.hoverSeries!==a)a.onMouseOver();
	for(;d&&!e;)e=d.point,d=d.parentNode;if(e!==t&&e!==b.hoverPoint)e.onMouseOver(c)};p(a.points,function(a){if(a.graphic)a.graphic.element.point=a;if(a.dataLabel)a.dataLabel.element.point=a});if(!a._hasTracking)p(a.trackerGroups,function(b){if(a[b]&&(a[b].addClass("highcharts-tracker").on("mouseover",f).on("mouseout",function(a){c.onTrackerMouseOut(a)}).css(e),$a))a[b].on("touchstart",f)}),a._hasTracking=!0},drawTrackerGraph:function(){var a=this,b=a.options,c=b.trackByArea,d=[].concat(c?a.areaPath:
	a.graphPath),e=d.length,f=a.chart,g=f.pointer,h=f.renderer,i=f.options.tooltip.snap,j=a.tracker,k=b.cursor,l=k&&{cursor:k},k=a.singlePoints,m,n=function(){if(f.hoverSeries!==a)a.onMouseOver()},q="rgba(192,192,192,"+(aa?1.0E-4:0.002)+")";if(e&&!c)for(m=e+1;m--;)d[m]==="M"&&d.splice(m+1,0,d[m+1]-i,d[m+2],"L"),(m&&d[m]==="M"||m===e)&&d.splice(m,0,"L",d[m-2]+i,d[m-1]);for(m=0;m<k.length;m++)e=k[m],d.push("M",e.plotX-i,e.plotY,"L",e.plotX+i,e.plotY);j?j.attr({d:d}):(a.tracker=h.path(d).attr({"stroke-linejoin":"round",
	visibility:a.visible?"visible":"hidden",stroke:q,fill:c?q:Q,"stroke-width":b.lineWidth+(c?0:2*i),zIndex:2}).add(a.group),p([a.tracker,a.markerGroup],function(a){a.addClass("highcharts-tracker").on("mouseover",n).on("mouseout",function(a){g.onTrackerMouseOut(a)}).css(l);if($a)a.on("touchstart",n)}))}};if(F.column)ga.prototype.drawTracker=S.drawTrackerPoint;if(F.pie)F.pie.prototype.drawTracker=S.drawTrackerPoint;if(F.scatter)pa.prototype.drawTracker=S.drawTrackerPoint;q(lb.prototype,{setItemEvents:function(a,
	b,c,d,e){var f=this;(c?b:a.legendGroup).on("mouseover",function(){a.setState("hover");b.css(f.options.itemHoverStyle)}).on("mouseout",function(){b.css(a.visible?d:e);a.setState()}).on("click",function(b){var c=function(){a.setVisible()},b={browserEvent:b};a.firePointEvent?a.firePointEvent("legendItemClick",b,c):D(a,"legendItemClick",b,c)})},createCheckboxForItem:function(a){a.checkbox=Y("input",{type:"checkbox",checked:a.selected,defaultChecked:a.selected},this.options.itemCheckboxStyle,this.chart.container);
	K(a.checkbox,"click",function(b){D(a,"checkboxClick",{checked:b.target.checked},function(){a.select()})})}});E.legend.itemStyle.cursor="pointer";q(Ya.prototype,{showResetZoom:function(){var a=this,b=E.lang,c=a.options.chart.resetZoomButton,d=c.theme,e=d.states,f=c.relativeTo==="chart"?null:"plotBox";this.resetZoomButton=a.renderer.button(b.resetZoom,null,null,function(){a.zoomOut()},d,e&&e.hover).attr({align:c.position.align,title:b.resetZoomTitle}).add().align(c.position,!1,f)},zoomOut:function(){var a=
	this;D(a,"selection",{resetSelection:!0},function(){a.zoom()})},zoom:function(a){var b,c=this.pointer,d=!1,e;!a||a.resetSelection?p(this.axes,function(a){b=a.zoom()}):p(a.xAxis.concat(a.yAxis),function(a){var e=a.axis,h=e.isXAxis;if(c[h?"zoomX":"zoomY"]||c[h?"pinchX":"pinchY"])b=e.zoom(a.min,a.max),e.displayBtn&&(d=!0)});e=this.resetZoomButton;if(d&&!e)this.showResetZoom();else if(!d&&ca(e))this.resetZoomButton=e.destroy();b&&this.redraw(m(this.options.chart.animation,a&&a.animation,this.pointCount<
	100))},pan:function(a,b){var c=this,d=c.hoverPoints,e;d&&p(d,function(a){a.setState()});p(b==="xy"?[1,0]:[1],function(b){var d=a[b?"chartX":"chartY"],h=c[b?"xAxis":"yAxis"][0],i=c[b?"mouseDownX":"mouseDownY"],j=(h.pointRange||0)/2,k=h.getExtremes(),l=h.toValue(i-d,!0)+j,i=h.toValue(i+c[b?"plotWidth":"plotHeight"]-d,!0)-j;h.series.length&&l>C(k.dataMin,k.min)&&i<v(k.dataMax,k.max)&&(h.setExtremes(l,i,!1,!1,{trigger:"pan"}),e=!0);c[b?"mouseDownX":"mouseDownY"]=d});e&&c.redraw(!1);G(c.container,{cursor:"move"})}});
	q(Ea.prototype,{select:function(a,b){var c=this,d=c.series,e=d.chart,a=m(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=c.options.selected=a;d.options.data[Da(c,d.data)]=c.options;c.setState(a&&"select");b||p(e.getSelectedPoints(),function(a){if(a.selected&&a!==c)a.selected=a.options.selected=!1,d.options.data[Da(a,d.data)]=a.options,a.setState(""),a.firePointEvent("unselect")})})},onMouseOver:function(a){var b=this.series,c=b.chart,d=c.tooltip,e=c.hoverPoint;
	if(e&&e!==this)e.onMouseOut();this.firePointEvent("mouseOver");d&&(!d.shared||b.noSharedTooltip)&&d.refresh(this,a);this.setState("hover");c.hoverPoint=this},onMouseOut:function(){var a=this.series.chart,b=a.hoverPoints;if(!b||Da(this,b)===-1)this.firePointEvent("mouseOut"),this.setState(),a.hoverPoint=null},importEvents:function(){if(!this.hasImportedEvents){var a=w(this.series.options.point,this.options).events,b;this.events=a;for(b in a)K(this,b,a[b]);this.hasImportedEvents=!0}},setState:function(a,
	b){var c=this.plotX,d=this.plotY,e=this.series,f=e.options.states,g=ba[e.type].marker&&e.options.marker,h=g&&!g.enabled,i=g&&g.states[a],j=i&&i.enabled===!1,k=e.stateMarkerGraphic,l=this.marker||{},m=e.chart,n=e.halo,p,a=a||"";p=this.pointAttr[a]||e.pointAttr[a];if(!(a===this.state&&!b||this.selected&&a!=="select"||f[a]&&f[a].enabled===!1||a&&(j||h&&i.enabled===!1)||a&&l.states&&l.states[a]&&l.states[a].enabled===!1)){if(this.graphic)g=g&&this.graphic.symbolName&&p.r,this.graphic.attr(w(p,g?{x:c-
	g,y:d-g,width:2*g,height:2*g}:{})),k&&k.hide();else{if(a&&i)if(g=i.radius,l=l.symbol||e.symbol,k&&k.currentSymbol!==l&&(k=k.destroy()),k)k[b?"animate":"attr"]({x:c-g,y:d-g});else if(l)e.stateMarkerGraphic=k=m.renderer.symbol(l,c-g,d-g,2*g,2*g).attr(p).add(e.markerGroup),k.currentSymbol=l;if(k)k[a&&m.isInsidePlot(c,d,m.inverted)?"show":"hide"]()}if((c=f[a]&&f[a].halo)&&c.size){if(!n)e.halo=n=m.renderer.path().add(e.seriesGroup);n.attr(q({fill:ya(this.color||e.color).setOpacity(c.opacity).get()},c.attributes))[b?
	"animate":"attr"]({d:this.haloPath(c.size)})}else n&&n.attr({d:[]});this.state=a}},haloPath:function(a){var b=this.series,c=b.chart,d=b.getPlotBox(),e=c.inverted;return c.renderer.symbols.circle(d.translateX+(e?b.yAxis.len-this.plotY:this.plotX)-a,d.translateY+(e?b.xAxis.len-this.plotX:this.plotY)-a,a*2,a*2)}});q(O.prototype,{onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&D(this,"mouseOver");this.setState("hover");a.hoverSeries=
	this},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;if(d)d.onMouseOut();this&&a.events.mouseOut&&D(this,"mouseOut");c&&!a.stickyTracking&&(!c.shared||this.noSharedTooltip)&&c.hide();this.setState();b.hoverSeries=null},setState:function(a){var b=this.options,c=this.graph,d=this.graphNeg,e=b.states,b=b.lineWidth,a=a||"";if(this.state!==a)this.state=a,e[a]&&e[a].enabled===!1||(a&&(b=e[a].lineWidth||b+1),c&&!c.dashstyle&&(a={"stroke-width":b},c.attr(a),d&&d.attr(a)))},
	setVisible:function(a,b){var c=this,d=c.chart,e=c.legendItem,f,g=d.options.chart.ignoreHiddenSeries,h=c.visible;f=(c.visible=a=c.userOptions.visible=a===t?!h:a)?"show":"hide";p(["group","dataLabelsGroup","markerGroup","tracker"],function(a){if(c[a])c[a][f]()});if(d.hoverSeries===c)c.onMouseOut();e&&d.legend.colorizeItem(c,a);c.isDirty=!0;c.options.stacking&&p(d.series,function(a){if(a.options.stacking&&a.visible)a.isDirty=!0});p(c.linkedSeries,function(b){b.setVisible(a,!1)});if(g)d.isDirtyBox=!0;
	b!==!1&&d.redraw();D(c,f)},setTooltipPoints:function(a){var b=[],c,d,e=this.xAxis,f=e&&e.getExtremes(),g=e?e.tooltipLen||e.len:this.chart.plotSizeX,h,i,j=[];if(!(this.options.enableMouseTracking===!1||this.singularTooltips)){if(a)this.tooltipPoints=null;p(this.segments||this.points,function(a){b=b.concat(a)});e&&e.reversed&&(b=b.reverse());this.orderTooltipPoints&&this.orderTooltipPoints(b);a=b.length;for(i=0;i<a;i++)if(e=b[i],c=e.x,c>=f.min&&c<=f.max){h=b[i+1];c=d===t?0:d+1;for(d=b[i+1]?C(v(0,T((e.clientX+
	(h?h.wrappedClientX||h.clientX:g))/2)),g):g;c>=0&&c<=d;)j[c++]=e}this.tooltipPoints=j}},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=a===t?!this.selected:a;if(this.checkbox)this.checkbox.checked=a;D(this,a?"select":"unselect")},drawTracker:S.drawTrackerGraph});q(R,{Axis:la,Chart:Ya,Color:ya,Point:Ea,Tick:Sa,Renderer:Za,Series:O,SVGElement:P,SVGRenderer:ta,arrayMin:Na,arrayMax:Ba,charts:V,dateFormat:cb,format:Ia,pathAnim:ub,getOptions:function(){return E},
	hasBidiBug:Nb,isTouchDevice:Jb,numberFormat:Ga,seriesTypes:F,setOptions:function(a){E=w(!0,E,a);Cb();return E},addEvent:K,removeEvent:W,createElement:Y,discardElement:Pa,css:G,each:p,extend:q,map:Ua,merge:w,pick:m,splat:qa,extendClass:ka,pInt:z,wrap:Ma,svg:aa,canvas:fa,vml:!aa&&!fa,product:"Highcharts",version:"4.0.1"})})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },

/***/ 22:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Sand-Signika theme for Highcharts JS
	 * @author Torstein Honsi
	 */



	// Add the background image to the container
	Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed) {
		proceed.call(this);
		this.container.style.background = 'url(http://www.highcharts.com/samples/graphics/sand.png)';
	});


	Highcharts.theme = {
		colors: ["#f45b5b", "#8085e9", "#8d4654", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
			"#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
		chart: {
			backgroundColor: null,
			style: {
				fontFamily: "Signika, serif"
			}
		},
		title: {
			style: {
				color: 'black',
				fontSize: '16px',
				fontWeight: 'bold'
			}
		},
		subtitle: {
			style: {
				color: 'black'
			}
		},
		tooltip: {
			borderWidth: 0
		},
		legend: {
			itemStyle: {
				fontWeight: 'bold',
				fontSize: '13px'
			}
		},
		xAxis: {
			labels: {
				style: {
					color: '#6e6e70'
				}
			}
		},
		yAxis: {
			labels: {
				style: {
					color: '#6e6e70'
				}
			}
		},
		plotOptions: {
			series: {
				shadow: true
			},
			candlestick: {
				lineColor: '#404048'
			}
		},

		// Highstock specific
		navigator: {
			xAxis: {
				gridLineColor: '#D0D0D8'
			}
		},
		rangeSelector: {
			buttonTheme: {
				fill: 'white',
				stroke: '#C0C0C8',
				'stroke-width': 1,
				states: {
					select: {
						fill: '#D0D0D8'
					}
				}
			}
		},
		scrollbar: {
			trackBorderColor: '#C0C0C8'
		},

		// General
		background2: '#E0E0E8'
		
	};

	// Apply the theme
	Highcharts.setOptions(Highcharts.theme);


/***/ },

/***/ 23:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, jQuery) {/* w2ui 1.4.3 (c) http://w2ui.com, vitmalina@gmail.com */
	var w2ui=w2ui||{},w2obj=w2obj||{},w2utils=function(){function a(a){var b=/^[-+]?[0-9]+$/;return b.test(a)}function b(a){return"string"==typeof a&&(a=a.replace(w2utils.settings.decimalSymbol,".")),("number"==typeof a||"string"==typeof a&&""!==a)&&!isNaN(Number(a))}function c(a){var b=w2utils.settings,c=new RegExp("^"+(b.currencyPrefix?"\\"+b.currencyPrefix+"?":"")+"[-+]?[0-9]*[\\"+w2utils.settings.decimalSymbol+"]?[0-9]+"+(b.currencySuffix?"\\"+b.currencySuffix+"?":"")+"$","i");return"string"==typeof a&&(a=a.replace(new RegExp(b.groupSymbol,"g"),"")),"object"==typeof a||""===a?!1:c.test(a)}function d(a){var b=/^[a-fA-F0-9]+$/;return b.test(a)}function e(a){var b=/^[a-zA-Z0-9_-]+$/;return b.test(a)}function f(a){var b=/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;return b.test(a)}function g(b,c,d){if(!b)return!1;var e,f,g,h="Invalid Date";if(null==c&&(c=w2utils.settings.date_format),"function"==typeof b.getUTCFullYear&&"function"==typeof b.getUTCMonth&&"function"==typeof b.getUTCDate)g=b.getUTCFullYear(),e=b.getUTCMonth(),f=b.getUTCDate();else if("function"==typeof b.getFullYear&&"function"==typeof b.getMonth&&"function"==typeof b.getDate)g=b.getFullYear(),e=b.getMonth(),f=b.getDate();else{if(b=String(b),RegExp("mon","ig").test(c)){c=c.replace(/month/gi,"m").replace(/mon/gi,"m").replace(/dd/gi,"d").replace(/[, ]/gi,"/").replace(/\/\//g,"/").toLowerCase(),b=b.replace(/[, ]/gi,"/").replace(/\/\//g,"/").toLowerCase();for(var i=0,j=w2utils.settings.fullmonths.length;j>i;i++){var k=w2utils.settings.fullmonths[i];b=b.replace(RegExp(k,"ig"),parseInt(i)+1).replace(RegExp(k.substr(0,3),"ig"),parseInt(i)+1)}}var l=b.replace(/-/g,"/").replace(/\./g,"/").toLowerCase().split("/"),m=c.replace(/-/g,"/").replace(/\./g,"/").toLowerCase();"mm/dd/yyyy"===m&&(e=l[0],f=l[1],g=l[2]),"m/d/yyyy"===m&&(e=l[0],f=l[1],g=l[2]),"dd/mm/yyyy"===m&&(e=l[1],f=l[0],g=l[2]),"d/m/yyyy"===m&&(e=l[1],f=l[0],g=l[2]),"yyyy/dd/mm"===m&&(e=l[2],f=l[1],g=l[0]),"yyyy/d/m"===m&&(e=l[2],f=l[1],g=l[0]),"yyyy/mm/dd"===m&&(e=l[1],f=l[2],g=l[0]),"yyyy/m/d"===m&&(e=l[1],f=l[2],g=l[0]),"mm/dd/yy"===m&&(e=l[0],f=l[1],g=l[2]),"m/d/yy"===m&&(e=l[0],f=l[1],g=parseInt(l[2])+1900),"dd/mm/yy"===m&&(e=l[1],f=l[0],g=parseInt(l[2])+1900),"d/m/yy"===m&&(e=l[1],f=l[0],g=parseInt(l[2])+1900),"yy/dd/mm"===m&&(e=l[2],f=l[1],g=parseInt(l[0])+1900),"yy/d/m"===m&&(e=l[2],f=l[1],g=parseInt(l[0])+1900),"yy/mm/dd"===m&&(e=l[1],f=l[2],g=parseInt(l[0])+1900),"yy/m/d"===m&&(e=l[1],f=l[2],g=parseInt(l[0])+1900)}return a(g)&&a(e)&&a(f)?(g=+g,e=+e,f=+f,h=new Date(g,e-1,f),null==e?!1:"Invalid Date"==String(h)?!1:h.getMonth()+1!==e||h.getDate()!==f||h.getFullYear()!==g?!1:d===!0?h:!0):!1}function h(a,b){if(null==a)return!1;var c,d;a=String(a),a=a.toUpperCase(),d=a.indexOf("PM")>=0;var e=d||a.indexOf("AM")>=0;c=e?12:24,a=a.replace("AM","").replace("PM",""),a=$.trim(a);var f=a.split(":"),g=parseInt(f[0]||0),h=parseInt(f[1]||0);return e&&1===f.length||2===f.length?""===f[0]||0>g||g>c||!this.isInt(f[0])||f[0].length>2?!1:2===f.length&&(""===f[1]||0>h||h>59||!this.isInt(f[1])||2!==f[1].length)?!1:e||c!==g||0===h?e&&1===f.length&&0===g?!1:b===!0?(d&&(g+=12),{hours:g,minutes:h}):!0:!1:!1}function i(a){if(""===a||null==a)return"";var b=new Date(a);if(w2utils.isInt(a)&&(b=new Date(Number(a))),"Invalid Date"==String(b))return"";var c=new Date,d=(c.getTime()-b.getTime())/1e3,e="",f="";return 0>d?(e='<span style="color: #aaa">future</span>',f=""):60>d?(e=Math.floor(d),f="sec",0>d&&(e=0,f="sec")):3600>d?(e=Math.floor(d/60),f="min"):86400>d?(e=Math.floor(d/60/60),f="hour"):2592e3>d?(e=Math.floor(d/24/60/60),f="day"):31557600>d?(e=Math.floor(d/365.25/24/60/60*10)/10,f="month"):d>=31557600&&(e=Math.floor(d/365.25/24/60/60*10)/10,f="year"),e+" "+f+(e>1?"s":"")}function j(a){if(""===a||null==a)return"";var b=new Date(a);if(w2utils.isInt(a)&&(b=new Date(Number(a))),"Invalid Date"==String(b))return"";var c=w2utils.settings.shortmonths,d=new Date,e=new Date;e.setTime(e.getTime()-864e5);var f=c[b.getMonth()]+" "+b.getDate()+", "+b.getFullYear(),g=c[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear(),h=c[e.getMonth()]+" "+e.getDate()+", "+e.getFullYear(),i=b.getHours()-(b.getHours()>12?12:0)+":"+(b.getMinutes()<10?"0":"")+b.getMinutes()+" "+(b.getHours()>=12?"pm":"am"),j=b.getHours()-(b.getHours()>12?12:0)+":"+(b.getMinutes()<10?"0":"")+b.getMinutes()+":"+(b.getSeconds()<10?"0":"")+b.getSeconds()+" "+(b.getHours()>=12?"pm":"am"),k=f;return f===g&&(k=i),f===h&&(k=w2utils.lang("Yesterday")),'<span title="'+f+" "+j+'">'+k+"</span>"}function k(a){if(!w2utils.isFloat(a)||""===a)return"";if(a=parseFloat(a),0===a)return 0;var b=["Bt","KB","MB","GB","TB"],c=parseInt(Math.floor(Math.log(a)/Math.log(1024)));return(Math.floor(a/Math.pow(1024,c)*10)/10).toFixed(0===c?0:1)+" "+b[c]}function l(a,b,c){var d="";return null==b&&(b=w2utils.settings.groupSymbol||","),null==c&&(c=w2utils.settings.decimalSymbol||"."),(w2utils.isFloat(a)||w2utils.isInt(a)||w2utils.isMoney(a))&&(E=String(a).split("."),d=String(E[0]).replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+b),null!=E[1]&&(d+=w2utils.settings.decimalSymbol+E[1])),d}function m(a,b){w2utils.settings.shortmonths,w2utils.settings.fullmonths;if(b||(b=this.settings.date_format),""===a||null==a||"object"==typeof a&&!a.getMonth)return"";var c=new Date(a);if(w2utils.isInt(a)&&(c=new Date(Number(a))),"Invalid Date"==String(c))return"";var d=c.getFullYear(),e=c.getMonth(),f=c.getDate();return b.toLowerCase().replace("month",w2utils.settings.fullmonths[e]).replace("mon",w2utils.settings.shortmonths[e]).replace(/yyyy/g,d).replace(/yyy/g,d).replace(/yy/g,d>2e3?100+parseInt(String(d).substr(2)):String(d).substr(2)).replace(/(^|[^a-z$])y/g,"$1"+d).replace(/mm/g,(10>e+1?"0":"")+(e+1)).replace(/dd/g,(10>f?"0":"")+f).replace(/th/g,1==f?"st":"th").replace(/th/g,2==f?"nd":"th").replace(/th/g,3==f?"rd":"th").replace(/(^|[^a-z$])m/g,"$1"+(e+1)).replace(/(^|[^a-z$])d/g,"$1"+f)}function n(a,b){w2utils.settings.shortmonths,w2utils.settings.fullmonths;if(b||(b=this.settings.time_format),""===a||null==a||"object"==typeof a&&!a.getMonth)return"";var c=new Date(a);if(w2utils.isInt(a)&&(c=new Date(Number(a))),w2utils.isTime(a)){var d=w2utils.isTime(a,!0);c=new Date,c.setHours(d.hours),c.setMinutes(d.minutes)}if("Invalid Date"==String(c))return"";var e="am",f=c.getHours(),g=c.getHours(),h=c.getMinutes(),i=c.getSeconds();return 10>h&&(h="0"+h),10>i&&(i="0"+i),(-1!==b.indexOf("am")||-1!==b.indexOf("pm"))&&(f>=12&&(e="pm"),f>12&&(f-=12)),b.toLowerCase().replace("am",e).replace("pm",e).replace("hhh",10>f?"0"+f:f).replace("hh24",10>g?"0"+g:g).replace("h24",g).replace("hh",f).replace("mm",h).replace("mi",h).replace("ss",i).replace(/(^|[^a-z$])h/g,"$1"+f).replace(/(^|[^a-z$])m/g,"$1"+h).replace(/(^|[^a-z$])s/g,"$1"+i)}function o(a,b){var c;return""===a||null==a||"object"==typeof a&&!a.getMonth?"":(c="string"!=typeof b?[this.settings.date_format,this.settings.time_format]:b.split("|"),this.formatDate(a,c[0])+" "+this.formatTime(a,c[1]))}function p(a){if(null===a)return a;switch(typeof a){case"number":break;case"string":a=$.trim(String(a).replace(/(<([^>]+)>)/gi,""));break;case"object":for(var b in a)a[b]=this.stripTags(a[b])}return a}function q(a){if(null===a)return a;switch(typeof a){case"number":break;case"string":a=String(a).replace(/&/g,"&amp;").replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;");break;case"object":for(var b in a)a[b]=this.encodeTags(a[b])}return a}function r(a){return""===a||null==a?"":String(a).replace(/([;&,\.\+\*\~'`:"\!\^#$%@\[\]\(\)=<>\|\/? {}\\])/g,"\\$1")}function s(a){function b(a){for(var a=String(a).replace(/\r\n/g,"\n"),b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(d>>6|192),b+=String.fromCharCode(63&d|128)):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128),b+=String.fromCharCode(63&d|128))}return b}var c,d,e,f,g,h,i,j="",k=0,l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";for(a=b(a);k<a.length;)c=a.charCodeAt(k++),d=a.charCodeAt(k++),e=a.charCodeAt(k++),f=c>>2,g=(3&c)<<4|d>>4,h=(15&d)<<2|e>>6,i=63&e,isNaN(d)?h=i=64:isNaN(e)&&(i=64),j=j+l.charAt(f)+l.charAt(g)+l.charAt(h)+l.charAt(i);return j}function t(a){function b(a){for(var b,c,d="",e=0,f=0;e<a.length;)f=a.charCodeAt(e),128>f?(d+=String.fromCharCode(f),e++):f>191&&224>f?(b=a.charCodeAt(e+1),d+=String.fromCharCode((31&f)<<6|63&b),e+=2):(b=a.charCodeAt(e+1),c=a.charCodeAt(e+2),d+=String.fromCharCode((15&f)<<12|(63&b)<<6|63&c),e+=3);return d}var c,d,e,f,g,h,i,j="",k=0,l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");k<a.length;)f=l.indexOf(a.charAt(k++)),g=l.indexOf(a.charAt(k++)),h=l.indexOf(a.charAt(k++)),i=l.indexOf(a.charAt(k++)),c=f<<2|g>>4,d=(15&g)<<4|h>>2,e=(3&h)<<6|i,j+=String.fromCharCode(c),64!==h&&(j+=String.fromCharCode(d)),64!==i&&(j+=String.fromCharCode(e));return j=b(j)}function u(a,b,c,d){function e(a,b,c){var d=!!window.webkitURL;return d||"undefined"==typeof c||(b=c),";"+a+": "+b+"; -webkit-"+a+": "+b+"; -moz-"+a+": "+b+"; -ms-"+a+": "+b+"; -o-"+a+": "+b+";"}var f=$(a).width(),g=$(a).height(),h=.5;if(!a||!b)return void console.log("ERROR: Cannot do transition when one of the divs is null");switch(a.parentNode.style.cssText+=e("perspective","700px")+"; overflow: hidden;",a.style.cssText+="; position: absolute; z-index: 1019; "+e("backface-visibility","hidden"),b.style.cssText+="; position: absolute; z-index: 1020; "+e("backface-visibility","hidden"),c){case"slide-left":a.style.cssText+="overflow: hidden; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)"),b.style.cssText+="overflow: hidden; "+e("transform","translate3d("+f+"px, 0, 0)","translate("+f+"px, 0)"),$(b).show(),window.setTimeout(function(){b.style.cssText+=e("transition",h+"s")+";"+e("transform","translate3d(0, 0, 0)","translate(0, 0)"),a.style.cssText+=e("transition",h+"s")+";"+e("transform","translate3d(-"+f+"px, 0, 0)","translate(-"+f+"px, 0)")},1);break;case"slide-right":a.style.cssText+="overflow: hidden; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)"),b.style.cssText+="overflow: hidden; "+e("transform","translate3d(-"+f+"px, 0, 0)","translate(-"+f+"px, 0)"),$(b).show(),window.setTimeout(function(){b.style.cssText+=e("transition",h+"s")+"; "+e("transform","translate3d(0px, 0, 0)","translate(0px, 0)"),a.style.cssText+=e("transition",h+"s")+"; "+e("transform","translate3d("+f+"px, 0, 0)","translate("+f+"px, 0)")},1);break;case"slide-down":a.style.cssText+="overflow: hidden; z-index: 1; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)"),b.style.cssText+="overflow: hidden; z-index: 0; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)"),$(b).show(),window.setTimeout(function(){b.style.cssText+=e("transition",h+"s")+"; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)"),a.style.cssText+=e("transition",h+"s")+"; "+e("transform","translate3d(0, "+g+"px, 0)","translate(0, "+g+"px)")},1);break;case"slide-up":a.style.cssText+="overflow: hidden; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)"),b.style.cssText+="overflow: hidden; "+e("transform","translate3d(0, "+g+"px, 0)","translate(0, "+g+"px)"),$(b).show(),window.setTimeout(function(){b.style.cssText+=e("transition",h+"s")+"; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)"),a.style.cssText+=e("transition",h+"s")+"; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)")},1);break;case"flip-left":a.style.cssText+="overflow: hidden; "+e("transform","rotateY(0deg)"),b.style.cssText+="overflow: hidden; "+e("transform","rotateY(-180deg)"),$(b).show(),window.setTimeout(function(){b.style.cssText+=e("transition",h+"s")+"; "+e("transform","rotateY(0deg)"),a.style.cssText+=e("transition",h+"s")+"; "+e("transform","rotateY(180deg)")},1);break;case"flip-right":a.style.cssText+="overflow: hidden; "+e("transform","rotateY(0deg)"),b.style.cssText+="overflow: hidden; "+e("transform","rotateY(180deg)"),$(b).show(),window.setTimeout(function(){b.style.cssText+=e("transition",h+"s")+"; "+e("transform","rotateY(0deg)"),a.style.cssText+=e("transition",h+"s")+"; "+e("transform","rotateY(-180deg)")},1);break;case"flip-down":a.style.cssText+="overflow: hidden; "+e("transform","rotateX(0deg)"),b.style.cssText+="overflow: hidden; "+e("transform","rotateX(180deg)"),$(b).show(),window.setTimeout(function(){b.style.cssText+=e("transition",h+"s")+"; "+e("transform","rotateX(0deg)"),a.style.cssText+=e("transition",h+"s")+"; "+e("transform","rotateX(-180deg)")},1);break;case"flip-up":a.style.cssText+="overflow: hidden; "+e("transform","rotateX(0deg)"),b.style.cssText+="overflow: hidden; "+e("transform","rotateX(-180deg)"),$(b).show(),window.setTimeout(function(){b.style.cssText+=e("transition",h+"s")+"; "+e("transform","rotateX(0deg)"),a.style.cssText+=e("transition",h+"s")+"; "+e("transform","rotateX(180deg)")},1);break;case"pop-in":a.style.cssText+="overflow: hidden; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)"),b.style.cssText+="overflow: hidden; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)")+"; "+e("transform","scale(.8)")+"; opacity: 0;",$(b).show(),window.setTimeout(function(){b.style.cssText+=e("transition",h+"s")+"; "+e("transform","scale(1)")+"; opacity: 1;",a.style.cssText+=e("transition",h+"s")+";"},1);break;case"pop-out":a.style.cssText+="overflow: hidden; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)")+"; "+e("transform","scale(1)")+"; opacity: 1;",b.style.cssText+="overflow: hidden; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)")+"; opacity: 0;",$(b).show(),window.setTimeout(function(){b.style.cssText+=e("transition",h+"s")+"; opacity: 1;",a.style.cssText+=e("transition",h+"s")+"; "+e("transform","scale(1.7)")+"; opacity: 0;"},1);break;default:a.style.cssText+="overflow: hidden; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)"),b.style.cssText+="overflow: hidden; "+e("transform","translate3d(0, 0, 0)","translate(0, 0)")+"; opacity: 0;",$(b).show(),window.setTimeout(function(){b.style.cssText+=e("transition",h+"s")+"; opacity: 1;",a.style.cssText+=e("transition",h+"s")},1)}setTimeout(function(){"slide-down"===c&&($(a).css("z-index","1019"),$(b).css("z-index","1020")),b&&$(b).css({opacity:"1","-webkit-transition":"","-moz-transition":"","-ms-transition":"","-o-transition":"","-webkit-transform":"","-moz-transform":"","-ms-transform":"","-o-transform":"","-webkit-backface-visibility":"","-moz-backface-visibility":"","-ms-backface-visibility":"","-o-backface-visibility":""}),a&&($(a).css({opacity:"1","-webkit-transition":"","-moz-transition":"","-ms-transition":"","-o-transition":"","-webkit-transform":"","-moz-transform":"","-ms-transform":"","-o-transform":"","-webkit-backface-visibility":"","-moz-backface-visibility":"","-ms-backface-visibility":"","-o-backface-visibility":""}),a.parentNode&&$(a.parentNode).css({"-webkit-perspective":"","-moz-perspective":"","-ms-perspective":"","-o-perspective":""})),"function"==typeof d&&d()},1e3*h)}function v(a,b,c){var d={};"object"==typeof b?d=b:(d.msg=b,d.spinner=c),d.msg||0===d.msg||(d.msg=""),w2utils.unlock(a),$(a).prepend('<div class="w2ui-lock"></div><div class="w2ui-lock-msg"></div>');var e=$(a).find(".w2ui-lock"),f=$(a).find(".w2ui-lock-msg");d.msg||f.css({"background-color":"transparent",border:"0px"}),d.spinner===!0&&(d.msg='<div class="w2ui-spinner" '+(d.msg?"":'style="width: 35px; height: 35px"')+"></div>"+d.msg),null!=d.opacity&&e.css("opacity",d.opacity),"function"==typeof e.fadeIn?(e.fadeIn(200),f.html(d.msg).fadeIn(200)):(e.show(),f.html(d.msg).show(0)),$().w2tag()}function w(a){$(a).find(".w2ui-lock").remove(),$(a).find(".w2ui-lock-msg").remove()}function x(a,b){var c=$(a),d={left:parseInt(c.css("border-left-width"))||0,right:parseInt(c.css("border-right-width"))||0,top:parseInt(c.css("border-top-width"))||0,bottom:parseInt(c.css("border-bottom-width"))||0},e={left:parseInt(c.css("margin-left"))||0,right:parseInt(c.css("margin-right"))||0,top:parseInt(c.css("margin-top"))||0,bottom:parseInt(c.css("margin-bottom"))||0},f={left:parseInt(c.css("padding-left"))||0,right:parseInt(c.css("padding-right"))||0,top:parseInt(c.css("padding-top"))||0,bottom:parseInt(c.css("padding-bottom"))||0};switch(b){case"top":return d.top+e.top+f.top;case"bottom":return d.bottom+e.bottom+f.bottom;case"left":return d.left+e.left+f.left;case"right":return d.right+e.right+f.right;case"width":return d.left+d.right+e.left+e.right+f.left+f.right+parseInt(c.width());case"height":return d.top+d.bottom+e.top+e.bottom+f.top+f.bottom+parseInt(c.height());case"+width":return d.left+d.right+e.left+e.right+f.left+f.right;case"+height":return d.top+d.bottom+e.top+e.bottom+f.top+f.bottom}return 0}function y(a){var b=this.settings.phrases[a];return null==b?a:b}function z(a){a||(a="en-us"),5===a.length&&(a="locale/"+a+".json"),$.ajax({url:a,type:"GET",dataType:"JSON",async:!1,cache:!1,success:function(a){w2utils.settings=$.extend(!0,w2utils.settings,a);var b=w2obj.grid.prototype;for(var c in b.buttons)b.buttons[c].caption=w2utils.lang(b.buttons[c].caption),b.buttons[c].hint=w2utils.lang(b.buttons[c].hint);b.msgDelete=w2utils.lang(b.msgDelete),b.msgNotJSON=w2utils.lang(b.msgNotJSON),b.msgRefresh=w2utils.lang(b.msgRefresh)},error:function(){console.log("ERROR: Cannot load locale "+a)}})}function A(){if(E.scrollBarSize)return E.scrollBarSize;var a='<div id="_scrollbar_width" style="position: absolute; top: -300px; width: 100px; height: 100px; overflow-y: scroll;">    <div style="height: 120px">1</div></div>';return $("body").append(a),E.scrollBarSize=100-$("#_scrollbar_width > div").width(),$("#_scrollbar_width").remove(),String(navigator.userAgent).indexOf("MSIE")>=0&&(E.scrollBarSize=E.scrollBarSize/2),E.scrollBarSize}function B(a,b){return a&&"undefined"!=typeof a.name?"undefined"!=typeof w2ui[a.name]?(console.log('ERROR: The parameter "name" is not unique. There are other objects already created with the same name (obj: '+a.name+")."),!1):w2utils.isAlphaNumeric(a.name)?!0:(console.log('ERROR: The parameter "name" has to be alpha-numeric (a-z, 0-9, dash and underscore). '),!1):(console.log('ERROR: The parameter "name" is required but not supplied in $().'+b+"()."),!1)}function C(a,b,c,d){$.isArray(b)||(b=[b]);for(var e=0;e<b.length;e++)if(b[e].id===a)return console.log('ERROR: The parameter "id='+a+'" is not unique within the current '+c+". (obj: "+d+")"),!1;return!0}function D(a){var b=[],c=a.replace(/\/\(/g,"(?:/").replace(/\+/g,"__plus__").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,function(a,c,d,e,f,g){return b.push({name:e,optional:!!g}),c=c||"",""+(g?"":c)+"(?:"+(g?c:"")+(d||"")+(f||d&&"([^/.]+?)"||"([^/]+?)")+")"+(g||"")}).replace(/([\/.])/g,"\\$1").replace(/__plus__/g,"(.+)").replace(/\*/g,"(.*)");return{path:new RegExp("^"+c+"$","i"),keys:b}}var E={},F={version:"1.4.3",settings:{locale:"en-us",date_format:"m/d/yyyy",date_display:"Mon d, yyyy",time_format:"hh:mi pm",currencyPrefix:"$",currencySuffix:"",currencyPrecision:2,groupSymbol:",",decimalSymbol:".",shortmonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],fullmonths:["January","February","March","April","May","June","July","August","September","October","November","December"],shortdays:["M","T","W","T","F","S","S"],fulldays:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],dataType:"HTTP",phrases:{}},isInt:a,isFloat:b,isMoney:c,isHex:d,isAlphaNumeric:e,isEmail:f,isDate:g,isTime:h,age:i,date:j,size:k,formatNumber:l,formatDate:m,formatTime:n,formatDateTime:o,stripTags:p,encodeTags:q,escapeId:r,base64encode:s,base64decode:t,transition:u,lock:v,unlock:w,lang:y,locale:z,getSize:x,scrollBarSize:A,checkName:B,checkUniqueId:C,parseRoute:D,isIOS:-1!=navigator.userAgent.toLowerCase().indexOf("iphone")||-1!=navigator.userAgent.toLowerCase().indexOf("ipod")||-1!=navigator.userAgent.toLowerCase().indexOf("ipad")?!0:!1,isIE:-1!=navigator.userAgent.toLowerCase().indexOf("msie")||-1!=navigator.userAgent.toLowerCase().indexOf("trident")?!0:!1};return F}();w2utils.event={on:function(a,b){return $.isPlainObject(a)||(a={type:a}),a=$.extend({type:null,execute:"before",target:null,onComplete:null},a),a.type?b?($.isArray(this.handlers)||(this.handlers=[]),void this.handlers.push({event:a,handler:b})):void console.log("ERROR: You must specify event handler function when calling .on() method of "+this.name):void console.log("ERROR: You must specify event type when calling .on() method of "+this.name)},off:function(a,b){if($.isPlainObject(a)||(a={type:a}),a=$.extend({},{type:null,execute:"before",target:null,onComplete:null},a),!a.type)return void console.log("ERROR: You must specify event type when calling .off() method of "+this.name);b||(b=null);for(var c=[],d=0,e=this.handlers.length;e>d;d++){var f=this.handlers[d];(f.event.type!==a.type&&"*"!==a.type||f.event.target!==a.target&&null!==a.target||f.handler!==b&&null!==b)&&c.push(f)}this.handlers=c},trigger:function(a){var a=$.extend({type:null,phase:"before",target:null},a,{isStopped:!1,isCancelled:!1,preventDefault:function(){this.isCancelled=!0},stopPropagation:function(){this.isStopped=!0}});"before"===a.phase&&(a.onComplete=null);var b,c,d;null==a.target&&(a.target=null),$.isArray(this.handlers)||(this.handlers=[]);for(var e=this.handlers.length-1;e>=0;e--){var f=this.handlers[e];if(!(f.event.type!==a.type&&"*"!==f.event.type||f.event.target!==a.target&&null!==f.event.target||f.event.execute!==a.phase&&"*"!==f.event.execute&&"*"!==f.event.phase)&&(a=$.extend({},f.event,a),b=[],d=RegExp(/\((.*?)\)/).exec(f.handler),d&&(b=d[1].split(/\s*,\s*/)),2===b.length?f.handler.call(this,a.target,a):f.handler.call(this,a),a.isStopped===!0||a.stop===!0))return a}var g="on"+a.type.substr(0,1).toUpperCase()+a.type.substr(1);return"before"===a.phase&&"function"==typeof this[g]&&(c=this[g],b=[],d=RegExp(/\((.*?)\)/).exec(c),d&&(b=d[1].split(/\s*,\s*/)),2===b.length?c.call(this,a.target,a):c.call(this,a),a.isStopped===!0||a.stop===!0)?a:null!=a.object&&"before"===a.phase&&"function"==typeof a.object[g]&&(c=a.object[g],b=[],d=RegExp(/\((.*?)\)/).exec(c),d&&(b=d[1].split(/\s*,\s*/)),2===b.length?c.call(this,a.target,a):c.call(this,a),a.isStopped===!0||a.stop===!0)?a:("after"===a.phase&&"function"==typeof a.onComplete&&a.onComplete.call(this,a),a)}},w2utils.keyboard=function(a){function b(){$(document).on("keydown",c),$(document).on("mousedown",d)}function c(a){var b=a.target.tagName;-1===$.inArray(b,["INPUT","SELECT","TEXTAREA"])&&"true"!==$(a.target).prop("contenteditable")&&g&&w2ui[g]&&"function"==typeof w2ui[g].keydown&&w2ui[g].keydown.call(w2ui[g],a)}function d(a){var b=(a.target.tagName,$(a.target).parents(".w2ui-reset"));if(b.length>0){var c=b.attr("name");w2ui[c]&&w2ui[c].keyboard&&(g=c)}}function e(a){return"undefined"!=typeof a&&(g=a),g}function f(){g=null}var g=null;return a.active=e,a.clear=f,b(),a}({}),function(){$.fn.w2render=function(a){$(this).length>0&&("string"==typeof a&&w2ui[a]&&w2ui[a].render($(this)[0]),"object"==typeof a&&a.render($(this)[0]))},$.fn.w2destroy=function(a){!a&&this.length>0&&(a=this.attr("name")),"string"==typeof a&&w2ui[a]&&w2ui[a].destroy(),"object"==typeof a&&a.destroy()},$.fn.w2marker=function(a){return $(this).each(""===a||null==a?function(a,b){b.innerHTML=b.innerHTML.replace(/\<span class=\"w2ui\-marker\"\>(.*)\<\/span\>/gi,"$1")}:function(b,c){function d(a){return'<span class="w2ui-marker">'+a+"</span>"}"string"==typeof a&&(a=[a]),c.innerHTML=c.innerHTML.replace(/\<span class=\"w2ui\-marker\"\>(.*)\<\/span\>/gi,"$1");for(var e in a){var f=a[e];"string"!=typeof f&&(f=String(f)),f=f.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&").replace(/&/g,"&amp;").replace(/</g,"&gt;").replace(/>/g,"&lt;");var g=new RegExp(f+"(?!([^<]+)?>)","gi");c.innerHTML=c.innerHTML.replace(g,d)}})},$.fn.w2tag=function(a,b){return $.isPlainObject(b)||(b={}),$.isPlainObject(b.css)||(b.css={}),"undefined"==typeof b["class"]&&(b["class"]=""),0===$(this).length?void $(".w2ui-tag").each(function(a,b){var c=$(b).data("options");null==c&&(c={}),$($(b).data("taged-el")).removeClass(c["class"]),clearInterval($(b).data("timer")),$(b).remove()}):$(this).each(function(c,d){function e(){$tag=$("#w2ui-tag-"+g),$tag.length<=0||(clearInterval($tag.data("timer")),$tag.remove(),$(d).off("keypress",e).removeClass(b["class"]),$(d).length>0&&($(d)[0].style.cssText=i),"function"==typeof b.onHide&&b.onHide())}var f=d.id,g=w2utils.escapeId(d.id);if(""===a||null==a)$("#w2ui-tag-"+g).css("opacity",0),setTimeout(function(){clearInterval($("#w2ui-tag-"+g).data("timer")),$("#w2ui-tag-"+g).remove()},300);else{clearInterval($("#w2ui-tag-"+g).data("timer")),$("#w2ui-tag-"+g).remove(),$("body").append('<div id="w2ui-tag-'+f+'" class="w2ui-tag '+($(d).parents(".w2ui-popup").length>0?"w2ui-tag-popup":"")+'" style=""></div>');var h=setInterval(function(){return 0===$(d).length||0===$(d).offset().left&&0===$(d).offset().top?(clearInterval($("#w2ui-tag-"+g).data("timer")),void e()):void($("#w2ui-tag-"+g).data("position")!==$(d).offset().left+d.offsetWidth+"x"+$(d).offset().top&&$("#w2ui-tag-"+g).css({"-webkit-transition":".2s","-moz-transition":".2s","-ms-transition":".2s","-o-transition":".2s",left:$(d).offset().left+d.offsetWidth+"px",top:$(d).offset().top+"px"}).data("position",$(d).offset().left+d.offsetWidth+"x"+$(d).offset().top))},100);setTimeout(function(){$(d).offset()&&($("#w2ui-tag-"+g).css({opacity:"1",left:$(d).offset().left+d.offsetWidth+"px",top:$(d).offset().top+"px"}).html('<div style="margin-top: -2px 0px 0px -2px; white-space: nowrap;"> <div class="w2ui-tag-body">'+a+"</div> </div>").data("text",a).data("taged-el",d).data("options",b).data("position",$(d).offset().left+d.offsetWidth+"x"+$(d).offset().top).data("timer",h),$(d).off("keypress",e).on("keypress",e).off("change",e).on("change",e).css(b.css).addClass(b["class"]),"function"==typeof b.onShow&&b.onShow())},1);var i="";$(d).length>0&&(i=$(d)[0].style.cssText)}})},$.fn.w2overlay=function(a,b){function c(){var a=$("#w2ui-overlay"+g);if(a.data("element")===f[0]&&0!==a.length){var b=$(f).offset().left+"x"+$(f).offset().top;a.data("position")!==b?d():setTimeout(c,250)}}function d(){var a=$("#w2ui-overlay"+g);if(a.data("keepOpen")===!0)return void a.removeData("keepOpen");var c;"function"==typeof b.onHide&&(c=b.onHide()),c!==!1&&(a.remove(),$(document).off("click",d),clearInterval(a.data("timer")))}function e(){var a=$("#w2ui-overlay"+g),c=a.find(" > div");if(a.length>0){c.height("auto").width("auto");var d=!1,h=!1,i=c.height(),j=c.width();switch(b.width&&b.width<j&&(j=b.width),30>j&&(j=30),b.tmp.contentHeight&&(i=b.tmp.contentHeight,c.height(i),setTimeout(function(){c.height()>c.find("div.menu > table").height()&&c.find("div.menu").css("overflow-y","hidden")},1),setTimeout(function(){c.find("div.menu").css("overflow-y","auto")},10)),b.tmp.contentWidth&&(j=b.tmp.contentWidth,c.width(j),setTimeout(function(){c.width()>c.find("div.menu > table").width()&&c.find("div.menu").css("overflow-x","hidden")},1),setTimeout(function(){c.find("div.menu").css("overflow-y","auto")},10)),b.align){case"both":b.left=17,0===b.width&&(b.width=w2utils.getSize($(f),"width"));break;case"left":b.left=17;break;case"right":b.tipLeft=j-45,b.left=w2utils.getSize($(f),"width")-j+10}var k=(j-17)/2,l=b.left,m=b.width,n=b.tipLeft;m=30!==j||m?b.width?b.width:"auto":30,25>k&&(l=25-k,n=Math.floor(k)),a.css({top:f.offset().top+w2utils.getSize(f,"height")+b.top+7+"px",left:(f.offset().left>25?f.offset().left:25)+l+"px","min-width":m,"min-height":b.height?b.height:"auto"});var o=window.innerHeight+$(document).scrollTop()-c.offset().top-7,p=window.innerWidth+$(document).scrollLeft()-c.offset().left-7;o>-50&&210>o||b.openAbove===!0?(o=c.offset().top-$(document).scrollTop()-7,b.maxHeight&&o>b.maxHeight&&(o=b.maxHeight),i>o&&(h=!0,c.height(o).width(j).css({"overflow-y":"auto"}),i=o),a.css("top",$(f).offset().top-i-24+b.top+"px"),a.find(">style").html("#w2ui-overlay"+g+":before { display: none; margin-left: "+parseInt(n)+"px; }#w2ui-overlay"+g+":after { display: block; margin-left: "+parseInt(n)+"px; }")):(b.maxHeight&&o>b.maxHeight&&(o=b.maxHeight),i>o&&(h=!0,c.height(o).width(j).css({"overflow-y":"auto"})),a.find(">style").html("#w2ui-overlay"+g+":before { display: block; margin-left: "+parseInt(n)+"px; }#w2ui-overlay"+g+":after { display: none; margin-left: "+parseInt(n)+"px; }")),j=c.width(),p=window.innerWidth+$(document).scrollLeft()-c.offset().left-7,b.maxWidth&&p>b.maxWidth&&(p=b.maxWidth),j>p&&"both"!==b.align&&(b.align="right",setTimeout(function(){e()},1)),h&&d&&c.width(j+w2utils.scrollBarSize()+2)}}var f=this,g="",h={name:null,html:"",align:"none",left:0,top:0,tipLeft:30,width:0,height:0,maxWidth:null,maxHeight:null,style:"","class":"",onShow:null,onHide:null,openAbove:!1,tmp:{}};1==arguments.length&&(b="object"==typeof a?a:{html:a}),2==arguments.length&&(b.html=a),$.isPlainObject(b)||(b={}),b=$.extend({},h,b),b.name&&(g="-"+b.name);var i;if(0===this.length||""===b.html||null==b.html)return $("#w2ui-overlay"+g).length>0?(i=$("#w2ui-overlay"+g)[0].hide,"function"==typeof i&&i()):$("#w2ui-overlay"+g).remove(),$(this);$("#w2ui-overlay"+g).length>0&&(i=$("#w2ui-overlay"+g)[0].hide,$(document).off("click",i),"function"==typeof i&&i()),$("body").append('<div id="w2ui-overlay'+g+'" style="display: none"        class="w2ui-reset w2ui-overlay '+($(this).parents(".w2ui-popup, .w2ui-overlay-popup").length>0?"w2ui-overlay-popup":"")+'">    <style></style>    <div style="'+b.style+'" class="'+b["class"]+'"></div></div>');var j=$("#w2ui-overlay"+g),k=j.find(" > div");k.html(b.html);var l=k.css("background-color");return null!=l&&"rgba(0, 0, 0, 0)"!==l&&"transparent"!==l&&j.css("background-color",l),j.data("element",f.length>0?f[0]:null).data("options",b).data("position",$(f).offset().left+"x"+$(f).offset().top).fadeIn("fast").on("mousedown",function(a){$("#w2ui-overlay"+g).data("keepOpen",!0),-1===["INPUT","TEXTAREA","SELECT"].indexOf(a.target.tagName)&&a.preventDefault()}),j[0].hide=d,j[0].resize=e,e(),setTimeout(function(){e(),$(document).off("click",d).on("click",d),"function"==typeof b.onShow&&b.onShow()},10),c(),$(this)},$.fn.w2menu=function(a,b){function c(){setTimeout(function(){$("#w2ui-overlay"+h+" tr.w2ui-selected").removeClass("w2ui-selected");var a=$("#w2ui-overlay"+h+" tr[index="+b.index+"]"),c=$("#w2ui-overlay"+h+" div.menu").scrollTop();if(a.addClass("w2ui-selected"),b.tmp&&(b.tmp.contentHeight=$("#w2ui-overlay"+h+" table").height()+(b.search?50:10)),b.tmp&&(b.tmp.contentWidth=$("#w2ui-overlay"+h+" table").width()),$("#w2ui-overlay"+h).length>0&&$("#w2ui-overlay"+h)[0].resize(),a.length>0){var d=a[0].offsetTop-5,e=$("#w2ui-overlay"+h+" div.menu"),f=e.height();$("#w2ui-overlay"+h+" div.menu").scrollTop(c),(c>d||d+a.height()>c+f)&&$("#w2ui-overlay"+h+" div.menu").animate({scrollTop:d-(f-2*a.height())/2},200,"linear")}},1)}function d(a){var d=this.value,e=a.keyCode,f=!1;switch(e){case 13:$("#w2ui-overlay"+h).remove(),$.fn.w2menuHandler(a,b.index);break;case 9:case 27:$("#w2ui-overlay"+h).remove(),$.fn.w2menuHandler(a,-1);break;case 38:for(b.index=w2utils.isInt(b.index)?parseInt(b.index):0,b.index--;b.index>0&&b.items[b.index].hidden;)b.index--;if(0===b.index&&b.items[b.index].hidden)for(;b.items[b.index]&&b.items[b.index].hidden;)b.index++;b.index<0&&(b.index=0),f=!0;break;case 40:for(b.index=w2utils.isInt(b.index)?parseInt(b.index):0,b.index++;b.index<b.items.length-1&&b.items[b.index].hidden;)b.index++;if(b.index===b.items.length-1&&b.items[b.index].hidden)for(;b.items[b.index]&&b.items[b.index].hidden;)b.index--;b.index>=b.items.length&&(b.index=b.items.length-1),f=!0}if(!f){var i=0;for(var j in b.items){var k=b.items[j],l="",m="";-1!==["is","begins with"].indexOf(b.match)&&(l="^"),-1!==["is","ends with"].indexOf(b.match)&&(m="$");try{var n=new RegExp(l+d+m,"i");k.hidden=n.test(k.text)||"..."===k.text?!1:!0}catch(o){}"enum"===g.type&&-1!==$.inArray(k.id,ids)&&(k.hidden=!0),k.hidden!==!0&&i++}for(b.index=0;b.index<b.items.length-1&&b.items[b.index].hidden;)b.index++;
	0>=i&&(b.index=-1)}$(g).w2menu("refresh",b),c()}function e(){if(b.spinner)return'<table class="w2ui-drop-menu"><tr><td style="padding: 5px 10px 10px 10px; text-align: center">    <div class="w2ui-spinner" style="width: 18px; height: 18px; position: relative; top: 5px;"></div>     <div style="display: inline-block; padding: 3px; color: #999;">'+w2utils.lang("Loading...")+"</div></td></tr></table>";for(var a=0,c='<table cellspacing="0" cellpadding="0" class="w2ui-drop-menu">',d=null,e=null,f=0;f<b.items.length;f++){var g=b.items[f];if("string"==typeof g?g={id:g,text:g}:(null!=g.text&&null==g.id&&(g.id=g.text),null==g.text&&null!=g.id&&(g.text=g.id),null!=g.caption&&(g.text=g.caption),d=g.img,e=g.icon,null==d&&(d=null),null==e&&(e=null)),g.hidden!==!0){var i="",j=g.text;if("function"==typeof b.render&&(j=b.render(g,b)),d&&(i='<td class="menu-icon"><div class="w2ui-tb-image w2ui-icon '+d+'"></div></td>'),e&&(i='<td class="menu-icon" align="center"><span class="w2ui-icon '+e+'"></span></td>'),"undefined"==typeof j||""===j||/^-+$/.test(j))c+='<tr><td colspan="2" style="padding: 6px; pointer-events: none"><div style="border-top: 1px solid silver;"></div></td></tr>';else{var k=a%2===0?"w2ui-item-even":"w2ui-item-odd";b.altRows!==!0&&(k="");var l=1;""==i&&l++,null==g.count&&l++,c+='<tr index="'+f+'" style="'+(g.style?g.style:"")+'"         class="'+k+" "+(b.index===f?"w2ui-selected":"")+" "+(g.disabled===!0?"w2ui-disabled":"")+"\"        onmousedown=\"$(this).parent().find('tr').removeClass('w2ui-selected'); $(this).addClass('w2ui-selected');\"        onclick=\"event.stopPropagation();                if ("+(g.disabled===!0?"true":"false")+") return;               $('#w2ui-overlay"+h+"').remove();                $.fn.w2menuHandler(event, '"+f+"');\">"+i+'   <td class="menu-text" colspan="'+l+'">'+j+'</td>   <td class="menu-count">'+(null!=g.count?"<span>"+g.count+"</span>":"")+"</td></tr>",a++}}b.items[f]=g}return 0===a&&(c+='<tr><td style="padding: 13px; color: #999; text-align: center">'+b.msgNoItems+"</div></td></tr>"),c+="</table>"}var f={index:null,items:[],render:null,msgNoItems:"No items",onSelect:null,tmp:{}},g=this,h="";if("refresh"!==a){1===arguments.length?b=a:b.items=a,"object"!=typeof b&&(b={}),b=$.extend({},f,b),$.fn.w2menuOptions=b,b.name&&(h="-"+b.name),"function"==typeof b.select&&"function"!=typeof b.onSelect&&(b.onSelect=b.select),"function"==typeof b.onRender&&"function"!=typeof b.render&&(b.render=b.onRender),$.fn.w2menuHandler=function(a,c){"function"==typeof b.onSelect&&setTimeout(function(){b.onSelect({index:c,item:b.items[c],originalEvent:a})},10)};var i="";if(b.search){i+='<div style="position: absolute; top: 0px; height: 40px; left: 0px; right: 0px; border-bottom: 1px solid silver; background-color: #ECECEC; padding: 8px 5px;">    <div class="w2ui-icon icon-search" style="position: absolute; margin-top: 4px; margin-left: 6px; width: 11px; background-position: left !important;"></div>    <input id="menu-search" type="text" style="width: 100%; outline: none; padding-left: 20px;" onclick="event.stopPropagation();"></div>',b.style+=";background-color: #ECECEC",b.index=0;for(var j in b.items)b.items[j].hidden=!1}i+='<div class="menu" style="position: absolute; top: '+(b.search?40:0)+'px; bottom: 0px; width: 100%; overflow: auto;">'+e()+"</div>";var k=$(this).w2overlay(i,b);return setTimeout(function(){if($("#w2ui-overlay"+h+" #menu-search").on("keyup",d).on("keydown",function(a){9===a.keyCode&&(a.stopPropagation(),a.preventDefault())}),b.search){if(-1!=["text","password"].indexOf($(g)[0].type)||"texarea"==$(g)[0].tagName)return;$("#w2ui-overlay"+h+" #menu-search").focus()}},200),c(),k}if($("#w2ui-overlay"+h).length>0){b=$.extend($.fn.w2menuOptions,b);var l=$("#w2ui-overlay"+h+" div.menu").scrollTop();$("#w2ui-overlay"+h+" div.menu").html(e()),$("#w2ui-overlay"+h+" div.menu").scrollTop(l),c()}else $(this).w2menu(b)}}(),function(){var w2grid=function(a){this.name=null,this.box=null,this.header="",this.url="",this.routeData={},this.columns=[],this.columnGroups=[],this.records=[],this.summary=[],this.searches=[],this.searchData=[],this.sortData=[],this.postData={},this.toolbar={},this.show={header:!1,toolbar:!1,footer:!1,columnHeaders:!0,lineNumbers:!1,expandColumn:!1,selectColumn:!1,emptyRecords:!0,toolbarReload:!0,toolbarColumns:!0,toolbarSearch:!0,toolbarAdd:!1,toolbarEdit:!1,toolbarDelete:!1,toolbarSave:!1,selectionBorder:!0,recordTitles:!0,skipRecords:!0},this.autoLoad=!0,this.fixedBody=!0,this.recordHeight=24,this.keyboard=!0,this.selectType="row",this.multiSearch=!0,this.multiSelect=!0,this.multiSort=!0,this.reorderColumns=!1,this.reorderRows=!1,this.markSearch=!0,this.total=0,this.limit=100,this.offset=0,this.style="",this.ranges=[],this.menu=[],this.method=null,this.recid=null,this.parser=null,this.onAdd=null,this.onEdit=null,this.onRequest=null,this.onLoad=null,this.onDelete=null,this.onDeleted=null,this.onSubmit=null,this.onSave=null,this.onSelect=null,this.onUnselect=null,this.onClick=null,this.onDblClick=null,this.onContextMenu=null,this.onMenuClick=null,this.onColumnClick=null,this.onColumnResize=null,this.onSort=null,this.onSearch=null,this.onChange=null,this.onRestore=null,this.onExpand=null,this.onCollapse=null,this.onError=null,this.onKeydown=null,this.onToolbar=null,this.onColumnOnOff=null,this.onCopy=null,this.onPaste=null,this.onSelectionExtend=null,this.onEditField=null,this.onRender=null,this.onRefresh=null,this.onReload=null,this.onResize=null,this.onDestroy=null,this.onStateSave=null,this.onStateRestore=null,this.last={field:"all",caption:w2utils.lang("All Fields"),logic:"OR",search:"",searchIds:[],selection:{indexes:[],columns:{}},multi:!1,scrollTop:0,scrollLeft:0,sortData:null,sortCount:0,xhr:null,range_start:null,range_end:null,sel_ind:null,sel_col:null,sel_type:null,edit_col:null},$.extend(!0,this,w2obj.grid,a)};$.fn.w2grid=function(a){if("object"==typeof a||!a){if(!w2utils.checkName(a,"w2grid"))return;var b=a.columns,c=a.columnGroups,d=a.records,e=a.searches,f=a.searchData,g=a.sortData,h=a.postData,i=a.toolbar,j=new w2grid(a);$.extend(j,{postData:{},records:[],columns:[],searches:[],toolbar:{},sortData:[],searchData:[],handlers:[]}),null!=j.onExpand&&(j.show.expandColumn=!0),$.extend(!0,j.toolbar,i);for(var k in b)j.columns[k]=$.extend(!0,{},b[k]);for(var k in c)j.columnGroups[k]=$.extend(!0,{},c[k]);for(var k in e)j.searches[k]=$.extend(!0,{},e[k]);for(var k in f)j.searchData[k]=$.extend(!0,{},f[k]);for(var k in g)j.sortData[k]=$.extend(!0,{},g[k]);j.postData=$.extend(!0,{},h);for(var l in d){if(null==d[l].recid||"undefined"==typeof d[l].recid)return void console.log("ERROR: Cannot add records without recid. (obj: "+j.name+")");j.records[l]=$.extend(!0,{},d[l])}for(var m in j.columns){var n=j.columns[m];if("undefined"!=typeof n.searchable&&null==j.getSearch(n.field)){var o=n.searchable,p="";n.searchable===!0&&(o="text",p='size="20"'),j.addSearch({field:n.field,caption:n.caption,type:o,attr:p})}}return j.initToolbar(),0!==$(this).length&&j.render($(this)[0]),w2ui[j.name]=j,j}if(w2ui[$(this).attr("name")]){var q=w2ui[$(this).attr("name")];return q[a].apply(q,Array.prototype.slice.call(arguments,1)),this}console.log("ERROR: Method "+a+" does not exist on jQuery.w2grid")},w2grid.prototype={msgDelete:w2utils.lang("Are you sure you want to delete selected records?"),msgNotJSON:w2utils.lang("Returned data is not in valid JSON format."),msgAJAXerror:w2utils.lang("AJAX error. See console for more details."),msgRefresh:w2utils.lang("Refreshing..."),buttons:{reload:{type:"button",id:"w2ui-reload",icon:"w2ui-icon-reload",hint:w2utils.lang("Reload data in the list")},columns:{type:"drop",id:"w2ui-column-on-off",icon:"w2ui-icon-columns",hint:w2utils.lang("Show/hide columns"),arrow:!1,html:""},search:{type:"html",id:"w2ui-search",html:'<div class="w2ui-icon icon-search-down w2ui-search-down" title="Select Search Field" onclick="var obj = w2ui[$(this).parents(\'div.w2ui-grid\').attr(\'name\')]; obj.searchShowFields();"></div>'},"search-go":{type:"check",id:"w2ui-search-advanced",caption:w2utils.lang("Search..."),hint:w2utils.lang("Open Search Fields")},add:{type:"button",id:"w2ui-add",caption:w2utils.lang("Add New"),hint:w2utils.lang("Add new record"),icon:"w2ui-icon-plus"},edit:{type:"button",id:"w2ui-edit",caption:w2utils.lang("Edit"),hint:w2utils.lang("Edit selected record"),icon:"w2ui-icon-pencil",disabled:!0},"delete":{type:"button",id:"w2ui-delete",caption:w2utils.lang("Delete"),hint:w2utils.lang("Delete selected records"),icon:"w2ui-icon-cross",disabled:!0},save:{type:"button",id:"w2ui-save",caption:w2utils.lang("Save"),hint:w2utils.lang("Save changed records"),icon:"w2ui-icon-check"}},add:function(a){$.isArray(a)||(a=[a]);var b=0;for(var c in a)this.recid&&"undefined"==typeof a[c].recid&&(a[c].recid=a[c][this.recid]),null!=a[c].recid&&"undefined"!=typeof a[c].recid?(this.records.push(a[c]),b++):console.log("ERROR: Cannot add record without recid. (obj: "+this.name+")");var d="object"!=typeof this.url?this.url:this.url.get;return d||(this.total=this.records.length,this.localSort(),this.localSearch()),this.refresh(),b},find:function(a,b){("undefined"==typeof a||null==a)&&(a={});var c=[],d=!1;for(var e in a)-1!=String(e).indexOf(".")&&(d=!0);for(var f=0;f<this.records.length;f++){var g=!0;for(var e in a){var h=this.records[f][e];d&&-1!=String(e).indexOf(".")&&(h=this.parseField(this.records[f],e)),a[e]!=h&&(g=!1)}g&&b!==!0&&c.push(this.records[f].recid),g&&b===!0&&c.push(f)}return c},set:function(a,b,c){if("object"==typeof a&&(c=b,b=a,a=null),null==a){for(var d in this.records)$.extend(!0,this.records[d],b);c!==!0&&this.refresh()}else{var e=this.get(a,!0);if(null==e)return!1;var f=this.records[e]&&this.records[e].recid==a?!1:!0;f?$.extend(!0,this.summary[e],b):$.extend(!0,this.records[e],b),c!==!0&&this.refreshRow(a)}return!0},get:function(a,b){for(var c=0;c<this.records.length;c++)if(this.records[c].recid==a)return b===!0?c:this.records[c];for(var c=0;c<this.summary.length;c++)if(this.summary[c].recid==a)return b===!0?c:this.summary[c];return null},remove:function(){for(var a=0,b=0;b<arguments.length;b++)for(var c=this.records.length-1;c>=0;c--)this.records[c].recid==arguments[b]&&(this.records.splice(c,1),a++);var d="object"!=typeof this.url?this.url:this.url.get;return d||(this.localSort(),this.localSearch()),this.refresh(),a},addColumn:function(a,b){var c=0;1==arguments.length?(b=a,a=this.columns.length):("string"==typeof a&&(a=this.getColumn(a,!0)),null===a&&(a=this.columns.length)),$.isArray(b)||(b=[b]);for(var d in b)this.columns.splice(a,0,b[d]),a++,c++;return this.refresh(),c},removeColumn:function(){for(var a=0,b=0;b<arguments.length;b++)for(var c=this.columns.length-1;c>=0;c--)this.columns[c].field==arguments[b]&&(this.columns.splice(c,1),a++);return this.refresh(),a},getColumn:function(a,b){for(var c=0;c<this.columns.length;c++)if(this.columns[c].field==a)return b===!0?c:this.columns[c];return null},toggleColumn:function(){for(var a=0,b=0;b<arguments.length;b++)for(var c=this.columns.length-1;c>=0;c--){var d=this.columns[c];d.field==arguments[b]&&(d.hidden=!d.hidden,a++)}return this.refresh(),a},showColumn:function(){for(var a=0,b=0;b<arguments.length;b++)for(var c=this.columns.length-1;c>=0;c--){var d=this.columns[c];d.gridMinWidth&&delete d.gridMinWidth,d.field==arguments[b]&&d.hidden!==!1&&(d.hidden=!1,a++)}return this.refresh(),a},hideColumn:function(){for(var a=0,b=0;b<arguments.length;b++)for(var c=this.columns.length-1;c>=0;c--){var d=this.columns[c];d.field==arguments[b]&&d.hidden!==!0&&(d.hidden=!0,a++)}return this.refresh(),a},addSearch:function(a,b){var c=0;1==arguments.length?(b=a,a=this.searches.length):("string"==typeof a&&(a=this.getSearch(a,!0)),null===a&&(a=this.searches.length)),$.isArray(b)||(b=[b]);for(var d in b)this.searches.splice(a,0,b[d]),a++,c++;return this.searchClose(),c},removeSearch:function(){for(var a=0,b=0;b<arguments.length;b++)for(var c=this.searches.length-1;c>=0;c--)this.searches[c].field==arguments[b]&&(this.searches.splice(c,1),a++);return this.searchClose(),a},getSearch:function(a,b){for(var c=0;c<this.searches.length;c++)if(this.searches[c].field==a)return b===!0?c:this.searches[c];return null},toggleSearch:function(){for(var a=0,b=0;b<arguments.length;b++)for(var c=this.searches.length-1;c>=0;c--)this.searches[c].field==arguments[b]&&(this.searches[c].hidden=!this.searches[c].hidden,a++);return this.searchClose(),a},showSearch:function(){for(var a=0,b=0;b<arguments.length;b++)for(var c=this.searches.length-1;c>=0;c--)this.searches[c].field==arguments[b]&&this.searches[c].hidden!==!1&&(this.searches[c].hidden=!1,a++);return this.searchClose(),a},hideSearch:function(){for(var a=0,b=0;b<arguments.length;b++)for(var c=this.searches.length-1;c>=0;c--)this.searches[c].field==arguments[b]&&this.searches[c].hidden!==!0&&(this.searches[c].hidden=!0,a++);return this.searchClose(),a},getSearchData:function(a){for(var b in this.searchData)if(this.searchData[b].field==a)return this.searchData[b];return null},localSort:function(a){var b="object"!=typeof this.url?this.url:this.url.get;if(b)return void console.log("ERROR: grid.localSort can only be used on local data source, grid.url should be empty.");if(!$.isEmptyObject(this.sortData)){var c=(new Date).getTime(),d=this;d.prepareData();for(var e in this.sortData){var f=this.getColumn(this.sortData[e].field);if(!f)return;"string"==typeof f.render&&(-1!=["date","age"].indexOf(f.render.split(":")[0])&&(this.sortData[e].field_=f.field+"_"),-1!=["time"].indexOf(f.render.split(":")[0])&&(this.sortData[e].field_=f.field+"_"))}return this.records.sort(function(a,b){var c=0;for(var e in d.sortData){var f=d.sortData[e].field;d.sortData[e].field_&&(f=d.sortData[e].field_);var g=a[f],h=b[f];if(-1!=String(f).indexOf(".")&&(g=d.parseField(a,f),h=d.parseField(b,f)),"string"==typeof g&&(g=$.trim(g.toLowerCase())),"string"==typeof h&&(h=$.trim(h.toLowerCase())),g>h&&(c="asc"==d.sortData[e].direction?1:-1),h>g&&(c="asc"==d.sortData[e].direction?-1:1),"object"!=typeof g&&"object"==typeof h&&(c=-1),"object"!=typeof h&&"object"==typeof g&&(c=1),null==g&&null!=h&&(c=1),null!=g&&null==h&&(c=-1),0!=c)break}return c}),c=(new Date).getTime()-c,a!==!0&&setTimeout(function(){d.status(w2utils.lang("Sorting took")+" "+c/1e3+" "+w2utils.lang("sec"))},10),c}},localSearch:function(a){var b="object"!=typeof this.url?this.url:this.url.get;if(b)return void console.log("ERROR: grid.localSearch can only be used on local data source, grid.url should be empty.");var c=(new Date).getTime(),d=this;if(this.total=this.records.length,this.last.searchIds=[],this.prepareData(),this.searchData.length>0&&!b){this.total=0;for(var e in this.records){var f=this.records[e],g=0;for(var h in this.searchData){var i=this.searchData[h],j=this.getSearch(i.field);if(null!=i){null==j&&(j={field:i.field,type:i.type});var k=String(d.parseField(f,j.field)).toLowerCase();if("undefined"!=typeof i.value)if($.isArray(i.value))var l=i.value[0],m=i.value[1];else var l=String(i.value).toLowerCase();switch(i.operator){case"is":if(f[j.field]==i.value&&g++,"date"==j.type){var k=w2utils.formatDate(f[j.field+"_"],"yyyy-mm-dd"),l=w2utils.formatDate(l,"yyyy-mm-dd");k==l&&g++}if("time"==j.type){var k=w2utils.formatTime(f[j.field+"_"],"h24:mi"),l=w2utils.formatTime(l,"h24:mi");k==l&&g++}break;case"between":if(-1!=["int","float","money","currency","percent"].indexOf(j.type)&&parseFloat(f[j.field])>=parseFloat(l)&&parseFloat(f[j.field])<=parseFloat(m)&&g++,"date"==j.type){var k=f[j.field+"_"],l=w2utils.isDate(l,w2utils.settings.date_format,!0),m=w2utils.isDate(m,w2utils.settings.date_format,!0);null!=m&&(m=new Date(m.getTime()+864e5)),k>=l&&m>k&&g++}if("time"==j.type){var k=f[j.field+"_"],l=w2utils.isTime(l,!0),m=w2utils.isTime(m,!0);l=(new Date).setHours(l.hours,l.minutes,l.seconds?l.seconds:0,0),m=(new Date).setHours(m.hours,m.minutes,m.seconds?m.seconds:0,0),k>=l&&m>k&&g++}break;case"in":var n=i.value;i.svalue&&(n=i.svalue),-1!==n.indexOf(k)&&g++;break;case"not in":var n=i.value;i.svalue&&(n=i.svalue),-1==n.indexOf(k)&&g++;break;case"begins":case"begins with":0==k.indexOf(l)&&g++;break;case"contains":k.indexOf(l)>=0&&g++;break;case"ends":case"ends with":k.indexOf(l)>=0&&k.indexOf(l)==k.length-l.length&&g++}}}("OR"==this.last.logic&&0!=g||"AND"==this.last.logic&&g==this.searchData.length)&&this.last.searchIds.push(parseInt(e))}this.total=this.last.searchIds.length}return c=(new Date).getTime()-c,a!==!0&&setTimeout(function(){d.status(w2utils.lang("Search took")+" "+c/1e3+" "+w2utils.lang("sec"))},10),c},getRangeData:function(a,b){var c=this.get(a[0].recid,!0),d=this.get(a[1].recid,!0),e=a[0].column,f=a[1].column,g=[];if(e==f)for(var h=c;d>=h;h++){var i=this.records[h],j=i[this.columns[e].field]||null;g.push(b!==!0?j:{data:j,column:e,index:h,record:i})}else if(c==d)for(var i=this.records[c],k=e;f>=k;k++){var j=i[this.columns[k].field]||null;g.push(b!==!0?j:{data:j,column:k,index:c,record:i})}else for(var h=c;d>=h;h++){var i=this.records[h];g.push([]);for(var k=e;f>=k;k++){var j=i[this.columns[k].field];g[g.length-1].push(b!==!0?j:{data:j,column:k,index:h,record:i})}}return g},addRange:function(a){var b=0;if("row"==this.selectType)return b;$.isArray(a)||(a=[a]);for(var c in a){if("object"!=typeof a[c]&&(a[c]={name:"selection"}),"selection"==a[c].name){if(this.show.selectionBorder===!1)continue;var d=this.getSelection();if(0==d.length){this.removeRange(a[c].name);continue}{var e=d[0],f=d[d.length-1];$("#grid_"+this.name+"_rec_"+e.recid+" td[col="+e.column+"]"),$("#grid_"+this.name+"_rec_"+f.recid+" td[col="+f.column+"]")}}else{var e=a[c].range[0],f=a[c].range[1];$("#grid_"+this.name+"_rec_"+e.recid+" td[col="+e.column+"]"),$("#grid_"+this.name+"_rec_"+f.recid+" td[col="+f.column+"]")}if(e){var g={name:a[c].name,range:[{recid:e.recid,column:e.column},{recid:f.recid,column:f.column}],style:a[c].style||""},h=!1;for(var i in this.ranges)if(this.ranges[i].name==a[c].name){h=c;break}h!==!1?this.ranges[h]=g:this.ranges.push(g),b++}}return this.refreshRanges(),b},removeRange:function(){for(var a=0,b=0;b<arguments.length;b++){var c=arguments[b];$("#grid_"+this.name+"_"+c).remove();for(var d=this.ranges.length-1;d>=0;d--)this.ranges[d].name==c&&(this.ranges.splice(d,1),a++)}return a},refreshRanges:function(){function a(a){var e=d.getSelection();d.last.move={type:"expand",x:a.screenX,y:a.screenY,divX:0,divY:0,recid:e[0].recid,column:e[0].column,originalRange:[{recid:e[0].recid,column:e[0].column},{recid:e[e.length-1].recid,column:e[e.length-1].column}],newRange:[{recid:e[0].recid,column:e[0].column},{recid:e[e.length-1].recid,column:e[e.length-1].column}]},$(document).off("mousemove",b).on("mousemove",b),$(document).off("mouseup",c).on("mouseup",c)}function b(a){var b=d.last.move;if(b&&"expand"==b.type){b.divX=a.screenX-b.x,b.divY=a.screenY-b.y;var c,e,f=a.originalEvent.target;if("TD"!=f.tagName&&(f=$(f).parents("td")[0]),"undefined"!=typeof $(f).attr("col")&&(e=parseInt($(f).attr("col"))),f=$(f).parents("tr")[0],c=$(f).attr("recid"),b.newRange[1].recid!=c||b.newRange[1].column!=e){var g=$.extend({},b.newRange);return b.newRange=[{recid:b.recid,column:b.column},{recid:c,column:e}],m=d.trigger($.extend(m,{originalRange:b.originalRange,newRange:b.newRange})),m.isCancelled===!0?(b.newRange=g,void(m.newRange=g)):(d.removeRange("grid-selection-expand"),void d.addRange({name:"grid-selection-expand",range:m.newRange,style:"background-color: rgba(100,100,100,0.1); border: 2px dotted rgba(100,100,100,0.5);"}))}}}function c(){d.removeRange("grid-selection-expand"),delete d.last.move,$(document).off("mousemove",b),$(document).off("mouseup",c),d.trigger($.extend(m,{phase:"after"}))}var d=this,e=(new Date).getTime(),f=$("#grid_"+this.name+"_records");for(var g in this.ranges){var h=this.ranges[g],i=h.range[0],j=h.range[1],k=$("#grid_"+this.name+"_rec_"+i.recid+" td[col="+i.column+"]"),l=$("#grid_"+this.name+"_rec_"+j.recid+" td[col="+j.column+"]");0==$("#grid_"+this.name+"_"+h.name).length?f.append('<div id="grid_'+this.name+"_"+h.name+'" class="w2ui-selection" style="'+h.style+'">'+("selection"==h.name?'<div id="grid_'+this.name+'_resizer" class="w2ui-selection-resizer"></div>':"")+"</div>"):$("#grid_"+this.name+"_"+h.name).attr("style",h.style),k.length>0&&l.length>0&&$("#grid_"+this.name+"_"+h.name).css({left:k.position().left-1+f.scrollLeft()+"px",top:k.position().top-1+f.scrollTop()+"px",width:l.position().left-k.position().left+l.width()+3+"px",height:l.position().top-k.position().top+l.height()+3+"px"})}$(this.box).find("#grid_"+this.name+"_resizer").off("mousedown").on("mousedown",a);var m={phase:"before",type:"selectionExtend",target:d.name,originalRange:null,newRange:null};return(new Date).getTime()-e},select:function(){var a=0,b=this.last.selection;this.multiSelect||this.selectNone();for(var c=0;c<arguments.length;c++){var d="object"==typeof arguments[c]?arguments[c].recid:arguments[c],e=this.get(d);if(null!=e){var f=this.get(d,!0),g=$("#grid_"+this.name+"_rec_"+w2utils.escapeId(d));if("row"==this.selectType){if(b.indexes.indexOf(f)>=0)continue;var h=this.trigger({phase:"before",type:"select",target:this.name,recid:d,index:f});if(h.isCancelled===!0)continue;b.indexes.push(f),b.indexes.sort(function(a,b){return a-b}),g.addClass("w2ui-selected").data("selected","yes"),g.find(".w2ui-grid-select-check").prop("checked",!0),a++}else{var i=arguments[c].column;if(!w2utils.isInt(i)){var j=[];for(var k in this.columns)this.columns[k].hidden||j.push({recid:d,column:parseInt(k)});return this.multiSelect||(j=j.splice(0,1)),this.select.apply(this,j)}var l=b.columns[f]||[];if($.isArray(l)&&-1!=l.indexOf(i))continue;var h=this.trigger({phase:"before",type:"select",target:this.name,recid:d,index:f,column:i});if(h.isCancelled===!0)continue;-1==b.indexes.indexOf(f)&&(b.indexes.push(f),b.indexes.sort(function(a,b){return a-b})),l.push(i),l.sort(function(a,b){return a-b}),g.find(" > td[col="+i+"]").addClass("w2ui-selected"),a++,g.data("selected","yes"),g.find(".w2ui-grid-select-check").prop("checked",!0),b.columns[f]=l}this.trigger($.extend(h,{phase:"after"}))}}return b.indexes.length==this.records.length||0!==this.searchData.length&&b.indexes.length==this.last.searchIds.length?$("#grid_"+this.name+"_check_all").prop("checked",!0):$("#grid_"+this.name+"_check_all").prop("checked",!1),this.status(),this.addRange("selection"),a},unselect:function(){for(var a=0,b=this.last.selection,c=0;c<arguments.length;c++){var d="object"==typeof arguments[c]?arguments[c].recid:arguments[c],e=this.get(d);if(null!=e){var f=this.get(e.recid,!0),g=$("#grid_"+this.name+"_rec_"+w2utils.escapeId(d));if("row"==this.selectType){if(-1==b.indexes.indexOf(f))continue;var h=this.trigger({phase:"before",type:"unselect",target:this.name,recid:d,index:f});if(h.isCancelled===!0)continue;b.indexes.splice(b.indexes.indexOf(f),1),g.removeClass("w2ui-selected").removeData("selected"),0!=g.length&&(g[0].style.cssText="height: "+this.recordHeight+"px; "+g.attr("custom_style")),g.find(".w2ui-grid-select-check").prop("checked",!1),a++}else{var i=arguments[c].column;if(!w2utils.isInt(i)){var j=[];for(var k in this.columns)this.columns[k].hidden||j.push({recid:d,column:parseInt(k)});return this.unselect.apply(this,j)}var l=b.columns[f];if(!$.isArray(l)||-1==l.indexOf(i))continue;var h=this.trigger({phase:"before",type:"unselect",target:this.name,recid:d,column:i});if(h.isCancelled===!0)continue;l.splice(l.indexOf(i),1),$("#grid_"+this.name+"_rec_"+w2utils.escapeId(d)+" > td[col="+i+"]").removeClass("w2ui-selected"),a++,0==l.length&&(delete b.columns[f],b.indexes.splice(b.indexes.indexOf(f),1),g.removeData("selected"),g.find(".w2ui-grid-select-check").prop("checked",!1))}this.trigger($.extend(h,{phase:"after"}))}}return b.indexes.length==this.records.length||0!==this.searchData.length&&b.indexes.length==this.last.searchIds.length?$("#grid_"+this.name+"_check_all").prop("checked",!0):$("#grid_"+this.name+"_check_all").prop("checked",!1),this.status(),this.addRange("selection"),a},selectAll:function(){if(this.multiSelect!==!1){var a=this.trigger({phase:"before",type:"select",target:this.name,all:!0});if(a.isCancelled!==!0){var b="object"!=typeof this.url?this.url:this.url.get,c=this.last.selection,d=[];for(var e in this.columns)d.push(parseInt(e));if(c.indexes=[],b||0===this.searchData.length){var f=this.records.length;0==this.searchData.length||this.url||(f=this.last.searchIds.length);for(var g=0;f>g;g++)c.indexes.push(g),"row"!=this.selectType&&(c.columns[g]=d.slice())}else for(var g=0;g<this.last.searchIds.length;g++)c.indexes.push(this.last.searchIds[g]),"row"!=this.selectType&&(c.columns[this.last.searchIds[g]]=d.slice());this.refresh();var c=this.getSelection();1==c.length?this.toolbar.enable("w2ui-edit"):this.toolbar.disable("w2ui-edit"),c.length>=1?this.toolbar.enable("w2ui-delete"):this.toolbar.disable("w2ui-delete"),this.addRange("selection"),this.trigger($.extend(a,{phase:"after"}))}}},selectNone:function(){var a=this.trigger({phase:"before",type:"unselect",target:this.name,all:!0});if(a.isCancelled!==!0){var b=this.last.selection;for(var c in b.indexes){var d=b.indexes[c],e=this.records[d],f=e?e.recid:null,g=$("#grid_"+this.name+"_rec_"+w2utils.escapeId(f));if(g.removeClass("w2ui-selected").removeData("selected"),g.find(".w2ui-grid-select-check").prop("checked",!1),"row"!=this.selectType){var h=b.columns[d];for(var i in h)g.find(" > td[col="+h[i]+"]").removeClass("w2ui-selected")}}b.indexes=[],b.columns={},this.toolbar.disable("w2ui-edit","w2ui-delete"),this.removeRange("selection"),$("#grid_"+this.name+"_check_all").prop("checked",!1),this.trigger($.extend(a,{phase:"after"}))}},getSelection:function(a){var b=[],c=this.last.selection;if("row"==this.selectType){for(var d in c.indexes)this.records[c.indexes[d]]&&b.push(a===!0?c.indexes[d]:this.records[c.indexes[d]].recid);return b}for(var d in c.indexes){var e=c.columns[c.indexes[d]];if(this.records[c.indexes[d]])for(var f in e)b.push({recid:this.records[c.indexes[d]].recid,index:parseInt(c.indexes[d]),column:e[f]})}return b},search:function(a,b){var c="object"!=typeof this.url?this.url:this.url.get,d=[],e=this.last.multi,f=this.last.logic,g=this.last.field,h=this.last.search;if(0==arguments.length){h="";for(var i in this.searches){var j=this.searches[i],k=$("#grid_"+this.name+"_operator_"+i).val(),l=$("#grid_"+this.name+"_field_"+i),m=$("#grid_"+this.name+"_field2_"+i),n=l.val(),o=m.val(),p=null;if(-1!=["int","float","money","currency","percent"].indexOf(j.type)){var q=l.data("w2field"),r=m.data("w2field");q&&(n=q.clean(n)),r&&(o=r.clean(o))}if(-1!=["list","enum"].indexOf(j.type))if(n=l.data("selected")||{},$.isArray(n)){p=[];for(var s in n)p.push(w2utils.isFloat(n[s].id)?parseFloat(n[s].id):String(n[s].id).toLowerCase()),delete n[s].hidden}else n=n.id||"";if(""!=n&&null!=n||"undefined"!=typeof o&&""!=o){var t={field:j.field,type:j.type,operator:k};"between"==k?$.extend(t,{value:[n,o]}):"in"==k&&"string"==typeof n?$.extend(t,{value:n.split(",")}):"not in"==k&&"string"==typeof n?$.extend(t,{value:n.split(",")}):$.extend(t,{value:n}),p&&$.extend(t,{svalue:p});try{"date"==j.type&&"between"==k&&(t.value[0]=n,t.value[1]=o),"date"==j.type&&"is"==k&&(t.value=n)}catch(u){}d.push(t)}}d.length>0&&!c?(e=!0,f="AND"):(e=!0,f="AND")}if("string"==typeof a&&(g=a,h=b,e=!1,f="OR","undefined"!=typeof b))if("all"==a.toLowerCase())if(this.searches.length>0)for(var i in this.searches){var j=this.searches[i];if("text"==j.type||"alphanumeric"==j.type&&w2utils.isAlphaNumeric(b)||"int"==j.type&&w2utils.isInt(b)||"float"==j.type&&w2utils.isFloat(b)||"percent"==j.type&&w2utils.isFloat(b)||"hex"==j.type&&w2utils.isHex(b)||"currency"==j.type&&w2utils.isMoney(b)||"money"==j.type&&w2utils.isMoney(b)||"date"==j.type&&w2utils.isDate(b)){var t={field:j.field,type:j.type,operator:"text"==j.type?"contains":"is",value:b};d.push(t)}if(-1!=["int","float","money","currency","percent"].indexOf(j.type)&&-1!=String(b).indexOf("-")){var v=String(b).split("-"),t={field:j.field,type:j.type,operator:"between",value:[v[0],v[1]]};d.push(t)}}else for(var w in this.columns){var t={field:this.columns[w].field,type:"text",operator:"contains",value:b};d.push(t)}else{var x=$("#grid_"+this.name+"_search_all"),j=this.getSearch(a);if(null==j&&(j={field:a,type:"text"}),j.field==a&&(this.last.caption=j.caption),"list"==j.type){var t=x.data("selected");t&&!$.isEmptyObject(t)&&(b=t.id)}if(""!=b){var y="contains",z=b;if(-1!=["date","time","list"].indexOf(j.type)&&(y="is"),"int"==j.type&&""!=b){if(y="is",-1!=String(b).indexOf("-")){var t=b.split("-");2==t.length&&(y="between",z=[parseInt(t[0]),parseInt(t[1])])}if(-1!=String(b).indexOf(",")){var t=b.split(",");y="in",z=[];for(var v in t)z.push(t[v])}}var t={field:j.field,type:j.type,operator:y,value:z};d.push(t)}}if($.isArray(a)){var A="AND";"string"==typeof b&&(A=b.toUpperCase(),"OR"!=A&&"AND"!=A&&(A="AND")),h="",e=!0,f=A;for(var B in a){var C=a[B],j=this.getSearch(C.field);null==j&&(j={type:"text",operator:"contains"}),d.push($.extend(!0,{},j,C))}}var D=this.trigger({phase:"before",type:"search",target:this.name,searchData:d,searchField:a?a:"multi",searchValue:b?b:"multi"});D.isCancelled!==!0&&(this.searchData=D.searchData,this.last.field=g,this.last.search=h,this.last.multi=e,this.last.logic=f,this.last.scrollTop=0,this.last.scrollLeft=0,this.last.selection.indexes=[],this.last.selection.columns={},this.searchClose(),this.set({expanded:!1},!0),c?(this.last.xhr_offset=0,this.reload()):(this.localSearch(),this.refresh()),this.trigger($.extend(D,{phase:"after"})))},searchOpen:function(){if(this.box&&0!=this.searches.length){var a=this;$("#tb_"+this.name+"_toolbar_item_w2ui-search-advanced").w2overlay(this.getSearchesHTML(),{name:"searches-"+this.name,left:-10,"class":"w2ui-grid-searches",onShow:function(){"OR"==a.last.logic&&(a.searchData=[]),a.initSearches(),$("#w2ui-overlay-searches-"+this.name+" .w2ui-grid-searches").data("grid-name",a.name);var b=$("#w2ui-overlay-searches-"+this.name+" .w2ui-grid-searches *[rel=search]");b.length>0&&b[0].focus()}})}},searchClose:function(){this.box&&0!=this.searches.length&&(this.toolbar&&this.toolbar.uncheck("w2ui-search-advanced"),$("#w2ui-overlay-searches-"+this.name+" .w2ui-grid-searches").length>0&&$().w2overlay("",{name:"searches-"+this.name}))},searchShowFields:function(){for(var a=$("#grid_"+this.name+"_search_all"),b='<div class="w2ui-select-field"><table>',c=-1;c<this.searches.length;c++){var d=this.searches[c];if(-1==c){if(!this.multiSearch)continue;d={field:"all",caption:w2utils.lang("All Fields")}}else if(this.searches[c].hidden===!0)continue;b+="<tr "+(w2utils.isIOS?"onTouchStart":"onClick")+"=\"w2ui['"+this.name+"'].initAllField('"+d.field+'\')">    <td><input type="radio" tabIndex="-1" '+(d.field==this.last.field?"checked":"")+"></td>    <td>"+d.caption+"</td></tr>"}b+="</table></div>",setTimeout(function(){$(a).w2overlay(b,{left:-10})},1)},initAllField:function(a,b){var c=$("#grid_"+this.name+"_search_all"),d=this.getSearch(a);if("all"==a)d={field:"all",caption:w2utils.lang("All Fields")},c.w2field("clear"),c.change().focus();else{var e=d.type;-1!=["enum","select"].indexOf(e)&&(e="list"),c.w2field(e,$.extend({},d.options,{suffix:"",autoFormat:!1,selected:b})),-1!=["list","enum"].indexOf(d.type)&&(this.last.search="",this.last.item="",c.val("")),setTimeout(function(){c.focus()},1)}""!=this.last.search?this.search(d.field,this.last.search):(this.last.field=d.field,this.last.caption=d.caption),c.attr("placeholder",d.caption),$().w2overlay()},searchReset:function(a){var b=this.trigger({phase:"before",type:"search",target:this.name,searchData:[]});b.isCancelled!==!0&&(this.searchData=[],this.last.search="",this.last.logic="OR",this.last.multi=!1,this.last.xhr_offset=0,this.last.scrollTop=0,this.last.scrollLeft=0,this.last.selection.indexes=[],this.last.selection.columns={},this.searchClose(),$("#grid_"+this.name+"_search_all").val(""),a||this.reload(),this.trigger($.extend(b,{phase:"after"})))},clear:function(a){this.records=[],this.summary=[],this.last.scrollTop=0,this.last.scrollLeft=0,this.last.selection.indexes=[],this.last.selection.columns={},this.last.range_start=null,this.last.range_end=null,this.last.xhr_offset=0,a||this.refresh()
	},reset:function(a){this.offset=0,this.total=0,this.last.scrollTop=0,this.last.scrollLeft=0,this.last.selection.indexes=[],this.last.selection.columns={},this.last.range_start=null,this.last.range_end=null,this.last.xhr_offset=0,this.searchReset(a),null!=this.last.sortData&&(this.sortData=this.last.sortData),this.set({expanded:!1},!0),a||this.refresh()},skip:function(a){var b="object"!=typeof this.url?this.url:this.url.get;b?(this.offset=parseInt(a),this.offset>this.total&&(this.offset=this.total-this.limit),(this.offset<0||!w2utils.isInt(this.offset))&&(this.offset=0),this.records=[],this.last.xhr_offset=0,this.last.pull_more=!0,this.last.scrollTop=0,this.last.scrollLeft=0,$("#grid_"+this.name+"_records").prop("scrollTop",0),this.reload()):console.log("ERROR: grid.skip() can only be called when you have remote data source.")},load:function(a,b){return"undefined"==typeof a?void console.log('ERROR: You need to provide url argument when calling .load() method of "'+this.name+'" object.'):void this.request("get-records",{},a,b)},reload:function(a){var b="object"!=typeof this.url?this.url:this.url.get;b?(this.clear(!0),this.request("get-records",{},null,a)):(this.last.scrollTop=0,this.last.scrollLeft=0,this.last.range_start=null,this.last.range_end=null,this.localSearch(),this.refresh(),"function"==typeof a&&a({status:"success"}))},request:function(a,b,c,d){if("undefined"==typeof b&&(b={}),("undefined"==typeof c||""==c||null==c)&&(c=this.url),""!=c&&null!=c){var e={};if(w2utils.isInt(this.offset)||(this.offset=0),w2utils.isInt(this.last.xhr_offset)||(this.last.xhr_offset=0),e.cmd=a,e.selected=this.getSelection(),e.limit=this.limit,e.offset=parseInt(this.offset)+this.last.xhr_offset,e.search=this.searchData,e.searchLogic=this.last.logic,e.sort=this.sortData,0==this.searchData.length&&(delete e.search,delete e.searchLogic),0==this.sortData.length&&delete e.sort,$.extend(e,this.postData),$.extend(e,b),"get-records"==a){var f=this.trigger({phase:"before",type:"request",target:this.name,url:c,postData:e});if(f.isCancelled===!0)return void("function"==typeof d&&d({status:"error",message:"Request aborted."}))}else var f={url:c,postData:e};var g=this;if(0==this.last.xhr_offset)this.lock(this.msgRefresh,!0);else{var h=$("#grid_"+this.name+"_rec_more");this.autoLoad===!0?h.show().find("td").html('<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>'):h.find("td").html("<div>"+w2utils.lang("Load")+" "+g.limit+" "+w2utils.lang("More")+"...</div>")}if(this.last.xhr)try{this.last.xhr.abort()}catch(i){}var c="object"!=typeof f.url?f.url:f.url.get;if("save-records"==e.cmd&&"object"==typeof f.url&&(c=f.url.save),"delete-records"==e.cmd&&"object"==typeof f.url&&(c=f.url.remove),!$.isEmptyObject(g.routeData)){var j=w2utils.parseRoute(c);if(j.keys.length>0)for(var k=0;k<j.keys.length;k++)null!=g.routeData[j.keys[k].name]&&(c=c.replace(new RegExp(":"+j.keys[k].name,"g"),g.routeData[j.keys[k].name]))}var l={type:"POST",url:c,data:f.postData,dataType:"text"};"HTTP"==w2utils.settings.dataType&&(l.data="object"==typeof l.data?String($.param(l.data,!1)).replace(/%5B/g,"[").replace(/%5D/g,"]"):l.data),"RESTFULL"==w2utils.settings.dataType&&(l.type="GET","save-records"==e.cmd&&(l.type="PUT"),"delete-records"==e.cmd&&(l.type="DELETE"),l.data="object"==typeof l.data?String($.param(l.data,!1)).replace(/%5B/g,"[").replace(/%5D/g,"]"):l.data),"JSON"==w2utils.settings.dataType&&(l.type="POST",l.data=JSON.stringify(l.data),l.contentType="application/json"),this.method&&(l.type=this.method),this.last.xhr_cmd=e.cmd,this.last.xhr_start=(new Date).getTime(),this.last.xhr=$.ajax(l).done(function(b,c){g.requestComplete(c,a,d)}).fail(function(b,c,e){var f={status:c,error:e,rawResponseText:b.responseText},h=g.trigger({phase:"before",type:"error",error:f,xhr:b});if(h.isCancelled!==!0){if("abort"!=c){var i;try{i=$.parseJSON(b.responseText)}catch(j){}console.log("ERROR: Server communication failed.","\n   EXPECTED:",{status:"success",total:5,records:[{recid:1,field:"value"}]},"\n         OR:",{status:"error",message:"error message"},"\n   RECEIVED:","object"==typeof i?i:b.responseText),g.requestComplete("error",a,d)}g.trigger($.extend(h,{phase:"after"}))}}),"get-records"==a&&this.trigger($.extend(f,{phase:"after"}))}},requestComplete:function(status,cmd,callBack){var obj=this;this.unlock(),setTimeout(function(){obj.status(w2utils.lang("Server Response")+" "+((new Date).getTime()-obj.last.xhr_start)/1e3+" "+w2utils.lang("sec"))},10),this.last.pull_more=!1,this.last.pull_refresh=!0;var event_name="load";"save-records"==this.last.xhr_cmd&&(event_name="save"),"delete-records"==this.last.xhr_cmd&&(event_name="deleted");var eventData=this.trigger({phase:"before",target:this.name,type:event_name,xhr:this.last.xhr,status:status});if(eventData.isCancelled===!0)return void("function"==typeof callBack&&callBack({status:"error",message:"Request aborted."}));var data,responseText=this.last.xhr.responseText;if("error"!=status){if("undefined"!=typeof responseText&&""!=responseText){if("object"==typeof responseText)data=responseText;else if("function"==typeof obj.parser)data=obj.parser(responseText),"object"!=typeof data&&console.log("ERROR: Your parser did not return proper object");else try{eval("data = "+responseText)}catch(e){}if(obj.recid)for(var r in data.records)data.records[r].recid=data.records[r][obj.recid];if("undefined"==typeof data&&(data={status:"error",message:this.msgNotJSON,responseText:responseText}),"error"==data.status)obj.error(data.message);else{if("get-records"==cmd)if(0==this.last.xhr_offset)this.records=[],this.summary=[],delete data.status,$.extend(!0,this,data);else{var records=data.records;delete data.records,delete data.status,$.extend(!0,this,data);for(var r in records)this.records.push(records[r])}if("delete-records"==cmd)return void this.reset()}}}else data={status:"error",message:this.msgAJAXerror,responseText:responseText},obj.error(this.msgAJAXerror);var url="object"!=typeof this.url?this.url:this.url.get;url||(this.localSort(),this.localSearch()),this.total=parseInt(this.total),this.trigger($.extend(eventData,{phase:"after"})),0==this.last.xhr_offset?this.refresh():this.scroll(),"function"==typeof callBack&&callBack(data)},error:function(a){var b=this.trigger({target:this.name,type:"error",message:a,xhr:this.last.xhr});return b.isCancelled===!0?void("function"==typeof callBack&&callBack({status:"error",message:"Request aborted."})):(w2alert(a,"Error"),void this.trigger($.extend(b,{phase:"after"})))},getChanges:function(){var a=[];for(var b in this.records){var c=this.records[b];"undefined"!=typeof c.changes&&a.push($.extend(!0,{recid:c.recid},c.changes))}return a},mergeChanges:function(){var changes=this.getChanges();for(var c in changes){var record=this.get(changes[c].recid);for(var s in changes[c])if("recid"!=s){try{eval("record."+s+" = changes[c][s]")}catch(e){}delete record.changes}}this.refresh()},save:function(){var a=this,b=this.getChanges(),c=this.trigger({phase:"before",target:this.name,type:"submit",changes:b});if(c.isCancelled!==!0){var d="object"!=typeof this.url?this.url:this.url.save;d?this.request("save-records",{changes:c.changes},null,function(b){"error"!==b.status&&a.mergeChanges(),a.trigger($.extend(c,{phase:"after"}))}):(this.mergeChanges(),this.trigger($.extend(c,{phase:"after"})))}},editField:function(a,b,c,d){var e=this,f=e.get(a,!0),g=e.records[f],h=e.columns[b],i=h?h.editable:null;if(g&&h&&i&&g.editable!==!1){if(-1!=["enum","file"].indexOf(i.type))return void console.log('ERROR: input types "enum" and "file" are not supported in inline editing.');var j=e.trigger({phase:"before",type:"editField",target:e.name,recid:a,column:b,value:c,index:f,originalEvent:d});if(j.isCancelled!==!0&&(c=j.value,this.selectNone(),this.select({recid:a,column:b}),this.last.edit_col=b,-1==["checkbox","check"].indexOf(i.type))){var k=$("#grid_"+e.name+"_rec_"+w2utils.escapeId(a)),l=k.find("[col="+b+"] > div");"undefined"==typeof i.inTag&&(i.inTag=""),"undefined"==typeof i.outTag&&(i.outTag=""),"undefined"==typeof i.style&&(i.style=""),"undefined"==typeof i.items&&(i.items=[]);var m=w2utils.stripTags(g.changes&&"undefined"!=typeof g.changes[h.field]?g.changes[h.field]:g[h.field]);(null==m||"undefined"==typeof m)&&(m=""),"undefined"!=typeof c&&null!=c&&(m=c);var n="undefined"!=typeof h.style?h.style+";":"";if("string"==typeof h.render&&-1!=["number","int","float","money","percent"].indexOf(h.render.split(":")[0])&&(n+="text-align: right;"),i.items.length>0&&!$.isPlainObject(i.items[0])&&(i.items=w2obj.field.prototype.normMenu(i.items)),"select"==i.type){var o="";for(var p in i.items)o+='<option value="'+i.items[p].id+'" '+(i.items[p].id==m?"selected":"")+">"+i.items[p].text+"</option>";l.addClass("w2ui-editable").html('<select id="grid_'+e.name+"_edit_"+a+"_"+b+'" column="'+b+'"     style="width: 100%; '+n+i.style+'" field="'+h.field+'" recid="'+a+'"     '+i.inTag+">"+o+"</select>"+i.outTag),l.find("select").focus().on("change",function(){delete e.last.move}).on("blur",function(a){e.editChange.call(e,this,f,b,a)})}else{l.addClass("w2ui-editable").html('<input id="grid_'+e.name+"_edit_"+a+"_"+b+'"     type="text" style="font-family: inherit; font-size: inherit; outline: none; '+n+i.style+'" field="'+h.field+'" recid="'+a+'"     column="'+b+'" '+i.inTag+">"+i.outTag),null==c&&l.find("input").val("object"!=m?m:"");var q=l.find("input").get(0);$(q).w2field(i.type,$.extend(i,{selected:m})),setTimeout(function(){var a=q;"list"==i.type&&(a=$($(q).data("w2field").helpers.focus).find("input"),"object"!=typeof m&&""!=m&&a.val(m).css({opacity:1}).prev().css({opacity:1})),$(a).on("blur",function(a){e.editChange.call(e,q,f,b,a)})},10),null!=c&&$(q).val("object"!=m?m:"")}setTimeout(function(){l.find("input, select").on("click",function(a){a.stopPropagation()}).on("keydown",function(c){var d=!1;switch(c.keyCode){case 9:d=!0;var i=a,j=c.shiftKey?e.prevCell(b,!0):e.nextCell(b,!0);if(null==j){var k=c.shiftKey?e.prevRow(f):e.nextRow(f);if(null!=k&&k!=f){i=e.records[k].recid;for(var l in e.columns){var k=e.columns[l].editable;if("undefined"!=typeof k&&-1==["checkbox","check"].indexOf(k.type)&&(j=parseInt(l),!c.shiftKey))break}}}i===!1&&(i=a),null==j&&(j=b),this.blur(),setTimeout(function(){"row"!=e.selectType?(e.selectNone(),e.select({recid:i,column:j})):e.editField(i,j,null,c)},1);break;case 13:this.blur();var m=c.shiftKey?e.prevRow(f):e.nextRow(f);null!=m&&m!=f&&setTimeout(function(){"row"!=e.selectType?(e.selectNone(),e.select({recid:e.records[m].recid,column:b})):e.editField(e.records[m].recid,b,null,c)},100);break;case 38:if(!c.shiftKey)break;d=!0;var m=e.prevRow(f);m!=f&&(this.blur(),setTimeout(function(){"row"!=e.selectType?(e.selectNone(),e.select({recid:e.records[m].recid,column:b})):e.editField(e.records[m].recid,b,null,c)},1));break;case 40:if(!c.shiftKey)break;d=!0;var m=e.nextRow(f);null!=m&&m!=f&&(this.blur(),setTimeout(function(){"row"!=e.selectType?(e.selectNone(),e.select({recid:e.records[m].recid,column:b})):e.editField(e.records[m].recid,b,null,c)},1));break;case 27:var n=e.parseField(g,h.field);g.changes&&"undefined"!=typeof g.changes[h.field]&&(n=g.changes[h.field]),this.value="undefined"!=typeof n?n:"",this.blur(),setTimeout(function(){e.select({recid:a,column:b})},1)}d&&c.preventDefault&&c.preventDefault()});var d=l.find("input").focus();null!=c?d[0].setSelectionRange(d.val().length,d.val().length):d.select()},1),e.trigger($.extend(j,{phase:"after"}))}}},editChange:function(a,b,c){var d=0>b;b=0>b?-b-1:b;var e=d?this.summary:this.records,f=e[b],g=$("#grid_"+this.name+"_rec_"+w2utils.escapeId(f.recid)),h=this.columns[c],i=a.value,j=this.parseField(f,h.field),k=$(a).data("w2field");k&&(i=k.clean(i),"list"==k.type&&""!=i&&(i=$(a).data("selected"))),"checkbox"==a.type&&(f.editable===!1&&(a.checked=!a.checked),i=a.checked);for(var l={phase:"before",type:"change",target:this.name,input_id:a.id,recid:f.recid,index:b,column:c,value_new:i,value_previous:f.changes&&f.changes.hasOwnProperty(h.field)?f.changes[h.field]:j,value_original:j};;){if(i=l.value_new,"object"!=typeof i&&String(j)!=String(i)||"object"==typeof i&&("object"!=typeof j||i.id!=j.id)){if(l=this.trigger($.extend(l,{type:"change",phase:"before"})),l.isCancelled!==!0){if(i!==l.value_new)continue;f.changes=f.changes||{},f.changes[h.field]=l.value_new,this.trigger($.extend(l,{phase:"after"}))}}else if(l=this.trigger($.extend(l,{type:"restore",phase:"before"})),l.isCancelled!==!0){if(i!==l.value_new)continue;f.changes&&delete f.changes[h.field],$.isEmptyObject(f.changes)&&delete f.changes,this.trigger($.extend(l,{phase:"after"}))}break}var m=this.getCellHTML(b,c,d);d||(f.changes&&"undefined"!=typeof f.changes[h.field]?$(g).find("[col="+c+"]").addClass("w2ui-changed").html(m):$(g).find("[col="+c+"]").removeClass("w2ui-changed").html(m))},"delete":function(a){var b=this,c=this.trigger({phase:"before",target:this.name,type:"delete",force:a});if(c.isCancelled!==!0){a=c.force;var d=this.getSelection();if(0!=d.length){if(""!=this.msgDelete&&!a)return void w2confirm({title:w2utils.lang("Delete Confirmation"),msg:b.msgDelete,btn_yes:{"class":"btn-red"},callBack:function(a){"Yes"==a&&w2ui[b.name]["delete"](!0)}});var e="object"!=typeof this.url?this.url:this.url.remove;if(e)this.request("delete-records");else if(this.selectNone(),"object"!=typeof d[0])this.remove.apply(this,d);else{for(var f in d){var g=this.columns[d[f].column].field,h=this.get(d[f].recid,!0);null!=h&&"recid"!=g&&(this.records[h][g]="",this.records[h].changes&&delete this.records[h].changes[g])}this.refresh()}this.trigger($.extend(c,{phase:"after"}))}}},click:function(a,b){var c=(new Date).getTime(),d=null;if(!(1==this.last.cancelClick||b&&b.altKey)){if("object"==typeof a&&(d=a.column,a=a.recid),"undefined"==typeof b&&(b={}),c-parseInt(this.last.click_time)<350&&this.last.click_recid==a&&"click"==b.type)return void this.dblClick(a,b);if(this.last.click_time=c,this.last.click_recid=a,null==d&&b.target){var e=b.target;"TD"!=e.tagName&&(e=$(e).parents("td")[0]),"undefined"!=typeof $(e).attr("col")&&(d=parseInt($(e).attr("col")))}var f=this.trigger({phase:"before",target:this.name,type:"click",recid:a,column:d,originalEvent:b});if(f.isCancelled!==!0){var g=$("#grid_"+this.name+"_rec_"+w2utils.escapeId(a)).parents("tr");if(g.length>0&&-1!=String(g.attr("id")).indexOf("expanded_row")){var h=g.parents(".w2ui-grid").attr("name");w2ui[h].selectNone(),g.parents(".w2ui-grid").find(".w2ui-expanded-row .w2ui-grid").each(function(a,b){var c=$(b).attr("name");w2ui[c]&&w2ui[c].selectNone()})}$(this.box).find(".w2ui-expanded-row .w2ui-grid").each(function(a,b){var c=$(b).attr("name");w2ui[c]&&w2ui[c].selectNone()});var i=this,j=this.getSelection();$("#grid_"+this.name+"_check_all").prop("checked",!1);var k=this.get(a,!0),l=(this.records[k],[]);if(i.last.sel_ind=k,i.last.sel_col=d,i.last.sel_recid=a,i.last.sel_type="click",b.shiftKey&&j.length>0&&i.multiSelect){if(j[0].recid){var m=this.get(j[0].recid,!0),n=this.get(a,!0);if(d>j[0].column)var o=j[0].column,p=d;else var o=d,p=j[0].column;for(var q=o;p>=q;q++)l.push(q)}else var m=this.get(j[0],!0),n=this.get(a,!0);var r=[];if(m>n){var e=m;m=n,n=e}for(var s="object"!=typeof this.url?this.url:this.url.get,t=m;n>=t;t++)if(!(this.searchData.length>0)||s||-1!=$.inArray(t,this.last.searchIds))if("row"==this.selectType)r.push(this.records[t].recid);else for(var u in l)r.push({recid:this.records[t].recid,column:l[u]});this.select.apply(this,r)}else{var v=this.last.selection,w=-1!=v.indexes.indexOf(k)?!0:!1;(b.ctrlKey||b.shiftKey||b.metaKey)&&this.multiSelect||this.showSelectColumn?("row"!=this.selectType&&-1==$.inArray(d,v.columns[k])&&(w=!1),w===!0?this.unselect({recid:a,column:d}):this.select({recid:a,column:d})):("row"!=this.selectType&&-1==$.inArray(d,v.columns[k])&&(w=!1),j.length>300?this.selectNone():this.unselect.apply(this,j),w===!0?this.unselect({recid:a,column:d}):this.select({recid:a,column:d}))}this.status(),i.initResize(),this.trigger($.extend(f,{phase:"after"}))}}},columnClick:function(a,b){var c=this.trigger({phase:"before",type:"columnClick",target:this.name,field:a,originalEvent:b});if(c.isCancelled!==!0){var d=this.getColumn(a);d&&d.sortable&&this.sort(a,null,b&&(b.ctrlKey||b.metaKey)?!0:!1),this.trigger($.extend(c,{phase:"after"}))}},keydown:function(a){function b(){$("#_tmp_copy_data").remove(),$(document).off("keyup",b)}function c(){var a=Math.floor((h[0].scrollTop+h.height()/2.1)/e.recordHeight);e.records[a]||(a=0),e.select({recid:e.records[a].recid,column:0})}function d(){if("click"!=e.last.sel_type)return!1;if("row"!=e.selectType){if(e.last.sel_type="key",i.length>1){for(var a in i)if(i[a].recid==e.last.sel_recid&&i[a].column==e.last.sel_col){i.splice(a,1);break}return e.unselect.apply(e,i),!0}return!1}return e.last.sel_type="key",i.length>1?(i.splice(i.indexOf(e.records[e.last.sel_ind].recid),1),e.unselect.apply(e,i),!0):!1}var e=this;if(e.keyboard===!0){var f=e.trigger({phase:"before",type:"keydown",target:e.name,originalEvent:a});if(f.isCancelled!==!0){var g=!1,h=$("#grid_"+e.name+"_records"),i=e.getSelection();0==i.length&&(g=!0);var j=i[0]||null,k=[],l=i[i.length-1];if("object"==typeof j&&null!=j){j=i[0].recid,k=[];for(var m=0;;){if(!i[m]||i[m].recid!=j)break;k.push(i[m].column),m++}l=i[i.length-1].recid}var n=e.get(j,!0),o=e.get(l,!0),p=e.get(j),q=$("#grid_"+e.name+"_rec_"+(null!==n?w2utils.escapeId(e.records[n].recid):"none")),r=!1,s=a.keyCode,t=a.shiftKey;switch(9==s&&(s=a.shiftKey?37:39,t=!1,r=!0),s){case 8:case 46:this.show.toolbarDelete&&e["delete"](),r=!0,a.stopPropagation();break;case 27:e.selectNone(),i.length>0&&"object"==typeof i[0]&&e.select({recid:i[0].recid,column:i[0].column}),r=!0;break;case 65:if(!a.metaKey&&!a.ctrlKey)break;e.selectAll(),r=!0;break;case 70:if(!a.metaKey&&!a.ctrlKey)break;$("#grid_"+e.name+"_search_all").focus(),r=!0;break;case 13:if("row"==this.selectType&&e.show.expandColumn===!0){if(q.length<=0)break;e.toggle(j,a),r=!0}else{for(var u in this.columns)if(this.columns[u].editable){k.push(parseInt(u));break}"row"==this.selectType&&this.last.edit_col&&(k=[this.last.edit_col]),k.length>0&&(e.editField(j,k[0],null,a),r=!0)}break;case 37:if(g)break;var v=$("#grid_"+this.name+"_rec_"+w2utils.escapeId(e.records[n].recid)).parents("tr");if(v.length>0&&-1!=String(v.attr("id")).indexOf("expanded_row")){var j=v.prev().attr("recid"),w=v.parents(".w2ui-grid").attr("name");e.selectNone(),w2utils.keyboard.active(w),w2ui[w].set(j,{expanded:!1}),w2ui[w].collapse(j),w2ui[w].click(j),r=!0;break}if("row"==this.selectType){if(q.length<=0||p.expanded!==!0)break;e.set(j,{expanded:!1},!0),e.collapse(j,a)}else{var x=e.prevCell(k[0]);if(null!=x)if(t&&e.multiSelect){if(d())return;var y=[],z=[],A=[];if(0==k.indexOf(this.last.sel_col)&&k.length>1)for(var B in i)-1==y.indexOf(i[B].recid)&&y.push(i[B].recid),A.push({recid:i[B].recid,column:k[k.length-1]});else for(var B in i)-1==y.indexOf(i[B].recid)&&y.push(i[B].recid),z.push({recid:i[B].recid,column:x});e.unselect.apply(e,A),e.select.apply(e,z)}else a.shiftKey=!1,e.click({recid:j,column:x},a);else if(!t)for(var C=1;C<i.length;C++)e.unselect(i[C])}r=!0;break;case 39:if(g)break;if("row"==this.selectType){if(q.length<=0||p.expanded===!0||e.show.expandColumn!==!0)break;e.expand(j,a)}else{var D=e.nextCell(k[k.length-1]);if(null!==D)if(t&&39==s&&e.multiSelect){if(d())return;var y=[],z=[],A=[];if(k.indexOf(this.last.sel_col)==k.length-1&&k.length>1)for(var B in i)-1==y.indexOf(i[B].recid)&&y.push(i[B].recid),A.push({recid:i[B].recid,column:k[0]});else for(var B in i)-1==y.indexOf(i[B].recid)&&y.push(i[B].recid),z.push({recid:i[B].recid,column:D});e.unselect.apply(e,A),e.select.apply(e,z)}else e.click({recid:j,column:D},a);else if(!t)for(var C=0;C<i.length-1;C++)e.unselect(i[C])}r=!0;break;case 38:if(g&&c(),q.length<=0)break;var x=e.prevRow(n);if(null!=x){if(e.records[x].expanded){var E=$("#grid_"+e.name+"_rec_"+w2utils.escapeId(e.records[x].recid)+"_expanded_row").find(".w2ui-grid");if(E.length>0&&w2ui[E.attr("name")]){e.selectNone();var w=E.attr("name"),F=w2ui[w].records;w2utils.keyboard.active(w),w2ui[w].click(F[F.length-1].recid),r=!0;break}}if(t&&e.multiSelect){if(d())return;if("row"==e.selectType)e.last.sel_ind>x&&e.last.sel_ind!=o?e.unselect(e.records[o].recid):e.select(e.records[x].recid);else if(e.last.sel_ind>x&&e.last.sel_ind!=o){x=o;var y=[];for(var u in k)y.push({recid:e.records[x].recid,column:k[u]});e.unselect.apply(e,y)}else{var y=[];for(var u in k)y.push({recid:e.records[x].recid,column:k[u]});e.select.apply(e,y)}}else i.length>300?this.selectNone():this.unselect.apply(this,i),e.click({recid:e.records[x].recid,column:k[0]},a);e.scrollIntoView(x),a.preventDefault&&a.preventDefault()}else{if(!t)for(var C=1;C<i.length;C++)e.unselect(i[C]);var v=$("#grid_"+e.name+"_rec_"+w2utils.escapeId(e.records[n].recid)).parents("tr");if(v.length>0&&-1!=String(v.attr("id")).indexOf("expanded_row")){var j=v.prev().attr("recid"),w=v.parents(".w2ui-grid").attr("name");e.selectNone(),w2utils.keyboard.active(w),w2ui[w].click(j),r=!0;break}}break;case 40:if(g&&c(),q.length<=0)break;if(e.records[o].expanded){var E=$("#grid_"+this.name+"_rec_"+w2utils.escapeId(e.records[o].recid)+"_expanded_row").find(".w2ui-grid");if(E.length>0&&w2ui[E.attr("name")]){e.selectNone();var w=E.attr("name"),F=w2ui[w].records;w2utils.keyboard.active(w),w2ui[w].click(F[0].recid),r=!0;break}}var D=e.nextRow(o);if(null!=D){if(t&&e.multiSelect){if(d())return;if("row"==e.selectType)this.last.sel_ind<D&&this.last.sel_ind!=n?e.unselect(e.records[n].recid):e.select(e.records[D].recid);else if(this.last.sel_ind<D&&this.last.sel_ind!=n){D=n;var y=[];for(var u in k)y.push({recid:e.records[D].recid,column:k[u]});e.unselect.apply(e,y)}else{var y=[];for(var u in k)y.push({recid:e.records[D].recid,column:k[u]});e.select.apply(e,y)}}else i.length>300?this.selectNone():this.unselect.apply(this,i),e.click({recid:e.records[D].recid,column:k[0]},a);e.scrollIntoView(D),r=!0}else{if(!t)for(var C=0;C<i.length-1;C++)e.unselect(i[C]);var v=$("#grid_"+this.name+"_rec_"+w2utils.escapeId(e.records[o].recid)).parents("tr");if(v.length>0&&-1!=String(v.attr("id")).indexOf("expanded_row")){var j=v.next().attr("recid"),w=v.parents(".w2ui-grid").attr("name");e.selectNone(),w2utils.keyboard.active(w),w2ui[w].click(j),r=!0;break}}break;case 17:case 91:if(g)break;var G=e.copy();$("body").append('<textarea id="_tmp_copy_data"    onpaste="var obj = this; setTimeout(function () { w2ui[\''+e.name+"'].paste(obj.value); }, 1);\"    onkeydown=\"w2ui['"+e.name+'\'].keydown(event)"   style="position: absolute; top: -100px; height: 1px; width: 1px">'+G+"</textarea>"),$("#_tmp_copy_data").focus().select(),$(document).on("keyup",b);break;case 88:if(g)break;(a.ctrlKey||a.metaKey)&&setTimeout(function(){e["delete"](!0)},100)}for(var y=[187,189,32],B=48;90>=B;B++)y.push(B);if(-1!=y.indexOf(s)&&!a.ctrlKey&&!a.metaKey&&!r){0==k.length&&k.push(0);var y=String.fromCharCode(s);187==s&&(y="="),189==s&&(y="-"),t||(y=y.toLowerCase()),e.editField(j,k[0],y,a),r=!0}r&&a.preventDefault&&a.preventDefault(),e.trigger($.extend(f,{phase:"after"}))}}},scrollIntoView:function(a){var b=this.records.length;if(0==this.searchData.length||this.url||(b=this.last.searchIds.length),"undefined"==typeof a){var c=this.getSelection();if(0==c.length)return;a=this.get(c[0],!0)}var d=$("#grid_"+this.name+"_records");if(0!=b){var e=this.last.searchIds.length;if(!(d.height()>this.recordHeight*(e>0?e:b))){e>0&&(a=this.last.searchIds.indexOf(a));var f=Math.floor(d[0].scrollTop/this.recordHeight),g=f+Math.floor(d.height()/this.recordHeight);a==f&&d.animate({scrollTop:d.scrollTop()-d.height()/1.3},250,"linear"),a==g&&d.animate({scrollTop:d.scrollTop()+d.height()/1.3},250,"linear"),(f>a||a>g)&&d.animate({scrollTop:(a-1)*this.recordHeight})}}},dblClick:function(a,b){var c=null;if("object"==typeof a&&(c=a.column,a=a.recid),"undefined"==typeof b&&(b={}),null==c&&b.target){var d=b.target;"TD"!=d.tagName&&(d=$(d).parents("td")[0]),c=parseInt($(d).attr("col"))}var e=this.trigger({phase:"before",target:this.name,type:"dblClick",recid:a,column:c,originalEvent:b});if(e.isCancelled!==!0){this.selectNone();var f=this.columns[c];f&&$.isPlainObject(f.editable)?this.editField(a,c,null,b):this.select({recid:a,column:c}),this.trigger($.extend(e,{phase:"after"}))}},contextMenu:function(a,b){var c=this;"text"!=c.last.userSelect&&("undefined"==typeof b&&(b={offsetX:0,offsetY:0,target:$("#grid_"+c.name+"_rec_"+a)[0]}),"undefined"==typeof b.offsetX&&(b.offsetX=b.layerX-b.target.offsetLeft,b.offsetY=b.layerY-b.target.offsetTop),w2utils.isFloat(a)&&(a=parseFloat(a)),-1==this.getSelection().indexOf(a)&&c.click(a),setTimeout(function(){var d=c.trigger({phase:"before",type:"contextMenu",target:c.name,originalEvent:b,recid:a});d.isCancelled!==!0&&(c.menu.length>0&&$(c.box).find(b.target).w2menu(c.menu,{left:b.offsetX,onSelect:function(b){c.menuClick(a,parseInt(b.index),b.originalEvent)}}),c.trigger($.extend(d,{phase:"after"})))},150),b.preventDefault&&b.preventDefault())},menuClick:function(a,b,c){var d=this,e=d.trigger({phase:"before",type:"menuClick",target:d.name,originalEvent:c,recid:a,menuIndex:b,menuItem:d.menu[b]});e.isCancelled!==!0&&d.trigger($.extend(e,{phase:"after"}))},toggle:function(a){var b=this.get(a);return b.expanded===!0?this.collapse(a):this.expand(a)},expand:function(a){function b(){var b=$("#grid_"+d.name+"_rec_"+e+"_expanded"),c=$("#grid_"+d.name+"_rec_"+e+"_expanded_row .w2ui-expanded1 > div");b.height()<5||(b.css("opacity",1),c.show().css("opacity",1),$("#grid_"+d.name+"_cell_"+d.get(a,!0)+"_expand div").html("-"))}var c=this.get(a),d=this,e=w2utils.escapeId(a);if($("#grid_"+this.name+"_rec_"+e+"_expanded_row").length>0)return!1;if("none"==c.expanded)return!1;var f=1+(this.show.selectColumn?1:0),g="";$("#grid_"+this.name+"_rec_"+e).after('<tr id="grid_'+this.name+"_rec_"+a+'_expanded_row" class="w2ui-expanded-row '+g+'">'+(this.show.lineNumbers?'<td class="w2ui-col-number"></td>':"")+'    <td class="w2ui-grid-data w2ui-expanded1" colspan="'+f+'"><div style="display: none"></div></td>    <td colspan="100" class="w2ui-expanded2">        <div id="grid_'+this.name+"_rec_"+a+'_expanded" style="opacity: 0"></div>    </td></tr>');var h=this.trigger({phase:"before",type:"expand",target:this.name,recid:a,box_id:"grid_"+this.name+"_rec_"+a+"_expanded",ready:b});return h.isCancelled===!0?void $("#grid_"+this.name+"_rec_"+e+"_expanded_row").remove():($("#grid_"+this.name+"_rec_"+e).attr("expanded","yes").addClass("w2ui-expanded"),$("#grid_"+this.name+"_rec_"+e+"_expanded_row").show(),$("#grid_"+this.name+"_cell_"+this.get(a,!0)+"_expand div").html('<div class="w2ui-spinner" style="width: 16px; height: 16px; margin: -2px 2px;"></div>'),c.expanded=!0,setTimeout(b,300),this.trigger($.extend(h,{phase:"after"})),this.resizeRecords(),!0)},collapse:function(a){var b=this.get(a),c=this,d=w2utils.escapeId(a);if(0==$("#grid_"+this.name+"_rec_"+d+"_expanded_row").length)return!1;var e=this.trigger({phase:"before",type:"collapse",target:this.name,recid:a,box_id:"grid_"+this.name+"_rec_"+d+"_expanded"});return e.isCancelled!==!0?($("#grid_"+this.name+"_rec_"+d).removeAttr("expanded").removeClass("w2ui-expanded"),$("#grid_"+this.name+"_rec_"+d+"_expanded").css("opacity",0),$("#grid_"+this.name+"_cell_"+this.get(a,!0)+"_expand div").html("+"),setTimeout(function(){$("#grid_"+c.name+"_rec_"+d+"_expanded").height("0px"),setTimeout(function(){$("#grid_"+c.name+"_rec_"+d+"_expanded_row").remove(),delete b.expanded,c.trigger($.extend(e,{phase:"after"})),c.resizeRecords()},300)},200),!0):void 0},sort:function(a,b,c){var d=this.trigger({phase:"before",type:"sort",target:this.name,field:a,direction:b,multiField:c});if(d.isCancelled!==!0){if("undefined"!=typeof a){var e=this.sortData.length;for(var f in this.sortData)if(this.sortData[f].field==a){e=f;break}if("undefined"==typeof b||null==b)if("undefined"==typeof this.sortData[e])b="asc";else switch(String(this.sortData[e].direction)){case"asc":b="desc";break;case"desc":b="asc";break;default:b="asc"}this.multiSort===!1&&(this.sortData=[],e=0),1!=c&&(this.sortData=[],e=0),"undefined"==typeof this.sortData[e]&&(this.sortData[e]={}),this.sortData[e].field=a,this.sortData[e].direction=b}else this.sortData=[];this.selectNone();var g="object"!=typeof this.url?this.url:this.url.get;g?(this.trigger($.extend(d,{phase:"after"})),this.last.xhr_offset=0,this.reload()):(this.localSort(),this.searchData.length>0&&this.localSearch(!0),this.trigger($.extend(d,{phase:"after"})),this.refresh())}},copy:function(){var a=this.getSelection();if(0==a.length)return"";var b="";if("object"==typeof a[0]){var c=a[0].column,d=a[0].column,e=[];for(var f in a)a[f].column<c&&(c=a[f].column),a[f].column>d&&(d=a[f].column),-1==e.indexOf(a[f].index)&&e.push(a[f].index);e.sort();for(var g in e){for(var h=e[g],i=c;d>=i;i++){var j=this.columns[i];j.hidden!==!0&&(b+=w2utils.stripTags(this.getCellHTML(h,i))+"	")}b=b.substr(0,b.length-1),b+="\n"}}else{for(var i in this.columns){var j=this.columns[i];j.hidden!==!0&&(b+='"'+w2utils.stripTags(j.caption?j.caption:j.field)+'"	')}b=b.substr(0,b.length-1),b+="\n";for(var f in a){var h=this.get(a[f],!0);for(var i in this.columns){var j=this.columns[i];j.hidden!==!0&&(b+='"'+w2utils.stripTags(this.getCellHTML(h,i))+'"	')}b=b.substr(0,b.length-1),b+="\n"}}b=b.substr(0,b.length-1);var k=this.trigger({phase:"before",type:"copy",target:this.name,text:b});return k.isCancelled===!0?"":(b=k.text,this.trigger($.extend(k,{phase:"after"})),b)},paste:function(a){var b=this.getSelection(),c=this.get(b[0].recid,!0),d=b[0].column,e=this.trigger({phase:"before",type:"paste",target:this.name,text:a,index:c,column:d});if(e.isCancelled!==!0){if(a=e.text,"row"==this.selectType||0==b.length)return console.log("ERROR: You can paste only if grid.selectType = 'cell' and when at least one cell selected."),void this.trigger($.extend(e,{phase:"after"}));var f=[],a=a.split("\n");for(var g in a){var h=a[g].split("	"),i=0,j=this.records[c],k=[];for(var l in h)if(this.columns[d+i]){var m=this.columns[d+i].field;j.changes=j.changes||{},j.changes[m]=h[l],k.push(d+i),i++}for(var n in k)f.push({recid:j.recid,column:k[n]});c++}this.selectNone(),this.select.apply(this,f),this.refresh(),this.trigger($.extend(e,{phase:"after"}))}},resize:function(){var a=this,b=(new Date).getTime();if(this.box&&$(this.box).attr("name")==this.name){$(this.box).find("> div").css("width",$(this.box).width()).css("height",$(this.box).height());var c=this.trigger({phase:"before",type:"resize",target:this.name});if(c.isCancelled!==!0)return a.resizeBoxes(),a.resizeRecords(),this.trigger($.extend(c,{phase:"after"})),(new Date).getTime()-b}},refreshCell:function(a,b){var c=this.get(a,!0),d=this.records[c]&&this.records[c].recid==a?!1:!0,e=this.getColumn(b,!0),f=d?this.summary[c]:this.records[c],g=this.columns[e],h=$("#grid_"+this.name+"_rec_"+a+" [col="+e+"]");h.html(this.getCellHTML(c,e,d)),f.changes&&"undefined"!=typeof f.changes[g.field]?h.addClass("w2ui-changed"):h.removeClass("w2ui-changed")},refreshRow:function(a){var b=$("#grid_"+this.name+"_rec_"+w2utils.escapeId(a));if(0!=b.length){var c=this.get(a,!0),d=b.attr("line"),e=this.records[c]&&this.records[c].recid==a?!1:!0,f="object"!=typeof this.url?this.url:this.url.get;if(this.searchData.length>0&&!f)for(var g in this.last.searchIds)this.last.searchIds[g]==c&&(c=g);$(b).replaceWith(this.getRecordHTML(c,d,e)),e&&this.resize()}},refresh:function(){var a=this,b=(new Date).getTime(),c="object"!=typeof this.url?this.url:this.url.get;if(this.total<=0&&!c&&0==this.searchData.length&&(this.total=this.records.length),this.toolbar.disable("w2ui-edit","w2ui-delete"),this.box){var d=this.trigger({phase:"before",target:this.name,type:"refresh"});if(d.isCancelled!==!0){if(this.show.header?$("#grid_"+this.name+"_header").html(this.header+"&nbsp;").show():$("#grid_"+this.name+"_header").hide(),this.show.toolbar){if(this.toolbar&&this.toolbar.get("w2ui-column-on-off")&&this.toolbar.get("w2ui-column-on-off").checked);else if($("#grid_"+this.name+"_toolbar").show(),"object"==typeof this.toolbar){var e=this.toolbar.items;
	for(var f in e)"w2ui-search"!=e[f].id&&"break"!=e[f].type&&this.toolbar.refresh(e[f].id)}}else $("#grid_"+this.name+"_toolbar").hide();this.searchClose();var g=$("#grid_"+a.name+"_search_all");!this.multiSearch&&"all"==this.last.field&&this.searches.length>0&&(this.last.field=this.searches[0].field,this.last.caption=this.searches[0].caption);for(var h in this.searches)this.searches[h].field==this.last.field&&(this.last.caption=this.searches[h].caption);if(this.last.multi?g.attr("placeholder","["+w2utils.lang("Multiple Fields")+"]"):g.attr("placeholder",this.last.caption),g.val()!=this.last.search){var i=this.last.search,e=g.data("w2field");e&&(i=e.format(i)),g.val(i)}var e=this.find({summary:!0},!0);if(e.length>0){for(var f in e)this.summary.push(this.records[e[f]]);for(var f=e.length-1;f>=0;f--)this.records.splice(e[f],1);this.total=this.total-e.length}var j=a.find({expanded:!0},!0);for(var k in j)a.records[j[k]].expanded=!1;var l="";l+='<div id="grid_'+this.name+'_records" class="w2ui-grid-records"    onscroll="var obj = w2ui[\''+this.name+"'];         obj.last.scrollTop = this.scrollTop;         obj.last.scrollLeft = this.scrollLeft;         $('#grid_"+this.name+"_columns')[0].scrollLeft = this.scrollLeft;        $('#grid_"+this.name+"_summary')[0].scrollLeft = this.scrollLeft;        obj.scroll(event);\">"+this.getRecordsHTML()+'</div><div id="grid_'+this.name+'_columns" class="w2ui-grid-columns">    <table>'+this.getColumnsHTML()+"</table></div>",$("#grid_"+this.name+"_body").html(l),this.summary.length>0?$("#grid_"+this.name+"_summary").html(this.getSummaryHTML()).show():$("#grid_"+this.name+"_summary").hide(),this.show.footer?$("#grid_"+this.name+"_footer").html(this.getFooterHTML()).show():$("#grid_"+this.name+"_footer").hide(),this.searchData.length>0?$("#grid_"+this.name+"_searchClear").show():$("#grid_"+this.name+"_searchClear").hide();var m=this.last.selection;return m.indexes.length==this.records.length||0!==this.searchData.length&&m.indexes.length==this.last.searchIds.length?$("#grid_"+this.name+"_check_all").prop("checked",!0):$("#grid_"+this.name+"_check_all").prop("checked",!1),this.status(),setTimeout(function(){var b=$.trim($("#grid_"+a.name+"_search_all").val());""!=b&&$(a.box).find(".w2ui-grid-data > div").w2marker(b)},50),this.trigger($.extend(d,{phase:"after"})),a.resize(),a.addRange("selection"),setTimeout(function(){a.resize(),a.scroll()},1),a.reorderColumns&&!a.last.columnDrag?a.last.columnDrag=a.initColumnDrag():!a.reorderColumns&&a.last.columnDrag&&a.last.columnDrag.remove(),(new Date).getTime()-b}}},render:function(a){function b(a){if(1==a.which&&("text"==e.last.userSelect&&(delete e.last.userSelect,$(e.box).find(".w2ui-grid-body").css("user-select","none").css("-webkit-user-select","none").css("-moz-user-select","none").css("-ms-user-select","none"),$(this.box).on("selectstart",function(){return!1})),!($(a.target).parents().hasClass("w2ui-head")||$(a.target).hasClass("w2ui-head")||e.last.move&&"expand"==e.last.move.type))){if(a.altKey)$(e.box).off("selectstart"),$(e.box).find(".w2ui-grid-body").css("user-select","text").css("-webkit-user-select","text").css("-moz-user-select","text").css("-ms-user-select","text"),e.selectNone(),e.last.move={type:"text-select"},e.last.userSelect="text";else{if(!e.multiSelect)return;e.last.move={x:a.screenX,y:a.screenY,divX:0,divY:0,recid:$(a.target).parents("tr").attr("recid"),column:"TD"==a.target.tagName?$(a.target).attr("col"):$(a.target).parents("td").attr("col"),type:"select",ghost:!1,start:!0}}$(document).on("mousemove",c),$(document).on("mouseup",d)}}function c(a){var b=e.last.move;if(b&&"select"==b.type&&(b.divX=a.screenX-b.x,b.divY=a.screenY-b.y,!(Math.abs(b.divX)<=1&&Math.abs(b.divY)<=1))){if(e.last.cancelClick=!0,1==e.reorderRows){if(!b.ghost){var c=$("#grid_"+e.name+"_rec_"+b.recid),d=c.parents("table").find("tr:first-child").clone();b.offsetY=a.offsetY,b.from=b.recid,b.pos=c.position(),b.ghost=$(c).clone(!0),b.ghost.removeAttr("id"),c.find("td:first-child").replaceWith('<td colspan="1000" style="height: '+e.recordHeight+'px; background-color: #ddd"></td>');var f=$(e.box).find(".w2ui-grid-records");f.append('<table id="grid_'+e.name+'_ghost" style="position: absolute; z-index: 999999; opacity: 0.8; border-bottom: 2px dashed #aaa; border-top: 2px dashed #aaa; pointer-events: none;"></table>'),$("#grid_"+e.name+"_ghost").append(d).append(b.ghost)}var g=$(a.target).parents("tr").attr("recid");if(g!=b.from){var h=$("#grid_"+e.name+"_rec_"+b.recid),i=$("#grid_"+e.name+"_rec_"+g);a.screenY-b.lastY<0?h.after(i):i.after(h),b.lastY=a.screenY,b.to=g}var j=$("#grid_"+e.name+"_ghost"),f=$(e.box).find(".w2ui-grid-records");return void j.css({top:b.pos.top+b.divY+f.scrollTop(),left:b.pos.left})}b.start&&b.recid&&(e.selectNone(),b.start=!1);var k=[],g="TR"==a.target.tagName?$(a.target).attr("recid"):$(a.target).parents("tr").attr("recid");if("undefined"!=typeof g){var l=e.get(b.recid,!0);if(null!==l){var m=e.get(g,!0);if(null!==m){var n=parseInt(b.column),o=parseInt("TD"==a.target.tagName?$(a.target).attr("col"):$(a.target).parents("td").attr("col"));if(l>m){var d=l;l=m,m=d}var d="ind1:"+l+",ind2;"+m+",col1:"+n+",col2:"+o;if(b.range!=d){b.range=d;for(var p=l;m>=p;p++)if(!(e.last.searchIds.length>0&&-1==e.last.searchIds.indexOf(p)))if("row"!=e.selectType){if(n>o){var d=n;n=o,o=d}for(var d=[],q=n;o>=q;q++)e.columns[q].hidden||k.push({recid:e.records[p].recid,column:parseInt(q)})}else k.push(e.records[p].recid);if("row"!=e.selectType){var r=e.getSelection(),d=[];for(var s in k){var t=!1;for(var u in r)k[s].recid==r[u].recid&&k[s].column==r[u].column&&(t=!0);t||d.push({recid:k[s].recid,column:k[s].column})}e.select.apply(e,d);var d=[];for(var u in r){var t=!1;for(var s in k)k[s].recid==r[u].recid&&k[s].column==r[u].column&&(t=!0);t||d.push({recid:r[u].recid,column:r[u].column})}e.unselect.apply(e,d)}else if(e.multiSelect){var r=e.getSelection();for(var s in k)-1==r.indexOf(k[s])&&e.select(k[s]);for(var u in r)-1==k.indexOf(r[u])&&e.unselect(r[u])}}}}}}}function d(a){var b=e.last.move;if(setTimeout(function(){delete e.last.cancelClick},1),!$(a.target).parents().hasClass(".w2ui-head")&&!$(a.target).hasClass(".w2ui-head")){if(b&&"select"==b.type&&1==e.reorderRows){var f=e.get(b.from,!0),g=e.records[f];e.records.splice(f,1);var h=e.get(b.to,!0);f>h?e.records.splice(h,0,g):e.records.splice(h+1,0,g),$("#grid_"+e.name+"_ghost").remove(),e.refresh()}delete e.last.move,$(document).off("mousemove",c),$(document).off("mouseup",d)}}var e=this,f=(new Date).getTime();if("undefined"!=typeof a&&null!=a&&($(this.box).find("#grid_"+this.name+"_body").length>0&&$(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-grid").html(""),this.box=a),this.box){null==this.last.sortData&&(this.last.sortData=this.sortData);var g=this.trigger({phase:"before",target:this.name,type:"render",box:a});if(g.isCancelled!==!0){if($(this.box).attr("name",this.name).addClass("w2ui-reset w2ui-grid").html('<div>    <div id="grid_'+this.name+'_header" class="w2ui-grid-header"></div>    <div id="grid_'+this.name+'_toolbar" class="w2ui-grid-toolbar"></div>    <div id="grid_'+this.name+'_body" class="w2ui-grid-body"></div>    <div id="grid_'+this.name+'_summary" class="w2ui-grid-body w2ui-grid-summary"></div>    <div id="grid_'+this.name+'_footer" class="w2ui-grid-footer"></div></div>'),"row"!=this.selectType&&$(this.box).addClass("w2ui-ss"),$(this.box).length>0&&($(this.box)[0].style.cssText+=this.style),this.initToolbar(),null!=this.toolbar&&this.toolbar.render($("#grid_"+this.name+"_toolbar")[0]),this.last.field&&"all"!=this.last.field){var h=this.searchData;this.initAllField(this.last.field,1==h.length?h[0].value:null)}return $("#grid_"+this.name+"_footer").html(this.getFooterHTML()),this.last.state||(this.last.state=this.stateSave(!0)),this.stateRestore(),this.url&&this.refresh(),this.reload(),$(this.box).on("mousedown",b),$(this.box).on("selectstart",function(){return!1}),this.trigger($.extend(g,{phase:"after"})),0==$(".w2ui-layout").length&&(this.tmp_resize=function(){w2ui[e.name].resize()},$(window).off("resize",this.tmp_resize).on("resize",this.tmp_resize)),(new Date).getTime()-f}}},destroy:function(){var a=this.trigger({phase:"before",target:this.name,type:"destroy"});a.isCancelled!==!0&&($(window).off("resize",this.tmp_resize),"object"==typeof this.toolbar&&this.toolbar.destroy&&this.toolbar.destroy(),$(this.box).find("#grid_"+this.name+"_body").length>0&&$(this.box).removeAttr("name").off("selectstart").removeClass("w2ui-reset w2ui-grid").html(""),delete w2ui[this.name],this.trigger($.extend(a,{phase:"after"})))},initColumnOnOff:function(){if(this.show.toolbarColumns){var a=this,b='<div class="w2ui-col-on-off"><table><tr><td style="width: 30px">    <input id="grid_'+this.name+'_column_ln_check" type="checkbox" tabIndex="-1" '+(a.show.lineNumbers?"checked":"")+"        onclick=\"w2ui['"+a.name+"'].columnOnOff(this, event, 'line-numbers');\"></td><td onclick=\"w2ui['"+a.name+"'].columnOnOff(this, event, 'line-numbers'); $('#w2ui-overlay')[0].hide();\">    <label for=\"grid_"+this.name+'_column_ln_check">'+w2utils.lang("Line #")+"</label></td></tr>";for(var c in this.columns){var d=this.columns[c],e=this.columns[c].caption;d.hideable!==!1&&(!e&&this.columns[c].hint&&(e=this.columns[c].hint),e||(e="- column "+(parseInt(c)+1)+" -"),b+='<tr><td style="width: 30px">    <input id="grid_'+this.name+"_column_"+c+'_check" type="checkbox" tabIndex="-1" '+(d.hidden?"":"checked")+"        onclick=\"w2ui['"+a.name+"'].columnOnOff(this, event, '"+d.field+'\');"></td><td>    <label for="grid_'+this.name+"_column_"+c+'_check">'+e+"</label></td></tr>")}b+='<tr><td colspan="2"><div style="border-top: 1px solid #ddd;"></div></td></tr>';var f="object"!=typeof this.url?this.url:this.url.get;f&&a.show.skipRecords&&(b+='<tr><td colspan="2" style="padding: 0px">    <div style="cursor: pointer; padding: 2px 8px; cursor: default">'+w2utils.lang("Skip")+'        <input type="text" style="width: 45px" value="'+this.offset+'"             onkeypress="if (event.keyCode == 13) {                w2ui[\''+a.name+"'].skip(this.value);                $('#w2ui-overlay')[0].hide();             }\"> "+w2utils.lang("Records")+"    </div></td></tr>"),b+='<tr><td colspan="2" onclick="w2ui[\''+a.name+"'].stateSave(); $('#w2ui-overlay')[0].hide();\">    <div style=\"cursor: pointer; padding: 4px 8px; cursor: default\">"+w2utils.lang("Save Grid State")+'</div></td></tr><tr><td colspan="2" onclick="w2ui[\''+a.name+"'].stateReset(); $('#w2ui-overlay')[0].hide();\">    <div style=\"cursor: pointer; padding: 4px 8px; cursor: default\">"+w2utils.lang("Restore Default State")+"</div></td></tr>",b+="</table></div>",this.toolbar.get("w2ui-column-on-off").html=b}},initColumnDrag:function(){function a(){i.pressed=!1,clearTimeout(i.timeout)}function b(a){i.timeout&&clearTimeout(i.timeout);var b=this;i.pressed=!0,i.timeout=setTimeout(function(){if(i.pressed){var e,f,g,j,k,l=["w2ui-col-number","w2ui-col-expand","w2ui-col-select"],m=["w2ui-head-last"],n=l.concat(m),o=".w2ui-col-number, .w2ui-col-expand, .w2ui-col-select",p=".w2ui-head.w2ui-col-number, .w2ui-head.w2ui-col-expand, .w2ui-head.w2ui-col-select";if($(a.originalEvent.target).parents().hasClass("w2ui-head")){for(var q=0,r=n.length;r>q;q++)if($(a.originalEvent.target).parents().hasClass(n[q]))return;if(i.numberPreColumnsPresent=$(h.box).find(p).length,i.columnHead=j=$(a.originalEvent.target).parents(".w2ui-head"),k=parseInt(j.attr("col"),10),e=h.trigger({type:"columnDragStart",phase:"before",originalEvent:a,origColumnNumber:k,target:j[0]}),e.isCancelled===!0)return!1;f=i.columns=$(h.box).find(".w2ui-head:not(.w2ui-head-last)"),$(document).on("mouseup",d),$(document).on("mousemove",c),i.originalPos=parseInt($(a.originalEvent.target).parent(".w2ui-head").attr("col"),10),i.ghost=$(b).clone(!0),$(i.ghost).find('[col]:not([col="'+i.originalPos+'"]), .w2ui-toolbar, .w2ui-grid-header').remove(),$(i.ghost).find(o).remove(),$(i.ghost).find(".w2ui-grid-body").css({top:0}),g=$(i.ghost).find('[col="'+i.originalPos+'"]'),$(document.body).append(i.ghost),$(i.ghost).css({width:0,height:0,margin:0,position:"fixed",zIndex:999999,opacity:0}).addClass(".w2ui-grid-ghost").animate({width:g.width(),height:$(h.box).find(".w2ui-grid-body:first").height(),left:a.pageX,top:a.pageY,opacity:.8},0),i.offsets=[];for(var q=0,r=f.length;r>q;q++)i.offsets.push($(f[q]).offset().left);h.trigger($.extend(e,{phase:"after"}))}}},150)}function c(a){if(i.pressed){var b=a.originalEvent.pageX,c=a.originalEvent.pageY,d=i.offsets,h=$(".w2ui-head:not(.w2ui-head-last)").width();i.targetInt=Math.max(i.numberPreColumnsPresent,f(b,d,h)),e(i.targetInt),g(b,c)}}function d(a){i.pressed=!1;var b,e,f,g,j,k=$(".w2ui-grid-ghost");return b=h.trigger({type:"columnDragEnd",phase:"before",originalEvent:a,target:i.columnHead[0]}),b.isCancelled===!0?!1:(f=h.columns[i.originalPos],g=h.columns,j=$(i.columns[Math.min(i.lastInt,i.columns.length-1)]),e=i.lastInt<i.columns.length?parseInt(j.attr("col")):g.length,e!==i.originalPos+1&&e!==i.originalPos&&j&&j.length?($(i.ghost).animate({top:$(h.box).offset().top,left:j.offset().left,width:0,height:0,opacity:.2},300,function(){$(this).remove(),k.remove()}),g.splice(e,0,$.extend({},f)),g.splice(g.indexOf(f),1)):($(i.ghost).remove(),k.remove()),$(document).off("mouseup",d),$(document).off("mousemove",c),i.marker&&i.marker.remove(),i={},h.refresh(),void h.trigger($.extend(b,{phase:"after",targetColumnNumber:e-1})))}function e(a){i.marker||i.markerLeft||(i.marker=$('<div class="col-intersection-marker"><div class="top-marker"></div><div class="bottom-marker"></div></div>'),i.markerLeft=$('<div class="col-intersection-marker"><div class="top-marker"></div><div class="bottom-marker"></div></div>')),i.lastInt&&i.lastInt===a||(i.lastInt=a,i.marker.remove(),i.markerLeft.remove(),$(".w2ui-head").removeClass("w2ui-col-intersection"),a>=i.columns.length?($(i.columns[i.columns.length-1]).children("div:last").append(i.marker.addClass("right").removeClass("left")),$(i.columns[i.columns.length-1]).addClass("w2ui-col-intersection")):a<=i.numberPreColumnsPresent?($(i.columns[i.numberPreColumnsPresent]).prepend(i.marker.addClass("left").removeClass("right")).css({position:"relative"}),$(i.columns[i.numberPreColumnsPresent]).prev().addClass("w2ui-col-intersection")):($(i.columns[a]).children("div:last").prepend(i.marker.addClass("left").removeClass("right")),$(i.columns[a]).prev().children("div:last").append(i.markerLeft.addClass("right").removeClass("left")).css({position:"relative"}),$(i.columns[a-1]).addClass("w2ui-col-intersection")))}function f(a,b,c){if(a<=b[0])return 0;if(a>=b[b.length-1]+c)return b.length;for(var d=0,e=b.length;e>d;d++){var f=b[d],g=b[d+1]||b[d]+c,h=(g-b[d])/2+b[d];if(a>f&&h>=a)return d;if(a>h&&g>=a)return d+1}return intersection}function g(a,b){$(i.ghost).css({left:a-10,top:b-10})}if(this.columnGroups&&this.columnGroups.length)throw"Draggable columns are not currently supported with column groups.";var h=this,i={};return i.lastInt=null,i.pressed=!1,i.timeout=null,i.columnHead=null,$(h.box).on("mousedown",b),$(h.box).on("mouseup",a),{remove:function(){$(h.box).off("mousedown",b),$(h.box).off("mouseup",a),$(h.box).find(".w2ui-head").removeAttr("draggable"),h.last.columnDrag=!1}}},columnOnOff:function(a,b,c){var d=this.trigger({phase:"before",target:this.name,type:"columnOnOff",checkbox:a,field:c,originalEvent:b});if(d.isCancelled!==!0){var e=this;for(var f in this.records)this.records[f].expanded===!0&&(this.records[f].expanded=!1);var g=!0;if("line-numbers"==c)this.show.lineNumbers=!this.show.lineNumbers,this.refresh();else{var h=this.getColumn(c);h.hidden?($(a).prop("checked",!0),this.showColumn(h.field)):($(a).prop("checked",!1),this.hideColumn(h.field)),g=!1}g&&setTimeout(function(){$().w2overlay("",{name:"searches-"+this.name}),e.toolbar.uncheck("column-on-off")},100),this.trigger($.extend(d,{phase:"after"}))}},initToolbar:function(){if("undefined"==typeof this.toolbar.render){var a=this.toolbar.items;if(this.toolbar.items=[],this.toolbar=$().w2toolbar($.extend(!0,{},this.toolbar,{name:this.name+"_toolbar",owner:this})),this.show.toolbarReload&&this.toolbar.items.push($.extend(!0,{},this.buttons.reload)),this.show.toolbarColumns&&this.toolbar.items.push($.extend(!0,{},this.buttons.columns)),(this.show.toolbarReload||this.show.toolbarColumn)&&this.toolbar.items.push({type:"break",id:"w2ui-break0"}),this.show.toolbarSearch){var b='<div class="w2ui-toolbar-search"><table cellpadding="0" cellspacing="0"><tr>    <td>'+this.buttons.search.html+'</td>    <td>        <input id="grid_'+this.name+'_search_all" class="w2ui-search-all"             placeholder="'+this.last.caption+'" value="'+this.last.search+"\"            onkeydown=\"if (event.keyCode == 13 && w2utils.isIE) this.onchange();\"            onchange=\"                var val = this.value;                 var fld = $(this).data('w2field');                 var dat = $(this).data('selected');                 if (fld) val = fld.clean(val);                if (dat != null && $.isPlainObject(dat)) val = dat.id;                w2ui['"+this.name+"'].search(w2ui['"+this.name+'\'].last.field, val);             ">    </td>    <td>        <div title="'+w2utils.lang("Clear Search")+'" class="w2ui-search-clear" id="grid_'+this.name+'_searchClear"               onclick="var obj = w2ui[\''+this.name+"']; obj.searchReset();\"         >&nbsp;&nbsp;</div>    </td></tr></table></div>";this.toolbar.items.push({type:"html",id:"w2ui-search",html:b}),this.multiSearch&&this.searches.length>0&&this.toolbar.items.push($.extend(!0,{},this.buttons["search-go"]))}this.show.toolbarSearch&&(this.show.toolbarAdd||this.show.toolbarEdit||this.show.toolbarDelete||this.show.toolbarSave)&&this.toolbar.items.push({type:"break",id:"w2ui-break1"}),this.show.toolbarAdd&&this.toolbar.items.push($.extend(!0,{},this.buttons.add)),this.show.toolbarEdit&&this.toolbar.items.push($.extend(!0,{},this.buttons.edit)),this.show.toolbarDelete&&this.toolbar.items.push($.extend(!0,{},this.buttons["delete"])),this.show.toolbarSave&&((this.show.toolbarAdd||this.show.toolbarDelete||this.show.toolbarEdit)&&this.toolbar.items.push({type:"break",id:"w2ui-break2"}),this.toolbar.items.push($.extend(!0,{},this.buttons.save)));for(var c in a)this.toolbar.items.push(a[c]);var d=this;this.toolbar.on("click",function(a){function b(){$("#w2ui-overlay-searches-"+d.name).data("keepOpen")!==!0&&(g.uncheck(e),$(document).off("click","body",b))}var c=d.trigger({phase:"before",type:"toolbar",target:a.target,originalEvent:a});if(c.isCancelled!==!0){var e=a.target;switch(e){case"w2ui-reload":var f=d.trigger({phase:"before",type:"reload",target:d.name});if(f.isCancelled===!0)return!1;d.reload(),d.trigger($.extend(f,{phase:"after"}));break;case"w2ui-column-on-off":d.initColumnOnOff(),d.initResize(),d.resize();break;case"w2ui-search-advanced":var g=this,h=this.get(e);h.checked?(d.searchClose(),setTimeout(function(){g.uncheck(e)},1)):(d.searchOpen(),a.originalEvent.stopPropagation(),$(document).on("click","body",b));break;case"w2ui-add":var c=d.trigger({phase:"before",target:d.name,type:"add",recid:null});d.trigger($.extend(c,{phase:"after"}));break;case"w2ui-edit":var i=d.getSelection(),j=null;1==i.length&&(j=i[0]);var c=d.trigger({phase:"before",target:d.name,type:"edit",recid:j});d.trigger($.extend(c,{phase:"after"}));break;case"w2ui-delete":d["delete"]();break;case"w2ui-save":d.save()}d.trigger($.extend(c,{phase:"after"}))}})}},initResize:function(){var a=this;$(this.box).find(".w2ui-resizer").off("click").on("click",function(a){a.stopPropagation?a.stopPropagation():a.cancelBubble=!0,a.preventDefault&&a.preventDefault()}).off("mousedown").on("mousedown",function(b){b||(b=window.event),window.addEventListener||window.document.attachEvent("onselectstart",function(){return!1}),a.resizing=!0,a.last.tmp={x:b.screenX,y:b.screenY,gx:b.screenX,gy:b.screenY,col:parseInt($(this).attr("name"))},b.stopPropagation?b.stopPropagation():b.cancelBubble=!0,b.preventDefault&&b.preventDefault();for(var c in a.columns)a.columns[c].hidden||("undefined"==typeof a.columns[c].sizeOriginal&&(a.columns[c].sizeOriginal=a.columns[c].size),a.columns[c].size=a.columns[c].sizeCalculated);var d={phase:"before",type:"columnResize",target:a.name,column:a.last.tmp.col,field:a.columns[a.last.tmp.col].field};d=a.trigger($.extend(d,{resizeBy:0,originalEvent:b}));var e=function(b){if(1==a.resizing){if(b||(b=window.event),d=a.trigger($.extend(d,{resizeBy:b.screenX-a.last.tmp.gx,originalEvent:b})),d.isCancelled===!0)return void(d.isCancelled=!1);a.last.tmp.x=b.screenX-a.last.tmp.x,a.last.tmp.y=b.screenY-a.last.tmp.y,a.columns[a.last.tmp.col].size=parseInt(a.columns[a.last.tmp.col].size)+a.last.tmp.x+"px",a.resizeRecords(),a.last.tmp.x=b.screenX,a.last.tmp.y=b.screenY}},f=function(b){delete a.resizing,$(document).off("mousemove","body"),$(document).off("mouseup","body"),a.resizeRecords(),a.trigger($.extend(d,{phase:"after",originalEvent:b}))};$(document).on("mousemove","body",e),$(document).on("mouseup","body",f)}).each(function(a,b){var c=$(b).parent();$(b).css({height:"25px","margin-left":c.width()-3+"px"})})},resizeBoxes:function(){{var a=($(this.box).find("> div"),$("#grid_"+this.name+"_header")),b=$("#grid_"+this.name+"_toolbar"),c=$("#grid_"+this.name+"_summary"),d=$("#grid_"+this.name+"_footer"),e=$("#grid_"+this.name+"_body");$("#grid_"+this.name+"_columns"),$("#grid_"+this.name+"_records")}this.show.header&&a.css({top:"0px",left:"0px",right:"0px"}),this.show.toolbar&&b.css({top:0+(this.show.header?w2utils.getSize(a,"height"):0)+"px",left:"0px",right:"0px"}),this.show.footer&&d.css({bottom:"0px",left:"0px",right:"0px"}),this.summary.length>0&&c.css({bottom:0+(this.show.footer?w2utils.getSize(d,"height"):0)+"px",left:"0px",right:"0px"}),e.css({top:0+(this.show.header?w2utils.getSize(a,"height"):0)+(this.show.toolbar?w2utils.getSize(b,"height"):0)+"px",bottom:0+(this.show.footer?w2utils.getSize(d,"height"):0)+(this.summary.length>0?w2utils.getSize(c,"height"):0)+"px",left:"0px",right:"0px"})},resizeRecords:function(){var a=this;$(this.box).find(".w2ui-empty-record").remove();var b=$(this.box),c=$(this.box).find("> div"),d=$("#grid_"+this.name+"_header"),e=$("#grid_"+this.name+"_toolbar"),f=$("#grid_"+this.name+"_summary"),g=$("#grid_"+this.name+"_footer"),h=$("#grid_"+this.name+"_body"),i=$("#grid_"+this.name+"_columns"),j=$("#grid_"+this.name+"_records");if(this.fixedBody){var k=c.height()-(this.show.header?w2utils.getSize(d,"height"):0)-(this.show.toolbar?w2utils.getSize(e,"height"):0)-("none"!=f.css("display")?w2utils.getSize(f,"height"):0)-(this.show.footer?w2utils.getSize(g,"height"):0);h.css("height",k)}else{var k=w2utils.getSize(i,"height")+w2utils.getSize($("#grid_"+a.name+"_records table"),"height");a.height=k+w2utils.getSize(c,"+height")+(a.show.header?w2utils.getSize(d,"height"):0)+(a.show.toolbar?w2utils.getSize(e,"height"):0)+("none"!=f.css("display")?w2utils.getSize(f,"height"):0)+(a.show.footer?w2utils.getSize(g,"height"):0),c.css("height",a.height),h.css("height",k),b.css("height",w2utils.getSize(c,"height")+w2utils.getSize(b,"+height"))}var l=this.records.length;0==this.searchData.length||this.url||(l=this.last.searchIds.length);var m=!1,n=!1;if(h.width()<$(j).find(">table").width()&&(m=!0),h.height()-i.height()<$(j).find(">table").height()+(m?w2utils.scrollBarSize():0)&&(n=!0),this.fixedBody||(n=!1),m||n?(i.find("> table > tbody > tr:nth-child(1) td.w2ui-head-last").css("width",w2utils.scrollBarSize()).show(),j.css({top:(this.columnGroups.length>0&&this.show.columns?1:0)+w2utils.getSize(i,"height")+"px","-webkit-overflow-scrolling":"touch","overflow-x":m?"auto":"hidden","overflow-y":n?"auto":"hidden"})):(i.find("> table > tbody > tr:nth-child(1) td.w2ui-head-last").hide(),j.css({top:(this.columnGroups.length>0&&this.show.columns?1:0)+w2utils.getSize(i,"height")+"px",overflow:"hidden"}),j.length>0&&(this.last.scrollTop=0,this.last.scrollLeft=0)),this.show.emptyRecords&&!n){var o=Math.floor(j.height()/this.recordHeight)+1;if(this.fixedBody)for(var p=l;o>=p;p++){var q="";q+='<tr class="'+(p%2?"w2ui-even":"w2ui-odd")+' w2ui-empty-record" style="height: '+this.recordHeight+'px">',this.show.lineNumbers&&(q+='<td class="w2ui-col-number"></td>'),this.show.selectColumn&&(q+='<td class="w2ui-grid-data w2ui-col-select"></td>'),this.show.expandColumn&&(q+='<td class="w2ui-grid-data w2ui-col-expand"></td>');for(var r=0;this.columns.length>0;){var s=this.columns[r];if(s.hidden){if(r++,"undefined"==typeof this.columns[r])break}else if(q+='<td class="w2ui-grid-data" '+("undefined"!=typeof s.attr?s.attr:"")+' col="'+r+'"></td>',r++,"undefined"==typeof this.columns[r])break}q+='<td class="w2ui-grid-data-last"></td>',q+="</tr>",$("#grid_"+this.name+"_records > table").append(q)}}if(h.length>0){for(var t=parseInt(h.width())-(n?w2utils.scrollBarSize():0)-(this.show.lineNumbers?34:0)-(this.show.selectColumn?26:0)-(this.show.expandColumn?26:0),u=t,v=0,w=!1,x=0;x<this.columns.length;x++){var s=this.columns[x];s.gridMinWidth>0&&(s.gridMinWidth>u&&s.hidden!==!0&&(s.hidden=!0,w=!0),s.gridMinWidth<u&&s.hidden===!0&&(s.hidden=!1,w=!0))}if(w===!0)return void this.refresh();for(var x=0;x<this.columns.length;x++){var s=this.columns[x];s.hidden||("px"==String(s.size).substr(String(s.size).length-2).toLowerCase()?(t-=parseFloat(s.size),this.columns[x].sizeCalculated=s.size,this.columns[x].sizeType="px"):(v+=parseFloat(s.size),this.columns[x].sizeType="%",delete s.sizeCorrected))}if(100!=v&&v>0)for(var x=0;x<this.columns.length;x++){var s=this.columns[x];s.hidden||"%"==s.sizeType&&(s.sizeCorrected=Math.round(100*parseFloat(s.size)*100/v)/100+"%")}for(var x=0;x<this.columns.length;x++){var s=this.columns[x];s.hidden||"%"==s.sizeType&&(this.columns[x].sizeCalculated="undefined"!=typeof this.columns[x].sizeCorrected?Math.floor(t*parseFloat(s.sizeCorrected)/100)-1+"px":Math.floor(t*parseFloat(s.size)/100)-1+"px")}}for(var y=0,x=0;x<this.columns.length;x++){var s=this.columns[x];s.hidden||("undefined"==typeof s.min&&(s.min=20),parseInt(s.sizeCalculated)<parseInt(s.min)&&(s.sizeCalculated=s.min+"px"),parseInt(s.sizeCalculated)>parseInt(s.max)&&(s.sizeCalculated=s.max+"px"),y+=parseInt(s.sizeCalculated))}var z=parseInt(u)-parseInt(y);if(z>0&&v>0)for(var x=0;;){var s=this.columns[x];if("undefined"!=typeof s)if(s.hidden||"px"==s.sizeType)x++;else{if(s.sizeCalculated=parseInt(s.sizeCalculated)+1+"px",z--,0==z)break;x++}else x=0}else z>0&&i.find("> table > tbody > tr:nth-child(1) td.w2ui-head-last").css("width",w2utils.scrollBarSize()).show();i.find("> table > tbody > tr:nth-child(1) td").each(function(b,c){var d=$(c).attr("col");"undefined"!=typeof d&&a.columns[d]&&$(c).css("width",a.columns[d].sizeCalculated),$(c).hasClass("w2ui-head-last")&&$(c).css("width",w2utils.scrollBarSize()+(z>0&&0==v?z:0)+"px")}),3==i.find("> table > tbody > tr").length&&i.find("> table > tbody > tr:nth-child(1) td").html("").css({height:"0px",border:"0px",padding:"0px",margin:"0px"}),j.find("> table > tbody > tr:nth-child(1) td").each(function(b,c){var d=$(c).attr("col");"undefined"!=typeof d&&a.columns[d]&&$(c).css("width",a.columns[d].sizeCalculated),$(c).hasClass("w2ui-grid-data-last")&&$(c).css("width",(z>0&&0==v?z:0)+"px")}),f.find("> table > tbody > tr:nth-child(1) td").each(function(b,c){var d=$(c).attr("col");"undefined"!=typeof d&&a.columns[d]&&$(c).css("width",a.columns[d].sizeCalculated),$(c).hasClass("w2ui-grid-data-last")&&$(c).css("width",w2utils.scrollBarSize()+(z>0&&0==v?z:0)+"px")}),this.initResize(),this.refreshRanges(),(this.last.scrollTop||this.last.scrollLeft)&&j.length>0&&(i.prop("scrollLeft",this.last.scrollLeft),j.prop("scrollTop",this.last.scrollTop),j.prop("scrollLeft",this.last.scrollLeft))},getSearchesHTML:function(){for(var a='<table cellspacing="0">',b=!1,c=0;c<this.searches.length;c++){var d=this.searches[c];if(d.type=String(d.type).toLowerCase(),!d.hidden){var e="";if(0==b&&(e='<button class="btn close-btn" onclick="obj = w2ui[\''+this.name+"']; if (obj) { obj.searchClose(); }\">X</button",b=!0),"undefined"==typeof d.inTag&&(d.inTag=""),"undefined"==typeof d.outTag&&(d.outTag=""),"undefined"==typeof d.type&&(d.type="text"),-1!=["text","alphanumeric","combo"].indexOf(d.type))var f='<select id="grid_'+this.name+"_operator_"+c+'" onclick="event.stopPropagation();">    <option value="is">'+w2utils.lang("is")+'</option>    <option value="begins">'+w2utils.lang("begins")+'</option>    <option value="contains">'+w2utils.lang("contains")+'</option>    <option value="ends">'+w2utils.lang("ends")+"</option></select>";if(-1!=["int","float","money","currency","percent","date","time"].indexOf(d.type))var f='<select id="grid_'+this.name+"_operator_"+c+'"         onchange="w2ui[\''+this.name+"'].initOperator(this, "+c+');" onclick="event.stopPropagation();">    <option value="is">'+w2utils.lang("is")+"</option>"+(-1!=["int"].indexOf(d.type)?'<option value="in">'+w2utils.lang("in")+"</option>":"")+(-1!=["int"].indexOf(d.type)?'<option value="not in">'+w2utils.lang("not in")+"</option>":"")+'<option value="between">'+w2utils.lang("between")+"</option></select>";if(-1!=["select","list","hex"].indexOf(d.type))var f='<select id="grid_'+this.name+"_operator_"+c+'" onclick="event.stopPropagation();">    <option value="is">'+w2utils.lang("is")+"</option></select>";if(-1!=["enum"].indexOf(d.type))var f='<select id="grid_'+this.name+"_operator_"+c+'" onclick="event.stopPropagation();">    <option value="in">'+w2utils.lang("in")+'</option>    <option value="not in">'+w2utils.lang("not in")+"</option></select>";switch(a+='<tr>    <td class="close-btn">'+e+'</td>    <td class="caption">'+d.caption+'</td>    <td class="operator">'+f+'</td>    <td class="value">',d.type){case"text":case"alphanumeric":case"hex":case"list":case"combo":case"enum":a+='<input rel="search" type="text" style="width: 300px;" id="grid_'+this.name+"_field_"+c+'" name="'+d.field+'" '+d.inTag+">";break;case"int":case"float":case"money":case"currency":case"percent":case"date":case"time":a+='<input rel="search" type="text" size="12" id="grid_'+this.name+"_field_"+c+'" name="'+d.field+'" '+d.inTag+'><span id="grid_'+this.name+"_range_"+c+'" style="display: none">&nbsp;-&nbsp;&nbsp;<input rel="search" type="text" style="width: 90px" id="grid_'+this.name+"_field2_"+c+'" name="'+d.field+'" '+d.inTag+"></span>";break;case"select":a+='<select rel="search" id="grid_'+this.name+"_field_"+c+'" name="'+d.field+'" '+d.inTag+'  onclick="event.stopPropagation();"></select>'}a+=d.outTag+"    </td></tr>"}}return a+='<tr>    <td colspan="4" class="actions">        <div>        <button class="btn" onclick="obj = w2ui[\''+this.name+"']; if (obj) { obj.searchReset(); }\">"+w2utils.lang("Reset")+'</button>        <button class="btn btn-blue" onclick="obj = w2ui[\''+this.name+"']; if (obj) { obj.search(); }\">"+w2utils.lang("Search")+"</button>        </div>    </td></tr></table>"},initOperator:function(a,b){var c=this,d=c.searches[b],e=$("#grid_"+c.name+"_range_"+b),f=$("#grid_"+c.name+"_field_"+b),g=f.parent().find("span input");f.w2field("in"==$(a).val()||"not in"==$(a).val()?"clear":d.type),"between"==$(a).val()?(e.show(),g.w2field(d.type)):e.hide()},initSearches:function(){var a=this;for(var b in this.searches){var c=this.searches[b],d=this.getSearchData(c.field);switch(c.type=String(c.type).toLowerCase(),"object"!=typeof c.options&&(c.options={}),c.type){case"text":case"alphanumeric":$("#grid_"+this.name+"_operator_"+b).val("begins"),-1!=["alphanumeric","hex"].indexOf(c.type)&&$("#grid_"+this.name+"_field_"+b).w2field(c.type,c.options);break;case"int":case"float":case"money":case"currency":case"percent":case"date":case"time":if(d&&"int"==d.type&&-1!=["in","not in"].indexOf(d.operator))break;$("#grid_"+this.name+"_field_"+b).w2field(c.type,c.options),$("#grid_"+this.name+"_field2_"+b).w2field(c.type,c.options),setTimeout(function(){$("#grid_"+a.name+"_field_"+b).keydown(),$("#grid_"+a.name+"_field2_"+b).keydown()},1);break;
	case"hex":break;case"list":case"combo":case"enum":var e=c.options;"list"==c.type&&(e.selected={}),"enum"==c.type&&(e.selected=[]),d&&(e.selected=d.value),$("#grid_"+this.name+"_field_"+b).w2field(c.type,e),"combo"==c.type&&$("#grid_"+this.name+"_operator_"+b).val("begins");break;case"select":var e='<option value="">--</option>';for(var f in c.options.items){var g=c.options.items[f];if($.isPlainObject(c.options.items[f])){var h=g.id,i=g.text;"undefined"==typeof h&&"undefined"!=typeof g.value&&(h=g.value),"undefined"==typeof i&&"undefined"!=typeof g.caption&&(i=g.caption),null==h&&(h=""),e+='<option value="'+h+'">'+i+"</option>"}else e+='<option value="'+g+'">'+g+"</option>"}$("#grid_"+this.name+"_field_"+b).html(e)}null!=d&&("int"==d.type&&-1!=["in","not in"].indexOf(d.operator)&&$("#grid_"+this.name+"_field_"+b).w2field("clear").val(d.value),$("#grid_"+this.name+"_operator_"+b).val(d.operator).trigger("change"),$.isArray(d.value)?-1!=["in","not in"].indexOf(d.operator)?$("#grid_"+this.name+"_field_"+b).val(d.value).trigger("change"):($("#grid_"+this.name+"_field_"+b).val(d.value[0]).trigger("change"),$("#grid_"+this.name+"_field2_"+b).val(d.value[1]).trigger("change")):"udefined"!=typeof d.value&&$("#grid_"+this.name+"_field_"+b).val(d.value).trigger("change"))}$("#w2ui-overlay-searches-"+this.name+" .w2ui-grid-searches *[rel=search]").on("keypress",function(b){13==b.keyCode&&(a.search(),$().w2overlay())})},getColumnsHTML:function(){function a(){var a="<tr>";""!=c.columnGroups[c.columnGroups.length-1].caption&&c.columnGroups.push({caption:""}),c.show.lineNumbers&&(a+='<td class="w2ui-head w2ui-col-number">    <div>&nbsp;</div></td>'),c.show.selectColumn&&(a+='<td class="w2ui-head w2ui-col-select">    <div>&nbsp;</div></td>'),c.show.expandColumn&&(a+='<td class="w2ui-head w2ui-col-expand">    <div>&nbsp;</div></td>');for(var b=0,d=0;d<c.columnGroups.length;d++){var e=c.columnGroups[d],f=c.columns[b];if(("undefined"==typeof e.span||e.span!=parseInt(e.span))&&(e.span=1),"undefined"!=typeof e.colspan&&(e.span=e.colspan),e.master===!0){var g="";for(var h in c.sortData)c.sortData[h].field==f.field&&(RegExp("asc","i").test(c.sortData[h].direction)&&(g="w2ui-sort-up"),RegExp("desc","i").test(c.sortData[h].direction)&&(g="w2ui-sort-down"));var i="";f.resizable!==!1&&(i='<div class="w2ui-resizer" name="'+b+'"></div>'),a+='<td class="w2ui-head '+g+'" col="'+b+'" rowspan="2" colspan="'+(e.span+(d==c.columnGroups.length-1?1:0))+'"     onclick="w2ui[\''+c.name+"'].columnClick('"+f.field+"', event);\">"+i+'    <div class="w2ui-col-group w2ui-col-header '+(g?"w2ui-col-sorted":"")+'">        <div class="'+g+'"></div>'+(f.caption?f.caption:"&nbsp;")+"    </div></td>"}else a+='<td class="w2ui-head" col="'+b+'"         colspan="'+(e.span+(d==c.columnGroups.length-1?1:0))+'">    <div class="w2ui-col-group">'+(e.caption?e.caption:"&nbsp;")+"    </div></td>";b+=e.span}return a+="</tr>"}function b(a){var b="<tr>",d=!c.reorderColumns||c.columnGroups&&c.columnGroups.length?"":" w2ui-reorder-cols-head ";c.show.lineNumbers&&(b+='<td class="w2ui-head w2ui-col-number" onclick="w2ui[\''+c.name+"'].columnClick('line-number', event);\">    <div>#</div></td>"),c.show.selectColumn&&(b+='<td class="w2ui-head w2ui-col-select"         onclick="if (event.stopPropagation) event.stopPropagation(); else event.cancelBubble = true;">    <div>        <input type="checkbox" id="grid_'+c.name+'_check_all" tabIndex="-1"            style="'+(0==c.multiSelect?"display: none;":"")+'"            onclick="if (this.checked) w2ui[\''+c.name+"'].selectAll();                      else w2ui['"+c.name+"'].selectNone();                      if (event.stopPropagation) event.stopPropagation(); else event.cancelBubble = true;\">    </div></td>"),c.show.expandColumn&&(b+='<td class="w2ui-head w2ui-col-expand">    <div>&nbsp;</div></td>');for(var e=0,f=0,g=0;g<c.columns.length;g++){var h=c.columns[g],i={};if(g==f&&(f+="undefined"!=typeof c.columnGroups[e]?parseInt(c.columnGroups[e].span):0,e++),"undefined"!=typeof c.columnGroups[e-1])var i=c.columnGroups[e-1];if(!h.hidden){var j="";for(var k in c.sortData)c.sortData[k].field==h.field&&(RegExp("asc","i").test(c.sortData[k].direction)&&(j="w2ui-sort-up"),RegExp("desc","i").test(c.sortData[k].direction)&&(j="w2ui-sort-down"));if(i.master!==!0||a){var l="";h.resizable!==!1&&(l='<div class="w2ui-resizer" name="'+g+'"></div>'),b+='<td col="'+g+'" class="w2ui-head '+j+d+'"     onclick="w2ui[\''+c.name+"'].columnClick('"+h.field+"', event);\">"+l+'    <div class="w2ui-col-header '+(j?"w2ui-col-sorted":"")+'">        <div class="'+j+'"></div>'+(h.caption?h.caption:"&nbsp;")+"    </div></td>"}}}return b+='<td class="w2ui-head w2ui-head-last"><div>&nbsp;</div></td>',b+="</tr>"}var c=this,d="";return this.show.columnHeaders&&(d=this.columnGroups.length>0?b(!0)+a()+b(!1):b(!0)),d},getRecordsHTML:function(){var a=this.records.length;0==this.searchData.length||this.url||(a=this.last.searchIds.length),this.show_extra=a>300?30:300;var b=$("#grid_"+this.name+"_records"),c=Math.floor(b.height()/this.recordHeight)+this.show_extra+1;(!this.fixedBody||c>a)&&(c=a);var d="<table>"+this.getRecordHTML(-1,0);d+='<tr id="grid_'+this.name+'_rec_top" line="top" style="height: 0px">    <td colspan="200"></td></tr>';for(var e=0;c>e;e++)d+=this.getRecordHTML(e,e+1);return d+='<tr id="grid_'+this.name+'_rec_bottom" line="bottom" style="height: '+(a-c)*this.recordHeight+'px">    <td colspan="200"></td></tr><tr id="grid_'+this.name+'_rec_more" style="display: none">    <td colspan="200" class="w2ui-load-more"></td></tr></table>',this.last.range_start=0,this.last.range_end=c,d},getSummaryHTML:function(){if(0!=this.summary.length){for(var a="<table>",b=0;b<this.summary.length;b++)a+=this.getRecordHTML(b,b+1,!0);return a+="</table>"}},scroll:function(){function a(){b.markSearch!==!1&&(clearTimeout(b.last.marker_timer),b.last.marker_timer=setTimeout(function(){var a=[];for(var c in b.searchData){var d=b.searchData[c];-1==$.inArray(d.value,a)&&a.push(d.value)}a.length>0&&$(b.box).find(".w2ui-grid-data > div").w2marker(a)},50))}var b=((new Date).getTime(),this),c=$("#grid_"+this.name+"_records"),d=this.records.length;if(0==this.searchData.length||this.url||(d=this.last.searchIds.length),0!=d&&0!=c.length&&0!=c.height()){if(this.show_extra=d>300?30:300,c.height()<d*this.recordHeight&&"hidden"==c.css("overflow-y"))return void(this.total>0&&this.refresh());var e=Math.round(c[0].scrollTop/this.recordHeight+1),f=e+(Math.round(c.height()/this.recordHeight)-1);e>d&&(e=d),f>d&&(f=d);var g="object"!=typeof this.url?this.url:this.url.get;if($("#grid_"+this.name+"_footer .w2ui-footer-right").html(w2utils.formatNumber(this.offset+e)+"-"+w2utils.formatNumber(this.offset+f)+" "+w2utils.lang("of")+" "+w2utils.formatNumber(this.total)+(g?" ("+w2utils.lang("buffered")+" "+w2utils.formatNumber(d)+(this.offset>0?", skip "+w2utils.formatNumber(this.offset):"")+")":"")),g||this.fixedBody&&!(this.total<=300)){var h=Math.floor(c[0].scrollTop/this.recordHeight)-this.show_extra,i=h+Math.floor(c.height()/this.recordHeight)+2*this.show_extra+1;1>h&&(h=1),i>this.total&&(i=this.total);var j=c.find("#grid_"+this.name+"_rec_top"),k=c.find("#grid_"+this.name+"_rec_bottom");-1!=String(j.next().prop("id")).indexOf("_expanded_row")&&j.next().remove(),this.total>i&&-1!=String(k.prev().prop("id")).indexOf("_expanded_row")&&k.prev().remove();var l=parseInt(j.next().attr("line")),m=parseInt(k.prev().attr("line"));if(h>l||1==l||this.last.pull_refresh){if(i<=m+this.show_extra-2&&i!=this.total)return;for(this.last.pull_refresh=!1;;){var n=c.find("#grid_"+this.name+"_rec_top").next();if("bottom"==n.attr("line"))break;if(!(parseInt(n.attr("line"))<h))break;n.remove()}var n=c.find("#grid_"+this.name+"_rec_bottom").prev(),o=n.attr("line");"top"==o&&(o=h);for(var p=parseInt(o)+1;i>=p;p++)this.records[p-1]&&(this.records[p-1].expanded===!0&&(this.records[p-1].expanded=!1),k.before(this.getRecordHTML(p-1,p)));a(),setTimeout(function(){b.refreshRanges()},0)}else{if(h>=l-this.show_extra+2&&h>1)return;for(;;){var n=c.find("#grid_"+this.name+"_rec_bottom").prev();if("top"==n.attr("line"))break;if(!(parseInt(n.attr("line"))>i))break;n.remove()}var n=c.find("#grid_"+this.name+"_rec_top").next(),o=n.attr("line");"bottom"==o&&(o=i);for(var p=parseInt(o)-1;p>=h;p--)this.records[p-1]&&(this.records[p-1].expanded===!0&&(this.records[p-1].expanded=!1),j.after(this.getRecordHTML(p-1,p)));a(),setTimeout(function(){b.refreshRanges()},0)}var q=(h-1)*b.recordHeight,r=(d-i)*b.recordHeight;0>r&&(r=0),j.css("height",q+"px"),k.css("height",r+"px"),b.last.range_start=h,b.last.range_end=i;var s=Math.floor(c[0].scrollTop/this.recordHeight),t=s+Math.floor(c.height()/this.recordHeight);if(t+10>d&&this.last.pull_more!==!0&&d<this.total-this.offset)if(this.autoLoad===!0)this.last.pull_more=!0,this.last.xhr_offset+=this.limit,this.request("get-records");else{var u=$("#grid_"+this.name+"_rec_more");"none"==u.css("display")&&u.show().on("click",function(){b.last.pull_more=!0,b.last.xhr_offset+=b.limit,b.request("get-records"),$(this).find("td").html('<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>')}),-1==u.find("td").text().indexOf("Load")&&u.find("td").html("<div>"+w2utils.lang("Load")+" "+b.limit+" "+w2utils.lang("More")+"...</div>")}d>=this.total-this.offset&&$("#grid_"+this.name+"_rec_more").hide()}}},getRecordHTML:function(a,b,c){var d,e="",f=this.last.selection;if(-1==a){e+='<tr line="0">',this.show.lineNumbers&&(e+='<td class="w2ui-col-number" style="height: 0px;"></td>'),this.show.selectColumn&&(e+='<td class="w2ui-col-select" style="height: 0px;"></td>'),this.show.expandColumn&&(e+='<td class="w2ui-col-expand" style="height: 0px;"></td>');for(var g in this.columns)this.columns[g].hidden||(e+='<td class="w2ui-grid-data" col="'+g+'" style="height: 0px;"></td>');return e+='<td class="w2ui-grid-data-last" style="height: 0px;"></td>',e+="</tr>"}var h="object"!=typeof this.url?this.url:this.url.get;if(c!==!0)if(this.searchData.length>0&&!h){if(a>=this.last.searchIds.length)return"";a=this.last.searchIds[a],d=this.records[a]}else{if(a>=this.records.length)return"";d=this.records[a]}else{if(a>=this.summary.length)return"";d=this.summary[a]}if(!d)return"";var i=(w2utils.escapeId(d.recid),!1);if(-1!=f.indexes.indexOf(a)&&(i=!0),e+='<tr id="grid_'+this.name+"_rec_"+d.recid+'" recid="'+d.recid+'" line="'+b+'"  class="'+(b%2==0?"w2ui-even":"w2ui-odd")+(i&&"row"==this.selectType?" w2ui-selected":"")+(d.editable===!1?" w2ui-no-edit":"")+(d.expanded===!0?" w2ui-expanded":"")+'" '+(c!==!0?w2utils.isIOS?"    onclick  = \"w2ui['"+this.name+"'].dblClick('"+d.recid+"', event);\"":"    onclick  = \"w2ui['"+this.name+"'].click('"+d.recid+"', event);\"    oncontextmenu = \"w2ui['"+this.name+"'].contextMenu('"+d.recid+"', event);\"":"")+' style="height: '+this.recordHeight+"px; "+(i||"string"!=typeof d.style?"":d.style)+'" '+("string"==typeof d.style?'custom_style="'+d.style+'"':"")+">",this.show.lineNumbers&&(e+='<td id="grid_'+this.name+"_cell_"+a+"_number"+(c?"_s":"")+'" class="w2ui-col-number">'+(c!==!0?"<div>"+b+"</div>":"")+"</td>"),this.show.selectColumn&&(e+='<td id="grid_'+this.name+"_cell_"+a+"_select"+(c?"_s":"")+'" class="w2ui-grid-data w2ui-col-select"         onclick="if (event.stopPropagation) event.stopPropagation(); else event.cancelBubble = true;">'+(c!==!0?'    <div>        <input class="w2ui-grid-select-check" type="checkbox" tabIndex="-1"            '+(i?'checked="checked"':"")+"            onclick=\"var obj = w2ui['"+this.name+"'];                 if (!obj.multiSelect) { obj.selectNone(); }                if (this.checked) obj.select('"+d.recid+"'); else obj.unselect('"+d.recid+"');                 if (event.stopPropagation) event.stopPropagation(); else event.cancelBubble = true;\">    </div>":"")+"</td>"),this.show.expandColumn){var j="";j=d.expanded===!0?"-":"+","none"==d.expanded&&(j=""),"spinner"==d.expanded&&(j='<div class="w2ui-spinner" style="width: 16px; margin: -2px 2px;"></div>'),e+='<td id="grid_'+this.name+"_cell_"+a+"_expand"+(c?"_s":"")+'" class="w2ui-grid-data w2ui-col-expand">'+(c!==!0?'    <div ondblclick="if (event.stopPropagation) event.stopPropagation(); else event.cancelBubble = true;"             onclick="w2ui[\''+this.name+"'].toggle('"+d.recid+"', event);                 if (event.stopPropagation) event.stopPropagation(); else event.cancelBubble = true;\">        "+j+" </div>":"")+"</td>"}for(var k=0;;){var l=this.columns[k];if(l.hidden){if(k++,"undefined"==typeof this.columns[k])break}else{var m=!c&&d.changes&&"undefined"!=typeof d.changes[l.field],n=this.getCellHTML(a,k,c),o="";if("string"==typeof l.render){var p=l.render.toLowerCase().split(":");-1!=["number","int","float","money","currency","percent"].indexOf(p[0])&&(o+="text-align: right;")}"object"==typeof d.style&&"string"==typeof d.style[k]&&(o+=d.style[k]+";");var q=!1;if(i&&-1!=$.inArray(k,f.columns[a])&&(q=!0),e+='<td class="w2ui-grid-data'+(q?" w2ui-selected":"")+(m?" w2ui-changed":"")+'" col="'+k+'"     style="'+o+("undefined"!=typeof l.style?l.style:"")+'" '+("undefined"!=typeof l.attr?l.attr:"")+">"+n+"</td>",k++,"undefined"==typeof this.columns[k])break}}return e+='<td class="w2ui-grid-data-last"></td>',e+="</tr>"},getCellHTML:function(a,b,c){var d=this.columns[b],e=c!==!0?this.records[a]:this.summary[a],f=this.getCellValue(a,b,c),g=d.editable;if(null!=d.render){if("function"==typeof d.render&&(f=$.trim(d.render.call(this,e,a,b)),(f.length<4||"<div"!=f.substr(0,4).toLowerCase())&&(f="<div>"+f+"</div>")),"object"==typeof d.render&&(f="<div>"+(d.render[f]||"")+"</div>"),"string"==typeof d.render){var h=d.render.toLowerCase().split(":"),i="",j="";-1!=["number","int","float","money","currency","percent"].indexOf(h[0])&&("undefined"!=typeof h[1]&&w2utils.isInt(h[1])||(h[1]=0),h[1]>20&&(h[1]=20),h[1]<0&&(h[1]=0),-1!=["money","currency"].indexOf(h[0])&&(h[1]=w2utils.settings.currencyPrecision,i=w2utils.settings.currencyPrefix,j=w2utils.settings.currencySuffix),"percent"==h[0]&&(j="%","0"!==h[1]&&(h[1]=1)),"int"==h[0]&&(h[1]=0),f="<div>"+(""!==f?i+w2utils.formatNumber(Number(f).toFixed(h[1]))+j:"")+"</div>"),"time"==h[0]&&(("undefined"==typeof h[1]||""==h[1])&&(h[1]=w2utils.settings.time_format),f="<div>"+i+w2utils.formatTime(f,"h12"==h[1]?"hh:mi pm":"h24:min")+j+"</div>"),"date"==h[0]&&(("undefined"==typeof h[1]||""==h[1])&&(h[1]=w2utils.settings.date_display),f="<div>"+i+w2utils.formatDate(f,h[1])+j+"</div>"),"age"==h[0]&&(f="<div>"+i+w2utils.age(f)+j+"</div>"),"toggle"==h[0]&&(f="<div>"+i+(f?"Yes":"")+j+"</div>")}}else{var k="";if(g&&-1!=["checkbox","check"].indexOf(g.type)){var l=c?-(a+1):a;k="text-align: center",f='<input type="checkbox" '+(f?"checked":"")+" onclick=\"    var obj = w2ui['"+this.name+"'];     obj.editChange.call(obj, this, "+l+", "+b+', event); ">'}if(this.show.recordTitles){var m=String(f).replace(/"/g,"''");"undefined"!=typeof d.title&&("function"==typeof d.title&&(m=d.title.call(this,e,a,b)),"string"==typeof d.title&&(m=d.title));var f='<div title="'+w2utils.stripTags(m)+'" style="'+k+'">'+f+"</div>"}else var f='<div style="'+k+'">'+f+"</div>"}return(null==f||"undefined"==typeof f)&&(f=""),f},getCellValue:function(a,b,c){var d=this.columns[b],e=c!==!0?this.records[a]:this.summary[a],f=this.parseField(e,d.field);return e.changes&&"undefined"!=typeof e.changes[d.field]&&(f=e.changes[d.field]),(null==f||"undefined"==typeof f)&&(f=""),f},getFooterHTML:function(){return'<div>    <div class="w2ui-footer-left"></div>    <div class="w2ui-footer-right"></div>    <div class="w2ui-footer-center"></div></div>'},status:function(a){if("undefined"!=typeof a)$("#grid_"+this.name+"_footer").find(".w2ui-footer-left").html(a);else{var b="",c=this.getSelection();if(c.length>0){b=String(c.length).replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,")+" "+w2utils.lang("selected");var d=c[0];"object"==typeof d&&(d=d.recid+", "+w2utils.lang("Column")+": "+d.column),1==c.length&&(b=w2utils.lang("Record ID")+": "+d+" ")}$("#grid_"+this.name+"_footer .w2ui-footer-left").html(b),1==c.length?this.toolbar.enable("w2ui-edit"):this.toolbar.disable("w2ui-edit"),c.length>=1?this.toolbar.enable("w2ui-delete"):this.toolbar.disable("w2ui-delete")}},lock:function(){var a=$(this.box).find("> div:first-child"),b=Array.prototype.slice.call(arguments,0);b.unshift(a),setTimeout(function(){w2utils.lock.apply(window,b)},10)},unlock:function(){var a=this.box;setTimeout(function(){w2utils.unlock(a)},25)},stateSave:function(a){if(!localStorage)return null;var b={columns:[],show:$.extend({},this.show),last:{search:this.last.search,multi:this.last.multi,logic:this.last.logic,caption:this.last.caption,field:this.last.field,scrollTop:this.last.scrollTop,scrollLeft:this.last.scrollLeft},sortData:[],searchData:[]};for(var c in this.columns){var d=this.columns[c];b.columns.push({field:d.field,hidden:d.hidden,size:d.size,sizeCalculated:d.sizeCalculated,sizeOriginal:d.sizeOriginal,sizeType:d.sizeType})}for(var c in this.sortData)b.sortData.push($.extend({},this.sortData[c]));for(var c in this.searchData)b.searchData.push($.extend({},this.searchData[c]));if(a!==!0){var e=this.trigger({phase:"before",type:"stateSave",target:this.name,state:b});if(e.isCancelled===!0)return void("function"==typeof callBack&&callBack({status:"error",message:"Request aborted."}));try{var f=$.parseJSON(localStorage.w2ui||"{}");f||(f={}),f.states||(f.states={}),f.states[this.name]=b,localStorage.w2ui=JSON.stringify(f)}catch(g){return delete localStorage.w2ui,null}this.trigger($.extend(e,{phase:"after"}))}return b},stateRestore:function(a){var b=this;if(!a)try{if(!localStorage)return!1;var c=$.parseJSON(localStorage.w2ui||"{}");c||(c={}),c.states||(c.states={}),a=c.states[this.name]}catch(d){return delete localStorage.w2ui,null}var e=this.trigger({phase:"before",type:"stateRestore",target:this.name,state:a});if(e.isCancelled===!0)return void("function"==typeof callBack&&callBack({status:"error",message:"Request aborted."}));if($.isPlainObject(a)){$.extend(this.show,a.show),$.extend(this.last,a.last);var f=this.last.scrollTop,g=this.last.scrollLeft;for(var h in a.columns){var c=a.columns[h],i=this.getColumn(c.field);i&&$.extend(i,c)}this.sortData.splice(0,this.sortData.length);for(var h in a.sortData)this.sortData.push(a.sortData[h]);this.searchData.splice(0,this.searchData.length);for(var h in a.searchData)this.searchData.push(a.searchData[h]);setTimeout(function(){b.sortData.length>0&&b.localSort(),b.searchData.length>0&&b.localSearch(),b.last.scrollTop=f,b.last.scrollLeft=g,b.refresh()},1)}return this.trigger($.extend(e,{phase:"after"})),!0},stateReset:function(){if(this.stateRestore(this.last.state),localStorage)try{var a=$.parseJSON(localStorage.w2ui||"{}");a.states&&a.states[this.name]&&delete a.states[this.name],localStorage.w2ui=JSON.stringify(a)}catch(b){return delete localStorage.w2ui,null}},parseField:function(a,b){var c="";try{c=a;var d=String(b).split(".");for(var e in d)c=c[d[e]]}catch(f){c=""}return c},prepareData:function(){for(var a in this.records){var b=this.records[a];for(var c in this.columns){var d=this.columns[c];if(null!=b[d.field]&&"string"==typeof d.render){if(-1!=["number","int","float","money","currency","percent"].indexOf(d.render.split(":")[0])&&"number"!=typeof b[d.field]&&(b[d.field]=parseFloat(b[d.field])),-1!=["date","age"].indexOf(d.render.split(":")[0])&&!b[d.field+"_"]){var e=b[d.field];w2utils.isInt(e)&&(e=parseInt(e)),b[d.field+"_"]=new Date(e)}if(-1!=["time"].indexOf(d.render))if(w2utils.isTime(b[d.field])){var f=w2utils.isTime(b[d.field],!0),e=new Date;e.setHours(f.hours,f.minutes,f.seconds?f.seconds:0,0),b[d.field+"_"]||(b[d.field+"_"]=e)}else{var f=b[d.field];w2utils.isInt(f)&&(f=parseInt(f));var f=null!=f?new Date(f):new Date,e=new Date;e.setHours(f.getHours(),f.getMinutes(),f.getSeconds(),0),b[d.field+"_"]||(b[d.field+"_"]=e)}}}}},nextCell:function(a,b){var c=a+1;if(this.columns.length==c)return null;if(b===!0){var d=this.columns[c].editable;if(this.columns[c].hidden||"undefined"==typeof d||d&&-1!=["checkbox","check"].indexOf(d.type))return this.nextCell(c,b)}return c},prevCell:function(a,b){var c=a-1;if(0>c)return null;if(b===!0){var d=this.columns[c].editable;if(this.columns[c].hidden||"undefined"==typeof d||d&&-1!=["checkbox","check"].indexOf(d.type))return this.prevCell(c,b)}return c},nextRow:function(a){if(a+1<this.records.length&&0==this.last.searchIds.length||this.last.searchIds.length>0&&a<this.last.searchIds[this.last.searchIds.length-1]){if(a++,this.last.searchIds.length>0)for(;;){if(-1!=$.inArray(a,this.last.searchIds)||a>this.records.length)break;a++}return a}return null},prevRow:function(a){if(a>0&&0==this.last.searchIds.length||this.last.searchIds.length>0&&a>this.last.searchIds[0]){if(a--,this.last.searchIds.length>0)for(;;){if(-1!=$.inArray(a,this.last.searchIds)||0>a)break;a--}return a}return null}},$.extend(w2grid.prototype,w2utils.event),w2obj.grid=w2grid}(),function(){var a=function(a){this.box=null,this.name=null,this.panels=[],this.tmp={},this.padding=1,this.resizer=4,this.style="",this.onShow=null,this.onHide=null,this.onResizing=null,this.onResizerClick=null,this.onRender=null,this.onRefresh=null,this.onResize=null,this.onDestroy=null,$.extend(!0,this,w2obj.layout,a)},b=["top","left","main","preview","right","bottom"];$.fn.w2layout=function(c){function d(a,b,c){var d=a.get(b);return null!==d&&"undefined"==typeof c&&(c=d.tabs),null===d||null===c?!1:($.isArray(c)&&(c={tabs:c}),$().w2destroy(a.name+"_"+b+"_tabs"),d.tabs=$().w2tabs($.extend({},c,{owner:a,name:a.name+"_"+b+"_tabs"})),d.show.tabs=!0,!0)}function e(a,b,c){var d=a.get(b);return null!==d&&"undefined"==typeof c&&(c=d.toolbar),null===d||null===c?!1:($.isArray(c)&&(c={items:c}),$().w2destroy(a.name+"_"+b+"_toolbar"),d.toolbar=$().w2toolbar($.extend({},c,{owner:a,name:a.name+"_"+b+"_toolbar"})),d.show.toolbar=!0,!0)}if("object"==typeof c||!c){if(!w2utils.checkName(c,"w2layout"))return;var f=c.panels||[],g=new a(c);$.extend(g,{handlers:[],panels:[]});for(var h=0,i=f.length;i>h;h++)g.panels[h]=$.extend(!0,{},a.prototype.panel,f[h]),($.isPlainObject(g.panels[h].tabs)||$.isArray(g.panels[h].tabs))&&d(g,f[h].type),($.isPlainObject(g.panels[h].toolbar)||$.isArray(g.panels[h].toolbar))&&e(g,f[h].type);for(var j in b)j=b[j],null===g.get(j)&&g.panels.push($.extend(!0,{},a.prototype.panel,{type:j,hidden:"main"!==j,size:50}));return $(this).length>0&&g.render($(this)[0]),w2ui[g.name]=g,g}if(w2ui[$(this).attr("name")]){var k=w2ui[$(this).attr("name")];return k[c].apply(k,Array.prototype.slice.call(arguments,1)),this}console.log("ERROR: Method "+c+" does not exist on jQuery.w2layout")},a.prototype={panel:{type:null,title:"",size:100,minSize:20,maxSize:!1,hidden:!1,resizable:!1,overflow:"auto",style:"",content:"",tabs:null,toolbar:null,width:null,height:null,show:{toolbar:!1,tabs:!1},onRefresh:null,onShow:null,onHide:null},html:function(a,b,c){return this.content(a,b,c)},content:function(a,b,c){var d=this,e=this.get(a);if("css"==a)return $("#layout_"+d.name+"_panel_css").html("<style>"+b+"</style>"),!0;if(null===e)return!1;if("undefined"==typeof b||null===b)return e.content;if(b instanceof jQuery)return console.log("ERROR: You can not pass jQuery object to w2layout.content() method"),!1;var f="#layout_"+this.name+"_panel_"+e.type,g=$(f+"> .w2ui-panel-content"),h=0;if(g.length>0&&($(f).scrollTop(0),h=$(g).position().top),""===e.content)e.content=b,this.refresh(a);else{if(e.content=b,!e.hidden&&null!==c&&""!==c&&"undefined"!=typeof c){var i=$(f+"> .w2ui-panel-content");i.after('<div class="w2ui-panel-content new-panel" style="'+i[0].style.cssText+'"></div>');var j=$(f+"> .w2ui-panel-content.new-panel");i.css("top",h),j.css("top",h),"object"==typeof b?(b.box=j[0],b.render()):j.html(b),w2utils.transition(i[0],j[0],c,function(){i.remove(),j.removeClass("new-panel"),j.css("overflow",e.overflow),d.resize(),-1!=window.navigator.userAgent.indexOf("MSIE")&&setTimeout(function(){d.resize()},100)})}this.refresh(a)}return d.resize(),-1!=window.navigator.userAgent.indexOf("MSIE")&&setTimeout(function(){d.resize()},100),!0},load:function(a,b,c,d){var e=this;return"css"==a?($.get(b,function(b,c,f){e.content(a,f.responseText),d&&d()}),!0):null!==this.get(a)?($.get(b,function(b,f,g){e.content(a,g.responseText,c),d&&d(),e.resize(),-1!=window.navigator.userAgent.indexOf("MSIE")&&setTimeout(function(){e.resize()},100)}),!0):!1},sizeTo:function(a,b){var c=this,d=c.get(a);return null===d?!1:($(c.box).find(" > div > .w2ui-panel").css({"-webkit-transition":".2s","-moz-transition":".2s","-ms-transition":".2s","-o-transition":".2s"}),setTimeout(function(){c.set(a,{size:b})},1),setTimeout(function(){$(c.box).find(" > div > .w2ui-panel").css({"-webkit-transition":"0s","-moz-transition":"0s","-ms-transition":"0s","-o-transition":"0s"}),c.resize()},500),!0)},show:function(a,b){var c=this,d=this.trigger({phase:"before",type:"show",target:a,object:this.get(a),immediate:b});if(d.isCancelled!==!0){var e=c.get(a);return null===e?!1:(e.hidden=!1,b===!0?($("#layout_"+c.name+"_panel_"+a).css({opacity:"1"}),e.resizable&&$("#layout_"+c.name+"_resizer_"+a).show(),c.trigger($.extend(d,{phase:"after"})),c.resize()):(e.resizable&&$("#layout_"+c.name+"_resizer_"+a).show(),$("#layout_"+c.name+"_panel_"+a).css({opacity:"0"}),$(c.box).find(" > div > .w2ui-panel").css({"-webkit-transition":".2s","-moz-transition":".2s","-ms-transition":".2s","-o-transition":".2s"}),setTimeout(function(){c.resize()},1),setTimeout(function(){$("#layout_"+c.name+"_panel_"+a).css({opacity:"1"})},250),setTimeout(function(){$(c.box).find(" > div > .w2ui-panel").css({"-webkit-transition":"0s","-moz-transition":"0s","-ms-transition":"0s","-o-transition":"0s"}),c.trigger($.extend(d,{phase:"after"})),c.resize()},500)),!0)}},hide:function(a,b){var c=this,d=this.trigger({phase:"before",type:"hide",target:a,object:this.get(a),immediate:b});if(d.isCancelled!==!0){var e=c.get(a);return null===e?!1:(e.hidden=!0,b===!0?($("#layout_"+c.name+"_panel_"+a).css({opacity:"0"}),$("#layout_"+c.name+"_resizer_"+a).hide(),c.trigger($.extend(d,{phase:"after"})),c.resize()):($("#layout_"+c.name+"_resizer_"+a).hide(),$(c.box).find(" > div > .w2ui-panel").css({"-webkit-transition":".2s","-moz-transition":".2s","-ms-transition":".2s","-o-transition":".2s"}),$("#layout_"+c.name+"_panel_"+a).css({opacity:"0"}),setTimeout(function(){c.resize()},1),setTimeout(function(){$(c.box).find(" > div > .w2ui-panel").css({"-webkit-transition":"0s","-moz-transition":"0s","-ms-transition":"0s","-o-transition":"0s"}),c.trigger($.extend(d,{phase:"after"})),c.resize()},500)),!0)}},toggle:function(a,b){var c=this.get(a);return null===c?!1:c.hidden?this.show(a,b):this.hide(a,b)},set:function(a,b){var c=this.get(a,!0);return null===c?!1:($.extend(this.panels[c],b),"undefined"!=typeof b.content&&this.refresh(a),this.resize(),!0)},get:function(a,b){for(var c in this.panels)if(this.panels[c].type==a)return b===!0?c:this.panels[c];return null},el:function(a){var b=$("#layout_"+this.name+"_panel_"+a+"> .w2ui-panel-content");return 1!=b.length?null:b[0]},hideToolbar:function(a){var b=this.get(a);b&&(b.show.toolbar=!1,$("#layout_"+this.name+"_panel_"+a+"> .w2ui-panel-toolbar").hide(),this.resize())},showToolbar:function(a){var b=this.get(a);b&&(b.show.toolbar=!0,$("#layout_"+this.name+"_panel_"+a+"> .w2ui-panel-toolbar").show(),this.resize())},toggleToolbar:function(a){var b=this.get(a);b&&(b.show.toolbar?this.hideToolbar(a):this.showToolbar(a))},hideTabs:function(a){var b=this.get(a);b&&(b.show.tabs=!1,$("#layout_"+this.name+"_panel_"+a+"> .w2ui-panel-tabs").hide(),this.resize())},showTabs:function(a){var b=this.get(a);b&&(b.show.tabs=!0,$("#layout_"+this.name+"_panel_"+a+"> .w2ui-panel-tabs").show(),this.resize())},toggleTabs:function(a){var b=this.get(a);b&&(b.show.tabs?this.hideTabs(a):this.showTabs(a))},render:function(a){function c(){g.tmp.events={resize:function(){w2ui[g.name].resize()},resizeStart:d,mouseMove:f,mouseUp:e},$(window).on("resize",g.tmp.events.resize)}function d(a,c){if(g.box){c||(c=window.event),window.addEventListener||window.document.attachEvent("onselectstart",function(){return!1}),$(document).off("mousemove",g.tmp.events.mouseMove).on("mousemove",g.tmp.events.mouseMove),$(document).off("mouseup",g.tmp.events.mouseUp).on("mouseup",g.tmp.events.mouseUp),g.tmp.resize={type:a,x:c.screenX,y:c.screenY,diff_x:0,diff_y:0,value:0};for(var d in b)d=b[d],g.lock(d,{opacity:0});("left"==a||"right"==a)&&(g.tmp.resize.value=parseInt($("#layout_"+g.name+"_resizer_"+a)[0].style.left)),("top"==a||"preview"==a||"bottom"==a)&&(g.tmp.resize.value=parseInt($("#layout_"+g.name+"_resizer_"+a)[0].style.top))}}function e(a){if(g.box&&(a||(a=window.event),window.addEventListener||window.document.attachEvent("onselectstart",function(){return!1}),$(document).off("mousemove",g.tmp.events.mouseMove),$(document).off("mouseup",g.tmp.events.mouseUp),"undefined"!=typeof g.tmp.resize)){for(var c in b)g.unlock(b[c]);if(0!==g.tmp.diff_x||0!==g.tmp.resize.diff_y){var d,e,f=g.get("top"),h=g.get("bottom"),i=g.get(g.tmp.resize.type),j=parseInt($(g.box).height()),k=parseInt($(g.box).width()),l=String(i.size);switch(g.tmp.resize.type){case"top":d=parseInt(i.sizeCalculated)+g.tmp.resize.diff_y,e=0;break;case"bottom":d=parseInt(i.sizeCalculated)-g.tmp.resize.diff_y,e=0;break;case"preview":d=parseInt(i.sizeCalculated)-g.tmp.resize.diff_y,e=(f&&!f.hidden?f.sizeCalculated:0)+(h&&!h.hidden?h.sizeCalculated:0);break;case"left":d=parseInt(i.sizeCalculated)+g.tmp.resize.diff_x,e=0;break;case"right":d=parseInt(i.sizeCalculated)-g.tmp.resize.diff_x,e=0}i.size="%"==l.substr(l.length-1)?Math.floor(100*d/("left"==i.type||"right"==i.type?k:j-e)*100)/100+"%":d,g.resize()}$("#layout_"+g.name+"_resizer_"+g.tmp.resize.type).removeClass("active"),delete g.tmp.resize}}function f(a){if(g.box&&(a||(a=window.event),"undefined"!=typeof g.tmp.resize)){var b=g.get(g.tmp.resize.type),c=g.tmp.resize,d=g.trigger({phase:"before",type:"resizing",target:g.name,object:b,originalEvent:a,panel:c?c.type:"all",diff_x:c?c.diff_x:0,diff_y:c?c.diff_y:0});if(d.isCancelled!==!0){var e=$("#layout_"+g.name+"_resizer_"+c.type),f=a.screenX-c.x,h=a.screenY-c.y,i=g.get("main");switch(e.hasClass("active")||e.addClass("active"),c.type){case"left":b.minSize-f>b.width&&(f=b.minSize-b.width),b.maxSize&&b.width+f>b.maxSize&&(f=b.maxSize-b.width),i.minSize+f>i.width&&(f=i.width-i.minSize);break;case"right":b.minSize+f>b.width&&(f=b.width-b.minSize),b.maxSize&&b.width-f>b.maxSize&&(f=b.width-b.maxSize),i.minSize-f>i.width&&(f=i.minSize-i.width);break;case"top":b.minSize-h>b.height&&(h=b.minSize-b.height),b.maxSize&&b.height+h>b.maxSize&&(h=b.maxSize-b.height),i.minSize+h>i.height&&(h=i.height-i.minSize);break;case"preview":case"bottom":b.minSize+h>b.height&&(h=b.height-b.minSize),b.maxSize&&b.height-h>b.maxSize&&(h=b.height-b.maxSize),i.minSize-h>i.height&&(h=i.minSize-i.height)}switch(c.diff_x=f,c.diff_y=h,c.type){case"top":case"preview":case"bottom":c.diff_x=0,e.length>0&&(e[0].style.top=c.value+c.diff_y+"px");break;case"left":case"right":c.diff_y=0,e.length>0&&(e[0].style.left=c.value+c.diff_x+"px")}g.trigger($.extend(d,{phase:"after"}))}}}var g=this,h=(new Date).getTime(),i=g.trigger({phase:"before",type:"render",target:g.name,box:a});if(i.isCancelled!==!0){if("undefined"!=typeof a&&null!==a&&($(g.box).find("#layout_"+g.name+"_panel_main").length>0&&$(g.box).removeAttr("name").removeClass("w2ui-layout").html(""),g.box=a),!g.box)return!1;$(g.box).attr("name",g.name).addClass("w2ui-layout").html("<div></div>"),$(g.box).length>0&&($(g.box)[0].style.cssText+=g.style);for(var j in b){j=b[j];var k=(g.get(j),'<div id="layout_'+g.name+"_panel_"+j+'" class="w2ui-panel">    <div class="w2ui-panel-title"></div>    <div class="w2ui-panel-tabs"></div>    <div class="w2ui-panel-toolbar"></div>    <div class="w2ui-panel-content"></div></div><div id="layout_'+g.name+"_resizer_"+j+'" class="w2ui-resizer"></div>');$(g.box).find(" > div").append(k)}return $(g.box).find(" > div").append('<div id="layout_'+g.name+'_panel_css" style="position: absolute; top: 10000px;"></div'),g.refresh(),g.trigger($.extend(i,{phase:"after"})),setTimeout(function(){c(),g.resize()
	},0),(new Date).getTime()-h}},refresh:function(a){var b=this;"undefined"==typeof a&&(a=null);var c=(new Date).getTime(),d=b.trigger({phase:"before",type:"refresh",target:"undefined"!=typeof a?a:b.name,object:b.get(a)});if(d.isCancelled!==!0){if("string"==typeof a){var e=b.get(a);if(null===e)return;var f="#layout_"+b.name+"_panel_"+e.type,g="#layout_"+b.name+"_resizer_"+e.type;$(f).css({display:e.hidden?"none":"block"}),e.resizable?$(g).show():$(g).hide(),"object"==typeof e.content&&"function"==typeof e.content.render?(e.content.box=$(f+"> .w2ui-panel-content")[0],setTimeout(function(){$(f+"> .w2ui-panel-content").length>0&&($(f+"> .w2ui-panel-content").removeClass().removeAttr("name").off("selectstart").addClass("w2ui-panel-content").css("overflow",e.overflow)[0].style.cssText+=";"+e.style),e.content.render()},1)):$(f+"> .w2ui-panel-content").length>0&&($(f+"> .w2ui-panel-content").removeClass().removeAttr("name").off("selectstart").addClass("w2ui-panel-content").html(e.content).css("overflow",e.overflow)[0].style.cssText+=";"+e.style);var h=$(b.box).find(f+"> .w2ui-panel-tabs");e.show.tabs?0===h.find("[name="+e.tabs.name+"]").length&&null!==e.tabs?h.w2render(e.tabs):e.tabs.refresh():h.html("").removeClass("w2ui-tabs").hide(),h=$(b.box).find(f+"> .w2ui-panel-toolbar"),e.show.toolbar?0===h.find("[name="+e.toolbar.name+"]").length&&null!==e.toolbar?h.w2render(e.toolbar):e.toolbar.refresh():h.html("").removeClass("w2ui-toolbar").hide(),h=$(b.box).find(f+"> .w2ui-panel-title"),e.title?h.html(e.title).show():h.html("").hide()}else{if(0==$("#layout_"+b.name+"_panel_main").length)return void b.render();b.resize();for(var i in this.panels)b.refresh(this.panels[i].type)}return b.trigger($.extend(d,{phase:"after"})),(new Date).getTime()-c}},resize:function(){if(!this.box)return!1;var a=(new Date).getTime(),c=this.tmp.resize,d=this.trigger({phase:"before",type:"resize",target:this.name,panel:c?c.type:"all",diff_x:c?c.diff_x:0,diff_y:c?c.diff_y:0});if(d.isCancelled!==!0){this.padding<0&&(this.padding=0);var e=parseInt($(this.box).width()),f=parseInt($(this.box).height());$(this.box).find(" > div").css({width:e+"px",height:f+"px"});var g,h,i,j,k,l=this,m=this.get("main"),n=this.get("preview"),o=this.get("left"),p=this.get("right"),q=this.get("top"),r=this.get("bottom"),s=null!==n&&n.hidden!==!0?!0:!1,t=null!==o&&o.hidden!==!0?!0:!1,u=null!==p&&p.hidden!==!0?!0:!1,v=null!==q&&q.hidden!==!0?!0:!1,w=null!==r&&r.hidden!==!0?!0:!1;for(var x in b)if(x=b[x],"main"!==x){var c=this.get(x);if(c){var y=String(c.size||0);if("%"==y.substr(y.length-1)){var z=f;"preview"==c.type&&(z=z-(q&&!q.hidden?q.sizeCalculated:0)-(r&&!r.hidden?r.sizeCalculated:0)),c.sizeCalculated=parseInt(("left"==c.type||"right"==c.type?e:z)*parseFloat(c.size)/100)}else c.sizeCalculated=parseInt(c.size);c.sizeCalculated=Math.max(c.sizeCalculated,parseInt(c.minSize))}}null!==q&&q.hidden!==!0?(g=0,h=0,i=e,j=q.sizeCalculated,$("#layout_"+this.name+"_panel_top").css({display:"block",left:g+"px",top:h+"px",width:i+"px",height:j+"px"}).show(),q.width=i,q.height=j,q.resizable&&(h=q.sizeCalculated-(0===this.padding?this.resizer:0),j=this.resizer>this.padding?this.resizer:this.padding,$("#layout_"+this.name+"_resizer_top").show().css({display:"block",left:g+"px",top:h+"px",width:i+"px",height:j+"px",cursor:"ns-resize"}).off("mousedown").on("mousedown",function(a){var b=l.trigger({phase:"before",type:"resizerClick",target:"top",originalEvent:a});if(b.isCancelled!==!0)return w2ui[l.name].tmp.events.resizeStart("top",a),l.trigger($.extend(b,{phase:"after"})),!1}))):$("#layout_"+this.name+"_panel_top").hide(),null!==o&&o.hidden!==!0?(g=0,h=0+(v?q.sizeCalculated+this.padding:0),i=o.sizeCalculated,j=f-(v?q.sizeCalculated+this.padding:0)-(w?r.sizeCalculated+this.padding:0),k=$("#layout_"+this.name+"_panel_left"),-1!=window.navigator.userAgent.indexOf("MSIE")&&k.length>0&&k[0].clientHeight<k[0].scrollHeight&&(i+=17),k.css({display:"block",left:g+"px",top:h+"px",width:i+"px",height:j+"px"}).show(),o.width=i,o.height=j,o.resizable&&(g=o.sizeCalculated-(0===this.padding?this.resizer:0),i=this.resizer>this.padding?this.resizer:this.padding,$("#layout_"+this.name+"_resizer_left").show().css({display:"block",left:g+"px",top:h+"px",width:i+"px",height:j+"px",cursor:"ew-resize"}).off("mousedown").on("mousedown",function(a){var b=l.trigger({phase:"before",type:"resizerClick",target:"left",originalEvent:a});if(b.isCancelled!==!0)return w2ui[l.name].tmp.events.resizeStart("left",a),l.trigger($.extend(b,{phase:"after"})),!1}))):($("#layout_"+this.name+"_panel_left").hide(),$("#layout_"+this.name+"_resizer_left").hide()),null!==p&&p.hidden!==!0?(g=e-p.sizeCalculated,h=0+(v?q.sizeCalculated+this.padding:0),i=p.sizeCalculated,j=f-(v?q.sizeCalculated+this.padding:0)-(w?r.sizeCalculated+this.padding:0),$("#layout_"+this.name+"_panel_right").css({display:"block",left:g+"px",top:h+"px",width:i+"px",height:j+"px"}).show(),p.width=i,p.height=j,p.resizable&&(g-=this.padding,i=this.resizer>this.padding?this.resizer:this.padding,$("#layout_"+this.name+"_resizer_right").show().css({display:"block",left:g+"px",top:h+"px",width:i+"px",height:j+"px",cursor:"ew-resize"}).off("mousedown").on("mousedown",function(a){var b=l.trigger({phase:"before",type:"resizerClick",target:"right",originalEvent:a});if(b.isCancelled!==!0)return w2ui[l.name].tmp.events.resizeStart("right",a),l.trigger($.extend(b,{phase:"after"})),!1}))):$("#layout_"+this.name+"_panel_right").hide(),null!==r&&r.hidden!==!0?(g=0,h=f-r.sizeCalculated,i=e,j=r.sizeCalculated,$("#layout_"+this.name+"_panel_bottom").css({display:"block",left:g+"px",top:h+"px",width:i+"px",height:j+"px"}).show(),r.width=i,r.height=j,r.resizable&&(h-=0===this.padding?0:this.padding,j=this.resizer>this.padding?this.resizer:this.padding,$("#layout_"+this.name+"_resizer_bottom").show().css({display:"block",left:g+"px",top:h+"px",width:i+"px",height:j+"px",cursor:"ns-resize"}).off("mousedown").on("mousedown",function(a){var b=l.trigger({phase:"before",type:"resizerClick",target:"bottom",originalEvent:a});if(b.isCancelled!==!0)return w2ui[l.name].tmp.events.resizeStart("bottom",a),l.trigger($.extend(b,{phase:"after"})),!1}))):$("#layout_"+this.name+"_panel_bottom").hide(),g=0+(t?o.sizeCalculated+this.padding:0),h=0+(v?q.sizeCalculated+this.padding:0),i=e-(t?o.sizeCalculated+this.padding:0)-(u?p.sizeCalculated+this.padding:0),j=f-(v?q.sizeCalculated+this.padding:0)-(w?r.sizeCalculated+this.padding:0)-(s?n.sizeCalculated+this.padding:0),k=$("#layout_"+this.name+"_panel_main"),-1!=window.navigator.userAgent.indexOf("MSIE")&&k.length>0&&k[0].clientHeight<k[0].scrollHeight&&(i+=17),k.css({display:"block",left:g+"px",top:h+"px",width:i+"px",height:j+"px"}),m.width=i,m.height=j,null!==n&&n.hidden!==!0?(g=0+(t?o.sizeCalculated+this.padding:0),h=f-(w?r.sizeCalculated+this.padding:0)-n.sizeCalculated,i=e-(t?o.sizeCalculated+this.padding:0)-(u?p.sizeCalculated+this.padding:0),j=n.sizeCalculated,k=$("#layout_"+this.name+"_panel_preview"),-1!=window.navigator.userAgent.indexOf("MSIE")&&k.length>0&&k[0].clientHeight<k[0].scrollHeight&&(i+=17),k.css({display:"block",left:g+"px",top:h+"px",width:i+"px",height:j+"px"}).show(),n.width=i,n.height=j,n.resizable&&(h-=0===this.padding?0:this.padding,j=this.resizer>this.padding?this.resizer:this.padding,$("#layout_"+this.name+"_resizer_preview").show().css({display:"block",left:g+"px",top:h+"px",width:i+"px",height:j+"px",cursor:"ns-resize"}).off("mousedown").on("mousedown",function(a){var b=l.trigger({phase:"before",type:"resizerClick",target:"preview",originalEvent:a});if(b.isCancelled!==!0)return w2ui[l.name].tmp.events.resizeStart("preview",a),l.trigger($.extend(b,{phase:"after"})),!1}))):$("#layout_"+this.name+"_panel_preview").hide();for(var A in b){A=b[A];var B=this.get(A),C="#layout_"+this.name+"_panel_"+A+" > .w2ui-panel-",D=0;B&&(B.title&&(D+=w2utils.getSize($(C+"title").css({top:D+"px",display:"block"}),"height")),B.show.tabs&&(null!==B.tabs&&w2ui[this.name+"_"+A+"_tabs"]&&w2ui[this.name+"_"+A+"_tabs"].resize(),D+=w2utils.getSize($(C+"tabs").css({top:D+"px",display:"block"}),"height")),B.show.toolbar&&(null!==B.toolbar&&w2ui[this.name+"_"+A+"_toolbar"]&&w2ui[this.name+"_"+A+"_toolbar"].resize(),D+=w2utils.getSize($(C+"toolbar").css({top:D+"px",display:"block"}),"height"))),$(C+"content").css({display:"block"}).css({top:D+"px"})}return clearTimeout(this._resize_timer),this._resize_timer=setTimeout(function(){for(var a in w2ui)if("function"==typeof w2ui[a].resize){"undefined"==w2ui[a].panels&&w2ui[a].resize();var b=$(w2ui[a].box).parents(".w2ui-layout");b.length>0&&b.attr("name")==l.name&&w2ui[a].resize()}},100),this.trigger($.extend(d,{phase:"after"})),(new Date).getTime()-a}},destroy:function(){var a=this.trigger({phase:"before",type:"destroy",target:this.name});if(a.isCancelled!==!0)return"undefined"==typeof w2ui[this.name]?!1:($(this.box).find("#layout_"+this.name+"_panel_main").length>0&&$(this.box).removeAttr("name").removeClass("w2ui-layout").html(""),delete w2ui[this.name],this.trigger($.extend(a,{phase:"after"})),this.tmp.events&&this.tmp.events.resize&&$(window).off("resize",this.tmp.events.resize),!0)},lock:function(a){if(-1==b.indexOf(a))return void console.log("ERROR: First parameter needs to be the a valid panel name.");var c=Array.prototype.slice.call(arguments,0);c[0]="#layout_"+this.name+"_panel_"+a,w2utils.lock.apply(window,c)},unlock:function(a){if(-1==b.indexOf(a))return void console.log("ERROR: First parameter needs to be the a valid panel name.");var c="#layout_"+this.name+"_panel_"+a;w2utils.unlock(c)}},$.extend(a.prototype,w2utils.event),w2obj.layout=a}();var w2popup={};!function(){$.fn.w2popup=function(a,b){"undefined"==typeof a&&(b={},a="open"),$.isPlainObject(a)&&(b=a,a="open"),a=a.toLowerCase(),"load"===a&&"string"==typeof b&&(b=$.extend({url:b},arguments.length>2?arguments[2]:{})),"open"===a&&null!=b.url&&(a="load"),b=b||{};var c={};return $(this).length>0&&($(this).find("div[rel=title], div[rel=body], div[rel=buttons]").length>0?($(this).find("div[rel=title]").length>0&&(c.title=$(this).find("div[rel=title]").html()),$(this).find("div[rel=body]").length>0&&(c.body=$(this).find("div[rel=body]").html(),c.style=$(this).find("div[rel=body]")[0].style.cssText),$(this).find("div[rel=buttons]").length>0&&(c.buttons=$(this).find("div[rel=buttons]").html())):(c.title="&nbsp;",c.body=$(this).html()),0!=parseInt($(this).css("width"))&&(c.width=parseInt($(this).css("width"))),0!=parseInt($(this).css("height"))&&(c.height=parseInt($(this).css("height")))),w2popup[a]($.extend({},c,b))},w2popup={defaults:{title:"",body:"",buttons:"",style:"",color:"#000",opacity:.4,speed:.3,modal:!1,maximized:!1,keyboard:!0,width:500,height:300,showClose:!0,showMax:!1,transition:null},status:"closed",handlers:[],onOpen:null,onClose:null,onMax:null,onMin:null,onToggle:null,onKeydown:null,open:function(a){function b(a){return a||(a=window.event),window.addEventListener||window.document.attachEvent("onselectstart",function(){return!1}),w2popup.status="moving",q.resizing=!0,q.x=a.screenX,q.y=a.screenY,q.pos_x=$("#w2ui-popup").position().left,q.pos_y=$("#w2ui-popup").position().top,w2popup.lock({opacity:0}),$(document).on("mousemove",q.mvMove),$(document).on("mouseup",q.mvStop),a.stopPropagation?a.stopPropagation():a.cancelBubble=!0,a.preventDefault?void a.preventDefault():!1}function c(a){1==q.resizing&&(a||(a=window.event),q.div_x=a.screenX-q.x,q.div_y=a.screenY-q.y,$("#w2ui-popup").css({"-webkit-transition":"none","-webkit-transform":"translate3d("+q.div_x+"px, "+q.div_y+"px, 0px)","-moz-transition":"none","-moz-transform":"translate("+q.div_x+"px, "+q.div_y+"px)","-ms-transition":"none","-ms-transform":"translate("+q.div_x+"px, "+q.div_y+"px)","-o-transition":"none","-o-transform":"translate("+q.div_x+"px, "+q.div_y+"px)"}))}function d(a){1==q.resizing&&(a||(a=window.event),w2popup.status="open",q.div_x=a.screenX-q.x,q.div_y=a.screenY-q.y,$("#w2ui-popup").css({left:q.pos_x+q.div_x+"px",top:q.pos_y+q.div_y+"px","-webkit-transition":"none","-webkit-transform":"translate3d(0px, 0px, 0px)","-moz-transition":"none","-moz-transform":"translate(0px, 0px)","-ms-transition":"none","-ms-transform":"translate(0px, 0px)","-o-transition":"none","-o-transform":"translate(0px, 0px)"}),q.resizing=!1,$(document).off("mousemove",q.mvMove),$(document).off("mouseup",q.mvStop),w2popup.unlock())}var e=this;if("closing"==w2popup.status)return void setTimeout(function(){e.open.call(e,a)},100);var f=$("#w2ui-popup").data("options"),a=$.extend({},this.defaults,f,{title:"",body:"",buttons:""},a,{maximized:!1});if(setTimeout(function(){$("#w2ui-popup").data("options",a)},100),0==$("#w2ui-popup").length&&(w2popup.handlers=[],w2popup.onMax=null,w2popup.onMin=null,w2popup.onToggle=null,w2popup.onOpen=null,w2popup.onClose=null,w2popup.onKeydown=null),a.onOpen&&(w2popup.onOpen=a.onOpen),a.onClose&&(w2popup.onClose=a.onClose),a.onMax&&(w2popup.onMax=a.onMax),a.onMin&&(w2popup.onMin=a.onMin),a.onToggle&&(w2popup.onToggle=a.onToggle),a.onKeydown&&(w2popup.onKeydown=a.onKeydown),void 0==window.innerHeight){var g=document.documentElement.offsetWidth,h=document.documentElement.offsetHeight;"IE7"===w2utils.engine&&(g+=21,h+=4)}else var g=window.innerWidth,h=window.innerHeight;parseInt(g)-10<parseInt(a.width)&&(a.width=parseInt(g)-10),parseInt(h)-10<parseInt(a.height)&&(a.height=parseInt(h)-10);var i=parseInt((parseInt(h)-parseInt(a.height))/2*.6),j=parseInt((parseInt(g)-parseInt(a.width))/2);if(0==$("#w2ui-popup").length){var k=this.trigger({phase:"before",type:"open",target:"popup",options:a,present:!1});if(k.isCancelled===!0)return;w2popup.status="opening",w2popup.lockScreen(a);var l="";a.showClose&&(l+='<div class="w2ui-msg-button w2ui-msg-close" onmousedown="event.stopPropagation()" onclick="w2popup.close()">Close</div>'),a.showMax&&(l+='<div class="w2ui-msg-button w2ui-msg-max" onmousedown="event.stopPropagation()" onclick="w2popup.toggle()">Max</div>');var m='<div id="w2ui-popup" class="w2ui-popup" style="opacity: 0; left: '+j+"px; top: "+i+"px;     width: "+parseInt(a.width)+"px; height: "+parseInt(a.height)+'px;     -webkit-transform: scale(0.8); -moz-transform: scale(0.8); -ms-transform: scale(0.8); -o-transform: scale(0.8); ">   <div class="w2ui-msg-title" style="'+(""==a.title?"display: none":"")+'">'+l+a.title+'</div>   <div class="w2ui-box1" style="'+(""==a.title?"top: 0px !important;":"")+(""==a.buttons?"bottom: 0px !important;":"")+'">       <div class="w2ui-msg-body'+(""!=!a.title?" w2ui-msg-no-title":"")+(""!=!a.buttons?" w2ui-msg-no-buttons":"")+'" style="'+a.style+'">'+a.body+'</div>   </div>   <div class="w2ui-box2" style="'+(""==a.title?"top: 0px !important;":"")+(""==a.buttons?"bottom: 0px !important;":"")+'">       <div class="w2ui-msg-body'+(""!=!a.title?" w2ui-msg-no-title":"")+(""!=!a.buttons?" w2ui-msg-no-buttons":"")+'" style="'+a.style+'"></div>       </div>   <div class="w2ui-msg-buttons" style="'+(""==a.buttons?"display: none":"")+'">'+a.buttons+"</div></div>";$("body").append(m),setTimeout(function(){$("#w2ui-popup .w2ui-box2").hide(),$("#w2ui-popup").css({"-webkit-transition":a.speed+"s opacity, "+a.speed+"s -webkit-transform","-webkit-transform":"scale(1)","-moz-transition":a.speed+"s opacity, "+a.speed+"s -moz-transform","-moz-transform":"scale(1)","-ms-transition":a.speed+"s opacity, "+a.speed+"s -ms-transform","-ms-transform":"scale(1)","-o-transition":a.speed+"s opacity, "+a.speed+"s -o-transform","-o-transform":"scale(1)",opacity:"1"})},1),setTimeout(function(){$("#w2ui-popup").css({"-webkit-transform":"","-moz-transform":"","-ms-transform":"","-o-transform":""}),w2popup.status="open",setTimeout(function(){e.trigger($.extend(k,{phase:"after"}))},100)},1e3*a.speed)}else{var k=this.trigger({phase:"before",type:"open",target:"popup",options:a,present:!0});if(k.isCancelled===!0)return;w2popup.status="opening",("undefined"==typeof f||f.width!=a.width||f.height!=a.height)&&w2popup.resize(a.width,a.height),"undefined"!=typeof f&&(a.prevSize=a.width+":"+a.height,a.maximized=f.maximized);var n=$("#w2ui-popup .w2ui-box2 > .w2ui-msg-body").html(a.body);n.length>0&&(n[0].style.cssText=a.style),""!=a.buttons?($("#w2ui-popup .w2ui-msg-buttons").show().html(a.buttons),$("#w2ui-popup .w2ui-msg-body").removeClass("w2ui-msg-no-buttons"),$("#w2ui-popup .w2ui-box1, #w2ui-popup .w2ui-box2").css("bottom","")):($("#w2ui-popup .w2ui-msg-buttons").hide().html(""),$("#w2ui-popup .w2ui-msg-body").addClass("w2ui-msg-no-buttons"),$("#w2ui-popup .w2ui-box1, #w2ui-popup .w2ui-box2").css("bottom","0px")),""!=a.title?($("#w2ui-popup .w2ui-msg-title").show().html((a.showClose?'<div class="w2ui-msg-button w2ui-msg-close" onmousedown="event.stopPropagation()" onclick="w2popup.close()">Close</div>':"")+(a.showMax?'<div class="w2ui-msg-button w2ui-msg-max" onmousedown="event.stopPropagation()" onclick="w2popup.toggle()">Max</div>':"")+a.title),$("#w2ui-popup .w2ui-msg-body").removeClass("w2ui-msg-no-title"),$("#w2ui-popup .w2ui-box1, #w2ui-popup .w2ui-box2").css("top","")):($("#w2ui-popup .w2ui-msg-title").hide().html(""),$("#w2ui-popup .w2ui-msg-body").addClass("w2ui-msg-no-title"),$("#w2ui-popup .w2ui-box1, #w2ui-popup .w2ui-box2").css("top","0px"));var o=$("#w2ui-popup .w2ui-box1")[0],p=$("#w2ui-popup .w2ui-box2")[0];w2utils.transition(o,p,a.transition),p.className="w2ui-box1",o.className="w2ui-box2",$(p).addClass("w2ui-current-box"),$("#w2ui-popup").data("prev-size",null),setTimeout(function(){w2popup.status="open",e.trigger($.extend(k,{phase:"after"}))},100)}a._last_w2ui_name=w2utils.keyboard.active(),w2utils.keyboard.active(null),a.keyboard&&$(document).on("keydown",this.keydown);var q={resizing:!1,mvMove:c,mvStop:d};return $("#w2ui-popup .w2ui-msg-title").on("mousedown",function(a){b(a)}),this},keydown:function(a){var b=$("#w2ui-popup").data("options");if(b&&b.keyboard){var c=w2popup.trigger({phase:"before",type:"keydown",target:"popup",options:b,originalEvent:a});if(c.isCancelled!==!0){switch(a.keyCode){case 27:a.preventDefault(),$("#w2ui-popup .w2ui-popup-message").length>0?w2popup.message():w2popup.close()}w2popup.trigger($.extend(c,{phase:"after"}))}}},close:function(a){var b=this,a=$.extend({},$("#w2ui-popup").data("options"),a);if(0!=$("#w2ui-popup").length){var c=this.trigger({phase:"before",type:"close",target:"popup",options:a});c.isCancelled!==!0&&(w2popup.status="closing",$("#w2ui-popup").css({"-webkit-transition":a.speed+"s opacity, "+a.speed+"s -webkit-transform","-webkit-transform":"scale(0.9)","-moz-transition":a.speed+"s opacity, "+a.speed+"s -moz-transform","-moz-transform":"scale(0.9)","-ms-transition":a.speed+"s opacity, "+a.speed+"s -ms-transform","-ms-transform":"scale(0.9)","-o-transition":a.speed+"s opacity, "+a.speed+"s -o-transform","-o-transform":"scale(0.9)",opacity:"0"}),w2popup.unlockScreen(a),setTimeout(function(){$("#w2ui-popup").remove(),w2popup.status="closed",b.trigger($.extend(c,{phase:"after"}))},1e3*a.speed),w2utils.keyboard.active(a._last_w2ui_name),a.keyboard&&$(document).off("keydown",this.keydown))}},toggle:function(){var a=this,b=$("#w2ui-popup").data("options"),c=this.trigger({phase:"before",type:"toggle",target:"popup",options:b});c.isCancelled!==!0&&(b.maximized===!0?w2popup.min():w2popup.max(),setTimeout(function(){a.trigger($.extend(c,{phase:"after"}))},1e3*b.speed+50))},max:function(){var a=this,b=$("#w2ui-popup").data("options");if(b.maximized!==!0){var c=this.trigger({phase:"before",type:"max",target:"popup",options:b});c.isCancelled!==!0&&(w2popup.status="resizing",b.prevSize=$("#w2ui-popup").css("width")+":"+$("#w2ui-popup").css("height"),w2popup.resize(1e4,1e4,function(){w2popup.status="open",b.maximized=!0,a.trigger($.extend(c,{phase:"after"}))}))}},min:function(){var a=this,b=$("#w2ui-popup").data("options");if(b.maximized===!0){var c=b.prevSize.split(":"),d=this.trigger({phase:"before",type:"min",target:"popup",options:b});d.isCancelled!==!0&&(w2popup.status="resizing",w2popup.resize(c[0],c[1],function(){w2popup.status="open",b.maximized=!1,b.prevSize=null,a.trigger($.extend(d,{phase:"after"}))}))}},get:function(){return $("#w2ui-popup").data("options")},set:function(a){w2popup.open(a)},clear:function(){$("#w2ui-popup .w2ui-msg-title").html(""),$("#w2ui-popup .w2ui-msg-body").html(""),$("#w2ui-popup .w2ui-msg-buttons").html("")},reset:function(){w2popup.open(w2popup.defaults)},load:function(a){function b(b,c){if(delete a.url,$("body").append('<div id="w2ui-tmp" style="display: none">'+b+"</div>"),"undefined"!=typeof c&&$("#w2ui-tmp #"+c).length>0?$("#w2ui-tmp #"+c).w2popup(a):$("#w2ui-tmp > div").w2popup(a),$("#w2ui-tmp > style").length>0){var d=$("<div>").append($("#w2ui-tmp > style").clone()).html();0==$("#w2ui-popup #div-style").length&&$("#w2ui-popup").append('<div id="div-style" style="position: absolute; left: -100; width: 1px"></div>'),$("#w2ui-popup #div-style").html(d)}$("#w2ui-tmp").remove()}if(w2popup.status="loading","undefined"==String(a.url))return void console.log("ERROR: The url parameter is empty.");var c=String(a.url).split("#"),d=c[0],e=c[1];"undefined"==String(a)&&(a={});var f=$("#w2ui-popup").data(d);"undefined"!=typeof f&&null!=f?b(f,e):$.get(d,function(a,c,f){b(f.responseText,e),$("#w2ui-popup").data(d,f.responseText)})},message:function(a){$().w2tag(),a||(a={width:200,height:100}),parseInt(a.width)<10&&(a.width=10),parseInt(a.height)<10&&(a.height=10),"undefined"==typeof a.hideOnClick&&(a.hideOnClick=!1);var b=$("#w2ui-popup").data("options")||{};("undefined"==typeof a.width||a.width>b.width-10)&&(a.width=b.width-10),("undefined"==typeof a.height||a.height>b.height-40)&&(a.height=b.height-40);var c=$("#w2ui-popup .w2ui-msg-title"),d=parseInt($("#w2ui-popup").width()),e=$("#w2ui-popup .w2ui-popup-message").length;if(""==$.trim(a.html)){$("#w2ui-popup #w2ui-message"+(e-1)).css("z-Index",250);var a=$("#w2ui-popup #w2ui-message"+(e-1)).data("options")||{};$("#w2ui-popup #w2ui-message"+(e-1)).remove(),"function"==typeof a.onClose&&a.onClose(),1==e?w2popup.unlock():$("#w2ui-popup #w2ui-message"+(e-2)).show()}else{$("#w2ui-popup .w2ui-popup-message").hide(),$("#w2ui-popup .w2ui-box1").before('<div id="w2ui-message'+e+'" class="w2ui-popup-message" style="display: none; '+(0==c.length?"top: 0px;":"top: "+w2utils.getSize(c,"height")+"px;")+("undefined"!=typeof a.width?"width: "+a.width+"px; left: "+(d-a.width)/2+"px;":"left: 10px; right: 10px;")+("undefined"!=typeof a.height?"height: "+a.height+"px;":"bottom: 6px;")+'-webkit-transition: .3s; -moz-transition: .3s; -ms-transition: .3s; -o-transition: .3s;"'+(a.hideOnClick===!0?'onclick="w2popup.message();"':"")+"></div>"),$("#w2ui-popup #w2ui-message"+e).data("options",a);var f=$("#w2ui-popup #w2ui-message"+e).css("display");$("#w2ui-popup #w2ui-message"+e).css({"-webkit-transform":"none"==f?"translateY(-"+a.height+"px)":"translateY(0px)","-moz-transform":"none"==f?"translateY(-"+a.height+"px)":"translateY(0px)","-ms-transform":"none"==f?"translateY(-"+a.height+"px)":"translateY(0px)","-o-transform":"none"==f?"translateY(-"+a.height+"px)":"translateY(0px)"}),"none"==f&&($("#w2ui-popup #w2ui-message"+e).show().html(a.html),setTimeout(function(){$("#w2ui-popup #w2ui-message"+e).css({"-webkit-transform":"none"==f?"translateY(0px)":"translateY(-"+a.height+"px)","-moz-transform":"none"==f?"translateY(0px)":"translateY(-"+a.height+"px)","-ms-transform":"none"==f?"translateY(0px)":"translateY(-"+a.height+"px)","-o-transform":"none"==f?"translateY(0px)":"translateY(-"+a.height+"px)"})},1),setTimeout(function(){$("#w2ui-popup #w2ui-message"+e).css({"-webkit-transition":"0s","-moz-transition":"0s","-ms-transition":"0s","-o-transition":"0s","z-Index":1500}),0==e&&w2popup.lock(),"function"==typeof a.onOpen&&a.onOpen()},300))}},lock:function(){var a=Array.prototype.slice.call(arguments,0);a.unshift($("#w2ui-popup")),w2utils.lock.apply(window,a)},unlock:function(){w2utils.unlock($("#w2ui-popup"))},lockScreen:function(a){return $("#w2ui-lock").length>0?!1:("undefined"==typeof a&&(a=$("#w2ui-popup").data("options")),"undefined"==typeof a&&(a={}),a=$.extend({},w2popup.defaults,a),$("body").append('<div id="w2ui-lock"     onmousewheel="if (event.stopPropagation) event.stopPropagation(); else event.cancelBubble = true; if (event.preventDefault) event.preventDefault(); else return false;"    style="position: '+("IE5"==w2utils.engine?"absolute":"fixed")+"; z-Index: 1199; left: 0px; top: 0px;            padding: 0px; margin: 0px; background-color: "+a.color+'; width: 100%; height: 100%; opacity: 0;"></div>'),setTimeout(function(){$("#w2ui-lock").css({"-webkit-transition":a.speed+"s opacity","-moz-transition":a.speed+"s opacity","-ms-transition":a.speed+"s opacity","-o-transition":a.speed+"s opacity",opacity:a.opacity})},1),1==a.modal?($("#w2ui-lock").on("mousedown",function(){$("#w2ui-lock").css({"-webkit-transition":".1s","-moz-transition":".1s","-ms-transition":".1s","-o-transition":".1s",opacity:"0.6"})}),$("#w2ui-lock").on("mouseup",function(){setTimeout(function(){$("#w2ui-lock").css({"-webkit-transition":".1s","-moz-transition":".1s","-ms-transition":".1s","-o-transition":".1s",opacity:a.opacity})},100)})):$("#w2ui-lock").on("mouseup",function(){w2popup.close()}),!0)},unlockScreen:function(a){return 0==$("#w2ui-lock").length?!1:("undefined"==typeof a&&(a=$("#w2ui-popup").data("options")),"undefined"==typeof a&&(a={}),a=$.extend({},w2popup.defaults,a),$("#w2ui-lock").css({"-webkit-transition":a.speed+"s opacity","-moz-transition":a.speed+"s opacity","-ms-transition":a.speed+"s opacity","-o-transition":a.speed+"s opacity",opacity:0}),setTimeout(function(){$("#w2ui-lock").remove()},1e3*a.speed),!0)},resize:function(a,b,c){var d=$("#w2ui-popup").data("options");parseInt($(window).width())-10<parseInt(a)&&(a=parseInt($(window).width())-10),parseInt($(window).height())-10<parseInt(b)&&(b=parseInt($(window).height())-10);var e=(parseInt($(window).height())-parseInt(b))/2*.8,f=(parseInt($(window).width())-parseInt(a))/2;$("#w2ui-popup").css({"-webkit-transition":d.speed+"s width, "+d.speed+"s height, "+d.speed+"s left, "+d.speed+"s top","-moz-transition":d.speed+"s width, "+d.speed+"s height, "+d.speed+"s left, "+d.speed+"s top","-ms-transition":d.speed+"s width, "+d.speed+"s height, "+d.speed+"s left, "+d.speed+"s top","-o-transition":d.speed+"s width, "+d.speed+"s height, "+d.speed+"s left, "+d.speed+"s top",top:e,left:f,width:a,height:b}),setTimeout(function(){d.width=a,d.height=b,"function"==typeof c&&c()},1e3*d.speed+50)}},$.extend(w2popup,w2utils.event)}();var w2alert=function(a,b,c){null==b&&(b=w2utils.lang("Notification")),$("#w2ui-popup").length>0&&"closing"!=w2popup.status?w2popup.message({width:400,height:170,html:'<div style="position: absolute; top: 0px; left: 0px; right: 0px; bottom: 45px; overflow: auto">        <div class="w2ui-centered" style="font-size: 13px;">'+a+'</div></div><div style="position: absolute; bottom: 7px; left: 0px; right: 0px; text-align: center; padding: 5px">        <button onclick="w2popup.message();" class="w2ui-popup-btn btn">'+w2utils.lang("Ok")+"</button></div>",onClose:function(){"function"==typeof c&&c()}}):w2popup.open({width:450,height:220,showMax:!1,showClose:!1,title:b,body:'<div class="w2ui-centered" style="font-size: 13px;">'+a+"</div>",buttons:'<button onclick="w2popup.close();" class="w2ui-popup-btn btn">'+w2utils.lang("Ok")+"</button>",onClose:function(){"function"==typeof c&&c()}})},w2confirm=function(a,b,c){var d={},e={msg:"",title:w2utils.lang("Confirmation"),width:$("#w2ui-popup").length>0?400:450,height:$("#w2ui-popup").length>0?170:220,yes_text:"Yes",yes_class:"",yes_style:"",yes_callBack:null,no_text:"No",no_class:"",no_style:"",no_callBack:null,callBack:null};return 1==arguments.length&&"object"==typeof a?$.extend(d,e,a):"function"==typeof b?$.extend(d,e,{msg:a,callBack:b}):$.extend(d,e,{msg:a,title:b,callBack:c}),$("#w2ui-popup").length>0&&"closing"!=w2popup.status?(d.width>w2popup.get().width&&(d.width=w2popup.get().width),d.height>w2popup.get().height-50&&(d.height=w2popup.get().height-50),w2popup.message({width:d.width,height:d.height,html:'<div style="position: absolute; top: 0px; left: 0px; right: 0px; bottom: 40px; overflow: auto">        <div class="w2ui-centered" style="font-size: 13px;">'+d.msg+'</div></div><div style="position: absolute; bottom: 7px; left: 0px; right: 0px; text-align: center; padding: 5px">        <button id="Yes" class="w2ui-popup-btn btn '+d.yes_class+'" style="'+d.yes_style+'">'+w2utils.lang(d.yes_text)+'</button>        <button id="No" class="w2ui-popup-btn btn '+d.no_class+'" style="'+d.no_style+'">'+w2utils.lang(d.no_text)+"</button></div>",onOpen:function(){$("#w2ui-popup .w2ui-popup-message .btn").on("click",function(a){w2popup.message(),"function"==typeof d.callBack&&d.callBack(a.target.id),"Yes"==a.target.id&&"function"==typeof d.yes_callBack&&d.yes_callBack(),"No"==a.target.id&&"function"==typeof d.no_callBack&&d.no_callBack()})},onKeydown:function(a){switch(a.originalEvent.keyCode){case 13:"function"==typeof d.callBack&&d.callBack("Yes"),"function"==typeof d.yes_callBack&&d.yes_callBack(),w2popup.message();break;case 27:"function"==typeof d.callBack&&d.callBack("No"),"function"==typeof d.no_callBack&&d.no_callBack(),w2popup.message()}}})):(w2utils.isInt(d.height)||(d.height=d.height+50),w2popup.open({width:d.width,height:d.height,title:d.title,modal:!0,showClose:!1,body:'<div class="w2ui-centered" style="font-size: 13px;">'+d.msg+"</div>",buttons:'<button id="Yes" class="w2ui-popup-btn btn '+d.yes_class+'" style="'+d.yes_style+'">'+w2utils.lang(d.yes_text)+'</button><button id="No" class="w2ui-popup-btn btn '+d.no_class+'" style="'+d.no_style+'">'+w2utils.lang(d.no_text)+"</button>",onOpen:function(a){a.onComplete=function(){$("#w2ui-popup .w2ui-popup-btn").on("click",function(a){w2popup.close(),"function"==typeof d.callBack&&d.callBack(a.target.id),"Yes"==a.target.id&&"function"==typeof d.yes_callBack&&d.yes_callBack(),"No"==a.target.id&&"function"==typeof d.no_callBack&&d.no_callBack()})}},onKeydown:function(a){switch(a.originalEvent.keyCode){case 13:"function"==typeof d.callBack&&d.callBack("Yes"),"function"==typeof d.yes_callBack&&d.yes_callBack(),w2popup.close();break;case 27:"function"==typeof d.callBack&&d.callBack("No"),"function"==typeof d.no_callBack&&d.no_callBack(),w2popup.close()}}})),{yes:function(a){return d.yes_callBack=a,this},no:function(a){return d.no_callBack=a,this}}};!function(){var a=function(a){this.box=null,this.name=null,this.active=null,this.tabs=[],this.routeData={},this.right="",this.style="",this.onClick=null,this.onClose=null,this.onRender=null,this.onRefresh=null,this.onResize=null,this.onDestroy=null,$.extend(this,{handlers:[]}),$.extend(!0,this,w2obj.tabs,a)};$.fn.w2tabs=function(b){if("object"!=typeof b&&b){if(w2ui[$(this).attr("name")]){var c=w2ui[$(this).attr("name")];return c[b].apply(c,Array.prototype.slice.call(arguments,1)),this}return void console.log("ERROR: Method "+b+" does not exist on jQuery.w2tabs")}if(w2utils.checkName(b,"w2tabs")){for(var d=b.tabs||[],e=new a(b),f=0;f<d.length;f++)e.tabs[f]=$.extend({},a.prototype.tab,d[f]);return 0!==$(this).length&&e.render($(this)[0]),w2ui[e.name]=e,e}},a.prototype={tab:{id:null,text:"",route:null,hidden:!1,disabled:!1,closable:!1,hint:"",onClick:null,onRefresh:null,onClose:null},add:function(a){return this.insert(null,a)},insert:function(b,c){$.isArray(c)||(c=[c]);for(var d=0;d<c.length;d++){if("undefined"==typeof c[d].id)return void console.log('ERROR: The parameter "id" is required but not supplied. (obj: '+this.name+")");if(!w2utils.checkUniqueId(c[d].id,this.tabs,"tabs",this.name))return;var e=$.extend({},a.prototype.tab,c[d]);if(null===b||"undefined"==typeof b)this.tabs.push(e);else{var f=this.get(b,!0);this.tabs=this.tabs.slice(0,f).concat([e],this.tabs.slice(f))}this.refresh(c[d].id)}},remove:function(){for(var a=0,b=0;b<arguments.length;b++){var c=this.get(arguments[b]);if(!c)return!1;a++,this.tabs.splice(this.get(c.id,!0),1),$(this.box).find("#tabs_"+this.name+"_tab_"+w2utils.escapeId(c.id)).remove()
	}return a},select:function(a){return this.active==a||null===this.get(a)?!1:(this.active=a,this.refresh(),!0)},set:function(a,b){var c=this.get(a,!0);return null===c?!1:($.extend(this.tabs[c],b),this.refresh(a),!0)},get:function(a,b){if(0===arguments.length){for(var c=[],d=0;d<this.tabs.length;d++)null!=this.tabs[d].id&&c.push(this.tabs[d].id);return c}for(var e=0;e<this.tabs.length;e++)if(this.tabs[e].id==a)return b===!0?e:this.tabs[e];return null},show:function(){for(var a=this,b=0,c=[],d=0;d<arguments.length;d++){var e=this.get(arguments[d]);e&&e.hidden!==!1&&(b++,e.hidden=!1,c.push(e.id))}return setTimeout(function(){for(var b in c)a.refresh(c[b])},15),b},hide:function(){for(var a=this,b=0,c=[],d=0;d<arguments.length;d++){var e=this.get(arguments[d]);e&&e.hidden!==!0&&(b++,e.hidden=!0,c.push(e.id))}return setTimeout(function(){for(var b in c)a.refresh(c[b])},15),b},enable:function(){for(var a=this,b=0,c=[],d=0;d<arguments.length;d++){var e=this.get(arguments[d]);e&&e.disabled!==!1&&(b++,e.disabled=!1,c.push(e.id))}return setTimeout(function(){for(var b in c)a.refresh(c[b])},15),b},disable:function(){for(var a=this,b=0,c=[],d=0;d<arguments.length;d++){var e=this.get(arguments[d]);e&&e.disabled!==!0&&(b++,e.disabled=!0,c.push(e.id))}return setTimeout(function(){for(var b in c)a.refresh(c[b])},15),b},refresh:function(a){var b=(new Date).getTime(),c=this.trigger({phase:"before",type:"refresh",target:"undefined"!=typeof a?a:this.name,object:this.get(a)});if(c.isCancelled!==!0){if("undefined"==typeof a)for(var d=0;d<this.tabs.length;d++)this.refresh(this.tabs[d].id);else{var e=this.get(a);if(null===e)return!1;"undefined"!=typeof e.caption&&(e.text=e.caption);var f=$(this.box).find("#tabs_"+this.name+"_tab_"+w2utils.escapeId(e.id)),g=(e.closable?'<div class="w2ui-tab-close" onclick="w2ui[\''+this.name+"'].animateClose('"+e.id+"', event);\"></div>":"")+'    <div class="w2ui-tab'+(this.active===e.id?" active":"")+(e.closable?" closable":"")+'"         title="'+("undefined"!=typeof e.hint?e.hint:"")+'"        onclick="w2ui[\''+this.name+"'].click('"+e.id+"', event);\">"+e.text+"</div>";if(0===f.length){var h="";e.hidden&&(h+="display: none;"),e.disabled&&(h+="opacity: 0.2; -moz-opacity: 0.2; -webkit-opacity: 0.2; -o-opacity: 0.2; filter:alpha(opacity=20);");var i='<td id="tabs_'+this.name+"_tab_"+e.id+'" style="'+h+'" valign="middle">'+g+"</td>";this.get(a,!0)!==this.tabs.length-1&&$(this.box).find("#tabs_"+this.name+"_tab_"+w2utils.escapeId(this.tabs[parseInt(this.get(a,!0))+1].id)).length>0?$(this.box).find("#tabs_"+this.name+"_tab_"+w2utils.escapeId(this.tabs[parseInt(this.get(a,!0))+1].id)).before(i):$(this.box).find("#tabs_"+this.name+"_right").before(i)}else f.html(g),e.hidden?f.css("display","none"):f.css("display",""),f.css(e.disabled?{opacity:"0.2","-moz-opacity":"0.2","-webkit-opacity":"0.2","-o-opacity":"0.2",filter:"alpha(opacity=20)"}:{opacity:"1","-moz-opacity":"1","-webkit-opacity":"1","-o-opacity":"1",filter:"alpha(opacity=100)"})}return $("#tabs_"+this.name+"_right").html(this.right),this.trigger($.extend(c,{phase:"after"})),(new Date).getTime()-b}},render:function(a){var b=(new Date).getTime(),c=this.trigger({phase:"before",type:"render",target:this.name,box:a});if(c.isCancelled!==!0){if("undefined"!=typeof a&&null!==a&&($(this.box).find("> table #tabs_"+this.name+"_right").length>0&&$(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-tabs").html(""),this.box=a),!this.box)return!1;var d='<table cellspacing="0" cellpadding="1" width="100%">    <tr><td width="100%" id="tabs_'+this.name+'_right" align="right">'+this.right+"</td></tr></table>";return $(this.box).attr("name",this.name).addClass("w2ui-reset w2ui-tabs").html(d),$(this.box).length>0&&($(this.box)[0].style.cssText+=this.style),this.trigger($.extend(c,{phase:"after"})),this.refresh(),(new Date).getTime()-b}},resize:function(){var a=(new Date).getTime(),b=this.trigger({phase:"before",type:"resize",target:this.name});return b.isCancelled!==!0?(this.trigger($.extend(b,{phase:"after"})),(new Date).getTime()-a):void 0},destroy:function(){var a=this.trigger({phase:"before",type:"destroy",target:this.name});a.isCancelled!==!0&&($(this.box).find("> table #tabs_"+this.name+"_right").length>0&&$(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-tabs").html(""),delete w2ui[this.name],this.trigger($.extend(a,{phase:"after"})))},click:function(a,b){var c=this.get(a);if(null===c||c.disabled)return!1;var d=this.trigger({phase:"before",type:"click",target:a,tab:c,object:c,originalEvent:b});if(d.isCancelled!==!0){if($(this.box).find("#tabs_"+this.name+"_tab_"+w2utils.escapeId(this.active)+" .w2ui-tab").removeClass("active"),this.active=c.id,c.route){var e=String("/"+c.route).replace(/\/{2,}/g,"/"),f=w2utils.parseRoute(e);if(f.keys.length>0)for(var g=0;g<f.keys.length;g++)null!=this.routeData[f.keys[g].name]&&(e=e.replace(new RegExp(":"+f.keys[g].name,"g"),this.routeData[f.keys[g].name]));setTimeout(function(){window.location.hash=e},1)}this.trigger($.extend(d,{phase:"after"})),this.refresh(a)}},animateClose:function(a,b){var c=this.get(a);if(null===c||c.disabled)return!1;var d=this.trigger({phase:"before",type:"close",target:a,object:this.get(a),originalEvent:b});if(d.isCancelled!==!0){var e=this;$(this.box).find("#tabs_"+this.name+"_tab_"+w2utils.escapeId(c.id)).css({"-webkit-transition":".2s","-moz-transition":"2s","-ms-transition":".2s","-o-transition":".2s",opacity:"0"}),setTimeout(function(){var a=$(e.box).find("#tabs_"+e.name+"_tab_"+w2utils.escapeId(c.id)).width();$(e.box).find("#tabs_"+e.name+"_tab_"+w2utils.escapeId(c.id)).html('<div style="width: '+a+'px; -webkit-transition: .2s; -moz-transition: .2s; -ms-transition: .2s; -o-transition: .2s"></div>'),setTimeout(function(){$(e.box).find("#tabs_"+e.name+"_tab_"+w2utils.escapeId(c.id)).find(":first-child").css({width:"0px"})},50)},200),setTimeout(function(){e.remove(a)},450),this.trigger($.extend(d,{phase:"after"})),this.refresh()}},animateInsert:function(a,b){if(null!==this.get(a)&&$.isPlainObject(b)&&w2utils.checkUniqueId(b.id,this.tabs,"tabs",this.name)){var c=$(this.box).find("#tabs_"+this.name+"_tab_"+w2utils.escapeId(b.id));if(0===c.length){"undefined"!=typeof b.caption&&(b.text=b.caption);var d='<div id="_tmp_tabs" class="w2ui-reset w2ui-tabs" style="position: absolute; top: -1000px;"><table cellspacing="0" cellpadding="1" width="100%"><tr><td id="_tmp_simple_tab" style="" valign="middle">'+(b.closable?'<div class="w2ui-tab-close"></div>':"")+'    <div class="w2ui-tab '+(this.active===b.id?"active":"")+'">'+b.text+"</div></td></tr></table></div>";$("body").append(d);var e='<div style="width: 1px; -webkit-transition: 0.2s; -moz-transition: 0.2s; -ms-transition: 0.2s; -o-transition: 0.2s;">&nbsp;</div>',f="";b.hidden&&(f+="display: none;"),b.disabled&&(f+="opacity: 0.2; -moz-opacity: 0.2; -webkit-opacity: 0.2; -o-opacity: 0.2; filter:alpha(opacity=20);");var g='<td id="tabs_'+this.name+"_tab_"+b.id+'" style="'+f+'" valign="middle">'+e+"</td>";this.get(a,!0)!==this.tabs.length&&$(this.box).find("#tabs_"+this.name+"_tab_"+w2utils.escapeId(this.tabs[parseInt(this.get(a,!0))].id)).length>0?$(this.box).find("#tabs_"+this.name+"_tab_"+w2utils.escapeId(this.tabs[parseInt(this.get(a,!0))].id)).before(g):$(this.box).find("#tabs_"+this.name+"_right").before(g);var h=this;setTimeout(function(){var a=$("#_tmp_simple_tab").width();$("#_tmp_tabs").remove(),$("#tabs_"+h.name+"_tab_"+w2utils.escapeId(b.id)+" > div").css("width",a+"px")},1),setTimeout(function(){h.insert(a,b)},200)}}}},$.extend(a.prototype,w2utils.event),w2obj.tabs=a}(),function(){var a=function(a){this.box=null,this.name=null,this.routeData={},this.items=[],this.right="",this.onClick=null,this.onRender=null,this.onRefresh=null,this.onResize=null,this.onDestroy=null,$.extend(!0,this,w2obj.toolbar,a)};$.fn.w2toolbar=function(b){if("object"==typeof b||!b){if(!w2utils.checkName(b,"w2toolbar"))return;var c=b.items||[],d=new a(b);$.extend(d,{items:[],handlers:[]});for(var e=0;e<c.length;e++)d.items[e]=$.extend({},a.prototype.item,c[e]);return 0!==$(this).length&&d.render($(this)[0]),w2ui[d.name]=d,d}if(w2ui[$(this).attr("name")]){var f=w2ui[$(this).attr("name")];return f[b].apply(f,Array.prototype.slice.call(arguments,1)),this}console.log("ERROR: Method "+b+" does not exist on jQuery.w2toolbar")},a.prototype={item:{id:null,type:"button",text:"",route:null,html:"",img:null,icon:null,count:null,hidden:!1,disabled:!1,checked:!1,arrow:!0,hint:"",group:null,items:null,overlay:{},onClick:null},add:function(a){this.insert(null,a)},insert:function(b,c){$.isArray(c)||(c=[c]);for(var d=0;d<c.length;d++){if("undefined"==typeof c[d].type)return void console.log('ERROR: The parameter "type" is required but not supplied in w2toolbar.add() method.');if(-1===$.inArray(String(c[d].type),["button","check","radio","drop","menu","break","html","spacer"]))return void console.log('ERROR: The parameter "type" should be one of the following [button, check, radio, drop, menu, break, html, spacer] in w2toolbar.add() method.');if("undefined"==typeof c[d].id)return void console.log('ERROR: The parameter "id" is required but not supplied in w2toolbar.add() method.');if(!w2utils.checkUniqueId(c[d].id,this.items,"toolbar items",this.name))return;var e=$.extend({},a.prototype.item,c[d]);if(null==b)this.items.push(e);else{var f=this.get(b,!0);this.items=this.items.slice(0,f).concat([e],this.items.slice(f))}this.refresh(e.id)}},remove:function(){for(var a=0,b=0;b<arguments.length;b++){var c=this.get(arguments[b]);if(c){a++,$(this.box).find("#tb_"+this.name+"_item_"+w2utils.escapeId(c.id)).remove();var d=this.get(c.id,!0);d&&this.items.splice(d,1)}}return a},set:function(a,b){var c=this.get(a,!0);return null===c?!1:($.extend(this.items[c],b),this.refresh(a),!0)},get:function(a,b){if(0===arguments.length){for(var c=[],d=0;d<this.items.length;d++)null!==this.items[d].id&&c.push(this.items[d].id);return c}for(var e=0;e<this.items.length;e++)if(this.items[e].id===a)return b===!0?e:this.items[e];return null},show:function(){for(var a=this,b=0,c=[],d=0;d<arguments.length;d++){var e=this.get(arguments[d]);e&&(b++,e.hidden=!1,c.push(e.id))}return setTimeout(function(){for(var b in c)a.refresh(c[b])},15),b},hide:function(){for(var a=this,b=0,c=[],d=0;d<arguments.length;d++){var e=this.get(arguments[d]);e&&(b++,e.hidden=!0,c.push(e.id))}return setTimeout(function(){for(var b in c)a.refresh(c[b])},15),b},enable:function(){for(var a=this,b=0,c=[],d=0;d<arguments.length;d++){var e=this.get(arguments[d]);e&&(b++,e.disabled=!1,c.push(e.id))}return setTimeout(function(){for(var b in c)a.refresh(c[b])},15),b},disable:function(){for(var a=this,b=0,c=[],d=0;d<arguments.length;d++){var e=this.get(arguments[d]);e&&(b++,e.disabled=!0,c.push(e.id))}return setTimeout(function(){for(var b in c)a.refresh(c[b])},15),b},check:function(){for(var a=this,b=0,c=[],d=0;d<arguments.length;d++){var e=this.get(arguments[d]);e&&(b++,e.checked=!0,c.push(e.id))}return setTimeout(function(){for(var b in c)a.refresh(c[b])},15),b},uncheck:function(){for(var a=this,b=0,c=[],d=0;d<arguments.length;d++){var e=this.get(arguments[d]);e&&(b++,e.checked=!1,c.push(e.id))}return setTimeout(function(){for(var b in c)a.refresh(c[b])},15),b},render:function(a){var b=(new Date).getTime(),c=this.trigger({phase:"before",type:"render",target:this.name,box:a});if(c.isCancelled!==!0&&(null!=a&&($(this.box).find("> table #tb_"+this.name+"_right").length>0&&$(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-toolbar").html(""),this.box=a),this.box)){for(var d='<table cellspacing="0" cellpadding="0" width="100%"><tr>',e=0;e<this.items.length;e++){var f=this.items[e];null==f.id&&(f.id="item_"+e),null!==f&&(d+="spacer"===f.type?'<td width="100%" id="tb_'+this.name+"_item_"+f.id+'" align="right"></td>':'<td id="tb_'+this.name+"_item_"+f.id+'" style="'+(f.hidden?"display: none":"")+'"     class="'+(f.disabled?"disabled":"")+'" valign="middle">'+this.getItemHTML(f)+"</td>")}return d+='<td width="100%" id="tb_'+this.name+'_right" align="right">'+this.right+"</td>",d+="</tr></table>",$(this.box).attr("name",this.name).addClass("w2ui-reset w2ui-toolbar").html(d),$(this.box).length>0&&($(this.box)[0].style.cssText+=this.style),this.trigger($.extend(c,{phase:"after"})),(new Date).getTime()-b}},refresh:function(a){var b=(new Date).getTime(),c=this.trigger({phase:"before",type:"refresh",target:"undefined"!=typeof a?a:this.name,item:this.get(a)});if(c.isCancelled!==!0){if(null==a)for(var d=0;d<this.items.length;d++){var e=this.items[d];null==e.id&&(e.id="item_"+d),this.refresh(e.id)}var f=this.get(a);if(null===f)return!1;var g=$(this.box).find("#tb_"+this.name+"_item_"+w2utils.escapeId(f.id)),h=this.getItemHTML(f);return 0===g.length?(h="spacer"===f.type?'<td width="100%" id="tb_'+this.name+"_item_"+f.id+'" align="right"></td>':'<td id="tb_'+this.name+"_item_"+f.id+'" style="'+(f.hidden?"display: none":"")+'"     class="'+(f.disabled?"disabled":"")+'" valign="middle">'+h+"</td>",this.get(a,!0)===this.items.length-1?$(this.box).find("#tb_"+this.name+"_right").before(h):$(this.box).find("#tb_"+this.name+"_item_"+w2utils.escapeId(this.items[parseInt(this.get(a,!0))+1].id)).before(h)):(g.html(h),f.hidden?g.css("display","none"):g.css("display",""),f.disabled?g.addClass("disabled"):g.removeClass("disabled")),this.trigger($.extend(c,{phase:"after"})),(new Date).getTime()-b}},resize:function(){var a=(new Date).getTime(),b=this.trigger({phase:"before",type:"resize",target:this.name});return b.isCancelled!==!0?(this.trigger($.extend(b,{phase:"after"})),(new Date).getTime()-a):void 0},destroy:function(){var a=this.trigger({phase:"before",type:"destroy",target:this.name});a.isCancelled!==!0&&($(this.box).find("> table #tb_"+this.name+"_right").length>0&&$(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-toolbar").html(""),$(this.box).html(""),delete w2ui[this.name],this.trigger($.extend(a,{phase:"after"})))},getItemHTML:function(a){var b="";switch("undefined"!=typeof a.caption&&(a.text=a.caption),"undefined"==typeof a.hint&&(a.hint=""),"undefined"==typeof a.text&&(a.text=""),a.type){case"menu":case"button":case"check":case"radio":case"drop":var c="<td>&nbsp;</td>";a.img&&(c='<td><div class="w2ui-tb-image w2ui-icon '+a.img+'"></div></td>'),a.icon&&(c='<td><div class="w2ui-tb-image"><span class="'+a.icon+'"></span></div></td>'),b+='<table cellpadding="0" cellspacing="0" title="'+a.hint+'" class="w2ui-button '+(a.checked?"checked":"")+'"        onclick     = "var el=w2ui[\''+this.name+"']; if (el) el.click('"+a.id+'\', event);"        onmouseover = "'+(a.disabled?"":"$(this).addClass('over');")+'"       onmouseout  = "'+(a.disabled?"":"$(this).removeClass('over').removeClass('down');")+'"       onmousedown = "'+(a.disabled?"":"$(this).addClass('down');")+'"       onmouseup   = "'+(a.disabled?"":"$(this).removeClass('down');")+'"><tr><td>  <table cellpadding="1" cellspacing="0">  <tr>'+c+(""!==a.text?'<td class="w2ui-tb-caption" nowrap>'+a.text+"</td>":"")+(null!=a.count?'<td class="w2ui-tb-count" nowrap><span>'+a.count+"</span></td>":"")+("drop"!==a.type&&"menu"!==a.type||a.arrow===!1?"":'<td class="w2ui-tb-down" nowrap><div></div></td>')+"  </tr></table></td></tr></table>";break;case"break":b+='<table cellpadding="0" cellspacing="0"><tr>    <td><div class="w2ui-break">&nbsp;</div></td></tr></table>';break;case"html":b+='<table cellpadding="0" cellspacing="0"><tr>    <td nowrap>'+a.html+"</td></tr></table>"}var d="";return"function"==typeof a.onRender&&(d=a.onRender.call(this,a.id,b)),"function"==typeof this.onRender&&(d=this.onRender(a.id,b)),""!==d&&null!=d&&(b=d),b},menuClick:function(a){var b=this;if(a.item&&!a.item.disabled){var c=this.trigger({phase:"before",type:"click",target:a.item.id+":"+a.subItem.id,item:a.item,subItem:a.subItem,originalEvent:a.originalEvent});if(c.isCancelled===!0)return;var d=a.subItem;if(d.route){var e=String("/"+d.route).replace(/\/{2,}/g,"/"),f=w2utils.parseRoute(e);if(f.keys.length>0)for(var g=0;g<f.keys.length;g++)null!=b.routeData[f.keys[g].name]&&(e=e.replace(new RegExp(":"+f.keys[g].name,"g"),this.routeData[f.keys[g].name]));setTimeout(function(){window.location.hash=e},1)}this.trigger($.extend(c,{phase:"after"}))}},click:function(a,b){var c=this,d=this.get(a);if(d&&!d.disabled){var e=this.trigger({phase:"before",type:"click",target:"undefined"!=typeof a?a:this.name,item:d,object:d,originalEvent:b});if(e.isCancelled===!0)return;var f=$("#tb_"+this.name+"_item_"+w2utils.escapeId(d.id)+" table.w2ui-button");if(f.removeClass("down"),"radio"===d.type){for(var g=0;g<this.items.length;g++){var h=this.items[g];null!=h&&h.id!==d.id&&"radio"===h.type&&h.group===d.group&&h.checked&&(h.checked=!1,this.refresh(h.id))}d.checked=!0,f.addClass("checked")}if(("drop"===d.type||"menu"===d.type)&&(d.checked?d.checked=!1:setTimeout(function(){function a(){$(document).off("click",a),d.checked=!1,f.removeClass("checked")}var b=$("#tb_"+c.name+"_item_"+w2utils.escapeId(d.id));$.isPlainObject(d.overlay)||(d.overlay={});var e=(b.width()-50)/2;e>19&&(e=19),"drop"===d.type&&b.w2overlay(d.html,$.extend({left:e,top:3},d.overlay)),"menu"===d.type&&b.w2menu(d.items,$.extend({left:e,top:3},d.overlay,{select:function(b){c.menuClick({item:d,subItem:b.item,originalEvent:b.originalEvent}),a()}})),$(document).on("click",a)},1)),("check"===d.type||"drop"===d.type||"menu"===d.type)&&(d.checked=!d.checked,d.checked?f.addClass("checked"):f.removeClass("checked")),d.route){var i=String("/"+d.route).replace(/\/{2,}/g,"/"),j=w2utils.parseRoute(i);if(j.keys.length>0)for(var k=0;k<j.keys.length;k++)i=i.replace(new RegExp(":"+j.keys[k].name,"g"),this.routeData[j.keys[k].name]);setTimeout(function(){window.location.hash=i},1)}this.trigger($.extend(e,{phase:"after"}))}}},$.extend(a.prototype,w2utils.event),w2obj.toolbar=a}(),function(){var a=function(a){this.name=null,this.box=null,this.sidebar=null,this.parent=null,this.nodes=[],this.menu=[],this.routeData={},this.selected=null,this.img=null,this.icon=null,this.style="",this.topHTML="",this.bottomHTML="",this.keyboard=!0,this.onClick=null,this.onDblClick=null,this.onContextMenu=null,this.onMenuClick=null,this.onExpand=null,this.onCollapse=null,this.onKeydown=null,this.onRender=null,this.onRefresh=null,this.onResize=null,this.onDestroy=null,$.extend(!0,this,w2obj.sidebar,a)};$.fn.w2sidebar=function(b){if("object"==typeof b||!b){if(!w2utils.checkName(b,"w2sidebar"))return;var c=b.nodes,d=new a(b);return $.extend(d,{handlers:[],nodes:[]}),"undefined"!=typeof c&&d.add(d,c),0!==$(this).length&&d.render($(this)[0]),d.sidebar=d,w2ui[d.name]=d,d}if(w2ui[$(this).attr("name")]){var e=w2ui[$(this).attr("name")];return e[b].apply(e,Array.prototype.slice.call(arguments,1)),this}console.log("ERROR: Method "+b+" does not exist on jQuery.w2sidebar")},a.prototype={node:{id:null,text:"",count:null,img:null,icon:null,nodes:[],style:"",route:null,selected:!1,expanded:!1,hidden:!1,disabled:!1,group:!1,groupShowHide:!0,plus:!1,onClick:null,onDblClick:null,onContextMenu:null,onExpand:null,onCollapse:null,parent:null,sidebar:null},add:function(a,b){return 1==arguments.length&&(b=arguments[0],a=this),"string"==typeof a&&(a=this.get(a)),this.insert(a,null,b)},insert:function(b,c,d){var e,f,g,h,i;if(2==arguments.length){if(d=arguments[1],c=arguments[0],f=this.get(c),null===f)return $.isArray(d)||(d=[d]),e=null!=d[0].caption?d[0].caption:d[0].text,console.log('ERROR: Cannot insert node "'+e+'" because cannot find node "'+c+'" to insert before.'),null;b=this.get(c).parent}"string"==typeof b&&(b=this.get(b)),$.isArray(d)||(d=[d]);for(var j in d)if(h=d[j],null!=typeof h.id)if(null===this.get(this,h.id)){if(g=$.extend({},a.prototype.node,h),g.sidebar=this,g.parent=b,i=g.nodes||[],g.nodes=[],null===c)b.nodes.push(g);else{if(f=this.get(b,c,!0),null===f)return e=null!=h.caption?h.caption:h.text,console.log('ERROR: Cannot insert node "'+e+'" because cannot find node "'+c+'" to insert before.'),null;b.nodes.splice(f,0,g)}i.length>0&&this.insert(g,null,i)}else e=null!=h.caption?h.caption:h.text,console.log("ERROR: Cannot insert node with id="+h.id+" (text: "+e+") because another node with the same id already exists.");else e=null!=h.caption?h.caption:h.text,console.log('ERROR: Cannot insert node "'+e+'" because it has no id.');return this.refresh(b.id),g},remove:function(){for(var a,b=0,c=0;c<arguments.length;c++)if(a=this.get(arguments[c]),null!==a){null!==this.selected&&this.selected===a.id&&(this.selected=null);var d=this.get(a.parent,arguments[c],!0);null!==d&&(a.parent.nodes[d].selected&&a.sidebar.unselect(a.id),a.parent.nodes.splice(d,1),b++)}return b>0&&1==arguments.length?this.refresh(a.parent.id):this.refresh(),b},set:function(a,b,c){if(2==arguments.length&&(c=b,b=a,a=this),"string"==typeof a&&(a=this.get(a)),null==a.nodes)return null;for(var d=0;d<a.nodes.length;d++){if(a.nodes[d].id===b){var e=c.nodes;return $.extend(a.nodes[d],c,{nodes:[]}),null!=e&&this.add(a.nodes[d],e),this.refresh(b),!0}var f=this.set(a.nodes[d],b,c);if(f)return!0}return!1},get:function(a,b,c){if(0===arguments.length){for(var d=[],e=this.find({}),f=0;f<e.length;f++)null!=e[f].id&&d.push(e[f].id);return d}if((1==arguments.length||2==arguments.length&&b===!0)&&(c=b,b=a,a=this),"string"==typeof a&&(a=this.get(a)),null==a.nodes)return null;for(var g=0;g<a.nodes.length;g++){if(a.nodes[g].id==b)return c===!0?g:a.nodes[g];var h=this.get(a.nodes[g],b,c);if(h||0===h)return h}return null},find:function(a,b,c){if(1==arguments.length&&(b=a,a=this),c||(c=[]),"string"==typeof a&&(a=this.get(a)),null==a.nodes)return c;for(var d=0;d<a.nodes.length;d++){var e=!0;for(var f in b)a.nodes[d][f]!=b[f]&&(e=!1);e&&c.push(a.nodes[d]),a.nodes[d].nodes.length>0&&(c=this.find(a.nodes[d],b,c))}return c},hide:function(){for(var a=0,b=0;b<arguments.length;b++){var c=this.get(arguments[b]);null!==c&&(c.hidden=!0,a++)}return 1==arguments.length?this.refresh(arguments[0]):this.refresh(),a},show:function(){for(var a=0,b=0;b<arguments.length;b++){var c=this.get(arguments[b]);null!==c&&(c.hidden=!1,a++)}return 1==arguments.length?this.refresh(arguments[0]):this.refresh(),a},disable:function(){for(var a=0,b=0;b<arguments.length;b++){var c=this.get(arguments[b]);null!==c&&(c.disabled=!0,c.selected&&this.unselect(c.id),a++)}return 1==arguments.length?this.refresh(arguments[0]):this.refresh(),a},enable:function(){for(var a=0,b=0;b<arguments.length;b++){var c=this.get(arguments[b]);null!==c&&(c.disabled=!1,a++)}return 1==arguments.length?this.refresh(arguments[0]):this.refresh(),a},select:function(a){var b=this.get(a);return b?this.selected==a&&b.selected?!1:(this.unselect(this.selected),$(this.box).find("#node_"+w2utils.escapeId(a)).addClass("w2ui-selected").find(".w2ui-icon").addClass("w2ui-icon-selected"),b.selected=!0,this.selected=a,!0):!1},unselect:function(a){var b=this.get(a);return b?(b.selected=!1,$(this.box).find("#node_"+w2utils.escapeId(a)).removeClass("w2ui-selected").find(".w2ui-icon").removeClass("w2ui-icon-selected"),this.selected==a&&(this.selected=null),!0):!1},toggle:function(a){var b=this.get(a);return null===b?!1:b.plus?(this.set(a,{plus:!1}),this.expand(a),void this.refresh(a)):0===b.nodes.length?!1:this.get(a).expanded?this.collapse(a):this.expand(a)},collapse:function(a){var b=this,c=this.get(a),d=this.trigger({phase:"before",type:"collapse",target:a,object:c});return d.isCancelled!==!0?($(this.box).find("#node_"+w2utils.escapeId(a)+"_sub").slideUp(200),$(this.box).find("#node_"+w2utils.escapeId(a)+" .w2ui-node-dots:first-child").html('<div class="w2ui-expand">+</div>'),c.expanded=!1,this.trigger($.extend(d,{phase:"after"})),setTimeout(function(){b.refresh(a)},200),!0):void 0},collapseAll:function(a){if("undefined"==typeof a&&(a=this),"string"==typeof a&&(a=this.get(a)),null==a.nodes)return!1;for(var b=0;b<a.nodes.length;b++)a.nodes[b].expanded===!0&&(a.nodes[b].expanded=!1),a.nodes[b].nodes&&a.nodes[b].nodes.length>0&&this.collapseAll(a.nodes[b]);return this.refresh(a.id),!0},expand:function(a){var b=this,c=this.get(a),d=this.trigger({phase:"before",type:"expand",target:a,object:c});return d.isCancelled!==!0?($(this.box).find("#node_"+w2utils.escapeId(a)+"_sub").slideDown(200),$(this.box).find("#node_"+w2utils.escapeId(a)+" .w2ui-node-dots:first-child").html('<div class="w2ui-expand">-</div>'),c.expanded=!0,this.trigger($.extend(d,{phase:"after"})),setTimeout(function(){b.refresh(a)},200),!0):void 0},expandAll:function(a){if("undefined"==typeof a&&(a=this),"string"==typeof a&&(a=this.get(a)),null==a.nodes)return!1;for(var b=0;b<a.nodes.length;b++)a.nodes[b].expanded===!1&&(a.nodes[b].expanded=!0),a.nodes[b].nodes&&a.nodes[b].nodes.length>0&&this.collapseAll(a.nodes[b]);this.refresh(a.id)},expandParents:function(a){var b=this.get(a);return null===b?!1:(b.parent&&(b.parent.expanded=!0,this.expandParents(b.parent.id)),this.refresh(a),!0)},click:function(a,b){var c=this,d=this.get(a);if(null!==d&&!d.disabled&&!d.group){$(c.box).find(".w2ui-node.w2ui-selected").each(function(a,b){var d=$(b).attr("id").replace("node_",""),e=c.get(d);null!=e&&(e.selected=!1),$(b).removeClass("w2ui-selected").find(".w2ui-icon").removeClass("w2ui-icon-selected")});var e=$(c.box).find("#node_"+w2utils.escapeId(a)),f=$(c.box).find("#node_"+w2utils.escapeId(c.selected));e.addClass("w2ui-selected").find(".w2ui-icon").addClass("w2ui-icon-selected"),setTimeout(function(){var g=c.trigger({phase:"before",type:"click",target:a,originalEvent:b,node:d,object:d});if(g.isCancelled===!0)return e.removeClass("w2ui-selected").find(".w2ui-icon").removeClass("w2ui-icon-selected"),void f.addClass("w2ui-selected").find(".w2ui-icon").addClass("w2ui-icon-selected");if(null!==f&&(f.selected=!1),c.get(a).selected=!0,c.selected=a,d.route){var h=String("/"+d.route).replace(/\/{2,}/g,"/"),i=w2utils.parseRoute(h);if(i.keys.length>0)for(var j=0;j<i.keys.length;j++)null!=c.routeData[i.keys[j].name]&&(h=h.replace(new RegExp(":"+i.keys[j].name,"g"),c.routeData[i.keys[j].name]));setTimeout(function(){window.location.hash=h},1)}c.trigger($.extend(g,{phase:"after"}))},1)}},keydown:function(a){function b(a,b){null===a||a.hidden||a.disabled||a.group||(g.click(a.id,b),setTimeout(function(){g.scrollIntoView()},50))}function c(a,b){for(a=b(a);null!==a&&(a.hidden||a.disabled)&&!a.group;)a=b(a);return a}function d(a,b){if(null===a)return null;var c=a.parent,e=g.get(a.id,!0),f=null;if(a.expanded&&a.nodes.length>0&&b!==!0){var h=a.nodes[0];f=h.hidden||h.disabled||h.group?d(h):h}else f=c&&e+1<c.nodes.length?c.nodes[e+1]:d(c,!0);return null!==f&&(f.hidden||f.disabled||f.group)&&(f=d(f)),f}function e(a){if(null===a)return null;var b=a.parent,c=g.get(a.id,!0),d=c>0?f(b.nodes[c-1]):b;return null!==d&&(d.hidden||d.disabled||d.group)&&(d=e(d)),d}function f(a){if(a.expanded&&a.nodes.length>0){var b=a.nodes[a.nodes.length-1];return b.hidden||b.disabled||b.group?e(b):f(b)}return a}var g=this,h=g.get(g.selected);if(h&&g.keyboard===!0){var i=g.trigger({phase:"before",type:"keydown",target:g.name,originalEvent:a});i.isCancelled!==!0&&((13==a.keyCode||32==a.keyCode)&&h.nodes.length>0&&g.toggle(g.selected),37==a.keyCode&&(h.nodes.length>0&&h.expanded?g.collapse(g.selected):(b(h.parent),h.parent.group||g.collapse(h.parent.id))),39==a.keyCode&&(h.nodes.length>0||h.plus)&&!h.expanded&&g.expand(g.selected),38==a.keyCode&&b(c(h,e)),40==a.keyCode&&b(c(h,d)),-1!=$.inArray(a.keyCode,[13,32,37,38,39,40])&&(a.preventDefault&&a.preventDefault(),a.stopPropagation&&a.stopPropagation()),g.trigger($.extend(i,{phase:"after"})))}},scrollIntoView:function(a){"undefined"==typeof a&&(a=this.selected);var b=this.get(a);if(null!==b){var c=$(this.box).find(".w2ui-sidebar-div"),d=$(this.box).find("#node_"+w2utils.escapeId(a)),e=d.offset().top-c.offset().top;e+d.height()>c.height()&&c.animate({scrollTop:c.scrollTop()+c.height()/1.3},250,"linear"),0>=e&&c.animate({scrollTop:c.scrollTop()-c.height()/1.3},250,"linear")}},dblClick:function(a,b){var c=this.get(a),d=this.trigger({phase:"before",type:"dblClick",target:a,originalEvent:b,object:c});d.isCancelled!==!0&&(this.toggle(a),this.trigger($.extend(d,{phase:"after"})))},contextMenu:function(a,b){var c=this,d=c.get(a);a!=c.selected&&c.click(a),setTimeout(function(){var e=c.trigger({phase:"before",type:"contextMenu",target:a,originalEvent:b,object:d});e.isCancelled!==!0&&(d.group||d.disabled||(c.menu.length>0&&$(c.box).find("#node_"+w2utils.escapeId(a)).w2menu(c.menu,{left:(b?b.offsetX||b.pageX:50)-25,onSelect:function(b){c.menuClick(a,parseInt(b.index),b.originalEvent)}}),c.trigger($.extend(e,{phase:"after"}))))},150)},menuClick:function(a,b,c){var d=this,e=d.trigger({phase:"before",type:"menuClick",target:a,originalEvent:c,menuIndex:b,menuItem:d.menu[b]});e.isCancelled!==!0&&d.trigger($.extend(e,{phase:"after"}))},render:function(a){var b=(new Date).getTime(),c=this.trigger({phase:"before",type:"render",target:this.name,box:a});return c.isCancelled!==!0&&("undefined"!=typeof a&&null!==a&&($(this.box).find("> div > div.w2ui-sidebar-div").length>0&&$(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-sidebar").html(""),this.box=a),this.box)?($(this.box).attr("name",this.name).addClass("w2ui-reset w2ui-sidebar").html('<div><div class="w2ui-sidebar-top"></div><div class="w2ui-sidebar-div"></div><div class="w2ui-sidebar-bottom"></div></div>'),$(this.box).find("> div").css({width:$(this.box).width()+"px",height:$(this.box).height()+"px"}),$(this.box).length>0&&($(this.box)[0].style.cssText+=this.style),""!==this.topHTML&&($(this.box).find(".w2ui-sidebar-top").html(this.topHTML),$(this.box).find(".w2ui-sidebar-div").css("top",$(this.box).find(".w2ui-sidebar-top").height()+"px")),""!==this.bottomHTML&&($(this.box).find(".w2ui-sidebar-bottom").html(this.bottomHTML),$(this.box).find(".w2ui-sidebar-div").css("bottom",$(this.box).find(".w2ui-sidebar-bottom").height()+"px")),this.trigger($.extend(c,{phase:"after"})),this.refresh(),(new Date).getTime()-b):void 0},refresh:function(a){function b(a){var b="",c=a.img;null===c&&(c=this.img);var d=a.icon;null===d&&(d=this.icon);for(var e=a.parent,f=0;e&&null!==e.parent;)e.group&&f--,e=e.parent,f++;return"undefined"!=typeof a.caption&&(a.text=a.caption),a.group?b='<div class="w2ui-node-group"  id="node_'+a.id+'"        onclick="w2ui[\''+h.name+"'].toggle('"+a.id+"')\"        onmouseout=\"$(this).find('span:nth-child(1)').css('color', 'transparent')\"         onmouseover=\"$(this).find('span:nth-child(1)').css('color', 'inherit')\">"+(a.groupShowHide?"<span>"+w2utils.lang(!a.hidden&&a.expanded?"Hide":"Show")+"</span>":"<span></span>")+"    <span>"+a.text+'</span></div><div class="w2ui-node-sub" id="node_'+a.id+'_sub" style="'+a.style+";"+(!a.hidden&&a.expanded?"":"display: none;")+'"></div>':(a.selected&&!a.disabled&&(h.selected=a.id),e="",c&&(e='<div class="w2ui-node-image w2ui-icon '+c+(a.selected&&!a.disabled?" w2ui-icon-selected":"")+'"></div>'),d&&(e='<div class="w2ui-node-image"><span class="'+d+'"></span></div>'),b='<div class="w2ui-node '+(a.selected?"w2ui-selected":"")+" "+(a.disabled?"w2ui-disabled":"")+'" id="node_'+a.id+'" style="'+(a.hidden?"display: none;":"")+'"    ondblclick="w2ui[\''+h.name+"'].dblClick('"+a.id+"', event);\"    oncontextmenu=\"w2ui['"+h.name+"'].contextMenu('"+a.id+"', event);         if (event.preventDefault) event.preventDefault();\"    onClick=\"w2ui['"+h.name+"'].click('"+a.id+'\', event); "><table cellpadding="0" cellspacing="0" style="margin-left:'+18*f+"px; padding-right:"+18*f+'px"><tr><td class="w2ui-node-dots" nowrap onclick="w2ui[\''+h.name+"'].toggle('"+a.id+'\');         if (event.stopPropagation) event.stopPropagation(); else event.cancelBubble = true;">    <div class="w2ui-expand">'+(a.nodes.length>0?a.expanded?"-":"+":a.plus?"+":"")+'</div></td><td class="w2ui-node-data" nowrap>'+e+(a.count||0===a.count?'<div class="w2ui-node-count">'+a.count+"</div>":"")+'<div class="w2ui-node-caption">'+a.text+'</div></td></tr></table></div><div class="w2ui-node-sub" id="node_'+a.id+'_sub" style="'+a.style+";"+(!a.hidden&&a.expanded?"":"display: none;")+'"></div>'),b
	}var c=(new Date).getTime(),d=this.trigger({phase:"before",type:"refresh",target:"undefined"!=typeof a?a:this.name});if(d.isCancelled!==!0){""!==this.topHTML&&($(this.box).find(".w2ui-sidebar-top").html(this.topHTML),$(this.box).find(".w2ui-sidebar-div").css("top",$(this.box).find(".w2ui-sidebar-top").height()+"px")),""!==this.bottomHTML&&($(this.box).find(".w2ui-sidebar-bottom").html(this.bottomHTML),$(this.box).find(".w2ui-sidebar-div").css("bottom",$(this.box).find(".w2ui-sidebar-bottom").height()+"px")),$(this.box).find("> div").css({width:$(this.box).width()+"px",height:$(this.box).height()+"px"});var e,f,g,h=this;if("undefined"==typeof a)e=this,g=".w2ui-sidebar-div";else{if(e=this.get(a),null===e)return;g="#node_"+w2utils.escapeId(e.id)+"_sub"}var i;if(e!==this){var j="#node_"+w2utils.escapeId(e.id);i=b(e),$(this.box).find(j).before('<div id="sidebar_'+this.name+'_tmp"></div>'),$(this.box).find(j).remove(),$(this.box).find(g).remove(),$("#sidebar_"+this.name+"_tmp").before(i),$("#sidebar_"+this.name+"_tmp").remove()}$(this.box).find(g).html("");for(var k=0;k<e.nodes.length;k++)f=e.nodes[k],i=b(f),$(this.box).find(g).append(i),0!==f.nodes.length&&this.refresh(f.id);return this.trigger($.extend(d,{phase:"after"})),(new Date).getTime()-c}},resize:function(){var a=(new Date).getTime(),b=this.trigger({phase:"before",type:"resize",target:this.name});return b.isCancelled!==!0?($(this.box).css("overflow","hidden"),$(this.box).find("> div").css({width:$(this.box).width()+"px",height:$(this.box).height()+"px"}),this.trigger($.extend(b,{phase:"after"})),(new Date).getTime()-a):void 0},destroy:function(){var a=this.trigger({phase:"before",type:"destroy",target:this.name});a.isCancelled!==!0&&($(this.box).find("> div > div.w2ui-sidebar-div").length>0&&$(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-sidebar").html(""),delete w2ui[this.name],this.trigger($.extend(a,{phase:"after"})))},lock:function(){var a=$(this.box).find("> div:first-child"),b=Array.prototype.slice.call(arguments,0);b.unshift(a),w2utils.lock.apply(window,b)},unlock:function(){w2utils.unlock(this.box)}},$.extend(a.prototype,w2utils.event),w2obj.sidebar=a}(),function(a){var b=function(b){this.el=null,this.helpers={},this.type=b.type||"text",this.options=a.extend(!0,{},b),this.onSearch=b.onSearch||null,this.onRequest=b.onRequest||null,this.onLoad=b.onLoad||null,this.onError=b.onError||null,this.onClick=b.onClick||null,this.onAdd=b.onAdd||null,this.onNew=b.onNew||null,this.onRemove=b.onRemove||null,this.onMouseOver=b.onMouseOver||null,this.onMouseOut=b.onMouseOut||null,this.onIconClick=b.onIconClick||null,this.tmp={},delete this.options.type,delete this.options.onSearch,delete this.options.onRequest,delete this.options.onLoad,delete this.options.onError,delete this.options.onClick,delete this.options.onMouseOver,delete this.options.onMouseOut,delete this.options.onIconClick,a.extend(!0,this,w2obj.field)};a.fn.w2field=function(c,d){if(0!=this.length){if(0==arguments.length){var e=a(this).data("w2field");return e}return"string"==typeof c&&"object"==typeof d&&(c=a.extend(!0,{},d,{type:c})),"string"==typeof c&&"undefined"==typeof d&&(c={type:c}),c.type=String(c.type).toLowerCase(),this.each(function(d,e){var f=a(e).data("w2field");if("undefined"==typeof f){var f=new b(c);return a.extend(f,{handlers:[]}),e&&(f.el=a(e)[0]),f.init(),a(e).data("w2field",f),f}if(f.clear(),"clear"!=c.type){var f=new b(c);return a.extend(f,{handlers:[]}),e&&(f.el=a(e)[0]),f.init(),a(e).data("w2field",f),f}})}var f=b.prototype;return f[c]?f[c].apply(f,Array.prototype.slice.call(arguments,1)):void 0},b.prototype={custom:{},pallete:[["000000","444444","666666","999999","CCCCCC","EEEEEE","F3F3F3","FFFFFF"],["FF011B","FF9838","FFFD59","01FD55","00FFFE","0424F3","9B24F4","FF21F5"],["F4CCCC","FCE5CD","FFF2CC","D9EAD3","D0E0E3","CFE2F3","D9D1E9","EAD1DC"],["EA9899","F9CB9C","FEE599","B6D7A8","A2C4C9","9FC5E8","B4A7D6","D5A6BD"],["E06666","F6B26B","FED966","93C47D","76A5AF","6FA8DC","8E7CC3","C27BA0"],["CC0814","E69138","F1C232","6AA84F","45818E","3D85C6","674EA7","A54D79"],["99050C","B45F17","BF901F","37761D","124F5C","0A5394","351C75","741B47"],["660205","783F0B","7F6011","274E12","0C343D","063762","20124D","4C1030"]],addType:function(a,b){return a=String(a).toLowerCase(),this.custom[a]=b,!0},removeType:function(a){return a=String(a).toLowerCase(),this.custom[a]?(delete this.custom[a],!0):!1},init:function(){var b,c=this,d=this.options;if("function"==typeof this.custom[this.type])return void this.custom[this.type].call(this,d);if(-1==["INPUT","TEXTAREA"].indexOf(this.el.tagName))return void console.log("ERROR: w2field could only be applied to INPUT or TEXTAREA.",this.el);switch(this.type){case"text":case"int":case"float":case"money":case"currency":case"percent":case"alphanumeric":case"hex":b={min:null,max:null,step:1,placeholder:"",autoFormat:!0,currencyPrefix:w2utils.settings.currencyPrefix,currencySuffix:w2utils.settings.currencySuffix,currencyPrecision:w2utils.settings.currencyPrecision,decimalSymbol:w2utils.settings.decimalSymbol,groupSymbol:w2utils.settings.groupSymbol,arrows:!1,keyboard:!0,precision:null,silent:!0,prefix:"",suffix:""},this.options=a.extend(!0,{},b,d),d=this.options,d.numberRE=new RegExp("["+d.groupSymbol+"]","g"),d.moneyRE=new RegExp("["+d.currencyPrefix+d.currencySuffix+d.groupSymbol+"]","g"),d.percentRE=new RegExp("["+d.groupSymbol+"%]","g"),-1!=["text","alphanumeric","hex"].indexOf(this.type)&&(d.arrows=!1,d.keyboard=!1),this.addPrefix(),this.addSuffix(),a(this.el).attr("placeholder")&&""==d.placeholder&&(d.placeholder=a(this.el).attr("placeholder")),a(this.el).attr("placeholder",d.placeholder);break;case"color":b={prefix:"#",suffix:'<div style="width: '+(parseInt(a(this.el).css("font-size"))||12)+'px">&nbsp;</div>',placeholder:"",arrows:!1,keyboard:!1},a.extend(d,b),this.addPrefix(),this.addSuffix(),a(this.el).attr("maxlength",6),""!=a(this.el).val()&&setTimeout(function(){a(c.el).change()},1),a(this.el).attr("placeholder")&&""==d.placeholder&&(d.placeholder=a(this.el).attr("placeholder")),a(this.el).attr("placeholder",d.placeholder);break;case"date":b={format:w2utils.settings.date_format,placeholder:"",keyboard:!0,silent:!0,start:"",end:"",blocked:{},colored:{}},this.options=a.extend(!0,{},b,d),d=this.options,a(this.el).attr("placeholder")&&""==d.placeholder&&(d.placeholder=a(this.el).attr("placeholder")),a(this.el).attr("placeholder",d.placeholder?d.placeholder:d.format);break;case"time":b={format:w2utils.settings.time_format,placeholder:"",keyboard:!0,silent:!0,start:"",end:""},this.options=a.extend(!0,{},b,d),d=this.options,a(this.el).attr("placeholder")&&""==d.placeholder&&(d.placeholder=a(this.el).attr("placeholder")),a(this.el).attr("placeholder",d.placeholder?d.placeholder:"h12"==d.format?"hh:mi pm":"hh:mi");break;case"datetime":break;case"list":case"combo":if(b={items:[],selected:{},placeholder:"",url:null,postData:{},minLength:1,cacheMax:250,maxDropHeight:350,match:"begins",silent:!0,icon:null,iconStyle:"",onSearch:null,onRequest:null,onLoad:null,onError:null,onIconClick:null,renderDrop:null,prefix:"",suffix:"",openOnFocus:!1,markSearch:!1},d.items=this.normMenu(d.items),"list"==this.type&&(b.openOnFocus=!0,b.suffix='<div class="arrow-down" style="margin-top: '+(parseInt(a(this.el).height())-6)/2+'px;"></div>',a(this.el).addClass("w2ui-select"),!a.isPlainObject(d.selected)))for(var e in d.items){var f=d.items[e];if(f&&f.id==d.selected){d.selected=a.extend(!0,{},f);break}}d=a.extend({},b,d,{align:"both",altRows:!0}),this.options=d,a.isPlainObject(d.selected)||(d.selected={}),a(this.el).data("selected",d.selected),d.url&&this.request(0),"list"==this.type&&this.addFocus(),this.addPrefix(),this.addSuffix(),setTimeout(function(){c.refresh()},10),a(this.el).attr("placeholder")&&""==d.placeholder&&(d.placeholder=a(this.el).attr("placeholder")),a(this.el).attr("placeholder",d.placeholder).attr("autocomplete","off"),"undefined"!=typeof d.selected.text&&a(this.el).val(d.selected.text);break;case"enum":b={items:[],selected:[],placeholder:"",max:0,url:null,postData:{},minLength:1,cacheMax:250,maxWidth:250,maxHeight:350,maxDropHeight:350,match:"contains",silent:!0,openOnFocus:!1,markSearch:!0,renderDrop:null,renderItem:null,style:"",onSearch:null,onRequest:null,onLoad:null,onError:null,onClick:null,onAdd:null,onNew:null,onRemove:null,onMouseOver:null,onMouseOut:null},d=a.extend({},b,d,{align:"both",suffix:"",altRows:!0}),d.items=this.normMenu(d.items),d.selected=this.normMenu(d.selected),this.options=d,a.isArray(d.selected)||(d.selected=[]),a(this.el).data("selected",d.selected),d.url&&this.request(0),this.addSuffix(),this.addMulti();break;case"file":b={selected:[],placeholder:w2utils.lang("Attach files by dragging and dropping or Click to Select"),max:0,maxSize:0,maxFileSize:0,maxWidth:250,maxHeight:350,maxDropHeight:350,silent:!0,renderItem:null,style:"",onClick:null,onAdd:null,onRemove:null,onMouseOver:null,onMouseOut:null},d=a.extend({},b,d,{align:"both",altRows:!0}),this.options=d,a.isArray(d.selected)||(d.selected=[]),a(this.el).data("selected",d.selected),a(this.el).attr("placeholder")&&(d.placeholder=a(this.el).attr("placeholder")),this.addMulti()}this.tmp={onChange:function(a){c.change.call(c,a)},onClick:function(a){c.click.call(c,a)},onFocus:function(a){c.focus.call(c,a)},onBlur:function(a){c.blur.call(c,a)},onKeydown:function(a){c.keyDown.call(c,a)},onKeyup:function(a){c.keyUp.call(c,a)},onKeypress:function(a){c.keyPress.call(c,a)}},a(this.el).addClass("w2field").data("w2field",this).on("change",this.tmp.onChange).on("click",this.tmp.onClick).on("focus",this.tmp.onFocus).on("blur",this.tmp.onBlur).on("keydown",this.tmp.onKeydown).on("keyup",this.tmp.onKeyup).on("keypress",this.tmp.onKeypress).css({"box-sizing":"border-box","-webkit-box-sizing":"border-box","-moz-box-sizing":"border-box","-ms-box-sizing":"border-box","-o-box-sizing":"border-box"}),this.change(a.Event("change"))},clear:function(){var b=this.options;-1!=["money","currency"].indexOf(this.type)&&a(this.el).val(a(this.el).val().replace(b.moneyRE,"")),"percent"==this.type&&a(this.el).val(a(this.el).val().replace(/%/g,"")),"color"==this.type&&a(this.el).removeAttr("maxlength"),"list"==this.type&&a(this.el).removeClass("w2ui-select"),-1!=["date","time"].indexOf(this.type)&&a(this.el).attr("placeholder")==b.format&&a(this.el).attr("placeholder",""),this.type="clear";var c=a(this.el).data("tmp");if(this.tmp){"undefined"!=typeof c&&(c&&c["old-padding-left"]&&a(this.el).css("padding-left",c["old-padding-left"]),c&&c["old-padding-right"]&&a(this.el).css("padding-right",c["old-padding-right"])),a(this.el).val(this.clean(a(this.el).val())).removeClass("w2field").removeData().off("change",this.tmp.onChange).off("click",this.tmp.onClick).off("focus",this.tmp.onFocus).off("blur",this.tmp.onBlur).off("keydown",this.tmp.onKeydown).off("keyup",this.tmp.onKeyup).off("keypress",this.tmp.onKeypress);for(var d in this.helpers)a(this.helpers[d]).remove();this.helpers={}}},refresh:function(){var b=this,c=this.options,d=a(this.el).data("selected"),e=(new Date).getTime();if(-1!=["list"].indexOf(this.type)&&(a(b.el).parent().css("white-space","nowrap"),b.helpers.prefix&&b.helpers.prefix.hide(),setTimeout(function(){if(b.helpers.focus){!a.isEmptyObject(d)&&c.icon?(c.prefix='<span class="w2ui-icon '+c.icon+'"style="cursor: pointer; font-size: 14px; display: inline-block; margin-top: -1px; color: #7F98AD;'+c.iconStyle+'"></span>',b.addPrefix()):(c.prefix="",b.addPrefix());var e=b.helpers.focus.find("input");""==a(e).val()?(a(e).css("opacity",0).prev().css("opacity",0),a(b.el).val(d&&null!=d.text?d.text:""),a(b.el).attr("placeholder",c.placeholder||"")):(a(e).css("opacity",1).prev().css("opacity",1),a(b.el).val(""),a(b.el).removeAttr("placeholder"),setTimeout(function(){b.helpers.prefix&&b.helpers.prefix.hide();var d="position: absolute; opacity: 0; margin: 4px 0px 0px 2px; background-position: left !important;";c.icon?(a(e).css("margin-left","17px"),a(b.helpers.focus).find(".icon-search").attr("style",d+"width: 11px !important; opacity: 1")):(a(e).css("margin-left","0px"),a(b.helpers.focus).find(".icon-search").attr("style",d+"width: 0px !important; opacity: 0"))},1)),a(b.el).prop("readonly")||a(b.el).prop("disabled")?setTimeout(function(){a(b.helpers.prefix).css("opacity","0.6"),a(b.helpers.suffix).css("opacity","0.6")},1):setTimeout(function(){a(b.helpers.prefix).css("opacity","1"),a(b.helpers.suffix).css("opacity","1")},1)}},1)),-1!=["enum","file"].indexOf(this.type)){var f="";for(var g in d){var h=d[g],i="";i="function"==typeof c.renderItem?c.renderItem(h,g,'<div class="w2ui-list-remove" title="'+w2utils.lang("Remove")+'" index="'+g+'">&nbsp;&nbsp;</div>'):'<div class="w2ui-list-remove" title="'+w2utils.lang("Remove")+'" index="'+g+'">&nbsp;&nbsp;</div>'+("enum"==b.type?h.text:h.name+'<span class="file-size"> - '+w2utils.size(h.size)+"</span>"),f+='<li index="'+g+'" style="max-width: '+parseInt(c.maxWidth)+"px; "+(h.style?h.style:"")+'">'+i+"</li>"}var j=b.helpers.multi,k=j.find("ul");if(j.attr("style",j.attr("style")+";"+c.style),a(b.el).prop("readonly")||a(b.el).prop("disabled")?(j.addClass("w2ui-readonly"),j.css("pointer-events","none").find("li").css("opacity","0.6"),a(b.helpers.multi).find("input").prop("readonly",!0)):(j.removeClass("w2ui-readonly"),j.css("pointer-events","auto").find("li").css("opacity","1"),a(b.helpers.multi).find("input").prop("readonly",!1)),j.find(".w2ui-enum-placeholder").remove(),k.find("li").not("li.nomouse").remove(),""!=f)k.prepend(f);else if("undefined"!=typeof c.placeholder){var l="padding-top: "+a(this.el).css("padding-top")+";padding-left: "+a(this.el).css("padding-left")+"; box-sizing: "+a(this.el).css("box-sizing")+"; line-height: "+a(this.el).css("line-height")+"; font-size: "+a(this.el).css("font-size")+"; font-family: "+a(this.el).css("font-family")+"; ";j.prepend('<div class="w2ui-enum-placeholder" style="'+l+'">'+c.placeholder+"</div>")}j.find("li").data("mouse","out").on("click",function(c){var e=d[a(c.target).attr("index")];if(!a(c.target).hasClass("nomouse")){c.stopPropagation();var f=b.trigger({phase:"before",type:"click",target:b.el,originalEvent:c.originalEvent,item:e});if(f.isCancelled!==!0){if(a(c.target).hasClass("w2ui-list-remove")){if(a(b.el).attr("readonly")||a(b.el).attr("disabled"))return;var f=b.trigger({phase:"before",type:"remove",target:b.el,originalEvent:c.originalEvent,item:e});if(f.isCancelled===!0)return;a().w2overlay(),d.splice(a(c.target).attr("index"),1),a(b.el).trigger("change"),a(c.target).parent().fadeOut("fast"),setTimeout(function(){b.refresh(),b.trigger(a.extend(f,{phase:"after"}))},300)}if("file"==b.type&&!a(c.target).hasClass("w2ui-list-remove")){var g="";/image/i.test(e.type)&&(g='<div style="padding: 3px;">    <img src="'+(e.content?"data:"+e.type+";base64,"+e.content:"")+'" style="max-width: 300px;"         onload="var w = $(this).width(); var h = $(this).height();             if (w < 300 & h < 300) return;             if (w >= h && w > 300) $(this).width(300);            if (w < h && h > 300) $(this).height(300);"        onerror="this.style.display = \'none\'"    ></div>');var h='style="padding: 3px; text-align: right; color: #777;"',i='style="padding: 3px"';g+='<div style="padding: 8px;">    <table cellpadding="2">    <tr><td '+h+">"+w2utils.lang("Name")+":</td><td "+i+">"+e.name+"</td></tr>    <tr><td "+h+">"+w2utils.lang("Size")+":</td><td "+i+">"+w2utils.size(e.size)+"</td></tr>    <tr><td "+h+">"+w2utils.lang("Type")+":</td><td "+i+'>        <span style="width: 200px; display: block-inline; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">'+e.type+"</span>    </td></tr>    <tr><td "+h+">"+w2utils.lang("Modified")+":</td><td "+i+">"+w2utils.date(e.modified)+"</td></tr>    </table></div>",a(c.target).w2overlay(g)}b.trigger(a.extend(f,{phase:"after"}))}}}).on("mouseover",function(c){var e=c.target;if("LI"!=e.tagName&&(e=e.parentNode),!a(e).hasClass("nomouse")){if("out"==a(e).data("mouse")){var f=d[a(e).attr("index")],g=b.trigger({phase:"before",type:"mouseOver",target:b.el,originalEvent:c.originalEvent,item:f});if(g.isCancelled===!0)return;b.trigger(a.extend(g,{phase:"after"}))}a(e).data("mouse","over")}}).on("mouseout",function(c){var e=c.target;"LI"!=e.tagName&&(e=e.parentNode),a(e).hasClass("nomouse")||(a(e).data("mouse","leaving"),setTimeout(function(){if("leaving"==a(e).data("mouse")){a(e).data("mouse","out");var f=d[a(e).attr("index")],g=b.trigger({phase:"before",type:"f",target:b.el,originalEvent:c.originalEvent,item:f});if(g.isCancelled===!0)return;b.trigger(a.extend(g,{phase:"after"}))}},0))}),a(this.el).height("auto");var m=a(j).find("> div").height()+2*w2utils.getSize(j,"+height");26>m&&(m=26),m>c.maxHeight&&(m=c.maxHeight),j.length>0&&(j[0].scrollTop=1e3);var n=w2utils.getSize(a(this.el),"height")-2;n>m&&(m=n),a(j).css({height:m+"px",overflow:m==c.maxHeight?"auto":"hidden"}),m<c.maxHeight&&a(j).prop("scrollTop",0),a(this.el).css({height:m+2+"px"})}return(new Date).getTime()-e},reset:function(){var a=this.type;this.clear(),this.type=a,this.init()},clean:function(b){var c=this.options;return b=String(b).trim(),-1!=["int","float","money","currency","percent"].indexOf(this.type)&&("string"==typeof b&&(b=b.replace(c.decimalSymbol,".")),c.autoFormat&&-1!=["money","currency"].indexOf(this.type)&&(b=String(b).replace(c.moneyRE,"")),c.autoFormat&&"percent"==this.type&&(b=String(b).replace(c.percentRE,"")),c.autoFormat&&-1!=["int","float"].indexOf(this.type)&&(b=String(b).replace(c.numberRE,"")),parseFloat(b)==b&&(null!==c.min&&b<c.min&&(b=c.min,a(this.el).val(c.min)),null!==c.max&&b>c.max&&(b=c.max,a(this.el).val(c.max))),b=""!==b&&w2utils.isFloat(b)?Number(b):""),b},format:function(a){var b=this.options;if(b.autoFormat&&""!=a)switch(this.type){case"money":case"currency":a=w2utils.formatNumber(Number(a).toFixed(b.currencyPrecision),b.groupSymbol),""!=a&&(a=b.currencyPrefix+a+b.currencySuffix);break;case"percent":a=w2utils.formatNumber(b.precision?Number(a).toFixed(b.precision):a,b.groupSymbol),""!=a&&(a+="%");break;case"float":a=w2utils.formatNumber(b.precision?Number(a).toFixed(b.precision):a,b.groupSymbol);break;case"int":a=w2utils.formatNumber(a,b.groupSymbol)}return a},change:function(b){var c=this,d=c.options;if(-1!=["int","float","money","currency","percent"].indexOf(this.type)){var e=a(this.el).val(),f=this.format(this.clean(a(this.el).val()));if(""!=e&&e!=f)return a(this.el).val(f).change(),b.stopPropagation(),b.preventDefault(),!1}if("color"==this.type){var g="#"+a(this.el).val();6!=a(this.el).val().length&&3!=a(this.el).val().length&&(g=""),a(this.el).next().find("div").css("background-color",g),a(c.el).is(":focus")&&this.updateOverlay()}if(-1!=["list","enum","file"].indexOf(this.type)&&(c.refresh(),setTimeout(function(){c.refresh()},5)),-1!=["date","time"].indexOf(this.type)){var h=parseInt(c.el.value);w2utils.isInt(c.el.value)&&h>3e3&&("time"==this.type&&a(c.el).val(w2utils.formatTime(new Date(h),d.format)).change(),"date"==this.type&&a(c.el).val(w2utils.formatDate(new Date(h),d.format)).change())}},click:function(b){b.stopPropagation(),-1!=["list","combo","enum"].indexOf(this.type)&&(a(this.el).is(":focus")||this.focus(b)),-1!=["date","time","color"].indexOf(this.type)&&this.updateOverlay()},focus:function(){{var b=this;this.options}if(-1!==["color","date","time"].indexOf(b.type)){if(a(b.el).attr("readonly")||a(b.el).attr("disabled"))return;a("#w2ui-overlay").length>0&&a("#w2ui-overlay")[0].hide(),setTimeout(function(){b.updateOverlay()},150)}if(-1!=["list","combo","enum"].indexOf(b.type)){if(a(b.el).attr("readonly")||a(b.el).attr("disabled"))return;a("#w2ui-overlay").length>0&&a("#w2ui-overlay")[0].hide(),setTimeout(function(){return"list"==b.type&&a(b.el).is(":focus")?void a(b.helpers.focus).find("input").focus():(b.search(),void setTimeout(function(){b.updateOverlay()},1))},1)}"file"==b.type&&a(b.helpers.multi).css({outline:"auto 5px #7DB4F3","outline-offset":"-2px"})},blur:function(){var b=this,c=b.options,d=a(b.el).val().trim();-1!=["color","date","time","list","combo","enum"].indexOf(b.type)&&a("#w2ui-overlay").length>0&&a("#w2ui-overlay")[0].hide(),-1!=["int","float","money","currency","percent"].indexOf(b.type)&&(""===d||b.checkType(d)||(a(b.el).val("").change(),c.silent===!1&&(a(b.el).w2tag("Not a valid number"),setTimeout(function(){a(b.el).w2tag("")},3e3)))),-1!=["date","time"].indexOf(b.type)&&(""===d||b.inRange(b.el.value)?("date"!=b.type||""===d||w2utils.isDate(b.el.value,c.format)||(a(b.el).val("").removeData("selected").change(),c.silent===!1&&(a(b.el).w2tag("Not a valid date"),setTimeout(function(){a(b.el).w2tag("")},3e3))),"time"!=b.type||""===d||w2utils.isTime(b.el.value)||(a(b.el).val("").removeData("selected").change(),c.silent===!1&&(a(b.el).w2tag("Not a valid time"),setTimeout(function(){a(b.el).w2tag("")},3e3)))):(a(b.el).val("").removeData("selected").change(),c.silent===!1&&(a(b.el).w2tag("Not in range"),setTimeout(function(){a(b.el).w2tag("")},3e3)))),"enum"==b.type&&a(b.helpers.multi).find("input").val("").width(20),"file"==b.type&&a(b.helpers.multi).css({outline:"none"})},keyPress:function(a){{var b=this;b.options}if(-1!=["int","float","money","currency","percent","hex","color","alphanumeric"].indexOf(b.type)){if(a.metaKey||a.ctrlKey||a.altKey||a.charCode!=a.keyCode&&a.keyCode>0)return;var c=String.fromCharCode(a.charCode);if(!b.checkType(c,!0)&&13!=a.keyCode)return a.preventDefault(),a.stopPropagation?a.stopPropagation():a.cancelBubble=!0,!1}-1!=["date","time"].indexOf(b.type)&&setTimeout(function(){b.updateOverlay()},1)},keyDown:function(b,c){var d=this,e=d.options,f=b.keyCode||c&&c.keyCode;if(-1!=["int","float","money","currency","percent"].indexOf(d.type)){if(!e.keyboard||a(d.el).attr("readonly"))return;var g=!1,h=parseFloat(a(d.el).val().replace(e.moneyRE,""))||0,i=e.step;switch((b.ctrlKey||b.metaKey)&&(i=10),f){case 38:if(b.shiftKey)break;a(d.el).val(h+i<=e.max||null===e.max?Number((h+i).toFixed(12)):e.max).change(),g=!0;break;case 40:if(b.shiftKey)break;a(d.el).val(h-i>=e.min||null===e.min?Number((h-i).toFixed(12)):e.min).change(),g=!0}g&&(b.preventDefault(),setTimeout(function(){d.el.setSelectionRange(d.el.value.length,d.el.value.length)},0))}if("date"==d.type){if(!e.keyboard||a(d.el).attr("readonly"))return;var g=!1,j=864e5,i=1;(b.ctrlKey||b.metaKey)&&(i=10);var k=w2utils.isDate(a(d.el).val(),e.format,!0);switch(k||(k=new Date,j=0),f){case 38:if(b.shiftKey)break;var l=w2utils.formatDate(k.getTime()+j,e.format);10==i&&(l=w2utils.formatDate(new Date(k.getFullYear(),k.getMonth()+1,k.getDate()),e.format)),a(d.el).val(l).change(),g=!0;break;case 40:if(b.shiftKey)break;var l=w2utils.formatDate(k.getTime()-j,e.format);10==i&&(l=w2utils.formatDate(new Date(k.getFullYear(),k.getMonth()-1,k.getDate()),e.format)),a(d.el).val(l).change(),g=!0}g&&(b.preventDefault(),setTimeout(function(){d.el.setSelectionRange(d.el.value.length,d.el.value.length),d.updateOverlay()},0))}if("time"==d.type){if(!e.keyboard||a(d.el).attr("readonly"))return;var g=!1,i=b.ctrlKey||b.metaKey?60:1,h=a(d.el).val(),m=d.toMin(h)||d.toMin((new Date).getHours()+":"+((new Date).getMinutes()-1));switch(f){case 38:if(b.shiftKey)break;m+=i,g=!0;break;case 40:if(b.shiftKey)break;m-=i,g=!0}g&&(a(d.el).val(d.fromMin(m)).change(),b.preventDefault(),setTimeout(function(){d.el.setSelectionRange(d.el.value.length,d.el.value.length)},0))}if("color"==d.type){if(a(d.el).attr("readonly"))return;if(86==b.keyCode&&(b.ctrlKey||b.metaKey)&&(a(d.el).prop("maxlength",7),setTimeout(function(){var b=a(d).val();"#"==b.substr(0,1)&&(b=b.substr(1)),w2utils.isHex(b)||(b=""),a(d).val(b).prop("maxlength",6).change()},20)),(b.ctrlKey||b.metaKey)&&!b.shiftKey){if("undefined"==typeof d.tmp.cind1)d.tmp.cind1=-1,d.tmp.cind2=-1;else{switch(f){case 38:d.tmp.cind1--;break;case 40:d.tmp.cind1++;break;case 39:d.tmp.cind2++;break;case 37:d.tmp.cind2--}d.tmp.cind1<0&&(d.tmp.cind1=0),d.tmp.cind1>this.pallete.length-1&&(d.tmp.cind1=this.pallete.length-1),d.tmp.cind2<0&&(d.tmp.cind2=0),d.tmp.cind2>this.pallete[0].length-1&&(d.tmp.cind2=this.pallete[0].length-1)}-1!=[37,38,39,40].indexOf(f)&&(a(d.el).val(this.pallete[d.tmp.cind1][d.tmp.cind2]).change(),b.preventDefault())}}if(-1!=["list","combo","enum"].indexOf(d.type)){if(a(d.el).attr("readonly"))return;var g=!1,n=a(d.el).data("selected"),o=a(d.helpers.focus).find("input");switch("list"==d.type&&-1==[37,38,39,40].indexOf(f)&&d.refresh(),f){case 27:"list"==d.type&&(""!=a(o).val()&&a(o).val(""),b.stopPropagation());break;case 37:case 39:break;case 13:if(0==a("#w2ui-overlay").length)break;var p=e.items[e.index],q=a(d.helpers.multi).find("input");if("enum"==d.type)if(null!=p){var r=d.trigger({phase:"before",type:"add",target:d.el,originalEvent:b.originalEvent,item:p});if(r.isCancelled===!0)return;p=r.item,n.length>=e.max&&e.max>0&&n.pop(),delete p.hidden,delete d.tmp.force_open,n.push(p),a(d.el).change(),q.val("").width(20),d.refresh(),d.trigger(a.extend(r,{phase:"after"}))}else{p={id:q.val(),text:q.val()};var r=d.trigger({phase:"before",type:"new",target:d.el,originalEvent:b.originalEvent,item:p});if(r.isCancelled===!0)return;p=r.item,"function"==typeof d.onNew&&(n.length>=e.max&&e.max>0&&n.pop(),delete d.tmp.force_open,n.push(p),a(d.el).change(),q.val("").width(20),d.refresh()),d.trigger(a.extend(r,{phase:"after"}))}else p&&a(d.el).data("selected",p).val(p.text).change(),""==a(d.el).val()&&a(d.el).data("selected")&&a(d.el).removeData("selected").val("").change(),"list"==d.type&&(o.val(""),d.refresh()),d.tmp.force_hide=!0;break;case 8:case 46:if("enum"==d.type&&8==f&&""==a(d.helpers.multi).find("input").val()&&n.length>0){var p=n[n.length-1],r=d.trigger({phase:"before",type:"remove",target:d.el,originalEvent:b.originalEvent,item:p});if(r.isCancelled===!0)return;n.pop(),a(d.el).trigger("change"),d.refresh(),d.trigger(a.extend(r,{phase:"after"}))}"list"==d.type&&""==a(o).val()&&(a(d.el).data("selected",{}).change(),d.refresh());break;case 38:for(e.index=w2utils.isInt(e.index)?parseInt(e.index):0,e.index--;e.index>0&&e.items[e.index].hidden;)e.index--;if(0==e.index&&e.items[e.index].hidden)for(;e.items[e.index]&&e.items[e.index].hidden;)e.index++;g=!0;break;case 40:for(e.index=w2utils.isInt(e.index)?parseInt(e.index):-1,e.index++;e.index<e.items.length-1&&e.items[e.index].hidden;)e.index++;if(e.index==e.items.length-1&&e.items[e.index].hidden)for(;e.items[e.index]&&e.items[e.index].hidden;)e.index--;var s=d.el;-1!=["enum"].indexOf(d.type)&&(s=d.helpers.multi.find("input")),""==a(s).val()&&0==a("#w2ui-overlay").length?d.tmp.force_open=!0:g=!0}if(g)return e.index<0&&(e.index=0),e.index>=e.items.length&&(e.index=e.items.length-1),d.updateOverlay(),b.preventDefault(),void setTimeout(function(){if("enum"==d.type){var a=d.helpers.multi.find("input").get(0);a.setSelectionRange(a.value.length,a.value.length)}else if("list"==d.type){var a=d.helpers.focus.find("input").get(0);a.setSelectionRange(a.value.length,a.value.length)}else d.el.setSelectionRange(d.el.value.length,d.el.value.length)},0);if("enum"==d.type){var s=d.helpers.multi.find("input"),t=s.val();s.width(8*(t.length+2)+"px")}-1==[16,17,18,20,37,39,91].indexOf(f)&&setTimeout(function(){d.tmp.force_hide||d.request(),d.search()},1)}},keyUp:function(b){"color"==this.type&&86==b.keyCode&&(b.ctrlKey||b.metaKey)&&a(this).prop("maxlength",6)},clearCache:function(){var a=this.options;a.items=[],this.tmp.xhr_loading=!1,this.tmp.xhr_search="",this.tmp.xhr_total=-1,this.search()},request:function(b){var c=this,d=this.options,e=a(c.el).val()||"";if(d.url){if("enum"==c.type){var f=a(c.helpers.multi).find("input");e=0==f.length?"":f.val()}if("list"==c.type){var f=a(c.helpers.focus).find("input");e=0==f.length?"":f.val()}if(0!=d.minLength&&e.length<d.minLength)return d.items=[],void this.updateOverlay();"undefined"==typeof b&&(b=350),"undefined"==typeof c.tmp.xhr_search&&(c.tmp.xhr_search=""),"undefined"==typeof c.tmp.xhr_total&&(c.tmp.xhr_total=-1),d.url&&1!=a(c.el).prop("readonly")&&(0===d.items.length&&0!==c.tmp.xhr_total||c.tmp.xhr_total==d.cacheMax&&e.length>c.tmp.xhr_search.length||e.length>=c.tmp.xhr_search.length&&e.substr(0,c.tmp.xhr_search.length)!=c.tmp.xhr_search||e.length<c.tmp.xhr_search.length)&&(c.tmp.xhr_loading=!0,c.search(),clearTimeout(c.tmp.timeout),c.tmp.timeout=setTimeout(function(){var b=d.url,f={search:e,max:d.cacheMax};a.extend(f,d.postData);var g=c.trigger({phase:"before",type:"request",target:c.el,url:b,postData:f});if(g.isCancelled!==!0){b=g.url,f=g.postData,c.tmp.xhr&&c.tmp.xhr.abort();var h={type:"GET",url:b,data:f,dataType:"JSON"};"JSON"==w2utils.settings.dataType&&(h.type="POST",h.data=JSON.stringify(h.data),h.contentType="application/json"),c.tmp.xhr=a.ajax(h).done(function(b,g,h){var i=c.trigger({phase:"before",type:"load",target:c.el,search:f.search,data:b,xhr:h});if(i.isCancelled!==!0){if(b=i.data,"string"==typeof b&&(b=JSON.parse(b)),"success"!=b.status)return void console.log("ERROR: server did not return proper structure. It should return",{status:"success",items:[{id:1,text:"item"}]});b.items.length>d.cacheMax&&b.items.splice(d.cacheMax,1e5),c.tmp.xhr_loading=!1,c.tmp.xhr_search=e,c.tmp.xhr_total=b.items.length,d.items=c.normMenu(b.items),c.tmp.emptySet=""==e&&0==b.items.length?!0:!1,c.search(),c.trigger(a.extend(i,{phase:"after"}))}}).fail(function(b,d,f){var g={status:d,error:f,rawResponseText:b.responseText},h=c.trigger({phase:"before",type:"error",target:c.el,search:e,error:g,xhr:b});if(h.isCancelled!==!0){if("abort"!=d){var i;try{i=a.parseJSON(b.responseText)}catch(j){}console.log("ERROR: Server communication failed.","\n   EXPECTED:",{status:"success",items:[{id:1,text:"item"}]},"\n         OR:",{status:"error",message:"error message"},"\n   RECEIVED:","object"==typeof i?i:b.responseText)}c.clearCache(),c.trigger(a.extend(h,{phase:"after"}))}}),c.trigger(a.extend(g,{phase:"after"}))}},b))}},search:function(){var b=this,c=this.options,d=a(b.el).val(),e=b.el,f=[],g=a(b.el).data("selected");if("enum"==b.type){e=a(b.helpers.multi).find("input"),d=e.val();for(var h in g)g[h]&&f.push(g[h].id)}if("list"==b.type){e=a(b.helpers.focus).find("input"),d=e.val();for(var h in g)g[h]&&f.push(g[h].id)}var i=b.trigger({phase:"before",type:"search",target:e,search:d});if(i.isCancelled!==!0){if(b.tmp.xhr_loading!==!0){var j=0;for(var k in c.items){var l=c.items[k],m="",n="";-1!=["is","begins"].indexOf(c.match)&&(m="^"),-1!=["is","ends"].indexOf(c.match)&&(n="$");try{var o=new RegExp(m+d+n,"i");l.hidden=o.test(l.text)||"..."==l.text?!1:!0}catch(p){}"enum"==b.type&&-1!=a.inArray(l.id,f)&&(l.hidden=!0),l.hidden!==!0&&j++}if("combo"!=b.type)for(c.index=0;c.items[c.index]&&c.items[c.index].hidden;)c.index++;else c.index=-1;0>=j&&(c.index=-1),c.spinner=!1,b.updateOverlay(),setTimeout(function(){var b=a("#w2ui-overlay").html()||"";c.markSearch&&-1!=b.indexOf("$.fn.w2menuHandler")&&a("#w2ui-overlay").w2marker(d)},1)}else c.items.splice(0,c.cacheMax),c.spinner=!0,b.updateOverlay();b.trigger(a.extend(i,{phase:"after"}))}},updateOverlay:function(){var b=this,c=this.options;if("color"==this.type){if(a(b.el).attr("readonly"))return;0==a("#w2ui-overlay").length?a(b.el).w2overlay(b.getColorHTML()):a("#w2ui-overlay").html(b.getColorHTML()),a("#w2ui-overlay .color").on("mousedown",function(c){var d=a(c.originalEvent.target).attr("name"),e=a(c.originalEvent.target).attr("index").split(":");b.tmp.cind1=e[0],b.tmp.cind2=e[1],a(b.el).val(d).change(),a(this).html("&#149;")}).on("mouseup",function(){setTimeout(function(){a("#w2ui-overlay").length>0&&a("#w2ui-overlay").removeData("keepOpen")[0].hide()},10)})}if("date"==this.type){if(a(b.el).attr("readonly"))return;0==a("#w2ui-overlay").length&&a(b.el).w2overlay('<div class="w2ui-reset w2ui-calendar" onclick="event.stopPropagation();"></div>',{css:{"background-color":"#f5f5f5"}});var d,e,f=w2utils.isDate(a(b.el).val(),b.options.format,!0);f&&(d=f.getMonth()+1,e=f.getFullYear()),function k(c,d){a("#w2ui-overlay > div > div").html(b.getMonthHTML(c,d)),a("#w2ui-overlay .w2ui-calendar-title").on("mousedown",function(){if(a(this).next().hasClass("w2ui-calendar-jump"))a(this).next().remove();
	else{var c,d;a(this).after('<div class="w2ui-calendar-jump" style=""></div>'),a(this).next().hide().html(b.getYearHTML()).fadeIn(200),setTimeout(function(){a("#w2ui-overlay .w2ui-calendar-jump").find(".w2ui-jump-month, .w2ui-jump-year").on("click",function(){a(this).hasClass("w2ui-jump-month")&&(a(this).parent().find(".w2ui-jump-month").removeClass("selected"),a(this).addClass("selected"),d=a(this).attr("name")),a(this).hasClass("w2ui-jump-year")&&(a(this).parent().find(".w2ui-jump-year").removeClass("selected"),a(this).addClass("selected"),c=a(this).attr("name")),null!=c&&null!=d&&(a("#w2ui-overlay .w2ui-calendar-jump").fadeOut(100),setTimeout(function(){k(parseInt(d)+1,c)},100))}),a("#w2ui-overlay .w2ui-calendar-jump >:last-child").prop("scrollTop",2e3)},1)}}),a("#w2ui-overlay .w2ui-date").on("mousedown",function(){var c=a(this).attr("date");a(b.el).val(c).change(),a(this).css({"background-color":"#B6D5FB","border-color":"#aaa"})}).on("mouseup",function(){setTimeout(function(){a("#w2ui-overlay").length>0&&a("#w2ui-overlay").removeData("keepOpen")[0].hide()},10)}),a("#w2ui-overlay .previous").on("mousedown",function(){var a=b.options.current.split("/");a[0]=parseInt(a[0])-1,k(a[0],a[1])}),a("#w2ui-overlay .next").on("mousedown",function(){var a=b.options.current.split("/");a[0]=parseInt(a[0])+1,k(a[0],a[1])})}(d,e)}if("time"==this.type){if(a(b.el).attr("readonly"))return;0==a("#w2ui-overlay").length&&a(b.el).w2overlay('<div class="w2ui-reset w2ui-calendar-time" onclick="event.stopPropagation();"></div>',{css:{"background-color":"#fff"}});var g="h24"==this.options.format?!0:!1;a("#w2ui-overlay > div").html(b.getHourHTML()),a("#w2ui-overlay .w2ui-time").on("mousedown",function(){a(this).css({"background-color":"#B6D5FB","border-color":"#aaa"});var c=a(this).attr("hour");a(b.el).val((c>12&&!g?c-12:c)+":00"+(g?"":12>c?" am":" pm")).change()}).on("mouseup",function(){var c=a(this).attr("hour");a("#w2ui-overlay").length>0&&a("#w2ui-overlay")[0].hide(),a(b.el).w2overlay('<div class="w2ui-reset w2ui-calendar-time"></div>',{css:{"background-color":"#fff"}}),a("#w2ui-overlay > div").html(b.getMinHTML(c)),a("#w2ui-overlay .w2ui-time").on("mousedown",function(){a(this).css({"background-color":"#B6D5FB","border-color":"#aaa"});var d=a(this).attr("min");a(b.el).val((c>12&&!g?c-12:c)+":"+(10>d?0:"")+d+(g?"":12>c?" am":" pm")).change()}).on("mouseup",function(){setTimeout(function(){a("#w2ui-overlay").length>0&&a("#w2ui-overlay").removeData("keepOpen")[0].hide()},10)})})}if(-1!=["list","combo","enum"].indexOf(this.type)){var h=this.el,i=this.el;if("enum"==this.type&&(h=a(this.helpers.multi),i=a(h).find("input")),"list"==this.type&&(i=a(this.helpers.focus).find("input")),a(i).is(":focus")){if(c.openOnFocus===!1&&""==a(i).val()&&b.tmp.force_open!==!0)return void a().w2overlay();if(b.tmp.force_hide)return a().w2overlay(),void setTimeout(function(){delete b.tmp.force_hide},1);""!=a(i).val()&&delete b.tmp.force_open,0==a("#w2ui-overlay").length&&(c.index=0);var j=w2utils.lang("No matches");null!=c.url&&a(i).val().length<c.minLength&&b.tmp.emptySet!==!0&&(j=c.minLength+" "+w2utils.lang("letters or more...")),null!=c.url&&""==a(i).val()&&b.tmp.emptySet!==!0&&(j=w2utils.lang("Type to search....")),a(h).w2menu("refresh",a.extend(!0,{},c,{search:!1,render:c.renderDrop,maxHeight:c.maxDropHeight,msgNoItems:j,onSelect:function(d){if("enum"==b.type){var e=a(b.el).data("selected");if(d.item){var f=b.trigger({phase:"before",type:"add",target:b.el,originalEvent:d.originalEvent,item:d.item});if(f.isCancelled===!0)return;e.length>=c.max&&c.max>0&&e.pop(),delete d.item.hidden,e.push(d.item),a(b.el).data("selected",e).change(),a(b.helpers.multi).find("input").val("").width(20),b.refresh(),a("#w2ui-overlay").length>0&&a("#w2ui-overlay")[0].hide(),b.trigger(a.extend(f,{phase:"after"}))}}else a(b.el).data("selected",d.item).val(d.item.text).change(),b.helpers.focus&&b.helpers.focus.find("input").val("")}}))}}},inRange:function(b){var c=!1;if("date"==this.type){var d=w2utils.isDate(b,this.options.format,!0);if(d){if(this.options.start||this.options.end){var e="string"==typeof this.options.start?this.options.start:a(this.options.start).val(),f="string"==typeof this.options.end?this.options.end:a(this.options.end).val(),g=w2utils.isDate(e,this.options.format,!0),h=w2utils.isDate(f,this.options.format,!0),i=new Date(d);g||(g=i),h||(h=i),i>=g&&h>=i&&(c=!0)}else c=!0;this.options.blocked&&-1!=a.inArray(b,this.options.blocked)&&(c=!1)}}if("time"==this.type)if(this.options.start||this.options.end){var j=this.toMin(b),k=this.toMin(this.options.start),l=this.toMin(this.options.end);k||(k=j),l||(l=j),j>=k&&l>=j&&(c=!0)}else c=!0;return c},checkType:function(a,b){var c=this;switch(c.type){case"int":return b&&-1!=["-",c.options.groupSymbol].indexOf(a)?!0:w2utils.isInt(a.replace(c.options.numberRE,""));case"percent":a=a.replace(/%/g,"");case"float":return b&&-1!=["-",w2utils.settings.decimalSymbol,c.options.groupSymbol].indexOf(a)?!0:w2utils.isFloat(a.replace(c.options.numberRE,""));case"money":case"currency":return b&&-1!=["-",c.options.decimalSymbol,c.options.groupSymbol,c.options.currencyPrefix,c.options.currencySuffix].indexOf(a)?!0:w2utils.isFloat(a.replace(c.options.moneyRE,""));case"hex":case"color":return w2utils.isHex(a);case"alphanumeric":return w2utils.isAlphaNumeric(a)}return!0},addPrefix:function(){var b=this;setTimeout(function(){if("clear"!==b.type){var c,d=a(b.el).data("tmp")||{};d["old-padding-left"]&&a(b.el).css("padding-left",d["old-padding-left"]),d["old-padding-left"]=a(b.el).css("padding-left"),a(b.el).data("tmp",d),b.helpers.prefix&&a(b.helpers.prefix).remove(),""!==b.options.prefix&&(a(b.el).before('<div class="w2ui-field-helper">'+b.options.prefix+"</div>"),c=a(b.el).prev(),c.css({color:a(b.el).css("color"),"font-family":a(b.el).css("font-family"),"font-size":a(b.el).css("font-size"),"padding-top":a(b.el).css("padding-top"),"padding-bottom":a(b.el).css("padding-bottom"),"padding-left":a(b.el).css("padding-left"),"padding-right":0,"margin-top":parseInt(a(b.el).css("margin-top"),10)+2+"px","margin-bottom":parseInt(a(b.el).css("margin-bottom"),10)+1+"px","margin-left":a(b.el).css("margin-left"),"margin-right":0}).on("click",function(){if(b.options.icon&&"function"==typeof b.onIconClick){var c=b.trigger({phase:"before",type:"iconClick",target:b.el,el:a(this).find("span.w2ui-icon")[0]});if(c.isCancelled===!0)return;b.trigger(a.extend(c,{phase:"after"}))}else"list"==b.type?a(b.helpers.focus).find("input").focus():a(b.el).focus()}),a(b.el).css("padding-left",c.width()+parseInt(a(b.el).css("padding-left"),10)+"px"),b.helpers.prefix=c)}},1)},addSuffix:function(){var b,c,d=this;setTimeout(function(){if("clear"!==d.type){var e=a(d.el).data("tmp")||{};if(e["old-padding-right"]&&a(d.el).css("padding-right",e["old-padding-right"]),e["old-padding-right"]=a(d.el).css("padding-right"),a(d.el).data("tmp",e),c=parseInt(a(d.el).css("padding-right"),10),d.options.arrows){d.helpers.arrows&&a(d.helpers.arrows).remove(),a(d.el).after('<div class="w2ui-field-helper" style="border: 1px solid transparent">&nbsp;    <div class="w2ui-field-up" type="up">        <div class="arrow-up" type="up"></div>    </div>    <div class="w2ui-field-down" type="down">        <div class="arrow-down" type="down"></div>    </div></div>');{w2utils.getSize(d.el,"height")}b=a(d.el).next(),b.css({color:a(d.el).css("color"),"font-family":a(d.el).css("font-family"),"font-size":a(d.el).css("font-size"),height:a(d.el).height()+parseInt(a(d.el).css("padding-top"),10)+parseInt(a(d.el).css("padding-bottom"),10)+"px",padding:0,"margin-top":parseInt(a(d.el).css("margin-top"),10)+1+"px","margin-bottom":0,"border-left":"1px solid silver"}).css("margin-left","-"+(b.width()+parseInt(a(d.el).css("margin-right"),10)+12)+"px").on("mousedown",function(b){function c(){clearTimeout(a("body").data("_field_update_timer")),a("body").off("mouseup",c)}function e(c){a(d.el).focus(),d.keyDown(a.Event("keydown"),{keyCode:"up"==a(b.target).attr("type")?38:40}),c!==!1&&a("body").data("_field_update_timer",setTimeout(e,60))}a("body").on("mouseup",c),a("body").data("_field_update_timer",setTimeout(e,700)),e(!1)}),c+=b.width()+12,a(d.el).css("padding-right",c+"px"),d.helpers.arrows=b}""!==d.options.suffix&&(d.helpers.suffix&&a(d.helpers.suffix).remove(),a(d.el).after('<div class="w2ui-field-helper">'+d.options.suffix+"</div>"),b=a(d.el).next(),b.css({color:a(d.el).css("color"),"font-family":a(d.el).css("font-family"),"font-size":a(d.el).css("font-size"),"padding-top":a(d.el).css("padding-top"),"padding-bottom":a(d.el).css("padding-bottom"),"padding-left":"3px","padding-right":a(d.el).css("padding-right"),"margin-top":parseInt(a(d.el).css("margin-top"),10)+2+"px","margin-bottom":parseInt(a(d.el).css("margin-bottom"),10)+1+"px"}).on("click",function(){"list"==d.type?a(d.helpers.focus).find("input").focus():a(d.el).focus()}),b.css("margin-left","-"+(w2utils.getSize(b,"width")+parseInt(a(d.el).css("margin-right"),10)+2)+"px"),c+=b.width()+3,a(d.el).css("padding-right",c+"px"),d.helpers.suffix=b)}},1)},addFocus:function(){var b=this,c=(this.options,0);a(b.helpers.focus).remove();var d=a(b.el).attr("tabIndex");d&&-1!=d&&(b.el._tabIndex=d),b.el._tabIndex&&(d=b.el._tabIndex);var e='<div class="w2ui-field-helper">    <div class="w2ui-icon icon-search"></div>    <input type="text" autocomplete="off" tabindex="'+d+'"><div>';a(b.el).attr("tabindex",-1).before(e);var f=a(b.el).prev();b.helpers.focus=f,f.css({width:a(b.el).width(),"margin-top":a(b.el).css("margin-top"),"margin-left":parseInt(a(b.el).css("margin-left"))+parseInt(a(b.el).css("padding-left"))+"px","margin-bottom":a(b.el).css("margin-bottom"),"margin-right":a(b.el).css("margin-right")}).find("input").css({cursor:"default",width:"100%",outline:"none",opacity:1,margin:0,border:"1px solid transparent",padding:a(b.el).css("padding-top"),"padding-left":0,"margin-left":c>0?c+6:0,"background-color":"transparent"}),f.find("input").on("click",function(c){0==a("#w2ui-overlay").length&&b.focus(c),c.stopPropagation()}).on("focus",function(c){a(b.el).css({outline:"auto 5px #7DB4F3","outline-offset":"-2px"}),a(this).val(""),a(b.el).triggerHandler("focus"),c.stopPropagation?c.stopPropagation():c.cancelBubble=!0}).on("blur",function(c){a(b.el).css("outline","none"),a(this).val(""),b.refresh(),a(b.el).triggerHandler("blur"),c.stopPropagation?c.stopPropagation():c.cancelBubble=!0}).on("keyup",function(a){b.keyUp(a)}).on("keydown",function(a){b.keyDown(a)}).on("keypress",function(a){b.keyPress(a)}),f.on("click",function(){a(this).find("input").focus()}),b.refresh()},addMulti:function(){{var b=this;this.options}a(b.helpers.multi).remove();var c="",d="margin-top     : 0px; margin-bottom  : 0px; margin-left    : "+a(b.el).css("margin-left")+"; margin-right   : "+a(b.el).css("margin-right")+"; width          : "+(w2utils.getSize(b.el,"width")-parseInt(a(b.el).css("margin-left"),10)-parseInt(a(b.el).css("margin-right"),10))+"px;";"enum"==b.type&&(c='<div class="w2ui-field-helper w2ui-list" style="'+d+'; box-sizing: border-box">    <div style="padding: 0px; margin: 0px; margin-right: 20px; display: inline-block">    <ul>        <li style="padding-left: 0px; padding-right: 0px" class="nomouse">            <input type="text" style="width: 20px" autocomplete="off" '+(a(b.el).attr("readonly")?"readonly":"")+">        </li>"),"file"==b.type&&(c='<div class="w2ui-field-helper w2ui-list" style="'+d+'; box-sizing: border-box">    <div style="padding: 0px; margin: 0px; margin-right: 20px; display: inline-block">    <ul><li style="padding-left: 0px; padding-right: 0px" class="nomouse"></li></ul>    <input class="file-input" type="file" name="attachment" multiple style="display: none" tabindex="-1">'),a(b.el).before(c).css({"background-color":"transparent","border-color":"transparent"});var e=a(b.el).prev();b.helpers.multi=e,"enum"==b.type&&(a(b.el).attr("tabindex",-1),e.find("input").on("click",function(c){0==a("#w2ui-overlay").length&&b.focus(c),a(b.el).triggerHandler("click")}).on("focus",function(c){a(e).css({outline:"auto 5px #7DB4F3","outline-offset":"-2px"}),a(b.el).triggerHandler("focus"),c.stopPropagation?c.stopPropagation():c.cancelBubble=!0}).on("blur",function(c){a(e).css("outline","none"),a(b.el).triggerHandler("blur"),c.stopPropagation?c.stopPropagation():c.cancelBubble=!0}).on("keyup",function(a){b.keyUp(a)}).on("keydown",function(a){b.keyDown(a)}).on("keypress",function(a){e.find(".w2ui-enum-placeholder").remove(),b.keyPress(a)}),e.on("click",function(){a(this).find("input").focus()})),"file"==b.type&&(a(b.el).css("outline","none"),e.on("click",function(c){a(b.el).focus(),a(b.el).attr("readonly")||(b.blur(c),e.find("input").click())}).on("dragenter",function(){a(b.el).attr("readonly")||a(e).addClass("w2ui-file-dragover")}).on("dragleave",function(c){if(!a(b.el).attr("readonly")){var d=a(c.target).parents(".w2ui-field-helper");0==d.length&&a(e).removeClass("w2ui-file-dragover")}}).on("drop",function(c){if(!a(b.el).attr("readonly")){a(e).removeClass("w2ui-file-dragover");for(var d=c.originalEvent.dataTransfer.files,f=0,g=d.length;g>f;f++)b.addFile.call(b,d[f]);c.preventDefault(),c.stopPropagation()}}).on("dragover",function(a){a.preventDefault(),a.stopPropagation()}),e.find("input").on("click",function(a){a.stopPropagation()}).on("change",function(){if("undefined"!=typeof this.files)for(var a=0,c=this.files.length;c>a;a++)b.addFile.call(b,this.files[a])})),b.refresh()},addFile:function(b){var c,d=this,e=this.options,f=a(d.el).data("selected"),g={name:b.name,type:b.type,modified:b.lastModifiedDate,size:b.size,content:null},h=0,i=0;for(var j in f){if(f[j].name==b.name&&f[j].size==b.size)return;h+=f[j].size,i++}var k=d.trigger({phase:"before",type:"add",target:d.el,file:g,total:i,totalSize:h});if(k.isCancelled!==!0){if(0!==e.maxFileSize&&g.size>e.maxFileSize)return c="Maximum file size is "+w2utils.size(e.maxFileSize),e.silent===!1&&a(d.el).w2tag(c),void console.log("ERROR: "+c);if(0!==e.maxSize&&h+g.size>e.maxSize)return c="Maximum total size is "+w2utils.size(e.maxSize),e.silent===!1&&a(d.el).w2tag(c),void console.log("ERROR: "+c);if(0!==e.max&&i>=e.max)return c="Maximum number of files is "+e.max,e.silent===!1&&a(d.el).w2tag(c),void console.log("ERROR: "+c);if(f.push(g),"undefined"!=typeof FileReader){var l=new FileReader;l.onload=function(){return function(b){var c=b.target.result,e=c.indexOf(",");g.content=c.substr(e+1),d.refresh(),a(d.el).trigger("change"),d.trigger(a.extend(k,{phase:"after"}))}}(),l.readAsDataURL(b)}else d.refresh(),a(d.el).trigger("change")}},normMenu:function(b){if(a.isArray(b)){for(var c=0;c<b.length;c++)"string"==typeof b[c]?b[c]={id:b[c],text:b[c]}:("undefined"!=typeof b[c].text&&"undefined"==typeof b[c].id&&(b[c].id=b[c].text),"undefined"==typeof b[c].text&&"undefined"!=typeof b[c].id&&(b[c].text=b[c].id),"undefined"!=typeof b[c].caption&&(b[c].text=b[c].caption));return b}if("object"==typeof b){var d=[];for(var c in b)d.push({id:c,text:b[c]});return d}},getColorHTML:function(){for(var b='<div class="w2ui-color"><table cellspacing="5">',c=0;8>c;c++){b+="<tr>";for(var d=0;8>d;d++)b+='<td>    <div class="color" style="background-color: #'+this.pallete[c][d]+';" name="'+this.pallete[c][d]+'" index="'+c+":"+d+'">        '+(a(this.el).val()==this.pallete[c][d]?"&#149;":"&nbsp;")+"    </div></td>";b+="</tr>",2>c&&(b+='<tr><td style="height: 8px" colspan="8"></td></tr>')}return b+="</table></div>"},getMonthHTML:function(a,b){var c=new Date,d=w2utils.settings.fullmonths,e=(w2utils.settings.fulldays,["31","28","31","30","31","30","31","31","30","31","30","31"]),f=c.getFullYear()+"/"+(Number(c.getMonth())+1)+"/"+c.getDate();b=w2utils.isInt(b)?parseInt(b):c.getFullYear(),a=w2utils.isInt(a)?parseInt(a):c.getMonth()+1,a>12&&(a-=12,b++),(1>a||0===a)&&(a+=12,b--),e[1]=b/4==Math.floor(b/4)?"29":"28",this.options.current=a+"/"+b,c=new Date(b,a-1,1);for(var g=c.getDay(),h=w2utils.settings.shortdays,i="",j=0,k=h.length;k>j;j++)i+="<td>"+h[j]+"</td>";for(var l='<div class="w2ui-calendar-title title">    <div class="w2ui-calendar-previous previous"> <div></div> </div>    <div class="w2ui-calendar-next next"> <div></div> </div> '+d[a-1]+", "+b+'</div><table class="w2ui-calendar-days" cellspacing="0">    <tr class="w2ui-day-title">'+i+"</tr>    <tr>",m=1,n=1;43>n;n++){if(0===g&&1==n){for(var o=0;6>o;o++)l+='<td class="w2ui-day-empty">&nbsp;</td>';n+=6}else if(g>n||m>e[a-1]){l+='<td class="w2ui-day-empty">&nbsp;</td>',n%7===0&&(l+="</tr><tr>");continue}var p=b+"/"+a+"/"+m,q="";n%7==6&&(q=" w2ui-saturday"),n%7===0&&(q=" w2ui-sunday"),p==f&&(q+=" w2ui-today");var r=m,s="",t="",u=w2utils.formatDate(p,this.options.format);this.options.colored&&void 0!==this.options.colored[u]&&(tmp=this.options.colored[u].split(":"),t="background-color: "+tmp[0]+";",s="color: "+tmp[1]+";"),l+='<td class="'+(this.inRange(u)?"w2ui-date ":"w2ui-blocked")+q+'" style="'+s+t+'" date="'+u+'">'+r+"</td>",(n%7===0||0===g&&1==n)&&(l+="</tr><tr>"),m++}return l+="</tr></table>"},getYearHTML:function(){var a=w2utils.settings.shortmonths,b="",c="";for(var d in a)b+='<div class="w2ui-jump-month" name="'+d+'">'+a[d]+"</div>";for(var e=1950;2020>=e;e++)c+='<div class="w2ui-jump-year" name="'+e+'">'+e+"</div>";return"<div>"+b+"</div><div>"+c+"</div>"},getHourHTML:function(){for(var a=[],b="h24"==this.options.format?!0:!1,c=0;24>c;c++){var d=(c>=12&&!b?c-12:c)+":00"+(b?"":12>c?" am":" pm");12!=c||b||(d="12:00 pm"),a[Math.floor(c/8)]||(a[Math.floor(c/8)]="");var e=this.fromMin(this.toMin(d)),f=this.fromMin(this.toMin(d)+59);a[Math.floor(c/8)]+='<div class="'+(this.inRange(e)||this.inRange(f)?"w2ui-time ":"w2ui-blocked")+'" hour="'+c+'">'+d+"</div>"}var g='<div class="w2ui-calendar-time"><table><tr>    <td>'+a[0]+"</td>    <td>"+a[1]+"</td>    <td>"+a[2]+"</td></tr></table></div>";return g},getMinHTML:function(a){"undefined"==typeof a&&(a=0);for(var b="h24"==this.options.format?!0:!1,c=[],d=0;60>d;d+=5){var e=(a>12&&!b?a-12:a)+":"+(10>d?0:"")+d+" "+(b?"":12>a?"am":"pm"),f=20>d?0:40>d?1:2;c[f]||(c[f]=""),c[f]+='<div class="'+(this.inRange(e)?"w2ui-time ":"w2ui-blocked")+'" min="'+d+'">'+e+"</div>"}var g='<div class="w2ui-calendar-time"><table><tr>    <td>'+c[0]+"</td>    <td>"+c[1]+"</td>    <td>"+c[2]+"</td></tr></table></div>";return g},toMin:function(a){if("string"!=typeof a)return null;var b=a.split(":");return 2!=b.length?null:(b[0]=parseInt(b[0]),b[1]=parseInt(b[1]),-1!=a.indexOf("pm")&&12!=b[0]&&(b[0]+=12),60*b[0]+b[1])},fromMin:function(a){var b="";a>=1440&&(a%=1440),0>a&&(a=1440+a);var c=Math.floor(a/60),d=(10>a%60?"0":"")+a%60;return b=-1!=this.options.format.indexOf("h24")?c+":"+d:(12>=c?c:c-12)+":"+d+" "+(c>=12?"pm":"am")}},a.extend(b.prototype,w2utils.event),w2obj.field=b}(jQuery),function(){var w2form=function(a){this.name=null,this.header="",this.box=null,this.url="",this.routeData={},this.formURL="",this.formHTML="",this.page=0,this.recid=0,this.fields=[],this.actions={},this.record={},this.original={},this.postData={},this.toolbar={},this.tabs={},this.style="",this.focus=0,this.msgNotJSON=w2utils.lang("Return data is not in JSON format."),this.msgAJAXerror=w2utils.lang("AJAX error. See console for more details."),this.msgRefresh=w2utils.lang("Refreshing..."),this.msgSaving=w2utils.lang("Saving..."),this.onRequest=null,this.onLoad=null,this.onValidate=null,this.onSubmit=null,this.onSave=null,this.onChange=null,this.onRender=null,this.onRefresh=null,this.onResize=null,this.onDestroy=null,this.onAction=null,this.onToolbar=null,this.onError=null,this.isGenerated=!1,this.last={xhr:null},$.extend(!0,this,w2obj.form,a)};$.fn.w2form=function(a){if("object"==typeof a||!a){var b=this;if(!w2utils.checkName(a,"w2form"))return;var c=a.record,d=a.original,e=a.fields,f=a.toolbar,g=a.tabs,h=new w2form(a);if($.extend(h,{record:{},original:{},fields:[],tabs:{},toolbar:{},handlers:[]}),$.isArray(g)){$.extend(!0,h.tabs,{tabs:[]});for(var i in g){var j=g[i];h.tabs.tabs.push("object"==typeof j?j:{id:j,caption:j})}}else $.extend(!0,h.tabs,g);$.extend(!0,h.toolbar,f);for(var k in e){var l=$.extend(!0,{},e[k]);"undefined"==typeof l.name&&"undefined"!=typeof l.field&&(l.name=l.field),"undefined"==typeof l.field&&"undefined"!=typeof l.name&&(l.field=l.name),h.fields[k]=l}for(var k in c)h.record[k]=$.isPlainObject(c[k])?$.extend(!0,{},c[k]):c[k];for(var k in d)h.original[k]=$.isPlainObject(d[k])?$.extend(!0,{},d[k]):d[k];return b.length>0&&(h.box=b[0]),""!=h.formURL?$.get(h.formURL,function(a){h.formHTML=a,h.isGenerated=!0,(0!=$(h.box).length||0!=a.length)&&($(h.box).html(a),h.render(h.box))}):""!=h.formHTML||(h.formHTML=0!=$(this).length&&""!=$.trim($(this).html())?$(this).html():h.generateHTML()),w2ui[h.name]=h,""==h.formURL&&(-1==String(h.formHTML).indexOf("w2ui-page")&&(h.formHTML='<div class="w2ui-page page-0">'+h.formHTML+"</div>"),$(h.box).html(h.formHTML),h.isGenerated=!0,h.render(h.box)),h}if(w2ui[$(this).attr("name")]){var b=w2ui[$(this).attr("name")];return b[a].apply(b,Array.prototype.slice.call(arguments,1)),this}console.log("ERROR: Method "+a+" does not exist on jQuery.w2form")},w2form.prototype={get:function(a,b){if(0===arguments.length){var c=[];for(var d in this.fields)null!=this.fields[d].name&&c.push(this.fields[d].name);return c}for(var e in this.fields)if(this.fields[e].name==a)return b===!0?e:this.fields[e];return null},set:function(a,b){for(var c in this.fields)if(this.fields[c].name==a)return $.extend(this.fields[c],b),this.refresh(),!0;return!1},reload:function(a){var b="object"!=typeof this.url?this.url:this.url.get;b&&0!=this.recid?this.request(a):"function"==typeof a&&a()},clear:function(){this.recid=0,this.record={},$().w2tag(),this.refresh()},error:function(a){var b=this.trigger({target:this.name,type:"error",message:a,xhr:this.last.xhr});return b.isCancelled===!0?void("function"==typeof callBack&&callBack()):(setTimeout(function(){w2alert(a,"Error")},1),void this.trigger($.extend(b,{phase:"after"})))},validate:function(a){"undefined"==typeof a&&(a=!0),$().w2tag();var b=[];for(var c in this.fields){var d=this.fields[c];switch(null==this.record[d.name]&&(this.record[d.name]=""),d.type){case"int":this.record[d.name]&&!w2utils.isInt(this.record[d.name])&&b.push({field:d,error:w2utils.lang("Not an integer")});break;case"float":this.record[d.name]&&!w2utils.isFloat(this.record[d.name])&&b.push({field:d,error:w2utils.lang("Not a float")});break;case"money":this.record[d.name]&&!w2utils.isMoney(this.record[d.name])&&b.push({field:d,error:w2utils.lang("Not in money format")});break;case"color":case"hex":this.record[d.name]&&!w2utils.isHex(this.record[d.name])&&b.push({field:d,error:w2utils.lang("Not a hex number")});break;case"email":this.record[d.name]&&!w2utils.isEmail(this.record[d.name])&&b.push({field:d,error:w2utils.lang("Not a valid email")});break;case"checkbox":this.record[d.name]=1==this.record[d.name]?1:0;break;case"date":d.options.format||(d.options.format=w2utils.settings.date_format),this.record[d.name]&&!w2utils.isDate(this.record[d.name],d.options.format)&&b.push({field:d,error:w2utils.lang("Not a valid date")+": "+d.options.format});break;case"list":case"combo":break;case"enum":}var e=this.record[d.name];d.required&&(""===e||$.isArray(e)&&0==e.length||$.isPlainObject(e)&&$.isEmptyObject(e))&&b.push({field:d,error:w2utils.lang("Required field")}),d.equalto&&this.record[d.name]!=this.record[d.equalto]&&b.push({field:d,error:w2utils.lang("Field should be equal to ")+d.equalto})}var f=this.trigger({phase:"before",target:this.name,type:"validate",errors:b});if(f.isCancelled!==!0){if(a)for(var g in f.errors){var h=f.errors[g];"radio"==h.field.type?$($(h.field.el).parents("div")[0]).w2tag(h.error,{"class":"w2ui-error"}):-1!=["enum","file"].indexOf(h.field.type)?!function(a){setTimeout(function(){var b=$(a.field.el).data("w2field").helpers.multi;$(a.field.el).w2tag(a.error),$(b).addClass("w2ui-error")},1)}(h):$(h.field.el).w2tag(h.error,{"class":"w2ui-error"}),this.goto(b[0].field.page)}return this.trigger($.extend(f,{phase:"after"})),b}},getChanges:function(){var a=function(b,c,d){for(var e in b)"object"==typeof b[e]?(d[e]=a(b[e],c[e]||{},{}),(!d[e]||$.isEmptyObject(d[e]))&&delete d[e]):b[e]!=c[e]&&(d[e]=b[e]);return d};return a(this.record,this.original,{})},request:function(postData,callBack){var obj=this;if("function"==typeof postData&&(callBack=postData,postData=null),("undefined"==typeof postData||null==postData)&&(postData={}),this.url&&("object"!=typeof this.url||this.url.get)){(null==this.recid||"undefined"==typeof this.recid)&&(this.recid=0);var params={};params.cmd="get-record",params.recid=this.recid,$.extend(params,this.postData),$.extend(params,postData);var eventData=this.trigger({phase:"before",type:"request",target:this.name,url:this.url,postData:params});if(eventData.isCancelled===!0)return void("function"==typeof callBack&&callBack({status:"error",message:"Request aborted."}));this.record={},this.original={},this.lock(this.msgRefresh);var url=eventData.url;if("object"==typeof eventData.url&&eventData.url.get&&(url=eventData.url.get),this.last.xhr)try{this.last.xhr.abort()}catch(e){}if(!$.isEmptyObject(obj.routeData)){var info=w2utils.parseRoute(url);if(info.keys.length>0)for(var k=0;k<info.keys.length;k++)null!=obj.routeData[info.keys[k].name]&&(url=url.replace(new RegExp(":"+info.keys[k].name,"g"),obj.routeData[info.keys[k].name]))}var ajaxOptions={type:"POST",url:url,data:eventData.postData,dataType:"text"};"HTTP"==w2utils.settings.dataType&&(ajaxOptions.data=String($.param(ajaxOptions.data,!1)).replace(/%5B/g,"[").replace(/%5D/g,"]")),"RESTFULL"==w2utils.settings.dataType&&(ajaxOptions.type="GET",ajaxOptions.data=String($.param(ajaxOptions.data,!1)).replace(/%5B/g,"[").replace(/%5D/g,"]")),"JSON"==w2utils.settings.dataType&&(ajaxOptions.type="POST",ajaxOptions.data=JSON.stringify(ajaxOptions.data),ajaxOptions.contentType="application/json"),this.last.xhr=$.ajax(ajaxOptions).done(function(data,status,xhr){obj.unlock();var eventData=obj.trigger({phase:"before",target:obj.name,type:"load",xhr:xhr});if(eventData.isCancelled===!0)return void("function"==typeof callBack&&callBack({status:"error",message:"Request aborted."}));var data,responseText=obj.last.xhr.responseText;if("error"!=status){if("undefined"!=typeof responseText&&""!=responseText){if("object"==typeof responseText)data=responseText;else try{eval("data = "+responseText)}catch(e){}"undefined"==typeof data&&(data={status:"error",message:obj.msgNotJSON,responseText:responseText}),"error"==data.status?obj.error(data.message):(obj.record=$.extend({},data.record),obj.original=$.extend({},data.record))}}else obj.error("AJAX Error "+xhr.status+": "+xhr.statusText),data={status:"error",message:obj.msgAJAXerror,responseText:responseText};obj.trigger($.extend(eventData,{phase:"after"})),obj.refresh(),"function"==typeof callBack&&callBack(data)}).fail(function(a,b,c){var d={status:b,error:c,rawResponseText:a.responseText},e=obj.trigger({phase:"before",type:"error",error:d,xhr:a});if(e.isCancelled!==!0){if("abort"!=b){var f;try{f=$.parseJSON(a.responseText)}catch(g){}console.log("ERROR: Server communication failed.","\n   EXPECTED:",{status:"success",items:[{id:1,text:"item"}]},"\n         OR:",{status:"error",message:"error message"},"\n   RECEIVED:","object"==typeof f?f:a.responseText)}obj.trigger($.extend(e,{phase:"after"}))}}),this.trigger($.extend(eventData,{phase:"after"}))}},submit:function(a,b){return this.save(a,b)},save:function(postData,callBack){var obj=this;$(this.box).find(":focus").change(),"function"==typeof postData&&(callBack=postData,postData=null);var errors=obj.validate(!0);if(0===errors.length){if(("undefined"==typeof postData||null==postData)&&(postData={}),!obj.url||"object"==typeof obj.url&&!obj.url.save)return void console.log("ERROR: Form cannot be saved because no url is defined.");obj.lock(obj.msgSaving+' <span id="'+obj.name+'_progress"></span>'),setTimeout(function(){var params={};params.cmd="save-record",params.recid=obj.recid,$.extend(params,obj.postData),$.extend(params,postData),params.record=$.extend(!0,{},obj.record);var eventData=obj.trigger({phase:"before",type:"submit",target:obj.name,url:obj.url,postData:params});if(eventData.isCancelled!==!0){var url=eventData.url;if("object"==typeof eventData.url&&eventData.url.save&&(url=eventData.url.save),obj.last.xhr)try{obj.last.xhr.abort()}catch(e){}if(!$.isEmptyObject(obj.routeData)){var info=w2utils.parseRoute(url);if(info.keys.length>0)for(var k=0;k<info.keys.length;k++)null!=obj.routeData[info.keys[k].name]&&(url=url.replace(new RegExp(":"+info.keys[k].name,"g"),obj.routeData[info.keys[k].name]))}var ajaxOptions={type:"POST",url:url,data:eventData.postData,dataType:"text",xhr:function(){var a=new window.XMLHttpRequest;return a.upload.addEventListener("progress",function(a){if(a.lengthComputable){var b=Math.round(a.loaded/a.total*100);$("#"+obj.name+"_progress").text(""+b+"%")}},!1),a}};"HTTP"==w2utils.settings.dataType&&(ajaxOptions.data=String($.param(ajaxOptions.data,!1)).replace(/%5B/g,"[").replace(/%5D/g,"]")),"RESTFULL"==w2utils.settings.dataType&&(0!=obj.recid&&(ajaxOptions.type="PUT"),ajaxOptions.data=String($.param(ajaxOptions.data,!1)).replace(/%5B/g,"[").replace(/%5D/g,"]")),"JSON"==w2utils.settings.dataType&&(ajaxOptions.type="POST",ajaxOptions.data=JSON.stringify(ajaxOptions.data),ajaxOptions.contentType="application/json"),obj.last.xhr=$.ajax(ajaxOptions).done(function(data,status,xhr){obj.unlock();var eventData=obj.trigger({phase:"before",target:obj.name,type:"save",xhr:xhr,status:status});if(eventData.isCancelled!==!0){var data,responseText=xhr.responseText;if("error"!=status){if("undefined"!=typeof responseText&&""!=responseText){if("object"==typeof responseText)data=responseText;else try{eval("data = "+responseText)}catch(e){}"undefined"==typeof data&&(data={status:"error",message:obj.msgNotJSON,responseText:responseText}),"error"==data.status?obj.error(data.message):obj.original=$.extend({},obj.record)}}else obj.error("AJAX Error "+xhr.status+": "+xhr.statusText),data={status:"error",message:obj.msgAJAXerror,responseText:responseText};obj.trigger($.extend(eventData,{phase:"after"})),obj.refresh(),"success"==data.status&&"function"==typeof callBack&&callBack(data)}}).fail(function(a,b,c){var d={status:b,error:c,rawResponseText:a.responseText},e=obj.trigger({phase:"before",type:"error",error:d,xhr:a});e.isCancelled!==!0&&(console.log("ERROR: server communication failed. The server should return",{status:"success"},"OR",{status:"error",message:"error message"},", instead the AJAX request produced this: ",d),obj.trigger($.extend(e,{phase:"after"})))}),obj.trigger($.extend(eventData,{phase:"after"}))}},50)}},lock:function(){var a=$(this.box).find("> div:first-child"),b=Array.prototype.slice.call(arguments,0);b.unshift(a),w2utils.lock.apply(window,b)},unlock:function(){var a=this;setTimeout(function(){w2utils.unlock(a.box)},25)},"goto":function(a){"undefined"!=typeof a&&(this.page=a),$(this.box).data("auto-size")===!0&&$(this.box).height(0),this.refresh()},generateHTML:function(){var a,b=[],c="";for(var d in this.fields){var e="",f=this.fields[d];"undefined"==typeof f.html&&(f.html={}),f.html=$.extend(!0,{caption:"",span:6,attr:"",text:"",page:0},f.html),"undefined"==typeof a&&(a=f.html.page),""==f.html.caption&&(f.html.caption=f.name);var g='<input name="'+f.name+'" type="text" '+f.html.attr+"/>";("pass"===f.type||"password"===f.type)&&(g='<input name="'+f.name+'" type = "password" '+f.html.attr+"/>"),"checkbox"==f.type&&(g='<input name="'+f.name+'" type="checkbox" '+f.html.attr+"/>"),"textarea"==f.type&&(g='<textarea name="'+f.name+'" '+f.html.attr+"></textarea>"),"toggle"==f.type&&(g='<input name="'+f.name+'" type="checkbox" '+f.html.attr+' class="w2ui-toggle"/><div><div></div></div>'),f.html.group&&(""!=c&&(e+="\n   </div>"),e+='\n   <div class="w2ui-group-title">'+f.html.group+'</div>\n   <div class="w2ui-group">',c=f.html.group),f.html.page!=a&&""!=c&&(b[b.length-1]+="\n   </div>",c=""),e+='\n      <div class="w2ui-field '+("undefined"!=typeof f.html.span?"w2ui-span"+f.html.span:"")+'">\n         <label>'+w2utils.lang(f.html.caption)+"</label>\n         <div>"+g+w2utils.lang(f.html.text)+"</div>\n      </div>","undefined"==typeof b[f.html.page]&&(b[f.html.page]=""),b[f.html.page]+=e,a=f.html.page
	}if(""!=c&&(b[b.length-1]+="\n   </div>"),this.tabs.tabs)for(var h=0;h<this.tabs.tabs.length;h++)"undefined"==typeof b[h]&&(b[h]="");for(var i in b)b[i]='<div class="w2ui-page page-'+i+'">'+b[i]+"\n</div>";var j="";if(!$.isEmptyObject(this.actions)){var k="";j+='\n<div class="w2ui-buttons">';for(var l in this.actions)k=-1!=["save","update","create"].indexOf(l.toLowerCase())?"btn-green":"",j+='\n    <button name="'+l+'" class="btn '+k+'">'+w2utils.lang(l)+"</button>";j+="\n</div>"}return b.join("")+j},action:function(a,b){var c=this.trigger({phase:"before",target:a,type:"action",originalEvent:b});c.isCancelled!==!0&&("function"==typeof this.actions[a]&&this.actions[a].call(this,b),this.trigger($.extend(c,{phase:"after"})))},resize:function(){function a(){d.width($(b.box).width()).height($(b.box).height()),f.css("top",""!=b.header?w2utils.getSize(e,"height"):0),g.css("top",(""!=b.header?w2utils.getSize(e,"height"):0)+("object"==typeof b.toolbar&&$.isArray(b.toolbar.items)&&b.toolbar.items.length>0?w2utils.getSize(f,"height"):0)),h.css("top",(""!=b.header?w2utils.getSize(e,"height"):0)+("object"==typeof b.toolbar&&$.isArray(b.toolbar.items)&&b.toolbar.items.length>0?w2utils.getSize(f,"height")+5:0)+("object"==typeof b.tabs&&$.isArray(b.tabs.tabs)&&b.tabs.tabs.length>0?w2utils.getSize(g,"height")+5:0)),h.css("bottom",k.length>0?w2utils.getSize(k,"height"):0)}var b=this,c=this.trigger({phase:"before",target:this.name,type:"resize"});if(c.isCancelled!==!0){var d=$(this.box).find("> div"),e=$(this.box).find("> div .w2ui-form-header"),f=$(this.box).find("> div .w2ui-form-toolbar"),g=$(this.box).find("> div .w2ui-form-tabs"),h=$(this.box).find("> div .w2ui-page"),i=$(this.box).find("> div .w2ui-page.page-"+this.page),j=$(this.box).find("> div .w2ui-page.page-"+this.page+" > div"),k=$(this.box).find("> div .w2ui-buttons");a(),(0==parseInt($(this.box).height())||$(this.box).data("auto-size")===!0)&&($(this.box).height((e.length>0?w2utils.getSize(e,"height"):0)+("object"==typeof this.tabs&&$.isArray(this.tabs.tabs)&&this.tabs.tabs.length>0?w2utils.getSize(g,"height"):0)+("object"==typeof this.toolbar&&$.isArray(this.toolbar.items)&&this.toolbar.items.length>0?w2utils.getSize(f,"height"):0)+(h.length>0?w2utils.getSize(j,"height")+w2utils.getSize(i,"+height")+12:0)+(k.length>0?w2utils.getSize(k,"height"):0)),$(this.box).data("auto-size",!0)),a(),b.trigger($.extend(c,{phase:"after"}))}},refresh:function(){var a=(new Date).getTime(),b=this;if(this.box&&this.isGenerated&&"undefined"!=typeof $(this.box).html()){$(this.box).find("input, textarea, select").each(function(a,c){var d=$(c).attr("undefined"!=typeof $(c).attr("name")?"name":"id"),e=b.get(d);if(e){var f=$(c).parents(".w2ui-page");if(f.length>0)for(var g=0;100>g;g++)if(f.hasClass("page-"+g)){e.page=g;break}}});var c=this.trigger({phase:"before",target:this.name,type:"refresh",page:this.page});if(c.isCancelled!==!0){$(this.box).find(".w2ui-page").hide(),$(this.box).find(".w2ui-page.page-"+this.page).show(),$(this.box).find(".w2ui-form-header").html(this.header),"object"==typeof this.tabs&&$.isArray(this.tabs.tabs)&&this.tabs.tabs.length>0?($("#form_"+this.name+"_tabs").show(),this.tabs.active=this.tabs.tabs[this.page].id,this.tabs.refresh()):$("#form_"+this.name+"_tabs").hide(),"object"==typeof this.toolbar&&$.isArray(this.toolbar.items)&&this.toolbar.items.length>0?($("#form_"+this.name+"_toolbar").show(),this.toolbar.refresh()):$("#form_"+this.name+"_toolbar").hide();for(var d in this.fields){var e=this.fields[d];"undefined"==typeof e.name&&"undefined"!=typeof e.field&&(e.name=e.field),"undefined"==typeof e.field&&"undefined"!=typeof e.name&&(e.field=e.name),e.$el=$(this.box).find('[name="'+String(e.name).replace(/\\/g,"\\\\")+'"]'),e.el=e.$el[0],"undefined"==typeof e.el&&console.log('ERROR: Cannot associate field "'+e.name+'" with html control. Make sure html control exists with the same name.'),e.el&&(e.el.id=e.name);var f=$(e).data("w2field");f&&f.clear(),$(e.$el).off("change").on("change",function(){var a=this.value,c=b.record[this.name]?b.record[this.name]:"",d=b.get(this.name);if(-1!=["list","enum","file"].indexOf(d.type)&&$(this).data("selected")){var e=$(this).data("selected"),f=b.record[this.name];if($.isArray(e)){a=[];for(var g in e)a[g]=$.extend(!0,{},e[g])}if($.isPlainObject(e)&&(a=$.extend(!0,{},e)),$.isArray(f)){c=[];for(var g in f)c[g]=$.extend(!0,{},f[g])}$.isPlainObject(f)&&(c=$.extend(!0,{},f))}if(-1!=["toggle","checkbox"].indexOf(d.type)&&(a=$(this).prop("checked")?!0:!1),-1!=["int","float","percent","money","currency"].indexOf(d.type)&&(a=$(this).data("w2field").clean(a)),a!==c){var h=b.trigger({phase:"before",target:this.name,type:"change",value_new:a,value_previous:c});if(h.isCancelled===!0)return void $(this).val(b.record[this.name]);var i=this.value;if("select"==this.type&&(i=this.value),"checkbox"==this.type&&(i=this.checked?!0:!1),"radio"==this.type&&d.$el.each(function(a,b){b.checked&&(i=b.value)}),-1!=["int","float","percent","money","currency","list","combo","enum","file","toggle"].indexOf(d.type)&&(i=a),-1!=["enum","file"].indexOf(d.type)&&i.length>0){var j=$(d.el).data("w2field").helpers.multi;$(j).removeClass("w2ui-error")}b.record[this.name]=i,b.trigger($.extend(h,{phase:"after"}))}}),e.required?$(e.el).parent().parent().addClass("w2ui-required"):$(e.el).parent().parent().removeClass("w2ui-required")}$(this.box).find("button, input[type=button]").each(function(a,c){$(c).off("click").on("click",function(a){var c=this.value;this.id&&(c=this.id),this.name&&(c=this.name),b.action(c,a)})});for(var d in this.fields){var e=this.fields[d],g="undefined"!=typeof this.record[e.name]?this.record[e.name]:"";if(e.el)switch(e.type=String(e.type).toLowerCase(),e.options||(e.options={}),e.type){case"text":case"textarea":case"email":case"pass":case"password":e.el.value=g;break;case"int":case"float":case"money":case"currency":case"percent":case"hex":case"alphanumeric":case"color":case"date":case"time":e.el.value=g,$(e.el).w2field($.extend({},e.options,{type:e.type}));break;case"toggle":w2utils.isFloat(g)&&(g=parseFloat(g)),$(e.el).prop("checked",g?!0:!1),this.record[e.name]=g?1:0;break;case"list":case"combo":if("list"==e.type){var h=$.isPlainObject(g)?g.id:g,i=e.options.items;$.isArray(i)&&i.length>0&&!$.isPlainObject(i[0])&&(e.options.items=w2obj.field.prototype.normMenu(i));for(var j in e.options.items){var k=e.options.items[j];if(k.id==h){g=$.extend(!0,{},k),b.record[e.name]=g;break}}}else e.el.value="combo"!=e.type||$.isPlainObject(g)?$.isPlainObject(g)&&"undefined"!=typeof g.text?g.text:"":g;$.isPlainObject(g)||(g={}),$(e.el).w2field($.extend({},e.options,{type:e.type,selected:g}));break;case"enum":case"file":$.isArray(g)||(g=[]),$(e.el).w2field($.extend({},e.options,{type:e.type,selected:g}));break;case"select":var i=e.options.items;if("undefined"!=typeof i&&i.length>0){i=w2obj.field.prototype.normMenu(i),$(e.el).html("");for(var l in i)$(e.el).append('<option value="'+i[l].id+'">'+i[l].text+"</option")}$(e.el).val(g);break;case"radio":$(e.$el).prop("checked",!1).each(function(a,b){$(b).val()==g&&$(b).prop("checked",!0)});break;case"checkbox":$(e.el).prop("checked",g?!0:!1);break;default:$(e.el).w2field($.extend({},e.options,{type:e.type}))}}for(var f=$(this.box).find(".w2ui-page"),j=0;j<f.length;j++)$(f[j]).find("> *").length>1&&$(f[j]).wrapInner("<div></div>");return this.trigger($.extend(c,{phase:"after"})),this.resize(),(new Date).getTime()-a}}},render:function(a){function b(){var a=$(d.box).find("input, select, textarea");a.length>d.focus&&a[d.focus].focus()}var c=(new Date).getTime(),d=this;if("object"==typeof a&&($(this.box).find("#form_"+this.name+"_tabs").length>0&&$(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-form").html(""),this.box=a),this.isGenerated&&this.box){var e=this.trigger({phase:"before",target:this.name,type:"render",box:"undefined"!=typeof a?a:this.box});if(e.isCancelled!==!0){$.isEmptyObject(this.original)&&!$.isEmptyObject(this.record)&&(this.original=$.extend(!0,{},this.record));var f="<div>"+(""!=this.header?'<div class="w2ui-form-header">'+this.header+"</div>":"")+'    <div id="form_'+this.name+'_toolbar" class="w2ui-form-toolbar"></div>    <div id="form_'+this.name+'_tabs" class="w2ui-form-tabs"></div>'+this.formHTML+"</div>";$(this.box).attr("name",this.name).addClass("w2ui-reset w2ui-form").html(f),$(this.box).length>0&&($(this.box)[0].style.cssText+=this.style),"function"!=typeof this.toolbar.render&&(this.toolbar=$().w2toolbar($.extend({},this.toolbar,{name:this.name+"_toolbar",owner:this})),this.toolbar.on("click",function(a){var b=d.trigger({phase:"before",type:"toolbar",target:a.target,originalEvent:a});b.isCancelled!==!0&&d.trigger($.extend(b,{phase:"after"}))})),"object"==typeof this.toolbar&&"function"==typeof this.toolbar.render&&this.toolbar.render($("#form_"+this.name+"_toolbar")[0]),"function"!=typeof this.tabs.render&&(this.tabs=$().w2tabs($.extend({},this.tabs,{name:this.name+"_tabs",owner:this})),this.tabs.on("click",function(a){d.goto(this.get(a.target,!0))})),"object"==typeof this.tabs&&"function"==typeof this.tabs.render&&this.tabs.render($("#form_"+this.name+"_tabs")[0]),this.trigger($.extend(e,{phase:"after"})),this.resize();var g="object"!=typeof this.url?this.url:this.url.get;return g&&0!=this.recid?this.request():this.refresh(),0==$(".w2ui-layout").length&&(this.tmp_resize=function(){w2ui[d.name].resize()},$(window).off("resize","body").on("resize","body",this.tmp_resize)),setTimeout(function(){d.resize(),d.refresh()},150),this.focus>=0&&setTimeout(b,500),(new Date).getTime()-c}}},destroy:function(){var a=this.trigger({phase:"before",target:this.name,type:"destroy"});a.isCancelled!==!0&&("object"==typeof this.toolbar&&this.toolbar.destroy&&this.toolbar.destroy(),"object"==typeof this.tabs&&this.tabs.destroy&&this.tabs.destroy(),$(this.box).find("#form_"+this.name+"_tabs").length>0&&$(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-form").html(""),delete w2ui[this.name],this.trigger($.extend(a,{phase:"after"})),$(window).off("resize","body"))}},$.extend(w2form.prototype,w2utils.event),w2obj.form=w2form}();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(2)))

/***/ },

/***/ 117:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, _) {module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '', __j = Array.prototype.join;
	function print() { __p += __j.call(arguments, '') }
	with (obj) {
	__p += '<thead>\r\n    <th style="width:200px;">#</th>\r\n';

	$.each(item[0].date , function (key, value){
	;
	__p += '\r\n    <th>' +
	((__t = ( value )) == null ? '' : __t) +
	'</th>\r\n';

	})
	;
	__p += '\r\n</thead>\r\n<tbody>\r\n';


	var totalArray = []
	$.each(item , function (key, value){
	;
	__p += '\r\n<tr>\r\n    <td><span class="textOverflow" style="width:200px" title="' +
	((__t = ( value.name )) == null ? '' : __t) +
	'">' +
	((__t = ( value.name )) == null ? '' : __t) +
	'</span></td>\r\n    ';

	    var dataIndex = 0;
	    $.each(value.data , function (totalKey, total){

	    ;
	__p += '\r\n    <td>\r\n        ' +
	((__t = ( total )) == null ? '' : __t) +
	'\r\n    </td>\r\n    ';

	        if(_.isNumber(totalArray[dataIndex])) {
	            totalArray[dataIndex] +=total;
	        }else {
	            totalArray[dataIndex] = total;
	        }
	        dataIndex ++ ;
	    });
	    ;
	__p += '\r\n</tr>\r\n';

	});
	;
	__p += '\r\n\r\n<tr>\r\n<td>\r\n总计\r\n</td>\r\n';

	$.each(totalArray , function (key, value){
	;
	__p += '\r\n<td>' +
	((__t = (value)) == null ? '' : __t) +
	'</td>\r\n';

	})
	;
	__p += '\r\n</tr>\r\n</tbody>\r\n';

	}
	return __p
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(1)))

/***/ },

/***/ 118:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" id="' +
	((__t = (it.id || '' )) == null ? '' : __t) +
	'">\r\n  <div class="modal-backdrop fade"></div>\r\n  <div class="modal-dialog">\r\n    <div class="modal-content">\r\n\r\n      <div class="modal-header">\r\n        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" data-event-click="close">×</span><span class="sr-only">Close</span></button>\r\n        <h4 class="modal-title">' +
	((__t = (it.header)) == null ? '' : __t) +
	'</h4>\r\n      </div>\r\n      <div class="modal-body">\r\n        ' +
	((__t = (it.body)) == null ? '' : __t) +
	'\r\n      </div>\r\n      <div class="modal-footer">\r\n        <button type="button" class="btn btn-default" data-event-click="close">Close</button>\r\n      </div>\r\n\r\n    </div>\r\n  </div>\r\n</div>';

	}
	return __p
	}

/***/ },

/***/ 119:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(120);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(121)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./w2ui-1.4.3.min.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./w2ui-1.4.3.min.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 120:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(122)();
	// imports


	// module
	exports.push([module.id, "@font-face{font-family:w2ui-font;src:url(\"data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAAWIAAoAAAAACAgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABPUy8yAAAA9AAAAEMAAABWQLxMsmNtYXAAAAE4AAAAOgAAAUriGRC2Z2x5ZgAAAXQAAAH9AAACgLu4vTRoZWFkAAADdAAAADAAAAA2AOYXBGhoZWEAAAOkAAAAIAAAACQD8wHHaG10eAAAA8QAAAAWAAAAIA7dAABsb2NhAAAD3AAAABIAAAASAngBuG1heHAAAAPwAAAAHwAAACABFQA2bmFtZQAABBAAAAEtAAACIsTQ/zJwb3N0AAAFQAAAAEgAAABi4/7ZEHicY2BkvMM4gYGVgYPRhTGNgYHBHUp/ZZBkaGFgYGJgZWbACgLSXFMYHD4yfmRnPPD/AIMe4wEGR6AwI0gOANHZC/IAeJxjYGBgZoBgGQZGBhBwAfIYwXwWBg0gzQakGRmYGBg+sv//D1LwkRFE8zNA1QMBIxvDiAcAddwGvgAAeJxFkLFv01AQxu97LrHdRImjpnaS1gnEia3IoqAktkkiEhaEOiCsDkEo8dyBDkytKpYKVWwssKKKAYmBREKMLJSFoRJ/AGJhY0NZGFgSzrUinvR+d++7T+/ePQLRci4IJ3SFCLIjG8CH+ZPwHHdwkkSS2PMXP3DGmUxpoo123lrt5nj8fjyejsc4W0zwNtl8FfHCKV5QnaOhF3IJUrUbkGPYnSGcGH6risBvGQhdVY0iVXXVkhJN1JL6/6xOIqWk4tRlJiVFiSJFSUrsZ+tkoqpEgt/6Hb/wjtZog2gonBx24AyFJUuNwMvha+/CvLi3vq1f785GsxGuTqfWc5O1N/r2+lNrOl38ZHnWpdUMr/CaLKLGZiHl4hI1+zasGB2/Dy9GSzfRbul4qaWPtHSQ0Y7SWpxmgnSc/mblMKNpmcOVEhfj+5d/8BGfqMl9bKuWFYWKaLf8YIAq9IKc5TY7ojNgTTcC7iEjaN4yPdswbM+81t8UimRLojq66YbdWq0bus375t21bwgcw/H6nmNUyhIkR/DsTasXPgx7VtV8oDx6XIxHE8vl8rMAzqlEDZ7QseUBPP6tLOQKDH5HqooKfLvB2gABa1lgflzI60VxsLd3IJj1YRn5/Wx9Syy++LvArn/JzH4e5WE98TCLer5wnBNb9WcrB5PoH084dg8AAAB4nGNgZGBgAOKMsPib8fw2Xxm4mRhA4PzjbBcY/f////1MjIwHgFwOBrA0AFcuDPF4nGNgZGBgPPD/AIMeEwMDw/9/TEwMQBEUwAEAe34EvHicY2JgYGCCYsbJCJpxO4QNABdTAesAAAAAAAAAEgAsAGgAjgC+AP4BQAAAeJxjYGRgYOBg0GJgZgABJiDmAkIGhv9gPgMADYEBTAB4nG2PTW7CMBCFXyBQFaQKtVKl7qwuuqkIPwsWHAD2LNiH4ARQEkeOQeICPUHP0DP0BF32DD1KX8IoixZbHn/z5o1/AAzwBQ/V8HBbx2q0cMPswm3SQNgnPwl30MezcJf6ULiHV8yE+3hAyBM8vzrtHk64hTu8Cbepvwv75A/hDh7xKdyl/i3cwxo/wn28eLN9ZPJhbHK30skxDW2TN7DWttybXE2CcaMtda5t6PRWbc6qPCVT52IVW5OpBas6TY0qrDnoyAU754r5aBSLHkQmwx4RDHL+Oq53hxU0EhyR8sf2Sv2/smaHRclKlStMEGB8xbekL6+9ITONLb0bnBlLnHjnlKqjW3FZ9mSkhfRqviclKxR17UAloh5gV3cVmGPEGf/xB/Ursl9uDmByAAAAeJxtwUEOgCAMBMAu0sI3SdMEIwKh8n8PXp2hQB+mf5kIAQciGIKEzFpNr6Sj7bs76xruMq3r2eJs22XZtPKIW1laiV6rCBDA\") format(\"woff\");font-weight:400;font-style:normal}[class^=w2ui-icon-]:before,[class*=\" w2ui-icon-\"]:before{font-family:w2ui-font;display:inline-block;vertical-align:middle;line-height:1;font-weight:400;font-style:normal;speak:none;text-decoration:inherit;text-transform:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.w2ui-icon-check:before{content:\"\\F101\"}.w2ui-icon-columns:before{content:\"\\F102\"}.w2ui-icon-cross:before{content:\"\\F103\"}.w2ui-icon-pencil:before{content:\"\\F104\"}.w2ui-icon-plus:before{content:\"\\F105\"}.w2ui-icon-reload:before{content:\"\\F106\"}.w2ui-icon-search:before{content:\"\\F107\"}.w2ui-reset{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box;font-family:Verdana,Arial,sans-serif;font-size:11px}.w2ui-reset *{color:default;line-height:100%;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0}.w2ui-reset table{font-family:Verdana,Arial,sans-serif;font-size:11px;max-width:none;background-color:transparent;border-collapse:separate;border-spacing:0}.w2ui-reset input,.w2ui-reset textarea{width:auto;height:auto;vertical-align:baseline;padding:4px}.w2ui-reset select{padding:1px;height:23px}.w2ui-centered{position:absolute;left:0;right:0;top:50%;-webkit-transform:translateY(-50%);-moz-transform:translateY(-50%);-ms-transform:translateY(-50%);-o-transform:translateY(-50%);transform:translateY(-50%);max-height:100%;margin:0;padding:0 10px;text-align:center}.w2ui-disabled,.w2ui-readonly{background-color:#f1f1f1!important;color:#777!important}input:not([type=button]),select,textarea{padding:4px;border:1px solid #bbb;border-radius:3px;color:#000;background-color:#fff;line-height:normal}input:not([type=button]):focus,select:focus,textarea:focus{outline-color:#72b2ff}input:not([type=button]):disabled,select:disabled,textarea:disabled,input:not([type=button])[readonly],select[readonly],textarea[readonly]{background-color:#f1f1f1;color:#777}input::-ms-clear{display:none}input:-ms-input-placeholder{color:#aaa!important}select{padding:2px}input[type=checkbox].w2ui-toggle{position:absolute;opacity:0;width:46px;height:22px;padding:0;margin:0;margin-left:2px}input[type=checkbox].w2ui-toggle+div{display:inline-block;width:46px;height:22px;border:1px solid #bbb;border-radius:30px;background-color:#eee;-webkit-transition-duration:.3s;-webkit-transition-property:background-color,box-shadow;-moz-transition-duration:.3s;-moz-transition-property:background-color,box-shadow;box-shadow:inset 0 0 0 0 rgba(0,0,0,.4);margin-left:2px}input[type=checkbox].w2ui-toggle:disabled+div{opacity:.3}input[type=checkbox].w2ui-toggle+div>div{float:left;width:22px;height:22px;border-radius:inherit;background:#f5f5f5;-webkit-transition-duration:.3s;-webkit-transition-property:transform,background-color,box-shadow;-moz-transition-duration:.3s;-moz-transition-property:transform,background-color;box-shadow:0 0 1px #323232,0 0 0 1px rgba(200,200,200,.6);pointer-events:none;margin-top:-1px;margin-left:-1px}input[type=checkbox].w2ui-toggle:checked+div{border:1px solid #00a23f;box-shadow:inset 0 0 0 12px #54B350}input[type=checkbox].w2ui-toggle:checked+div>div{-webkit-transform:translate3d(24px,0,0);-moz-transform:translate3d(24px,0,0);background-color:#fff;box-shadow:0 2px 5px rgba(0,0,0,.3),0 0 0 1px #00a23f}input[type=checkbox].w2ui-toggle.blue:checked+div{border:1px solid #206FAD;box-shadow:inset 0 0 0 12px #35A6EB}input[type=checkbox].w2ui-toggle.blue:checked+div>div{box-shadow:0 2px 5px rgba(0,0,0,.3),0 0 0 1px #206fad}input[type=checkbox].w2ui-toggle:focus{outline:0}.w2ui-overlay{position:absolute;margin-top:6px;margin-left:-17px;display:none;z-index:1300;color:inherit;background-color:#fbfbfb;border:3px solid #777;box-shadow:0 2px 10px #999;border-radius:4px;text-align:left}.w2ui-overlay table td{color:inherit}.w2ui-overlay:before{content:\"\";position:absolute;-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg);width:12px;height:12px;border:3px solid #777;border-color:inherit;background-color:inherit;border-left:1px solid transparent;border-bottom:1px solid transparent;border-bottom-left-radius:50px;margin:-9px 0 0 30px}.w2ui-overlay:after{display:none;content:\"\";position:absolute;-webkit-transform:rotate(135deg);-moz-transform:rotate(135deg);-ms-transform:rotate(135deg);-o-transform:rotate(135deg);transform:rotate(135deg);width:12px;height:12px;border:3px solid #777;border-color:inherit;background-color:inherit;border-left:1px solid transparent;border-bottom:1px solid transparent;border-bottom-left-radius:50px;margin:-7px 0 0 30px}.w2ui-overlay.w2ui-overlay-popup{z-index:1700}.w2ui-tag{position:absolute;z-index:1300;opacity:0;-webkit-transition:opacity .3s;-moz-transition:opacity .3s;-ms-transition:opacity .3s;-o-transition:opacity .3s;transition:opacity .3s}.w2ui-tag .w2ui-tag-body{background-color:rgba(60,60,60,.82);display:inline-block;position:absolute;border-radius:4px;padding:4px 10px;margin-left:10px;margin-top:0;color:#fff!important;box-shadow:1px 1px 3px #000;line-height:100%;font-size:11px;font-family:Verdana,Arial,sans-serif}.w2ui-tag .w2ui-tag-body:before{content:\"\";position:absolute;width:0;height:0;border-top:5px solid transparent;border-right:5px solid rgba(60,60,60,.82);border-bottom:5px solid transparent;margin:2px 0 0 -15px}.w2ui-tag.w2ui-tag-popup{z-index:1700}.w2ui-overlay table.w2ui-drop-menu{width:100%;color:#000;background-color:#fff;padding:5px 0;cursor:default}.w2ui-overlay table.w2ui-drop-menu td{white-space:nowrap}.w2ui-overlay table.w2ui-drop-menu .w2ui-item-even{color:inherit;background-color:#fff}.w2ui-overlay table.w2ui-drop-menu .w2ui-item-odd{color:inherit;background-color:#f3f6fa}.w2ui-overlay table.w2ui-drop-menu .w2ui-item-group{color:#444;font-weight:700;background-color:#ECEDF0;border-bottom:1px solid #D3D2D4}.w2ui-overlay table.w2ui-drop-menu td.menu-icon{padding:3px 0 4px 6px;width:20px}.w2ui-overlay table.w2ui-drop-menu td.menu-text{padding:8px 10px 8px 5px;width:auto}.w2ui-overlay table.w2ui-drop-menu td.menu-count{text-align:right}.w2ui-overlay table.w2ui-drop-menu td.menu-count>span{border:1px solid #9da4af;border-radius:20px;width:auto;height:18px;padding:2px 7px;margin:3px 5px 0;background-color:#e7f0fc;color:#667274;box-shadow:0 0 2px #fff;text-shadow:1px 1px 1px #e6e6e6}.w2ui-overlay table.w2ui-drop-menu tr:hover{color:inherit;background-color:#e6f0ff}.w2ui-overlay table.w2ui-drop-menu tr.w2ui-selected{background-color:#b6d5fb}.w2ui-overlay table.w2ui-drop-menu tr.w2ui-selected td{color:inherit}.w2ui-overlay table.w2ui-drop-menu tr.w2ui-disabled{opacity:.4;background-color:#fff!important}.w2ui-overlay table.w2ui-drop-menu .w2ui-icon{font-size:14px;color:#8d99a7;display:inline-block;padding-top:4px}.w2ui-marker{color:#444;background-color:rgba(252,244,161,.48)}.w2ui-spinner{display:inline-block;background-size:100%;background-repeat:no-repeat;background-image:url(data:image/gif;base64,R0lGODlhgACAAKIAAP///93d3bu7u5mZmQAA/wAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBQAEACwCAAIAfAB8AAAD/0i63P4wygYqmDjrzbtflvWNZGliYXiubKuloivPLlzReD7al+7/Eh5wSFQIi8hHYBkwHUmD6CD5YTJLz49USuVYraRsZ7vtar7XnQ1Kjpoz6LRHvGlz35O4nEPP2O94EnpNc2sef1OBGIOFMId/inB6jSmPdpGScR19EoiYmZobnBCIiZ95k6KGGp6ni4wvqxilrqBfqo6skLW2YBmjDa28r6Eosp27w8Rov8ekycqoqUHODrTRvXsQwArC2NLF29UM19/LtxO5yJd4Au4CK7DUNxPebG4e7+8n8iv2WmQ66BtoYpo/dvfacBjIkITBE9DGlMvAsOIIZjIUAixliv9ixYZVtLUos5GjwI8gzc3iCGghypQqrbFsme8lwZgLZtIcYfNmTJ34WPTUZw5oRxdD9w0z6iOpO15MgTh1BTTJUKos39jE+o/KS64IFVmsFfYT0aU7capdy7at27dw48qdS7eu3bt480I02vUbX2F/JxYNDImw4GiGE/P9qbhxVpWOI/eFKtlNZbWXuzlmG1mv58+gQ4seTbq06dOoU6vGQZJy0FNlMcV+czhQ7SQmYd8eMhPs5BxVdfcGEtV3buDBXQ+fURxx8oM6MT9P+Fh6dOrH2zavc13u9JXVJb520Vp8dvC76wXMuN5Sepm/1WtkEZHDefnzR9Qvsd9+/wi8+en3X0ntYVcSdAE+UN4zs7ln24CaLagghIxBaGF8kFGoIYV+Ybghh841GIyI5ICIFoklJsigihmimJOLEbLYIYwxSgigiZ+8l2KB+Ml4oo/w8dijjcrouCORKwIpnJIjMnkkksalNeR4fuBIm5UEYImhIlsGCeWNNJphpJdSTlkml1jWeOY6TnaRpppUctcmFW9mGSaZceYopH9zkjnjUe59iR5pdapWaGqHopboaYua1qije67GJ6CuJAAAIfkEBQUABAAsCgACAFcAMAAAA/9Iutz+ML5Ag7w46z0r5WAoSp43nihXVmnrdusrv+s332dt4Tyo9yOBUJD6oQBIQGs4RBlHySSKyczVTtHoidocPUNZaZAr9F5FYbGI3PWdQWn1mi36buLKFJvojsHjLnshdhl4L4IqbxqGh4gahBJ4eY1kiX6LgDN7fBmQEJI4jhieD4yhdJ2KkZk8oiSqEaatqBekDLKztBG2CqBACq4wJRi4PZu1sA2+v8C6EJexrBAD1AOBzsLE0g/V1UvYR9sN3eR6lTLi4+TlY1wz6Qzr8u1t6FkY8vNzZTxaGfn6mAkEGFDgL4LrDDJDyE4hEIbdHB6ESE1iD4oVLfLAqPETIsOODwmCDJlv5MSGJklaS6khAQAh+QQFBQAEACwfAAIAVwAwAAAD/0i63P5LSAGrvTjrNuf+YKh1nWieIumhbFupkivPBEzR+GnnfLj3ooFwwPqdAshAazhEGUXJJIrJ1MGOUamJ2jQ9QVltkCv0XqFh5IncBX01afGYnDqD40u2z76JK/N0bnxweC5sRB9vF34zh4gjg4uMjXobihWTlJUZlw9+fzSHlpGYhTminKSepqebF50NmTyor6qxrLO0L7YLn0ALuhCwCrJAjrUqkrjGrsIkGMW/BMEPJcphLgDaABjUKNEh29vdgTLLIOLpF80s5xrp8ORVONgi8PcZ8zlRJvf40tL8/QPYQ+BAgjgMxkPIQ6E6hgkdjoNIQ+JEijMsasNY0RQix4gKP+YIKXKkwJIFF6JMudFEAgAh+QQFBQAEACw8AAIAQgBCAAAD/kg0PPowykmrna3dzXvNmSeOFqiRaGoyaTuujitv8Gx/661HtSv8gt2jlwIChYtc0XjcEUnMpu4pikpv1I71astytkGh9wJGJk3QrXlcKa+VWjeSPZHP4Rtw+I2OW81DeBZ2fCB+UYCBfWRqiQp0CnqOj4J1jZOQkpOUIYx/m4oxg5cuAaYBO4Qop6c6pKusrDevIrG2rkwptrupXB67vKAbwMHCFcTFxhLIt8oUzLHOE9Cy0hHUrdbX2KjaENzey9Dh08jkz8Tnx83q66bt8PHy8/T19vf4+fr6AP3+/wADAjQmsKDBf6AOKjS4aaHDgZMeSgTQcKLDhBYPEswoA1BBAgAh+QQFBQAEACxOAAoAMABXAAAD7Ei6vPOjyUkrhdDqfXHm4OZ9YSmNpKmiqVqykbuysgvX5o2HcLxzup8oKLQQix0UcqhcVo5ORi+aHFEn02sDeuWqBGCBkbYLh5/NmnldxajX7LbPBK+PH7K6narfO/t+SIBwfINmUYaHf4lghYyOhlqJWgqDlAuAlwyBmpVnnaChoqOkpaanqKmqKgGtrq+wsbA1srW2ry63urasu764Jr/CAb3Du7nGt7TJsqvOz9DR0tPU1TIA2ACl2dyi3N/aneDf4uPklObj6OngWuzt7u/d8fLY9PXr9eFX+vv8+PnYlUsXiqC3c6PmUUgAACH5BAUFAAQALE4AHwAwAFcAAAPpSLrc/m7IAau9bU7MO9GgJ0ZgOI5leoqpumKt+1axPJO1dtO5vuM9yi8TlAyBvSMxqES2mo8cFFKb8kzWqzDL7Xq/4LB4TC6bz1yBes1uu9uzt3zOXtHv8xN+Dx/x/wJ6gHt2g3Rxhm9oi4yNjo+QkZKTCgGWAWaXmmOanZhgnp2goaJdpKGmp55cqqusrZuvsJays6mzn1m4uRAAvgAvuBW/v8GwvcTFxqfIycA3zA/OytCl0tPPO7HD2GLYvt7dYd/ZX99j5+Pi6tPh6+bvXuTuzujxXens9fr7YPn+7egRI9PPHrgpCQAAIfkEBQUABAAsPAA8AEIAQgAAA/lIutz+UI1Jq7026h2x/xUncmD5jehjrlnqSmz8vrE8u7V5z/m5/8CgcEgsGo/IpHLJbDqf0Kh0ShBYBdTXdZsdbb/Yrgb8FUfIYLMDTVYz2G13FV6Wz+lX+x0fdvPzdn9WeoJGAYcBN39EiIiKeEONjTt0kZKHQGyWl4mZdREAoQAcnJhBXBqioqSlT6qqG6WmTK+rsa1NtaGsuEu6o7yXubojsrTEIsa+yMm9SL8osp3PzM2cStDRykfZ2tfUtS/bRd3ewtzV5pLo4eLjQuUp70Hx8t9E9eqO5Oku5/ztdkxi90qPg3x2EMpR6IahGocPCxp8AGtigwQAIfkEBQUABAAsHwBOAFcAMAAAA/9Iutz+MMo36pg4682J/V0ojs1nXmSqSqe5vrDXunEdzq2ta3i+/5DeCUh0CGnF5BGULC4tTeUTFQVONYAs4CfoCkZPjFar83rBx8l4XDObSUL1Ott2d1U4yZwcs5/xSBB7dBMBhgEYfncrTBGDW4WHhomKUY+QEZKSE4qLRY8YmoeUfkmXoaKInJ2fgxmpqqulQKCvqRqsP7WooriVO7u8mhu5NacasMTFMMHCm8qzzM2RvdDRK9PUwxzLKdnaz9y/Kt8SyR3dIuXmtyHpHMcd5+jvWK4i8/TXHff47SLjQvQLkU+fG29rUhQ06IkEG4X/Rryp4mwUxSgLL/7IqFETB8eONT6ChCFy5ItqJomES6kgAQAh+QQFBQAEACwKAE4AVwAwAAAD/0i63A4QuEmrvTi3yLX/4MeNUmieITmibEuppCu3sDrfYG3jPKbHveDktxIaF8TOcZmMLI9NyBPanFKJp4A2IBx4B5lkdqvtfb8+HYpMxp3Pl1qLvXW/vWkli16/3dFxTi58ZRcChwIYf3hWBIRchoiHiotWj5AVkpIXi4xLjxiaiJR/T5ehoomcnZ+EGamqq6VGoK+pGqxCtaiiuJVBu7yaHrk4pxqwxMUzwcKbyrPMzZG90NGDrh/JH8t72dq3IN1jfCHb3L/e5ebh4ukmxyDn6O8g08jt7tf26ybz+m/W9GNXzUQ9fm1Q/APoSWAhhfkMAmpEbRhFKwsvCsmosRIHx444PoKcIXKkjIImjTzjkQAAIfkEBQUABAAsAgA8AEIAQgAAA/VIBNz+8KlJq72Yxs1d/uDVjVxogmQqnaylvkArT7A63/V47/m2/8CgcEgsGo/IpHLJbDqf0Kh0Sj0FroGqDMvVmrjgrDcTBo8v5fCZki6vCW33Oq4+0832O/at3+f7fICBdzsChgJGeoWHhkV0P4yMRG1BkYeOeECWl5hXQ5uNIAOjA1KgiKKko1CnqBmqqk+nIbCkTq20taVNs7m1vKAnurtLvb6wTMbHsUq4wrrFwSzDzcrLtknW16tI2tvERt6pv0fi48jh5h/U6Zs77EXSN/BE8jP09ZFA+PmhP/xvJgAMSGBgQINvEK5ReIZhQ3QEMTBLAAAh+QQFBQAEACwCAB8AMABXAAAD50i6DA4syklre87qTbHn4OaNYSmNqKmiqVqyrcvBsazRpH3jmC7yD98OCBF2iEXjBKmsAJsWHDQKmw571l8my+16v+CweEwum8+hgHrNbrvbtrd8znbR73MVfg838f8BeoB7doN0cYZvaIuMjY6PkJGSk2gClgJml5pjmp2YYJ6dX6GeXaShWaeoVqqlU62ir7CXqbOWrLafsrNctjIDwAMWvC7BwRWtNsbGFKc+y8fNsTrQ0dK3QtXAYtrCYd3eYN3c49/a5NVj5eLn5u3s6e7x8NDo9fbL+Mzy9/T5+tvUzdN3Zp+GBAAh+QQJBQAEACwCAAIAfAB8AAAD/0i63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdArcQK2TOL7/nl4PSMwIfcUk5YhUOh3M5nNKiOaoWCuWqt1Ou16l9RpOgsvEMdocXbOZ7nQ7DjzTaeq7zq6P5fszfIASAYUBIYKDDoaGIImKC4ySH3OQEJKYHZWWi5iZG0ecEZ6eHEOio6SfqCaqpaytrpOwJLKztCO2jLi1uoW8Ir6/wCHCxMG2x7muysukzb230M6H09bX2Nna29zd3t/g4cAC5OXm5+jn3Ons7eba7vHt2fL16tj2+QL0+vXw/e7WAUwnrqDBgwgTKlzIsKHDh2gGSBwAccHEixAvaqTYcFCjRoYeNyoM6REhyZIHT4o0qPIjy5YTTcKUmHImx5cwE85cmJPnSYckK66sSAAj0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gwxZJAAA7)}.w2ui-icon{background-repeat:no-repeat;height:16px;width:16px;overflow:hidden;margin:2px;display:inline-block}.w2ui-icon.icon-search,.w2ui-icon.icon-search-down{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAgCAYAAAB+ZAqzAAACuElEQVRYw9WXSWhTQRjHR0UKLqhFaV0OUih68GAOWjyJKypCpAoV8aIiioIICiKiB1GMtE3MYmry2moXDz1UDx7sUXHBhQpSaRVxrYpWcMO9avx/8AJh/CbznHkxdeB3Cd/8589kvuUJkWcdjCTHghUgAi6DJ+AVeAqugSQIggniXywcNBJsB70g44EHYBcYXUhTM8EFj4ZkboKqQpiqAv2GprK8o7/f75t6pjn0M3gNPmri3vtycxAZA64qDvkJ2kENqAQTQQWoBg74qth3B4y3NbZDIX4fzNfsnQtuK/YfsjFVCh4pMq3Co0Y5uMVoUGkpy8aFT5xaeSzVEo45bXdBt4LeaLq1k0RXMYJfdDfFmAuAD4zWlty4UNyZEkm19MUb2zMw8Sfp1u+IWSrcIimLnTG8/SijdU6OO5poDESdtgHZVBzUHm/amhW7zoitMTS2mNHqASPk2FDCCcLMYK6p+obmulyxfiYLA4bGKFvfSnrUvkq5+Lpk8z4yRH8r3l/X4WiqJFfspSQ0CGYZGpsMnkt6L+h31Z76hpMdeOwPQ7H0NFnssST0C8wxNDaDKb6kP06150gsHahNNlVzYheZd7HJ0BiX4VRGhpmIhRixKyZilM2M1mnTArtIUbU3/qVO0H0GvmQ4CY4C3YopYYlHjXlggNG4R33Ypi2tVtwaPeTdNMkq9pVQZQdvFPs32zbx4aAjzxhDRfIAWAeWg7VgrzsY5ht/zoNJtubKwA3LITGjSKRyW3NTwaUCmKOSMd3WHH0ZJRQZZkOP1zFKZ3CB++4+aQ6kEeksWAb2a2L7qDv49S1Q6T72MOgEXa6RGFhP3wpS/B6NOWpRs0UxFg7eqTFHjX1hscxtAz/ymEuIYi0cvgF8Y0w5Ro3dZ3M1boJkTaXEUFlug6fsdsRQWzTj0cey+N/Xb2sj5lTh2M6OAAAAAElFTkSuQmCC) no-repeat center!important;background-size:14px 12px!important;opacity:.9}.w2ui-icon.icon-folder{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGrSURBVDjLxZO7ihRBFIa/6u0ZW7GHBUV0UQQTZzd3QdhMQxOfwMRXEANBMNQX0MzAzFAwEzHwARbNFDdwEd31Mj3X7a6uOr9BtzNjYjKBJ6nicP7v3KqcJFaxhBVtZUAK8OHlld2st7Xl3DJPVONP+zEUV4HqL5UDYHr5xvuQAjgl/Qs7TzvOOVAjxjlC+ePSwe6DfbVegLVuT4r14eTr6zvA8xSAoBLzx6pvj4l+DZIezuVkG9fY2H7YRQIMZIBwycmzH1/s3F8AapfIPNF3kQk7+kw9PWBy+IZOdg5Ug3mkAATy/t0usovzGeCUWTjCz0B+Sj0ekfdvkZ3abBv+U4GaCtJ1iEm6ANQJ6fEzrG/engcKw/wXQvEKxSEKQxRGKE7Izt+DSiwBJMUSm71rguMYhQKrBygOIRStf4TiFFRBvbRGKiQLWP29yRSHKBTtfdBmHs0BUpgvtgF4yRFR+NUKi0XZcYjCeCG2smkzLAHkbRBmP0/Uk26O5YnUActBp1GsAI+S5nRJJJal5K1aAMrq0d6Tm9uI6zjyf75dAe6tx/SsWeD//o2/Ab6IH3/h25pOAAAAAElFTkSuQmCC) no-repeat center!important}.w2ui-icon.icon-page{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAINSURBVBgZBcG/r55zGAfg6/4+z3va01NHlYgzEfE7MdCIGISFgS4Gk8ViYyM2Mdlsko4GSf8Do0FLRCIkghhYJA3aVBtEz3nP89wf11VJvPDepdd390+8Nso5nESBQoq0pfvXm9fzWf19453LF85vASqJlz748vInb517dIw6EyYBIIG49u+xi9/c9MdvR//99MPPZ7+4cP4IZhhTPbwzT2d+vGoaVRRp1rRliVvHq+cfvM3TD82+7mun0o/ceO7NT+/4/KOXjwZU1ekk0840bAZzMQ2mooqh0A72d5x/6sB9D5zYnff3PoYBoWBgFKPKqDKqjCpjKr//dcu9p489dra88cydps30KswACfNEKanSaxhlntjJ8Mv12Paie+vZ+0+oeSwwQ0Iw1xAR1CiFNJkGO4wu3ZMY1AAzBI0qSgmCNJsJUEOtJSMaCTBDLyQ0CknAGOgyTyFFiLI2awMzdEcSQgSAAKVUmAeNkxvWJWCGtVlDmgYQ0GFtgg4pNtOwbBcwQy/Rife/2yrRRVI0qYCEBly8Z+P4qMEMy7JaVw72N568e+iwhrXoECQkfH91kY7jwwXMsBx1L93ZruqrK6uuiAIdSnTIKKPLPFcvay8ww/Hh+ufeznTXu49v95IMoQG3784gYXdTqvRmqn/Wpa/ADFX58MW3L71SVU9ETgEIQQQIOOzub+fhIvwPRDgeVjWDahIAAAAASUVORK5CYII=) no-repeat center!important}.w2ui-lock{display:none;position:absolute;z-index:1400;top:0;left:0;width:100%;height:100%;opacity:.15;filter:alpha(opacity=15);background-color:#333}.w2ui-lock-msg{display:none;position:absolute;z-index:1400;top:45%;left:50%;-webkit-transform:translateX(-50%) translateY(-50%);-moz-transform:translateX(-50%) translateY(-50%);-ms-transform:translateX(-50%) translateY(-50%);-o-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%);width:200px;height:80px;padding:30px 8px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;font-size:13px;font-family:Verdana,Arial,sans-serif;opacity:.8;filter:alpha(opacity=80);background-color:#555;color:#fff;text-align:center;border-radius:5px;border:2px solid #444}.w2ui-lock-msg .w2ui-spinner{display:inline-block;width:24px;height:24px;margin:-3px 8px -7px -10px}button.btn{display:inline-block;border-radius:4px;margin:0 5px;padding:7px 12px 6px!important;color:#666;font-size:12px!important;border:1px solid #B6B6B6;background-image:-webkit-linear-gradient(#fff 0,#e7e7e7 100%);background-image:-moz-linear-gradient(#fff 0,#e7e7e7 100%);background-image:-ms-linear-gradient(#fff 0,#e7e7e7 100%);background-image:-o-linear-gradient(#fff 0,#e7e7e7 100%);background-image:linear-gradient(#fff 0,#e7e7e7 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ffe7e7e7', endColorstr='#ffffffff', GradientType=0);outline:0;box-shadow:0 1px 0 #fff;cursor:default;min-width:75px;line-height:100%!important;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}button.btn:hover{text-decoration:none;border:1px solid #bbb;background-image:-webkit-linear-gradient(#f7f7f7 0,#ddd 100%);background-image:-moz-linear-gradient(#f7f7f7 0,#ddd 100%);background-image:-ms-linear-gradient(#f7f7f7 0,#ddd 100%);background-image:-o-linear-gradient(#f7f7f7 0,#ddd 100%);background-image:linear-gradient(#f7f7f7 0,#ddd 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ffdddddd', endColorstr='#fff7f7f7', GradientType=0);color:#333}button.btn:active,button.btn.clicked{border:1px solid #999;background-image:-webkit-linear-gradient(#ccc 0,#ccc 100%);background-image:-moz-linear-gradient(#ccc 0,#ccc 100%);background-image:-ms-linear-gradient(#ccc 0,#ccc 100%);background-image:-o-linear-gradient(#ccc 0,#ccc 100%);background-image:linear-gradient(#ccc 0,#ccc 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ffcccccc', endColorstr='#ffcccccc', GradientType=0);text-shadow:1px 1px 1px #eee}button.btn:disabled{border:1px solid #bbb!important;background:#f7f7f7!important;color:#bdbcbc!important;text-shadow:none!important}button.btn-blue{color:#fff;background-image:-webkit-linear-gradient(#80c0f7 0,#269df0 100%);background-image:-moz-linear-gradient(#80c0f7 0,#269df0 100%);background-image:-ms-linear-gradient(#80c0f7 0,#269df0 100%);background-image:-o-linear-gradient(#80c0f7 0,#269df0 100%);background-image:linear-gradient(#80c0f7 0,#269df0 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ff269df0', endColorstr='#ff80c0f7', GradientType=0);border:1px solid #538AB7;text-shadow:1px 1px 1px #777}button.btn-blue:hover{color:#fff;background-image:-webkit-linear-gradient(#73b6f0 0,#2391dd 100%);background-image:-moz-linear-gradient(#73b6f0 0,#2391dd 100%);background-image:-ms-linear-gradient(#73b6f0 0,#2391dd 100%);background-image:-o-linear-gradient(#73b6f0 0,#2391dd 100%);background-image:linear-gradient(#73b6f0 0,#2391dd 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ff2391dd', endColorstr='#ff73b6f0', GradientType=0);border:1px solid #497BA3;text-shadow:1px 1px 1px #777}button.btn-blue:active,button.btn-blue.clicked{color:#fff;background-image:-webkit-linear-gradient(#1e83c9 0,#1e83c9 100%);background-image:-moz-linear-gradient(#1e83c9 0,#1e83c9 100%);background-image:-ms-linear-gradient(#1e83c9 0,#1e83c9 100%);background-image:-o-linear-gradient(#1e83c9 0,#1e83c9 100%);background-image:linear-gradient(#1e83c9 0,#1e83c9 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ff1e83c9', endColorstr='#ff1e83c9', GradientType=0);border:1px solid #1268A6;text-shadow:1px 1px 1px #777}button.btn-green{color:#fff;background-image:-webkit-linear-gradient(#81cf81 0,#52a452 100%);background-image:-moz-linear-gradient(#81cf81 0,#52a452 100%);background-image:-ms-linear-gradient(#81cf81 0,#52a452 100%);background-image:-o-linear-gradient(#81cf81 0,#52a452 100%);background-image:linear-gradient(#81cf81 0,#52a452 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ff52a452', endColorstr='#ff81cf81', GradientType=0);border:1px solid #479247;text-shadow:1px 1px 1px #777}button.btn-green:hover{color:#fff;background-image:-webkit-linear-gradient(#6abe68 0,#3f8f3d 100%);background-image:-moz-linear-gradient(#6abe68 0,#3f8f3d 100%);background-image:-ms-linear-gradient(#6abe68 0,#3f8f3d 100%);background-image:-o-linear-gradient(#6abe68 0,#3f8f3d 100%);background-image:linear-gradient(#6abe68 0,#3f8f3d 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ff3f8f3d', endColorstr='#ff6abe68', GradientType=0);border:1px solid #479247;text-shadow:1px 1px 1px #777}button.btn-green:active,button.btn-green.clicked{color:#fff;background-image:-webkit-linear-gradient(#377d36 0,#377d36 100%);background-image:-moz-linear-gradient(#377d36 0,#377d36 100%);background-image:-ms-linear-gradient(#377d36 0,#377d36 100%);background-image:-o-linear-gradient(#377d36 0,#377d36 100%);background-image:linear-gradient(#377d36 0,#377d36 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ff377d36', endColorstr='#ff377d36', GradientType=0);border:1px solid #555!important;text-shadow:1px 1px 1px #777}button.btn-orange{color:#fff;background-image:-webkit-linear-gradient(#fcc272 0,#fb8822 100%);background-image:-moz-linear-gradient(#fcc272 0,#fb8822 100%);background-image:-ms-linear-gradient(#fcc272 0,#fb8822 100%);background-image:-o-linear-gradient(#fcc272 0,#fb8822 100%);background-image:linear-gradient(#fcc272 0,#fb8822 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#fffb8822', endColorstr='#fffcc272', GradientType=0);border:1px solid #B68B4C;text-shadow:1px 1px 1px #777}button.btn-orange:hover{color:#fff;background-image:-webkit-linear-gradient(#f4ad59 0,#f1731f 100%);background-image:-moz-linear-gradient(#f4ad59 0,#f1731f 100%);background-image:-ms-linear-gradient(#f4ad59 0,#f1731f 100%);background-image:-o-linear-gradient(#f4ad59 0,#f1731f 100%);background-image:linear-gradient(#f4ad59 0,#f1731f 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#fff1731f', endColorstr='#fff4ad59', GradientType=0);border:1px solid #B68B4C;text-shadow:1px 1px 1px #777}button.btn-orange:active,button.btn-orange.clicked{color:#fff;border:1px solid #666;background-image:-webkit-linear-gradient(#b98747 0,#b98747 100%);background-image:-moz-linear-gradient(#b98747 0,#b98747 100%);background-image:-ms-linear-gradient(#b98747 0,#b98747 100%);background-image:-o-linear-gradient(#b98747 0,#b98747 100%);background-image:linear-gradient(#b98747 0,#b98747 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ffb98747', endColorstr='#ffb98747', GradientType=0);text-shadow:1px 1px 1px #777}button.btn-red{color:#fff;background-image:-webkit-linear-gradient(#ff6e70 0,#c72d2d 100%);background-image:-moz-linear-gradient(#ff6e70 0,#c72d2d 100%);background-image:-ms-linear-gradient(#ff6e70 0,#c72d2d 100%);background-image:-o-linear-gradient(#ff6e70 0,#c72d2d 100%);background-image:linear-gradient(#ff6e70 0,#c72d2d 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ffc72d2d', endColorstr='#ffff6e70', GradientType=0);border:1px solid #BB3C3E;text-shadow:1px 1px 1px #777}button.btn-red:hover{color:#fff;background-image:-webkit-linear-gradient(#ee696c 0,#ae2527 100%);background-image:-moz-linear-gradient(#ee696c 0,#ae2527 100%);background-image:-ms-linear-gradient(#ee696c 0,#ae2527 100%);background-image:-o-linear-gradient(#ee696c 0,#ae2527 100%);background-image:linear-gradient(#ee696c 0,#ae2527 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ffae2527', endColorstr='#ffee696c', GradientType=0);border:1px solid #BB3C3E;text-shadow:1px 1px 1px #777}button.btn-red:active,button.btn-red.clicked{color:#fff;border:1px solid #861C1E;background-image:-webkit-linear-gradient(#9c2123 0,#9c2123 100%);background-image:-moz-linear-gradient(#9c2123 0,#9c2123 100%);background-image:-ms-linear-gradient(#9c2123 0,#9c2123 100%);background-image:-o-linear-gradient(#9c2123 0,#9c2123 100%);background-image:linear-gradient(#9c2123 0,#9c2123 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ff9c2123', endColorstr='#ff9c2123', GradientType=0);text-shadow:1px 1px 1px #777}.w2ui-form{position:relative;color:#000;background-color:#f5f6f7;border:1px solid silver;border-radius:3px;padding:0;overflow:hidden!important}.w2ui-form>div{position:absolute;overflow:hidden}.w2ui-form .w2ui-form-header{position:absolute;left:0;right:0;border-bottom:1px solid #99bbe8!important;overflow:hidden;color:#444;font-size:13px;text-align:center;padding:8px;background-image:-webkit-linear-gradient(#dae6f3,#c2d5ed);background-image:-moz-linear-gradient(#dae6f3,#c2d5ed);background-image:-ms-linear-gradient(#dae6f3,#c2d5ed);background-image:-o-linear-gradient(#dae6f3,#c2d5ed);background-image:linear-gradient(#dae6f3,#c2d5ed);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ffdae6f3', endColorstr='#ffc2d5ed', GradientType=0);border-top-left-radius:3px;border-top-right-radius:3px}.w2ui-form .w2ui-form-toolbar{position:absolute;left:0;right:0;margin:0;padding:6px 3px;border-bottom:1px solid #d5d8d8}.w2ui-form .w2ui-form-tabs{margin:0;padding:0}.w2ui-form .w2ui-tabs{position:absolute;left:0;right:0;border-top-left-radius:3px;border-top-right-radius:3px;padding-top:5px!important;background-color:#fafafa}.w2ui-form .w2ui-tabs .w2ui-tab.active{background-color:#f5f6f7}.w2ui-form .w2ui-page{position:absolute;left:0;right:0;overflow:auto;padding:10px;border-left:1px solid inherit;border-right:1px solid inherit;background-color:inherit;border-radius:3px}.w2ui-form .w2ui-buttons{position:absolute;left:0;right:0;bottom:0;text-align:center;border-top:1px solid #d5d8d8;border-bottom:0 solid #d5d8d8;background-color:#fafafa;padding:15px 0!important;border-bottom-left-radius:3px;border-bottom-right-radius:3px}.w2ui-form .w2ui-buttons input[type=button],.w2ui-form .w2ui-buttons button{min-width:80px;margin-right:5px}.w2ui-form input[type=checkbox],.w2ui-form input[type=radio]{margin-top:4px;margin-bottom:4px}.w2ui-form input[type=checkbox].w2ui-toggle{margin:0}.w2ui-group-title{padding:5px 2px;color:#8D96A2;text-shadow:1px 1px 2px #fdfdfd;font-size:120%}.w2ui-group{background-color:#ebecef;margin:5px 0 10px;padding:10px 5px;border-top:1px solid #cedcea;border-bottom:1px solid #cedcea}.w2ui-field>label{display:block;float:left;margin-top:7px;margin-bottom:3px;width:120px;padding:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:right;min-height:20px;color:#666}.w2ui-field>div{margin-bottom:3px;margin-left:128px;padding:3px;min-height:28px;float:none}.w2ui-field.w2ui-required>div{position:relative}.w2ui-field.w2ui-required>div::before{content:'*';position:absolute;margin-top:5px;margin-left:-9px;color:red}.w2ui-field.w2ui-span1>label{width:20px}.w2ui-field.w2ui-span1>div{margin-left:28px}.w2ui-field.w2ui-span2>label{width:40px}.w2ui-field.w2ui-span2>div{margin-left:48px}.w2ui-field.w2ui-span3>label{width:60px}.w2ui-field.w2ui-span3>div{margin-left:68px}.w2ui-field.w2ui-span4>label{width:80px}.w2ui-field.w2ui-span4>div{margin-left:88px}.w2ui-field.w2ui-span5>label{width:100px}.w2ui-field.w2ui-span5>div{margin-left:108px}.w2ui-field.w2ui-span6>label{width:120px}.w2ui-field.w2ui-span6>div{margin-left:128px}.w2ui-field.w2ui-span7>label{width:140px}.w2ui-field.w2ui-span7>div{margin-left:148px}.w2ui-field.w2ui-span8>label{width:160px}.w2ui-field.w2ui-span8>div{margin-left:168px}.w2ui-field.w2ui-span9>label{width:180px}.w2ui-field.w2ui-span9>div{margin-left:188px}.w2ui-field.w2ui-span10>label{width:200px}.w2ui-field.w2ui-span10>div{margin-left:208px}.w2ui-error{border:1px solid #ffa8a8!important;background-color:#fff4eb!important}.w2field{padding:3px;border-radius:3px;border:1px solid silver}.w2ui-field-helper{position:absolute;display:inline-block;line-height:100%;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none}.w2ui-field-helper .w2ui-field-up{position:absolute;top:0;padding:2px 3px}.w2ui-field-helper .w2ui-field-down{position:absolute;bottom:0;padding:2px 3px}.w2ui-field-helper .arrow-up:hover{border-bottom-color:#81C6FF}.w2ui-field-helper .arrow-down:hover{border-top-color:#81C6FF}.arrow-up{background:0 0;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:5px solid #777;font-size:0;line-height:0}.arrow-down{background:0 0;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid #777;font-size:0;line-height:0}.arrow-left{background:0 0;width:0;height:0;border-bottom:4px solid transparent;border-top:4px solid transparent;border-right:5px solid #777;font-size:0;line-height:0}.arrow-right{background:0 0;width:0;height:0;border-bottom:4px solid transparent;border-top:4px solid transparent;border-left:5px solid #777;font-size:0;line-height:0}.w2ui-color{padding:5px;padding-top:8px;background-color:#fff;border-radius:3px}.w2ui-color>table{table-layout:fixed;width:160px}.w2ui-color>table td{width:20px;height:20px;text-align:center}.w2ui-color>table td div{cursor:pointer;display:inline-block;width:16px;height:17px;padding:1px 4px;border:1px solid transparent;color:#fff;text-shadow:0 0 2px #000}.w2ui-color>table td div:hover{outline:1px solid #666;border:1px solid #fff}.w2ui-calendar{margin:0;padding:1px;line-height:108%}.w2ui-calendar .w2ui-calendar-title{margin:0 -1px;padding:7px 2px;background-image:-webkit-linear-gradient(#f6f6f6,#d9d9d9);background-image:-moz-linear-gradient(#f6f6f6,#d9d9d9);background-image:-ms-linear-gradient(#f6f6f6,#d9d9d9);background-image:-o-linear-gradient(#f6f6f6,#d9d9d9);background-image:linear-gradient(#f6f6f6,#d9d9d9);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#fff6f6f6', endColorstr='#ffd9d9d9', GradientType=0);border-bottom:1px solid #bbb;color:#555;text-align:center;text-shadow:1px 1px 1px #eee;cursor:pointer}.w2ui-calendar .w2ui-calendar-jump{position:absolute;top:27px;left:0;right:0;bottom:0;background-color:#FaFaFa}.w2ui-calendar .w2ui-calendar-jump>:first-child{position:absolute;top:0;left:0;bottom:0;width:110px;overflow:hidden;padding-top:5px;border-right:1px solid silver}.w2ui-calendar .w2ui-calendar-jump>:last-child{position:absolute;top:0;right:0;bottom:0;width:88px;overflow-x:hidden;overflow-y:auto;padding-top:5px;text-align:center}.w2ui-calendar .w2ui-calendar-jump .w2ui-jump-month,.w2ui-calendar .w2ui-calendar-jump .w2ui-jump-year{display:inline-block;padding:5px 0;text-align:center;float:left;margin:2px;width:50px;cursor:default;border:1px solid transparent;border-radius:2px}.w2ui-calendar .w2ui-calendar-jump .w2ui-jump-year{float:none;width:95%}.w2ui-calendar .w2ui-calendar-jump .w2ui-jump-month:hover,.w2ui-calendar .w2ui-calendar-jump .w2ui-jump-year:hover{border:1px solid #ccc;color:#000;background-color:#efefef}.w2ui-calendar .w2ui-calendar-jump .w2ui-jump-month.selected,.w2ui-calendar .w2ui-calendar-jump .w2ui-jump-year.selected{border:1px solid #ccc;color:#000;background-color:#dadada}.w2ui-calendar .w2ui-calendar-previous,.w2ui-calendar .w2ui-calendar-next{width:24px;height:20px;color:#666;border:1px solid transparent;border-radius:3px;padding:2px 3px 1px 2px;margin:-4px 0 0 0;cursor:default}.w2ui-calendar .w2ui-calendar-previous:hover,.w2ui-calendar .w2ui-calendar-next:hover{border:1px solid silver;background-color:#efefef}.w2ui-calendar .w2ui-calendar-previous>div,.w2ui-calendar .w2ui-calendar-next>div{position:absolute;border-left:4px solid #888;border-top:4px solid #888;border-right:4px solid transparent;border-bottom:4px solid transparent;width:0;height:0;padding:0;margin:3px 0 0}.w2ui-calendar .w2ui-calendar-previous{float:left}.w2ui-calendar .w2ui-calendar-previous>div{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg);margin-left:6px}.w2ui-calendar .w2ui-calendar-next{float:right}.w2ui-calendar .w2ui-calendar-next>div{-webkit-transform:rotate(135deg);-moz-transform:rotate(135deg);-ms-transform:rotate(135deg);-o-transform:rotate(135deg);transform:rotate(135deg);margin-left:2px;margin-right:2px}.w2ui-calendar table.w2ui-calendar-days{padding:0}.w2ui-calendar table.w2ui-calendar-days td{border:1px solid #fff;color:#000;background-color:#f9f9f9;padding:6px;cursor:default;text-align:right}.w2ui-calendar table.w2ui-calendar-days td.w2ui-saturday,.w2ui-calendar table.w2ui-calendar-days td.w2ui-sunday{border:1px solid #fff;color:#c8493b;background-color:#f9f9f9}.w2ui-calendar table.w2ui-calendar-days td.w2ui-saturday:hover,.w2ui-calendar table.w2ui-calendar-days td.w2ui-sunday:hover{border:1px solid #ccc;color:#000;background-color:#e9e9e9}.w2ui-calendar table.w2ui-calendar-days td.w2ui-saturday.w2ui-blocked,.w2ui-calendar table.w2ui-calendar-days td.w2ui-sunday.w2ui-blocked{text-decoration:line-through;border:1px solid #fff;color:#ccc;background-color:#fff}.w2ui-calendar table.w2ui-calendar-days td.w2ui-today{border:1px solid #8cb067;color:#000;background-color:#e2f7cd}.w2ui-calendar table.w2ui-calendar-days td:hover{border:1px solid #ccc;color:#000;background-color:#e9e9e9}.w2ui-calendar table.w2ui-calendar-days td.w2ui-blocked{text-decoration:line-through;border:1px solid #fff;color:#ccc;background-color:#fff}.w2ui-calendar table.w2ui-calendar-days td.w2ui-day-empty{border:1px solid #fff;background-color:#fdfdfd}.w2ui-calendar table.w2ui-calendar-days tr.w2ui-day-title td{border:1px solid #fff;color:gray;background-color:#fff;text-align:center;padding:6px}.w2ui-calendar-time{padding:5px;cursor:default}.w2ui-calendar-time td div{padding:7px 10px;text-align:center;border:1px solid transparent;white-space:nowrap}.w2ui-calendar-time td:nth-child(even){background-color:#f6f6f6}.w2ui-calendar-time td div:hover{border:1px solid #ccc;color:#000;background-color:#e9e9e9}.w2ui-calendar-time td div.w2ui-blocked{text-decoration:line-through;border:1px solid #fff;color:#ccc;background-color:#fff}.w2ui-select{cursor:default;color:#000!important;background-image:-webkit-linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background-image:-moz-linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background-image:-ms-linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background-image:-o-linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background-image:linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%)}.w2ui-list{color:inherit;position:absolute;padding:0;margin:0;min-height:25px;overflow:auto;border:1px solid silver;border-radius:3px;font-size:6px;line-height:100%;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box;background-color:#fff}.w2ui-list input[type=text]{-webkit-box-shadow:none;-moz-box-shadow:none;-ms-box-shadow:none;-o-box-shadow:none;box-shadow:none}.w2ui-list ul{list-style-type:none;background-color:#000;margin:0;padding:0}.w2ui-list ul li{float:left;margin:2px 1px 0 2px;border-radius:3px;width:auto;padding:3px 10px 1px 7px;border:1px solid #88b0d6;background-color:#eff3f5;white-space:nowrap;cursor:default;font-family:verdana;font-size:11px;line-height:100%;height:20px;overflow:hidden;text-overflow:ellipsis;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box}.w2ui-list ul li:hover{background-color:#d0dbe1}.w2ui-list ul li:last-child{border-radius:0;border:1px solid transparent;background-color:transparent}.w2ui-list ul li:last-child input{padding:1px;padding-top:0;margin:0;border:0;outline:0;height:auto;line-height:100%;font-size:inherit;font-family:inherit;background-color:transparent}.w2ui-list ul li .w2ui-list-remove{float:right;width:15px;height:14px;margin:-1px -9px 0 3px;border-radius:15px}.w2ui-list ul li .w2ui-list-remove:hover{background-color:#D77F7F;color:#fff}.w2ui-list ul li .w2ui-list-remove:before{position:relative;top:0;padding:0;margin:0;left:5px;color:inherit;opacity:.7;text-shadow:inherit;font-size:inherit;font-variant:small-caps;content:'x';line-height:100%}.w2ui-list ul li>span.file-size{pointer-events:none;color:#777}.w2ui-list .w2ui-enum-placeholder{display:inline;position:absolute;pointer-events:none;color:#999;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box}.w2ui-list.w2ui-file-dragover{background-color:#E4FFDA;border:1px solid #93E07D}.w2ui-layout{overflow:hidden!important;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box}.w2ui-layout *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box}.w2ui-layout>div{position:absolute;overflow:hidden;border:0;margin:0;padding:0;outline:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box}.w2ui-layout>div .w2ui-panel{display:none;position:absolute;z-index:120}.w2ui-layout>div .w2ui-panel .w2ui-panel-title{padding:5px;background-image:-webkit-linear-gradient(#dae6f3,#c2d5ed);background-image:-moz-linear-gradient(#dae6f3,#c2d5ed);background-image:-ms-linear-gradient(#dae6f3,#c2d5ed);background-image:-o-linear-gradient(#dae6f3,#c2d5ed);background-image:linear-gradient(#dae6f3,#c2d5ed);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ffdae6f3', endColorstr='#ffc2d5ed', GradientType=0);border:1px solid #b9cee9;border-bottom:1px solid #99bbe8}.w2ui-layout>div .w2ui-panel .w2ui-panel-tabs{position:absolute;left:0;top:0;right:0;z-index:2;display:none;overflow:hidden;background-color:#fafafa;padding:4px 0}.w2ui-layout>div .w2ui-panel .w2ui-panel-tabs>.w2ui-tab.active{background-color:#f5f6f7}.w2ui-layout>div .w2ui-panel .w2ui-panel-toolbar{position:absolute;left:0;top:0;right:0;z-index:2;display:none;overflow:hidden;background-color:#fafafa;border-bottom:1px solid silver;padding:4px}.w2ui-layout>div .w2ui-panel .w2ui-panel-content{position:absolute;left:0;top:0;right:0;bottom:0;z-index:1;color:inherit;background-color:#f5f6f7}.w2ui-layout>div .w2ui-resizer{display:none;position:absolute;z-index:121;background-color:transparent}.w2ui-layout>div .w2ui-resizer:hover,.w2ui-layout>div .w2ui-resizer.active{background-color:#d7e4f2}.w2ui-grid{position:relative;border:1px solid silver;border-radius:2px;overflow:hidden!important}.w2ui-grid>div{position:absolute;overflow:hidden}.w2ui-grid .w2ui-grid-header{position:absolute;border-bottom:1px solid #99bbe8!important;height:28px;overflow:hidden;color:#444;font-size:13px;text-align:center;padding:7px;background-image:-webkit-linear-gradient(#dae6f3,#c2d5ed);background-image:-moz-linear-gradient(#dae6f3,#c2d5ed);background-image:-ms-linear-gradient(#dae6f3,#c2d5ed);background-image:-o-linear-gradient(#dae6f3,#c2d5ed);background-image:linear-gradient(#dae6f3,#c2d5ed);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ffdae6f3', endColorstr='#ffc2d5ed', GradientType=0);border-top-left-radius:2px;border-top-right-radius:2px}.w2ui-grid .w2ui-grid-toolbar{position:absolute;border-bottom:1px solid silver;background-color:#eaeaea;height:38px;padding:7px 3px 4px;margin:0;box-shadow:0 1px 2px #ddd}.w2ui-grid .w2ui-toolbar-search{width:160px;margin-right:3px}.w2ui-grid .w2ui-toolbar-search .w2ui-search-all{outline:0!important;width:160px;border-radius:10px;line-height:normal;height:22px;border:1px solid #b9b9b9;color:#000;background-color:#fff;padding:3px 18px 3px 23px;margin:0}.w2ui-grid .w2ui-toolbar-search .w2ui-search-down{position:absolute;margin-top:-7px;margin-left:6px}.w2ui-grid .w2ui-toolbar-search .w2ui-search-clear{position:absolute;width:16px;height:16px;margin-top:-8px;margin-left:-20px;border-radius:15px;cursor:default}.w2ui-grid .w2ui-toolbar-search .w2ui-search-clear:hover{background-color:#D77F7F;color:#fff}.w2ui-grid .w2ui-toolbar-search .w2ui-search-clear:before{position:relative;top:1px;left:5px;opacity:.6;color:inherit;text-shadow:inherit;content:'x';cursor:default}.w2ui-grid .w2ui-grid-body{position:absolute;overflow:hidden;padding:0;background-color:#fff;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.w2ui-grid .w2ui-grid-body input,.w2ui-grid .w2ui-grid-body select,.w2ui-grid .w2ui-grid-body textarea{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;-o-user-select:text}.w2ui-grid .w2ui-grid-body .w2ui-grid-columns{overflow:hidden;position:absolute;left:0;top:0;right:0;box-shadow:0 1px 4px #ddd;height:auto}.w2ui-grid .w2ui-grid-body .w2ui-grid-columns table{height:auto}.w2ui-grid .w2ui-grid-body .w2ui-grid-columns .w2ui-resizer{position:absolute;z-index:1000;display:block;background-image:none;background-color:rgba(0,0,0,0);padding:0;margin:0;width:6px;height:12px;cursor:col-resize}.w2ui-grid .w2ui-grid-body .w2ui-grid-records{position:absolute;left:0;right:0;top:0;bottom:0}.w2ui-grid .w2ui-grid-body .w2ui-grid-records table tr.w2ui-odd{color:inherit;background-color:#fff}.w2ui-grid .w2ui-grid-body .w2ui-grid-records table tr.w2ui-odd:hover{color:inherit;background-color:#e6f0ff}.w2ui-grid .w2ui-grid-body .w2ui-grid-records table tr.w2ui-odd.w2ui-empty-record:hover{background-color:#fff}.w2ui-grid .w2ui-grid-body .w2ui-grid-records table tr.w2ui-even{color:inherit;background-color:#f3f6fa}.w2ui-grid .w2ui-grid-body .w2ui-grid-records table tr.w2ui-even:hover{color:inherit;background-color:#e6f0ff}.w2ui-grid .w2ui-grid-body .w2ui-grid-records table tr.w2ui-even.w2ui-empty-record:hover{background-color:#f3f6fa}.w2ui-grid .w2ui-grid-body .w2ui-grid-records table tr.w2ui-selected,.w2ui-grid .w2ui-grid-body .w2ui-grid-records table tr td.w2ui-selected{color:#000!important;background-color:#b6d5ff!important}.w2ui-grid .w2ui-grid-body .w2ui-grid-records .w2ui-expanded{background-color:#CCDCF0!important}.w2ui-grid .w2ui-grid-body .w2ui-grid-records .w2ui-expanded1{height:0;border-bottom:1px solid #b2bac0;background-color:#CCDCF0}.w2ui-grid .w2ui-grid-body .w2ui-grid-records .w2ui-expanded1>div{height:100%;margin:0;padding:0}.w2ui-grid .w2ui-grid-body .w2ui-grid-records .w2ui-expanded2{height:0;border-radius:0;border-bottom:1px solid #b2bac0}.w2ui-grid .w2ui-grid-body .w2ui-grid-records .w2ui-expanded2>div{height:0;border:0;transition:height .3s,opacity .3s}.w2ui-grid .w2ui-grid-body .w2ui-grid-records .w2ui-load-more{border-top:1px solid #d6d5d7;cursor:pointer}.w2ui-grid .w2ui-grid-body .w2ui-grid-records .w2ui-load-more>div{text-align:center;color:#777;background-color:rgba(233,237,243,.5);padding:10px 0 15px;border-top:1px solid #fff}.w2ui-grid .w2ui-grid-body .w2ui-grid-records .w2ui-load-more>div:hover{color:inherit;background-color:#e6f0ff}.w2ui-grid .w2ui-grid-body table{border-spacing:0;border-collapse:collapse;table-layout:fixed;width:1px}.w2ui-grid .w2ui-grid-body table .w2ui-head{margin:0;padding:0;border-right:1px solid #c5c5c5;border-bottom:1px solid #c5c5c5;color:#000;background-image:-webkit-linear-gradient(#f9f9f9,#e4e4e4);background-image:-moz-linear-gradient(#f9f9f9,#e4e4e4);background-image:-ms-linear-gradient(#f9f9f9,#e4e4e4);background-image:-o-linear-gradient(#f9f9f9,#e4e4e4);background-image:linear-gradient(#f9f9f9,#e4e4e4);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#fff9f9f9', endColorstr='#ffe4e4e4', GradientType=0)}.w2ui-grid .w2ui-grid-body table .w2ui-head>div{padding:7px 3px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;position:relative}.w2ui-grid .w2ui-grid-body table .w2ui-head.w2ui-col-intersection{border-right-color:#72b2ff}.w2ui-grid .w2ui-grid-body table .w2ui-head.w2ui-reorder-cols-head:hover{cursor:move}.w2ui-grid .w2ui-grid-body table .w2ui-head .col-intersection-marker{padding:0;position:absolute;height:100%;top:0}.w2ui-grid .w2ui-grid-body table .w2ui-head .col-intersection-marker.left{left:0;margin-left:-5px}.w2ui-grid .w2ui-grid-body table .w2ui-head .col-intersection-marker.right{right:0;margin-right:-5px}.w2ui-grid .w2ui-grid-body table .w2ui-head .col-intersection-marker .top-marker{position:absolute;top:0;height:0;width:0;border-top:5px solid #72b2ff;border-left:5px solid transparent;border-right:5px solid transparent}.w2ui-grid .w2ui-grid-body table .w2ui-head .col-intersection-marker .bottom-marker{position:absolute;bottom:0;height:0;width:0;border-bottom:5px solid #72b2ff;border-left:5px solid transparent;border-right:5px solid transparent}.w2ui-grid .w2ui-grid-body table td{border-right:1px solid #d6d5d7;border-bottom:0 solid #d6d5d7;cursor:default;overflow:hidden}.w2ui-grid .w2ui-grid-body table td.w2ui-grid-data{margin:0;padding:0}.w2ui-grid .w2ui-grid-body table td.w2ui-grid-data>div{padding:3px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.w2ui-grid .w2ui-grid-body table td.w2ui-grid-data>div.flexible-record{height:auto;overflow:visible;white-space:normal}.w2ui-grid .w2ui-grid-body table td:last-child{border-right:0}.w2ui-grid .w2ui-grid-body table .w2ui-col-number{width:34px;color:#777;background-color:rgba(233,237,243,.5)}.w2ui-grid .w2ui-grid-body table .w2ui-col-number div{padding:0 7px 0 3px;text-align:right}.w2ui-grid .w2ui-grid-body table .w2ui-col-select{width:26px}.w2ui-grid .w2ui-grid-body table .w2ui-col-select div{padding:0;text-align:center;overflow:hidden}.w2ui-grid .w2ui-grid-body table .w2ui-col-select div input[type=checkbox]{margin-top:2px;position:relative}.w2ui-grid .w2ui-grid-body table .w2ui-col-expand{width:26px}.w2ui-grid .w2ui-grid-body table .w2ui-col-expand div{padding:0;text-align:center;font-weight:700}.w2ui-grid .w2ui-grid-body div.w2ui-col-header{height:auto!important;width:100%;overflow:hidden;padding-right:10px!important}.w2ui-grid .w2ui-grid-body div.w2ui-col-header>div.w2ui-sort-up{border:4px solid transparent;border-bottom:5px solid #8D99A7;margin-top:-2px;margin-right:-7px;float:right}.w2ui-grid .w2ui-grid-body div.w2ui-col-header>div.w2ui-sort-down{border:4px solid transparent;border-top:5px solid #8D99A7;margin-top:2px;margin-right:-7px;float:right}.w2ui-grid .w2ui-grid-body .w2ui-col-group{text-align:center}.w2ui-grid .w2ui-changed{background:url(data:image/gif;base64,R0lGODlhCgAKAJEAALAABf///wAAAAAAACH5BAEAAAIALAAAAAAKAAoAAAIPlI8Hy8mbxIsSUnup3rQAADs=) no-repeat top right}.w2ui-grid .w2ui-editable{overflow:hidden;height:100%!important;margin:0!important;padding:0!important}.w2ui-grid .w2ui-editable input{border:0;border-radius:0;margin:0;padding:4px 3px;width:100%;height:100%}.w2ui-grid .w2ui-editable input.w2ui-select{outline:0!important;background:#fff}.w2ui-grid .w2ui-grid-summary{position:absolute;box-shadow:0 -1px 4px #aaa}.w2ui-grid .w2ui-grid-summary table{color:inherit}.w2ui-grid .w2ui-grid-summary table .w2ui-odd{background-color:#eef5eb}.w2ui-grid .w2ui-grid-summary table .w2ui-even{background-color:#f8fff5}.w2ui-grid .w2ui-grid-footer{position:absolute;margin:0;padding:0;text-align:center;height:24px;overflow:hidden;user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;-o-user-select:text;box-shadow:0 -1px 4px #eee;color:#444;background-color:#f8f8f8;border-top:1px solid #ddd;border-bottom-left-radius:2px;border-bottom-right-radius:2px}.w2ui-grid .w2ui-grid-footer .w2ui-footer-left{float:left;padding-top:5px;padding-left:5px}.w2ui-grid .w2ui-grid-footer .w2ui-footer-right{float:right;padding-top:5px;padding-right:5px}.w2ui-grid .w2ui-grid-footer .w2ui-footer-center{padding:2px;text-align:center}.w2ui-grid .w2ui-grid-footer .w2ui-footer-center .w2ui-footer-nav{width:110px;margin:0 auto;padding:0;text-align:center}.w2ui-grid .w2ui-grid-footer .w2ui-footer-center .w2ui-footer-nav input[type=text]{padding:1px 2px 2px;border-radius:3px;width:40px;text-align:center}.w2ui-grid .w2ui-grid-footer .w2ui-footer-center .w2ui-footer-nav a.w2ui-footer-btn{display:inline-block;border-radius:3px;cursor:pointer;font-size:11px;line-height:16px;padding:1px 5px;width:30px;height:18px;margin-top:-1px;color:#000;background-color:transparent}.w2ui-grid .w2ui-grid-footer .w2ui-footer-center .w2ui-footer-nav a.w2ui-footer-btn:hover{color:#000;background-color:#aec8ff}.w2ui-ss .w2ui-grid-body .w2ui-grid-records table tr.w2ui-odd,.w2ui-ss .w2ui-grid-body .w2ui-grid-records table tr.w2ui-even,.w2ui-ss .w2ui-grid-body .w2ui-grid-records table tr.w2ui-odd:hover,.w2ui-ss .w2ui-grid-body .w2ui-grid-records table tr.w2ui-even:hover{background-color:inherit}.w2ui-ss .w2ui-grid-records table td{border-right-width:1px;border-bottom:1px solid #efefef}.w2ui-ss .w2ui-grid-records table tr:first-child td{border-bottom:0}.w2ui-ss .w2ui-grid-body .w2ui-grid-records table tr.w2ui-selected,.w2ui-ss .w2ui-grid-body .w2ui-grid-records table tr td.w2ui-selected{background-color:#EEF4FE!important}.w2ui-ss .w2ui-changed{background:inherit}.w2ui-ss .w2ui-grid-body .w2ui-selection{position:absolute;border:2px solid #6299DA;pointer-events:none}.w2ui-ss .w2ui-grid-body .w2ui-selection .w2ui-selection-resizer{cursor:crosshair;position:absolute;bottom:0;right:0;width:6px;height:6px;margin-right:-3px;margin-bottom:-3px;background-color:#457FC2;border:.5px solid #fff;outline:1px solid #fff;pointer-events:auto}.w2ui-overlay .w2ui-select-field{padding:8px 5px;cursor:default}.w2ui-overlay .w2ui-select-field table{font-size:11px;font-family:Verdana,Arial,sans-serif;border-spacing:0;border-collapse:border-collapse}.w2ui-overlay .w2ui-select-field table tr:hover{background-color:#b6d5ff}.w2ui-overlay .w2ui-select-field table td:nth-child(1){padding:3px 3px 3px 6px}.w2ui-overlay .w2ui-select-field table td:nth-child(1) input{margin:3px 2px 2px}.w2ui-overlay .w2ui-select-field table td:nth-child(2){padding:3px 15px 3px 3px}.w2ui-overlay .w2ui-col-on-off{padding:4px 0}.w2ui-overlay .w2ui-col-on-off table{border-spacing:0;border-collapse:border-collapse}.w2ui-overlay .w2ui-col-on-off table tr:hover{background-color:#b6d5ff}.w2ui-overlay .w2ui-col-on-off table td input[type=checkbox]{margin:3px 2px 2px}.w2ui-overlay .w2ui-col-on-off table td label{display:block;padding:3px 0;padding-right:10px}.w2ui-overlay .w2ui-col-on-off table td:first-child{padding:4px 0 4px 6px}.w2ui-overlay .w2ui-col-on-off table td:last-child{padding:4px 6px 4px 0}.w2ui-overlay .w2ui-grid-searches{text-align:left;padding:0;border-top:0;background-color:#f7f6f0}.w2ui-overlay .w2ui-grid-searches table{padding:4px;padding-top:12px;border-collapse:border-collapse}.w2ui-overlay .w2ui-grid-searches table td{padding:4px}.w2ui-overlay .w2ui-grid-searches table td.close-btn{width:20px;padding-right:20px}.w2ui-overlay .w2ui-grid-searches table td.close-btn button{min-width:24px;height:24px;padding-top:6px!important}.w2ui-overlay .w2ui-grid-searches table td.caption{text-align:right;padding-right:5px;border-right:1px solid #e8e8e3}.w2ui-overlay .w2ui-grid-searches table td.operator{text-align:left;padding:0 10px;padding-right:5px;border-right:1px solid #e8e8e3}.w2ui-overlay .w2ui-grid-searches table td.operator select{width:100%;color:#000;padding:0 15px 0 5px;-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;-o-appearance:none;background-image:-webkit-linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background-image:-moz-linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background-image:-ms-linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background-image:-o-linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background-image:linear-gradient(top,#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%)}.w2ui-overlay .w2ui-grid-searches table td.operator select::-ms-expand{display:none}.w2ui-overlay .w2ui-grid-searches table td.value{padding-right:5px;padding-left:5px}.w2ui-overlay .w2ui-grid-searches table td.value input[type=text]{border-radius:3px;padding:3px;margin-right:3px;height:23px}.w2ui-overlay .w2ui-grid-searches table td.value select{padding:3px;margin-right:3px;height:23px}.w2ui-overlay .w2ui-grid-searches table td.actions{border-right:0}.w2ui-overlay .w2ui-grid-searches table td.actions>div{margin:-7px;margin-top:15px;padding:13px 0;text-align:center;background-color:#efefe9;border-top:1px solid #e8e8e3}.w2ui-popup{position:fixed;z-index:1600;overflow:hidden;font-family:Verdana,Arial,sans-serif;border-radius:6px;padding:0;margin:0;border:1px solid #777;background-color:#eee;box-shadow:0 0 25px #555}.w2ui-popup,.w2ui-popup *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box}.w2ui-popup .w2ui-msg-title{padding:6px;border-radius:6px 6px 0 0;background-image:-webkit-linear-gradient(#ececec,#dfdfdf);background-image:-moz-linear-gradient(#ececec,#dfdfdf);background-image:-ms-linear-gradient(#ececec,#dfdfdf);background-image:-o-linear-gradient(#ececec,#dfdfdf);background-image:linear-gradient(#ececec,#dfdfdf);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ffececec', endColorstr='#ffdfdfdf', GradientType=0);border-bottom:2px solid #bfbfbf;position:absolute;overflow:hidden;height:32px;left:0;right:0;top:0;text-overflow:ellipsis;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;cursor:move;font-size:15px;color:#555;z-index:300}.w2ui-popup .w2ui-msg-button{float:right;width:18px;height:18px;cursor:pointer;overflow:hidden;padding:0;margin:0 3px 0 0;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAj1JREFUeNrslr9rFFEQxz/zZi/qxSgW2lsqkiYoBku5Ro1o4UFKEYkgSaxSCLYqdv5IEVPYCMJJwERWrK0CKhoQ8hdobQTjXW7njcXlYnLunQQu0YDTLOy+Nzvfme98Z8Td2ckW2OGWdMvRvYfT/RGfBPoBBVpLK0AEPgVkdGL06vt/CoB5nBaRE8AXYKXNsQIwaB4fAwOtH+88mn4m7ifN4vUYebWBKkFKqjIV3N9NjI2Uuw5ARI45fBanH+F77iFnN8JHETmS68P9NHBQNTwHL8foaSN4SqoyA/SZyL4tqQAQBVYCLOFYlNxmq0WorVLpN9Oe5LKt1CsgRVWpAOfB66phBuhTkepSdfnKVjaxNJMSWn/iawmTtpeDp6pWBpaBoqrMqoYU6AOqIbFhxGa3R4V8nfNNKLUESzXJhoCvQC+wF/gW1C5IiC+2XUbD5jA3rd4C26NR3945IA2iRzqRJgdElJJlSQocAKrAD2A/6Ev3cLajjN59MDWHyKl2voOI1zKbv3Xj2lCHJFoz+LXuBoIAjnUklEvJrDDT5LwmdhG8blkyBxRjXSu4loE0X4VEznXKV3SnoOFMB7YUolBcbcKNdxuPXUBPu8pbLXsK0ghebVjEXgNoYmXLtGLuxd6ePU+AQ20AaIrb4DpFycmSv81/7YsiMgAstB1kQgE47O4LuQmCNwGOB7VxCb/URsRSTbhkmU4ifGiZHd1Z5m7fnxoIQSaBo39YJRZj9LGb4yPzXWm1/9voX7afAwAC5tacDTA2XgAAAABJRU5ErkJggg==) no-repeat center left;background-position:0 0;color:transparent!important;border-radius:3px;border:1px solid transparent}.w2ui-popup .w2ui-msg-close{margin-top:0;background-position:-32px 0}.w2ui-popup .w2ui-msg-close:hover{background-color:#ccc;border:1px solid #aaa}.w2ui-popup .w2ui-msg-max{background-position:-16px 0}.w2ui-popup .w2ui-msg-max:hover{background-color:#ccc;border:1px solid #aaa}.w2ui-popup .w2ui-box1,.w2ui-popup .w2ui-box2{position:absolute;left:0;right:0;top:32px;bottom:55px;z-index:100}.w2ui-popup .w2ui-msg-body{font-size:13px;line-height:130%;padding:0 7px 7px;color:#000;background-color:#eee;position:absolute;overflow:auto;width:100%;height:100%}.w2ui-popup .w2ui-popup-message{position:absolute;z-index:250;background-color:#f9f9f9;border:1px solid #999;box-shadow:0 0 15px #aaa;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box;border-top:0;border-radius:0 0 6px 6px;overflow:auto}.w2ui-popup .w2ui-msg-buttons{padding:12px;border-radius:0 0 6px 6px;border-top:1px solid #d5d8d8;background-color:#f1f1f1;text-align:center;position:absolute;overflow:hidden;height:52px;left:0;right:0;bottom:0;z-index:200}.w2ui-popup .w2ui-msg-no-title{border-top-left-radius:6px;border-top-right-radius:6px;top:0!important}.w2ui-popup .w2ui-msg-no-buttons{border-bottom-left-radius:6px;border-bottom-right-radius:6px;bottom:0!important}.w2ui-sidebar{cursor:default;overflow:hidden!important;background-color:#edf1f6!important;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box}.w2ui-sidebar *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box}.w2ui-sidebar>div{position:relative;overflow:hidden}.w2ui-sidebar .w2ui-sidebar-top{position:absolute;z-index:2;top:0;left:0;right:0}.w2ui-sidebar .w2ui-sidebar-bottom{position:absolute;z-index:2;bottom:0;left:0;right:0}.w2ui-sidebar .w2ui-sidebar-div{position:absolute;z-index:1;overflow:auto;top:0;bottom:0;left:0;right:0;padding:2px 0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.w2ui-sidebar .w2ui-sidebar-div table{width:100%}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node{background-color:#edf1f6;border-top:1px solid transparent;border-bottom:1px solid transparent;margin:0;padding:1px 0}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node table{pointer-events:none}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node .w2ui-node-caption,.w2ui-sidebar .w2ui-sidebar-div .w2ui-node .w2ui-node-image,.w2ui-sidebar .w2ui-sidebar-div .w2ui-node .w2ui-node-image>span,.w2ui-sidebar .w2ui-sidebar-div .w2ui-node td.w2ui-node-dots{color:#000;text-shadow:0 0 0 #fff;pointer-events:none}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node .w2ui-node-caption:hover,.w2ui-sidebar .w2ui-sidebar-div .w2ui-node .w2ui-node-image:hover,.w2ui-sidebar .w2ui-sidebar-div .w2ui-node .w2ui-node-image>span:hover,.w2ui-sidebar .w2ui-sidebar-div .w2ui-node td.w2ui-node-dots:hover{color:inherit}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node:hover{border-top:1px solid #f9f9f9;border-bottom:1px solid #f9f9f9;background-color:#d7e1ef}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node .w2ui-node-image{width:22px;text-align:center;pointer-events:none}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node .w2ui-node-image>span{color:#516173!important}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node input{pointer-events:auto}.w2ui-sidebar .w2ui-sidebar-div .w2ui-selected,.w2ui-sidebar .w2ui-sidebar-div .w2ui-selected:hover{background-image:-webkit-linear-gradient(#69b1e0,#4a96d3);background-image:-moz-linear-gradient(#69b1e0,#4a96d3);background-image:-ms-linear-gradient(#69b1e0,#4a96d3);background-image:-o-linear-gradient(#69b1e0,#4a96d3);background-image:linear-gradient(#69b1e0,#4a96d3);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ff69b1e0', endColorstr='#ff4a96d3', GradientType=0);border-top:1px solid #5295cd;border-bottom:1px solid #2661a6}.w2ui-sidebar .w2ui-sidebar-div .w2ui-selected .w2ui-node-caption,.w2ui-sidebar .w2ui-sidebar-div .w2ui-selected:hover .w2ui-node-caption,.w2ui-sidebar .w2ui-sidebar-div .w2ui-selected .w2ui-node-image,.w2ui-sidebar .w2ui-sidebar-div .w2ui-selected:hover .w2ui-node-image,.w2ui-sidebar .w2ui-sidebar-div .w2ui-selected .w2ui-node-image>span,.w2ui-sidebar .w2ui-sidebar-div .w2ui-selected:hover .w2ui-node-image>span,.w2ui-sidebar .w2ui-sidebar-div .w2ui-selected td.w2ui-node-dots,.w2ui-sidebar .w2ui-sidebar-div .w2ui-selected:hover td.w2ui-node-dots{color:#fff!important;text-shadow:1px 1px 2px #666!important}.w2ui-sidebar .w2ui-sidebar-div .w2ui-disabled,.w2ui-sidebar .w2ui-sidebar-div .w2ui-disabled:hover{background:transparent!important;border-top:1px solid transparent;border-bottom:1px solid transparent}.w2ui-sidebar .w2ui-sidebar-div .w2ui-disabled .w2ui-node-caption,.w2ui-sidebar .w2ui-sidebar-div .w2ui-disabled:hover .w2ui-node-caption,.w2ui-sidebar .w2ui-sidebar-div .w2ui-disabled .w2ui-node-image,.w2ui-sidebar .w2ui-sidebar-div .w2ui-disabled:hover .w2ui-node-image,.w2ui-sidebar .w2ui-sidebar-div .w2ui-disabled .w2ui-node-image>span,.w2ui-sidebar .w2ui-sidebar-div .w2ui-disabled:hover .w2ui-node-image>span,.w2ui-sidebar .w2ui-sidebar-div .w2ui-disabled td.w2ui-node-dots,.w2ui-sidebar .w2ui-sidebar-div .w2ui-disabled:hover td.w2ui-node-dots{opacity:.4;filter:alpha(opacity=40);color:#000!important;text-shadow:0 0 0 #fff!important}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node-caption{white-space:nowrap;padding:5px 0 5px 3px;margin:1px 0 1px 22px;position:relative;z-index:1;font-size:12px}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node-group{white-space:nowrap;overflow:hidden;padding:10px 0 10px 10px;margin:0;cursor:default;color:#868b92;background-color:transparent}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node-group :nth-child(1){margin-right:10px;float:right;color:transparent}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node-group :nth-child(2){font-weight:400;text-transform:uppercase}.w2ui-sidebar .w2ui-sidebar-div .w2ui-node-sub{overflow:hidden}.w2ui-sidebar .w2ui-sidebar-div td.w2ui-node-dots{width:18px;padding:0 0 1px 7px;text-align:center}.w2ui-sidebar .w2ui-sidebar-div td.w2ui-node-dots .w2ui-expand{width:16px;margin-top:-3px;pointer-events:auto}.w2ui-sidebar .w2ui-sidebar-div td.w2ui-node-data{padding:1px 1px 3px}.w2ui-sidebar .w2ui-sidebar-div td.w2ui-node-data .w2ui-node-image{padding:3px 0 0;float:left}.w2ui-sidebar .w2ui-sidebar-div td.w2ui-node-data .w2ui-node-image>span{font-size:16px;color:#000;text-shadow:0 0 0 #fff}.w2ui-sidebar .w2ui-sidebar-div td.w2ui-node-data .w2ui-node-image.w2ui-icon{margin-top:3px}.w2ui-sidebar .w2ui-sidebar-div td.w2ui-node-data .w2ui-node-count{float:right;border:1px solid #9da4af;border-radius:20px;width:auto;height:18px;padding:2px 7px;margin:3px 4px -2px 0;background-color:#e7f0fc;color:#667274;box-shadow:0 0 2px #fff;text-shadow:1px 1px 1px #e6e6e6;position:relative;z-index:2}.w2ui-tabs{cursor:default;overflow:hidden!important;background-color:#fafafa;padding:3px 0;padding-bottom:0!important}.w2ui-tabs table{border-bottom:1px solid silver;padding:0 7px}.w2ui-tabs .w2ui-tab{padding:6px 20px;text-align:center;color:#000;background-color:transparent;border:1px solid silver;border-bottom:1px solid silver;white-space:nowrap;margin:1px 1px -1px 0;border-top-left-radius:4px;border-top-right-radius:4px;cursor:default}.w2ui-tabs .w2ui-tab.active{color:#000;background-color:#fff;border:1px solid silver;border-bottom:1px solid transparent}.w2ui-tabs .w2ui-tab.closable{padding:6px 28px 6px 20px}.w2ui-tabs .w2ui-tab-close{color:#555;text-shadow:1px 1px 1px #bbb;float:right;margin:6px 4px 0 0;padding:0 0 0 5px;width:16px;height:16px;opacity:.9;border:0;border-top:3px solid transparent;border-radius:9px}.w2ui-tabs .w2ui-tab-close:hover{background-color:#D77F7F;color:#fff}.w2ui-tabs .w2ui-tab-close:before{position:relative;top:-2px;left:0;opacity:.6;color:inherit;text-shadow:inherit;content:'x'}.w2ui-toolbar{margin:0;padding:2px;outline:0;background-color:#efefef;overflow:hidden!important;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.w2ui-toolbar .disabled{opacity:.3;filter:alpha(opacity=30)}.w2ui-toolbar table{table-layout:auto!important}.w2ui-toolbar table td{border:0!important}.w2ui-toolbar table.w2ui-button{margin:0 1px;border-radius:4px;height:24px;border:1px solid transparent;background-color:transparent}.w2ui-toolbar table.w2ui-button .w2ui-tb-image{width:16px;height:16px;padding:0;margin:2px 4px 3px 3px!important;border:0!important;text-align:center}.w2ui-toolbar table.w2ui-button .w2ui-tb-image>span{font-size:15px;margin-top:3px;display:block;color:#8d99a7}.w2ui-toolbar table.w2ui-button .w2ui-tb-caption{color:#000;padding:0 4px 0 2px}.w2ui-toolbar table.w2ui-button .w2ui-tb-count{padding:0 4px 0 0}.w2ui-toolbar table.w2ui-button .w2ui-tb-count>span{border:1px solid #9da4af;border-radius:20px;width:auto;height:18px;padding:2px 7px;background-color:#e7f0fc;color:#667274;box-shadow:0 0 2px #fff;text-shadow:1px 1px 1px #e6e6e6}.w2ui-toolbar table.w2ui-button .w2ui-tb-down{padding:3px}.w2ui-toolbar table.w2ui-button .w2ui-tb-down>div{border:4px solid transparent;border-top:5px solid #8D99A7;margin-top:5px}.w2ui-toolbar table.w2ui-button.over{border:1px solid #ccc;background-color:#eee}.w2ui-toolbar table.w2ui-button.over .w2ui-tb-caption{color:#000}.w2ui-toolbar table.w2ui-button.down{border:1px solid #aaa;background-color:#ddd}.w2ui-toolbar table.w2ui-button.down .w2ui-tb-caption{color:#666}.w2ui-toolbar table.w2ui-button.checked{border:1px solid #aaa;background-color:#fff}.w2ui-toolbar table.w2ui-button.checked .w2ui-tb-caption{color:#000}.w2ui-toolbar table.w2ui-button table{height:17px;border-radius:4px;cursor:default}.w2ui-toolbar .w2ui-break{background-image:-webkit-linear-gradient(top,rgba(153,153,153,.1) 0,#999 40%,#999 60%,rgba(153,153,153,.1) 100%);background-image:-moz-linear-gradient(top,rgba(153,153,153,.1) 0,#999 40%,#999 60%,rgba(153,153,153,.1) 100%);background-image:-ms-linear-gradient(top,rgba(153,153,153,.1) 0,#999 40%,#999 60%,rgba(153,153,153,.1) 100%);background-image:-o-linear-gradient(top,rgba(153,153,153,.1) 0,#999 40%,#999 60%,rgba(153,153,153,.1) 100%);background-image:linear-gradient(top,rgba(153,153,153,.1) 0,#999 40%,#999 60%,rgba(153,153,153,.1) 100%);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ff999999', endColorstr='#ff999999', GradientType=0);width:1px!important;height:22px;padding:0;margin:0 6px}.w2ui-listview{overflow:auto!important;background-color:#fff!important;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box}.w2ui-listview *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box}.w2ui-listview>ul{list-style-type:none;margin:0;cursor:default}.w2ui-listview>ul>li{display:inline-block;vertical-align:top;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;border:1px solid transparent;border-radius:4px}.w2ui-listview>ul>li.w2ui-focused{border:1px solid #2661a6}.w2ui-listview>ul>li.w2ui-selected{border:1px solid #2661a6}.w2ui-listview>ul>li.w2ui-selected,.w2ui-listview>ul>li.w2ui-selected.hover{background-image:-webkit-linear-gradient(#69b1e0,#4a96d3);background-image:-moz-linear-gradient(#69b1e0,#4a96d3);background-image:-ms-linear-gradient(#69b1e0,#4a96d3);background-image:-o-linear-gradient(#69b1e0,#4a96d3);background-image:linear-gradient(#69b1e0,#4a96d3);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ff69b1e0', endColorstr='#ff4a96d3', GradientType=0)}.w2ui-listview>ul>li.w2ui-selected>div>div.caption,.w2ui-listview>ul>li.w2ui-selected.hover>div>div.caption{color:#fff}.w2ui-listview>ul>li.w2ui-selected>div>div.description,.w2ui-listview>ul>li.w2ui-selected.hover>div>div.description{color:#ddd}.w2ui-listview>ul>li.w2ui-selected>div>div.extra>div>div,.w2ui-listview>ul>li.w2ui-selected.hover>div>div.extra>div>div{color:#ddd}.w2ui-listview>ul>li.hover{background-color:#d7e1ef;border:1px solid #2661a6}.w2ui-listview>ul>li div{vertical-align:middle}.w2ui-listview>ul>li>div>div.caption{display:block;text-align:center;word-wrap:break-word;max-height:50px;color:#000;font-size:12px}.w2ui-listview>ul>li>div>div.description{display:none;text-align:left;color:#777;font-size:12px}.w2ui-listview>ul>li>div>div.extra{display:none}.w2ui-listview>ul>li>div>div.extra>div>div{color:#777}.w2ui-icon-small>ul{padding:1px 0 0 1px}.w2ui-icon-small>ul>li{margin:0 1px 1px 0;padding:2px;width:250px;white-space:nowrap}.w2ui-icon-small>ul>li>div>div.w2ui-listview-img{display:inline-block;width:26px;height:22px;font-size:21px;margin-right:2px}.w2ui-icon-small>ul>li>div>div.caption{display:inline-block}.w2ui-icon-medium>ul{padding:4px 0 0 4px}.w2ui-icon-medium>ul>li{margin:0 4px 4px 0;padding:4px;width:100px}.w2ui-icon-medium>ul>li>div>div.w2ui-listview-img{display:block;width:92px;height:60px;font-size:57px;margin-left:auto;margin-right:auto;background-position:center}.w2ui-icon-large>ul{padding:4px 0 0 4px}.w2ui-icon-large>ul>li{margin:0 4px 4px 0;padding:4px;width:160px}.w2ui-icon-large>ul>li>div>div.w2ui-listview-img{display:block;width:152px;height:120px;font-size:114px;margin-left:auto;margin-right:auto;background-position:center}.w2ui-icon-tile>ul{padding:1px 0 0 1px}.w2ui-icon-tile>ul>li{margin:0 1px 1px 0;padding:4px;width:250px;white-space:nowrap}.w2ui-icon-tile>ul>li>div>div.w2ui-listview-img{display:inline-block;width:72px;height:60px;font-size:57px;float:left;margin-right:4px}.w2ui-icon-tile>ul>li>div>div.caption{text-align:left}.w2ui-icon-tile>ul>li>div>div.description{display:block}.w2ui-table>ul{padding:0}.w2ui-table>ul>li{width:100%;padding:2px;border-radius:0;border-bottom:1px dotted #d3d3d3}.w2ui-table>ul>li>div{display:inline-block;position:relative;width:100%;white-space:nowrap;overflow:hidden}.w2ui-table>ul>li>div>div.w2ui-listview-img{display:inline-block;width:38px;height:32px;font-size:31px;margin-right:2px}.w2ui-table>ul>li>div>div.caption{display:inline-block}.w2ui-table>ul>li>div>div.extra{display:inline-block;position:absolute;right:0;height:100%;background-color:#fff}.w2ui-table>ul>li>div>div.extra>div:before{display:inline-block;height:100%;width:0;content:'';vertical-align:middle}.w2ui-table>ul>li>div>div.extra>div{display:inline}.w2ui-table>ul>li>div>div.extra>div>div{display:inline-block;font-size:12px}.w2ui-table>ul>li.w2ui-selected div.extra,.w2ui-table>ul>li.w2ui-selected.hover div.extra{background-image:-webkit-linear-gradient(#69b1e0,#4a96d3);background-image:-moz-linear-gradient(#69b1e0,#4a96d3);background-image:-ms-linear-gradient(#69b1e0,#4a96d3);background-image:-o-linear-gradient(#69b1e0,#4a96d3);background-image:linear-gradient(#69b1e0,#4a96d3);filter:progid:dximagetransform.microsoft.gradient(startColorstr='#ff69b1e0', endColorstr='#ff4a96d3', GradientType=0)}.w2ui-table>ul>li.hover div.extra{background-color:#d7e1ef}.w2ui-listview>ul>li div.icon-none{border:1px solid rgba(102,102,102,.35)}", ""]);

	// exports


/***/ },

/***/ 121:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },

/***/ 122:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }

});