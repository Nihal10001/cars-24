export interface Transaction {
  description: string;
  points: number;
  date: string;
}

export interface Wallet {
  referralCode: string;
  balance: number;
  transactions: Transaction[];
}

// Simulated DB in memory
const wallets: Record<string, Wallet> = {};

function generateCode(username: string): string {
  return (username.slice(0, 4) + Math.random().toString(36).slice(2, 6)).toUpperCase();
}

export function getOrCreateWallet(username: string): Wallet {
  if (!wallets[username]) {
    wallets[username] = {
      referralCode: generateCode(username),
      balance: 0,
      transactions: [],
    };
  }
  return wallets[username];
}

export function applyReferral(newUser: string, referralCode: string): string {
  // Find referrer
  const referrer = Object.keys(wallets).find(
    (u) => wallets[u].referralCode === referralCode
  );
  if (!referrer) return "Invalid referral code.";
  if (wallets[newUser]) return "User already registered.";

  // Create new user wallet with 50 bonus points
  wallets[newUser] = {
    referralCode: generateCode(newUser),
    balance: 50,
    transactions: [{ description: "Joined via referral", points: 50, date: new Date().toLocaleDateString() }],
  };

  // Give referrer 100 points
  wallets[referrer].balance += 100;
  wallets[referrer].transactions.push({
    description: `Referral bonus for inviting ${newUser}`,
    points: 100,
    date: new Date().toLocaleDateString(),
  });

  return "success";
}

export function redeemPoints(username: string, points: number): string {
  const wallet = wallets[username];
  if (!wallet) return "Wallet not found.";
  if (points < 100) return "Minimum redemption is 100 points.";
  if (wallet.balance < points) return "Insufficient points.";
  wallet.balance -= points;
  wallet.transactions.push({
    description: `Redeemed ${points} pts for discount`,
    points: -points,
    date: new Date().toLocaleDateString(),
  });
  return "success";
}

export { wallets };