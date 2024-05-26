// TODO - declare this in index.html with a script tag

//Navigation Variables
const quizStartSection = document.querySelector('.art-home');
const quizModeSection = document.querySelector('.quiz-mode');
const quizGameSection = document.querySelector('.quiz-game');
const quizHelpSection = document.querySelector('.quiz-help-info');
const quizResultSection = document.querySelector('.quiz-result-next-section');
quizModeSection.style.display = "none";
quizGameSection.style.display = "none";
quizHelpSection.style.display = "none";
quizResultSection.style.display = "none";

//Quiz Game Variables
const question = document.getElementById('quiz-question');
const options = Array.from(document.getElementsByClassName('option-text'));
const scoreText = document.querySelector('#quiz-result-score');
const quizModes = ["beginner", "intermediate", "expert"];
let quizMode = quizModes[0];
let currentQuestion = {};
let correctAnswers = true;
let quizScore = 0;
let questionCounter = 0;
let remainingQuestions = []; //available questions left

//CONSTANTS
const correct_points = 1;
const questions_limit = 5;

let questions = [];


//Navigation (hide/display views)
document.querySelector("#launch-start-btn").onclick = function() {
    if (quizModeSection.style.display === "none") {
        quizModeSection.style.display = "block";
        quizHelpSection.style.display = "block";
        quizStartSection.style.display = "none";
    } else {
        quizModeSection.style.display = "none";
        quizStartSection.style.display = "block";
    }
};

document.querySelector("#scroll-up-btn").onclick = function() {
    document.body.scrollTop = 0; //For Safari
    document.documentElement.scrollTop = 0; //For Chrome, Firefox, Internet Explorer and Opera
}

document.querySelector("#beginner-img").onclick = function() {
    quizGameSection.style.display = "block";
    quizModeSection.style.display = "none";
    selectedMode = quizModes[0];
    document.getElementById("mode-dynamic-text").textContent="Beginner";
    console.log("beginner mode");
} 

document.querySelector("#intermediate-img").onclick = function() {
    quizGameSection.style.display = "block";
    quizModeSection.style.display = "none";
    selectedMode = quizModes[1];
    document.getElementById("mode-dynamic-text").textContent="Intermediate";
    console.log("intermediate mode");
} 

document.querySelector("#expert-img").onclick = function() {
    quizGameSection.style.display = "block";
    quizModeSection.style.display = "none";
    selectedMode = quizModes[2];
    document.getElementById("mode-dynamic-text").textContent="Expert";
    console.log("expert mode");
} 

//TODO - add function for play again button (display game section using same mode, hide result section)
//TODO - add function for start button (add logic for which mode to display/ mode to navigate to)

fetch("https://opentdb.com/api.php?amount=5&category=25&difficulty=easy&type=multiple") 
.then(res => {
    return res.json();
})
.then(downloadedQuestions => {
    console.log(downloadedQuestions.results);
    downloadedQuestions.results.map(downloadedQuestion => {
        const processedQuestion = {
            question: downloadedQuestion.questions
        };
    })
})
.catch(err => {
    console.error(err);
});

//TODO - add user selecting quiz options events