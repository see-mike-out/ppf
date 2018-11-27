let table_list = [
  {
    key: "perTime",
    name: {en: "Time to Buy 1", ko: "1개를 사려면?"},
    desc: {
      en: "This table shows how long you need to work to buy a unit of products, based on minimum wage rate.", 
      ko: "이 표는 최저 임금을 기준으로 단위 상품을 구입하기 위해 얼마나 많이 일해야 하는지를 보여줍니다."
    },
    header: ["stName", "forBm", "forCc", "forAd", "forKb", "forDp", "mwHourlyUsd","gdpcUsd", "pvUsd"]
  },
  {
    key: "perWage",
    name: {en: "1 Hour Can Buy", ko: "1시간 일하면?"},
    desc: {
      en: "This table shows how many you can buy with one hour of labor, based on minimum wage rate.",
      ko: "이 표는 최저 임금을 기준으로 한 시간을 일하면 얼마나 많은 양을 구입할 수 있는지를 보여줍니다."
    },
    header: ["stName", "perBm", "perCc", "perAd", "perKb", "perDp", "mwHourlyUsd","gdpcUsd", "pvUsd"]
  },
  {
    key: "basic_usd",
    name: {en: "Basic Data (USD)", ko: "기초 자료 (미국 달러)"},
    desc: {
      en: "This table contains basic data for this project. Currency rates to USD is obtained from IMF Data.", 
      ko: "이 표는 프로젝트의 기초 자료를 담고 있습니다. 미국 달러에 대한 환율은 IMF Data에서 참고하였습니다.",
    },
    header: ["stName", "gdpcUsd", "pvUsd", "mwHourlyUsd", "bmUsd", "ccUsd", "adUsd", "kbUsd", "dpUsd"]
  },
  {
    key: "basic_loc",
    name: {en: "Basic Data (Local Currency)", ko: "기초 자료 (현지 통화 단위)"},
    desc: {
      en: "This table contains basic data for this project. Currency rates to USD is obtained from IMF Data. Local currency may differ by items if it is estimated value.",
      ko: "이 표는 프로젝트의 기초 자료를 담고 있습니다. 미국 달러에 대한 환율은 IMF Data에서 참고하였습니다. 추산된 자료의 경우 통화 단위가 다를 수 있습니다."
    },
    header: ["stName", "crName", "gdpcLoc", "gdpcCr", "pvLoc", "pvCr", "mwHourlyLoc", "mwCr", "bmUsd", "bmCr", "ccLoc", "ccCr", "adLoc", "adCr", "kbUsd", "kbCr", "dpUsd", "dpCr"]
  },
  {
    key: "gdpcData",
    name: {en: "GDP per Capita", ko: "1인당 GDP"},
    desc: {ko: "", en: ""},
    header: ["stName", "gdpcUsd", "gdpcLoc", "gdpcCr", "gdpcY"]
  },
  {
    key: "pvData",
    name: {en: "Poverty Level", ko: "최저생계비"},
    desc: {ko: "", en: ""},
    header: ["stName", "pvUsd", "pvLoc", "pvCr", "pvY", "pvNote", "pvSource"]
  },
  {
    key: "mwData",
    name: {en: "Minimum Wage & Weekly Work Hour", ko: "최저 임금과 주당 노동 시간"},
    desc: {ko: "", en: ""},
    header: ["stName", "mwHourlyUsd", "mwHourlyLoc", "mwUnitUsd", "mwUnitLoc", "mwCr", "mwUnit", "mwWhUnit", "mwY", "mwNote", "mwSource", "whWeekly", "whNote", "whSource"]
  },
  {
    key: "bmData",
    name: {en: "McDonald's Big Mac", ko: "맥도날드 빅맥"},
    desc: {ko: "", en: ""},
    header: ["stName", "bmUsd", "bmLoc", "bmCr"]
  },
  {
    key: "ccData",
    name: {en: "Coca-Cola", ko: "코카 콜라"},
    desc: {ko: "", en: ""},
    header: ["stName", "ccUsd", "ccLoc", "ccCr", "cc250Loc", "cc500Loc", "cc1000Loc", "cc1250Loc", "cc1500Loc", "cc1750Loc", "cc2000Loc", "ccNote", "ccSource"]
  },
  {
    key: "adData",
    name: {en: "Adidas Training Pants", ko: "아디다스 트레이닝 바지"},
    desc: {ko: "", en: ""},
    header: ["stName", "adUsd", "adLoc", "adCr", "adPid", "adSource"]
  },
  {
    key: "kbData",
    name: {en: "Ikea Bed Set", ko: "이케아 침대 세트"},
    desc: {ko: "", en: ""},
    header: ["stName", "kbUsd", "kbLoc", "kbCr", "kbSize", "kbNote", "kbFLoc", "kbFPid", "kbFSource", "kbBLoc", "kbBPid", "kbBSource", "kbMLoc", "kbMPid", "kbMSource"]
  },
  {
    key: "dpData",
    name: {en: "Dell 15-inch Laptop", ko: "델 15인치 노트북"},
    desc: {ko: "", en: ""},
    header: ["stName", "dpUsd", "dpLoc", "dpCr", "dpPid", "dpSize", "dpCpu", "dpOs", "dpMemory", "dpHdd", "dpNote", "dpSource"]
  }
];

