# Shapix Web

Shapix Web is a landing page for the Shapix game with a minimal visual style, multilingual content, and interactive UI animations.

## Features

- Animated loader with a knife motion
- Hero section with a Play button
- Knife-stab interaction on the main page
- Gallery and game concept sections
- Review and support modals
- Responsive layout

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)

## Project Structure

```text
.
|-- index.html
`-- Assets
    |-- CSSs
    |   |-- style.css
    |   `-- media.css
    `-- Script
        |-- script.js
        `-- lang-seo.js
```

## Local Run

1. Open the project folder in VS Code.
2. Run `index.html` with Live Server or any static server.
3. Open the page in a browser to see full animations.

## Click Knife Stab Demo

The demo below uses the same knife SVG and the same animation values as the website hero button.
Click Play to trigger the stab interaction.

<<<<<<< HEAD
<p align="center"><em>Best viewed in VS Code Markdown Preview or any modern Chromium-based browser.</em></p>

<style>
.readme-knife-stage {
  position: relative;
  display: table;
  margin: 0 auto;
  padding: 100px 150px 100px;
  border-radius: 32px;
  background: linear-gradient(180deg, #3a5f92 0%, #314d78 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.readme-knife-stage .readme-toggle {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.readme-knife-stage .btn-knife-wrap {
  display: inline-block;
  position: relative;
}

.readme-knife-stage .btn-primary {
  display: block;
  padding: 16px 45px;
  background-color: #325279;
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
  border-radius: 50px;
  border: 2px solid #ffffff;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  user-select: none;
  cursor: pointer;
}

.readme-knife-stage .btn-primary:hover {
  color: #325279;
  background-color: #ffffff;
}

.readme-knife-stage .hero-knife {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%) translateY(0px) rotate(180deg);
  width: 18px;
  height: 70px;
  pointer-events: none;
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.2s ease;
}

.readme-knife-stage:hover .hero-knife {
  opacity: 1;
  transform: translateX(-50%) translateY(90px) rotate(180deg);
}

.readme-knife-stage .readme-toggle:checked ~ .btn-knife-wrap .btn-primary {
  color: #325279 !important;
  background-color: #ffffff !important;
  animation: btnShake 0.3s ease !important;
}

.readme-knife-stage .readme-toggle:checked ~ .btn-knife-wrap .hero-knife {
  opacity: 1;
  transform: translateX(-50%) translateY(90px) rotate(180deg);
  animation: knifeStab 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards !important;
  transition: none !important;
}

@keyframes knifeStab {
  0% {
    transform: translateX(-50%) translateY(90px) rotate(180deg);
  }

  100% {
    transform: translateX(-50%) translateY(65px) rotate(180deg);
  }
}

@keyframes btnShake {
  0%,
  100% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-3px);
  }

  40% {
    transform: translateX(3px);
  }

  60% {
    transform: translateX(-2px);
  }

  80% {
    transform: translateX(2px);
  }
}
</style>

<div class="readme-knife-stage" aria-label="Click knife stab demo">
  <input id="readmeKnifeToggle" class="readme-toggle" type="checkbox" />
  <div class="btn-knife-wrap">
    <label for="readmeKnifeToggle" class="btn-primary" aria-label="Play button">Play</label>
    <svg class="hero-knife" viewBox="0 0 18 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="5" y="-9" width="8" height="25" rx="3" fill="rgba(255,255,255,0.4)" />
      <rect x="6" y="16" width="6" height="3" rx="1" fill="rgba(255,255,255,0.6)" />
      <rect x="7" y="19" width="4" height="30" fill="white" />
      <polygon points="9,70 5,49 13,49" width="5" fill="white" />
    </svg>
  </div>
</div>

Click Play: the knife drops and stabs the button with the same distance and timing used on the site.

=======
>>>>>>> f8bbe6f288fbe09a8fa18f773cd082ba85365722
## Contacts

- Author: Elsim
- Website: https://shapix.vercel.app
