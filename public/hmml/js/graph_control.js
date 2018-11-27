let graph_list = [
  {
    key: "for_bm",
    name: {en: "Time to Buy a McDonald's Big Mac", ko: "맥도날드 빅맥을 1개 사려면?"},
    data_key: "forBm"
  },
  {
    key: "for_cc",
    name: {en: "Time to Buy Coca-cola 1.5 Liter", ko: "코카-콜라 1.5리터를 1병 사려면?"},
    data_key: "forCc"
  },
  {
    key: "for_ad",
    name: {en: "Time to Buy Adidas Training Pants", ko: "아디다스 트레이닝 바지를 1벌 사려면?"},
    data_key: "forAd"
  },
  {
    key: "for_kb",
    name: {en: "Time to Buy an Ikea Bed Set", ko: "이케아 침대 세트를 1개 사려면?"},
    data_key: "forKb"
  },
  {
    key: "for_dp",
    name: {en: "Time to Buy a Dell 15-inch Laptop", ko: "델 15인치 노트북을 1개 사려면?"},
    data_key: "forDp"
  },
  {
    key: "per_bm",
    name: {en: "Amounts of Big Mac 1-our Can Buy", ko: "1시간 일하면 맥도날드 빅맥을 몇 개?"},
    data_key: "perBm"
  },
  {
    key: "per_cc",
    name: {en: "Bottles of Coca-cola 1.5L 1-our Can Buy", ko: "1시간 일하면 코카-콜라 1.5리터를 몇 병?"},
    data_key: "perCc"
  },
  {
    key: "per_ad",
    name: {en: "Pairs of Adidas Training Pants 1-hour Can Buy", ko: "1시간 일하면 아디다스 트레이닝 바지를 몇 벌?"},
    data_key: "perAd"
  },
  {
    key: "per_kb",
    name: {en: "Amounts of Ikea Bed Sets 1-hour Can Buy", ko: "1시간 일하면 이케아 침대 세트를 얼마나?"},
    data_key: "perKb"
  },
  {
    key: "per_dp",
    name: {en: "Amounts of Dell 15\" Laptops 1-hour Can Buy", ko: "1시간 일하면 델 15인치 노트북을 얼마나?"},
    data_key: "perDp"
  },
  {
    key: "gdpc_usd",
    name: {en: "GDP per Capita (USD)", ko: "1인당 GDP(미국 달러)"},
    data_key: "gdpcUsd"
  },
  {
    key: "pv_usd",
    name: {en: "Poverty Level (USD)", ko: "최저생계비(미국 달러)"},
    data_key: "pvUsd"
  },
  {
    key: "mw_usd",
    name: {en: "Minimum Hourly Wage (USD)", ko: "최저시급(미국 달러)"},
    data_key: "mwHourlyUsd"
  },
  {
    key: "bm_usd",
    name: {en: "McDonald's Big Mac (USD)", ko: "맥도날드 빅맥(미국 달러)"},
    data_key: "bmUsd"
  },
  {
    key: "cc_usd",
    name: {en: "Coca-cola 1.5 Liter (USD)", ko: "코카-콜라 1.5리터(미국 달러)"},
    data_key: "ccUsd"
  },
  {
    key: "ad_usd",
    name: {en: "Adidas Training Pants (USD)", ko: "아디다스 트레이닝 바지(미국 달러)"},
    data_key: "adUsd"
  },
  {
    key: "kb_usd",
    name: {en: "Ikea Bed Set (USD)", ko: "이케아 침대 세트(미국 달러)"},
    data_key: "kbUsd"
  },
  {
    key: "dp_usd",
    name: {en: "Dell 15-inch Laptop (USD)", ko: "델 15인치 노트북(미국 달러)"},
    data_key: "dpUsd"
  }
];

let grp_glb = {};

let formatFunctions = {
  'time': null,
  'float(1)': float_format(1),
  'float(2)': float_format(2),
  'float(4)': float_format(2),
  'float(8)': float_format(2)
}

