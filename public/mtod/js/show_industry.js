function printContentIndustry(tp, gp, xp) {
  //data
  var hasGender = true,
      tab_ttl = table_tabs[5][1];
  //print
  $(tp).text('');
  $(gp).text('');
  $(xp).text('');
  var female = singleSortData(on_sub.dtset, 'female', true),
      male = singleSortData(on_sub.dtset, 'male', true),
      both = singleSortData(on_sub.dtset, 'both', true);
  printTableSubject(tp, gp, hasGender, 'b');
  printGraphIndustry(female, male, both, gp);
  printTextIndustry(female, male, both, xp);
}

function printGraphIndustry(female, male, both, gp) {
  var dtset = on_sub.dtset,
      dtset_key = on_sub.dtset_key,
      tab_ttl = table_name[on_sub.dtset_key][1];
  //data

  //layout
  var view_w = $(gp).width() - 20,
      view_h = view_w * 0.32;
  var offset = {
        btw: 16,
        sec: {
          inner: 3
        }
      },
      area = {
        w: 800,
        h: 256,
        sec: {
          w: 256,
          h: 256,
          donut: {
            outer: 125,
            thick: 15,
            r: 1,
            tau: Math.PI * 2
          }
        },
        text: {
          font_big: wnsize(16, 29),
          font_normal: wnsize(10, 25),
          font_small: wnsize(9, 23),
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
    var graph = place.append("svg").attr("id", "industry-graph")
                                   .attr("width", view_w).attr("height", view_h)
                                   .attr("viewBox", "0 0 "+area.w+" "+area.h);
    var sec1 = graph.append("g").attr("id", "graph-sec1").attr("width", area.sec.w).attr("height", area.sec.h).attr("transform", "translate(0, 0)"),
        sec2 = graph.append("g").attr("id", "graph-sec2").attr("width", area.sec.w).attr("height", area.sec.h).attr("transform", "translate("+(area.sec.w + offset.btw).toString()+", 0)"),
        sec3 = graph.append("g").attr("id", "graph-sec3").attr("width", area.sec.w).attr("height", area.sec.h).attr("transform", "translate("+(area.sec.w*2 + offset.btw*2).toString()+", 0)");

    var bright_order = [-.2, -.4],
        b_rate = .3;
    function eventStr(cl, d, cr, isover) {
      var result = "";
      if (isover) {
        result += selectAllStr(["."+cl+"cap-no"])+favStr("style", "display", "none")+";";
        result += selectAllStr(["."+cl+"cap"])+favStr("style", "display", "none")+";";
        result += selectAllStr(["#"+d+"-cap-no"])+favStr("style", "display", "")+";";
        result += selectAllStr(["#"+d+"-cap"])+favStr("style", "display", "")+";";
        result += selectAllStr(["."+cl+"0"])+favStr("style", "fill", bright(cr, -.5))+";";
        result += selectAllStr(["."+cl+"1"])+favStr("style", "fill", bright(cr, -.5))+";";
        result += selectAllStr(["#"+d])+favStr("style", "fill", bright(cr, .1))+";";
      } else {
        result += selectAllStr(["."+cl+"cap-no"])+favStr("style", "display", "")+";";
        result += selectAllStr(["."+cl+"cap"])+favStr("style", "display", "")+";";
        result += selectAllStr(["."+cl+"0"])+favStr("style", "fill", bright(cr, bright_order[0]))+";";
        result += selectAllStr(["."+cl+"1"])+favStr("style", "fill", bright(cr, bright_order[1]))+";";
      }

      return result;
    }

    for (var i = 0; i < 3; i++) {
      var sname = "sec"+(i+1).toString(),
          grp_id = "graph-"+sname
          gkey = gender_keys[i],
          section = eval(sname),
          g_data = eval(gkey),
          g_diversity = get_diversity(onarea, dtset_key, gkey);
      var donut_r = (offset.sec.inner+area.sec.donut.outer).toString(),
          disDonut = section.append("g").attr("id", grp_id + "-donut-wrap").attr("width", area.sec.w).attr("height", area.sec.h).attr("transform", "translate("+donut_r+", "+donut_r+")");
      var arc = d3.arc();
      arc.outerRadius(area.sec.donut.outer).innerRadius(area.sec.donut.outer - area.sec.donut.thick);

  var d_center = [0, 0];var bright_order = [-.2, -.4],
      b_rate = .3;
      var s_angle = 0;

      disDonut.append("text").attr("id", grp_id + "-donut-title ").attr("x", d_center[0]).attr("y", d_center[1] + area.text.font_big/2)
              .attr("text-anchor", "middle").attr("font-size", area.text.font_big)
              .style("fill", bright(color[gkey[0]], .1))
              .text(gender_names[gkey][1]);

      for (var j = 0; j < g_data.length; j++) {
        var e_angle = g_data.data[j]['ratio']*area.sec.donut.tau,
            angles = {startAngle: s_angle, endAngle: s_angle + e_angle},
            b_order = j%2,
            p_class_head = "piece-"+gkey[0]+"-",
            p_class = p_class_head+b_order.toString(),
            g_color = color[gkey[0]],
            d_id = grp_id + "-donut-"+j.toString(),
            d_fill_color = bright(g_color, bright_order[b_order]);

        var piece = disDonut.append("path").attr("id", d_id).style("fill", d_fill_color).datum(angles).attr("d", arc)
                            .attr("class", "hasAction "+p_class)
                            .attr("onmouseover", eventStr(p_class_head, d_id, g_color, true))
                            .attr("onmouseout", eventStr(p_class_head, d_id, g_color, false));
        var p_center_rad = [area.sec.donut.tau*3/4 + (s_angle + e_angle/2), (area.sec.donut.outer - area.sec.donut.thick/2)],
            p_center = radToXY(p_center_rad, d_center);
            text_base = midpoint(p_center, d_center, .65),
            cap_size = area.text.font_small,
            text_base[1] < 0 ? text_base[1] += cap_size/2 : text_base[1] -= cap_size/2;

        disDonut.append("text").attr("id", d_id+"-cap").attr("x", text_base[0]).attr("y", text_base[1])
                .attr("class", "hasAction "+p_class_head+"cap")
                .style("display", wnsize("", "none"))
                .attr("onmouseover", eventStr(p_class_head, d_id, g_color, true))
                .attr("onmouseout", eventStr(p_class_head, d_id, g_color, false))
                .attr("text-anchor", "middle").attr("font-size", cap_size)
                .style("fill", bright(color[gkey[0]], -.1))
                .text(rownames[g_data.data[j]['name']]);
        disDonut.append("text").attr("id", d_id+"-cap-no").attr("x", text_base[0]).attr("y", text_base[1] + cap_size)
                .attr("class", "hasAction "+p_class_head+"cap-no")
                .style("display", wnsize("", "none"))
                .attr("onmouseover", eventStr(p_class_head, d_id, g_color, true))
                .attr("onmouseout", eventStr(p_class_head, d_id, g_color, false))
                .attr("text-anchor", "middle").attr("font-size", cap_size*.8)
                .style("fill", bright(color[gkey[0]], 0))
                .text(roundStr(g_data.data[j]['count'], 0) + "명 ("+roundStr(g_data.data[j]['ratio']*100,2)+"%)");
        s_angle += e_angle;
      }
    }
}
