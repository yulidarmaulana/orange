# 🟠 Orange | Professional Bitcoin Wallet Tracker

![Vue 3](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Orange** is a sleek, modern, and highly responsive Bitcoin wallet tracking application built with **Vue 3, TypeScript, and Vite**. It is designed for cryptocurrency enthusiasts who want to monitor their Bitcoin addresses, track transaction histories, and organize their portfolios without relying on bulky block explorers.

With a beautiful UI (featuring Dark Mode and glassmorphism elements), Orange proxies real-time blockchain data via robust APIs and provides powerful local-first metadata management.

---

## ✨ Key Features

- **🔍 Real-Time Blockchain Tracking:** Search for any Bitcoin address to instantly view its final balance, total received/sent, and total transaction count.
- **🏷️ Custom Labels & Notes:** Personalize your experience by assigning custom names and detailed notes to specific addresses. This data is safely stored locally (`localStorage`).
- **🔖 Watchlist Management:** Bookmark important wallets. The smart watchlist modal displays your custom labels alongside the addresses for quick recognition.
- **💱 Live Fiat Conversion:** Instantly convert Bitcoin balances and transaction values into multiple fiat currencies (USD, EUR, IDR, etc.) using real-time rates from CoinGecko.
- **📜 Deep Transaction History:** Browse up to 50 recent transactions with detailed inputs/outputs, confirmations, fees, block time, and network status.
- **🪙 UTXO Explorer:** View Unspent Transaction Outputs (UTXOs) in a dedicated tab to understand exactly how a wallet's funds are structured.
- **📤 Data Export:** Easily export your transaction history to **CSV** or **JSON** for tax reporting or external analysis.
- **🌓 Dark/Light Mode:** A beautifully crafted, fully reactive theme switcher that respects system preferences.

---

## 🛠️ Technology Stack

- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build Tool:** Vite (Ultra-fast HMR)
- **Language:** TypeScript
- **State & Data Fetching:** TanStack Vue Query (Optimized caching & network requests)
- **Styling:** Tailwind CSS + Vanilla CSS (Custom animations & Glassmorphism)
- **Icons:** Lucide-Vue-Next
- **APIs Used:**
  - `api.blockcypher.com` (For reliable Bitcoin blockchain data and UTXOs)
  - `api.coingecko.com` (For live BTC/Fiat exchange rates)

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

- `src/api/` - API client configurations and endpoints (`blockstream.ts`, `coingecko.ts`).
- `src/components/` - Reusable UI components (`CardHero.vue`, `PaginationTx.vue`, `CurrencySelector.vue`, etc.).
- `src/utils/` - Helper functions (`currency.ts`, `labels.ts`).
- `src/App.vue` - Main application entry point and layout wrapper.

---

## 🔒 Privacy

Orange is a **view-only** tracker. It does not require any private keys, seed phrases, or login credentials. All your personalized data (Custom Labels, Notes, Watchlist) is securely stored in your browser's local storage and is never transmitted to any external server. 

---
*Built with ❤️ for the Bitcoin community.*
