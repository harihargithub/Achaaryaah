// quiz.js 250923 0959

// Question object --
// text - question to the user
// choices - options to select
// answer - correct answer
function Question(text, choices, answer) {
  this.text = text;
  this.choices = choices;
  this.answer = answer;
}

// Create an array of questions
var questions = [
  new Question(
    'Who is called the "Poet of Nature"?',
    ['Lord Byron', 'John Keats', 'P.B. Shelley', 'William Wordsworth'],
    'William Wordsworth',
  ),
  new Question(
    'Who is the greatest modern English Dramatist?',
    ['G. B. Shaw', 'Shakespeare', 'Edmund Spenser', 'Thomas Malory'],
    'Shakespeare',
  ),
  new Question(
    'Who is known as the "Poet of Beauty" in English Literature?',
    ['P. B. Shelley', 'Lord Byron', 'John Keats', 'William Wordsworth'],
    'John Keats',
  ),
  new Question(
    'Who is the father of the English novel?',
    ['Henry Fielding', 'Shakespeare', 'G. B. Shaw', 'R. L. Stevenson'],
    'Henry Fielding',
  ),
  new Question(
    'Who is known as the "Poet of Skylark and Winds"?',
    ['Lord Byron', 'P. B. Shelley', 'John Keats', 'Wordsworth'],
    'P. B. Shelley',
  ),
  new Question(
    'The Father of English poetry is?',
    [
      'William Langland',
      'Geoffrey Chaucer',
      'Thomas Malory',
      'William Shakespeare',
    ],
    'Geoffrey Chaucer',
  ),
  new Question(
    'Who is the "Poet of Poets"?',
    ['Geoffrey Chaucer', 'Edmund Spenser', 'Thomas Kyd', 'None of them'],
    'Edmund Spenser',
  ),
  new Question(
    'The most famous satirist in English Literature is?',
    ['Jonathan Swift', 'Alexander Pope', 'Joseph Addison', 'Richard Steel'],
    'Jonathan Swift',
  ),
  new Question(
    'Lord Tennyson is known as?',
    ['Epic poet', 'Lyric poet', 'Romantic poet', 'Poet of beauty'],
    'Lyric poet',
  ),
  new Question(
    'Who is called the "Bard of Avon"?',
    ['Geoffrey Chaucer', 'Shakespeare', 'Milton', 'Chaucer'],
    'Shakespeare',
  ),
];

// Shuffle questions and options
shuffleArray(questions);
questions.forEach(function (question) {
  shuffleArray(question.choices);
});

// Adding a method isCorrectAnswer() to check user choice
Question.prototype.isCorrectAnswer = function (choice) {
  return this.answer === choice;
};

// Quiz Object
function Quiz(questions) {
  this.score = 0;
  this.questions = questions;
  this.questionIndex = 0;
}

// Adding a method getQuestionByIndex() to get a question by index
Quiz.prototype.getQuestionByIndex = function () {
  return this.questions[this.questionIndex];
};

// Adding a method checkOptionWithAnswer() to check user answer and change the score
Quiz.prototype.checkOptionWithAnswer = function (answer) {
  if (this.getQuestionByIndex().isCorrectAnswer(answer)) {
    this.score++;
  }
  this.questionIndex++;
};

// Adding a method isEnded() to check if the quiz is ended or not
Quiz.prototype.isEnded = function () {
  return this.questionIndex === this.questions.length;
};

// Displaying the question number (x) out of total questions (y) -- Question x of y
function showProgress() {
  var currentQuestionNumber = quiz.questionIndex + 1;
  var element = document.getElementById('progress');
  element.innerHTML =
    'Question ' + currentQuestionNumber + ' of ' + quiz.questions.length;
}

function loadQuestions() {
  if (quiz.isEnded()) {
    showScores();
  } else {
    // Show the question
    var element = document.getElementById('question');
    element.innerHTML = quiz.getQuestionByIndex().text;

    // Shuffle the options
    var choices = quiz.getQuestionByIndex().choices.slice(); // Make a copy of the choices array
    shuffleArray(choices);

    for (var i = 0; i < choices.length; i++) {
      var element = document.getElementById('choice' + i);
      element.innerHTML = choices[i];
      handleOptionButton('btn' + i, choices[i]);
    }
    showProgress(); // Display x of y question
  }
}

// Calling on user option
function handleOptionButton(id, choice) {
  var button = document.getElementById(id);
  button.onclick = function () {
    if (!quiz.isEnded()) {
      quiz.checkOptionWithAnswer(choice);
    }
    loadQuestions();
  };
}

// Showing the result at the end of questions

// Function to show the scores
function showScores() {
  var gameOverHTML = '<h1>Result</h1>';
  gameOverHTML +=
    "<h2 id='score'> Your score: " +
    quiz.score +
    ' and the mark percentage is: ' +
    Math.round((quiz.score / questions.length) * 100) +
    '%' +
    '</h2>';
  var element = document.getElementById('quiz');
  element.innerHTML = gameOverHTML;

  // Show the retry button only on the result page
  var retryButton = document.getElementById('retry');
  retryButton.style.display = 'inline-block';

  // Show the show answers button only on the result page
  var showAnswersButton = document.getElementById('showAnswers');
  showAnswersButton.style.display = 'inline-block';
}

// Function to show the correct answers
function showAnswers() {
  var element = document.getElementById('quiz');
  var answersHTML = '<h1>Answers</h1>';
  answersHTML += '<ul>';
  questions.forEach(function (question, index) {
    answersHTML +=
      '<li>' +
      question.text +
      '<br>Correct Answer: ' +
      question.answer +
      '</li>';
  });
  answersHTML += '</ul>';
  element.innerHTML = answersHTML;

  // Hide the show answers button after displaying the answers
  var showAnswersButton = document.getElementById('showAnswers');
  showAnswersButton.style.display = 'none';
}

// Function to hide the scores and retry button
function hideScores() {
  var element = document.getElementById('quiz');
  element.innerHTML = `
              <h3 class="flash">MKC Quiz on Literature & Grammer - Correction message is welcome!</h3>
              <hr style="margin-bottom: 20px">
              <p id="question"></p>
              <div class="buttons">
                <button id="btn0"><span id="choice0"></span></button>
                <button id="btn1"><span id="choice1"></span></button>
                <button id="btn2"><span id="choice2"></span></button>
                <button id="btn3"><span id="choice3"></span></button>
              </div>
              <hr style="margin-top: 50px">
              <footer>
                <p id="progress">Question x of y</p>
              </footer>
            `;
  var retryButton = document.getElementById('retry');
  retryButton.style.display = 'none'; // Hide the retry button

  var showAnswersButton = document.getElementById('showAnswers');
  showAnswersButton.style.display = 'none'; // Hide the show answers button
}

// Retry button click event
document.getElementById('retry').onclick = function () {
  startQuiz(); // Call the startQuiz function to reset the quiz
};

// Show Answers button click event
document.getElementById('showAnswers').onclick = function () {
  showAnswers(); // Call the showAnswers function to display the correct answers
};

// Create a quiz
var quiz;

// Function to start or reset the quiz
function startQuiz() {
  quiz = new Quiz(questions);
  hideScores();
  loadQuestions();
}

// Display the quiz when the page loads
window.onload = startQuiz;

// Fisher-Yates shuffle algorithm to shuffle an array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
