# Dreamina 완전 가이드 — 「거대한 혜택이 밀려온다」

> 택이가 운석처럼 지구로 떨어져 부산 앞바다에 풍덩 → 수평선에 솟은 거대한 파도 속에… **TV·노트북·폰 같은 상품들이 가득** → 사람들은 장바구니로 마중 → 바다에 뜬 택이 윙크 → **"거대한 혜택이 밀려온다"** → KV
> 이 문서만 위에서부터 따라 하면 돼요. 프롬프트는 전부 **통째로 복사**하면 돼요.
> ⚠️ Dreamina 화면은 자주 바뀌어서 **버튼 이름이 조금 다를 수 있어요.** 기능 기준으로 비슷한 이름을 찾으면 돼요.

## 한눈에 보는 콘티 (29.5초) — 3D 애니매틱으로 미리 보기: `animatic/밀려온다_애니매틱_9x16.mp4`

| 시간 | 장면 | 소리 (Claude가 편집에서) |
|---|---|---|
| 0~2초 | 우주: 초록 불덩이(택이)가 대기권으로 | 쉬이익 |
| 2~5초 | **정면**: 하늘을 보고 얼어붙는 사람들 얼굴, 초록빛이 얼굴에 번짐 — **"어? 저게 뭐야?" "뭐야, 뭐야?"** | 🎵 차라투스트라 낮은 울림 |
| 5~8.5초 | **뒤에서**: 거대한 불덩이가 내려와 **바로 앞바다에 착지** — "어어어… 이쪽으로 온다!" → 물폭발 속 택이 실루엣 | 🎵 "빠–바–**밤!**"(7.8초) = 쿵! |
| 8.5~11초 | 정면: 착지 지점에서 솟는 거대한 물 파도, 속에 TV·노트북·냉장고 | 🎵 팀파니 → 클라이맥스 |
| 11~13초 | **옆에서 본 쓰나미**: 말려 오는 파도의 옆모습 | 🎵 |
| 13~16.5초 | 상품들이 사람들 **바로 앞 모래에 쾅쾅 꽂힘** (슬로모) → 환호 | 🎵 '쾅' + 착지음 |
| 16.5~20.5초 | 호텔보다 훨씬 큰 **초거대 택이**가 앞바다에 우뚝 서서 윙크 + **"거대한 혜택이 밀려온다"** | 성우 |
| 20.5~29.5초 | 상품으로 뒤덮인 해운대 항공샷 + KV 엔드카드 + 성우 **"넾다세일!"** | 🎵 정점의 화음 → 여운 |

AI로 만드는 컷은 **8개**예요. 자막, 엔드카드, 음악, 효과음, 내레이션은 Claude가 편집에서 넣어요.

**음악 (저작권 확인 완료)**
- 「차라투스트라는 이렇게 말했다」(R. 슈트라우스): Kevin MacLeod 연주, **CC BY 3.0**
  - 상업 이용 가능해요. 대신 **출처 표기 필수** → 업로드 캡션에 아래 문구를 넣으세요.
    `Music: "Also Sprach Zarathustra" Kevin MacLeod (incompetech.com) / Licensed under CC BY 3.0`
- 곡은 **이 한 곡만** 써요. 서주("빠–바–밤")에서 클라이맥스로 넘어가는 편집점은 8초에 한 번이에요.

**목소리**
- "저게 뭐야?": ElevenLabs로 만들어 뒀어요. Seedance가 컷 2에서 만든 목소리가 더 자연스러우면 그걸 써요.
- 내레이션 "거대한 혜택이 밀려온다"와 마지막 "넾다세일!": ElevenLabs 한국어 성우(후보 5명 중 선택)로 만들어요 (Creator 유료 플랜, 상업 이용 가능).

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

## 3. 크레딧 예산 — ⚠️ 8컷이라 Standard 추천

- Seedance 2.5 720p ≈ **초당 37크레딧** (정확한 숫자는 Generate 옆에 표시)
- 영상: 4+4+5+4+4+5+5+10 = **41초 ≈ 1,520크레딧** + 키프레임 약 100 = **약 1,620**

