import json, subprocess, sys, os

os.environ["PATH"] = os.path.expanduser("~/.local/bin") + ":" + os.environ["PATH"]
HERE = os.path.dirname(os.path.abspath(__file__))
UP = dict(l.strip().split("\t") for l in open(f"{HERE}/uploads.tsv"))

STYLE = " Photorealistic cinematic horror film look, 35mm, film grain. Keep every face, object and the room exactly as in the first frame. No text, no subtitles, no music."
TAKI = " Taki is the green mascot: glossy green soft-vinyl body, one small horn on top, two big round white eyes with black pupils, purple fanny pack with two cartoon eyes; keep his design identical to the first frame."

SHOTS = [
    ("C1_bed", "K1_bed", 5,
     "Static camera with a very slow push-in. The young woman lies in bed scrolling her phone, blinks, a tiny bored sigh. The dark apartment is perfectly still. Sound: quiet room tone, faint distant city traffic, soft taps on the phone screen."),
    ("C2_doorlock", "K2_doorlock", 5,
     "Locked-off extreme close-up. Someone outside is entering the password: the keypad digits light up blue one at a time with a beep for each, beep, beep, beep, beep, then the digital door lock plays its short unlocking melody and the black handle slowly turns down by itself. Sound: Korean digital door lock beeps and unlock jingle, otherwise dead silence."),
    ("C3_freeze", "K3_freeze", 4,
     "She freezes, holding her breath, eyes slowly widening as she stares toward the dark hallway; the phone trembles slightly in her hand. Very slow push-in on her face. Sound: a single slow heartbeat, tense silence."),
    ("C4_silhouette", "K4_silhouette", 5,
     "Locked-off camera. The huge round silhouette with a single horn stands in the bright open doorway as haze swirls around it, then takes one slow heavy step inside; the hallway light flickers once. It stays a pure black silhouette, its face is never visible. Sound: door creak, one deep heavy thud footstep that rattles things."),
    ("C5_shadow", "K5_shadow", 5,
     "Static low camera. The giant round shadow with a horn on top slides slowly across the floorboards toward the camera and creeps up the side of the bed. Nothing else moves. Sound: slow heavy footsteps, floorboards creaking."),
    ("C6_duvet", "K6_duvet", 4,
     "Static camera. The lump under the duvet trembles; the phone glow under the fabric shivers. Then complete stillness as heavy footsteps stop right beside the bed. Sound: muffled shaky breathing, then two heavy footsteps, then silence."),
    ("C7_jumpscare", "K7_jumpscare", 4,
     "Jump scare. The duvet is yanked away and Taki lunges at the camera, his face filling the frame, eyes wide; violent handheld shake and motion blur for one second, then Taki freezes and blinks twice, curious." + TAKI + " Sound: loud horror sting, a woman's short scream."),
    ("C8_reveal", "K8_reveal", 6,
     "All lights on, bright and festive. Taki gives a big wink and does a happy little bounce, holding the stack of gift boxes out toward the woman; confetti and ribbons keep falling; the woman bursts into laughter and claps. Camera slowly pushes in." + TAKI + " Sound: party popper, cheerful laughter."),
]


def run(args):
    r = subprocess.run(["dreamina-canvas", *args, "--format", "json", "--non-interactive"], capture_output=True, text=True)
    try:
        return json.loads(r.stdout)
    except Exception:
        print(r.stdout, r.stderr, file=sys.stderr)
        raise


if __name__ == "__main__":
    res = sys.argv[1] if len(sys.argv) > 1 else "720p"
    nodes = {}
    for name, key, dur, prompt in SHOTS:
        d = run(["node", "create", "video", "--model", "seedance_2.5", "--mode", "first_last_frame",
                 "--ratio", "9:16", "--resolution", res, "--duration", str(dur),
                 "--ref", f"res:{UP[key]}", "--title", name,
                 "--prompt", prompt + STYLE])
        nid = d["data"].get("nodeId") or d["data"].get("node", {}).get("nodeId") if d.get("ok") else None
        print(name, nid or d)
        nodes[name] = nid
    json.dump(nodes, open(f"{HERE}/nodes.json", "w"), indent=1)
