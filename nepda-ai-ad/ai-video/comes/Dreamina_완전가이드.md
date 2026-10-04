# Dreamina 완전 가이드 — 「그것이 온다」 처음부터 끝까지

> 이 문서만 위에서부터 따라 하면 돼요. 프롬프트는 전부 **통째로 복사**하면 되게 만들어 뒀어요.
> ⚠️ Dreamina 화면은 자주 바뀌어서 **버튼 이름이 조금 다를 수 있어요.** 아래는 기능 기준으로 설명했으니, 비슷한 이름을 찾으면 돼요.

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

## 3. 크레딧 예산 — 가장 중요

- Basic 첫 달 크레딧: **1,575개**
- 공식 단가로 계산하면 Seedance 2.5 **720p 영상은 대략 초당 37크레딧 → 4초에 약 150크레딧**이에요. 크레딧은 화면에 표시되는 숫자가 정답이니 꼭 확인하세요.
- 이미지(키프레임)는 장당 몇 크레딧 수준으로 저렴해요. Seedream 4.6은 2K에 약 3크레딧, 5.0 Lite는 2K에 약 9크레딧이에요.

| 항목 | 개수 | 크레딧(대략) |
|---|---|---|
| 키프레임·끝 프레임 이미지 | 약 25장 | 약 100~250 |
| 영상 10컷 × 1번 (4초, 720p) | 10개 | 약 1,500 |
| **합계** | | **약 1,600~1,750 → Basic만으로는 살짝 모자라요** |

**그래서 이렇게 해요**
1. 영상은 **720p, 4초**로 컷당 **1번만** 뽑는 게 기본이에요. 키프레임을 잘 만들면 한 번에 성공할 확률이 높아요. 이게 키프레임 방식의 장점이에요.
2. 첫 영상(컷 0)을 뽑고 **실제로 줄어든 크레딧**을 확인해요.
3. 모자라면 아래 둘 중 하나로 채워요.
   - 단순한 증거 컷(물컵, 비둘기, 신호등 등)은 **480p**로 뽑기 (약 절반 가격, 편집에서 그레인으로 티가 덜 나요)
   - 또는 **Standard**로 업그레이드 (첫 달 $22, 크레딧 3,885)

---

## 4. 키프레임(정지 장면) 만드는 법 — AI Image

1. 왼쪽 메뉴 **AI Image** 클릭
2. 모델 칩 클릭 → **Seedream 5.0** (또는 Seedream 4.6 — 더 싸요) 선택
3. **Aspect ratio(비율)**: **9:16**
4. **Resolution**: **2K**
5. 한 번에 여러 장이 나오는 옵션이 있으면 **2장**으로 (비교용)
6. 프롬프트 입력창에 그 컷의 **[키프레임] 프롬프트**를 붙여넣기 → **Generate**
7. 결과 중 제일 좋은 것 고르기 (아래 체크리스트) → 마우스 올리고 **Download**
   - 파일명 예: `k0_first.png`

**택이가 나오는 컷(7·8·9)**: 입력창 옆 **+ / Reference(참고 이미지)**로 `taki_front.png`, `taki_full.png`를 올린 뒤 생성해요.

**끝 프레임 만들기**(컷 0·7·9): "같은 장면인데 ~만 바뀐" 이미지가 필요해요.
1. 방금 만든 키프레임 결과에 마우스 올리기 → **Edit / Use as reference / Reference** 같은 버튼 (또는 다운로드한 키프레임을 + 로 업로드)
2. 그 컷의 **[끝 프레임] 프롬프트** 붙여넣기 → Generate
3. **사람·차·건물 위치가 키프레임과 거의 같은지** 확인 (다르면 영상이 이상하게 이어져요) → Download → `k0_last.png`

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
   - **First and Last Frames (첫·끝 프레임)**: 컷 0, 7, 9 → 이미지 2장 업로드 (첫 = `k0_first.png`, 끝 = `k0_last.png`)
   - **Image to Video (첫 프레임만)**: 나머지 컷 → 키프레임 1장 업로드
     - 'Image to video' 탭이 따로 없으면 First and Last Frames에서 **첫 프레임만** 넣으면 돼요.
4. 설정
   - **Aspect ratio 9:16** (이미지를 넣으면 이미지 비율을 따라가기도 해요)
   - **Resolution 720p**
   - **Duration 4s**
   - **Audio / Sound: 켜기** (현장음이 같이 나와요. 편집에서 작게 깔아요)
