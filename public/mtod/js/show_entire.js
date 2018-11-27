
function printContentEntire(tp, gp, xp) {
  //data
  var both = [
    get_diversity(onarea, 'nationality', 'both'),
    get_diversity(onarea, 'disability', 'both'),
    get_diversity(onarea, 'gender', 'both'),
    get_diversity(onarea, 'residence', 'both'),
    get_diversity(onarea, 'industry', 'both'),
    get_diversity(onarea, 'age', 'both'),
    get_diversity(onarea, 'entire', 'both')
  ];
  var female = [
    get_diversity(onarea, 'nationality', 'female'),
    get_diversity(onarea, 'disability', 'female'),
    get_diversity(onarea, 'gender', 'both'),
    get_diversity(onarea, 'residence', 'both'),
    get_diversity(onarea, 'industry', 'female'),
    get_diversity(onarea, 'age', 'female'),
    get_diversity(onarea, 'entire', 'female')
  ];
  var male = [
    get_diversity(onarea, 'nationality', 'male'),
    get_diversity(onarea, 'disability', 'male'),
    get_diversity(onarea, 'gender', 'both'),
    get_diversity(onarea, 'residence', 'both'),
    get_diversity(onarea, 'industry', 'male'),
    get_diversity(onarea, 'age', 'male'),
    get_diversity(onarea, 'entire', 'male')
  ];
  //printing
  $(tp).text('');
  $(gp).text('');
  $(xp).text('');
  fadeItem(tp, printTableEntire(both, female, male));
  printGraphEntire(both, female, male, gp);
  printTextEntire(both, female, male, xp);
}

function printTableEntire(both, female, male){
  var table = $("<table></table>").addClass("table table-hover");
  //head
  var thead = $("<thead></thead>");
  thead.append(
    $("<tr></tr>").append(
      $("<th></th>").text("분류"),
      $("<th></th>").text("여성"),
      $("<th></th>").text("전체"),
      $("<th></th>").text("남성")
    )
  );
  table.append(thead);
  //body
  var tbody = $("<tbody></tbody>");
  for (var i=0; i < 7; i++) {
    var name = nkey[keys[i]][0],
        namekey = {
          n: nkey[keys[i]][1]+"-name",
          b: nkey[keys[i]][1]+"-both",
          f: nkey[keys[i]][1]+"-female",
          m: nkey[keys[i]][1]+"-male"
        },
        nd = (i+6)%7;
    var row= $("<tr></tr>").append(
      $("<td></td>").text(name).attr("id", "cell-"+namekey.n),
      $("<td></td>").text((i !=3 & i!= 4) ? roundStr(female[nd], 2) : "-").attr("id", "cell-"+namekey.f),
      $("<td></td>").text(roundStr(both[nd], 2)).attr("id", "cell-"+namekey.b),
      $("<td></td>").text((i !=3 & i!= 4) ? roundStr(male[nd], 2) : "-").attr("id", "cell-"+namekey.m)
    );
    tbody.append(row);
  }
  table.append(tbody);
  return table;
}