let tab_glb = {
  order: null,
  header: null,
  data: null
}

let sort_info = {}

let sort_function = {
  country_name: {
    a: function(a, b) {
      if (a.category == 'general' && b.category == 'summary') return 1;
      else if (a.category == 'summary' && b.category == 'general') return -1;
      else if (a.category == 'summary' && b.category == 'summary') {
        if (a.stAbbr > b.stAbbr) return 1;
        else if (a.stAbbr < b.stAbbr) return -1;
        else return 0;
      } else {
        if (a.stName > b.stName) return 1;
        else if (a.stName < b.stName) return -1;
        else return 0;
      }
    },
    d: function(a, b) {
      if (a.category == 'general' && b.category == 'summary') return 1;
      else if (a.category == 'summary' && b.category == 'general') return -1;
      else if (a.category == 'summary' && b.category == 'summary') {
        if (a.stAbbr > b.stAbbr) return 1;
        else if (a.stAbbr < b.stAbbr) return -1;
        else return 0;
      } else {
        if (a.stName > b.stName) return -1;
        else if (a.stName < b.stName) return 1;
        else return 0;
      }
    }
  },
  text: {
    a: function(key) {
      return function(a, b) {
        if (a.category == 'general' && b.category == 'summary') return 1;
        else if (a.category == 'summary' && b.category == 'general') return -1;
        else if (a.category == 'summary' && b.category == 'summary') {
          if (a.stAbbr > b.stAbbr) return 1;
          else if (a.stAbbr < b.stAbbr) return -1;
          else return 0;
        } else {
          if (a[key] > b[key]) return 1;
          else if (a[key] < b[key]) return -1;
          else return 0;
        }
      }
    },
    d: function(key) {
      return function(a, b) {
        if (a.category == 'general' && b.category == 'summary') return 1;
        else if (a.category == 'summary' && b.category == 'general') return -1;
        else if (a.category == 'summary' && b.category == 'summary') {
          if (a.stAbbr > b.stAbbr) return 1;
          else if (a.stAbbr < b.stAbbr) return -1;
          else return 0;
        } else {
          if (a[key] > b[key]) return -1;
          else if (a[key] < b[key]) return 1;
          else return 0;
        }
      }
    }
  },
  number: {
    a: function(key) {
      return function(a, b) {
        if (a.category == 'general' && b.category == 'summary') return 1;
        else if (a.category == 'summary' && b.category == 'general') return -1;
        else if (a.category == 'summary' && b.category == 'summary') {
          if (a.stAbbr > b.stAbbr) return 1;
          else if (a.stAbbr < b.stAbbr) return -1;
          else return 0;
        } else {
          return a[key] - b[key];
        }
      }
    },
    d: function(key) {
      return function(a, b) {
        if (a.category == 'general' && b.category == 'summary') return 1;
        else if (a.category == 'summary' && b.category == 'general') return -1;
        else if (a.category == 'summary' && b.category == 'summary') {
          if (a.stAbbr > b.stAbbr) return 1;
          else if (a.stAbbr < b.stAbbr) return -1;
          else return 0;
        } else {
          return b[key] - a[key];
        }
      }
    }
  }
}

let get_table = function(pl, key, ln) {
  let ti = table_list.filter(function(d) { return d.key == key; });
  if (ti.length >= 1) {
    let table_info = ti[0];
    let place = $(pl);
    $.getJSON( "/hmml/data/hmml_data_" + ln + "_header.json" , function( h ){
        let header = h.filter(function(d) { return table_info.header.indexOf(d.code) >= 0 });
        $.getJSON( "/hmml/data/hmml_data_" + ln + ".json" , function( data ){
          tab_glb.order = table_info.header;
          tab_glb.header = header;
          tab_glb.data = data.sort(sort_function.country_name.a);
          tab_glb.ln = ln;
          tab_glb.place = place;
          tab_glb.title = table_info.name[ln];
          tab_glb.desc = table_info.desc[ln];
          sort_info['stName'] = 'a';
          draw_table();
        });
    });
  }
  $('.sublist_foldable').attr('data-open', 'false');
}

let print_info = function() {
  let title = $('<h2>').text(tab_glb.title).addClass('table_title');
  let desc = $('<p>').text(tab_glb.desc);
  tab_glb.place.append(title);
  tab_glb.place.append(desc);
}

let draw_table = function() {
  let header = tab_glb.header, data = tab_glb.data, order = tab_glb.order, ln = tab_glb.ln, place = tab_glb.place;
  if (header && data) {
    let table = $('<table>').addClass('hmml_table');
    table.append(get_table_header(header, order));
    table.append(get_table_body(data, order, header, ln));
    place.empty();
    print_info();
    place.append(table);
  }
}

