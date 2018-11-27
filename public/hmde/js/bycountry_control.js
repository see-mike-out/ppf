let country_list = [
  {category: "general", key: "AU", name: {en: "Australia", ko: "호주"}},
  {category: "general", key: "AT", name: {en: "Austria", ko: "오스트리아"}},
  {category: "general", key: "BE", name: {en: "Belgium", ko: "벨기에"}},
  {category: "general", key: "CZ", name: {en: "Czech Republic", ko: "체코"}},
  {category: "general", key: "DK", name: {en: "Denmark", ko: "덴마크"}},
  {category: "general", key: "EE", name: {en: "Estonia", ko: "에스토니아"}},
  {category: "general", key: "FI", name: {en: "Finland", ko: "핀란드"}},
  {category: "general", key: "FR", name: {en: "France", ko: "프랑스"}},
  {category: "general", key: "DE", name: {en: "Germany", ko: "독일"}},
  {category: "general", key: "GR", name: {en: "Greece", ko: "그리스"}},
  {category: "general", key: "HU", name: {en: "Hungary", ko: "헝가리"}},
  {category: "general", key: "IS", name: {en: "Iceland", ko: "아이슬란드"}},
  {category: "general", key: "IE", name: {en: "Ireland", ko: "아일랜드"}},
  {category: "general", key: "IT", name: {en: "Italy", ko: "이탈리아"}},
  {category: "general", key: "JP", name: {en: "Japan", ko: "일본"}},
  {category: "general", key: "KR", name: {en: "Korea", ko: "한국"}},
  {category: "general", key: "LU", name: {en: "Luxembourg", ko: "룩셈부르크"}},
  {category: "general", key: "NL", name: {en: "Netherlands", ko: "네덜란드"}},
  {category: "general", key: "NZ", name: {en: "New Zealand", ko: "뉴질랜드"}},
  {category: "general", key: "NO", name: {en: "Norway", ko: "노르웨이"}},
  {category: "general", key: "PL", name: {en: "Poland", ko: "폴란드"}},
  {category: "general", key: "PT", name: {en: "Portugal", ko: "포르투갈"}},
  {category: "general", key: "SK", name: {en: "Slovak Republic", ko: "슬로바키아"}},
  {category: "general", key: "SV", name: {en: "Slovenia", ko: "슬로베니아"}},
  {category: "general", key: "ES", name: {en: "Spain", ko: "스페인"}},
  {category: "general", key: "SE", name: {en: "Sweden", ko: "스웨덴"}},
  {category: "general", key: "GB", name: {en: "United Kingdom", ko: "영국"}},
  {category: "general", key: "US", name: {en: "United States", ko: "미국"}},
  {category: "general", key: "LV", name: {en: "Latvia", ko: "라트비아"}},
  {category: "summary", key: "AVR", name: {en: "Average", ko: "평균"}},
  {category: "summary", key: "MAX", name: {en: "Maximum", ko: "최대"}},
  {category: "summary", key: "MIN", name: {en: "Minimum", ko: "최소"}}
];

let cmp_glb = {
  selected: []
};

let formatFunctions = {
  'time': null,
  'float(1)': float_format(1),
  'float(2)': float_format(2),
  'float(4)': float_format(2),
  'float(8)': float_format(2)
}

let create_country_list = function(pl, pl2, ln) {
  let place = $(pl);
  country_list.sort(function(a, b) {
    if (a.category == 'general' && b.category == 'summary') return 1;
    else if (a.category == 'summary' && b.category == 'general') return -1;
    else if (a.category == 'summary' && b.category == 'summary') {
      if (a.name[ln] > b.name[ln]) return 1;
      else if (a.name[ln] < b.name[ln]) return -1;
      else return 0;
    } else {
      if (a.name[ln] > b.name[ln]) return 1;
      else if (a.name[ln] < b.name[ln]) return -1;
      else return 0;
    }
  });
  for(let i = 0; i < country_list.length; i++) {
    let cell = $('<span>').text(country_list[i].name[ln])
      .attr('id', "list-"+country_list[i].key)
      .click(function() { add_country(pl2, country_list[i].key, ln) });  
    place.append(cell);
  }
}

