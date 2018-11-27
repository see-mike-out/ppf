let cmp_glb = {
  selected: "",
  country: null
};

let formatFunctions = {
  'time': null,
  'float(0)': float_format(0),
  'float(1)': float_format(1),
  'float(2)': float_format(2),
  'float(3)': float_format(3),
  'float(4)': float_format(2),
  'float(8)': float_format(2),
  'ratio(2)': ratio_format(2),
}

let theme_colors = {
  f: "#afbe00",
  m: "#bc34bb",
  b: "#2a2723"
}

let text_shadow = "-2px -2px 0px #ffffff, -2px -1px 0px #ffffff, -2px 0px 0px #ffffff, -2px 1px 0px #ffffff, -2px 2px 0px #ffffff, -1px -2px 0px #ffffff, -1px -1px 0px #ffffff, -1px 0px 0px #ffffff, -1px 1px 0px #ffffff, -1px 2px 0px #ffffff, 0px -2px 0px #ffffff, 0px -1px 0px #ffffff, 0px 1px 0px #ffffff, 0px 2px 0px #ffffff, 1px -2px 0px #ffffff, 1px -1px 0px #ffffff, 1px 0px 0px #ffffff, 1px 1px 0px #ffffff, 1px 2px 0px #ffffff, 2px -2px 0px #ffffff, 2px -1px 0px #ffffff, 2px 0px 0px #ffffff, 2px 1px 0px #ffffff, 2px 2px 0px #ffffff"

let create_country_list = function(pl, pl2, ln) {
  let place = $(pl);
  $.getJSON( "/wpmy/data/wpmy_data_" + ln + ".json" , function( data ){
    let country_list = [];
    for (let i = 0; i < data.length; i++) {
      country_list.push({
        category: data[i].category,
        name: data[i].name,
        abbr: data[i].abbr
      });
    }
    country_list.sort(function(a, b) {
      if (a.category == 'general' && b.category == 'summary') return 1;
      else if (a.category == 'summary' && b.category == 'general') return -1;
      else if (a.category == 'summary' && b.category == 'summary') {
        if (a.name > b.name) return 1;
        else if (a.name < b.name) return -1;
        else return 0;
      } else {
        if (a.name > b.name) return 1;
        else if (a.name < b.name) return -1;
        else return 0;
      }
    });
    for(let i = 0; i < country_list.length; i++) {
      let cell = $('<span>').text(country_list[i].name)
        .attr('id', "list-"+country_list[i].abbr)
        .click(function() { get_country_view(pl2, country_list[i].abbr, ln) });  
      place.append(cell);
    }
  });
}

let get_country_view = function(pl, key, ln) {
  $("span#list-"+cmp_glb.selected).attr('data-selected', 'false');
  cmp_glb.selected = key;
  $("span#list-"+key).attr('data-selected', 'true');
  
  $.getJSON( "/wpmy/data/wpmy_data_" + ln + ".json" , function( data ){
    
    let country = data.filter( function (e) { return e.abbr == key })[0];
		cmp_glb.country = country;
    $("#by_name").text(country.name);
    
    //curve
    let pl_curve = d3.select("#by_curve")
    draw_curve(pl_curve, country, ln);
    
    //table
    setTimeout(init_table, 100)
    set_table_value(country, ln);
    
    $("#country_view").attr("data-open", "true")
    
    init_calculator()
  });
}

let draw_curve = function(pl, dt, ln) {
  if ($("#country_view").has("svg").length == 0){
    init_curve(pl, dt, ln);
  } else {
    change_curve(pl, dt, ln);
  }
}

//globals for lines
let layout = {
  viewBox: '0 0 1000 400',
  w: 1000,
  h: 400,
  lines: {
    w: 999,
    h: 350,
    x: 0,
    y: 0,
    stroke: 2,
    uoc_opacity: 0.3,
    color: theme_colors
  },
  p_axis: {
    w: 999,
    h: 50,
    x: 0,
    y: 350,
    color: "#454545"
  },
	font: {
	  size: 12
	}
};

