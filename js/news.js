/**
 * 最新消息頁
 */
async function loadNews() {
  const container = document.getElementById('news-page-list');
  if (!container) return;
  try {
    const res = await fetch('/data/news.json');
    if (!res.ok) throw new Error();
    const data = await res.json();
    const items = (data.items || [])
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (items.length === 0) {
      container.innerHTML = '<p class="news-page-empty">目前尚無消息，請稍後再來。</p>';
      return;
    }
    container.innerHTML = items.map(item => `
      <article class="news-page-item fade-in is-visible">
        <div class="news-page-meta">
          <time datetime="${item.date}">${formatDate(item.date)}</time>
          <span class="news-tag">${item.tag || '公告'}</span>
        </div>
        <h2 class="news-page-title">${item.title}</h2>
        <p class="news-page-summary">${item.summary || ''}</p>
        ${item.images && item.images.length > 0 ? `
          <div class="news-page-images">
            ${item.images.map(img => `
              <img src="${img.image || img}" alt="${item.title}" loading="lazy" />
            `).join('')}
          </div>` : ''}
      </article>
    `).join('');
  } catch (e) {
    container.innerHTML = '<p class="news-page-empty">消息資料更新中，請稍後再來。</p>';
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

document.addEventListener('DOMContentLoaded', loadNews);
