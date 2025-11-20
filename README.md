# Offline ChatGPT

## Stack

- Node.js (16+ / 18+)
- npm, pnpm or yarn
- Vite
- React 18 + TypeScript
- ESLint
- Local inference runtime (one of: ggml-based binary, PyTorch/transformers server, ONNX/Triton)
- DeepSeek model files (DeepSeek-1B / DeepSeek-2B) — FP16/FP32 or quantized formats
- (Optional) CUDA drivers and GPU for faster FP16 inference

## Steps to run this project (development)

1. Install Node and package manager
   - Windows: install Node.js 18+ from nodejs.org

2. Install dependencies
```sh
npm install
# or
pnpm install
# or
yarn
```

3. Place model files
- Create model directories, e.g.:
  - models/deepseek-1b/
  - models/deepseek-2b/
- Put the required model files (weights + tokenizer/config) into the appropriate folder.

4. Start a local inference server
- Use your preferred runtime. Examples:
  - ggml-based binary: run the binary pointing to models/deepseek-1b
  - Python/transformers: launch a small FastAPI/Flask server that loads the model and exposes an /api/chat endpoint
- Recommended environment variables:
  - MODEL_PATH=./models/deepseek-1b
  - INFERENCE_PORT=7860

5. Run the frontend (development)
```sh
npm run dev
# or with pnpm/yarn
pnpm dev
yarn dev
```
- By default the frontend communicates with a local API; update the API host/port in src/config or environment variables if needed.

6. Build for production
```sh
npm run build
npm run preview
```

## Minimal API contract (example)

- POST /api/chat
  - Body: { "messages":[{"role":"user","content":"Hello"}], "model":"deepseek-1b" }
  - Response: { "id":"...", "choices":[{"message":{"role":"assistant","content":"..."}}] }

## Notes & troubleshooting

- OOM on CPU: use a quantized model or reduce context length.
- Slow responses: enable FP16 on GPU or use optimized runtime/batching.
- Secure local endpoints before exposing to networks.
