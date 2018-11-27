//global
function global() {
  anchors.add('h4');
  setSubByQuery();
  showMetroList();
  seeMetro(onarea);
  showTab();
  areaRefresh();
  $( window ).scroll(function() {
    if (window.scrollY > 40) $( "#current-area" ).css( "display", "block" ).fadeIn( "slow" );
    else $( "#current-area" ).css( "display", "none" ).fadeOut( "slow" );
  });
  setCurrentUrl();
}

var isNarrow = (window.innerWidth < 800 ? true : false);

//predata
var on_tab = 'entire';
var onarea = '전국';
var on_sub = {
      dtset_key: '',
      dtset: null,
      data: null,
      hasGender: true,
      genderSort: 'b'
    };
var current_url = "";

var table_tabs = [
  ['entire', '종합'],
  ['nationality', '국적'],
  ['disability', '장애'],
  ['gender', '성별'],
  ['residence', '주거'],
  ['industry', '직종'],
  ['age', '연령']
];
var table_name = {
  'entire': ['entire', '종합'],
  'nationality': ['nationality', '국적'],
  'disability': ['disability', '장애'],
  'gender': ['gender', '성별'],
  'residence': ['residence', '주거'],
  'industry': ['industry', '직종'],
  'age': ['age', '연령']
};
var nkey = {
  "종합": ["종합", "syn"],
  "국적": ["국적", "nat"],
  "장애": ["장애", "dis"],
  "성별": ["성별", "gen"],
  "주거": ["주거", "res"],
  "직종": ["직종", "ind"],
  "연령": ["연령", "age"]
};
var keys = ["종합", "국적", "장애", "성별", "주거", "직종", "연령"];
var gender_keys = ["female", "both", "male"],
    gender_names = {
      "female": ["female", "여성"],
      "male": ["male", "남성"],
      "both": ["both", "전체"]
    };

var bar_back_opc = [0.03, 0.1],
    cell_highlight = "#444444";

//area selection
function setSubByQuery() {
  var query = getQueryList();
  if (query != null) {
    var query_keys = Object.keys(query);
    if (query_keys.indexOf('area') >= 0) {
      onarea = decodeURI(query['area']);
    }
    if (query_keys.indexOf('tab') >= 0) {
      on_tab = query['tab'];
    }
  }
}

function setCurrentUrl() {
  current_url = makeQueryString(
    {
      'area': onarea,
      'tab': on_tab
    }
  );
}

function areaRefresh() {
  $("#current-area").html('<span class="small">MIKE PROJECT</span><span class="small"><strong>MY TOWN + OUR DIVERSITY</strong></span><span class="small"><i class="fa fa-angle-double-right" aria-hidden="true"></i> </span>  <span class="area">' + onarea+'</span>');
  printTable();
}

function seeRegional(r) {
  var top = $("#regional-on");
  var t = r.split(' ')[1];
  top.html(t + ' <span class="caret"></span>');
  onarea = r;
  areaRefresh();
}

function showRegionalList(a) {
  var sel = $("#regional-options");
  sel.text("");
  if (a != "전국") {
    var on_metro = a.split(' ')[0],
        on_regional = a.split(' ')[1];
    if (on_regional == undefined) on_regional = '전체';
    var n_region = regions['전국'][on_metro].length;
    var sorted = regions['전국'][on_metro].sort();
    $("#regional-on").html(on_regional+' <span class="caret"></span>');
    var entire = $("<li></li>").attr("role", "presentation");
    var e_link = $("<a></a>").text('전체').attr("role", "menuitem").attr("tabindex", -1).attr("href","#").attr('onclick', 'seeMetro("'+on_metro+'")');
    entire.append(e_link);
    sel.append(entire);

    for (var i = 0; i < n_region; i++) {
      var area = $("<li></li>").attr("role", "presentation");
      var t = sorted[i].split(' ')[1];
      var link = $("<a></a>").text(t).attr("role", "menuitem").attr("tabindex", -1).attr("href","#").attr('onclick', 'seeRegional("'+sorted[i]+'")');
      area.append(link);
      sel.append(area);
    }
  } else {
    $("#regional-on").html('전체 <span class="caret"></span>');
    var entire = $("<li></li>").attr("role", "presentation");
    var e_link = $("<a></a>").text('전체').attr("role", "menuitem").attr("tabindex", -1).attr("href","#").attr('onclick', 'seeMetro("'+a+'")');
    entire.append(e_link);
    sel.append(entire);
  }
}

