# Dreamina 가이드 v2 — 「거대한 혜택이 밀려온다」 (멀티샷 방식)

> 택이가 운석처럼 떨어져 해운대 바로 앞바다에 착지 → 물 파도 속에 TV·냉장고·노트북 → 제품들이 모래사장에 쾅쾅 → 초거대 택이 윙크 + **"거대한 혜택이 밀려온다"** → 제품으로 뒤덮인 해운대 + KV + **"넾다세일!"**
> 위에서부터 순서대로 따라 하면 돼요. 프롬프트는 **통째로 복사**하세요.
> ⚠️ Dreamina 화면은 자주 바뀌어요. 버튼 이름이 조금 달라도 기능이 같은 버튼을 찾으면 돼요.

## 무엇이 바뀌었나 (v1 → v2)

| | v1 (컷 8개 따로) | **v2 (생성 3번)** |
|---|---|---|
| 생성 단위 | 컷마다 1개 영상 → 8번 생성 | **한 번에 2~3샷**(Shot 1 … Hard cut … Shot 2) → **3번 생성** |
| 컷 사이 연결 | 사람·빛·해변이 컷마다 달라짐 | 한 생성 안에서 **같은 해변, 같은 사람, 같은 빛** |
| 레퍼런스 | 택이·제품 사진을 섞어서 넣음 | **사진마다 역할 1개**(택이 생김새 / 구도 / 제품 모양) |
| 구도 | 텍스트로 설명 | **샷마다 구도 이미지(키프레임)**로 고정 → 텍스트는 움직임만 |
| 시간 | 대충 | **초 단위 타임코드** (0–2s, 2–5s …) |
| 비용 | 720p로 바로 뽑기 | **480p로 테스트 → 720p로 최종** |
| 프롬프트 | 형용사 많고 길었음 | 짧게. 샷당 카메라 움직임 1개 |

Seedance 사용자들이 많이 쓰는 원칙이에요: **"이미지 = 구도, 텍스트 = 움직임, 타임코드 = 편집"**. 한 번에 4~5샷을 넘기면 뒤쪽 샷 품질이 떨어져서, 30초 광고는 **2~3번에 나눠** 생성해요.

---

## 한눈에 보는 콘티 (29.5초)

미리보기: `animatic/밀려온다_애니매틱_미리보기.mp4` · 샷별 구도: `storyboard_sheet.jpg`

| 최종 시간 | 생성 | 샷 | 장면 | 소리 (Claude가 편집에서) |
|---|---|---|---|---|
| 0~2초 | **A** | 1 | 우주: 초록 불덩이(택이)가 대기권으로 | 쉬이익 |
| 2~4.9초 | **A** | 2 | **정면**: 하늘 보고 얼어붙는 사람들, 초록빛이 얼굴에 — "어? 저게 뭐야?" | 🎵 차라투스트라 낮은 울림 |
| 4.9~9.4초 | **A** | 3 | **뒤에서**: 불덩이가 바로 앞바다에 착지(7.8초) → 물기둥 속 택이 실루엣 | 🎵 "빠–바–**밤!**" = 쿵! |
| 9.4~11.7초 | **B** | 1 | 정면: 솟아오르는 투명한 물 파도, 속에 TV·냉장고·노트북 | 🎵 클라이맥스 |
| 11.7~13.5초 | **B** | 2 | **옆에서 본 쓰나미** | 🎵 |
| 13.5~16.8초 | **B** | 3 | 제품들이 사람들 바로 앞 모래에 쾅쾅 꽂힘 → 환호 | 쾅쾅 |
| 16.8~20.8초 | **C** | 1 | 호텔보다 큰 **초거대 택이**가 우뚝 서서 윙크 + **"거대한 혜택이 밀려온다"** | 성우 |
| 20.8~29.5초 | **C** | 2 | 제품으로 뒤덮인 해운대 항공샷 + KV 엔드카드 + **"넾다세일!"** | 🎵 정점 → 여운 |

