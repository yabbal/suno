# Contributing

Thanks for your interest in contributing to the Suno CLI & SDK!

## Getting started

```bash
git clone https://github.com/yabbal/suno.git
cd suno
pnpm install
pnpm build
pnpm test
```

## Project structure

```
suno/
├── packages/suno-sdk/     # TypeScript SDK (published on npm)
├── packages/suno-cli/     # CLI tool (published on npm, depends on SDK)
├── apps/docs/             # Documentation site (Fumadocs)
└── turbo.json             # Turborepo config
```

## Development workflow

1. **Create a branch** from `main`
2. **Make your changes** — TypeScript strict, arrow functions, Biome formatting
3. **Commit** using `pnpm commit` (conventional commits)
4. **Add a changeset** if affecting a published package: `pnpm changeset`
5. **Open a pull request** against `main`

## Commit conventions

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation only
- `chore:` — maintenance, deps, CI
- `refactor:` — code restructuring
- `test:` — tests
