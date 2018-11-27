var isNarrow = (window.innerWidth < 600 ? true : false);

var Story = class {
  constructor(n, t, c, m, h) {
    this.name = n;
    this.title = t;
    this.content = c;
    this.mode = m;
    this.highlight = h;
  }
}

var story_data = [
  new Story(
    'fine_dust',
    '1. 미세먼지',
    '<p>3월 초부터 미세먼지(PM10)농도가 높아지기 시작해서, 미세먼지 농도가 50 이상인 날이 3~4개월 가량 지속된다. 이 시기에는 중국의 사막지역에서 생성된 황사(모래먼지)가 날아와 대기에 더 심각한 영향을 준다. 황사와 미세먼지는 다르지만, 현실적으로 대기 중에는 함께 존재하므로 이 둘을 구분하는 것은 사실상 무의미하며, 최근에는 모두 미세먼지로 통칭되고 있다.</p><p>이처럼 아주 높은 수준의 미세먼지가 해마다 정기적으로 발생하는 곳은 동아시아 지역이 유일하여, 세계적으로는 \"Asian Dust\"로도 불린다. WHO에서는 PM10의 농도가 24시간 동안 50 이상이면 나쁜 대기 상태라고 하지만, 한국과 중국에서는 100을 그 기준으로 한다. 그 말은, 이 시기 동안 주변에서 \"오늘은 미세먼지가 그렇게 안 나쁘다는데\"라고 말할 때에도 대기 상황은 좋지 않다는 것을 의미한다.</p><p>미세먼지에 대비하기 위해서는 실외활동을 줄이고 마스크를 일상적으로 이용하는 것이 중요하다.  한국 사람들(특히 수도권)은 이동시간이 많은 반면, 마스크를 잘 이용하지 않는 습관이 있다. 이는 한국보다 미세먼지 상황이 비교적 양호한 일본과 대비된다. 미세먼지를 위한 마스크는 PM10, PM5, PM2.5 등으로 표시되어 있기는 하지만, 어떠한 마스크라도 일단은 착용하는 것이 좋다. 그리고 마스크를 착용한 사람을 아픈 사람처럼 보지 말자.</p><p>미세먼지의 발생 원인은 사막의 모래먼지, 소각이나 산불에 의한 재, 전력 생산 및 제조 · 건축 · 운송업에 따른 배기가스 등이 있다. 한국에서 문제가 되는 것은 크게 두 가지가 있는데, 첫째는 전력 생산 및 제조업에 따른 배기가스이고, 둘째는 중국으로부터 오는 미세먼지이다. 한국은 \"미세먼지\"에 대한 특별한 배출허용기준이 없다. 대기환경보전법과 그 시행규칙에 따르면 \"먼지\"에 대한 규제는 있으나, 먼지는 미세먼지부터 무거운 먼지를 모두 포함하는 것이다. 또한 중국으로부터 발생하는 미세먼지(모래 먼지를 포함)를 무시할 수 없다. 항상 서쪽에서 부는 바람의 방향에 따라 중국에서 발생하는 많은 양의 미세먼지가 한반도에 도달한다.</p><p>이를 방지하기 위한 국가적인 대안으로는 국내법상으로 \"미세먼지\"에 대한 규제를 분명히 세우는 것과 외교적으로 중국과의 미세먼지 배출량에 대해 해결할 것이 일반적으로 거론된다. 간혹 원자력 발전 등을 그 대안으로 삼기는 하지만, 원자력 발전으로 인해 발생하는 환경적 피해(방사능 노출, 대형 송전탑, 해수 오염)를 무시할 수 없을 것이다.</p>',
    ['fine_dust'],
    [[2.5, 5.5]]
  ),
  new Story(
    'high_temp',
    '2. 폭염',
    '<p>미세먼지의 계절이 끝나면 서서히 더워지기 시작해서 6월이 넘어가면 에어컨 없이는 살 수 없는 폭염의 계절이 온다. 6월 중순부터 9월 중순까지는 대체로 1일 평균 23~24도를 웃도는 시기로, 집을 놔두고 밖으로 나가 잠을 청하는 기현상이 발생하기도 한다. 폭염은 단순히 견디기 힘들다의 문제가 아니다. 30도 이상의 노동 환경에서는 탈수, 열사병, 심각하게는 심장마비 등의 건강 문제가 발생할 수 있다.</p><p>개인적인 수준에서 폭염을 피하기 위해서는 피서를 가거나 냉방 기구를 사용하는 것, 조리 시간이 짧은 요리를 하는 것밖에 없다. 따라서 사회적인 수준에서의 대책이 요구된다. 예를 들면, 충분한 방열재 기준을 포함한 건축 제도의 개선, 전력 사용 효율화 등이 있다.</p><p>한 가지 오해는, 냉방 기구를 사용하는 것은 곧 전력을 과도하게 소비하여 여름철 전력 위기의 주범이 된다는 것이다. 그러나 실제로 2011년부터 2015년까지의 판매전력량 통계를 보면, 전체적으로 판매전력 자체가 많은 시기는 여름철(6~8월)보다는 겨울철(11월~2월)로, 월평균 약 2~4백만 MWh 더 높다(한국전력통계). 가정용의 경우에도 월평균 10~30만 MWh가 겨울철에 더 사용된다. 애초에 가정용 전기 사용이 전체 전기 사용의 13% 수준으로, 전력 위기를 일으킬 가능성이 높지 않다. 다만, 이는 냉방 기구를 과도하게 사용하라는 뜻이 아니다. 과도한 냉방 기구 사용은 분명히 불필요한 전력 소모를 일으키며, 냉방병, 심장마비 등의 건강 문제를 일으킬 수 있으므로 주의해야 한다.</p><p>폭염이 생기는 이유는 지구 전체적인 지구 온난화와 관련이 있다. 지구 온난화(global warming)의 주요 원인은 온실가스, 에어로졸(미세먼지 등도 에어로졸에 포함된다), 지구 궤도 변화 등이 있는데, 앞의 두 가지는 인간에 의한 현상이다. 그런데, 지난 100년간 전지구적으로 상승한 기온은 0.5~1도 정도로 알려져 있는 것에 비해, 서울은 지난 100년간 2.4도가 상승했고, 최저기온의 상승 폭(3.7도)이 최고 기온의 상승폭(1.1도)보다 크다(출처: 서울특별시 대기환경정보)</p>',
    ['temperature'],
    [[5.5, 8.5]]
  ),
  new Story(
    'short_clear',
    '3. 환절기',
    '<p>폭염도 한풀 꺾이고 나면 잠시 맑은 날씨가 이어진다. 미세먼지 농도도 비교적 낮은 수준으로 유지되고, 기온도 높지 않다. 늦여름까지 이어지는 장마와 태풍, 그리고 동에서 서로 부는 여름 계절풍으로 인해 미세먼지가 많이 낮아져서, 그 이후에도 잠깐의 맑은 시기가 찾아온다. 기온도 본격적인 겨울로 이어지기 전의 적정 수준이 유지된다. 다만 그 기간이 1달 남짓으로 무척 짧다.</p><p>그러나 이 짧은 가을이 완전히 좋기만 한 것은 아니다. 미세먼지 농도가 봄, 겨울에 비해 낮은 수준으로 실제로는 WHO 권고인 50 주변이다. 또한 일교차가 심해져서 기관지, 알레르기 등의 건강 문제를 일으킨다.</p>',
    ['fine_dust', 'temperature'],
    [[8.8, 10]]
  ),
  new Story(
    'low_temp',
    '4. 혹한',
    '<p>11월부터 그 이듬해 3월초의 기온은 무척 낮으며, 종종 같은 날의 모스크바보다도 일평균 기온이 낮을 때가 발생한다. 서울은 내륙에 있으며, 동시에 대륙의 동쪽에 있기 때문에 겨울이 춥다고 알려져 있다. 신기한 것은, 이 시기는 현재 지속적으로 기온이 상승하고 있다는 것이다. 서울시 기후변화 자료에 따르면, 겨울철 결빙일수나 혹한일수는 감소하고 있는 추세로, 이는 지구 온난화를 반영하고 있다. </p><p>개인적인 수준에서 혹한의 시기를 잘 보내기 위해서는 실내 난방을 하고, 따뜻하게 입는 것 정도가 있다. 마찬가지로 사회적인 대책이 요구된다. 무엇보다 건축물의 에너지 효율에 관한 강력한 규제의 입법이 요구된다.</p><p>난방에 대한 수요는 계속해서 늘어나고 있고, 이는 겨울철 전력 소비량 증가의 주 원인이다. 최근 몇년간 최대 전력 발생일시는 겨울철(1~2월)로, 2008년 이전에는 모두 여름철(7~8월)이었던 것과 대비된다. 이러한 이유에는 높은 가정용 난방비가 있다. 가정용 난방은 대부분 도시가스를 통해 이루어지는데, 가스비가 전기세보다 높기 때문에 사람들이 보일러 등의 난방을 하기보다는 전열 기구를 이용하게 된다. 그런데 전열 기구가 냉방 기구에 비해 에너지 효율이 좋지 않고, 에어컨에 비해 더 장시간 이용하게 되기 때문이다. 심지어 에어컨은 획기적으로 효율이 좋은 선풍기로 일정 부분 대체가 되는 것에 비해, 전열 기구는 사실상 대체제가 없다.</p>',
    ['temperature'],
    [[10, 12], [0, 2.5]]
  )
];

