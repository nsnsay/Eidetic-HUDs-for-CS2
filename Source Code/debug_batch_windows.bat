npx esbuild src/server/index.js --bundle --platform=node --outfile=cs-hud.js
npx pkg --compress Brotli --config build/pkg.json --public --public-packages '*' cs-hud.js

$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"