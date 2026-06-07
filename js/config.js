/* ============================================================
   💌  EDIT THIS FILE TO PERSONALIZE THE WEBSITE  💌
   This is the only file you need to touch for words.
   ============================================================ */

window.BIRTHDAY_CONFIG = {

  /* ---- The basics ---- */
  name: "Devika",
  nickname: "Devutty",
  secretName: "Pattykunj",   // used only ONCE, in the letter — kept special
  age: 16,
  birthDate: "2010-06-08",   // for the live age counter (YYYY-MM-DD)

  /* ---- Unlock timer ----
     The whole site stays LOCKED behind a countdown until this moment.
     Format: "YYYY-MM-DDTHH:MM:SS" in her local time.  (8 June 2026)
     Dev override while locked: press Ctrl+Shift+U  (or type "foxy"). */
  unlockDate: "2026-06-08T00:00:00",
  lock: {
    kicker: "a gift is waiting",
    title: "Something for Devutty",
    foot: "come back when the clock runs out 🦊"
  },

  /* ---- Intro lines (shown one by one) ---- */
  intro: [
    "Hey Devutty…",
    "Today isn't just another day.",
    "Because someone special turns 16.",
    "Happy Birthday, Devika."
  ],

  /* ---- Hero ---- */
  heroKicker: "a little something, made just for you",
  heroTypewriter: "To my favorite person — Devutty.",

  /* ---- STORY INSTRUCTIONS ----
     These now appear CENTER-SCREEN, one at a time, with a text
     animation — and then that section reveals. Keyed by section. */
  instructions: {
    gallery: "First… let's look back at our favorite moments.",
    cake: "Light all the candles, make a wish, then blow them out.",
    letter: "I wrote you something. Open the envelope to read it.",
    game: "A little game — collect the diamonds, dodge the creepers.",
    music: "For the music lover. Press play and let it spin.",
    fortune: "Crack it open — the stars left you a little message."
  },

  /* ---- Memory Gallery (assets/photos) ----
     Photos AND videos both work. Videos (.mp4/.webm/.mov) auto-detect:
     they preview on the card and play with sound in the lightbox. */
  gallery: [
    { src: "assets/photos/image1.png", caption: "us, being us" },
    { src: "assets/photos/image2.png", caption: "favorite day" },
    { src: "assets/photos/image3.png", caption: "golden hour" },
    { src: "assets/photos/image4.png", caption: "partners in crime" },
    { src: "assets/photos/vid1.mp4", caption: "caught laughing" },
    { src: "assets/photos/vid2.mp4", caption: "main character energy" },
    { src: "assets/photos/vid3.mp4", caption: "our kind of chaos" },
    { src: "assets/photos/vid4.mp4", caption: "press play 🎬" }
  ],

  /* ---- The personal letter ---- */
  letterTitle: "A Letter For You",
  letter: `Happy Birthday, Devutty! 🎂❤️

Agane veendum ninte birthday aayi. Samayam enthoru pettannaan alle povunne. Kazhinja ninte birthdaykku munpaan nammal parichayappedath, ath kazhinju ippo 1 year aayi. Ithinullil enthokke sambhavichu 😂... aalochikkumbo thanne bhranth aavunnu.

But enthokke aayalum, ninne meet cheythath ente ee kochu life-il nadanna nalla kaaryangalil onnaanu. Kurachu naal anakilum njan ath sherikkum enjoy cheythu. I just wanted to say thank you for being such an amazing friend. ❤️

Njan miss cheyyunnund nammade cheriya cheriya fights, Minecraft kalikkunnath, pinne VC-il vannirunnu gossip parayunnath okke. Enikku ariyaam onnum pandathe pole aavilla enn. Enikku ninnod deshyam undayitt onnum illa tto. Njan ninte aduthu samsarikkathathum, mind aakkathathum okke athukondalla. Pandathe pole oru vibe kittunnilla 🙂. Sorry, ippo ippo njan kure maari.

Agane ninakku 16 vayass aayi... valiya kutti aayi 😂.

Pinne life-il enthu issue undayalum athokke solve cheythu munnottu povanam. Happy aayittu irikkanam. Ippo ninakku kure friends okke undallo. Athukond nalla memories okke create cheyyanam.

Pinne... nthaaa parayyaaa aa idk 😂.

Bhaaviyil ni oru valiya singer aavanam 🎤✨.

Njan ivide okke thanne kaanum. Jeevan undengil enthenkilum cheriya help venel paranja mathi — editing, gaming angane okke enikku pattunna kaaryangal aankil 😌.

Eni next year ithupole wish cheyyaan pattumo enn ariyilla. Anyways, once again...
Happy Birthday, Patty Kunjeeee! 🎉❤️`,

  /* ---- Mini-game reward ---- */
  gameSecret: "You're the rarest thing in any world I'll ever play. Never forget how special you are. 💎",

  /* ---- Music corner (assets/music) ----
     Drop song files in assets/music and point each "src" at one.
     The ▶/❚❚ button plays & pauses; ⏭ / ⏮ change songs. */
  musicArtist: "By Devika",          // default artist shown for every song
  playlist: [
    { title: "song1", src: "assets/music/song1.mp3" },
    { title: "song2", src: "assets/music/song2.mp3" },
    { title: "song3", src: "assets/music/song3.mp3" },
    { title: "song4", src: "assets/music/song4.mp3" }
  ],

  /* ---- Birthday fortune (tap the cookie → a random sweet line) ----
     Add / change as many as you like. */
  fortuneTitle: "Your Birthday Fortune",
  fortunes: [
    "This year brings you everything you've been quietly hoping for.",
    "Someone feels luckier than they'll ever admit to have you.",
    "The best chapter of your story hasn't even started yet.",
    "You'll laugh until your stomach hurts very, very soon.",
    "Good things are on their way — you've more than earned them.",
    "A wish you make today will quietly find its way back to you.",
    "Sixteen is going to look incredible on you.",
    "You are exactly where you're meant to be. Keep going. ✨"
  ],

  /* ---- Surprise ending ----
     These appear ONE BY ONE in the center; the last line stays. */
  ending: [
    "Out of billions of people,",
    "I'm glad I met you.",
    "Happy 16th Birthday, Devutty."
  ],
  signature: "by your annoying foxyy 🦊",

  /* ---- Random gentle messages (small popups, occasional) ---- */
  randomMessages: [
    "psst… you're amazing.",
    "reminder: I'm really glad you exist.",
    "the world is softer with you in it.",
    "you just smiled, didn't you?",
    "16 looks good on you."
  ],

  /* ---- Konami code secret ---- */
  konamiMessage: "SECRET UNLOCKED\n\nYou actually did the Konami code.\nOf course you did.\nThat's exactly why you're my best friend. ♥"
};
