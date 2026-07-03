/**
 * 捐款徵信頁
 */
async function loadDonate() {
  try {
    const res = await fetch('/data/donate.json');
    if (!res.ok) throw new Error();
    const data = await res.json();
    renderAccounts(data.accounts || []);
    renderReports(data.reports || []);
  } catch (e) {
    document.getElementById('donate-accounts').innerHTML =
      '<p class="news-page-empty">資料載入失敗，請直接來電洽詢。</p>';
    document.getElementById('donate-reports').innerHTML =
      '<p class="donate-reports-empty">目前尚無徵信公告。</p>';
  }
}

function renderAccounts(accounts) {
  const el = document.getElementById('donate-accounts');
  if (!el) return;
  if (accounts.length === 0) {
    el.innerHTML = '<p class="news-page-empty">帳號資料更新中。</p>';
    return;
  }
  el.innerHTML = accounts.map(acc => `
    <div class="donate-account-item">
      <span class="donate-account-bank">${acc.bank}</span>
      <div class="donate-account-num">${acc.account}</div>
      <div class="donate-account-name">戶名：${acc.name}</div>
    </div>
  `).join('');
}

function renderReports(reports) {
  const el = document.getElementById('donate-reports');
  if (!el) return;
  if (reports.length === 0) {
    el.innerHTML = '<p class="donate-reports-empty">目前尚無徵信公告，將於結算後陸續公告。</p>';
    return;
  }
  el.innerHTML = reports.map(r => `
    <div class="donate-report-item">
      <div class="donate-report-info">
        <div class="donate-report-title">${r.title}</div>
        <div class="donate-report-date">${formatDate(r.date)}</div>
      </div>
      <a href="${r.file}" class="donate-report-dl" target="_blank" rel="noopener" download>
        ↓ 下載
      </a>
    </div>
  `).join('');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
}

document.addEventListener('DOMContentLoaded', loadDonate);
