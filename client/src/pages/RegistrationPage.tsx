import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletConnection, WalletBanner } from "@/components/WalletConnection";
import { VoterRegistration } from "@/components/VoterRegistration";
import { useWallet } from "@/hooks/use-wallet";
import { Link } from "wouter";
import { Vote, ArrowLeft, Shield, CheckCircle, Clock } from "lucide-react";

export default function RegistrationPage() {
  const { isConnected } = useWallet();

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
                  href="/vote"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Vote
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Voter Registration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Register to participate in the upcoming election. Your registration
            will be securely recorded on the blockchain.
          </p>
        </div>

        {/* Registration Process Steps */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <span className="font-medium">Connect Wallet</span>
            </div>
            <div className="hidden md:block w-8 h-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  isConnected
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span
                className={`font-medium ${
                  isConnected ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Fill Registration Form
              </span>
            </div>
            <div className="hidden md:block w-8 h-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <span className="font-medium text-gray-500">
                Confirm Registration
              </span>
            </div>
          </div>
        </div>

        {/* Registration Content */}
        {!isConnected ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-gray-600 mb-6">
                To register to vote, you need to connect your MetaMask wallet
                first.
              </p>
              <WalletConnection />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Registration Form */}
            <div className="lg:col-span-2">
              <VoterRegistration />
            </div>

            {/* Information Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary" />
                    Why Register?
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Secure blockchain-based verification
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Anonymous voting with tamper-proof records
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Transparent and auditable election process
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      Real-time results and vote verification
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Registration Information
                  </h3>
                  <p className="text-sm text-blue-800">
                    Your voter ID should be a unique identifier. Your
                    registration will be permanently recorded on the blockchain
                    and cannot be modified after submission.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Next Steps
                  </h3>
                  <p className="text-sm text-green-800 mb-3">
                    After registration, you can:
                  </p>
                  <div className="space-y-2">
                    <Link href="/vote">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-green-700 border-green-300 hover:bg-green-100"
                      >
                        Cast Your Vote
                      </Button>
                    </Link>
                    <Link href="/results">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-green-700 border-green-300 hover:bg-green-100"
                      >
                        View Results
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
