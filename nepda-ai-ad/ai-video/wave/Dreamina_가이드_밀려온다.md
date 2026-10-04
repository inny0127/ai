# Dreamina 완전 가이드 — 「거대한 혜택이 밀려온다」

> 택이가 운석처럼 지구로 떨어져 부산 앞바다에 풍덩 → 수평선에 솟은 파도는… **선물상자 파도** → 사람들은 장바구니로 마중 → 바다에 뜬 택이 윙크 → **"거대한 혜택이 밀려온다"** → KV
> 이 문서만 위에서부터 따라 하면 돼요. 프롬프트는 전부 **통째로 복사**하면 돼요.
> ⚠️ Dreamina 화면은 자주 바뀌어서 **버튼 이름이 조금 다를 수 있어요.** 기능 기준으로 비슷한 이름을 찾으면 돼요.

## 한눈에 보는 콘티 (29.5초)

| 시간 | 장면 | 소리 (Claude가 편집에서) |
|---|---|---|
| 0~3.5초 | 우주: 초록 불덩이(택이)가 한반도 대기권을 뚫고 들어와요 | 굉음 두 번 |
| 3.5~8초 | 해운대: 사람들이 하늘을 가리키다가 → 수평선에 풍덩 → 거대한 물기둥, 충격파 | **쿵!** |
| 8~13초 | 수평선에 솟는 거대한 파도… 다가올수록 **선물상자 파도**인 게 보여요 | 브아아암 → 10초부터 신나는 비트 |
| 13~18초 | 장바구니·대야·쇼핑백 들고 기다림 → 와르르 덮침 → 선물 더미에서 환호하며 튀어나옴 | 비트 + 환호 |
| 18~22초 | 바다에 둥둥 뜬 택이가 카메라를 보고 윙크 | 뾰옹 |
| 22~24.5초 | 검은 화면 카드: **거대한 혜택이 밀려온다** | 쿵 |
| 24.5~29.5초 | KV 엔드카드 + 10.26 ~ 11.8 + 검색창 | 징글 |

AI로 만드는 컷은 **5개**뿐이에요. 카드와 엔드카드, 모든 소리는 Claude가 편집에서 만들어요.

---

## 0. 준비물

- **PC 크롬 브라우저** 권장 (모바일 앱보다 업로드·다운로드가 편해요)
- 택이 참고 이미지 2장: `taki_front.png`, `taki_full.png` (앞서 보낸 파일)
- 이 문서

---

## 1. 가입·결제 (5분) — ⚠️ 10월 9일까지

1. **https://dreamina.capcut.com** 접속 → 오른쪽 위 **Sign in** → CapCut, Google, TikTok 계정 중 하나로 로그인
2. 언어: 오른쪽 위 프로필 또는 설정에서 바꿀 수 있어요. 한국어가 있으면 한국어로 해도 되고, 아래 설명은 영어 메뉴 기준이에요.
3. 왼쪽 메뉴나 오른쪽 위의 **Subscribe** (또는 Upgrade, Pricing) → **Basic** → **Monthly(월간)** 선택 → 첫 달 **$1.50** 결제
   - 연간(Annual)으로 하면 할인이 안 돼요. 꼭 월간이요.
4. **결제 직후 바로**: 프로필 → **Subscription(구독 관리)** → **Cancel auto-renew(자동 갱신 해지)**
   - 해지해도 이번 달 크레딧 1,575개는 그대로 써요. 안 하면 다음 달 $15가 결제돼요.
5. **영수증 캡처** → 출품서에 '유료 플랜 사용(상업 이용)' 증빙으로 첨부해요.

---

## 2. 화면 구성 이해하기

Dreamina에는 이번에 쓸 작업 공간이 **2개** 있어요.

| 공간 | 메뉴 이름 | 이번에 하는 일 |
|---|---|---|
| **이미지 생성** | **AI Image** (Image generator) | 컷마다 '영화 정지 장면(키프레임)' 만들기 |
| **영상 생성** | **AI Video** (Video generator) | 키프레임을 Seedance 2.5로 움직이기 |

두 공간은 생김새가 비슷해요.
- **가운데 아래**: 프롬프트 입력창
- **입력창 주변 칩/버튼**: 모델 선택, 비율, 해상도, 길이 등 설정
- **입력창 왼쪽의 + 또는 이미지 아이콘**: 참고 이미지·첫 프레임 업로드
- **Generate 버튼**: 옆에 **이번 생성에 드는 크레딧 숫자**가 보여요 → 누르기 전에 꼭 확인
- **위쪽·오른쪽 목록**: 생성 결과(History / Assets). 결과에 마우스를 올리면 다운로드, 재사용 같은 버튼이 나와요.

