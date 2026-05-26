import { Router, Request, Response } from "express";
import { storage } from "../services/storage";

const router = Router();

interface CreateSplitBody {
  recipients: { address: string; bps: number }[];
  immutable?: boolean;
  label?: string;
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateSplitBody;

    if (!body.recipients || body.recipients.length === 0) {
      return res.status(400).json({ error: "recipients are required" });
    }

    const totalBps = body.recipients.reduce((sum, r) => sum + r.bps, 0);
    if (totalBps !== 10000) {
      return res.status(400).json({ error: `bps must sum to 10000, got ${totalBps}` });
    }

    const splitId = `spl_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

    const split = {
      id: splitId,
      split_address: `0x${Date.now().toString(16).padStart(40, "0").slice(-40)}`,
      recipients: body.recipients,
      immutable: body.immutable || false,
      label: body.label || null,
      total_received: 0,
      contract_address: process.env.SPLIT_ROUTER_ADDRESS || "0x0",
      created_at: new Date().toISOString(),
    };

    await storage.saveSplit(splitId, split);

    res.status(201).json(split);
  } catch (error) {
    console.error("Error creating split:", error);
    res.status(500).json({ error: "Failed to create split" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const split = await storage.getSplit(req.params.id);
    if (!split) {
      return res.status(404).json({ error: "Split not found" });
    }
    res.json(split);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch split" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const splits = await storage.listSplits();
    res.json({ data: splits, count: splits.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to list splits" });
  }
});

export default router;
