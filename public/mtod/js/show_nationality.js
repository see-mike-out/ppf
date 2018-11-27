function printContentNationality(tp, gp, xp) {
  var female = singleSortData(on_sub.dtset, 'female', on_sub.hasGender),
      male = singleSortData(on_sub.dtset, 'male', on_sub.hasGender),
      both = singleSortData(on_sub.dtset, 'both', on_sub.hasGender);
  //print
  $(tp).text('');
  $(gp).text('');
  printTableSubject(tp, gp, on_sub.hasGender, 'b');
  printGraphNationality(female, male, both, gp);
  printTextNationality(female, male, both, xp);
}

function printGraphNationality(female, male, both, gp) {
  var dtset = on_sub.dtset,
      dtset_key = on_sub.dtset_key,
      tab_ttl = table_name[on_sub.dtset_key][1];
  //data

  //layout
  var view_w = $(gp).width() - 20,
      view_h = view_w * wnsize(0.45, 0.7);
  var offset = {
        btw: 15,
        sec: {
          btw: wnsize(7, 10)
        }
      },
      area = {
        w: 800,
        h: wnsize(360, 560),
        r: 1.5,
        sec: {
          w: 800,
          h: wnsize(110, 176),
          bar: {
            w: 800,
            h: 20
          },
          sbar: {
            w: 600,
            h: 15
          },
          fobar: {
            max: 193,
            w: 800,
            h: 4
          },
          donut: {
            outer: 7.5,
            thick: 2,
            r: 0.5
          }
        },
        text: {
          font_big: wnsize(16, 29),
          font_normal: wnsize(12, 25),
          font_small: wnsize(10, 23),
          font_xs: wnsize(7, 20),
          font_xxs: wnsize(3, 18),
          line_height: wnsize(5, 3)
        }
      },
      color = {
        f: key_color['female'],
        m: key_color['male'],
        b: key_color['both'],
        bg: key_color['background']
      };

  //placing
  var place = d3.select(gp);
  var graph = place.append("svg").attr("id", "nationality-graph")
                                 .attr("width", view_w).attr("height", view_h)
                                 .attr("viewBox", "0 0 "+area.w+" "+area.h);
  var sec1 = graph.append("g").attr("id", "graph-sec1").attr("width", area.sec.w).attr("height", area.sec.h).attr("transform", "translate(0, 0)"),
      sec2 = graph.append("g").attr("id", "graph-sec2").attr("width", area.sec.w).attr("height", area.sec.h).attr("transform", "translate(0, "+(area.sec.h + offset.btw).toString()+")"),
      sec3 = graph.append("g").attr("id", "graph-sec3").attr("width", area.sec.w).attr("height", area.sec.h).attr("transform", "translate(0, "+(area.sec.h*2 + offset.btw*2).toString()+")");

  function kfEvent(k, c) {
    return selectStr("#"+k)+favStr("style", "fill", c)+";"+selectStr("#"+k+"-cap")+favStr("attr", "fill", bright(c, -.2))+";"
  }

  function sEvent(k, c, io) {
    return selectStr("#"+k)+favStr("style", "fill", c)+";"+selectStr("#"+k+"-cap")+favStr("style", "display", io)+";"
  }

  for (var i = 0; i < 3; i++) {
    var sname = "sec"+(i+1).toString(),
        gkey = gender_keys[i],
        section = eval(sname),
        g_data = eval(gkey),
        g_diversity = get_diversity(onarea, dtset_key, gkey);
    var n_fo = g_data.length - 2;
    section.append("text").attr("id", "graph-"+sname+"-name").attr("x", 0).attr("y", area.text.font_big).text(gender_names[gkey][1])
           .attr("text-anchor", "start").attr("font-size", area.text.font_big).attr("fill", color[gkey[0]]);
    section.append("text").attr("id", "graph-"+sname+"-diversity").attr("x", area.text.font_big*3).attr("y", area.text.font_big).text("다양도 지수: "+roundStr(g_diversity, 2))
           .attr("text-anchor", "start").attr("font-size", area.text.font_small).attr("fill", bright(color[gkey[0]], -.2));

    var fobar_cap_bbox = d3.select("#graph-"+sname+"-diversity").node().getBBox();
    var donutPos = fobar_cap_bbox.x + fobar_cap_bbox.width + area.sec.donut.outer*2;
    var divDonut = section.append("g").attr("id", "graph-"+sname+"-donut-"+gkey).attr("width", area.sec.donut.outer*2).attr("height", area.sec.donut.outer*2)
                          .attr("transform", "translate("+(donutPos).toString()+", "+(area.sec.donut.outer+area.text.line_height*.3).toString()+")");
    var divArc = d3.arc(), tau = Math.PI*2;
    divArc.outerRadius(area.sec.donut.outer).innerRadius(area.sec.donut.outer - area.sec.donut.thick).cornerRadius(area.sec.donut.r).startAngle(0);
    divDonut.append("path").style("fill", bright(color.bg,.4)).datum({endAngle: tau}).attr("d", divArc);
    divDonut.append("path").attr("id", "graph-"+sname+"-donut-"+gkey+"-donut").style("fill", color[gkey[0]]).datum({endAngle: g_diversity/100*tau}).attr("d", divArc);

    var kfbarY = area.text.font_big + offset.sec.btw,
        kfbarH = area.sec.bar.h + area.text.line_height + area.text.font_small;
    var kfbar = section.append("g").attr("id", "graph-"+sname+"-kfbar").attr("width", area.sec.bar.w).attr("height", kfbarH)
                         .attr("transform", "translate(0,"+(kfbarY).toString()+")")

    var kcolor = bright(color[gkey[0]], -.2);
    kfbar.append("defs")
         .append("clipPath").attr("id", "graph-"+sname+"-kfbar-clip").append("rect").attr("width", area.sec.bar.w).attr("height", area.sec.bar.h)
         .attr("x", 0).attr("y", 0).attr("rx", area.r).attr("ry", area.r);
    var fcolor = color[gkey[0]];
    var kf_ko_v = dtset[onarea][gkey]['data']['한국']['ratio'],
        kf_fo_v = dtset[onarea][gkey]['data']['외국인']['ratio'];
    kfbar.append("rect").attr("id", "graph-"+sname+"-kfbar-fo").attr("clip-path", "url(#"+"graph-"+sname+"-kfbar-clip"+")").attr("class", "hasAction")
         .attr("x", 0).attr("y", 0).attr("width", area.sec.bar.w * kf_fo_v).attr("height", area.sec.bar.h)
         .attr("fill", fcolor)
         .attr("onmouseover", kfEvent("graph-"+sname+"-kfbar-fo", bright(fcolor, .3)))
         .attr("onmouseout", kfEvent("graph-"+sname+"-kfbar-fo", fcolor));
    kfbar.append("text").attr("id", "graph-"+sname+"-kfbar-fo-cap").attr("x", area.r).attr("y", area.sec.bar.h + area.text.line_height + area.text.font_small).attr("class", "hasAction")
         .attr("text-anchor", "start").attr("font-size", area.text.font_small).attr("fill", bright(fcolor, -.2))
         .text("외국인: "+roundStr(dtset[onarea][gkey]['data']['외국인']['count'], 0)+"명 ("+roundStr(dtset[onarea][gkey]['data']['외국인']['ratio']*100, 2)+"%)")
         .attr("onmouseover", kfEvent("graph-"+sname+"-kfbar-fo", bright(fcolor, .3)))
         .attr("onmouseout", kfEvent("graph-"+sname+"-kfbar-fo", fcolor));
    var k
    kfbar.append("rect").attr("id", "graph-"+sname+"-kfbar-ko").attr("clip-path", "url(#"+"graph-"+sname+"-kfbar-clip"+")").attr("class", "hasAction")
         .attr("x", area.sec.bar.w * kf_fo_v).attr("y", 0).attr("width", area.sec.bar.w * kf_ko_v).attr("height", area.sec.bar.h)
         .attr("fill", kcolor)
         .attr("onmouseover", kfEvent("graph-"+sname+"-kfbar-ko", bright(kcolor, .3)))
         .attr("onmouseout", kfEvent("graph-"+sname+"-kfbar-ko", kcolor));
    kfbar.append("text").attr("id", "graph-"+sname+"-kfbar-ko-cap").attr("x", area.sec.bar.w - area.r).attr("y", area.sec.bar.h + area.text.line_height + area.text.font_small).attr("class", "hasAction")
         .attr("text-anchor", "end").attr("font-size", area.text.font_small).attr("fill", bright(kcolor, -.2))
         .text("한국인: "+roundStr(dtset[onarea][gkey]['data']['한국']['count'], 0)+"명 ("+roundStr(dtset[onarea][gkey]['data']['한국']['ratio']*100, 2)+"%)")
         .attr("onmouseover", kfEvent("graph-"+sname+"-kfbar-ko", bright(kcolor, .3)))
         .attr("onmouseout", kfEvent("graph-"+sname+"-kfbar-ko", kcolor));

    var sbarY = kfbarY + kfbarH + offset.sec.btw,
        sbarH = area.sec.sbar.h + area.text.line_height + area.text.font_xs;
    var sbar = section.append("g").attr("id", "graph-"+sname+"-sbar").attr("width", area.sec.sbar.w).attr("height", sbarH)
                      .attr("transform", "translate("+(area.sec.w - area.sec.sbar.w).toString()+","+(sbarY).toString()+")")
    sbar.append("defs")
         .append("clipPath").attr("id", "graph-"+sname+"-sbar-clip").append("rect").attr("width", area.sec.sbar.w).attr("height", area.sec.sbar.h)
         .attr("x", 0).attr("y", 0).attr("rx", area.r).attr("ry", area.r);
    var bright_order = [0, -.3, -.5, -.2, -.6, -.4];
    var f_range = dtset[onarea][gkey]['data']['외국인']['ratio'];
    for (var j = 0, k = 0, pos = 0; j < g_data.length; j++) {
      var cell_name = g_data.data[j].name;
      if (["한국", "외국인"].indexOf(cell_name) < 0) {
        var cell_w_rate = g_data.data[j]["ratio"] / f_range,
            bar_w = area.sec.sbar.w * cell_w_rate,
            bar_c = bright(color[gkey[0]], bright_order[k%6]),
            bar_id = "graph-"+sname+"-sbar-"+k.toString();
        sbar.append("rect").attr("id", bar_id).attr("country", cell_name).attr("class", "hasAction")
            .attr("width", bar_w).attr("height", area.sec.sbar.h)
            .attr("clip-path", "url(#"+"graph-"+sname+"-sbar-clip"+")")
            .attr("x", pos).attr("y", 0).attr("fill", bar_c)
            .attr("onmouseover", sEvent(bar_id, bright(bar_c, .2), "inherit"))
            .attr("onmouseout", sEvent(bar_id, bar_c, "none"));
        sbar.append("text").attr("id", bar_id+"-cap").attr("country", cell_name)
            .attr("y", area.sec.sbar.h + offset.sec.btw + area.text.font_xxs).attr("font-size", area.text.font_xs).attr("fill", color[gkey[0]])
            .text(cell_name+": "+roundStr(g_data.data[j]["count"], 0)+"명 ("+roundStr(g_data.data[j]["ratio"]*100, 2)+"%)")
            .attr("x", pos + bar_w).attr("text-anchor", "end").style("display", "none");
        pos += bar_w;
        k++;
      }
    }
    var fobarY = sbarY + sbarH + offset.sec.btw;
    var fobar = section.append("g").attr("id", "graph-"+sname+"-fobar").attr("width", area.sec.fobar.w).attr("height", area.sec.fobar.h).attr("transform", "translate(0, "+(fobarY).toString()+")");
    for (var j = 0, k = 0; j < area.sec.fobar.max; j++) {
      if (j < n_fo) {
        fobar.append("rect").attr("id", "graph-"+sname+"-fobar-"+j.toString())
             .attr("width", area.sec.fobar.w / area.sec.fobar.max *0.8).attr("height", area.sec.fobar.h).attr("y", 0).attr("x", area.sec.fobar.w / area.sec.fobar.max * (j))
             .style("fill", color[gkey[0]]);
      } else {
        fobar.append("rect").attr("width", area.sec.fobar.w / area.sec.fobar.max *0.8).attr("height", area.sec.fobar.h).attr("y", 0).attr("x", area.sec.fobar.w / area.sec.fobar.max * (j))
             .style("fill", bright(color.bg, .3));
      }
    }
    section.append("text").attr("id", "graph-"+sname+"-fobar-n").attr("x", 0).attr("y", fobarY + wnsize(-area.text.font_xs, area.text.font_xs*1.1) ).text("총 "+n_fo+"개 국적의 외국인들이 살고 있습니다.")
           .attr("text-anchor", "start").attr("font-size", area.text.font_xs).attr("fill", bright(color[gkey[0]], -.2));
  }
}
