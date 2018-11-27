var scene, camera, renderer, controls;
var grid_unit = 3;
var camera_origin = new THREE.Vector3( 10, 90, 30 );
var graph_group_arr = [];
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var meshes = [];
var startFov = 20;
var startPosition = new THREE.Vector3( 0, 0, 500 );
var startRotation = new THREE.Vector3( 0, 0, 0 );

var axisX = {
      name: 'Month',
      ticks: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    },
    axisY =  {
      name: 'Temperature(\'C)',
      ticks: ['-20', '-15', '-10', '-5', '0', '5', '10', '15', '20', '25', '30', '35', '40']
    },
    axisZ =  {
      name: 'Year',
      ticks: ['2010', '2011', '2012', '2013', '2014', '2015', '2016']
    };

var gud = function (v) {

  return v * grid_unit;

}

var initiate_webgl = function () {

  var webgl_container = $( '#graph-whole' );

  if ( ! Detector.webgl ) {

    webgl_container.html('WebGL을 이용할 수 없습니다.');

  } else {

    aspect_value = window.innerWidth / window.innerHeight;
    var width = window.innerWidth, height = width * aspect_value;

    size_value = webgl_container.width();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( size_value, size_value / aspect_value );
    renderer.setPixelRatio( window.devicePixelRatio );

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);
    scene.position.x = 0;
    scene.position.y = 0;
    scene.position.z = 0;

    camera = new THREE.PerspectiveCamera( startFov, aspect_value, 1, 1000);
    camera.position.set( startPosition.x, startPosition.y, startPosition.z );
    camera.rotation.set( startRotation.x, startRotation.y, startRotation.z );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    //controls.enableZoom = false;
    controls.update();

    light2 = new THREE.DirectionalLight(0xFFFFFF, 2);
    light2.position.set(100, 100, 100);
    scene.add(light2);

    renderer.render( scene , camera );

    //draw_xyz();
    draw_grid();
    draw_axis();

    data_years.forEach(function(year) {
      draw_plot(year);
    });

    webgl_container.append( renderer.domElement );

  }

}

var render = function() {

  renderer.render( scene, camera );

}


var draw_xyz = function () {

  //draw grid line for xyz coordinate
  var grid_w_x_mat = new THREE.LineBasicMaterial( { color: 0xff0000 } );
  var grid_w_y_mat = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
  var grid_w_z_mat = new THREE.LineBasicMaterial( { color: 0x0000ff } );

  var grid_w_x_geo = new THREE.Geometry();
  grid_w_x_geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  grid_w_x_geo.vertices.push( new THREE.Vector3( 500, 0, 0 ) );
  var grid_w_x = new THREE.Line( grid_w_x_geo, grid_w_x_mat );
  scene.add( grid_w_x );
  meshes.push(grid_w_x);


  var grid_w_y_geo = new THREE.Geometry();
  grid_w_y_geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  grid_w_y_geo.vertices.push( new THREE.Vector3( 0, 500, 0 ) );
  var grid_w_y = new THREE.Line( grid_w_y_geo, grid_w_y_mat );
  scene.add( grid_w_y );
  meshes.push(grid_w_y);

  var grid_w_z_geo = new THREE.Geometry();
  grid_w_z_geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  grid_w_z_geo.vertices.push( new THREE.Vector3( 0, 0, 500 ) );
  var grid_w_z = new THREE.Line( grid_w_z_geo, grid_w_z_mat );
  scene.add( grid_w_z );
  meshes.push(grid_w_z);

  renderer.render( scene, camera );

  //draw grid line for xyz coordinate
  var grid_w_x_mat = new THREE.LineBasicMaterial( { color: 0x0f0000 } );
  var grid_w_y_mat = new THREE.LineBasicMaterial( { color: 0x000f00 } );
  var grid_w_z_mat = new THREE.LineBasicMaterial( { color: 0x00000f } );

  var grid_w_x_geo = new THREE.Geometry();
  grid_w_x_geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  grid_w_x_geo.vertices.push( new THREE.Vector3( -500, 0, 0 ) );
  scene.add( new THREE.Line( grid_w_x_geo, grid_w_x_mat ) );

  var grid_w_y_geo = new THREE.Geometry();
  grid_w_y_geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  grid_w_y_geo.vertices.push( new THREE.Vector3( 0, -500, 0 ) );
  scene.add( new THREE.Line( grid_w_y_geo, grid_w_y_mat ) );

  var grid_w_z_geo = new THREE.Geometry();
  grid_w_z_geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  grid_w_z_geo.vertices.push( new THREE.Vector3( 0, 0, -500 ) );
  scene.add( new THREE.Line( grid_w_z_geo, grid_w_z_mat ) );


  renderer.render( scene, camera );
}

