
import { eicResources } from "./eic-resources.js";

/* =========================================
   NASA EIC DISCOVERY LIBRARY
   Gallery + Voiceover + Real Audio Jukebox
========================================= */


/* ---------- ELEMENTS ---------- */

const resourceGrid = document.getElementById("resource-grid");
const searchInput = document.getElementById("resource-search");
const categoryFilter = document.getElementById("category-filter");
const categoryChips = document.getElementById("category-chips");
const resourceCount = document.getElementById("resource-count");
const emptyState = document.getElementById("empty-state");

const featuredImage = document.getElementById("featured-image");
const featuredTitle = document.getElementById("featured-title");
const featuredDescription = document.getElementById("featured-description");
const featuredImageTitle = document.getElementById("featured-image-title");
const featuredSource = document.getElementById("featured-source");
const featuredListen = document.getElementById("featured-listen");

const storyTitle = document.getElementById("story-title");
const storyText = document.getElementById("story-text");

const voicePlay = document.getElementById("voice-play");
const voicePause = document.getElementById("voice-pause");
const voiceStop = document.getElementById("voice-stop");

const vinylRecord = document.getElementById("vinyl-record");
const vinylStatus = document.getElementById("vinyl-status");
const jukeboxTrackTitle = document.getElementById("jukebox-track-title");

const musicPlay = document.getElementById("music-play");
const musicStop = document.getElementById("music-stop");
const musicNext = document.getElementById("music-next");
const musicVolume = document.getElementById("music-volume");
const musicVolumeValue = document.getElementById("music-volume-value");

const trackList = document.getElementById("track-list");


/* ---------- RESOURCE DATA ---------- */

const resources = Array.isArray(eicResources) ? eicResources : [];

let selectedResource = resources[0] || null;
let selectedCategory = "all";
let searchTerm = "";

const imageCache = new Map();


/* ---------- NASA IMAGE SEARCH ---------- */

