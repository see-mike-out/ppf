//entire
var size_of_metro = Object.keys(table_metro[table_fields[0]]).length - 5,
    size_of_regional = Object.keys(table_regional[table_fields[0]]).length - 5;

function printTextEntire(both, female, male, xp) {
  var isNational = (onarea == '전국' ? true : false),
      area_arr = onarea.split(' '),
      area_final = area_arr[area_arr.length - 1],
      isMetro = (area_arr.length == 1 ? true: false);
  function regionMark() {
    if (isNational) return "전국적으로";
    else return koSuffix(onarea, "gen");
  }
  function diversityEntire() {
    var output = "종합 다양도는 "+koSuffix(roundStr(both[6], 2), 'ad') + " " +
                 threeLevelGrading(both[6], get_diversity_summary(onarea, 'entire', 'both', '평균'), get_diversity_summary(onarea, 'entire', 'both', '표준편차'), 'adj') +
                 " 정도의 수준이다.";
    if (isNational) {
      return output;
    } else {
      output += " 한편, " + (isMetro ? "시도" : "시군구") + " 단위에서 ";
      var max_area = get_diversity_summary_area(onarea, 'entire', 'both', '최댓값'),
          max_value = roundStr(get_diversity_summary(onarea, 'entire', 'both', '최댓값'), 2),
          min_area = get_diversity_summary_area(onarea, 'entire', 'both', '최솟값'),
          min_value = roundStr(get_diversity_summary(onarea, 'entire', 'both', '최솟값'), 2);
      output += "최대는 " + koSuffix(max_area, 'nom') + " " + koSuffix(max_value, 'ad') + ", " +
                "최소는 " + koSuffix(min_area, 'nom') + " " + koSuffix(min_value, 'ad') + " 나타났다.";
      return output
    }
  }
  function genderCompare() {
    var output = "종합 다양도에서 ",
        f_value = female[6],
        m_value = male[6],
        cmp = compareGrading(f_value, m_value, get_diversity_summary(onarea, 'entire', 'both', '표준편차'), (isMetro ? size_of_metro : size_of_regional));
    output += "여성이 " + roundStr(f_value, 2) + ", 남성이 " + koSuffix(roundStr(m_value, 2), 'ad');
    if (cmp == 0) output += " 비슷하게 나타났다."
    else {
      output += " 여성이 남성보다 " + (cmp == 1 ? "높게" : "낮게") + " 나타났다.";
    }
    return output;
  }
  function textNationality() {
    var output = "국적 부분에서는 ";
        f_value = female[0],
        m_value = male[0],
        cmp = compareGrading(f_value, m_value, get_diversity_summary(onarea, 'nationality', 'both', '표준편차'), (isMetro ? size_of_metro : size_of_regional));
    output += "여성이 " + koSuffix(roundStr(f_value, 2), 'ad');
    if (cmp == 0 ) output += " 남성의 " + koSuffix(roundStr(m_value, 2), 'cum') + " 비슷하게";
    else {
      output += " 남성의 " + koSuffix(roundStr(m_value, 2), 'ins') + " 비해 "  + (cmp == 1 ? "높게" : "낮게");
    }
    output += " 나타났다.";
    return output;
  }
  function textDisability() {
    var output = "장애 부분에서는 ";
        f_value = female[1],
        m_value = male[1],
        cmp = compareGrading(f_value, m_value, get_diversity_summary(onarea, 'disability', 'both', '표준편차'), (isMetro ? size_of_metro : size_of_regional));
    output += "여성이 " + koSuffix(roundStr(f_value, 2), 'ad') + " 나타나";
    if (cmp == 0 ) output += " 남성의 " + koSuffix(roundStr(m_value, 2), 'cum') + " 비슷했";
    else {
      output += " 남성의 " + koSuffix(roundStr(m_value, 2), 'ins') + " 비해 "  + (cmp == 1 ? "높았" : "낮았");
    }
    output += "다.";
    return output;
  }
  function textGender() {
    var output = "성별의 다양도는 ",
        b_value = both[2];
    output += koSuffix(roundStr(b_value, 2), 'ad') + " 나타나";
    output += " 비교적 " + symmetryGrading(b_value, 100, 10, 'balance', 'adj')+" 모습을 보였다.";
    return output;
  }
  function textResidence() {
    var output = "주거의 경우, ",
        b_value = both[3];
    output += koSuffix(roundStr(b_value, 2), 'ad');
    output += " 대체로 ";
    output += threeLevelGrading(b_value, get_diversity_summary(onarea, 'residence', 'both', '평균'), get_diversity_summary(onarea, 'residence', 'both', '표준편차'), 'adj')
    output += " 수준이었다."
    return output;
  }
  function textIndustry() {
    var output = "직종에서는 ";
        f_value = female[4],
        m_value = male[4],
        cmp = compareGrading(f_value, m_value, get_diversity_summary(onarea, 'industry', 'both', '표준편차'), (isMetro ? size_of_metro : size_of_regional));
    output += "남성이 " + roundStr(m_value, 2) + ", ";
    output += "여성이 " + koSuffix(roundStr(f_value, 2), 'ad') + " ";
    output += (cmp == 0 ? "" : "비") + "대칭적이었다."
    return output;
  }
  function textAge() {
    var output = "연령의 다양도는 ";
        f_value = female[5],
        m_value = male[5],
        cmp = compareGrading(f_value, m_value, get_diversity_summary(onarea, 'age', 'both', '표준편차'), (isMetro ? size_of_metro : size_of_regional));
    output += "남성이 " + roundStr(m_value, 2) + ", ";
    output += "여성이 " + koSuffix(roundStr(f_value, 2), 'ad') + " ";
    if (cmp == 0 ) output += "남성과 여성이 비슷했다.";
    else {
      output += "남성에 비해 여성이 "  + (cmp == 1 ? "높았" : "낮았") + "다.";
    }
    return output;
  }

  var result = regionMark() + " ";
  result += diversityEntire() + " ";
  result += genderCompare() + " ";
  result += "각 부분을 개괄적으로 살펴보면, " + textNationality() + " ";
  result += textDisability() + " ";
  result += textGender() + " ";
  result += textResidence() + " ";
  result += textIndustry() + " ";
  result += textAge() + " ";
  $(xp).text(result);
}

