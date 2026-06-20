import { ListChecks } from 'lucide-react';
import ComingSoon from '../../components/ComingSoon';

export default function Itinerary() {
  return (
    <ComingSoon
      icon={ListChecks}
      title="Your itineraries live inside each trip"
      description="Open a trip from the Trips tab and head to its Itinerary section to view or edit the day-by-day plan."
    />
  );
}
