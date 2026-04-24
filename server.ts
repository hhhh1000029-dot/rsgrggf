import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Readable } from 'stream';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes go here
  app.use(express.json({ limit: '50mb' }));

  app.post("/api/ai/generate", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "No API key configured." });
      }
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      
      const { operation, model, contents, config, prompt } = req.body;
      
      if (operation === 'generateImages') {
        const response = await ai.models.generateImages({ model, prompt, config });
        return res.json({ generatedImages: response.generatedImages });
      } else {
        const response = await ai.models.generateContent({ model, contents, config });
        return res.json({ text: response.text, candidates: response.candidates, params: req.body });
      }
    } catch (error: any) {
      console.error("[AI Generate Error]", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // Generic URL Proxy (Useful for Dropbox, GitHub, etc.)
  app.get("/api/proxy-url", async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) return res.status(400).json({ error: "Missing url" });

    console.log(`[ProxyURL] Fetching: ${targetUrl.substring(0, 80)}...`);

    try {
      // Use standard fetch with default redirect (follow)
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Connection': 'keep-alive'
        }
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "No error details available");
        console.error(`[ProxyURL] Target returned ${response.status}: ${errorText.substring(0, 100)}`);
        return res.status(response.status).json({ 
          error: `External source returned error ${response.status}`,
          details: errorText.substring(0, 200)
        });
      }

      // Copy key headers for progress tracking
      const contentLength = response.headers.get("content-length");
      const contentType = response.headers.get("content-type");
      
      if (contentLength) res.setHeader("Content-Length", contentLength);
      if (contentType) res.setHeader("Content-Type", contentType);
      
      // Prevent aggressive caching of partial large downloads
      res.setHeader("Cache-Control", "no-cache");

      // Stream the body efficiently
      if (response.body) {
        const reader = response.body.getReader();
        
        // Handle client disconnect
        req.on('close', () => {
          console.log(`[ProxyURL] Client closed connection for ${targetUrl.substring(0, 50)}`);
          reader.cancel().catch(() => {});
        });

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            break;
          }
          
          // Write chunk and handle backpressure
          if (!res.write(value)) {
            await new Promise<void>((resolve) => {
              res.once('drain', resolve);
            });
          }
        }
      } else {
        // Fallback for bodies that aren't streamable
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
      }
    } catch (error: any) {
      console.error("[ProxyURL] Fatal error during proxy fetch:", error.message);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: "Internal Proxy Error", 
          message: error.message 
        });
      }
    }
  });

  // API Route to proxy Google Drive downloads to bypass CORS
  app.get("/api/proxy-drive", async (req, res) => {
    console.log(`[Proxy] Request for Drive ID: ${req.query.id}`);
    try {
      const driveId = req.query.id as string;
      if (!driveId) return res.status(400).json({ error: "Missing drive id" });

      const initialUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
      const response = await fetch(initialUrl);
      
      // Get all cookies
      const setCookie = response.headers.get("set-cookie");
      const cookies = setCookie || "";
      
      let text = await response.text();
      let finalUrl = initialUrl;

      // Handle the virus scan confirmation page
      if (text.includes('confirm=') || text.includes('download-form') || text.includes('uc-download-link')) {
        console.log(`[Proxy] Detected Google Drive confirmation page for ${driveId}`);
        
        // Try to find action first
        const actionMatch = text.match(/action="([^"]+)"/i);
        const paramsMatch = [...text.matchAll(/name="([^"]+)"\s+value="([^"]*)"/gi)];
        
        if (actionMatch && paramsMatch.length > 0) {
          let rootUrl = actionMatch[1].replace(/&amp;/g, '&');
          if (rootUrl.startsWith('/')) {
             rootUrl = 'https://drive.google.com' + rootUrl;
          }
          const params = paramsMatch.map(p => `${p[1]}=${p[2]}`).join("&");
          finalUrl = rootUrl + (rootUrl.includes('?') ? '&' : '?') + params;
        } else {
          // Alternative: look for confirmation code in the page
          const confirmMatch = text.match(/confirm=([a-zA-Z0-9_]+)/i);
          if (confirmMatch) {
            const confirmCode = confirmMatch[1];
            finalUrl = `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=${confirmCode}`;
          } else if (text.includes('id="uc-download-link"')) {
            // Look for href in the download link
            const hrefMatch = text.match(/id="uc-download-link"[^>]+href="([^"]+)"/i) || text.match(/href="([^"]+)"[^>]+id="uc-download-link"/i);
            if (hrefMatch) {
              finalUrl = hrefMatch[1].replace(/&amp;/g, '&');
              if (finalUrl.startsWith('/')) {
                finalUrl = 'https://drive.google.com' + finalUrl;
              }
            }
          }
        }
      }

      console.log(`[Proxy] Fetching final URL: ${finalUrl.substring(0, 100)}...`);

      const headers: any = {
         ...(cookies ? { 'Cookie': cookies } : {}),
         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      };
      
      // Fetch the actual file
      const fileResponse = await fetch(finalUrl, { headers });
      
      if (!fileResponse.ok) {
         const errorText = await fileResponse.text();
         console.error(`[Proxy] Failed to fetch from Google Drive. Status: ${fileResponse.status}`);
         return res.status(fileResponse.status).json({ 
           error: "Failed to fetch from Google Drive", 
           status: fileResponse.status,
           details: errorText.substring(0, 200)
         });
      }

      // Copy headers
      const contentLength = fileResponse.headers.get("content-length");
      if (contentLength) res.setHeader("Content-Length", contentLength);
      
      const contentType = fileResponse.headers.get("content-type");
      if (contentType) res.setHeader("Content-Type", contentType);

      // Stream the body
      if (fileResponse.body) {
        const reader = fileResponse.body.getReader();
        req.on('close', () => { reader.cancel().catch(() => {}); });

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            break;
          }
          if (!res.write(value)) {
            await new Promise<void>((resolve) => {
              res.once('drain', resolve);
            });
          }
        }
      } else {
        res.send(await fileResponse.text());
      }
    } catch (error: any) {
      console.error("[Proxy] Error:", error);
      if (!res.headersSent) res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
