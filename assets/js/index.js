/*jshint esversion: 6 */

//Query Selectors
const websiteTitleRef = document.querySelector('.website-name');
const quizStartRef = document.querySelector('.art-home');
const quizModeRef = document.querySelector('#quiz-mode');
const quizGameRef = document.querySelector('.quiz-game');
const quizResultRef = document.querySelector('.quiz-result-next-section');
const quizNextBtnRef = document.querySelector('#next-question-btn');
const optionsRef = Array.from(document.querySelectorAll('.option-text'));
const optionBtnsRef = Array.from(document.querySelectorAll('.radio-button'));
const radioBtnsRef = document.querySelectorAll('.radio-button');
const scoreTextRef = document.querySelector('#quiz-result-score');
const startBtnRef = document.querySelector("#launch-start-btn");
const beginnerImgRef = document.querySelector("#beginner-img");
const intermediateImgRef = document.querySelector("#intermediate-img");
const expertImgRef = document.querySelector("#expert-img");
const dialogRef = document.querySelector("dialog");
const showDialogBtnRef = document.querySelector("#open-dialog-btn");
const closeDialogBtnRef = document.querySelector("dialog button");
const playAgainBtnRef = document.querySelector("#play-again-btn");
const nextQuizBtnRef = document.querySelector("#next-quizmode-btn");
const currentQuestionNoRef = document.querySelector("#score-dynamic-text");
const totalQuestionNoRef = document.querySelector("#score-total-questions-text");
const quizQuestionTextRef = document.querySelector("#quiz-question");
const quizResultScoreRef = document.querySelector("#quiz-result-score");
const quizResultMaxRef = document.querySelector("#quiz-result-max");
const quizResultMessageRef = document.querySelector("#quiz-result-message-dynamic");
const quizCurrentModeRef = document.querySelector("#mode-dynamic-text");
const quizNextQuizModeRef = document.querySelector('#quiz-next-mode-label');

//CONSTANTS
const quizModes = ["beginner", "intermediate", "expert"];
const CORRECT_POINTS = 1;
const QUESTIONS_LIMIT = 5;


//Variables
let quizMode = quizModes[0];
let remainingQuestions = []; //available questions left out of 4
let questions = [];
let currentQuestion = {};
let allowAnswers = false;
let difficulty;
let processedQuestion;
let currentAnswer;
let resultMessage;
let quizScore = 0;
let questionCounter = 1;

//Functions
const startQuiz = () => {
    questionCounter = 1; 
    quizScore = 0;
    currentQuestionNoRef.textContent = questionCounter;
    totalQuestionNoRef.textContent = QUESTIONS_LIMIT;
    remainingQuestions = [ ...questions]
    getNewQuestion();
    // replace with getQuizAPIData();
};

/**
 * @param {"easy" | "medium" | "hard"} difficulty
 */
