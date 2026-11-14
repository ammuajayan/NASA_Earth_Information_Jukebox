// app.js - State Management, Navigation, and Interactive Views
let currentEventIndex = 0;
let currentTab = "f1";
let currentSeason = "spring";

window.goToStage = function(stageId) {
  ["stage-landing", "stage-3d", "stage-jukebox", "stage-astronauts"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });
  const target = document.getElementById(stageId);
  if (target) {
    target.classList.add("active");
    if (stageId === "stage-3d" && !earth3DInitialized) {
      init3DEarth();
      earth3DInitialized = true;
    }
    if (stageId === "stage-astronauts") {
      renderAstronautCards();
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const btnExplore = document.getElementById("btn-explore");
  if (btnExplore) btnExplore.addEventListener("click", () => goToStage("stage-3d"));

  const btnToJukebox = document.getElementById("btn-to-jukebox");
  if (btnToJukebox) {
    btnToJukebox.addEventListener("click", () => {
      goToStage("stage-jukebox");
      renderPlaylist();
      selectEvent(0, false);
    });
  }

  const btnBack3D = document.getElementById("btn-back-3d");
  if (btnBack3D) {
    btnBack3D.addEventListener("click", () => {
      stopMelodiousAudio();
      goToStage("stage-3d");
    });
  }
});

function renderPlaylist() {
  const container = document.getElementById("playlist-container");
  if (!container) return;
  container.innerHTML = nasaEvents.map((ev, idx) => `
    <div class="track-card ${idx === currentEventIndex ? 'active' : ''}" onclick="selectEvent(${idx}, true)">
      <div class="track-card-top">
        <span>TRACK 0${idx + 1} • ${ev.category}</span>
        <span>${ev.date}</span>
      </div>
      <h4>${ev.title}</h4>
      <p>${ev.satellite}</p>
    </div>
  `).join("");
}

window.selectEvent = function(index, autoPlay = true) {
  currentEventIndex = index;
  const ev = nasaEvents[index];
  document.getElementById("deck-title").textContent = ev.title;
  document.getElementById("deck-coords").textContent = `📍 ${ev.coords}`;
  renderPlaylist();
  renderFeatureTab(currentTab);
  if (autoPlay) playMelodiousNarration(ev);
};

// Jukebox Controls
document.getElementById("btn-play-pause").addEventListener("click", () => {
  if (isPlaying) stopMelodiousAudio();
  else playMelodiousNarration(nasaEvents[currentEventIndex]);
});
document.getElementById("btn-stop").addEventListener("click", stopMelodiousAudio);
document.getElementById("btn-next").addEventListener("click", () => selectEvent((currentEventIndex + 1) % nasaEvents.length, true));
document.getElementById("btn-prev").addEventListener("click", () => selectEvent((currentEventIndex - 1 + nasaEvents.length) % nasaEvents.length, true));

document.getElementById("volume-slider").addEventListener("input", (e) => {
  masterVolume = parseFloat(e.target.value);
  document.getElementById("vol-val").textContent = `${Math.round(masterVolume * 100)}%`;
});

document.getElementById("speed-slider").addEventListener("input", (e) => {
  narrationSpeed = parseFloat(e.target.value);
  document.getElementById("speed-val").textContent = `${narrationSpeed.toFixed(2)}x`;
});

// Tabs
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTab = btn.getAttribute("data-tab");
    renderFeatureTab(currentTab);
  });
});

window.setSeasonView = function(season) {
  currentSeason = season;
  renderFeatureTab("f7");
};

