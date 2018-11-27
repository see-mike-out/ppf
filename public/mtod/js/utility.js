//utility
function fadeItem(whereSelector, item) {
  item.attr('style', 'display: none;');
  $(whereSelector).append(item);
  item.fadeIn(500);
}

function showItem(whereSelector, item) {
  $(whereSelector).append(item);
}

function singleSortData(dtset, gender, hasGender) {
  //data control
  if (!hasGender) {
    return sortData(dtset, hasGender, gender[0])
  } else {
    var dt = dtset[onarea][gender]['data'];
    var out = [];
    for (k in dt) {
      var field = {}
      if (dt[k]['count'] > 0) {
        field.name = k;
        field.count = dt[k]['count'];
        field.ratio = dt[k]['ratio'];
        out.push(field);
      }
    }
    //sorting
    out.sort(function(x, y) {
      return d3.ascending(sortkeys[x.name], sortkeys[y.name]);
    });
    out.sort(function(x, y) {
      return d3.descending(x.count, y.count);
    });
  //return
    return ({
      data: out,
      length: out.length
    });
  }
}

function sortData(dtset, hasGender, genderSort) {
  if (hasGender) {
  //data control
    var dt_b = dtset[onarea]['both']['data'];
    var dt_f = dtset[onarea]['female']['data'];
    var dt_m = dtset[onarea]['male']['data'];
    var out = [];
    for (k in dt_b) {
      var field = {}
      if (dt_b[k]['count'] > 0) {
        field.name = k;
        field.b_count = dt_b[k]['count'];
        field.b_ratio = dt_b[k]['ratio'];

        if (dt_f[k]['count'] > 0) {
          field.f_count = dt_f[k]['count'];
          field.f_ratio = dt_f[k]['ratio'];
        } else {
          field.f_count = null;
          field.f_ratio = null;
        }

        if (dt_m[k]['count'] > 0) {
          field.m_count = dt_m[k]['count'];
          field.m_ratio = dt_m[k]['ratio'];
        } else {
          field.m_count = null;
          field.m_ratio = null;
        }
        out.push(field);
      }
    }

  //sorting
    switch (genderSort) {
      case "n":
        out.sort(function(x, y) {
          return d3.descending(x.m_count, y.m_count);
        });
        out.sort(function(x, y) {
          return d3.descending(x.f_count, y.f_count);
        });
        out.sort(function(x, y) {
          return d3.descending(x.b_count, y.b_count);
        });
        out.sort(function(x, y) {
          return d3.ascending(sortkeys[x.name], sortkeys[y.name]);
        });
        break;
      case "b":
        out.sort(function(x, y) {
          return d3.ascending(sortkeys[x.name], sortkeys[y.name]);
        });
        out.sort(function(x, y) {
          return d3.descending(x.m_count, y.m_count);
        });
        out.sort(function(x, y) {
          return d3.descending(x.f_count, y.f_count);
        });
        out.sort(function(x, y) {
          return d3.descending(x.b_count, y.b_count);
        });
        break;
      case "f":
        out.sort(function(x, y) {
          return d3.ascending(sortkeys[x.name], sortkeys[y.name]);
        });
        out.sort(function(x, y) {
          return d3.descending(x.m_count, y.m_count);
        });
        out.sort(function(x, y) {
          return d3.descending(x.b_count, y.b_count);
        });
        out.sort(function(x, y) {
          return d3.descending(x.f_count, y.f_count);
        });
        break;
      case "m":
        out.sort(function(x, y) {
          return d3.ascending(sortkeys[x.name], sortkeys[y.name]);
        });
        out.sort(function(x, y) {
          return d3.descending(x.f_count, y.f_count);
        });
        out.sort(function(x, y) {
          return d3.descending(x.b_count, y.b_count);
        });
        out.sort(function(x, y) {
          return d3.descending(x.m_count, y.m_count);
        });
        break;
    }
  //return
    return ({
      data: out,
      length: out.length
    });
  } else {
  //data control
    var dt_b = dtset[onarea]['data'];
    var out = [];
    for (k in dt_b) {
      if (dt_b[k]['count'] > 0) {
        out.push({
          name: k,
          b_count: dt_b[k]['count'],
          b_ratio: dt_b[k]['ratio']
        });
      }
    }
  //sorting
    switch (genderSort) {
      case "n":
        out.sort(function(x, y) {
          return d3.descending(x.b_count, y.b_count);
        });
        out.sort(function(x, y) {
          return d3.ascending(sortkeys[x.name], sortkeys[y.name]);
        });
        break;
      case "b":
        out.sort(function(x, y) {
          return d3.ascending(sortkeys[x.name], sortkeys[y.name]);
        });
        out.sort(function(x, y) {
          return d3.descending(x.b_count, y.b_count);
        });
        break;
    }
  //return
    return ({
      data: out,
      length: out.length
    });
  }
}

function roundStr(v, d) {
  if (v == null) {
    return "";
  } else{
    var dec = Math.pow(10, d);
    var vs = Math.round(v*dec)/dec;
    vs = vs.toString();
    var p = 0;
    if (vs.indexOf('.') == -1) {
      p = vs.length;
    }
    else {
      p = vs.indexOf('.');
    }
    var res = "";
    for (var i = p-1; i >= 0; i--) {
      res = vs[i] + res;
      if (i != 0 & (p-i)%3 == 0) {
        res = "," + res;
      }
    }
    if (vs.indexOf('.') == -1 & d > 0) {
      res = res + "." + ("0".repeat(d));
    }
    if (vs.indexOf('.') > 0) {
      var lz = (d - vs.slice(p+1,vs.length).length);
      res = res + "." + vs.slice(p+1,vs.length) + ("0".repeat(lz));
    }
    return res;
  }
}