//line
let xScale;
let yScale;

//both
let line_b = d3.line()
  .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
  .y(function(d) { return yScale(d.b); }) // set the y values for the line generator 
  .curve(d3.curveMonotoneX) // apply smoothing to the line

//male
let line_m = d3.line()
  .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
  .y(function(d) { return yScale(d.m); }) // set the y values for the line generator 
  .curve(d3.curveMonotoneX) // apply smoothing to the line

//female
  let line_f = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.f); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line
//uoc b
 let area_bm = d3.area()
	.x(function(d,i) {return xScale(i); }) 
	.y0(function(d) { return yScale(d.b); })
	.y1(function(d) { return yScale(d.m); });
//uoc m
let area_mf = d3.area()
	.x(function(d,i) { return xScale(i); }) 
	.y0(function(d) { return yScale(d.m); })
	.y1(function(d) { return yScale(d.f); });
// uoc f
let area_f0 = d3.area()
	.x(function(d,i) { return xScale(i); }) 
	.y0(function(d) { return yScale(d.f); })
	.y1(function(d) { return yScale(0); });
 
let init_curve = function(pl, dt, ln) {
  //setting layout
  if (window.innerWidth < 1000) {
    layout.w = 500;
    layout.lines.w = 499;
    layout.p_axis.w = 499;
    layout.viewBox = "0 0 500 400"
  }
  
  xScale = d3.scaleLinear().rangeRound([0, layout.lines.w]).domain([0, 20]);
	yScale = d3.scaleLinear().rangeRound([layout.lines.h, 0]).domain([0, 1]);
  //data clearance
  let data_point = data_refine(dt);
  
  //plotting
  let plot = pl.append("svg").attr("id", "income_curve").attr("viewBox", layout.viewBox);
  //x axis
  let scale_percent = d3.scaleLinear().rangeRound([0, layout.p_axis.w]);
  let axis_percent = plot.append('g').attr('data-role', 'p-axis');
  let fmt = function (n) { return Math.round(n*10000)/100 + "%" }
  scale_percent.domain([0, 1]);
  axis_percent.attr("transform", "translate(" + layout.p_axis.x + ", " + layout.p_axis.y + ")");
  axis_percent.append("g")
      .attr("class", "axis axis--v")
      .call(d3.axisBottom(scale_percent).ticks(10).tickFormat(fmt))
      .append("text")
      .attr("dy", layout.font.size * 2.4)
      .attr("dx", 0)
      .style("font-size", layout.font.size)
      .attr("text-anchor", "start")
      .attr("class", "axis-name")
      .attr("fill", layout.p_axis.color)
      .text("Cumulative Share of Income from Lowest to Highest");
  axis_percent.selectAll("g.tick text")
      .attr("fill", layout.p_axis.color)
      .attr("text-anchor", function(d, i) {
        if(i == 0) return "start";
        else if (i == 10) return "end";
        else return "middle";
      })
  axis_percent.selectAll("line").attr("stroke", layout.p_axis.color);
  axis_percent.selectAll("path").attr("stroke", layout.p_axis.color);
  
  let line_area = plot.append("g").attr("id", "plot_line").attr("transform", "translate(" + layout.lines.x + ", " + layout.lines.y + ")");
 
  line_area.append("path").attr("id", "line_b")
    .datum(data_point)
    .attr("stroke", layout.lines.color.b)
    .attr("fill", "transparent")
    .attr("d", line_b);
  
  line_area.append("path").attr("id", "line_m")
    .datum(data_point)
    .attr("stroke", layout.lines.color.m)
    .attr("fill", "transparent")
    .attr("d", line_m);
    
  line_area.append("path").attr("id", "line_f")
    .datum(data_point)
    .attr("stroke", layout.lines.color.f)
    .attr("fill", "transparent")
    .attr("d", line_f);
    
  	
  line_area.append("path").attr("id", "area_bm")
    .datum(data_point)
  	.attr("fill", layout.lines.color.b)
  	.attr("opacity", layout.lines.uoc_opacity)
  	.attr("d", area_bm); 
  	
  line_area.append("path").attr("id", "area_mf")
    .datum(data_point)
  	.attr("fill", layout.lines.color.m)
  	.attr("opacity", layout.lines.uoc_opacity)
  	.attr("d", area_mf); 
  	
  line_area.append("path").attr("id", "area_f0")
    .datum(data_point)
  	.attr("fill", layout.lines.color.f)
  	.attr("opacity", layout.lines.uoc_opacity)
  	.attr("d", area_f0);
  
  //mark 100
  let mark100_area = plot.append("g").attr("id", "plot_mark100").attr("transform", "translate(" + layout.lines.x + ", " + layout.lines.y + ")");
  
  let vf = getCumulative(dt, 'f', 1000), vm = getCumulative(dt, 'm', 1000), vb = getCumulative(dt, 'b', 1000);
	let pf = matchByCumulative(dt, 'f', vf), pm = matchByCumulative(dt, 'm', vm), pb = matchByCumulative(dt, 'b', vb);
	
	let tf = (ln == "en" ? "Female" : "여성")+": "+float_format(0)(vf);
	let tm = (ln == "en" ? "Male" : "남성")+": "+float_format(0)(vm, 0);
	let tb = (ln == "en" ? "Both Sexes" : "전체")+": "+float_format(0)(vb, 0);
	
	let p100_mark_data = [
	  {y: data_point[20].f, t: tf},
	  {y: data_point[20].m, t: tm},
	  {y: data_point[20].b, t: tb}
	];
	
	let p100_mark = mark100_area.selectAll("text")
	  .data(p100_mark_data).enter().append("text");
	  
  p100_mark.attr("text-anchor", "end").attr("fill", "#333")
	  .attr("font-size", layout.font.size).attr("x", layout.lines.w)
	  .style("text-shadow", text_shadow).style("font-weight", "bold")
	  .attr("y", function(d){console.log(d); return  yScale(d.y) + layout.font.size * 1.2 }).text(function(d){return d.t});
	
	let equiv_area = plot.append("g").attr("id", "plot_equiv").attr("transform", "translate(" + layout.lines.x + ", " + layout.lines.y + ")");
	
	let p1 = getCumulative(dt, 'f', 1000), p2 = matchByCumulative(dt, 'm', p1), 
	    p3 = getCumulative(dt, 'm', p2), p4 = matchByCumulative(dt, 'b', p1);
	
	let max_for_equiv = getCumulative(dt, "b", 1000);
	let f100_point = p1/max_for_equiv, f100_to_m = p2/1000, f100_to_m_point = p3/max_for_equiv, f100_to_b = p4/1000;

	equiv_area.append("line").attr("id", "equiv_f_to_m").attr("stroke", "#ff0000")
	  .attr("x1", xScale(20)).attr("y1", yScale(f100_point))
	  .attr("x2", xScale(f100_to_m*20)).attr("y2", yScale(f100_point));
	  
	equiv_area.append("line").attr("id", "equiv_f_to_m_down").attr("stroke", "#ff0000").attr("stroke-dasharray", "2,2")
	  .attr("x1", xScale(f100_to_m*20)).attr("y1", yScale(f100_point))
	  .attr("x2", xScale(f100_to_m*20)).attr("y2", yScale(0));
	
	equiv_area.append("text").attr("id", "equiv_f_to_m_label")
	  .attr("font-size", layout.font.size).attr("x", layout.lines.w)
	  .style("text-shadow", text_shadow).style("font-weight", "bold")
	  .attr("fill", "#333")
	  .attr("x", xScale(f100_to_m*20)+5).attr("y", yScale(0)-5).attr("text-anchor", "start")
	  .text(ratio_format(1)(f100_to_m))
	  
	equiv_area.append("line").attr("id", "equiv_m_to_b").attr("stroke", "#0000ff")
	  .attr("x1", xScale(f100_to_m*20)).attr("y1", yScale(f100_to_m_point))
	  .attr("x2", xScale(f100_to_b*20)).attr("y2", yScale(f100_to_m_point));
	  
	equiv_area.append("line").attr("id", "equiv_m_to_b_down").attr("stroke", "#0000ff").attr("stroke-dasharray", "2,2")
	  .attr("x1", xScale(f100_to_b*20)).attr("y1", yScale(f100_to_m_point))
	  .attr("x2", xScale(f100_to_b*20)).attr("y2", yScale(0));
	  
	equiv_area.append("text").attr("id", "equiv_m_to_b_label")
	  .attr("font-size", layout.font.size).attr("x", layout.lines.w)
	  .style("text-shadow", text_shadow).style("font-weight", "bold")
	  .attr("fill", "#333")
	  .attr("x", xScale(f100_to_b*20)-5).attr("y", yScale(0)-5).attr("text-anchor", "end")
	  .text(ratio_format(1)(f100_to_b))
	  
	//legend
	let legend = plot.append("g").attr("id", "plot_legend").attr("transform", "translate(5,5)");
	legend.append("rect").attr("width", layout.font.size).attr("height", layout.font.size)
	  .attr("x", 0).attr("y", 0).attr("fill", layout.lines.color.f)
	legend.append("text").attr("fill", "#333").attr("dx", layout.font.size*1.5).attr("dy", layout.font.size).text(ln == "en" ? "Female" : "여성")
	
	legend.append("rect").attr("width", layout.font.size).attr("height", layout.font.size)
	  .attr("x", 0).attr("y", layout.font.size + 5).attr("fill", layout.lines.color.m)
	legend.append("text").attr("fill", "#333").attr("dx", layout.font.size*1.5).attr("dy", layout.font.size*2 + 5).text(ln == "en" ? "Male" : "남성")
	
	legend.append("rect").attr("width", layout.font.size).attr("height", layout.font.size)
	  .attr("x", 0).attr("y", layout.font.size * 2 + 10).attr("fill", layout.lines.color.b)
	legend.append("text").attr("fill", "#333").attr("dx", layout.font.size*1.5).attr("dy", layout.font.size*3 + 10).text(ln == "en" ? "Both Sexes" : "전체")
}

