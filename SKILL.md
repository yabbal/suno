---
name: suno
description: CLI & SDK for Suno AI music generation
---

# Suno CLI Skill

CLI & SDK for Suno AI music generation.
All commands return JSON on stdout (default), with table and CSV support via `--format`.

Use when the user asks about Suno, music generation, AI music, generating songs, or the Suno API.
Triggers on: "suno", "music generation", "ai music", "generate song", "suno api".

## Prerequisites

- Install the CLI: `pnpm add -g @yabbal/suno-cli`
- Install the SDK: `pnpm add @yabbal/suno-sdk`
- Set your cookie: `export SUNO_COOKIE=your-cookie` or `suno auth login`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUNO_COOKIE` | Suno access token (from browser DevTools > Network > any `studio-api.prod.suno.com` request > Authorization header) |

## Available Commands

### Authentication
```bash
suno auth login                       # Interactive login (prompts for access token)
suno auth login --cookie TOKEN        # Non-interactive (CI/script)
suno auth logout                      # Logout
suno auth status                      # Auth status
```

### Songs
```bash
suno songs generate --prompt "a happy pop song"       # Generate from description
suno songs generate --prompt "chill lo-fi" --instrumental  # Instrumental only
suno songs custom --lyrics "..." --tags "pop, rock" --title "My Song"  # Custom lyrics + style
suno songs extend --id CLIP_ID --at 30                # Extend a song from timestamp
suno songs concat --id CLIP_ID                        # Concatenate segments into full song
suno songs list                                       # List songs from feed
suno songs list --page 2                              # Paginated list
suno songs get --id CLIP_ID                           # Get a single song
suno songs visibility --id SONG_ID --public true      # Set public/private
```

### Lyrics
```bash
suno lyrics generate --prompt "a love ballad"         # Generate lyrics from prompt
suno lyrics get --id LYRICS_ID                        # Get generated lyrics by ID
suno lyrics aligned --id SONG_ID                      # Get time-aligned lyrics
```

### Stems
```bash
suno stems create --id SONG_ID                        # Separate into vocals/instrumental
```

### Billing
```bash
suno billing info                                     # Check credit balance and usage
```

### Personas
```bash
suno personas get --id PERSONA_ID                     # Get a voice persona
```

### Tools
```bash
suno version                          # Version
suno completion --shell zsh           # Shell completion
```

## Output Formats

```bash
suno songs list --format json       # JSON (default)
suno songs list --format table      # Table
suno songs list --format csv        # CSV
```

## Typical Workflows

### Generate a song
```bash
suno auth login --cookie "$SUNO_COOKIE"
suno songs generate --prompt "upbeat electronic dance track"
```

### Check credits
```bash
suno billing info --format table
```

### Export stems (vocals/instrumental)
```bash
suno stems create --id SONG_ID
```

### Custom song with lyrics
```bash
suno lyrics generate --prompt "summer vibes"
suno songs custom --lyrics "$(suno lyrics get --id LID | jq -r '.text')" --tags "pop, summer" --title "Summer Days"
```

## jq Examples

```bash
suno songs list | jq '.clips[].title'
suno songs list | jq '.clips | length'
suno songs list | jq '[.clips[] | select(.title | contains("love"))]'
suno billing info | jq '.total_credits_left'
```
