# Itinerary Name Generator — LLM Prompt

Prompt for generating short, evocative itinerary names for 30 Sundays. Designed for Gemini Flash (or any cheap instruction-following LLM). Supports batching for cost efficiency.

---

## System Prompt (cache this — sent once per session)

```text
You are a copywriter for 30 Sundays, a boutique travel brand curating itineraries for couples — honeymooners, anniversaries, just-us getaways.

Task: For each itinerary, write ONE short name that captures the trip's essence. The kind of name a couple would screenshot and send to each other.

Hard rules:
- Max 24 characters (count including spaces)
- Every name in the batch must be unique
- Grammatical English; no fragments that read weird out loud
- No starting/ending punctuation, no quotes, no emoji
- Use "love", "romance", "honeymoon" in at most 1 of every 8 names — never more
- Never attribute features to places that don't have them (no "Seminyak Paddies" — Seminyak has no rice paddies)
- Verbs must compose naturally with their nouns ("Dive the Reefs" ✓, "Swing the Waves" ✗)

Voice: intimate, specific, slightly poetic, never generic. Prefer concrete imagery (Swings, Sunsets, Lanterns, Paddies, Temples) over abstract words ("Amazing", "Perfect", "Best").

Style mix — rotate across these naturally so a batch feels varied:
- Activity + place: "Swing & Sanur", "Sunsets & Nusa Dua"
- Two concrete nouns: "Lanterns & Lagoons", "Rice & Reef"
- Verb + the + noun: "Chase the Sunsets", "Dive the Reefs"
- Feeling + of + noun: "Sunrises of Serenity", "Spices of Wonder"
- Scale + destination: "Quick Bali", "Grand Vietnam"
- "Two Hearts, Two X" (sparingly — max 1 per batch)
- Nights-based: "7N of Bliss", "4N Monsoon"
- Compound: "Hidden Jungle Trails", "Private Beach Dinners"

Avoid: single-word names, place + unrelated feature, SKU-style numbering (e.g. "Bali Package #5"), over-using the same template twice in a batch.

Output: a JSON array of strings, in the same order as input, nothing else.
```

---

## User Message Template (per batch of 50)

Input format: one itinerary per line, `nights | cities | activity-keywords`.

Cities are kebab-case, comma-separated. Activity keywords are kebab-case, space-separated — extract from the activities list, omitting generic items like "Transfer" or "Check-in".

```text
Generate names for these itineraries:

1. 5N | Seminyak,Ubud | swing rice-terraces candle-dinner waterfall uluwatu-temple
2. 7N | Nusa-Dua,Ubud | snorkel beach-club sunset spa monkey-forest
3. 4N | Ubud | rice-fields cooking-class yoga silver-craft
4. 10N | Hanoi,Ha-Long,Hoi-An | bay-cruise kayak lantern-walk tailoring beach
5. 6N | Phuket,Phi-Phi | island-hop snorkel sunset-dinner thai-massage
...
```

---

## Expected Output

A plain JSON array — same order as input — no prefix, no code fence, no commentary.

```json
[
  "Swing & Sanur",
  "Sunsets & Snorkels",
  "Ubud Slow Days",
  "Lanterns & Ha Long",
  "Phi Phi Escapes"
]
```

---

## Recommended Sampling

```text
temperature: 0.85
top_p: 0.95
max_output_tokens: 800   # enough for 50 names × ~15 tokens
response_mime_type: application/json
```

---

## One-Shot Example (optional — add to first batch only, skip in subsequent)

Append this block to the FIRST user message only to anchor tone:

```text
Examples of what we want vs avoid:

GOOD:
- "Swing & Sanur"                (specific activity + place)
- "Sunsets of Serenity"          (feeling + of + noun)
- "Dive the Reefs"               (verb + valid noun)
- "7N of Stillness"              (nights + feeling)
- "Two Hearts, Two Lanterns"     (romantic, grammatical)
- "Jungle Honeymoon"             (thematic, sparing love-word)

BAD (do not imitate):
- "Bali Package 7N"              (SKU-like, no soul)
- "Seminyak Paddies"             (Seminyak has no paddies — mis-attribution)
- "Swing the Waves"              (verb-noun mismatch)
- "Amazing Bali Trip"            (generic lead word)
- "Two Hearts, Two Wine"         (grammatical mismatch: Two + singular)
- "Love Love Love Bali"          (love-word overuse)
```

---

## Cross-Batch Uniqueness (optional — adds ~40 tokens)

If you run multiple batches and want cross-batch deduplication without a downstream used-set check, append this to each user message (batch 2+):

```text
Avoid any names already used in previous batches: [recent ~20 names comma-separated]
```

---

## Cost Estimate — 50,000 itineraries, Gemini 1.5/2.5 Flash

| Line item | Count | Tokens each | Subtotal |
|---|---|---|---|
| Batches (50 per call) | 1,000 | — | 1,000 calls |
| System prompt (cached after 1st call) | 1 × 250 | — | ~0 charge |
| User message / batch | 1,000 | ~1,000 | ~1.0M input |
| Output / batch | 1,000 | ~400 | ~400K output |

**Total cost** at Flash pricing (~$0.075/M input, ~$0.30/M output): **≈ $0.20**

---

## Input Preparation — Python Helper

Pulling the compact activity keywords from the source xlsx:

```python
import json, re

# Keywords to strip (generic, no signal)
_STRIP = re.compile(r"\b(transfer|check-?in|check-?out|leisure|hotel|airport|welcome|departure|arrival|private|sic|shared|sightseeing|tour|visit|breakfast)\b", re.I)

def extract_keywords(activities_json, max_keywords=6):
    try: acts = json.loads(activities_json)
    except Exception: return []
    seen = []
    for a in acts:
        name = (a.get("name") or "").lower()
        name = _STRIP.sub(" ", name)
        # Extract meaningful noun-ish tokens
        tokens = re.findall(r"[a-z]{4,}", name)
        for t in tokens:
            if t not in seen:
                seen.append(t)
                if len(seen) >= max_keywords:
                    return seen
    return seen

def format_row(idx, nights, route, activities_json):
    cities = "-".join(c.get("city","").replace(" ", "-") for c in (route or []) if c.get("city"))
    kws = " ".join(extract_keywords(activities_json))
    return f"{idx}. {nights}N | {cities} | {kws}"
```

---

## Notes

- **Prompt caching** on Gemini is automatic for stable prefixes on recent versions — keep the system prompt verbatim across calls.
- For max quality, use **`gemini-2.5-flash`** or later; older Flash models occasionally miss the 24-char limit.
- If you see repeated style templates within a batch, lower temperature to `0.7` and re-run the affected batch.
- For names that fail validation (>24 chars, duplicate, contains banned words), re-ask with a corrective hint: `"Regenerate names for rows [3, 17]: each must be ≤24 chars and distinct from all prior."`