5. 그 컷의 **[영상 생성] 프롬프트** 붙여넣기
6. **Generate 옆 크레딧 숫자 확인** → Generate
7. 생성 대기 (보통 몇 분) → 결과 재생해서 확인 (아래 체크리스트)
8. 마음에 들면 **Download** → 워터마크 없는 버전으로 받기 → 파일 이름을 표대로 바꾸기 (예: `c0_shadow.mp4`)

**영상 체크리스트**
- [ ] 움직임이 프롬프트대로인가 (그림자 덮침, 눈 뜨기 등)
- [ ] 화면에 **글자나 자막이 생기지 않았는가**
- [ ] 사람이 녹거나 갑자기 변하지 않았는가 (앞 1~2초만 괜찮으면 OK, 편집에서 짧게 써요)

**다시 뽑을 때 팁**
- 거의 맞는데 일부만 이상하면 → 결과 메뉴의 **Smart Edit / Edit(부분 수정)**으로 그 부분만 고치기 (전체 재생성보다 싸요)
- 움직임이 너무 약하면 → 프롬프트 앞에 `Dramatic, clearly visible motion:`을 추가
- 움직임이 너무 과하면 → `subtle, slow, realistic motion`을 추가

---

## 6. 컷별 레시피 (순서대로)

> 공통: 키프레임은 **AI Image (Seedream, 9:16, 2K)** / 영상은 **AI Video (Seedance 2.5, 9:16, 720p, 4초)**
> **컷 0부터** 하세요. 첫 1초 훅이 제일 중요해요. 컷 0이 나오면 Claude에게 먼저 보여 주세요.

### 컷 0 — 그림자가 횡단보도를 덮침 (0~2.4초) ★ 훅

| 항목 | 값 |
|---|---|
| 영상 모드 | **첫·끝 프레임** |
| 길이 | 4초 |
| 파일 이름 | `c0_shadow.mp4` |

**1) 키프레임 만들기** (이미지 생성)
```
High-angle shot from a 10th-floor window looking straight down at a wide crosswalk on a Seoul boulevard at noon, bright hard sunlight with sharp short shadows, dozens of pedestrians in autumn clothes crossing in every direction, a few cars waiting at the line, the asphalt and white zebra stripes crisp. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural daylight, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 끝 프레임 만들기** (방금 만든 키프레임을 **참고 이미지로 올리고** 아래 프롬프트로 생성)
```
Same exact image, same camera, same people and cars in the same positions, but the entire scene is now covered by an enormous soft-edged shadow cast by something gigantic in the sky above; the light is dim and cool; every pedestrian has stopped and is looking straight up at the sky. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural daylight, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**3) 영상 생성** (Seedance 2.5, 첫·끝 프레임)
```
A gigantic shadow sweeps across the crosswalk very fast, from the top of the frame to the bottom in under one second, swallowing the sunlight. The pedestrians stop and all look straight up. Locked-off camera, realistic, cinematic. Sound: busy city ambience, then a sudden deep impact. No text.
```

---

### 컷 1 — 군중이 하늘을 올려다봄 (슬로모, 1.6초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상 (첫 프레임만)** |
| 길이 | 4초 |
| 파일 이름 | `c1_lookup.mp4` |

**1) 키프레임 만들기** (이미지 생성)
```
Low-angle medium shot of a crowd of Korean office workers and students on a Seoul sidewalk in deep shadow, all frozen and looking straight up at the sky in awe, a young woman's iced coffee cup slipping from her hand, cool rim light from the bright sky edge, 85mm lens, shallow depth of field, background softly blurred. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural daylight, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상 생성** (Seedance 2.5, 이미지 → 영상 (첫 프레임만))
```
Slow motion, 120fps feel. The iced coffee cup falls and bursts on the ground in slow motion; the crowd stares upward, hair and coats moving in a sudden gust of wind. Camera very slowly pushes in. No text.
```

---

### 컷 2 — 물컵 파문 (1초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상 (첫 프레임만)** |
| 길이 | 4초 |
| 파일 이름 | `c2_cup.mp4` |

**1) 키프레임 만들기** (이미지 생성)
```
Macro close-up of a clear glass of water on a wooden dining table in a Korean apartment kitchen in the morning, a stainless steel spoon and a small kimchi side-dish container next to it, soft window light, shallow depth of field. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural daylight, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상 생성** (Seedance 2.5, 이미지 → 영상 (첫 프레임만))
```
With a deep distant thud, perfect concentric ripples form on the water surface and the spoon rattles slightly on the table. Locked-off macro camera. No text.
```

