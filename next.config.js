/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MIXPANEL_PROJECT_TOKEN: process.env.MIXPANEL_PROJECT_TOKEN,
    APP_ENV: process.env.APP_ENV,
    APP_NAME: process.env.APP_NAME,
    ONE_INCH_API_KEY: process.env.ONE_INCH_API_KEY,
    COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY,
  },

  experimental: {
    edge: true,
  },
};

module.exports = nextConfig;
