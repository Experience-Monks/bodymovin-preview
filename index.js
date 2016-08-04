'use strict';
import domready from 'domready';
import ColorPicker from 'simple-color-picker';
import Tween from 'gsap';
import anim from './animation.js';
var Animation = new anim();

domready(function() {

  disableButtons();
  if (window.animData) {createAnimation();}

  var intervalwd = null;

  var colorPicker = new ColorPicker({
    color: '#498f8b',
    background: '#737373',
    el: document.getElementById('color'),
  });

  var progressbar = document.getElementById('progress-bar');
  var progressframes = document.getElementById('progress-frames');
  var progresstime = document.getElementById('progress-time');
  var stepBWDBtn = document.getElementById('step-bwd');
  var stepFWDBtn = document.getElementById('step-fwd');
  var speedFld = document.getElementById('speed');
  var framesFld = document.getElementById('frames');
  var hexColorFld = document.getElementById('color-hex');
  var rColorFld = document.getElementById('color-r');
  var gColorFld = document.getElementById('color-g');
  var bColorFld = document.getElementById('color-b');

  //ANIMATION FUNCTIONSvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  function createAnimation() {
    Animation.destroy();
    Animation.create();
    enableButtons();
    progressbar.max = Animation.getTotalFrames() - 1;
    Animation.onFrameChange(function(currentFrame, frameRate) {
      progressbar.value = currentFrame;
      progressframes.value = currentFrame;
      // var secondsRaw = currentFrame / frameRate;
      // var miliseconds = (secondsRaw * 1000 % 1000).toFixed(0);
      // var seconds = Math.trunc((secondsRaw % 60));
      // var minutes = Math.trunc((secondsRaw / 60));
      progresstime.value = ((currentFrame / frameRate) * 1000).toFixed(0);//(minutes + ":" + seconds + ":" + miliseconds);
    });
    Animation.onPlayChange(function(playState) {
      var playSpn = document.getElementById('play-spn');
      var pauseSpn = document.getElementById('pause-spn');
      if (playState) {
        playSpn.className = '';
        pauseSpn.className = 'out-left';
      }else {
        playSpn.className = 'out-right';
        pauseSpn.className = '';
      }
    });
  };
  function setAnimation(e, file) {
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
  };
  //BODY EVENTS FUNCTIONSvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  function bodyDrop(e) {
    e.preventDefault();
    document.body.style.backgroundColor = colorPicker.getHexString();
    setAnimation(e, e.dataTransfer.files[0]);
  };
  function bodyDragOver(e) {
    e.preventDefault();
    document.body.style.backgroundColor = '#eeeeee';
  };
  function bodyDragOut(e) {
    e.preventDefault();
    document.body.style.backgroundColor = colorPicker.getHexString();
  };
  //FILE MANAGING BUTTONS EVENTS FUNCTIONSvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  function versionBtnClick(e) {
    e.preventDefault();
    var version = prompt("Please enter the github hash for bodymovin:",document.getElementById('v').value || 'master');
    if (version) window.location.href = "?v="+version;
  };
  function shareBtnClick(e) {
    e.preventDefault();
    if (!window.deep && window.animData) {
      document.getElementById('d').value = JSON.stringify(window.animData);
      document.getElementById('save').submit();
    };
  };
  function browseBtnClick(e) {
    e.preventDefault();
    document.getElementById('file-input').click();
  };
  function fileInptChange(e) {
    e.preventDefault();
    console.log('click');
    setAnimation(e, e.target.files[0]);
    e.target.value = "";
  };
  function removeBtnClick(e) {
    e.preventDefault();
    Animation.destroy();
    disableButtons();
    window.animData = null;
  };
  //ANIMATION CONTROL BUTTONS EVENTS FUNCTIONSvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  function disableButtons() {
    let disable = document.getElementsByClassName('disable');
    [...disable].map(function(item) {
      item.removeAttribute("enabled");
      item.setAttribute("disabled", "true");
      if (item.tagName === "INPUT") {
        item.value = item.defaultValue;
      };
    });
  };
  function enableButtons() {
    let enable = document.getElementsByClassName('disable');
    [...enable].map(function(item) {
      item.removeAttribute("disabled");
      item.setAttribute("enabled", "true");
    });
  };
  function playPauseBtnClick(e) {
    e.preventDefault();
    Animation.togglePlay();
  };
  function stopBtnClick(e) {
    e.preventDefault();
    Animation.stop();
  };
  function speedFldInput(e) {
    e.preventDefault();
    Animation.setSpeed(speedFld.valueAsNumber ? speedFld.valueAsNumber : 1);
  };
  function framesFldInput(e) {
    e.preventDefault();
    Animation.setFrames(framesFld.valueAsNumber ? framesFld.valueAsNumber : 1);
  };
  function stepBWDBtnMouseDown(e) {
    e.preventDefault();
      Animation.step(false, true);
      intervalwd = setInterval(function() {Animation.step(false, true)},110);
  };
  function stepFWDBtnMouseDown(e) {
    e.preventDefault();
      Animation.step(true, true);
      intervalwd = setInterval(function() {Animation.step(true, true)},110);
  };
  function stopIntervalStepBtns(stepBtn) {
    var mouseEvents = [ 'mouseout', 'mouseup' ];
    mouseEvents.map(ev => {
      stepBtn.addEventListener(ev, function(e) {
        e.preventDefault();
        clearInterval(intervalwd);
      });
    });
  };
  function progressBarMouseDown(e) {
    Animation.pause();
  };
  function progressBarInput(e) {
      Animation.goToAndStop(progressbar.valueAsNumber, true);
  };
  function progressFramesChange(e) {
    Animation.goToAndStop(parseInt(progressframes.value ? progressframes.value : 0), true);
  };
  function progressTimeChange(e) {
    Animation.goToAndStop(parseInt(progresstime.value ? progresstime.value : 0), false);
  };
  colorPicker.onChange(() => {
    var hexColor = colorPicker.getHexString();
    var rgbColor = colorPicker.getRGB();
    document.body.style.backgroundColor = hexColor;
    hexColorFld.value = hexColor;
    rColorFld.value = rgbColor.r;
    gColorFld.value = rgbColor.g;
    bColorFld.value = rgbColor.b;
  });
  function hexColorFldChange(e) {
    colorPicker.setColor(hexColorFld.value);
  };
  function rgbColorFldChange(e) {
    var valToHex = (v) => parseInt(v).toString(16);
    colorPicker.setColor('#' + valToHex(rColorFld.value) + valToHex(gColorFld.value) + valToHex(bColorFld.value));
  };
  function reverseCheckChange(e) {
    Animation.setDirection(e.target.checked ? -1 : 1);
  }



  document.body.addEventListener('drop', bodyDrop);
  document.body.addEventListener('dragover', bodyDragOver);
  document.body.addEventListener('dragout', bodyDragOut);
  document.getElementById('anim-wrap').addEventListener('click', playPauseBtnClick);
  document.getElementById('version').addEventListener('click', versionBtnClick);
  document.getElementById('share').addEventListener('click', shareBtnClick);
  document.getElementById('browse').addEventListener('click',browseBtnClick);
  document.getElementById('file-input').addEventListener('change', fileInptChange);
  document.getElementById('remove').addEventListener('click', removeBtnClick);
  document.getElementById('play-pause').addEventListener('click', playPauseBtnClick);
  document.getElementById('stop').addEventListener('click', stopBtnClick);
  document.getElementById('reverse').addEventListener('change', reverseCheckChange);
  speedFld.addEventListener('input', speedFldInput);
  framesFld.addEventListener('input', framesFldInput);
  progressbar.addEventListener('mousedown', progressBarMouseDown);
  progressbar.addEventListener('input', progressBarInput);
  stepBWDBtn.addEventListener('mousedown', stepBWDBtnMouseDown);
  stopIntervalStepBtns(stepBWDBtn);
  stepFWDBtn.addEventListener('mousedown', stepFWDBtnMouseDown);
  stopIntervalStepBtns(stepFWDBtn);
  progressframes.addEventListener('change', progressFramesChange);
  progresstime.addEventListener('change', progressTimeChange);
  hexColorFld.addEventListener('change', hexColorFldChange);
  rColorFld.addEventListener('change', rgbColorFldChange);
  gColorFld.addEventListener('change', rgbColorFldChange);
  bColorFld.addEventListener('change', rgbColorFldChange);
});
