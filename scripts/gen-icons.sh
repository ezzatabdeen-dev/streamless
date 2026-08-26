#!/usr/bin/env bash
# Optional: run this later on a machine with a terminal to generate real
# PNG icons from the SVG sources. Requires: npm install -D sharp-cli
set -e
mkdir -p public/icons

npx sharp -i public/icon-source.svg -o public/icons/icon-192.png resize 192 192
npx sharp -i public/icon-source.svg -o public/icons/icon-512.png resize 512 512
npx sharp -i public/icon-source.svg -o public/icons/icon-384.png resize 384 384
npx sharp -i public/icon-source.svg -o public/icons/icon-152.png resize 152 152
npx sharp -i public/icon-source.svg -o public/icons/icon-96.png resize 96 96

npx sharp -i public/icon-source.svg -o public/icons/apple-touch-icon.png resize 180 180 flatten '{"background":"#0F0F0F"}'
npx sharp -i public/icon-source.svg -o public/icons/favicon-32.png resize 32 32

npx sharp -i public/icon-source-maskable.svg -o public/icons/icon-192-maskable.png resize 192 192
npx sharp -i public/icon-source-maskable.svg -o public/icons/icon-512-maskable.png resize 512 512

echo "Icons generated in public/icons/"