function printTextNationality(both, female, male, xp) {
  var isNational = (onarea == '전국' ? true : false),
      area_arr = onarea.split(' '),
      area_final = area_arr[area_arr.length - 1],
      isMetro = (area_arr.length == 1 ? true: false);

  var f_ko = on_sub.dtset[onarea]['female']['data']['한국']['count'],
      m_ko = on_sub.dtset[onarea]['male']['data']['한국']['count'],
      b_ko = on_sub.dtset[onarea]['both']['data']['한국']['count'],
      f_fo = on_sub.dtset[onarea]['female']['data']['외국인']['count'],
      m_fo = on_sub.dtset[onarea]['male']['data']['외국인']['count'],
      b_fo = on_sub.dtset[onarea]['both']['data']['외국인']['count'],
      f_total = f_ko + f_fo,
      m_total = m_ko + m_fo,
      b_total = b_ko + b_fo;
  //country!
  function nationalityAnalyze(t1, t2, b) {
    var out = {
          top_sum_ratio: 0,
          top_country_list: [],
          top_female_list: [],
          top_male_list: [],
          top_both_list: [],
          bottom_both_list: []
        };
    for (var i = 0, j = 0; i < t2; i++) {
      var k = both.data[i]['name'];
      if (j < t1 & k != '한국' & k != '외국인') {
        out.top_country_list.push(k);
        out.top_sum_ratio += both.data[i]['ratio'];
        j++;
        var f_count = on_sub.dtset[onarea]['female']['data'][k]['count'],
            m_count = on_sub.dtset[onarea]['male']['data'][k]['count'],
            b_count = on_sub.dtset[onarea]['both']['data'][k]['count'],
            fmcmp = compareProportion(f_count, f_total, m_count, m_total)
        if (fmcmp == 1) out.top_female_list.push(k);
        else if (fmcmp == -1) out.top_male_list.push(k);
        else out.top_both_list.push(k);
      }
    }
    for (var i = both.length; i > 0; i--) {
      var k = both.data[i-1]['name'];
      if (on_sub.dtset['전국']['both']['data'][k]['count'] <= b) out.bottom_both_list.push(k);
    }
    return out;
  }

  function regionMark() {
    if (isNational) return "전국의";
    else return koSuffix(onarea, "gen");
  }
  function textDiversity() {
    var f_value = get_diversity(onarea, on_tab, 'female'),
        m_value = get_diversity(onarea, on_tab, 'male'),
        b_value = get_diversity(onarea, on_tab, 'both'),
        f_grade = threeLevelGrading(f_value, get_diversity_summary(onarea, on_tab, 'female', '평균'), get_diversity_summary(onarea, on_tab, 'female', '표준편차'), 'number'),
        m_grade = threeLevelGrading(m_value, get_diversity_summary(onarea, on_tab, 'male', '평균'), get_diversity_summary(onarea, on_tab, 'male', '표준편차'), 'number'),
        b_grade = threeLevelGrading(b_value, get_diversity_summary(onarea, on_tab, 'both', '평균'), get_diversity_summary(onarea, on_tab, 'both', '표준편차'), 'number'),
        grade = f_grade + m_grade + b_grade;

    var output = "국적 다양도는 ";
    output += "여성이 " + roundStr(f_value, 2) + ", " + "남성이 " + roundStr(m_value, 2) + "이고, " + "전체적으로 " + koSuffix(roundStr(b_value, 2), 'ad') + " ";
    output += "전반적으로 " + (grade >= 2 ? "높은" : (grade <= -2 ? "낮은" : "보통")) + " 수준이다.";

    return output;
  }
  function textForeigners() {
    var output = "";
    output += (isNational ? "전국적으로" : koSuffix(koSuffix(onarea, "ins"), "foc") + " 전체적으로") + " ";
    output += roundStr(on_sub.dtset[onarea]['both']['data']['외국인']['count'], 0) + "명의 등록 외국인이 " + reference_year['nationality'].toString() + "년 기준 거주하고 있었으며, ";
    output += "이는 " + (isNational ? "전국" : "지역" ) + " 인구의 " + roundStr(on_sub.dtset[onarea]['both']['data']['외국인']['ratio']*100, 2) + "%였다.";
    return output;
  }
  function textGenderCompare() {
    var output = "";
    var cmp = compareProportion(f_fo, f_total, m_fo, m_total);
    output += "여성 외국인 수는 " + roundStr(f_fo, 0) + "명이고, ";
    output += "남성 외국인 수는 " + roundStr(m_fo, 0) + "명으로, ";
    output += (cmp == 0 ? "그 비율은 비슷했다" : "여성 외국인이 " + (cmp == 1 ? "더 많은" : "더 적은") + " 비율로 거주하고 있었다.");

    return output;
  }
  function textRankAnalyze() {
      var analyze = nationalityAnalyze(5, 30, 30),
          output = "";
      if (analyze.top_country_list.length > 0) {
        output += "전체적으로 "
        for (var i = 0; i < analyze.top_country_list.length; i++) {
          var name = analyze.top_country_list[i];
          if (i == 0 & i == analyze.top_country_list.length - 1) output += name;
          else if (i == 0) output += name;
          else if (i == analyze.top_country_list.length - 1) output += ", " + name;
          else output += ", " + name;
        }
        output += " 국적의 외국인이 전체 외국인의 " + roundStr(analyze.top_sum_ratio/(b_fo/b_total)*100, 2) + "%로 많은 비중을 차지했다."
      }
      if (analyze.top_female_list.length > 0 ){
        output += " 여성의 경우에는 "
        var n_to_print =  Math.min(analyze.top_female_list.length, 3);
        for (var i = 0; i < n_to_print; i++) {
          var name = analyze.top_female_list[i];
          if (i == 0 & i == n_to_print - 1) output += name;
          else if (i == 0) output += name;
          else if (i == n_to_print - 1) output += ", " + name;
          else output += ", " + name;
        }
        output += " 국적을 가진 외국인이"
      }
      if (analyze.top_male_list.length > 0 ){
        output += " 남성의 경우에는 "
        var n_to_print =  Math.min(analyze.top_male_list.length, 3);
        for (var i = 0; i < n_to_print; i++) {
          var name = analyze.top_male_list[i];
          if (i == 0 & i == n_to_print - 1) output += name;
          else if (i == 0) output += name;
          else if (i == n_to_print - 1) output += ", " + name;
          else output += ", " + name;
        }
        output += " 국적을 가진 외국인이"
      }
      if (analyze.top_female_list.length > 0 | analyze.top_male_list.length > 0) output += " 상대적으로 비율이 더 높은 특징이 있었다."

      if (analyze.bottom_both_list.length > 0 & !isNational) {
        output += " 한편, ";
        for (var i = 0; i < analyze.bottom_both_list.length ; i++) {
          var name = analyze.bottom_both_list[i];
          if (i == 0 & i == n_to_print - 1) output += name;
          else if (i == 0) output += name;
          else if (i == n_to_print - 1) output += ", " + name;
          else output += ", " + name;
        }
        output += " 등 국적을 가진 외국인들도 거주하고 있었다."
      }
    return output;
  }
  var result = regionMark() + " ";
  result += textDiversity() + " ";
  result += textForeigners() + " ";
  result += textGenderCompare() + " ";
  result += textRankAnalyze() + " ";
  $(xp).text(result);
}

