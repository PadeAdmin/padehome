# 八德教養院 官方形象網站

純靜態一頁式官方形象頁，使用 HTML / CSS / JavaScript 製作，可直接部署至 Cloudflare Pages、GitHub Pages 或任何靜態主機。

---

## 檔案結構

```
badeh-website/
├── index.html      # 主頁面（唯一 HTML 檔案）
├── style.css       # 全站樣式
├── script.js       # 互動行為（導覽列、動畫、選單）
└── README.md       # 本說明文件
```

---

## 網站區塊說明

| 區塊 | id | 說明 |
|---|---|---|
| 導覽列 | `#site-header` | 固定置頂，手機版有漢堡選單 |
| Hero | `#hero` | 首頁主視覺 |
| 關於我們 | `#about` | 機構介紹 + 統計卡片 |
| 服務內容 | `#services` | 六張服務卡片 |
| 我們重視的事 | `#values` | 四項核心價值 |
| 環境與活動 | `#gallery` | 圖片展示區（含 placeholder） |
| 最新消息 | `#news` | 三則消息列表 |
| 聯絡我們 | `#contact` | 聯絡資訊 + 地圖嵌入區 |
| Footer | — | 版權與快速連結 |

---

## 如何修改文字

所有文字內容都在 `index.html` 中，直接用文字編輯器開啟修改即可。

### 修改機構介紹（關於我們區塊）

找到 `id="about"` 的 `<section>`，修改其中的 `<p>` 段落文字：

```html
<p class="about-lead">八德教養院是一所……</p>
<p>我們深信……</p>
```

### 修改服務卡片說明

找到 `class="services-grid"` 的 `<div>`，每張卡片的 `<h3>` 是標題，`<p>` 是說明：

```html
<div class="service-card fade-in">
  <h3>生活照顧</h3>           <!-- 修改這裡 -->
  <p>提供完善的……</p>         <!-- 修改這裡 -->
</div>
```

### 修改聯絡資訊

找到 `id="contact"` 區塊，修改以下欄位（有 `<!-- 請填入 -->` 的注解標記）：

```html
<!-- 地址 -->
<div class="contact-value">請填入院址（如：桃園市八德區 ×× 路 ×× 號）</div>

<!-- 電話 -->
<div class="contact-value"><a href="tel:+886000000000">請填入聯絡電話</a></div>

<!-- 信箱 -->
<div class="contact-value"><a href="mailto:info@example.com">請填入聯絡信箱</a></div>
```

### 修改最新消息

找到 `class="news-list"` 區塊，每則消息的結構如下：

```html
<article class="news-item">
  <div class="news-meta">
    <time datetime="2025-01-01">2025 年 1 月</time>     <!-- 日期 -->
    <span class="news-tag">公告</span>                   <!-- 標籤 -->
  </div>
  <div class="news-body">
    <h3>消息標題</h3>                                     <!-- 標題 -->
    <p>消息說明文字……</p>                                  <!-- 內文 -->
  </div>
</article>
```

---

## 如何替換圖片

環境與活動區塊目前使用灰色 placeholder，替換步驟如下：

### 步驟一：準備圖片

建議規格：
- **大圖**（左側跨兩欄）：寬 `1200px` × 高 `675px`（16:9），檔名例如 `photo-main.jpg`
- **小圖**（右側五張）：寬 `600px` × 高 `450px`（4:3），檔名例如 `photo-1.jpg` 至 `photo-5.jpg`
- 格式：`.jpg`（照片）或 `.webp`（較小檔案）
- 建議新增 `images/` 資料夾存放：`images/photo-main.jpg`

### 步驟二：替換 HTML

找到 `class="gallery-grid"` 的 `<div>`，將每個 `<div class="photo-placeholder">` 替換為 `<img>` 標籤：

**替換前：**
```html
<div class="gallery-item gallery-item--large" data-caption="生活環境">
  <div class="photo-placeholder" role="img" aria-label="院區生活環境照片（待更新）">
    <span>院區環境</span>
  </div>
</div>
```

