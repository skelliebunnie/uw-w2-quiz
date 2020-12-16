var quizContainer = document.querySelector("#quiz");
var quizList = document.querySelector("#quizList");
var quizListItems = quizList.children;
var questionTarget = document.querySelector("#target");
var timeRemaining = document.querySelector("#timeRemaining");
var pointsContainer = document.querySelector("#points");
var highScoreContainer = document.querySelector("#highScores");
var highScoresForm = document.querySelector("#highScoresForm");
var highScoresList = document.querySelector("#highScoresList");
var clearScoresBtn = document.querySelector("#clearScores");
var restartGameBtn = document.querySelector("#restartGame");

var highScores = JSON.parse(localStorage.getItem('quiz-high-scores')) || [];

var buttons = [
	document.querySelector("#color0"),
	document.querySelector("#color1"),
	document.querySelector("#color2"),
	document.querySelector("#color3"),
	document.querySelector("#color4")
];

// correct answer is ALWAYS index 0
var colors = {
	'Crimson': {
		'correctColor': '#DC143C',
		'list': ['#DC143C', '#FF0000', '#B22222', '#8B0000', '#CD5C5C']
	},
	'Tomato': {
		'correctColor': '#FF6347',
		'list': ['#FF6347', '#FF7F50', '#FFA07A', '#FF4500', '#FA8072'],
	},
	'Peach Puff':{
		'correctColor': '#FFDAB9',
		'list': ['#FFDAB9', '#FFE4B5', '#FAFAD2', '#FFFACD', 'FFFFE0']
	},
	'Chartreuse':{
		'correctColor': '#7FFF00',
		'list': ['#7FFF00', '#00FF00', '#32CD32', '#98FB98', '#9ACD32']
	},
	'Aquamarine':{
		'correctColor': '#7FFFD4',
		'list': ['#7FFFD4', '#40E0D0', '#00FFFF', '#E0FFFF', '#AFEEEE']
	},
	'Deep Sky Blue':{
		'correctColor': '#00BFFF',
		'list': ['#00BFFF', '#1E90FF', '#87CEEB', '#6495ED', '#4169E1'] 
	} ,
	'Thistle':{
		'correctColor': '#D8BFD8',
		'list': ['#D8BFD8', '#E6E6FA', '#DDA0DD', '#EE82EE', '#DA70D6']
	} ,
	'Deep Pink':{
		'correctColor': '#FF1493',
		'list': ['#FF1493', '#FF69B4', '#C71585', '#DB7093', '#FFB6C1']
	}
}

var originalKeys = Object.keys(colors);

var totalQuestions = Object.keys(colors).length;
var completedQuestions = [];

var timeInterval;

var points = 0;
var secondsLeft = 60;
timeRemaining.textContent = `${secondsLeft}`;

// start the game with a random question, but don't start timer
// until the user clicks an answer.
var randomKeys = shuffle( Object.keys(colors) );
var startHere = getRandomQuestion();
colorBlocks( startHere );

function startGame() {
	points = 0;
	secondsLeft = 60;

	timeRemaining.textContent = `${secondsLeft}`;

	startTimer();
	nextQuestion();
}

function startTimer() {
	timeInterval = setInterval(function() {
    timeRemaining.textContent = secondsLeft;
    
    // just in case?
    if(secondsLeft > 0) {
    	secondsLeft--;
    } else {
      endGame();
    }

  }, 1000);
}

function endGame() {
	clearInterval(timeInterval);
	console.log(secondsLeft, points, secondsLeft + points);
	points += secondsLeft;

	quizContainer.style.display = "none";
	
	pointsContainer.innerHTML = `<h3>${points}</h3>`;
	highScoreContainer.style.visibility = "visible";
	highScoresForm.style.visibility = "visible";

	listHighScores();
}

function nextQuestion() {
	var keys = shuffle( Object.keys(colors) );
	var nextQuestion = getRandomQuestion();
	colorBlocks(nextQuestion);
}

function getRandomQuestion() {
	var questionKey = randomKeys.shift();
	completedQuestions.push(questionKey);
	console.log(completedQuestions);

	return questionKey;
}

