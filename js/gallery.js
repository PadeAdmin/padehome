/**
 * 活動花絮頁
 */
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
    container.innerHTML = items.map((album, idx) => `
      <div class="gallery-album-card fade-in is-visible" data-idx="${idx}">
        <div class="gallery-album-cover">
          ${album.cover
            ? `<img src="${album.cover}" alt="${album.title}" loading="lazy" />`
            : `<div class="gallery-album-cover-placeholder">活動照片</div>`}
        </div>
        <div class="gallery-album-info">
          <div class="gallery-album-title">${album.title}</div>
          <div class="gallery-album-date">${formatDate(album.date)}</div>
          ${album.desc ? `<p class="gallery-album-desc">${album.desc}</p>` : ''}
        </div>
      </div>
    `).join('');

    // 點封面 → 燈箱開第一張
    document.querySelectorAll('.gallery-album-card').forEach((card, idx) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const album = items[idx];
        const src = (album.photos && album.photos[0])
          ? (album.photos[0].photo || album.photos[0])
          : album.cover;
        if (src) openLightbox(src, album.title);
      });
    });

  } catch (e) {
    container.innerHTML = '<p class="news-page-empty" style="grid-column:1/-1">活動照片陸續更新中，敬請期待。</p>';
  }
}

function openLightbox(src, alt) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;
  img.src = src; img.alt = alt || '';
  lb.classList.add('is-open');
  document.body.style.overflow = 'hidden';
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
  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeLightbox();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
});
