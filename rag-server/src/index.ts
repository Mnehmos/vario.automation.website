import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const PROJECT_DIR = join(__dirname, "..");

// Load data on startup
interface Source {
  source_id: string;
  type: string;
  uri: string;
  source_name: string;
  tags?: string[];
}

interface Chunk {
  chunk_id: string;
  source_id: string;
  text: string;
  metadata: Record<string, unknown>;
}

interface Vector {
  chunk_id: string;
  embedding: number[];
}

let chunks: Chunk[] = [];
let vectors: Vector[] = [];
let sources: Source[] = [];
const chunkMap = new Map<string, Chunk>();
const sourceMap = new Map<string, Source>();

function loadData() {
  const chunksPath = join(DATA_DIR, "chunks.jsonl");
  const vectorsPath = join(DATA_DIR, "vectors.jsonl");
  const sourcesPath = join(PROJECT_DIR, "sources.jsonl");
  
  // Load sources from sources.jsonl
  if (existsSync(sourcesPath)) {
    sources = readFileSync(sourcesPath, "utf-8")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map(line => JSON.parse(line));
    sources.forEach(s => sourceMap.set(s.source_id, s));
    console.error(`Loaded ${sources.length} sources`);
  }
  
  if (existsSync(chunksPath)) {
    chunks = readFileSync(chunksPath, "utf-8")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map(line => JSON.parse(line));
    chunks.forEach(c => chunkMap.set(c.chunk_id, c));
  }
  
  if (existsSync(vectorsPath)) {
    vectors = readFileSync(vectorsPath, "utf-8")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map(line => JSON.parse(line));
  }
  
  console.error(`Loaded ${chunks.length} chunks, ${vectors.length} vectors`);
}

// Helper to enrich a chunk with source info
function enrichWithSource(chunk: Chunk, score: number) {
  const source = sourceMap.get(chunk.source_id);
  return {
    chunk_id: chunk.chunk_id,
    text: chunk.text,
    score,
    source_id: chunk.source_id,
    source_url: source?.uri || null,
    source_name: source?.source_name || null,
    source_type: source?.type || null,
    metadata: chunk.metadata
  };
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function searchKeyword(query: string, topK: number) {
  const terms = query.toLowerCase().split(/\s+/);
  
  const scored = chunks.map(chunk => {
    const text = chunk.text.toLowerCase();
    let matches = 0;
    for (const term of terms) {
      if (text.includes(term)) matches++;
    }
    return { chunk, score: matches / terms.length };
  });
  
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).filter(r => r.score > 0);
}

function searchSemantic(queryVector: number[], topK: number) {
  const scored = vectors.map(v => ({
    chunk_id: v.chunk_id,
    score: cosineSimilarity(queryVector, v.embedding),
  }));
  
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

// MCP Server
const server = new Server(
  { name: "msha-rag-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "search",
      description: "RAG search API for MSHA mine safety regulations and compliance guidance",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
          query_vector: { 
            type: "array", 
            items: { type: "number" },
            description: "Pre-computed embedding vector (for semantic search)"
          },
          mode: { 
            type: "string", 
            enum: ["semantic", "keyword", "hybrid"],
            default: "keyword"
          },
          top_k: { type: "number", default: 10 }
        },
        required: ["query"]
      }
    },
    {
      name: "get_chunk",
      description: "Get a specific chunk by ID",
      inputSchema: {
        type: "object",
        properties: {
          chunk_id: { type: "string" }
        },
        required: ["chunk_id"]
      }
    },
    {
      name: "stats",
      description: "Get index statistics",
      inputSchema: { type: "object", properties: {} }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "search": {
      const { query, query_vector, mode = "keyword", top_k = 10 } = args as {
        query: string;
        query_vector?: number[];
        mode?: string;
        top_k?: number;
      };
      
      let results: Array<{ chunk: Chunk; score: number }> = [];
      
      if (mode === "keyword") {
        results = searchKeyword(query, top_k);
      } else if (mode === "semantic" && query_vector) {
        const semantic = searchSemantic(query_vector, top_k);
        results = semantic.map(s => ({
          chunk: chunkMap.get(s.chunk_id)!,
          score: s.score
        })).filter(r => r.chunk);
      } else if (mode === "hybrid" && query_vector) {
        const keyword = searchKeyword(query, top_k * 2);
        const semantic = searchSemantic(query_vector, top_k * 2);
        
        const scoreMap = new Map<string, number>();
        keyword.forEach((r, i) => {
          scoreMap.set(r.chunk.chunk_id, (scoreMap.get(r.chunk.chunk_id) || 0) + 1 / (i + 1));
        });
        semantic.forEach((r, i) => {
          scoreMap.set(r.chunk_id, (scoreMap.get(r.chunk_id) || 0) + 1 / (i + 1));
        });
        
        results = Array.from(scoreMap.entries())
          .map(([id, score]) => ({ chunk: chunkMap.get(id)!, score }))
          .filter(r => r.chunk)
          .sort((a, b) => b.score - a.score)
          .slice(0, top_k);
      }
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            results: results.map(r => enrichWithSource(r.chunk, r.score)),
            total: results.length,
            mode
          }, null, 2)
        }]
      };
    }
    
    case "get_chunk": {
      const { chunk_id } = args as { chunk_id: string };
      const chunk = chunkMap.get(chunk_id);
      
      return {
        content: [{
          type: "text",
          text: chunk ? JSON.stringify(chunk, null, 2) : "Chunk not found"
        }]
      };
    }
    
    case "stats": {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            chunks: chunks.length,
            vectors: vectors.length,
          }, null, 2)
        }]
      };
    }
    
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});


