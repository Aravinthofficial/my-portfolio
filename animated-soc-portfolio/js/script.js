'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Opening animation: has a real skip action and does not block navigation forever.
const intro = $('#intro');
const skipIntro = $('#skipIntro');
const loadingBar = $('#loadingBar');
const loadingPercent = $('#loadingPercent');
const loadingText = $('#loadingText');
let introDone = false;
let introProgress = 0;
let introInterval;
function finishIntro() {
  if (introDone) return;
  introDone = true;
  clearInterval(introInterval);
  if (loadingBar) loadingBar.style.width = '100%';
  if (loadingPercent) loadingPercent.textContent = '100%';
  if (loadingText) loadingText.textContent = 'Secure interface ready';
  if (intro) intro.classList.add('hidden');
  document.body.classList.remove('intro-active');
  try { sessionStorage.setItem('arPortfolioIntroSeen', '1'); } catch (_) { /* private mode */ }
}
if (intro) {
  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem('arPortfolioIntroSeen') === '1'; } catch (_) { /* private mode */ }
  if (alreadySeen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    intro.classList.add('hidden');
    introDone = true;
  } else {
    introInterval = setInterval(() => {
      introProgress = Math.min(100, introProgress + (introProgress < 70 ? 4 : 2));
      if (loadingBar) loadingBar.style.width = `${introProgress}%`;
      if (loadingPercent) loadingPercent.textContent = `${String(introProgress).padStart(2, '0')}%`;
      if (loadingText) loadingText.textContent = introProgress < 35 ? 'Loading security modules…' : introProgress < 75 ? 'Preparing analyst workspace…' : 'Establishing secure interface…';
      if (introProgress >= 100) finishIntro();
    }, 45);
    skipIntro?.addEventListener('click', finishIntro);
    window.addEventListener('keydown', (event) => { if (event.key === 'Escape') finishIntro(); }, { once: true });
  }
}

// Animated role line.
const typedRole = $('#typedRole');
const roles = ['SOC Analyst', 'Cybersecurity Analyst', 'Security Monitoring', 'Threat Detection'];
let roleIndex = 0;
let letterIndex = roles[0].length;
let deleting = true;
function typeNext() {
  if (!typedRole || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const phrase = roles[roleIndex];
  letterIndex += deleting ? -1 : 1;
  typedRole.textContent = phrase.slice(0, Math.max(0, letterIndex));
  let wait = deleting ? 47 : 78;
  if (!deleting && letterIndex >= phrase.length) { deleting = true; wait = 1350; }
  else if (deleting && letterIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; wait = 240; }
  window.setTimeout(typeNext, wait);
}
if (typedRole && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) window.setTimeout(typeNext, 1600);

// Mobile navigation: each item scrolls to its matching section on this page.
const menuToggle = $('#menuToggle');
const siteNav = $('#siteNav');
function closeMenu() {
  siteNav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
}
menuToggle?.addEventListener('click', () => {
  const open = siteNav?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
$$('.nav-link, .brand, .scroll-cue, .hero-actions a, .text-link, .back-top').forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = $(href);
      if (target) {
        event.preventDefault();
        finishIntro();
        target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        if (history.replaceState) history.replaceState(null, '', href);
        closeMenu();
      }
    }
  });
});

