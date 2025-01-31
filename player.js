const skins = [
  "https://archive.org/cors/windowlicker_202501/AKAI_MPC2000_.wsz",
  "https://archive.org/cors/windowlicker_202501/WinAmp5.wsz",
  "https://archive.org/cors/windowlicker_202501/MetalGear.wsz",
  "https://archive.org/cors/windowlicker_202501/VOLKSWAGEN_New_Beetle.wsz",
  "https://archive.org/cors/windowlicker_202501/Winamp5_Classified_v5.5.wsz",
  "https://archive.org/cors/windowlicker_202501/Windowlicker.wsz",
  "https://archive.org/cors/windowlicker_202501/hand written.wsz"
];

// Liste aller Songs aus GitHub Raw
const songs = [
  {
    metaData: { artist: "Snow Strippers", title: "Just Your Doll" },
    url: "https://raw.githubusercontent.com/moritzgauss/digitalboiler/main/songs/Snow-Strippers-Just-Your-Doll-_Audio_.mp3",
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

async function loadWebamp() {
  const skin = skins[Math.floor(Math.random() * skins.length)];

  const webamp = new Webamp({
    initialTracks: songs,
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

  webamp.renderWhenReady(document.getElementById("app"));
}

loadWebamp();