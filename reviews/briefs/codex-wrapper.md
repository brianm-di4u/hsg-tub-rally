# Running Critic B (Codex)

Delegate through the `codex:codex-rescue` subagent (the Codex companion), from the repository root
`C:\Video Game Projects`. The Codex Windows sandbox can't read under `C:\Users\brian\`, so every input lives under the
game folder `games/Cart Racing/`.

- **Effort:** `--effort medium` for routine loops; `--effort high` for loop 0 and for the final loop.
- **Mode:** read-only. Codex must not write files. Its final message is the review.
- **Prompt passed to Codex** (verbatim, with N filled in):

> You are Critic B in an adversarial visual review. Read and follow `games/Cart Racing/reviews/loop-N/brief.md`
> exactly, with role `critic-codex`. Open the PNG files it lists and look at them (they are images: view them, don't
> parse them as text). Compare against the images listed in `games/Cart Racing/benchmarks/README.md`. Do not read
> `games/Cart Racing/reviews/HISTORY.md`, `games/Cart Racing/reviews/history.json`, any `ab-key.json`, any other
> `reviews/loop-*` folder, or any `critic-*.md`, `prosecutor.md`, `advocate.md` or `judge.md` file. Do not modify
> files. Return the full review as your final message, ending with the fenced json block the brief asks for.

- **If Codex can't view images:** it says so, and the run is repeated with the contact sheets attached as image
  inputs. Never let Codex score from file names or metadata. A review that admits it couldn't see the images is
  discarded.