let get_table_header = function(header, order) {
  let tr = $('<tr>');
  for(let i = 0; i < order.length; i++) {
    let cell = header.filter(function(d) { return d.code == order[i]; })
    if (cell.length > 0){
      tr.append(
        $('<td>').text(cell[0].name).click(function() { sort_table(cell[0].code); })
      )
    } else {
      tr.append(
        $('<td>').text('')
      )
    }
  }
  return $('<thead>').append(tr);
}

let get_table_body = function(data, order, header, ln) {
  let tbody = $('<tbody>')
  for(let i = 0; i < data.length; i++) {
    let row = $('<tr>');
    let row_data = data[i];
    for (let j = 0; j < order.length; j++) {
      let cell_data = row_data[order[j]];
      let cell_value;
      switch (header.filter(function(d) { return d.code == order[j]; })[0].tableType) {
        case 'text':
          row.append($('<td>').text(cell_data).attr('data-type', 'text'));
          break;
        case 'lnText':
          row.append($('<td>').text(cell_data).attr('data-type', 'text'));
          break;
        case 'bool':
          row.append($('<td>').text(cell_data).attr('data-type', 'aux'));
          break;
        case 'float(1)':
          row.append($('<td>').text(float_format(1)(cell_data)).attr('data-type', 'number'));
          break;
        case 'float(2)':
          row.append($('<td>').text(float_format(2)(cell_data)).attr('data-type', 'number'));
          break;
        case 'float(4)':
          row.append($('<td>').text(float_format(4)(cell_data)).attr('data-type', 'number'));
          break;
        case 'float(8)':
          row.append($('<td>').text(float_format(8)(cell_data)).attr('data-type', 'number'));
          break;
        case 'time':
          row.append($('<td>').text(seeMWDHM(cell_data, ln)).attr('data-type', 'number'));
          break;
        case 'note':
          row.append($('<td>').append(get_table_note(cell_data)).attr('data-type', 'aux'));
          break;
        case 'link':
          row.append($('<td>').append(get_table_link(cell_data)).attr('data-type', 'aux'));
          break;
      }
      
    }
    tbody.append(row);
  }
  return tbody;
}

let get_table_note = function(note) {
  if (note) return $('<span>').text('note').attr('data-note', note)
    .on('mouseover', show_table_note).on('mouseout', remove_table_note);
  else return '-';
}

let show_table_note = function() {
  let text = $(this).attr('data-note')
  if(text.length > 0) tab_glb.place.append($('<div>').addClass('table_note').text(text).css('top', event.clientY).css('left', event.clientX));
}
let remove_table_note = function() {
  $('.table_note').remove();
}

let get_table_link = function(link) {
  if (link) return $('<a>').text('link').attr('href', link).attr('target', '_blank');
  else return '-';
}

let sort_table = function(key) {
  let sorttype = null;
  switch (tab_glb.header.filter(function(d) { return d.code == key; })[0].tableType) {
    case 'text':
      sorttype = 'text';
      break;
    case 'lnText':
      sorttype = 'text';
      break;
    case 'bool':
      sorttype = 'text';
      break;
    case 'float(1)':
      sorttype = 'number';
      break;
    case 'float(2)':
      sorttype = 'number';
      break;
    case 'float(4)':
      sorttype = 'number';
      break;
    case 'float(8)':
      sorttype = 'number';
      break;
    case 'time':
      sorttype = 'number';
      break;
    case 'note':
      sorttype = 'text';
      break;
    case 'link':
      sorttype = 'text';
      break;
  }
  if (key == 'stName') {
    if( !sort_info[key] ) {
      tab_glb.data.sort(sort_function.country_name.a);
      sort_info[key] = 'a';
    } else if ( sort_info[key] == 'd' ) {
      tab_glb.data.sort(sort_function.country_name.a);
      sort_info[key] = 'a';
    } else {
      tab_glb.data.sort(sort_function.country_name.d);
      sort_info[key] = 'd';
    }
    draw_table();
  }
  else if (sorttype) {
    if( !sort_info[key] ) {
      tab_glb.data.sort(sort_function[sorttype].a(key));
      sort_info[key] = 'a';
    } else if ( sort_info[key] == 'd' ) {
      tab_glb.data.sort(sort_function[sorttype].a(key));
      sort_info[key] = 'a';
    } else {
      tab_glb.data.sort(sort_function[sorttype].d(key));
      sort_info[key] = 'd';
    }
    draw_table();
  }
  
}

let create_table_list = function(pl, pl2, ln) {
  let place = $(pl);
  for(let i = 0; i < table_list.length; i++) {
    let cell = $('<span>').text(table_list[i].name[ln]).click(function() { get_table(pl2, table_list[i].key, ln) });
    place.append(cell);
  }
}