/* =========================================================================
   AMBERWAVE — script.js
   Vanilla JS music player simulation (no real audio, no backend).
   Sections:
     1. Song data
     2. State
     3. DOM references
     4. Render functions (cards, sidebar, quick grid)
     5. Player engine (play/pause/next/prev/progress/volume)
     6. Search filter
     7. Misc UI (hamburger, sticky nav, greeting, loading screen)
     8. Event wiring
   ========================================================================= */

/* -------------------------------------------------------------------------
   1. SONG DATA
   Each song: title, artist, album, duration (seconds), cover (image URL),
   and a "section" tag used to bucket it into a homepage row.
   ------------------------------------------------------------------------- */
const songs = [
  { id: 1,  title: "Midnight Amber",      artist: "Coral Vale",       album: "Slow Burn",         duration: 214, cover: "https://picsum.photos/seed/amberwave1/400/400",  section: "recent" },
  { id: 2,  title: "Paper Lanterns",      artist: "Juno Fields",      album: "Paper Lanterns EP",  duration: 187, cover: "https://picsum.photos/seed/amberwave2/400/400",  section: "recent" },
  { id: 3,  title: "Static Bloom",        artist: "Holloway",         album: "Static Bloom",       duration: 246, cover: "https://picsum.photos/seed/amberwave3/400/400",  section: "recent" },
  { id: 4,  title: "Velvet Frequencies",  artist: "The Nightliners",  album: "Velvet Frequencies", duration: 201, cover: "https://picsum.photos/seed/amberwave4/400/400",  section: "recent" },
  { id: 5,  title: "Copper Skies",        artist: "Mara Lune",        album: "Copper Skies",       duration: 232, cover: "https://picsum.photos/seed/amberwave5/400/400",  section: "albums" },
  { id: 6,  title: "Glass Orchard",       artist: "Fen & Row",        album: "Glass Orchard",      duration: 198, cover: "https://picsum.photos/seed/amberwave6/400/400",  section: "albums" },
  { id: 7,  title: "Low Tide Radio",      artist: "Coral Vale",       album: "Low Tide Radio",     duration: 220, cover: "https://picsum.photos/seed/amberwave7/400/400",  section: "albums" },
  { id: 8,  title: "Ash & Amber",         artist: "Wren Osei",        album: "Ash & Amber",        duration: 255, cover: "https://picsum.photos/seed/amberwave8/400/400",  section: "albums" },
  { id: 9,  title: "Quiet Static",        artist: "Holloway",         album: "Quiet Static",       duration: 176, cover: "https://picsum.photos/seed/amberwave9/400/400",  section: "madeforyou" },
  { id: 10, title: "Sundial Drift",       artist: "Juno Fields",      album: "Sundial Drift",      duration: 209, cover: "https://picsum.photos/seed/amberwave10/400/400", section: "madeforyou" },
  { id: 11, title: "Marigold Hour",       artist: "Mara Lune",        album: "Marigold Hour",      duration: 238, cover: "https://picsum.photos/seed/amberwave11/400/400", section: "madeforyou" },
  { id: 12, title: "Rust & Neon",         artist: "The Nightliners",  album: "Rust & Neon",        duration: 192, cover: "https://picsum.photos/seed/amberwave12/400/400", section: "madeforyou" },
  { id: 13, title: "Harbor Lights",       artist: "Wren Osei",        album: "Harbor Lights",      duration: 227, cover: "https://picsum.photos/seed/amberwave13/400/400", section: "featured" },
  { id: 14, title: "Ember Traffic",       artist: "Fen & Row",        album: "Ember Traffic",      duration: 199, cover: "https://picsum.photos/seed/amberwave14/400/400", section: "featured" },
];

/* -------------------------------------------------------------------------
   2. STATE
   Central mutable state object — single source of truth for the player.
   ------------------------------------------------------------------------- */
