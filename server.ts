import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // WooCommerce proxy endpoint for fetching orders
  app.post("/api/woocommerce/orders", async (req, res) => {
    try {
      const { url, consumerKey, consumerSecret, status, page = 1, perPage = 50 } = req.body;
      if (!url || !consumerKey || !consumerSecret) {
        return res.status(400).json({ error: "Missing WooCommerce credentials" });
      }

      // Clean the URL (remove trailing slash)
      const cleanUrl = url.replace(/\/$/, "");
      const wcUrl = `${cleanUrl}/wp-json/wc/v3/orders?page=${page}&per_page=${perPage}${status && status !== 'all' ? `&status=${status}` : ''}`;
      
      const authHeader = "Basic " + Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

      const response = await fetch(wcUrl, {
        method: "GET",
        headers: {
          "Authorization": authHeader,
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: `WooCommerce API error: ${errText}` });
      }

      const orders = await response.json();
      res.json(orders);
    } catch (error: any) {
      console.error("WooCommerce proxy fetch error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // WooCommerce proxy endpoint for updating an order status
  app.put("/api/woocommerce/orders/update", async (req, res) => {
    try {
      const { url, consumerKey, consumerSecret, orderId, status } = req.body;
      if (!url || !consumerKey || !consumerSecret || !orderId || !status) {
        return res.status(400).json({ error: "Missing required update fields" });
      }

      const cleanUrl = url.replace(/\/$/, "");
      const wcUrl = `${cleanUrl}/wp-json/wc/v3/orders/${orderId}`;
      const authHeader = "Basic " + Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

      const response = await fetch(wcUrl, {
        method: "PUT",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: `WooCommerce update error: ${errText}` });
      }

      const updatedOrder = await response.json();
      res.json(updatedOrder);
    } catch (error: any) {
      console.error("WooCommerce proxy update error:", error);
      res.status(500).json({ error: error.message });
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
