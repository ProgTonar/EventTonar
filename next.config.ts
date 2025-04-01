import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  

  webpack: (config) => {

    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name][ext]',
      },
    });

    return config;
  },


  images: {
    domains: [], 
  },


};

export default nextConfig;