function seeMetro(a) {
  var top = $("#metro-on");
  top.html(a.split(' ')[0] + ' <span class="caret"></span>');
  showRegionalList(a);
  onarea = a;
  areaRefresh();
}

function showMetroList() {
  $("#metro-on").html(onarea.split(' ')[0]+' <span class="caret"></span>');
  var sel = $("#metro-options");
  sel.text("");
  var n_region = regions["metro"].length;
  for (var i = 0; i < n_region; i++) {
    var area = $("<li></li>").attr("role", "presentation");
    var link = $("<a></a>").text(regions["metro"][i]).attr("role", "menuitem").attr("tabindex", -1).attr("href","#").attr('onclick', 'seeMetro("'+regions["metro"][i]+'")');
    area.append(link);
    sel.append(area);
  }
}

//tab toggling
function toggleTab(t) {
  $('#tab-'+on_tab).removeClass('active');
  on_tab = t
  $('#tab-'+on_tab).addClass('active');
  printTable();
}

function showTab() {
  var tabs = $("#content-tabs");
  var n_tab = table_tabs.length;
  for (var i = 0; i < n_tab; i++) {
    var tab = $("<li></li>").attr("role", "presentation").attr("id", "tab-"+table_tabs[i][0]);
    if (table_tabs[i][0] == on_tab) tab.addClass("active");
    var link = $("<a></a>").text(table_tabs[i][1]).attr("href","#").attr('onclick', 'toggleTab("'+table_tabs[i][0]+'")');
    tab.append(link);
    tabs.append(tab);
  }
}

//share
function setShareLinkTw() {
  setCurrentUrl();
  shareTw(onarea+"의 "+table_name[on_tab][1]+" 다양성 살펴보기 "+"My Town Our Diversity 에서", current_url);
}

function setShareLinkUrl() {
  setCurrentUrl();
  shareUrl(current_url);
}

//table printing
function printTable() {
  var tp = "#table-content",
      gp = "#graph-content",
      xp = "#text-content";
  switch(on_tab) {
    case table_tabs[0][0]:
      printContentEntire(tp, gp, xp);
      break;
    case table_tabs[1][0]:
      setSub(on_tab, true, 'b');
      printContentNationality(tp, gp, xp);
      break;
    case table_tabs[2][0]:
      setSub(on_tab, true, 'b');
      printContentDisability(tp, gp, xp);
      break;
    case table_tabs[3][0]:
      setSub(on_tab, false, 'b');
      printContentGender(tp, gp, xp);
      break;
    case table_tabs[4][0]:
      setSub(on_tab, false, 'b');
      printContentResidence(tp, gp, xp);
      break;
    case table_tabs[5][0]:
      setSub(on_tab, true, 'b');
      printContentIndustry(tp, gp, xp);
      break;
    case table_tabs[6][0]:
      setSub(on_tab, true, 'b');
      printContentAge(tp, gp, xp);
      break;
    default:
      break;
  }
}

function setSub(k, hg, gs) {
  on_sub.dtset_key = k;
  on_sub.dtset = eval(k);
  on_sub.hasGender = hg;
  on_sub.genderSort = gs;
  on_sub.data = sortData(on_sub.dtset, on_sub.hasGender, on_sub.genderSort);
}

function printContentSubject(tp, gp, dtset_key, tab_ttl, hasGender, genderSort) {
  //data
  var dtset = eval(dtset_key)
  //print
  $(tp).text('');
  $(gp).text('');
  printTableSubject(tp, gp, hasGender, genderSort);

}