function printGraphEntire(both, female, male, gp) {
  var view_w = $(gp).width() - 20,
      view_h = wnsize(view_w * 0.45, view_w * 1.2);
  var offset = {
        sec1: {
          bar1: {
            top: 30,
            bottom: 30,
            left: wnsize(55, 300)
          },
          bar2: {
            top: 30,
            bottom: 30,
            left: 10,
            right: 105
          }
        },
        sec2: {
          top: 30,
          left: 30,
          each: {
            bottom: wnsize(0, 20)
          }
        }
      },
      area = {
        w: 800,
        h: wnsize(360, 933),
        r: 3,
        line: 0.5,
        sec1: {
          w: wnsize(230, 800),
          h: 360,
          bar1: {
            w: 30,
            h: 300,
            each: {
              w: 15
            }
          },
          bar2: {
            w: 30,
            h: 300
          }
        },
        sec2: {
          w: wnsize(540, 800),
          h: wnsize(360, 573),
          each: {
            w: wnsize(180, 266.5),
            h: wnsize(180, 266.5),
            r: 1,
            rad: {
              a: wnsize(81, 128),
              b: wnsize(7, 9),
              c: wnsize(3, 2)
            },
            text: {
              x: wnsize(14, 28)
            }
          }
        },
        text: {
          line_height: wnsize(5, 8),
          font_xxs: wnsize(7, 14),
          font_xs: wnsize(8.5, 17),
          font_small: wnsize(10, 20),
          font_normal: wnsize(14, 30),
          font_big: wnsize(22, 50)
        }

      },
      color = {
        f: key_color['female'],
        m: key_color['male'],
        b: key_color['both'],
        bg: key_color['background'],
        change: .5
      };

  //graph declare
  var place = d3.select(gp);
  var graph = place.append("svg").attr("id", "entire-graph")
                                 .attr("width", view_w).attr("height", view_h)
                                 .attr("viewBox", "0 0 "+area.w+" "+area.h);
  // section 1 - entire bar
  var sec1 = graph.append("g").attr("id", "graph-sec1").attr("width", area.sec1.w).attr("height", area.sec1.h).attr("transform", "translate(0, 0)");
  //bar clipping path
  sec1.append("defs").append("clipPath").attr("id", "graph-clip-sec1-bar1")
      .append("rect").attr("width", area.sec1.bar1.w).attr("height", area.sec1.bar1.h)
      .attr("x", offset.sec1.bar1.left).attr("y", offset.sec1.bar1.top).attr("rx", area.r).attr("ry", area.r);
  sec1.select("defs").append("clipPath").attr("id", "graph-clip-sec1-bar2")
      .append("rect").attr("width", area.sec1.bar2.w).attr("height", area.sec1.bar2.h)
      .attr("x", offset.sec1.bar1.left + area.sec1.bar1.w + offset.sec1.bar2.left).attr("y", offset.sec1.bar2.top).attr("rx", area.r).attr("ry", area.r);
  //bar
  var fh = female[6]/100*area.sec1.bar1.h,
      mh = male[6]/100*area.sec1.bar1.h,
      bh = both[6]/100*area.sec1.bar1.h
      ftm = offset.sec1.bar1.top + (1-female[6]/100)*area.sec1.bar1.h
      mtm = offset.sec1.bar1.top + (1-male[6]/100)*area.sec1.bar1.h
      btm = offset.sec1.bar1.top + (1-both[6]/100)*area.sec1.bar2.h;

  function sec1event(k, c) {
    return selectStr("#"+k+"-bar")+favStr("style", "fill", c)+";"+selectStr("#"+k+"-number")+favStr("attr", "fill", c)+";"+selectStr("#"+k+"-cap")+favStr("attr", "fill", bright(c, -.3))+";"
  }
  function sec1event0(cl, c) {
    return selectAllStr(["."+cl])+favStr("style", "fill", c)+favStr("attr", "fill", c)+";"+selectAllStr(["."+cl+"-dark"])+favStr("attr", "fill", bright(c, -.3))+favStr("style", "fill", bright(c, -.3))+";"
  }
  var s1b1f = "graph-bar1-f",
      s1b1m = "graph-bar1-m",
      s1b2b = "graph-bar2-b";
  sec1.append("rect").attr("clip-path", "url(#graph-clip-sec1-bar1)")
      .attr("x", offset.sec1.bar1.left).attr("y", offset.sec1.bar1.top)
      .attr("width", area.sec1.bar1.w).attr("height", area.sec1.bar1.h)
      .style("fill","#ffffff").style("fill-opacity", bar_back_opc[0]);
  sec1.append("rect").attr("id", s1b1f+"-bar").attr("clip-path", "url(#graph-clip-sec1-bar1)").attr("class", "hasAction graph-f")
      .attr("x", offset.sec1.bar1.left).attr("y", ftm)
      .attr("width", area.sec1.bar1.each.w).attr("height", fh)
      .style("fill", color.f)
      .attr("onmouseover", sec1event0("graph-f", bright(color.f, color.change))).attr("onmouseout", sec1event0("graph-f", color.f));
  sec1.append("rect").attr("id", s1b1m+"-bar").attr("clip-path", "url(#graph-clip-sec1-bar1)").attr("class", "hasAction graph-m")
      .attr("x", offset.sec1.bar1.left + area.sec1.bar1.each.w).attr("y", mtm)
      .attr("width", area.sec1.bar1.each.w).attr("height", mh)
      .style("fill", color.m)
      .attr("onmouseover", sec1event0("graph-m", bright(color.m, color.change))).attr("onmouseout", sec1event0("graph-m", color.m));
  sec1.append("line").attr("class", "hasAction graph-f-dark")
      .attr("x1", 0).attr("y1", ftm).attr("x2", offset.sec1.bar1.left + area.sec1.bar1.each.w).attr("y2", ftm)
      .attr("stroke", bright(color.f, -.3)).attr("stroke-width", area.line)
      .attr("onmouseover", sec1event0("graph-f", bright(color.f, color.change))).attr("onmouseout", sec1event0("graph-f", color.f));
  sec1.append("line").attr("class", "hasAction graph-m-dark")
      .attr("x1", 0).attr("y1", mtm).attr("x2", offset.sec1.bar1.left + area.sec1.bar1.w).attr("y2", mtm)
      .attr("stroke", bright(color.m, -.3)).attr("stroke-width", area.line)
      .attr("onmouseover", sec1event0("graph-m", bright(color.m, color.change))).attr("onmouseout", sec1event0("graph-m", color.m));
  if (ftm < mtm) {
    sec1.append("text").text(roundStr(female[6], 2)).attr("id", s1b1f+"-number").attr("class", "hasAction graph-f")
        .attr("y", ftm - area.text.line_height*1.5).attr("x", 0)
        .attr("font-size", area.text.font_normal).attr("fill", color.f)
        .attr("onmouseover", sec1event0("graph-f", bright(color.f, color.change))).attr("onmouseout", sec1event0("graph-f", color.f));
    sec1.append("text").text("여성").attr("id", s1b1f+"-cap").attr("class", "hasAction graph-f-dark")
        .attr("y", ftm - area.text.line_height*2.5 - area.text.font_normal).attr("x", 0)
        .attr("font-size", area.text.font_small).attr("fill", bright(color.f, -.3))
        .attr("onmouseover", sec1event0("graph-f", bright(color.f, color.change))).attr("onmouseout", sec1event0("graph-f", color.f));
    sec1.append("text").text(roundStr(male[6], 2)).attr("id", s1b1m+"-number").attr("class", "hasAction graph-m")
        .attr("y", mtm + area.text.line_height*1 + area.text.font_normal).attr("x", 0)
        .attr("font-size", area.text.font_normal).attr("fill", color.m)
        .attr("onmouseover", sec1event0("graph-m", bright(color.m, color.change))).attr("onmouseout", sec1event0("graph-m", color.m));
    sec1.append("text").text("남성").attr("id", s1b1m+"-cap").attr("class", "hasAction graph-m-dark")
        .attr("y", mtm + area.text.line_height*2 + area.text.font_normal + area.text.font_small).attr("x", 0)
        .attr("font-size", area.text.font_small).attr("fill", bright(color.m, -.3))
        .attr("onmouseover", sec1event0("graph-m", bright(color.m, color.change))).attr("onmouseout", sec1event0("graph-m", color.m));
  } else {
    sec1.append("text").text(roundStr(male[6], 2)).attr("id", s1b1m+"-number").attr("class", "hasAction graph-m")
        .attr("y", mtm - area.text.line_height*1.5).attr("x", 0)
        .attr("font-size", area.text.font_normal).attr("fill", color.m)
        .attr("onmouseover", sec1event0("graph-m", bright(color.m, color.change))).attr("onmouseout", sec1event0("graph-m", color.m));
    sec1.append("text").text("남성").attr("id", s1b1m+"-cap").attr("class", "hasAction graph-m-dark")
        .attr("y", mtm - area.text.line_height*2.5 - area.text.font_normal).attr("x", 0)
        .attr("font-size", area.text.font_small).attr("fill", bright(color.m, -.3))
        .attr("onmouseover", sec1event0("graph-m", bright(color.m, color.change))).attr("onmouseout", sec1event0("graph-m", color.m));
    sec1.append("text").text(roundStr(female[6], 2)).attr("id", s1b1f+"-number").attr("class", "hasAction graph-f")
        .attr("y", ftm + area.text.line_height*1 + area.text.font_normal).attr("x", 0)
        .attr("font-size", area.text.font_normal).attr("fill", color.f)
        .attr("onmouseover", sec1event0("graph-f", bright(color.f, color.change))).attr("onmouseout", sec1event0("graph-f", color.f));
    sec1.append("text").text("여성").attr("id", s1b1f+"-cap").attr("class", "hasAction graph-f-dark")
        .attr("y", ftm + area.text.line_height*2 + area.text.font_normal + area.text.font_small).attr("x", 0)
        .attr("font-size", area.text.font_small).attr("fill", bright(color.f, -.3))
        .attr("onmouseover", sec1event0("graph-f", bright(color.f, color.change))).attr("onmouseout", sec1event0("graph-f", color.f));
  }

  var blm =  offset.sec1.bar1.left + area.sec1.bar1.w + offset.sec1.bar2.left;
  sec1.append("rect").attr("clip-path", "url(#graph-clip-sec1-bar2)")
      .attr("x", blm).attr("y", offset.sec1.bar2.top)
      .attr("width", area.sec1.bar2.w).attr("height", area.sec1.bar2.h)
      .style("fill","#ffffff").style("fill-opacity", bar_back_opc[0]);
  sec1.append("rect").attr("id", s1b2b+"-bar").attr("clip-path", "url(#graph-clip-sec1-bar2)").attr("class", "hasAction graph-b")
    .attr("x", offset.sec1.bar1.left + area.sec1.bar1.w + offset.sec1.bar2.left).attr("y", btm)
    .attr("width", area.sec1.bar2.w).attr("height", bh)
    .style("fill", color.b)
    .attr("onmouseover", sec1event0("graph-b", bright(color.b, color.change))).attr("onmouseout", sec1event0("graph-b", color.b));
  sec1.append("line").attr("class", "hasAction graph-b")
    .attr("x1", blm).attr("y1", btm).attr("x2", area.sec1.w).attr("y2", btm)
    .attr("stroke", bright(color.b, -.3)).attr("stroke-width", area.line)
    .attr("onmouseover", sec1event0("graph-b", bright(color.b, color.change))).attr("onmouseout", sec1event0("graph-b", color.b));
  sec1.append("text").text(roundStr(both[6], 2)).attr("id", s1b2b+"-number").attr("class", "hasAction graph-b")
      .attr("y", btm - area.text.line_height*2.1).attr("x", area.sec1.w)
      .attr("text-anchor", "end").attr("font-size", area.text.font_big).attr("fill", color.b)
      .attr("onmouseover", sec1event0("graph-b", bright(color.b, color.change))).attr("onmouseout", sec1event0("graph-b", color.b));
  sec1.append("text").text("종합다양도 전체").attr("id", s1b2b+"-cap").attr("class", "hasAction graph-b-dark")
      .attr("y", btm - area.text.line_height*2.5 - area.text.font_big).attr("x", area.sec1.w)
      .attr("text-anchor", "end").attr("font-size", area.text.font_small).attr("fill", bright(color.b, -.3))
      .attr("onmouseover", sec1event0("graph-b", bright(color.b, color.change))).attr("onmouseout", sec1event0("graph-b", color.b));
  // section 2 - individual elements
  var sec2 = graph.append("g").attr("id", "graph-sec2").attr("width", area.sec2.w).attr("height", area.sec2.h);
  if (isNarrow) {
    sec2.attr("transform", "translate(0, "+(area.sec1.h+offset.sec2.left).toString()+")");
  } else {
    sec2.attr("transform", "translate("+(area.sec1.w+offset.sec2.left).toString()+", 0)");
  }
  var sec20 = sec2.append("g").attr("id", "graph-sec20").attr("width", area.sec2.each.w).attr("height", area.sec2.each.h).attr("transform", "translate("+(area.sec2.each.w*0).toString()+", "+(area.sec2.each.h*0).toString()+")"),
      sec21 = sec2.append("g").attr("id", "graph-sec21").attr("width", area.sec2.each.w).attr("height", area.sec2.each.h).attr("transform", "translate("+(area.sec2.each.w*1).toString()+", "+(area.sec2.each.h*0).toString()+")"),
      sec22 = sec2.append("g").attr("id", "graph-sec22").attr("width", area.sec2.each.w).attr("height", area.sec2.each.h).attr("transform", "translate("+(area.sec2.each.w*2).toString()+", "+(area.sec2.each.h*0).toString()+")"),
      sec23 = sec2.append("g").attr("id", "graph-sec23").attr("width", area.sec2.each.w).attr("height", area.sec2.each.h).attr("transform", "translate("+(area.sec2.each.w*0).toString()+", "+(area.sec2.each.h*1 + offset.sec2.each.bottom).toString()+")"),
      sec24 = sec2.append("g").attr("id", "graph-sec24").attr("width", area.sec2.each.w).attr("height", area.sec2.each.h).attr("transform", "translate("+(area.sec2.each.w*1).toString()+", "+(area.sec2.each.h*1 + offset.sec2.each.bottom).toString()+")"),
      sec25 = sec2.append("g").attr("id", "graph-sec25").attr("width", area.sec2.each.w).attr("height", area.sec2.each.h).attr("transform", "translate("+(area.sec2.each.w*2).toString()+", "+(area.sec2.each.h*1 + offset.sec2.each.bottom).toString()+")");

  var tau = 2 * Math.PI;
  var arc = d3.arc();
  var gendered = [true, true, false, false, true, true]
  var legend_vy = area.sec2.each.h*0.5+area.text.line_height*0.5+area.text.font_xs,
      legend_ny = area.sec2.each.h*0.5+area.text.line_height*1.2+area.text.font_xs+area.text.font_xxs;
  for (var i = 0; i < 6; i++) {
    var sid = "sec2"+i.toString();
    var section = eval(sid);
    var sect = section.append("g").attr("id", "graph-"+sid+"-pie").attr("width", area.sec2.each.w).attr("height", area.sec2.each.h).attr("transform", "translate("+(area.sec2.each.w*0.5).toString()+", "+(area.sec2.each.h*0.5).toString()+")");

    section.append("text").attr("id", "graph-"+sid+"-ln").attr("x", area.sec2.each.w*0.5).attr("y", area.sec2.each.h*0.5-area.text.line_height)
           .attr("text-anchor", "middle").attr("font-size", area.text.font_normal).attr("fill", color.b)
           .text(table_tabs[i+1][1]);
    if (gendered[i]) {
      arc.outerRadius(area.sec2.each.rad.a).innerRadius(area.sec2.each.rad.a - area.sec2.each.rad.b*1).cornerRadius(area.sec2.each.r).startAngle(0);
      sect.append("path").style("fill", bright(color.bg,.1)).datum({endAngle: tau}).attr("d", arc);
      sect.append("path").attr("id", "graph-"+sid+"-pie"+"-f").style("fill", color.f).datum({endAngle: female[i]/100*tau}).attr("d", arc).attr("class", "hasAction graph-f")
          .attr("onmouseover", sec1event0("graph-f", bright(color.f, color.change))).attr("onmouseout", sec1event0("graph-f", color.f));
      section.append("text").attr("id", "graph-"+sid+"-lv-f").attr("x", area.sec2.each.w*0.5 + area.sec2.each.text.x*2).attr("y", legend_vy).attr("class", "hasAction graph-f")
             .attr("text-anchor", "middle").attr("font-size", area.text.font_xs).attr("fill", color.f)
             .text(roundStr(female[i], 2))
             .attr("onmouseover", sec1event0("graph-f", bright(color.f, color.change))).attr("onmouseout", sec1event0("graph-f", color.f));
      section.append("text").attr("id", "graph-"+sid+"-ln-f").attr("x", area.sec2.each.w*0.5 + area.sec2.each.text.x*2).attr("y", legend_ny).attr("class", "hasAction graph-f-dark")
             .attr("text-anchor", "middle").attr("font-size", area.text.font_xxs).attr("fill", bright(color.f, -.3))
             .text("여성")
             .attr("onmouseover", sec1event0("graph-f", bright(color.f, color.change))).attr("onmouseout", sec1event0("graph-f", color.f));
    }
    arc.outerRadius(area.sec2.each.rad.a - area.sec2.each.rad.b*1 - area.sec2.each.rad.c*1).innerRadius(area.sec2.each.rad.a - area.sec2.each.rad.b*2 - area.sec2.each.rad.c*1).cornerRadius(area.sec2.each.r).startAngle(0);
    sect.append("path").style("fill", bright(color.bg,.1)).datum({endAngle: tau}).attr("d", arc);
    sect.append("path").attr("id", "graph-"+sid+"-pie"+"-b").style("fill", color.b).datum({endAngle: both[i]/100*tau}).attr("d", arc).attr("class", "hasAction graph-b")
        .attr("onmouseover", sec1event0("graph-b", bright(color.b, color.change))).attr("onmouseout", sec1event0("graph-b", color.b));
    section.append("text").attr("id", "graph-"+sid+"-lv-b").attr("x", area.sec2.each.w*0.5).attr("y", legend_vy).attr("class", "hasAction graph-b")
           .attr("text-anchor", "middle").attr("font-size", area.text.font_xs).attr("fill", color.b)
           .text(roundStr(both[i], 2))
           .attr("onmouseover", sec1event0("graph-b", bright(color.b, color.change))).attr("onmouseout", sec1event0("graph-b", color.b));
    section.append("text").attr("id", "graph-"+sid+"-ln-b").attr("x", area.sec2.each.w*0.5).attr("y", legend_ny)
           .attr("text-anchor", "middle").attr("font-size", area.text.font_xxs).attr("fill", bright(color.b, -.3)).attr("class", "hasAction graph-b-dark")
           .text("전체")
           .attr("onmouseover", sec1event0("graph-b", bright(color.b, color.change))).attr("onmouseout", sec1event0("graph-b", color.b));
    if (gendered[i]) {
      arc.outerRadius(area.sec2.each.rad.a - area.sec2.each.rad.b*2 - area.sec2.each.rad.c*2).innerRadius(area.sec2.each.rad.a - area.sec2.each.rad.b*3 - area.sec2.each.rad.c*2).cornerRadius(area.sec2.each.r).startAngle(0);
      sect.append("path").style("fill", bright(color.bg,.1)).datum({endAngle: tau}).attr("d", arc);
      sect.append("path").attr("id", "graph-"+sid+"-pie"+"-m").style("fill", color.m).datum({endAngle: male[i]/100*tau}).attr("d", arc).attr("class", "hasAction graph-m")
          .attr("onmouseover", sec1event0("graph-m", bright(color.m, color.change))).attr("onmouseout", sec1event0("graph-m", color.m));
      section.append("text").attr("id", "graph-"+sid+"-lv-m").attr("x", area.sec2.each.w*0.5 - area.sec2.each.text.x*2).attr("y", legend_vy).attr("class", "hasAction graph-m")
            .attr("text-anchor", "middle").attr("font-size", area.text.font_xs).attr("fill", color.m)
            .text(roundStr(male[i], 2))
            .attr("onmouseover", sec1event0("graph-m", bright(color.m, color.change))).attr("onmouseout", sec1event0("graph-m", color.m));
      section.append("text").attr("id", "graph-"+sid+"-ln-m").attr("x", area.sec2.each.w*0.5 - area.sec2.each.text.x*2).attr("y", legend_ny).attr("class", "hasAction graph-m-dark")
             .attr("text-anchor", "middle").attr("font-size", area.text.font_xxs).attr("fill", bright(color.m, -.3))
             .text("남성")
             .attr("onmouseover", sec1event0("graph-m", bright(color.m, color.change))).attr("onmouseout", sec1event0("graph-m", color.m));
    }
  }
}
