let calc_glb = {};

let formatFunctions = {
  'time': null,
  'float(1)': float_format(1),
  'float(2)': float_format(2),
  'float(4)': float_format(2),
  'float(8)': float_format(2)
}

let units = {
  co2: {en: 'CO2ekg', ko: 'CO2환산kg'},
  hour: {en: 'hour(s)', ko: '시간'}
}

let create_country_list = function(pl, ln) {
  calc_glb.ln = ln;
  $.getJSON( "/hmde/data/hmde_data_" + ln + ".json" , function( data ){ 
    let place = $(pl);
    for(let i = 0; i < data.length; i++) {
      let cell = $('<span>').text(data[i].stName).click(function() { set_country(this, data[i]) });
      place.append(cell);
    }
  });
}


let set_country = function(item, data) {
  $('.sublist_foldable span').attr('data-selected', 'false')
  $(item).attr('data-selected', 'true')
  $('.sublist_foldable .list_header').text(data.stName)
  calc_glb.data = data;
  $('#currency').text(data.crAbbr);
  $('#income-input').attr('data-show', 'true');
  $('#calc-result').attr('data-show', 'false');
  $('.sublist_foldable').attr('data-open', 'false')
}

let calculate = function() {
  let kgToKm = 5.070498481, kgToHour = 1788.887066;
  calc_glb.income = parseFloat($('#calculator-income').val())
  $('#calc-result').attr('data-show', 'true');
  calc_glb.result = {
    tot: {
      emit: calc_glb.income / 1000 * calc_glb.data.perTot,
      driving: calc_glb.income / 1000 * calc_glb.data.perTot * kgToKm,
      bulb: calc_glb.income / 1000 * calc_glb.data.perTot * kgToHour
    },
    agr: {
      emit: calc_glb.income / 1000 * calc_glb.data.perAgr,
      driving: calc_glb.income / 1000 * calc_glb.data.perAgr * kgToKm,
      bulb: calc_glb.income / 1000 * calc_glb.data.perAgr * kgToHour
    },
    mnf: {
      emit: calc_glb.income / 1000 * calc_glb.data.perMnf,
      driving: calc_glb.income / 1000 * calc_glb.data.perMnf * kgToKm,
      bulb: calc_glb.income / 1000 * calc_glb.data.perMnf * kgToHour
    },
    eng: {
      emit: calc_glb.income / 1000 * calc_glb.data.perEng,
      driving: calc_glb.income / 1000 * calc_glb.data.perEng * kgToKm,
      bulb: calc_glb.income / 1000 * calc_glb.data.perEng * kgToHour
    },
    tsp: {
      emit: calc_glb.income / 1000 * calc_glb.data.perTsp,
      driving: calc_glb.income / 1000 * calc_glb.data.perTsp * kgToKm,
      bulb: calc_glb.income / 1000 * calc_glb.data.perTsp * kgToHour
    },
    etc: {
      emit: calc_glb.income / 1000 * calc_glb.data.perEtc,
      driving: calc_glb.income / 1000 * calc_glb.data.perEtc * kgToKm,
      bulb: calc_glb.income / 1000 * calc_glb.data.perEtc * kgToHour
    }
  };
  calc_glb.sector = "tot"
  change_sector();
}