const state = {
  queue: songs,             // full ordered list used for next/prev navigation
  currentIndex: 0,          // index into `songs` of the active track
  isPlaying: false,
  currentSeconds: 0,        // simulated playback position
  volume: 70,               // 0-100
  isLiked: false,
  isShuffle: false,
  isRepeat: false,
  recentlyPlayedIds: [1, 2, 3, 4], // seeded, most-recent-first
  progressTimer: null,      // setInterval handle for the simulated progress
};

/* -------------------------------------------------------------------------
   3. DOM REFERENCES
   ------------------------------------------------------------------------- */
const el = {
  loadingScreen: document.getElementById("loadingScreen"),
  app: document.getElementById("app"),

  hamburgerBtn: document.getElementById("hamburgerBtn"),
  sidebar: document.getElementById("sidebar"),
  sidebarPlaylists: document.getElementById("sidebarPlaylists"),

  topnav: document.querySelector(".topnav"),
  content: document.getElementById("content"),
  searchInput: document.getElementById("searchInput"),
  backBtn: document.getElementById("backBtn"),
  forwardBtn: document.getElementById("forwardBtn"),

  greetingText: document.getElementById("greetingText"),
  quickGrid: document.getElementById("quickGrid"),
  recentlyPlayedRow: document.getElementById("recentlyPlayedRow"),
  popularAlbumsRow: document.getElementById("popularAlbumsRow"),
  madeForYouRow: document.getElementById("madeForYouRow"),
  featuredPlaylistsRow: document.getElementById("featuredPlaylistsRow"),
  emptyState: document.getElementById("emptyState"),

  playerCover: document.getElementById("playerCover"),
  playerVinyl: document.getElementById("playerVinyl"),
  playerTitle: document.getElementById("playerTitle"),
  playerArtist: document.getElementById("playerArtist"),
  likeBtn: document.getElementById("likeBtn"),

  shuffleBtn: document.getElementById("shuffleBtn"),
  prevBtn: document.getElementById("prevBtn"),
  playPauseBtn: document.getElementById("playPauseBtn"),
  nextBtn: document.getElementById("nextBtn"),
  repeatBtn: document.getElementById("repeatBtn"),

  currentTime: document.getElementById("currentTime"),
  totalTime: document.getElementById("totalTime"),
  progressBar: document.getElementById("progressBar"),
  progressFill: document.getElementById("progressFill"),
  progressHandle: document.getElementById("progressHandle"),

  volumeIcon: document.getElementById("volumeIcon"),
  volumeSlider: document.getElementById("volumeSlider"),
  volumeFill: document.getElementById("volumeFill"),
  volumeHandle: document.getElementById("volumeHandle"),
  volumePercent: document.getElementById("volumePercent"),
};

/* -------------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------------- */

// Format seconds -> "M:SS"
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getSongById(id) {
  return songs.find((s) => s.id === id);
}

/* -------------------------------------------------------------------------
   4. RENDER FUNCTIONS
   ------------------------------------------------------------------------- */

// Build a single music-card element for a song, wired with a play button.
function createMusicCard(song) {
  const card = document.createElement("div");
  card.className = "music-card";
  card.dataset.songId = song.id;
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");

  card.innerHTML = `
    <div class="music-card__cover-wrap">
      <img class="music-card__cover" src="${song.cover}" alt="${song.album} cover" loading="lazy" />
      <button class="music-card__play" aria-label="Play ${song.title}">▶</button>
    </div>
    <p class="music-card__title">${song.title}</p>
    <p class="music-card__artist">${song.artist}</p>
  `;

  // Clicking anywhere on the card (or its play button) loads + plays the song
  card.addEventListener("click", () => playSongById(song.id));

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playSongById(song.id);
    }
  });

  return card;
}

// Render a horizontal row of cards for a given section tag, into a container.
function renderCardRow(container, sectionTag) {
  container.innerHTML = "";
  const filtered = songs.filter((s) => s.section === sectionTag);
  filtered.forEach((song) => container.appendChild(createMusicCard(song)));
  highlightActiveCard();
}

