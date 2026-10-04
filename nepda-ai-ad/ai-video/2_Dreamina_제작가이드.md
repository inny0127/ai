# A안 「얼마나 크냐면」 — Dreamina(Seedance 2.5) 제작 가이드

> **할 일**: Dreamina에서 7개 컷 생성 → 컷마다 베스트 1개 → 구글 드라이브 링크 전달
> **나머지**(자르기·엔드카드·음악·효과음·최종 mp4)는 Claude가 `edit.mjs`로 처리

---

## 0. 가입·결제 (5분) — ⚠️ **10월 9일까지**

1. **https://dreamina.capcut.com** → 로그인 (CapCut·Google·TikTok 계정)
2. 요금제(Subscribe) → **Basic 월간 구독** → 첫 달 **90% 할인 $1.50**
   - 한국도 할인 대상 국가예요. 월간(Monthly) 구독이어야 할인돼요. 연간은 아니에요.
   - 크레딧 **1,575개**, 유료 플랜이라 **워터마크 없이** 다운로드돼요.
3. **결제 직후 할 일**: 구독 관리 → **자동 갱신 해지**. 안 하면 다음 달부터 $15가 나가요. 해지해도 이번 달 크레딧은 그대로 써요.
4. 결제 영수증을 캡처해 두세요. 유료 플랜 사용 증빙(상업 이용)으로 출품서에 쓸 수 있어요.

## 1. 크레딧 계산 — 첫 컷 뽑고 꼭 확인

- 공식 안내로는 Basic 1,575 크레딧이면 **10초 영상 약 19개**(약 190초)예요. 다른 자료에는 720p가 더 비싸다는 말도 있어요.
- 그래서 **컷 1을 하나 뽑은 뒤 줄어든 크레딧을 보고** 계획을 정해요.
  - 4초짜리 하나에 **35 크레딧 이하** → 계획대로 컷마다 2~3번 뽑아도 충분해요.
  - **그보다 많이** 들면 → 사람 컷은 1~2번만 뽑고, 모자라는 컷은 Flow(Veo, AI Pro 크레딧)로 채워요. 프롬프트는 `1_Flow_제작가이드.md`에 그대로 있어요.
- 필요한 양: 사람 6컷 × 4초 × 2~3번 + 택이 6초 × 3~4번 = **약 70~100초**

## 2. 화면 설정

| 항목 | 값 |
|---|---|
| 메뉴 | **AI Video** (영상 생성) |
| 모델 | **Seedance 2.5** |
| 모드 | 컷 0~5: **Text to Video** / 컷 6: **Omni Reference** (참고 이미지) |
| 비율 | **9:16** |
| 해상도 | **720p** |
| 길이 | 컷 0~5: **4초** / 컷 6: **6초** |
| 소리 | **켜기** (대사·현장음이 같이 나와요) |

## 3. 제일 먼저: 컷 1 테스트
- **한국어 대사**가 정확한지(다른 말을 덧붙이면 탈락), 입모양, 화면에 글자가 없는지 확인해요.
- 두 번 뽑아도 한국어가 이상하면 알려주세요. 사람 컷은 Veo(Flow)로 돌리고, 택이 컷만 Seedance로 가요. 택이처럼 참고 이미지를 따라 그리는 건 Seedance가 강해요.

---

## 4. 프롬프트 (그대로 복사)

Veo용 프롬프트를 Seedance에 맞게 다듬었어요. 대사는 한국어 그대로 따옴표 안에 있어요.

