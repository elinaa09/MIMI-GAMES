const soundplay = require('soundplay');
const path = require('path');

// Get the absolute path to your audio file
const audioPath = path.join(__dirname, 'success.mp3');

// Play the sound
soundplay.play(audioPath)
    .then(() => console.log("Sound finished playing!"))
    .catch(err => console.error("Error playing sound:", err));