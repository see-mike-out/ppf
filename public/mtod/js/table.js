//global
function global() {
  setSubByQuery();
  refresh();
}

function refresh() {
  showPanel();
  initiateTable();
  setCurrentUrl();
}

var isNarrow = (window.innerWidth < 800 ? true : false);

//predata
var on = {
      tab:'point',
      sortkey: null,
      sortorder: null,
    };
var current_url = "";
var table_data,
    table_fields,
    nation_data;

var tab_table = [
      {key: 'point', name: '다양도 점수'},
      {key: 'degree', name: '다양도 평균'}
    ],
    tab = {
      'point': tab_table[0],
      'degree': tab_table[1]
    };

var panels = ['tab'];

function showPanel() {
  var bp = $("#panel-content");
  bp.text("");
  for (var i = 0; i < panels.length; i++) {
    var ul = $("<ul></ul>").attr("id", panels[i]+"-list").attr("class", "nav nav-pills nav-justified"),
        c_table = eval(panels[i]  + "_table");
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
  setSub(c, k);
  refresh();
}

function setSub(c, k) {
  on[c] = k;
}

//share
function setSubByQuery() {
  var query = getQueryList();
  if (query != null) {
    var query_keys = Object.keys(query);
    if (query_keys.indexOf('tab') >= 0) {
      on.tab = query['tab'];
    }
  }
}

function setCurrentUrl() {
  current_url = makeQueryString(
    {
      'tab': on.tab
    }
  );
}

function setShareLinkTw() {
  setCurrentUrl();
  shareTw(on.area+" "+tab[on.tab].key+" "+"My Town Our Diversity", current_url);
}

function setShareLinkUrl() {
  setCurrentUrl();
  shareUrl(current_url);
}

///table
var field_names = {
  point:  [
           'entire.both.i',       'entire.female.i',      'entire.male.i',
           'nationality.both.i',  'nationality.female.i', 'nationality.male.i',
           'disability.both.i',   'disability.female.i',  'disability.male.i',
           'gender.both.i',
           'residence.both.i',
           'industry.both.i',     'industry.female.i',    'industry.male.i',
           'age.both.i',          'age.female.i',         'age.male.i'
          ],
  degree: [
           'nationality.both',    'nationality.female',   'nationality.male',
           'disability.both',     'disability.female',    'disability.male',
           'gender.both',
           'residence.both',
           'industry.both',       'industry.female',      'industry.male',
           'age.both',            'age.female',           'age.male'
          ]
    };
var sector_names= {
  'entire':       '종합',
  'nationality':  '국적',
  'disability':   '장애',
  'gender':       '성별',
  'residence':    '주거',
  'industry':     '직종',
  'age':          '연령',
  'both':         '전체',
  'female':       '여성',
  'male':         '남성',
  'area':         '지역'
  },
  rowname_key = 'area'


function getColumnName(_) {
  var s = _.split('.');
  return sector_names[s[0]] + (s.length > 1 ? ", " + sector_names[s[1]] : "");
}
function getColumnNameHTML(_) {
  var s = _.split('.');
  return sector_names[s[0]] + (s.length > 1 ? "<br />" + sector_names[s[1]] : "");
}

function getExtendedFields() {
  return [rowname_key].concat(table_fields);
}

function initiateTable() {
  table_fields = field_names[on.tab];
  table_data = d3.entries(getTableData(table_fields));
  printTable('area');
  //make data sheet--> print row;
}

function printTable(skey) {
  sortTableData(skey);
  var tp = $('#table-content'),
      table = $("<table></table>").attr("class", "table"),
      thead = $("<thead></thead>");
      tbody = $("<tbody></tbody>");
  tp.text('');

  printTableHeader(thead, true);
  printTableRow(tbody, nation_data, true);
  for (var i  = 0; i < table_data.length; i++){
    printTableRow(tbody, table_data[i].value, false);
    if (i % 20 == 0 & i!= 0 & table_data.length - i > 10) printTableHeader(tbody, false);
    if (i == table_data.length - 1) printTableHeader(tbody, false);
  }

  table.append(thead);
  table.append(tbody);
  tp.append(table);
  //print table header
  //print 전국 row
  //print other by sorted order
}

//printing part
function printTableHeader(t, hasAction) {
  var row = $("<tr></tr>");
  var extend = getExtendedFields();
  for (var i = 0; i < extend.length; i++) {
    if (hasAction) {
      row.append(
        $("<th></th>").html(getColumnNameHTML(extend[i]))
          .attr("onclick", "printTable('"+extend[i]+"')")
          .attr("class", "hasSortAction cell-header cell-center")
      );
    } else {
      row.append(
        $("<td></td>").html(getColumnNameHTML(extend[i]))
          .attr("class", "cell-header-extra cell-center")
      );
    }
    if ( (i%6 == 0 & i!= 0 & extend.length - i > 3) | i == extend.length-1){
      if (hasAction) {
        row.append(
          $("<th></th>").html(getColumnNameHTML(extend[0]))
            .attr("class", "cell-header cell-center")
        );
      } else {
        row.append(
          $("<td></td>").html(getColumnNameHTML(extend[0]))
            .attr("class", "cell-header-extra cell-center")
        );
      }
    }
  }
  t.append(row);
}

function printTableRow(t, dr, isNation) {
  var row = $("<tr></tr>");
  var extend = getExtendedFields();
  for (var i = 0; i < extend.length; i++) {
    if (typeof dr[extend[i]] == 'number') row.append($("<td></td>").text(roundStr(dr[extend[i]], 2)).attr("class", "cell-right" + ( isNation ? " cell-nation" : "")));
    else row.append($("<td></td>").text(dr[extend[i]]).attr("class", "cell-center" + ( isNation ? " cell-nation" : "")));
    if ((i%6 == 0 & i!= 0 & extend.length - i > 3)| i == extend.length-1) {
      row.append($("<td></td>").text(dr[extend[0]]).attr("class", "cell-center cell-nation"));
    }
  }
  t.append(row);
}

//data part
function getTableData(f) {
  //travel by region
  var data = [];
  var metro = regions['전국'],
      metro_key = Object.keys(metro),
      n_metro = metro_key.length;
  nation_data = getTableData_row('전국', f);
  for (var i = 0; i < n_metro; i++) {
    var key1 = metro_key[i],
        regional = metro[key1],
        n_regional = regional.length;
    data.push(getTableData_row(key1, f));
    for (var j = 0; j < n_regional; j++) {
      data.push(getTableData_row(regional[j], f));
    }
  }
  return data;
}

function getTableData_row(a, f) {
  var row = {};
  row[rowname_key] = a;
  for (var i = 0; i < f.length; i++) {
    row[f[i]] = getTableData_cell(a, f[i]);
  }
  return row;
}

function getTableData_cell(a, k) {
  if (a.split(' ').length == 2) {
    return table_regional[k][a]
  } else {
    return table_metro[k][a]
  }
}

function sortTableData(skey) {
  if (on.sortkey == skey) {
    if (on.sortorder == 'a') {
      table_data.sort(function(x, y) {
        return d3.descending(x.value[skey], y.value[skey])
      });
      on.sortorder = 'd';
    } else {
      table_data.sort(function(x, y) {
        return d3.ascending(x.value[skey], y.value[skey])
      });
      on.sortorder = 'a';
    }
  } else {
    if (typeof table_data[0].value[skey] == 'string') {
      table_data.sort(function(x, y) {
        return d3.ascending(x.value[skey], y.value[skey])
      });
      on.sortorder = 'a';
    } else {
      table_data.sort(function(x, y) {
        return d3.descending(x.value[skey], y.value[skey])
      });
      on.sortorder = 'd';
    }
    on.sortkey = skey;
  }
}