- 생성 길이: **A 10초 · B 9초 · C 14초** (편집에서 앞뒤를 조금씩 잘라 29.5초로 맞춰요)
- 자막·KV 엔드카드·음악·효과음·내레이션은 Claude가 편집에서 넣어요.

**음악**: 「차라투스트라는 이렇게 말했다」 Kevin MacLeod 연주, **CC BY 3.0** (상업 이용 OK, 출처 표기 필수). 이 한 곡만 써요. 업로드 캡션에 아래 문구를 넣으세요.
`Music: "Also Sprach Zarathustra" Kevin MacLeod (incompetech.com) / Licensed under CC BY 3.0`

---

## 0. 준비물

- PC 크롬 브라우저
- `reference_images.zip` 압축 풀기 → `taki/` 16장, `products/` 17장
- `storyboard/` 폴더 → 샷별 구도 이미지 8장 (`layout_A1_meteor.jpg` …). 3D 애니매틱에서 뽑은 거라 **구도만** 참고용이에요.

## 1. 가입·결제 — ⚠️ 10월 9일까지

1. **https://dreamina.capcut.com** → **Sign in** (CapCut / Google / TikTok)
2. **Subscribe** → 플랜 선택 → **Monthly(월간)** (연간은 할인 없음)
3. 결제 직후 **Subscription → Cancel auto-renew** (크레딧은 이번 달 그대로 써요)
4. **영수증 캡처** → 출품서 '유료 플랜(상업 이용)' 증빙

---

## 2. 크레딧 계산

정확한 숫자는 항상 **Generate 버튼 옆**에 나와요. 아래는 대략이에요.

| 항목 | 계산 | 크레딧 |
|---|---|---|
| 키프레임 7장 (Seedream, 2번씩) | 14 × 약 3~6 | 약 80 |
| 480p 테스트 1회 (A+B+C 33초) | 33 × 약 18 | 약 600 |
| 720p 최종 1회 (33초) | 33 × 약 37 | 약 1,220 |

| 플랜 | 크레딧 | 이렇게 쓰기 |
|---|---|---|
| Basic ($1.50) | 1,575 | 키프레임 + **A·B만 480p 테스트**(약 340) + 720p 최종 1번씩(약 1,220) → **다시 뽑을 여유 없음** |
| **Standard ($22)** ✅ | 3,885 | 키프레임 + 480p 테스트 2회 + 720p 최종 + **가장 어려운 생성 1~2번 재시도** |

> 💡 480p → 720p는 **화질만 올리는 게 아니라 새로 뽑는 것**이에요(결과가 달라져요). 480p는 "프롬프트·레퍼런스가 먹히는지" 확인용이에요.
> 결과 메뉴에 **Upscale / HD** 버튼이 있으면, 480p가 완벽할 때 그걸 올리는 게 제일 싸고 확실해요.
> 720p는 편집에서 1080×1920으로 키워서 규격을 맞춰요.

---

## 3. 전체 순서

```
① 키프레임 7장 만들기 (AI Image · Seedream)
      구도 이미지 + 택이/제품 사진 → 실사 정지 장면
② 생성 A·B·C를 480p로 테스트 (AI Video · Seedance 2.5 · 레퍼런스 모드)
      샷이 순서대로 나오는지, 택이가 닮았는지, 글자가 안 생기는지만 확인
③ 문제 있으면 프롬프트·레퍼런스 고쳐서 다시 480p
④ 통과한 프롬프트 그대로 720p 최종 (마음에 들 때까지)
⑤ genA / genB / genC 세 파일을 구글 드라이브로 → Claude가 편집
```

---

## 4. ① 키프레임 7장 — AI Image (Seedream)

**설정**: 왼쪽 메뉴 **AI Image** → 모델 **Seedream 5.0** (또는 4.6) → 비율 **9:16** → **2K** → 한 번에 여러 장이면 그대로