| 플랜 | 크레딧 | 결론 |
|---|---|---|
| Basic (첫 달 $1.50) | 1,575 | 한 번씩만 뽑아도 **살짝 모자라요** |
| **Standard (첫 달 $22)** | 3,885 | 중요한 컷(2b·3a·4·5)을 2~3번씩 다시 뽑을 수 있어요 ✅ |

- Basic으로 가려면 단순한 컷(1·2a·3b)을 **480p**로 뽑으세요(약 절반 가격).
- 키프레임은 Seedream 4.6(장당 약 3크레딧)으로 만들어요.

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
> 레퍼런스 이미지는 `레퍼런스_이미지.zip`에 있어요. 택이 컷에는 **3~5장만** 골라 넣으세요(너무 많으면 섞여요).
> 택이는 **2026 버전(파우치에 눈 2개)**으로 맞춰요. 제품은 삼성·LG 공식 이미지를 넣어요.

### 컷 1 — 우주: 초록 불덩이(택이)가 대기권으로 (0~2초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상** |
| 길이 | **4초** |
| 파일 이름 | `w1_meteor.mp4` |

**1) 키프레임** (AI Image, Seedream, 9:16, 2K — 레퍼런스: taki 01·03·14)
```
View from low Earth orbit over the Korean Peninsula at golden hour, the curvature of the Earth and the thin glowing blue atmosphere visible. A blazing neon-green fireball with a long glowing trail is entering the atmosphere; inside the green fire is the colossal green character from the reference images (round glossy green jelly body, small horn on top, big white cartoon eyes, short stubby arms and legs, purple waist pouch with its own pair of cartoon eyes), curled up. Epic, photorealistic space cinematography. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상** (AI Video, Seedance 2.5, 이미지 → 영상)
```
0–1s: the glowing green fireball plunges deeper into the atmosphere, flames growing. 1–4s: it pierces the clouds and streaks down toward the southeast coast of Korea, trailing green fire and sparks; the camera tracks it. Epic and fast. No text.
```

---

### 컷 2a — 정면: 놀라서 하늘을 가리키는 사람들 (2~5초) ★ 쥬라기공원식 반응샷

| 항목 | 값 |
|---|---|
| 영상 모드 | **Text to Video** |
| 길이 | **4초** |
| 파일 이름 | `w2a_faces.mp4` |

**영상만 생성** (AI Video, Seedance 2.5, **Text to Video** — 이미지 없이)
```
Low-angle medium shot facing a group of Korean beachgoers on Haeundae beach in Busan on a sunny afternoon, hotel towers behind them. One by one they notice something in the sky above the camera: their faces turn from curious to stunned, a woman covers her mouth, a man points up, a child grabs his mother's arm. An eerie green light grows on their faces. A woman says in Korean, "어? 저게 뭐야?", a man says, "뭐야, 뭐야?" Slow push-in, shallow depth of field. We never see what they are looking at. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```
- 얼굴이 크게 나오는 컷이라 **이미지 업로드 없이 Text to Video**로 만들어요. 얼굴이 있는 키프레임을 올리면 실제 사람 얼굴 제한에 걸릴 수 있어요.
- 뭘 보는지는 **절대 보여주지 않는 게** 포인트예요.

---

### 컷 2b — 뒤에서: 거대한 불덩이가 내려와 사람들 바로 앞바다에 착지 (5~8.5초) ★ 하이라이트

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상** |
| 길이 | **5초** |
| 파일 이름 | `w2_impact.mp4` |

