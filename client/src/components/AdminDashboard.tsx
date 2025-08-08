import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useElectionStats, useCandidates, useAuditData } from '@/hooks/use-contract';
import { AddCandidateModal } from './AddCandidateModal';
import { Shield, Users, UserCheck, Vote, ClipboardList, Plus, RefreshCw } from 'lucide-react';

export function AdminDashboard() {
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const { data: stats } = useElectionStats();
  const { data: candidates = [] } = useCandidates();
  const { data: auditData, refetch: refetchAuditData } = useAuditData();

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
            <p className="text-lg opacity-90">Manage elections, candidates, and view audit logs</p>
          </div>
          <div className="text-right">
            <Shield className="w-16 h-16 opacity-20" />
          </div>
        </div>
      </div>

      {/* Admin Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-primary w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Registered Voters</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalVoters || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="text-secondary w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalCandidates || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Vote className="text-purple-600 w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalVotes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <ClipboardList className="text-error w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Audit Entries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(auditData?.voters.length || 0) + (auditData?.votes.length || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Card>
        <Tabs defaultValue="candidates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="candidates">Manage Candidates</TabsTrigger>
            <TabsTrigger value="settings">Election Settings</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="candidates" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Candidate Management</h3>
              <Button 
                onClick={() => setShowAddCandidate(true)}
                className="bg-accent hover:bg-orange-600 text-white flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Candidate</span>
              </Button>
            </div>
            
            {candidates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No candidates added yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={candidate.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&size=48&background=random`}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&size=48&background=random`;
                        }}
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-600">{candidate.party}</p>
                        <p className="text-xs text-gray-500">ID: #{candidate.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Election Timeline Settings</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                <strong>Note:</strong> This interface is for display purposes. In a production system, 
                these settings would be managed through smart contract functions with proper access controls.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Deadline</label>
                  <input 
                    type="datetime-local" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent" 
                    defaultValue="2024-01-20T23:59"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voting Start Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent" 
                    defaultValue="2024-01-21T08:00"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voting End Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent" 
                    defaultValue="2024-01-21T20:00"
                    disabled
                  />
                </div>
                
                <Button 
                  disabled
                  className="w-full bg-accent hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg"
                >
                  Update Election Timeline
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Current Settings</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Status:</span>
                    <span className="text-green-600 font-medium">Open</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voting Status:</span>
                    <span className="text-blue-600 font-medium">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contract Address:</span>
                    <span className="font-mono text-xs">{import.meta.env.VITE_CONTRACT_ADDRESS || "0x742d..."}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Audit Trail</h3>
              <Button 
                onClick={() => refetchAuditData()}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Voter Registrations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Registered Voters</CardTitle>
                </CardHeader>
                <CardContent>
                  {!auditData?.voters.length ? (
                    <p className="text-gray-500 text-center py-4">No voters registered yet.</p>
                  ) : (
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {auditData.voters.map((voter, index) => (
                        <div key={index} className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{voter.name}</p>
                              <p className="text-sm text-gray-600">ID: #{voter.id}</p>
                              <p className="text-xs text-gray-400 font-mono">{voter.voterAddress}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                voter.hasVoted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {voter.hasVoted ? 'Voted' : 'Registered'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cast Votes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cast Votes</CardTitle>
                </CardHeader>
                <CardContent>
                  {!auditData?.votes.length ? (
                    <p className="text-gray-500 text-center py-4">No votes cast yet.</p>
                  ) : (
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {auditData.votes.map((vote, index) => (
                        <div key={index} className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Voter #{vote.voterId}</p>
                              <p className="text-sm text-gray-600">Candidate ID: {vote.candidateId}</p>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Verified
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <AddCandidateModal 
        open={showAddCandidate} 
        onOpenChange={setShowAddCandidate} 
      />
    </div>
  );
}