var grid_wrap_size_x = 12 * gud(4),
    grid_wrap_size_y = 12 * gud(4), //both way
    grid_wrap_size_z = 7 * gud(4),
    grid_y_negative_rate = 1/3;

var grid_y_adjust = -grid_wrap_size_y * (1/2 - grid_y_negative_rate);

var draw_axis = function() {

  var font_material = new THREE.MeshPhongMaterial({color: 0x000000, wireframe: false});
  var fontLoader = new THREE.FontLoader();
  var font_r = fontLoader.load(
    '/sv/four_seasons/helvetiker_bold.typeface.json',
    function( font ) {

      var font_pam = {size: 3.5, font: font, height: 0.5};
      var name_pam = {size: 1.7, font: font, height: 0.5};

      var axis_x_name_geo = new THREE.TextGeometry( axisX.name, name_pam );
      axis_x_name_geo.rotateX(-Math.PI/4);
      axis_x_name_geo.translate( - grid_wrap_size_x / 2, grid_y_adjust - gud(2), grid_wrap_size_z / 2 + gud(3) );
      var axis_x_name = new THREE.Mesh( axis_x_name_geo, font_material );

      scene.add(axis_x_name);

      //1. by X (month grid)
      for (var i = 0; i < 12; i++) {
        var tick_x = grid_wrap_size_x / 12 * i;
        var axis_x_geo = new THREE.TextGeometry( axisX.ticks[i].toString(), font_pam );
        axis_x_geo.rotateX(-Math.PI/4);
        axis_x_geo.translate( tick_x - grid_wrap_size_x / 2, grid_y_adjust - gud(1), grid_wrap_size_z / 2 + gud(2) );
        var axis_x = new THREE.Mesh( axis_x_geo, font_material );

        scene.add(axis_x);
      }

      var axis_z_name_geo = new THREE.TextGeometry( axisZ.name, name_pam );
      axis_z_name_geo.rotateX(-Math.PI/4);
      axis_z_name_geo.translate( grid_wrap_size_x / 2 + gud(5), grid_y_adjust - gud(1), grid_wrap_size_z / 2 - gud(2)  );
      var axis_z_name = new THREE.Mesh( axis_z_name_geo, font_material );

      scene.add(axis_z_name);

      //2. by Z (year grid)
      for (var i = 0; i < 7; i++) {
        var tick_z = grid_wrap_size_z / 7 * i;
        var axis_z_geo = new THREE.TextGeometry( axisZ.ticks[i].toString(), font_pam );
        axis_z_geo.rotateX(-Math.PI/4);
        axis_z_geo.translate( grid_wrap_size_x / 2, grid_y_adjust - gud(1), tick_z - grid_wrap_size_z / 2 + gud(2.5) );
        var axis_z = new THREE.Mesh( axis_z_geo, font_material );

        scene.add(axis_z);
      }

      var axis_y_name_geo = new THREE.TextGeometry( axisY.name, name_pam );
      axis_y_name_geo.rotateX(-Math.PI/4);
      axis_y_name_geo.translate( - grid_wrap_size_x / 2 - gud(7.5), grid_wrap_size_y / 2 + grid_y_adjust / 2 + gud(2.5), grid_wrap_size_z / 2 );
      var axis_y_name = new THREE.Mesh( axis_y_name_geo, font_material );

      scene.add(axis_y_name);

      //3. by Y (temperature grid)
      for (var i = 0; i < 13; i++) {
        var tick_y = grid_wrap_size_y / 12 * (i + 1);
        var axis_y_geo = new THREE.TextGeometry( axisY.ticks[i].toString(), font_pam );
        axis_y_geo.rotateX(-Math.PI/4);
        axis_y_geo.translate( - grid_wrap_size_x / 2 - gud(3), grid_y_adjust / 2 + tick_y - grid_wrap_size_y / 2, grid_wrap_size_z / 2  );
        var axis_y = new THREE.Mesh( axis_y_geo, font_material );

        scene.add(axis_y);
      }
      render();
    }
  );

}

