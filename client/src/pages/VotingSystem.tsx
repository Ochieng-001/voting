import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WalletConnection, WalletBanner } from '@/components/WalletConnection';
import { VoterRegistration } from '@/components/VoterRegistration';
import { VotingInterface } from '@/components/VotingInterface';
import { VoteReceipt } from '@/components/VoteReceipt';
import { ElectionResults } from '@/components/ElectionResults';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useElectionStats } from '@/hooks/use-contract';
import { useWallet } from '@/hooks/use-wallet';
import { Vote, Users, BarChart3, Clock, Shield, User, UserCog } from 'lucide-react';

type UserRole = 'voter' | 'admin';

export default function VotingSystem() {
  const [userRole, setUserRole] = useState<UserRole>('voter');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const { isConnected } = useWallet();
  const { data: stats } = useElectionStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">
                  <Vote className="inline mr-2 w-6 h-6" />
                  DecentralVote
                </h1>
              </div>
              {userRole === 'voter' && (
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <a href="#register" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Register
                    </a>
                    <a href="#vote" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Vote
                    </a>
                    <a href="#results" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Results
                    </a>
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
                        setUserRole('voter');
                        setShowRoleMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="inline mr-2 w-4 h-4" />
                      Voter Mode
                    </button>
                    <button
                      onClick={() => {
                        setUserRole('admin');
                        setShowRoleMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Shield className="inline mr-2 w-4 h-4" />
                      Admin Mode
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <WalletBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === 'voter' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="blockchain-bg rounded-2xl p-8 text-white text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-4">Secure Blockchain Voting</h2>
                <p className="text-xl opacity-90 mb-6">
                  Transparent, immutable, and trustworthy elections powered by smart contracts
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

            {/* Voting Status Cards */}
            {isConnected && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Users className="text-primary w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Registered</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalVoters || 0}</p>
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
                        <p className="text-sm font-medium text-gray-600">Votes Cast</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalVotes || 0}</p>
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
                        <p className="text-sm font-medium text-gray-600">Election Status</p>
                        <p className="text-lg font-bold text-gray-900">Active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Voter Sections */}
            <section id="register">
              <VoterRegistration />
            </section>

            <VoteReceipt />

            <section id="vote">
              <VotingInterface />
            </section>

            <section id="results">
              <ElectionResults />
            </section>
          </div>
        ) : (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}