var date_interval = {
  "1": "1월 1일-1월 5일", "2": "1월 6일-1월 10일", "3": "1월 11일-1월 15일", "4": "1월 16일-1월 20일", "5": "1월 21일-1월 25일",
  "6": "1월 26일-1월 30일", "7": "1월 31일-2월 4일", "8": "2월 5일-2월 9일", "9": "2월 10일-2월 14일", "10": "2월 15일-2월 19일",
  "11": "2월 20일-2월 24일", "12": "2월 25일-3월 1일", "13": "3월 2일-3월 6일", "14": "3월 7일-3월 11일", "15": "3월 12일-3월 16일",
  "16": "3월 17일-3월 21일", "17": "3월 22일-3월 26일", "18": "3월 27일-3월 31일", "19": "4월 1일-4월 5일", "20": "4월 6일-4월 10일",
  "21": "4월 11일-4월 15일", "22": "4월 16일-4월 20일", "23": "4월 21일-4월 25일", "24": "4월 26일-4월 30일", "25": "5월 1일-5월 5일",
  "26": "5월 6일-5월 10일", "27": "5월 11일-5월 15일", "28": "5월 16일-5월 20일", "29": "5월 21일-5월 25일", "30": "5월 26일-5월 30일",
  "31": "5월 31일-6월 4일", "32": "6월 5일-6월 9일",  "33": "6월 10일-6월 14일", "34": "6월 15일-6월 19일", "35": "6월 20일-6월 24일",
  "36": "6월 25일-6월 29일", "37": "6월 30일-7월 4일", "38": "7월 5일-7월 9일", "39": "7월 10일-7월 14일", "40": "7월 15일-7월 19일",
  "41": "7월 20일-7월 24일", "42": "7월 25일-7월 29일", "43": "7월 30일-8월 3일", "44": "8월 4일-8월 8일", "45": "8월 9일-8월 13일",
  "46": "8월 14일-8월 18일", "47": "8월 19일-8월 23일", "48": "8월 24일-8월 28일", "49": "8월 29일-9월 2일", "50": "9월 3일-9월 7일",
  "51": "9월 8일-9월 12일", "52": "9월 13일-9월 17일", "53": "9월 18일-9월 22일", "54": "9월 23일-9월 27일", "55": "9월 28일-10월 2일",
  "56": "10월 3일-10월 7일", "57": "10월 8일-10월 12일", "58": "10월 13일-10월 17일", "59": "10월 18일-10월 22일", "60": "10월 23일-10월 27일",
  "61": "10월 28일-11월 1일", "62": "11월 2일-11월 6일", "63": "11월 7일-11월 11일", "64": "11월 12일-11월 16일", "65": "11월 17일-11월 21일",
  "66": "11월 22일-11월 26일", "67": "11월 27일-12월 1일", "68": "12월 2일-12월 6일", "69": "12월 7일-12월 11일", "70": "12월 12일-12월 16일",
  "71": "12월 17일-12월 21일", "72": "12월 22일-12월 26일", "73": "12월 27일-12월 31일"
};

