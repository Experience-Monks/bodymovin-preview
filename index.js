'use strict';
var domready = require('domready');

domready(function() {
  function createAnim() {
    bodymovin.loadAnimation({
      wrapper: document.getElementById('anim'),
      animType: 'svg',
      loop: true,
      autoplay: true,
      animationData: JSON.parse(JSON.stringify(animData))
    });
  }

  document.body.addEventListener('drop',function(e) {
    e.preventDefault();
    document.body.style.backgroundColor = '#999999';
    var file = e.dataTransfer.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      window.animData = JSON.parse(e.target.result);
      if (window.animData) {
        window.deep = false;
        createAnim();
      }
    }
    reader.readAsText(file);
  });
  document.body.addEventListener('dragover',function(e) {
    e.preventDefault();
    document.body.style.backgroundColor = '#eeeeee';
  });
  document.body.addEventListener('dragout',function(e) {
    e.preventDefault();
    document.body.style.backgroundColor = '#999999';
  });
  document.getElementById('share').addEventListener('click',function(e) {
    e.preventDefault();
    if (!window.deep && window.animData) {
      document.getElementById('d').value = JSON.stringify(window.animData);
      document.getElementById('save').submit();
    }
  });
  document.getElementById('version').addEventListener('click',function(e) {
    e.preventDefault();
    version = prompt("Please enter the github hash for bodymovin:",document.getElementById('v').value || 'master');
    if (version) window.location.href = "?v="+version;
  });
  if (window.animData) createAnim();
});
