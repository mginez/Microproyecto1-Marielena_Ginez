//Data
const score = document.getElementById("score");
const timeValue = document.getElementById("time");
const username = document.getElementById("user");

//Buttons
const startButton2 = document.getElementById("start2");
const changeButton =  document.getElementById("change");
const restartButton = document.getElementById("restart");
const showButton = document.getElementById("show");

//Displayed elements
const gameContainer = document.querySelector(".game-container");
const header = document.getElementById("header");
const form = document.getElementById("form");
const won = document.getElementById("won");
const lost = document.getElementById("lost");
const wrapper = document.getElementById("wrapper");
const table = document.getElementById("table");

let cards;
let interval;
let remainingTime;
let firstCard = false;
let secondCard = false;
let started = false;
let flip = true;
let local = localStorage;

//Items array
const  items = [
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



// Store data in the Local Storage
const setData = (user, score) => { 
    let userString = local.getItem("users");
    let users = JSON.parse(userString) ?? []; //returns an empty list if the value is null
    users.push({"Username":user, "Score":score});
    local.setItem("users", JSON.stringify(users));

}


//Initial Time
let seconds = 0,
  minutes = 3;
  
  
//Initial score and win count
let winCount = 0,
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
    remainingTime = (minutes*60) + seconds; 
    scoreCalc = Math.round(1000 * (remainingTime/180));
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
        after => back side (contains actual image)
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
  
  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
        if (remainingTime != 0 && started==true && flip) { //If time is not over, the user already clicked 'start playing' and there aren't more than 2 cards shown
        
        //If selected card is not matched yet 
        if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard 
        if (!firstCard) {
          //current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
         
          //secondCard and value
          flip = false; // if the second card is selected, the user can't flip another one
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            flip = true;
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
                scoreCalculator();
                won.classList.remove("hide");
                clearInterval(interval);


                setData(username.value, scoreCalc);
                

                
                

              
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
              flip=true; //if both cards are hidden, the user can flip cards again
            }, 900);
          }
        }
      }
    }});
  });
};



//Initialize values and func calls
const initializer = () => {
  
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
initializer();


function createTable(data) {
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  
  // Create table header row
  const keys = Object.keys(data[0]);
  for (const key of keys) {
    const headerCell = document.createElement('th');
    headerCell.textContent = key;
    headerRow.appendChild(headerCell);
  }
  table.appendChild(headerRow);

  // Create table data rows
  for (const obj of data) {
    const dataRow = document.createElement('tr');
    for (const key of keys) {
      const dataCell = document.createElement('td');
      dataCell.textContent = obj[key];
      dataRow.appendChild(dataCell);
    }
    table.appendChild(dataRow);
  }

  return table;
}

function sortDictionary(dict) {


}



//////////////////
 

//Start game
startButton2.addEventListener("click", () => { 
    if (username.value!="") {
        started = true;
        form.classList.add("hide");
        header.innerHTML += `<p style="display:inline">Welcome,   ${username.value}`;
        
        //Initial values
        scoreCalc = 1000;
        seconds = 0;
        minutes = 3;
    
        //Start timer
        interval = setInterval(timeGenerator, 1000);
        //initial score
        score.innerHTML = `<span>Score:</span> ${scoreCalc}`;
        changeButton.classList.remove("hide");
        restartButton.classList.remove("hide");
        
    } else {
      window.alert("Please enter your username");
    }
});

restartButton.addEventListener("click", () => { 
    
    //Reset timer
    clearInterval(interval);
    //Reset values
    scoreCalc = 1000;
    seconds = 0;
    minutes = 3;
    //Start timer
    interval = setInterval(timeGenerator, 1000);
    //initial score
    score.innerHTML = `<span>Score:</span> ${scoreCalc}`;
    won.classList.add("hide");
    lost.classList.add("hide");
    initializer();
    
});

changeButton.addEventListener("click", () => { 

    ///header.removeChild(`Username:   ${username.value}`);
    form.classList.remove("hide");
    changeButton.classList.add("hide");
    restartButton.classList.add("hide");

});

showButton.addEventListener("click", () => {
    let scoretable = createTable(JSON.parse(local.getItem("users"))); 
   
    scoretable.classList.add("table");
    table.appendChild(scoretable);
    showButton.classList.add("hide");

});

