# 八德教養院 官方網站

多頁式靜態網站，內容透過 **Sveltia CMS**（後台 `/admin`）編輯，資料存成 JSON 檔，前端用 Vanilla JavaScript 讀取渲染。可部署至 Cloudflare Pages、GitHub Pages 或任何靜態主機。

> ⚠️ 舊版 README 描述的是「單頁式、直接改 index.html 文字」的架構，現在**已經不是這樣**了。現況是：**內容都改用 CMS 後台編輯，會寫入 `data/*.json`，頁面自動讀取顯示**，不需要也不建議直接改 HTML 裡的文字。

---

## 檔案結構

```
padehome-main/
├── admin/
│   ├── index.html      # Sveltia CMS 後台入口（pade.org.tw/admin）
│   └── config.yml      # CMS 欄位定義（決定後台看到哪些欄位）
├── data/                # CMS 編輯的內容都存在這裡（JSON）
│   ├── site.json        # 網站基本資料（首頁大圖、簡介、聯絡資訊）
│   ├── news.json         # 最新消息
│   ├── gallery.json      # 活動花絮相簿
│   ├── campus.json       # 院區介紹（建國院區／永豐院區）
│   └── donate.json       # 捐款帳號＋徵信公告
├── images/uploads/      # CMS 上傳的圖片／PDF 都放這裡
├── js/
│   ├── home.js           # 首頁：讀 site.json / news.json / gallery.json
│   ├── news.js           # 最新消息頁：讀 news.json
│   ├── gallery.js        # 活動花絮頁：讀 gallery.json
│   ├── campus.js         # 院區介紹頁：讀 campus.json
│   └── donate.js         # 捐款徵信頁：讀 donate.json
├── index.html / news.html / gallery.html / campus.html / donate.html
├── style.css            # 全站主要樣式
├── style-extra.css       # 各子頁面（消息／花絮／院區／捐款）樣式
├── gallery-fix.css       # 活動花絮版面微調
├── script.js             # 導覽列、選單等共用互動行為
└── README.md
```

---

## 內容怎麼改（給編輯人員）

**不要直接改 HTML**，一律透過後台：

1. 前往 `https://pade.org.tw/admin`
2. 用 GitHub 帳號登入（後台設定在 `admin/config.yml`，`backend.repo: PadeAdmin/padehome`）
3. 依左側選單編輯：

| 後台選單 | 對應檔案 | 說明 |
|---|---|---|
| 網站基本資料 | `data/site.json` | 機構簡介、電話、地址、服務時間、**首頁大圖／標語** |
| 最新消息 | `data/news.json` | 見下方「最新消息欄位說明」 |
| 活動花絮 | `data/gallery.json` | 相簿標題、日期、封面照、多張照片 |
| 院區介紹 | `data/campus.json` | 兩個院區的地址、電話、介紹、照片 |
| 捐款徵信 | `data/donate.json` | 捐款帳號、各期徵信 PDF/Excel |

儲存後 CMS 會自動 commit 到 GitHub，觸發 Cloudflare Pages 重新部署，通常 1～2 分鐘內網站會更新。

### 最新消息欄位說明（容易搞混，特別註記）

- **摘要**：只給列表預覽用，**限 50 字內的短介紹**，不要貼整篇公告全文。
- **內文**：完整活動說明放這裡，支援 Markdown（可以打清單、粗體、連結），前台會自動排版。
- **照片**：直式或橫式都可以，前台會完整顯示不裁切。

> 如果摘要貼了全文、內文卻空著或只填一小段，前台雖然不會壞掉（會自動避免顯示重複內容），但排版會不理想。請照上面規則分開填寫。

---

## 技術規格

- 純靜態：HTML5 + CSS3 + Vanilla JavaScript，各頁面用 `fetch()` 讀對應的 `data/*.json` 動態渲染
- 內容管理：[Sveltia CMS](https://github.com/sveltia/sveltia-cms)，後台設定見 `admin/config.yml`
- 最新消息「內文」使用 [marked.js](https://github.com/markedjs/marked)（CDN 引入）將 Markdown 轉成 HTML
- 字型：Google Fonts（Noto Sans TC + Noto Serif TC）
- 響應式：Mobile-first
- 部署：Git push 到 `PadeAdmin/padehome`（`main` branch）→ Cloudflare Pages 自動建置

---

## 開發者注意事項

- **hero 區塊**：`index.html` 的首頁大圖／標語元素必須保留 `id="hero-bg"` 與 `id="hero-subtitle"`，`js/home.js` 是靠這兩個 id 抓取元素套用 `site.json` 的設定，改版面時不要移除或改名這兩個 id。
- **圖片欄位格式**：CMS 的 `list` widget 底下的 image 欄位，存出來的 JSON 會是 `{ image: "路徑" }` 這種物件，各 `js/*.js` 在取值時都要用 `img.image || img` 這種寫法相容（因為有些欄位是純字串陣列，例如 `campus.json` 的 photos，有些是物件陣列，例如 `news.json` 的 images）。修改資料結構或新增欄位時要注意這個差異。
- **新增頁面／欄位**：先在 `admin/config.yml` 定義欄位 → 對應 `data/*.json` 會有新欄位 → 到對應的 `js/*.js` 補上讀取與渲染邏輯。

---

## 本機測試

純靜態網站，直接用任何本機伺服器開啟即可，例如：

```bash
npx serve .
```

CMS 後台在本機無法登入 GitHub OAuth，需部署後或搭配 `config.yml` 裡的 `base_url`（OAuth proxy）才能測試後台。
