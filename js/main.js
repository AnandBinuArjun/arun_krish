/**
 * ENGLISH WEDDING INVITATION — ARUN & KRISHNA
 * Core JavaScript Logic: Envelope Unboxing, Web Audio Harp, Rose Petals, Side Dots, RSVP & Wishes
 * Enhanced with features inspired by Pooja & Saroop reference
 */

(function () {
  'use strict';

  // Wedding Configuration
  const WEDDING_CONFIG = {
    couple: 'Arun & Krishna',
    dateISO: '2026-12-08T10:00:00Z',
    venue: 'Reception: Birmingham, West Midlands, England (Private Ceremony: Stafford)',
    hashtag: '#ArunWedsKrishna2026',
    // ── Google Sheets RSVP endpoint ──────────────────────────────────────────
    // Paste your deployed Apps Script Web App URL here after following setup:
    googleSheetUrl: 'https://script.google.com/macros/s/AKfycbyooym-pJs1QtyvhS3j1NI3oTtdSg1e72lawFXQv-CKegGl-6g882QgV4MeOv6Hcj_J/exec'
  };

  // State
  let isEnvelopeOpen = false;
  let isAudioPlaying = false;
  let audioCtx = null;
  let audioTimer = null;
  let petalsRunning = true;

  /* ==========================================================================
     1. INITIALIZATION & PERSONALIZED GUEST URL GREETING
     ========================================================================== */
  function initPersonalization() {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get('guest');

    const guestDisplayEl = document.getElementById('envelope-guest-name');
    const heroGuestGreetingEl = document.getElementById('hero-guest-greeting');
    const rsvpNameInput = document.getElementById('rsvp-name');

    if (guestParam) {
      const cleanGuestName = decodeURIComponent(guestParam).trim();
      if (guestDisplayEl) {
        guestDisplayEl.textContent = cleanGuestName;
      }
      if (heroGuestGreetingEl) {
        heroGuestGreetingEl.textContent = `A Personal Invitation for ${cleanGuestName}`;
        heroGuestGreetingEl.style.display = 'block';
      }
      if (rsvpNameInput && !rsvpNameInput.value) {
        rsvpNameInput.value = cleanGuestName;
      }
    }
  }

  /* ==========================================================================
     2. ENVELOPE UNBOXING & WAX SEAL INTERACTION
     ========================================================================== */
  function initEnvelope() {
    const envelopeStage = document.getElementById('envelope-stage');
    const waxSeal = document.getElementById('wax-seal');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const pageWrapper = document.getElementById('page-wrapper');

    if (!envelopeStage || !waxSeal) return;

    // Lock page scroll while envelope is closed
    if (!envelopeStage.classList.contains('opened')) {
      document.body.style.overflow = 'hidden';
    }

    function revealInvitation() {
      envelopeStage.classList.add('opened');
      pageWrapper.classList.add('revealed');
      document.body.classList.add('invitation-opened');
      document.body.style.overflow = 'auto';

      // After the CSS opacity transition (1.2s), mark as done to set display:none
      setTimeout(() => {
        envelopeStage.classList.add('done');
      }, 1300);
    }

    function openEnvelope() {
      if (isEnvelopeOpen) return;
      isEnvelopeOpen = true;

      // 1. Crack Wax Seal
      waxSeal.classList.add('cracked');
      envelopeStage.classList.add('animating');

      // 2. Play Audio Melody ('Dheera Dheera')
      playWeddingSong();

      // 3. Trigger Burst of Falling Petals
      try { burstPetals(30); } catch (e) { }

      // 4. Slide Card & Reveal Page after animation settles
      setTimeout(revealInvitation, 950);
    }

    const promptPillBtn = document.getElementById('prompt-pill-btn');

    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });

    waxSeal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });

    envelopeWrapper.addEventListener('click', openEnvelope);
    envelopeWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });

    if (promptPillBtn) {
      promptPillBtn.addEventListener('click', openEnvelope);
      promptPillBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openEnvelope();
        }
      });
    }

    // Skip button (top-right corner)
    const skipBtn = document.getElementById('skip-envelope-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        isEnvelopeOpen = true;
        waxSeal.classList.add('cracked');
        envelopeStage.classList.add('animating');
        // Instant reveal with no delay
        revealInvitation();
      });
    }

    // Keyboard shortcut: Escape or Enter to skip to invitation
    document.addEventListener('keydown', (e) => {
      if (!isEnvelopeOpen && (e.key === 'Escape')) {
        openEnvelope();
      }
    });

    // Replay opening button
    const replayBtn = document.getElementById('replay-envelope-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        isEnvelopeOpen = false;
        waxSeal.classList.remove('cracked');
        envelopeStage.classList.remove('animating', 'opened', 'done');
        document.body.classList.remove('invitation-opened');
        document.body.style.overflow = 'hidden';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ==========================================================================
     3. AUDIO PLAYER: 'DHEERA DHEERA' & FLOATING EQUALIZER WIDGET
     ========================================================================== */
  function getAudioEl() {
    return document.getElementById('wedding-audio');
  }

  function playWeddingSong() {
    const audio = getAudioEl();
    if (!audio) return;

    audio.volume = 0.85;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        isAudioPlaying = true;
        updateAudioButtonUI(true);
      }).catch((err) => {
        console.warn('Audio play prevented or deferred by browser policy:', err);
        if (typeof startHarpMelody === 'function') {
          startHarpMelody();
        }
      });
    }
  }

  function pauseWeddingSong() {
    const audio = getAudioEl();
    if (audio) {
      audio.pause();
    }
    if (typeof stopHarpMelody === 'function') {
      stopHarpMelody();
    }
    isAudioPlaying = false;
    updateAudioButtonUI(false);
  }

  function toggleAudio() {
    if (isAudioPlaying) {
      pauseWeddingSong();
    } else {
      playWeddingSong();
    }
  }

  function updateAudioButtonUI(playing) {
    const audioWidget = document.getElementById('floating-audio-widget');
    if (audioWidget) {
      if (playing) {
        audioWidget.classList.add('playing');
        audioWidget.setAttribute('title', "Pause 'Dheera Dheera'");
      } else {
        audioWidget.classList.remove('playing');
        audioWidget.setAttribute('title', "Play 'Dheera Dheera'");
      }
    }
  }

  function initAudioControls() {
    const audioWidget = document.getElementById('floating-audio-widget');
    if (audioWidget) {
      audioWidget.addEventListener('click', toggleAudio);
      audioWidget.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleAudio();
        }
      });
    }

    const audio = getAudioEl();
    if (audio) {
      audio.addEventListener('play', () => {
        isAudioPlaying = true;
        updateAudioButtonUI(true);
      });
      audio.addEventListener('pause', () => {
        isAudioPlaying = false;
        updateAudioButtonUI(false);
      });
    }
  }

  /* ==========================================================================
     4. FALLING ENGLISH ROSE PETALS & CONFETTI (CANVAS PHYSICS)
     ========================================================================== */
  const petals = [];

  class LotusParticle {
    constructor(x, y, isBurst = false) {
      this.x = x ?? Math.random() * window.innerWidth;
      this.y = y ?? -25;
      // Petal variety: 0 = Royal Raspberry & Dusty Rose, 1 = Mauve & Deep Purple, 2 = Saffron Orange & Cream
      const rand = Math.random();
      this.type = rand < 0.55 ? 0 : (rand < 0.82 ? 1 : 2);
      this.size = Math.random() * 12 + 10;
      this.speedY = isBurst ? Math.random() * 2.5 + 1.5 : Math.random() * 0.6 + 0.35;
      this.speedX = Math.random() * 1.2 - 0.6;
      this.angle = Math.random() * 360;
      this.angularSpeed = (Math.random() - 0.5) * 1.2;
      this.flipAngle = Math.random() * 360;
      this.flipSpeed = Math.random() * 0.025 + 0.008;
      this.oscillationSpeed = Math.random() * 0.018 + 0.006;
      this.oscillationDistance = Math.random() * 18 + 8;
      this.oscillationOffset = Math.random() * 100;
      this.opacity = Math.random() * 0.3 + 0.4;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * this.oscillationSpeed + this.oscillationOffset) * 0.8 + this.speedX;
      this.angle += this.angularSpeed;
      this.flipAngle += this.flipSpeed;

      if (this.y > window.innerHeight + 35) {
        this.y = -25;
        this.x = Math.random() * window.innerWidth;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      const flipScale = Math.cos(this.flipAngle);
      ctx.scale(flipScale, 1);
      ctx.globalAlpha = this.opacity;

      const grad = ctx.createLinearGradient(0, this.size, 0, -this.size);

      if (this.type === 0) {
        // Royal Raspberry & Dusty Rose with Cream base
        grad.addColorStop(0, '#F5DDA9'); // Cream base
        grad.addColorStop(0.35, '#ECD2D6'); // Soft Blush
        grad.addColorStop(0.7, '#C4707A'); // Dusty Rose
        grad.addColorStop(1, '#9E4568'); // Raspberry tip
      } else if (this.type === 1) {
        // Regal Mauve into Imperial Deep Purple
        grad.addColorStop(0, '#F9EFF6'); // Mauve whisper
        grad.addColorStop(0.4, '#C598BB'); // Soft Mauve
        grad.addColorStop(0.75, '#A66E98'); // Mauve
        grad.addColorStop(1, '#722E78'); // Deep Purple apex
      } else {
        // Sunset Saffron Orange & Warm Cream
        grad.addColorStop(0, '#FDFBF7'); // Ivory Cream
        grad.addColorStop(0.4, '#F5DDA9'); // Cream
        grad.addColorStop(0.8, '#F2A25F'); // Saffron Orange
        grad.addColorStop(1, '#D97834'); // Warm Amber
      }
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(0, -this.size); // Pointed Lotus/Rose tip
      ctx.bezierCurveTo(this.size * 0.65, -this.size * 0.4, this.size * 0.72, this.size * 0.45, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.72, this.size * 0.45, -this.size * 0.65, -this.size * 0.4, 0, -this.size);
      ctx.fill();

      // Shimmering petal curve highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, this.size * 0.65);
      ctx.quadraticCurveTo(this.size * 0.12, 0, 0, -this.size * 0.7);
      ctx.stroke();

      ctx.restore();
    }
  }

  function burstPetals(count = 50) {
    for (let i = 0; i < count; i++) {
      petals.push(new LotusParticle(
        window.innerWidth / 2 + (Math.random() - 0.5) * 320,
        window.innerHeight / 2 + (Math.random() - 0.5) * 220,
        true
      ));
    }
  }

  function initPetalsCanvas() {
    const canvas = document.getElementById('petal-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 12; i++) {
      petals.push(new LotusParticle(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
    }

    function animate() {
      if (petalsRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < petals.length; i++) {
          petals[i].update();
          petals[i].draw(ctx);
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ==========================================================================
     5. GOLDEN SPARKLE CURSOR TRAIL (DESKTOP)
     ========================================================================== */
  function initSparkleCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = document.getElementById('sparkle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    const sparkles = [];

    class Sparkle {
      constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 8;
        this.y = y + (Math.random() - 0.5) * 8;
        this.size = Math.random() * 3 + 1.5;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.015;
        const sparkleColors = ['#F2A25F', '#F5DDA9', '#C4707A', '#FBF6EA'];
        this.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
      }
      update() {
        this.alpha -= this.decay;
        this.y += 0.4;
      }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    window.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.4) {
        sparkles.push(new Sparkle(e.clientX, e.clientY));
      }
    });

    function renderSparkles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = sparkles.length - 1; i >= 0; i--) {
        sparkles[i].update();
        sparkles[i].draw(ctx);
        if (sparkles[i].alpha <= 0) {
          sparkles.splice(i, 1);
        }
      }
      requestAnimationFrame(renderSparkles);
    }
    renderSparkles();
  }

  /* ==========================================================================
     6. COUNTDOWN TIMER
     ========================================================================== */
  function initCountdown() {
    const targetDate = new Date(WEDDING_CONFIG.dateISO).getTime();

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minsEl = document.getElementById('countdown-minutes');
    const secsEl = document.getElementById('countdown-seconds');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    function updateTimer() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(minutes).padStart(2, '0');
      secsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* ==========================================================================
     7. SIDE NAVIGATION DOTS & SCROLL TRACKING
     ========================================================================== */
  function initSideNavDots() {
    const dots = document.querySelectorAll('.nav-dot');
    if (!dots.length) return;

    dots.forEach((dot) => {
      dot.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Update active dot on scroll
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 200;
      dots.forEach((dot) => {
        const targetId = dot.getAttribute('data-target');
        const el = document.getElementById(targetId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            dots.forEach((d) => d.classList.remove('active'));
            dot.classList.add('active');
          }
        }
      });
    }, { passive: true });
  }

  /* ==========================================================================
     8. ADD TO CALENDAR & COPY ADDRESS
     ========================================================================== */
  function initCalendarAndCopy() {
    const googleBtn = document.getElementById('add-google-calendar');
    const icsBtn = document.getElementById('download-ics-calendar');
    const copyAddressBtn = document.getElementById('copy-address-btn');

    const title = encodeURIComponent("Arun & Krishna's Wedding Reception");
    const details = encodeURIComponent(
      "Together with their families, Arun & Krishna request the pleasure of your company at their Wedding Reception & Banquet in Birmingham, England.\n\nSchedule:\n1:00 PM: Guest Arrival & Welcome Drinks (Birmingham)\n1:30 PM: Celebratory Wedding Banquet (Birmingham)\n4:00 PM: Cake Cutting & Live Music\n6:30 PM: Evening Celebrations & Dancing\nMidnight: Carriages & Sparkler Farewell\n\n(Note: Preceded by an intimate private ceremony for close family in Stafford)"
    );
    const location = encodeURIComponent('Birmingham, West Midlands, England');

    const gcalStart = '20261208T130000Z';
    const gcalEnd = '20261208T235900Z';

    if (googleBtn) {
      googleBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${gcalStart}/${gcalEnd}&details=${details}&location=${location}`;
      googleBtn.target = '_blank';
    }

    if (icsBtn) {
      icsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Arun and Krishna//English Wedding Invitation//EN',
          'CALSCALE:GREGORIAN',
          'METHOD:PUBLISH',
          'BEGIN:VEVENT',
          'UID:wedding-arun-krishna-2026@wedding.com',
          'DTSTAMP:20261208T000000Z',
          'DTSTART:20261208T130000Z',
          'DTEND:20261208T235900Z',
          'SUMMARY:Arun & Krishna\'s Wedding Reception (Birmingham)',
          'DESCRIPTION:Wedding Reception & Celebratory Banquet in Birmingham, England (12:30 PM onwards; preceded by an intimate private ceremony in Stafford).',
          'LOCATION:Birmingham, West Midlands, England',
          'STATUS:CONFIRMED',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'Arun-and-Krishna-Wedding.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    function setupCopyButton(btnId, text) {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `✓ Address Copied!`;
          setTimeout(() => {
            btn.innerHTML = originalHTML;
          }, 2500);
        }).catch(() => {
          alert(text);
        });
      });
    }

    setupCopyButton('copy-stafford-btn', 'Stafford, Staffordshire, ST16, United Kingdom');
    setupCopyButton('copy-birmingham-btn', 'Birmingham, West Midlands, B1, United Kingdom');
    setupCopyButton('copy-address-btn', 'Stafford (Ceremony) & Birmingham (Reception), United Kingdom');
  }

  /* ==========================================================================
     9. TRAVEL & ACCOMMODATION ACCORDION
     ========================================================================== */
  function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach((header) => {
      header.addEventListener('click', function () {
        const item = this.parentElement;
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.accordion-item').forEach((other) => {
          other.classList.remove('active');
        });

        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  /* ==========================================================================
     10. GALLERY & LIGHTBOX
     ========================================================================== */
  function initGallery() {
    const items = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    let currentIndex = 0;

    if (!modal || !modalImg) return;

    function showImage(index) {
      if (!items.length) return;
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      currentIndex = index;
      const item = items[currentIndex];
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption') || img.alt;
      modalImg.src = img.src;
      modalImg.alt = caption;
      if (modalCaption) modalCaption.textContent = caption;
    }

    items.forEach((item, idx) => {
      item.addEventListener('click', () => {
        showImage(idx);
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('lightbox-img-wrap')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  /* ==========================================================================
     11. RSVP FORM HANDLING & STORAGE
     ========================================================================== */
  function initRSVP() {
    const form = document.getElementById('rsvp-form');
    const successBanner = document.getElementById('rsvp-success-banner');
    const attendanceCards = document.querySelectorAll('.attendance-card');

    attendanceCards.forEach((card) => {
      card.addEventListener('click', function () {
        attendanceCards.forEach((c) => c.classList.remove('selected'));
        this.classList.add('selected');
        const radio = this.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      const fullName = document.getElementById('rsvp-name').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Attending';
      const guestsCount = document.getElementById('rsvp-guests').value;
      const dietary = document.getElementById('rsvp-dietary').value.trim();
      const songMessage = document.getElementById('rsvp-message').value.trim();

      const rsvpData = {
        name: fullName,
        attendance,
        guestsCount,
        dietary: dietary || 'None specified',
        message: songMessage,
        submittedAt: new Date().toISOString()
      };

      // ── 1. Always save locally as a fallback ─────────────────────────────
      try {
        const existing = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        existing.push(rsvpData);
        localStorage.setItem('wedding_rsvps', JSON.stringify(existing));
      } catch (err) {
        console.warn('localStorage save failed:', err);
      }

      // ── 2. Send to Google Sheets (if URL is configured) ──────────────────
      const sheetUrl = WEDDING_CONFIG.googleSheetUrl;
      if (sheetUrl && sheetUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        try {
          await fetch(sheetUrl, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script requires no-cors
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rsvpData)
          });
          console.log('RSVP submitted to Google Sheets ✓');
        } catch (err) {
          console.warn('Google Sheets submission failed (local copy saved):', err);
        }
      }

      // ── 3. Celebration & success UI ─────────────────────────────────────
      burstPetals(25);

      if (successBanner) {
        const confirmationText = attendance === 'Attending'
          ? `We are overjoyed that you will be joining us, ${fullName}!`
          : `We will dearly miss you on the day, ${fullName}. Thank you for letting us know.`;

        const successMsgEl = document.getElementById('rsvp-success-msg');
        if (successMsgEl) successMsgEl.textContent = confirmationText;

        successBanner.classList.add('visible');
        form.style.display = 'none';
      }
    });
  }

  /* ==========================================================================
     12. INTERACTIVE GUEST WISHES WALL
     ========================================================================== */
  const defaultWishes = [
    {
      author: 'Lord & Lady Pemberton',
      text: 'Wishing Arun and Krishna an eternity of laughter, devotion, and celebration across Stafford and Birmingham. What a majestic wedding!',
      date: 'Yesterday'
    },
    {
      author: 'Dev & Priya',
      text: 'From those cozy London tea dates to your wedding day in the English countryside — we could not be happier for you both. Cannot wait to dance under the marquee!',
      date: '2 days ago'
    },
    {
      author: 'Marcus & Eleanor Vance',
      text: 'Heartfelt congratulations to the most radiant couple. May your love bloom ever brighter with each passing year.',
      date: '3 days ago'
    }
  ];

  function initWishesWall() {
    const grid = document.getElementById('wishes-grid');
    const form = document.getElementById('wishes-form');

    if (!grid) return;

    function escapeHTML(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function renderWishCard(wish) {
      const card = document.createElement('div');
      card.className = 'wish-note';
      card.innerHTML = `
        <div class="wish-pin"></div>
        <p class="wish-body">“${escapeHTML(wish.text)}”</p>
        <span class="wish-author">— ${escapeHTML(wish.author)}</span>
        <span class="wish-time">${escapeHTML(wish.date)}</span>
      `;
      grid.prepend(card);
    }

    let savedWishes = [];
    try {
      savedWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
    } catch (e) { }

    const allWishes = [...defaultWishes, ...savedWishes];
    allWishes.forEach(renderWishCard);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const authorInput = document.getElementById('wish-name');
        const textInput = document.getElementById('wish-text');

        if (!authorInput.value.trim() || !textInput.value.trim()) return;

        const newWish = {
          author: authorInput.value.trim(),
          text: textInput.value.trim(),
          date: 'Just now'
        };

        renderWishCard(newWish);

        savedWishes.push(newWish);
        localStorage.setItem('wedding_wishes', JSON.stringify(savedWishes));

        burstPetals(15);

        authorInput.value = '';
        textInput.value = '';
      });
    }
  }

  /* ==========================================================================
     13. DYNAMIC TIME-AWARE GREETING & WHATSAPP SHARING
     ========================================================================== */
  function initFooterAndSocial() {
    const timeGreetingEl = document.getElementById('footer-time-greeting');
    if (timeGreetingEl) {
      const currentHour = new Date().getHours();
      let timeOfDay = 'day';
      if (currentHour >= 5 && currentHour < 12) timeOfDay = 'morning';
      else if (currentHour >= 12 && currentHour < 17) timeOfDay = 'afternoon';
      else if (currentHour >= 17 && currentHour < 22) timeOfDay = 'evening';
      else timeOfDay = 'night';

      timeGreetingEl.textContent = `Wishing you a most pleasant ${timeOfDay} from England.`;
    }

    const whatsappBtn = document.getElementById('whatsapp-share-btn');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const shareText = encodeURIComponent(
          `You're cordially invited to Arun & Krishna's Wedding Reception in Birmingham! Open your engraved invitation here: ${window.location.href}`
        );
        window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
      });
    }

    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ==========================================================================
     SCROLL PROGRESS BAR
     ========================================================================== */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* ==========================================================================
     SCROLL-REVEAL (IntersectionObserver)
     ========================================================================== */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!revealEls.length || !('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      revealEls.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ==========================================================================
     FLOATING RSVP BUTTON
     ========================================================================== */
  function initFloatingRSVP() {
    const btn = document.getElementById('floating-rsvp');
    const hero = document.getElementById('hero');
    const rsvpSection = document.getElementById('rsvp');
    if (!btn || !hero) return;

    const heroObserver = new IntersectionObserver((entries) => {
      const heroVisible = entries[0].isIntersecting;
      btn.classList.toggle('is-visible', !heroVisible);
    }, { threshold: 0.1 });
    heroObserver.observe(hero);

    // Hide the button when the RSVP section itself is visible
    if (rsvpSection) {
      const rsvpObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) btn.classList.remove('is-visible');
      }, { threshold: 0.2 });
      rsvpObserver.observe(rsvpSection);
    }
  }

  /* ==========================================================================
     POLAROID LIGHTBOX CLICK HANDLER
     ========================================================================== */
  function initPolaroidLightbox() {
    document.querySelectorAll('.polaroid').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.lightboxIndex, 10);
        if (!isNaN(idx)) {
          // Re-use existing lightbox logic via the gallery images array
          const imgs = Array.from(document.querySelectorAll('.polaroid img'));
          showImage(idx); // defined inside initGallery closure — if available
        }
      });
    });
  }

  /* ==========================================================================
     BOOTSTRAP EVERYTHING ON DOM READY
     ========================================================================== */
  window.addEventListener('DOMContentLoaded', () => {
    initPersonalization();
    initEnvelope();
    initAudioControls();
    initPetalsCanvas();
    initSparkleCursor();
    initCountdown();
    initSideNavDots();
    initCalendarAndCopy();
    initAccordions();
    initGallery();
    initRSVP();
    initWishesWall();
    initFooterAndSocial();
    initScrollProgress();
    initScrollReveal();
    initFloatingRSVP();
  });

})();
