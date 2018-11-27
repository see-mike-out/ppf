let table_list = [
  {
    key: "per",
    name: {en: "GHG Emissions per Unit Income", ko: "수입당 온실가스 배출량"},
    desc: {
      en: "This table contains basic data for this project. Currency rates to USD is obtained from IMF Data. (Unit: kg, CO2 Equivalent / 1,000 USD) The values of each sector include the greenhouse gas emissions from waste, and the values of each non-agricultural sector include the greenhouse gas emissions from the additionary part. 'Additionary' includes solvent, fugutive emissions from fuels, and industrial processes, all of which are caused mainly by non-agricultural industry. ", 
      ko: "이 표는 프로젝트의 기초 자료를 담고 있습니다. 미국 달러에 대한 환율은 IMF Data에서 참고하였습니다. (단위: CO2환산kg / 1,000 미국 달러) 각 분야의 값에는 폐기물에 의한 배출량이 포함되어 있고, 비농업 분야의 배출량에는 공업부가 배출량이 포함되어 있습니다. '공업부가'란 비농업분야 산업에 의해 주로 발생되는 용매, 탈루원료, 산업부산물 등을 포함합니다.",
    },
    header: ["stName", "perTot", "perAgr", "perMnf", "perEng", "perTsp", "perEtc"]
  },
  {
    key: "ghg",
    name: {en: "Greenhouse Gas Emissions", ko: "온실가스 배출량"},
    desc: {
      en: "This table shows the amount of greenhouse gas emissions by countries and industrial sectors. (Unit: Tonnes, CO2 Equivalent)", 
      ko: "이 표는 나라마다, 산업 분야마다 얼마나 온실가스를 배출하는지 보여줍니다. (단위: CO2 환산톤)"
    },
    header: ["stName", "ghgTot", "ghgAgr", "ghgMnf", "ghgEng", "ghgTsp", "ghgEtc","ghgIdw", "ghgIda"]
  },
  {
    key: "vad",
    name: {en: "Value Added", ko: "부가가치"},
    desc: {
      en: "This table shows the value added of each country by industrial sectors. (Unit: USD, Millions)", 
      ko: "이 표는 각 나라의 산업 분야별 부가가치를 보여줍니다. (단위: 백만 미국달러)"
    },
    header: ["stName", "vadTot", "vadAgr", "vadMnf", "vadEng", "vadTsp", "vadEtc"]
  },
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
    $.getJSON( "/hmde/data/hmde_data_" + ln + "_header.json" , function( h ){
        let header = h.filter(function(d) { return table_info.header.indexOf(d.code) >= 0 });
        $.getJSON( "/hmde/data/hmde_data_" + ln + ".json" , function( data ){
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