// Render the "quick access" grid using the recently played list (most recent first).
function renderQuickGrid() {
  el.quickGrid.innerHTML = "";
  state.recentlyPlayedIds.slice(0, 6).forEach((id) => {
    const song = getSongById(id);
    if (!song) return;

    const tile = document.createElement("div");
    tile.className = "quick-tile";
    tile.dataset.songId = song.id;
    tile.innerHTML = `
      <img src="${song.cover}" alt="${song.album} cover" loading="lazy" />
      <span>${song.title}</span>
      <button class="quick-play" aria-label="Play ${song.title}">▶</button>
    `;
    tile.addEventListener("click", () => playSongById(song.id));
    el.quickGrid.appendChild(tile);
  });
}

// Render the mini "recently played" list in the sidebar.
function renderSidebarPlaylists() {
  el.sidebarPlaylists.innerHTML = "";
  state.recentlyPlayedIds.slice(0, 5).forEach((id) => {
    const song = getSongById(id);
    if (!song) return;

    const item = document.createElement("div");
    item.className = "sidebar-playlist-item";
    item.dataset.songId = song.id;
    item.innerHTML = `
      <img src="${song.cover}" alt="${song.album} cover" loading="lazy" />
      <div>
        <p class="spl-title">${song.title}</p>
        <p class="spl-sub">${song.artist}</p>
      </div>
    `;
    item.addEventListener("click", () => playSongById(song.id));
    el.sidebarPlaylists.appendChild(item);
  });
}

// Add a subtle highlight ring to whichever card matches the current song.
function highlightActiveCard() {
  document.querySelectorAll(".music-card").forEach((card) => {
    card.classList.toggle(
      "active-card",
      Number(card.dataset.songId) === songs[state.currentIndex].id
    );
  });
}

// Re-render every homepage row (used after search is cleared, etc.)
function renderAllRows() {
  renderCardRow(el.recentlyPlayedRow, "recent");
  renderCardRow(el.popularAlbumsRow, "albums");
  renderCardRow(el.madeForYouRow, "madeforyou");
  renderCardRow(el.featuredPlaylistsRow, "featured");
  renderQuickGrid();
  renderSidebarPlaylists();
}

/* -------------------------------------------------------------------------
   5. PLAYER ENGINE
   ------------------------------------------------------------------------- */

// Load a song into the bottom player (does not auto-play).
function loadSong(index) {
  state.currentIndex = index;
  const song = songs[index];

  el.playerCover.src = song.cover;
  el.playerCover.alt = `${song.album} cover`;
  el.playerTitle.textContent = song.title;
  el.playerArtist.textContent = song.artist;
  el.totalTime.textContent = formatTime(song.duration);

  state.currentSeconds = 0;
  updateProgressUI();
  highlightActiveCard();
  addToRecentlyPlayed(song.id);
}

// Push a song id to the front of "recently played", de-duplicating.
function addToRecentlyPlayed(songId) {
  state.recentlyPlayedIds = [
    songId,
    ...state.recentlyPlayedIds.filter((id) => id !== songId),
  ].slice(0, 8);
  renderQuickGrid();
  renderSidebarPlaylists();
}

// Load a song by its id and immediately start playback.
function playSongById(songId) {
  const index = songs.findIndex((s) => s.id === songId);
  if (index === -1) return;
  loadSong(index);
  startPlayback();
}

function startPlayback() {
  state.isPlaying = true;
  el.playPauseBtn.textContent = "⏸";
  el.playPauseBtn.classList.add("playing");
  el.playPauseBtn.setAttribute("aria-label", "Pause");
  el.playerVinyl.classList.add("spinning");

  // Clear any existing timer before starting a new one
  clearInterval(state.progressTimer);
  state.progressTimer = setInterval(tickProgress, 1000);
}

function pausePlayback() {
  state.isPlaying = false;
  el.playPauseBtn.textContent = "▶";
  el.playPauseBtn.classList.remove("playing");
  el.playPauseBtn.setAttribute("aria-label", "Play");
  el.playerVinyl.classList.remove("spinning");
  clearInterval(state.progressTimer);
}

