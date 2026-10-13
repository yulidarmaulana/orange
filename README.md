# 🟠 Orange | Professional Bitcoin Wallet Tracker

![Vue 3](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Orange** is a sleek, modern, and highly responsive Bitcoin dashboard and wallet tracking application built with **Vue 3, TypeScript, and Vite**. It provides a real-time Bitcoin market snapshot (live price, market cap, ATH metrics, and block height) alongside a full-featured wallet tracker to monitor addresses, analyze UTXOs, and inspect transaction histories without relying on bulky block explorers.

With a beautiful UI (featuring Dark Mode and glassmorphism elements), Orange proxies real-time blockchain data via robust APIs and provides powerful local-first metadata management.

---

## ✨ Key Features

- **⚡ Live Bitcoin Snapshot:** A dedicated macro dashboard displaying real-time BTC price, market capitalization, All-Time High (ATH), percentage change from ATH, ATH date & days elapsed, and current Bitcoin network block height with automatic background refresh.
- **🧭 Seamless View Navigation:** Effortlessly toggle between the live **Bitcoin Snapshot** dashboard and the dedicated **Wallet Tracker** tool with responsive navigation.
- **🔍 Real-Time Blockchain Tracking:** Search for any Bitcoin address to instantly view its final balance, total received/sent, and total transaction count.
- **🏷️ Custom Labels & Notes:** Personalize your experience by assigning custom names and detailed notes to specific addresses. This data is safely stored locally (`localStorage`).
- **🔖 Watchlist Management:** Bookmark important wallets. The smart watchlist modal displays your custom labels alongside the addresses for quick recognition.
- **💱 Live Fiat Conversion:** Instantly convert Bitcoin balances and transaction values into multiple fiat currencies (USD, EUR, IDR, etc.) using real-time rates from CoinGecko.
- **📜 Deep Transaction History:** Browse up to 50 recent transactions with detailed inputs/outputs, confirmations, fees, block time, and network status.
- **🪙 UTXO Explorer:** View Unspent Transaction Outputs (UTXOs) in a dedicated tab to understand exactly how a wallet's funds are structured.
- **📤 Data Export:** Easily export your transaction history to **CSV** or **JSON** for tax reporting or external analysis.
- **🌓 Dark/Light Mode & Responsive Design:** A beautifully crafted, fully reactive theme switcher that respects system preferences with an optimized layout for both mobile and desktop screens.

---

## 🛠️ Technology Stack

- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build Tool:** Vite (Ultra-fast HMR)
- **Language:** TypeScript
- **State & Data Fetching:** TanStack Vue Query (Optimized caching & network requests)
- **Styling:** Tailwind CSS + Vanilla CSS (Custom animations & Glassmorphism)
- **Icons:** Lucide-Vue-Next
- **APIs Used:**
  - `api.blockcypher.com` (For reliable Bitcoin blockchain data and address details)
  - `blockstream.info/api` (For network block height tip and explorer links)
  - `api.coingecko.com` (For live BTC/Fiat exchange rates and market snapshot metrics)

---

## 🚀 Getting Started

Follow these steps to run the application on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/orange.git
cd orange
```

### 2. Install dependencies
Ensure you have Node.js installed, then run:
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open the application
Navigate to the URL provided in your terminal (usually `http://localhost:5173` or `http://localhost:5174`) in your web browser.

---

## 📂 Project Structure

- `src/api/` - API client configurations and endpoints (`blockcypher.ts`, `blockstream.ts`, `coingecko.ts`).
- `src/components/` - Reusable UI components (`BitcoinSnapshot.vue`, `CardHero.vue`, `ModalTransaction.vue`, `PaginationTx.vue`, `CurrencySelector.vue`, etc.).
- `src/utils/` - Helper functions (`currency.ts`, `labels.ts`).
- `src/App.vue` - Main application entry point, view routing (`home` snapshot vs `tracker`), and layout wrapper.

---

## 🔒 Privacy

Orange is a **view-only** tracker. It does not require any private keys, seed phrases, or login credentials. All your personalized data (Custom Labels, Notes, Watchlist) is securely stored in your browser's local storage and is never transmitted to any external server. 

---
*Built with ❤️ for the Bitcoin community.*