---

## 3. 크레딧 예산

- Basic 첫 달 크레딧 **1,575개**
- Seedance 2.5 720p는 대략 **초당 37크레딧**이에요 (정확한 숫자는 Generate 옆에 표시돼요)

| 항목 | 내용 | 크레딧(대략) |
|---|---|---|
| 키프레임 이미지 | 약 10~15장 | 약 50~150 |
| 영상 5컷 1번씩 | 5+6+6+6+5 = 28초 | 약 1,040 |
| 컷 3 한 번 더 (제일 어려움) | 6초 | 약 220 |
| **합계** | | **약 1,300~1,400 → Basic에 딱 들어와요** |

- 여유가 거의 없으니 **키프레임을 충분히 다듬은 뒤** 영상을 뽑으세요. 키프레임이 좋으면 영상은 한 번에 나오는 경우가 많아요.
- 모자라면 컷 2·4는 480p로 뽑거나, Standard(첫 달 $22)로 올리면 돼요.

---

## 4. 키프레임(정지 장면) 만드는 법 — AI Image

1. 왼쪽 메뉴 **AI Image** 클릭
2. 모델 칩 클릭 → **Seedream 5.0** (또는 Seedream 4.6 — 더 싸요) 선택
3. **Aspect ratio(비율)**: **9:16**
4. **Resolution**: **2K**
5. 한 번에 여러 장이 나오는 옵션이 있으면 **2장**으로 (비교용)
6. 프롬프트 입력창에 그 컷의 **[키프레임] 프롬프트**를 붙여넣기 → **Generate**
7. 결과 중 제일 좋은 것 고르기 (아래 체크리스트) → 마우스 올리고 **Download**
   - 파일명 예: `k1.png`

**택이가 나오는 컷(1·5)**: 입력창 옆 **+ / Reference(참고 이미지)**로 `taki_front.png`, `taki_full.png`를 올린 뒤 생성해요.

**키프레임 체크리스트**
- [ ] **간판, 글자, 로고가 안 보이는가** (가장 중요. 보이면 다시 생성)
- [ ] 영화 장면 같은가 (빛, 구도, 깊이감)
- [ ] 사람 손가락이나 얼굴이 이상하지 않은가
- [ ] 세로 9:16인가

---

## 5. 영상 만드는 법 — AI Video (Seedance 2.5)

1. 왼쪽 메뉴 **AI Video** 클릭
2. 모델 칩 클릭 → **Seedance 2.5** 선택 (2.0이나 다른 모델이 아닌지 꼭 확인)
3. 모드 선택 (입력창 위 탭 또는 드롭다운)
   - **Image to Video**: 이번엔 5컷 모두 키프레임 1장을 첫 프레임으로 넣어요
     - 'Image to video' 탭이 따로 없으면 **First and Last Frames**에서 **첫 프레임만** 넣으면 돼요.
4. 설정
   - **Aspect ratio 9:16** (이미지를 넣으면 이미지 비율을 따라가기도 해요)
   - **Resolution 720p**
   - **Duration: 컷별 표대로 (5초 또는 6초)** — 편집에서 쓸 길이보다 조금 길게 뽑아요
   - **Audio / Sound: 켜기** (현장음이 같이 나와요. 편집에서 작게 깔아요)
5. 그 컷의 **[영상 생성] 프롬프트** 붙여넣기
6. **Generate 옆 크레딧 숫자 확인** → Generate
7. 생성 대기 (보통 몇 분) → 결과 재생해서 확인 (아래 체크리스트)
8. 마음에 들면 **Download** → 워터마크 없는 버전으로 받기 → 파일 이름을 표대로 바꾸기 (예: `w1_meteor.mp4`)

**영상 체크리스트**
- [ ] 움직임이 프롬프트대로인가 (불덩이 낙하, 물기둥, 파도 등)
- [ ] 화면에 **글자나 자막이 생기지 않았는가**
- [ ] 사람이 녹거나 갑자기 변하지 않았는가 (앞 1~2초만 괜찮으면 OK, 편집에서 짧게 써요)

**다시 뽑을 때 팁**
- 거의 맞는데 일부만 이상하면 → 결과 메뉴의 **Smart Edit / Edit(부분 수정)**으로 그 부분만 고치기 (전체 재생성보다 싸요)
- 움직임이 너무 약하면 → 프롬프트 앞에 `Dramatic, clearly visible motion:`을 추가
- 움직임이 너무 과하면 → `subtle, slow, realistic motion`을 추가