**레퍼런스 올리는 법**: 입력창 옆 **+ / Reference** → 아래 표의 순서대로 올리기 (올린 순서가 Image 1, 2, 3…이 돼요)

**고를 때 체크**
- [ ] 글자·간판·로고가 안 보인다 (제일 중요)
- [ ] 3D 애니매틱처럼 보이지 않고 **실사 영화 장면** 같다
- [ ] 구도가 구도 이미지와 비슷하다
- [ ] 택이: 초록 젤리 몸, 뿔, 하얀 큰 눈, 보라 파우치에 눈 2개

**파일 이름**을 표대로 바꿔서 저장하세요 (`key_A1.png` …).

> 샷 A2(사람들 얼굴 정면)는 **키프레임을 만들지 않아요.** 사람 얼굴 이미지를 영상 생성에 올리면 '실제 인물 얼굴' 제한에 걸릴 수 있어서, 텍스트로만 만들어요.

### key_A1 — 우주의 초록 불덩이
레퍼런스: ① `storyboard/layout_A1_meteor.jpg` ② `taki_01_white_render_sitting` ③ `taki_03_front_face_closeup`
```
Image 1 is a rough 3D layout: copy only its camera angle and framing, not its look. Images 2 and 3 show the character Taki: glossy green jelly body, small horn on top, big white cartoon eyes, stubby arms and legs.
Photoreal film still. View from low Earth orbit over the Korean Peninsula at golden hour; Earth's curve and a thin blue atmosphere. A neon-green fireball with a long glowing trail enters the atmosphere; Taki is curled up inside the green flames. Anamorphic lens, natural light, light film grain. No text, no logos.
```

### key_A3 — 사람들 뒤에서 본 불덩이
레퍼런스: ① `storyboard/layout_A3_impact.jpg` ② `taki_01_white_render_sitting`
```
Image 1 is a rough 3D layout: copy only its camera angle and framing, not its look.
Photoreal film still. Low wide shot from behind a row of beachgoers on Haeundae Beach, Busan, on a sunny afternoon; we see only their backs as they look up. A gigantic neon-green fireball fills the upper sky, falling straight toward the calm sea about 100 meters ahead; its glow tints the beach green. Inside the fire is a faint round green shape like the character in Image 2. Anamorphic lens, natural light, light film grain. No text, no signage, no logos.
```

### key_B1 — 정면: 제품을 품은 투명한 파도
레퍼런스: ① `storyboard/layout_B1_wave.jpg` ② `product_01_samsung_appliance_lineup_white` ③ `product_10_lg_oled_tv_livingroom` ④ `product_02_samsung_fridge_frenchdoor_kitchen` ⑤ `product_12_samsung_galaxybook6`
```
Image 1 is a rough 3D layout: copy only its camera angle and framing, not its look. Images 2–5 show product designs only.
Photoreal film still. From Haeundae Beach looking out to sea, a skyscraper-tall turquoise wave rises; the sun is behind it, so the water is clear and glowing. Suspended inside the water, clearly visible like objects in glass, are hundreds of home appliances like those in Images 2–5: flat-screen TVs, refrigerators, washing machines, laptops. Small figures on the beach in the foreground, seen from behind. Anamorphic lens, natural light, light film grain. No brand logos, no text.
```

### key_B2 — 옆에서 본 쓰나미
레퍼런스: ① `storyboard/layout_B2_side.jpg` ② `product_01_samsung_appliance_lineup_white` ③ `product_02_samsung_fridge_frenchdoor_kitchen` ④ `product_10_lg_oled_tv_livingroom`
```
Image 1 is a rough 3D layout: copy only its camera angle and framing, not its look. Images 2–4 show product designs only.
Photoreal film still. Side view along Haeundae Beach from the sand: the profile of a colossal curling turquoise wave towers over the shoreline, backlit and translucent, with TVs, refrigerators and washing machines like those in Images 2–4 tumbling inside. Tiny people on the beach, the hotel skyline in the distance. Anamorphic lens, natural light, light film grain. No brand logos, no text.
```