**1) 키프레임** (AI Image, Seedream, 9:16, 2K — 레퍼런스: taki 01·06·15)
```
Low wide shot from behind a row of beachgoers on Haeundae beach, seen from behind, all looking up; a gigantic blazing neon-green fireball fills the upper sky, coming straight down toward the sea right in front of them, its glow lighting the whole beach green. Calm blue sea only a hundred meters ahead. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상** (AI Video, Seedance 2.5, 이미지 → 영상)
```
0–2s: the gigantic green fireball descends straight toward the sea in front of the crowd, growing enormous; the people stagger back; a man shouts in Korean, "어어어… 이쪽으로 온다!" 2–3s: it slams into the sea only about a hundred meters in front of them. 3–5s: a colossal explosion of glowing white-green water shoots hundreds of meters into the sky, spray rains down on the people, and inside the mist the silhouette of the colossal green character from the reference images (round glossy green jelly body, small horn on top, big white cartoon eyes, short stubby arms and legs, purple waist pouch with its own pair of cartoon eyes) rises. Camera shakes hard at the impact. Epic, photorealistic. No text.
```
- 불덩이가 **사람들 바로 앞**에 떨어지는 결과만 고르세요. 수평선 너머에 떨어지면 탈락이에요.

---

### 컷 3a — 정면: 착지 지점에서 솟는 거대한 물 파도, 속에 상품들 (8.5~11초) ★ 반전

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상** |
| 길이 | **4초** |
| 파일 이름 | `w3_wave.mp4` |

**1) 키프레임** (AI Image, Seedream, 9:16, 2K — 레퍼런스: products 01(라인업) + TV·냉장고·노트북·세탁기 1장씩)
```
From Haeundae beach looking out to sea: right where the giant object landed, a colossal turquoise ocean wave as tall as skyscrapers rises, its curling face backlit by the sun so the water is crystal clear and translucent. Suspended inside the glowing water, clearly visible like objects in glass, are hundreds of modern home appliances and gadgets like those in the reference images — flat-screen TVs, laptops, refrigerators, washing machines, headphones, sneakers, smartphones — no visible brand logos or text. Tiny people on the beach in the foreground. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상** (AI Video, Seedance 2.5, 이미지 → 영상)
```
0–1.5s: the colossal translucent wave swells even higher, sunlight shining through it. 1.5–4s: it rolls toward the beach and the products inside the clear water tumble slowly, glittering; the camera slowly pushes in. Spectacular and joyful, not scary. No visible logos. No text.
```

---

### 컷 3b — 옆에서 본 쓰나미 (11~13초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상** |
| 길이 | **4초** |
| 파일 이름 | `w3b_side.mp4` |

**1) 키프레임** (AI Image, Seedream, 9:16, 2K — 레퍼런스: products 01 + 냉장고·TV 1장씩)
```
Side view along Haeundae beach: the profile of a colossal curling turquoise wave towering over the shoreline like a glass cathedral, products — TVs, laptops, refrigerators — visible inside the backlit water, tiny people on the beach looking up, the hotel skyline in the distance. Epic scale, side angle from the sand. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상** (AI Video, Seedance 2.5, 이미지 → 영상)
```
The camera holds a side angle as the colossal curling wave rolls past along the shore, its translucent lip curling over, products tumbling inside the glowing water, spray blowing off the crest. Spectacular, not scary. No visible logos. No text.
```

---

### 컷 4 — 상품들이 사람들 바로 앞 모래사장에 쾅쾅 꽂힘 (13~16.5초) ★ 스펙터클

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상** |
| 길이 | **5초** |
| 파일 이름 | `w4_welcome.mp4` |

**1) 키프레임** (AI Image, Seedream, 9:16, 2K — 레퍼런스: products 01 + 냉장고·세탁기·TV·노트북 1장씩)
```
Low-angle shot from behind a row of Korean beachgoers on Haeundae beach, seen from behind; in front of them, large products — flat-screen TVs, refrigerators, washing machines, laptops, sneakers — are falling out of the sky from a breaking wave of foam and slamming into the sand, half buried at angles, sand bursting up around them. A grandmother holds a red plastic basin over her head. Bright sunny day, dramatic slow motion. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상** (AI Video, Seedance 2.5, 이미지 → 영상)
```
Slow motion. 0–2.5s: as the giant wave breaks into foam, dozens of products — TVs, refrigerators, washing machines, laptops, sneakers — fall out of the sky and slam into the sand right in front of the people, sticking in at angles with big bursts of sand, one after another; the people flinch. 2.5–5s: the sand settles and the people burst into cheers, jumping and running toward the products. Nobody is hurt. Spectacular and joyful. No visible logos. No text.
```
- 제품이 **사람들 바로 앞에 꽂히는** 게 핵심이에요. 사람에게 떨어지거나 다치는 느낌이면 탈락이에요.

---

### 컷 5 — 해변 앞바다에 우뚝 선 초거대 택이가 윙크 (16.5~20.5초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상** |
| 길이 | **5초** |
| 파일 이름 | `w5_taki.mp4` |

