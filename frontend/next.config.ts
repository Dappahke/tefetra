import type { NextConfig } from "next"
import type { RemotePattern } from "next/dist/shared/lib/image-config"

const defaultApiUrl = "http://127.0.0.1:8000"

function getImageRemotePattern(): RemotePattern {
  try {
    const apiUrl = new URL(
      process.env.NEXT_PUBLIC_API_BASE_URL ?? defaultApiUrl
    )

    return {
      protocol: apiUrl.protocol.replace(":", "") as RemotePattern["protocol"],
      hostname: apiUrl.hostname,
      port: apiUrl.port,
      pathname: "/storage/**",
    }
  } catch {
    return {
      protocol: "http",
      hostname: "127.0.0.1",
      port: "8000",
      pathname: "/storage/**",
    }
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [getImageRemotePattern()],
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
}

export default nextConfig
