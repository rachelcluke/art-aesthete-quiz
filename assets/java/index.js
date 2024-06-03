/*jshint esversion: 6 */

const quizStartRef = document.querySelector('.art-home');
const quizModeRef = document.querySelector('.quiz-mode');
const quizGameRef = document.querySelector('.quiz-game');
const quizHelpRef = document.querySelector('.quiz-help-info');
const quizResultRef = document.querySelector('.quiz-result-next-section');
const quizNextBtnRef = document.querySelector('#next-question-btn');
const questionRef = document.querySelector('#quiz-question');
const optionsRef = Array.from(document.querySelectorAll('.option-text'));
const radioBtnsRef = document.querySelector('.radio-button');
const scoreTextRef = document.querySelector('#quiz-result-score');
quizModeRef.style.display = "none";
quizGameRef.style.display = "none";
quizHelpRef.style.display = "none";
quizResultRef.style.display = "none";
quizNextBtnRef.style.display = "none";

//Quiz Game Variables
const quizModes = ["beginner", "intermediate", "expert"];
let quizMode = quizModes[0];
let allowAnswers = false; //validation for user to answer
let currentQuestion = {};
let quizScore = 0;
let questionCounter = 0;
let remainingQuestions = []; //available questions left out of 4

//CONSTANTS
const CORRECT_POINTS = 1;
const QUESTIONS_LIMIT = 5;

let questions = [];
let processedQuestion;
let currentAnswer;
let resultMessage;

//Functions
const startQuiz = () => {
    questionCounter = 0; 
    quizScore = 0;
    document.getElementById("score-dynamic-text").textContent = questionCounter;
    document.getElementById("score-total-questions-text").textContent = QUESTIONS_LIMIT;
    remainingQuestions = [ ...questions]
    getNewQuestion();
};

const getNewQuestion = () => {
    if (remainingQuestions.length === 0 || questionCounter >= QUESTIONS_LIMIT) {
        endQuiz();
    }

    questionCounter ++;
    const questionIndex = Math.floor(Math.random()*remainingQuestions.length);
    currentQuestion = remainingQuestions[questionIndex];
    document.getElementById("quiz-question").textContent = currentQuestion.question ;
    currentAnswer = currentQuestion.answer;

    optionsRef.forEach(option => {
        const number = option.dataset["number"];
        option.innerHTML = currentQuestion["option" + number];
    });

    remainingQuestions.splice(questionIndex, 1);
    allowAnswers = true;
};

const endQuiz = () => {
    //if user answers all 5 questions, reveal results and hide other sections
    document.getElementById("quiz-result-score").textContent = quizScore;
    document.getElementById("quiz-result-max").textContent = QUESTIONS_LIMIT;
    setResultMessage();
    quizGameRef.style.display = "none";
    quizHelpRef.style.display = "none";
    quizResultRef.style.display = "block";
}

const setResultMessage = () => {
    if ((quizScore == 0) || (quizScore == 1)) {
        resultMessage = "Better luck next time!";
    } else if ((quizScore == 2) || (quizScore == 3)) {
        resultMessage = "Woah, not bad at all!";
    } else if ((quizScore == 4) || (quizScore == 5)) {
        resultMessage = "Well done, you clearly know your stuff!";
    }
    document.getElementById("quiz-result-message-dynamic").textContent = resultMessage;
}

const setNextMode = () => {
    if (selectedMode == quizModes[0]) {
        selectedMode = quizModes[1];
        document.getElementById("mode-dynamic-text").textContent="Intermediate";
    } else if (selectedMode == quizModes[1]) {
        selectedMode = quizModes[2];
        document.getElementById("mode-dynamic-text").textContent="Expert";
    } else if (selectedMode == quizModes[2]) {
        selectedMode = quizModes[0];
        document.getElementById("mode-dynamic-text").textContent="Beginner";
    }
}

