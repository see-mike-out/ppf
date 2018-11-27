
function printGraphEntire(both, female, male, gp, isFade) {
  //layout
  var w = $(gp).width(),
      h = window.innerHeight - $(gp).offset().top - 10;
  var size = w,
      legend_place = "left",
      legend_width = 0,
      legend_height = 0,
      legend_between_offset = 20,
      legend_text_size = 14,
      legend_bar_length = 30,
      n_legend = 3,
      legend_left_offset,
      legend_top_offset;

  if (w - h >= 180) {
    size = h;
    legend_width = 180;
    legend_left_offset = size + 30;
    legend_top_offset = (size - legend_text_size * n_legend - legend_between_offset * (n_legend-1))/2;
  } else {
    size = h;
    legend_place = "bottom";
    legend_height = legend_text_size * n_legend + legend_between_offset * (n_legend-1) + 30;
    legend_left_offset = (size - legend_bar_length - legend_between_offset - legend_text_size * 3 ) / 2;
    legend_top_offset = size + 30;
  }

  var bar_length = (size / 2) * 0.87;
  var mid_point = [size / 2, size / 2];

  //plot points
  var p_both = [],
      p_female = [],
      p_male = [];
  var p_line20 = [],
      p_line40 = [],
      p_line60 = [],
      p_line80 = [],
      p_line100 = [];

  var np = both.length;
  for (var i = 0; i < np; i++) {
    var temp = [mid_point[0], mid_point[1]+barScale(both[i], 100, bar_length)];
    p_both[i] = rotate(mid_point, temp, 180+60*i);
    temp = [mid_point[0], mid_point[1]+barScale(female[i], 100, bar_length)];
    p_female[i] = rotate(mid_point, temp, 180+60*i);
    temp = [mid_point[0], mid_point[1]+barScale(male[i], 100, bar_length)];
    p_male[i] = rotate(mid_point, temp, 180+60*i);
    temp = [mid_point[0], mid_point[1]+barScale(20, 100, bar_length)];
    p_line20[i] = rotate(mid_point, temp, 180+60*i);
    temp = [mid_point[0], mid_point[1]+barScale(40, 100, bar_length)];
    p_line40[i] = rotate(mid_point, temp, 180+60*i);
    temp = [mid_point[0], mid_point[1]+barScale(60, 100, bar_length)];
    p_line60[i] = rotate(mid_point, temp, 180+60*i);
    temp = [mid_point[0], mid_point[1]+barScale(80, 100, bar_length)];
    p_line80[i] = rotate(mid_point, temp, 180+60*i);
    temp = [mid_point[0], mid_point[1]+barScale(100, 100, bar_length)];
    p_line100[i] = rotate(mid_point, temp, 180+60*i);
  }
  var graph = $("<canvas></canvas>").attr("width", size+legend_width).attr("height", size+legend_height);
  var context = graph.get(0).getContext("2d");

  //background
  drawLine(context, mid_point, p_line100[0], 0.5, "#444");
  drawLine(context, mid_point, p_line100[1], 0.5, "#444");
  drawLine(context, mid_point, p_line100[2], 0.5, "#444");
  drawLine(context, mid_point, p_line100[3], 0.5, "#444");
  drawLine(context, mid_point, p_line100[4], 0.5, "#444");
  drawLine(context, mid_point, p_line100[5], 0.5, "#444");

  drawPolygon(context, p_line20, 1, "#666");
  drawPolygon(context, p_line40, 1, "#666");
  drawPolygon(context, p_line60, 1, "#666");
  drawPolygon(context, p_line80, 1, "#666");
  drawPolygon(context, p_line100, 1, "#666");

  var color_whole = "#ffffff",
      color_female = "#00ff00",
      color_male = "#ff0000";
  drawPolygon(context, p_both, 1, color_whole);
  drawPolygon(context, p_female, 1, color_female);
  drawPolygon(context, p_male, 1, color_male);

  //index
  drawText(context, '14px', 'Noto Sans KR', '#eee', 'center', '국적', p_line100[0][0], p_line100[0][1]-10);
  drawText(context, '14px', 'Noto Sans KR', '#eee', 'left', '장애', p_line100[1][0]+5, p_line100[1][1]-8.65);
  drawText(context, '14px', 'Noto Sans KR', '#eee', 'left', '성별', p_line100[2][0]+5, p_line100[2][1]+8.65+10);
  drawText(context, '14px', 'Noto Sans KR', '#eee', 'center', '주거', p_line100[3][0], p_line100[3][1]+22);
  drawText(context, '14px', 'Noto Sans KR', '#eee', 'right', '직종', p_line100[4][0]-5, p_line100[4][1]+8.65+10);
  drawText(context, '14px', 'Noto Sans KR', '#eee', 'right', '연령', p_line100[5][0]-5, p_line100[5][1]-8.65);

  //legend
  var legend_bar_iter = legend_top_offset + legend_text_size / 2,
      legend_text_iter = legend_top_offset + legend_text_size * 0.8;
  drawLine(context,
    [legend_left_offset, legend_bar_iter],
    [legend_left_offset + legend_bar_length, legend_bar_iter],
    1, color_whole);
  drawText(context, px(legend_text_size), 'Noto Sans KR', '#eee', 'left', '전체',
    legend_left_offset + legend_bar_length + legend_between_offset,
    legend_text_iter);
  drawLine(context,
    [legend_left_offset, legend_bar_iter + legend_between_offset + legend_text_size],
    [legend_left_offset + legend_bar_length, legend_bar_iter + legend_between_offset + legend_text_size],
    1, color_female);
  drawText(context, px(legend_text_size), 'Noto Sans KR', '#eee', 'left', '여성',
    legend_left_offset + legend_bar_length + legend_between_offset,
    legend_text_iter + legend_between_offset + legend_text_size);
  drawLine(context,
    [legend_left_offset, legend_bar_iter + legend_between_offset * 2 + legend_text_size * 2],
    [legend_left_offset + legend_bar_length, legend_bar_iter + legend_between_offset * 2 + legend_text_size * 2],
    1, color_male);
  drawText(context, px(legend_text_size), 'Noto Sans KR', '#eee', 'left', '남성',
    legend_left_offset + legend_bar_length + legend_between_offset,
    legend_text_iter + legend_between_offset * 2 + legend_text_size * 2);
  //event handler

  //draw
  if (isFade) fadeItem(gp, graph);
  else showItem(gp, graph);
}