### key_B3 — 모래사장에 꽂히는 제품들
레퍼런스: ① `storyboard/layout_B3_crash.jpg` ② `product_01_samsung_appliance_lineup_white` ③ `product_02_samsung_fridge_frenchdoor_kitchen` ④ `product_05_samsung_washer_black` ⑤ `product_10_lg_oled_tv_livingroom` ⑥ `product_12_samsung_galaxybook6`
```
Image 1 is a rough 3D layout: copy only its camera angle and framing, not its look. Images 2–6 show product designs only.
Photoreal film still, frozen action. Low angle from behind a row of beachgoers on Haeundae Beach, seen from behind. Just in front of them, a refrigerator, a washing machine, a flat-screen TV and laptops like those in Images 2–6 slam into the sand at angles, with big bursts of sand; more products fall out of the breaking foam behind. A woman holds her hands up in surprise. Bright sunny day. Anamorphic lens, natural light, light film grain. No brand logos, no text.
```

### key_C1 — 우뚝 선 초거대 택이
레퍼런스: ① `storyboard/layout_C1_taki.jpg` ② `taki_01_white_render_sitting` ③ `taki_12_standing_fullbody_2026` ④ `taki_13_pouch_eyes_2026` ⑤ `taki_10_giant_installation_fullbody`
```
Image 1 is a rough 3D layout: copy only its camera angle, not its look or scale. Images 2–5 show the character Taki: glossy green jelly body, small horn on top, big white cartoon eyes, stubby arms and legs, purple waist pouch with two cartoon eyes (as in Image 4).
Photoreal film still. Extreme low angle from the sand of Haeundae Beach, past the heads of a cheering crowd seen from behind. Taki stands upright in the shallow sea just offshore, far taller than the high-rise hotels, its head near the clouds, water streaming off its glossy body. A few products lie on the sand in the foreground. Golden afternoon light, epic scale, a realistic VFX creature in a real location. Anamorphic lens, light film grain. No text, no signage, no logos.
```
- 택이가 **호텔보다 훨씬 커 보이는** 결과만 고르세요. 작으면 `seen from far below, towering, colossal`을 앞에 추가.

### key_C2 — 제품으로 뒤덮인 해운대 항공샷
레퍼런스: ① `storyboard/layout_C2_aerial.jpg` ② `taki_12_standing_fullbody_2026` ③ `product_01_samsung_appliance_lineup_white` ④ `product_08_samsung_tv_livingroom`
```
Image 1 is a rough 3D layout: copy only its camera angle and framing, not its look. Image 2 shows the character Taki. Images 3–4 show product designs only.
Photoreal aerial drone still over Haeundae Beach, Busan, in golden afternoon light, looking down at an angle from above the sea. The whole long sandy beach is covered with thousands of products like those in Images 3–4 — TVs, refrigerators, washing machines, laptops — and crowds of happy people among them; high-rise skyline behind. At the right edge, in the sea, Taki stands waving. The center of the frame is calm sea and sand. Light film grain. No brand logos, no text, no signage.
```
- 가운데에 KV 로고가 얹혀요. **화면 가운데가 복잡하지 않은** 결과를 고르세요.

---

## 5. ② 영상 생성 A·B·C — AI Video (Seedance 2.5)

### 공통 설정

1. 왼쪽 메뉴 **AI Video** → 모델 **Seedance 2.5** (2.0이나 다른 모델이 아닌지 확인)
2. 모드: **Reference / Omni Reference / All-round reference** (여러 이미지를 넣고 프롬프트에서 `@Image1`처럼 부르는 모드)
   - 'First frame' 모드 아니에요. 여러 장을 넣을 수 있는 모드를 고르세요.
