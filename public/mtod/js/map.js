//global
function global() {
  setSubByQuery();
  printMap();
  refresh();
}

function refresh() {
  showPanel();
  seeDetail(on.area);
  setCurrentUrl();
}

var isNarrow = (window.innerWidth < 800 ? true : false);

//predata
var on = {
      tab:'entire',
      gender: 'both',
      level: 'nation',
      area: '전국'
    };
var current_url = "";

var tab_table = [
      {key: 'entire', name: '종합', hasGender: true},
      {key: 'nationality', name: '국적', hasGender: true},
      {key: 'disability', name: '장애', hasGender: true},
      {key: 'gender', name: '성별', hasGender: false},
      {key: 'residence', name: '주거', hasGender: false},
      {key: 'industry', name: '직종', hasGender: true},
      {key: 'age', name: '연령', hasGender: true}
    ],
    tab = {
      'entire': tab_table[0],
      'nationality': tab_table[1],
      'disability': tab_table[2],
      'gender': tab_table[3],
      'residence': tab_table[4],
      'industry': tab_table[5],
      'age': tab_table[6]
    },
    tab_title = "영역";
var gender_table = [
      {key: 'female', name: '여성'},
      {key: 'male', name: '남성'},
      {key: 'both', name: '전체'}
    ],
    gender = {
      'female': gender_table[0],
      'male': gender_table[1],
      'both': gender_table[2]
    },
    single_gender_table = [
      gender_table[2]
    ],
    single_gender = {
      'both': gender_table[2]
    }
    gender_title = "성별";
var level_table = [
      {key: 'nation', name: '전국'},
      {key: 'metro', name: '시도'},
      {key: 'regional', name: '시군구'}
    ],
    level = {
      'nation': level_table[0],
      'metro': level_table[1],
      'regional': level_table[2]
    },
    level_title = "수준";
var panels = ['tab', 'gender', 'level'];
var check_icon = {
      on: 'fa fa-check-circle',
      off: 'fa fa-check-circle-o'
    };

function showPanel() {
  var bp = $("#panel-content");
  bp.text("");
  for (var i = 0; i < panels.length; i++) {
    var ul = $("<ul></ul>").attr("id", panels[i]+"-list").attr("class", "nav nav-pills nav-justified"),
        c_table = eval((panels[i] == 'gender' & !tab[on.tab].hasGender ? "single_" : "") + panels[i]  + "_table");
    var tab_width_cum = 0;
    for (var j = 0; j < c_table.length; j++) {
      var tab_width = 1/c_table.length*100;
      ul.append(
        $("<li></li>").attr("id", panels[i] + "-list-" + c_table[j].key).attr("class", "hasAction nav-item" + (c_table[j].key == on[panels[i]] ? ' nav-on' : ''))
        .attr("style", "width: "+roundStr((j != c_table.length-1 ? tab_width : 100-tab_width_cum+1), 2)+"%")
        .attr("onclick", "togglePanel('"+panels[i]+"', '"+c_table[j].key+"')")
        .append(
          "  "+c_table[j].name
        )
      );
      tab_width_cum += tab_width;
    }
    bp.append(ul);
  }
}

function togglePanel(c, k) {
  if (c == 'area') {
    d3.selectAll(".current-area").classed("current-area", false);
  }
  setSub(c, k);
  refresh();
  if (c == 'area') {
    d3.selectAll("."+on.area.romanize()).classed("current-area", true);
    $('html, body').animate({
            scrollTop: $("#detail-wrap").offset().top-10
        }, 500);
  } else {
    printMap();
  }
}

function setSub(c, k) {
  on[c] = k;
  if (!tab[on.tab].hasGender) {
    on.gender = 'both';
  }
}

//share
//area selection
function setSubByQuery() {
  var query = getQueryList();
  if (query != null) {
    var query_keys = Object.keys(query);
    if (query_keys.indexOf('area') >= 0) {
      on.area = decodeURI(query['area']);
    }
    if (query_keys.indexOf('tab') >= 0) {
      on.tab = query['tab'];
    }
    if (query_keys.indexOf('gender') >= 0) {
      on.gender = query['gender'];
    }
    if (query_keys.indexOf('level') >= 0) {
      on.level = query['level'];
    }
  }
}

