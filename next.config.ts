import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'raw.githubusercontent.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'img.pokemondb.net',
				pathname: '/**',
			},
		],
	},
}

export default nextConfig
