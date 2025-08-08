import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletConnection, WalletBanner } from "@/components/WalletConnection";
import { AdminDashboard } from "@/components/AdminDashboard";
import { useElectionStats, useIsOwner } from "@/hooks/use-contract";
import { useElectionSettings } from "@/hooks/use-election-settings";
import { useWallet } from "@/hooks/use-wallet";
import { Link } from "wouter";
import {
  Vote,
  Users,
  BarChart3,
  Clock,
  Shield,
  User,
  UserCog,
  UserPlus,
  Receipt,
  ArrowRight,
} from "lucide-react";

type UserRole = "voter" | "admin";

export default function HomePage() {
  const [userRole, setUserRole] = useState<UserRole>("voter");
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const { isConnected } = useWallet();
  const { data: stats } = useElectionStats();
  const { data: isOwner = false } = useIsOwner();
  const { settings: electionSettings } = useElectionSettings();

  // Reset to voter mode if user is not owner
  React.useEffect(() => {
    if (userRole === "admin" && !isOwner) {
      setUserRole("voter");
    }
  }, [isOwner, userRole]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Link href="/">
                  <h1 className="text-2xl font-bold text-primary cursor-pointer">
                    <Vote className="inline mr-2 w-6 h-6" />
                    DecentralVote
                  </h1>
                </Link>
              </div>
              {userRole === "voter" && (
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
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
                    <Link
                      href="/receipt"
                      className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Receipt
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <WalletConnection />
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="text-gray-700 hover:text-primary p-2"
                >
                  <UserCog className="w-5 h-5" />
                </Button>
                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border">
                    <button
                      onClick={() => {
                        setUserRole("voter");
                        setShowRoleMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="inline mr-2 w-4 h-4" />
                      Voter Mode
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => {
                          setUserRole("admin");
                          setShowRoleMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Shield className="inline mr-2 w-4 h-4" />
                        Admin Mode (Owner)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <WalletBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === "voter" ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="blockchain-bg rounded-2xl p-8 text-white text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-4">
                  Secure Blockchain Voting
                </h2>
                <p className="text-xl opacity-90 mb-6">
                  Transparent, immutable, and trustworthy elections powered by
                  smart contracts
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <Shield className="inline mr-2 w-4 h-4" />
                    Tamper-Proof
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <BarChart3 className="inline mr-2 w-4 h-4" />
                    Transparent
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <User className="inline mr-2 w-4 h-4" />
                    Anonymous
                  </div>
                </div>
              </div>
            </div>

            {/* Election Stats */}
            {isConnected && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Users className="text-primary w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Registered
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats?.totalVoters || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Vote className="text-secondary w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Votes Cast
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats?.totalVotes || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Clock className="text-accent w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Election Status
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            electionSettings.isVotingOpen
                              ? "text-green-600"
                              : electionSettings.isRegistrationOpen
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          {electionSettings.isVotingOpen
                            ? "Voting Active"
                            : electionSettings.isRegistrationOpen
                            ? "Registration Open"
                            : "Election Closed"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/register">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-blue-100 rounded-lg mx-auto w-fit mb-4">
                      <UserPlus className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Register to Vote
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Complete your voter registration
                    </p>
                    <div className="flex items-center justify-center text-primary text-sm font-medium">
                      Get Started <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/vote">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-secondary/20">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-green-100 rounded-lg mx-auto w-fit mb-4">
                      <Vote className="text-secondary w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Cast Your Vote
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Choose your preferred candidate
                    </p>
                    <div className="flex items-center justify-center text-secondary text-sm font-medium">
                      Vote Now <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/results">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-500/20">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-purple-100 rounded-lg mx-auto w-fit mb-4">
                      <BarChart3 className="text-purple-600 w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Election Results
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      View live election results
                    </p>
                    <div className="flex items-center justify-center text-purple-600 text-sm font-medium">
                      View Results <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/receipt">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-accent/20">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-orange-100 rounded-lg mx-auto w-fit mb-4">
                      <Receipt className="text-accent w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Vote Receipt
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      View your voting confirmation
                    </p>
                    <div className="flex items-center justify-center text-accent text-sm font-medium">
                      View Receipt <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        ) : (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}
