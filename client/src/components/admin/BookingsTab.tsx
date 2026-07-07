import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

export default function BookingsTab() {
  const bookingsQuery = trpc.bookings.list.useQuery();
  const updateStatusMutation = trpc.bookings.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Booking status updated successfully");
      bookingsQuery.refetch();
    },
    onError: (err) => {
      toast.error(`Error updating status: ${err.message}`);
    },
  });

  const handleStatusChange = (id: number, status: typeof BOOKING_STATUSES[number]) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (bookingsQuery.isLoading) {
    return <p className="text-gray-400">Loading bookings...</p>;
  }

  if (bookingsQuery.error) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Bus Bookings</h2>
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-center">
          <p className="text-red-400 mb-3">Failed to load bookings.</p>
          <Button onClick={() => bookingsQuery.refetch()} className="bg-red-600 hover:bg-red-700 text-white">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!bookingsQuery.data || bookingsQuery.data.length === 0) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Bus Bookings</h2>
        <p className="text-gray-400">No bookings yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-yellow-400">Bus Bookings</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900 border-b-2 border-yellow-400">
              <th scope="col" className="px-4 py-3 text-left text-yellow-400">Name</th>
              <th scope="col" className="px-4 py-3 text-left text-yellow-400">Phone</th>
              <th scope="col" className="px-4 py-3 text-left text-yellow-400">Journey Date</th>
              <th scope="col" className="px-4 py-3 text-left text-yellow-400">Source</th>
              <th scope="col" className="px-4 py-3 text-left text-yellow-400">Destination</th>
              <th scope="col" className="px-4 py-3 text-left text-yellow-400">Bus Type</th>
              <th scope="col" className="px-4 py-3 text-left text-yellow-400">Passengers</th>
              <th scope="col" className="px-4 py-3 text-left text-yellow-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookingsQuery.data.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-700 hover:bg-gray-900">
                <td className="px-4 py-3">{booking.name}</td>
                <td className="px-4 py-3">{booking.phone}</td>
                <td className="px-4 py-3">{booking.journeyDate}</td>
                <td className="px-4 py-3">{booking.source}</td>
                <td className="px-4 py-3">{booking.destination}</td>
                <td className="px-4 py-3">{booking.busType}</td>
                <td className="px-4 py-3">{booking.passengers}</td>
                <td className="px-4 py-3">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value as typeof BOOKING_STATUSES[number])}
                    aria-label={`Update status for booking ${booking.id}`}
                    className="bg-black text-yellow-400 border border-yellow-400/50 px-2 py-1 rounded font-bold text-sm focus:outline-none focus:border-yellow-400"
                    disabled={updateStatusMutation.isPending}
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-gray-900 text-white">
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