function printTextDisability(xp) {
  var isNational = (onarea == '전국' ? true : false),
      area_arr = onarea.split(' '),
      area_final = area_arr[area_arr.length - 1],
      isMetro = (area_arr.length == 1 ? true: false);
  var f_non = on_sub.dtset[onarea]['female']['data']['non_disabled']['count'],
      m_non = on_sub.dtset[onarea]['male']['data']['non_disabled']['count'],
      b_non = on_sub.dtset[onarea]['both']['data']['non_disabled']['count'],
      f_dis = on_sub.dtset[onarea]['female']['data']['disabled']['count'],
      m_dis = on_sub.dtset[onarea]['male']['data']['disabled']['count'],
      b_dis = on_sub.dtset[onarea]['both']['data']['disabled']['count'],
      f_total = f_non + f_dis,
      m_total = m_non + m_dis,
      b_total = b_non + b_dis;
  function regionMark() {
    if (isNational) return "전국의";
    else return koSuffix(onarea, "gen");
  }
  function textDiversity() {
    var f_value = get_diversity(onarea, on_tab, 'female'),
        m_value = get_diversity(onarea, on_tab, 'male'),
        b_value = get_diversity(onarea, on_tab, 'both'),
        f_grade = threeLevelGrading(f_value, get_diversity_summary(onarea, on_tab, 'female', '평균'), get_diversity_summary(onarea, on_tab, 'female', '표준편차'), 'number'),
        m_grade = threeLevelGrading(m_value, get_diversity_summary(onarea, on_tab, 'male', '평균'), get_diversity_summary(onarea, on_tab, 'male', '표준편차'), 'number'),
        b_grade = threeLevelGrading(b_value, get_diversity_summary(onarea, on_tab, 'both', '평균'), get_diversity_summary(onarea, on_tab, 'both', '표준편차'), 'number'),
        grade = f_grade + m_grade + b_grade;

    var output = "장애 부분 다양도는 ";
    output += "전체 성별에서 " + koSuffix(roundStr(b_value, 2), 'pred_past') + "고 ";
    output += "여성이 " + roundStr(f_value, 2) + ", " + "남성이 " + koSuffix(roundStr(m_value, 2), 'pred_past') + "으며, ";
    output += "전반적으로 " + (grade >= 2 ? "높은" : (grade <= -2 ? "낮은" : "보통")) + " 수준이다.";

    return output;
  }
  function textPopulation() {
    var output = "";
    output += (isNational ? "전국적으로" : koSuffix(koSuffix(onarea, "ins"), "foc") + " 전체적으로") + " ";
    output += reference_year['disability'].toString() + "년 기준 " +roundStr(on_sub.dtset[onarea]['both']['data']['disabled']['count'], 0) + "명의 등록 장애인이 거주하고 있었고";
    output += "이는 " + (isNational ? "전국" : "지역" ) + " 인구의 " + roundStr(on_sub.dtset[onarea]['both']['data']['disabled']['ratio']*100, 2) + "%였다.";
    return output;
  }
  function textGenderCompare() {
    var output = "이때 ";
    var cmp = compareProportion(f_dis, f_total, m_dis, m_total);
    output += "여성 장애인 수는 " + roundStr(f_dis, 0) + "(" + roundStr(on_sub.dtset[onarea]['female']['data']['disabled']['ratio']*100, 2) + "%)명이고, ";
    output += "남성 장애인 수는 " + roundStr(m_dis, 0) + "(" + roundStr(on_sub.dtset[onarea]['male']['data']['disabled']['ratio']*100, 2) + "%)명으로, ";
    output += (cmp == 0 ? "그 비율은 비슷했다" : "여성 장애인이 " + (cmp == 1 ? "더 많은" : "더 적은") + " 비율로 거주하고 있었다.");

    return output;
  }
  var result = regionMark() + " ";
  result += textDiversity() + " ";
  result += textPopulation() + " ";
  result += textGenderCompare() + " ";
  $(xp).text(result);
}

