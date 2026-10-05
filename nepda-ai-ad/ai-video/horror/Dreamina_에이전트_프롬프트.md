# 「그것이 찾아온다」 — Dreamina AI 에이전트용 프롬프트

## 0. 첨부할 이미지 (12장)

에이전트 입력창에 아래 순서대로 올려. 브리프에서 이 번호(Image 1~11)로 부름.

| 번호 | 파일 | 용도 |
|---|---|---|
| Image 1 | `sheets/S1_taki.png` | 택이 캐릭터 시트 |
| Image 2 | `sheets/S2_room.png` | 원룸 공간 시트 |
| Image 3 | `sheets/S3_hero.png` | 주인공 시트 |
| Image 4 | `keyframes/K1_bed.png` | 컷1 첫 프레임 |
| Image 5 | `keyframes/K2_doorlock.png` | 컷2 첫 프레임 |
| Image 6 | `keyframes/K3_freeze.png` | 컷3 첫 프레임 |
| Image 7 | `keyframes/K4_silhouette.png` | 컷4 첫 프레임 |
| Image 8 | `keyframes/K5_shadow.png` | 컷5 첫 프레임 |
| Image 9 | `keyframes/K6_duvet.png` | 컷6 첫 프레임 |
| Image 10 | `keyframes/K7_jumpscare.png` | 컷7 첫 프레임 |
| Image 11 | `keyframes/K8_reveal.png` | 컷8 첫 프레임 |

KV 배너는 올리지 마. 엔드카드는 편집에서 원본 KV를 그대로 얹을 거야 (KV 변형 금지 규정).

---

## 1. 메인 브리프 (한 번에 복붙)

```
You are directing a 20-second vertical (9:16) horror-parody commercial for a Korean shopping festival called "Nepda Sale". The title is "It's coming" (그것이 찾아온다). The joke: it is shot exactly like a horror movie, but the "monster" breaking into a girl's apartment turns out to be Taki, the cute green mascot, delivering a mountain of sale gifts.

REFERENCES (attached, use them strictly):
- Image 1 = Taki character sheet. Taki: glossy green soft-vinyl blob mascot, pear-shaped body, ONE small pointed horn on top, two big round white eyes with black pupils, small stubby arms, short thick legs, purple fanny pack worn on the belly that has its own two cartoon eyes. His design must never change.
- Image 2 = the Korean studio apartment (bed, desk, short hallway to a beige front door with a black digital door lock). Keep this exact layout in every shot.
- Image 3 = the heroine: Korean woman, mid-20s, shoulder-length black hair, oversized light-gray hoodie. Same face and outfit in every shot.
- Images 4–11 = the first frame of shots 1–8. Each shot MUST start exactly on its image.

HOW TO MAKE IT:
- Generate each shot as a separate image-to-video clip, using its image as the first frame. Do not merge shots into one long generation.
- 9:16, 1080p (or 720p), 24fps feel. Hard cuts between shots.
- Shots 1–7: photoreal cinematic horror look, 35mm, cold blue moonlight, deep blacks, film grain, slow tense camera.
- Shot 8: bright, warm, festive commercial look.
- One camera move and one main action per shot. Keep it simple.
- No on-screen text, no subtitles, no logos, no watermarks. No background music (I will add sound design myself). Natural sound effects are fine.

SHOT LIST:
1. (Image 4, 4s) Night. The girl lies in bed scrolling her phone, its light on her face. Static camera, very slow push-in. Quiet room tone.
2. (Image 5, 5s) Extreme close-up of the digital door lock. Someone outside types the password: keypad digits light up blue one by one with a beep each, beep, beep, beep, beep, then the lock plays its unlocking melody and the handle slowly turns down by itself. Locked-off camera.
3. (Image 6, 4s) She freezes, holding her breath, eyes widening as she stares toward the dark hallway; the phone trembles in her hand. Very slow push-in on her face. A single heartbeat.
4. (Image 7, 5s) From the bed looking down the hallway: the front door is open, bright light behind, and a HUGE round black silhouette with a single horn on top fills the doorway. Haze swirls. It takes one slow heavy step inside; the light flickers once. It stays a pure silhouette, face never visible. Deep thud.
5. (Image 8, 5s) Low angle on the floor: the giant round shadow with a horn slides across the floorboards toward the camera and creeps up the side of the bed. Static camera. Slow heavy footsteps, creaking floor.
6. (Image 9, 4s) She is hidden under the white duvet, trembling, phone glow through the fabric. Heavy footsteps stop right beside the bed. Total silence. Static camera.
7. (Image 10, 4s) JUMP SCARE: the duvet is yanked away and Taki lunges at the camera, his face filling the frame, eyes wide. Violent handheld shake and motion blur for one second, then he freezes and blinks twice, curious. Horror sting, a short scream.
8. (Image 11, 6s) All lights snap on. The room is full of gift boxes and delivery parcels, confetti falling. Taki gives a big wink with a smile and a happy little bounce, holding a stack of gift boxes out to the girl; she bursts out laughing and claps. Camera slowly pushes in. Party popper, laughter.

Please show me each shot clip separately so I can pick or regenerate them, then assemble them in order as a rough cut.
```

---

## 2. 수정 요청용 짧은 프롬프트

에이전트가 결과를 보여주면 상황에 맞게 골라서 보내.

**택이 모양이 바뀌었을 때**
```
Shot [N]: Taki's design drifted. Regenerate it matching Image 1 exactly — one horn on top, big round white eyes, glossy green body, purple fanny pack with two cartoon eyes. Same first frame.
```

**주인공 얼굴/옷이 바뀌었을 때**
```
Shot [N]: the girl's face/outfit changed. Regenerate matching Image 3 exactly (shoulder-length black hair, oversized light-gray hoodie). Same first frame.
```

**실루엣에서 택이 얼굴이 보일 때 (컷4·5)**
```
Shot [N]: the creature must stay a pure black silhouette/shadow — no face, no green color visible. Regenerate.
```

**너무 밋밋할 때**
```
Shot [N] feels static. Keep the same first frame but make the main action clearer and stronger: [원하는 동작]. Still one camera move only.
```

**점프스케어가 약할 때 (컷7)**
```
Shot 7: make the jump scare much more sudden — the duvet is ripped away in the first 0.3 seconds and Taki slams toward the lens with heavy motion blur and camera shake, then stops dead and blinks.
```

**음악이 들어갔을 때**
```
Shot [N] has background music. Regenerate with only natural sound effects, no music.
```

**글자/로고가 생겼을 때**
```
Shot [N] has text or a logo in the frame. Regenerate with no text, no signs, no logos.
```

---

## 3. 에이전트 결과 받은 다음

- 컷별 클립을 **각각 다운로드**해서 `horror/clips/`에 같은 이름(C1_bed.mp4 … C8_reveal.mp4)으로 넣어줘. 그러면 바로 편집 엔진(`node comes/edit.mjs --project horror`)으로 사운드·자막·KV 엔드카드를 다시 입힐 수 있어.
- 에이전트가 만든 러프컷은 참고용. 최종본은 KV를 원본 그대로 쓰기 위해 우리 편집으로 마무리.
- 에이전트 화면 캡처(브리프, 생성 결과, 재생성 기록)는 **제작과정 증빙**으로 저장해둬.
