/**
 * 八德教養院 首頁動態資料載入
 */

async function loadSiteData() {
  try {
    const res = await fetch('/data/site.json');
    if (!res.ok) return;
    const data = await res.json();

    if (data.hero_image) {
      const heroBg = document.getElementById('hero-bg');
      if (heroBg) {
        heroBg.style.cssText = `
          background: linear-gradient(rgba(30,50,45,0.55), rgba(30,50,45,0.45)),
                      url('${data.hero_image}') center/cover no-repeat;
          position: absolute; inset: 0;
        `;
        heroBg.innerHTML = '';
        document.getElementById('hero')?.classList.add('hero--photo');
      }
    }
    if (data.hero_title) {
      const el = document.getElementById('hero-subtitle');
      if (el) el.textContent = data.hero_title;
    }
    if (data.intro) {
      const el = document.getElementById('about-intro');
      if (el) el.textContent = data.intro;
    }
    if (data.address) {
      const el = document.getElementById('contact-address');
      if (el) el.textContent = data.address;
    }
    if (data.phone) {
      const el = document.getElementById('contact-phone');
      if (el) {
        el.textContent = data.phone;
        el.href = 'tel:+886' + data.phone.replace(/^0/, '').replace(/-/g, '');
      }
    }
    if (data.email) {
      const el = document.getElementById('contact-email');
      if (el) { el.textContent = data.email; el.href = 'mailto:' + data.email; }
    }
    if (data.hours) {
      const el = document.getElementById('contact-hours');
      if (el) el.textContent = data.hours;
    }
  } catch (e) { console.warn('site.json 載入失敗', e); }
}

async function loadNewsPreview() {
  const container = document.getElementById('news-preview-list');
  if (!container) return;
  try {
    const res = await fetch('/data/news.json');
    if (!res.ok) throw new Error();
    const data = await res.json();
    const items = (data.items || [])
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    if (items.length === 0) {
      container.innerHTML = '<p class="news-empty">消息更新中，請稍候。</p>';
      return;
    }
    container.innerHTML = items.map(item => `
      <article class="news-item" onclick="location.href='news.html'" style="cursor:pointer">
        <div class="news-meta">
          <time datetime="${item.date}">${formatDate(item.date)}</time>
          <span class="news-tag">${item.tag || '公告'}</span>
        </div>
        <div class="news-body">
          <h3>${item.title}</h3>
          <p>${truncate(item.summary, 60)}</p>
        </div>
        <div class="news-arrow" aria-hidden="true">→</div>
      </article>
    `).join('');
  } catch (e) {
    container.innerHTML = `
      <article class="news-item">
        <div class="news-meta"><time>2026</time><span class="news-tag">公告</span></div>
        <div class="news-body"><h3>官網建置中</h3><p>各項院務資訊將陸續更新，敬請期待。</p></div>
        <div class="news-arrow" aria-hidden="true">→</div>
      </article>`;
  }
}

async function loadGalleryPreview() {
  const container = document.getElementById('gallery-preview-grid');
  if (!container) return;
  try {
    const res = await fetch('/data/gallery.json');
    if (!res.ok) throw new Error();
    const data = await res.json();
    const items = (data.items || [])
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);

    if (items.length === 0) return;

    container.innerHTML = items.map(album => `
      <a href="gallery.html" class="gallery-preview-card">
        <div class="gallery-preview-img">
          <img src="${album.cover}" alt="${album.title}" loading="lazy" />
        </div>
        <div class="gallery-preview-caption">
          <span>${album.title}</span>
          <small>${formatDate(album.date)}</small>
        </div>
      </a>
    `).join('');
  } catch (e) { /* 維持佔位文字 */ }
}

function truncate(text, maxLen) {
  if (!text) return '';
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.length > maxLen ? clean.slice(0, maxLen) + '…' : clean;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
}

document.addEventListener('DOMContentLoaded', () => {
  loadSiteData();
  loadNewsPreview();
  loadGalleryPreview();
});
