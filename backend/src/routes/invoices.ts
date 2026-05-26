import { Router, Request, Response } from "express";
import { storage } from "../services/storage";

const router = Router();

interface InvoiceItem {
  description: string;
  unit_price: number;
  quantity: number;
  tax_bps?: number;
}

interface CreateInvoiceBody {
  recipient: string;
  items: InvoiceItem[];
  due_date?: string;
  late_penalty_bps?: number;
  privacy_mode?: boolean;
  metadata?: Record<string, string>;
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateInvoiceBody;

    if (!body.recipient) {
      return res.status(400).json({ error: "recipient is required" });
    }
    if (!body.items || body.items.length === 0) {
      return res.status(400).json({ error: "items are required" });
    }

    let totalAmount = 0;
    const processedItems = body.items.map((item) => {
      const itemTotal = item.unit_price * item.quantity;
      const tax = (itemTotal * (item.tax_bps || 0)) / 10000;
      totalAmount += itemTotal + tax;
      return { ...item, total: itemTotal + tax };
    });

    const invoiceId = `inv_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

    const invoice = {
      id: invoiceId,
      issuer: req.headers["x-merchant-address"] as string || "0x0000000000000000000000000000000000000000",
      recipient: body.recipient,
      items: processedItems,
      total_amount: totalAmount,
      paid_amount: 0,
      currency: "USDC",
      status: "issued",
      due_date: body.due_date || null,
      late_penalty_bps: body.late_penalty_bps || 0,
      privacy_mode: body.privacy_mode || false,
      contract_address: process.env.INVOICE_ADDRESS || "0x0",
      metadata: body.metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await storage.saveInvoice(invoiceId, invoice);

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: "Failed to create invoice" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const invoice = await storage.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const invoices = await storage.listInvoices();
    res.json({ data: invoices, count: invoices.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to list invoices" });
  }
});

router.post("/:id/cancel", async (req: Request, res: Response) => {
  try {
    const invoice = await storage.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    if (invoice.status !== "issued") {
      return res.status(400).json({ error: "Invoice cannot be cancelled" });
    }
    await storage.updateInvoice(req.params.id, { status: "cancelled", updated_at: new Date().toISOString() });
    res.json({ id: req.params.id, status: "cancelled" });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel invoice" });
  }
});

router.post("/:id/dispute", async (req: Request, res: Response) => {
  try {
    const invoice = await storage.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    await storage.updateInvoice(req.params.id, { status: "disputed", updated_at: new Date().toISOString() });
    res.json({ id: req.params.id, status: "disputed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to dispute invoice" });
  }
});

export default router;
