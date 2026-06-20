import { CalendarCheck } from 'lucide-react';
import ComingSoon from '../../components/ComingSoon';

export default function Bookings() {
  return (
    <ComingSoon
      icon={CalendarCheck}
      title="Bookings are coming soon"
      description="Soon you'll be able to book stays, transport, and experiences for your trips right from RAAHI."
    />
  );
}