var draw_grid = function () {
  //sub grid
  //1. xz
  var grid_xz_unit_mat = new THREE.LineBasicMaterial( {color: 0x999999, linewidth: 2 } );

  //1-1. by X (month grid)
  for (var i = 1; i < 12; i++) {

    var grid_xz_unit_geo = new THREE.Geometry(),
        tick_x = grid_wrap_size_x / 12 * i;
    grid_xz_unit_geo.vertices.push( new THREE.Vector3( tick_x, 0, 0) );
    grid_xz_unit_geo.vertices.push( new THREE.Vector3( tick_x, 0, grid_wrap_size_z ) );
    grid_xz_unit_geo.translate( -grid_wrap_size_x / 2, grid_y_adjust, -grid_wrap_size_z / 2 );
    var grid_xz_unit = new THREE.Line( grid_xz_unit_geo, grid_xz_unit_mat );
    graph_group_arr.push(grid_xz_unit);
    scene.add(grid_xz_unit);
  }

  //1-2. by Z (year)
  for (var i = 1; i < 7; i++) {

    var grid_xz_unit_geo = new THREE.Geometry(),
        tick_z = grid_wrap_size_z / 7 * i;
    grid_xz_unit_geo.vertices.push( new THREE.Vector3( 0, 0, tick_z ) );
    grid_xz_unit_geo.vertices.push( new THREE.Vector3( grid_wrap_size_x, 0, tick_z ) );
    grid_xz_unit_geo.translate( -grid_wrap_size_x / 2, grid_y_adjust, -grid_wrap_size_z / 2 );
    var grid_xz_unit = new THREE.Line( grid_xz_unit_geo, grid_xz_unit_mat );
    graph_group_arr.push(grid_xz_unit);
    scene.add(grid_xz_unit);

  }

  //2. YX
  var grid_yx_unit_mat = new THREE.LineBasicMaterial( {color: 0x999999, linewidth: 2 } );

  //2-1. by X (month grid)
  for (var i = 1; i < 12; i++) {

    var grid_yx_unit_geo = new THREE.Geometry(),
        tick_x = grid_wrap_size_x / 12 * i;
    grid_yx_unit_geo.vertices.push( new THREE.Vector3( tick_x, 0, 0) );
    grid_yx_unit_geo.vertices.push( new THREE.Vector3( tick_x, grid_wrap_size_y, 0) );
    grid_yx_unit_geo.translate( -grid_wrap_size_x / 2, -grid_wrap_size_y * grid_y_negative_rate + grid_y_adjust, -grid_wrap_size_z / 2 );
    var grid_yx_unit = new THREE.Line( grid_yx_unit_geo, grid_yx_unit_mat );
    graph_group_arr.push(grid_yx_unit);
    scene.add(grid_yx_unit);

  }

  //2-2. by Y (temperature grid)
  for (var i = 1; i < 12; i++) {

    var grid_yx_unit_geo = new THREE.Geometry(),
        tick_y = grid_wrap_size_y / 12 * i;
    grid_yx_unit_geo.vertices.push( new THREE.Vector3( 0, tick_y, 0 ) );
    grid_yx_unit_geo.vertices.push( new THREE.Vector3( grid_wrap_size_x, tick_y, 0 ) );
    grid_yx_unit_geo.translate( -grid_wrap_size_x / 2, -grid_wrap_size_y * grid_y_negative_rate + grid_y_adjust, -grid_wrap_size_z / 2 );
    var grid_yx_unit = new THREE.Line( grid_yx_unit_geo, grid_yx_unit_mat );
    graph_group_arr.push(grid_yx_unit);
    scene.add(grid_yx_unit);

  }

  //3. YZ
  var grid_yz_unit_mat = new THREE.LineBasicMaterial( {color: 0x999999, linewidth: 2 } );

  //3-1. by Z (year grid)
  for (var i = 1; i < 7; i++) {

    var grid_yz_unit_geo = new THREE.Geometry(),
        tick_z = grid_wrap_size_z / 7 * i;
    grid_yz_unit_geo.vertices.push( new THREE.Vector3( 0, 0, tick_z) );
    grid_yz_unit_geo.vertices.push( new THREE.Vector3( 0, grid_wrap_size_y, tick_z) );
    grid_yz_unit_geo.translate( -grid_wrap_size_x / 2, -grid_wrap_size_y * grid_y_negative_rate + grid_y_adjust, -grid_wrap_size_z / 2 );
    var grid_yz_unit = new THREE.Line( grid_yz_unit_geo, grid_yz_unit_mat );
    graph_group_arr.push(grid_yz_unit);
    scene.add(grid_yz_unit);

  }

  //2-2. by Y (temperature grid)
  for (var i = 1; i < 12; i++) {

    var grid_yz_unit_geo = new THREE.Geometry(),
        tick_y = grid_wrap_size_y / 12 * i;
    grid_yz_unit_geo.vertices.push( new THREE.Vector3( 0, tick_y, 0 ) );
    grid_yz_unit_geo.vertices.push( new THREE.Vector3( 0, tick_y, grid_wrap_size_z ) );
    grid_yz_unit_geo.translate( -grid_wrap_size_x / 2, -grid_wrap_size_y * grid_y_negative_rate + grid_y_adjust, -grid_wrap_size_z / 2 );
    var grid_yz_unit = new THREE.Line( grid_yz_unit_geo, grid_yz_unit_mat );
    graph_group_arr.push(grid_yz_unit);
    scene.add(grid_yz_unit);

  }

  //wrapper grid

  //draw grid lines on x*z plane
  var grid_xz_wrap_geo = new THREE.Geometry();
  grid_xz_wrap_geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  grid_xz_wrap_geo.vertices.push( new THREE.Vector3( grid_wrap_size_x, 0, 0 ) );
  grid_xz_wrap_geo.vertices.push( new THREE.Vector3( grid_wrap_size_x, 0, grid_wrap_size_z ) );
  grid_xz_wrap_geo.vertices.push( new THREE.Vector3( 0, 0, grid_wrap_size_z ) );
  grid_xz_wrap_geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  grid_xz_wrap_geo.translate( -grid_wrap_size_x / 2, grid_y_adjust, -grid_wrap_size_z / 2 );

  var grid_xz_wrap_mat = new THREE.LineBasicMaterial( {color: 0x000000, linewidth: 5 } );
  var grid_xz_wrap = new THREE.Line( grid_xz_wrap_geo, grid_xz_wrap_mat );
  graph_group_arr.push(grid_xz_wrap);
  scene.add(grid_xz_wrap);


  //draw y*x grid
  var grid_yx_wrap_geo = new THREE.Geometry();
  grid_yx_wrap_geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  grid_yx_wrap_geo.vertices.push( new THREE.Vector3( grid_wrap_size_x, 0, 0 ) );
  grid_yx_wrap_geo.vertices.push( new THREE.Vector3( grid_wrap_size_x, grid_wrap_size_y, 0 ) );
  grid_yx_wrap_geo.vertices.push( new THREE.Vector3( 0, grid_wrap_size_y, 0 ) );
  grid_yx_wrap_geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  grid_yx_wrap_geo.translate( -grid_wrap_size_x / 2, -grid_wrap_size_y * grid_y_negative_rate + grid_y_adjust, -grid_wrap_size_z / 2 );

  var grid_yx_wrap_mat = new THREE.LineBasicMaterial( {color: 0x000000, linewidth: 5 } );
  var grid_yx_wrap = new THREE.Line( grid_yx_wrap_geo, grid_yx_wrap_mat );
  graph_group_arr.push(grid_yx_wrap);
  scene.add(grid_yx_wrap);


  //draw y*z grid
  var grid_yz_wrap_geo = new THREE.Geometry();
  grid_yz_wrap_geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  grid_yz_wrap_geo.vertices.push( new THREE.Vector3( 0, 0, grid_wrap_size_z ) );
  grid_yz_wrap_geo.vertices.push( new THREE.Vector3( 0, grid_wrap_size_y, grid_wrap_size_z ) );
  grid_yz_wrap_geo.vertices.push( new THREE.Vector3( 0, grid_wrap_size_y, 0 ) );
  grid_yz_wrap_geo.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  grid_yz_wrap_geo.translate( -grid_wrap_size_x / 2, -grid_wrap_size_y * grid_y_negative_rate + grid_y_adjust, -grid_wrap_size_z / 2 );

  var grid_yz_wrap_mat = new THREE.LineBasicMaterial( {color: 0x000000, linewidth: 5 } );
  var grid_yz_wrap = new THREE.Line( grid_yz_wrap_geo, grid_yz_wrap_mat );
  graph_group_arr.push(grid_yz_wrap);
  scene.add(grid_yz_wrap);

  renderer.render( scene, camera );

}

