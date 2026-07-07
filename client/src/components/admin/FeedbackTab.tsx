import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, XCircle, Link2, Copy, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function FeedbackTab() {
  const [surveyLabel, setSurveyLabel] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);
  const [copiedToken, setCopiedToken] = useState("");

  const feedbackQuery = trpc.feedback.listAll.useQuery();
  const surveyLinksQuery = trpc.survey.listLinks.useQuery();

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

  const createLinkMutation = trpc.survey.createLink.useMutation({
    onSuccess: () => {
      surveyLinksQuery.refetch();
      setSurveyLabel("");
      toast.success("Survey link generated successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate link");
    }
  });

  const deleteLinkMutation = trpc.survey.deleteLink.useMutation({
    onSuccess: () => {
      surveyLinksQuery.refetch();
      toast.success("Survey link revoked!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to revoke link");
    }
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

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyLabel.trim()) return;
    createLinkMutation.mutate({
      label: surveyLabel.trim(),
      expiryDays,
    });
  };

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/route-survey?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    toast.success("Survey URL copied to clipboard!");
    setTimeout(() => setCopiedToken(""), 2000);
  };

  const handleRevokeLink = (token: string) => {
    if (confirm("Are you sure you want to revoke/delete this survey link? Anyone using it will lose access immediately.")) {
      deleteLinkMutation.mutate({ token });
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

  return (
    <div className="space-y-10">
      {/* Survey Link Management Section */}
      <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-6 space-y-6 shadow-lg">
        <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2 border-b border-gray-800 pb-2">
          <Link2 size={20} /> Private Survey Link Generator
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generator Form */}
          <form onSubmit={handleGenerateLink} className="space-y-4 lg:col-span-1 bg-black/35 p-4 rounded-lg border border-gray-800">
            <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide">Generate New Link</h4>
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-1">Survey Label / Target Audience</label>
              <input
                type="text"
                value={surveyLabel}
                onChange={(e) => setSurveyLabel(e.target.value)}
                placeholder="e.g., Ayodhya Survey - Group A"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-yellow-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-1">Validity Duration</label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-yellow-400"
              >
                <option value={1}>1 Day (24 Hours)</option>
                <option value={7}>7 Days (1 Week)</option>
                <option value={30}>30 Days (1 Month)</option>
                <option value={90}>90 Days (3 Months)</option>
                <option value={365}>365 Days (1 Year)</option>
              </select>
            </div>
            <Button
              type="submit"
              disabled={createLinkMutation.isPending}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm py-2 rounded flex items-center justify-center gap-2"
            >
              {createLinkMutation.isPending ? (
                <>Generating...</>
              ) : (
                <>
                  <Plus size={16} /> Generate Link
                </>
              )}
            </Button>
          </form>

          {/* Survey Links List */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide">
              Active Temporary Links ({surveyLinksQuery.data?.length || 0})
            </h4>

            {surveyLinksQuery.isLoading ? (
              <p className="text-gray-500 text-sm">Loading links...</p>
            ) : !surveyLinksQuery.data || surveyLinksQuery.data.length === 0 ? (
              <div className="text-center py-8 bg-black/20 border border-dashed border-gray-800 rounded-lg text-gray-500 text-sm">
                No temporary survey links generated yet. Use the form on the left to create one.
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-800 rounded-lg max-h-[280px]">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-2">Survey Label</th>
                      <th className="px-4 py-2">Expiry Date</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {surveyLinksQuery.data.map((link: any) => {
                      const isExpired = new Date() > new Date(link.expiresAt);
                      const displayDate = new Date(link.expiresAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <tr key={link.token} className="hover:bg-gray-800/30">
                          <td className="px-4 py-2.5 font-semibold text-white">
                            {link.label}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-gray-400">
                            {displayDate}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            {isExpired ? (
                              <span className="px-2 py-0.5 rounded-full bg-red-950/50 border border-red-500/30 text-red-500 text-[10px] font-bold">
                                Expired
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-green-950/50 border border-green-500/30 text-green-500 text-[10px] font-bold">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-right flex justify-end gap-2">
                            <Button
                              onClick={() => handleCopyLink(link.token)}
                              className="bg-gray-800 hover:bg-gray-700 text-yellow-400 text-xs px-2.5 py-1 h-auto font-bold flex items-center gap-1 rounded"
                              title="Copy Survey URL"
                              disabled={isExpired}
                            >
                              {copiedToken === link.token ? (
                                <>Copied!</>
                              ) : (
                                <>
                                  <Copy size={12} /> Copy URL
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleRevokeLink(link.token)}
                              disabled={deleteLinkMutation.isPending}
                              className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-xs px-2 py-1 h-auto font-bold rounded"
                              title="Revoke / Delete Link"
                            >
                              Revoke
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Testimonials and Survey Responses Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-yellow-400 border-b border-gray-850 pb-2">
          Customer Feedback & Survey Responses
        </h2>

        {!feedbackQuery.data || feedbackQuery.data.length === 0 ? (
          <p className="text-gray-400">No feedback submitted yet.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
