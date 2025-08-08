import { Card, CardContent } from "@/components/ui/card";
import { WalletConnection, WalletBanner } from "@/components/WalletConnection";
import { VotingInterface } from "@/components/VotingInterface";
import { useWallet } from "@/hooks/use-wallet";
import { useVoterData } from "@/hooks/use-contract";
import { useElectionSettings } from "@/hooks/use-election-settings";
import { Link } from "wouter";
import {
  Vote,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  UserPlus,
  Clock,
  Shield,
} from "lucide-react";

export default function VotingPage() {
  const { isConnected } = useWallet();
  const { data: voterData } = useVoterData();
  const { settings: electionSettings } = useElectionSettings();

  const renderContent = () => {
    if (!isConnected) {
      return (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-6">
              To cast your vote, you need to connect your MetaMask wallet first.
            </p>
            <WalletConnection />
          </CardContent>
        </Card>
      );
    }

    if (!voterData?.isRegistered) {
      return (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Registration Required
            </h3>
            <p className="text-gray-600 mb-6">
              You must register to vote before you can cast your ballot.
            </p>
            <Link href="/register">
              <button className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Register to Vote
              </button>
            </Link>
          </CardContent>
        </Card>
      );
    }

    if (voterData.hasVoted) {
      return (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Vote Already Cast</h3>
            <p className="text-gray-600 mb-6">
              You have already voted in this election. Thank you for
              participating!
            </p>
            <Link href="/receipt">
              <button className="w-full bg-secondary hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors mb-3">
                View Your Receipt
              </button>
            </Link>
            <Link href="/results">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                View Election Results
              </button>
            </Link>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Voting Interface */}
        <div className="lg:col-span-3">
          <VotingInterface />
        </div>

        {/* Information Sidebar */}
        <div className="space-y-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Voting Security
              </h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>• Your vote is encrypted and anonymous</li>
                <li>• All votes are recorded on the blockchain</li>
                <li>• Results are transparent and auditable</li>
                <li>• Each wallet can only vote once</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Voter Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Voter ID:</span>
                  <span className="font-mono">#{voterData?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span>{voterData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Registered</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">How to Vote</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Review all candidates carefully</li>
                <li>2. Click "Vote for" your preferred candidate</li>
                <li>3. Confirm the transaction in MetaMask</li>
                <li>4. Wait for blockchain confirmation</li>
                <li>5. Your vote will be permanently recorded</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-700 hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              <div className="flex-shrink-0 ml-4">
                <h1 className="text-2xl font-bold text-primary">
                  <Vote className="inline mr-2 w-6 h-6" />
                  DecentralVote
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/register"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
                <Link
                  href="/results"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Results
                </Link>
                <Link
                  href="/receipt"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Receipt
                </Link>
              </div>
              <WalletConnection />
            </div>
          </div>
        </div>
      </nav>

      <WalletBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cast Your Vote
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your preferred candidate. Your vote will be securely recorded
            on the blockchain.
          </p>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}
