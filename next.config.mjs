/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'i.imgur.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'cdn.discordapp.com',
            port: '',
          },
        ],

      },
};

export default nextConfig;
