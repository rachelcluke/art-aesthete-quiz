/*jshint esversion: 6 */

// TODO - declare this in index.html with a script tag

//Navigation Variables
const quizStartSection = document.querySelector('.art-home');
const quizModeSection = document.querySelector('.quiz-mode');
const quizGameSection = document.querySelector('.quiz-game');
const quizHelpSection = document.querySelector('.quiz-help-info');
const quizResultSection = document.querySelector('.quiz-result-next-section');
const quizNextButton = document.querySelector('#next-question-btn');
quizModeSection.style.display = "none";
quizGameSection.style.display = "none";
quizHelpSection.style.display = "none";
quizResultSection.style.display = "none";
quizNextButton.style.display = "none";

//Quiz Game Variables
const question = document.getElementById('quiz-question');
const options = Array.from(document.getElementsByClassName('option-text'));
const radioBtns = document.querySelector('.radio-button');
const scoreText = document.querySelector('#quiz-result-score');
const quizModes = ["beginner", "intermediate", "expert"];
let quizMode = quizModes[0];
let allowAnswers = false; //validation for user to answer
let currentQuestion = {};
let quizScore = 0;
let questionCounter = 0;
let remainingQuestions = []; //available questions left out of 4

//CONSTANTS
const correct_points = 1;
const questions_limit = 5;

let questions = [];
let processedQuestion;
let currentAnswer;
let resultMessage;
//let url;

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
    url = "https://opentdb.com/api.php?amount=5&category=25&difficulty=easy&type=multiple"
} 

document.querySelector("#intermediate-img").onclick = function() {
    quizGameSection.style.display = "block";
    quizModeSection.style.display = "none";
    selectedMode = quizModes[1];
    document.getElementById("mode-dynamic-text").textContent="Intermediate";
    url = "https://opentdb.com/api.php?amount=5&category=25&difficulty=medium&type=multiple"
} 

document.querySelector("#expert-img").onclick = function() {
    quizGameSection.style.display = "block";
    quizModeSection.style.display = "none";
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

startQuiz = () => {
    //reset
    questionCounter = 0;
    quizScore = 0;
    document.getElementById("score-dynamic-text").textContent = questionCounter;
    document.getElementById("score-total-questions-text").textContent = questions_limit;
    remainingQuestions = [ ...questions]
    getNewQuestion();
};

getNewQuestion = () => {
    if (remainingQuestions.length === 0 || questionCounter >= questions_limit) {
        endQuiz();
    }

    questionCounter ++;
    const questionIndex = Math.floor(Math.random()*remainingQuestions.length);
    currentQuestion = remainingQuestions[questionIndex];
    document.getElementById("quiz-question").textContent = currentQuestion.question ;
    currentAnswer = currentQuestion.answer;

    options.forEach(option => {
        const number = option.dataset["number"];
        option.innerText = currentQuestion["option" + number];
    });

    remainingQuestions.splice(questionIndex, 1);
    allowAnswers = true;
};

options.forEach(option => {
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
        quizNextButton.style.display = "block";
    });
});

quizNextButton.onclick = function() {
    quizNextButton.style.display = "none";
    document.getElementById("score-dynamic-text").textContent = questionCounter;
    getNewQuestion();
    radioBtns.disabled = false;
}

endQuiz = () => {
    //if user answers all 5 questions, reveal results and hide other sections
    document.getElementById("quiz-result-score").textContent = quizScore;
    document.getElementById("quiz-result-max").textContent = questions_limit;
    setResultMessage();
    quizGameSection.style.display = "none";
    quizHelpSection.style.display = "none";
    quizResultSection.style.display = "block";
}

setResultMessage = () => {
    if ((quizScore == 0) || (quizScore == 1)) {
        resultMessage = "Better luck next time!";
    } else if ((quizScore == 2) || (quizScore == 3)) {
        resultMessage = "Woah, not bad at all!";
    } else if ((quizScore == 4) || (quizScore == 5)) {
        resultMessage = "Well done, you clearly know your stuff!";
    }
    document.getElementById("quiz-result-message-dynamic").textContent = resultMessage;
}

//if user wants to play same mode again
document.querySelector("#play-again-btn").onclick = function() {
    quizGameSection.style.display = "block";
    quizModeSection.style.display = "none";
    quizResultSection.style.display = "none";
    quizHelpSection.style.display = "block";
    startQuiz();
    console.log(selectedMode);
} 

//next mode button 
setNextMode = () => {
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

document.querySelector("#next-quizmode-btn").onclick = function() {
    quizGameSection.style.display = "block";
    quizModeSection.style.display = "none";
    quizResultSection.style.display = "none";
    quizHelpSection.style.display = "block";
    setNextMode();
    startQuiz();
} 