// TODO - declare this in index.html with a script tag

//Navigation Variables
const quizStartSection = document.querySelector('.art-home');
const quizModeSection = document.querySelector('.quiz-mode');
quizModeSection.style.display = "none";


//Quiz Game Variables
const question = document.getElementById('quiz-question');
const options = Array.from(document.getElementsByClassName('option-text'));
const scoreText = document.querySelector('#quiz-result-score');
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
        quizStartSection.style.display = "none";
        console.log("btn is hit")
    } else {
        quizModeSection.style.display = "none";
        quizStartSection.style.display = "block";
        console.log("hit")
    }
};


/*
//Retrieving quiz questions & answers from OpenAPI
fetch(
    'https://opentdb.com/api.php?amount=5&category=25&difficulty=easy&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((downloadedQuestions) => {
        //converting array items into a processedQuestion and return to array
        questions = downloadedQuestions.results.map((downloadedQuestion) => {
            const processedQuestion = {
                question: downloadedQuestion.question,
            };

            const answerOptions = [...downloadedQuestion.incorrect_answers];
            processedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerOptions.splice(
                processedQuestion.answer - 1,
                0,
                downloadedQuestion.correct_answer
            );

            answerOptions.forEach((option, index) => {
                processedQuestion['option' + (index + 1)] = option;
            });

            return processedQuestion;
        });
        console.log(processedQuestion);
        startQuiz();
    })
    .catch((error) => {
        console.error(error);
    });

    startQuiz = () => {
        questionCounter = 0;
        quizScore = 0;
        availableQuesions = [...questions];
        getNewQuestion();
    };

    getNewQuestion = () => {
        if (availableQuestions.length === 0 || questionCounter >= questions_limit) {
            localStorage.setItem('latestScore', quizScore);
            //display results view
            document.getElementByClass('quiz-result-next-section').style.display='block'; 
        }
        questionCounter++;
        progressText.innerText = `${questionCounter}/${questions_limit}`;
    
        const questionIndex = Math.floor(Math.random() * remainingQuestions.length);
        currentQuestion = remainingQuestions[questionIndex];
        question.innerText = currentQuestion.question;
    
        options.forEach((option) => {
            const number = choice.dataset['number'];
            option.innerText = currentQuestion['option' + number];
        });
    
        remainingQuestions.splice(questionIndex, 1);
        acceptingAnswers = true;
    };

    //TODO - add user selecting quiz options events

    */