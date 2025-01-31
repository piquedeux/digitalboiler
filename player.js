const skins = [
  "https://archive.org/cors/windowlicker_202501/AKAI_MPC2000_.wsz",
  "https://archive.org/cors/windowlicker_202501/WinAmp5.wsz",
  "https://archive.org/cors/windowlicker_202501/MetalGear.wsz",
  "https://archive.org/cors/windowlicker_202501/VOLKSWAGEN_New_Beetle.wsz",
  "https://archive.org/cors/windowlicker_202501/Winamp5_Classified_v5.5.wsz",
  "https://archive.org/cors/windowlicker_202501/Windowlicker.wsz",
  "https://archive.org/cors/windowlicker_202501/hand written.wsz"
];

// Hier sind die Songs mit ihren direkten Raw-URLs aus deinem GitHub-Repository
const songs = [
  "https://raw.githubusercontent.com/moritzgauss/digitalboiler/main/songs/Snow-Strippers-Just-Your-Doll-_Audio_.mp3",
  "https://raw.githubusercontent.com/moritzgauss/digitalboiler/main/songs/Another-Song.mp3",  // Beispiel für einen weiteren Song
  "https://raw.githubusercontent.com/moritzgauss/digitalboiler/main/songs/Yet-Another-Track.mp3", // Beispiel für einen weiteren Song
  // Weitere Songs hier hinzufügen
];

async function getRandomSong() {
  try {
    if (songs.length === 0) {
      console.warn("Kein Song gefunden, lade Standardtrack.");
      return "songs/default.mp3"; // Fallback-URL für den Standardtrack
    }

    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    console.log(`🎵 Zufälliger Song: ${randomSong}`);
    return randomSong; // Rückgabe der Raw-URL zum Song
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