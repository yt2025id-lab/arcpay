import { Router, Request, Response } from "express";
import QRCode from "qrcode";
import { storage } from "../services/storage";

const router = Router();

interface CreateLinkBody {
  amount: string | null;
  description: string;
  recipient: string;
  expires_at?: string;
  privacy_mode?: boolean;
  split?: { address: string; bps: number }[];
  webhook_url?: string;
  metadata?: Record<string, string>;
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateLinkBody;

    if (!body.recipient) {
      return res.status(400).json({ error: "recipient is required" });
    }

    const linkId = `lnk_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const baseUrl = process.env.FRONTEND_URL || "https://pay.arcpay.io";
    const url = `${baseUrl}/${linkId}`;

    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });

    const link = {
      id: linkId,
      url,
      qr_code: qrCodeDataUrl,
      contract_address: process.env.PAYMENT_LINK_ADDRESS || "0x0",
      amount: body.amount,
      description: body.description,
      recipient: body.recipient,
      status: "active",
      privacy_mode: body.privacy_mode || false,
      split: body.split || [],
      webhook_url: body.webhook_url,
      metadata: body.metadata,
      created_at: new Date().toISOString(),
      expires_at: body.expires_at || null,
    };

    await storage.savePaymentLink(linkId, link);

    res.status(201).json(link);
  } catch (error) {
    console.error("Error creating payment link:", error);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const link = await storage.getPaymentLink(req.params.id);
    if (!link) {
      return res.status(404).json({ error: "Payment link not found" });
    }
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payment link" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const links = await storage.listPaymentLinks();
    res.json({ data: links, count: links.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to list payment links" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const link = await storage.getPaymentLink(req.params.id);
    if (!link) {
      return res.status(404).json({ error: "Payment link not found" });
    }
    await storage.updatePaymentLink(req.params.id, { status: "cancelled" });
    res.json({ id: req.params.id, status: "cancelled" });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel payment link" });
  }
});

export default router;
