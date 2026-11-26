// ./styles_url
// useful for toggling on/off
// and be cross-bundlers (parcel has url:, vite has ?url)
export const styles‿urlstr = new URL("./index.css", import.meta.url).href