function setCurrentUrl() {
  current_url = makeQueryString(
    {
      'area': on.area,
      'tab': on.tab,
      'level': on.level,
      'gender': on.gender
    }
  );
}

function setShareLinkTw() {
  setCurrentUrl();
  shareTw(on.area+"의 "+tab[on.tab].name+" 다양도 확인하기 "+"My Town Our Diversity 에서", current_url);
}

function setShareLinkUrl() {
  setCurrentUrl();
  shareUrl(current_url);
}

//map
function printMap() {
  var mp = '#map-content'
  $(mp).text('');
  var view_h = window.innerHeight - $(mp).offset().top - 20,
      view_w = view_h / 1.4069;
  if (isNarrow) {
    view_w = $(mp).width();
    view_h = view_w * 1.4069;
  }
  var zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([[-100, -100], [view_w + 90, view_h + 100]])
    .on("zoom", zoomed);

  var place = d3.select(mp);
  var graph = place.append("svg").attr("id", "age-graph")
                                 .attr("width", view_w).attr("height", view_h)
  var draw_box = graph.append("g").call(zoom).append("g");

  if (on.level == level_table[0].key) { //nation
    graph.attr("viewBox", "-171 -60.8 509 716.1");
    var size = Object.keys(map_metro).length,
        keys = Object.keys(map_metro);
    var value = get_diversity('전국', on.tab, on.gender);
    for (var i = 0; i < size; i++) {
      key = keys[i];
      items = map_metro[key];
      var g = draw_box.append('g').attr("id", key);
      for (var j = 0; j < items.length; j++) {
        var pkey = (items[j].name == 'path' ? 'd' : 'points');
        g.append(items[j].name).attr('class', 'hasAction map-item '+key.romanize())
                               .attr(pkey, items[j][pkey])
                               .attr('fill', bright(key_color[on.gender], -1+value/100))
                               .attr('onclick', "togglePanel('area', '"+'전국'+"')");
      }
    }
  } else if (on.level == level_table[1].key) { //metro
    graph.attr("viewBox", "-171 -60.8 509 716.1");
    var size = Object.keys(map_metro).length,
        keys = Object.keys(map_metro);
    for (var i = 0; i < size; i++) {
      var key = keys[i];
      var items = map_metro[key];
      var g = draw_box.append('g').attr("id", key);
      var value = get_diversity(key, on.tab, on.gender);
      if (key != on.area) {
        for (var j = 0; j < items.length; j++) {
          var pkey = (items[j].name == 'path' ? 'd' : 'points');
          g.append(items[j].name).attr('class', 'hasAction map-item '+key.romanize())
                                 .attr(pkey, items[j][pkey])
                                 .attr('fill', bright(key_color[on.gender], -1+value/100))
                                 .attr('onclick', "togglePanel('area', '"+key+"')");
        }
      }
    }
    if (on.area.split(' ').length == 1 & on.area != '전국') {
      var items = map_metro[on.area];
      var g = draw_box.append('g').attr("id", on.area);
      var value = get_diversity(on.area, on.tab, on.gender);
      for (var j = 0; j < items.length; j++) {
        var pkey = (items[j].name == 'path' ? 'd' : 'points');
        g.append(items[j].name).attr('class', 'hasAction map-item '+on.area.romanize()+' current-area')
                               .attr(pkey, items[j][pkey])
                               .attr('fill', bright(key_color[on.gender], -1+value/100))
                               .attr('onclick', "togglePanel('area', '"+key+"')");
      }
    }
  } else if (on.level == level_table[2].key) { //regional
    graph.attr("viewBox", "0 0 509 716.105");
    var size = Object.keys(map_regional).length,
        keys = Object.keys(map_regional);
    for (var i = 0; i < size; i++) {
      var key = keys[i];
      var paths = map_regional[key];
      var g = draw_box.append('g').attr("id", key);
      var value = get_diversity(key, on.tab, on.gender);
      for (var j = 0; j < paths.length; j++) {
        if (key != on.area) {
          g.append('path').attr('class', 'hasAction map-item '+key.romanize()).attr('d', paths[j])
                          .attr('fill', bright(key_color[on.gender], -1+value/100))
                          .attr('onclick', "togglePanel('area', '"+key+"')");
          }
        }
      }
    if (on.area.split(' ').length == 2) {
      var g = draw_box.append('g').attr("id", on.area);
      var value = get_diversity(on.area, on.tab, on.gender);
      var paths = map_regional[on.area];
      for (var j = 0; j < paths.length; j++) {
        g.append('path').attr('class', 'hasAction map-item '+on.area.romanize()+' current-area').attr('d', paths[j])
                        .attr('fill', bright(key_color[on.gender], -1+value/100))
                        .attr('onclick', "togglePanel('area', '"+key+"')");
      }
    }
  }

  function zoomed() {
    draw_box.attr("transform", d3.event.transform);
  }


}