---

### 컷 3 — 비둘기 떼 이륙 (1초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상 (첫 프레임만)** |
| 길이 | 4초 |
| 파일 이름 | `c3_pigeons.mp4` |

**1) 키프레임 만들기** (이미지 생성)
```
Hundreds of pigeons perched on tangled power lines above a narrow Seoul residential alley, bright overcast sky, telephoto lens compression. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural daylight, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상 생성** (Seedance 2.5, 이미지 → 영상 (첫 프레임만))
```
All the pigeons take off at the same instant in panic, a storm of wings filling the frame. Camera holds still. No text.
```

---

### 컷 4 — 한강 탑뷰 거대 파문 (1.3초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상 (첫 프레임만)** |
| 길이 | 4초 |
| 파일 이름 | `c4_river.mp4` |

**1) 키프레임 만들기** (이미지 생성)
```
Straight top-down drone shot of the Han River in Seoul, a long bridge crossing the frame, calm dark-blue water, small boats, sunlight glinting. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural daylight, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상 생성** (Seedance 2.5, 이미지 → 영상 (첫 프레임만))
```
A colossal concentric ripple ring expands across the entire river surface from beyond the edge of the frame, the boats rock in the passing wave. Static top-down drone. No text.
```

---

### 컷 5 — 신호등 흔들림 (0.8초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상 (첫 프레임만)** |
| 길이 | 4초 |
| 파일 이름 | `c5_signal.mp4` |

**1) 키프레임 만들기** (이미지 생성)
```
Low-angle close shot of a Korean traffic light pole at an intersection, the signal glowing red, dark shadowed sky behind it. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural daylight, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상 생성** (Seedance 2.5, 이미지 → 영상 (첫 프레임만))
```
The traffic light pole shakes violently with a single giant footstep impact, dust falls from it, then it keeps trembling. No text.
```

---

### 컷 6 — 주차장 차들 경보 (0.9초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상 (첫 프레임만)** |
| 길이 | 4초 |
| 파일 이름 | `c6_cars.mp4` |

**1) 키프레임 만들기** (이미지 생성)
```
Wide shot of a row of parked cars in an outdoor Korean apartment parking lot in shadow, apartment buildings behind. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural daylight, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상 생성** (Seedance 2.5, 이미지 → 영상 (첫 프레임만))
```
With a giant footstep impact, all the cars bounce on their suspension at once and their hazard lights start flashing. No text.
```

---

### 컷 7 — 산 능선이 움직인다 (망원, 2.8초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **첫·끝 프레임** |
| 길이 | 4초 |
| 파일 이름 | `c7_mountain.mp4` |

**1) 키프레임 만들기** (이미지 생성)
```
Extreme telephoto 600mm shot across layers of Seoul apartment complexes toward a hazy green mountain ridge in the distance, heavy atmospheric haze, heat shimmer, the mountain looming huge due to lens compression. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural daylight, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 끝 프레임 만들기** (방금 만든 키프레임을 **참고 이미지로 올리고** + 택이 참고 이미지 2장도 함께 아래 프롬프트로 생성)
```
Same exact shot, but the mountain ridge has risen and shifted: it is clearly the smooth, glossy green back and head of a colossal creature (the green character in the attached images, seen from behind, with the small horn on top) rising slowly out of the haze behind the apartments. Keep the haze and lens compression. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural daylight, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**3) 영상 생성** (Seedance 2.5, 첫·끝 프레임)
```
The distant mountain ridge slowly moves and rises; it is alive. Flocks of birds scatter from it. Heavy haze, telephoto compression, very slow and massive movement. No text.
```

---

### 컷 8 — 골목 끝을 채운 거대한 눈 (정적, 2.2초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **이미지 → 영상 (첫 프레임만)** |
| 길이 | 4초 |
| 파일 이름 | `c8_eye.mp4` |

