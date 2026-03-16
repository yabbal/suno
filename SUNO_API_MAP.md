# Suno API Map

> Reverse-engineered from https://suno.com — unofficial, no public API exists.

## Base URL

```
https://studio-api.prod.suno.com
```

## Authentication

Suno uses **Clerk-based authentication** with JWTs issued by `https://auth.suno.com`.

There are two types of tokens:
- **Access token** (`token_type: "access"`) — short-lived, used for API requests
- **Refresh token** (`token_type: "refresh"`) — long-lived, used to obtain new access tokens

**How to get an access token:**

1. Open [suno.com](https://suno.com) in your browser (logged in)
2. Open DevTools (F12) → **Network** tab
3. Find any request to `studio-api.prod.suno.com`
4. Copy the `Authorization` header value (the JWT after `Bearer `)

The access token is then used as `Authorization: Bearer {token}` on all API requests.

**Required headers:**

```
Authorization: Bearer {jwt}
Content-Type: application/json
```

## Endpoints

### Songs / Generation

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/generate/v2/` | Generate songs (returns 2 clips) |
| `POST` | `/api/generate/concat/v2/` | Concatenate segments into a full song |
| `GET` | `/api/feed/v2` | List songs (paginated feed) |
| `GET` | `/api/clip/{clipId}` | Get a single clip by ID |
| `POST` | `/api/gen/{songId}/set_visibility/` | Set song visibility (public/private) |

#### POST /api/generate/v2/

**Request body (description mode):**

```json
{
  "gpt_description_prompt": "a chill lo-fi beat about rainy days",
  "make_instrumental": false,
  "mv": "chirp-v4",
  "generation_type": "TEXT"
}
```

**Request body (custom mode):**

```json
{
  "prompt": "[Verse]\nLyrics here...",
  "tags": "pop, electronic",
  "negative_tags": "heavy metal",
  "title": "My Song",
  "make_instrumental": false,
  "mv": "chirp-v4",
  "generation_type": "TEXT"
}
```

**Request body (extend mode):**

```json
{
  "prompt": "[Verse]\nContinued lyrics...",
  "tags": "pop",
  "title": "My Song (Extended)",
  "continue_clip_id": "clip-uuid",
  "continue_at": 120.5,
  "mv": "chirp-v4",
  "generation_type": "TEXT",
  "task": "extend"
}
```

**Response:**

```json
{
  "clips": [
    {
      "id": "uuid",
      "title": "My Song",
      "audio_url": "https://cdn1.suno.ai/uuid.mp3",
      "video_url": "https://cdn1.suno.ai/uuid.mp4",
      "image_url": "https://cdn2.suno.ai/image_uuid.jpeg",
      "image_large_url": "https://cdn2.suno.ai/image_large_uuid.jpeg",
      "status": "submitted",
      "created_at": "2024-01-01T00:00:00.000Z",
      "model_name": "chirp-v4",
      "display_name": "username",
      "handle": "username",
      "is_public": false,
      "is_liked": false,
      "play_count": 0,
      "upvote_count": 0,
      "metadata": {
        "prompt": "lyrics text",
        "gpt_description_prompt": "description",
        "tags": "pop, electronic",
        "negative_tags": "heavy metal",
        "duration": 0,
        "type": "gen",
        "error_message": null
      }
    }
  ]
}
```

**Clip statuses:** `submitted` → `queued` → `streaming` → `complete` | `error`

#### POST /api/generate/concat/v2/

```json
{ "clip_id": "uuid" }
```

#### GET /api/feed/v2

**Query params:** `?ids=id1,id2` or `?page=0`

**Response:** `{ "clips": [Clip[]] }`

#### GET /api/clip/{clipId}

**Response:** Single `Clip` object.

#### POST /api/gen/{songId}/set_visibility/

```json
{ "is_public": true }
```

### Lyrics

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/generate/lyrics/` | Generate lyrics from a prompt |
| `GET` | `/api/generate/lyrics/{generateId}` | Get generated lyrics (polling) |
| `GET` | `/api/gen/{songId}/aligned_lyrics/v2/` | Get time-aligned lyrics for a song |

#### POST /api/generate/lyrics/

```json
{ "prompt": "a song about summer" }
```

**Response:**

```json
{ "id": "generate-uuid", "status": "running", "title": "", "text": "" }
```

#### GET /api/generate/lyrics/{generateId}

**Response:**

```json
{
  "id": "generate-uuid",
  "status": "complete",
  "title": "Summer Vibes",
  "text": "[Verse]\nThe sun is shining..."
}
```

#### GET /api/gen/{songId}/aligned_lyrics/v2/

**Response:**

```json
{
  "aligned_words": [
    { "word": "The", "start_s": 0.5, "end_s": 0.7, "success": true, "p_align": 0.95 }
  ]
}
```

### Stems

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/edit/stems/{songId}` | Separate a song into stems (vocals/instrumental) |

**Response:** `{ "clips": [Clip[]] }` (new clips with stem metadata)

### Billing

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/billing/info/` | Get credit balance and usage |

**Response:**

```json
{
  "total_credits_left": 450,
  "period": "monthly",
  "monthly_limit": 2500,
  "monthly_usage": 2050
}
```

### Personas

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/persona/get-persona-paginated/{personaId}/?page=N` | Get persona details |

**Response:**

```json
{
  "persona": {
    "id": "uuid",
    "name": "My Voice",
    "description": "A deep baritone voice",
    "image_s3_id": "...",
    "is_public": true,
    "upvote_count": 100,
    "clip_count": 5
  },
  "total_results": 5,
  "current_page": 0,
  "is_following": false
}
```

## Model Versions

| Version | Notes |
|---------|-------|
| `chirp-v3-0` | Older, ~2 min max |
| `chirp-v3-5` | Stable, ~4 min max |
| `chirp-v4` | Current default |

## Notes

- Each generation returns **2 clips** (variations)
- Poll `/api/feed/v2?ids=...` until status is `complete` or `error`
- Audio URLs are temporary (CDN presigned)
- hCaptcha may be required — check via `POST /api/c/check` with `{ "ctype": "generation" }`
