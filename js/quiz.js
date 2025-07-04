let data = [];
let currentQuestion;

fetch("../data/questions.json")
  .then(res => res.json())
  .then(questions => {
    data = questions;
    loadRandomQuestion();
  });

function loadRandomQuestion() {
  const random = Math.floor(Math.random() * data.length);
  currentQuestion = data[random];

  document.getElementById("question").innerText = currentQuestion.question;

  const optionsUl = document.getElementById("options");
  optionsUl.innerHTML = "";

  currentQuestion.options.forEach((opt, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `<button onclick="checkAnswer(${idx})">${opt}</button>`;
    optionsUl.appendChild(li);
  });

  document.getElementById("result").innerText = "";
}

function checkAnswer(index) {
  const result = document.getElementById("result");
  if (index === currentQuestion.answer) {
    result.innerText = "✅ 정답입니다!";
    result.style.color = "green";
  } else {
    result.innerText = "❌ 오답입니다.";
    result.style.color = "red";
  }
}

function showAnswer() {
  const correct = currentQuestion.options[currentQuestion.answer];
  const result = document.getElementById("result");
  result.innerText = `정답: ${correct}`;
  result.style.color = "#2b6cb0";
}