/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Enable API routes for LLM processing and file upload
  // Note: For static export, use `output: 'export'` but API routes won't work
  // For production with API routes, use Vercel or remove output: 'export'
};

export default nextConfig;