//Event Click
document.querySelector("#launch-start-btn").onclick = function() {
    if (quizModeRef.style.display === "none") {
        quizModeRef.style.display = "block";
        quizHelpRef.style.display = "block";
        quizStartRef.style.display = "none";
    } else {
        quizModeRef.style.display = "none";
        quizStartRef.style.display = "block";
    }
};

document.querySelector("#scroll-up-btn").onclick = function() {
    document.body.scrollTop = 0; //For Safari
    document.documentElement.scrollTop = 0; //For Chrome, Firefox, Internet Explorer and Opera
}

document.querySelector("#beginner-img").onclick = function() {
    quizGameRef.style.display = "block";
    quizModeRef.style.display = "none";
    selectedMode = quizModes[0];
    document.getElementById("mode-dynamic-text").textContent="Beginner";
    url = "https://opentdb.com/api.php?amount=5&category=25&difficulty=easy&type=multiple"
} 

document.querySelector("#intermediate-img").onclick = function() {
    quizGameRef.style.display = "block";
    quizModeRef.style.display = "none";
    selectedMode = quizModes[1];
    document.getElementById("mode-dynamic-text").textContent="Intermediate";
    url = "https://opentdb.com/api.php?amount=5&category=25&difficulty=medium&type=multiple"
} 

document.querySelector("#expert-img").onclick = function() {
    quizGameRef.style.display = "block";
    quizModeRef.style.display = "none";
    selectedMode = quizModes[2];
    document.getElementById("mode-dynamic-text").textContent="Expert";
    url = "https://opentdb.com/api.php?amount=5&category=25&difficulty=hard&type=multiple"
} 

//This condition is so that it is only triggered after the mode is selected 
//if url !== null 
fetch("https://opentdb.com/api.php?amount=5&category=25&difficulty=easy&type=multiple") 
    .then(res => {
        return res.json();
    })
    .then((downloadedQuestions) => {
        console.log(downloadedQuestions.results);
        questions = downloadedQuestions.results.map((downloadedQuestion) => {
            const processedQuestion = {
                question: downloadedQuestion.question,
            };
            //spread operator to copy over incorrect answers
            const answerOptions = [...downloadedQuestion.incorrect_answers];
            console.log(answerOptions);
            processedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerOptions.splice(processedQuestion.answer -1, 0, downloadedQuestion.correct_answer
            );

            answerOptions.forEach((option, index) => {
                processedQuestion['option' + (index + 1)] = option;
            });

            return processedQuestion;
        });
        startQuiz();
    })
    .catch(err => {
        console.error(err);
    });

optionsRef.forEach(option => {
    option.addEventListener("click", e => {
        //if (!allowAnswers) return; //validation to allow user to answer question 
        //allowAnswers = false;
        const selectedOption = e.target;
        const selectedAnswer = selectedOption.dataset["number"];
        console.log("user picked" + selectedAnswer + "the correct answer is" + currentAnswer);
        //case - correct answer
        if (selectedAnswer == currentAnswer) {
            quizScore++;
            //TODO - button turn green
        //case - wrong answer
        } else {
            //TODO - correct option radio btn turn green, selected btn turn red
            
        }
        quizNextBtnRef.style.display = "block";
    });
});

quizNextBtnRef.onclick = function() {
    quizNextBtnRef.style.display = "none";
    document.getElementById("score-dynamic-text").textContent = questionCounter;
    getNewQuestion();
    radioBtnsRef.disabled = false;
}

//if user wants to play same mode again
document.querySelector("#play-again-btn").onclick = function() {
    quizGameRef.style.display = "block";
    quizModeRef.style.display = "none";
    quizResultRef.style.display = "none";
    quizHelpRef.style.display = "block";
    startQuiz();
    console.log(selectedMode);
} 

document.querySelector("#next-quizmode-btn").onclick = function() {
    quizGameRef.style.display = "block";
    quizModeRef.style.display = "none";
    quizResultRef.style.display = "none";
    quizHelpRef.style.display = "block";
    setNextMode();
    startQuiz();
} 