function renderFeatureTab(tabId) {
  const viewport = document.getElementById("feature-viewport");
  const ev = nasaEvents[currentEventIndex];
  if (!viewport) return;

  switch (tabId) {
    case "f1":
      viewport.innerHTML = `
        <span class="badge">${ev.category}</span>
        <h2>${ev.title}</h2>
        <p style="color: var(--text-dim); margin-top: 4px;">Observed by <strong>${ev.satellite}</strong> • ${ev.date}</p>
        <div class="narration-script">“${ev.narration}”</div>
        <button class="primary-btn" onclick="playMelodiousNarration(nasaEvents[${ev.id}])">♪ Play Audio Narration</button>
        <div class="card-grid">
          <div class="data-box"><h4>NASA TEMP ANOMALY</h4><div class="big-val">${ev.metrics.tempAnomaly}</div></div>
          <div class="data-box"><h4>NOAA CO₂ LEVEL</h4><div class="big-val">${ev.metrics.co2}</div></div>
          <div class="data-box"><h4>SEA-ICE EXTENT</h4><div class="big-val">${ev.metrics.seaIce}</div></div>
        </div>
      `;
      break;
    case "f2":
      viewport.innerHTML = `
        <h2>2. Scientific Data Sonification Synthesizer</h2>
        <p style="color: var(--text-dim);">Actual Earth telemetry translated into harmonious musical frequencies.</p>
        <div class="card-grid">
          ${ev.chord.map((freq, idx) => `
            <div class="data-box" style="text-align:center;">
              <h4>TELEMETRY FREQ ${idx + 1}</h4>
              <div class="big-val">${freq} Hz</div>
              <button class="ghost-btn" style="margin-top:10px;" onclick="playTone(${freq})">▶ Audition Tone</button>
            </div>
          `).join("")}
        </div>
      `;
      break;
    case "f3":
      viewport.innerHTML = `
        <h2>3. NASA Global Surface Temperature Data</h2>
        <p style="color: var(--text-dim);">Analyzing multi-decadal global temperature anomalies.</p>
        <div class="card-grid" style="margin-top:16px;">
          <div class="data-box"><h4>CURRENT ANOMALY</h4><div class="big-val" style="color:var(--yellow);">${ev.metrics.tempAnomaly}</div></div>
          <div class="data-box"><h4>SEVERITY INDEX</h4><div class="big-val" style="color:var(--cyan);">${ev.metrics.severity}</div></div>
        </div>
      `;
      break;
    case "f4":
      viewport.innerHTML = `
        <h2>4. NOAA Mauna Loa Atmospheric CO₂</h2>
        <p style="color: var(--text-dim);">Direct atmospheric sampling tracking carbon accumulation.</p>
        <div class="card-grid" style="margin-top:16px;">
          <div class="data-box"><h4>RECORDED CONCENTRATION</h4><div class="big-val" style="color:var(--cyan);">${ev.metrics.co2}</div></div>
          <div class="data-box"><h4>ANNUAL GROWTH RATE</h4><div class="big-val">+2.8 ppm/yr</div></div>
        </div>
      `;
      break;
    case "f5":
      viewport.innerHTML = `
        <h2>5. Polar Sea-Ice Extent & Cryosphere</h2>
        <p style="color: var(--text-dim);">Continuous passive microwave satellite monitoring of polar ice caps.</p>
        <div class="card-grid" style="margin-top:16px;">
          <div class="data-box"><h4>RECORDED EXTENT</h4><div class="big-val" style="color:var(--yellow);">${ev.metrics.seaIce}</div></div>
          <div class="data-box"><h4>DECADAL DECLINE</h4><div class="big-val">-12.6% / decade</div></div>
        </div>
      `;
      break;
    case "f6":
      const points = ev.timeline.map((t, idx) => {
        const x = 50 + idx * 130;
        const y = 180 - (t.val / 100) * 130;
        return `${x},${y}`;
      }).join(" ");

      viewport.innerHTML = `
        <h2>6. Historical Multi-Decadal Progression & Trend Graph</h2>
        <p style="color: var(--text-dim); margin-bottom: 12px;">Comparative index growth across selected observation milestones with calculated curve trends.</p>
        
        <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid var(--border-glass); border-radius: 12px; padding: 20px; position: relative;">
          <svg viewBox="0 0 600 220" style="width: 100%; height: 200px; overflow: visible;">
            <line x1="40" y1="30" x2="560" y2="30" stroke="rgba(255,255,255,0.08)" stroke-dasharray="4" />
            <line x1="40" y1="105" x2="560" y2="105" stroke="rgba(255,255,255,0.08)" stroke-dasharray="4" />
            <line x1="40" y1="180" x2="560" y2="180" stroke="rgba(255,255,255,0.15)" />

            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#00ffcc" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#00ffcc" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <polygon points="50,180 ${points} 560,180" fill="url(#trendGrad)" />
            <polyline fill="none" stroke="#00ffcc" stroke-width="3" points="${points}" />

            ${ev.timeline.map((t, idx) => {
              const x = 50 + idx * 130;
              const y = 180 - (t.val / 100) * 130;
              return `
                <g>
                  <circle cx="${x}" cy="${y}" r="6" fill="#f3e600" stroke="#050811" stroke-width="2" />
                  <text x="${x}" y="${y - 14}" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">${t.label}</text>
                  <text x="${x}" y="205" fill="#94a3b8" font-size="12" text-anchor="middle">${t.year}</text>
                </g>
              `;
            }).join("")}
          </svg>
        </div>

        <div class="card-grid" style="margin-top: 16px;">
          ${ev.timeline.map(t => `
            <div class="data-box" style="padding: 12px; text-align: center;">
              <span style="font-size: 0.75rem; color: var(--text-dim);">${t.year} Milestone</span>
              <div style="font-size: 1.2rem; font-weight: bold; color: var(--cyan); margin-top: 4px;">${t.label}</div>
            </div>
          `).join("")}
        </div>
      `;
      break;
    case "f7":
      const seasonData = {
        spring: { title: "Spring (Vernal Equinox)", desc: "As Earth's axial tilt leans toward the Sun, snowpack melts rapidly, triggering greening waves across continents.", albedo: "Decreasing", color: "#10b981" },
        summer: { title: "Summer (Solstice & Peak Thermal)", desc: "Peak solar irradiance warms continental interiors. Arctic sea ice reaches minimum extent.", albedo: "Lowest polar reflection", color: "#f3e600" },
        autumn: { title: "Autumn (Autumnal Equinox)", desc: "Solar angle decreases. Deciduous forests display widespread leaf senescence and color changes.", albedo: "Transitioning toward frost", color: "#f97316" },
        winter: { title: "Winter (Solstice & Cryosphere Growth)", desc: "The Northern Hemisphere tilts away from the Sun, expanding snow cover and maximizing Earth's albedo.", albedo: "Highest annual reflection", color: "#38bdf8" }
      }[currentSeason];

      viewport.innerHTML = `
        <h2>7. Seasonal Earth Dynamics & Albedo Shift</h2>
        <p style="color: var(--text-dim); margin-bottom: 16px;">How Earth's 23.5° axial tilt transforms planetary reflectance.</p>
        <div class="season-selector">
          <button class="season-btn ${currentSeason === 'spring' ? 'active' : ''}" onclick="setSeasonView('spring')">🌱 Spring</button>
          <button class="season-btn ${currentSeason === 'summer' ? 'active' : ''}" onclick="setSeasonView('summer')">☀️ Summer</button>
          <button class="season-btn ${currentSeason === 'autumn' ? 'active' : ''}" onclick="setSeasonView('autumn')">🍂 Autumn</button>
          <button class="season-btn ${currentSeason === 'winter' ? 'active' : ''}" onclick="setSeasonView('winter')">❄️ Winter</button>
        </div>
        <div class="season-card">
          <h3 style="color: ${seasonData.color};">${seasonData.title}</h3>
          <p style="line-height: 1.6; margin-bottom: 14px; color: var(--text-light);">${seasonData.desc}</p>
          <button id="btn-speak-season" class="primary-btn" style="margin-bottom: 16px; font-size: 0.85rem; padding: 10px 20px;">
            🔊 Listen to Seasonal Narration
          </button>
          <div class="card-grid">
            <div class="data-box"><h4>ALBEDO STATUS</h4><div style="font-size: 0.95rem; color: var(--cyan); margin-top: 6px;">${seasonData.albedo}</div></div>
            <div class="data-box"><h4>SATELLITE</h4><div style="font-size: 0.95rem; color: #fff; margin-top: 6px;">MODIS & VIIRS Imaging</div></div>
          </div>
        </div>
      `;

      setTimeout(() => {
        const speakBtn = document.getElementById("btn-speak-season");
        if (speakBtn) {
          speakBtn.addEventListener("click", () => {
            speakText(`${seasonData.title}. ${seasonData.desc}`);
          });
        }
      }, 50);
      break;
  }
}

