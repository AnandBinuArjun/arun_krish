/**
 * ENGLISH WEDDING INVITATION — ARUN & KRISH
 * Core JavaScript Logic: Envelope Unboxing, Web Audio Harp, Rose Petals, Side Dots, RSVP & Wishes
 * Enhanced with features inspired by Pooja & Saroop reference
 */

(function () {
  'use strict';

  // Wedding Configuration
  const WEDDING_CONFIG = {
    couple: 'Arun & Krish',
    dateISO: '2026-12-08T10:00:00Z',
    venue: 'The Orangery & Manor Gardens, Cotswolds, Gloucestershire',
    hashtag: '#ArunWedsKrish2026'
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
    const topNavBar = document.getElementById('top-nav-bar');

    if (!envelopeStage || !waxSeal) return;

    function openEnvelope() {
      if (isEnvelopeOpen) return;
      isEnvelopeOpen = true;

      // 1. Crack Wax Seal
      waxSeal.classList.add('cracked');
      envelopeStage.classList.add('animating');

      // 2. Play Audio Melody ('Nenjin Ezhuth')
      playWeddingSong();

      // 3. Trigger Burst of Falling Petals
      burstPetals(70);

      // 4. Slide Card & Reveal Page
      setTimeout(() => {
        envelopeStage.classList.add('opened');
        pageWrapper.classList.add('revealed');
        if (topNavBar) topNavBar.classList.add('visible');

        // Allow gentle scrolling
        document.body.style.overflow = 'auto';
      }, 1300);
    }

    waxSeal.addEventListener('click', openEnvelope);
    envelopeWrapper.addEventListener('click', function (e) {
      openEnvelope();
    });

    // Replay opening button
    const replayBtn = document.getElementById('replay-envelope-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        isEnvelopeOpen = false;
        waxSeal.classList.remove('cracked');
        envelopeStage.classList.remove('animating');
        envelopeStage.classList.remove('opened');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ==========================================================================
     3. AUDIO PLAYER: 'NENJIN EZHUTH' & FLOATING EQUALIZER WIDGET
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
        audioWidget.setAttribute('title', "Pause 'Nenjin Ezhuth'");
      } else {
        audioWidget.classList.remove('playing');
        audioWidget.setAttribute('title', "Play 'Nenjin Ezhuth'");
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
      // 78% blooming lotus petals, 22% olive leaves
      this.isLeaf = Math.random() < 0.22;
      this.size = this.isLeaf ? Math.random() * 8 + 8 : Math.random() * 12 + 11;
      this.speedY = isBurst ? Math.random() * 4 + 2 : Math.random() * 1.3 + 0.7;
      this.speedX = Math.random() * 1.8 - 0.9;
      this.angle = Math.random() * 360;
      this.angularSpeed = (Math.random() - 0.5) * 2;
      this.flipAngle = Math.random() * 360;
      this.flipSpeed = Math.random() * 0.04 + 0.015;
      this.oscillationSpeed = Math.random() * 0.025 + 0.008;
      this.oscillationDistance = Math.random() * 25 + 10;
      this.oscillationOffset = Math.random() * 100;
      this.opacity = Math.random() * 0.4 + 0.6;
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

      if (this.isLeaf) {
        // Delicate Olive Leaf
        const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
        grad.addColorStop(0, '#8FA866');
        grad.addColorStop(0.5, '#556B2F');
        grad.addColorStop(1, '#374623');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.45, -this.size * 0.35, this.size * 0.45, this.size * 0.4, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.45, this.size * 0.4, -this.size * 0.45, -this.size * 0.35, 0, -this.size);
        ctx.fill();

        // Leaf spine
        ctx.strokeStyle = 'rgba(238, 245, 230, 0.4)';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.8);
        ctx.lineTo(0, this.size * 0.8);
        ctx.stroke();
      } else {
        // Blooming Lotus Petal (pointed apex, curving belly, soft base)
        const grad = ctx.createLinearGradient(0, this.size, 0, -this.size);
        grad.addColorStop(0, 'rgba(255, 246, 248, 0.95)');
        grad.addColorStop(0.35, 'rgba(247, 206, 215, 0.9)');
        grad.addColorStop(0.7, 'rgba(226, 141, 157, 0.88)');
        grad.addColorStop(1, 'rgba(188, 72, 98, 0.95)');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(0, -this.size); // Lotus tip
        ctx.bezierCurveTo(this.size * 0.62, -this.size * 0.4, this.size * 0.7, this.size * 0.45, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.7, this.size * 0.45, -this.size * 0.62, -this.size * 0.4, 0, -this.size);
        ctx.fill();

        // Shimmering petal curve highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, this.size * 0.65);
        ctx.quadraticCurveTo(this.size * 0.12, 0, 0, -this.size * 0.7);
        ctx.stroke();
      }

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

    for (let i = 0; i < 26; i++) {
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
        this.decay = Math.random() * 0.02 + 0.02;
        this.color = Math.random() > 0.5 ? '#B89B5E' : '#E8D29F';
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

    const title = encodeURIComponent("Arun & Krish's Wedding");
    const details = encodeURIComponent(
      "Together with their families, Arun & Krish request the pleasure of your company to celebrate their wedding.\n\nSchedule:\n9:30 AM: Guests arrive\n10:00 AM: The Marriage Ceremony\n11:30 AM: Confetti & Photographs\n12:30 PM: Celebratory Wedding Feast\n3:30 PM: Garden Reception & Live Music\n6:00 PM: Evening Celebrations & Carriages"
    );
    const location = encodeURIComponent(WEDDING_CONFIG.venue);

    const gcalStart = '20261208T100000Z';
    const gcalEnd = '20261208T220000Z';

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
          'PRODID:-//Arun and Krish//English Wedding Invitation//EN',
          'CALSCALE:GREGORIAN',
          'METHOD:PUBLISH',
          'BEGIN:VEVENT',
          'UID:wedding-arun-krish-2026@wedding.com',
          'DTSTAMP:20261208T000000Z',
          'DTSTART:20261208T100000Z',
          'DTEND:20261208T220000Z',
          'SUMMARY:Arun & Krish\'s Wedding',
          'DESCRIPTION:Together with their families, Arun & Krish request the pleasure of your company at their wedding.',
          `LOCATION:${WEDDING_CONFIG.venue}`,
          'STATUS:CONFIRMED',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'Arun-and-Krish-Wedding.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    if (copyAddressBtn) {
      copyAddressBtn.addEventListener('click', () => {
        const addressText = "The Manor Gardens, Lower Slaughter Road, Bourton-on-the-Water, Gloucestershire, GL54 2EN, United Kingdom";
        navigator.clipboard.writeText(addressText).then(() => {
          const originalHTML = copyAddressBtn.innerHTML;
          copyAddressBtn.innerHTML = `✓ Address Copied!`;
          setTimeout(() => {
            copyAddressBtn.innerHTML = originalHTML;
          }, 2500);
        }).catch(() => {
          alert(addressText);
        });
      });
    }
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

    if (!modal || !modalImg) return;

    items.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption') || img.alt;
        modalImg.src = img.src;
        modalCaption.textContent = caption;
        modal.classList.add('open');
      });
    });

    function closeModal() {
      modal.classList.remove('open');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
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

    form.addEventListener('submit', (e) => {
      e.preventDefault();

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

      try {
        const existing = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        existing.push(rsvpData);
        localStorage.setItem('wedding_rsvps', JSON.stringify(existing));
      } catch (err) {
        console.error('Failed to save RSVP:', err);
      }

      burstPetals(60);

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
      text: 'Wishing Arun and Krish an eternity of laughter, devotion, and sunny Cotswold afternoons together. What a majestic celebration!',
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

    function renderWishCard(wish) {
      const card = document.createElement('div');
      card.className = 'wish-note';
      card.innerHTML = `
        <div class="wish-pin"></div>
        <p class="wish-body">“${wish.text}”</p>
        <span class="wish-author">— ${wish.author}</span>
        <span class="wish-time">${wish.date}</span>
      `;
      grid.prepend(card);
    }

    let savedWishes = [];
    try {
      savedWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
    } catch (e) {}

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

        burstPetals(30);

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

      timeGreetingEl.textContent = `Wishing you a most pleasant ${timeOfDay} from Gloucestershire.`;
    }

    const whatsappBtn = document.getElementById('whatsapp-share-btn');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const shareText = encodeURIComponent(
          `You're cordially invited to the wedding of Arun & Krish! Open your engraved invitation here: ${window.location.href}`
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
  });

})();
