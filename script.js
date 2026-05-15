/**
 * Undangan Pawiwahan - JavaScript
 * Luxury Dark Balinese Modern Wedding Invitation
 */

(function() {
'use strict';

// ========================================
// Configuration
// ========================================
const CONFIG = {
weddingDate: new Date('2026-06-03T12:00:00+08:00'),
particleCount: 25,
animationDelay: 100,
scrollThreshold: 0.15
};

// ========================================
// Utility Functions
// ========================================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function throttle(func, limit) {
let inThrottle;
return function(...args) {
if (!inThrottle) {
func.apply(this, args);
inThrottle = true;
setTimeout(() => inThrottle = false, limit);
}
};
}

// ========================================
// Open Invitation Function
// ========================================
window.openInvitation = function() {
const openingScreen = $('#opening-screen');
const audio = $('#bgMusic');

// Play music
if (audio) {
audio.volume = 0.5;
audio.play().catch(error => {
console.warn('Audio autoplay failed:', error);
});
}

// Hide opening screen with animation
if (openingScreen) {
openingScreen.classList.add('opened');
}

// Enable scroll
document.body.classList.remove('no-scroll');

// Initialize animations after opening screen starts fading
setTimeout(() => {
initScrollAnimations();
initCountdown();
}, 500);
};

// ========================================
// Particles System
// ========================================
function createParticles() {
const container = $('#particles-container');
if (!container) return;

for (let i = 0; i < CONFIG.particleCount; i++) {
const particle = document.createElement('div');
particle.className = 'particle';
particle.style.left = Math.random() * 100 + '%';
particle.style.animationDelay = Math.random() * 15 + 's';
particle.style.animationDuration = (10 + Math.random() * 10) + 's';

const size = 2 + Math.random() * 4;
particle.style.width = size + 'px';
particle.style.height = size + 'px';

container.appendChild(particle);
}
}

// ========================================
// Scroll Animation
// ========================================
function initScrollAnimations() {
const cards = $$('.card[data-animate]');

if ('IntersectionObserver' in window) {
const observer = new IntersectionObserver((entries) => {
entries.forEach((entry, index) => {
if (entry.isIntersecting) {
setTimeout(() => {
entry.target.classList.add('animate-in');
}, index * CONFIG.animationDelay);
observer.unobserve(entry.target);
}
});
}, {
threshold: CONFIG.scrollThreshold,
rootMargin: '0px 0px -50px 0px'
});

cards.forEach(card => observer.observe(card));
} else {
cards.forEach(card => card.classList.add('animate-in'));
}
}

// ========================================
// Countdown Timer
// ========================================
function initCountdown() {
const daysEl = $('#days');
const hoursEl = $('#hours');
const minutesEl = $('#minutes');
const secondsEl = $('#seconds');

if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

function updateCountdown() {
const now = new Date();
const diff = CONFIG.weddingDate - now;

if (diff <= 0) {
daysEl.textContent = '00';
hoursEl.textContent = '00';
minutesEl.textContent = '00';
secondsEl.textContent = '00';
return;
}

const days = Math.floor(diff / (1000 * 60 * 60 * 24));
const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((diff % (1000 * 60)) / 1000);

daysEl.textContent = String(days).padStart(2, '0');
hoursEl.textContent = String(hours).padStart(2, '0');
minutesEl.textContent = String(minutes).padStart(2, '0');
secondsEl.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);
}

// ========================================
// Comments System
// ========================================
const API_URL = 'https://script.google.com/macros/s/AKfycbzesfbWIzUp6qEOrSTO5A5fbr5PuAaRToHRXRBpdx7ZeKS4Qg5CrlAVB4FiBl7oliIb/exec';

/* =========================================
   COMMENTS MANAGER
========================================= */

const CommentsManager = {

/* LOAD COMMENTS */
async loadComments(){

const container = document.getElementById('comments-list');

if(!container) return;

container.innerHTML = `
<p class="loading-comments">
Memuat ucapan...
</p>
`;

try{

const response = await fetch(API_URL);
const result = await response.json();

console.log('COMMENTS DATA:', result);

/* FIX ARRAY */
const comments = Array.isArray(result)
    ? result
    : result.data || [];

/* CEK KOSONG */
if(comments.length === 0){

    container.innerHTML = `
        <p class="no-comments">
            Belum ada ucapan. Jadilah yang pertama!
        </p>
    `;

    return;
}

/* RENDER */
container.innerHTML = [...comments].reverse().map(comment => `

    <article class="comment-item">

        <div class="comment-header">

            <span class="comment-name">
                ${this.escapeHtml(comment.name)}
            </span>

            <span class="comment-date">
                ${this.formatDate(comment.time)}
            </span>

        </div>

        <p class="comment-text">
            ${this.escapeHtml(comment.message)}
        </p>

    </article>

`).join('');

}catch(error){

console.error(error);

container.innerHTML = `
<p class="no-comments">
Gagal memuat ucapan.
</p>
`;
}

},

/* SUBMIT COMMENT */
async submitComment(name, message){

try{

const response = await fetch(API_URL, {
method: 'POST',
body: JSON.stringify({
name: name,
message: message
})
});

const result = await response.json();

return result;

}catch(error){

console.error(error);

return {
success:false
};
}

},

/* FORMAT DATE */
formatDate(dateString){

    if(!dateString) return '-';

    try{

        const date = new Date(dateString);

        // VALIDASI
        if(isNaN(date.getTime())){
            return '-';
        }

        return date.toLocaleString('id-ID', {
            weekday:'long',
            year:'numeric',
            month:'long',
            day:'numeric',
            hour:'2-digit',
            minute:'2-digit'
        });

    }catch(error){

        console.error('DATE ERROR:', error);

        return '-';

    }

},

/* ESCAPE HTML */
escapeHtml(text){

const div = document.createElement('div');
div.textContent = text;
return div.innerHTML;

}

};

/* =========================================
   INIT COMMENT FORM
========================================= */
function initCommentForm(){

    const form = document.getElementById('comment-form');

    if(!form) return;

    form.addEventListener('submit', (e)=>{

        e.preventDefault();

        const nameInput = document.getElementById('comment-name');
        const messageInput = document.getElementById('comment-message');

        const submitBtn = form.querySelector('.btn-submit');

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if(!name || !message){

            alert('Isi dulu bro 😄');
            return;

        }

        submitBtn.disabled = true;
        submitBtn.innerText = 'Mengirim...';

        fetch(API_URL,{

            method:'POST',

            body:JSON.stringify({
                name,
                message
            })

        })
        .then(res => res.json())

        .then(()=>{

            submitBtn.innerText = 'Ucapan terkirim 💜';

            form.reset();

            // RELOAD COMMENTS
            CommentsManager.loadComments();

            setTimeout(()=>{

                submitBtn.disabled = false;
                submitBtn.innerText = 'Kirim Ucapan';

            },2000);

        })

        .catch(()=>{

            submitBtn.innerText = 'Gagal mengirim 😢';

            setTimeout(()=>{

                submitBtn.disabled = false;
                submitBtn.innerText = 'Kirim Ucapan';

            },2000);

        });

    });

}

// ========================================
// Copy to Clipboard
// ========================================
function initCopyButtons() {
const copyButtons = $$('.btn-copy');

copyButtons.forEach(btn => {
btn.addEventListener('click', async () => {
const textToCopy = btn.dataset.copy;

try {
await navigator.clipboard.writeText(textToCopy);
const originalText = btn.textContent;
btn.textContent = 'Tersalin!';
btn.style.background = 'var(--accent-gold)';
btn.style.color = 'var(--primary)';

setTimeout(() => {
btn.textContent = originalText;
btn.style.background = '';
btn.style.color = '';
}, 2000);
} catch (err) {
showToast('Gagal menyalin. Silakan salin manual.');
}
});
});
}

// ========================================
// Toast Notification
// ========================================
function showToast(message) {
let toast = $('.toast');

if (!toast) {
toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);
}

toast.textContent = message;

requestAnimationFrame(() => {
toast.classList.add('show');
});

setTimeout(() => {
toast.classList.remove('show');
}, 3000);
}

// ========================================
// Guest Name from URL
// ========================================
function setGuestName() {
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to') || urlParams.get('nama');

// Set name in Opening Screen
const guestNameOpeningEl = $('#guest-name-opening');
if (guestNameOpeningEl && guestName) {
guestNameOpeningEl.textContent = decodeURIComponent(guestName);
}

// Set name in Card 1
const guestNameEl = $('#guest-name');
if (guestNameEl && guestName) {
guestNameEl.textContent = decodeURIComponent(guestName);
}
}

// ========================================
// Initialize Everything
// ========================================
function init() {
createParticles();
CommentsManager.loadComments();
initCommentForm();
initCopyButtons();
setGuestName();
}

// Run on DOM ready
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}

})();