function printTextGender(xp) {
  var isNational = (onarea == '전국' ? true : false),
      area_arr = onarea.split(' '),
      area_final = area_arr[area_arr.length - 1],
      isMetro = (area_arr.length == 1 ? true: false);
  var f_count = on_sub.dtset[onarea]['data']['female']['count'],
      m_count = on_sub.dtset[onarea]['data']['male']['count'],
      total = f_count + m_count,
      f_ratio = f_count / total,
      m_ratio = m_count / total;
  function regionMark() {
    if (isNational) return "전국의";
    else return koSuffix(onarea, "gen");
  }
  function textDiversity() {
    var b_value = get_diversity(onarea, on_tab, 'both'),
        grade = threeLevelGrading(b_value, get_diversity_summary(onarea, on_tab, 'both', '평균'), get_diversity_summary(onarea, on_tab, 'both', '표준편차'), 'number');

    var output = "성별 다양도는 ";
    output += koSuffix(roundStr(b_value, 2), 'ad') + " ";
    output += (grade >= 1 ? "높은" : (grade <= -1 ? "낮은" : "보통")) + " 수준이다.";

    return output;
  }
  function textGenderCompare() {
    var output = (isNational ? "전국적으로" : koSuffix(koSuffix(onarea, "ins"), "foc") + " 전체적으로") + " ";
    var cmp = testProportion(f_count, total, 0.5);
    output += "여성 인구수가 " + roundStr(f_count, 0) + "(" + roundStr(f_ratio*100, 2) + "%)명이었고, ";
    output += "남성 인구수가 " + roundStr(m_count, 0) + "(" + roundStr(m_ratio*100, 2) + "%)명으로, ";
    output += (cmp == 0 ? "여성과 남성 인구의 비율이 비슷했다" : "남성에 비해 여성 인구가 더 " + (cmp == 1 ? "많았" : "적었") + "다.");

    return output;
  }
  var result = regionMark() + " ";
  result += textDiversity() + " ";
  result += textGenderCompare() + " ";
  $(xp).text(result);
}

