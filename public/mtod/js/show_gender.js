function printContentGender(tp, gp, xp) {
  //data
  var hasGender = false,
      tab_ttl = table_tabs[3][1]
  //print
  $(tp).text('');
  $(gp).text('');
  $(xp).text('');
  printTableSubject(tp, gp, hasGender, 'b');
  printGraphGender(gp);
  printTextGender(xp);
}

function printGraphGender(gp) {
  var dtset = on_sub.dtset,
      dtset_key = on_sub.dtset_key,
      tab_ttl = table_name[on_sub.dtset_key][1];
  //data
  var both = singleSortData(dtset, 'both', false);
  //layout
  var view_w = $(gp).width() - 20,
      view_h = view_w * 0.18;
  var offset = { //800*200 // -
        mf: 2,
        linebar: 5,
        bar_pos: 10,
        mfr: 5
      },
      area = {
        w: 800,
        h: 144,
        r: 3,
        bar: {
          h: 84
        },
        line: {
          h: 25,
          thick: 0.5
        },
        text: {
          font_big: wnsize(16, 20),
          font_normal: wnsize(10, 14),
          font_small: wnsize(10, 13),
          font_xs: wnsize(7, 10),
          font_xxs: wnsize(3, 6),
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
      var graph = place.append("svg").attr("id", "gender-graph")
                                     .attr("width", view_w).attr("height", view_h)
                                     .attr("viewBox", "0 0 "+area.w+" "+area.h);
      var bar = graph.append("g").attr("id", "graph-bar").attr("width", area.w).attr("height", area.bar.h)
                                 .attr("transform", "translate(0, "+(area.line.h+offset.linebar).toString()+")");
      var xpoints = {
            center: .5,
            national: (dtset['전국']['data']['female']['ratio'] - 0.4) / 0.2,
            here: (dtset[onarea]['data']['female']['ratio'] - 0.4) / 0.2
          };
      var lineids = ['top', 'bottom']
      for (var j = 0; j < lineids.length; j++) {
        var lid = "graph-midline-" + lineids[j];
        var mid = graph.append("g").attr("id", lid).attr("width", area.w).attr("height", area.line.h)
                                   .attr("transform", "translate(0, "+((area.line.h+offset.linebar*2+area.bar.h)*j).toString()+")");
        mid.append("line").attr("id", lid+"-entire").attr("stroke", color.b).attr("stroke-width", area.line.thick).attr("stroke-dasharray", "2 1")
                          .attr("x1", area.w * xpoints.national - area.line.thick/2).attr("y1", 0)
                          .attr("x2", area.w * xpoints.national - area.line.thick/2).attr("y2", area.line.h);
        for (var k = 0; k < 21; k++) {
          var p = area.w * 0.05*k - area.line.thick/2  + (k == 0 ? 1 : 0),
              hplus = area.line.h*2/3*(1-j),
              ty = hplus +  area.text.font_xs * (k == 10 ? (j == 0 ? 0 : 2) : 1),
              anchor = (k < 10 ? "start" : (k == 10 ? "middle" : "end")),
              margin = (k < 10 ? 1 : -1) * area.text.line_height/2;
          mid.append("line").attr("id", lid+"-"+k.toString()).attr("stroke", bright(color.b, -.3)).attr("stroke-width", area.line.thick)
                            .attr("x1", p).attr("y1", hplus + 0)
                            .attr("x2", p).attr("y2", hplus + area.line.h/3);
          mid.append("text").attr("id", lid+"-"+k.toString()+"-cap").attr("x", p + margin).attr("y", ty)
                            .attr("text-anchor", anchor).attr("font-size", area.text.font_xs).attr("fill", color.b)
                            .text(roundStr(40+k, 1)+"%");
        }
      }
      d3.select("#graph-midline-top").append("text").attr("x", area.w * xpoints.national + area.text.line_height).attr("y", area.line.h/2 - area.text.line_height)
                                     .attr("fill", color.b).attr("font-size", area.text.font_xs).attr("text-anchor", "start")
                                     .text("전국 여성 인구: " + roundStr(dtset['전국']['data']['female']['ratio']*100, 2)+"%");

      function eventStr(cls1, cls2, c1, c2) {
        var result = selectAllStr(["."+cls2])+favStr("style", "fill", c2)+";";
        result += selectAllStr(["."+cls1])+favStr("style", "fill", c1)+";";
        return result;
      }

      var fpoints = area.w * xpoints.here,
          mpoints = area.w * (1 - xpoints.here);
      bar.append("rect").attr("id", "graph-bar-female").style("fill", color.f).attr("x", - offset.bar_pos).attr("y", 0).attr("rx", area.r).attr("ry", area.r)
         .attr("width", fpoints + offset.bar_pos - offset.mf).attr("height", area.bar.h)
         .attr("class", "hasAction graph-f")
         .attr("onmouseover", eventStr("graph-f", "graph-m", bright(color.f, .3), bright(color.m, -.3)))
         .attr("onmouseout", eventStr("graph-f", "graph-m", color.f, color.m));
      bar.append("text").attr("id", "graph-bar-female-cap").attr("fill", color.bg).attr("x", fpoints - offset.mf - area.text.line_height*offset.mfr).attr("y", area.bar.h/2 - area.text.font_big + area.text.line_height*3/2 + 1)
         .attr("font-weight", "bold").attr("text-anchor", "end").attr("font-size", area.text.font_big).text("여성")
         .attr("class", "hasAction")
         .attr("onmouseover", eventStr("graph-f", "graph-m", bright(color.f, .3), bright(color.m, -.3)))
         .attr("onmouseout", eventStr("graph-f", "graph-m", color.f, color.m));
      bar.append("text").attr("id", "graph-bar-female-no").attr("fill", color.bg).attr("x", fpoints - offset.mf - area.text.line_height*offset.mfr).attr("y", area.bar.h/2 + area.text.font_big + area.text.line_height/2 + 1)
         .attr("font-weight", "bold").attr("text-anchor", "end").attr("font-size", area.text.font_big).text(roundStr(dtset[onarea]['data']['female']['ratio']*100, 2)+"%")
         .attr("class", "hasAction")
         .attr("onmouseover", eventStr("graph-f", "graph-m", bright(color.f, .3), bright(color.m, -.3)))
         .attr("onmouseout", eventStr("graph-f", "graph-m", color.f, color.m));

      bar.append("rect").attr("id", "graph-bar-male").style("fill", color.m).attr("x", fpoints + offset.mf).attr("y", 0).attr("rx", area.r).attr("ry", area.r)
         .attr("width", mpoints + offset.bar_pos - offset.mf).attr("height", area.bar.h)
         .attr("class", "hasAction graph-m")
         .attr("onmouseover", eventStr("graph-m", "graph-f", bright(color.m, .3), bright(color.f, -.3)))
         .attr("onmouseout", eventStr("graph-m", "graph-f", color.m, color.f));
      bar.append("text").attr("id", "graph-bar-male-cap").attr("fill", color.bg).attr("x", fpoints + offset.mf + area.text.line_height*offset.mfr).attr("y", area.bar.h/2 - area.text.font_big + area.text.line_height*3/2 + 1)
         .attr("font-weight", "bold").attr("text-anchor", "start").attr("font-size", area.text.font_big).text("남성")
         .attr("class", "hasAction")
         .attr("onmouseover", eventStr("graph-m", "graph-f", bright(color.m, .3), bright(color.f, -.3)))
         .attr("onmouseout", eventStr("graph-m", "graph-f", color.m, color.f));
      bar.append("text").attr("id", "graph-bar-male-no").attr("fill", color.bg).attr("x", fpoints + offset.mf + area.text.line_height*offset.mfr).attr("y", area.bar.h/2 + area.text.font_big + area.text.line_height/2 + 1)
         .attr("font-weight", "bold").attr("text-anchor", "start").attr("font-size", area.text.font_big).text(roundStr(dtset[onarea]['data']['male']['ratio']*100, 2)+"%")
         .attr("class", "hasAction")
         .attr("onmouseover", eventStr("graph-m", "graph-f", bright(color.m, .3), bright(color.f, -.3)))
         .attr("onmouseout", eventStr("graph-m", "graph-f", color.m, color.f));
}
