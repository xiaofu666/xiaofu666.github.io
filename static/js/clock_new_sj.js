function getServerDate2()
{
	var dateObj;
    $.ajax({
		url: "http://m.tools.manmankan.com/gettime.php",
		data: {'timeZone': 8},
		dataType: 'json',
		async: false,
		success: function(data){
			dateObj = data;
		}
    });
    return dateObj;
}
var weekdayArr= ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
var clshicha = {0:'-21600000',1:'-25200000',2:'-25200000',3:'-25200000',4:'3600000'};
// var timestamp1 = getServerDate2();
var timestamp1 = Date.parse(new Date());
timestamp1=timestamp1+1000;
(function(){
	window.onload=initNumXY(75, 60, 40,40);
	var hour_line = document.getElementById("hour-line");
	var minute_line = document.getElementById("minute-line");
	var second_line = document.getElementById("second-line");
	var hour_time = document.getElementById("hour-time");
	var minute_time = document.getElementById("minute-time");
	var second_time = document.getElementById("second-time");	
	
	var year_time = document.getElementById("year-time");
	var month_time = document.getElementById("month-time");
	var day_time = document.getElementById("day-time");
	var weekday_time = document.getElementById("weekday-time");
	function setTime()
	{
		var this_day = new Date(timestamp1); 
		var hour = (this_day.getHours() >= 12) ? (this_day.getHours() - 12) : this_day.getHours();
		var minute = this_day.getMinutes();
		var second = this_day.getSeconds();
		var hour_rotate = (hour*30-90) + (Math.floor(minute / 12) * 6);
		var year = this_day.getFullYear();
		var month = ((this_day.getMonth() + 1) < 10 ) ? "0"+(this_day.getMonth() + 1) : (this_day.getMonth() + 1);
		var date = (this_day.getDate() < 10 ) ? "0"+this_day.getDate() : this_day.getDate();
		var day = this_day.getDay();
		hour_line.style.transform = 'rotate(' + hour_rotate + 'deg)';
		minute_line.style.transform = 'rotate(' + (minute*6 - 90) + 'deg)';
		second_line.style.transform = 'rotate(' + (second*6 - 90)+'deg)';
		hour_time.innerHTML = (this_day.getHours() < 10) ? "0" + this_day.getHours() : this_day.getHours();
		minute_time.innerHTML = (this_day.getMinutes() < 10) ? "0" + this_day.getMinutes() : this_day.getMinutes();
		second_time.innerHTML = (this_day.getSeconds() < 10) ? "0" + this_day.getSeconds():this_day.getSeconds();
		year_time.innerHTML = year;
		month_time.innerHTML = month;
		day_time.innerHTML = date;
		weekday_time.innerHTML = weekdayArr[day];		
		if(this_day)
	  	{
			for(var keyw in clshicha)
			{
				var dateObj2 = new Date(timestamp1+Number(clshicha[keyw]));
				var schour = (dateObj2.getHours() < 10) ? "0" + dateObj2.getHours() : dateObj2.getHours();
				var scminutes = (dateObj2.getMinutes() < 10) ? "0" + dateObj2.getMinutes() : dateObj2.getMinutes();
				var nowckz=schour+":"+scminutes;
				$('.Clockk'+keyw).html(nowckz);
			}
	  	}
		timestamp1=timestamp1+1000;
		
		//本地时间
		var this_local = new Date();
		document.getElementById("local_hour").innerHTML = (this_local.getHours() < 10) ? "0" + this_local.getHours() : this_local.getHours();
		document.getElementById("local_minute").innerHTML = (this_local.getMinutes() < 10) ? "0" + this_local.getMinutes() : this_local.getMinutes();
		document.getElementById("local_second").innerHTML = (this_local.getSeconds() < 10) ? "0" + this_local.getSeconds():this_local.getSeconds();
		document.getElementById("local_year").innerHTML = this_local.getFullYear();
		document.getElementById("local_month").innerHTML = ((this_local.getMonth() + 1) < 10 ) ? "0"+(this_local.getMonth() + 1) : (this_local.getMonth() + 1);
		document.getElementById("local_day").innerHTML = (this_local.getDate() < 10 ) ? "0"+this_local.getDate() : this_local.getDate();
		document.getElementById("local_weekday").innerHTML = weekdayArr[this_local.getDay()];
	}
	setInterval(setTime, 1000);

	function initNumXY(R, r, w, h)
	{
		var numXY = [
			{
			 "left" : R + 0.5 * r - 0.5 * w, 
			 "top" : R - 0.5 * r * 1.73205 - 0.5 * h
			},
			{
			 "left" : R + 0.5 * r * 1.73205 - 0.5 * w, 
			 "top" : R - 0.5 * r - 0.5 * h
			},
			{
			 "left" : R + r - 0.5 * w, 
			 "top" : R - 0.5 * h
			},
			{
			 "left" : R + 0.5 * r * 1.73205 - 0.5 * w, 
			 "top" : R + 0.5 * r - 0.5 * h
			},
			{
			 "left" : R + 0.5 * r - 0.5 * w, 
			 "top" : R + 0.5 * r * 1.732 - 0.5 * h
			},
			{
			 "left" : R - 0.5 * w, 
			 "top" : R + r - 0.5 * h
			},
			{
			 "left" : R - 0.5 * r - 0.5 * w, 
			 "top" : R + 0.5 * r * 1.732 - 0.5 * h
			},
			{
			 "left" : R - 0.5 * r * 1.73205 - 0.5 * w, 
			 "top" : R + 0.5 * r - 0.5 * h
			},
			{
			 "left" : R - r - 0.5 * w, 
			 "top" : R - 0.5 * h
			},
			{
			 "left" : R - 0.5 * r * 1.73205 - 0.5 * w, 
			 "top" : R - 0.5 * r - 0.5 * h
			},
			{
			 "left" : R - 0.5 * r - 0.5 * w, 
			 "top": R - 0.5 * r * 1.73205 - 0.5 * h
			},
			{
			 "left" : R - 0.5 * w, 
			 "top" : R - r - 0.5 * h
			}
		];
		var clock = document.getElementById("clock");
		for(var i = 1; i <= 12; i++){
			if(i%3 == 0) {
				clock.innerHTML += "<div class='clock-num em_num'>"+i+"</div>";
			} else {
				clock.innerHTML += "<div class='clock-num'>" + i + "</div>";
			}
		}
		var clock_num = document.getElementsByClassName("clock-num");
		for(var i = 0; i < clock_num.length; i++) {
			clock_num[i].style.left = numXY[i].left + 'px';
			clock_num[i].style.top = numXY[i].top + 'px';
		}
		for(var i = 0; i < 60; i++) {
			clock.innerHTML += "<div class='clock-scale'> " + 
			"<div class='scale-hidden'></div>" + 
			"<div class='scale-show'></div>" + 
			"</div>";
		}
		var scale = document.getElementsByClassName("clock-scale");
		for(var i = 0; i < scale.length; i++) {
			scale[i].style.transform="rotate(" + (i * 6 - 90) + "deg)";
		}
	}
})();