const character = document.getElementById("character");
const dialogue = document.getElementById("dialogue");

// FIX: was getElementsById("yesBtn") — but HTML had no IDs, only classes.
// Now that HTML has proper IDs, these will work correctly.
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

let step = 0;

const story = [
  {
    image: "character1.png",
    text: "Hello, I am Mimi!"
  },
  {
    image: "character2.png",
    text: "Would you like to help me play?"
  },
  {
    image: "character3.png",
    text: "Pleaseeeee~"
  },
  {
    image: "character4.png",
    text: "Yippieee!"
  }
];

function showStep(index) {
  step = index;
  character.src = story[step].image;
  dialogue.textContent = story[step].text;
}

function nextDialogue(e) {
  // FIX: if a choice button was clicked, don't also advance the dialogue.
  // Without this, the document click fires AND the button click fires,
  // so the story would jump two steps at once.
  if (e.target === yesBtn || e.target === noBtn) return;

  // Don't advance past the end of the story
  if (step >= story.length - 1) return;

  // Don't advance past step 1 via clicking — that step needs a button choice
  if (step === 1) return;

  showStep(step + 1);

  // Show buttons on step 1 (second dialogue)
  if (step === 1) {
    yesBtn.style.display = "inline-block";
    noBtn.style.display = "inline-block";
  } else {
    yesBtn.style.display = "none";
    noBtn.style.display = "none";
  }
}

// Set up button handlers once, outside nextDialogue
yesBtn.addEventListener("click", () => {
  // Skip "Pleaseeeee~", go straight to "Yippieee!"
  showStep(3);
  yesBtn.style.display = "none";
  noBtn.style.display = "none";
});

noBtn.addEventListener("click", () => {
  // Go to "Pleaseeeee~"
  showStep(2);
  yesBtn.style.display = "none";
  noBtn.style.display = "none";
});

document.addEventListener("click", (e) => {
  const newStep = step + 1;

  // FIX: stop if a button was clicked (handled separately above)
  if (e.target === yesBtn || e.target === noBtn) return;

  // Stop if already at or past end
  if (newStep >= story.length) return;

  // Stop advancing if we're at the choice step — buttons handle it
  if (step === 1) return;

  showStep(newStep);

  // Reveal buttons when we reach the choice dialogue
  if (newStep === 1) {
    yesBtn.style.display = "inline-block";
    noBtn.style.display = "inline-block";
  }
});