let create_graph_list = function(pl, pl2, ln) {
  let place = $(pl);
  for(let i = 0; i < graph_list.length; i++) {
    let cell = $('<span>').text(graph_list[i].name[ln]).click(function() { get_graph(pl2, graph_list[i].key, ln) });
    place.append(cell);
  }
}

let retreive_data = function(data, key) {
  let result = {data: [], summary:{}};
  for(let i = 0; i < data.length; i++) {
    if(data[i].category == 'general') {
      result.data.push({name: data[i].stName, abbr: data[i].stAbbr, value: data[i][key]});
    } else if (data[i].category == 'summary') {
      result.summary[data[i].stAbbr] = {name: data[i].stName, abbr: data[i].stAbbr, value: data[i][key]};
    }
  }
  result.data.sort(function(a, b) { return a.value - b.value});
  return result;
}

let print_info = function() {
  let title = $('<h2>').text(grp_glb.title).addClass('table_title');
  grp_glb.place.append(title);
}

let get_graph = function(pl, key, ln) {
  let gi = graph_list.filter(function(d) { return d.key == key; });
  if (gi.length >= 1) {
    let graph_info = gi[0];
    let place = $(pl);
    $.getJSON( "/hmml/data/hmml_data_" + ln + "_header.json" , function( g ){
        let header = g.filter(function(d) { return graph_info.data_key.indexOf(d.code) >= 0 });
        $.getJSON( "/hmml/data/hmml_data_" + ln + ".json" , function( data ){
          grp_glb.header = header[0];
          grp_glb.ln = ln;
          formatFunctions.time = function(v) { return seeMWDHM(v, ln)};
          grp_glb.data = retreive_data(data, header[0].code);
          grp_glb.place = place;
          grp_glb.plkey = pl;
          grp_glb.title = graph_info.name[ln];
          place.empty();
          draw_graph();
        });
    });
  }
  $('.sublist_foldable').attr('data-open', 'false');
}