function togglePlayPause() {
  if (state.isPlaying) {
    pausePlayback();
  } else {
    startPlayback();
  }
}

// Simulated progress tick — advances current time by 1s and loops/advances at the end.
function tickProgress() {
  const song = songs[state.currentIndex];
  state.currentSeconds += 1;

  if (state.currentSeconds >= song.duration) {
    if (state.isRepeat) {
      state.currentSeconds = 0; // restart the same song
    } else {
      playNext(); // auto-advance to the next track
      return;
    }
  }
  updateProgressUI();
}

function updateProgressUI() {
  const song = songs[state.currentIndex];
  const pct = (state.currentSeconds / song.duration) * 100;
  el.progressFill.style.width = `${pct}%`;
  el.progressHandle.style.left = `${pct}%`;
  el.currentTime.textContent = formatTime(state.currentSeconds);
}

// Move to the next track. Honors shuffle if enabled.
function playNext() {
  let nextIndex;
  if (state.isShuffle) {
    nextIndex = Math.floor(Math.random() * songs.length);
  } else {
    nextIndex = (state.currentIndex + 1) % songs.length;
  }
  loadSong(nextIndex);
  startPlayback();
}

// Move to the previous track. If more than 3s into the song, restart it instead
// (standard music-player convention).
function playPrevious() {
  if (state.currentSeconds > 3) {
    state.currentSeconds = 0;
    updateProgressUI();
    return;
  }
  const prevIndex = (state.currentIndex - 1 + songs.length) % songs.length;
  loadSong(prevIndex);
  startPlayback();
}

// Let the user click/drag anywhere on the progress bar to seek.
function seekTo(clientX) {
  const rect = el.progressBar.getBoundingClientRect();
  const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  const song = songs[state.currentIndex];
  state.currentSeconds = Math.floor(ratio * song.duration);
  updateProgressUI();
}

// Volume slider — sets state.volume from a mouse/touch X position.
function setVolumeFromX(clientX) {
  const rect = el.volumeSlider.getBoundingClientRect();
  const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  state.volume = Math.round(ratio * 100);
  updateVolumeUI();
}

function updateVolumeUI() {
  el.volumeFill.style.width = `${state.volume}%`;
  el.volumeHandle.style.left = `${state.volume}%`;
  el.volumePercent.textContent = `${state.volume}%`;
  el.volumeIcon.textContent = state.volume === 0 ? "✕" : state.volume < 50 ? "♩" : "♪";
}

function toggleLike() {
  state.isLiked = !state.isLiked;
  el.likeBtn.textContent = state.isLiked ? "♥" : "♡";
  el.likeBtn.classList.toggle("liked", state.isLiked);
}

function toggleShuffle() {
  state.isShuffle = !state.isShuffle;
  el.shuffleBtn.classList.toggle("toggled-on", state.isShuffle);
}

function toggleRepeat() {
  state.isRepeat = !state.isRepeat;
  el.repeatBtn.classList.toggle("toggled-on", state.isRepeat);
}

/* -------------------------------------------------------------------------
   6. SEARCH FILTER
   Filters all homepage rows by song title (case-insensitive substring match).
   ------------------------------------------------------------------------- */
function handleSearch(query) {
  const term = query.trim().toLowerCase();

  if (!term) {
    renderAllRows();
    el.emptyState.hidden = true;
    document.querySelectorAll(".row-section").forEach((r) => (r.hidden = false));
    return;
  }

  const matches = songs.filter((s) => s.title.toLowerCase().includes(term));

  // Re-render each row filtered to only matching songs within that section.
  const sectionsMap = [
    { container: el.recentlyPlayedRow, tag: "recent" },
    { container: el.popularAlbumsRow, tag: "albums" },
    { container: el.madeForYouRow, tag: "madeforyou" },
    { container: el.featuredPlaylistsRow, tag: "featured" },
  ];

  let anyMatches = false;
  sectionsMap.forEach(({ container, tag }) => {
    const sectionMatches = matches.filter((s) => s.section === tag);
    container.innerHTML = "";
    sectionMatches.forEach((song) => container.appendChild(createMusicCard(song)));
    const sectionEl = container.closest(".row-section");
    sectionEl.hidden = sectionMatches.length === 0;
    if (sectionMatches.length > 0) anyMatches = true;
  });

  highlightActiveCard();
  el.emptyState.hidden = anyMatches;
}