**1) 키프레임** (AI Image, Seedream, 9:16, 2K — 레퍼런스: taki 01·10·12·13·14)
```
Extreme low-angle shot from the sand of Haeundae beach, past the heads of a cheering crowd seen from behind: towering in the shallow sea just offshore stands the colossal green character from the reference images (round glossy green jelly body, small horn on top, big white cartoon eyes, short stubby arms and legs, purple waist pouch with its own pair of cartoon eyes), so gigantic that it dwarfs the high-rise hotels and its head is near the clouds, standing upright on its short legs with the purple pouch above the water, water streaming off its glossy body. Products lie scattered on the sand in the foreground. Golden afternoon light, epic scale, photorealistic VFX creature composited into a real beach. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상** (AI Video, Seedance 2.5, 이미지 → 영상)
```
0–2s: the colossal character stands tall in the sea, water streaming down its body, and slowly looks down at the tiny crowd. 2–3s: it gives a big playful wink and the eyes on its purple pouch blink too. 3–5s: the crowd cheers and waves up at it. Epic and cute. No text, no logos.
```
- 윙크 순간에 Claude가 자막과 성우 내레이션 **"거대한 혜택이 밀려온다"**를 넣어요.

---

### 컷 6 — 상품으로 뒤덮인 해운대 항공샷 + KV 엔드카드 (20.5~29.5초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상** |
| 길이 | **10초** |
| 파일 이름 | `w6_aerial.mp4` |

**1) 키프레임** (AI Image, Seedream, 9:16, 2K — 레퍼런스: taki 01·12 + products 01·08)
```
High aerial drone shot over Haeundae beach in Busan in golden afternoon light, looking down at an angle from above the sea toward the beach. The entire long sandy beach is covered with thousands of colorful products — flat-screen TVs, laptops, refrigerators, washing machines, sneakers, headphones, shopping bags — and crowds of happy people celebrating among them; the high-rise skyline behind; in the sea, the colossal green character from the reference images (round glossy green jelly body, small horn on top, big white cartoon eyes, short stubby arms and legs, purple waist pouch with its own pair of cartoon eyes) stands waving. No visible brand logos or text. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural light, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상** (AI Video, Seedance 2.5, 이미지 → 영상)
```
0–4s: slow cinematic drone rise over the sea toward the beach covered in products, people cheering and holding up TVs and laptops. 4–10s: the camera keeps rising and pulling back, revealing the whole beach covered in products under golden light; the giant green character waves. Joyful and spectacular. No text, no logos.
```
- 이 컷 위에 KV 엔드카드가 얹히고, 성우가 **"넾다세일!"**을 외쳐요. 화면 가운데가 너무 복잡하지 않은 결과를 고르세요.

---

## 7. Claude에게 넘기기

1. 완성 영상 8개 파일 이름 확인:
   `w1_meteor` `w2a_faces` `w2_impact` `w3_wave` `w3b_side` `w4_welcome` `w5_taki` `w6_aerial` (.mp4)
2. 구글 드라이브에 폴더 만들기 → 8개 업로드 (키프레임 이미지도 같이 넣어 주면 좋아요)
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
| 파도가 무섭게(재난처럼) 나옴 | 프롬프트에 `cheerful, whimsical, bright, sunny, not a disaster, no destruction` 추가. 사람들이 웃는 장면이 꼭 이어지게 |
| 상품에 브랜드 로고·글자가 깨져서 생김 | AI가 그린 글자는 대부분 깨져요. Smart Edit로 지우거나 다시 생성. 프롬프트의 `no visible brand logos or text` 유지 |
| 물속 상품이 안 보이고 그냥 파도만 나옴 | 키프레임부터 다시. `backlit, crystal clear translucent water, products clearly visible inside like objects in glass` 강조 |
| 크레딧 부족 | 단순한 컷(컷 2·4)은 480p로, 또는 Standard 업그레이드 |
| 결과에 워터마크가 있음 | 유료 플랜인지, 다운로드 옵션에서 워터마크 없는 버전을 골랐는지 확인 |

---

## 9. 증빙 (출품서용) — 하면서 바로 캡처

- 컷마다 **프롬프트 + 결과가 같이 보이는 화면** 캡처 1장
- 키프레임 → 영상으로 이어지는 과정이 보이면 'AI 기술 활용도' 설명에 좋아요
- 구독 영수증