**1) 키프레임 만들기** (이미지 생성 **택이 참고 이미지 2장 첨부**)
```
Narrow old Seoul alley between red-brick buildings, shot from the alley entrance at eye level. At the far end, the gap between the buildings is completely filled by one gigantic glossy cartoon eye of the green character in the attached images: a huge white eyeball with a black pupil, surrounded by glossy green skin, half-closed. Dust particles floating in a shaft of light, an empty delivery scooter parked in the foreground. Photorealistic VFX creature composited into a real location, matching the lighting. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural daylight, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**2) 영상 생성** (Seedance 2.5, 이미지 → 영상 (첫 프레임만))
```
Complete stillness. The gigantic eye at the end of the alley slowly opens fully and its pupil shifts to look directly at the camera. Dust particles drift. Locked-off camera. No sound except a faint breath. No text.
```

---

### 컷 9 — 줌아웃 → 택이 윙크 (2.2초)

| 항목 | 값 |
|---|---|
| 영상 모드 | **첫·끝 프레임** |
| 길이 | 4초 |
| 파일 이름 | `c9_reveal.mp4` |

**1) 첫 프레임** = 컷 8에서 만든 키프레임 이미지를 그대로 사용

**2) 끝 프레임 만들기** (방금 만든 키프레임을 **참고 이미지로 올리고** + 택이 참고 이미지 2장도 함께 아래 프롬프트로 생성)
```
Wide shot from far back at the alley entrance: the colossal green character from the attached images is leaning over the rooftops of the alley buildings, its huge round face above the alley, small horn on top, its purple waist pouch with its own cartoon eyes visible behind the buildings, one eye closed in a playful wink. Bright daylight returning, photorealistic VFX creature composited into a real Seoul neighborhood. Shot on ARRI Alexa 35 with a vintage anamorphic lens, cinematic blockbuster film still, natural daylight, subtle atmospheric haze, Kodak 5219 film grain, realistic color, vertical 9:16 composition. No readable text, no signage, no logos, no watermarks.
```

**3) 영상 생성** (Seedance 2.5, 첫·끝 프레임)
```
The camera pulls back quickly, revealing the colossal green character leaning over the buildings; it gives a playful wink and the eyes on its purple pouch blink too. Cute and friendly. No text.
```


---

## 7. Claude에게 넘기기

1. 완성 영상 10개 파일 이름 확인:
   `c0_shadow.mp4` `c1_lookup.mp4` `c2_cup.mp4` `c3_pigeons.mp4` `c4_river.mp4` `c5_signal.mp4` `c6_cars.mp4` `c7_mountain.mp4` `c8_eye.mp4` `c9_reveal.mp4`
2. 구글 드라이브에 폴더 만들기 → 10개 업로드 (키프레임 이미지도 같이 넣어 주면 좋아요)
3. 폴더 **공유 → 일반 액세스: 링크가 있는 모든 사용자** → 링크 복사 → 채팅에 붙여넣기
4. 그러면 Claude가 다음을 다 해요:
   - 컷 길이 맞추기
   - 색보정, 그레인
   - '쿵'마다 화면 흔들림
   - 사운드 디자인
   - "10.26" 카드와 KV 엔드카드
   - **최종 mp4**

---

## 8. 문제 해결

| 문제 | 해결 |
|---|---|
| 업로드 시 **"실제 사람 얼굴이 포함됐을 수 있음"** 오류 | Seedance는 실존 인물 얼굴 업로드를 막아요. 사람이 크게 나오는 컷(주로 컷 1)에서 생길 수 있어요. → 키프레임에서 얼굴을 더 작게(뒷모습·옆모습·멀리) 다시 만들거나, 그 컷만 **이미지 없이 Text to Video**로 [키프레임]+[영상 생성] 프롬프트를 합쳐서 생성 |
| 화면에 깨진 글자·간판이 생김 | 키프레임부터 다시. 구도를 더 위에서 내려다보거나 하늘 쪽으로 |
| 택이가 안 닮음 | 참고 이미지 2장을 꼭 첨부. 그래도 안 되면 Smart Edit로 눈·뿔·파우치만 수정 |
| 첫·끝 프레임이 이상하게 이어짐 | 끝 프레임의 사람·건물 위치가 첫 프레임과 많이 다른 것. 끝 프레임을 다시 만들기 |
| 크레딧 부족 | 3장 참고 (480p 또는 Standard) |
| 결과에 워터마크가 있음 | 유료 플랜인지, 다운로드 옵션에서 워터마크 없는 버전을 골랐는지 확인 |

---

## 9. 증빙 (출품서용) — 하면서 바로 캡처

- 컷마다 **프롬프트 + 결과가 같이 보이는 화면** 캡처 1장
- 키프레임 → 영상으로 이어지는 과정이 보이면 'AI 기술 활용도' 설명에 좋아요
- 구독 영수증
