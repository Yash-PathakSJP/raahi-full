import { Wallet as WalletIcon } from 'lucide-react';
import ComingSoon from '../../components/ComingSoon';

export default function Wallet() {
  return (
    <ComingSoon
      icon={WalletIcon}
      title="Wallet is coming soon"
      description="Track shared trip expenses and settle up with your travel group in one place."
    />
  );
}
