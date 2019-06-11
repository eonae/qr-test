'use strict';

const $video = document.querySelector('video');
const $info = document.getElementById('info');
const $startBtn = document.getElementById('start-btn');
const $stopBtn = document.getElementById('stop-btn');
const $nextCamBtn = document.getElementById('next-cam-btn');

let cameras = [];
let currentCamIndex = -1;

init();

async function init() {
  try {
    cameras = await getCameras();
    if (cameras.length === 0) {
      throw new Error('No cameras detected');
    }
    for (let cam of cameras) {
      print(JSON.stringify(cam));
    }
    $startBtn.addEventListener('click', () => {
      start();
    })
    $stopBtn.addEventListener('click', () => {
      stop();
    });
    $nextCamBtn.addEventListener('click', () => {
      start();
    });
    console.log('initialized successfully');
  }
  catch (e) {
    printError(e);
  }
}


async function start() {
  try {
    let nextDeviceId = getNextCameraId(); 
    print(nextDeviceId);
    const mediaConfig = {
      video: { deviceId: nextDeviceId },
      audio : false
    }
    const stream = await navigator.mediaDevices.getUserMedia(mediaConfig);
    handleSuccess(stream);
    print('stream is go');
    $startBtn.disabled = true;
    $stopBtn.disabled = false;
  } catch (e) {
    handleError(e);
  }
}

async function getCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(d => d.kind == 'videoinput');
}

function getNextCameraId() {
  let nextIndex = currentCamIndex + 1;
  if (cameras.length <= nextIndex) {
    nextIndex = 0;
  }
  const nextCamera = cameras[0];
  if (nextCamera) {
    currentCamIndex = nextIndex;
    return nextCamera.deviceId;
  } else {
    return null;
  }
}

function handleSuccess(stream) {
  const videoTracks = stream.getVideoTracks();
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