async function getNASAImage(resource) {
  if (!resource) return "";

  if (imageCache.has(resource.id)) {
    return imageCache.get(resource.id);
  }

  const query = `${resource.title} NASA Earth`;

  try {
    const response = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=5`
    );

    if (!response.ok) {
      throw new Error("NASA image request failed");
    }

    const result = await response.json();
    const items = result.collection?.items || [];

    let imageURL = "";

    for (const item of items) {
      const preview = item.links?.find(
        link => link.rel === "preview" && link.href
      );

      if (preview) {
        imageURL = preview.href;
        break;
      }
    }

    imageCache.set(resource.id, imageURL);
    return imageURL;

  } catch (error) {
    console.warn("Could not load NASA image:", resource.title, error);
    imageCache.set(resource.id, "");
    return "";
  }
}


/* ---------- CATEGORY FALLBACK COVERS ---------- */

function getFallbackCover(resource) {
  const category = (resource?.category || "").toLowerCase();

  const covers = {
    ocean:
      "linear-gradient(135deg, #031b38, #087eaa, #42c6c5)",

    atmosphere:
      "linear-gradient(135deg, #172554, #475569, #94a3b8)",

    climate:
      "linear-gradient(135deg, #422006, #b45309, #fbbf24)",

    weather:
      "linear-gradient(135deg, #111827, #334155, #0ea5e9)",

    ecosystems:
      "linear-gradient(135deg, #052e16, #15803d, #84cc16)",

    "human activity":
      "linear-gradient(135deg, #111827, #312e81, #f59e0b)",

    "earth overview":
      "linear-gradient(135deg, #082f49, #0369a1, #14b8a6)",

    "data sonification":
      "linear-gradient(135deg, #2e1065, #7c3aed, #ec4899)"
  };

  return covers[category] ||
    "linear-gradient(135deg, #0f172a, #1e40af, #0e7490)";
}


/* ---------- APPLY IMAGE OR FALLBACK ---------- */

function applyImage(element, imageURL, resource) {
  if (!element) return;

  const fallback = getFallbackCover(resource);

  // Display a fallback immediately.
  element.style.backgroundImage = fallback;
  element.style.backgroundColor = "#10243a";
  element.style.backgroundSize = "cover";
  element.style.backgroundPosition = "center";

  if (!imageURL) return;

  const image = new Image();

  image.onload = () => {
    element.style.backgroundImage =
      `linear-gradient(0deg, rgba(3,8,18,.55), rgba(3,8,18,.05)), url("${imageURL}")`;
  };

  image.onerror = () => {
    console.warn(
      "NASA image unavailable. Showing fallback cover:",
      resource?.title
    );

    element.style.backgroundImage = fallback;
  };

  image.src = imageURL;
}


/* ---------- LOAD GALLERY IMAGES ---------- */

async function loadGalleryImages() {
  for (const resource of resources) {
    const cardImage = document.querySelector(
      `[data-resource-image="${resource.id}"]`
    );

    // Apply fallback immediately.
    if (cardImage) {
      applyImage(cardImage, "", resource);
    }

    const imageURL = await getNASAImage(resource);

    if (cardImage) {
      applyImage(cardImage, imageURL, resource);
    }
  }

  if (selectedResource) {
    const imageURL = await getNASAImage(selectedResource);

    applyImage(
      featuredImage,
      imageURL,
      selectedResource
    );
  }
}


/* ---------- CREATE RESOURCE CARD ---------- */

function createResourceCard(resource) {
  const card = document.createElement("article");
  card.className = "resource-card";

  const image = document.createElement("div");
  image.className = "resource-image";
  image.dataset.resourceImage = resource.id;

  // Give every card a cover immediately.
  image.style.backgroundImage = getFallbackCover(resource);
  image.style.backgroundSize = "cover";
  image.style.backgroundPosition = "center";

  const category = document.createElement("span");
  category.className = "resource-image-category";
  category.textContent = resource.category || "Earth Science";

  image.appendChild(category);

  const body = document.createElement("div");
  body.className = "resource-card-body";

  const period = document.createElement("span");
  period.className = "resource-period";
  period.textContent = resource.period || "NASA Visualization";

  const title = document.createElement("h3");
  title.textContent = resource.title;

  const description = document.createElement("p");
  description.textContent = resource.description;

  const actions = document.createElement("div");
  actions.className = "resource-card-actions";

  const listenButton = document.createElement("button");
  listenButton.className = "resource-listen-btn";
  listenButton.textContent = "🔊 LISTEN";

  listenButton.addEventListener("click", () => {
    selectResource(resource);

    document.getElementById("story-section")?.scrollIntoView({
      behavior: "smooth"
    });
  });

  const openLink = document.createElement("a");
  openLink.className = "resource-open-btn";
  openLink.textContent = "NASA SOURCE ↗";
  openLink.href = resource.url;
  openLink.target = "_blank";
  openLink.rel = "noopener noreferrer";

  actions.append(listenButton, openLink);

  body.append(period, title, description, actions);
  card.append(image, body);

  return card;
}


/* ---------- RENDER GALLERY ---------- */

function renderGallery() {
  if (!resourceGrid) return;

  const filteredResources = resources.filter(resource => {
    const matchesCategory =
      selectedCategory === "all" ||
      resource.category === selectedCategory;

    const text = [
      resource.title,
      resource.description,
      resource.category,
      resource.period
    ].join(" ").toLowerCase();

    const matchesSearch = text.includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  resourceGrid.replaceChildren();

  filteredResources.forEach(resource => {
    resourceGrid.appendChild(createResourceCard(resource));
  });

  if (resourceCount) {
    resourceCount.textContent = filteredResources.length;
  }

  if (emptyState) {
    emptyState.hidden = filteredResources.length !== 0;
  }

  loadGalleryImages();
}


/* ---------- SEARCH ---------- */

if (searchInput) {
  searchInput.addEventListener("input", event => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderGallery();
  });
}


/* ---------- CATEGORY SELECT ---------- */

if (categoryFilter) {
  categoryFilter.addEventListener("change", event => {
    selectedCategory = event.target.value;
    updateCategoryChips();
    renderGallery();
  });
}


/* ---------- CATEGORY CHIPS ---------- */

function updateCategoryChips() {
  if (!categoryChips) return;

  categoryChips.querySelectorAll(".category-chip").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === selectedCategory
    );
  });
}

if (categoryChips) {
  categoryChips.addEventListener("click", event => {
    const button = event.target.closest(".category-chip");

    if (!button) return;

    selectedCategory = button.dataset.category;

    if (categoryFilter) {
      categoryFilter.value = selectedCategory;
    }

    updateCategoryChips();
    renderGallery();
  });
}


/* ---------- SELECT FEATURED RESOURCE ---------- */

function selectResource(resource) {
  if (!resource) return;

  selectedResource = resource;

  if (featuredTitle) {
    featuredTitle.textContent = resource.title;
  }

  if (featuredDescription) {
    featuredDescription.textContent = resource.description;
  }

  if (featuredImageTitle) {
    featuredImageTitle.textContent = resource.title;
  }

  if (featuredSource) {
    featuredSource.href = resource.url;
  }

  if (storyTitle) {
    storyTitle.textContent = resource.title;
  }

  if (storyText) {
    storyText.textContent =
      `${resource.description} ${resource.soundIdea || ""}`;
  }

  // Apply fallback first, then load NASA image.
  applyImage(featuredImage, "", resource);

  getNASAImage(resource).then(imageURL => {
    applyImage(featuredImage, imageURL, resource);
  });

  stopVoiceover();
}


/* ---------- VOICEOVER ENGINE ---------- */

let currentUtterance = null;
let voiceIsPaused = false;

function stopVoiceover() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  currentUtterance = null;
  voiceIsPaused = false;

  if (voicePlay) {
    voicePlay.textContent = "▶ PLAY";
  }
}

function playVoiceover() {
  if (!("speechSynthesis" in window)) {
    alert("Voice narration is not supported by this browser.");
    return;
  }

  if (!selectedResource) return;

  const speech = window.speechSynthesis;

  if (speech.paused && voiceIsPaused) {
    speech.resume();
    voiceIsPaused = false;

    if (voicePlay) {
      voicePlay.textContent = "▶ PLAY";
    }

    return;
  }

  stopVoiceover();

  const narration =
    `${selectedResource.title}. ` +
    `${selectedResource.description}. ` +
    `${selectedResource.soundIdea || ""} ` +
    `Explore the original NASA visualization using the NASA source link.`;

  currentUtterance = new SpeechSynthesisUtterance(narration);

  currentUtterance.rate = 0.95;
  currentUtterance.pitch = 1;
  currentUtterance.volume = 1;

  currentUtterance.onend = () => {
    currentUtterance = null;
    voiceIsPaused = false;

    if (voicePlay) {
      voicePlay.textContent = "▶ PLAY";
    }
  };

  currentUtterance.onerror = event => {
    console.warn("Voiceover error:", event.error);
  };

  speech.speak(currentUtterance);

  if (voicePlay) {
    voicePlay.textContent = "▶ PLAYING";
  }
}

function pauseVoiceover() {
  if (!("speechSynthesis" in window)) return;

  const speech = window.speechSynthesis;

  if (speech.speaking && !speech.paused) {
    speech.pause();
    voiceIsPaused = true;

    if (voicePlay) {
      voicePlay.textContent = "▶ RESUME";
    }
  }
}

if (voicePlay) {
  voicePlay.addEventListener("click", playVoiceover);
}

if (voicePause) {
  voicePause.addEventListener("click", pauseVoiceover);
}

if (voiceStop) {
  voiceStop.addEventListener("click", stopVoiceover);
}

if (featuredListen) {
  featuredListen.addEventListener("click", () => {
    playVoiceover();

    document.getElementById("story-section")?.scrollIntoView({
      behavior: "smooth"
    });
  });
}


/* =========================================
   REAL AUDIO SCIENCE JUKEBOX
========================================= */


/* ---------- AUDIO TRACKS ---------- */

const tracks = {
  ocean: {
    title: "Ocean Currents",
    src: "/audio/ocean-currents.wav"
  },

  carbon: {
    title: "Atmospheric CO₂",
    src: "/audio/atmospheric-co2.mp3"
  },

  ice: {
    title: "Polar Sea Ice",
    src: "/audio/polar-ice.mp3"
  },

  lights: {
    title: "Global Night Lights",
    src: "/audio/night-lights.mp3"
  },

  atmosphere: {
    title: "Atmospheric Aerosols",
    src: "/audio/atmospheric-aerosols.wav"
  }
};

const trackKeys = Object.keys(tracks);

let currentTrack = "ocean";
let musicPlaying = false;

const audioPlayer = new Audio();

audioPlayer.preload = "metadata";
audioPlayer.volume = Number(musicVolume?.value ?? 70) / 100;


/* ---------- UPDATE PLAYER DISPLAY ---------- */

function updateMusicDisplay(status) {
  if (vinylStatus) {
    vinylStatus.textContent = status;
  }

  if (vinylRecord) {
    vinylRecord.classList.toggle("playing", musicPlaying);
  }

  if (musicPlay) {
    musicPlay.textContent = musicPlaying ? "Ⅱ" : "▶";

    musicPlay.setAttribute(
      "aria-label",
      musicPlaying ? "Pause music" : "Play music"
    );
  }
}


/* ---------- LOAD SELECTED TRACK ---------- */

function loadMusicTrack() {
  const track = tracks[currentTrack];

  if (!track) return;

  audioPlayer.src = track.src;
  audioPlayer.load();

  if (jukeboxTrackTitle) {
    jukeboxTrackTitle.textContent = track.title;
  }

  if (trackList) {
    trackList.querySelectorAll(".sound-track").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.track === currentTrack
      );
    });
  }
}


/* ---------- PLAY MUSIC ---------- */

async function startMusic() {
  const track = tracks[currentTrack];

  if (!track) return;

  try {
    if (audioPlayer.dataset.track !== currentTrack) {
      audioPlayer.dataset.track = currentTrack;
      loadMusicTrack();
    }

    await audioPlayer.play();

    musicPlaying = true;
    updateMusicDisplay("NOW PLAYING");

  } catch (error) {
    musicPlaying = false;
    updateMusicDisplay("AUDIO ERROR");

    console.error("Music playback failed:", error);

    alert(
      `Could not play ${track.title}. Check that ${track.src} exists inside your public/audio folder and contains playable audio.`
    );
  }
}


/* ---------- PAUSE MUSIC ---------- */

function pauseMusic() {
  audioPlayer.pause();

  musicPlaying = false;
  updateMusicDisplay("PAUSED");
}


/* ---------- STOP MUSIC ---------- */

function stopMusic() {
  audioPlayer.pause();

  try {
    audioPlayer.currentTime = 0;
  } catch (error) {
    console.warn("Could not reset audio position:", error);
  }

  musicPlaying = false;
  updateMusicDisplay("READY TO PLAY");
}


/* ---------- SELECT TRACK ---------- */

function selectTrack(trackKey) {
  if (!tracks[trackKey]) return;

  stopMusic();

  currentTrack = trackKey;

  audioPlayer.dataset.track = currentTrack;

  loadMusicTrack();

  updateMusicDisplay("TRACK SELECTED");
}


/* ---------- NEXT TRACK ---------- */

function nextTrack(autoplay = true) {
  const currentIndex = trackKeys.indexOf(currentTrack);

  const nextIndex =
    (currentIndex + 1) % trackKeys.length;

  selectTrack(trackKeys[nextIndex]);

  if (autoplay) {
    startMusic();
  }
}


/* ---------- AUTOMATIC NEXT TRACK ---------- */

audioPlayer.addEventListener("ended", () => {
  musicPlaying = false;
  nextTrack(true);
});


/* ---------- AUDIO ERROR ---------- */

audioPlayer.addEventListener("error", () => {
  musicPlaying = false;
  updateMusicDisplay("AUDIO FILE NOT FOUND");

  console.error(
    "Audio file could not be loaded:",
    tracks[currentTrack]?.src
  );
});


/* ---------- TRACK BUTTONS ---------- */

if (trackList) {
  trackList.addEventListener("click", event => {
    const button = event.target.closest(".sound-track");

    if (!button) return;

    selectTrack(button.dataset.track);
  });
}


/* ---------- PLAY / PAUSE BUTTON ---------- */

if (musicPlay) {
  musicPlay.addEventListener("click", () => {
    if (musicPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  });
}


/* ---------- STOP BUTTON ---------- */

if (musicStop) {
  musicStop.addEventListener("click", stopMusic);
}


/* ---------- NEXT BUTTON ---------- */

if (musicNext) {
  musicNext.addEventListener("click", () => {
    nextTrack(true);
  });
}


/* ---------- VOLUME CONTROL ---------- */

if (musicVolume) {
  musicVolume.addEventListener("input", event => {
    const value = Number(event.target.value);

    audioPlayer.volume = Math.max(
      0,
      Math.min(1, value / 100)
    );

    if (musicVolumeValue) {
      musicVolumeValue.textContent = `${value}%`;
    }
  });
}


/* ---------- INITIALIZE JUKEBOX ---------- */

loadMusicTrack();
updateMusicDisplay("READY TO PLAY");


/* ---------- FEATURED RESOURCE ---------- */

if (resources.length > 0) {
  selectResource(resources[0]);
}


/* ---------- START LIBRARY ---------- */

renderGallery();

console.log("NASA EIC Discovery Library loaded successfully.");
