# Dreamina 원샷 가이드 — 「거대한 혜택이 밀려온다」 (3D 레퍼런스 + 30초 한 번 생성)

> **방법**: Claude가 만든 **3D 클레이 레퍼런스 영상(29.5초)** + 택이·제품 사진 + 프롬프트 1개 → Seedance 2.5가 **30초 광고 전체를 한 번에** 생성
> 위에서부터 순서대로 따라 하면 돼요. 프롬프트는 **통째로 복사**하세요.
> ⚠️ Dreamina 화면은 자주 바뀌어요. 버튼 이름이 조금 달라도 기능이 같은 버튼을 찾으면 돼요.
> 이전 방식(3번 나눠 생성)은 `Dreamina_가이드_밀려온다.md`에 백업으로 남겨 뒀어요.

## 왜 이 방식인가

- **Seedance 2.5는 한 번에 최대 30초**까지 만들어요. 레퍼런스 영상도 합계 30초까지 넣을 수 있어요.
- Dreamina 공식 가이드에 **"흰 모델(3D) 영상"을 레퍼런스로 넣는 방법**이 있어요. 3D 영상은 **카메라 움직임·구도·동작·타이밍**만 정하고, 생김새는 사진 레퍼런스가 정해요.
- 그래서 3D 영상의 **컷 위치 = 최종 편집 컷 위치**예요. 생성된 영상을 거의 그대로 쓰고, Claude가 음악·목소리·자막·KV만 얹으면 돼요.

## 3D 레퍼런스 영상 = 최종 콘티 (29.5초)

파일: `reference_video/taki_wave_3d_reference.mp4` (720×1280, 24fps)

| 시간 | 장면 | 소리 (Claude가 편집에서) |
|---|---|---|
| 0~2초 | 우주: 초록 불덩이(안에 웅크린 택이)가 대기권으로 | 쉬이익 |
| 2~4.9초 | **정면**: 하늘 보고 얼어붙는 사람들, 초록빛이 얼굴에 | 🎵 차라투스트라 낮은 울림 + "어? 저게 뭐야?" |
| 4.9~9.4초 | **뒤에서**: 불덩이가 바로 앞바다에 착지(**7.8초**) → 물기둥 속 택이 실루엣 | 🎵 "빠–바–**밤!**" = 쿵! |
| 9.4~11.7초 | 정면: 솟아오르는 투명한 파도, 속에 TV·냉장고·세탁기·노트북 | 🎵 클라이맥스 |
| 11.7~13.5초 | **옆에서 본 쓰나미** | 🎵 |
| 13.5~16.8초 | 제품들이 사람들 바로 앞 모래에 쾅쾅 꽂힘 → 환호 | 쾅쾅 |
| 16.8~20.8초 | 마린시티보다 큰 **초거대 택이**가 우뚝 → **18.5초 윙크** + "거대한 혜택이 밀려온다" | 성우 |
| 20.8~29.5초 | 해운대 대각선 항공샷, **택이를 위에서 내려다봄** → 택이가 고개 들어 손 흔듦 → KV + "넾다세일!" | 🎵 정점 → 여운 |

**음악**: 「차라투스트라는 이렇게 말했다」 Kevin MacLeod 연주, **CC BY 3.0** (상업 이용 OK, 출처 표기 필수). 업로드 캡션에 아래 문구를 넣으세요.
`Music: "Also Sprach Zarathustra" Kevin MacLeod (incompetech.com) / Licensed under CC BY 3.0`

---

## 0. 준비물

- PC 크롬
- `reference_video/taki_wave_3d_reference.mp4` (3D 레퍼런스, 29.5초)
- `reference_images.zip` 압축 풀기 → 아래 9장만 써요 (적을수록 정확해요)

| 순서 | 파일 | 역할 |
|---|---|---|
| **@Video1** | `taki_wave_3d_reference.mp4` | 카메라·구도·동작·타이밍·컷 위치 |
| @Image1 | `taki/taki_01_white_render_sitting.jpg` | 택이 생김새 |
| @Image2 | `taki/taki_12_standing_fullbody_2026.jpg` | 택이 전신 |
| @Image3 | `taki/taki_13_pouch_eyes_2026.jpg` | 눈 달린 보라 파우치 |
| @Image4 | `taki/taki_14_wink_face_2026.jpg` | 윙크 표정 |
| @Image5 | `products/product_01_samsung_appliance_lineup_white.jpg` | 제품 모양 |
| @Image6 | `products/product_10_lg_oled_tv_livingroom.jpg` | TV |
| @Image7 | `products/product_02_samsung_fridge_frenchdoor_kitchen.jpg` | 냉장고 |
| @Image8 | `products/product_05_samsung_washer_black.jpg` | 세탁기 |
| @Image9 | `products/product_12_samsung_galaxybook6.jpg` | 노트북 |

## 1. 가입·결제 — ⚠️ 10월 9일까지

