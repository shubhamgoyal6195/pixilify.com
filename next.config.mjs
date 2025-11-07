/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore 'canvas' in client builds to fix react-pdf issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
        child_process: false,
      };
    }

    // Prevent Webpack from trying to include optional native modules
    config.externals = [...(config.externals || []), { canvas: 'commonjs canvas' }];

    return config;
  },

  // Optional: silence workspace root warning
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
