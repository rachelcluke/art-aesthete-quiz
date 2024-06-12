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
const QUESTIONS_LIMIT = 5;


//Variables
let remainingQuestions = []; //available questions left out of 4
let questions = [];
let currentQuestion = {};
let allowAnswers = false;
let difficulty;
let currentAnswer;
let resultMessage;
let selectedMode;
let quizScore = 0;
let questionCounter = 1;

//Functions
const startQuiz = (difficulty) => {
    questionCounter = 1; 
    quizScore = 0;
    getQuizAPIData(difficulty);
    currentQuestionNoRef.textContent = questionCounter;
    totalQuestionNoRef.textContent = QUESTIONS_LIMIT;
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
            questions = downloadedQuestions.results.map((downloadedQuestion) => {
                const processedQuestion = {
                    question: downloadedQuestion.question,
                };
                const answerOptions = [...downloadedQuestion.incorrect_answers];
                processedQuestion.answer = Math.floor(Math.random() * 3) + 1;
                answerOptions.splice(processedQuestion.answer -1, 0, downloadedQuestion.correct_answer
                );
    
                answerOptions.forEach((option, index) => {
                    processedQuestion['option' + (index + 1)] = option;
                });
                return processedQuestion;
            });
            remainingQuestions = [ ...questions];
            getNewQuestion();
        })
        .catch(err => {
            console.error(err);
        });
    
    };

const getNewQuestion = () => {
    questionCounter++;
    const questionIndex = Math.floor(Math.random()*remainingQuestions.length);
    currentQuestion = remainingQuestions[questionIndex];
    quizQuestionTextRef.textContent = currentQuestion.question ;
    currentAnswer = currentQuestion.answer;

    optionsRef.forEach(option => {
        const number = option.dataset.number;
        option.innerHTML = currentQuestion["option" + number];
    });

    remainingQuestions.splice(questionIndex, 1);
    allowAnswers = true;
};

const setResultMessage = () => {
    if ((quizScore === 0) || (quizScore === 1)) {
        resultMessage = "Better luck next time!";
    } else if ((quizScore === 2) || (quizScore ===  3)) {
        resultMessage = "Woah, not bad at all!";
    } else if ((quizScore === 4) || (quizScore === 5)) {
        resultMessage = "Well done, you clearly know your stuff!";
    }
    quizResultMessageRef.textContent = resultMessage;
};

const endQuiz = () => {
    quizResultScoreRef.textContent = quizScore;
    quizResultMaxRef.textContent = QUESTIONS_LIMIT;
    setResultMessage();
    quizGameRef.classList.add("hidden");
    quizResultRef.classList.remove("hidden");
};

const setNextMode = () => {
    if (selectedMode === quizModes[0]) {
        selectedMode = quizModes[1];
        difficulty="medium";
        quizCurrentModeRef.textContent="Intermediate";

    } else if (selectedMode === quizModes[1]) {
        selectedMode = quizModes[2];
        difficulty="hard";
        quizCurrentModeRef.textContent="Expert";
    } else if (selectedMode === quizModes[2]) {
        selectedMode = quizModes[0];
        difficulty="easy";
        quizCurrentModeRef.textContent="Beginner";
    }
};

//Event Click
websiteTitleRef.addEventListener ("click", function() {
    quizStartRef.classList.remove("hidden");
    quizGameRef.classList.add("hidden");
    quizModeRef.classList.add("hidden");
    quizResultRef.classList.add("hidden");
}); 

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
    difficulty="easy";
    startQuiz(difficulty);
}); 

intermediateImgRef.addEventListener ("click", function() {
    quizGameRef.classList.remove("hidden");
    quizModeRef.classList.add("hidden");
    selectedMode = quizModes[1];
    quizCurrentModeRef.textContent="Intermediate";
    quizNextQuizModeRef.textContent ="Expert";
    difficulty="medium";
    startQuiz(difficulty);
}); 

expertImgRef.addEventListener ("click", function() {
    quizGameRef.classList.remove("hidden");
    quizModeRef.classList.add("hidden");
    selectedMode = quizModes[2];
    quizCurrentModeRef.textContent="Expert";
    quizNextQuizModeRef.textContent ="Beginner";
    difficulty="hard";
    startQuiz(difficulty);
}); 

showDialogBtnRef.addEventListener("click", () => {
    dialogRef.showModal();
});

closeDialogBtnRef.addEventListener("click", () => {
    dialogRef.close();
  });

optionBtnsRef.forEach(option => {
    option.addEventListener("click", e => {
        e.preventDefault(); 
        const selectedOption = e.target;
        const selectedAnswer = selectedOption.dataset.number;
        const classToApply = 
            selectedAnswer == currentAnswer ? "correct-option" : "incorrect-option";
        selectedOption.parentElement.classList.add(classToApply);
        radioBtnsRef.disabled = true;
        if (selectedAnswer == currentAnswer) {
            quizScore++;
        }
        
        //only display finish button on final question
        if (remainingQuestions.length === 1) {
            currentQuestionNoRef.textContent = questionCounter;
            quizNextBtnRef.parentElement.classList.remove("hidden");
            setTimeout(() => {
                selectedOption.parentElement.classList.remove(classToApply);
            }, 2000);
            
        } else {
            setTimeout(() => {
                selectedOption.parentElement.classList.remove(classToApply);
                radioBtnsRef.disabled = false;
                currentQuestionNoRef.textContent = questionCounter;
                getNewQuestion();
            }, 1200);
        }
    });
});

quizNextBtnRef.addEventListener ("click", function() {
    quizNextBtnRef.parentElement.classList.add("hidden");
    endQuiz();
    radioBtnsRef.disabled = false;
});

playAgainBtnRef.addEventListener ("click", function() {
    quizGameRef.classList.remove("hidden");
    quizModeRef.classList.add("hidden");
    quizResultRef.classList.add("hidden");
    startQuiz(difficulty);
}); 

nextQuizBtnRef.addEventListener ("click", function() {
    quizGameRef.classList.remove("hidden");
    quizModeRef.classList.add("hidden");
    quizResultRef.classList.add("hidden");
    setNextMode();
    startQuiz(difficulty);
}); 