let add_country = function(pl, key, ln) {
  if (cmp_glb.selected.indexOf(key) >= 0) {
    let p = cmp_glb.selected.indexOf(key);
    cmp_glb.selected.splice(p, 1);
    $("#list-"+key).attr('data-selected', 'false')
  } else {
    if (cmp_glb.selected.length >= 2) {
      let del = cmp_glb.selected.splice(0, 1);
      $("#list-"+del[0]).attr('data-selected', 'false')
    }
    cmp_glb.selected.push(key);
    $("#list-"+key).attr('data-selected', 'true')
  }
  if (cmp_glb.selected.length == 2) {
    get_cmp(pl, ln)
  } else {
    hide_cmp();
  }
  cmp_glb.ln = ln;
  formatFunctions.time = function(v) { return seeMWDHM(v, ln)};
}

let print_info = function() {
  $('h2.table_title').text(cmp_glb.title);
}
let delete_info = function() {
  $('h2.table_title').text("");
}


let get_cmp = function(pl, ln) {
  let key1 = cmp_glb.selected[0], key2 = cmp_glb.selected[1];
  let ci1 = country_list.filter(function(d) { return d.key == key1; });
  let ci2 = country_list.filter(function(d) { return d.key == key2; });
  if (ci1.length >= 1 && ci2.length >= 1) {
    let country_info_1 = ci1[0];
    let country_info_2 = ci2[0];
    let place = $(pl);
    $.getJSON( "/hmde/data/hmde_data_" + ln + "_header.json" , function( c ){
        let header_info = c;
        $.getJSON( "/hmde/data/hmde_data_" + ln + ".json" , function( data ){
          cmp_glb.header = header_info;
          cmp_glb.data = [
            data.filter(function(d) { return d.stAbbr == key1; })[0],
            data.filter(function(d) { return d.stAbbr == key2; })[0]
          ];
          cmp_glb.place = place;
          cmp_glb.plkey = pl;
          cmp_glb.title = country_info_1.name[ln] + " vs. " + country_info_2.name[ln] ;
          draw_cmp();
        });
    });
  }
  $('.sublist_foldable').attr('data-open', 'false');
}