// Astronauts Roster (All apostrophes in achievements safely escaped)
const astronautsList = [
  { 
    name: "Yuri Gagarin", 
    mission: "Vostok 1 (1961)", 
    tagline: "I see Earth! It is so beautiful.", 
    achievement: "First human to journey into outer space, completing one orbit of Earth.", 
    soundFreq: 440.00,
    imgSrc: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRGFCms2Q70JCKRBzr0zkWY2Np5Ar9scy3K9fXUMwv-MdcomJo7avGfm2a-kIiq4qAL-qlk2eISJVFyHMxW_oAjifw5EXExl3q0x0ZQUJ6BneeExEeVTcNzupazl_Vm93DNCTIFIyHV44E&s=19"
  },
  { 
    name: "John Glenn", 
    mission: "Friendship 7 (1962)", 
    tagline: "Zero G and I feel fine.", 
    achievement: "First American to orbit Earth, later returning to space at age 77.", 
    soundFreq: 493.88,
    imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR58bTvul1rdspdKHAYmuAZ-IlDtc0pmuGEJ1rapk3yljN4bCr21XP4u8bIojhu7wKF6Mrp4SsuiguuvTeWx-1h2aRFviUof-5XzyvpB5iMNQ&s=10"
  },
  { 
    name: "Valentina Tereshkova", 
    mission: "Vostok 6 (1963)", 
    tagline: "Hey sky, take off your hat, I am coming in!", 
    achievement: "First woman to fly in space, orbiting Earth 48 times.", 
    soundFreq: 523.25,
    imgSrc: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTMTEPYJsEO-BLSel4XlV80befSE5ua9cNxERce2RRxKAk7WXxlJjLlKyIqpwTiT_RQ0rWKPjLZSmRL5M4"
  },
  { 
    name: "Neil Armstrong", 
    mission: "Apollo 11 (1969)", 
    tagline: "One small step for man, one giant leap for mankind.", 
    achievement: "First human to set foot on the Moon, witnessing Earth rise.", 
    soundFreq: 587.33,
    imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpnIoIwHrsVa5DAcnb2PMvN-4dmMrj8obSdzpTf7dF-ESo4FlirVVPZctiflKra5AptzgWaridvIQ4iJuYMBLBlIQnGeA72gH1h3SAy08gew&s=10"
  },
  { 
    name: "Buzz Aldrin", 
    mission: "Apollo 11 (1969)", 
    tagline: "Magnificent desolation.", 
    achievement: "Lunar module pilot on Apollo 11 and second human to walk on the Moon.", 
    soundFreq: 622.25,
    imgSrc: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Buzz_Aldrin.jpg/960px-Buzz_Aldrin.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail"
  },
  { 
    name: "Sally Ride", 
    mission: "STS-7 Challenger (1983)", 
    tagline: "The stars do not look bigger, but they do look brighter.", 
    achievement: "First American woman in space, studying Earth\\'s ozone layer.", 
    soundFreq: 659.25,
    imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAgVu_-5i1xxlAaVGLvrIVX9bBROyoCZio5iCxhoBvA&s"
  },
  { 
    name: "Mae Jemison", 
    mission: "STS-47 Endeavour (1992)", 
    tagline: "The future belongs to those who can see potential.", 
    achievement: "First African American woman in space, conducting bone cell research.", 
    soundFreq: 698.46,
    imgSrc: "https://cdn.britannica.com/42/93242-050-54D76369/Mae-Jemison-space-shuttle-Endeavour.jpg"
  },
  { 
    name: "Chris Hadfield", 
    mission: "Expedition 34/35 (2013)", 
    tagline: "Earth is our shared fragile home.", 
    achievement: "Commander of the ISS who popularized orbital photography and music.", 
    soundFreq: 783.99,
    imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTPbpT8ujcRkbuIZSpsftCC-ZPfsxlKdEH9Pego3Wz6e3t_34iGXxHzxNzoS0gC666qUwCF_fKLQ7jF5xgNHug3GydCS4BslAUYM4G8g&s=10"
  }
];

