'use strict';
var path = require('path');
var config = require('./config');
var budo = require('budo');
var style = require('./style');
var copy = require('./copy');
var fs = require('fs');
var express = require('express');
var app = express();
var formidable = require('formidable');
var cors = require('cors')

// process.env.NODE_ENV = config.type;
process.env.ASSET_PATH = config.ASSET_PATH;


var b = budo(config.entry, {
  serve: config.bundle,
  open: true,
  dir: ['./app','./.tmp'],
  stream: process.stdout
});
b.live();
b.watch(['**/*.{php,html,css,less,scss}',config.raw+'**/*.*']);
b.on('watch',function(e,file) {
  if (file.indexOf(path.basename(config.raw))>-1 || file.indexOf(path.basename(config.app))>-1) {
    copy(file);
  } else if (file.indexOf('.less')>-1 || file.indexOf('.scss')>-1) {
    style(function() {
      b.reload('main.css');
    });
  } else {
    b.reload(file);
  }
});
b.on('pending',b.reload.bind(b));
b.on('update',function(bundle) {
  fs.writeFile(path.join(config.output, 'bundle.js'), bundle, function(err) {
    if (err) {
      console.log(err);
    }
  });
  b.reload(config.bundle);
});

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', function(req, res){

  var form = new formidable.IncomingForm();

  form.multiples = true;

  form.uploadDir = path.join(__dirname, '../app/images');

  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  form.on('end', function() {
    res.end('Image upload successful');
  });

  form.parse(req);

});

var server = app.listen(3000, function(){
  console.log(' > upload server is runing');
});
