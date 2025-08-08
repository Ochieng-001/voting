import { Card, CardContent } from "@/components/ui/card";
import { WalletConnection, WalletBanner } from "@/components/WalletConnection";
import { ElectionResults } from "@/components/ElectionResults";
import { useElectionStats } from "@/hooks/use-contract";
import { useWallet } from "@/hooks/use-wallet";
import { Link } from "wouter";
import {
  Vote,
  ArrowLeft,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResultsPage() {
  const { isConnected } = useWallet();
  const { data: stats, refetch: refetchStats, isLoading } = useElectionStats();

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
                  href="/vote"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Vote
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
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Election Results
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetchStats()}
              disabled={isLoading}
              className="ml-4"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Live election results powered by blockchain transparency. All votes
            are publicly verifiable.
          </p>
        </div>

        {/* Election Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Registered
                  </p>
                  <p className="text-3xl font-bold">
                    {stats?.totalVoters || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Votes Cast
                  </p>
                  <p className="text-3xl font-bold">{stats?.totalVotes || 0}</p>
                </div>
                <Vote className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Turnout Rate
                  </p>
                  <p className="text-3xl font-bold">
                    {stats?.totalVoters && stats?.totalVotes
                      ? Math.round((stats.totalVotes / stats.totalVoters) * 100)
                      : 0}
                    %
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Election Status
                  </p>
                  <p className="text-xl font-bold">Active</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {!isConnected ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Connect to View Detailed Results
              </h3>
              <p className="text-gray-600 mb-6">
                Connect your wallet to view detailed election results and
                candidate information.
              </p>
              <WalletConnection />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Results */}
            <div className="lg:col-span-3">
              <ElectionResults />
            </div>

            {/* Information Sidebar */}
            <div className="space-y-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Live Results
                  </h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Results are updated in real-time as votes are cast and
                    confirmed on the blockchain.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchStats()}
                    disabled={isLoading}
                    className="w-full text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${
                        isLoading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh Results
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Election Transparency
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• All votes are recorded on blockchain</li>
                    <li>• Results are publicly verifiable</li>
                    <li>• No central authority controls counting</li>
                    <li>• Historical record is immutable</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Voting Still Open
                  </h3>
                  <p className="text-sm text-green-800 mb-3">
                    The election is currently active. Results will continue to
                    update as more votes are cast.
                  </p>
                  <Link href="/vote">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-green-700 border-green-300 hover:bg-green-100"
                    >
                      Cast Your Vote
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Share Results
                  </h3>
                  <p className="text-sm text-purple-800 mb-3">
                    Election results are public and can be independently
                    verified by anyone.
                  </p>
                  <p className="text-xs text-purple-700 font-mono break-all bg-white p-2 rounded">
                    {window.location.href}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
