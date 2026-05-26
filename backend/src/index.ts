import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentLinksRouter from "./routes/payment-links";
import invoicesRouter from "./routes/invoices";
import splitsRouter from "./routes/splits";
import webhooksRouter from "./routes/webhooks";
import analyticsRouter from "./routes/analytics";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

app.use("/v1/payment-links", paymentLinksRouter);
app.use("/v1/invoices", invoicesRouter);
app.use("/v1/splits", splitsRouter);
app.use("/v1/webhooks", webhooksRouter);
app.use("/v1/analytics", analyticsRouter);

app.get("/v1/health", (_req, res) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    chain: "arc",
    contracts: {
      factory: process.env.ARCPAY_FACTORY_ADDRESS,
      paymentLink: process.env.PAYMENT_LINK_ADDRESS,
      invoice: process.env.INVOICE_ADDRESS,
      splitRouter: process.env.SPLIT_ROUTER_ADDRESS,
      escrowVault: process.env.ESCROW_VAULT_ADDRESS,
      feeManager: process.env.FEE_MANAGER_ADDRESS,
    },
  });
});

app.listen(PORT, () => {
  console.log(`ArcPay API running on http://localhost:${PORT}`);
});

export default app;
