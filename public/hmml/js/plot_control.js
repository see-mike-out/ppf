let plot_list_x = [
  {
    name: {en: "GDP per Capita (USD)", ko: "1인당 GDP(미국 달러)"},
    key: "gdpcUsd"
  },
  {
    name: {en: "Poverty Level (USD)", ko: "최저생계비(미국 달러)"},
    key: "pvUsd"
  },
  {
    name: {en: "Minimum Hourly Wage (USD)", ko: "최저시급(미국 달러)"},
    key: "mwHourlyUsd"
  }
]
let plot_list_y = [
  {
    name: {en: "Time to Buy a McDonald's Big Mac", ko: "맥도날드 빅맥을 1개 사려면?"},
    key: "forBm"
  },
  {
    name: {en: "Time to Buy Coca-cola 1.5 Liter", ko: "코카-콜라 1.5리터를 1병 사려면?"},
    key: "forCc"
  },
  {
    name: {en: "Time to Buy Adidas Training Pants", ko: "아디다스 트레이닝 바지를 1벌 사려면?"},
    key: "forAd"
  },
  {
    name: {en: "Time to Buy an Ikea Bed Set", ko: "이케아 침대 세트를 1개 사려면?"},
    key: "forKb"
  },
  {
    name: {en: "Time to Buy a Dell 15-inch Laptop", ko: "델 15인치 노트북을 1개 사려면?"},
    key: "forDp"
  },
  {
    name: {en: "Amounts of Big Mac 1-our Can Buy", ko: "1시간 일하면 맥도날드 빅맥을 몇 개?"},
    key: "perBm"
  },
  {
    name: {en: "Bottles of Coca-cola 1.5L 1-our Can Buy", ko: "1시간 일하면 코카-콜라 1.5리터를 몇 병?"},
    key: "perCc"
  },
  {
    name: {en: "Pairs of Adidas Training Pants 1-hour Can Buy", ko: "1시간 일하면 아디다스 트레이닝 바지를 몇 벌?"},
    key: "perAd"
  },
  {
    name: {en: "Amounts of Ikea Bed Sets 1-hour Can Buy", ko: "1시간 일하면 이케아 침대 세트를 얼마나?"},
    key: "perKb"
  },
  {
    name: {en: "Amounts of Dell 15\" Laptops 1-hour Can Buy", ko: "1시간 일하면 델 15인치 노트북을 얼마나?"},
    key: "perDp"
  },
  {
    name: {en: "McDonald's Big Mac (USD)", ko: "맥도날드 빅맥(미국 달러)"},
    key: "bmUsd"
  },
  {
    name: {en: "Coca-cola 1.5 Liter (USD)", ko: "코카-콜라 1.5리터(미국 달러)"},
    key: "ccUsd"
  },
  {
    name: {en: "Adidas Training Pants (USD)", ko: "아디다스 트레이닝 바지(미국 달러)"},
    key: "adUsd"
  },
  {
    name: {en: "Ikea Bed Set (USD)", ko: "이케아 침대 세트(미국 달러)"},
    key: "kbUsd"
  },
  {
    name: {en: "Dell 15-inch Laptop (USD)", ko: "델 15인치 노트북(미국 달러)"},
    key: "dpUsd"
  }
];

let plot_list = plot_list_x.concat(plot_list_y);

let multiplication_symbol = "×";
let plt_glb = {};

let formatFunctions = {
  'time': null,
  'float(1)': float_format(1),
  'float(2)': float_format(2),
  'float(4)': float_format(2),
  'float(8)': float_format(2)
}

let create_plot_list = function(pl, pl2, ln, xy) {
  let place = $(pl);
  let plist = (xy == 'x' ? plot_list_x : plot_list_y)
  for(let i = 0; i < plist.length; i++) {
    let cell = $('<span>').text(plist[i].name[ln]);
    if (xy == "x") {
      cell.click(function() { get_plot_x(pl2, plist[i].key, ln) });  
    } else {
      cell.click(function() { get_plot_y(pl2, plist[i].key, ln) }); 
    }
    place.append(cell);
  }
}

