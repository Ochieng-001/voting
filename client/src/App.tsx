import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/contexts/WalletContext";
import HomePage from "@/pages/HomePage";
import RegistrationPage from "@/pages/RegistrationPage";
import VotingPage from "@/pages/VotingPage";
import ResultsPage from "@/pages/ResultsPage";
import ReceiptPage from "@/pages/ReceiptPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/register" component={RegistrationPage} />
      <Route path="/vote" component={VotingPage} />
      <Route path="/results" component={ResultsPage} />
      <Route path="/receipt" component={ReceiptPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
