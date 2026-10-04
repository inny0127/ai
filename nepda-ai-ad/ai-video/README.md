# A안 「얼마나 크냐면」 — 실사 AI 영상 (Veo 3.1)

1. **`1_Flow_제작가이드.md`** — Flow 설정, 크레딧 예산, 컷별 복붙 프롬프트, 고르는 기준
2. 고른 클립을 `clips/shot0.mp4` ~ `clips/shot6.mp4`로 넣기
3. `edit.json`에서 컷마다 쓸 구간(`in`/`out`)과 대사 시작(`say`) 맞추기
4. `node edit.mjs` → `out/얼마나크냐면_9x16.mp4`

- 기본은 미니멀(엔드카드 전 글자 없음). `edit.json`의 `showQuestion`/`showCaptions`를 true로 바꾸면 상단 질문+게이지 / 대사 자막이 켜짐
- 자막·혜택 크기 게이지·KV 엔드카드: `overlay.html` (공식 KV 배너 파편 + 로고 원본 사용)
- 음악·효과음: `eleven.mjs`(ElevenLabs, `ELEVENLABS_API_KEY` 필요)를 먼저 쓰고, 없으면 `synth.py`의 코드 합성음 사용
- 정지컷 확인: `node edit.mjs --stills 1,16,21`
- `편집템플릿_미리보기.mp4` — 클립 없이 임시 화면으로 돌린 편집 틀
