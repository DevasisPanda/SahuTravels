import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Fleet from "./pages/Fleet";
import Gallery from "./pages/Gallery";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import RouteSurvey from "./pages/RouteSurvey";

function withLayout(Component: () => React.JSX.Element) {
  return () => (
    <Layout>
      <Component />
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/route-survey" component={withLayout(RouteSurvey)} />
      <Route path="/" component={withLayout(Home)} />
      <Route path="/about" component={withLayout(About)} />
      <Route path="/services" component={withLayout(Services)} />
      <Route path="/fleet" component={withLayout(Fleet)} />
      <Route path="/gallery" component={withLayout(Gallery)} />
      <Route path="/offers" component={withLayout(Offers)} />
      <Route path="/contact" component={withLayout(Contact)} />
      <Route path="/booking" component={withLayout(Booking)} />
      <Route path="/booking-confirmation" component={withLayout(BookingConfirmation)} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