**替換後：**
```html
<div class="gallery-item gallery-item--large" data-caption="生活環境">
  <img src="images/photo-main.jpg" alt="八德教養院院區生活環境" loading="lazy" />
</div>
```

> **提示**：替換後可刪除 `style.css` 中 `/* Placeholder（替換時刪除此區塊）*/` 標記的那段 `.photo-placeholder` 樣式（約 20 行）。

---

## 如何嵌入 Google Map

1. 前往 [Google Maps](https://maps.google.com)
2. 搜尋院所地址
3. 點選「分享」→「嵌入地圖」→ 複製 `<iframe>` 程式碼
4. 在 `index.html` 找到 `class="map-placeholder"` 的 `<div>`
5. 刪除 `<!-- 替換說明 -->` 注解與 `<div class="map-placeholder-inner">...</div>` 整個區塊
6. 貼上 `<iframe>` 程式碼，加上 `title` 屬性與 `width="100%" height="100%"`：

```html
<div class="map-placeholder" role="region" aria-label="八德教養院地圖">
  <iframe
    src="https://www.google.com/maps/embed?pb=..."
    width="100%"
    height="100%"
    style="border:0;"
    allowfullscreen=""
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    title="八德教養院位置地圖">
  </iframe>
</div>
```

---

## 如何修改顏色主題

主色系定義在 `style.css` 頂部的 `:root { ... }` 區塊：

```css
:root {
  --color-primary:     #3B7A6E;   /* 主色：深靜綠（服務卡片、按鈕、icon） */
  --color-primary-dk:  #2C5F56;   /* 主色深（hover 狀態） */
  --color-primary-lt:  #EAF4F2;   /* 主色淺底（背景、眉標） */
  --color-accent:      #5B8FA8;   /* 輔助藍 */
  --color-warm:        #C97D4E;   /* 暖橙點綴 */
}
```

只需修改這幾個 hex 值，全站色彩即同步更新。

---

## 如何部署到 Cloudflare Pages

### 方法一：透過 GitHub（推薦）

1. 在 GitHub 建立新的 repository（公開或私人皆可）
2. 將本資料夾所有檔案上傳（或 `git push`）
3. 前往 [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages**
4. 選擇「Connect to Git」→ 選擇剛才的 repository
5. Build settings：
   - **Framework preset**：選 `None`
   - **Build command**：留空
   - **Build output directory**：`/`（根目錄）或留空
6. 點選「Save and Deploy」，等待部署完成
7. Cloudflare 會自動提供 `https://your-project.pages.dev` 的網址

### 方法二：直接上傳

1. 前往 [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Upload assets**
2. 拖曳整個資料夾或 zip 壓縮檔
3. 設定 Project name，點選「Deploy site」

### 綁定自訂網域

部署成功後，在 Pages 專案 → **Custom domains** → 加入您的網域（需在 Cloudflare 管理該網域的 DNS）。

---

## 後續維護建議

| 項目 | 說明 |
|---|---|
| 更新消息 | 直接修改 `index.html` 的 `#news` 區塊 |
| 新增照片 | 將照片放入 `images/` 資料夾，替換 placeholder |
| 修改聯絡資訊 | 修改 `#contact` 區塊中的 placeholder 文字 |
| 嵌入地圖 | 依上方說明替換 `.map-placeholder` 區塊 |
| SEO | 修改 `<head>` 中的 `<meta name="description">` 與 `<title>` |

---

## 技術規格

- **純靜態**：HTML5 + CSS3 + Vanilla JavaScript，無任何後端或框架依賴
- **字型**：Google Fonts（Noto Sans TC + Noto Serif TC）
- **響應式**：Mobile-first，支援 320px ~ 1440px+ 螢幕寬度
- **無障礙**：ARIA 標籤、語意化 HTML、鍵盤操作支援、`prefers-reduced-motion` 支援
- **效能**：無第三方 JS 框架，CSS 動畫使用 `will-change` 優化，圖片使用 `loading="lazy"`