let retreive_data = function(data, key1, key2) {
  let result = {data: [], summary:{}};
  for(let i = 0; i < data.length; i++) {
    if(data[i].category == 'general') {
      result.data.push({name: data[i].stName, abbr: data[i].stAbbr, x: data[i][key1], y: data[i][key2]});
    } else if (data[i].category == 'summary') {
      result.summary[data[i].stAbbr] = {name: data[i].stName, abbr: data[i].stAbbr, x: data[i][key1], y: data[i][key2]};
    }
  }
  return result;
}

let print_info = function() {
  let title = $('<h2>').text(plt_glb.title).addClass('table_title');
  plt_glb.place.append(title);
}

let get_plot_x = function(pl, key, ln) {
  get_plot(pl, key, plt_glb.header_y.code, ln);
}
let get_plot_y = function(pl, key, ln) {
  get_plot(pl, plt_glb.header_x.code, key, ln);
}


let get_plot = function(pl, key1, key2, ln) {
  console.log(key1); console.log(key2)
  let pi1 = plot_list.filter(function(d) { return d.key == key1; });
  let pi2 = plot_list.filter(function(d) { return d.key == key2; });
  if (pi1.length >= 1 && pi2.length >= 1) {
    let plot_info_1 = pi1[0];
    let plot_info_2 = pi2[0];
    let place = $(pl);
    $.getJSON( "/hmml/data/hmml_data_" + ln + "_header.json" , function( p ){
        let header_1 = p.filter(function(d) { return plot_info_1.key == d.code });
        let header_2 = p.filter(function(d) { return plot_info_2.key == d.code });
        $.getJSON( "/hmml/data/hmml_data_" + ln + ".json" , function( data ){
          plt_glb.header_x = header_1[0];
          plt_glb.header_y = header_2[0];
          plt_glb.ln = ln;
          formatFunctions.time = function(v) { return seeMWDHM(v, ln)};
          plt_glb.data = retreive_data(data, pi1[0].key, pi2[0].key);
          plt_glb.place = place;
          plt_glb.plkey = pl;
          plt_glb.title = plot_info_1.name[ln] + " " + multiplication_symbol + " " + plot_info_2.name[ln] ;
          plt_glb.Xname = plot_info_1.name[ln];
          plt_glb.Yname = plot_info_2.name[ln];
          place.empty();
          draw_plot();
        });
    });
  }
  $('.sublist_foldable').attr('data-open', 'false');
}

