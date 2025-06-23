const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// 정적 파일 서빙: 현재 디렉토리 기준 (index.html, quiz.html 등)
app.use(express.static(__dirname));
app.use(express.json());

const statsDir = path.join(__dirname, 'stats');
if (!fs.existsSync(statsDir)) fs.mkdirSync(statsDir);

// 통계 저장 API
app.post('/api/save-stats', (req, res) => {
  const incomingStats = req.body;
  if (!incomingStats || Object.keys(incomingStats).length === 0) {
    return res.status(204).end(); // 내용 없으면 아무것도 안 함
  }

  const filename = `latest-stats.json`;
  const filepath = path.join(statsDir, filename);

  // 1. 기존 통계 파일 읽기
  let currentStats = {};
  if (fs.existsSync(filepath)) {
    try {
      const raw = fs.readFileSync(filepath, 'utf-8');
      if (raw.trim()) {
	      currentStats = JSON.parse(raw);
      }
    } catch (err) {
      console.error('❌ 기존 통계 파일 읽기 오류:', err);
    }
  }

  // 2. 새로운 통계 누적
  for (const qid in incomingStats) {
    if (!currentStats[qid]) {
      currentStats[qid] = { correct: 0, wrong: 0 };
    }
    currentStats[qid].correct += incomingStats[qid].correct || 0;
    currentStats[qid].wrong += incomingStats[qid].wrong || 0;
  }

  // 3. 누적 결과 저장
  fs.writeFile(filepath, JSON.stringify(currentStats, null, 2), (err) => {
    if (err) {
      console.error('❌ 저장 실패:', err);
      return res.status(500).json({ message: '저장 실패' });
    }
    console.log(`✅ 통계 누적 저장 완료: ${filename}`);
    res.json({ message: '누적 저장 완료', file: filename });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