var dust_scale = d3.scaleLinear()
    .domain( [ 0, 50, 80, data_grid_unit.fine_dust.MAX ] )
    .range( [ '#00bcd4', '#ffffff', '#ff1744', '#9c27b0' ] );
var temp_scale = d3.scaleLinear().domain( [ data_grid_unit.temperature.MIN, data_grid_unit.temperature.MAX ] ).range( [ grid_y_adjust, grid_wrap_size_y + grid_y_adjust ] );

var draw_plot = function( year ) {

  //year, x: x-axis width, z: z-axis width
  var d = data[ year.toString() ],
      len = datetime_order( year, 12, 31 ) - datetime_order( year, 1, 1 ),
      year_gap = year - 2010;

  var curve_geo = new THREE.PlaneGeometry(grid_wrap_size_x, gud(4), len, 1);
  curve_geo.rotateX(-Math.PI/2);
  curve_geo.translate( 0, grid_y_adjust, -(year_gap + 0.5) * gud(4) + grid_wrap_size_z / 2 );

  var curve_line_geo = new THREE.Geometry();

  var canvas = document.createElement( 'canvas' );
  canvas.width = grid_wrap_size_x;
  canvas.height = gud(4);

  var context = canvas.getContext( '2d' );
  context.rect( 0, 0, grid_wrap_size_x, gud(4) );
  var gradient = context.createLinearGradient( 0, 0, grid_wrap_size_x, 0 );

  var c = 0, nc = curve_geo.vertices.length;

  for ( var i = 0; i < Object.keys(d).length; i++ ) {

    var dm = d[(i+1).toString()];

    for ( var j = 0; j < Object.keys(dm).length; j++ ) {
      if( i + 1 == 2 && j + 1 == 29 ){

        continue;

      } else {

        var dmd_dust = extract_by_key( year, i+1, j+1, 'fine_dust' ),
            dmd_temp = extract_by_key( year, i+1, j+1, 'temperature' ) * gud(1),
            dmd_rate = ( datetime_order( year, i+1, j+1 ) - datetime_order( year, 1, 1 ) ) / len;

        curve_geo.vertices[c].y = dmd_temp + grid_y_adjust;
        curve_geo.vertices[Math.floor(nc/2) + c].y = dmd_temp + grid_y_adjust;
        c++;

        curve_line_geo.vertices.push(
          new THREE.Vector3( -grid_wrap_size_x / 2 + grid_wrap_size_x * dmd_rate, dmd_temp + grid_y_adjust, -(year_gap) * gud(4) + grid_wrap_size_z / 2 )
        );

        gradient.addColorStop( dmd_rate, dust_scale(dmd_dust).toString() );

      }

    }

  }

  context.fillStyle = gradient;
  context.fill();

  var texture = new THREE.Texture( canvas );
  texture.needsUpdate = true;

  var curve_mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  var curve_line_mat = new THREE.LineBasicMaterial({ color: 0x000000, wireframe: false });
  var curve = new THREE.Mesh(curve_geo, curve_mat);
  var curve_line = new THREE.Line(curve_line_geo, curve_line_mat)

  scene.add(curve);
  scene.add(curve_line);

  renderer.render( scene, camera );

}
