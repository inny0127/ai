# A안 「얼마나 크냐면」 — Flow 제작 가이드 (Google AI Pro)

> **할 일**: Flow에서 7개 컷 생성 → 컷마다 제일 좋은 것 1개 고르기 → 구글 드라이브에 올려서 링크 주기
> **나머지**(자르기, 자막, 엔드카드, 음악, 효과음, 최종 mp4)는 Claude가 `edit.mjs`로 처리

---

## 0. 준비 (1분)

1. **https://labs.google/flow** 접속 → AI Pro 계정 로그인 → **New project**
2. 생성 설정(프롬프트 창 옆 설정 아이콘):
   | 항목 | 값 |
   |---|---|
   | 모드 | **Text to Video** |
   | 모델 | **Veo 3.1 – Fast** (컷당 20크레딧) |
   | 화면 비율 | **9:16 (세로)** |
   | Outputs per prompt | **2** (한 번에 2개씩 뽑아서 비교. 크레딧은 2배) |
3. **크레딧 예산**: AI Pro는 월 1,000 + 매일 50크레딧
   - 사람 6컷 × 2번 × 2개 = 24개 × 20 = **480크레딧**
   - 지구 컷: Fast로 2~4개(40~80). 마음에 안 들면 **Quality**(100크레딧)로 1~2개
   - 합계 600~800크레딧. 여유 있어요.

> 'Veo' 워터마크(오른쪽 아래)는 AI Pro에서 붙어요. **지우지 말고 그대로 두세요.**
> AI 광고제라 오히려 AI 사용 증빙이고, 워터마크 제거는 서비스 약관상 피하는 게 안전해요. 자막은 그 자리를 피해서 넣을게요.

---

## 1. 제일 먼저: 테스트 1번 (40크레딧)

컷 1(시장 아주머니)을 먼저 뽑아서 확인하세요.
- **한국어 발음**이 자연스러운가?
- **입모양**이 맞는가?
- 화면에 **글자**가 생기지 않았는가?

좋으면 → 나머지도 같은 방식으로 진행
별로면 → 같은 프롬프트로 한 번 더 (Veo는 뽑을 때마다 편차가 커요). 두 번 다 이상하면 알려주세요. 대사를 빼고 영상만 뽑은 다음, 목소리는 ElevenLabs로 따로 만들게요.

---

## 2. 프롬프트 (그대로 복사 → 붙여넣기)

모든 프롬프트에 공통 스타일이 이미 들어 있어요. **통째로 복사하면 끝.**
- 대사 끝 물결표(~)는 Veo가 이상하게 읽을 수 있어서 빼고, 늘여 말하기는 영어 지시로 넣었어요.
- 편집은 **미니멀**로 가요. 엔드카드 전까지 화면에 글자가 없어서 **손짓만으로 크기가 읽혀야** 해요. 고를 때 손 모양을 특히 봐 주세요.

### 컷 0 — 대학생 "요만큼?"
```
Medium close-up, eye-level handheld shot. A Korean male university student in his early 20s with round glasses and a gray hoodie stands on a busy university street in Seoul. A hand holding a small green microphone reaches in from the right edge of the frame toward him; the interviewer is never shown, only the hand. He squints thoughtfully, raises one hand and pinches his thumb and index finger almost together to show something tiny, then says in Korean, slightly unsure, drawing out the first syllable: "요만큼?" Ambient noise: students chatting, distant traffic. No background music. Shot vertically on a smartphone, handheld, natural daylight, realistic Korean street interview vlog style, candid and authentic, natural skin texture. The person speaks Korean clearly with accurate lip sync. The screen contains no subtitles, no captions, no text, no logos.
```

### 컷 1 — 시장 아주머니 "이만큼!" ← **테스트용**
```
Medium shot, handheld. A cheerful Korean woman in her 50s wearing a floral apron and arm sleeves stands in front of her fruit stall at a traditional Korean market, piles of orange persimmons and red apples behind her. A hand holding a small green microphone reaches in from the right edge of the frame toward her; the interviewer is never shown, only the hand. She laughs, spreads both hands about shoulder-width apart and says loudly in Korean, stretching the first syllable: "이만큼!" Ambient noise: lively market chatter, vendors calling out. No background music. Shot vertically on a smartphone, handheld, natural daylight, realistic Korean street interview vlog style, candid and authentic, natural skin texture. The person speaks Korean clearly with accurate lip sync. The screen contains no subtitles, no captions, no text, no logos.
```

### 컷 2 — 근육남 "이이이만큼!!"
```
Medium-wide shot, slight low angle, handheld. A very muscular Korean man in his 30s wearing a tight black tank top stands in front of a gym entrance on a city sidewalk. A hand holding a small green microphone reaches in from the right edge of the frame toward him; the interviewer is never shown, only the hand. He spreads both arms as wide as he possibly can, flexes his biceps proudly, and shouts in Korean with huge enthusiasm, stretching the first syllable for a long time: "이이이만큼!!" SFX: a small whoosh as his arms open. Ambient noise: city street. No background music. Shot vertically on a smartphone, handheld, natural daylight, realistic Korean street interview vlog style, candid and authentic, natural skin texture. The person speaks Korean clearly with accurate lip sync. The screen contains no subtitles, no captions, no text, no logos.
```