var toggle_story = function(i) {
  $("#story-control-box>li").removeClass('active');
  $("#story-control-box>li:nth-of-type("+i+")").addClass('active');

  var d = story_data[i-1]

  //text content
  $("#story-text-title").text(d.title);
  $("#story-text-content>p").html(d.content);

  //visual content
  highlight_visual(i);
  eval('show_story_' + d.name + '()');
}

var select_mode = function(i) {
  var tab = $("#story-mode-box>li:nth-of-type("+i+")")
  if(tab.hasClass('active')) tab.removeClass('active');
  else tab.addClass('active');
  if (i == 1) toggle_mode(line_temperature);
  else if (i == 2) toggle_mode(line_fine_dust);
}

var initiate_story = function() {
  draw_visual();
  hide_mode(line_fine_dust);
  hide_mode(line_temperature);
  toggle_story(1);
}

var toggle_mode = function(m) {
  if (m.style("display") != "none") {
    hide_mode(m);
  } else {
    show_mode(m);
  }
}

var hide_mode = function(m) {
  m.style("display", "none");
}

var show_mode = function(m) {
  m.style("display", "");
}

var is_hidden_mode = function(m) {
  return (m.style("display") == "none")
}

var show_story_fine_dust = function() {
  if (!is_hidden_mode(line_temperature)) {
    select_mode(1);
  }
  if (is_hidden_mode(line_fine_dust)) {
    select_mode(2);
  }
}

