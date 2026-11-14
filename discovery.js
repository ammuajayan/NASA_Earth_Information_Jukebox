
// discovery.js - NASA/NOAA Datasets, Sonification & CD Player Audio Controls

const nasaEvents = [
  {
    id: 0,
    category: "ATMOSPHERE & GLOBAL TEMP",
    title: "2024 Global Heat & Ocean Warming Anomaly",
    date: "July 2024",
    coords: "0.00° N, 160.00° W (Pacific & Global)",
    satellite: "NASA Aqua / CERES & Terra",
    chord: [261.63, 329.63, 392.00, 493.88],
    narration: "Listen closely to the warmth of our oceans. In July 2024, NASA's Aqua and Terra satellites recorded Earth's warmest global surface temperatures in modern history. Rising ocean heat acts like a fever across the planet, energizing tropical storms and reshaping jet streams.",
    metrics: { tempAnomaly: "+1.35 °C", co2: "425.1 ppm", seaIce: "14.2 M km²", severity: "High" },
    timeline: [
      { year: "1980", val: 35, label: "0.35°C" },
      { year: "1995", val: 52, label: "0.52°C" },
      { year: "2010", val: 74, label: "0.74°C" },
      { year: "2020", val: 90, label: "1.02°C" },
      { year: "2024", val: 100, label: "1.35°C" }
    ]
  },
  {
    id: 1,
    category: "ATMOSPHERIC CARBON (NOAA)",
    title: "NOAA Mauna Loa CO₂ Peak Acceleration",
    date: "May 2024",
    coords: "19.54° N, 155.56° W (Hawaii, USA)",
    satellite: "NOAA GML & NASA OCO-2",
    chord: [293.66, 349.23, 440.00, 523.25],
    narration: "At the NOAA Mauna Loa Observatory in Hawaii, atmospheric carbon dioxide concentrations crossed a new milestone. Continuous monitoring proves how human industrial emissions continue to trap thermal energy in the troposphere, driving global climate shifts.",
    metrics: { tempAnomaly: "+1.28 °C", co2: "426.9 ppm", seaIce: "13.8 M km²", severity: "Critical" },
    timeline: [
      { year: "1980", val: 30, label: "338 ppm" },
      { year: "1995", val: 50, label: "360 ppm" },
      { year: "2010", val: 70, label: "390 ppm" },
      { year: "2020", val: 88, label: "414 ppm" },
      { year: "2024", val: 98, label: "426 ppm" }
    ]
  },
  {
    id: 2,
    category: "CRYOSPHERE & SEA ICE",
    title: "Antarctic Sea Ice Winter Minimum Retreat",
    date: "September 2024",
    coords: "75.25° S, 0.07° E (Antarctica)",
    satellite: "NASA ICESat-2 & Nimbus Archive",
    chord: [329.63, 392.00, 493.88, 587.33],
    narration: "At the bottom of the world, NASA's ICESat-2 laser altimeter measured Antarctic sea ice struggling to regrow during winter. Sea ice acts as Earth's bright white shield, reflecting sunlight back into space. As ice thins, dark oceans absorb more solar heat.",
    metrics: { tempAnomaly: "+2.10 °C (Polar)", co2: "424.0 ppm", seaIce: "16.5 M km² (Low)", severity: "Severe" },
    timeline: [
      { year: "1990", val: 95, label: "18.2M" },
      { year: "2000", val: 90, label: "17.9M" },
      { year: "2014", val: 98, label: "18.5M" },
      { year: "2020", val: 72, label: "16.8M" },
      { year: "2024", val: 55, label: "16.1M" }
    ]
  }
];

// Audio state
let isPlaying = false;
let audioCtx = null;
let activeOscillators = [];
let masterVolume = 0.7;
let narrationSpeed = 1.0;

// Play an individual scientific tone
function playTone(freq) {
  try {
    const tempCtx = new (window.AudioContext || window.webkitAudioContext)();

    if (tempCtx.state === "suspended") {
      tempCtx.resume();
    }

    const osc = tempCtx.createOscillator();
    const gain = tempCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, tempCtx.currentTime);

    gain.gain.setValueAtTime(0.001, tempCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.001, masterVolume * 0.1),
      tempCtx.currentTime + 0.1
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      tempCtx.currentTime + 1.2
    );

    osc.connect(gain);
    gain.connect(tempCtx.destination);

    osc.start();
    osc.stop(tempCtx.currentTime + 1.2);

    osc.onended = () => tempCtx.close();

  } catch (error) {
    console.error("Tone playback error:", error);
  }
}

// Text narration
function speakText(text) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = narrationSpeed;
  utterance.pitch = 1.05;

  window.speechSynthesis.speak(utterance);
}

// Play selected event narration and musical tones
function playMelodiousNarration(ev) {
  if (!ev) return;

  stopMelodiousAudio();

  isPlaying = true;
  updatePlayerUI(true);

  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const masterGain = audioCtx.createGain();

    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(
      Math.max(0.001, masterVolume * 0.08),
      audioCtx.currentTime + 1.5
    );

    masterGain.connect(audioCtx.destination);

    ev.chord.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();

      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      osc.connect(masterGain);
      osc.start();

      activeOscillators.push(osc);
    });

  } catch (error) {
    console.warn("Web Audio error:", error);
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(ev.narration);

    utterance.rate = narrationSpeed;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      stopMelodiousAudio();
    };

    utterance.onerror = () => {
      stopMelodiousAudio();
    };

    window.speechSynthesis.speak(utterance);
  }
}

// Stop all audio
function stopMelodiousAudio() {
  isPlaying = false;

  updatePlayerUI(false);

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  activeOscillators.forEach(osc => {
    try {
      osc.stop();
    } catch (error) {}
  });

  activeOscillators = [];

  if (audioCtx) {
    try {
      audioCtx.close();
    } catch (error) {}

    audioCtx = null;
  }
}

// Update player interface
function updatePlayerUI(playing) {
  const btn = document.getElementById("btn-play-pause");
  const badge = document.getElementById("now-playing-badge");
  const eq = document.getElementById("equalizer");
  const cdDisk = document.getElementById("cd-disk");
  const toneArm = document.getElementById("tone-arm");

  if (btn) btn.textContent = playing ? "⏸" : "▶";

  if (badge) {
    badge.textContent = playing
      ? "NARRATING & SONIFYING"
      : "READY TO PLAY";
  }

  if (eq) eq.classList.toggle("playing", playing);
  if (cdDisk) cdDisk.classList.toggle("spinning", playing);
  if (toneArm) toneArm.classList.toggle("engaged", playing);
}

// Update volume
function setMasterVolume(value) {
  masterVolume = Math.max(0, Math.min(1, Number(value) || 0));
}

// Update narration speed
function setNarrationSpeed(value) {
  narrationSpeed = Math.max(0.5, Math.min(2, Number(value) || 1));
}

// Make functions and data accessible to app.js and HTML buttons
window.nasaEvents = nasaEvents;
window.playTone = playTone;
window.speakText = speakText;
window.playMelodiousNarration = playMelodiousNarration;
window.stopMelodiousAudio = stopMelodiousAudio;
window.setMasterVolume = setMasterVolume;
window.setNarrationSpeed = setNarrationSpeed;

// Share audio state with app.js
Object.defineProperty(window, "isPlaying", {
  configurable: true,
  get: () => isPlaying
});

Object.defineProperty(window, "masterVolume", {
  configurable: true,
  get: () => masterVolume
});

Object.defineProperty(window, "narrationSpeed", {
  configurable: true,
  get: () => narrationSpeed
});