function seeDetail(k) {
  var dp = $("#detail-content");
  dp.text('');
  dp.append($("<h5></h5>").html("다양도 점수 <strong>" + on.area + "</strong>"));
  dp.append($("<h6></h6>").text(tab[on.tab].name));
  detailBarByGender(dp, on.tab)
  for (var i = 0; i < tab_table.length; i++) {
    if (tab_table[i].key != on.tab) {
      dp.append($("<h6></h6>").text(tab_table[i].name));
      detailBarByGender(dp, tab_table[i].key)
    }
  }
}

function detailBarByGender(p, t) {
  if(tab[t].hasGender) {
    detailBar(p, gender[on.gender].name, get_diversity(on.area, t, on.gender), key_color[on.gender]);
    for (var i = 0; i < gender_table.length; i++) {
      if(gender_table[i].key != on.gender) {
        detailBar(p, gender_table[i].name, get_diversity(on.area, t, gender_table[i].key), key_color[gender_table[i].key]);
      }
    }
  } else {
    detailBar(p, '전체', get_diversity(on.area, on.tab, on.gender), key_color[on.gender]);
  }
}

function detailBar(p, n, v, c) {
  var box = $("<div></div>").attr("class", "detail-bar-box");
  box.append(
    $("<div></div>").attr("class", "detail-bar-box-name").text(n + ": " + roundStr(v, 2)+"%"),
    $("<div></div>").attr("class", "detail-bar-box-bar-wrap")
      .append(
        $("<div></div>").attr("class", "detail-bar-box-bar-back")
          .append(
            $("<div></div>").attr("class", "detail-bar-box-bar").attr("style", "width: "+roundStr(v, 2)+"%; background-color: "+c+";")
          )
      )
  )
  p.append(box)
}
//from: http://westzero.tistory.com/112
/**
 * 한글을 초성/중성/종성 단위로 잘라서 배열로 반환한다.
 * 공백은 반환하지 않는다.
 *
 * 참조: http://dream.ahboom.net/entry/%ED%95%9C%EA%B8%80-%EC%9C%A0%EB%8B%88%EC%BD%94%EB%93%9C-%EC%9E%90%EC%86%8C-%EB%B6%84%EB%A6%AC-%EB%B0%A9%EB%B2%95
 *       http://helloworld.naver.com/helloworld/76650
 */
String.prototype.romanize = function() {
    var cCho  = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
        cJung = [ 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' ],
        cJong = [ '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
                  'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
        rCho  = [ 'g', 'gg', 'n', 'd', 'dd', 'r', 'm', 'b', 'bb', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h' ],
        rJung = [ 'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'woe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i' ],
        rJong = [ '', 'g', 'gg', 'gs', 'n', 'nj', 'nh', 'd', 'l', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'b', 'bs', 's', 'ss',
                  'ng', 'j', 'ch', 'k', 't', 'p', 'h' ],
        cho, jung, jong;

    var str = this,
        cnt = str.length,
        chars = [],
        cCode;

    for (var i = 0; i < cnt; i++) {
        cCode = str.charCodeAt(i);

        if (cCode == 32) { continue; }

        // 한글이 아닌 경우
        if (cCode < 0xAC00 || cCode > 0xD7A3) {
            //chars.push(str.charAt(i));
            continue;
        }

        cCode  = str.charCodeAt(i) - 0xAC00;

        jong = cCode % 28; // 종성
        jung = ((cCode - jong) / 28 ) % 21 // 중성
        cho  = (((cCode - jong) / 28 ) - jung ) / 21 // 초성

        chars.push(rCho[cho], rJung[jung]);
        if (rJong[jong] !== '') { chars.push(rJong[jong]); }
    }

    return chars.join("");
}
