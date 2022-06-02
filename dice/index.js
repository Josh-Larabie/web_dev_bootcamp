var dice = [];
var imgPath = "images/dice";

dice[0] = randDiceNum();
dice[1] = randDiceNum();

document.querySelectorAll("img")[0].setAttribute("src", imgPath + dice[0] + ".png")
document.querySelectorAll("img")[1].setAttribute("src", imgPath + dice[1] + ".png")
document.querySelector("h1").innerHTML = declareWinner(dice[0], dice[1]);

function randDiceNum() {
  return Math.floor(Math.random() * 6) + 1; //1-6
}

function declareWinner(dice1, dice2) {
  if (dice1 > dice2) {
    return "🚩 Play 1 Wins!";
  } else if (dice2 > dice1) {
    return "Player 2 Wins! 🚩";
  } else {
    return "Draw!";
  }


}