### 컷 0 — 대학생 "요만큼?"
설정: **텍스트로 영상**, 9:16, 720p, **4초**
```
Medium close-up, eye-level handheld shot. A Korean male university student in his early 20s with round glasses and a gray hoodie stands on a busy university street in Seoul. A hand holding a small green microphone reaches in from the right edge of the frame toward him; the interviewer is never shown, only the hand. He squints thoughtfully, raises one hand and pinches his thumb and index finger almost together to show something tiny, then says in Korean, slightly unsure, drawing out the first syllable: "요만큼?" Background sound: students chatting, distant traffic. No background music. Shot vertically on a smartphone, handheld, natural daylight, realistic Korean street interview vlog style, candid and authentic, natural skin texture. The person speaks Korean clearly with accurate lip sync. The screen contains no subtitles, no captions, no text, no logos.
```
### 컷 1 — 시장 아주머니 "이만큼!" ← **테스트용**
설정: **텍스트로 영상**, 9:16, 720p, **4초**
```
Medium shot, handheld. A cheerful Korean woman in her 50s wearing a floral apron and arm sleeves stands in front of her fruit stall at a traditional Korean market, piles of orange persimmons and red apples behind her. A hand holding a small green microphone reaches in from the right edge of the frame toward her; the interviewer is never shown, only the hand. She laughs, spreads both hands about shoulder-width apart and says loudly in Korean, stretching the first syllable: "이만큼!" Background sound: lively market chatter, vendors calling out. No background music. Shot vertically on a smartphone, handheld, natural daylight, realistic Korean street interview vlog style, candid and authentic, natural skin texture. The person speaks Korean clearly with accurate lip sync. The screen contains no subtitles, no captions, no text, no logos.
```
### 컷 2 — 근육남 "이이이만큼!!"
설정: **텍스트로 영상**, 9:16, 720p, **4초**
```
Medium-wide shot, slight low angle, handheld. A very muscular Korean man in his 30s wearing a tight black tank top stands in front of a gym entrance on a city sidewalk. A hand holding a small green microphone reaches in from the right edge of the frame toward him; the interviewer is never shown, only the hand. He spreads both arms as wide as he possibly can, flexes his biceps proudly, and shouts in Korean with huge enthusiasm, stretching the first syllable for a long time: "이이이만큼!!" Sound effect: a small whoosh as his arms open. Background sound: city street. No background music. Shot vertically on a smartphone, handheld, natural daylight, realistic Korean street interview vlog style, candid and authentic, natural skin texture. The person speaks Korean clearly with accurate lip sync. The screen contains no subtitles, no captions, no text, no logos.
```
### 컷 3 — 택배기사 "이 트럭만큼."
설정: **텍스트로 영상**, 9:16, 720p, **4초**
```
Medium shot, handheld. A Korean delivery driver in his 40s wearing a plain navy uniform and cap stands in front of his small white delivery truck parked on a residential street; the truck is completely plain with no logos or text. A hand holding a small green microphone reaches in from the right edge of the frame toward him; the interviewer is never shown, only the hand. He turns slightly, points back at the truck with his thumb, and says calmly and confidently in Korean: "이 트럭만큼." Background sound: quiet neighborhood, a scooter passing by. No background music. Shot vertically on a smartphone, handheld, natural daylight, realistic Korean street interview vlog style, candid and authentic, natural skin texture. The person speaks Korean clearly with accurate lip sync. The screen contains no subtitles, no captions, no text, no logos.
```
### 컷 4 — 할머니 "저 아파트만큼은 되겄지."
설정: **텍스트로 영상**, 9:16, 720p, **4초**
```
Medium shot, handheld. A friendly Korean grandmother in her 70s with short permed gray hair, wearing a purple quilted vest, stands in a Korean apartment complex courtyard with tall apartment buildings behind her. A hand holding a small green microphone reaches in from the right edge of the frame toward her; the interviewer is never shown, only the hand. She slowly raises her arm and points up at the tall apartment building behind her, then says warmly in a folksy Korean countryside accent: "저 아파트만큼은 되겄지." Background sound: birds, children playing in the distance. No background music. Shot vertically on a smartphone, handheld, natural daylight, realistic Korean street interview vlog style, candid and authentic, natural skin texture. The person speaks Korean clearly with accurate lip sync. The screen contains no subtitles, no captions, no text, no logos.
```
### 컷 5 — 초등학생 "우주만큼!!!"
설정: **텍스트로 영상**, 9:16, 720p, **4초**
```
Medium-wide shot, low angle looking slightly up, handheld. An energetic Korean boy about 9 years old wearing a yellow backpack stands in a sunny playground. A hand holding a small green microphone is lowered toward him from the right edge of the frame; the interviewer is never shown, only the hand. He jumps up high, throws both arms toward the sky and shouts in Korean at the top of his lungs: "우주만큼!!!" The camera then tilts up quickly to follow his arms into the bright blue sky. Background sound: playground sounds. No background music. Shot vertically on a smartphone, handheld, natural daylight, realistic Korean street interview vlog style, candid and authentic, natural skin texture. The person speaks Korean clearly with accurate lip sync. The screen contains no subtitles, no captions, no text, no logos.
```

