const powerKnob = document.getElementById("powerKnob");
const powerLed  = document.getElementById("powerLed");
const screenInner = document.getElementById("screenInner");

let isPowered = false;
let isStarting = false;

// White noise
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function createWhiteNoiseBuffer() {
  const sampleRate = audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, sampleRate, sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < sampleRate; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  return buffer;
}
function playWhiteNoise() {
  const noiseBuffer = createWhiteNoiseBuffer();
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);

  noiseSource.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  noiseSource.start();
  noiseSource.stop(audioCtx.currentTime + 1);
}

powerKnob.addEventListener("click", () => {
  if (!isStarting) {
    isStarting = true;
    // Immediately change power state => LED changes color
    isPowered = !isPowered;
    updateScreen();

    // Show static for 1 second
    playWhiteNoise();
    const staticOverlay = document.createElement("div");
    staticOverlay.classList.add("static");
    screenInner.appendChild(staticOverlay);

    setTimeout(() => {
      screenInner.removeChild(staticOverlay);
      isStarting = false;
    }, 1000);
  }
});

function updateScreen() {
  // Remove old overlays
  const oldScanlines = screenInner.querySelector(".scanlines");
  if (oldScanlines) oldScanlines.remove();

  const oldContent = screenInner.querySelector(".screen-content");
  if (oldContent) oldContent.remove();

  if (isPowered) {
    powerLed.classList.add("led--on");
    const scan = document.createElement("div");
    scan.classList.add("scanlines");
    screenInner.appendChild(scan);
    const content = document.createElement("div");
    content.classList.add("screen-content");
    content.textContent = "";
    screenInner.appendChild(content);
  } else {
    powerLed.classList.remove("led--on");
  }
}
updateScreen(); // Start with TV off
