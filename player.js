const skins = [
  "https://archive.org/cors/windowlicker_202501/AKAI_MPC2000_.wsz",
  "https://archive.org/cors/windowlicker_202501/WinAmp5.wsz",
  "https://archive.org/cors/windowlicker_202501/MetalGear.wsz",
  "https://archive.org/cors/windowlicker_202501/VOLKSWAGEN_New_Beetle.wsz",
  "https://archive.org/cors/windowlicker_202501/Winamp5_Classified_v5.5.wsz",
  "https://archive.org/cors/windowlicker_202501/Windowlicker.wsz",
  "https://archive.org/cors/windowlicker_202501/hand%20written.wsz"
];

// Songs Playlist
const songs = [
  {
    metaData: { artist: "Snow Strippers", title: "Just Your Doll" },
    url: "/songs/Snow-Strippers-Just-Your-Doll-_Audio_.mp3", // Make sure this path is correct
    duration: 180
  },
  {
    metaData: { artist: "Artist Name", title: "Another Song" },
    url: "https://raw.githubusercontent.com/moritzgauss/digitalboiler/main/songs/Another-Song.mp3",
    duration: 200
  },
  {
    metaData: { artist: "Unknown", title: "Yet Another Track" },
    url: "https://raw.githubusercontent.com/moritzgauss/digitalboiler/main/songs/Yet-Another-Track.mp3",
    duration: 220
  }
];

// Preload the skin before applying it
async function loadSkin(url) {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error(`Skin failed to load: ${url}`);
    return url;
  } catch (error) {
    console.error("Error loading skin:", error);
    return null;
  }
}

async function loadWebamp() {
  const skin = skins[Math.floor(Math.random() * skins.length)];
  const skinUrl = await loadSkin(skin) || skins[0]; // Fallback to first skin if load fails

  const webamp = new Webamp({
    initialTracks: songs.map(song => ({
      url: song.url,
      metaData: song.metaData
    })),
    initialSkin: { url: skinUrl },
    __butterchurnOptions: {
      importButterchurn: () => Promise.resolve(window.butterchurn),
      getPresets: () => {
        const presets = window.butterchurnPresets.getPresets();
        return Object.keys(presets).map(name => ({
          name,
          butterchurnPresetObject: presets[name]
        }));
      },
      butterchurnOpen: true
    }
  });

  // Ensure Webamp is ready before rendering
  try {
    await webamp.renderWhenReady(document.getElementById("player"));
    console.log("Webamp loaded successfully!");
  } catch (err) {
    console.error("Webamp failed to load:", err);
  }
}

loadWebamp();