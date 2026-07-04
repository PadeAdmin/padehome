/**
 * 八德教養院 院區介紹頁
 * js/campus.js
 * 支援 1～5 張院區照片，點照片可開燈箱前後切換
 */

let campusAlbums = [];   // 每個院區的照片清單
let cLbAlbum = 0;
let cLbIndex = 0;

function campusEsc(s) {
  return String(s || '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function loadCampus() {
  const container = document.getElementById('campus-list');
  if (!container) return;

  try {
    const res = await fetch('/data/campus.json');
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    const campuses = data.campuses || [];

    if (campuses.length === 0) {
      container.innerHTML = '<p class="campus-empty">院區資料更新中，請稍候。</p>';
      return;
    }

    campusAlbums = campuses.map(c =>
      (c.photos || []).map(p => (p && typeof p === 'object') ? p.photo : p).filter(Boolean).slice(0, 5)
    );

    container.innerHTML = campuses.map((campus, idx) => {
      const isEven = idx % 2 === 0;
      const photos = campusAlbums[idx];

      const photosHTML = photos.length > 0
        ? `<div class="campus-photos campus-photos--${photos.length}">
            ${photos.map((src, pIdx) => `
              <div class="campus-photo-item" data-campus="${idx}" data-photo="${pIdx}" tabindex="0" role="button"
                   aria-label="放大檢視${campusEsc(campus.name)}照片">
                <img src="${campusEsc(src)}" alt="${campusEsc(campus.name)}院區照片" loading="lazy" />
              </div>
            `).join('')}
          </div>`
        : `<div class="campus-photos campus-photos--placeholder">
            <div class="campus-photo-placeholder">
              <span>${campusEsc(campus.name)}</span>
            </div>
          </div>`;

      return `
        <div class="campus-block ${isEven ? '' : 'campus-block--reverse'} fade-in" id="campus-${idx}">
          <div class="campus-info">
            <span class="campus-index">院區 ${String(idx + 1).padStart(2, '0')}</span>
            <h2 class="campus-name">${campusEsc(campus.name)}</h2>
            <p class="campus-intro">${campusEsc(campus.intro)}</p>
            <div class="campus-contacts">
              <div class="campus-contact-item">
                <svg class="campus-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
                <span>${campusEsc(campus.address)}</span>
              </div>
              <div class="campus-contact-item">
                <svg class="campus-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                </svg>
                <a href="tel:+886${String(campus.phone || '').replace(/^0/,'').replace(/-/g,'')}">${campusEsc(campus.phone)}</a>
              </div>
            </div>
          </div>
          <div class="campus-media">
            ${photosHTML}
          </div>
        </div>
        ${idx < campuses.length - 1 ? '<hr class="campus-divider" />' : ''}
      `;
    }).join('');

    requestAnimationFrame(() => {
      document.querySelectorAll('.campus-block').forEach(el => el.classList.add('is-visible'));
    });

    // 點照片開燈箱
    container.querySelectorAll('.campus-photo-item[data-campus]').forEach(item => {
      const open = () => openCampusLightbox(Number(item.dataset.campus), Number(item.dataset.photo));
      item.addEventListener('click', open);
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });

  } catch (e) {
    container.innerHTML = `
      <div class="campus-block fade-in is-visible">
        <div class="campus-info">
          <span class="campus-index">院區 01</span>
          <h2 class="campus-name">建國院區</h2>
          <p class="campus-intro">建國院區為本院主要院區，提供身心障礙者全日住宿照顧服務。</p>
          <div class="campus-contacts">
            <div class="campus-contact-item">
              <span>(334)桃園市八德區建國路38號</span>
            </div>
            <div class="campus-contact-item">
              <a href="tel:+886333685385">03-3685385</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

/* ── 燈箱（自動建立，campus.html 不需加 HTML） ── */
function ensureCampusLightbox() {
  if (document.getElementById('lightbox')) return;
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="album-lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="照片放大檢視">
      <button class="lightbox-close" id="lightbox-close" aria-label="關閉">✕</button>
      <button class="lightbox-nav lightbox-prev" id="lightbox-prev" aria-label="上一張">‹</button>
      <figure class="lightbox-stage">
        <img id="lightbox-img" src="" alt="" />
        <figcaption class="lightbox-caption">
          <span id="lightbox-title"></span>
          <span id="lightbox-counter"></span>
        </figcaption>
      </figure>
      <button class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="下一張">›</button>
    </div>`;
  document.body.appendChild(div.firstElementChild);

  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-close').addEventListener('click', closeCampusLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', e => { e.stopPropagation(); stepCampusLightbox(-1); });
  document.getElementById('lightbox-next').addEventListener('click', e => { e.stopPropagation(); stepCampusLightbox(1); });
  lb.addEventListener('click', e => { if (e.target === e.currentTarget) closeCampusLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeCampusLightbox();
    if (e.key === 'ArrowLeft') stepCampusLightbox(-1);
    if (e.key === 'ArrowRight') stepCampusLightbox(1);
  });

  let touchX = null;
  lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) stepCampusLightbox(dx < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });
}

function openCampusLightbox(albumIdx, photoIdx) {
  ensureCampusLightbox();
  cLbAlbum = albumIdx;
  cLbIndex = photoIdx;
  renderCampusLightbox();
  document.getElementById('lightbox').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function renderCampusLightbox() {
  const photos = campusAlbums[cLbAlbum] || [];
  const nameEl = document.querySelector(`#campus-${cLbAlbum} .campus-name`);
  const total = photos.length;
  const img = document.getElementById('lightbox-img');
  img.src = photos[cLbIndex];
  img.alt = `院區照片 第 ${cLbIndex + 1} 張`;
  document.getElementById('lightbox-title').textContent = nameEl ? nameEl.textContent : '';
  document.getElementById('lightbox-counter').textContent = total > 1 ? `${cLbIndex + 1} / ${total}` : '';
  const multi = total > 1;
  document.getElementById('lightbox-prev').style.display = multi ? '' : 'none';
  document.getElementById('lightbox-next').style.display = multi ? '' : 'none';
}

function stepCampusLightbox(dir) {
  const photos = campusAlbums[cLbAlbum] || [];
  if (photos.length < 2) return;
  cLbIndex = (cLbIndex + dir + photos.length) % photos.length;
  renderCampusLightbox();
}

function closeCampusLightbox() {
  document.getElementById('lightbox')?.classList.remove('is-open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', loadCampus);
