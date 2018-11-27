
//utitlity from old version
let seeTime = function (value) {
	var h = Math.floor(value);
	var m = Math.round( 60 * (value - h) );
	var result = "";
	if (h != 0 || m != 0) {
		if (h == 0)
		{
			result += "0:";
		} else {
			result += sepDec(h, 0)+":";
		}
		if (m == 0)
		{
			result += "00";
		} else if (m < 10) {
			result += "0";
			result += m.toString();
		} else {
			result += m.toString();
		}
	} else {
		result = "-";
	}
	
	if (!value) result = '-';
	else if (value == 0) result = '0:00';

	return result;
}

let seeMWDHM = function  (value, ln) {
	var t = value;
	var month = Math.floor (t / 720);
	t -= month*720;
	var week = Math.floor(t / 168) ;
	t -= week*168;
	var day = Math.floor(t / 24);
	t -= day*24;
	var hour = Math.floor(t);
	t -= hour;
	var minute = Math.round( 60 * t );

	var result = "";
	if (month > 0) result += month.toString()+(ln=="ko" ? "개월" : "M")+" ";
	if (week > 0) result += week.toString()+(ln=="ko" ? "주" : "W")+" ";
	if (day > 0) result += day.toString()+(ln=="ko" ? "일" : "D")+" ";
	if (hour != 0 || minute != 0) {
		if (hour == 0) {
			result += "0:";
		} else {
			result += sepDec(hour, 0)+":";
		}
		
		if (minute == 0) {
			result += "00";
		} else if (minute < 10) {
			result += "0";
			result += minute.toString();
		} else {
			result += minute.toString();
		}
	}

	if (!value) result = '-';
	else if (value == 0) result = '0:00';

	return result;
}

let sepDec = function (value, n) {
	if (isNaN(value) || (typeof value).localeCompare("number") != 0 || value == 0 || value == "Infinity")
	{
		return "-";
	} else {
		var isNeg = false;
		var v = parseFloat(value).toFixed(n);
		if (v.charAt(0) == "-") {
			isNeg = true;
			v = v.substring(1, v.length);
		}
		var p = v.indexOf(".");
		if (n == 0)
		{
			p = v.length;
		}
		if (p>3)
		{
			var a = v.split("");
			v = "";
			for (var i = p; i < a.length ; i++)
			{
				v = v.concat(a[i]); 
			}
			a[p-1] = a[p-1].concat(v);
			var res = "";
			for (var i = 0; i < p; i++)
			{
				if (i%3 == 2 && p-i >= 2)
				{
					a[p-i-2] = a[p-i-2].concat(",", a[p-i-1]);
				} else if (i%3 == 2 && p-i == 1) {
					res = a[p-i-1];
				} else if (p-i >= 2) {
					a[p-i-2] = a[p-i-2].concat(a[p-i-1]);
				} else {
					res = a[p-i-1];
				}
			}
			if (isNeg) {
				return "-" + res;
			} else {
				return res;
			}
		} else {
			return v;
		}
	}
}

let float_format = function (n) {
  return function(v) { return sepDec(v, n); };
}

let percent = function (n) {
	return Math.round(n*10000)/100 + '%';
}