let change_curve = function(pl, dt, ln) {
  let data_point = data_refine(dt);
  let plot = pl.select("svg");
  
  let xScale = d3.scaleLinear().rangeRound([0, layout.lines.w]).domain([0, 20]);
  let yScale = d3.scaleLinear().rangeRound([layout.lines.h, 0]).domain([0, 1]);
 
  plot.select("#line_b").datum(data_point).transition().attr("d",line_b);
  plot.select("#line_m").datum(data_point).transition().attr("d",line_m);
  plot.select("#line_f").datum(data_point).transition().attr("d",line_f);
  plot.select("#area_bm").datum(data_point).transition().attr("d",area_bm);
  plot.select("#area_mf").datum(data_point).transition().attr("d",area_mf);
  plot.select("#area_f0").datum(data_point).transition().attr("d",area_f0);
  
  let mark100_area = plot.select("#plot_mark100");
   
  let vf = getCumulative(dt, 'f', 1000), vm = getCumulative(dt, 'm', 1000), vb = getCumulative(dt, 'b', 1000);
	let pf = matchByCumulative(dt, 'f', vf), pm = matchByCumulative(dt, 'm', vm), pb = matchByCumulative(dt, 'b', vb);
	
	let tf = (ln == "en" ? "Female" : "여성")+": "+float_format(0)(vf);
	let tm = (ln == "en" ? "Male" : "남성")+": "+float_format(0)(vm, 0);
	let tb = (ln == "en" ? "Both Sexes" : "전체")+": "+float_format(0)(vb, 0);
	
	let p100_mark_data = [
	  {y: data_point[20].f, t: tf},
	  {y: data_point[20].m, t: tm},
	  {y: data_point[20].b, t: tb}
	];
	
	console.log(mark100_area.selectAll("text"))
	let mark100 = mark100_area.selectAll("text").data(p100_mark_data);
	mark100.exit().remove();
	mark100 = mark100.enter().append("text")
	  .merge(mark100)
	  .text(function(d) { return d.t; })
	  .transition()
	  .attr("y", function(d){console.log(d); return  yScale(d.y) + layout.font.size * 1.2 })
	
	let p1 = getCumulative(dt, 'f', 1000), p2 = matchByCumulative(dt, 'm', p1), 
	    p3 = getCumulative(dt, 'm', p2), p4 = matchByCumulative(dt, 'b', p1);
	
	let max_for_equiv = getCumulative(dt, "b", 1000);
	let f100_point = p1/max_for_equiv, f100_to_m = p2/1000, f100_to_m_point = p3/max_for_equiv, f100_to_b = p4/1000;

  plot.select("#equiv_f_to_m").transition()
    .attr("x1", xScale(20)).attr("y1", yScale(f100_point))
	  .attr("x2", xScale(f100_to_m*20)).attr("y2", yScale(f100_point));
  
  plot.select("#equiv_m_to_b").transition()
	  .attr("x1", xScale(f100_to_m*20)).attr("y1", yScale(f100_to_m_point))
	  .attr("x2", xScale(f100_to_b*20)).attr("y2", yScale(f100_to_m_point));
  
  plot.select("#equiv_f_to_m_down").transition()
    .attr("x1", xScale(f100_to_m*20)).attr("y1", yScale(f100_point))
	  .attr("x2", xScale(f100_to_m*20)).attr("y2", yScale(0));
  
  plot.select("#equiv_m_to_b_down").transition()
	  .attr("x1", xScale(f100_to_b*20)).attr("y1", yScale(f100_to_m_point))
	  .attr("x2", xScale(f100_to_b*20)).attr("y2", yScale(0));
  
	plot.select("#equiv_f_to_m_label").transition()
	  .attr("x", xScale(f100_to_m*20)+5).attr("y", yScale(0)-5).attr("text-anchor", "start")
	  .text(ratio_format(1)(f100_to_m));
	  
	plot.select("#equiv_m_to_b_label").transition()
  	.attr("x", xScale(f100_to_b*20)-5).attr("y", yScale(0)-5).attr("text-anchor", "end")
	  .text(ratio_format(1)(f100_to_b));
}

