let table_list = [
  {
    key: "gini",
    name: {en: "GINI Index", ko: "지니계수"},
    desc: {
      en: "The unit for GDP per Capita is 2011 Constant USD.", 
      ko: "1인당 국민총생산 단위는 2011년 고정 미국 달러입니다.",
    },
    header: ["name", "gini_value", "gini_year", "gini_sour", "gdpc", "gdpc_sour", "expo_value"]
  }, {
    key: "gnipc",
    name: {en: "GNI per Capita", ko: "1인당 국민 총소득"},
    desc: {
      en: "The unit for GNI/GDP per Capita is 2011 Constant USD.", 
      ko: "1인당 국민총생산 단위는 2011년 고정 미국 달러입니다.",
    },
    header: ["name", "gnipc_f", "gnipc_m", "gnipc_b", "gnipc_ratio_fm", "gnipc_ratio_fb", "gnipc_ratio_mb", "gnipc_diff_fm", "gnipc_diff_fb", "gnipc_diff_mb", "gini_value", "gdpc"]
  }, {
    key: "gni",
    name: {en: "GNI", ko: "국민 총소득"},
    desc: {
      en: "The unit for GNI/GDP is 2011 Constant USD.", 
      ko: "1인당 국민총생산 단위는 2011년 고정 미국 달러입니다.",
    },
    header: ["name", "gni_f", "gni_m", "gni_b", "gni_ratio_fm", "gni_ratio_fb", "gni_ratio_mb", "gni_diff_fm", "gni_diff_fb", "gni_diff_mb", "gini_value", "gdpc"]
  }, {
    key: "cum_f",
    name: {en: "Cumulative Income, Female", ko: "분위별 누적 수입, 여성"},
    desc: {
      en: "The unit for income value is 2011 Constant USD.", 
      ko: "수입의 단위는 2011년 고정 미국 달러입니다.",
    },
    header: ["name", "p1_f", "p2_f", "p3_f", "p4_f", "p5_f", "p6_f", "p7_f", "p8_f", "p9_f", "p10_f"]
  }, {
    key: "cum_m",
    name: {en: "Cumulative Income, Male", ko: "분위별 누적 수입, 남성"},
    desc: {
      en: "The unit for income value is 2011 Constant USD.", 
      ko: "수입의 단위는 2011년 고정 미국 달러입니다.",
    },
    header: ["name", "p1_m", "p2_m", "p3_m", "p4_m", "p5_m", "p6_m", "p7_m", "p8_m", "p9_m", "p10_m"]
  }, {
    key: "cum_b",
    name: {en: "Cumulative Income, Both Sexes", ko: "분위별 누적 수입, 전체"},
    desc: {
      en: "The unit for income value is 2011 Constant USD.", 
      ko: "수입의 단위는 2011년 고정 미국 달러입니다.",
    },
    header: ["name", "p1_b", "p2_b", "p3_b", "p4_b", "p5_b", "p6_b", "p7_b", "p8_b", "p9_b", "p10_b"]
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
        if (a.abbr > b.abbr) return 1;
        else if (a.abbr < b.abbr) return -1;
        else return 0;
      } else {
        if (a.name > b.name) return 1;
        else if (a.name < b.name) return -1;
        else return 0;
      }
    },
    d: function(a, b) {
      if (a.category == 'general' && b.category == 'summary') return 1;
      else if (a.category == 'summary' && b.category == 'general') return -1;
      else if (a.category == 'summary' && b.category == 'summary') {
        if (a.abbr > b.abbr) return 1;
        else if (a.abbr < b.abbr) return -1;
        else return 0;
      } else {
        if (a.name > b.name) return -1;
        else if (a.name < b.name) return 1;
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
          if (a.abbr > b.abbr) return 1;
          else if (a.abbr < b.abbr) return -1;
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
          if (a.abbr > b.abbr) return 1;
          else if (a.abbr < b.abbr) return -1;
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
          if (a.abbr > b.abbr) return 1;
          else if (a.abbr < b.abbr) return -1;
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
          if (a.abbr > b.abbr) return 1;
          else if (a.abbr < b.abbr) return -1;
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
    $.getJSON( "/wpmy/data/wpmy_data_" + ln + "_header.json" , function( h ){
        let header = h.filter(function(d) { return table_info.header.indexOf(d.code) >= 0 });
        $.getJSON( "/wpmy/data/wpmy_data_" + ln + ".json" , function( data ){
          tab_glb.order = table_info.header;
          tab_glb.header = header;
          tab_glb.data = data.sort(sort_function.country_name.a);
          tab_glb.ln = ln;
          tab_glb.place = place;
          tab_glb.title = table_info.name[ln];
          tab_glb.desc = table_info.desc[ln];
          sort_info['name'] = 'a';
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
        case 'float(0)':
          row.append($('<td>').text(float_format(0)(cell_data)).attr('data-type', 'number'));
          break;
        case 'float(1)':
          row.append($('<td>').text(float_format(1)(cell_data)).attr('data-type', 'number'));
          break;
        case 'float(2)':
          row.append($('<td>').text(float_format(2)(cell_data)).attr('data-type', 'number'));
          break;
        case 'float(3)':
          row.append($('<td>').text(float_format(3)(cell_data)).attr('data-type', 'number'));
          break;
        case 'float(4)':
          row.append($('<td>').text(float_format(4)(cell_data)).attr('data-type', 'number'));
          break;
        case 'float(8)':
          row.append($('<td>').text(float_format(8)(cell_data)).attr('data-type', 'number'));
          break;
        case 'ratio(2)':
          row.append($('<td>').text(ratio_format(2)(cell_data)).attr('data-type', 'percent'));
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
    case 'float(3)':
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
  if (key == 'name') {
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