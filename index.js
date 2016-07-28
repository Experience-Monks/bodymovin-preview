'use strict';
var domready = require('domready');

domready(function() {

  var animation = null;
  var frames = 1;
  var intervalwd = null;

  function createAnim() {
    if (animation) animation.destroy();
    animation = bodymovin.loadAnimation({
      wrapper: document.getElementById('anim'),
      animType: 'svg',
      loop: true,
      autoplay: false,
      animationData: JSON.parse(JSON.stringify(animData))
    });

    var progressbar = document.getElementById('progress');
    var progressframes = document.getElementById('progress-frames');

    progress.max = animation.totalFrames;
    progress.addEventListener('mousedown', function(e){
      animation.pause();
    });
    progress.addEventListener('input', function(e){
      animation.goToAndStop(progress.valueAsNumber, true);
      progressframes.innerHTML = progress.value;
    });
    animation.addEventListener('enterFrame', function(e) {
        progress.value = animation.currentFrame.toFixed(0);
        progressframes.innerHTML = animation.currentFrame.toFixed(0);
    });
  }

  document.body.addEventListener('drop',function(e) {
    e.preventDefault();
    document.body.style.backgroundColor = '#999999';
    var file = e.dataTransfer.files[0];
    if (!file) {
      return;
    };
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
    animation.stop();
    if (!window.deep && window.animData) {
      document.getElementById('d').value = JSON.stringify(window.animData);
      document.getElementById('save').submit();
    }
  });
  document.getElementById('version').addEventListener('click',function(e) {
    e.preventDefault();
    var version = prompt("Please enter the github hash for bodymovin:",document.getElementById('v').value || 'master');
    if (version) window.location.href = "?v="+version;
  });
  if (window.animData) createAnim();
  document.getElementById('play-pause').addEventListener('click',function(e) {
    console.log(animation);
    e.preventDefault();
    if (animation) animation.isPaused ? animation.play() : animation.pause();
  });
  document.getElementById('stop').addEventListener('click',function(e) {
    e.preventDefault();
    if (animation) animation.stop();
  });
  document.getElementById('speed').addEventListener('click',function(e) {
    e.preventDefault();
    if (animation) animation.setSpeed(parseInt(prompt("Please enter the github hash for bodymovin:", animation.playSpeed)));
  });
  document.getElementById('frames').addEventListener('click',function(e) {
    e.preventDefault();
    if (animation) frames = parseInt(prompt("Please enter the github hash for bodymovin:", frames));
  });
  document.getElementById('step-fwd').addEventListener('mousedown',function(e) {
    e.preventDefault();
    if (animation) {
      animation.goToAndStop(((animation.currentFrame + frames) % animation.totalFrames), true);
      intervalwd = setInterval(function() {animation.goToAndStop(((animation.currentFrame + frames) % animation.totalFrames), true)},110);
    }
  });
  document.getElementById('step-fwd').addEventListener('mouseup',function(e) {
    e.preventDefault();
    if (animation) clearInterval(intervalwd);
  });
  document.getElementById('step-bwd').addEventListener('mousedown',function(e) {
    e.preventDefault();
    if (animation) {
      animation.goToAndStop(((animation.currentFrame - frames) % animation.totalFrames), true);
      intervalwd = setInterval(function() {animation.goToAndStop(((animation.currentFrame - frames) % animation.totalFrames), true)},110);
    }
  });
  document.getElementById('step-bwd').addEventListener('mouseup',function(e) {
    e.preventDefault();
    if (animation) clearInterval(intervalwd);
  });
  document.getElementById('browse').addEventListener('click',function(e) {
    e.preventDefault();
    document.getElementById('file-input').click();
  });
  document.getElementById('file-input').addEventListener('change',function(e) {
    e.preventDefault();
    var file = e.target.files[0];
    if (!file) {
      return;
    };
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

});