function printTextResidence(xp) {
  var isNational = (onarea == '전국' ? true : false),
      area_arr = onarea.split(' '),
      area_final = area_arr[area_arr.length - 1],
      isMetro = (area_arr.length == 1 ? true: false);

  function regionMark() {
    if (isNational) return "전국의";
    else return koSuffix(onarea, "gen");
  }
  function textDiversity() {
    var b_value = get_diversity(onarea, on_tab, 'both'),
        grade = threeLevelGrading(b_value, get_diversity_summary(onarea, on_tab, 'both', '평균'), get_diversity_summary(onarea, on_tab, 'both', '표준편차'), 'number');

    var output = "주거 다양도는 ";
    output += koSuffix(roundStr(b_value, 2), 'ad') + " ";
    output += (grade >= 1 ? "높은" : (grade <= -1 ? "낮은" : "보통")) + " 수준이다.";

    return output;
  }

  function textAnalyze() {
    var ratio = {
          self_own: on_sub.dtset[onarea]['data']['self_own']['ratio'],
          not_self_own: 1 - on_sub.dtset[onarea]['data']['self_own']['ratio'],
          lease: on_sub.dtset[onarea]['data']['lease']['ratio'],
          rent: on_sub.dtset[onarea]['data']['rent_deposit']['ratio'] + on_sub.dtset[onarea]['data']['rent_no_deposit']['ratio'] + on_sub.dtset[onarea]['data']['rent_room']['ratio'],
          unpaid: on_sub.dtset[onarea]['data']['unpaid']['ratio'],
          weak: on_sub.dtset[onarea]['data']['rent_no_deposit']['ratio'] + on_sub.dtset[onarea]['data']['rent_room']['ratio'],
        },
        count = {
          total: on_sub.dtset[onarea]['total'],
          self_own: on_sub.dtset[onarea]['data']['self_own']['count'],
          not_self_own: 1 - on_sub.dtset[onarea]['data']['self_own']['count'],
          lease: on_sub.dtset[onarea]['data']['lease']['count'],
          rent: on_sub.dtset[onarea]['data']['rent_deposit']['count'] + on_sub.dtset[onarea]['data']['rent_no_deposit']['count'] + on_sub.dtset[onarea]['data']['rent_room']['count'],
          unpaid: on_sub.dtset[onarea]['data']['unpaid']['count'],
          weak: on_sub.dtset[onarea]['data']['rent_no_deposit']['count'] + on_sub.dtset[onarea]['data']['rent_room']['count'],
        };
    var grade = {
          unpaid_over_nation: testProportion(count.unpaid, count.total, on_sub.dtset['전국']['data']['unpaid']['ratio']),
          weak1: (ratio.weak < .01 ? 1 : 0),
          weak2: (ratio.weak < .02 ? 1 : 0),
          weak3: (ratio.weak < .03 ? 1 : 0),
          weak_over_nation: testProportion(count.weak, count.total, on_sub.dtset['전국']['data']['rent_no_deposit']['ratio']+on_sub.dtset['전국']['data']['rent_room']['ratio'])
        },
        hasExtraUnpaid = (grade.unpaid_over_nation == 1),
        whichExtraWeak = (grade.weak_over_nation == 1 ? 4 : (grade.weak1 == 1 ? 1 : (grade.weak2 == 1 ? 2 : (grade.weak3 == 1 ? 3 : 5)))),
        hasExtra = hasExtraUnpaid | (whichExtraWeak < 5);
    var output = (isNational ? "전국적으로" : koSuffix(koSuffix(onarea, "ins"), "foc") + " 전체적으로") + " ";
    output += reference_year['residence'].toString() + "년 기준 " + "자기 주택을 소유한 가구는 " + roundStr(ratio.self_own * 100, 2) + "%로, ";
    if (testProportion(count.self_own, count.total, 0.5) != 0) {
      output += "자기 주택을 " + (ratio.self_own > 0.5 ? "소유한" : "소유하지 않은") + " 가구가 전체적으로 더 많았다. ";
    }
    output += "자기 소유 주택이 없는 가구 중 전세 가구는 " + roundStr(ratio.lease * 100, 2) + "%였으며, ";
    output += "월 단위로 세를 지불하는 가구는 " + roundStr(ratio.rent * 100, 2) + "%였다. ";
    if (hasExtra) {
      output += "한편,";
      if (hasExtraUnpaid) {
        output += " 관사나, 사택 등 무상 주택 가구 비율이 " + roundStr(ratio.unpaid * 100, 2) + "%로 전국 평균보다 높았"
        if (!isMetro) output += "는데, 이는 이 지역이 군사지역이거나 혹은 산업단지이기 때문일 수 있다.";
        else output += "다. "
      }
      if (whichExtraWeak <= 4) {
        output += " 사글세나 보증금이 없는 월세 등 상대적으로 취약한 가구 비율이 " + roundStr(ratio.weak * 100, 2) + "%로 ";
        switch (whichExtraWeak) {
          case 4:
            output += "전국 평균보다 높았다.";
            break;
          case 3:
            output += "3% 미만이었다.";
            break;
          case 2:
            output += "2%보다 적었다.";
            break;
          case 1:
            output += "1%보다 적었다..";
            break;
        }
      }
    }
    return output;
  }

  var result = regionMark() + " ";
  result += textDiversity() + " ";
  result += textAnalyze() + " ";
  $(xp).text(result);
}

