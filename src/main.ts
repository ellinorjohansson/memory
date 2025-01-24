import "./style.scss";
import cards, { IPlaycards } from "./ts/playCards";

const startMemory = document.getElementById('startButton') as HTMLButtonElement;
const memoryGrid = document.getElementById('memoryGrid') as HTMLElement;
const restartButton = document.getElementById('restartButton') as HTMLButtonElement; // Hämta knappen för att spela igen
const resultMessage = document.getElementById('resultMessage') as HTMLHeadingElement; // Meddelandet för att visa resultat

let firstCard: HTMLElement | null = null;
let secondCard: HTMLElement | null = null;
let lockBoard: boolean = false; // Hindrar fler klick när två kort är öppna
let matches: number = 0;

// Startknappen
startMemory.addEventListener('click', startGame);

// Spela igen-knappen
restartButton.addEventListener('click', startGame); 

// Startar spelet
function startGame() {
  memoryGrid.innerHTML = ""; // Rensa spelplanen
  const shuffledCards = shuffle(cards); // Blanda korten
  createGameGrid(shuffledCards); // Skapa spelplanen
  startMemory.style.display = "none"; // Dölj startknappen
  restartButton.style.display = "none"; // Dölj spela igen knappen när spelet startar om
  resultMessage.classList.add('hidden'); // Dölj resultatmeddelandet
  matches = 0; // Återställ antal matchningar
}

// Funktion för att blanda kort
function shuffle(array: IPlaycards[]): IPlaycards[] {
  return array.sort(() => Math.random() - 0.5);
}

// Funktion för att skapa spelplanen
function createGameGrid(shuffledCards: IPlaycards[]) {
  shuffledCards.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('memory-card');
    cardElement.dataset.value = card.name; 

    cardElement.innerHTML = ` 
      <div class="front"></div>
      <div class="back">${card.image}</div>
    `;

    cardElement.addEventListener('click', handleCardClick);
    memoryGrid.appendChild(cardElement);
  });
}

// Funktion som hanterar kortklick
function handleCardClick(event: MouseEvent) {
  const clickedCard = event.currentTarget as HTMLElement;

  // Förhindra klick om brädet är låst, kortet är samma som det första eller redan matchat
  if (lockBoard || clickedCard === firstCard || clickedCard.classList.contains('matched')) {
    return;
  }

  flipCard(clickedCard);

  if (!firstCard) {
    // Spara det första kortet som vänds
    firstCard = clickedCard;
    return;
  }

  // Spara det andra kortet
  secondCard = clickedCard;

  checkForMatch();
}

// Funktion för att vända ett kort
function flipCard(card: HTMLElement) {
  card.classList.add('flipped');
}

// Kontrollera om korten matchar
function checkForMatch() {
  if (!firstCard || !secondCard) return;

  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    // Om korten matchar, markera dem och återställ val
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matches++;
    resetSelection();

    // Kontrollera om spelet är slut
    if (matches === cards.length / 2) {
      setTimeout(() => {
        resultMessage.textContent = 'Du klarade spelet! 🎉';
        resultMessage.classList.remove('hidden'); 
        restartButton.style.display = "block"; 
      }, 500);
    }    
  } else {
    // Om korten inte matchar, vänd tillbaka dem efter en kort fördröjning
    lockBoard = true;
    setTimeout(() => {
      firstCard?.classList.remove('flipped');
      secondCard?.classList.remove('flipped');
      resetSelection();
    }, 1000);
  }
}

// Återställ val av första och andra kortet
function resetSelection() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}