function drawPolygon(context, points, width, color) {
  var np = points.length;
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  for (var i = 1; i < np; i++) {
    context.lineTo(points[i][0], points[i][1]);
  }
  context.lineWidth = width;
  context.lineJoin = 'round';
  context.strokeStyle = color;
  context.closePath();
  context.stroke();
}

function drawLine(context, start, end, width, color) {
  context.beginPath();
  context.moveTo(start[0], start[1]);
  context.lineTo(end[0], end[1]);
  context.lineWidth = width;
  context.lineJoin = 'round';
  context.strokeStyle = color;
  context.closePath();
  context.stroke();
}

function drawText (context, size, family, color, align, text, x, y) {
  context.font = size + ' ' + family;
  context.fillStyle = color;
  context.textAlign = align;
  context.fillText(text, x, y);
}

function rad(deg) {
	return deg / 180 * Math.PI;
}

function rotate(origin, point, degree) {
	moved = [point[0] - origin[0], point[1] - origin[1]];
    deg_rad = rad(degree);
    sin = Math.sin(deg_rad);
    cos = Math.cos(deg_rad);
    rtt_x = cos * moved[0] - sin * moved[1];
    rtt_y = sin * moved[0] + cos * moved[1];
    rtt = [rtt_x + origin[0], rtt_y + origin[1]];
    return rtt
}

function barScale(v, mx, bl) {
  return v/mx * bl;
}
