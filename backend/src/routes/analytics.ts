import { Router, Request, Response } from "express";
import { storage } from "../services/storage";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const links = await storage.listPaymentLinks();
    const invoices = await storage.listInvoices();

    const totalVolume = links.reduce((sum: number, l: any) => sum + (l.paid_amount || 0), 0);
    const activeLinks = links.filter((l: any) => l.status === "active").length;
    const paidLinks = links.filter((l: any) => l.status === "paid").length;
    const paidInvoices = invoices.filter((i: any) => i.status === "paid").length;
    const pendingInvoices = invoices.filter((i: any) => i.status === "issued").length;

    res.json({
      overview: {
        total_payment_links: links.length,
        active_links: activeLinks,
        paid_links: paidLinks,
        total_invoices: invoices.length,
        paid_invoices: paidInvoices,
        pending_invoices: pendingInvoices,
        total_volume_usdc: totalVolume,
        protocol_fee_bps: 10,
      },
      top_merchants: [],
      recent_payments: links
        .filter((l: any) => l.status === "paid")
        .slice(0, 10),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
