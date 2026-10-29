# Arun & Krishna — Wedding Invitation Website 🪷

An heirloom, classic English-style digital wedding invitation website crafted for **Arun & Krishna**.

- **Wedding Date**: 08 December 2026
- **Ring Exchange & Ceremony**: Stafford, Staffordshire, England · 10:00 AM *(Private Intimate Ceremony for Close Family)*
- **Guest Wedding Reception & Banquet**: Birmingham, West Midlands, England · 1:00 PM onwards *(All Guests Cordially Invited)*
- **Theme Palette**: Sunset Jewel Palette — Cream (`#F5DDA9`), Orange (`#F2A25F`), Dusty Rose (`#C4707A`), Raspberry (`#9E4568`), Mauve (`#A66E98`), and Deep Purple (`#722E78`)
- **Soundtrack**: *"Dheera Dheera"* (Magadheera)

---

## ✨ Features

- **Interactive Envelope Unboxing**: Realistic 3D wax seal with monogram ("A & K" / Lotus crest) that cracks open to reveal the card with drifting lotus petals.
- **Guest Personalization**: Pass `?guest=Name` in the URL (e.g. `?guest=Lord%20%26%20Lady%20Harrington`) to personalize the greeting and RSVP form.
- **Soundtrack Player**: Floating music widget playing *"Dheera Dheera"* with live equalizer bar animation and play/pause controls.
- **Live Countdown**: Precision countdown to December 8, 2026, 10:00 AM GMT.
- **Our Story**: Chapter timeline highlighting the couple's journey.
- **Order of the Day**: Formatted English wedding schedule spanning the Stafford Ring Exchange, Midlands Transfer, Birmingham Wedding Banquet, and Evening Dancing.
- **Dual Venue & Travel Journey**: Dual venue interactive cards, Google Maps route integration, M6/A34 driving directions (~35 min), direct West Coast Main Line train details (Stafford Station to Birmingham New Street), and hotel recommendations.
- **Dress Code Guide**: Visual color palette swatches with etiquette recommendations.
- **RSVP & Guest Book**: Interactive attendance response form with dietary options and real-time wish submission.
- **Mobile Responsive**: Fully tested and fluid on smartphone viewports (320px–480px), tablets, and desktops.

---

## 🚀 Getting Started

Simply open `index.html` in any modern web browser or serve with a local static web server:

```bash
# Using PowerShell (Windows native, zero dependencies)
powershell -ExecutionPolicy Bypass -File .\server.ps1

# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .
```

Open `http://localhost:8080/?guest=Your%20Name` to preview with personalization.
