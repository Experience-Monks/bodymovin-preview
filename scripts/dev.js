'use strict';
var path = require('path');
var config = require('./config');
var budo = require('budo');
var style = require('./style');
var copy = require('./copy');
var fs = require('fs');

process.env.NODE_ENV = config.type;
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
