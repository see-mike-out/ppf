function printContentAge(tp, gp, xp) {
  //data
  var data = sortData(on_sub.dtset, true, 'n');

  //print
  $(tp).text('');
  $(gp).text('');
  $(xp).text('');
  printTableSubject(tp, gp, on_sub.hasGender, 'b');
  printGraphAge(data, gp);
  printTextAge(data, xp);
}

function printGraphAge(data, gp) {
  var dtset = on_sub.dtset,
      dtset_key = on_sub.dtset_key,
      tab_ttl = table_name[on_sub.dtset_key][1];
  //layout
  var view_w = $(gp).width() - 20,
      view_h = view_w * 0.35;
      offset = {
        bar: {
          btw: 5
        },
        sec: {
          btw: 20
        }
      },
      area = {
        w: 800,
        h: 280,
        r: 1.5,
        sec: {
          w: 800,
          h: 130
        },
        bar: {
          h: 130,
          w: (800-offset.bar.btw*(data.length-1))/data.length
        },
        text: {
          font_big: wnsize(16, 29),
          font_normal: 10,
          font_small: 9,
          font_xs: 7,
          font_xxs: 3,
          line_height: 5
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
    var graph = place.append("svg").attr("id", "age-graph")
                                   .attr("width", view_w).attr("height", view_h)
                                   .attr("viewBox", "0 0 "+area.w+" "+area.h);
    var sec0 = graph.append("g").attr("id", "graph-section-0").attr("width", area.sec.w).attr("height", area.sec.h).attr("transform", "translate(0, 0)"),
        seclg = graph.append("g").attr("id", "graph-section-lg").attr("width", area.sec.w).attr("height", area.text.font_small).attr("transform", "translate(0, "+(area.sec.h + (offset.sec.btw - area.text.font_small)/2).toString()+")")
        sec1 = graph.append("g").attr("id", "graph-section-1").attr("width", area.sec.w).attr("height", area.sec.h).attr("transform", "translate(0, "+(area.sec.h + offset.sec.btw).toString()+")");

    function eventStr(c1, c2, d1, d2, cr1, cr2, isover) {
      var result = "";
      if (isover) {
        result += selectAllStr(["."+c1])+favStr("style", "fill", bright(cr1, -.3))+";";
        result += selectAllStr(["."+c2])+favStr("style", "fill", bright(cr2, -.3))+";";
        result += selectStr("."+d1)+favStr("style", "fill", bright(cr1, .2))+";";
        result += selectStr("."+d2)+favStr("style", "fill", bright(cr2, .2))+";";
        result += selectAllStr([".f-cap-out"])+favStr("style", "fill", bright(cr1, -.3))+";";
        result += selectAllStr([".m-cap-out"])+favStr("style", "fill", bright(cr2, -.3))+";";
        result += selectStr("."+d1+"-cap")+favStr("style", "fill", bright(cr1, .2))+";";
        result += selectStr("."+d2+"-cap")+favStr("style", "fill", bright(cr2, .2))+";";
        result += selectAllStr([".f-cap-in"])+favStr("style", "fill", color.bg)+";";
        result += selectAllStr([".m-cap-in"])+favStr("style", "fill", color.bg)+";";
      } else {
        result += selectAllStr(["."+c1])+favStr("style", "fill", cr1)+";";
        result += selectAllStr(["."+c2])+favStr("style", "fill", cr2)+";";
        result += selectStr("."+d1+"-cap")+favStr("style", "fill", color.bg)+";";
        result += selectStr("."+d2+"-cap")+favStr("style", "fill", color.bg)+";";
        result += selectAllStr([".f-cap-out"])+favStr("style", "fill", cr1)+";";
        result += selectAllStr([".m-cap-out"])+favStr("style", "fill", cr2)+";";
      }
      return result;
    }

    var max_ratio = 0;
    for (var i = 0; i < data.length; i++) {
      if (max_ratio < data.data[i]['m_ratio']) max_ratio = data.data[i]['m_ratio'];
      if (max_ratio < data.data[i]['f_ratio']) max_ratio = data.data[i]['f_ratio'];
    }
    sec0.append("text").attr("id", "graph-title-female").attr("x", 0).attr("y", area.text.font_big).text("여성").attr("fill", color.f).attr("font-size", area.text.font_big).attr("text-anchor", "start");
    sec1.append("text").attr("id", "graph-title-male").attr("x", 0).attr("y", area.sec.h - area.text.font_big*.1).text("남성").attr("fill", color.m).attr("font-size", area.text.font_big);
    for (var i = 0, xpos=0; i < data.length; i++) {
      var f_value = data.data[i]['f_ratio'] / max_ratio,
          m_value = data.data[i]['m_ratio'] / max_ratio,
          f_height = area.bar.h * f_value,
          m_height = area.bar.h * m_value,
          fypos = area.bar.h - f_height,
          mypos = 0,
          t_anchor = (xpos == 0 ? 'start' : (xpos == data.length ? 'end': 'middle')),
          t_pos_adj = (xpos == 0 ? 0 : offset.bar.btw/2),
          is_f_cap_in = (f_height > area.text.font_small + offset.bar.btw*2),
          is_m_cap_in = (m_height > area.text.font_small + offset.bar.btw*2),
          f_cap_y = (is_f_cap_in ? area.bar.h - offset.bar.btw : area.bar.h - f_height - offset.bar.btw),
          f_cap_c = (is_f_cap_in ? color.bg : color.f),
          m_cap_y = (is_m_cap_in ? offset.bar.btw + area.text.font_small : m_height + offset.bar.btw + area.text.font_small),
          m_cap_c = (is_m_cap_in ? color.bg : color.m),
          f_id = "graph-bar-f-"+i.toString(),
          m_id = "graph-bar-m-"+i.toString(),
          f_cap_out = (is_f_cap_in ? "f-cap-in" : "f-cap-out"),
          m_cap_out = (is_m_cap_in ? "m-cap-in" : "m-cap-out");

      sec0.append("rect").attr("x", xpos).attr("y", fypos).attr("width", area.bar.w).attr("height", f_height).style("fill", color.f).attr("rx", area.r).attr("ry", area.r)
          .attr("class", "hasAction graph-bar-f "+f_id)
          .attr("onmouseover", eventStr("graph-bar-f", "graph-bar-m", f_id, m_id, color.f, color.m, true))
          .attr("onmouseout", eventStr("graph-bar-f", "graph-bar-m", f_id, m_id, color.f, color.m, false));
      sec0.append("text").attr("x", xpos + area.bar.w / 2).attr("y", f_cap_y).style("fill", f_cap_c).attr("font-size", area.text.font_small).attr("text-anchor", "middle")
          .text(roundStr(data.data[i]['f_ratio']*100, 2)+"%").attr("class", "hasAction graph-bar-f-cap " + f_id + "-cap " + f_cap_out)
          .attr("onmouseover", eventStr("graph-bar-f", "graph-bar-m", f_id, m_id, color.f, color.m, true))
          .attr("onmouseout", eventStr("graph-bar-f", "graph-bar-m", f_id, m_id, color.f, color.m, false));
      sec1.append("rect").attr("x", xpos).attr("y", mypos).attr("width", area.bar.w).attr("height", m_height).style("fill", color.m).attr("rx", area.r).attr("ry", area.r)
          .attr("class", "hasAction graph-bar-m "+m_id)
          .attr("onmouseover", eventStr("graph-bar-f", "graph-bar-m", f_id, m_id, color.f, color.m, true))
          .attr("onmouseout", eventStr("graph-bar-f", "graph-bar-m", f_id, m_id, color.f, color.m, false));
      sec1.append("text").attr("x", xpos + area.bar.w / 2).attr("y", m_cap_y).style("fill", m_cap_c).attr("font-size", area.text.font_small).attr("text-anchor", "middle")
          .text(roundStr(data.data[i]['m_ratio']*100, 2)+"%").attr("class", "hasAction graph-bar-m-cap " + m_id + "-cap " + m_cap_out)
          .attr("onmouseover", eventStr("graph-bar-f", "graph-bar-m", f_id, m_id, color.f, color.m, true))
          .attr("onmouseout", eventStr("graph-bar-f", "graph-bar-m", f_id, m_id, color.f, color.m, false));
      seclg.append("text").attr("x", xpos - t_pos_adj).attr("y", area.text.font_small*0.9).attr("fill", color.b).attr("text-anchor", t_anchor).attr("font-size", area.text.font_small)
           .text((5*i).toString());
      xpos += area.bar.w + offset.bar.btw;
    }
}
