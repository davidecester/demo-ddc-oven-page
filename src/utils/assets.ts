/** Resolves a file in `public/assets` against Vite's base path (needed on GitHub Pages). */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}assets/${path}`
}

export function iconUrl(name: string): string {
  return assetUrl(`icons/${name}.svg`)
}