1. **https://dreamina.capcut.com** → **Sign in**
2. **Subscribe** → 플랜 → **Monthly** (연간은 할인 없음)
3. 결제 직후 **Subscription → Cancel auto-renew**
4. **영수증 캡처** (출품 증빙)

## 2. 크레딧

정확한 숫자는 **Generate 버튼 옆**에 나와요. 대략:

| | 30초 1번 |
|---|---|
| 480p 테스트 | 약 540 |
| 720p 최종 | 약 1,110 |
| 1080p 최종 (있으면) | 720p보다 비쌈 — 버튼 옆 숫자 확인 |

| 플랜 | 크레딧 | 이렇게 쓰기 |
|---|---|---|
| Basic ($1.50) | 1,575 | 480p 테스트 1번 + 720p 1번이면 **약 75 모자라요** → 테스트 없이 **720p 바로 1번** (남는 크레딧으로 480p 재시도 0~1번) |
| **Standard ($22)** ✅ | 3,885 | 480p 테스트 2번 + 720p 2번 (또는 1080p 1번) |

> 💡 480p → 720p는 **새로 뽑는 것**이라 결과가 달라져요. 480p는 "레퍼런스·프롬프트가 먹히는지" 확인용이에요. 결과에 **Upscale / HD** 버튼이 있으면 좋은 480p를 그대로 올리는 게 제일 싸요.

---

## 3. 생성하기

1. 왼쪽 메뉴 **AI Video** → 모델 **Seedance 2.5**
2. 모드: **Reference / Omni Reference / All-round reference** (영상·이미지를 여러 개 넣고 `@`로 부르는 모드)
3. 설정: 비율 **9:16** · 길이 **30초** · 해상도 **480p(테스트)** → **720p(최종)** · **Audio 켜기**
4. **레퍼런스 올리기**: 위 표 순서대로 — **영상 먼저**, 그다음 이미지 1~9
5. 아래 **프롬프트 A(전체)** 붙여넣기
   - 붙여넣은 `@Video1`, `@Image1`… 글자가 파란 칩으로 안 바뀌면, 그 글자를 지우고 **`@`를 직접 쳐서 목록에서 선택**하세요.
   - 글자 수 제한에 걸려 잘리면 **프롬프트 B(짧은 버전)**를 쓰세요.
6. **Generate 옆 크레딧 확인** → Generate (30초라 생성이 오래 걸릴 수 있어요)

### 프롬프트 A (전체)

```
Assets
@Video1: 3D clay blocking reference for the whole film. Follow its camera path, framing, timing, cut points and all character and object movement exactly. Do not copy its clay look, flat colors or simple shapes; render everything as photoreal live action.
@Image1, @Image2: Taki, a giant green mascot (identity only; ignore their backgrounds). Glossy green jelly body that narrows toward a small horn on top, big white cartoon eyes, a short line mouth, stubby legs, short thick arms.
@Image3: Taki's purple waist pouch with two cartoon eyes.
@Image4: Taki's wink expression.
@Image5 to @Image9: product designs only (TVs, refrigerators, washing machines, laptops). No brand logos.

Brief
A 30-second vertical commercial. Taki falls from space like a meteor into the sea right in front of beachgoers at Haeundae Beach, Busan, and a huge clear wave full of home appliances rolls onto the beach. A joyful spectacle, not a disaster. Photoreal live-action blockbuster look, anamorphic lens, natural afternoon light, light film grain. Hard cuts exactly where @Video1 cuts.

0–2s: Low Earth orbit over Korea. A neon-green fireball streaks into the atmosphere with Taki curled up inside the flames. The camera tracks it.
2–5s: Front low angle on Korean beachgoers, hotel towers behind. They look up past the camera, stunned; one points, one covers her mouth. Green light grows on their faces. A woman says in Korean, "어? 저게 뭐야?" We never see what they see.
5–9.5s: From behind the crowd. The giant green fireball drops toward the sea about 100 meters ahead and grows huge; people stagger back. At 8s it slams into the water: a tower of white-green water explodes upward, spray rains on the crowd, the camera shakes, and Taki's silhouette rises in the mist.
9.5–11.5s: From the beach, a skyscraper-tall clear turquoise wave rises where Taki landed, backlit by the sun, with TVs, refrigerators, washing machines and laptops floating inside it.
11.5–13.5s: Side angle along the shore. The wave's curling profile rolls past, products tumbling inside, spray blowing off the crest.
13.5–17s: Low angle behind the crowd, slow motion. The wave breaks into foam at the waterline; products fly out and slam into the sand just in front of the people with bursts of sand. Then the people cheer.
17–21s: Extreme low angle from the sand past the cheering crowd. Taki stands upright in the shallow sea, far taller than the distant skyscrapers, water streaming off its glossy body. It looks down, and at 18.5s gives a big playful wink like @Image4 while the eyes on its pouch blink. Then it waves.
21–30s: High drone shot over the sea, looking diagonally down along Haeundae Beach. The whole beach is covered with thousands of products and happy people. Taki stands in the sea below the camera, seen from above: the top of its round green head, the small horn, its shoulders and purple pouch. It turns, looks up at the camera and waves while the drone slowly rises and pulls back.

Continuity
Same beach, same afternoon sun and same crowd in every beach shot. Taki looks identical in every shot.

Constraints
The water reaches only the people's ankles; no one is hurt. No on-screen text, subtitles, signage, logos or watermarks.
```