3. 비율 **9:16** · 해상도 **480p (테스트)** → 통과하면 **720p (최종)**
4. 길이: **A 10초 · B 9초 · C 14초** (그 숫자가 없으면 **바로 위 숫자**)
5. **Audio / Sound 켜기** (현장음이 같이 나와요. 편집에서 작게 깔아요)
6. 레퍼런스를 **표 순서대로** 올리기 → 올린 순서대로 `@Image1, @Image2…`가 돼요
   - 프롬프트를 붙여넣은 뒤 `@Image1` 글자가 이미지와 연결이 안 되면(파란 칩으로 안 바뀌면) 그 글자를 지우고 **`@`를 직접 쳐서 목록에서 이미지 선택**하세요.
7. 프롬프트 붙여넣기 → **Generate 옆 크레딧 확인** → Generate

### 결과 체크 (480p 테스트에서 이것만 보면 돼요)

- [ ] 샷이 **순서대로**, **대략 타임코드대로** 바뀌는가 (±0.5초는 편집에서 맞춰요)
- [ ] 택이가 닮았는가 (초록 젤리, 뿔, 하얀 눈, 보라 파우치)
- [ ] 화면에 **글자·자막·로고**가 안 생겼는가
- [ ] 사람이 녹거나 갑자기 바뀌지 않았는가
- [ ] 무섭지 않고 **유쾌한 스펙터클**인가 (B)

다운로드할 때는 **워터마크 없는 버전**으로 받고, 이름을 `genA.mp4`, `genB.mp4`, `genC.mp4`로 바꾸세요.

---

### 생성 A — 운석 낙하 (10초)

| 순서 | 파일 | 역할 |
|---|---|---|
| @Image1 | `taki_01_white_render_sitting` | 택이 생김새 (얼굴·몸) |
| @Image2 | `taki_12_standing_fullbody_2026` | 택이 전신 (2026 파우치) |
| @Image3 | `key_A1.png` | Shot 1 첫 장면 |
| @Image4 | `key_A3.png` | Shot 3 구도 |

```
Assets
@Image1 and @Image2: Taki, a giant green mascot (identity only; ignore their backgrounds). Glossy green jelly body, small horn on top, big white cartoon eyes, stubby arms and legs, purple waist pouch with two cartoon eyes.
@Image3: the opening frame of Shot 1.
@Image4: composition and lighting for Shot 3.

Brief
A 10-second vertical cinematic teaser. Taki falls from space like a meteor and lands in the sea right in front of beachgoers at Haeundae Beach, Busan. Photoreal live-action blockbuster look, anamorphic lens, natural light, light film grain.

Shot 1 (0–2s): Opens on @Image3. A neon-green fireball streaks down through the atmosphere toward Korea, Taki curled up inside the flames. The camera tracks the fireball.
Hard cut.
Shot 2 (2–5s): Low-angle medium shot facing a group of Korean beachgoers on a sunny afternoon, hotel towers behind them. They look up past the camera; their faces turn from curious to stunned, and a man slowly points up. Green light grows on their faces. A woman says in Korean, "어? 저게 뭐야?" Slow push-in. We never see what they are looking at.
Hard cut.
Shot 3 (5–10s): From behind the same crowd, matching @Image4. The giant green fireball drops straight toward the sea about 100 meters ahead and grows huge; people stagger back. At 8s it hits the water: a tower of white-green water explodes upward and spray rains onto the crowd. Taki's silhouette rises inside the mist. The camera shakes on impact.

Continuity
Same beach, same afternoon sun, same people and clothes in Shots 2 and 3. Taki is the only fantasy element.

Constraints
No on-screen text, subtitles, signage, logos or watermarks. No one is hurt.
```
- 불덩이가 **사람들 바로 앞**에 떨어져야 해요. 수평선 너머에 떨어지면 다시 뽑기.
- "어? 저게 뭐야?" 목소리가 어색하면 괜찮아요. Claude가 만들어 둔 목소리로 바꿔요.