var show_story_high_temp = function() {
  if (is_hidden_mode(line_temperature)) {
    select_mode(1);
  }
  if (!is_hidden_mode(line_fine_dust)) {
    select_mode(2);
  }
}

var show_story_short_clear = function() {
  if (is_hidden_mode(line_temperature)) {
    select_mode(1);
  }
  if (is_hidden_mode(line_fine_dust)) {
    select_mode(2);
  }
}

var show_story_low_temp = function() {
  if (is_hidden_mode(line_temperature)) {
    select_mode(1);
  }
  if (!is_hidden_mode(line_fine_dust)) {
    select_mode(2);
  }
}

var highlight_visual = function(m) {
  var data = story_data[m-1].highlight,
      len = data.length,
      len_total = highlight_boxes.length;
  for (var i = 0; i < len_total; i++) {
    var box = highlight_boxes[i],
        coord = data[i],
        unit = parseFloat(box.attr("origin_unit"));
    if (i < len) {
      box.select("rect").attr("x", unit*coord[0] - 0.5);
      box.select("rect").attr("width", (unit*coord[1]-unit*coord[0]));
    } else {
      box.select("rect").attr("x", - 0.5);
      box.select("rect").attr("width", 0);
    }
  }
}

var line_temperature = null;
var line_fine_dust = null;

var highlight_boxes = [];

