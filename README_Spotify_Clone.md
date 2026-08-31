# 🎵 Spotify-Style Music Player

A responsive **Spotify-inspired music streaming interface** built with **HTML, CSS, and JavaScript**. This project recreates the look and interaction patterns of a modern music streaming application, including playlists, search, a music player, shuffle/repeat controls, volume control, and responsive navigation.

> **Note:** This is a frontend practice project. It does not connect to Spotify's official API and does not stream real audio.

## ✨ Features

- 🎧 Spotify-inspired dark music interface
- 🏠 Home dashboard with:
  - Recently Played
  - Popular Albums
  - Made For You
  - Featured Playlists
- 🔎 Real-time song search
- 🎵 Interactive bottom music player
- ▶️ Play/Pause controls
- ⏭️ Next and Previous track controls
- 🔀 Shuffle mode
- 🔁 Repeat mode
- ❤️ Like/unlike current song
- 📊 Interactive progress bar
- 🖱️ Click and drag to seek through a track
- 🔊 Interactive volume slider
- ⌨️ Spacebar shortcut for Play/Pause
- 📱 Responsive mobile sidebar with hamburger menu
- 🕐 Dynamic greeting based on the time of day
- ⏳ Loading screen animation
- 🧭 Back/forward-style navigation buttons
- 🎨 Hover effects, animations, transitions, and modern card layout
- ♿ Visible keyboard focus states for interactive elements

## 🛠️ Technologies Used

- **HTML5** - Structure and semantic layout
- **CSS3** - Styling, responsive design, animations, transitions, and custom UI
- **JavaScript (ES6+)** - Application logic, DOM manipulation, event handling, search, and player state
- **Google Fonts**
  - Montserrat
  - Inter

## 📂 Project Structure

```text
spotify-clone/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 How to Run

This is a static frontend project, so no backend, database, package manager, or installation is required.

### Option 1: Open directly

1. Download or clone the repository.
2. Open the project folder.
3. Double-click `index.html`.
4. The application will open in your browser.

### Option 2: Use VS Code

1. Open the project folder in **VS Code**.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

## 🎮 How to Use

### Music Player

Click a music card to load a song into the bottom player.

Use the controls to:

- **▶ / ⏸** - Play or pause
- **⏮** - Previous song
- **⏭** - Next song
- **⤨** - Toggle shuffle
- **⟲** - Toggle repeat
- **♡ / ♥** - Like or unlike the current song

### Progress Bar

Click or drag across the progress bar to change the current playback position.

The project uses a **simulated playback timer** rather than an actual audio element.

### Volume

Use the volume slider to change the displayed volume percentage.

### Search

Type a song title in the search bar. The homepage sections are filtered in real time.

If no matching song is found, an empty-state message is displayed.

### Keyboard Shortcut

Press:

```text
Space
```

to toggle Play/Pause.

The shortcut is disabled while typing in the search box so the browser does not behave like it has developed opinions.

## ⚙️ Application Logic

The JavaScript application maintains player state such as:

- Current song
- Current playback time
- Playing/paused status
- Shuffle status
- Repeat status
- Volume level
- Liked status
- Recently played songs

The player progress is simulated using `setInterval()` and advances once every second.

When a song reaches its duration:

- **Repeat ON:** the same song starts again.
- **Repeat OFF:** the next song starts automatically.
- **Shuffle ON:** the next song is selected randomly.

## 📱 Responsive Design

The interface adapts to smaller screens.

On mobile devices:

- The sidebar can be opened using the hamburger button.
- Navigation links can close the sidebar.
- Content rows and cards adapt to the available screen width.
- The music player layout becomes suitable for smaller displays.

## 🎨 Design

The project follows a Spotify-inspired visual style using:

- Black/dark backgrounds
- Green accent colors
- Rounded cards
- Smooth transitions
- Hover states
- Animated loading screen
- Fixed bottom music player
- Responsive sidebar

## 🔌 External Resources

The project loads fonts from **Google Fonts**:

- Montserrat
- Inter

No backend API or Spotify authentication is required.

## ⚠️ Disclaimer

This project is **not affiliated with, sponsored by, or endorsed by Spotify**.

It is a frontend learning/practice project created to demonstrate:

- HTML structure
- CSS UI design
- JavaScript DOM manipulation
- Event listeners
- Search/filter functionality
- Interactive player controls
- Responsive web design

## 🚧 Current Limitations

Because this is a frontend simulation:

- There is no real audio streaming.
- The progress bar simulates playback.
- Player controls modify the UI/state but do not control an actual audio file.
- Navigation buttons simulate scrolling rather than browser history.
- The project does not use Spotify authentication or the Spotify Web API.
- User accounts and cloud playlists are not implemented.

## 🔮 Future Improvements

Possible improvements include:

- Add real audio files using the HTML `<audio>` element
- Add Spotify Web API integration
- Implement real user authentication
- Create persistent playlists
- Add localStorage for liked songs
- Add album/artist pages
- Add real playback duration from audio files
- Add drag-and-drop playlist management
- Add lyrics support
- Add music recommendations
- Deploy the project using GitHub Pages

## 📸 Screenshots

Add screenshots of the application here after uploading them to the repository.

Example:

```markdown
![Home Page](screenshots/home.png)
![Music Player](screenshots/player.png)
![Mobile View](screenshots/mobile.png)
```

## 👩‍💻 Author

Created as a frontend web development practice project using **HTML, CSS, and JavaScript**.

## 📄 License

This project is intended for **educational and portfolio purposes**.