---

## 6. 컷별 레시피 (순서대로)

> 공통: 키프레임은 **AI Image (Seedream, 9:16, 2K)** / 영상은 **AI Video (Seedance 2.5, 9:16, 720p, 소리 켜기)**, 길이는 컷별 표대로
> 영상 프롬프트에 `0–2s:` 같은 **시간대별 동작**을 넣었어요. 길어진 컷이 늘어지지 않게 하려는 거예요.
> **컷 1부터** 하세요. 컷 1이 나오면 Claude에게 먼저 보여 주세요.

### 컷 1 — 우주: 초록 불덩이(택이)가 대기권 진입 (3.5초) ★ 훅

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상** (첫 프레임 1장) |
| 길이 | **5초** |
| 파일 이름 | `w1_meteor.mp4` |

**1) 키프레임 만들기** (AI Image — **택이 참고 이미지 2장 첨부**)
```
View from low Earth orbit over the Korean Peninsula and the surrounding sea at golden hour, the curvature of the Earth and the thin glowing blue atmosphere visible. A blazing bright neon-green fireball with a long glowing green trail is entering the atmosphere above southern Korea; inside the green fire, the round glossy green character from the attached images is curled up, its small horn visible. Epic, photorealistic space cinematography. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상 생성** (AI Video, Seedance 2.5, 키프레임을 첫 프레임으로)
```
0–2s: the glowing green fireball plunges deeper into the atmosphere, its flames and green plasma trail growing brighter and larger. 2–5s: it pierces through the clouds and streaks diagonally down toward the southeast coast of Korea, trailing green fire and sparks; the camera tracks it. Epic and fast. Sound: a rising roar. No text.
```

---

### 컷 2 — 해운대: 수평선에 풍덩, 거대한 물기둥 (4.5초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상** (첫 프레임 1장) |
| 길이 | **6초** |
| 파일 이름 | `w2_impact.mp4` |

**1) 키프레임 만들기** (AI Image)
```
Wide shot from Haeundae beach in Busan on a bright afternoon, camera low on the sand. Small groups of people in the foreground, seen from behind, look up at the sky. Calm blue sea and a clear horizon; a bright green streak of light is descending from the sky toward the sea far away. The curve of the beach and the hotel towers on the right are softly blurred, with no readable signs. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상 생성** (AI Video, Seedance 2.5, 키프레임을 첫 프레임으로)
```
0–2s: calm beach; the people look up and point at the green streak of light descending across the sky. 2–3s: the fireball plunges into the sea at the horizon. 3–6s: a colossal column of glowing green water shoots up into the sky and a shockwave ripples across the sea toward the beach; the people flinch and shield their eyes, hats and sand blown by a gust of wind. Locked-off wide camera. Sound: a distant deep boom. No text.
```

---

### 컷 3 — 수평선의 거대한 파도 = 선물상자 파도 (5초) ★ 반전

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상** (첫 프레임 1장) |
| 길이 | **6초** |
| 파일 이름 | `w3_wave.mp4` |

**1) 키프레임 만들기** (AI Image)
```
From Haeundae beach looking out to sea: a colossal wave as tall as skyscrapers rises on the horizon, and the wave is made entirely of thousands of gift boxes wrapped in glossy neon-green and violet ribbons, mixed with shopping bags, all glittering in the sunlight like confetti. The sea in front is bright blue; tiny people stand on the beach in the foreground. Whimsical yet photorealistic, epic scale. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상 생성** (AI Video, Seedance 2.5, 키프레임을 첫 프레임으로)
```
0–2s: the colossal wave on the horizon swells and rises even higher, glittering in the sun. 2–6s: it rolls toward the beach and, as it gets closer, it is clearly made of thousands of gift boxes wrapped in neon-green and violet ribbons and shopping bags, tumbling and sparkling like confetti; the camera slowly pushes in. Joyful and spectacular, not scary. No text.
```

---

### 컷 4 — 장바구니·대야로 마중 → 와르르 환호 (5초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상** (첫 프레임 1장) |
| 길이 | **6초** |
| 파일 이름 | `w4_welcome.mp4` |

**1) 키프레임 만들기** (AI Image)
```
Medium-wide shot from behind a row of excited Korean people standing on Haeundae beach facing the sea, all seen from behind: a middle-aged man holding a big shopping bag wide open, a grandmother in a sun visor raising a red plastic basin over her head, a young couple holding open shopping bags, a surfer running toward the water with his board. In front of them the giant wave of green and violet ribbon gift boxes curls over. Sunny day. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상 생성** (AI Video, Seedance 2.5, 키프레임을 첫 프레임으로)
```
0–2s: the people brace excitedly, holding their bags and basin wide open; the grandmother pulls her visor down. 2–4s: the wave of gift boxes softly crashes over them and boxes tumble gently everywhere, piling up. 4–6s: they pop up out of the pile laughing and cheering, holding boxes high in the air; nobody is hurt. Playful and joyful. Sound: a cheering crowd, soft thuds of boxes. No text.
```