let data_refine = function(dt) {
  let res = [{f: 0, m: 0, b: 0}];
  let max = getCumulative(dt, "b", 1000);
  for (let i= 1; i < 21; i++) {
    res.push({
      f: getCumulative(dt, "f", 50*i)/max, 
      m: getCumulative(dt, "m", 50*i)/max,
      b: getCumulative(dt, "b", 50*i)/max
    })
  }
  return res;
}

//for table
let init_table = function() {
	let sum_width = 0;
	$(".body_column").each(function(){
		let v = $(this).width()
		sum_width += parseInt(v);
	})
	console.log(sum_width)
	$(".body_columns_wrapper").width(sum_width+10)
	$(".body_columns_wrapper").height( $(".body_columns_wrapper").height() + 1 )
}

let set_table_value = function(country, ln) {
	let prefix = "#ictb-"
	for (let i = 0; i < 10; i++) {
		let j = i + 1, p = i*100+50
		let f = getDistribution(country, "f", p), m = getDistribution(country, "m", p), b = getDistribution(country, "b", p);
		$(prefix+"f-"+j).text(float_format(2)(f));
		$(prefix+"fm-"+j).text((AequivB(country, 'f', 'm', f)[2] / 10).toString() + "%");
		$(prefix+"fb-"+j).text((AequivB(country, 'f', 'b', f)[2] / 10).toString() + "%");
		$(prefix+"m-"+j).text(float_format(2)(m))
		$(prefix+"mf-"+j).text((AequivB(country, 'm', 'f', m)[2] / 10).toString() + "%");
		$(prefix+"mb-"+j).text((AequivB(country, 'm', 'b', m)[2] / 10).toString() + "%");
		$(prefix+"b-"+j).text(float_format(2)(b))
	}
}