const getQuizAPIData = (difficulty) => {
    fetch(`https://opentdb.com/api.php?amount=5&category=25&difficulty=${difficulty}&type=multiple`) 
        .then(res => {
            return res.json();
        })
        .then((downloadedQuestions) => {
            console.log(downloadedQuestions.results);
            questions = downloadedQuestions.results.map((downloadedQuestion) => {
                const processedQuestion = {
                    question: downloadedQuestion.question,
                };
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
            //replace with getNewQuestion();
            console.log(difficulty);
        })
        .catch(err => {
            console.error(err);
        });
    
    }

const getNewQuestion = () => {
    if (remainingQuestions.length === 0 || questionCounter >= QUESTIONS_LIMIT) {
        endQuiz();
    }

    questionCounter++;
    const questionIndex = Math.floor(Math.random()*remainingQuestions.length);
    currentQuestion = remainingQuestions[questionIndex];
    quizQuestionTextRef.textContent = currentQuestion.question ;
    currentAnswer = currentQuestion.answer;

    optionsRef.forEach(option => {
        const number = option.dataset["number"];
        option.innerHTML = currentQuestion["option" + number];
    });

    remainingQuestions.splice(questionIndex, 1);
    allowAnswers = true;
};

const setResultMessage = () => {
    if ((quizScore === 0) || (quizScore === 1)) {
        resultMessage = "Better luck next time!";
    } else if ((quizScore === 2) || (quizScore === 3)) {
        resultMessage = "Woah, not bad at all!";
    } else if ((quizScore === 4) || (quizScore === 5)) {
        resultMessage = "Well done, you clearly know your stuff!";
    }
    quizResultMessageRef.textContent = resultMessage;
}

const endQuiz = () => {
    quizResultScoreRef.textContent = quizScore;
    quizResultMaxRef.textContent = QUESTIONS_LIMIT;
    setResultMessage();
    quizGameRef.classList.add("hidden");
    quizResultRef.classList.remove("hidden");
}

const setNextMode = () => {
    if (selectedMode === quizModes[0]) {
        selectedMode = quizModes[1];
        quizCurrentModeRef.textContent="Intermediate";
    } else if (selectedMode === quizModes[1]) {
        selectedMode = quizModes[2];
        quizCurrentModeRef.textContent="Expert";
    } else if (selectedMode === quizModes[2]) {
        selectedMode = quizModes[0];
        quizCurrentModeRef.textContent="Beginner";
    }
}

//Event Click
websiteTitleRef.addEventListener ("click", function() {
    quizStartRef.classList.remove("hidden");
    quizGameRef.classList.add("hidden");
    quizModeRef.classList.add("hidden");
    quizResultRef.classList.add("hidden");
}) 

startBtnRef.addEventListener ("click", function() {
    quizModeRef.classList.remove("hidden");
    quizStartRef.classList.add("hidden");
});

beginnerImgRef.addEventListener ("click", function() {
    quizGameRef.classList.remove("hidden");
    quizModeRef.classList.add("hidden");
    selectedMode = quizModes[0];
    quizCurrentModeRef.textContent="Beginner";
    quizNextQuizModeRef.textContent ="Intermediate";
    getQuizAPIData("easy");
}) 

intermediateImgRef.addEventListener ("click", function() {
    quizGameRef.classList.remove("hidden");
    quizModeRef.classList.add("hidden");
    selectedMode = quizModes[1];
    quizCurrentModeRef.textContent="Intermediate";
    quizNextQuizModeRef.textContent ="Expert";
    getQuizAPIData("medium");
}) 

expertImgRef.addEventListener ("click", function() {
    quizGameRef.classList.remove("hidden");
    quizModeRef.classList.add("hidden");
    selectedMode = quizModes[2];
    quizCurrentModeRef.textContent="Expert";
    quizNextQuizModeRef.textContent ="Beginner";
    getQuizAPIData("hard");
}) 

showDialogBtnRef.addEventListener("click", () => {
    dialogRef.showModal();
});

closeDialogBtnRef.addEventListener("click", () => {
    dialogRef.close();
  });

optionsRef.forEach(option => {
    option.addEventListener("click", e => {
        e.preventDefault(); 
        const selectedOption = e.target;
        const selectedAnswer = selectedOption.dataset["number"];
        console.log("user picked" + selectedAnswer + "the correct answer is" + currentAnswer);
        const classToApply = 
            selectedAnswer === currentAnswer ? "correct-option" : "incorrect-option";
        selectedOption.parentElement.classList.add(classToApply);
        radioBtnsRef.disabled = true;
        if (selectedAnswer === currentAnswer) {
            quizScore++;
        }
        currentQuestionNoRef.textContent = questionCounter;
        
        //only display finish button on final question
        if (remainingQuestions.length === 0) {
            quizNextBtnRef.parentElement.classList.remove("hidden");
        } else {
            setTimeout(() => {
                selectedOption.parentElement.classList.remove(classToApply);
                radioBtnsRef.disabled = false;
                getNewQuestion();
            }, 1200);
        }
    });
});

quizNextBtnRef.addEventListener ("click", function() {
    quizNextBtnRef.parentElement.classList.add("hidden");
    currentQuestionNoRef.textContent = questionCounter;
    getNewQuestion();
    radioBtnsRef.disabled = false;
})

playAgainBtnRef.addEventListener ("click", function() {
    quizGameRef.classList.remove("hidden");
    quizModeRef.classList.add("hidden");
    quizResultRef.classList.add("hidden");
    startQuiz();
    console.log(selectedMode);
}) 

nextQuizBtnRef.addEventListener ("click", function() {
    quizGameRef.classList.remove("hidden");
    quizModeRef.classList.add("hidden");
    quizResultRef.classList.add("hidden");
    setNextMode();
    startQuiz();
}) 