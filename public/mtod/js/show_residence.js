function printContentResidence(tp, gp, xp) {
  //data
  var hasGender = false,
      tab_ttl = table_tabs[4][1]
  //print
  $(tp).text('');
  $(gp).text('');
  $(xp).text('');
  printTableSubject(tp, gp, hasGender, 'b');
  printGraphResidence(gp);
  printTextResidence(xp);
}


function printGraphResidence(gp) {
  var dtset = on_sub.dtset,
      dtset_key = on_sub.dtset_key,
      tab_ttl = table_name[on_sub.dtset_key][1];
  //data
  var both = singleSortData(dtset, 'both', false);
  //layout
  var view_w = $(gp).width() - 20,
      view_h = view_w * wnsize(0.3, 0.5); // 800 x 240
  var offset = {
        btw: 30
      },
      area = {
        w: 800,
        h: 240,
        sec: {
          y: wnsize(0, 75),
          tw: 800 - offset.btw * (both.length-1)
        },
        rad: [],
        radsum: 0,
        text: {
          font_big: wnsize(16, 24),
          font_normal: wnsize(9, 19),
          line_height: 2
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
  var graph = place.append("svg").attr("id", "residence-graph")
                                 .attr("width", view_w).attr("height", view_h)
                                 .attr("viewBox", "0 0 "+area.w+" "+area.h);
  for (var i = 0; i < both.length; i++) {
    area.rad[i] = Math.sqrt(both.data[i]['b_ratio']);
    area.radsum += area.rad[i];
  }

  function eventStr(k1, c1, k2, c2, k3, c3, k4, c4) {
    var result = selectAllStr([k2])+favStr("style", "fill", c2)+";"+selectAllStr(["."+k3])+favStr("style", "fill", c3)+";";
    result += selectStr("#"+k1)+favStr("style", "fill", c1)+";"+selectStr("#"+k4+"-no")+filterStr("."+k3)+favStr("style", "fill", c4)+";"
    result += selectStr("#"+k4)+filterStr("."+k3)+favStr("style", "fill", c4)+";";
    return result;
  }

  for (var i = both.length-1, xpos = 0; i >= 0; i--) {
    var grp_id = "graph-section-"+i.toString(),
        rad = area.rad[i]/area.radsum,
        width = area.sec.tw * rad;
    var section = graph.append("g").attr("id", grp_id).attr("width", width).attr("height", width)
                                   .attr("transform", "translate("+xpos.toString()+", "+((area.h-width)/2 + area.sec.y).toString()+")");
    var grp_circle = section.append("circle").attr("id", grp_id + "-circle").attr("cx", width/2).attr("cy", width/2).attr("r", width/2).style("fill", bright(color.b, -.2))
                            .attr("class", "hasAction")
                            .attr("onmouseover", eventStr(grp_id+"-circle", bright(color.b, .2), "circle", bright(color.b, -.5), "cap-out", bright(color.b, -.5), grp_id+"-cap", color.b))
                            .attr("onmouseout", eventStr(grp_id+"-circle", bright(color.b, -.2), "circle", bright(color.b, -.2), "cap-out", color.b, grp_id+"-cap", color.b));
    var grp_cap = section.append("text").attr("id", grp_id + "-cap").attr("x", width/2).attr("y", width/2 - area.text.font_normal*.7)
                         .attr("text-anchor", "middle").attr("font-size", area.text.font_normal).attr("fill", color.bg)
                         .text(rownames[both.data[i]['name']])
                         .attr("class", "hasAction")
                         .attr("onmouseover", eventStr(grp_id+"-circle", bright(color.b, .2), "circle", bright(color.b, -.5), "cap-out", bright(color.b, -.5), grp_id+"-cap", color.b))
                         .attr("onmouseout", eventStr(grp_id+"-circle", bright(color.b, -.2), "circle", bright(color.b, -.2), "cap-out", color.b, grp_id+"-cap", color.b));
    var grp_no = section.append("text").attr("id", grp_id + "-cap-no").attr("x", width/2).attr("y", width/2 + area.text.font_normal*.7)
                        .attr("text-anchor", "middle").attr("font-size", area.text.font_normal).attr("fill", color.bg)
                        .text(roundStr(both.data[i]['b_count'],0)+" ("+roundStr(both.data[i]['b_ratio']*100,2)+"%)")
                        .attr("class", "hasAction")
                        .attr("onmouseover", eventStr(grp_id+"-circle", bright(color.b, .2), "circle", bright(color.b, -.5), "cap-out", bright(color.b, -.5), grp_id+"-cap", color.b))
                        .attr("onmouseout", eventStr(grp_id+"-circle", bright(color.b, -.2), "circle", bright(color.b, -.2), "cap-out", color.b, grp_id+"-cap", color.b));
    var cap_w = (grp_no.node().getBBox().width > grp_cap.node().getBBox().width ? grp_no.node().getBBox().width : grp_cap.node().getBBox().width);

    if (width < cap_w) {
      var t_bound_x = area.text.font_normal + area.text.line_height,
          t_bound_y = width/6
      grp_cap.attr("transform", "rotate(-45)").style("fill", color.b).attr("text-anchor", "start").attr("x", t_bound_x).attr("y", t_bound_y - t_bound_x)
             .attr("class", "hasAction cap-out");
      grp_no.attr("transform", "rotate(-45)").style("fill", color.b).attr("text-anchor", "start").attr("x", t_bound_x).attr("y", t_bound_y)
            .attr("class", "hasAction cap-out");
    }
    xpos += width + offset.btw;

  }
}
