

var data_years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];
var data_m31 = [1, 3, 5, 7, 8, 10, 12],
    data_m30 = [4, 6, 9, 11],
    data_m28 = [2];
var data_key_used = [
      'temperature',
      'temperature_max',
      'temperature_min',
      'fine_dust',
      'super_fine_dust'
    ]

var data_stats = {},
    data_points = {};

var init_data_stat = function() {

  for (var k = 0; k < data_key_used.length; k++ ) {

    var key = data_key_used[k];
    data_points[key] = [];

  }

  for (var i  = 0; i < data_years.length; i++ ) {
    var y = data_years[i];

    for (var j = 0; j < 12; j++) {
      var m = j+1;
      var d = 1;
      var temp = extract( y, m, d );

      while(temp != null) {

        for (var k = 0; k < data_key_used.length; k++ ) {

          var key = data_key_used[k];
          data_points[key].push(temp[key]);

        }

        d++;
        temp = extract( y, m, d );
      }

    }

  }

  for (var k = 0; k < data_key_used.length; k++ ) {

    var key = data_key_used[k];
    data_stats[key] = {
      'MIN': data_points[key].reduce( function( a, b ) { return Math.min( a, b ); } ),
      'MAX': data_points[key].reduce( function( a, b ) { return Math.max( a, b ); } ),
      'AVG': data_points[key].reduce( function( t, n ) { return t + n; } ) / data_points[key].length
    };

  }

  console.log(data_stats);

}

var extract_by_key = function (y, m, d, k) {

  var o = null;

  try {

    o = extract(y, m, d)[k];

  } catch(err) {

    console.log('no such data: '+err);

  }

  return o;

}

var extract = function ( y, m, d ) {

  var o = null;

  try {

    o = data[y.toString()][m.toString()][d.toString()];

  } catch(err) {

    console.log('no such data: '+err);

  }

  return o;

}

var datetime_order = function ( y, m, d ) {

  var res = (y - data_years[0]) * 365;

  for (var i = 1; i < m; i++) {
    if ( data_m31.includes( i ) ) res += 31;
    else if ( data_m30.includes( i ) ) res += 30;
    else if ( data_m28.includes( i ) ) res += 28;
  }

  res += d;

  return res;

}