function printTextIndustry(female, male, both, xp) {
  var isNational = (onarea == '전국' ? true : false),
      area_arr = onarea.split(' '),
      area_final = area_arr[area_arr.length - 1],
      isMetro = (area_arr.length == 1 ? true: false);

  function regionMark() {
    if (isNational) return "전국의";
    else return koSuffix(onarea, "gen");
  }
  function textDiversity() {
    var f_value = get_diversity(onarea, on_tab, 'female'),
        m_value = get_diversity(onarea, on_tab, 'male'),
        b_value = get_diversity(onarea, on_tab, 'both'),
        f_grade = threeLevelGrading(f_value, get_diversity_summary(onarea, on_tab, 'female', '평균'), get_diversity_summary(onarea, on_tab, 'female', '표준편차'), 'number'),
        m_grade = threeLevelGrading(m_value, get_diversity_summary(onarea, on_tab, 'male', '평균'), get_diversity_summary(onarea, on_tab, 'male', '표준편차'), 'number'),
        b_grade = threeLevelGrading(b_value, get_diversity_summary(onarea, on_tab, 'both', '평균'), get_diversity_summary(onarea, on_tab, 'both', '표준편차'), 'number'),
        grade = f_grade + m_grade + b_grade,
        is_mf_diff = compareGrading(f_value, m_value, get_diversity_summary(onarea, on_tab, 'female', '표준편차'), 'number');

    var output = "직종 다양도는 ";
    output += "전체 성별에서 " + koSuffix(roundStr(b_value, 2), 'pred_past') + "고 ";
    output += "여성이 " + roundStr(f_value, 2) + ", " + "남성이 " + koSuffix(roundStr(m_value, 2), 'ad') + " ";
    output += "전반적으로 " + (grade >= 2 ? "높은" : (grade <= -2 ? "낮은" : "보통")) + " 수준";
    if (is_mf_diff != 0) {
      output += "이었고, ";
      output += (is_mf_diff == 1 ? "남성보다 여성의 " : "여성보다 남성의 ") + "직업적 다양도가 더 높았다."
    } else {
      output += "이다."
    }
    return output;
  }
  function textAnalyze() {
    var dt = on_sub.dtset[onarea],
        dt_b = dt['both']['data'],
        dt_f = dt['female']['data'],
        dt_m = dt['male']['data'];
    var keys = Object.keys(dt_b);
    var value_f = [], value_b = [], value_m = [];
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      value_f[i] = dt_f[k]['count'];
      value_m[i] = dt_m[k]['count'];
      value_b[i] = dt_b[k]['count'];
    }
    var chiResult = testChiSquareByGender(value_f, value_m, value_b),
        df_size = 5,
        output = "";
    if (chiResult == 'hetero') {
      var top_b = both.data.slice(0, Math.round(df_size*.4, 0)), top_f = female.data.slice(0, df_size), top_m = male.data.slice(0, df_size)
          special_f = [], special_m = [];
      for (var i = 0; i < df_size; i++) {
        if (dt_m[top_f[i].name]['rank'] > Math.round(df_size*.6, 0) & top_f[i].name != 'etc') special_f.push(top_f[i].name);
        if (dt_f[top_m[i].name]['rank'] > Math.round(df_size*.6, 0) & top_m[i].name != 'etc') special_m.push(top_m[i].name);
      }

      output += "여성과 남성의 직업적 분포에는 차이가 있었는데, 대체로는 ";
      for (var i = 0; i < top_b.length; i++) {
        if (i > 0) output += ", ";
        output += rownames[top_b[i].name] + "(" + dt_b[top_b[i].name]['rank'] + "위, " + roundStr(dt_b[top_b[i].name]['ratio'] * 100, 2) + "%)";
      }
      output += " 직종의 비율이 높았고, ";
      output += "여성의 경우 ";
      for (var i = 0; i < special_f.length; i++) {
        if (i > 0) output += ", ";
        output += rownames[special_f[i]] + "(" + dt_f[special_f[i]]['rank'] + "위, " + roundStr(dt_f[special_f[i]]['ratio'] * 100, 2) + "%)";
      }
      output += " 등 산업군의 비율이, ";
      output += "남성의 경우 "
      for (var i = 0; i < special_m.length; i++) {
        if (i > 0) output += ", ";
        output += rownames[special_m[i]] + "(" + dt_m[special_m[i]]['rank'] + "위, " + roundStr(dt_m[special_m[i]]['ratio'] * 100, 2) + "%)";
      }
      output += " 등 산업군의 순위가 상대적으로 높았다.";
      return output;
    } else {
      return "";
    }
  }
  var result = regionMark() + " ";
  result += textDiversity() + " ";
  result += textAnalyze() + " ";
  $(xp).text(result);
}

