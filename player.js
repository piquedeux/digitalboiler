const skins = [
  "https://archive.org/cors/windowlicker_202501/AKAI_MPC2000_.wsz",
  "https://archive.org/cors/windowlicker_202501/WinAmp5.wsz",
  "https://archive.org/cors/windowlicker_202501/MetalGear.wsz",
  "https://archive.org/cors/windowlicker_202501/VOLKSWAGEN_New_Beetle.wsz",
  "https://archive.org/cors/windowlicker_202501/Winamp5_Classified_v5.5.wsz",
  "https://archive.org/cors/windowlicker_202501/Windowlicker.wsz",
  "https://archive.org/cors/windowlicker_202501/hand written.wsz"
];

async function getRandomSong() {
  try {
    // GitHub API URL für den Ordner "songs" im Repository
    const response = await fetch("https://api.github.com/repos/moritzgauss/digitalboiler/contents/songs");
    if (!response.ok) {
      throw new Error("Fehler beim Abrufen der Songs: " + response.statusText);
    }
    const files = await response.json();
    const mp3Files = files.filter(file => file.name.endsWith(".mp3"));

    if (mp3Files.length === 0) {
      console.warn("Kein Song gefunden, lade Standardtrack.");
      return "songs/default.mp3"; // Fallback-URL für den Standardtrack
    }

    const randomSong = mp3Files[Math.floor(Math.random() * mp3Files.length)];
    console.log(`🎵 Zufälliger Song: ${randomSong.download_url}`);
    return randomSong.download_url; // Rückgabe der Raw-URL zum Song
  } catch (error) {
    console.error("Fehler beim Abrufen der Songs:", error);
    return "songs/default.mp3"; // Fallback-URL im Fehlerfall
  }
}

async function loadWebamp() {
  const skin = skins[Math.floor(Math.random() * skins.length)];
  const songUrl = await getRandomSong();

  const webamp = new Webamp({
    initialTracks: [
      {
        metaData: { artist: "Unknown Artist", title: "Random Track" },
        url: songUrl,
        duration: 180
      }
    ],
    initialSkin: { url: skin },
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

  webamp.renderWhenReady(document.getElementById("player"));
}

loadWebamp();