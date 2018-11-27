var first_visit = true;
var isNarrow = (window.innerWidth < 600 ? true : false);

function showGraphEntire(criteria) {
  var place = d3.select("#graph-whole");
  var place_jq = $("#graph-whole");
  place_jq.empty();

  //layout setting
  var layout = {
    w_a: place_jq.width(),
    h_a: place_jq.width() * (isNarrow ? 1.8 : .6),
    vw_r: 100,
    vh_r: (isNarrow ? 180 : 60),
    box_offset: 0,
    bar_rate: {
      box: 1,
      w: .6,
      offset: .2,
    },
    bar_r: {
      box: 0,
      w: 0,
      offset: 0,
      h_unit: 0,
      text_size: (isNarrow ? 2 : 1.1),
      text_color: "#e1bee7",
      text_offset_y: 1.95,
    },
    bar_a: {
      rad: .25,
      color: "#9c27b0"
    },
    sec1_r: {
      w: 100,
      h: (isNarrow ? 78 : 23)
    },
    sec2_r: {
      w: 100,
      h: (isNarrow ? 98 : 37)
    },
    border: {
      width: .05
    },
    caption: {
      color: "#000000",
      text_size: (isNarrow ? 3 : 2),
      m_offset: 4
    }
  };

  //data point setting
  var dp = {
    sec1: { //gap
      max: d3.max(data, function(d){return parseFloat(d.wuw)}),
      min: d3.min(data, function(d){return parseFloat(d.wuw)})
    },
    sec2: { //leftover
      max: d3.max(data, function(d){return parseFloat(d.wpw)}),
      min: d3.min(data, function(d){return parseFloat(d.wpw)})
    },
    np: data.length
  };
  if (criteria == "p") {
    data.sort(function(a, b) {return d3.ascending(parseFloat(a.wpw), parseFloat(b.wpw))});
  } else if (criteria == "u") {
    data.sort(function(a, b) {return d3.descending(parseFloat(a.wuw), parseFloat(b.wuw))});
  }


  if (isNarrow) {
    //additional layout setting
    layout.bar_r.box = (layout.vh_r- layout.caption.m_offset) / dp.np;
    layout.bar_r.w = layout.bar_r.box * layout.bar_rate.w;
    layout.bar_r.offset = layout.bar_r.box * layout.bar_rate.offset;

    layout.bar_r.h_unit = (layout.vw_r) / (dp.sec1.max + dp.sec2.max);
    layout.sec1_r.h = layout.bar_r.h_unit * dp.sec1.max;
    layout.sec2_r.h = layout.bar_r.h_unit * dp.sec2.max;

    //drawing 1: area setting
    var graph = place.append("svg").attr("id", "entire-graph")
                                   .attr("width", layout.w_a).attr("height", layout.h_a)
                                   .attr("viewBox", "0 0 "+layout.vw_r+" "+layout.vh_r);

    var sec1 = graph.append("g").attr("id", "graph-section-1").attr("width", layout.sec1_r.w).attr("height", layout.sec1_r.h - layout.caption.m_offset)
                                .attr("transform", "translate(0, "+(layout.caption.m_offset+layout.box_offset).toString()+")");
    var sect = graph.append("g").attr("id", "graph-section-t").attr("width", layout.sec1_r.w).attr("height", layout.sec2_r.h)
                                .attr("transform", "translate(0, "+(layout.caption.m_offset+layout.box_offset).toString()+")");
    var sectc = graph.append("g").attr("id", "graph-section-tc").attr("width", layout.sec1_r.w).attr("height", layout.sec1_r.h)
                                 .attr("transform", "translate(0, "+(layout.caption.m_offset+layout.box_offset).toString()+")");
    var secc = graph.append("g").attr("id", "graph-section-c").attr("width", layout.vw_r).attr("height", layout.vh_r)
                                .attr("transform", "translate(0, 0)");
    //drawing 2: section 1
    for (var i = 0; i < dp.np; i++) {
      var bar_id = "graph-section-1-bar-"+i.toString(),
          v1 = data[i].wuw,
          h1 = layout.bar_r.h_unit * v1,
          v2 = data[i].wpw,
          h2 = layout.bar_r.h_unit * v2;

      var bar_box = sec1.append("g").attr("id", bar_id+"-wrap").attr("width", h1 + h2).attr("height", layout.bar_r.box)
                                   .attr("transform", "translate("+(layout.sec1_r.h - h1)+", "+(layout.bar_r.box*i).toString()+")");

      sec1.append("defs").append("clipPath").attr("id", bar_id+"-clip")
         .append("rect").attr("width", h1 + h2).attr("height", layout.bar_r.w)
         .attr("x", 0).attr("y", layout.bar_r.offset).attr("rx", layout.bar_a.rad).attr("ry", layout.bar_a.rad);

      bar_box.append("rect").attr("id", bar_id+"-paid").attr("width", h1).attr("height", layout.bar_r.w)
                            .attr("x", 0).attr("y", layout.bar_r.offset)
                            .attr("fill", layout.bar_a.color)
                            .attr("clip-path", "url(#"+bar_id+"-clip)");

      bar_box.append("rect").attr("id", bar_id+"-unpaid").attr("width", h2).attr("height", layout.bar_r.w)
                            .attr("x", h1).attr("y", layout.bar_r.offset)
                            .attr("fill", bright_hex(layout.bar_a.color, .5))
                            .attr("clip-path", "url(#"+bar_id+"-clip)");

      var t_box = sect.append("g").attr("id", bar_id+"-text").attr("width", layout.bar_r.box).attr("height", h1 + h2)
                                  .attr("transform", "translate("+layout.sec1_r.h.toString()+", "+(layout.bar_r.box*i).toString()+")");
      t_box.append("text").attr("id", bar_id+"-country").text(data[i].country_name)
                          .attr("font-size", layout.bar_r.text_size)
                          .attr("dx", layout.bar_r.offset).attr("dy", layout.bar_r.text_offset_y*0.7 + layout.bar_r.text_size)
                          .attr("text-anchor", "start").attr("fill", layout.bar_r.text_color)
                          .style("font-weight", "500")

      var c_box = sectc.append("g").attr("id", bar_id+"-caption").attr("width", layout.bar_r.box).attr("height", h1 + h2)
                                  .attr("transform", "translate(0, "+(layout.bar_r.box*i).toString()+")");
      var cn = c_box.append("text").attr("id", bar_id+"-number").text(roundStr(data[i].wuw, 2))
                                   .attr("font-size", layout.bar_r.text_size)
                                   .attr("dx", layout.sec1_r.h - layout.bar_r.offset).attr("dy", layout.bar_r.text_offset_y*0.7 + layout.bar_r.text_size)
                                   .attr("text-anchor", "end").attr("fill", layout.bar_r.text_color)
                                   .style("font-weight", "400");

      var cn_bbox = cn.node().getBBox();
      if (cn_bbox.width + layout.bar_r.offset*1.5 > h1) {
        cn.attr("dx", layout.sec1_r.h - layout.bar_r.offset - h1).attr("fill", bright_hex(layout.bar_r.text_color, -.5)).style("font-weight", "700");;
      }
      cn.style("display", "none");

      var hl_event = mouseOverEventStr(bar_id+"-paid", bar_id+"-unpaid", layout.bar_a.color, bar_id+"-country", bar_id+"-number", layout.bar_r.text_color);
      var dhl_event = mouseOutEventStr(bar_id+"-paid", bar_id+"-unpaid", layout.bar_a.color, bar_id+"-country", bar_id+"-number", layout.bar_r.text_color);

      bar_box.attr("onmouseover", hl_event);
      t_box.attr("onmouseover", hl_event);
      cn.attr("onmouseover", hl_event);
      bar_box.attr("onmouseout", dhl_event);
      t_box.attr("onmouseout", dhl_event);
      cn.attr("onmouseout", dhl_event);
    }
    graph.append("line").attr("stroke", "#aaaaaa").attr("stroke-width", layout.border.width)
         .attr("x1", layout.sec1_r.h+layout.box_offset).attr("y1", layout.caption.m_offset)
         .attr("x2", layout.sec1_r.h+layout.box_offset).attr("y2", layout.vh_r);
    secc.append("text").attr("fill", layout.bar_a.color).text("Women's Unpaid Work Hour").attr("font-size", layout.caption.text_size)
         .attr("dx", 0).attr("dy", layout.caption.text_size).attr("text-anchor", "start").style("font-weight", "700")
         .attr("onclick", "showGraphEntire('u');").attr("class", "cursor-pointer");
    secc.append("text").attr("fill", bright_hex(layout.bar_a.color, .5)).text("Women's Paid Work Hour").attr("font-size", layout.caption.text_size*.7)
        .attr("dx", layout.vw_r).attr("dy", layout.caption.text_size).attr("text-anchor", "end").style("font-weight", "700")
        .attr("onclick", "showGraphEntire('p');").attr("class", "cursor-pointer");

  } else {
    //additional layout setting
    layout.bar_r.box = layout.sec1_r.w / dp.np;
    layout.bar_r.w = layout.bar_r.box * layout.bar_rate.w;
    layout.bar_r.offset = layout.bar_r.box * layout.bar_rate.offset;

    layout.bar_r.h_unit = (layout.sec1_r.h + layout.sec2_r.h) / (dp.sec1.max + dp.sec2.max);
    layout.sec1_r.h = layout.bar_r.h_unit * dp.sec1.max;
    layout.sec2_r.h = layout.bar_r.h_unit * dp.sec2.max;

    //drawing 1: area setting
    var graph = place.append("svg").attr("id", "entire-graph")
                                   .attr("width", layout.w_a).attr("height", layout.h_a)
                                   .attr("viewBox", "0 0 "+layout.vw_r+" "+layout.vh_r);

    var sec1 = graph.append("g").attr("id", "graph-section-1").attr("width", layout.sec1_r.w).attr("height", layout.sec1_r.h)
                                .attr("transform", "translate(0, "+layout.box_offset.toString()+")");
    var sect = graph.append("g").attr("id", "graph-section-t").attr("width", layout.sec1_r.w).attr("height", layout.sec2_r.h)
                                .attr("transform", "translate(0, "+layout.box_offset.toString()+")");
    var sectc = graph.append("g").attr("id", "graph-section-tc").attr("width", layout.sec1_r.w).attr("height", layout.sec1_r.h)
                                 .attr("transform", "translate(0, 0)");
    var secc = graph.append("g").attr("id", "graph-section-c").attr("width", layout.vw_r).attr("height", layout.vh_r)
                                .attr("transform", "translate(0, 0)");
    //drawing 2: section 1
    for (var i = 0; i < dp.np; i++) {
      var bar_id = "graph-section-1-bar-"+i.toString(),
          v1 = data[i].wuw,
          h1 = layout.bar_r.h_unit * v1,
          v2 = data[i].wpw,
          h2 = layout.bar_r.h_unit * v2;

      var bar_box = sec1.append("g").attr("id", bar_id+"-wrap").attr("width", layout.bar_r.box).attr("height", h1 + h2)
                                   .attr("transform", "translate("+(layout.bar_r.box*i)+", "+(layout.sec1_r.h - h1).toString()+")");

      sec1.append("defs").append("clipPath").attr("id", bar_id+"-clip")
         .append("rect").attr("width", layout.bar_r.w).attr("height", h1 + h2)
         .attr("x", layout.bar_r.offset).attr("y", 0).attr("rx", layout.bar_a.rad).attr("ry", layout.bar_a.rad);

      bar_box.append("rect").attr("id", bar_id+"-paid").attr("width", layout.bar_r.w).attr("height", h1)
                            .attr("x", layout.bar_r.offset).attr("y", 0)
                            .attr("fill", layout.bar_a.color)
                            .attr("clip-path", "url(#"+bar_id+"-clip)");

      bar_box.append("rect").attr("id", bar_id+"-unpaid").attr("width", layout.bar_r.w).attr("height", h2)
                            .attr("x", layout.bar_r.offset).attr("y", h1)
                            .attr("fill", bright_hex(layout.bar_a.color, .5))
                            .attr("clip-path", "url(#"+bar_id+"-clip)");

      var t_box = sect.append("g").attr("id", bar_id+"-text").attr("width", layout.bar_r.box).attr("height", h1 + h2)
                                  .attr("transform", "translate("+(layout.bar_r.box*i)+", "+layout.sec1_r.h.toString()+")");
      t_box.append("text").attr("id", bar_id+"-country").text(data[i].country_name).attr("transform", "rotate(-90)")
                          .attr("font-size", layout.bar_r.text_size)
                          .attr("dx", -layout.bar_r.offset).attr("dy", layout.bar_r.text_offset_y)
                          .attr("text-anchor", "end").attr("fill", layout.bar_r.text_color)
                          .style("font-weight", "500")

      var c_box = sectc.append("g").attr("id", bar_id+"-caption").attr("width", layout.bar_r.box).attr("height", h1 + h2)
                                  .attr("transform", "translate("+(layout.bar_r.box*i)+", "+layout.sec1_r.h.toString()+")");
      var cn = c_box.append("text").attr("id", bar_id+"-number").text(roundStr(data[i].wuw, 2)).attr("transform", "rotate(-90)")
                                   .attr("font-size", layout.bar_r.text_size)
                                   .attr("dx", layout.bar_r.offset).attr("dy", layout.bar_r.text_offset_y)
                                   .attr("text-anchor", "start").attr("fill", layout.bar_r.text_color)
                                   .style("font-weight", "400");

      var cn_bbox = cn.node().getBBox();
      if (cn_bbox.width + layout.bar_r.offset*1.5 > h1) {
        cn.attr("dx", h1+layout.bar_r.offset).attr("fill", bright_hex(layout.bar_r.text_color, -.5)).style("font-weight", "700");;
      }
      cn.style("display", "none");

      var hl_event = mouseOverEventStr(bar_id+"-paid", bar_id+"-unpaid", layout.bar_a.color, bar_id+"-country", bar_id+"-number", layout.bar_r.text_color);
      var dhl_event = mouseOutEventStr(bar_id+"-paid", bar_id+"-unpaid", layout.bar_a.color, bar_id+"-country", bar_id+"-number", layout.bar_r.text_color);

      bar_box.attr("onmouseover", hl_event);
      t_box.attr("onmouseover", hl_event);
      cn.attr("onmouseover", hl_event);
      bar_box.attr("onmouseout", dhl_event);
      t_box.attr("onmouseout", dhl_event);
      cn.attr("onmouseout", dhl_event);
    }
    graph.append("line").attr("stroke", "#aaaaaa").attr("stroke-width", layout.border.width)
         .attr("x1", 0).attr("y1", layout.sec1_r.h+layout.box_offset)
         .attr("x2", layout.vw_r).attr("y2", layout.sec1_r.h+layout.box_offset);
    secc.append("text").attr("fill", layout.bar_a.color).text("Women's Unpaid Work Hour").attr("font-size", layout.caption.text_size)
         .attr("dx", layout.vw_r).attr("dy", layout.caption.text_size).attr("text-anchor", "end").style("font-weight", "700")
         .attr("onclick", "showGraphEntire('u');").attr("class", "cursor-pointer");
    secc.append("text").attr("fill", bright_hex(layout.bar_a.color, .5)).text("Women's Paid Work Hour").attr("font-size", layout.caption.text_size*.7)
        .attr("dx", 0).attr("dy", layout.vh_r - layout.caption.text_size*.7).attr("text-anchor", "start").style("font-weight", "700")
        .attr("onclick", "showGraphEntire('p');").attr("class", "cursor-pointer");
  }

  if (first_visit == true) {
    first_visit = false;
  } else {
    $('html, body').scrollTop($("#graph-whole").offset().top);
  }
}