//calculations
let getCumulative = function (dt, sex, permill) { // get cumulative income of permill
	let scale;
	switch (sex) {
	case "f":
		scale = dt.scale_f;
		break;
	case "m":
		scale = dt.scale_m;
		break;
	case "b":
		scale = dt.scale_b;
		break;
	}

	let res = scale * Math.pow (permill/1000, dt.expo_value + 1) / (dt.expo_value + 1);
	return res;
}

let matchByCumulative = function (dt, sex, income) { // returns permill in integer value
	var scale;
	switch (sex) {
	case "f":
		scale = dt.scale_f;
		break;
	case "m":
		scale = dt.scale_m;
		break;
	case "b":
		scale = dt.scale_b;
		break;
	}

	var permill;
	permill = Math.pow( ((dt.expo_value+1) / scale * income ) , 1 / (dt.expo_value + 1) );
	return Math.round(permill*1000);
}

let getDistribution = function (dt, sex, permill) {
	var pop100;
	switch (sex) {
	case "f":
		pop100 = dt.pop100_f;
		break;
	case "m":
		pop100 = dt.pop100_m;
		break;
	case "b":
		pop100 = dt.pop100_b;
		break;
	}
	var c1 = getCumulative (dt, sex, permill-5);
	var c2 = getCumulative (dt, sex, permill+5);
	var res = (c2 - c1) / pop100;
	return res ;
}