var draw_visual = function () {
  var place = d3.select("#story-visual");
  var place_box = $("#story-visual").width();
  if (place_box < 600) place_box = 600;


  var layout = {
    box: {
      w: place_box - 20,
      h: (place_box - 20) * .4
    },
    rate: {
      box: {
        w: 100,
        h: (isNarrow ? 45 : 40)
      },
      margin: {
        top: 10,
        bottom: 3,
        left: 3,
        right: 3
      },
      tick: {
        font: (isNarrow ? 3 : 1.5)
      },
      tick_y1: {
        left: 3,
        top: (isNarrow ? 10 : 5),
        w: 5,
        h: 30
      },
      tick_y2: {
        left: 92,
        top: (isNarrow ? 10 : 5),
        w: 5,
        h: 30
      },
      tick_x: {
        top: (isNarrow ? 40 : 35),
        left: 10,
        h: 4,
        w: 80,
        n: 73
      },
      graph: {
        left: 10,
        top: (isNarrow ? 10 : 5),
        w: 80,
        h: 30
      }
    }
  },
  color = {
    tick: "#999999",
    temperature: "#1a237e",
    fine_dust: "#b71c1c"
  };

  var svg = place.append("svg");
  svg.attr("width", layout.box.w).attr("height", layout.box.h).attr("viewBox", "0 0 " + layout.rate.box.w + " " + layout.rate.box.h);
  svg.attr("onmouseout", "hide_tooltip_all()");

  //tick y1: temperature
  var tick_y1 = svg.append("g").attr('id', 'tick_y1')
                   .attr("transform", "translate(" + layout.rate.tick_y1.left + ", " + layout.rate.tick_y1.top + ")")
                   .attr("width",  layout.rate.tick_y1.w).attr("height",  layout.rate.tick_y1.h);
  tick_y1.append("line").attr("x1", layout.rate.tick_y1.w).attr("y1", 0).attr("x2", layout.rate.tick_y1.w).attr("y2", layout.rate.tick_y1.h)
         .style("stroke-width", ".05").style("stroke", "#000000");
  var tick_y1_start = data5_grid_unit.temperature.MIN,
      tick_y1_end = data5_grid_unit.temperature.MAX,
      tick_y1_size = tick_y1_end - tick_y1_start,
      tick_y1_n = tick_y1_size / data5_grid_unit.temperature.tick;
  for (var i = 0; i < tick_y1_n+1; i++) {
    var pos_y = layout.rate.tick_y1.h * i / tick_y1_n;
    tick_y1.append("line").attr("x1", layout.rate.tick_y1.w * .7).attr("y1", pos_y)
                          .attr("x2", layout.rate.tick_y1.w).attr("y2", pos_y)
                          .style("stroke-width", ".05").style("stroke", "#000000");
    tick_y1.append("text").attr("x", layout.rate.tick_y1.w * .45).attr("y", pos_y + layout.rate.tick.font/3).style("font-size", layout.rate.tick.font)
           .attr("fill", color.tick).attr("text-anchor", "end")
           .text( (tick_y1_end - data5_grid_unit.temperature.tick * i).toString() );
  }
  tick_y1.append("text").attr("x", 0).attr("y", layout.rate.tick.font * -1.3).text("기온(℃)").attr("text-anchor", "start")
         .style("font-size", layout.rate.tick.font).attr("fill", color.tick);

  //tick y2: fine dust
  var tick_y2 = svg.append("g").attr('id', 'tick_y2')
                  .attr("transform", "translate(" + layout.rate.tick_y2.left + ", " + layout.rate.tick_y2.top + ")")
                  .attr("width",  layout.rate.tick_y2.w).attr("height",  layout.rate.tick_y2.h);
  tick_y2.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", layout.rate.tick_y2.h)
        .style("stroke-width", ".05").style("stroke", "#000000");
  var tick_y2_start = data5_grid_unit.fine_dust.MIN,
      tick_y2_end = data5_grid_unit.fine_dust.MAX,
      tick_y2_size = tick_y2_end - tick_y2_start,
      tick_y2_n = tick_y2_size / data5_grid_unit.fine_dust.tick;
  for (var i = 0; i < tick_y2_n+1; i++) {
  var pos_y = layout.rate.tick_y2.h * i / tick_y2_n;
  tick_y2.append("line").attr("x1", 0).attr("y1", pos_y)
                        .attr("x2", layout.rate.tick_y2.w * .3).attr("y2", pos_y)
                        .style("stroke-width", ".05").style("stroke", "#000000");
  tick_y2.append("text").attr("x", layout.rate.tick_y2.w * .55).attr("y", pos_y + layout.rate.tick.font/3).style("font-size", layout.rate.tick.font)
         .attr("fill", color.tick).attr("text-anchor", "start")
         .text( (tick_y2_end - data5_grid_unit.fine_dust.tick * i).toString() );
  }
  tick_y2.append("text").attr("x", layout.rate.tick_y2.w+3).attr("y", layout.rate.tick.font * -1.3).text("미세먼지 지수")
         .attr("text-anchor", "end")
         .style("font-size", layout.rate.tick.font).attr("fill", color.tick);

  //tick x: date
  var tick_x = svg.append("g").attr('id', 'tick_x')
                   .attr("transform", "translate(" + layout.rate.tick_x.left + ", " + layout.rate.tick_x.top + ")")
                   .attr("width",  layout.rate.tick_x.w).attr("height",  layout.rate.tick_x.h);
  tick_x.append("line").attr("x1", 0).attr("y1", 0).attr("x2", layout.rate.tick_x.w).attr("y2", 0)
       .style("stroke-width", ".05").style("stroke", "#000000");
  var tick_x_start = 0,
      tick_x_end = 12,
      tick_x_size = tick_x_end - tick_x_start,
      tick_x_n = 12,
      tick_x_int = layout.rate.graph.w / layout.rate.tick_x.n ;
  for (var i = 0; i < tick_x_n+1; i++) {
    var pos_x = layout.rate.tick_x.w * i / tick_x_n;
    var pos_t_x = layout.rate.tick_x.w * (i - 0.5) / tick_x_n;
    tick_x.append("line").attr("x1", pos_x).attr("y1", 0)
                          .attr("x2", pos_x).attr("y2", layout.rate.tick_x.h * .3)
                          .style("stroke-width", ".05").style("stroke", "#000000");
    if (i != 0) {
      tick_x.append("text").attr("x", pos_t_x).attr("y", layout.rate.tick_x.h * .8).style("font-size", layout.rate.tick.font)
            .attr("fill", color.tick).attr("text-anchor", "middle")
            .text( i.toString() );
    }
  }
  tick_x.append("text").attr("x", layout.rate.tick_x.w).attr("y", layout.rate.tick_x.h * .8).text("월")
        .attr("text-anchor", "middle")
        .style("font-size", layout.rate.tick.font).attr("fill", color.tick);

  //boxes
  var highlight_box1 = svg.append("g").attr("id", "highlight_box1").attr("transform", "translate("+(layout.rate.graph.left + tick_x_int/2)+", "+layout.rate.graph.top+")")
                      .attr("width", layout.rate.graph.w).attr("height", layout.rate.graph.h).attr("origin_unit", layout.rate.graph.w/12);
  highlight_box1.append("rect").attr("class", "graph_story_box")
                .attr("x", layout.rate.graph.w/12).attr("y", 0.5)
                .attr("width", layout.rate.graph.w/12).attr("height", layout.rate.graph.h-1);

  var highlight_box2 = svg.append("g").attr("id", "highlight_box2").attr("transform", "translate("+(layout.rate.graph.left + tick_x_int/2)+", "+layout.rate.graph.top+")")
                      .attr("width", layout.rate.graph.w).attr("height", layout.rate.graph.h).attr("origin_unit", layout.rate.graph.w/12);
  highlight_box2.append("rect").attr("class", "graph_story_box")
                .attr("x", layout.rate.graph.w/12).attr("y", 0.5)
                .attr("width", layout.rate.graph.w/12).attr("height", layout.rate.graph.h-1);

  highlight_boxes.push(highlight_box1);
  highlight_boxes.push(highlight_box2);

  //line: temperature
  line_temperature = svg.append("g").attr("id", "line_temperature").attr("transform", "translate("+(layout.rate.graph.left + tick_x_int/2)+", "+layout.rate.graph.top+")")
                        .attr("width", layout.rate.graph.w).attr("height", layout.rate.graph.h);
  line_temperature_line = line_temperature.append("path").attr("stroke-width", ".2").attr("stroke", color.temperature).attr("fill", "transparent");
  line_temperature_path = "";
  //line: fine_dust
  line_fine_dust = svg.append("g").attr("id", "line_fine_dust").attr("transform", "translate("+(layout.rate.graph.left + tick_x_int/2)+", "+layout.rate.graph.top+")")
                      .attr("width", layout.rate.graph.w).attr("height", layout.rate.graph.h);
  line_fine_dust_line = line_fine_dust.append("path").attr("stroke-width", ".2").attr("stroke", color.fine_dust).attr("fill", "transparent");
  line_fine_dust_path = "";

  for ( var i = 0; i < layout.rate.tick_x.n; i++ ) {
    line_temperature_path += (i == 0 ? "M " : "L ") + (i / 73 * layout.rate.graph.w).toString() + " "
    line_temperature_path += ((tick_y1_end - data5['avg'][(i+1).toString()]['temperature']) / tick_y1_size * layout.rate.graph.h).toString() + " ";
    line_temperature.append("circle")
                    .attr("cx", (i / 73 * layout.rate.graph.w))
                    .attr("cy", ((tick_y1_end - data5['avg'][(i+1).toString()]['temperature']) / tick_y1_size * layout.rate.graph.h))
                    .attr("r", 1).attr("fill", "transparent")
                    .attr("data-value", (Math.round(data5['avg'][(i+1).toString()]['temperature'] * 100) / 100).toString() + "℃")
                    .attr("data-mode", "기온")
                    .attr("data-date", date_interval[(i+1).toString()])
                    .attr("data-tooltip-id", "story-tooltip-temp-"+i.toString())
                    .attr("onmouseover", "show_tooltip(this)").attr("onmouseout", "hide_tooltip(this)");

    line_fine_dust_path += (i == 0 ? "M " : "L ") + (i / 73 * layout.rate.graph.w).toString() + " "
    line_fine_dust_path += ((tick_y2_end - data5['avg'][(i+1).toString()]['fine_dust']) / tick_y2_size * layout.rate.graph.h).toString() + " ";
    line_fine_dust.append("circle")
                  .attr("cx", (i / 73 * layout.rate.graph.w))
                  .attr("cy", ((tick_y2_end - data5['avg'][(i+1).toString()]['fine_dust']) / tick_y2_size * layout.rate.graph.h))
                  .attr("r", 1).attr("fill", "transparent")
                  .attr("data-value", (Math.round(data5['avg'][(i+1).toString()]['fine_dust'] * 100) / 100).toString())
                  .attr("data-mode", "미세먼지 지수")
                  .attr("data-date", date_interval[(i+1).toString()])
                  .attr("data-tooltip-id", "story-tooltip-fine_dust-"+i.toString())
                  .attr("onmouseout", "hide_tooltip(this)").attr("onmouseover", "show_tooltip(this)");
  }

  line_temperature_line.attr("d", line_temperature_path);
  line_fine_dust_line.attr("d", line_fine_dust_path);
}