let draw_graph = function() {
  print_info();
  let place = d3.select(grp_glb.plkey), ln = grp_glb.ln, data = grp_glb.data.data, summary = grp_glb.data.summary, header = grp_glb.header;
  let graph = place.append("svg").attr("id","graph");
  let layout_mobile = {
		viewBox: '0 0 500 1000',
		axis_name: {
		  x: 0, y: 40,
		  width: 100, height: 960
		},
		axis_value: {
		  x: 100, y: 0,
		  width: 400, height: 40
		},
		bar_area: {
		  x: 100, y: 40,
		  width: 400, height: 960
		},
		bar: {
		  hr: .7, mr: .15, max_width: 400
		},
		font: {
		  size: 12
		}
	};
	let layout_desk = {
		viewBox: '0 0 1000 600',
		axis_name: {
		  x: 80, y: 550,
		  width: 920, height: 50
		},
		axis_value: {
		  x: 0, y: 0,
		  width: 80, height: 550
		},
		bar_area: {
		  x: 80, y: 0,
		  width: 920, height: 550
		},
		bar: {
		  wr: .7, mr: .15, max_height: 550
		},
		font: {
		  size: 12
		}
	}
	let layout;
	let is_mob = false;
  if (window.innerWidth < 1000) { //mobile - narrow
	  layout = layout_mobile;
	  is_mob = true;
	} else { //desk - wide
	  layout = layout_desk;
	}
	//layout first
  graph.attr('viewBox', layout.viewBox);
  
  //bar area setting
  let bar_mark = graph.append('g').attr('transform', 'translate(' + layout.bar_area.x + ', ' + layout.bar_area.y + ')')
  bar_mark.append('rect').attr('width', layout.bar_area.width).attr('height', layout.bar_area.height)
    .style('fill', 'transparent').style('stroke', '#ddd').style('stroke-width', '1px');
  
  //axis
  let scale_values = d3.scaleLinear()
    .rangeRound([0, (is_mob? layout.axis_value.width : layout.axis_value.height)]);
  let axis_values = graph.append('g').attr('data-role', 'v-axis');
  let fmt = formatFunctions[grp_glb.header.tableType];
  let max_value = summary.MAX.value * 1.05;
  if (is_mob) {
    scale_values.domain([0, max_value]);
    axis_values.attr("transform", "translate(" + layout.axis_value.x + ", " + (layout.axis_value.y + layout.axis_value.height) + ")");
    axis_values.append("g")
      .attr("class", "axis axis--v")
      .call(d3.axisTop(scale_values).ticks(5).tickFormat(fmt))
      .append("text")
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .attr("dy", - layout.font.size * 2.4)
      .attr("dx", layout.axis_value.width)
      .style("font-size", layout.font.size*1.2)
      .attr("text-anchor", "end")
      .attr("class", "axis-name")
      .text(grp_glb.title);
  } else {
    scale_values.domain([max_value, 0]);
    axis_values.attr("transform", "translate(" + (layout.axis_value.x + layout.axis_value.width) + ", " + layout.axis_value.y + ")");
    axis_values.append("g")
      .attr("class", "axis axis--v")
      .call(d3.axisLeft(scale_values).ticks(10).tickFormat(fmt))
      .append("text")
      .attr("dy", 3)
      .attr("dx", - layout.font.size * 4 )
      .attr("transform", "rotate(-90," + (- layout.font.size * 4) + ", 3)")
      .style("font-size", layout.font.size*1.2)
      .attr("text-anchor", "center")
      .attr("class", "axis-name")
      .text(grp_glb.title);
  }
  
  let scale_names = d3.scaleBand()
    .rangeRound([0, (is_mob ? layout.axis_name.height : layout.axis_name.width)])
    .domain(data.map(function(d) { return d.abbr; }));
  let axis_names = graph.append('g').attr('data-role', 'n-axis');
  if (is_mob) {
    axis_names.attr("transform", "translate(" + (layout.axis_name.x + layout.axis_name.width) + ", " + layout.axis_name.y + ")");
    axis_names.append("g")
      .attr("class", "axis axis--n")
      .call(d3.axisLeft(scale_names))
      .append("text")
      .attr("dy", 3)
      .attr("dx", - layout.font.size * 3 )
      .attr("transform", "rotate(-90," + (- layout.font.size * 3) + ", 3)")
      .style("font-size", layout.font.size*1.2)
      .attr("text-anchor", "center")
      .attr("class", "axis-name")
      .text("Countries");
  } else {
    axis_names.attr("transform", "translate(" + layout.axis_name.x + ", " + layout.axis_name.y + ")");
    axis_names.append("g")
      .attr("class", "axis axis--n")
      .call(d3.axisBottom(scale_names))
      .append("text")
      .attr("dy", layout.font.size * 3)
      .attr("dx", layout.axis_name.width)
      .style("font-size", layout.font.size*1.2)
      .attr("text-anchor", "end")
      .attr("class", "axis-name")
      .text("Countries");
  }
  //avg line
  let avg_line = graph.append('line'), avg_value = summary.AVR.value, avg_x1 = 0, avg_y1 = 0, avg_x2 = 0, avg_y2 = 0;
  let avg_text = graph.append('text');
  if (is_mob){
    avg_x1 = layout.bar_area.x + layout.bar.max_width * (avg_value / max_value);
    avg_x2 = avg_x1;
    avg_y1 = layout.bar_area.y;
    avg_y2 = avg_y1 + layout.bar_area.height;
  } else {
    avg_x1 = layout.bar_area.x;
    avg_x2 = avg_x1 + layout.bar_area.width;
    avg_y1 = layout.bar_area.y + layout.bar.max_height * (1 - avg_value / max_value);
    avg_y2 = avg_y1;
  }
  avg_line
    .attr('x1', avg_x1).attr('x2', avg_x2)
    .attr('y1', avg_y1).attr('y2', avg_y2)
    .style('stroke', '#ccc').style('stroke-width', '1');
  avg_text
    .attr('dx', avg_x1 + layout.font.size/2).attr('dy', avg_y1 + layout.font.size * 1.1)
    .text( (grp_glb.ln =='en' ? 'Average' : '평균' ) + ':' + fmt(avg_value))
    .style('font-size', layout.font.size).style('fill', '#666');
  //bars
  let bar_area = graph.append('g').attr('transform', 'translate(' + layout.bar_area.x + ', ' + layout.bar_area.y + ')');
  let backgroud_grad = d3.scaleLinear().range(['#e04251', '#008751']).domain([0, data.length]);
  let data_n = data.length;
  if(is_mob) {
    data.reverse()
    let bars = bar_area.selectAll('rect').data(data).enter().append('rect');
    layout.bar['h'] = (layout.bar_area.height - 40) / data_n * layout.bar.hr;
    layout.bar['m'] = (layout.bar_area.height - 40) / data_n * layout.bar.mr;
    bars.attr('y', function(d, i) { return 20 + (layout.bar.h + layout.bar.m * 2 )* i + layout.bar.m; })
      .attr('x', 0)
      .attr('height', layout.bar.h)
      .attr('width', function(d, i) { return layout.bar.max_width * (d.value / max_value); })
      .attr('fill', function(d, i) { return backgroud_grad(i) })
      .attr('data-value', function(d, i) {return fmt(d.value); })
      .attr('data-name', function(d, i) {return d.name; })
      .on('mouseover', toggle_tooltip)
      .on('mouseout', toggle_tooltip);
  } else {
    let bars = bar_area.selectAll('rect').data(data).enter().append('rect');
    layout.bar['w'] = layout.bar_area.width / data_n * layout.bar.wr;
    layout.bar['m'] = layout.bar_area.width / data_n * layout.bar.mr;
    bars.attr('y', function(d, i) { if (d.value) return layout.bar.max_height * (1 - d.value / max_value); else return layout.bar.max_height; })
      .attr('x', function(d, i) { return (layout.bar.w + layout.bar.m * 2 ) * i + layout.bar.m; })
      .attr('height', function(d, i) { if (d.value) return layout.bar.max_height * (d.value / max_value); else return 0; })
      .attr('width', layout.bar.w)
      .attr('fill', function(d, i) { return backgroud_grad(i) })
      .attr('data-value', function(d, i) {return fmt(d.value); })
      .attr('data-name', function(d, i) {return d.name; })
      .on('mouseover', toggle_tooltip)
      .on('mouseout', toggle_tooltip);
  }
}

