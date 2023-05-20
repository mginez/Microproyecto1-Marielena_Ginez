
const score = document.getElementById("score");
const timeValue = document.getElementById("time");
const username = document.getElementById("user");

const stopButton = document.getElementById("stop");
const startButton2 = document.getElementById("start2");
const changeButton =  document.getElementById("change");
const restartButton = document.getElementById("restart");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const header = document.getElementById("header");
const form = document.getElementById("form");
let cards;
let interval;
let remaining_time;
let firstCard = false;
let secondCard = false;

//Items array
const items = [
  { name: "laura", image: "laura.jpg" },
  { name: "eugenio", image: "eugenio.jpg" },
  { name: "valentin", image: "valentin.jpg" },
  { name: "saman", image: "saman.jpg" },
  { name: "escultura", image: "escultura.jpg" },
  { name: "campus", image: "campus.jpg" },
  { name: "gandhi", image: "gandhi.jpg" },
  { name: "migente", image: "migente.jpg" },
  { name: "guri", image: "guri.jpg" },
  { name: "asturias", image: "asturias.jpg" }
];
//Initial Time
let seconds = 0,
  minutes = 3;
  
  
//Initial moves and win count
let movesCount = 0,
  winCount = 0
  scoreCalc = 1000;
//For timer
const timeGenerator = () => {
    if (seconds>0) {
        seconds -= 1; 
        scoreCalculator();
    }
    //minutes logic
    if (seconds <= 0 && minutes>0) {
        minutes -= 1;
        seconds = 59;
        
    }    
    

  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};


//////



//For calculating score
const scoreCalculator = () => {
    remaining_time = (minutes*60) + seconds; 
    scoreCalc = Math.round(1000 * (remaining_time/180));
    score.innerHTML = `<span>Score:</span>${scoreCalc}`;
  };

//////

//Pick random objects from the items array
const generateRandom = (size = 4) => {
  //temporary array
  let tempArray = [...items];
  //initializes cardValues array
  let cardValues = [];
  //size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (size * size) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};
const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Create Cards
        before => front side (contains unimet's logo)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before" style="background-color:#5AABED;"> <img src='./logo.png' width='50px'> </div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image" style="border-radius:5px;"/></div>
     </div>
     `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
  
  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
        if (remaining_time != 0) { //If time is not over

        //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
        if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
         
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
                scoreCalculator();
              result.innerHTML = `<h2>You Won</h2>
            <h4>Score: ${scoreCalc}</h4>`;
              stopGame();
            }
          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    }});
  });
};


//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);
//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};


initializer();


startButton2.addEventListener("click", () => { 
    if (username.value!="") {
        
        form.classList.add("hide");
        header.innerHTML += `<p style="display:inline">Username:   ${username.value}`;
        
        scoreCalc = 1000;
        seconds = 0;
        minutes = 3;
    
        //Start timer
        interval = setInterval(timeGenerator, 1000);
        //initial score
        score.innerHTML = `<span>Score:</span> ${scoreCalc}`;
        changeButton.classList.remove("hide");
        
    }
});

restartButton.addEventListener("click", () => { 
    scoreCalc = 1000;
    seconds = 0;
    minutes = 3;
    //Start timer
    interval = setInterval(timeGenerator, 1000);
    //initial score
    score.innerHTML = `<span>Score:</span> ${scoreCalc}`;
    initializer();
});