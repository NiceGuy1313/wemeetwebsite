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
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(204).end();
  }

  const filename = `latest-stats.json`;
  const filepath = path.join(statsDir, filename);

  fs.writeFile(filepath, JSON.stringify(data, null, 2), err => {
    if (err) {
      console.error('❌ 저장 실패:', err);
      return res.status(500).json({ message: '저장 실패' });
    }
    console.log(`✅ 저장 완료: ${filename}`);
    res.json({ message: '저장 완료', file: filename });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});