// Mark the nav item of the section that is currently on screen.
const navLinks = $$('.nav-link');
const sections = $$('[data-section]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .1, .25, .5] });
  sections.forEach(section => sectionObserver.observe(section));
} else {
  window.addEventListener('scroll', () => {
    let current = 'home';
    sections.forEach(section => { if (window.scrollY >= section.offsetTop - 180) current = section.id; });
    navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${current}`));
  }, { passive: true });
}

// Scroll reveal and reading progress.
const revealItems = $$('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else revealItems.forEach(item => item.classList.add('in-view'));
const scrollProgress = $('#scrollProgress');
const floatingTop = $('#floatingTop');
function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = `${percent}%`;
  floatingTop?.classList.toggle('visible', window.scrollY > 550);
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();
floatingTop?.addEventListener('click', () => $('#home')?.scrollIntoView({ behavior: 'smooth' }));
$('#backTop')?.addEventListener('click', () => $('#home')?.scrollIntoView({ behavior: 'smooth' }));

// Theme toggle. Choice persists in the current browser.
const themeToggle = $('#themeToggle');
const themeIcon = $('#themeIcon');
let isLight = false;
try { isLight = localStorage.getItem('arPortfolioTheme') === 'light'; } catch (_) { /* private mode */ }
function setTheme(light) {
  isLight = light;
  document.body.classList.toggle('light-theme', light);
  if (themeIcon) themeIcon.textContent = light ? '☾' : '☼';
  themeToggle?.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f1f6fb' : '#050b18');
  try { localStorage.setItem('arPortfolioTheme', light ? 'light' : 'dark'); } catch (_) { /* private mode */ }
}
setTheme(isLight);
themeToggle?.addEventListener('click', () => setTheme(!isLight));

// Interactive project filters.
const filterButtons = $$('.filter-btn');
const projectCards = $$('.project-card');
const projectEmpty = $('#projectEmpty');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter || 'all';
  filterButtons.forEach(item => item.classList.toggle('active', item === button));
  let count = 0;
  projectCards.forEach(card => {
    const matches = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('is-hidden', !matches);
    if (matches) count++;
  });
  if (projectEmpty) projectEmpty.hidden = count !== 0;
}));

// Project details open in a dialog instead of sending visitors to a broken or missing page.
const projectDetails = {
  ssh: { eyebrow: '01 / SIEM DETECTION', title: 'SSH Brute-Force Detection', summary: 'Investigated repeated SSH authentication failures using Linux auth.log data forwarded to Splunk.', tasks: ['Compared failed and successful login patterns by source IP and username.', 'Created a detection rule for 3 or more failed logins within 5 minutes.', 'Mapped the activity to MITRE ATT&CK T1110 and documented SSH hardening guidance.'], tags: ['Splunk', 'SPL', 'Kali Linux', 'MITRE ATT&CK T1110'] },
  snort: { eyebrow: '02 / NETWORK DEFENSE', title: 'Network Intrusion Detection System', summary: 'Configured Snort on Ubuntu Linux to monitor traffic and produce alerts for suspicious activity.', tasks: ['Configured the network intrusion detection environment.', 'Tested custom rules and reviewed generated alerts.', 'Documented rule logic and alert evidence in a technical report.'], tags: ['Snort', 'Ubuntu Linux', 'Network traffic', 'IDS'] },
  phishing: { eyebrow: '03 / THREAT ANALYSIS', title: 'Phishing Email Detection & Analysis', summary: 'Reviewed three phishing samples and assigned risk levels from the available email and URL evidence.', tasks: ['Examined email headers and sender authenticity.', 'Checked URL reputation and domain indicators.', 'Documented spoofed senders, lookalike domains and urgency tactics with prevention guidance.'], tags: ['VirusTotal', 'MXToolbox', 'WHOIS', 'Email headers'] },
  web: { eyebrow: '04 / APPLICATION SECURITY', title: 'Web Application Vulnerability Assessment', summary: 'Assessed a test web application and organized findings by severity with prioritized remediation steps.', tasks: ['Recorded 13 findings: 3 High, 4 Medium, 4 Low and 2 Informational.', 'Identified examples including unencrypted HTTP, missing security headers and lack of CSRF protection.', 'Prepared remediation recommendations and documented evidence.'], tags: ['Nmap', 'OWASP ZAP', 'DevTools', 'Vulnerability assessment'] }
};
const modal = $('#projectModal');
const modalTitle = $('#modalTitle');
const modalSummary = $('#modalSummary');
const modalTasks = $('#modalTasks');
const modalTags = $('#modalTags');
const modalEyebrow = $('#modalEyebrow');
let modalReturnFocus = null;
function openProjectModal(key, trigger) {
  const details = projectDetails[key];
  if (!details || !modal) return;
  modalReturnFocus = trigger || document.activeElement;
  modalEyebrow.textContent = details.eyebrow;
  modalTitle.textContent = details.title;
  modalSummary.textContent = details.summary;
  modalTasks.replaceChildren(...details.tasks.map(task => { const li = document.createElement('li'); li.textContent = task; return li; }));
  modalTags.replaceChildren(...details.tags.map(tag => { const span = document.createElement('span'); span.textContent = tag; return span; }));
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('#modalClose')?.focus();
}
function closeProjectModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalReturnFocus?.focus?.();
}
$$('[data-project]').forEach(button => button.addEventListener('click', () => openProjectModal(button.dataset.project, button)));
$('#modalClose')?.addEventListener('click', closeProjectModal);
$('#modalDone')?.addEventListener('click', closeProjectModal);
$$('[data-close-modal]').forEach(el => el.addEventListener('click', closeProjectModal));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal?.classList.contains('open')) closeProjectModal();
  if (event.key === 'Tab' && modal?.classList.contains('open')) {
    const focusable = $$('button, a[href]', modal).filter(el => !el.disabled && el.offsetParent !== null);
    if (focusable.length && event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[focusable.length - 1].focus(); }
    else if (focusable.length && !event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0].focus(); }
  }
});

// Keep the copyright date current and allow the profile image to fail gracefully.
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();
const profilePhoto = $('#profilePhoto');
profilePhoto?.addEventListener('error', () => { profilePhoto.src = 'assets/profile-placeholder.svg'; });
