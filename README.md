# ⬡ APEX Trading Analytics Platform

A real-time stock trading analytics platform with AI-scored market picks, candlestick charts, technical indicators, and trade setup recommendations.

**Live site:** [apex-trading-analytics.vercel.app](https://apex-trading-analytics.vercel.app)

---

## Features

### Market Picks (default landing page)
- **Market Pulse bar** — live SPY, QQQ, DIA, IWM, VIX prices and % change
- **AI Top Picks** — 12 large/mid cap stocks scored and ranked in real time
- **Early Entry Radar** — small/mid cap momentum plays under $50 (PLTR, SOFI, IONQ, RKLB, etc.)
- **Sector Trends** — ETF rotation signals across XLK, XLF, XLE, XLV, GLD, TLT and more
- **Score tooltips** — hover any score circle to see exactly *why* a stock scored that way

### Score Breakdown (hover any score circle)
Each stock is scored 0–100 using three factors pulled from Yahoo Finance:

| Factor | What it measures | Max impact |
|---|---|---|
| 📈 Daily Momentum | Today's % price change | ±18 pts |
| 📍 52-Week Position | Where price sits in its annual range | +14 pts |
| 🔥 Volume Activity | Today's volume vs 90-day average | +16 pts |

- **65–100 = BUY** — strong momentum + volume confirmation
- **45–64 = HOLD** — mixed signals, monitor closely
- **0–44 = SELL** — weak momentum or bearish signals

### Chart View
- **Candlestick chart** with zoom/pan (scroll to zoom, drag to pan)
- **Technical indicators**: MA20, MA50, MA200, EMA9, Bollinger Bands, VWAP
- **Oscillators**: RSI(14), MACD — toggleable panels below the main chart
- **Volume bars** with color-coded buying/selling pressure
- **Forecast zone** — 3 projected candles based on ATR + RSI + MACD
- **Trade Setup panel** — auto-calculated Entry, Stop Loss, TP1/TP2/TP3, Risk/Reward ratio
- **Key Levels** — support and resistance zones from local high/low clustering
- **Signal card** — BUY/HOLD/SELL score with factor breakdown
- **Auto-refresh** every 30 seconds when market is open

### Search
- Type any ticker (AAPL) or company name (Apple) — powered by Yahoo Finance search
- No API key required for search or chart data

---

## Data Sources

| Source | Used for | Notes |
|---|---|---|
| Yahoo Finance | All chart data, market picks, search | Free, no key required — accessed via server proxy |
| Finnhub.io | Live price refresh, company profiles | Free tier, key stored as `FINNHUB_KEY` env var on Vercel |

All external API calls are routed through a Vercel serverless proxy (`/api/proxy.js`) to avoid CORS issues and keep API keys off the client.

---

## Tech Stack

- **Frontend**: Single-file HTML/CSS/JS — no frameworks, no build step
- **Charts**: Pure canvas rendering (no Chart.js)
- **Backend**: Vercel serverless function (`api/proxy.js`) — Node.js
- **Hosting**: Vercel (auto-deploys on every push to `master`)

---

## Setup & Deployment

### Prerequisites
- [Vercel account](https://vercel.com) linked to this GitHub repo
- [Finnhub API key](https://finnhub.io/register) (free)

### Deploy
1. Push to `master` — Vercel auto-deploys
2. In Vercel dashboard → **Settings → Environment Variables**, add:
   - `FINNHUB_KEY` = your Finnhub API key

### Local development
```bash
npm i -g vercel
vercel dev
```
This runs the serverless proxy locally so all data fetches work.

---

## Disclaimer

APEX is a technical analysis tool. All scores and signals are based on price momentum, 52-week position, and volume data. **This is not financial advice.** Always do your own research before making any investment decisions.
