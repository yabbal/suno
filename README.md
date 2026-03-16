# Suno CLI & SDK

> Unofficial CLI & SDK for [Suno](https://suno.com) — AI music generation

**Not affiliated with Suno, Inc.**

[![CI](https://github.com/yabbal/suno/actions/workflows/ci.yml/badge.svg)](https://github.com/yabbal/suno/actions/workflows/ci.yml)
[![npm suno-sdk](https://img.shields.io/npm/v/suno-sdk)](https://www.npmjs.com/package/suno-sdk)
[![npm suno-cli](https://img.shields.io/npm/v/suno-cli)](https://www.npmjs.com/package/suno-cli)

## Features

- **Songs** — generate, extend, concatenate, and manage AI-generated songs
- **Lyrics** — generate lyrics from prompts, retrieve time-aligned lyrics
- **Billing** — check credits and subscription status
- **Stems** — split songs into individual stems (vocals, drums, bass, etc.)
- **Personas** — manage Suno personas
- **Multi-format** — JSON (default), table or CSV via `--format`
- **TypeScript SDK** — typed client with zero runtime dependencies
- **AI Skill** — compatible with Claude Code and AI agents
- **Retry** — exponential backoff on 429/5xx errors
- **Shell completion** — zsh, bash, fish

## Installation

```bash
# CLI
npm install -g suno-cli

# Homebrew
brew tap yabbal/tap && brew install suno

# SDK
npm install suno-sdk
```

## Authentication

Suno has no public API. Authentication uses an **access token** extracted from your browser session.

**How to get your token:**

1. Open [suno.com](https://suno.com) in your browser (logged in)
2. Open DevTools (F12) → **Network** tab
3. Find any request to `studio-api.prod.suno.com`
4. Copy the `Authorization` header value (the JWT after `Bearer `)

```bash
# Interactive login (guides you through the steps)
suno auth login

# Or set the token directly
export SUNO_COOKIE="eyJhbG..."
```

## Quick Start

```bash
# Generate a song
suno songs generate --prompt "A chill lo-fi beat about rainy days"

# Custom song with lyrics and tags
suno songs custom --lyrics "Walking through the rain..." --tags "pop, chill" --title "Rainy Walk"

# List your songs
suno songs list --format table

# Get a specific song
suno songs get --id <song-id>

# Extend a song
suno songs extend --id <song-id> --at 120

# Generate lyrics
suno lyrics generate --prompt "A love song about the ocean"

# Check credits
suno billing info

# Create stems from a song
suno stems create --id <song-id>
```

## TypeScript SDK

```bash
npm install suno-sdk
```

```typescript
import { SunoClient } from "suno-sdk";

const client = new SunoClient({ cookie: process.env.SUNO_COOKIE });

// Generate a song
const songs = await client.songs.generate({ prompt: "A jazz song about coding" });

// List songs
const mySongs = await client.songs.list();

// Generate lyrics
const lyrics = await client.lyrics.generate({ prompt: "A ballad about the sea" });

// Check billing
const billing = await client.billing.info();
```

## AI Skill

```bash
npx skills add yabbal/suno
```

## Documentation

**[yabbal.github.io/suno](https://yabbal.github.io/suno)**

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm dev
```

## License

MIT