---

### 생성 B — 혜택의 파도 (9초)

| 순서 | 파일 | 역할 |
|---|---|---|
| @Image1 | `product_01_samsung_appliance_lineup_white` | 제품 모양 |
| @Image2 | `product_10_lg_oled_tv_livingroom` | TV 모양 |
| @Image3 | `product_02_samsung_fridge_frenchdoor_kitchen` | 냉장고 모양 |
| @Image4 | `product_12_samsung_galaxybook6` | 노트북 모양 |
| @Image5 | `key_B1.png` | Shot 1 첫 장면 |
| @Image6 | `key_B2.png` | Shot 2 구도 |
| @Image7 | `key_B3.png` | Shot 3 구도 |

```
Assets
@Image1–@Image4: product designs only (TVs, refrigerators, washing machines, laptops). Do not copy their rooms or backgrounds. No brand logos.
@Image5: the opening frame of Shot 1.
@Image6: composition for Shot 2.
@Image7: composition for Shot 3.

Brief
A 9-second vertical cinematic sequence. Where a giant mascot just landed, a huge clear wave rises and carries hundreds of home appliances to Haeundae Beach. A joyful spectacle, not a disaster. Photoreal live-action blockbuster look, anamorphic lens, natural light, light film grain.

Shot 1 (0–3s): Opens on @Image5. The skyscraper-tall turquoise wave swells higher, backlit by the sun; TVs, refrigerators, washing machines and laptops float inside the clear water. Slow push-in.
Hard cut.
Shot 2 (3–5s): Side angle along the shore, matching @Image6. The wave's curling profile rolls past, products tumbling inside, spray blowing off the crest. The camera holds still.
Hard cut.
Shot 3 (5–9s): Low angle behind the crowd, matching @Image7. Slow motion: the wave breaks into foam at the waterline and products fly out and slam into the sand just in front of the people, one after another, with bursts of sand. Then the people cheer and run toward the products.

Continuity
Same beach, sun behind the wave, same people and clothes.

Constraints
The water only reaches the people's ankles. No one is hurt. No on-screen text, subtitles, signage, logos or watermarks.
```
- 물속 제품이 안 보이면 Shot 1에 `products clearly visible inside the water like objects in glass` 추가.
- 재난처럼 보이면 Brief에 `bright, cheerful, no destruction` 추가.

---

### 생성 C — 초거대 택이 + 해운대 (14초)

| 순서 | 파일 | 역할 |
|---|---|---|
| @Image1 | `taki_01_white_render_sitting` | 택이 생김새 (얼굴·몸) |
| @Image2 | `taki_12_standing_fullbody_2026` | 택이 전신 (2026 파우치) |
| @Image3 | `taki_14_wink_face_2026` | 윙크 표정 |
| @Image4 | `key_C1.png` | Shot 1 첫 장면 |
| @Image5 | `key_C2.png` | Shot 2 구도 |
| @Image6 | `product_01_samsung_appliance_lineup_white` | 제품 모양 |

```
Assets
@Image1 and @Image2: Taki, a giant green mascot (identity only; ignore their backgrounds). Glossy green jelly body, small horn on top, big white cartoon eyes, stubby arms and legs, purple waist pouch with two cartoon eyes.
@Image3: Taki's wink expression.
@Image4: the opening frame of Shot 1.
@Image5: composition for Shot 2.
@Image6: product designs only. No brand logos.

Brief
A 14-second vertical cinematic ending. Taki stands in the sea off Haeundae Beach, far taller than the hotel towers, and the beach is covered with products. Epic and cute. Photoreal live-action blockbuster look, anamorphic lens, golden afternoon light, light film grain.

Shot 1 (0–5s): Opens on @Image4. Extreme low angle from the sand past the cheering crowd. Taki stands upright in the shallow sea, water streaming off its glossy body, and slowly looks down at the tiny people. At 2s it gives a big playful wink like @Image3, and the eyes on its purple pouch blink too. The crowd cheers and waves. Slow tilt up.
Hard cut.
Shot 2 (5–14s): High aerial drone shot, matching @Image5. The whole of Haeundae Beach is covered with thousands of products and happy people; Taki waves from the sea at the right edge. The camera slowly rises and pulls back. Keep the center of the frame calm.

Continuity
Same beach, same golden light, Taki looks the same in both shots.

Constraints
No on-screen text, subtitles, signage, logos or watermarks.
```
- 윙크 순간에 Claude가 자막과 내레이션 **"거대한 혜택이 밀려온다"**를 넣어요. 윙크가 **확실히 보이는** 결과를 고르세요.
- Shot 2 위에 KV 엔드카드가 얹히고 **"넾다세일!"**이 나와요.

