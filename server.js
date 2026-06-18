require('dotenv').config(); // 환경 변수 불러오기
const express = require('express');
const Groq = require('groq-sdk');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// API 키를 코드에 직접 쓰지 않고 서버 환경설정에서 가져옵니다.
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post('/api/humanize', async (req, res) => {
  const { text, style } = req.body;
  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `당신은 한국어 재구성 엔진입니다. 쉬운 우리말만 사용하고 결과만 출력하세요. 스타일: ${style}` },
        { role: "user", content: text }
      ],
    });
    res.json({ result: chatCompletion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "처리 중 오류 발생" });
  }
});

const PORT = process.env.PORT || 3000;
// ... 기존 코드 위쪽은 그대로 유지 ...

// 서버 실행 설정 (수정된 부분)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 서버 실행 중: http://0.0.0.0:${PORT}`);
});