function renderAstronautCards() {
  const container = document.getElementById("astro-grid-container");
  if (!container) return;

  container.innerHTML = astronautsList.map(astro => `
    <div class="astro-card" onclick="toggleCardFlip(event, this)">
      <div class="astro-card-inner">
        <div class="astro-card-front">
          <div>
            <img src="${astro.imgSrc}" class="astro-avatar" alt="${astro.name}">
            <h3>${astro.name}</h3>
            <span class="astro-mission">${astro.mission}</span>
          </div>
          <div class="astro-tagline">“${astro.tagline}”</div>
          <span style="font-size:0.7rem; color:var(--text-dim);">Click to flip card ↺</span>
        </div>
        <div class="astro-card-back">
          <h4>MISSION PROFILE</h4>
          <p>${astro.achievement.replace(/\\'/g, "'")}</p>
          <div style="display: flex; gap: 8px; width: 100%; margin-top: auto;">
            <button class="sound-trigger-btn" onclick="playAstroSound(event, ${astro.soundFreq})">🎵 Tone</button>
            <button class="sound-trigger-btn" style="background: rgba(243, 230, 0, 0.15); border-color: var(--yellow); color: var(--yellow);" onclick="speakAstroDetails(event, '${astro.name}', '${astro.mission}', '${astro.tagline}', '${astro.achievement.replace(/'/g, "\\\\'")}')">🔊 Read</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

window.toggleCardFlip = function(event, cardElement) {
  if (event.target.tagName === 'BUTTON' || event.target.closest('button')) return;
  cardElement.classList.toggle('flipped');
};

window.playAstroSound = function(event, freq) {
  event.stopPropagation();
  try {
    const sCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = sCtx.createOscillator();
    const gain = sCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, sCtx.currentTime);
    gain.gain.setValueAtTime(0.001, sCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, sCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, sCtx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(sCtx.destination);
    osc.start();
    osc.stop(sCtx.currentTime + 1.5);
  } catch (e) {}
};

window.speakAstroDetails = function(event, name, mission, tagline, achievement) {
  event.stopPropagation();
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const cleanAchievement = achievement.replace(/\\'/g, "'");
  const textToSpeak = `${name}, mission ${mission}. Tagline: ${tagline}. Achievement: ${cleanAchievement}`;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.rate = 1.0;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
};