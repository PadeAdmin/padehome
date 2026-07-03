/**
 * 八德教養院 院區介紹頁
 * js/campus.js
 */

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

    container.innerHTML = campuses.map((campus, idx) => {
      const isEven = idx % 2 === 0;

      // 照片區塊
      const photosHTML = campus.photos && campus.photos.length > 0
        ? `<div class="campus-photos campus-photos--${Math.min(campus.photos.length, 3)}">
            ${campus.photos.slice(0, 3).map(p => `
              <div class="campus-photo-item">
                <img src="${p.photo || p}" alt="${campus.name}院區照片" loading="lazy" />
              </div>
            `).join('')}
          </div>`
        : `<div class="campus-photos campus-photos--placeholder">
            <div class="campus-photo-placeholder">
              <span>${campus.name}</span>
            </div>
          </div>`;

      return `
        <div class="campus-block ${isEven ? '' : 'campus-block--reverse'} fade-in" id="campus-${idx}">
          <div class="campus-info">
            <span class="campus-index">院區 ${String(idx + 1).padStart(2, '0')}</span>
            <h2 class="campus-name">${campus.name}</h2>
            <p class="campus-intro">${campus.intro}</p>
            <div class="campus-contacts">
              <div class="campus-contact-item">
                <svg class="campus-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
                <span>${campus.address}</span>
              </div>
              <div class="campus-contact-item">
                <svg class="campus-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                </svg>
                <a href="tel:+886${campus.phone.replace(/^0/,'').replace(/-/g,'')}">${campus.phone}</a>
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

    // 觸發 fade-in
    requestAnimationFrame(() => {
      document.querySelectorAll('.campus-block').forEach(el => {
        el.classList.add('is-visible');
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

document.addEventListener('DOMContentLoaded', loadCampus);
