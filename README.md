# 民泊マーケティング | Minpaku Marketing

[English](#english) | [中文](#中文) | [日本語](#日本語)

---

## English

An AI-powered Japanese minpaku (vacation rental) marketing platform, forked from [airbnb-clone](https://github.com/sudeepmahato16/airbnb_clone) and redesigned for the Japanese market.

### 🚀 Live Demo

**https://airbnb-clone-6fik97c8p-zhu-yanjun-s-projects.vercel.app**

### ✨ What's New (Fork Enhancements)

- **Japanese Localization** — Full i18n: navigation, 15 categories, pricing (¥/night), search, footer
- **SEO / LLMO Optimization** — Complete meta tags (title, description, Open Graph, Twitter Cards, canonical), `lang="ja"`, `llms.txt` for AI search engines
- **Schema.org Structured Data** — `LodgingBusiness` type on listing detail pages
- **AI Customer Support** — FastAPI + OpenRouter chatbot with 8-entry Japanese FAQ knowledge base, floating ChatWidget
- **GEO Audit Report** — Automated audit via Claude Code, score: **A-**

### 🛠 Tech Stack

Next.js 14 · TypeScript · Tailwind CSS · FastAPI · OpenRouter · Prisma · Leaflet · Vercel

### 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)

### 🚦 Quick Start

```bash
git clone https://github.com/zhudalai/airbnb-clone.git
cd airbnb-clone/Airbnb
npm install
# Create .env.local (see below)
npm run dev
# Open http://localhost:3000
```

### Environment Variables

```
DATABASE_URL=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/minpaku
NEXTAUTH_SECRET=your-secret-key
```

> MongoDB is optional for demo. The app works with mock data.

---

## 中文

一个面向日本民泊（民宿）市场的 AI 营销平台，基于 [airbnb-clone](https://github.com/sudeepmahato16/airbnb_clone) 二次开发，专为日本市场定制。

### 🚀 线上演示

**https://airbnb-clone-6fik97c8p-zhu-yanjun-s-projects.vercel.app**

### ✨ 新增功能（二次开发）

- **日语本地化** — 完整国际化：导航栏、15 个分类、价格单位（¥/泊）、搜索、页脚全部日文化
- **SEO / LLMO 优化** — 完整 meta 标签（title/description/OG/Twitter/canonical）、`lang="ja"`、面向 AI 搜索引擎的 `llms.txt`
- **Schema.org 结构化数据** — 房源详情页 `LodgingBusiness` 类型标记
- **AI 客服** — FastAPI + OpenRouter 聊天机器人，含 8 条日语 FAQ 知识库，前端浮动 ChatWidget
- **GEO 审计报告** — 由 Claude Code 自动生成，评分 **A-**

### 🛠 技术栈

Next.js 14 · TypeScript · Tailwind CSS · FastAPI · OpenRouter · Prisma · Leaflet · Vercel

### 📋 环境要求

- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)

### 🚦 快速开始

```bash
git clone https://github.com/zhudalai/airbnb-clone.git
cd airbnb-clone/Airbnb
npm install
# 创建 .env.local（见下方）
npm run dev
# 打开 http://localhost:3000
```

### 环境变量

```
DATABASE_URL=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/minpaku
NEXTAUTH_SECRET=your-secret-key
```

> MongoDB 是可选的。使用 mock data 即可运行。

---

## 日本語

AI を活用した日本の民泊マーケティングプラットフォーム。[airbnb-clone](https://github.com/sudeepmahato16/airbnb_clone) をフォークし、日本市場向けにリデザインしました。

### 🚀 ライブデモ

**https://airbnb-clone-6fik97c8p-zhu-yanjun-s-projects.vercel.app**

### ✨ 新機能（フォークによる改良）

- **日本語ローカライゼーション** — ナビゲーション、15 カテゴリ、料金単位（¥/泊）、検索、フッターの完全日文化
- **SEO / LLMO 最適化** — 完全な meta タグ（title/description/OG/Twitter/canonical）、`lang="ja"`、AI 検索エンジン向け `llms.txt`
- **Schema.org 構造化データ** — 物件詳細ページに `LodgingBusiness` タイプを追加
- **AI カスタマーサポート** — FastAPI + OpenRouter チャットボット、8 件の日本語 FAQ 知識ベース、フローティング ChatWidget
- **GEO 監査レポート** — Claude Code による自動監査、評価 **A-**

### 🛠 テックスタック

Next.js 14 · TypeScript · Tailwind CSS · FastAPI · OpenRouter · Prisma · Leaflet · Vercel

### 📋 必要条件

- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)

### 🚦 クイックスタート

```bash
git clone https://github.com/zhudalai/airbnb_clone.git
cd airbnb_clone/Airbnb
npm install
# .env.local を作成（下記参照）
npm run dev
# http://localhost:3000 にアクセス
```

### 環境変数

```
DATABASE_URL=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/minpaku
NEXTAUTH_SECRET=your-secret-key
```

> MongoDB は任意です。モックデータで動作します。

---

## Contributing / 贡献 / コントリビュート

Contributions are welcome! Fork the repo, create a branch, and open a PR.

コントリビュート歓迎です！リポジトリをフォークし、ブランチを作成して PR を開いてください。

貢献を歓迎します。リポジトリをフォークし、ブランチを作成し、プルリクエストを開いてください。

---

*Built with ❤️ and [Claude Code](https://claude.ai/code)*
