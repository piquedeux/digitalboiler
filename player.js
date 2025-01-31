const skins = [
  "https://archive.org/cors/windowlicker_202501/AKAI_MPC2000_.wsz",
  "https://archive.org/cors/windowlicker_202501/WinAmp5.wsz",
  "https://archive.org/cors/windowlicker_202501/MetalGear.wsz",
  "https://archive.org/cors/windowlicker_202501/VOLKSWAGEN_New_Beetle.wsz",
  "https://archive.org/cors/windowlicker_202501/Winamp5_Classified_v5.5.wsz",
  "https://archive.org/cors/windowlicker_202501/Windowlicker.wsz",
  "https://archive.org/cors/windowlicker_202501/hand written.wsz"
];

// Liste der MP3-Dateien im GitHub-Repository
const songs = [
"https://github.com/moritzgauss/digitalboiler/blob/main/songs/Snow-Strippers-Just-Your-Doll-_Audio_.mp3",
  "https://raw.githubusercontent.com/moritzgauss/digitalboiler/main/songs/Another-Song.mp3",  
  "https://raw.githubusercontent.com/moritzgauss/digitalboiler/main/songs/Yet-Another-Track.mp3"
];

// Funktion zum Laden der MP3-Datei als Blob
async function fetchBlobUrl(mp3Url) {
  try {
    const response = await fetch(mp3Url);
    if (!response.ok) throw new Error("Fehler beim Laden der Datei.");

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Fehler beim Laden des Songs:", error);
    return null;
  }
}

async function getRandomSong() {
  if (songs.length === 0) {
    console.warn("Kein Song gefunden, lade Standardtrack.");
    return "songs/default.mp3"; 
  }

  const randomSongUrl = songs[Math.floor(Math.random() * songs.length)];
  console.log(`🎵 Lade zufälligen Song: ${randomSongUrl}`);

  // MP3-Datei als Blob abrufen und URL zurückgeben
  const blobUrl = await fetchBlobUrl(randomSongUrl);
  return blobUrl || "songs/default.mp3";  
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