var show_tooltip = function(elem) {
  var v = $(elem).attr('data-value'),
      m = $(elem).attr('data-mode'),
      d = $(elem).attr('data-date'),
      i = $(elem).attr('data-tooltip-id'),
      o = $(elem).offset(),
      w = $(elem).width(),
      h = $(elem).height(),
      x = o.left + w / 2,
      y = o.top + h / 2;

  $(".story-tooltip").css("display", "none");
  var tooltip = $("<div>").attr("id", i).addClass("story-tooltip").append($("<span>").html(d+"<br /><strong>"+m+"</strong>&nbsp;&nbsp;"+v));
  $("#story-tooltip-area").append(tooltip);
  tooltip.attr("onmouseover", "keep_tooltip(this)");
  tooltip.attr("onmouseout", "unkeep_tooltip(this)");
  if (!isNarrow) {
    tooltip.css("position", "absolute");
    tooltip.css("top", y + 10).css("left", x - tooltip.width() / 2 - 3.5);
    tooltip.append($("<div>").addClass("story-tooltip-arrow").css("left", tooltip.width() / 2));
  }
}

var keep_tooltip = function(elem) {
  $(elem).attr("tooltip-hovered", "true");
  $(elem).css("display", "");
}

var hide_tooltip = function(elem) {
  var i = $(elem).attr('data-tooltip-id'),
      t = $("#"+i);
  if (t.attr("tooltip-hovered") == "false") {
    t.css("display", "none");
  }
}

var unkeep_tooltip = function(elem) {
  $(elem).attr("tooltip-hovered", "false");
  $(elem).css("display", "none");
}

var hide_tooltip_all = function(elem) {
  $(".story-tooltip").css("display", "none");
}

var story_text_fold = function() {
  var box = $("#story-text-wrap"),
      folder = $("#fold");
  if (box.attr("fold") == "true") {
    box.attr("fold", "false");
    folder.html('<i class="fa fa-angle-up" aria-hidden="true"></i>&nbsp;&nbsp;접기')
  } else {
    box.attr("fold", "true");
    folder.html('<i class="fa fa-angle-up" aria-hidden="false"></i>&nbsp;&nbsp;더보기')
  }
}