---

## 6. 문제 해결

| 문제 | 해결 |
|---|---|
| **생성 A가 거부됨** ("실제 인물" / 사람 중심 콘텐츠 제한) | A를 둘로 나눠요. **A-1**: Shot 1 + Shot 3만 (8초, Shot 2 문단 삭제 후 타임코드 0–2s / 2–8s로, 착지는 5s). **A-2**: Shot 2 문단만 **Text to Video**로 이미지 없이 4초 → `genA2_faces.mp4` |
| A-2도 거부됨 | 사람 수를 줄이고 `seen in profile, faces partly in shadow`를 추가. 그래도 안 되면 알려 주세요 (다른 모델로 이 샷만 만들어요) |
| 샷이 안 바뀌고 한 장면으로 이어짐 | 각 샷 끝의 `Hard cut.` 줄이 있는지 확인. 샷 수를 줄여서 (예: B를 2샷 + 1샷으로) 나눠 생성 |
| 뒤쪽 샷 품질이 떨어짐 | 그 생성을 2개로 나눠요. 한 번에 3샷 이하가 안전해요 |
| 택이가 안 닮음 | @Image1·2를 꼭 넣었는지 확인. 키프레임부터 택이가 닮아야 영상도 닮아요 → 키프레임 다시 |
| 3D 애니매틱처럼 보임 | 영상 생성에는 `storyboard/layout_*.jpg`가 아니라 **실사 키프레임(key_*.png)**을 넣었는지 확인 |
| 화면에 깨진 글자·간판·로고 | Constraints 줄 유지. 키프레임에 글자가 있으면 키프레임부터 다시 |
| 제품에 브랜드 로고가 생김 | 다시 뽑기. 작게 깨진 건 Claude가 편집에서 흐리게 처리할 수 있어요 |
| 크레딧 부족 | 480p 테스트를 A·B만 하기. C는 키프레임이 좋으면 바로 720p |
| 워터마크 있음 | 유료 플랜 로그인 확인 → 워터마크 없는 다운로드 선택 |

---

## 7. Claude에게 넘기기

1. 파일: `genA.mp4` `genB.mp4` `genC.mp4` (A를 나눴으면 `genA1.mp4` `genA2_faces.mp4`)
2. 키프레임 `key_*.png`도 같이 (증빙 + 편집 참고)
3. 구글 드라이브 폴더 → **공유: 링크가 있는 모든 사용자** → 링크를 채팅에 붙여넣기
4. Claude가 하는 일: 샷 자르기·타이밍 맞추기, 1080×1920 업스케일, 색보정·그레인, '쿵' 흔들림, 효과음·음악·내레이션, 자막, KV 엔드카드 → **최종 mp4**

## 8. 증빙 (출품서용) — 하면서 바로 캡처

- **구도 이미지 → 키프레임 → 영상**으로 이어지는 화면 (AI 기술 활용도 설명에 좋아요)
- 생성마다 **프롬프트 + 레퍼런스 + 결과**가 한 화면에 보이는 캡처 1장
- 480p 테스트 → 720p 최종 비교 캡처 (작업 과정)
- 구독 영수증
