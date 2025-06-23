let quizData = [];
let shuffledData = [];
let current = 0;
let stats = {};

// DOM 요소 참조
const questionText = document.getElementById("question-text");
const choiceA = document.getElementById("choice-A");
const choiceB = document.getElementById("choice-B");
const choiceC = document.getElementById("choice-C");
const choiceD = document.getElementById("choice-D");

const answerPopup = document.getElementById("answer-popup");
const correctAnswerBox = document.getElementById("correct-answer");
const explanationBox = document.getElementById("explanation");

const wrongPopup = document.getElementById("wrong-popup");
const wrongInner = wrongPopup.querySelector("div");

// 퀴즈 로딩
fetch("https://wemeetquizdata.blob.core.windows.net/quizdata/quiz.json")
  .then((res) => res.json())
  .then((data) => {
    quizData = data;
    reshuffle();
    loadQuestion();
  })
  .catch((err) => console.error("퀴즈 로딩 실패:", err));

// 문제 셔플
function reshuffle() {
  shuffledData = [...quizData].sort(() => Math.random() - 0.5);
  current = 0;
}

// 문제 표시
function loadQuestion() {
  maybeSendStats();

  if (current >= shuffledData.length) reshuffle();
  const quiz = shuffledData[current];

  questionText.innerText = quiz.question;
  choiceA.innerText = `A: ${quiz.choices[0]}`;
  choiceB.innerText = `B: ${quiz.choices[1]}`;
  choiceC.innerText = `C: ${quiz.choices[2]}`;
  choiceD.innerText = `D: ${quiz.choices[3]}`;
}

// 보기 선택 시
function checkAnswer(selectedIndex) {
  const quiz = shuffledData[current];
  const correctIndex = getAnswerIndex(quiz.answer);
  const id = quiz.id ?? current;

    // 통계 객체 초기화
  if (!stats[id]) {
    stats[id] = { correct: 0, wrong: 0 };
  }

  if (selectedIndex === correctIndex) {
    stats[id].correct += 1;
    showAnswerPopup("✅ 맞혔습니다!", quiz, true);
  } else {
    stats[id].wrong += 1;
    showWrongPopup();
  }
}

// answer.png 누르면 해설만 보기
function showAnswerExplanation() {
  const quiz = shuffledData[current];
  showAnswerPopup("💡 해설", quiz, false);
}

// 정답/해설 팝업
function showAnswerPopup(title, quiz, advance) {
  correctAnswerBox.innerText = `${title}\n정답: ${quiz.answer}: ${quiz.choices[getAnswerIndex(quiz.answer)]}`;
  explanationBox.innerText = quiz.explanation;
  answerPopup.classList.remove("hidden");

  // 클릭하면 닫고 다음 문제(정답 맞춘 경우만)
  answerPopup.onclick = () => {
    answerPopup.classList.add("hidden");
    if (advance) {
      current++;
      loadQuestion();
    }
  };
}

function goToNextQuestion() {
  current++;
  if (current >= shuffledData.length) reshuffle();
  loadQuestion();
}

// 오답 팝업
function showWrongPopup() {
  wrongPopup.classList.remove("hidden");
}

// 오답 팝업 닫기
wrongPopup.addEventListener("click", () => {
  wrongPopup.classList.add("hidden");
});
wrongInner.addEventListener("click", (e) => {
  e.stopPropagation();
});

// 보기 선택지에 연결되는 helper
function getAnswerIndex(letter) {
  return { A: 0, B: 1, C: 2, D: 3 }[letter];
}

function maybeSendStats() {
  if (Object.keys(stats).length === 0) return;

  fetch("/api/save-stats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stats)
  })
    .then(res => res.json())
    .then(data => {
      console.log("통계 전송 완료:", data);
    })
    .catch(err => {
      console.error("통계 전송 실패:", err);
    });
}