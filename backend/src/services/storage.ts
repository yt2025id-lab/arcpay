import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DB_PATH = join(__dirname, "../../data");

function ensureDir() {
  const dataDir = DB_PATH;
  if (!existsSync(dataDir)) {
    const { mkdirSync } = require("fs");
    mkdirSync(dataDir, { recursive: true });
  }
}

function getStore(name: string): Record<string, any> {
  ensureDir();
  const filePath = join(DB_PATH, `${name}.json`);
  if (!existsSync(filePath)) return {};
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function saveStore(name: string, data: Record<string, any>) {
  ensureDir();
  const filePath = join(DB_PATH, `${name}.json`);
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export const storage = {
  savePaymentLink(id: string, data: any) {
    const store = getStore("payment-links");
    store[id] = data;
    saveStore("payment-links", store);
  },
  getPaymentLink(id: string) {
    return getStore("payment-links")[id] || null;
  },
  listPaymentLinks() {
    return Object.values(getStore("payment-links"));
  },
  updatePaymentLink(id: string, updates: any) {
    const store = getStore("payment-links");
    if (store[id]) {
      store[id] = { ...store[id], ...updates };
      saveStore("payment-links", store);
    }
  },

  saveInvoice(id: string, data: any) {
    const store = getStore("invoices");
    store[id] = data;
    saveStore("invoices", store);
  },
  getInvoice(id: string) {
    return getStore("invoices")[id] || null;
  },
  listInvoices() {
    return Object.values(getStore("invoices"));
  },
  updateInvoice(id: string, updates: any) {
    const store = getStore("invoices");
    if (store[id]) {
      store[id] = { ...store[id], ...updates };
      saveStore("invoices", store);
    }
  },

  saveSplit(id: string, data: any) {
    const store = getStore("splits");
    store[id] = data;
    saveStore("splits", store);
  },
  getSplit(id: string) {
    return getStore("splits")[id] || null;
  },
  listSplits() {
    return Object.values(getStore("splits"));
  },

  saveWebhook(id: string, data: any) {
    const store = getStore("webhooks");
    store[id] = data;
    saveStore("webhooks", store);
  },
  getWebhook(id: string) {
    return getStore("webhooks")[id] || null;
  },
  listWebhooks() {
    return Object.values(getStore("webhooks"));
  },
  deleteWebhook(id: string) {
    const store = getStore("webhooks");
    delete store[id];
    saveStore("webhooks", store);
  },
};