---

### 컷 5 — 바다에 둥둥 뜬 택이 윙크 (4초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상** (첫 프레임 1장) |
| 길이 | **5초** |
| 파일 이름 | `w5_taki.mp4` |

**1) 키프레임 만들기** (AI Image — **택이 참고 이미지 2장 첨부**)
```
Calm sparkling sea off Haeundae beach in golden afternoon light. The colossal green character from the attached images floats in the water like a giant inflatable toy: its round glossy green head with the small horn and its purple waist pouch with its own cartoon eyes are above the water. Gift boxes with green and violet ribbons float around it; the Busan skyline is far in the background, softly hazy. Photorealistic VFX creature composited into a real seascape. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상 생성** (AI Video, Seedance 2.5, 키프레임을 첫 프레임으로)
```
0–2s: the giant character bobs gently in the waves, water dripping off its glossy head, gift boxes floating around it. 2–3.5s: it slowly turns to look straight at the camera. 3.5–5s: it gives a playful wink and the eyes on its purple pouch blink too. Cute and friendly. Sound: gentle waves and a cute pop. No text.
```

---

## 7. Claude에게 넘기기

1. 완성 영상 5개 파일 이름 확인:
   `w1_meteor.mp4` `w2_impact.mp4` `w3_wave.mp4` `w4_welcome.mp4` `w5_taki.mp4`
2. 구글 드라이브에 폴더 만들기 → 5개 업로드 (키프레임 이미지도 같이 넣어 주면 좋아요)
3. 폴더 **공유 → 일반 액세스: 링크가 있는 모든 사용자** → 링크 복사 → 채팅에 붙여넣기
4. 그러면 Claude가 다음을 다 해요:
   - 컷 길이 맞추기
   - 색보정, 그레인
   - '쿵'마다 화면 흔들림
   - 사운드 디자인
   - "거대한 혜택이 밀려온다" 카드와 KV 엔드카드
   - **최종 mp4**

---

## 8. 문제 해결

| 문제 | 해결 |
|---|---|
| 업로드 시 **"실제 사람 얼굴이 포함됐을 수 있음"** 오류 | Seedance는 실존 인물 얼굴 업로드를 막아요. 사람이 크게 나오는 컷에서 생길 수 있어요. → 키프레임에서 얼굴을 더 작게(뒷모습·옆모습·멀리) 다시 만들거나, 그 컷만 **이미지 없이 Text to Video**로 [키프레임]+[영상 생성] 프롬프트를 합쳐서 생성 |
| 화면에 깨진 글자·간판이 생김 | 키프레임부터 다시. 구도를 더 위에서 내려다보거나 하늘 쪽으로 |
| 택이가 안 닮음 | 참고 이미지 2장을 꼭 첨부. 그래도 안 되면 Smart Edit로 눈·뿔·파우치만 수정 |
| 첫·끝 프레임이 이상하게 이어짐 | 끝 프레임의 사람·건물 위치가 첫 프레임과 많이 다른 것. 끝 프레임을 다시 만들기 |
| 선물 파도가 무섭게(재난처럼) 나옴 | 프롬프트에 `cheerful, whimsical, bright, colorful, toy-like, not a disaster` 추가. 사람들이 웃는 장면이 꼭 이어지게 |
| 크레딧 부족 | 단순한 컷(컷 2·4)은 480p로, 또는 Standard 업그레이드 |
| 결과에 워터마크가 있음 | 유료 플랜인지, 다운로드 옵션에서 워터마크 없는 버전을 골랐는지 확인 |

---

## 9. 증빙 (출품서용) — 하면서 바로 캡처

- 컷마다 **프롬프트 + 결과가 같이 보이는 화면** 캡처 1장
- 키프레임 → 영상으로 이어지는 과정이 보이면 'AI 기술 활용도' 설명에 좋아요
- 구독 영수증
