# Premium 01 - Countdown Reveal

EverLetter Premium 01 - A beautiful countdown reveal template for special messages.

## Features

- Animated loading screen
- 3-2-1 countdown sequence with Framer Motion
- Staggered reveal animation
- Theme support (pink, rose, lavender)
- Music floating player
- Responsive photo grid
- Fully configurable via `config.json`

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Edit `public/config.json` to customize your message, photos, and settings.

3. Add your photos to the `public/` directory.

4. Add your music file to the `public/` directory.

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Build for production:
   ```bash
   pnpm build
   ```

## Configuration

All content is driven by `public/config.json`:

- `recipient` - Name of the recipient
- `sender` - Name of the sender
- `title` - Main title text
- `message` - The letter/message content
- `photos` - Array of photo filenames
- `theme` - Color theme (pink, rose, lavender)
- `music` - Music file name
- `musicTitle` - Music title displayed
- `captions` - Photo captions
- `closing` - Closing message text

## Deployment

Deploy to Vercel, Netlify, or any Next.js compatible hosting.
