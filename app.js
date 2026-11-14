
const startBtn = document.getElementById("startBtn");
const missionMessage = document.getElementById("missionMessage");

const yearSlider = document.getElementById("yearSlider");
const yearLabel = document.getElementById("yearLabel");

const temperatureValue = document.getElementById("temperatureValue");
const co2Value = document.getElementById("co2Value");
const iceValue = document.getElementById("iceValue");
const timelineMessage = document.getElementById("timelineMessage");

const soundBtn = document.getElementById("soundBtn");
const soundStatus = document.getElementById("soundStatus");
const soundWave = document.getElementById("soundWave");

// Demonstration dataset (illustrative, not measured NASA data)
const climateData = {
    2000: { temp: 0.42, co2: 369, ice: 6.8 },
    2005: { temp: 0.55, co2: 379, ice: 6.5 },
    2010: { temp: 0.70, co2: 390, ice: 6.3 },
    2015: { temp: 0.90, co2: 401, ice: 5.8 },
    2020: { temp: 1.02, co2: 414, ice: 5.5 },
    2025: { temp: 1.20, co2: 425, ice: 5.1 }
};

function getData(year) {
    const years = Object.keys(climateData).map(Number);

    let lower = years[0];
    let upper = years[years.length - 1];

    for (let i = 0; i < years.length - 1; i++) {
        if (year >= years[i] && year <= years[i + 1]) {
            lower = years[i];
            upper = years[i + 1];
            break;
        }
    }

    const ratio = (year - lower) / (upper - lower);
    const first = climateData[lower];
    const second = climateData[upper];

    return {
        temp: first.temp + (second.temp - first.temp) * ratio,
        co2: first.co2 + (second.co2 - first.co2) * ratio,
        ice: first.ice + (second.ice - first.ice) * ratio
    };
}

// Update the dashboard
function updateDashboard() {
    const year = Number(yearSlider.value);
    const data = getData(year);

    yearLabel.textContent = year;

    temperatureValue.textContent =
        "+" + data.temp.toFixed(2) + "°C";

    co2Value.textContent =
        Math.round(data.co2) + " ppm";

    iceValue.textContent =
        data.ice.toFixed(1) + " M km²";

    timelineMessage.textContent =
        "Exploring " + year +
        ": temperature anomaly " + data.temp.toFixed(2) +
        "°C, CO₂ " + Math.round(data.co2) +
        " ppm, and sea ice indicator " + data.ice.toFixed(1) +
        " million km². These are illustrative demo values.";
}

// Mission start button
startBtn.addEventListener("click", () => {
    missionMessage.textContent =
        "🚀 Mission activated! Welcome, Earth Explorer.";

    startBtn.textContent = "MISSION ACTIVE ✓";

    document.getElementById("explorer").scrollIntoView({
        behavior: "smooth"
    });
});

// Year slider
yearSlider.addEventListener("input", updateDashboard);

// Audio controls
let audioContext = null;
let oscillator = null;
let gainNode = null;
let isPlaying = false;

async function playEarthSound() {
    const year = Number(yearSlider.value);
    const data = getData(year);

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        soundStatus.textContent =
            "Audio is not supported in this browser.";
        return;
    }

    try {
        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        await audioContext.resume();

        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();

        // Map demonstration CO2 data to an audible frequency.
        const frequency = 180 + (data.co2 - 369) * 2;

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.12,
            audioContext.currentTime + 0.15
        );

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();

        isPlaying = true;
        soundBtn.textContent = "■ STOP EARTH SOUND";
        soundStatus.textContent =
            "PLAYING DEMO SONIFICATION · " + year;

        soundWave.classList.add("playing");

    } catch (error) {
        console.error(error);
        soundStatus.textContent =
            "Unable to start audio. Please try again.";
    }
}

async function stopEarthSound() {
    if (!oscillator || !audioContext) return;

    try {
        gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        gainNode.gain.setTargetAtTime(
            0.0001,
            audioContext.currentTime,
            0.03
        );

        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        console.warn("Audio already stopped.", error);
    }

    oscillator = null;
    gainNode = null;
    isPlaying = false;

    soundBtn.textContent = "▶ PLAY EARTH SOUND";
    soundStatus.textContent = "READY TO GENERATE SOUND";
    soundWave.classList.remove("playing");
}

soundBtn.addEventListener("click", async () => {
    if (isPlaying) {
        await stopEarthSound();
    } else {
        await playEarthSound();
    }
});

// Initial dashboard
updateDashboard();
