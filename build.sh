
#!/bin/bash
# Build script to create a distributable XPI package

echo "Building Send and Archive extension..."

# Clean up old builds
rm -f send-and-archive.xpi

# Create the XPI package
zip -r send-and-archive.xpi \
  manifest.json \
  background.js \
  options.html \
  options.js \
  icons/ \
  README.md \
  -x "*.git*" "*.DS_Store" "build.sh"

if [ $? -eq 0 ]; then
  echo "✓ Build successful: send-and-archive.xpi"
  ls -lh send-and-archive.xpi
else
  echo "✗ Build failed"
  exit 1
fi