function mouseOverEvent(unpaid, paid, bcolor, country, number, tcolor) {
  d3.select("#"+unpaid).attr("fill", bright_hex(bcolor, -.2));
  d3.select("#"+paid).attr("fill", bright_hex(bcolor, .3));
  d3.select("#"+country).attr("fill", "#ffffff");
  d3.select("#"+number).style("display", "");
}

function mouseOutEvent(unpaid, paid, bcolor, country, number, tcolor) {
  d3.select("#"+unpaid).attr("fill", bcolor);
  d3.select("#"+paid).attr("fill", bright_hex(bcolor, .5));
  d3.select("#"+country).attr("fill", tcolor);
  d3.select("#"+number).style("display", "none");
}

function mouseOverEventStr(unpaid, paid, bcolor, country, number, tcolor) { //without selector, but color with #
  return "mouseOverEvent(" + "'"+unpaid+"', " + "'"+paid+"', " + "'"+bcolor+"', " + "'"+country+"', " + "'"+number+"', " + "'"+tcolor+"');";
}

function mouseOutEventStr(unpaid, paid, bcolor, country, number, tcolor) { //without selector, but color with #
  return "mouseOutEvent(" + "'"+unpaid+"', " + "'"+paid+"', " + "'"+bcolor+"', " + "'"+country+"', " + "'"+number+"', " + "'"+tcolor+"');";
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

function shareTw(t, url) {
  var text = t.replace(" ", "%20");
  var twLink = "https://twitter.com/intent/tweet?text="+text+"%20"+url+"&via=hmml_mike";
  window.open(twLink);
}
