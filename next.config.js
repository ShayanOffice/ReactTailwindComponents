/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
module.exports = nextConfig;

module.exports = {
  env: {
    /* http://172.16.200.206:5000/api/ */
    SqlUrl: 'http://localhost:5000/',
    // SqlUrl: 'http://172.16.200.46:5000/',
  },
};
