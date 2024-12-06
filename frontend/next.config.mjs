/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    // Only modify client-side Webpack configuration
    if (!isServer) {
      config.watchOptions = {
        poll: 1000,  // Poll every 1 second
      };
    }
    return config;
  },
};

export default nextConfig;
