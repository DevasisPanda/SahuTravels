import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function FeedbackTab() {
  const feedbackQuery = trpc.feedback.listAll.useQuery();
  const updateMutation = trpc.feedback.update.useMutation({
    onSuccess: () => {
      feedbackQuery.refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update feedback");
    },
  });
  const deleteMutation = trpc.feedback.delete.useMutation({
    onSuccess: () => {
      feedbackQuery.refetch();
      toast.success("Feedback deleted!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete feedback");
    },
  });

  const handleTogglePublish = (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    updateMutation.mutate({ id, isPublished: newStatus });
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this feedback?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (feedbackQuery.isLoading) {
    return <p className="text-gray-400">Loading feedback...</p>;
  }

  if (feedbackQuery.error) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Customer Feedback & Testimonials</h2>
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-center">
          <p className="text-red-400 mb-3">Failed to load feedback.</p>
          <Button onClick={() => feedbackQuery.refetch()} className="bg-red-600 hover:bg-red-700 text-white">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!feedbackQuery.data || feedbackQuery.data.length === 0) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Customer Feedback & Testimonials</h2>
        <p className="text-gray-400">No feedback submitted yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-yellow-400">
        Customer Feedback & Testimonials
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbackQuery.data.map((feedback) => (
          <div
            key={feedback.id}
            className={`bg-gray-900 border-2 rounded-lg p-6 flex flex-col justify-between transition ${
              feedback.isPublished === 1 ? "border-yellow-400" : "border-gray-700"
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-bold text-white">{feedback.name}</h4>
                <span className="text-xs text-gray-400">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
              {feedback.email && (
                <p className="text-xs text-gray-500 mb-2">{feedback.email}</p>
              )}
              {feedback.message.includes("[NEW ROUTE SURVEY SUBMISSION]") ? (
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded px-2.5 py-1 text-xs text-yellow-400 font-bold mb-3 inline-block">
                  📋 Route Survey Response
                </div>
              ) : (
                <div className="flex gap-1 mb-3" role="img" aria-label={`Rating: ${feedback.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < feedback.rating ? "text-yellow-400" : "text-gray-700"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-300 text-sm mb-4 whitespace-pre-line">
                {feedback.message}
              </p>
            </div>

            <div className="flex gap-2 border-t border-gray-800 pt-4 mt-auto">
              <Button
                onClick={() => handleTogglePublish(feedback.id, feedback.isPublished)}
                disabled={updateMutation.isPending}
                className={`flex-1 font-bold text-sm flex items-center justify-center gap-1 ${
                  feedback.isPublished === 1
                    ? "bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-yellow-400"
                    : "bg-yellow-400 text-black hover:bg-yellow-500"
                }`}
              >
                {feedback.isPublished === 1 ? (
                  <><XCircle size={16} /> Unpublish</>
                ) : (
                  <><CheckCircle size={16} /> Publish</>
                )}
              </Button>
              <Button
                onClick={() => handleDelete(feedback.id)}
                disabled={deleteMutation.isPending}
                aria-label="Delete feedback"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-4"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
