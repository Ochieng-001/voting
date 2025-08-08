import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletConnection, WalletBanner } from "@/components/WalletConnection";
import { VoteReceipt } from "@/components/VoteReceipt";
import { useWallet } from "@/hooks/use-wallet";
import { useVoterData } from "@/hooks/use-contract";
import { Link } from "wouter";
import {
  Vote,
  ArrowLeft,
  AlertCircle,
  UserPlus,
  Clock,
  Download,
  Share,
  QrCode,
} from "lucide-react";

export default function ReceiptPage() {
  const { isConnected } = useWallet();
  const { data: voterData } = useVoterData();

  const handleDownloadReceipt = () => {
    // In a real implementation, this would generate a PDF or image receipt
    alert("Receipt download functionality would be implemented here");
  };

  const handleShareReceipt = () => {
    // In a real implementation, this would generate a shareable link or QR code
    if (navigator.share) {
      navigator.share({
        title: "My Vote Receipt - DecentralVote",
        text: "I successfully cast my vote in the blockchain election",
        url: window.location.href,
      });
    } else {
      alert("Receipt sharing functionality would be implemented here");
    }
  };

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
              To view your vote receipt, you need to connect your MetaMask
              wallet first.
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
            <h3 className="text-xl font-semibold mb-2">Not Registered</h3>
            <p className="text-gray-600 mb-6">
              You must register to vote before you can access your vote receipt.
            </p>
            <Link href="/register">
              <Button className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                <UserPlus className="w-4 h-4 mr-2" />
                Register to Vote
              </Button>
            </Link>
          </CardContent>
        </Card>
      );
    }

    if (!voterData.hasVoted) {
      return (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Vote Cast Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't cast your vote yet. Once you vote, your receipt will
              be available here.
            </p>
            <Link href="/vote">
              <Button className="w-full bg-secondary hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                <Vote className="w-4 h-4 mr-2" />
                Cast Your Vote
              </Button>
            </Link>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Receipt */}
        <div className="lg:col-span-2">
          <VoteReceipt />

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleDownloadReceipt}
              className="flex-1 bg-primary hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button
              onClick={handleShareReceipt}
              variant="outline"
              className="flex-1"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Receipt
            </Button>
          </div>
        </div>

        {/* Information Sidebar */}
        <div className="space-y-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-green-900 mb-2">
                Receipt Verification
              </h3>
              <p className="text-sm text-green-800 mb-3">
                Your vote receipt is cryptographically secured and can be
                independently verified on the blockchain.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-green-700 border-green-300 hover:bg-green-100"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Generate QR Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                What This Receipt Proves
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Your vote was successfully recorded</li>
                <li>• Transaction was confirmed on blockchain</li>
                <li>• You participated in the election</li>
                <li>• Your voting rights were exercised</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Privacy Notice
              </h3>
              <p className="text-sm text-blue-800">
                While this receipt proves you voted, it does not reveal which
                candidate you voted for, maintaining ballot secrecy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="space-y-2">
                <Link href="/results">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    View Election Results
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
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
              </div>
              <WalletConnection />
            </div>
          </div>
        </div>
      </nav>

      <WalletBanner />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Vote Receipt
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your official blockchain-verified voting receipt. This serves as
            proof of your participation in the election.
          </p>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}
