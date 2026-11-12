export const programmes = [
  {
    id: "foundation",
    slug: "beginner-to-advanced",
    number: "01",
    category: "Build your foundation",
    title: "Forex Beginner to Advanced",
    price: 300,
    for: "Your first step into forex.",
    description:
      "From your first currency pair to practical chart analysis. Connect the fundamentals before adding complexity.",
    topics: [
      "Currency pairs, pips, lots & leverage",
      "Price action & candlestick patterns",
      "Market structure, support & resistance",
      "ICT concepts, liquidity & fair value gaps",
      "Risk management & trading psychology",
    ],
    interest: "Forex Beginner to Advanced",
    url: "https://www.zakifx.com/shop/p/product-2-5c6mb-j8mng-zsl73-srtpj-xj79n",
  },
  {
    id: "advanced",
    slug: "advanced-strategies",
    number: "02",
    category: "Deepen your understanding",
    title: "Advanced Trading Strategies",
    price: 499,
    for: "For a deeper understanding.",
    description:
      "Explore the detail behind Gold (XAUUSD), liquidity and market structure. Study the context around a potential entry.",
    topics: [
      "Gold (XAUUSD) analysis",
      "Liquidity & market structure shifts",
      "Break of structure (BOS)",
      "Fair value gaps & entry confirmations",
      "Advanced analysis & risk management",
    ],
    interest: "Advanced Trading Strategies",
    url: "https://www.zakifx.com/shop/p/product-3-szb2y-gzh2r-tzhkx-b6hhj-pbs8j",
  },
  {
    id: "mentorship",
    slug: "vip-mentorship",
    number: "03",
    category: "Learn directly with Zaki",
    title: "VIP 1-to-1 Mentorship",
    price: 599,
    for: "Your learning. Personal guidance.",
    description:
      "Private Zoom sessions, practical chart analysis and direct guidance around your individual learning needs.",
    topics: [
      "Private 1-to-1 Zoom sessions",
      "Gold, price action & market structure",
      "Liquidity, order blocks & fair value gaps",
      "Risk management & trading psychology",
      "Live chart examples & student support",
    ],
    interest: "VIP 1-to-1 Mentorship",
    url: "https://www.zakifx.com/shop/p/product-4-9e76d-pr6ls-ddx8r-2y3l7-jh37s",
  },
];
export type Programme = (typeof programmes)[number];
