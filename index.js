'use strict';
import domready from 'domready';
import anim from './animation.js';
var Animation = new anim();

domready(function() {

  var animation = null;
  var intervalwd = null;
  var slideFlag = true;

  var progressbar = document.getElementById('progress');
  var progressframes = document.getElementById('progress-frames');
  var stepBWDBtn = document.getElementById('step-bwd');
  var stepFWDBtn = document.getElementById('step-fwd');

  function createAnimation() {
    Animation.create();
    progress.max = Animation.getTotalFrames();
    Animation.onFrameChange(function(currentFrame) {
      progress.value = currentFrame;
      progressframes.innerHTML = currentFrame;
    });
  }
  function stopInterval(button) {
    var mouseEvents = [ 'mouseout', 'mouseup' ];
    mouseEvents.map(ev => {
      button.addEventListener(ev, function(e) {
        e.preventDefault();
        if (Animation.exists()) clearInterval(intervalwd);
      });
    })
  }

  progress.addEventListener('mousedown', function(e) {
    Animation.setFrameChangeFlag(false);
    Animation.pause();
  });
  progress.addEventListener('input', function(e) {
      Animation.goToAndStop(progress.valueAsNumber, true);
      progressframes.innerHTML = progress.value;
  });
  progress.addEventListener('mouseup', function(e) {
    Animation.setFrameChangeFlag(true);
  });

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
        createAnimation();
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
    var version = prompt("Please enter the github hash for bodymovin:",document.getElementById('v').value || 'master');
    if (version) window.location.href = "?v="+version;
  });
  if (window.animData) Animation.create();
  document.getElementById('play-pause').addEventListener('click',function(e) {
    e.preventDefault();
    Animation.togglePlay()
  });
  document.getElementById('stop').addEventListener('click',function(e) {
    e.preventDefault();
    Animation.stop();
  });
  //FIX!!!!VVVV
  document.getElementById('speed').addEventListener('change',function(e) {
    e.preventDefault();
    Animation.setSpeed(document.getElementById('speed').valueAsNumber);
  });
  document.getElementById('frames').addEventListener('change',function(e) {
    e.preventDefault();
    console.log('change');
    Animation.setFrames(document.getElementById('frames').valueAsNumber);
  });
  stepFWDBtn.addEventListener('mousedown',function(e) {
    e.preventDefault();
    if (Animation.exists()) {
      Animation.step(true, true);
      intervalwd = setInterval(function() {Animation.step(true, true)},110);
    }
  });
  stopInterval(stepFWDBtn);
  stepBWDBtn.addEventListener('mousedown',function(e) {
    e.preventDefault();
    if (Animation.exists()) {
      Animation.step(false, true);
      intervalwd = setInterval(function() {Animation.step(false, true)},110);
    };
  });
  stopInterval(stepBWDBtn);
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
        createAnimation();
      }
    }
    reader.readAsText(file);
  });
  document.getElementById('remove').addEventListener('click',function(e) {
    e.preventDefault();
    Animation.destroy();
  });

});
