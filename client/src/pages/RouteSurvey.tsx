import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Calendar, Bus, User, Phone, Check } from "lucide-react";

export default function RouteSurvey() {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token") || "";

  const verifyQuery = trpc.survey.verifyLink.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [otherRoute, setOtherRoute] = useState("");
  const [frequency, setFrequency] = useState("");
  const [busTypes, setBusTypes] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const createFeedbackMutation = trpc.feedback.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Survey submitted successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit survey");
    },
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full bg-gray-900 border-2 border-red-500 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-950 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 font-extrabold text-3xl">
            !
          </div>
          <h1 className="text-2xl font-black text-red-500 mb-4 tracking-wide uppercase">
            Access Denied / प्रवेश वर्जित
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            This survey is private and requires a valid survey token to access.
            <br />
            <span className="text-red-400 font-semibold text-sm">
              यह सर्वेक्षण निजी है और इसके लिए एक वैध टोकन की आवश्यकता है।
            </span>
          </p>
          <a href="/">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3">
              Go Back Home / मुख्य पृष्ठ पर जाएं
            </Button>
          </a>
        </div>
      </div>
    );
  }

  if (verifyQuery.isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Verifying survey link...</p>
        </div>
      </div>
    );
  }

  if (verifyQuery.error || (verifyQuery.data && !verifyQuery.data.isValid)) {
    const reason = verifyQuery.data?.reason || "Invalid survey token";
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full bg-gray-900 border-2 border-red-500 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-950 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 font-extrabold text-3xl">
            !
          </div>
          <h1 className="text-2xl font-black text-red-500 mb-4 tracking-wide uppercase">
            Survey Expired or Invalid
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            {reason === "Survey link has expired" ? "This temporary survey link has expired." : "This survey link is invalid or has been revoked."}
            <br />
            <span className="text-red-400 font-semibold text-sm">
              यह सर्वेक्षण लिंक समाप्त या अमान्य हो गया है।
            </span>
          </p>
          <a href="/">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3">
              Go Back Home / मुख्य पृष्ठ पर जाएं
            </Button>
          </a>
        </div>
      </div>
    );
  }

  const routes = [
    { id: "r1", label: "Kota ➔ Nashik (कोटा ➔ नासिक)", via: "Ujjain - Indore - Jalgaon - Nashik" },
    { id: "r2", label: "Kota ➔ Pune (कोटा ➔ पुणे)", via: "Ujjain - Indore - Jalgaon - Nashik - Pune" },
    { id: "r3", label: "Kota ➔ Vaishno Devi (कोटा ➔ वैष्णो देवी / कटरा)", via: "Delhi - Ludhiana - Jalandhar - Pathankot - Jammu - Katra" },
    { id: "r4", label: "Kota ➔ Varanasi (कोटा ➔ वाराणसी / बनारस)", via: "Jhansi - Orai - Kanpur - Prayagraj - Varanasi" },
    { id: "r5", label: "Kota ➔ Haridwar / Dehradun (कोटा ➔ हरिद्वार / देहरादून)", via: "Jaipur - Delhi - Haridwar - Dehradun" },
    { id: "r6", label: "Kota ➔ Nagpur (कोटा ➔ नागपुर)", via: "Bhopal - Betul - Nagpur" },
    { id: "r7", label: "Kota ➔ Mumbai (कोटा ➔ मुंबई)", via: "Ujjain - Indore - Dhule - Nashik - Mumbai" },
    { id: "r8", label: "Kota ➔ Ayodhya (कोटा ➔ अयोध्या)", via: "Jhansi - Kanpur - Lucknow - Ayodhya" },
  ];

  const frequencies = [
    { label: "Daily (प्रत्येक दिन)", val: "Daily" },
    { label: "Weekly (हर सप्ताह)", val: "Weekly" },
    { label: "Monthly (महीने में 1-2 बार)", val: "Monthly" },
    { label: "Occasionally (कभी-कभी)", val: "Occasionally" },
    { label: "Festival Only (त्योहारों पर)", val: "Festival Only" },
  ];

  const busTypeOptions = ["AC Sleeper", "AC Seater", "AC Sleeper + Seater"];

  const handleRouteToggle = (label: string) => {
    if (selectedRoutes.includes(label)) {
      setSelectedRoutes(selectedRoutes.filter((r) => r !== label));
    } else {
      setSelectedRoutes([...selectedRoutes, label]);
    }
  };

  const handleBusTypeToggle = (type: string) => {
    if (busTypes.includes(type)) {
      setBusTypes(busTypes.filter((t) => t !== type));
    } else {
      setBusTypes([...busTypes, type]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRoutes.length === 0 && !otherRoute.trim()) {
      toast.error("Please select at least one route or suggest another route");
      return;
    }
    if (!frequency) {
      toast.error("Please select your travel frequency");
      return;
    }
    if (busTypes.length === 0) {
      toast.error("Please select at least one preferred bus type");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!mobile.trim() || mobile.trim().length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    // Format survey response into a structured message
    const formattedMessage = `
[NEW ROUTE SURVEY SUBMISSION]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Mobile Number: ${mobile}
• Travel Frequency: ${frequency}
• Bus Type Preference: ${busTypes.join(", ")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Preferred Routes Selected:
${selectedRoutes.map((r) => `  - ${r}`).join("\n")}
${otherRoute.trim() ? `  - Other Suggested Route: ${otherRoute}` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Suggestions / Comments:
${suggestions.trim() ? suggestions : "None provided"}
    `.trim();

    createFeedbackMutation.mutate({
      name: name.trim(),
      rating: 5,
      message: formattedMessage,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full bg-gray-900 border-2 border-yellow-400 rounded-2xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full opacity-5 blur-3xl"></div>
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-black">
            <CheckCircle2 size={48} className="animate-bounce" />
          </div>
          <h1 className="text-3xl font-black text-yellow-400 mb-4 tracking-wide uppercase">
            Thank You! / धन्यवाद!
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Your feedback will help Sahu Travels start new routes based on passenger demand.
            <br />
            <span className="text-yellow-400 font-semibold text-sm">
              आपके सुझाव हमें यात्री मांग के अनुसार नए रूट शुरू करने में मदद करेंगे।
            </span>
          </p>
          <a href="/">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3">
              Go Back Home / होम पेज पर जाएं
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-4xl mx-auto bg-gray-900 border-2 border-yellow-400 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400 rounded-full opacity-5 blur-3xl"></div>

        {/* Heading */}
        <div className="text-center border-b-2 border-yellow-400/30 pb-6 mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400 tracking-wide uppercase mb-2">
            Sahu Travels
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
            New Route Suggestion Form / नया रूट सुझाव फॉर्म
          </h2>
          {verifyQuery.data?.label && (
            <p className="text-lg text-yellow-400 font-extrabold mb-1 uppercase tracking-wide">
              📋 {verifyQuery.data.label}
            </p>
          )}
          <p className="text-yellow-400 font-semibold text-sm">
            Choose Your Preferred Route / अपना पसंदीदा नया रूट चुनें
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-black/50 border border-yellow-400/20 rounded-lg p-5 mb-8">
          <p className="font-bold text-yellow-400 mb-2">Dear Passenger / प्रिय यात्री,</p>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Sahu Travels is planning to start new Luxury AC Sleeper Bus Services. Please choose your preferred routes from the options below.
            <br />
            <span className="text-gray-400 italic text-xs md:text-sm mt-2 block">
              Sahu Travels नई Luxury AC Sleeper Bus Services शुरू करने की योजना बना रहा है। कृपया नीचे दिए गए रूटों में से अपनी पसंद के रूट पर चयन करें।
            </span>
          </p>
        </div>

        {/* Survey Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Preferred Route */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2 border-b border-gray-800 pb-2">
              <MapPin size={20} />
              Preferred Route / पसंदीदा नया रूट (एक या अधिक विकल्प चुन सकते हैं)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map((r) => {
                const isSelected = selectedRoutes.includes(r.label);
                return (
                  <div
                    key={r.id}
                    onClick={() => handleRouteToggle(r.label)}
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? "bg-yellow-400/10 border-yellow-400"
                        : "bg-black/30 border-gray-800 hover:border-yellow-400/50"
                    }`}
                  >
                    <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center ${
                      isSelected ? "bg-yellow-400 border-yellow-400 text-black" : "border-gray-600 bg-black/50"
                    }`}>
                      {isSelected && <Check size={14} className="stroke-[3]" />}
                    </div>
                    <div>
                      <div className={`font-bold text-sm md:text-base ${isSelected ? "text-yellow-400" : "text-white"}`}>
                        {r.label}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        Via (मार्ग): {r.via}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Other Route Input */}
            <div className="mt-4 pt-2">
              <label htmlFor="other-route" className="block text-gray-300 font-semibold mb-2 text-sm">
                Other Route / अन्य रूट :
              </label>
              <input
                id="other-route"
                type="text"
                value={otherRoute}
                onChange={(e) => setOtherRoute(e.target.value)}
                placeholder="Enter custom route suggestion here..."
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 text-sm md:text-base"
              />
            </div>
          </div>

          {/* Section 2: Travel Frequency */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2 border-b border-gray-800 pb-2">
              <Calendar size={20} />
              Travel Frequency / आप कितनी बार यात्रा करेंगे?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {frequencies.map((f) => {
                const isSelected = frequency === f.val;
                return (
                  <div
                    key={f.val}
                    onClick={() => setFrequency(f.val)}
                    className={`p-3 rounded-lg border text-center cursor-pointer transition ${
                      isSelected
                        ? "bg-yellow-400 text-black font-extrabold border-yellow-400"
                        : "bg-black/30 border-gray-800 text-gray-300 hover:border-yellow-400/50"
                    }`}
                  >
                    <div className="text-xs md:text-sm">{f.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Preferred Bus Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2 border-b border-gray-800 pb-2">
              <Bus size={20} />
              Preferred Bus Type / आप किस प्रकार की बस पसंद करेंगे?
            </h3>
            <div className="flex flex-wrap gap-4">
              {busTypeOptions.map((type) => {
                const isSelected = busTypes.includes(type);
                return (
                  <div
                    key={type}
                    onClick={() => handleBusTypeToggle(type)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? "bg-yellow-400/10 border-yellow-400 text-yellow-400 font-bold"
                        : "bg-black/30 border-gray-800 text-gray-300 hover:border-yellow-400/50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      isSelected ? "bg-yellow-400 border-yellow-400 text-black" : "border-gray-600 bg-black/50"
                    }`}>
                      {isSelected && <Check size={14} className="stroke-[3]" />}
                    </div>
                    <span className="text-sm md:text-base font-semibold">{type}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Passenger Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2 border-b border-gray-800 pb-2">
              <User size={20} />
              Passenger Information / यात्री विवरण
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="passenger-name" className="block text-gray-400 text-sm font-semibold mb-2">
                  Name / नाम *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-yellow-400" size={18} />
                  <input
                    id="passenger-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="passenger-mobile" className="block text-gray-400 text-sm font-semibold mb-2">
                  Mobile No. / मोबाइल नंबर *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-yellow-400" size={18} />
                  <input
                    id="passenger-mobile"
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label htmlFor="passenger-suggestions" className="block text-gray-400 text-sm font-semibold mb-2">
                Suggestions / आपके सुझाव
              </label>
              <textarea
                id="passenger-suggestions"
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="Share any additional requirements or feedback..."
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 h-28 text-sm md:text-base"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={createFeedbackMutation.isPending}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-4 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createFeedbackMutation.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Submitting / जमा किया जा रहा है...
              </>
            ) : (
              <>
                Submit Survey / सुझाव दर्ज करें
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
