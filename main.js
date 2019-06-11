'use strict';

const mediaConfig = {
  video: { facingMode: { exact: 'front' } },
  audio : false
}

const $video = document.querySelector('video');
const $info = document.getElementById('info');
const $startBtn = document.getElementById('start-btn');
const $stopBtn = document.getElementById('stop-btn');

$startBtn.addEventListener('click', () => start());
$stopBtn.addEventListener('click', () => stop());

async function start() {
  try {
    const cameras = await navigator.mediaDevices.enumerateDevices();
    for (let cam of cameras) {
      print(cam.label ? cam.label : 'no label for device');
    }
    const stream = await navigator.mediaDevices.getUserMedia(mediaConfig);
    handleSuccess(stream);
    $startBtn.disabled = true;
    $stopBtn.disabled = false;
  } catch (e) {
    handleError(e);
  }
}

function handleSuccess(stream) {
  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', mediaConfig);
  console.log(`Using video device: ${videoTracks[0].label}`);
  $video.srcObject = stream;
}

function handleError(error) {
  printError(error);
}

function stop() {
  $video.srcObject = null;
  $startBtn.disabled = false;
  $stopBtn.disabled = true;
}




function print(message, isError = false) {
  const $message = document.createElement('DIV');
  if (isError) {
    $message.classList.add('error-msg');
  }
  $message.textContent = message;
  $info.appendChild($message);
}

function printError(error) {
  print(error.message, true);
}