function percent(v, d) {
  if (v == null) {
    return "";
  } else {
    return roundStr(v*100, d) + "%";
  }
}

function get_diversity(a, d, g) {
  if (a.split(' ').length == 2) {
    return table_regional[d+'.'+g+'.i'][a]
  } else {
    return table_metro[d+'.'+g+'.i'][a]
  }
}

function get_diversity_summary(a, d, g, t) {
  if (a.split(' ').length == 2) {
    return table_regional[d+'.'+g+'.i'][t]
  } else {
    return table_metro[d+'.'+g+'.i'][t]
  }
}

function get_diversity_summary_area(a, d, g, t) {
  var curr_table = (a.split(' ').length == 2 ? table_regional : table_metro)[d+'.'+g+'.i'],
      v = curr_table[t],
      l = Object.keys(curr_table)[Object.values(curr_table).indexOf(v)];
  if (l == t) {
    l = Object.keys(curr_table)[Object.values(curr_table).lastIndexOf(v)];
  }
  return l;
}

function ranged(v, mx, mn) {
  var ev = 0;
  if (v >= mx) ev = 1;
  else if (v <= mn) ev = 0;
  else ev = (v - mn) / (mx - mn);
  ev = ev * 100;
  return ev;
}

function rangedStr(v, mx, mn) {
  return roundStr(ranged(v, mx, mn), 2);
}

function px(v){
  return v.toString() + 'px';
}

function selectStr(k) {
  return "d3.select('"+k+"')";
}

function selectAllStr(ks) {
  var res = "d3";
  for (var k = 0; k < ks.length; k++) {
    res += ".selectAll('"+ks[k]+"')";
  }
  return res;
}

function filterStr(k) {
  return ".filter('"+k+"')";
}

function favStr(f,a,v) {
  return "."+f+"('"+a+"', '"+v+"')";
}

function hexToHsl(hex) {
  var s = 0
  if (hex.charAt(0) == "#") s += 1;
  var r = parseInt(hex.substr(s+0, 2), 16),
      g = parseInt(hex.substr(s+2, 2), 16),
      b = parseInt(hex.substr(s+4, 2), 16);
  return rgbToHsl(r, g, b);
}

function hslToHex(h, s, l) {
  var RGB = hslToRgb(h, s, l),
      r = Math.round(RGB[0]).toString(16),
      g = Math.round(RGB[1]).toString(16),
      b = Math.round(RGB[2]).toString(16);
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;
  return "#" + r + g + b;
}

function bright(hex, degree) {
  var hsl = hexToHsl(hex);
  var deg = 1+degree;
  hsl[2] = hsl[2] * deg;
  if (hsl[2] >= 1) hsl[2] = 1;
  else if (hsl[2] <= 0) hsl[2] = 0;
  return hslToHex(hsl[0], hsl[1], hsl[2]);
}

function wnsize(w, n) {
  return (isNarrow ? n : w);
}

function radToXY (rad, O) {
  var theta = rad[0],
      radius = rad[1];
  return [radius * Math.cos(theta)+O[0], radius * Math.sin(theta)+O[1]];
}

function midpoint(a, b, r) {
  var q = 1-r;
  return [a[0]*r + b[0]*q, a[1]*r + b[1]*q];
}

function d3tagkey(tag){
  return "<"+tag+">"+"</"+tag+">";
}

function getQueryList(){
  var url = location.href;
  if (url.indexOf('?') < 0) return null;
  else {
    var qp = url.indexOf('?'),
        ap = (url.indexOf('#') < 0 ? url.length : url.indexOf('#')),
        query = url.slice(qp+1, ap).split('=')[1].split('_');
        n_query = query.length,
        result = {};
    for (var i = 0; i < n_query; i++) {
      var que = query[i].split('~');
      result[que[0]] = que[1];
    }
    return result;
  }
}

function makeQueryString(qobj) {
  var url = location.href,
      qkey = Object.keys(qobj),
      qstring = "";
  for(var i = 0; i < qkey.length; i ++) {
    if (i > 0) qstring += "_"
    qstring += qkey[i];
    qstring += "~";
    qstring += encodeURI(qobj[qkey[i]]);
  }
  var result = "";
  if (url.indexOf('#') >= 0) {
    result = url.slice(0, url.indexOf('#'));
  } else {
    result = url;
  }
  if (result.indexOf('?') >= 0) {
    result = result.slice(0, result.indexOf('?')) + '?q=' + qstring;
  } else {
    result += '?q=' + qstring;
  }
  return result;
}

function shareTw(t, url) {
  var text = t.replace(" ", "%20");
  var twLink = "https://twitter.com/intent/tweet?text="+text+"%20"+url+"&via=hmml_mike";
  window.open(twLink);
}

function shareUrl(url) {
  alert("페이지가 새 주소로 새로고침됩니다. 주소창을 복사하여 이용해주세요!");
  location.href = url;
}

function makeTopButton() {
  $("body").append(
    $("<div></div>").html('<i class="fa fa-chevron-up" aria-hidden="true"></i>')
      .css(
        {
          "position": "fixed",
          "bottom": "10px",
          "right": "10px",
          "width": "50px",
          "height": "50px",
          "background-color": "#ddd",
          "opacity": ".2",
          "font-size": "30px",
          "color": "#222",
          "line-height": "50%",
          "border-radius": "5px",
          "padding": "10px",
          "transition": ".3s",
          "cursor": "pointer"
        }
      )
      .on("mouseover", function() {$(this).css("opacity", ".9");})
      .on("mouseout", function() {$(this).css("opacity", ".2");})
      .on("click", function() {window.scroll(0, 0)})
  );
}
