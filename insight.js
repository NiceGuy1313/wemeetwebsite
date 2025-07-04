// insight.js
const wrongBox = document.getElementById('wrong-box');
const correctBox = document.getElementById('correct-box');

Promise.all([
  fetch("quiz.json").then((res) => res.json()),
  fetch(`/stats/latest-stats.json?t=${Date.now()}`).then((res) => res.json())
])
  .then(([quizData, stats]) => {
    const statList = quizData.map((q, idx) => {
      const id = q.id ?? `q${idx}`;
      const s = stats[id] || { correct: 0, wrong: 0 };
      const total = s.correct + s.wrong;
      const rate = total > 0 ? s.correct / total : 0;

      return {
        id,
        question: q.question,
        choices: q.choices,
        answer: q.answer,
        explanation: q.explanation,
        correct: s.correct,
        wrong: s.wrong,
        total,
        rate
      };
    });
    const mostWrong = [...statList]
      .filter(s => s.total > 0)
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 3);

    const mostCorrect = [...statList]
      .filter(s => s.total > 0)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 3);

    renderCardList(mostWrong, wrongBox, '🔴');
    renderCardList(mostCorrect, correctBox, '🟢');
  })
  .catch((err) => {
    console.error("인사이트 로딩 실패:", err);
  });

function showModal(questionData) {
  const modal = document.getElementById("question-modal");
  const textEl = document.getElementById("modal-question-text");

  const choiceLabels = ['A', 'B', 'C', 'D'];
  const choicesHtml = questionData.choices.map((choice, i) => {
    const label = choiceLabels[i] || String.fromCharCode(65 + i); // A, B, C, ...
    const isAnswer = label === questionData.answer;
    return `<p class="mb-1 ${isAnswer ? 'font-bold text-blue-600' : ''}">(${label}) ${choice}</p>`;
  }).join("");

  textEl.innerHTML = `
    <p class="mb-4 font-semibold">${questionData.question}</p>
    ${choicesHtml}
    <p class="mt-4 text-gray-600"><span class="font-semibold">해설:</span> ${questionData.explanation}</p>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  const modal = document.getElementById("question-modal");
  modal.classList.remove("flex");
  modal.classList.add("hidden");
}

function renderCardList(dataList, container, symbol) {
  dataList.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-3 m-3 text-sm";
    card.innerHTML = `
      <p class="font-bold mb-1">${symbol} #${idx + 1}</p>
      <p class="mb-1 truncate">${item.question}</p>
      <p>정답률: ${(item.rate * 100).toFixed(1)}%</p>
      <p>맞힘 ${item.correct} / 틀림 ${item.wrong}</p>
    `;
    card.addEventListener("click", () => {
      showModal(item);
    });
    container.appendChild(card);
  });
  
}
