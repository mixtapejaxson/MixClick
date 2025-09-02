export function abbreviateNumber(num: number): string {
  if (num < 1e3) return num.toFixed(0); // Show 0 decimal places for numbers < 1k
  if (num >= 1e3 && num < 1e6) return (num / 1e3).toFixed(2) + "K";
  if (num >= 1e6 && num < 1e9) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e9 && num < 1e12) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e12 && num < 1e15) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e15 && num < 1e18) return (num / 1e15).toFixed(2) + "Qa";
  if (num >= 1e18 && num < 1e21) return (num / 1e18).toFixed(2) + "Qi";
  if (num >= 1e21 && num < 1e24) return (num / 1e21).toFixed(2) + "Sx";
  if (num >= 1e24 && num < 1e27) return (num / 1e24).toFixed(2) + "Sp";
  if (num >= 1e27 && num < 1e30) return (num / 1e27).toFixed(2) + "Oc";
  if (num >= 1e30 && num < 1e33) return (num / 1e30).toFixed(2) + "No";
  return num.toExponential(0); // No decimal places for very large numbers
}