let change_sector = function() {
  $(document).scrollTop(
    $('#calc-result').offset().top
  );
  let sector = $('#calc-result-sector-selector').val();
  calc_glb.sector = sector;
  
  $('#calc-result-emit .value').text(sepDec(calc_glb.result[calc_glb.sector].emit, 2) + " " + units.co2[calc_glb.ln]);
  $('#calc-result-driving .value').text(sepDec(calc_glb.result[calc_glb.sector].driving, 2) + ' km');
  $('#calc-result-bulb .value').text(seeMWDHM(calc_glb.result[calc_glb.sector].bulb, calc_glb.ln));
  
  $('#calc-result-emit .content').empty();
  $('#calc-result-driving .content').empty();
  $('#calc-result-bulb .content').empty();
  
  let dgs = Math.floor(calc_glb.result[calc_glb.sector].emit*100)
  let dots_count = {d100: 0, d50: 0, d10: 0, d1: 0};
  dots_count.d100 = Math.floor(dgs/100);
  dots_count.d50 = Math.floor( (dgs - dots_count.d100 * 100)/50 );
  dots_count.d10 = Math.floor( (dgs - dots_count.d100 * 100 - dots_count.d50 * 50)/10 );
  dots_count.d1 = dgs - dots_count.d100 * 100 - dots_count.d50 * 50 - dots_count.d10 * 10;
  console.log(dots_count)
  let dgs_frac = calc_glb.result[calc_glb.sector].emit*100 - dgs;

  let dots = d3.select('#calc-result-emit .content').append('svg');
  let dots_scale = [10, Math.ceil((dgs+1)/10)];
  console.log(dots_scale);
  
  dots.attr('viewBox', '0 0 59 ' + (dots_scale[1]*6-1 + 15));
  dots.attr('width', $('#calc-result-emit .content').outerWidth() * 0.9);
  dots.attr('height', $('#calc-result-emit .content').outerWidth() / 59 * 0.9 * (dots_scale[1]*6-1) + 10 )
  
  let dots_pos = 0
  
  for (let i = 0; i < dots_count.d100; i++) {
    dots.append('image').attr('xlink:href', '/hmde/img/dots_100.png').attr('width', 59).attr('height', 60).attr('x', 0).attr('y', dots_pos);
    dots_pos += 60;
  }
  for (let i = 0; i < dots_count.d50; i++) {
    dots.append('image').attr('xlink:href', '/hmde/img/dots_50.png').attr('width', 59).attr('height', 30).attr('x', 0).attr('y', dots_pos);
    dots_pos += 30;
  }
  for (let i = 0; i < dots_count.d10; i++) {
    dots.append('image').attr('xlink:href', '/hmde/img/dots_10.png').attr('width', 59).attr('height', 6).attr('x', 0).attr('y', dots_pos);
    dots_pos += 6;
  }
  
  for (let i = 0; i < dots_count.d1; i++) {
    dots.append('rect').attr('width', 5).attr('height', 5)
      .attr('x', 6*(i%dots_scale[0])).attr('y', dots_pos)
      .attr('fill', '#ff9500');
  }
  
  let dots_frac = dots.append('rect');
  if (dgs_frac > 0.9) dots_frac.attr('width', 4.5).attr('height', 4.5);
  else if (dgs_frac > 0.8) dots_frac.attr('width', 4).attr('height', 4);
  else if (dgs_frac > 0.7) dots_frac.attr('width', 3.5).attr('height', 3.5);
  else if (dgs_frac > 0.6) dots_frac.attr('width', 3).attr('height', 3);
  else if (dgs_frac > 0.5) dots_frac.attr('width', 2.5).attr('height', 2.5);
  else if (dgs_frac > 0.4) dots_frac.attr('width', 2).attr('height', 2);
  else if (dgs_frac > 0.3) dots_frac.attr('width', 1.5).attr('height', 1.5);
  else if (dgs_frac > 0.2) dots_frac.attr('width', 1).attr('height', 1);
  else if (dgs_frac > 0.1) dots_frac.attr('width', 0.5).attr('height', 0.5);
  dots_frac.attr('x', 6*(dgs%dots_scale[0])).attr('y',  dots_pos)
    .attr('fill', '#ff9500')

  dots_pos += 10
  
  dots.append('rect').attr('width', 5).attr('height', 5)
      .attr('x', 0).attr('y', 6*Math.floor(dgs/dots_scale[0])+12)
      .attr('fill', '#ff9500');
  dots.append('text').attr('x', 11).attr('y', 6*Math.floor(dgs/dots_scale[0])+18)
    .text((calc_glb.ln=='en' ? '= 10 CO2eg' : '= 10 CO2환산g'))
    .attr('fill', '#999999').attr('font-size', 8);
    
  //driving
  let km = Math.floor(calc_glb.result[calc_glb.sector].driving);
  let km_frac = calc_glb.result[calc_glb.sector].driving - km;
  $('#calc-result-driving .content').append($('<div>').addClass('driving-road'))
  for (let i= 0; i < km; i++){
    $('#calc-result-driving .content .driving-road').append(
      $('<div>').addClass('denote').text(sepDec(i+1) + ' km')
    );
  }
  $('#calc-result-driving .content .driving-road').append(
    $('<div>').addClass('denote-out').text(sepDec(km+km_frac,2) + ' km').css('height', km_frac*50+'px')
  );
  
  //bulb
  let hr = Math.floor(calc_glb.result[calc_glb.sector].bulb/24);
  let bulb = $('<div>')
    .addClass('bulb-falsh')
    .css('width', $('#calc-result-bulb .content').outerWidth() * 0.9)
    .css('height', $('#calc-result-bulb .content').outerWidth() * 0.9)
    .css('margin', '0 auto')
    .css('background-color', '#fffdbc')
    .css('color', 'black');
  $('#calc-result-bulb .content').append(bulb)
  let counter = 1;
  bulb.append($('<span>').text(counter + (calc_glb.ln=='en'?'Day':'일')));
  let interval = setInterval(function() {
    bulb.css('background-color', '#333333').css('color', 'white')
    setTimeout(function() {
      bulb.css('background-color', '#fffdbc').css('color', 'black')
    },100);
    counter++;
    bulb.find('span').text(counter + (calc_glb.ln=='en'?'Days':'일'));
  }, 700)
  setTimeout(function() { 
    clearInterval(interval); 
    bulb.css('background-color', '#333333').css('color', 'white'); 
    $('#calc-result-bulb .content').append(
      $('<button>')
      .text((calc_glb.ln == 'en'?'Replay':'다시재생'))
      .on('click', function(){ 
        replay_bulb(bulb, hr);
      })
    );
  }, hr*700);
  setTimeout(function(){
    bulb.css('background-color', '#333333').css('color', 'white'); 
  }, hr*700);
}

let replay_bulb = function(bulb, time) {
  $('#calc-result-bulb .content button').remove();
  let counter = 1;
  bulb.find('span').text(counter + (calc_glb.ln=='en'?'Day':'일'));
  let interval = setInterval(function() {
    bulb.css('background-color', '#333333').css('color', 'white')
    setTimeout(function() {
      bulb.css('background-color', '#fffdbc').css('color', 'black')
    },100);
    counter++;
    bulb.find('span').text(counter + (calc_glb.ln=='en'?'Days':'일'));
  }, 700)
  setTimeout(function() { 
    clearInterval(interval); 
    bulb.css('background-color', '#333333').css('color', 'white'); 
    $('#calc-result-bulb .content').append(
      $('<button>')
      .text((calc_glb == 'en'?'Replay':'다시재생'))
      .on('click', function(){ 
        replay_bulb(bulb, time);
      })
    );
  }, time*700);
  setTimeout(function(){
    bulb.css('background-color', '#333333').css('color', 'white'); 
  }, time*700);
}