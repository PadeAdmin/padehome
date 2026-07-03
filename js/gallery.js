/**
 * 活動花絮頁：相簿列表 + 燈箱（可前後切換）
 */
let albums = [];          // 正規化後的相簿資料
let lbAlbum = 0;          // 目前燈箱的相簿索引
let lbIndex = 0;          // 目前照片索引

function normalizePhotos(album) {
  const list = [];
  if (album.cover) list.push(album.cover);
  (album.photos || []).forEach(p => {
    const src = (p && typeof p === 'object') ? p.photo : p;
    if (src && !list.includes(src)) list.push(src);
  });
  return list;
}

function esc(s) {
  return String(s || '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function loadGallery() {
  const container = document.getElementById('gallery-page-grid');
  if (!container) return;
  try {
    const res = await fetch('/data/gallery.json');
    if (!res.ok) throw new Error();
    const data = await res.json();
    const items = (data.items || [])
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (items.length === 0) {
      container.innerHTML = '<p class="news-page-empty" style="grid-column:1/-1">活動照片陸續更新中，敬請期待。</p>';
      return;
    }

    albums = items.map(a => ({
      title: a.title || '',
      date: a.date,
      desc: a.desc || '',
      photos: normalizePhotos(a)
    }));

    container.innerHTML = albums.map((album, idx) => `
      <div class="gallery-album-card fade-in is-visible" data-idx="${idx}" tabindex="0" role="button"
           aria-label="開啟相簿：${esc(album.title)}">
        <div class="gallery-album-cover">
          ${album.photos[0]
            ? `<img src="${esc(album.photos[0])}" alt="${esc(album.title)}" loading="lazy" />`
            : `<div class="gallery-album-cover-placeholder">活動照片</div>`}
          ${album.photos.length > 1
            ? `<span class="gallery-album-count">${album.photos.length} 張</span>` : ''}
        </div>
        <div class="gallery-album-info">
          <div class="gallery-album-title">${esc(album.title)}</div>
          <div class="gallery-album-date">${formatDate(album.date)}</div>
          ${album.desc ? `<p class="gallery-album-desc">${esc(album.desc)}</p>` : ''}
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.gallery-album-card').forEach(card => {
      const open = () => {
        const idx = Number(card.dataset.idx);
        if (albums[idx] && albums[idx].photos.length) openLightbox(idx, 0);
      };
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });

  } catch (e) {
    container.innerHTML = '<p class="news-page-empty" style="grid-column:1/-1">活動照片陸續更新中，敬請期待。</p>';
  }
}

/* ── 燈箱 ── */
function openLightbox(albumIdx, photoIdx) {
  lbAlbum = albumIdx;
  lbIndex = photoIdx;
  renderLightbox();
  document.getElementById('lightbox')?.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function renderLightbox() {
  const album = albums[lbAlbum];
  if (!album) return;
  const img = document.getElementById('lightbox-img');
  const title = document.getElementById('lightbox-title');
  const counter = document.getElementById('lightbox-counter');
  const prev = document.getElementById('lightbox-prev');
  const next = document.getElementById('lightbox-next');
  const total = album.photos.length;

  img.src = album.photos[lbIndex];
  img.alt = `${album.title} 第 ${lbIndex + 1} 張`;
  title.textContent = album.title;
  counter.textContent = total > 1 ? `${lbIndex + 1} / ${total}` : '';
  const multi = total > 1;
  prev.style.display = multi ? '' : 'none';
  next.style.display = multi ? '' : 'none';
}

function stepLightbox(dir) {
  const album = albums[lbAlbum];
  if (!album || album.photos.length < 2) return;
  const total = album.photos.length;
  lbIndex = (lbIndex + dir + total) % total;
  renderLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox')?.classList.remove('is-open');
  document.body.style.overflow = '';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
}

document.addEventListener('DOMContentLoaded', () => {
  loadGallery();

  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', e => { e.stopPropagation(); stepLightbox(-1); });
  document.getElementById('lightbox-next')?.addEventListener('click', e => { e.stopPropagation(); stepLightbox(1); });

  lb?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  // 手機滑動切換
  let touchX = null;
  lb?.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lb?.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });
});