/* -------------------------------------------------------------------------
   7. MISC UI (hamburger menu, sticky nav, greeting, loading screen)
   ------------------------------------------------------------------------- */

function toggleSidebar() {
  el.sidebar.classList.toggle("open");
  el.hamburgerBtn.classList.toggle("open");
}

// Add a background/border to the top nav once the user scrolls the content.
function handleContentScroll() {
  el.topnav.classList.toggle("scrolled", el.content.scrollTop > 4);
}

// Set the greeting based on the real time of day.
function setGreeting() {
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  el.greetingText.textContent = greeting;
}

function hideLoadingScreen() {
  el.loadingScreen.classList.add("hidden");
}

/* -------------------------------------------------------------------------
   8. EVENT WIRING
   ------------------------------------------------------------------------- */

function initEventListeners() {
  // Hamburger / mobile sidebar
  el.hamburgerBtn.addEventListener("click", toggleSidebar);

  // Sticky top nav shadow on scroll
  el.content.addEventListener("scroll", handleContentScroll);

  // Fake back/forward nav buttons (purely decorative, gives UI feedback)
  el.backBtn.addEventListener("click", () => el.content.scrollTo({ top: 0, behavior: "smooth" }));
  el.forwardBtn.addEventListener("click", () => el.content.scrollTo({ top: el.content.scrollHeight, behavior: "smooth" }));

  // Search
  el.searchInput.addEventListener("input", (e) => handleSearch(e.target.value));

  // Transport controls
  el.playPauseBtn.addEventListener("click", togglePlayPause);
  el.nextBtn.addEventListener("click", playNext);
  el.prevBtn.addEventListener("click", playPrevious);
  el.shuffleBtn.addEventListener("click", toggleShuffle);
  el.repeatBtn.addEventListener("click", toggleRepeat);
  el.likeBtn.addEventListener("click", toggleLike);

  // Progress bar — click to seek
  el.progressBar.addEventListener("click", (e) => seekTo(e.clientX));

  // Progress bar — drag to seek
  let isDraggingProgress = false;
  el.progressBar.addEventListener("mousedown", () => (isDraggingProgress = true));
  window.addEventListener("mousemove", (e) => {
    if (isDraggingProgress) seekTo(e.clientX);
  });
  window.addEventListener("mouseup", () => (isDraggingProgress = false));

  // Volume slider — click and drag
  let isDraggingVolume = false;
  el.volumeSlider.addEventListener("mousedown", (e) => {
    isDraggingVolume = true;
    setVolumeFromX(e.clientX);
  });
  window.addEventListener("mousemove", (e) => {
    if (isDraggingVolume) setVolumeFromX(e.clientX);
  });
  window.addEventListener("mouseup", () => (isDraggingVolume = false));

  // Keyboard shortcut: Spacebar toggles play/pause (ignored while typing in search)
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && document.activeElement !== el.searchInput) {
      e.preventDefault();
      togglePlayPause();
    }
  });

  // Close mobile sidebar when a nav link is tapped
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      if (window.innerWidth <= 768) toggleSidebar();
    });
  });
}

/* -------------------------------------------------------------------------
   INIT
   ------------------------------------------------------------------------- */
function init() {
  setGreeting();
  renderAllRows();
  updateVolumeUI();
  loadSong(0); // preload the first track into the bottom player without playing it
  initEventListeners();

  // Simulate a short loading state, then reveal the app
  setTimeout(hideLoadingScreen, 900);
}

document.addEventListener("DOMContentLoaded", init);