### 컷 6 — 하늘을 채우는 거대한 택이
설정: **Omni Reference**, 9:16, 720p, **6초**
1. 참고 이미지 2장 업로드: `taki_front.png` → **@Image1**, `taki_full.png` → **@Image2**
2. 아래 프롬프트 붙여넣기. 프롬프트 안의 `@Image1`, `@Image2`가 업로드한 이미지와 연결돼야 해요. 자동 연결이 안 되면 그 자리에서 @를 눌러 직접 선택하세요.
```
Extreme wide low-angle shot looking up from a sunny Korean apartment complex playground, vertical framing. Behind the tall white apartment buildings, a gigantic glossy green character, exactly the character shown in @Image1 and @Image2 (a round, soft, jelly-like green body with a small horn on top, big white cartoon eyes, short stubby arms, and a purple waist pouch that has its own pair of cartoon eyes), slowly rises above the rooftops like a sunrise. It is so enormous that it fills half of the sky, far taller than the buildings. Its huge eyes look down at the camera and it gives a playful wink. Birds fly past; a few tiny people on the ground stop and look up. The character keeps exactly the same design, colors and proportions as the reference, rendered as glossy 3D like the reference. Sound effect: a deep rumble as it rises, then a cute giant "boing" when it winks. No background music. Photorealistic city, cinematic, natural daylight. The screen contains no subtitles, no text, no logos.
```
- 택이의 뿔, 파우치의 눈, 색이 조금 틀리면 다시 뽑지 말고 **Smart Edit**(부분 수정)으로 그 부분만 고치세요. 크레딧이 덜 들어요.

---

## 5. 고르는 기준
1. 대사가 **정확히** 들리는가
2. **손짓만으로 크기가 읽히는가** (자막이 없어요) — 손가락 6개, 녹아내리는 손은 탈락
3. 화면에 **글자·자막·로고**가 없는가
4. 얼굴이 번들거리지 않고 진짜 같은가
5. (컷 6) 택이가 공식 택이와 닮았는가

## 6. Claude에게 넘기기
1. 베스트를 다운로드(워터마크 없음) → `shot0.mp4` ~ `shot6.mp4`로 이름 바꾸기
2. 구글 드라이브 폴더에 올리기 → **링크가 있는 모든 사용자** → 링크를 채팅에 붙여넣기
3. **증빙**: 컷마다 Dreamina 화면(프롬프트 + 결과) 캡처 1장, 구독 영수증 1장

---

## ★ 7. 프리비즈 방식 (3D 참고 영상 → AI가 실사로 덧그리기)

Claude가 만든 러프 3D 영상(`previs/ref_videos/shotN_*.mp4`)을 **Omni Reference에 @Video1로 올리면**, Seedance가 그 카메라 무빙·구도·인물 위치·손짓·타이밍을 따라가면서 실사로 다시 그려요.
글로만 시킬 때보다 **손 크기가 점점 커지는 흐름, 마지막 틸트업, 택이가 떠오르는 속도**가 훨씬 정확하게 나와요.

| 컷 | 참고 영상 | 길이 |
|---|---|---|
| 0 | `shot0_student.mp4` | 4초 |
| 1 | `shot1_market.mp4` | 4초 |
| 2 | `shot2_gym.mp4` | 4초 |
| 3 | `shot3_truck.mp4` | 4초 |
| 4 | `shot4_apartment.mp4` | 4초 |
| 5 | `shot5_playground.mp4` | 4초 |
| 6 | `shot6_taki.mp4` + 택이 이미지 2장 | 6초 |

**방법**
1. 모드를 **Omni Reference**로 바꾸고 참고 영상 업로드 → **@Video1** (컷 6은 택이 이미지도 같이 → @Image1, @Image2)
2. 9:16, 720p, 길이는 위 표대로
3. 프롬프트 = **아래 머리말 + 4장의 그 컷 프롬프트**를 이어 붙이기

**머리말 (컷 0~6 공통, 맨 앞에 붙이기)**
```
@Video1 is only a rough 3D blocking animation. Follow its camera angle, camera movement, framing, the person's position, body pose, arm gestures and timing exactly. Do not copy its gray mannequin look, simple shapes or flat colors: render everything as a real, photorealistic scene with real people, real skin, real clothing and real locations.
```

**주의**
- 참고 영상을 넣으면 크레딧이 더 들 수 있어요. 참고 영상 길이도 계산에 들어가는 경우가 있어서요. 첫 컷을 뽑고 크레딧이 얼마나 줄었는지 꼭 보세요.
- 결과가 마네킹처럼 3D 느낌으로 나오면 머리말 끝에 `Ignore the reference's visual style completely.`를 추가하세요.
- 동작이 참고 영상과 어긋나도 손짓만 크게 잘 나오면 괜찮아요. 편집에서 2.5초만 써요.