function colorBlocks(colorName) {
	// tell the player what color we're looking for
	questionTarget.textContent = colorName;
	var targetBtn;

	// get the correct color for comparison
	var correctColor = colors[colorName].correctColor;

	// shuffling the array: https://flaviocopes.com/how-to-shuffle-array-javascript/
	var blockColors = colors[colorName].list;
	blockColors = shuffle(blockColors);
	
	// loop through the colors in the randomized list
	// and set the background color of each color button
	for(var i = 0; i < blockColors.length; i++) {
		targetBtn = document.querySelector(`#color${i}`);
		
		targetBtn.style.backgroundColor = blockColors[i];

		console.log(blockColors[i], correctColor);

		if(blockColors[i] == correctColor) {
			targetBtn.value = "correct";
		} else {
			targetBtn.value = "wrong";
		}
	}
}

function showResult() {
	var result = this;
	var timeLeft = 1;
	var parent = this.parentNode;
	var icon = document.createElement("i");
	icon.setAttribute("id", "playerAnswer");

	if(this.value === "correct") {
		icon.setAttribute("class", "fas fa-check fa-4x text-success");
		parent.appendChild(icon);
	} else {
		icon.setAttribute("class", "fas fa-times fa-4x text-danger");
		icon.style.paddingLeft = "0.5rem";
		parent.appendChild(icon);
		// parent.appendChild(parent, "<i id='playerAnswer' class='fas fa-times fa-4x text-danger'></i>");
	}

	var wait = setInterval(function() {
    timeLeft--;
    
    if(timeLeft === 0) {
    	checkAnswer(result);
    }

  }, 1000);
}

function checkAnswer(result) {
	// remove the answer icon
	document.querySelector("#playerAnswer").remove();

	if( result.value === "correct" ) {
		// correct answer = 1 pt
		points += 1;
		pointsContainer.textContent = points;

	} else {
		// reduce time by 10 seconds if the answer is wrong
		// unless SecondsLeft === 0, in which case the game is over
		if(secondsLeft > 10) {
			secondsLeft -= 10;
			timeRemaining.textContent = secondsLeft;
		} else {
			secondsLeft = 0;
			endGame();
		}
	}

	if( completedQuestions.length === 1 ) {
		startGame();
	} else if( completedQuestions.length < totalQuestions ) {

		nextQuestion();

	} else {
		endGame();
	}
}

function listHighScores() {
	highScoresList.innerHTML = "";
	highScores.sort(sortScores);

	for(var i = 0; i < highScores.length; i++) {
		console.log(highScores[i].name, highScores[i].score);

		var scoreLI = document.createElement("li");
		scoreLI.innerHTML = "<span class='playerName'>"+ highScores[i].name +"</span> <span class='score'>"+ highScores[i].score +"</span>";

		highScoresList.appendChild(scoreLI);
	}
}

function updateHighScores() {
	listHighScores();
	var playerNameInput = document.querySelector("#playerName");

	var player = {
		name: playerNameInput.value,
		score: points.toString()
	}
	
	// now empty the input
	// and hide the form so people can't add over and over
	playerNameInput.value = "";
	highScoresForm.style.visibility = "hidden";

	highScores.push(player);

	localStorage.setItem('quiz-high-scores', JSON.stringify(highScores));

	listHighScores();
}

// https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
function shuffle(arr) {
	for(var i = arr.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * i);
		var temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}

	return arr;
}

// https://stackoverflow.com/a/1129270
function sortScores(a,b) {
	return b.score - a.score;
}

buttons.forEach(btn => {
	btn.addEventListener("click", showResult);
});

highScoresForm.addEventListener("submit", function(e) {
	e.preventDefault();

	updateHighScores();
});

clearScoresBtn.addEventListener("click", function() {
	localStorage.removeItem('quiz-high-scores');
	highScores = [];

	listHighScores();
});

restartGameBtn.addEventListener("click", function() {
	// reset everything FIRST
	secondsLeft = 60;
	points = 0;
	timeRemaining.textContent = `${secondsLeft}`;
	pointsContainer.textContent = '0';
	completedQuestions = [];

	document.querySelector("#playerName").value = "";
	highScoreContainer.style.visibility = "hidden";
	highScoresForm.style.visibility = "hidden";
	quizContainer.style.display = "block";

	// THEN get a random question and create the color blocks;
	randomKeys = shuffle( Object.keys(colors) );
	var newGame = getRandomQuestion();
	colorBlocks( newGame );

});