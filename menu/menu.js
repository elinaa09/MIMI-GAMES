// Get the audio element
const hoverSound = document.getElementById('hover-sound');

// Lower the volume a bit so it doesn't blast the user
hoverSound.volume = 0.3;

// Find all game cards
const gameCards = document.querySelectorAll('.game-card');

// Add the sound effect to every card when mouse enters it
gameCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Reset the audio to the beginning in case it's already playing
        hoverSound.currentTime = 0; 
        
        // Play the sound
        hoverSound.play().catch(error => {
            // Browsers block audio until the user clicks *somewhere* first.
            // This catch prevents the console from showing annoying errors.
            console.log("Audio waiting for user interaction.");
        });
    });
});