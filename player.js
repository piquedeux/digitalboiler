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
    const response = await fetch("songs/");
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const links = [...doc.querySelectorAll("a")]
      .map(a => a.getAttribute("href"))
      .filter(name => name.endsWith(".mp3"));

    if (links.length === 0) {
      console.warn("Kein Song gefunden, lade Standardtrack.");
      return "songs/default.mp3";
    }

    const randomSong = links[Math.floor(Math.random() * links.length)];
    console.log(`🎵 Zufälliger Song: ${randomSong}`);
    return `songs/${randomSong}`;
  } catch (error) {
    console.error("Fehler beim Abrufen der Songs:", error);
    return "songs/default.mp3";
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