function printTextAge(data, xp) {
  var isNational = (onarea == '전국' ? true : false),
      area_arr = onarea.split(' '),
      area_final = area_arr[area_arr.length - 1],
      isMetro = (area_arr.length == 1 ? true: false);

  function regionMark() {
    if (isNational) return "전국의";
    else return koSuffix(onarea, "gen");
  }
  function textDiversity() {
    var f_value = get_diversity(onarea, on_tab, 'female'),
        m_value = get_diversity(onarea, on_tab, 'male'),
        b_value = get_diversity(onarea, on_tab, 'both'),
        f_grade = threeLevelGrading(f_value, get_diversity_summary(onarea, on_tab, 'female', '평균'), get_diversity_summary(onarea, on_tab, 'female', '표준편차'), 'number'),
        m_grade = threeLevelGrading(m_value, get_diversity_summary(onarea, on_tab, 'male', '평균'), get_diversity_summary(onarea, on_tab, 'male', '표준편차'), 'number'),
        b_grade = threeLevelGrading(b_value, get_diversity_summary(onarea, on_tab, 'both', '평균'), get_diversity_summary(onarea, on_tab, 'both', '표준편차'), 'number'),
        b_grade2 = twoLevelGrading(b_value, get_diversity_summary(onarea, on_tab, 'both', '평균'), get_diversity_summary(onarea, on_tab, 'both', '표준편차'), 'number'),
        grade = f_grade + m_grade + b_grade,
        is_mf_diff = compareGrading(f_value, m_value, get_diversity_summary(onarea, on_tab, 'female', '표준편차'), 'number');

    var output = "연령대별 인구 분포는 " + (b_grade2 < 0 ? "상대적으로 비대칭적인" : "비교적 고른") + " 분포를 보인다. "
    output += "연령 다양도를 보면, ";
    output += "전체 성별은 " + koSuffix(roundStr(b_value, 2), 'pred_past') + "고 ";
    output += "여성이 " + roundStr(f_value, 2) + ", " + "남성이 " + koSuffix(roundStr(m_value, 2), 'pred_past') + "다. ";
    output += "이는 전반적으로 " + (grade >= 2 ? "높은" : (grade <= -2 ? "낮은" : "보통")) + " 수준이었으며, ";
    if (is_mf_diff != 0) {
      output += (is_mf_diff == -1 ? "여성에 비해 남성의" : "남성에 비해 여성의") + " 연령 다양도가 더 높았";
    } else {
      output += "여성과 남성의 연령 다양도는 비슷했";
    }
    output += "다."
    return output;
  }
  function textAnalyze() {
    //data treating
    var age_grp = [
          {name: '아동', desc: '0-9세', count: 0, ratio: 0, upper: 2, lower: 1},
          {name: '청소년', desc: '10-24세', count: 0, ratio: 0, upper: 5, lower: 3},
          {name: '청년', desc: '25-39세', count: 0, ratio: 0, upper: 8, lower: 6},
          {name: '중년', desc: '40-59세', count: 0, ratio: 0, upper: 12, lower: 9},
          {name: '노년', desc: '60세 이상', count: 0, ratio: 0, upper:21 , lower: 13}
        ],
        over_80 = {name: '80세 이상', count: 0, ratio: 0, upper:21 , lower: 17},
        over_80_national_ratio = on_sub.dtset['전국']['both']['data']['a80_84']['ratio']
          + on_sub.dtset['전국']['both']['data']['a85_89']['ratio']
          + on_sub.dtset['전국']['both']['data']['a90_94']['ratio']
          + on_sub.dtset['전국']['both']['data']['a95_99']['ratio']
          + on_sub.dtset['전국']['both']['data']['a100']['ratio'],
        area_pop = 0,
        mean_age = 0;
    for (var i = 0; i < data.length; i++) {
      var age_key = sortkeys[data.data[i].name];
      if (age_grp[0].lower <= age_key & age_key <= age_grp[0].upper) {
        age_grp[0].count += data.data[i].b_count; age_grp[0].ratio += data.data[i].b_ratio;
      } else if (age_grp[1].lower <= age_key & age_key <= age_grp[1].upper) {
        age_grp[1].count += data.data[i].b_count; age_grp[1].ratio += data.data[i].b_ratio;
      } else if (age_grp[2].lower <= age_key & age_key <= age_grp[2].upper) {
        age_grp[2].count += data.data[i].b_count; age_grp[2].ratio += data.data[i].b_ratio;
      } else if (age_grp[3].lower <= age_key & age_key <= age_grp[3].upper) {
        age_grp[3].count += data.data[i].b_count; age_grp[3].ratio += data.data[i].b_ratio;
      } else if (age_grp[4].lower <= age_key & age_key <= age_grp[4].upper) {
        age_grp[4].count += data.data[i].b_count; age_grp[4].ratio += data.data[i].b_ratio;
        if (over_80.lower <= age_key & age_key <= over_80.upper) {
          over_80.count += data.data[i].b_count; over_80.ratio += data.data[i].b_ratio;
        }
      }
      area_pop += data.data[i].b_count;
      mean_age += age_key * 5 * data.data[i].b_ratio;
    }
    mean_age -= 3;
    var is_80_much = testProportion(over_80.count, area_pop, over_80_national_ratio),
        is_80_too_much = testProportion(over_80.count, area_pop, over_80_national_ratio + .03);
    age_grp.sort(function(x, y) {
      return d3.descending(x.ratio, y.ratio);
    });

    var output = (isNational ? "전국 " : "지역의 ") + "평균 연령은 대략 " + roundStr(mean_age, 0) + "세였다. ";
    output += "연령대별로 보면, " + age_grp[0].name + "(" + age_grp[0].desc + ", " + roundStr(age_grp[0].ratio*100, 2) + "%) 인구 비중이 가장 컸고, "
    for (var i = 1; i < age_grp.length; i++) {
      output += (i == 1 ? "" : ", ") + age_grp[i].name + "(" + age_grp[i].desc + ", " +  roundStr(age_grp[i].ratio*100, 2) + "%)"
    }
    output += " 순서로 많은 비중을 차지했다."
    if (is_80_much > 0) output += "한편, 80세 이상 인구의 비율이 " + roundStr(over_80.ratio*100, 2) + "%로, 다른 지역과 비교했을 때 상대적으로 그 비율이 "
                                  + (is_80_too_much > 0 ? "상당히 " : "") + "높았다."
    return output;
  }
  var result = regionMark() + " ";
  result += textDiversity() + " ";
  result += textAnalyze() + " ";
  $(xp).text(result);
}

//text_writing utility
function threeLevelGrading(v, m, s, t) {
  var level = {
        'adj': ['낮은', '보통', '높은'],
        'adv': ['낮게', '보통으로', '높게'],
        'past': ['낮았', '보통이었', '높았'],
        'number': [-1, 0, 1]
      };

  var degree = (v < m-s ? 0 : (v > m+s) ? 2 : 1);

  return level[t][degree];
}

function twoLevelGrading(v, m, s, t) {
  var level = {
        'adj': ['낮은', '높은'],
        'adv': ['낮게', '높게'],
        'past': ['낮았', '높았'],
        'number': [-1, 1]
      };

  var degree = (v < m-s ? 0 : 1);

  return level[t][degree];
}

function symmetryGrading(v, m, s, b, t) {
  var grade = {
        'balance': {
          'adj': ['균형적인', '불균형적인'],
          'adv': ['균형적으로', '불균형하게'],
          'past': ['균형적이었', '불균형했']
        },
        'symmetry': {
          'adj': ['대칭적인', '비대칭적인'],
          'adv': ['대칭적으로', '비대칭적으로'],
          'past': ['대칭적이었', '비대칭적이었']
        }
      };

  var degree = ((v > m-s & v < m+s) ? 0 : 1);

  return grade[b][t][degree];
}

