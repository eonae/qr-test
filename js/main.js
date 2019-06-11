'use strict';

import "babel-polyfill";
import { print, printError } from './print.js';
import QrScanner from "qr-scanner";

const $video = document.querySelector('video');
const $scanBtn = document.getElementById('scan-btn');
const $cancelBtn = document.getElementById('cancel-btn');

let cameras = [];
let currentCamIndex = -1;

init();

async function init() {
  try {
    cameras = await getCameras();
    if (cameras.length === 0) {
      throw new Exception('No cameras detected');
    }
    for (let cam of cameras) {
      print(JSON.stringify(cam));
    }
    $scanBtn.addEventListener('click', () => {
      start();
    });
    $cancelBtn.addEventListener('click', () => {
      stop();
    })
    console.log('initialized successfully');
  }
  catch (e) {
    printError(e);
  }
}


async function start() {
  try {
    $scanBtn.disabled = true;
    let nextDeviceId = getNextCameraId();
    print(nextDeviceId);
    const mediaConfig = {
      video: { facingMode: 'environment' },
      audio : false
    }
    const stream = await navigator.mediaDevices.getUserMedia(mediaConfig);
    handleSuccess(stream);
    print('stream is go');
    const scanner = new QrScanner($video, result => {
      print(result);
      scanner.destroy();
      stop();
    });
    scanner.start();
    $scanBtn.classList.add('hidden');
    $cancelBtn.classList.remove('hidden');
  } catch (e) {
    $scanBtn.disabled = false;
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
  const nextCamera = cameras[nextIndex];
  if (nextCamera) {
    currentCamIndex = nextIndex;
    print(currentCamIndex);
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
  $cancelBtn.classList.add('hidden');
  $scanBtn.classList.remove('hidden');
  $scanBtn.disabled = false;
}