function printTableSubject(tp, gp, hasGender, genderSort) {
  var dtset = on_sub.dtset,
      dtset_key = on_sub.dtset_key,
      data = sortData(dtset, hasGender, genderSort),
      tab_ttl = table_name[on_sub.dtset_key][1];
  //printing table
  $(tp).text('');
  var table = $("<table></table>").addClass("table table-hover table-small-letter");
  //header
  //head
  var thead = $("<thead></thead>");
  function sevent(gs) {
    return "printTableSubject('"+tp+"', '"+gp+"', "+hasGender+", '"+gs+"')"
  }
  if (hasGender) {
    thead.append(
      $("<tr></tr>").append(
        $("<th></th>").text(tab_ttl).attr('onclick', sevent('n')).addClass("sortable"),
        $("<th></th>").text("여성").addClass('cell-numeric').attr('onclick', sevent('f')).addClass("sortable"),
        $("<th></th>").text("전체").addClass('cell-numeric').attr('onclick', sevent('b')).addClass("sortable"),
        $("<th></th>").text("남성").addClass('cell-numeric').attr('onclick', sevent('m')).addClass("sortable")
      )
    );
    table.append(thead);
    var tbody = $("<tbody></tbody>");
    tbody.append(
      $("<tr></tr>").append(
        $("<th></th>").text("다양도"),
        $("<td></td>").text(roundStr(dtset[onarea]['female']['diversity'],2)).addClass('cell-numeric'),
        $("<td></td>").text(roundStr(dtset[onarea]['both']['diversity'], 2)).addClass('cell-numeric'),
        $("<td></td>").text(roundStr(dtset[onarea]['male']['diversity'], 2)).addClass('cell-numeric')
      )
    );
    tbody.append(
      $("<tr></tr>").append(
        $("<th></th>").text("점수"),
        $("<td></td>").text(roundStr(get_diversity(onarea, dtset_key, 'female'), 2)).addClass('cell-numeric'),
        $("<td></td>").text(roundStr(get_diversity(onarea, dtset_key, 'both'), 2)).addClass('cell-numeric'),
        $("<td></td>").text(roundStr(get_diversity(onarea, dtset_key, 'male'), 2)).addClass('cell-numeric')
      )
    );
  } else {
    thead.append(
      $("<tr></tr>").append(
        $("<th></th>").text(tab_ttl).attr('onclick', "printContentSubject('"+tp+"', '"+gp+"', '"+dtset_key+"', '"+tab_ttl+"', "+hasGender+", '"+'n'+"')").addClass("sortable"),
        $("<th></th>").text("전체").addClass('cell-numeric').addClass('cell-numeric').attr('onclick', "printContentSubject('"+tp+"', '"+gp+"', '"+dtset_key+"', '"+tab_ttl+"', "+hasGender+", '"+'b'+"')").addClass("sortable")
      )
    );
    table.append(thead);
    var tbody = $("<tbody></tbody>");
    tbody.append(
      $("<tr></tr>").append(
        $("<th></th>").text("다양도"),
        $("<td></td>").text(roundStr(dtset[onarea]['diversity'], 2)).addClass('cell-numeric')
      )
    );
    tbody.append(
      $("<tr></tr>").append(
        $("<th></th>").text("점수"),
        $("<td></td>").text(roundStr(get_diversity(onarea, dtset_key, 'both'), 2)).addClass('cell-numeric')
      )
    );
  }
  for (var i = 0; i < data.length; i++) {
    var row = $("<tr></tr>");
    if (data.data[i].b_count != null) {
    //both
      row.append(
        $("<td></td>").text(rownames[data.data[i].name] )
      );
      //female
      if (hasGender) {
        if (data.data[i].f_count != null) {
          row.append(
            $("<td></td>").text(roundStr(data.data[i].f_count, 0) + " (" + percent(data.data[i].f_ratio, 2)+ ")").addClass('cell-numeric')
          );
        } else {
            row.append(
              $("<td></td>").text("")
            );
        }
      }
      row.append(
        $("<td></td>").text(roundStr(data.data[i].b_count, 0) + " (" + percent(data.data[i].b_ratio, 2)+ ")").addClass('cell-numeric')
      );
      if (hasGender) {
        //male
        if (data.data[i].m_count != null) {
          row.append(
            $("<td></td>").text(roundStr(data.data[i].m_count, 0) + " (" + percent(data.data[i].m_ratio, 2)+ ")").addClass('cell-numeric')
          );
        } else {
            row.append(
              $("<td></td>").text("")
            );
        }
      }
      tbody.append(row);
    }
  }
  table.append(tbody);
  fadeItem(tp, table);
}
