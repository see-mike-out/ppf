let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let sassMiddleware = require('node-sass-middleware');
let archives = require('./archive-route');
let svs = require('./sv-route');

let app = express();

//session setting
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

//bodyprser setting
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

//global variables
app.set('is_en', true);
app.set('lang', 'en');

//layout
let handlebars = require('express-handlebars').create({ 
  defaultLayout: 'main',
  helpers: {
    equal: function(lvalue, rvalue, options) {
      if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
      if( lvalue!=rvalue ) {
          return options.inverse(this);
      } else {
          return options.fn(this);
      }
    }
  }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//sass
app.use(
  sassMiddleware({
    src: __dirname + '/sass', //where the sass files are 
    dest: __dirname + '/public', //where css should go
    debug: true // obvious
  })
);

//port
app.set('port', process.env.PORT || 80);

//env
app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

//routes
app.get('/', function(req, res) {
  res.render('showcase/main_page');
});
app.get('/research', function(req, res) {
  res.render('showcase/research_page', {selected: 'research'});
});
app.get('/work', function(req, res) {
  res.render('showcase/work_page', {selected: 'work'});
});
//archives
app.use('/archive', archives);
//short visuals
app.use('/shortvisuals', svs);

//routes mtod
app.get('/mytownourdiversity', function(req, res) {
  res.render('mtod/intro', {layout: 'mtod.handlebars', mtod_sub: 'intro', is_mtod_intro: true})
})
app.get('/mytownourdiversity/browse', function(req, res) {
  res.render('mtod/browse', {layout: 'mtod.handlebars', mtod_sub: 'browse', is_mtod_intro: false})
})
app.get('/mytownourdiversity/map', function(req, res) {
  res.render('mtod/map', {layout: 'mtod.handlebars', mtod_sub: 'map', is_mtod_intro: false})
})
app.get('/mytownourdiversity/table', function(req, res) {
  res.render('mtod/table', {layout: 'mtod.handlebars', mtod_sub: 'table', is_mtod_intro: false})
})

//routes hmml
app.get('/howmuchismylabor', function(req, res) {
  res.render('hmml/intro', {layout: 'hmml.handlebars', hmml_sub: 'intro', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/howmuchismylabor/tables', function(req, res) {
  res.render('hmml/table', {layout: 'hmml.handlebars', hmml_sub: 'table', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/howmuchismylabor/graphs', function(req, res) {
  res.render('hmml/graph', {layout: 'hmml.handlebars', hmml_sub: 'graph', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/howmuchismylabor/plots', function(req, res) {
  res.render('hmml/plot', {layout: 'hmml.handlebars', hmml_sub: 'plot', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/howmuchismylabor/bycountry', function(req, res) {
  res.render('hmml/bycountry', {layout: 'hmml.handlebars', hmml_sub: 'bycountry', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/howmuchismylabor/download', function(req, res) {
  res.render('hmml/download', {layout: 'hmml.handlebars', hmml_sub: 'download', is_en: app.get('is_en'), ln: app.get('lang')})
})

//routes hmde
app.get('/howmuchdoiemit', function(req, res) {
  res.render('hmde/intro', {layout: 'hmde.handlebars', hmde_sub: 'intro', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/howmuchdoiemit/tables', function(req, res) {
  res.render('hmde/table', {layout: 'hmde.handlebars', hmde_sub: 'tables', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/howmuchdoiemit/graphs', function(req, res) {
  res.render('hmde/graph', {layout: 'hmde.handlebars', hmde_sub: 'graphs', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/howmuchdoiemit/calculator', function(req, res) {
  res.render('hmde/calculator', {layout: 'hmde.handlebars', hmde_sub: 'calculator', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/howmuchdoiemit/bycountry', function(req, res) {
  res.render('hmde/bycountry', {layout: 'hmde.handlebars', hmde_sub: 'bycountry', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/howmuchdoiemit/download', function(req, res) {
  res.render('hmde/download', {layout: 'hmde.handlebars', hmde_sub: 'download', is_en: app.get('is_en'), ln: app.get('lang')})
})

//routes wpmy
app.get('/whatpercentmaleareyou', function(req, res) {
  res.render('wpmy/intro', {layout: 'wpmy.handlebars', wpmy_sub: 'intro', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/whatpercentmaleareyou/tables', function(req, res) {
  res.render('wpmy/table', {layout: 'wpmy.handlebars', wpmy_sub: 'tables', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/whatpercentmaleareyou/graphs', function(req, res) {
  res.render('wpmy/graph', {layout: 'wpmy.handlebars', wpmy_sub: 'graphs', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/whatpercentmaleareyou/bycountry', function(req, res) {
  res.render('wpmy/bycountry', {layout: 'wpmy.handlebars', wpmy_sub: 'bycountry', is_en: app.get('is_en'), ln: app.get('lang')})
})
app.get('/whatpercentmaleareyou/download', function(req, res) {
  res.render('wpmy/download', {layout: 'wpmy.handlebars', wpmy_sub: 'download', is_en: app.get('is_en'), ln: app.get('lang')})
})

//slide-gen
app.get('/library/slide/gen', function(req, res) {
  res.render('library/slide_gen', {layout: 'library.handlebars', title: 'Slide Generator', is_en: app.get('is_en'), ln: app.get('lang')})
})


//language change //global
app.get('/change_language/:ln', function(req, res) {
  let ln_list = ['en', 'ko'], lnv = req.params.ln;
  if (ln_list.indexOf(lnv) >= 0) {
    if (lnv == 'en') app.set('is_en', true);
    else app.set('is_en', false);
    app.set('lang', lnv);
  } else {
    app.set('is_en', true);
    app.set('lang', 'en')
  }
  res.redirect('back');
})

//static directories
// app.use(express.static(__dirname + '/public'));

//route error handling
app.use(function(req, res) { //404 error
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found')
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-c to terminate...');
});