### 컷 3 — 택배기사 "이 트럭만큼."
```
Medium shot, handheld. A Korean delivery driver in his 40s wearing a plain navy uniform and cap stands in front of his small white delivery truck parked on a residential street; the truck is completely plain with no logos or text. A hand holding a small green microphone reaches in from the right edge of the frame toward him; the interviewer is never shown, only the hand. He turns slightly, points back at the truck with his thumb, and says calmly and confidently in Korean: "이 트럭만큼." Ambient noise: quiet neighborhood, a scooter passing by. No background music. Shot vertically on a smartphone, handheld, natural daylight, realistic Korean street interview vlog style, candid and authentic, natural skin texture. The person speaks Korean clearly with accurate lip sync. The screen contains no subtitles, no captions, no text, no logos.
```

### 컷 4 — 할머니 "저 아파트만큼은 되겄지."
```
Medium shot, handheld. A friendly Korean grandmother in her 70s with short permed gray hair, wearing a purple quilted vest, stands in a Korean apartment complex courtyard with tall apartment buildings behind her. A hand holding a small green microphone reaches in from the right edge of the frame toward her; the interviewer is never shown, only the hand. She slowly raises her arm and points up at the tall apartment building behind her, then says warmly in a folksy Korean countryside accent: "저 아파트만큼은 되겄지." Ambient noise: birds, children playing in the distance. No background music. Shot vertically on a smartphone, handheld, natural daylight, realistic Korean street interview vlog style, candid and authentic, natural skin texture. The person speaks Korean clearly with accurate lip sync. The screen contains no subtitles, no captions, no text, no logos.
```

### 컷 5 — 초등학생 "우주만큼!!!"
```
Medium-wide shot, low angle looking slightly up, handheld. An energetic Korean boy about 9 years old wearing a yellow backpack stands in a sunny playground. A hand holding a small green microphone is lowered toward him from the right edge of the frame; the interviewer is never shown, only the hand. He jumps up high, throws both arms toward the sky and shouts in Korean at the top of his lungs: "우주만큼!!!" The camera then tilts up quickly to follow his arms into the bright blue sky. Ambient noise: playground sounds. No background music. Shot vertically on a smartphone, handheld, natural daylight, realistic Korean street interview vlog style, candid and authentic, natural skin texture. The person speaks Korean clearly with accurate lip sync. The screen contains no subtitles, no captions, no text, no logos.
```

### 컷 6 — 지구 선물포장 (반전)
```
Cinematic space shot, slow push-in. Planet Earth seen from orbit, fully wrapped like a giant gift: a wide glossy neon green satin ribbon crosses over the entire planet in both directions, tied into an enormous shiny violet-purple bow on top. Sunlight glints across the satin ribbon; clouds and blue oceans are visible beneath it. Near the end, the giant bow tightens with a satisfying snap. SFX: a deep cinematic boom, then a bright sparkling bell ting. No background music. Photorealistic, epic scale, black starry space background, vertical 9:16 composition with the planet centered. The screen contains no subtitles, no text, no logos.
```

---

## 3. 고르는 기준

| 우선순위 | 체크 |
|---|---|
| 1 | 대사가 **정확히** 들리는가 (다른 말을 덧붙이면 탈락) |
| 2 | 손 모양이 크기를 잘 보여주는가 (손가락 6개, 녹는 손은 탈락) |
| 3 | 화면에 **글자나 자막이 없는가** (트럭·간판에 깨진 글자가 있으면 탈락) |
| 4 | 얼굴이 번들거리지 않고 '진짜 사람' 같은가 |

> 대사 앞뒤로 쓸데없는 부분이 있어도 괜찮아요. Claude가 대사 부분만 잘라 써요.

---

## 4. Claude에게 넘기기

1. 고른 영상 다운로드 (Flow에서 다운로드 → **1080p 업스케일**이 보이면 그걸로, 없으면 원본)
2. 파일 이름을 **`shot0.mp4` ~ `shot6.mp4`**로 바꾸기 (컷 번호 그대로)
   - 후보가 2개라 고민되면 `shot2_a.mp4`, `shot2_b.mp4`처럼 같이 올려도 돼요.
3. 구글 드라이브 폴더에 올리기 → 공유 → **"링크가 있는 모든 사용자"** → 링크를 채팅에 붙여넣기
4. **증빙용**: Flow 화면 캡처(프롬프트 + 결과가 보이게) 컷마다 1장씩. 출품서에 첨부해요.

---

## 5. ElevenLabs (음악·효과음)

Claude가 API로 직접 만들어요. 키는 **채팅에 붙여넣지 말고** 환경 설정에 넣어 주세요.
- 세션 상단 클라우드 환경 메뉴 → **Edit** → 환경 변수에 `ELEVENLABS_API_KEY=...` 추가
- 새 세션부터 적용돼요. 그러면 `node eleven.mjs`로 BGM, 효과음을 만들어 바로 편집에 넣어요.
- 키가 없어도 편집은 돼요. 코드로 합성한 임시 음악이 대신 들어가요.
