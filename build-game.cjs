const fs = require("fs");
const path = require("path");

// Read base64 assets
const boardB64 = fs.readFileSync("board.png").toString("base64");
const titleB64 = fs.readFileSync("title.png").toString("base64");
const avatarB64 = fs.readFileSync("sideAvatar.png").toString("base64");

const boardUri = `data:image/png;base64,${boardB64}`;
const titleUri = `data:image/png;base64,${titleB64}`;
const avatarUri = `data:image/png;base64,${avatarB64}`;

const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Snakes and Ladder</title>
  <meta name="description" content="An interactive educational Snakes and Ladder game with customizable learning questions, 3D dice, CPU and local multiplayer modes." />
  <meta property="og:title" content="Snakes and Ladder" />
  <meta property="og:description" content="An interactive educational Snakes and Ladder game with customizable learning questions, 3D dice, CPU and local multiplayer modes." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <style>
    /* CSS Reset & Base Styles */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Trebuchet MS', 'Arial Rounded MT Bold', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: radial-gradient(circle at 50% 15%, #0d2864 0%, #081a44 45%, #030a1c 100%);
      min-height: 100vh;
      color: #f0f4fc;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    /* Screen Reader Only Utility */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    /* Focus styling */
    button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
      outline: 3px solid #ffd700;
      outline-offset: 3px;
    }

    /* Header */
    .app-header {
      width: 100%;
      max-width: 1320px;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      position: relative;
      z-index: 10;
    }

    .title-img-container {
      display: flex;
      align-items: center;
    }

    .title-img {
      width: min(72vw, 720px);
      height: 120px;
      object-fit: cover;
      object-position: left 40%;
      filter: drop-shadow(0 6px 14px rgba(0, 10, 40, 0.9));
      user-select: none;
      pointer-events: none;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-sound {
      background: linear-gradient(135deg, #1b387a, #0b1e4c);
      border: 2px solid #40e8ff;
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 9999px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
      transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
      min-height: 44px;
      touch-action: manipulation;
    }

    .btn-sound:hover {
      background: linear-gradient(135deg, #23479a, #102964);
      box-shadow: 0 6px 16px rgba(64, 232, 255, 0.35);
      transform: translateY(-1px);
    }

    .btn-sound:active {
      transform: translateY(1px);
    }

    /* View containers */
    .view-section {
      width: 100%;
      max-width: 1320px;
      padding: 0 20px 40px;
      display: none;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 5;
    }

    .view-section.active {
      display: flex;
    }

    /* SETTINGS SCREEN STYLES */
    .settings-card {
      width: 100%;
      max-width: 820px;
      background: linear-gradient(160deg, #0e2254 0%, #07153b 100%);
      border: 3px solid #40e8ff;
      border-radius: 24px;
      padding: 32px 36px;
      box-shadow: 0 0 35px rgba(64, 232, 255, 0.25), 0 16px 40px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .settings-header {
      text-align: center;
    }

    .settings-heading {
      font-size: clamp(1.8rem, 3.2vw, 2.5rem);
      color: #ffd700;
      text-shadow: 0 2px 10px rgba(255, 215, 0, 0.4);
      margin-bottom: 8px;
    }

    .settings-subtitle {
      font-size: clamp(0.95rem, 1.8vw, 1.15rem);
      color: #cbdcfc;
      line-height: 1.4;
    }

    .section-title {
      font-size: 1.25rem;
      color: #40e8ff;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Mode selector */
    .mode-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 8px;
    }

    .mode-btn {
      background: linear-gradient(145deg, #162f6b, #0b1a42);
      border: 3px solid #28559e;
      border-radius: 16px;
      padding: 18px 16px;
      color: #ffffff;
      font-size: 1.15rem;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      min-height: 80px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .mode-btn:hover {
      border-color: #40e8ff;
      background: linear-gradient(145deg, #1c3d8a, #0f2357);
    }

    .mode-btn[aria-pressed="true"] {
      border-color: #ffd700;
      background: linear-gradient(145deg, #224baf, #132a68);
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 12px rgba(255, 215, 0, 0.3);
      color: #ffffff;
    }

    /* Player count buttons */
    .player-count-group {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(8, 22, 58, 0.6);
      padding: 12px 16px;
      border-radius: 14px;
      border: 1px solid #1f4382;
      flex-wrap: wrap;
    }

    .count-label {
      font-weight: bold;
      color: #cbdcfc;
      font-size: 1rem;
    }

    .count-buttons {
      display: flex;
      gap: 8px;
    }

    .count-btn {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #152b5e;
      border: 2px solid #28559e;
      color: #fff;
      font-size: 1.15rem;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .count-btn:hover {
      border-color: #40e8ff;
    }

    .count-btn[aria-pressed="true"] {
      background: #0876ed;
      border-color: #ffd700;
      box-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
    }

    /* Player names inputs */
    .names-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .name-input-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .token-dot-preview {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      flex-shrink: 0;
    }

    .name-input {
      flex: 1;
      background: #06112c;
      border: 2px solid #1f4382;
      border-radius: 10px;
      padding: 10px 14px;
      color: #ffffff;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    .name-input:focus {
      border-color: #40e8ff;
    }

    .names-action-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 4px;
    }

    .btn-green-save {
      background: linear-gradient(135deg, #1aa355, #12793e);
      border: 2px solid #34d399;
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(18, 121, 62, 0.4);
      transition: all 0.15s ease;
      min-height: 44px;
    }

    .btn-green-save:hover {
      background: linear-gradient(135deg, #22c55e, #168a47);
      box-shadow: 0 6px 16px rgba(34, 197, 94, 0.5);
      transform: translateY(-1px);
    }

    .save-status-indicator {
      font-size: 0.95rem;
      font-weight: bold;
      color: #a7f3d0;
    }

    .save-status-indicator.unsaved {
      color: #fcd34d;
    }

    /* Questions details / editor */
    .questions-details {
      background: rgba(8, 22, 58, 0.5);
      border: 2px solid #1f4382;
      border-radius: 16px;
      padding: 16px;
    }

    .questions-details summary {
      cursor: pointer;
      font-size: 1.15rem;
      font-weight: bold;
      color: #40e8ff;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
      padding: 4px 0;
    }

    .questions-details summary::-webkit-details-marker {
      display: none;
    }

    .questions-details summary::after {
      content: '▼';
      font-size: 0.85rem;
      transition: transform 0.2s ease;
    }

    .questions-details[open] summary::after {
      transform: rotate(180deg);
    }

    .questions-editor-content {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .bulk-editor-title {
      font-size: 1.05rem;
      color: #ffd700;
      margin-bottom: 8px;
      font-weight: bold;
    }

    .bulk-textareas-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .bulk-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .bulk-field label {
      font-size: 0.9rem;
      color: #cbdcfc;
      font-weight: bold;
    }

    .bulk-textarea {
      background: #050d24;
      border: 2px solid #1f4382;
      border-radius: 10px;
      padding: 10px;
      color: #ffffff;
      font-family: inherit;
      font-size: 0.9rem;
      resize: vertical;
      min-height: 140px;
    }

    .bulk-textarea:focus {
      border-color: #40e8ff;
    }

    .single-square-box {
      background: #06112c;
      border: 1px solid #1f4382;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .single-square-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .square-select {
      background: #0e2254;
      border: 2px solid #1f4382;
      border-radius: 8px;
      color: #ffffff;
      padding: 8px 12px;
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: bold;
    }

    .single-square-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .single-input-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .single-input-group label {
      font-size: 0.85rem;
      color: #cbdcfc;
    }

    .single-input {
      background: #050d24;
      border: 2px solid #1f4382;
      border-radius: 8px;
      color: #ffffff;
      padding: 8px 12px;
      font-family: inherit;
      font-size: 0.9rem;
    }

    .single-input:focus {
      border-color: #40e8ff;
    }

    .single-square-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn-secondary {
      background: #1b387a;
      border: 2px solid #28559e;
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: bold;
      cursor: pointer;
      min-height: 40px;
      transition: all 0.15s ease;
    }

    .btn-secondary:hover {
      border-color: #40e8ff;
      background: #23479a;
    }

    .btn-danger-outline {
      background: transparent;
      border: 2px solid #ef4444;
      color: #fca5a5;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: bold;
      cursor: pointer;
      min-height: 40px;
      transition: all 0.15s ease;
    }

    .btn-danger-outline:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #ffffff;
    }

    .feedback-msg {
      font-size: 0.9rem;
      font-weight: bold;
      padding: 6px 10px;
      border-radius: 6px;
    }

    .feedback-msg.success {
      background: rgba(34, 197, 94, 0.2);
      color: #86efac;
      border: 1px solid #22c55e;
    }

    .feedback-msg.error {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      border: 1px solid #ef4444;
    }

    /* Start game button */
    .btn-start-game {
      width: 100%;
      background: linear-gradient(135deg, #18a75b 0%, #108043 100%);
      border: 3px solid #4ade80;
      color: #ffffff;
      padding: 18px 24px;
      border-radius: 18px;
      font-size: clamp(1.2rem, 2.5vw, 1.5rem);
      font-weight: 900;
      letter-spacing: 0.5px;
      cursor: pointer;
      box-shadow: 0 0 25px rgba(34, 197, 94, 0.45), 0 8px 20px rgba(0, 0, 0, 0.5);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      min-height: 56px;
    }

    .btn-start-game:hover {
      background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
      transform: translateY(-2px);
      box-shadow: 0 0 35px rgba(34, 197, 94, 0.65), 0 10px 24px rgba(0, 0, 0, 0.6);
    }

    .btn-start-game:active {
      transform: translateY(1px);
    }

    /* GAME SCREEN STYLES */
    .game-nav-bar {
      width: 100%;
      max-width: 1320px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      gap: 12px;
    }

    .btn-nav {
      background: linear-gradient(135deg, #162f6b, #0b1a42);
      border: 2px solid #40e8ff;
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: bold;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: all 0.15s ease;
      min-height: 44px;
    }

    .btn-nav:hover {
      background: linear-gradient(135deg, #1c3d8a, #112861);
      border-color: #ffd700;
      transform: translateY(-1px);
    }

    .game-main-layout {
      width: 100%;
      max-width: 1320px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: clamp(16px, 2.5vw, 32px);
    }

    /* Board Column */
    .board-column {
      flex: 1 1 720px;
      max-width: 760px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    /* Board Frame with layered metallic-blue/cyan frame and golden halo */
    .board-frame-container {
      width: 100%;
      position: relative;
      border-radius: 24px;
      padding: 10px;
      background: linear-gradient(135deg, #40e8ff 0%, #0876ed 35%, #582bc2 70%, #02a5eb 100%);
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.45), 0 0 65px rgba(255, 190, 0, 0.25), 0 16px 40px rgba(0, 0, 0, 0.8), inset 0 2px 6px rgba(255, 255, 255, 0.8);
    }

    .board-frame-inner {
      width: 100%;
      aspect-ratio: 5 / 4;
      background: #020817;
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.9);
    }

    /* Baked Artwork image behind hit areas */
    .board-bg-img {
      position: absolute;
      left: 49.5%;
      top: 52.8%;
      width: 120%;
      height: 123%;
      transform: translate(-50%, -50%);
      object-fit: fill;
      pointer-events: none;
      user-select: none;
      z-index: 1;
    }

    /* 5 cols x 4 rows grid */
    .board-grid {
      position: absolute;
      inset: 0;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(4, 1fr);
      z-index: 2;
    }

    .board-square {
      position: relative;
      width: 100%;
      height: 100%;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: transparent;
    }

    /* Question Mark Button in Square */
    .question-btn {
      position: absolute;
      top: 11%;
      right: 7%;
      width: clamp(24px, 3.4vw, 36px);
      height: clamp(24px, 3.4vw, 36px);
      border-radius: 50%;
      border: 2px solid #ffffff;
      color: #ffffff;
      font-weight: 900;
      font-size: clamp(13px, 1.8vw, 20px);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.5);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      z-index: 10;
      padding: 0;
      line-height: 1;
    }

    /* Special position for Square 10 so it does not cover the baked number 10 */
    .question-btn[data-square="10"] {
      right: 24%;
    }

    .question-btn:hover {
      transform: scale(1.15);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
    }

    /* Question button column colors */
    .col-color-green { background: #18a75b; }
    .col-color-blue { background: #1878ee; }
    .col-color-purple { background: #8a4de1; }
    .col-color-coral { background: #ff5d66; }
    .col-color-orange { background: #ef8b20; }

    /* Saved question soft green glow */
    .question-btn.has-question {
      background: #18a75b !important;
      box-shadow: 0 0 12px #22c55e, 0 2px 6px rgba(0, 0, 0, 0.4);
      border-color: #ffffff;
      animation: pulse-saved 2.5s infinite ease-in-out;
    }

    @keyframes pulse-saved {
      0%, 100% { box-shadow: 0 0 8px #22c55e, 0 2px 5px rgba(0,0,0,0.4); }
      50% { box-shadow: 0 0 16px #4ade80, 0 3px 8px rgba(0,0,0,0.5); }
    }

    /* Tokens Layer inside Board Frame */
    .tokens-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 20;
    }

    /* STARTING DOCK */
    .starting-dock {
      width: 100%;
      margin-top: 14px;
      background: linear-gradient(145deg, #0a1b44, #050f29);
      border: 3px solid #1f4382;
      border-radius: 16px;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.7), 0 6px 16px rgba(0, 0, 0, 0.4);
    }

    .dock-title {
      font-size: clamp(0.85rem, 1.5vw, 1.05rem);
      font-weight: 900;
      color: #40e8ff;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      text-shadow: 0 0 10px rgba(64, 232, 255, 0.5);
    }

    .dock-tokens-area {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 48px;
    }

    /* Token styling */
    .player-token {
      width: clamp(26px, 3.8vw, 42px);
      height: clamp(26px, 3.8vw, 42px);
      border-radius: 50%;
      border: 2.5px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: clamp(12px, 1.6vw, 18px);
      color: #ffffff;
      text-shadow: 0 1px 3px rgba(0,0,0,0.8);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.65), inset 0 2px 4px rgba(255, 255, 255, 0.65);
      user-select: none;
      transition: left 0.25s ease-out, top 0.25s ease-out, transform 0.25s ease-out;
      position: absolute;
    }

    .player-token.in-dock {
      position: static;
      transition: none;
    }

    .player-token.hopping {
      transform: translateY(-24px) scale(1.18);
    }

    /* CONTROL COLUMN (Cream panel with cyan border, royal-blue ring) */
    .control-column {
      flex: 0 0 310px;
      width: 310px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: sticky;
      top: 16px;
    }

    .control-panel {
      background: linear-gradient(145deg, #fffdf8 0%, #f6efe2 100%);
      border: 4px solid #40e8ff;
      outline: 3px solid #0876ed;
      border-radius: 20px;
      padding: 20px 18px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.65), inset 0 1px 2px rgba(255, 255, 255, 0.8);
      color: #121c33;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .turn-header-box {
      text-align: center;
      border-bottom: 2px dashed #d1c7b7;
      padding-bottom: 12px;
    }

    .turn-kicker {
      font-size: 0.8rem;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: #0876ed;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .active-player-name {
      font-size: 1.45rem;
      font-weight: 900;
      color: #0b1a42;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .active-color-badge {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: inline-block;
    }

    .status-alert-box {
      background: #eef5ff;
      border: 2px solid #b8d7fb;
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 0.95rem;
      font-weight: bold;
      color: #0c2b64;
      text-align: center;
      min-height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1.35;
    }

    /* Avatar & Dice Interactive Row */
    .avatar-dice-row {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 12px;
      padding: 6px 0;
    }

    /* Avatar container with 3 bouncing question marks above it */
    .avatar-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .avatar-qmarks {
      display: flex;
      gap: 6px;
      margin-bottom: 6px;
      height: 22px;
    }

    .qmark-bounce {
      color: #0876ed;
      font-weight: 900;
      font-size: 1.15rem;
      text-shadow: 0 0 8px rgba(8, 118, 237, 0.4);
      animation: qmark-float 1.8s infinite ease-in-out;
    }

    .qmark-bounce:nth-child(2) {
      animation-delay: 0.3s;
      color: #ff5d66;
    }

    .qmark-bounce:nth-child(3) {
      animation-delay: 0.6s;
      color: #18a75b;
    }

    @keyframes qmark-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-7px); }
    }

    .avatar-img-box {
      width: 90px;
      height: 110px;
      border-radius: 14px;
      border: 3px solid #0876ed;
      overflow: hidden;
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
      background: #0b1a42;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      user-select: none;
      pointer-events: none;
    }

    /* 3D Realistic Dice Stage */
    .dice-stage-btn {
      width: 96px;
      height: 96px;
      perspective: 600px;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      position: relative;
      touch-action: manipulation;
    }

    .dice-stage-btn:disabled {
      cursor: not-allowed;
    }

    .dice-cube {
      width: 76px;
      height: 76px;
      position: relative;
      transform-style: preserve-3d;
      transform: rotateX(-12deg) rotateY(16deg);
      transition: transform 1s cubic-bezier(0.2, 0.8, 0.3, 1);
      pointer-events: none;
    }

    .dice-cube.rolling {
      transition: transform 1s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .dice-face {
      position: absolute;
      width: 76px;
      height: 76px;
      border-radius: 15px;
      border: 2px solid #ffd85b;
      background: linear-gradient(135deg, #32dfff 0%, #087cf4 35%, #0a439f 70%, #061c52 100%);
      box-shadow: inset 0 0 10px rgba(6, 28, 82, 0.9), 0 0 12px rgba(8, 124, 244, 0.5);
      display: grid;
      padding: 10px;
      box-sizing: border-box;
    }

    /* Faces 3D positioning with 38px translateZ */
    .face-1 { transform: rotateY(0deg) translateZ(38px); }
    .face-2 { transform: rotateY(90deg) translateZ(38px); }
    .face-3 { transform: rotateY(180deg) translateZ(38px); }
    .face-4 { transform: rotateY(-90deg) translateZ(38px); }
    .face-5 { transform: rotateX(90deg) translateZ(38px); }
    .face-6 { transform: rotateX(-90deg) translateZ(38px); }

    /* Golden recessed glowing pips */
    .pip {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #ffffff 0%, #fff3b0 30%, #ffd700 70%, #d49a00 100%);
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6), 0 0 6px rgba(255, 215, 0, 0.85);
      align-self: center;
      justify-self: center;
    }

    /* Pip layouts */
    .face-1 { grid-template: 1fr / 1fr; }
    .face-1 .pip { grid-area: 1 / 1; }

    .face-2 { grid-template: 1fr 1fr / 1fr 1fr; }
    .face-2 .pip:nth-child(1) { grid-area: 1 / 2; }
    .face-2 .pip:nth-child(2) { grid-area: 2 / 1; }

    .face-3 { grid-template: 1fr 1fr 1fr / 1fr 1fr 1fr; }
    .face-3 .pip:nth-child(1) { grid-area: 1 / 3; }
    .face-3 .pip:nth-child(2) { grid-area: 2 / 2; }
    .face-3 .pip:nth-child(3) { grid-area: 3 / 1; }

    .face-4 { grid-template: 1fr 1fr / 1fr 1fr; }
    .face-4 .pip:nth-child(1) { grid-area: 1 / 1; }
    .face-4 .pip:nth-child(2) { grid-area: 1 / 2; }
    .face-4 .pip:nth-child(3) { grid-area: 2 / 1; }
    .face-4 .pip:nth-child(4) { grid-area: 2 / 2; }

    .face-5 { grid-template: 1fr 1fr 1fr / 1fr 1fr 1fr; }
    .face-5 .pip:nth-child(1) { grid-area: 1 / 1; }
    .face-5 .pip:nth-child(2) { grid-area: 1 / 3; }
    .face-5 .pip:nth-child(3) { grid-area: 2 / 2; }
    .face-5 .pip:nth-child(4) { grid-area: 3 / 1; }
    .face-5 .pip:nth-child(5) { grid-area: 3 / 3; }

    .face-6 { grid-template: 1fr 1fr 1fr / 1fr 1fr; }
    .face-6 .pip:nth-child(1) { grid-area: 1 / 1; }
    .face-6 .pip:nth-child(2) { grid-area: 1 / 2; }
    .face-6 .pip:nth-child(3) { grid-area: 2 / 1; }
    .face-6 .pip:nth-child(4) { grid-area: 2 / 2; }
    .face-6 .pip:nth-child(5) { grid-area: 3 / 1; }
    .face-6 .pip:nth-child(6) { grid-area: 3 / 2; }

    /* Glowing Move Spaces Button */
    .btn-move-spaces {
      width: 100%;
      background: linear-gradient(135deg, #0876ed 0%, #0050b3 100%);
      border: 3px solid #ffd700;
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 14px;
      font-size: 1.15rem;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 0 16px rgba(255, 215, 0, 0.6), 0 4px 10px rgba(0, 0, 0, 0.4);
      display: none;
      align-items: center;
      justify-content: center;
      gap: 8px;
      animation: pulse-move 1.5s infinite ease-in-out;
      min-height: 48px;
    }

    .btn-move-spaces.visible {
      display: flex;
    }

    @keyframes pulse-move {
      0%, 100% { box-shadow: 0 0 12px rgba(255, 215, 0, 0.5), 0 4px 8px rgba(0,0,0,0.3); }
      50% { box-shadow: 0 0 24px rgba(255, 215, 0, 0.9), 0 6px 14px rgba(0,0,0,0.4); }
    }

    /* Player list under dice */
    .players-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 2px dashed #d1c7b7;
      padding-top: 12px;
    }

    .player-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.7);
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .player-row.active {
      border-color: #0876ed;
      background: #ffffff;
      box-shadow: 0 4px 12px rgba(8, 118, 237, 0.25);
      outline: 2px solid #40e8ff;
    }

    .player-info-left {
      display: flex;
      align-items: center;
      gap: 10px;
      overflow: hidden;
    }

    .player-row-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      flex-shrink: 0;
    }

    .player-row-name {
      font-weight: bold;
      font-size: 0.95rem;
      color: #0b1a42;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }

    .player-row-trophies {
      font-weight: 900;
      font-size: 0.95rem;
      color: #854d0e;
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    /* FOOTER SIGNATURE outside control box */
    .footer-signature {
      text-align: center;
      padding: 8px 0 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .author-name {
      font-weight: bold;
      color: #ffd700;
      font-size: 1.05rem;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
      letter-spacing: 0.5px;
    }

    .author-title {
      font-size: 0.85rem;
      color: #f6efe2;
    }

    /* QUESTION MODAL */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(4, 12, 34, 0.82);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 500;
    }

    .modal-backdrop.active {
      display: flex;
    }

    .modal-box {
      background: linear-gradient(155deg, #0e2254, #081638);
      border: 3px solid #40e8ff;
      border-radius: 20px;
      padding: 28px;
      width: 100%;
      max-width: 520px;
      box-shadow: 0 0 35px rgba(64, 232, 255, 0.35), 0 20px 40px rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
    }

    .modal-title {
      font-size: 1.4rem;
      color: #ffd700;
      text-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-q-text {
      font-size: 1.15rem;
      color: #ffffff;
      line-height: 1.45;
      background: #050e24;
      border: 1px solid #1f4382;
      padding: 14px;
      border-radius: 10px;
      min-height: 60px;
    }

    .modal-input-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .modal-input-field label {
      font-size: 0.9rem;
      color: #cbdcfc;
      font-weight: bold;
    }

    .modal-answer-input {
      background: #050d24;
      border: 2px solid #1f4382;
      border-radius: 10px;
      padding: 12px 14px;
      color: #ffffff;
      font-size: 1rem;
      font-family: inherit;
    }

    .modal-answer-input:focus {
      border-color: #40e8ff;
    }

    .modal-feedback {
      font-size: 0.95rem;
      font-weight: bold;
      min-height: 24px;
      line-height: 1.3;
    }

    .modal-feedback.success {
      color: #86efac;
    }

    .modal-feedback.error {
      color: #fca5a5;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 6px;
    }

    /* VICTORY OVERLAY */
    .victory-overlay {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at 50% 35%, #0d2864 0%, #06153c 60%, #020716 100%);
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      z-index: 1000;
      text-align: center;
    }

    .victory-overlay.active {
      display: flex;
    }

    .victory-trophy {
      font-size: clamp(4.5rem, 10vw, 7rem);
      filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.7));
      animation: trophy-bounce 1.5s infinite ease-in-out;
      margin-bottom: 12px;
    }

    @keyframes trophy-bounce {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-16px) scale(1.08); }
    }

    .victory-title {
      font-size: clamp(2.4rem, 6vw, 4rem);
      font-weight: 900;
      color: #ffd700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.8);
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .victory-winner {
      font-size: clamp(1.4rem, 3.5vw, 2.2rem);
      color: #ffffff;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .victory-reason {
      font-size: clamp(1.05rem, 2.2vw, 1.4rem);
      color: #40e8ff;
      margin-bottom: 28px;
    }

    .btn-play-again {
      background: linear-gradient(135deg, #18a75b 0%, #108043 100%);
      border: 3px solid #4ade80;
      color: #ffffff;
      padding: 16px 36px;
      border-radius: 16px;
      font-size: clamp(1.15rem, 2.2vw, 1.4rem);
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 0 25px rgba(34, 197, 94, 0.5), 0 8px 20px rgba(0, 0, 0, 0.6);
      transition: all 0.2s ease;
      min-height: 52px;
    }

    .btn-play-again:hover {
      background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
      transform: translateY(-2px);
      box-shadow: 0 0 35px rgba(34, 197, 94, 0.7);
    }

    /* Confetti pieces */
    .confetti-container {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 1001;
    }

    .confetti-piece {
      position: absolute;
      width: 10px;
      height: 16px;
      opacity: 0.9;
      animation: confetti-fall linear forwards;
    }

    @keyframes confetti-fall {
      0% {
        transform: translateY(-30px) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(105vh) rotate(720deg);
        opacity: 0;
      }
    }

    /* Snake Cry Overlay */
    .snake-cry-overlay {
      position: absolute;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 50;
      pointer-events: none;
      animation: cry-fade 1.2s forwards ease-out;
    }

    .snake-cry-emoji {
      font-size: clamp(4rem, 10vw, 7rem);
      filter: drop-shadow(0 0 20px rgba(255, 60, 60, 0.8));
    }

    @keyframes cry-fade {
      0% { transform: scale(0.6); opacity: 0; }
      25% { transform: scale(1.2); opacity: 1; }
      75% { transform: scale(1); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0; }
    }

    /* Responsive Behavior */
    @media (max-width: 850px) {
      .game-main-layout {
        flex-direction: column;
        align-items: center;
      }
      .control-column {
        position: static;
        width: 100%;
        max-width: 520px;
      }
      .board-column {
        max-width: 560px;
      }
    }

    @media (max-width: 480px) {
      .app-header {
        padding: 10px 14px;
      }
      .title-img {
        width: min(64vw, 250px);
        height: 46px;
      }
      .btn-sound {
        padding: 8px 12px;
        font-size: 0.85rem;
      }
      .settings-card {
        padding: 20px 16px;
      }
      .mode-options {
        grid-template-columns: 1fr;
      }
      .bulk-textareas-container {
        grid-template-columns: 1fr;
      }
      .single-square-inputs {
        grid-template-columns: 1fr;
      }
      .board-frame-container {
        padding: 6px;
        border-radius: 18px;
      }
      .control-panel {
        padding: 14px;
      }
    }

    /* Prefers-reduced-motion */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>

  <!-- App Header -->
  <header class="app-header">
    <div class="title-img-container">
      <img src="${titleUri}" alt="Snakes and Ladder" class="title-img" />
    </div>
    <div class="header-actions">
      <button type="button" id="soundToggleBtn" class="btn-sound" aria-pressed="true" aria-label="Toggle sound effects">
        🔊 Sound on
      </button>
    </div>
  </header>

  <!-- Live Announcements Region -->
  <div id="liveAnnounce" class="sr-only" aria-live="polite" aria-atomic="true"></div>

  <!-- Main Application Container -->
  <main id="appMain" style="width: 100%; display: flex; flex-direction: column; align-items: center;">

    <!-- 1. SETTINGS SCREEN -->
    <section id="settingsView" class="view-section active" aria-labelledby="settingsHeading">
      <div class="settings-card">
        <div class="settings-header">
          <h1 id="settingsHeading" class="settings-heading">Set up your game</h1>
          <p class="settings-subtitle">Choose how to play, save the player names, and add your learning questions.</p>
        </div>

        <!-- Mode Selector -->
        <div>
          <h2 class="section-title">Play mode</h2>
          <div class="mode-options" role="group" aria-label="Select play mode">
            <button type="button" id="modeVsCpu" class="mode-btn" aria-pressed="true">
              <span>🤖 Versus computer</span>
              <span style="font-size: 0.85rem; font-weight: normal; opacity: 0.85;">1 human player vs automated CPU</span>
            </button>
            <button type="button" id="modeLocal" class="mode-btn" aria-pressed="false">
              <span>👥 Various players</span>
              <span style="font-size: 0.85rem; font-weight: normal; opacity: 0.85;">2 to 5 local players sharing device</span>
            </button>
          </div>
        </div>

        <!-- Player count selector (visible in local mode) -->
        <div id="playerCountContainer" class="player-count-group" style="display: none;">
          <span class="count-label">Number of players:</span>
          <div class="count-buttons" role="group" aria-label="Number of local players">
            <button type="button" class="count-btn" data-count="2" aria-pressed="true">2</button>
            <button type="button" class="count-btn" data-count="3" aria-pressed="false">3</button>
            <button type="button" class="count-btn" data-count="4" aria-pressed="false">4</button>
            <button type="button" class="count-btn" data-count="5" aria-pressed="false">5</button>
          </div>
        </div>

        <!-- Player Names -->
        <div>
          <h2 class="section-title">Player names</h2>
          <div id="playerNamesGrid" class="names-grid">
            <!-- Populated dynamically based on mode & count -->
          </div>
          <div class="names-action-bar">
            <button type="button" id="saveNamesBtn" class="btn-green-save">
              Save player names
            </button>
            <span id="saveStatusIndicator" class="save-status-indicator"></span>
          </div>
        </div>

        <!-- Question editor: Collapsible <details> -->
        <details class="questions-details" id="questionsDetails">
          <summary>Add or edit my questions</summary>
          <div class="questions-editor-content">
            <p style="font-size: 0.9rem; color: #cbdcfc; line-height: 1.4;">
              Customize questions for each of the 20 board squares. When saved, squares on the board will glow green!
            </p>

            <!-- Bulk Import -->
            <div>
              <div class="bulk-editor-title">Bulk paste questions and answers (1–20 lines)</div>
              <div class="bulk-textareas-container">
                <div class="bulk-field">
                  <label for="bulkQuestions">Questions, one per line</label>
                  <textarea id="bulkQuestions" class="bulk-textarea" placeholder="What is 5 + 5?&#10;What is the capital of France?&#10;How many continents are there?"></textarea>
                </div>
                <div class="bulk-field">
                  <label for="bulkAnswers">Answers, one per line</label>
                  <textarea id="bulkAnswers" class="bulk-textarea" placeholder="10&#10;Paris&#10;7"></textarea>
                </div>
              </div>
              <div style="margin-top: 10px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <button type="button" id="bulkSaveBtn" class="btn-secondary">
                  Save bulk questions
                </button>
                <button type="button" id="clearAllQuestionsBtn" class="btn-danger-outline">
                  Clear all 20 questions
                </button>
                <div id="bulkStatusMsg" class="feedback-msg" style="display: none;"></div>
              </div>
            </div>

            <!-- Single Square Editor -->
            <div class="single-square-box">
              <div class="single-square-row">
                <label for="singleSquareSelect" style="font-weight: bold; color: #ffd700;">Edit single square:</label>
                <select id="singleSquareSelect" class="square-select">
                  <!-- 1 to 20 -->
                </select>
              </div>
              <div class="single-square-inputs">
                <div class="single-input-group">
                  <label for="singleQuestionInput">Question text</label>
                  <input type="text" id="singleQuestionInput" class="single-input" placeholder="e.g. What color is the sky?" />
                </div>
                <div class="single-input-group">
                  <label for="singleAnswerInput">Exact answer</label>
                  <input type="text" id="singleAnswerInput" class="single-input" placeholder="e.g. Blue" />
                </div>
              </div>
              <div class="single-square-buttons">
                <button type="button" id="singleSaveBtn" class="btn-secondary">Save this square</button>
                <button type="button" id="singleClearBtn" class="btn-danger-outline">Clear this square</button>
                <div id="singleStatusMsg" class="feedback-msg" style="display: none;"></div>
              </div>
            </div>
          </div>
        </details>

        <!-- Start Game Button -->
        <button type="button" id="startGameBtn" class="btn-start-game">
          Start the game ▶
        </button>
      </div>
    </section>

    <!-- 2. GAME SCREEN -->
    <section id="gameView" class="view-section" aria-labelledby="gameBoardHeading">
      <h1 id="gameBoardHeading" class="sr-only">Snakes and Ladder Game Board</h1>

      <!-- Game Navigation Bar -->
      <div class="game-nav-bar">
        <button type="button" id="backToSettingsBtn" class="btn-nav" aria-label="Back to settings">
          ← Back to settings
        </button>
        <button type="button" id="restartGameBtn" class="btn-nav" aria-label="Restart current game">
          ↻ Restart game
        </button>
      </div>

      <!-- Main Responsive Layout -->
      <div class="game-main-layout">
        <!-- Board Column -->
        <div class="board-column">
          <!-- Board Outer Metallic Frame with Golden Halo -->
          <div class="board-frame-container" id="boardFrameContainer">
            <div class="board-frame-inner" id="boardFrameInner">
              <!-- Mandatory Main Board Asset behind hit areas -->
              <img src="${boardUri}" alt="Snakes and Ladder Board Artwork" class="board-bg-img" />

              <!-- 20 Squares Grid (5 cols x 4 rows) in serpentine order -->
              <div class="board-grid" id="boardGrid" role="region" aria-label="Snakes and Ladder Game Board, 20 squares">
                <!-- Populated dynamically with serpentine hit areas & ? buttons -->
              </div>

              <!-- Tokens Container (relative to board frame inner) -->
              <div class="tokens-layer" id="tokensLayer">
                <!-- Tokens on the board rendered here -->
              </div>

              <!-- Snake crying emoji popup -->
              <div class="snake-cry-overlay" id="snakeCryOverlay">
                <span class="snake-cry-emoji">😭</span>
              </div>
            </div>
          </div>

          <!-- Starting Dock -->
          <div class="starting-dock" id="startingDock" role="region" aria-label="Starting dock for tokens at position 0">
            <span class="dock-title">Starting Dock</span>
            <div class="dock-tokens-area" id="dockTokensArea">
              <!-- Tokens at position 0 rest here -->
            </div>
          </div>
        </div>

        <!-- Control Column -->
        <aside class="control-column" aria-label="Game controls and player status">
          <div class="control-panel">
            <!-- Current Turn Box -->
            <div class="turn-header-box">
              <div class="turn-kicker">Current Turn</div>
              <div class="active-player-name" id="activePlayerDisplay">
                <span class="active-color-badge" id="activeColorBadge"></span>
                <span id="activePlayerNameText">Player 1</span>
              </div>
            </div>

            <!-- Status Box -->
            <div class="status-alert-box" id="statusBox" role="status" aria-live="polite">
              Click the dice to roll.
            </div>

            <!-- Avatar + Dice Interactive Row -->
            <div class="avatar-dice-row">
              <!-- Avatar with animated question marks above it -->
              <div class="avatar-wrapper" aria-label="Friendly snake avatar">
                <div class="avatar-qmarks" aria-hidden="true">
                  <span class="qmark-bounce">?</span>
                  <span class="qmark-bounce">?</span>
                  <span class="qmark-bounce">?</span>
                </div>
                <div class="avatar-img-box">
                  <img src="${avatarUri}" alt="Snakes and ladder character mascot" class="avatar-img" />
                </div>
              </div>

              <!-- 3D Realistic Dice inside stationary 96x96 button -->
              <button type="button" id="diceBtn" class="dice-stage-btn" aria-label="Roll the dice">
                <div class="dice-cube" id="diceCube">
                  <!-- 6 Faces -->
                  <div class="dice-face face-1" data-val="1">
                    <span class="pip"></span>
                  </div>
                  <div class="dice-face face-2" data-val="2">
                    <span class="pip"></span><span class="pip"></span>
                  </div>
                  <div class="dice-face face-3" data-val="3">
                    <span class="pip"></span><span class="pip"></span><span class="pip"></span>
                  </div>
                  <div class="dice-face face-4" data-val="4">
                    <span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span>
                  </div>
                  <div class="dice-face face-5" data-val="5">
                    <span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span>
                  </div>
                  <div class="dice-face face-6" data-val="6">
                    <span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span>
                  </div>
                </div>
              </button>
            </div>

            <!-- Glowing Move Spaces Button -->
            <button type="button" id="moveSpacesBtn" class="btn-move-spaces">
              Move 1 space
            </button>

            <!-- Players List with Trophies -->
            <div class="players-list" id="playersList" role="region" aria-label="Player standings and trophies">
              <!-- Populated dynamically -->
            </div>
          </div>

          <!-- Mandatory Footer Signature outside the control box -->
          <footer class="footer-signature">
            <div class="author-name">Dr.Abir Wafa</div>
            <div class="author-title">Head of EdTech at Edulixa</div>
          </footer>
        </aside>
      </div>
    </section>
  </main>

  <!-- Question Modal -->
  <div class="modal-backdrop" id="questionModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="modal-box">
      <h2 id="modalTitle" class="modal-title">
        <span>Square 1 question</span>
      </h2>
      <div id="modalQuestionText" class="modal-q-text"></div>
      <div class="modal-input-field">
        <label for="modalAnswerInput">Your answer:</label>
        <input type="text" id="modalAnswerInput" class="modal-answer-input" autocomplete="off" placeholder="Type your answer here..." />
      </div>
      <div id="modalFeedbackMsg" class="modal-feedback" aria-live="assertive"></div>
      <div class="modal-actions">
        <button type="button" id="closeModalBtn" class="btn-secondary">Close</button>
        <button type="button" id="submitAnswerBtn" class="btn-green-save">Check my answer</button>
      </div>
    </div>
  </div>

  <!-- Victory Overlay -->
  <div class="victory-overlay" id="victoryOverlay" role="dialog" aria-modal="true" aria-labelledby="victoryHeading">
    <div class="confetti-container" id="confettiContainer"></div>
    <div class="victory-trophy">🏆</div>
    <h2 id="victoryHeading" class="victory-title">Victory!</h2>
    <div id="victoryWinner" class="victory-winner">Player 1 wins!</div>
    <div id="victoryReason" class="victory-reason">Reached square 20!</div>
    <button type="button" id="playAgainBtn" class="btn-play-again">
      Play again
    </button>
  </div>

  <!-- Game Logic Script -->
  <script>
    (function() {
      'use strict';

      /* Constants */
      const PLAYER_COLORS = ['#ff5d66', '#1878ee', '#18a75b', '#8a4de1', '#ef8b20'];
      const COLUMN_COLORS = ['#18a75b', '#1878ee', '#8a4de1', '#ff5d66', '#ef8b20'];
      const LADDERS = { 2: 9, 7: 14, 12: 19 };
      const SNAKES = { 11: 10, 13: 8, 15: 6 };

      /* Serpentine grid definition:
         Row 4 (top): 20, 19, 18, 17, 16
         Row 3:       11, 12, 13, 14, 15
         Row 2:       10,  9,  8,  7,  6
         Row 1 (bot):  1,  2,  3,  4,  5
      */
      const GRID_SQUARES = [
        [20, 19, 18, 17, 16],
        [11, 12, 13, 14, 15],
        [10,  9,  8,  7,  6],
        [ 1,  2,  3,  4,  5]
      ];

      /* Web Audio Synthesizer */
      class SoundEngine {
        constructor() {
          this.ctx = null;
        }

        init() {
          if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
              this.ctx = new AudioCtx();
            }
          }
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        }

        play(type) {
          if (!state.soundEnabled) return;
          this.init();
          if (!this.ctx) return;

          try {
            const now = this.ctx.currentTime;
            switch (type) {
              case 'save': {
                // Rising two-tone confirmation
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.25);
                break;
              }
              case 'roll': {
                // Quick dice tumble rattling clicks
                for (let i = 0; i < 7; i++) {
                  const clickOsc = this.ctx.createOscillator();
                  const clickGain = this.ctx.createGain();
                  clickOsc.type = 'triangle';
                  clickOsc.frequency.setValueAtTime(150 + Math.random() * 300, now + i * 0.09);
                  clickGain.gain.setValueAtTime(0.15, now + i * 0.09);
                  clickGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.04);
                  clickOsc.connect(clickGain);
                  clickGain.connect(this.ctx.destination);
                  clickOsc.start(now + i * 0.09);
                  clickOsc.stop(now + i * 0.09 + 0.04);
                }
                break;
              }
              case 'step': {
                // Short upward hop tone
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.18);
                break;
              }
              case 'blocked': {
                // Dull thud / boing
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.25);
                break;
              }
              case 'ladder': {
                // Ascending bright arpeggio
                const freqs = [329.63, 440, 554.37, 659.25, 880];
                freqs.forEach((f, idx) => {
                  const osc = this.ctx.createOscillator();
                  const gain = this.ctx.createGain();
                  osc.type = 'triangle';
                  osc.frequency.setValueAtTime(f, now + idx * 0.08);
                  gain.gain.setValueAtTime(0.2, now + idx * 0.08);
                  gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.18);
                  osc.connect(gain);
                  gain.connect(this.ctx.destination);
                  osc.start(now + idx * 0.08);
                  osc.stop(now + idx * 0.08 + 0.18);
                });
                break;
              }
              case 'snake': {
                // Descending slide wobble
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(650, now);
                osc.frequency.exponentialRampToValueAtTime(140, now + 0.55);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.6);
                break;
              }
              case 'wrong': {
                // Double buzzer
                [0, 0.15].forEach(t => {
                  const osc = this.ctx.createOscillator();
                  const gain = this.ctx.createGain();
                  osc.type = 'sawtooth';
                  osc.frequency.setValueAtTime(140, now + t);
                  gain.gain.setValueAtTime(0.25, now + t);
                  gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.1);
                  osc.connect(gain);
                  gain.connect(this.ctx.destination);
                  osc.start(now + t);
                  osc.stop(now + t + 0.1);
                });
                break;
              }
              case 'correct': {
                // High bright chime
                const freqs = [587.33, 880, 1174.66];
                freqs.forEach((f, idx) => {
                  const osc = this.ctx.createOscillator();
                  const gain = this.ctx.createGain();
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(f, now + idx * 0.07);
                  gain.gain.setValueAtTime(0.22, now + idx * 0.07);
                  gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.28);
                  osc.connect(gain);
                  gain.connect(this.ctx.destination);
                  osc.start(now + idx * 0.07);
                  osc.stop(now + idx * 0.07 + 0.28);
                });
                break;
              }
              case 'trophy': {
                // Fanfare chord
                const chord = [523.25, 659.25, 783.99, 1046.50];
                chord.forEach(f => {
                  const osc = this.ctx.createOscillator();
                  const gain = this.ctx.createGain();
                  osc.type = 'triangle';
                  osc.frequency.setValueAtTime(f, now);
                  gain.gain.setValueAtTime(0.2, now);
                  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                  osc.connect(gain);
                  gain.connect(this.ctx.destination);
                  osc.start(now);
                  osc.stop(now + 0.6);
                });
                break;
              }
              case 'victory': {
                // Full celebratory melody
                const notes = [
                  { f: 523.25, t: 0, d: 0.15 },
                  { f: 523.25, t: 0.15, d: 0.15 },
                  { f: 523.25, t: 0.3, d: 0.15 },
                  { f: 659.25, t: 0.45, d: 0.35 },
                  { f: 587.33, t: 0.8, d: 0.15 },
                  { f: 659.25, t: 0.95, d: 0.15 },
                  { f: 783.99, t: 1.1, d: 0.6 }
                ];
                notes.forEach(n => {
                  const osc = this.ctx.createOscillator();
                  const gain = this.ctx.createGain();
                  osc.type = 'triangle';
                  osc.frequency.setValueAtTime(n.f, now + n.t);
                  gain.gain.setValueAtTime(0.25, now + n.t);
                  gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
                  osc.connect(gain);
                  gain.connect(this.ctx.destination);
                  osc.start(now + n.t);
                  osc.stop(now + n.t + n.d);
                });
                break;
              }
            }
          } catch (e) {
            console.error('Audio playback error', e);
          }
        }
      }

      const sounds = new SoundEngine();

      /* State Object */
      const state = {
        mode: 'vs-computer', // 'vs-computer' | 'local'
        playerCount: 2,
        savedNames: ['Player 1', 'CPU'],
        hasUnsavedNames: false,
        players: [],
        activeIndex: 0,
        rolledValue: null,
        busy: false,
        soundEnabled: true,
        questions: Array.from({ length: 20 }, () => ({ q: '', a: '' })),
        openSquare: null,
        gameOver: false,
        spinCounter: 0
      };

      /* Safe HTML escape */
      function escapeHtml(str) {
        if (!str) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      /* Safe LocalStorage helpers */
      function loadSavedNames() {
        try {
          const raw = localStorage.getItem('snakeTrailNames');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length >= 2) {
              state.savedNames = parsed.slice(0, 5).map(n => String(n).trim().slice(0, 22));
            }
          }
        } catch (e) {
          console.warn('Could not load saved names', e);
        }
      }

      function loadSavedQuestions() {
        try {
          const raw = localStorage.getItem('snakeTrailQuestions');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              for (let i = 0; i < 20; i++) {
                if (parsed[i] && typeof parsed[i] === 'object') {
                  state.questions[i] = {
                    q: String(parsed[i].q || '').trim(),
                    a: String(parsed[i].a || '').trim()
                  };
                }
              }
            }
          }
        } catch (e) {
          console.warn('Could not load saved questions', e);
        }
      }

      function announce(msg) {
        const el = document.getElementById('liveAnnounce');
        if (el) el.textContent = msg;
      }

      /* DOM Elements */
      const soundToggleBtn = document.getElementById('soundToggleBtn');
      const settingsView = document.getElementById('settingsView');
      const gameView = document.getElementById('gameView');
      const modeVsCpuBtn = document.getElementById('modeVsCpu');
      const modeLocalBtn = document.getElementById('modeLocal');
      const playerCountContainer = document.getElementById('playerCountContainer');
      const playerNamesGrid = document.getElementById('playerNamesGrid');
      const saveNamesBtn = document.getElementById('saveNamesBtn');
      const saveStatusIndicator = document.getElementById('saveStatusIndicator');
      const bulkQuestions = document.getElementById('bulkQuestions');
      const bulkAnswers = document.getElementById('bulkAnswers');
      const bulkSaveBtn = document.getElementById('bulkSaveBtn');
      const clearAllQuestionsBtn = document.getElementById('clearAllQuestionsBtn');
      const bulkStatusMsg = document.getElementById('bulkStatusMsg');
      const singleSquareSelect = document.getElementById('singleSquareSelect');
      const singleQuestionInput = document.getElementById('singleQuestionInput');
      const singleAnswerInput = document.getElementById('singleAnswerInput');
      const singleSaveBtn = document.getElementById('singleSaveBtn');
      const singleClearBtn = document.getElementById('singleClearBtn');
      const singleStatusMsg = document.getElementById('singleStatusMsg');
      const startGameBtn = document.getElementById('startGameBtn');
      const backToSettingsBtn = document.getElementById('backToSettingsBtn');
      const restartGameBtn = document.getElementById('restartGameBtn');
      const boardGrid = document.getElementById('boardGrid');
      const boardFrameInner = document.getElementById('boardFrameInner');
      const tokensLayer = document.getElementById('tokensLayer');
      const dockTokensArea = document.getElementById('dockTokensArea');
      const activePlayerDisplay = document.getElementById('activePlayerDisplay');
      const activePlayerNameText = document.getElementById('activePlayerNameText');
      const activeColorBadge = document.getElementById('activeColorBadge');
      const statusBox = document.getElementById('statusBox');
      const diceBtn = document.getElementById('diceBtn');
      const diceCube = document.getElementById('diceCube');
      const moveSpacesBtn = document.getElementById('moveSpacesBtn');
      const playersList = document.getElementById('playersList');
      const questionModal = document.getElementById('questionModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalQuestionText = document.getElementById('modalQuestionText');
      const modalAnswerInput = document.getElementById('modalAnswerInput');
      const modalFeedbackMsg = document.getElementById('modalFeedbackMsg');
      const closeModalBtn = document.getElementById('closeModalBtn');
      const submitAnswerBtn = document.getElementById('submitAnswerBtn');
      const victoryOverlay = document.getElementById('victoryOverlay');
      const victoryWinner = document.getElementById('victoryWinner');
      const victoryReason = document.getElementById('victoryReason');
      const playAgainBtn = document.getElementById('playAgainBtn');
      const confettiContainer = document.getElementById('confettiContainer');
      const snakeCryOverlay = document.getElementById('snakeCryOverlay');

      /* Initialization of Single Square Selector */
      function initSquareSelect() {
        singleSquareSelect.innerHTML = '';
        for (let i = 1; i <= 20; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = \`Square \${i}\`;
          singleSquareSelect.appendChild(opt);
        }
        updateSingleSquareInputs();
      }

      function updateSingleSquareInputs() {
        const sq = parseInt(singleSquareSelect.value, 10);
        const record = state.questions[sq - 1] || { q: '', a: '' };
        singleQuestionInput.value = record.q;
        singleAnswerInput.value = record.a;
        singleStatusMsg.style.display = 'none';
      }

      singleSquareSelect.addEventListener('change', updateSingleSquareInputs);

      /* Render Settings Player Names */
      function renderPlayerNameInputs() {
        playerNamesGrid.innerHTML = '';
        const count = state.mode === 'vs-computer' ? 2 : state.playerCount;

        for (let i = 0; i < count; i++) {
          const row = document.createElement('div');
          row.className = 'name-input-row';

          const dot = document.createElement('div');
          dot.className = 'token-dot-preview';
          dot.style.background = PLAYER_COLORS[i % PLAYER_COLORS.length];

          const input = document.createElement('input');
          input.type = 'text';
          input.className = 'name-input';
          input.maxLength = 22;

          if (state.mode === 'vs-computer' && i === 1) {
            input.value = 'CPU';
            input.disabled = true;
            input.setAttribute('aria-label', 'Player 2 (CPU)');
          } else {
            const fallback = \`P\${i + 1}\`;
            const currentVal = state.savedNames[i] !== undefined ? state.savedNames[i] : fallback;
            input.value = currentVal;
            input.placeholder = fallback;
            input.setAttribute('aria-label', \`Player \${i + 1} name\`);
            input.addEventListener('input', () => {
              state.hasUnsavedNames = true;
              saveStatusIndicator.textContent = 'Unsaved changes';
              saveStatusIndicator.className = 'save-status-indicator unsaved';
            });
          }

          row.appendChild(dot);
          row.appendChild(input);
          playerNamesGrid.appendChild(row);
        }
      }

      /* Save Names */
      saveNamesBtn.addEventListener('click', () => {
        const inputs = playerNamesGrid.querySelectorAll('.name-input');
        const newNames = [];
        inputs.forEach((input, idx) => {
          let val = input.value.trim().slice(0, 22);
          if (!val) {
            val = idx === 1 && state.mode === 'vs-computer' ? 'CPU' : \`P\${idx + 1}\`;
            input.value = val;
          }
          newNames.push(val);
        });

        state.savedNames = newNames;
        state.hasUnsavedNames = false;
        try {
          localStorage.setItem('snakeTrailNames', JSON.stringify(newNames));
        } catch (e) {
          console.warn('Could not save names to localStorage', e);
        }

        saveStatusIndicator.textContent = \`✓ \${newNames.length} names saved\`;
        saveStatusIndicator.className = 'save-status-indicator';
        sounds.play('save');
        announce(\`\${newNames.length} player names saved\`);
      });

      /* Mode & Count Listeners */
      modeVsCpuBtn.addEventListener('click', () => {
        state.mode = 'vs-computer';
        modeVsCpuBtn.setAttribute('aria-pressed', 'true');
        modeLocalBtn.setAttribute('aria-pressed', 'false');
        playerCountContainer.style.display = 'none';
        renderPlayerNameInputs();
      });

      modeLocalBtn.addEventListener('click', () => {
        state.mode = 'local';
        modeLocalBtn.setAttribute('aria-pressed', 'true');
        modeVsCpuBtn.setAttribute('aria-pressed', 'false');
        playerCountContainer.style.display = 'flex';
        renderPlayerNameInputs();
      });

      playerCountContainer.querySelectorAll('.count-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          playerCountContainer.querySelectorAll('.count-btn').forEach(b => b.setAttribute('aria-pressed', 'false'));
          btn.setAttribute('aria-pressed', 'true');
          state.playerCount = parseInt(btn.dataset.count, 10);
          renderPlayerNameInputs();
        });
      });

      /* Question Editor - Single Square Save / Clear */
      singleSaveBtn.addEventListener('click', () => {
        const sq = parseInt(singleSquareSelect.value, 10);
        const q = singleQuestionInput.value.trim();
        const a = singleAnswerInput.value.trim();

        if (!q && !a) {
          singleStatusMsg.textContent = 'Please enter a question or clear the square.';
          singleStatusMsg.className = 'feedback-msg error';
          singleStatusMsg.style.display = 'block';
          return;
        }

        state.questions[sq - 1] = { q, a };
        try {
          localStorage.setItem('snakeTrailQuestions', JSON.stringify(state.questions));
        } catch (e) {}

        singleStatusMsg.textContent = \`✓ Square \${sq} saved successfully!\`;
        singleStatusMsg.className = 'feedback-msg success';
        singleStatusMsg.style.display = 'block';
        sounds.play('save');
        renderBoardQuestionButtons();
      });

      singleClearBtn.addEventListener('click', () => {
        const sq = parseInt(singleSquareSelect.value, 10);
        state.questions[sq - 1] = { q: '', a: '' };
        singleQuestionInput.value = '';
        singleAnswerInput.value = '';
        try {
          localStorage.setItem('snakeTrailQuestions', JSON.stringify(state.questions));
        } catch (e) {}

        singleStatusMsg.textContent = \`✓ Square \${sq} question cleared.\`;
        singleStatusMsg.className = 'feedback-msg success';
        singleStatusMsg.style.display = 'block';
        sounds.play('save');
        renderBoardQuestionButtons();
      });

      /* Bulk Question Import */
      bulkSaveBtn.addEventListener('click', () => {
        const qLines = bulkQuestions.value.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
        const aLines = bulkAnswers.value.split('\\n').map(l => l.trim()).filter(l => l.length > 0);

        if (qLines.length === 0 || aLines.length === 0) {
          bulkStatusMsg.textContent = 'Please enter both questions and answers.';
          bulkStatusMsg.className = 'feedback-msg error';
          bulkStatusMsg.style.display = 'block';
          sounds.play('wrong');
          return;
        }

        if (qLines.length !== aLines.length) {
          bulkStatusMsg.textContent = \`Count mismatch: \${qLines.length} questions and \${aLines.length} answers. Counts must match!\`;
          bulkStatusMsg.className = 'feedback-msg error';
          bulkStatusMsg.style.display = 'block';
          sounds.play('wrong');
          return;
        }

        const count = Math.min(20, qLines.length);
        for (let i = 0; i < count; i++) {
          state.questions[i] = { q: qLines[i], a: aLines[i] };
        }

        try {
          localStorage.setItem('snakeTrailQuestions', JSON.stringify(state.questions));
        } catch (e) {}

        bulkStatusMsg.textContent = \`✓ Successfully saved \${count} questions to squares 1 through \${count}!\`;
        bulkStatusMsg.className = 'feedback-msg success';
        bulkStatusMsg.style.display = 'block';
        sounds.play('save');
        updateSingleSquareInputs();
        renderBoardQuestionButtons();
      });

      clearAllQuestionsBtn.addEventListener('click', () => {
        state.questions = Array.from({ length: 20 }, () => ({ q: '', a: '' }));
        bulkQuestions.value = '';
        bulkAnswers.value = '';
        try {
          localStorage.setItem('snakeTrailQuestions', JSON.stringify(state.questions));
        } catch (e) {}

        bulkStatusMsg.textContent = 'All 20 square questions cleared.';
        bulkStatusMsg.className = 'feedback-msg success';
        bulkStatusMsg.style.display = 'block';
        sounds.play('save');
        updateSingleSquareInputs();
        renderBoardQuestionButtons();
      });

      /* Sound Toggle */
      soundToggleBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        if (state.soundEnabled) {
          soundToggleBtn.innerHTML = '🔊 Sound on';
          soundToggleBtn.setAttribute('aria-pressed', 'true');
          sounds.init();
          sounds.play('step');
        } else {
          soundToggleBtn.innerHTML = '🔇 Sound off';
          soundToggleBtn.setAttribute('aria-pressed', 'false');
        }
      });

      /* Render Board Grid with Serpentine Order and Question Buttons */
      function renderBoardGrid() {
        boardGrid.innerHTML = '';
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 5; c++) {
            const sqNum = GRID_SQUARES[r][c];
            const sqDiv = document.createElement('div');
            sqDiv.className = 'board-square';
            sqDiv.dataset.square = sqNum;
            sqDiv.setAttribute('id', \`square-\${sqNum}\`);

            // Question mark button
            const qBtn = document.createElement('button');
            qBtn.type = 'button';
            qBtn.className = \`question-btn col-color-\${getColumnColorName(c)}\`;
            qBtn.dataset.square = sqNum;
            qBtn.setAttribute('aria-label', \`Open question for square \${sqNum}\`);
            qBtn.textContent = '?';

            // Check if saved question exists
            const record = state.questions[sqNum - 1];
            if (record && record.q) {
              qBtn.classList.add('has-question');
            }

            qBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              handleQuestionClick(sqNum);
            });

            sqDiv.appendChild(qBtn);
            boardGrid.appendChild(sqDiv);
          }
        }
      }

      function getColumnColorName(colIdx) {
        const names = ['green', 'blue', 'purple', 'coral', 'orange'];
        return names[colIdx % names.length];
      }

      function renderBoardQuestionButtons() {
        const buttons = boardGrid.querySelectorAll('.question-btn');
        buttons.forEach(btn => {
          const sqNum = parseInt(btn.dataset.square, 10);
          const record = state.questions[sqNum - 1];
          if (record && record.q) {
            btn.classList.add('has-question');
          } else {
            btn.classList.remove('has-question');
          }
        });
      }

      /* Game Initialization & Player Setup */
      function setupGame() {
        const count = state.mode === 'vs-computer' ? 2 : state.playerCount;
        state.players = [];

        for (let i = 0; i < count; i++) {
          let name = state.savedNames[i];
          if (!name || !name.trim()) {
            name = (state.mode === 'vs-computer' && i === 1) ? 'CPU' : \`P\${i + 1}\`;
          }
          state.players.push({
            id: i,
            name: name.slice(0, 22),
            color: PLAYER_COLORS[i % PLAYER_COLORS.length],
            position: 0,
            trophies: 0,
            earnedSquares: new Set(),
            isCpu: state.mode === 'vs-computer' && i === 1
          });
        }

        state.activeIndex = 0;
        state.rolledValue = null;
        state.busy = false;
        state.gameOver = false;
        state.openSquare = null;
        hideMoveSpacesButton();

        renderPlayersList();
        updateActivePlayerDisplay();
        setStatus('Click the dice to roll.');

        // Initialize dock tokens and board tokens
        renderTokens();
        requestAnimationFrame(() => renderTokens());
      }

      function renderPlayersList() {
        playersList.innerHTML = '';
        state.players.forEach((p, idx) => {
          const row = document.createElement('div');
          row.className = \`player-row \${idx === state.activeIndex ? 'active' : ''}\`;
          row.id = \`playerRow-\${idx}\`;

          const left = document.createElement('div');
          left.className = 'player-info-left';

          const dot = document.createElement('div');
          dot.className = 'player-row-dot';
          dot.style.background = p.color;

          const nameSpan = document.createElement('span');
          nameSpan.className = 'player-row-name';
          nameSpan.textContent = p.name;

          left.appendChild(dot);
          left.appendChild(nameSpan);

          const trophySpan = document.createElement('span');
          trophySpan.className = 'player-row-trophies';
          trophySpan.id = \`trophyCount-\${idx}\`;
          trophySpan.textContent = \`🏆 \${p.trophies}/5\`;

          row.appendChild(left);
          row.appendChild(trophySpan);
          playersList.appendChild(row);
        });
      }

      function updateActivePlayerDisplay() {
        const activeP = state.players[state.activeIndex];
        if (!activeP) return;

        activePlayerNameText.textContent = activeP.name;
        activeColorBadge.style.background = activeP.color;

        // Update active outline in list
        state.players.forEach((_, idx) => {
          const row = document.getElementById(\`playerRow-\${idx}\`);
          if (row) {
            if (idx === state.activeIndex) row.classList.add('active');
            else row.classList.remove('active');
          }
        });
      }

      function setStatus(text) {
        statusBox.textContent = text;
        announce(text);
      }

      /* Token Positioning Math:
         Dock: tokens at position 0 rest inside #dockTokensArea
         Board: tokens at position 1..20 are placed inside #tokensLayer
         Lone token center offset = 0px on both axes (geometric center of square)!
         Multiple tokens on same square form centered cluster:
         - 2 tokens: -dx, 0 and +dx, 0
         - 3 tokens: (-dx, -dy), (+dx, -dy), (0, +dy)
         - 4 tokens: (-dx, -dy), (+dx, -dy), (-dx, +dy), (+dx, +dy)
         - 5 tokens: (-dx, -dy), (+dx, -dy), (-dx, +dy), (+dx, +dy), (0, 0)
      */
      function renderTokens() {
        dockTokensArea.innerHTML = '';
        tokensLayer.innerHTML = '';

        const squareGroups = {};
        state.players.forEach(p => {
          if (!squareGroups[p.position]) squareGroups[p.position] = [];
          squareGroups[p.position].push(p);
        });

        // 1. Position 0 -> In dock
        if (squareGroups[0]) {
          squareGroups[0].forEach(p => {
            const token = createTokenElement(p, true);
            dockTokensArea.appendChild(token);
          });
        }

        // 2. Positions 1..20 -> On board
        const boardInnerRect = boardFrameInner.getBoundingClientRect();

        Object.keys(squareGroups).forEach(posStr => {
          const pos = parseInt(posStr, 10);
          if (pos < 1 || pos > 20) return;

          const group = squareGroups[pos];
          const sqElem = document.getElementById(\`square-\${pos}\`);
          if (!sqElem) return;

          const sqRect = sqElem.getBoundingClientRect();
          const sqCenterX = (sqRect.left + sqRect.width / 2) - boardInnerRect.left;
          const sqCenterY = (sqRect.top + sqRect.height / 2) - boardInnerRect.top;

          const offsets = calculateClusterOffsets(group.length, sqRect.width, sqRect.height);

          group.forEach((p, idx) => {
            const token = createTokenElement(p, false);
            tokensLayer.appendChild(token);

            const tokenW = token.offsetWidth || 34;
            const tokenH = token.offsetHeight || 34;

            const off = offsets[idx];
            const finalLeft = sqCenterX + off.x - tokenW / 2;
            const finalTop = sqCenterY + off.y - tokenH / 2;

            token.style.left = \`\${finalLeft}px\`;
            token.style.top = \`\${finalTop}px\`;
          });
        });
      }

      function createTokenElement(p, inDock) {
        const token = document.createElement('div');
        token.className = \`player-token \${inDock ? 'in-dock' : ''}\`;
        token.id = \`token-\${p.id}\`;
        token.style.background = p.color;
        token.textContent = p.isCpu ? 'C' : (p.id + 1);
        token.setAttribute('aria-label', \`\${p.name} token, square \${p.position}\`);
        return token;
      }

      function calculateClusterOffsets(count, sqW, sqH) {
        if (count <= 1) {
          return [{ x: 0, y: 0 }];
        }

        const dx = Math.min(sqW * 0.18, 14);
        const dy = Math.min(sqH * 0.18, 14);

        if (count === 2) {
          return [
            { x: -dx, y: 0 },
            { x: dx, y: 0 }
          ];
        }

        if (count === 3) {
          return [
            { x: -dx, y: -dy },
            { x: dx, y: -dy },
            { x: 0, y: dy }
          ];
        }

        if (count === 4) {
          return [
            { x: -dx, y: -dy },
            { x: dx, y: -dy },
            { x: -dx, y: dy },
            { x: dx, y: dy }
          ];
        }

        // 5 players
        return [
          { x: -dx, y: -dy },
          { x: dx, y: -dy },
          { x: -dx, y: dy },
          { x: dx, y: dy },
          { x: 0, y: 0 }
        ];
      }

      window.addEventListener('resize', () => {
        if (gameView.classList.contains('active')) {
          renderTokens();
        }
      });

      /* 3D Dice Roll & Rotation */
      diceBtn.addEventListener('click', () => {
        if (state.busy || state.gameOver) return;
        const currentP = state.players[state.activeIndex];
        if (currentP.isCpu) return;

        triggerDiceRoll();
      });

      function triggerDiceRoll() {
        if (state.busy) return;
        state.busy = true;
        diceBtn.disabled = true;
        hideMoveSpacesButton();

        sounds.play('roll');
        diceCube.classList.add('rolling');

        // Random roll value 1..6
        const rollVal = Math.floor(Math.random() * 6) + 1;
        state.rolledValue = rollVal;

        let targetX = 0;
        let targetY = 0;

        switch (rollVal) {
          case 1: targetX = 0;   targetY = 0; break;
          case 2: targetX = 0;   targetY = -90; break;
          case 3: targetX = 0;   targetY = -180; break;
          case 4: targetX = 0;   targetY = 90; break;
          case 5: targetX = -90; targetY = 0; break;
          case 6: targetX = 90;  targetY = 0; break;
        }

        state.spinCounter += 2;
        const spinTurnsX = state.spinCounter * 360;
        const spinTurnsY = (state.spinCounter + 1) * 360;

        // Resting tilt: -12deg X, +16deg Y
        const finalX = spinTurnsX + targetX - 12;
        const finalY = spinTurnsY + targetY + 16;

        diceCube.style.transform = \`rotateX(\${finalX}deg) rotateY(\${finalY}deg)\`;

        setTimeout(() => {
          diceCube.classList.remove('rolling');
          state.busy = false;

          const activeP = state.players[state.activeIndex];
          setStatus(\`\${activeP.name} rolled a \${rollVal}!\`);

          if (!activeP.isCpu) {
            showMoveSpacesButton(rollVal);
          } else {
            setTimeout(() => {
              executeMove(activeP, rollVal);
            }, 800);
          }
        }, 1000);
      }

      function showMoveSpacesButton(val) {
        const text = val === 1 ? 'Move 1 space' : \`Move \${val} spaces\`;
        moveSpacesBtn.textContent = text;
        moveSpacesBtn.classList.add('visible');
      }

      function hideMoveSpacesButton() {
        moveSpacesBtn.classList.remove('visible');
      }

      moveSpacesBtn.addEventListener('click', () => {
        if (state.busy || state.gameOver) return;
        const activeP = state.players[state.activeIndex];
        if (activeP.isCpu) return;

        hideMoveSpacesButton();
        executeMove(activeP, state.rolledValue);
      });

      /* Step-by-Step Movement Logic */
      async function executeMove(player, rollVal) {
        state.busy = true;
        diceBtn.disabled = true;

        const currentPos = player.position;
        const targetPos = currentPos + rollVal;

        // Check if roll exceeds 20
        if (targetPos > 20) {
          setStatus(\`\${player.name} needs an exact roll. The token stays put.\`);
          sounds.play('blocked');
          await delay(1200);
          state.busy = false;
          passTurn();
          return;
        }

        // Hop square by square
        for (let nextSq = currentPos + 1; nextSq <= targetPos; nextSq++) {
          player.position = nextSq;
          sounds.play('step');
          renderTokens();

          const tokenElem = document.getElementById(\`token-\${player.id}\`);
          if (tokenElem) {
            tokenElem.classList.add('hopping');
            setTimeout(() => tokenElem.classList.remove('hopping'), 150);
          }

          await delay(250);
        }

        // Check win condition by reaching square 20
        if (player.position === 20) {
          triggerVictory(player, 'reached square 20!');
          return;
        }

        // Check Ladders
        if (LADDERS[player.position]) {
          const dest = LADDERS[player.position];
          setStatus(\`Ladder! \${player.name} climbs to square \${dest}.\`);
          sounds.play('ladder');
          await delay(400);

          player.position = dest;
          renderTokens();
          await delay(700);

          if (player.position === 20) {
            triggerVictory(player, 'reached square 20 via ladder!');
            return;
          }
        }
        // Check Snakes
        else if (SNAKES[player.position]) {
          const dest = SNAKES[player.position];
          setStatus(\`Oh no! A snake bites \${player.name} and slides the token down to square \${dest}.\`);
          sounds.play('snake');

          showSnakeCry();
          await delay(500);

          player.position = dest;
          renderTokens();
          await delay(800);
        }

        state.busy = false;
        passTurn();
      }

      function showSnakeCry() {
        snakeCryOverlay.style.display = 'flex';
        setTimeout(() => {
          snakeCryOverlay.style.display = 'none';
        }, 1200);
      }

      function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      /* Turn Management */
      function passTurn() {
        if (state.gameOver) return;

        state.activeIndex = (state.activeIndex + 1) % state.players.length;
        state.rolledValue = null;
        updateActivePlayerDisplay();

        const nextP = state.players[state.activeIndex];
        if (nextP.isCpu) {
          setStatus(\`\${nextP.name} is thinking...\`);
          diceBtn.disabled = true;
          setTimeout(() => {
            if (!state.gameOver) {
              triggerDiceRoll();
            }
          }, 1100);
        } else {
          setStatus('Click the dice to roll.');
          diceBtn.disabled = false;
        }
      }

      /* Question Modal and Answer Verification */
      function handleQuestionClick(sqNum) {
        if (state.busy || state.gameOver) return;
        const activeP = state.players[state.activeIndex];
        if (activeP.isCpu) return;

        const record = state.questions[sqNum - 1];
        if (!record || !record.q) {
          setStatus(\`No question is saved for square \${sqNum} yet. Add it in settings.\`);
          sounds.play('blocked');
          return;
        }

        // Open modal
        state.openSquare = sqNum;
        modalTitle.textContent = \`Square \${sqNum} question\`;
        modalQuestionText.textContent = record.q;
        modalAnswerInput.value = '';
        modalFeedbackMsg.textContent = '';
        modalFeedbackMsg.className = 'modal-feedback';
        questionModal.classList.add('active');
        modalAnswerInput.focus();
      }

      function checkQuestionAnswer() {
        if (state.openSquare === null) return;
        const sq = state.openSquare;
        const record = state.questions[sq - 1];
        const player = state.players[state.activeIndex];

        const userAns = modalAnswerInput.value.trim().replace(/\\s+/g, ' ').toLowerCase();
        const expectedAns = (record.a || '').trim().replace(/\\s+/g, ' ').toLowerCase();

        if (userAns !== expectedAns) {
          modalFeedbackMsg.textContent = 'Not quite—try again. Check spelling and spacing.';
          modalFeedbackMsg.className = 'modal-feedback error';
          sounds.play('wrong');
          announce('Not quite—try again. Check spelling and spacing.');
          return;
        }

        // Check if trophy already earned from this square
        if (player.earnedSquares.has(sq)) {
          modalFeedbackMsg.textContent = 'Correct! You already earned the trophy for this square.';
          modalFeedbackMsg.className = 'modal-feedback success';
          sounds.play('correct');
          announce('Correct! You already earned the trophy for this square.');
          return;
        }

        // Award trophy
        player.earnedSquares.add(sq);
        player.trophies++;
        sounds.play('trophy');

        // Update trophies display
        const countSpan = document.getElementById(\`trophyCount-\${player.id}\`);
        if (countSpan) countSpan.textContent = \`🏆 \${player.trophies}/5\`;

        modalFeedbackMsg.textContent = 'Correct! Trophy earned! ✨🏆';
        modalFeedbackMsg.className = 'modal-feedback success';
        announce('Correct! Trophy earned!');

        // Check 5 trophies win condition
        if (player.trophies >= 5) {
          setTimeout(() => {
            closeQuestionModal();
            player.position = 20;
            renderTokens();
            triggerVictory(player, 'collected five trophies!');
          }, 800);
        }
      }

      function closeQuestionModal() {
        questionModal.classList.remove('active');
        state.openSquare = null;
      }

      closeModalBtn.addEventListener('click', closeQuestionModal);
      submitAnswerBtn.addEventListener('click', checkQuestionAnswer);

      modalAnswerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          checkQuestionAnswer();
        } else if (e.key === 'Escape') {
          closeQuestionModal();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && questionModal.classList.contains('active')) {
          closeQuestionModal();
        }
      });

      /* Victory Celebration & Confetti */
      function triggerVictory(player, reasonText) {
        state.gameOver = true;
        state.busy = true;
        hideMoveSpacesButton();

        victoryWinner.textContent = \`\${player.name} wins!\`;
        victoryReason.textContent = reasonText.charAt(0).toUpperCase() + reasonText.slice(1);
        victoryOverlay.classList.add('active');

        sounds.play('victory');
        announce(\`Victory! \${player.name} won! \${reasonText}\`);

        generateConfetti(90);
      }

      function generateConfetti(count) {
        confettiContainer.innerHTML = '';
        const colors = ['#ffd700', '#40e8ff', '#ff5d66', '#22c55e', '#a855f7', '#fb923c'];

        for (let i = 0; i < count; i++) {
          const piece = document.createElement('div');
          piece.className = 'confetti-piece';
          piece.style.left = \`\${Math.random() * 100}vw\`;
          piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          piece.style.animationDuration = \`\${2 + Math.random() * 2.5}s\`;
          piece.style.animationDelay = \`\${Math.random() * 0.8}s\`;
          piece.style.width = \`\${8 + Math.random() * 6}px\`;
          piece.style.height = \`\${12 + Math.random() * 10}px\`;
          confettiContainer.appendChild(piece);
        }
      }

      playAgainBtn.addEventListener('click', () => {
        victoryOverlay.classList.remove('active');
        confettiContainer.innerHTML = '';
        setupGame();
      });

      /* Game Screen Navigation */
      startGameBtn.addEventListener('click', () => {
        settingsView.classList.remove('active');
        gameView.classList.add('active');
        setupGame();
      });

      backToSettingsBtn.addEventListener('click', () => {
        gameView.classList.remove('active');
        settingsView.classList.add('active');
        renderPlayerNameInputs();
      });

      restartGameBtn.addEventListener('click', () => {
        setupGame();
        setStatus('Game restarted. Click the dice to roll.');
        sounds.play('save');
      });

      /* Initial Startup */
      loadSavedNames();
      loadSavedQuestions();
      initSquareSelect();
      renderPlayerNameInputs();
      renderBoardGrid();
    })();
  </script>
</body>
</html>`;

fs.writeFileSync("snake-learning-game-latest-edition.html", htmlContent);
fs.writeFileSync("index.html", htmlContent);
console.log("Both files written successfully!");
