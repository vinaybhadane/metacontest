/**
 * Generates a referral code in format: MC-XXXX-YYYY
 * XXXX = first 4 letters of name (uppercase, alpha only)
 * YYYY = 4 random alphanumeric chars
 */
export function generateReferralCode(name: string): string {
  const prefix = name
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, "X");

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `MC-${prefix}-${suffix}`;
}

/**
 * Format name for privacy display: "Priya Patel" → "Priya P."
 */
export function formatNameForLeaderboard(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstName} ${lastInitial}.`;
}
