/*jshint esversion: 6 */

//Query Selectors
const quizStartRef = document.querySelector('.art-home');
const quizModeRef = document.querySelector('.quiz-mode');
const quizGameRef = document.querySelector('.quiz-game');
const quizHelpRef = document.querySelector('.quiz-help-info');
const quizResultRef = document.querySelector('.quiz-result-next-section');
const quizNextBtnRef = document.querySelector('#next-question-btn');
const questionRef = document.querySelector('#quiz-question');
const optionsRef = Array.from(document.querySelectorAll('.option-text'));
const optionBtnsRef = Array.from(document.querySelectorAll('.radio-button'));
const radioBtnsRef = document.querySelector('.radio-button');
const scoreTextRef = document.querySelector('#quiz-result-score');
const startBtnRef = document.querySelector("#launch-start-btn");
const scrollupBtnRef = document.querySelector("#scroll-up-btn");
const beginnerImgRef = document.querySelector("#beginner-img");
const intermediateImgRef = document.querySelector("#intermediate-img");
const expertImgRef = document.querySelector("#expert-img");
const playAgainBtnRef = document.querySelector("#play-again-btn");
const nextQuizBtnRef = document.querySelector("#next-quizmode-btn");
const currentQuestionNoRef = document.querySelector("#score-dynamic-text");
const totalQuestionNoRef = document.querySelector("#score-total-questions-text");
const quizQuestionTextRef = document.querySelector("#quiz-question");
const quizResultScoreRef = document.querySelector("#quiz-result-score");
const quizResultMaxRef = document.querySelector("#quiz-result-max");
const quizResultMessageRef = document.querySelector("#quiz-result-message-dynamic");
const quizCurrentModeRef = document.querySelector("#mode-dynamic-text");

quizModeRef.style.display = "none";
quizGameRef.style.display = "none";
quizHelpRef.style.display = "none";
quizResultRef.style.display = "none";
quizNextBtnRef.style.display = "none";

//CONSTANTS
const quizModes = ["beginner", "intermediate", "expert"];
const midnightColour = '#040406';
const greenColour = '#2AAA8A';
const redColour = '#C70039';
const CORRECT_POINTS = 1;
const QUESTIONS_LIMIT = 5;


//Variables
let quizMode = quizModes[0];
let remainingQuestions = []; //available questions left out of 4
let questions = [];
let currentQuestion = {};
let allowAnswers = false; //validation for user to answer
let processedQuestion;
let currentAnswer;
let resultMessage;
let quizScore = 0;
let questionCounter = 0;

//Functions
const startQuiz = () => {
    questionCounter = 0; 
    quizScore = 0;
    currentQuestionNoRef.textContent = questionCounter;
    totalQuestionNoRef.textContent = QUESTIONS_LIMIT;
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
    if ((quizScore == 0) || (quizScore == 1)) {
        resultMessage = "Better luck next time!";
    } else if ((quizScore == 2) || (quizScore == 3)) {
        resultMessage = "Woah, not bad at all!";
    } else if ((quizScore == 4) || (quizScore == 5)) {
        resultMessage = "Well done, you clearly know your stuff!";
    }
    quizResultMessageRef.textContent = resultMessage;
}

const endQuiz = () => {
    //if user answers all 5 questions, reveal results and hide other sections
    quizResultScoreRef.textContent = quizScore;
    quizResultMaxRef.textContent = QUESTIONS_LIMIT;
    setResultMessage();
    quizGameRef.style.display = "none";
    quizHelpRef.style.display = "none";
    quizResultRef.style.display = "block";
}

const setNextMode = () => {
    if (selectedMode == quizModes[0]) {
        selectedMode = quizModes[1];
        quizCurrentModeRef.textContent="Intermediate";
    } else if (selectedMode == quizModes[1]) {
        selectedMode = quizModes[2];
        quizCurrentModeRef.textContent="Expert";
    } else if (selectedMode == quizModes[2]) {
        selectedMode = quizModes[0];
        quizCurrentModeRef.textContent="Beginner";
    }
}

//Event Click
startBtnRef.addEventListener ("click", function() {
    if (quizModeRef.style.display === "none") {
        quizModeRef.style.display = "block";
        quizHelpRef.style.display = "block";
        quizStartRef.style.display = "none";
    } else {
        quizModeRef.style.display = "none";
        quizStartRef.style.display = "block";
    }
});

scrollupBtnRef.addEventListener ("click", function() {
    document.body.scrollTop = 0; //For Safari
    document.documentElement.scrollTop = 0; //For Chrome, Firefox, Internet Explorer and Opera
})

beginnerImgRef.addEventListener ("click", function() {
    quizGameRef.style.display = "block";
    quizModeRef.style.display = "none";
    selectedMode = quizModes[0];
    quizCurrentModeRef.textContent="Beginner";
    url = "https://opentdb.com/api.php?amount=5&category=25&difficulty=easy&type=multiple"
}) 

intermediateImgRef.addEventListener ("click", function() {
    quizGameRef.style.display = "block";
    quizModeRef.style.display = "none";
    selectedMode = quizModes[1];
    quizCurrentModeRef.textContent="Intermediate";
    url = "https://opentdb.com/api.php?amount=5&category=25&difficulty=medium&type=multiple"
}) 

expertImgRef.addEventListener ("click", function() {
    quizGameRef.style.display = "block";
    quizModeRef.style.display = "none";
    selectedMode = quizModes[2];
    quizCurrentModeRef.textContent="Expert";
    url = "https://opentdb.com/api.php?amount=5&category=25&difficulty=hard&type=multiple"
}) 

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
        const selectedOption = e.target;
        const selectedAnswer = selectedOption.dataset["number"];
        console.log("user picked" + selectedAnswer + "the correct answer is" + currentAnswer);
        //optionBtnsRef.isEnabled() = false;
        //case - correct answer
        if (selectedAnswer == currentAnswer) {
            quizScore++;
            selectedOption.style.color = greenColour; 
        //case - wrong answer
        } else {
            //TODO - correct option radio btn turn green, selected btn turn red
            selectedOption.style.color = redColour;
            
        }
        quizNextBtnRef.style.display = "block";
        optionsRef.style.color = midnightColour;
    });
});

quizNextBtnRef.addEventListener ("click", function() {
    quizNextBtnRef.style.display = "none";
    currentQuestionNoRef.textContent = questionCounter;
    getNewQuestion();
    radioBtnsRef.disabled = false;
})

//if user wants to play same mode again
playAgainBtnRef.addEventListener ("click", function() {
    quizGameRef.style.display = "block";
    quizModeRef.style.display = "none";
    quizResultRef.style.display = "none";
    quizHelpRef.style.display = "block";
    startQuiz();
    console.log(selectedMode);
}) 

nextQuizBtnRef.addEventListener ("click", function() {
    quizGameRef.style.display = "block";
    quizModeRef.style.display = "none";
    quizResultRef.style.display = "none";
    quizHelpRef.style.display = "block";
    setNextMode();
    startQuiz();
}) 