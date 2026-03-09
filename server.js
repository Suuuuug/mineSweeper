const express = require('express');
const app = express();
const PORT = 4000;

const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 접속을 허용함

// JSON 데이터를 받기 위한 설정
app.use(express.json());

// 임시 데이터 저장소 (순위 리스트)
let leaderboards = {
    easy: [
        { username: "player1", time: 100 },
        { username: "player2", time: 120 }
    ],
    normal: [
        { username: "player1", time: 500 }
    ],
    hard: [
        { username: "player1", time: 999 }
    ]
};

// 1. 점수 제출 API
app.post('/submit-score', (req, res) => {
    const { username, time, difficulty } = req.body;

    if (!username || time === undefined) {
        return res.status(400).json({ message: "데이터가 부족합니다." });
    }

    // 새 점수 추가
    leaderboards[difficulty].push({ username, time });

    // 시간 오름차순 정렬
    leaderboards[difficulty].sort((a, b) => a.time - b.time);

    // 상위 10개만 유지
    leaderboards[difficulty] = leaderboards[difficulty].slice(0, 10);

    res.json({ message: "등록 성공!", leaderboard: leaderboards[difficulty] });
});

// 2. 순위 조회 API
app.get('/leaderboard', (req, res) => {
    const diff = req.query.difficulty; // 주소창에 ?difficulty=easy 형태로 전달
    
    if (diff) {
        if (leaderboards[diff]) {
            return res.json(leaderboards[diff]);
        } else {
            return res.status(404).json({ message: "난이도를 찾을 수 없습니다." });
        }
    }
    
    // 난이도 지정 안 하면 전체 데이터 반환
    res.json(leaderboards);
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});