let matchByDistribution = function (dt, sex, income) { // returns permill in integer value
	var diff = Infinity;
	var permill;
	for (var i = 0; i < 100 ; i++) {
		var temp = getDistribution (dt, sex, i*10 + 5);
		if (diff > Math.abs(temp - income) ) {
			diff = Math.abs(temp - income);
			permill = i*10 + 5;
		}
	}
	return permill;
}

let AequivB = function (dt, from, to, income) {
	// from: sex to compare
	// to: sex to be compared
	// income - inputed income
	// from = male, to = female, p = 0.1 -> Male equivalent of female's lowest 10% income
	if (from == "f" && (to != "m" && to != "b")) {
		return "from: female, to: error";
	} else if (from == "m" && (to != "f" && to != "b")) {
		return "from: male, to: error";
	} else if (from != "f" && from != "m") { 
		return "from error";
	} else if (isNaN(parseInt(income))|| parseInt(income) < 0) {
		return "income error";
	} else {
		var fromTo = from+to;
		var rate;
		switch (fromTo) {
		case "fm":
			rate = dt.f_m;
			break;
		case "fb":
			rate = dt.f_b;
			break;
		case "mf":
			rate = dt.m_f;
			break;
		case "mb":
			rate = dt.m_b;
			break;
		}

		var p = matchByDistribution (dt, from, income);
		var q = parseInt(Math.floor (p * rate) / 10) * 10 + 5 ;
		
		var income_p = getDistribution (dt, from, p);
		var income_q = getDistribution (dt, from, q);
		return [p, income_p, q, income_q];
	}
}

let init_calculator = function() {
	$("#by_calc_input").val("")
	
	$("#by_calc_result_f .bar").width(0);
	$("#by_calc_result_f .value").text("");
	
	$("#by_calc_result_m .bar").width(0);
	$("#by_calc_result_m .value").text("");
	
	$("#by_calc_result_b .bar").width(0);
	$("#by_calc_result_b .value").text("");
}

let by_calculator = function(v){
	let country = cmp_glb.country;
	let f = matchByDistribution(country, 'f', v) / 10,
			m = matchByDistribution(country, 'm', v) / 10,
			b = matchByDistribution(country, 'b', v) / 10;
	
	$("#by_calc_result_f .bar").width(f+"%");
	$("#by_calc_result_f .value").text(f+"%");
	
	$("#by_calc_result_m .bar").width(m+"%");
	$("#by_calc_result_m .value").text(m+"%");
	
	$("#by_calc_result_b .bar").width(b+"%");
	$("#by_calc_result_b .value").text(b+"%");
}