import { Router, Request, Response } from "express";
import { storage } from "../services/storage";

const router = Router();

interface RegisterWebhookBody {
  url: string;
  events: string[];
  secret?: string;
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body as RegisterWebhookBody;

    if (!body.url) {
      return res.status(400).json({ error: "url is required" });
    }

    const webhookId = `wh_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

    const webhook = {
      id: webhookId,
      url: body.url,
      events: body.events || ["payment.received", "invoice.paid"],
      secret: body.secret || null,
      status: "active",
      created_at: new Date().toISOString(),
    };

    await storage.saveWebhook(webhookId, webhook);

    res.status(201).json(webhook);
  } catch (error) {
    console.error("Error registering webhook:", error);
    res.status(500).json({ error: "Failed to register webhook" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const webhooks = await storage.listWebhooks();
    res.json({ data: webhooks });
  } catch (error) {
    res.status(500).json({ error: "Failed to list webhooks" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await storage.deleteWebhook(req.params.id);
    res.json({ id: req.params.id, status: "deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete webhook" });
  }
});

router.post("/:id/test", async (req: Request, res: Response) => {
  try {
    const webhook = await storage.getWebhook(req.params.id);
    if (!webhook) {
      return res.status(404).json({ error: "Webhook not found" });
    }

    const testPayload = {
      event: "payment.received",
      data: {
        link_id: "lnk_test123",
        amount: "100.00",
        currency: "USDC",
        payer: "0xTestPayer",
        tx_hash: "0xTestTxHash",
        timestamp: new Date().toISOString(),
      },
    };

    console.log(`[Webhook Test] Sending to ${webhook.url}:`, JSON.stringify(testPayload, null, 2));

    res.json({
      webhook_id: req.params.id,
      status: "test_sent",
      payload: testPayload,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to test webhook" });
  }
});

export async function dispatchWebhook(event: string, data: Record<string, unknown>) {
  const webhooks = await storage.listWebhooks();
  for (const wh of webhooks) {
    if (wh.events.includes(event) && wh.status === "active") {
      try {
        const response = await fetch(wh.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-ArcPay-Signature": `sha256=${Buffer.from(JSON.stringify(data)).toString("base64")}`,
            "X-ArcPay-Event": event,
          },
          body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
        });
        console.log(`[Webhook] ${wh.url} → ${response.status}`);
      } catch (err) {
        console.error(`[Webhook] Failed to dispatch to ${wh.url}:`, err);
      }
    }
  }
}

export default router;
