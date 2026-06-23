/**
 * main.js — parthkhadke.me
 * Handles the cinematic preloader sequence with sessionStorage guard.
 *
 * TIMELINE (ms from page load):
 *  0          → DOM ready, sessionStorage checked
 *  0          → If returning visitor: skip everything, show site
 *  50         → Typing animation fires (driven by CSS @keyframes, 1.3s, steps 12)
 *  1350       → Typing complete. Caret keeps blinking.
 *  2350       → Caret stops, fade-out begins (CSS transition, 600ms)
 *  2950       → Overlay removed from DOM. Site fully interactive.
 */

(function () {
    'use strict';

    const SESSION_KEY = 'pk_intro_seen';

    // ─── RETURNING VISITOR: skip the whole show ───────────────────
 //   if (sessionStorage.getItem(SESSION_KEY)) {
   //     document.documentElement.classList.add('no-preloader');
     //   return;
    //}

    // ─── FIRST VISIT: run the sequence ───────────────────────────

    /**
     * Waits until DOM is ready, then fires the sequence.
     * Using DOMContentLoaded (or immediate if already ready) so fonts
     * have been requested before we start timing.
     */
    function init() {
        const preloader  = document.getElementById('preloader');
        const nameEl     = document.getElementById('preloaderName');
        const siteContent = document.getElementById('site-content');

        if (!preloader || !nameEl || !siteContent) {
            // Graceful fallback — show site immediately
            if (siteContent) siteContent.classList.add('is-visible');
            return;
        }

        // Kick off typing animation by adding the blink class.
        // The CSS animation `typing` starts immediately on this element;
        // we add caret-blink simultaneously so the cursor blinks from t=0.
        nameEl.classList.add('caret-blink');

        // ── Step 1: Wait for typing to finish (1300ms) ──
        // Then wait 1000ms pause before fading
        const TYPING_DURATION = 1300; // must match CSS animation-duration
        const PAUSE_AFTER     = 800; // hold the full name on screen
        const FADE_DURATION   = 250;  // must match CSS transition-duration

        setTimeout(function afterTyping() {

            // ── Step 2: 1000ms pause — cursor still blinking (no change needed) ──

            setTimeout(function startFade() {

    nameEl.style.borderColor = 'transparent';
    nameEl.style.animationName = 'none';

    nameEl.classList.add('preloader__name--fade');

    setTimeout(function () {
        preloader.classList.add('preloader--fade');
    }, 5);

                // ── Step 4: After fade completes, clean up DOM ──
                setTimeout(function cleanup() {
                    preloader.remove();
                    siteContent.classList.add('is-visible');

                    // Mark session so this never plays again until tab closes
                  //  sessionStorage.setItem(SESSION_KEY, '1');

                }, FADE_DURATION);

            }, PAUSE_AFTER);

        }, TYPING_DURATION);
    }

    // Fire immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

}());

// Navigation Panel Mechanism
const menuToggle = document.getElementById('menu-toggle');
const navPanel = document.getElementById('nav-panel');
const navOverlay = document.getElementById('nav-overlay');

if (menuToggle && navPanel && navOverlay) {

    menuToggle.addEventListener('click', () => {

        navPanel.classList.toggle('is-open');
        navOverlay.classList.toggle('is-open');

        const isOpen = navPanel.classList.contains('is-open');

        menuToggle.setAttribute(
            'aria-expanded',
            isOpen
        );
    });

    navOverlay.addEventListener('click', () => {

        navPanel.classList.remove('is-open');
        navOverlay.classList.remove('is-open');

        menuToggle.setAttribute(
            'aria-expanded',
            'false'
        );
    });
}