### 프롬프트 B (짧은 버전 — 글자 수 제한에 걸릴 때)

```
@Video1 is a 3D clay blocking reference: follow its camera, framing, timing, cuts and movement exactly, but render everything as photoreal live action, not clay. Taki is the giant green mascot in @Image1 and @Image2, with the eyed purple waist pouch in @Image3 and the wink in @Image4. @Image5 to @Image9 are product designs only, no logos.
30-second vertical commercial at Haeundae Beach, Busan. Blockbuster look, anamorphic lens, afternoon sun, film grain. Joyful, not a disaster.
0–2s green fireball with Taki inside enters Earth's atmosphere. 2–5s front view: stunned beachgoers look up, green light on their faces. 5–9.5s from behind them: the fireball slams into the sea 100 m ahead at 8s, giant water explosion, Taki's silhouette in the mist. 9.5–11.5s a skyscraper-tall clear wave rises with TVs, fridges, washers and laptops inside. 11.5–13.5s side view of the curling wave. 13.5–17s slow motion: products slam into the sand in front of the people, then they cheer. 17–21s Taki stands in the sea, taller than skyscrapers, winks at 18.5s, then waves. 21–30s drone view over the sea seeing Taki from above, the whole beach covered with products; Taki looks up and waves as the drone rises.
No text, subtitles, logos or watermarks. No one is hurt.
```

---

## 4. 결과 체크

- [ ] **컷이 3D 레퍼런스와 같은 시간에 바뀌는가** (±0.3초는 Claude가 편집에서 맞춰요)
- [ ] 클레이·3D처럼 보이지 않고 **실사**인가
- [ ] 택이가 닮았는가 (연두 젤리, 뿔, 흰 눈, 일자 입, 눈 달린 보라 파우치)
- [ ] 7.8초 착지, 18.5초 윙크가 **잘 보이는가**
- [ ] 화면에 글자·자막·로고가 없는가
- [ ] 무섭지 않고 유쾌한가

**워터마크 없는 버전**으로 다운로드 → 이름을 `gen30.mp4`로 바꾸기

## 5. 문제 해결

| 문제 | 해결 |
|---|---|
| 결과가 **클레이·3D처럼** 나옴 | 프롬프트 맨 앞에 `Photoreal live-action footage. ` 추가. 그래도 그러면 Assets의 `@Video1` 줄에 `Use @Video1 for motion and camera only.`를 추가 |
| **뒤쪽(택이·항공샷) 품질이 떨어짐** / 컷이 섞임 | 15초씩 **2번 나눠** 생성: `reference_video/part1_0-16.8s.mp4`(0~16.8초) + `part2_16.8-29.5s.mp4`(16.8~29.5초). 프롬프트에서 해당 시간대만 남기고 시간을 0초부터 다시 매기기 (part2는 17s→0s, 21s→4s, 30s→13s) |
| 생성 거부 ("실제 인물" 제한) | 3D 영상엔 실제 얼굴이 없어요. 프롬프트의 2–5s 문단에서 `faces` 표현을 줄이고 `seen in profile`로 바꿔 보세요 |
| 택이가 안 닮음 | @Image1~4 연결 확인. 그래도 안 닮으면 Smart Edit / 부분 수정으로 택이만 수정 |
| 깨진 글자·로고 | 다시 뽑기. 작게 깨진 건 Claude가 편집에서 흐리게 처리할 수 있어요 |
| 크레딧 부족 | 480p 테스트 생략하고 720p 1번. 또는 Standard |

## 6. Claude에게 넘기기

1. `gen30.mp4` (나눠 만들었으면 `gen_part1.mp4`, `gen_part2.mp4`)
2. 구글 드라이브 → **링크가 있는 모든 사용자** 공유 → 링크를 채팅에 붙여넣기
3. Claude가 하는 일: 컷 타이밍 맞추기, 1080×1920 업스케일, 색보정·그레인, 흔들림, 음악·효과음·목소리, 자막, KV 엔드카드 → **최종 mp4**

## 7. 증빙 (출품서용)

- **3D 레퍼런스 → 생성 결과 비교** 캡처 (같은 장면 나란히) — AI 기술 활용도 설명에 제일 좋아요
- 프롬프트 + 레퍼런스 + 결과가 보이는 생성 화면 캡처
- 구독 영수증