// HTTP Server
const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get("/health", (_, res) => res.json({ status: "ok", chunks: chunks.length }));

app.post("/search", async (req, res) => {
  const { query, query_vector, mode = "keyword", top_k = 10 } = req.body;
  
  let results: Array<{ chunk: Chunk; score: number }> = [];
  
  if (mode === "keyword") {
    results = searchKeyword(query, top_k);
  } else if (mode === "semantic" && query_vector) {
    const semantic = searchSemantic(query_vector, top_k);
    results = semantic.map(s => ({
      chunk: chunkMap.get(s.chunk_id)!,
      score: s.score
    })).filter(r => r.chunk);
  } else if (mode === "hybrid" && query_vector) {
    const keyword = searchKeyword(query, top_k * 2);
    const semantic = searchSemantic(query_vector, top_k * 2);
    
    const scoreMap = new Map<string, number>();
    keyword.forEach((r, i) => {
      scoreMap.set(r.chunk.chunk_id, (scoreMap.get(r.chunk.chunk_id) || 0) + 1 / (i + 1));
    });
    semantic.forEach((r, i) => {
      scoreMap.set(r.chunk_id, (scoreMap.get(r.chunk_id) || 0) + 1 / (i + 1));
    });
    
    results = Array.from(scoreMap.entries())
      .map(([id, score]) => ({ chunk: chunkMap.get(id)!, score }))
      .filter(r => r.chunk)
      .sort((a, b) => b.score - a.score)
      .slice(0, top_k);
  }
  
  res.json({
    results: results.map(r => enrichWithSource(r.chunk, r.score)),
    total: results.length,
    mode
  });
});

// Chat endpoint - proxies to OpenAI with RAG context
app.post("/chat", async (req, res) => {
  const { question, top_k = 5 } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API key not configured" });
  }
  
  // Search for relevant context
  const searchResults = searchKeyword(question, top_k);
  const context = searchResults.map((r, i) => 
    `[Source ${i + 1}]: ${r.chunk.text}`
  ).join("\n\n");
  
  const systemPrompt = `You are an MSHA (Mine Safety and Health Administration) compliance expert assistant. 
Answer questions about mine safety regulations, training requirements, and compliance procedures.

Use the following retrieved document excerpts to inform your answer. Cite sources using [Source N] notation.
If the documents don't contain relevant information, say so and provide general guidance.

Keep responses clear, practical, and actionable for mine operators.

RETRIEVED DOCUMENTS:
${context || "No specific documents found. Please answer based on general MSHA knowledge."}`;

  const input = `${systemPrompt}\n\nUser Question: ${question}`;
  
  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send sources first so client can use them for citations
  res.write(`data: ${JSON.stringify({ 
    type: "sources", 
    sources: searchResults.map(r => enrichWithSource(r.chunk, r.score))
  })}\n\n`);
  
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input,
        stream: true
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      res.write(`data: ${JSON.stringify({ type: "error", error: error.error?.message || "API request failed" })}\n\n`);
      res.end();
      return;
    }
    
    // Stream the response
    const reader = response.body?.getReader();
    if (!reader) {
      res.write(`data: ${JSON.stringify({ type: "error", error: "No response body" })}\n\n`);
      res.end();
      return;
    }
    
    const decoder = new TextDecoder();
    let buffer = "";
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      
      for (const line of lines) {
        if (line.startsWith("data: ") && line !== "data: [DONE]") {
          try {
            const data = JSON.parse(line.slice(6));
            // Forward relevant events
            if (data.type === "response.output_text.delta" || 
                data.type === "response.content_part.delta") {
              const text = data.delta?.text || data.delta || "";
              if (text) {
                res.write(`data: ${JSON.stringify({ type: "delta", text })}\n\n`);
              }
            }
          } catch (e) {
            // Skip unparseable lines
          }
        }
      }
    }
    
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
    
  } catch (error) {
    console.error("Chat error:", error);
    res.write(`data: ${JSON.stringify({ type: "error", error: "Failed to generate response" })}\n\n`);
    res.end();
  }
});

const PORT = parseInt(process.env.PORT || "8090");
app.listen(PORT, () => console.error(`HTTP server on port ${PORT}`));


// Start
loadData();

const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
console.error("msha-rag-server MCP server running");