function compareGrading(v1, v2, s, n) {
  var intv = 1.96 * s / Math.sqrt(n);
  if (Math.abs(v1 - v2) < intv) return 0;
  else if (v1 > v2) return 1;
  else return -1;
}

function compareProportion(v1, n1, v2, n2) {
  var p1 = v1 / n1, p2 = v2 / n2, p = (v1+v2) / (n1+n2),
      z = (p1 - p2) / Math.sqrt(p*(1-p)*(1/n1 + 1/n2));
  return (z < -1.96 ? -1 : (z > 1.96 ? 1 : 0));
}

function testProportion(v1, n1, p0) {
  var p1 = v1 / n1,
      z = (p1 - p0) / Math.sqrt(p0*(1-p0)/n1);
  return (z < -1.96 ? -1 : (z > 1.96 ? 1 : 0));
}

function testChiSquareByGender(f, m, b) { // array!
  var chiStat = [0,
                 0.004, 0.10, 0.35, 0.71, 1.15, 1.64, 2.17, 2.73, 3.33, 3.94,
                 4.57, 5.23, 5.89, 6.57, 7.26, 7.96, 8.67, 9.39, 10.12, 10.85];
  if (f.length == m.length & m.length == b.length) {
    var sum_f = d3.sum(f),
        sum_m = d3.sum(m),
        sum_b = d3.sum(b),
        df = f.length - 1;
    var chi = 0;
    for (var i = 0; i < f.length; i++) {
      var exp_f = (f[i] + m[i]) * sum_f / sum_b,
          exp_m = (f[i] + m[i]) * sum_m / sum_b;
      chi += Math.pow(f[i] - exp_f, 2) / exp_f
      chi += Math.pow(m[i] - exp_m, 2) / exp_m
    }
    if (chi > chiStat[df]) return 'hetero';
    else return 'homo';
  } else {
    return null;
  }
}

//language treatment
function nsToKor(n) {
  var letter = ['영', '일', '이', '삼', '사', '오', '륙', '칠', '팔', '구'];
  return letter[parseInt(n[n.length-1]%10)];
}

function hasVowelEnd(c) {
  var cJung = [ 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' ],
      ls = c[c.length-1].toKorChars(),
      l = ls[ls.length-1];
  if (cJung.indexOf(l) >= 0) {
    return true;
  } else {
    return false;
  }
}

function hasLiquidEnd(c) {
  var ls = c[c.length-1].toKorChars(),
      l = ls[ls.length-1];
  if (l == 'ㄹ') {
    return true;
  } else {
    return false;
  }
}

var koSuffix_map = {
  'foc': ['은', '는'],
  'nom': ['이', '가'],
  'acc': ['을', '를'],
  'cum': ['와', '과'],
  'ad': ['으로', '로'],
  'pred': ['이', '이'],
  'pred_past': ['이었', '였'],
  'gen': ['의'],
  'ins': ['에'],
  'inl': ['에서'],
  'dat': ['에게'],
  'no_check': ['gen', 'ins', 'inl', 'dat']
}

function koSuffix(t, f) {
  var s = t;
  if (!isNaN(parseFloat(t))) s = nsToKor(t);
  if (koSuffix_map['no_check'].indexOf(f) >= 0) {
    return t + koSuffix_map[f][0];
  } else if (f == 'ad') {
    if (hasLiquidEnd(s) | hasVowelEnd(s)) {
      return t + koSuffix_map[f][1];
    } else {
      return t + koSuffix_map[f][0];
    }
  } else {
    var i = 0;
    if (hasVowelEnd(s)) i = 1;
    return t + koSuffix_map[f][i];
  }
}

//from: http://westzero.tistory.com/112
/**
 * 한글을 초성/중성/종성 단위로 잘라서 배열로 반환한다.
 * 공백은 반환하지 않는다.
 *
 * 참조: http://dream.ahboom.net/entry/%ED%95%9C%EA%B8%80-%EC%9C%A0%EB%8B%88%EC%BD%94%EB%93%9C-%EC%9E%90%EC%86%8C-%EB%B6%84%EB%A6%AC-%EB%B0%A9%EB%B2%95
 *       http://helloworld.naver.com/helloworld/76650
 */
String.prototype.toKorChars = function() {
    var cCho  = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
        cJung = [ 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' ],
        cJong = [ '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
        cho, jung, jong;

    var str = this,
        cnt = str.length,
        chars = [],
        cCode;

    for (var i = 0; i < cnt; i++) {
        cCode = str.charCodeAt(i);

        if (cCode == 32) { continue; }

        // 한글이 아닌 경우
        if (cCode < 0xAC00 || cCode > 0xD7A3) {
            chars.push(str.charAt(i));
            continue;
        }

        cCode  = str.charCodeAt(i) - 0xAC00;

        jong = cCode % 28; // 종성
        jung = ((cCode - jong) / 28 ) % 21 // 중성
        cho  = (((cCode - jong) / 28 ) - jung ) / 21 // 초성

        chars.push(cCho[cho], cJung[jung]);
        if (cJong[jong] !== '') { chars.push(cJong[jong]); }
    }

    return chars;
}
