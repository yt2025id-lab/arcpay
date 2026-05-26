export function formatAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatUsdc(wei: bigint | undefined): string {
  if (!wei) return "0.00";
  return (Number(wei) / 1e6).toFixed(2);
}

export function formatUsdcInput(val: string): string {
  if (!val) return "";
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  return num.toFixed(2);
}
