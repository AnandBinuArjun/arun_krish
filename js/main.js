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
    venue: 'Reception & Banquet: Birmingham, West Midlands, England',
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

    // Prevent automatic scroll restoration so top section is always anchored on load
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Lock page scroll while envelope is closed
    if (!envelopeStage.classList.contains('opened')) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    }

    function revealInvitation() {
      // Pin viewport directly to top so top hero section displays immediately
      window.scrollTo(0, 0);

      envelopeStage.classList.add('opened');
      pageWrapper.classList.add('revealed');
      document.body.classList.add('invitation-opened');
      document.body.style.overflow = 'auto';

      // Re-trigger scroll event so observers refresh
      try {
        window.dispatchEvent(new Event('scroll'));
      } catch (e) { }

      // After opacity transition completes, remove from document layout
      setTimeout(() => {
        envelopeStage.classList.add('done');
      }, 750);
    }

    /* Synthesize royal bell chime with rich harmonic overtones via Web Audio */
    function playRoyalChime() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        // D major royal chord shimmer: D5, A5, D6, F#6, A6
        const freqs = [587.33, 880, 1174.66, 1479.98, 1760];
        const now = ctx.currentTime;
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.0001, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.06 / (idx + 1), now + idx * 0.07 + 0.035);
          gain.gain.exponentialRampToValueAtTime(0.00001, now + idx * 0.07 + 2.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 2.4);
        });
      } catch (e) { }
    }

    function openEnvelope() {
      if (isEnvelopeOpen) return;
      isEnvelopeOpen = true;

      window.scrollTo(0, 0);

      // Tactile royal haptic feedback
      if (navigator.vibrate) {
        try { navigator.vibrate([35, 45, 60]); } catch (e) { }
      }

      // Synthesized palace chime
      playRoyalChime();

      // 1. Unlock Golden Crest Medallion & Swing Open Gatefold Doors in 3D
      waxSeal.classList.add('cracked');
      envelopeStage.classList.add('animating');

      // 2. Play Audio Melody ('Dheera Dheera')
      playWeddingSong();

      // 3. Trigger Grand Cascade of Falling Petals
      try { burstPetals(45); } catch (e) { }

      // 4. Reveal Palace Invitation & Top Section as Doors Open
      setTimeout(revealInvitation, 1000);
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
        playWeddingSong();
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
        pageWrapper.classList.remove('revealed');
        document.body.classList.remove('invitation-opened');
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
      });
    }
  }

  /* ==========================================================================
     3. AUDIO PLAYER: 'DHEERA DHEERA' & FLOATING EQUALIZER WIDGET
     ========================================================================== */
  function getAudioEl() {
    return document.getElementById('wedding-audio');
  }

  let audioFadeTimer = null;
  function fadeInWeddingSong(audio, targetVolume = 0.4, durationMs = 1500) {
    if (audioFadeTimer) clearInterval(audioFadeTimer);
    audio.volume = 0.02;
    const steps = 25;
    const interval = durationMs / steps;
    const stepDelta = (targetVolume - 0.02) / steps;
    audioFadeTimer = setInterval(() => {
      if (audio.paused) {
        clearInterval(audioFadeTimer);
        return;
      }
      if (audio.volume + stepDelta >= targetVolume) {
        audio.volume = targetVolume;
        clearInterval(audioFadeTimer);
      } else {
        audio.volume = Math.min(targetVolume, audio.volume + stepDelta);
      }
    }, interval);
  }

  function playWeddingSong() {
    const audio = getAudioEl();
    if (!audio) return;

    fadeInWeddingSong(audio, 0.4, 1500);
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
    const audio = getAudioEl();
    if (!audio) return;

    if (!audio.paused) {
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
        audioWidget.setAttribute('title', "Pause 'Oru Kathilola Violin cover by Anand'");
      } else {
        audioWidget.classList.remove('playing');
        audioWidget.setAttribute('title', "Play 'Oru Kathilola Violin cover by Anand'");
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
      audio.volume = 0.4;
      const progressMeter = document.getElementById('audio-progress-meter');

      audio.addEventListener('timeupdate', () => {
        if (!progressMeter || !audio.duration) return;
        const percent = Math.min(1, Math.max(0, audio.currentTime / audio.duration));
        const offset = 100.5 - (percent * 100.5);
        progressMeter.style.strokeDashoffset = offset;
      });

      audio.addEventListener('play', () => {
        isAudioPlaying = true;
        updateAudioButtonUI(true);
      });
      audio.addEventListener('playing', () => {
        isAudioPlaying = true;
        updateAudioButtonUI(true);
      });
      audio.addEventListener('pause', () => {
        isAudioPlaying = false;
        updateAudioButtonUI(false);
      });
      audio.addEventListener('ended', () => {
        isAudioPlaying = false;
        updateAudioButtonUI(false);
        if (progressMeter) progressMeter.style.strokeDashoffset = 100.5;
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
        // Romantic Carnation Rose & Tender Petal Blush
        grad.addColorStop(0, '#FFF1F6'); // Pale Whisper
        grad.addColorStop(0.35, '#FEE0E9'); // Soft Blush
        grad.addColorStop(0.7, '#F5C9D4'); // Carnation Rose
        grad.addColorStop(1, '#D9889B'); // Rose Petal Bloom
      } else if (this.type === 1) {
        // Fresh Garden Sage into Heritage Meadow Olive
        grad.addColorStop(0, '#FFF8FA'); // Whisper
        grad.addColorStop(0.4, '#C7DD9D'); // Soft Garden Sage
        grad.addColorStop(0.75, '#8DA65C'); // Meadow Olive
        grad.addColorStop(1, '#5A7034'); // Deep Leaf Apex
      } else {
        // Garden Harmony: Blush, Sage & Meadow Olive
        grad.addColorStop(0, '#FFF1F6'); // Whisper
        grad.addColorStop(0.4, '#FEE0E9'); // Soft Blush
        grad.addColorStop(0.75, '#C7DD9D'); // Soft Sage
        grad.addColorStop(1, '#8DA65C'); // Meadow Olive
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
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    }, { passive: true });

    for (let i = 0; i < 12; i++) {
      petals.push(new LotusParticle(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
    }

    let animId = null;
    function animate() {
      if (petalsRunning && !document.hidden) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < petals.length; i++) {
          petals[i].update();
          petals[i].draw(ctx);
        }
      }
      if (!document.hidden) {
        animId = requestAnimationFrame(animate);
      }
    }
    animate();

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        cancelAnimationFrame(animId);
        animate();
      }
    });
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
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, 100);
    }, { passive: true });

    const sparkles = [];

    class Sparkle {
      constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 8;
        this.y = y + (Math.random() - 0.5) * 8;
        this.size = Math.random() * 3 + 1.5;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.015;
        const sparkleColors = ['#8DA65C', '#C7DD9D', '#F5C9D4', '#FEE0E9', '#FFF1F6'];
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

    let sparkleAnimId = null;
    function renderSparkles() {
      if (sparkles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sparkleAnimId = null;
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = sparkles.length - 1; i >= 0; i--) {
        sparkles[i].update();
        sparkles[i].draw(ctx);
        if (sparkles[i].alpha <= 0) {
          sparkles.splice(i, 1);
        }
      }
      sparkleAnimId = requestAnimationFrame(renderSparkles);
    }

    window.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.4) {
        sparkles.push(new Sparkle(e.clientX, e.clientY));
        if (!sparkleAnimId && !document.hidden) {
          sparkleAnimId = requestAnimationFrame(renderSparkles);
        }
      }
    }, { passive: true });
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

    // Update active dot on scroll (throttled via requestAnimationFrame)
    let navTicking = false;
    window.addEventListener('scroll', () => {
      if (!navTicking) {
        window.requestAnimationFrame(() => {
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
          navTicking = false;
        });
        navTicking = true;
      }
    }, { passive: true });
  }

  /* ==========================================================================
     8. ADD TO CALENDAR & COPY ADDRESS
     ========================================================================== */
  function initCalendarAndCopy() {
    const googleBtn = document.getElementById('add-google-calendar');
    const icsBtn = document.getElementById('download-ics-calendar');
    const outlookBtn = document.getElementById('add-outlook-calendar');
    const copyAddressBtn = document.getElementById('copy-address-btn');

    const title = encodeURIComponent("Arun & Krishna's Wedding Day");
    const details = encodeURIComponent(
      "Together with their families, Arun & Krishna request the pleasure of your company at their Wedding Celebrations.\n\nOrder of the Day — Tuesday, 8th December 2026:\n• 10:00 AM: Private Marriage Ceremony\n• 12:30 PM: Guests' Arrival (Birmingham)\n• 1:00 PM: Wedding Banquet (Birmingham)\n\nA day of love and new beginnings."
    );
    const location = encodeURIComponent('Birmingham, England');

    const gcalStart = '20261208T100000Z';
    const gcalEnd = '20261208T220000Z';
    const outlookStart = '2026-12-08T10:00:00Z';
    const outlookEnd = '2026-12-08T22:00:00Z';

    if (googleBtn) {
      googleBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${gcalStart}/${gcalEnd}&details=${details}&location=${location}`;
      googleBtn.target = '_blank';
    }

    if (outlookBtn) {
      outlookBtn.href = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${details}&location=${location}&startdt=${outlookStart}&enddt=${outlookEnd}`;
      outlookBtn.target = '_blank';
    }

    if (icsBtn) {
      icsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Arun and Krishna//Wedding Invitation//EN',
          'CALSCALE:GREGORIAN',
          'METHOD:PUBLISH',
          'BEGIN:VEVENT',
          'UID:wedding-arun-krishna-2026@wedding.com',
          'DTSTAMP:20261208T000000Z',
          'DTSTART:20261208T100000Z',
          'DTEND:20261208T220000Z',
          'SUMMARY:Arun & Krishna\'s Wedding — Order of the Day',
          'DESCRIPTION:Order of the Day (Tuesday, 8th December 2026):\\n10:00 AM - Private Marriage Ceremony\\n12:30 PM - Guests\' Arrival (Birmingham)\\n1:00 PM - Wedding Banquet (Birmingham)\\n\\nA day of love and new beginnings.',
          'LOCATION:Birmingham, England',
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

    setupCopyButton('copy-birmingham-btn', 'Birmingham, West Midlands, B1, United Kingdom');
    setupCopyButton('copy-address-btn', 'Birmingham, West Midlands, United Kingdom');
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
    const items = document.querySelectorAll('.polaroid, .gallery-item');
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
      if (!img) return;
      const capEl = item.querySelector('.polaroid-caption');
      const caption = item.getAttribute('data-caption') || (capEl ? capEl.textContent.trim() : img.alt);
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

    // Mobile touch swipe gesture navigation
    let touchStartX = 0;
    let touchStartY = 0;
    modal.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length === 1) {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            showImage(currentIndex + 1);
          } else {
            showImage(currentIndex - 1);
          }
        }
      }
    }, { passive: true });
  }

  /* ==========================================================================
     CELEBRATION CONFETTI BURST (ON RSVP 'YES' / ATTENDING)
     ========================================================================== */
  function burstCelebrationConfetti(originEl) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let container = document.querySelector('.celebration-confetti-layer');
    if (!container) {
      container = document.createElement('div');
      container.className = 'celebration-confetti-layer';
      container.setAttribute('aria-hidden', 'true');
      document.body.appendChild(container);
    }

    let originX = window.innerWidth / 2;
    let originY = window.innerHeight * 0.6;
    if (originEl && typeof originEl.getBoundingClientRect === 'function') {
      const rect = originEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        originX = rect.left + rect.width / 2;
        originY = Math.min(rect.top + rect.height * 0.4, window.innerHeight * 0.85);
      }
    }

    const emojis = ['🪙', '❤️', '💖', '✨', '🪙', '🌟', '🎉'];
    const ribbonColors = [
      'linear-gradient(135deg, #F5C9D4, #FEE0E9)',
      'linear-gradient(135deg, #C7DD9D, #8DA65C)',
      'linear-gradient(135deg, #FFF1F6, #F5C9D4)',
      'linear-gradient(135deg, #8DA65C, #5A7034)',
      'linear-gradient(135deg, #FEE0E9, #C7DD9D)'
    ];

    // Wave 1: Explosive upward cannon burst from the RSVP card
    const cannonCount = 55;
    for (let i = 0; i < cannonCount; i++) {
      const isEmoji = Math.random() < 0.45;
      const el = document.createElement('div');
      el.className = 'confetti-particle ' + (isEmoji ? 'emoji' : 'ribbon');

      if (isEmoji) {
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.fontSize = `${Math.floor(Math.random() * 14 + 18)}px`;
      } else {
        const w = Math.floor(Math.random() * 8 + 8);
        const h = Math.floor(Math.random() * 12 + 10);
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.background = ribbonColors[Math.floor(Math.random() * ribbonColors.length)];
      }

      el.style.left = `${originX}px`;
      el.style.top = `${originY}px`;

      // Upward fan burst trajectory
      const angle = (Math.random() * 130 - 155) * (Math.PI / 180);
      const velocity = Math.random() * 260 + 200;
      const xMid = Math.cos(angle) * velocity;
      const yUp = Math.sin(angle) * velocity;
      const xEnd = xMid * (1.3 + Math.random() * 0.6);
      const rotMid = `${Math.floor(Math.random() * 360 - 180)}deg`;
      const rotEnd = `${Math.floor(Math.random() * 1080 - 540)}deg`;
      const duration = (Math.random() * 1.2 + 2.2).toFixed(2);
      const delay = (Math.random() * 0.25).toFixed(2);

      el.style.setProperty('--x-mid', `${xMid.toFixed(0)}px`);
      el.style.setProperty('--y-up', `${yUp.toFixed(0)}px`);
      el.style.setProperty('--x-end', `${xEnd.toFixed(0)}px`);
      el.style.setProperty('--rot-mid', rotMid);
      el.style.setProperty('--rot-end', rotEnd);
      el.style.animation = `confetti-cannon ${duration}s cubic-bezier(0.2, 0.7, 0.35, 1) ${delay}s forwards`;

      container.appendChild(el);
      setTimeout(() => el.remove(), (parseFloat(duration) + parseFloat(delay)) * 1000 + 100);
    }

    // Wave 2: Celebratory sky cascade across entire viewport
    const skyCount = 45;
    for (let i = 0; i < skyCount; i++) {
      const isEmoji = Math.random() < 0.45;
      const el = document.createElement('div');
      el.className = 'confetti-particle ' + (isEmoji ? 'emoji' : 'ribbon');

      if (isEmoji) {
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.fontSize = `${Math.floor(Math.random() * 14 + 16)}px`;
      } else {
        const w = Math.floor(Math.random() * 8 + 8);
        const h = Math.floor(Math.random() * 14 + 8);
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.background = ribbonColors[Math.floor(Math.random() * ribbonColors.length)];
      }

      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = '-25px';

      const driftX = `${(Math.random() * 200 - 100).toFixed(0)}px`;
      const rotEnd = `${Math.floor(Math.random() * 900 - 450)}deg`;
      const duration = (Math.random() * 2 + 2.8).toFixed(2);
      const delay = (Math.random() * 1.4 + 0.1).toFixed(2);

      el.style.setProperty('--drift-x', driftX);
      el.style.setProperty('--rot-end', rotEnd);
      el.style.animation = `confetti-sky-fall ${duration}s ease-in-out ${delay}s forwards`;

      container.appendChild(el);
      setTimeout(() => el.remove(), (parseFloat(duration) + parseFloat(delay)) * 1000 + 200);
    }

    // Clean up container once animations finish
    setTimeout(() => {
      if (container && container.children.length === 0) {
        container.remove();
      }
    }, 6000);
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
      if (navigator.vibrate) {
        try { navigator.vibrate([40, 50, 40]); } catch (e) { }
      }
      burstPetals(25);
      if (attendance === 'Attending') {
        burstCelebrationConfetti(form);
      }

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
  const defaultWishes = [];

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
      const placeholder = document.getElementById('no-wishes-placeholder');
      if (placeholder) placeholder.remove();

      if (!wish.reactions) {
        wish.reactions = { love: 0, lotus: 0, cheers: 0 };
      }

      const card = document.createElement('div');
      card.className = 'wish-note';
      card.innerHTML = `
        <div class="wish-pin"></div>
        <p class="wish-body">“${escapeHTML(wish.text)}”</p>
        <div class="wish-meta-row">
          <span class="wish-author">— ${escapeHTML(wish.author)}</span>
          <span class="wish-time">${escapeHTML(wish.date)}</span>
        </div>
        <div class="wish-reactions">
          <button type="button" class="wish-react-btn" data-type="love" title="Heartfelt Love" aria-label="Heartfelt Love">
            <span class="react-emoji">❤️</span>
            <span class="react-count">${wish.reactions.love || 0}</span>
          </button>
          <button type="button" class="wish-react-btn" data-type="lotus" title="Lotus Blessing" aria-label="Lotus Blessing">
            <span class="react-emoji">🪷</span>
            <span class="react-count">${wish.reactions.lotus || 0}</span>
          </button>
          <button type="button" class="wish-react-btn" data-type="cheers" title="Raise a Toast" aria-label="Raise a Toast">
            <span class="react-emoji">🥂</span>
            <span class="react-count">${wish.reactions.cheers || 0}</span>
          </button>
        </div>
      `;

      card.querySelectorAll('.wish-react-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const type = btn.getAttribute('data-type');
          if (!wish.reactions[type]) wish.reactions[type] = 0;
          wish.reactions[type] += 1;
          btn.querySelector('.react-count').textContent = wish.reactions[type];
          btn.classList.add('reacted');
          setTimeout(() => btn.classList.remove('reacted'), 600);
          if (navigator.vibrate) {
            try { navigator.vibrate(25); } catch (err) { }
          }
          try {
            localStorage.setItem('wedding_wishes', JSON.stringify(savedWishes));
          } catch (err) { }
        });
      });

      grid.prepend(card);
    }

    let savedWishes = [];
    try {
      savedWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
    } catch (e) { }

    if (savedWishes.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.id = 'no-wishes-placeholder';
      placeholder.style.cssText = 'text-align: center; color: var(--color-muted); font-style: italic; padding: 2.5rem 1rem; width: 100%; font-family: var(--font-serif); font-size: 1.15rem; grid-column: 1 / -1;';
      placeholder.innerHTML = '❧ No blessings pinned yet. Be the first to leave your warm wishes for Arun &amp; Krishna above!';
      grid.appendChild(placeholder);
    } else {
      savedWishes.forEach(renderWishCard);
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const authorInput = document.getElementById('wish-name');
        const textInput = document.getElementById('wish-text');

        if (!authorInput.value.trim() || !textInput.value.trim()) return;

        const newWish = {
          author: authorInput.value.trim(),
          text: textInput.value.trim(),
          date: 'Just now',
          reactions: { love: 1, lotus: 0, cheers: 0 }
        };

        savedWishes.push(newWish);
        renderWishCard(newWish);

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
    let progressTicking = false;
    window.addEventListener('scroll', () => {
      if (!progressTicking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
          progressTicking = false;
        });
        progressTicking = true;
      }
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
     STORY TIMELINE SCROLL THREAD ANIMATION
     ========================================================================== */
  function initStoryScrollProgress() {
    const timeline = document.querySelector('.story-timeline');
    const progressBar = document.getElementById('story-timeline-progress');
    const milestones = document.querySelectorAll('.story-milestone');
    if (!timeline || !progressBar) return;

    let storyTicking = false;
    function updateProgress() {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const startTrigger = windowHeight * 0.75;
      const totalHeight = rect.height;
      const scrolled = startTrigger - rect.top;
      const progressPercent = Math.max(0, Math.min(100, (scrolled / totalHeight) * 100));

      progressBar.style.height = `${progressPercent}%`;

      milestones.forEach((milestone) => {
        const node = milestone.querySelector('.story-node');
        if (!node) return;
        const mRect = milestone.getBoundingClientRect();
        if (mRect.top < windowHeight * 0.65) {
          node.classList.add('node-active');
        } else {
          node.classList.remove('node-active');
        }
      });
    }

    function onScroll() {
      if (!storyTicking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          storyTicking = false;
        });
        storyTicking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();
  }

  /* ==========================================================================
     SHARE INVITATION (NATIVE SHARE & WHATSAPP)
     ========================================================================== */
  function initShareButtons() {
    const shareBtns = [
      document.getElementById('hero-share-btn'),
      document.getElementById('card-share-btn')
    ].filter(Boolean);

    function showShareToast(message) {
      let toast = document.querySelector('.share-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'share-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    function shareInvitation() {
      const shareUrl = window.location.href;
      const shareData = {
        title: 'Arun & Krishna Wedding Invitation',
        text: 'You are cordially invited to celebrate the wedding of Arun & Krishna on Tuesday, 8th December 2026 in Birmingham, England.',
        url: shareUrl
      };

      if (navigator.share) {
        navigator.share(shareData).catch((err) => {
          if (err.name !== 'AbortError') {
            copyToClipboard(shareUrl);
          }
        });
      } else {
        copyToClipboard(shareUrl);
      }
    }

    function copyToClipboard(url) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showShareToast('✨ Invitation link copied to clipboard!');
        }).catch(() => {
          fallbackPrompt(url);
        });
      } else {
        fallbackPrompt(url);
      }
    }

    function fallbackPrompt(url) {
      window.prompt('Copy this wedding invitation link:', url);
    }

    shareBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        shareInvitation();
      });
    });
  }

  /* ==========================================================================
     CARD 3D PARALLAX TILT (SMOOTH HOVER PERSPECTIVE)
     ========================================================================== */
  function initCardParallaxTilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const tiltCards = document.querySelectorAll('.invitation-card, .venue-showcase-card, .polaroid, .dresscode-palette-card');
    tiltCards.forEach((card) => {
      let bounds = null;
      card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
      });
      card.addEventListener('mousemove', (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        const xPercent = (x / bounds.width - 0.5) * 2;
        const yPercent = (y / bounds.height - 0.5) * 2;
        const tiltX = -yPercent * 4.5;
        const tiltY = xPercent * 4.5;
        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave', () => {
        bounds = null;
        card.style.transform = '';
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
    initStoryScrollProgress();
    initShareButtons();
    initCardParallaxTilt();
  });

})();
