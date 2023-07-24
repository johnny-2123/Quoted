/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "res.cloudinary.com",
      "tiny.cloud.com",
      "cdn.jsdelivr.net",
    ],
  },
};

module.exports = nextConfig;
