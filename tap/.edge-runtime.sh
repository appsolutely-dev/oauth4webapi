./node_modules/.bin/esbuild --format=esm --bundle --target=esnext tap/run-node.ts > tap/run-edge-runtime.js
./node_modules/.bin/edge-runtime tap/run-edge-runtime.js
