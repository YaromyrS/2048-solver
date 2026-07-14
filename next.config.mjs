/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Let the dev server serve its /_next/* client chunks and the HMR websocket to
  // browsers loading the app through an ngrok tunnel (a different origin than
  // localhost). Without this, cross-origin access is blocked, React never
  // hydrates, and nothing interactive works via the public URL. Wildcards keep
  // this valid across ngrok's per-restart random subdomains.
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok.app', '0528-176-111-43-80.ngrok-free.app'],
};

export default nextConfig;
