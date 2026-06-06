const character = document.getElementById("character");
const dialogue = document.getElementById("dialogue");


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
  
  if (e.target === yesBtn || e.target === noBtn)
     return;

  if (step >= story.length - 1) 
    return;

  if (step === 1)
     return;

  showStep(step + 1);

  // Show buttons on step 1 
  if (step === 1) {
    yesBtn.style.display = "inline-block";
    noBtn.style.display = "inline-block";
  } else {
    yesBtn.style.display = "none";
    noBtn.style.display = "none";
  }
}


yesBtn.addEventListener("click", () => {
  // Skip "Pleaseeeee~", go straight to "Yippieee!"
  showStep(3);
  yesBtn.style.display = "none";
  noBtn.style.display = "none";
});

noBtn.addEventListener("click", () => {
  // Go to "Please"
  showStep(2);
  yesBtn.style.display = "none";
  noBtn.style.display = "none";
});

document.addEventListener("click", (e) => {
  const newStep = step + 1;
  if (e.target === yesBtn || e.target === noBtn) return;
  if (newStep >= story.length){
window.location.href="./menu.html";
return;
  }
  if (step === 1) return;

  showStep(newStep);

  // Reveal buttons 
  if (newStep === 1) {
    yesBtn.style.display = "inline-block";
    noBtn.style.display = "inline-block";
  }

});