let draw_cmp = function() {
  print_info();
  cmp_glb.place.attr('data-show', 'true');
  let ckeys = ["perTot", "ghgTot", "vadTot",
              "perAgr", "ghgAgr", "vadAgr",
              "perMnf", "ghgMnf", "vadMnf",
              "perEng", "ghgEng", "vadEng",
              "perTsp", "ghgTsp", "vadTsp",
              "perEtc", "ghgEtc", "vadEtc",];
  
  $('.cmp_cumulate_bar').empty();
  $('.cmp_cumulate_bars.bar_1 .cmp_cumulate_name').text(cmp_glb.data[0].stName);
  $('.cmp_cumulate_bars.bar_2 .cmp_cumulate_name').text(cmp_glb.data[1].stName);
  
  let tot1 = cmp_glb.data[0]['ghgAgr'] + cmp_glb.data[0]['ghgMnf'] + cmp_glb.data[0]['ghgEng'] + cmp_glb.data[0]['ghgTsp'] + cmp_glb.data[0]['ghgEtc'] + cmp_glb.data[0]['ghgIdw'] + cmp_glb.data[0]['ghgIda'];
  let tot2 = cmp_glb.data[1]['ghgAgr'] + cmp_glb.data[1]['ghgMnf'] + cmp_glb.data[1]['ghgEng'] + cmp_glb.data[1]['ghgTsp'] + cmp_glb.data[1]['ghgEtc'] + cmp_glb.data[1]['ghgIdw'] + cmp_glb.data[1]['ghgIda'];
  
  $('.cmp_cumulate_bars.bar_1 .cmp_cumulate_bar').append([
    $('<div>').css('background-color', '#fdb615').css('width', percent(cmp_glb.data[0]['ghgAgr'] / tot1)).css('max-width', percent(cmp_glb.data[0]['ghgAgr'] / tot1)).attr('data-text', (cmp_glb.ln=='en'?'Agriculture':'농업')+': '+sepDec(cmp_glb.data[0]['ghgAgr'], 2) + ' CO2eq T'),
    $('<div>').css('background-color', '#0072bc').css('width', percent(cmp_glb.data[0]['ghgMnf'] / tot1)).css('max-width', percent(cmp_glb.data[0]['ghgMnf'] / tot1)).attr('data-text', (cmp_glb.ln=='en'?'Manuf. & Const.':'제조건축업')+': '+sepDec(cmp_glb.data[0]['ghgMnf'], 2) + ' CO2eq T'),
    $('<div>').css('background-color', '#64bd5e').css('width', percent(cmp_glb.data[0]['ghgEng'] / tot1)).css('max-width', percent(cmp_glb.data[0]['ghgEng'] / tot1)).attr('data-text', (cmp_glb.ln=='en'?'Energy':'에너지산업')+': '+sepDec(cmp_glb.data[0]['ghgEng'], 2) + ' CO2eq T'),
    $('<div>').css('background-color', '#e05177').css('width', percent(cmp_glb.data[0]['ghgTsp'] / tot1)).css('max-width', percent(cmp_glb.data[0]['ghgTsp'] / tot1)).attr('data-text', (cmp_glb.ln=='en'?'Transport':'수송')+': '+sepDec(cmp_glb.data[0]['ghgTsp'], 2) + ' CO2eq T'),
    $('<div>').css('background-color', '#8e58a3').css('width', percent(cmp_glb.data[0]['ghgEtc'] / tot1)).css('max-width', percent(cmp_glb.data[0]['ghgEtc'] / tot1)).attr('data-text', (cmp_glb.ln=='en'?'Others':'비제조')+': '+sepDec(cmp_glb.data[0]['ghgEtc'], 2) + ' CO2eq T'),
    $('<div>').css('background-color', '#16b9d2').css('width', percent(cmp_glb.data[0]['ghgIdw'] / tot1)).css('max-width', percent(cmp_glb.data[0]['ghgIdw'] / tot1)).attr('data-text', (cmp_glb.ln=='en'?'Waste':'폐기물')+': '+sepDec(cmp_glb.data[0]['ghgIdw'], 2) + ' CO2eq T'),
    $('<div>').css('background-color', '#f7901e').css('width', percent(cmp_glb.data[0]['ghgIda'] / tot1)).css('max-width', percent(cmp_glb.data[0]['ghgIda'] / tot1)).attr('data-text', (cmp_glb.ln=='en'?'Additionary':'공업부가')+': '+sepDec(cmp_glb.data[0]['ghgIda'], 2) + ' CO2eq T'),
  ]);
  $('.cmp_cumulate_bars.bar_2 .cmp_cumulate_bar').append([
    $('<div>').css('background-color', '#fdb615').css('width', percent(cmp_glb.data[1]['ghgAgr'] / tot2)).css('max-width', percent(cmp_glb.data[1]['ghgAgr'] / tot2)).attr('data-text', (cmp_glb.ln=='en'?'Agriculture':'농업')+': '+sepDec(cmp_glb.data[1]['ghgAgr'], 2) + ' CO2eq T'),
    $('<div>').css('background-color', '#0072bc').css('width', percent(cmp_glb.data[1]['ghgMnf'] / tot2)).css('max-width', percent(cmp_glb.data[1]['ghgMnf'] / tot2)).attr('data-text', (cmp_glb.ln=='en'?'Manuf. & Const.':'제조건축업')+': '+sepDec(cmp_glb.data[1]['ghgMnf'], 2) + ' CO2eq T'),
    $('<div>').css('background-color', '#64bd5e').css('width', percent(cmp_glb.data[1]['ghgEng'] / tot2)).css('max-width', percent(cmp_glb.data[1]['ghgEng'] / tot2)).attr('data-text', (cmp_glb.ln=='en'?'Energy':'에너지산업')+': '+sepDec(cmp_glb.data[1]['ghgEng'], 2) + ' CO2eq T'),
    $('<div>').css('background-color', '#e05177').css('width', percent(cmp_glb.data[1]['ghgTsp'] / tot2)).css('max-width', percent(cmp_glb.data[1]['ghgTsp'] / tot2)).attr('data-text', (cmp_glb.ln=='en'?'Transport':'수송')+': '+sepDec(cmp_glb.data[1]['ghgTsp'], 2) + ' CO2eq T'),
    $('<div>').css('background-color', '#8e58a3').css('width', percent(cmp_glb.data[1]['ghgEtc'] / tot2)).css('max-width', percent(cmp_glb.data[1]['ghgEtc'] / tot2)).attr('data-text', (cmp_glb.ln=='en'?'Others':'비제조')+': '+sepDec(cmp_glb.data[1]['ghgEtc'], 2) + ' CO2eq T'),
    $('<div>').css('background-color', '#16b9d2').css('width', percent(cmp_glb.data[1]['ghgIdw'] / tot2)).css('max-width', percent(cmp_glb.data[1]['ghgIdw'] / tot2)).attr('data-text', (cmp_glb.ln=='en'?'Waste':'폐기물')+': '+sepDec(cmp_glb.data[1]['ghgIdw'], 2) + ' CO2eq T'),
    $('<div>').css('background-color', '#f7901e').css('width', percent(cmp_glb.data[1]['ghgIda'] / tot2)).css('max-width', percent(cmp_glb.data[1]['ghgIda'] / tot2)).attr('data-text', (cmp_glb.ln=='en'?'Additionary':'공업부가')+': '+sepDec(cmp_glb.data[1]['ghgIda'], 2) + ' CO2eq T'),
  ]);
  
  $('.cmp_cumulate_bars .cmp_cumulate_bar div').on('mouseover', toggle_tooltip);
  $('.cmp_cumulate_bars .cmp_cumulate_bar div').on('mouseout', toggle_tooltip);
  
  for (let i = 0; i < ckeys.length; i++) {
    let ck = ckeys[i];
    let area = $("#cmp_" + ckeys[i]);
    let value = [parseFloat(cmp_glb.data[0][ck]), parseFloat(cmp_glb.data[1][ck])];
    let rel = [];
    if(!value[0] && value[1]) rel = [0, 100];
    else if(value[0] && !value[1]) rel = [100, 0];
    else if(!value[0] && !value[1]) rel = [0, 0];
    else if(value[0]>value[1]) rel = [100, value[1]/value[0]*100];
    else rel = [value[0]/value[1]*100, 100];
    
    let header = cmp_glb.header.filter(function(d) { return d.code == ck;})[0];
    let type = header.tableType;
    area.find('.cmp_bar_1 .cmp_bar').css('height', rel[0]+"%");
    area.find('.cmp_bar_2 .cmp_bar').css('height', rel[1]+"%");
    area.find('.cmp_name_1 .cmp_name').text(cmp_glb.data[0].stName);
    area.find('.cmp_name_2 .cmp_name').text(cmp_glb.data[1].stName);
    area.find('.cmp_name_1 .cmp_value').text(formatFunctions[type](value[0]));
    area.find('.cmp_name_2 .cmp_value').text(formatFunctions[type](value[1]));
    area.find('.cmp_bar_title').text(header.name)
  }
}

let hide_cmp = function(){
  if(cmp_glb.place){
    cmp_glb.place.attr('data-show', 'false');
  }
  delete_info();
}


let toggle_tooltip = function() {
  let tooltip = d3.select('#cumul_tooltip');
  if (tooltip.attr('data-show') == 'false') {
    let value = d3.select(this).attr('data-text');
    tooltip.select('.value').text(value);
    tooltip.attr('data-show', 'true');
    
    let mainbox = document.querySelector('#cmp_cumulate');
    let item = d3.select(this);
    let x = 0, y = 0;
    let tw = tooltip.node().offsetWidth;
    let th = tooltip.node().offsetHeight;
    if (event.clientX + tw  + window.scrollX > mainbox.offsetWidth) {
      x = event.clientX - tw;
    } else {
      x = event.clientX + window.scrollX;
    }
    y = event.clientY + window.scrollY;
    tooltip.style('left', x+'px');
    tooltip.style('top', y+'px');
  } else {
    tooltip.attr('data-show', 'false');
  }
}

let hide_tooltip = function () {
  d3.select('#cumul_tooltip').attr('data-show', 'false');
}