let toggle_tooltip = function() {
  let tooltip = d3.select('#graph_tooltip');
  if (tooltip.attr('data-show') == 'false') {
    let name = d3.select(this).attr('data-name');
    let value = d3.select(this).attr('data-value');
    tooltip.select('.name').text(name);
    tooltip.select('.value').text(value);
    tooltip.attr('data-show', 'true');
    
    let mainbox = document.querySelector('.graph-wrap');
    let x = 0, y = 0;
    let tw = tooltip.node().offsetWidth;
    let th = tooltip.node().offsetHeight;
    if (event.clientX + tw - mainbox.offsetLeft + window.scrollX > mainbox.offsetWidth) {
      x = event.clientX - tw - mainbox.offsetLeft + window.scrollX;
    } else {
      x = event.clientX - mainbox.offsetLeft + window.scrollX;
    }
    if (event.clientY + th - mainbox.offsetTop + window.scrollY > mainbox.offsetHeight) {
      y = event.clientY - th - mainbox.offsetTop + window.scrollY;
    } else {
      y = event.clientY - mainbox.offsetTop + window.scrollY;
    }
    tooltip.style('left', x+'px');
    tooltip.style('top', y+'px');
  } else {
    tooltip.attr('data-show', 'false');
  }
}

let hide_tooltip = function () {
  d3.select('#graph_tooltip').attr('data-show', 'false');
}