let draw_plot = function() {
  print_info();
  let place = d3.select(plt_glb.plkey), ln = plt_glb.ln, data = plt_glb.data.data.filter(function(d) { return d.x && d.y; }), summary = plt_glb.data.summary,
    header_x = plt_glb.header_x, header_y = plt_glb.header_y;
  let graph = place.append("svg").attr("id","graph");
	let is_mob = false;
  if (window.innerWidth < 1000) is_mob = true;
  let layout = {
		viewBox: (is_mob ? '0 0 681 681' : '0 0 991 661'),
		axis_y: {//900*600
		  n: (is_mob ? 5 : 10),
		  x: 0, y: 0,
		  width: (is_mob ? 80 : 90), height: 600
		},
		axis_x: {
		  n: (is_mob ? 5 : 10),
		  x: (is_mob ? 80 : 90), y: 600,
		  width: (is_mob ? 600 : 900), height: (is_mob ? 80 : 60)
		},
		dot_area: {
		  x: (is_mob ? 80 : 90), y: 0,
		  width: (is_mob ? 600 : 900), height: 600
		},
		dot: {
		  size: (is_mob ? 3 : 5)
		},
		font: {
		  axis_y_dist: (is_mob ? 3 : 5),
		  axis_x_dist: (is_mob ? 3 : 3.5),
		  size: (is_mob ? 20 : 12)
		}
	};
	
	graph.attr('viewBox', layout.viewBox);

  //dot area setting
  let dot_mark  = graph.append('g').attr('transform', 'translate(' + layout.dot_area.x + ', ' + layout.dot_area.y + ')')
  dot_mark.append('rect').attr('width', layout.dot_area.width).attr('height', layout.dot_area.height)
    .style('fill', 'transparent').style('stroke', '#ddd').style('stroke-width', '1px');
  
  //axis Y
  let max_value_y = summary.MAX.y * 1.1;
  let min_value_y = summary.MIN.y * 0.9;
  if (min_value_y == 0) min_value_y = - max_value_y / 20;
  let y = d3.scaleLinear().rangeRound([0, layout.axis_y.height]).domain([max_value_y, min_value_y])
  let axis_y = graph.append('g').attr('data-role', 'y-axis');
  let fmty = formatFunctions[header_y.tableType];
  axis_y.attr("transform", "translate(" + (layout.axis_y.x  + layout.axis_y.width) + ", " + layout.axis_y.y + ")");
  axis_y.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(layout.axis_y.n).tickFormat(fmty)
      .tickSizeInner(-layout.dot_area.width))
    .style("font-size", layout.font.size)
  .append("text")
    .attr("dy", 0)
    .attr("dx", - layout.font.size * layout.font.axis_y_dist)
    .attr("transform", "rotate(-90," + (- layout.font.size * layout.font.axis_y_dist) + ", 0)")
    .style("font-size", layout.font.size*1.2)
    .attr("text-anchor", "end")
    .attr("class", "axis-name")
    .text(plt_glb.Yname);
  
  //axis X
  let max_value_x = summary.MAX.x * 1.1;
  let min_value_x = summary.MIN.x * 0.9;
  if (min_value_x == 0) min_value_x = - max_value_x / 20;
  let x = d3.scaleLinear().rangeRound([0, layout.axis_x.width]).domain([min_value_x, max_value_x])
  let axis_x = graph.append('g').attr('data-role', 'x-axis');
  let fmtx = formatFunctions[header_x.tableType];
  axis_x.attr("transform", "translate(" + layout.axis_x.x + ", " + layout.axis_x.y + ")");
  axis_x.append("g")
    .attr("class", "axis axis--x")
    .call(d3.axisBottom(x).ticks(layout.axis_x.n).tickFormat(fmtx)
      .tickSizeInner(-layout.dot_area.height))
    .style("font-size", layout.font.size)
  .append("text")
    .attr("text-anchor", "end")
    .attr("dx", layout.axis_x.width)
    .attr("dy", layout.font.size * layout.font.axis_x_dist)
    .style("font-size", layout.font.size*1.2)
    .attr("class", "axis-name")
    .text(plt_glb.Xname);
  //dots
  let dot_area = graph.append('g').attr("transform", "translate(" + layout.dot_area.x + ", " + layout.dot_area.y + ")")
  let dots = dot_area.selectAll('circle').data(data).enter().append('circle')
    .attr('cx', function(d, i) { return layout.dot_area.width * d.x / (max_value_x - min_value_x); })
    .attr('cy', function(d, i) { return layout.dot_area.height * (1 - d.y / (max_value_y - min_value_y)); })
    .attr('r', layout.dot.size)
    .attr('class', 'dot-hl')
    .attr('data-name', function(d, i) { return d.name; })
    .attr('data-x', function(d, i) { return fmtx(d.x); })
    .attr('data-y', function(d, i) { return fmty(d.y); })
    .on('mouseover', toggle_tooltip)
    .on('mouseout', toggle_tooltip)
  
}

let toggle_tooltip = function() {
  let tooltip = d3.select('#graph_tooltip');
  if (tooltip.attr('data-show') == 'false') {
    let name = d3.select(this).attr('data-name');
    let value_x = d3.select(this).attr('data-x');
    let value_y = d3.select(this).attr('data-y');
    tooltip.select('.name').text(name);
    tooltip.select('.value.x').text(plt_glb.Xname + ": " + value_x);
    tooltip.select('.value.y').text(plt_glb.Yname + ": " + value_y);
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
