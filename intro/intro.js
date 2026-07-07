const bgMusic = new Audio("../sounds/bg.mp3");
bgMusic.loop = true;

const clickSound = new Audio("../sounds/click.mp3");

const character = document.getElementById("character");
const dialogue = document.getElementById("dialogue");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const okayBtn = document.getElementById("okayBtn");
const okBtn = document.getElementById("okBtn");

const skipBtn = document.getElementById("skipBtn");

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

function hideAllButtons() {
  yesBtn.style.display = "none";
  noBtn.style.display = "none";
  okayBtn.style.display = "none";
  okBtn.style.display = "none";
}

function showStep(index) {
  step = index;

  character.src = story[step].image;
  dialogue.textContent = story[step].text;

  hideAllButtons();

  if (step === 1) {
    yesBtn.style.display = "inline-block";
    noBtn.style.display = "inline-block";
  }

  if (step === 2) {
    okayBtn.style.display = "inline-block";
    okBtn.style.display = "inline-block";
  }
}

yesBtn.addEventListener("click", () => {
  clickSound.currentTime = 0;
  clickSound.play();

  showStep(3);
});

noBtn.addEventListener("click", () => {
  clickSound.currentTime = 0;
  clickSound.play();

  showStep(2);
});

okayBtn.addEventListener("click", () => {
  clickSound.currentTime = 0;
  clickSound.play();

  showStep(3);
});

okBtn.addEventListener("click", () => {
  clickSound.currentTime = 0;
  clickSound.play();

  showStep(3);
});

skipBtn.addEventListener("click", () => {
  window.location.href = "/menu/menu.html";
  clickSound.currentTime = 0;
  clickSound.play();
});

document.addEventListener("click", (e) => {

  if (
    e.target === yesBtn||   // Above shift
    e.target === noBtn ||
    e.target === okayBtn ||
    e.target === okBtn ||
    e.target === skipBtn 
  ) {
    return;
  }

  if (step === story.length - 1) {
    window.location.href = "/menu/menu.html";
    return;
  }

  if (step === 1 || step === 2) {
    return;
  }

  showStep(step + 1);
});