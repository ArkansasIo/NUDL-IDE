import express from "express";
import {
  analyzeRequest,
  generateRequest,
  lexRequest,
  parseRequestApi,
  runRequest,
  AndroidNudlRequest,
} from "./nudlApi";

const app = express();
const port = Number(process.env.NUDL_API_PORT ?? 8787);
const host = process.env.NUDL_API_HOST ?? "0.0.0.0";

app.disable("x-powered-by");
app.use(express.json({ limit: "2mb" }));

app.get("/api/v1/health", (_req, res) => {
  res.json({ ok: true, service: "nudl-api", version: "0.3.0" });
});

function body(req: express.Request): AndroidNudlRequest {
  return {
    source: typeof req.body?.source === "string" ? req.body.source : "",
    filename: typeof req.body?.filename === "string" ? req.body.filename : "main.nudl",
    target: req.body?.target,
  };
}

app.post("/api/v1/nudl/lex", (req, res) => res.json(lexRequest(body(req))));
app.post("/api/v1/nudl/parse", (req, res) => res.json(parseRequestApi(body(req))));
app.post("/api/v1/nudl/analyze", (req, res) => res.json(analyzeRequest(body(req))));
app.post("/api/v1/nudl/run", (req, res) => res.json(runRequest(body(req))));
app.post("/api/v1/nudl/generate", (req, res) => res.json(generateRequest(body(req))));

app.use((_req, res) => {
  res.status(404).json({ ok: false, diagnostics: [], error: "Endpoint not found" });
});

app.listen(port, host, () => {
  console.log(`NUDL Android API listening on http://${host}:${port}`);
});
