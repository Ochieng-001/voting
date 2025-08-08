import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useElectionStats,
  useCandidates,
  useAuditData,
  useIsOwner,
} from "@/hooks/use-contract";
import { useElectionSettings } from "@/hooks/use-election-settings";
import { AddCandidateModal } from "@/components/AddCandidateModal";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Users,
  UserCheck,
  Vote,
  ClipboardList,
  Plus,
  RefreshCw,
  Calendar,
  Clock,
  AlertTriangle,
  Settings,
} from "lucide-react";

export function AdminDashboard() {
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [tempSettings, setTempSettings] = useState({
    registrationDeadline: "",
    votingStartTime: "",
    votingEndTime: "",
  });

  const { data: stats } = useElectionStats();
  const { data: candidates = [] } = useCandidates();
  const { data: auditData, refetch: refetchAuditData } = useAuditData();
  const { data: isOwner = false, isLoading: isCheckingOwnership } =
    useIsOwner();
  const {
    settings: electionSettings,
    updateSettings,
    resetSettings,
    isLoading: isLoadingSettings,
  } = useElectionSettings();
  const { toast } = useToast();

  const handleUpdateSettings = async () => {
    try {
      const updates: any = {};

      if (tempSettings.registrationDeadline) {
        updates.registrationDeadline = tempSettings.registrationDeadline;
      }
      if (tempSettings.votingStartTime) {
        updates.votingStartTime = tempSettings.votingStartTime;
      }
      if (tempSettings.votingEndTime) {
        updates.votingEndTime = tempSettings.votingEndTime;
      }

      // Validate that we have at least one setting to update
      if (Object.keys(updates).length === 0) {
        toast({
          title: "No Changes",
          description: "Please set at least one deadline before updating.",
          variant: "destructive",
        });
        return;
      }

      await updateSettings(updates);

      // Clear temp settings after successful update
      setTempSettings({
        registrationDeadline: "",
        votingStartTime: "",
        votingEndTime: "",
      });

      toast({
        title: "Settings Updated",
        description: "Election timeline has been successfully configured.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleResetSettings = async () => {
    try {
      await resetSettings();
      setTempSettings({
        registrationDeadline: "",
        votingStartTime: "",
        votingEndTime: "",
      });

      toast({
        title: "Settings Reset",
        description: "Election timeline has been reset to default values.",
      });
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Show loading while checking ownership
  if (isCheckingOwnership) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        <span className="ml-2">Verifying access permissions...</span>
      </div>
    );
  }

  // Show access denied message if not owner
  if (!isOwner) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-3xl font-bold mb-2">Access Denied</h2>
          <p className="text-lg opacity-90">
            Only the contract owner can access the admin dashboard.
          </p>
          <p className="text-sm opacity-75 mt-2">
            Please connect with the owner wallet to manage elections.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
            <p className="text-lg opacity-90">
              Manage elections, candidates, and view audit logs
            </p>
            <div className="mt-2 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <p className="text-sm opacity-75">Contract Owner Only</p>
            </div>
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
                <p className="text-sm font-medium text-gray-600">
                  Registered Voters
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
                <UserCheck className="text-secondary w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Candidates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalCandidates || 0}
                </p>
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
              <div className="p-3 bg-red-100 rounded-lg">
                <ClipboardList className="text-error w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Audit Entries
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(auditData?.voters.length || 0) +
                    (auditData?.votes.length || 0)}
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
              <h3 className="text-xl font-semibold text-gray-900">
                Candidate Management
              </h3>
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
                  <div
                    key={candidate.id}
                    className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          candidate.photo ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            candidate.name
                          )}&size=48&background=random`
                        }
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          (
                            e.target as HTMLImageElement
                          ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            candidate.name
                          )}&size=48&background=random`;
                        }}
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {candidate.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {candidate.party}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: #{candidate.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Settings className="w-6 h-6 text-accent mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Election Timeline Settings
                </h3>
              </div>
              {!electionSettings.canUpdateSettings && (
                <div className="flex items-center text-amber-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    Settings locked during election
                  </span>
                </div>
              )}
            </div>

            {/* Countdown Timers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <CountdownTimer
                targetDate={electionSettings.registrationDeadline}
                title="Registration Closes"
                description="Time until registration deadline"
                variant="registration"
              />
              <CountdownTimer
                targetDate={electionSettings.votingStartTime}
                title="Voting Begins"
                description="Time until voting opens"
                variant="voting"
              />
              <CountdownTimer
                targetDate={electionSettings.votingEndTime}
                title="Voting Ends"
                description="Time until voting closes"
                variant="voting"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Settings Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Configure Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="registrationDeadline">
                      Registration Deadline
                    </Label>
                    <Input
                      id="registrationDeadline"
                      type="datetime-local"
                      value={
                        tempSettings.registrationDeadline ||
                        electionSettings.registrationDeadline ||
                        ""
                      }
                      onChange={(e) =>
                        setTempSettings((prev) => ({
                          ...prev,
                          registrationDeadline: e.target.value,
                        }))
                      }
                      disabled={!electionSettings.canUpdateSettings}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="votingStartTime">Voting Start Time</Label>
                    <Input
                      id="votingStartTime"
                      type="datetime-local"
                      value={
                        tempSettings.votingStartTime ||
                        electionSettings.votingStartTime ||
                        ""
                      }
                      onChange={(e) =>
                        setTempSettings((prev) => ({
                          ...prev,
                          votingStartTime: e.target.value,
                        }))
                      }
                      disabled={!electionSettings.canUpdateSettings}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="votingEndTime">Voting End Time</Label>
                    <Input
                      id="votingEndTime"
                      type="datetime-local"
                      value={
                        tempSettings.votingEndTime ||
                        electionSettings.votingEndTime ||
                        ""
                      }
                      onChange={(e) =>
                        setTempSettings((prev) => ({
                          ...prev,
                          votingEndTime: e.target.value,
                        }))
                      }
                      disabled={!electionSettings.canUpdateSettings}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={handleUpdateSettings}
                      disabled={
                        !electionSettings.canUpdateSettings || isLoadingSettings
                      }
                      className="flex-1 bg-accent hover:bg-orange-600 text-white"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {isLoadingSettings ? "Updating..." : "Update Timeline"}
                    </Button>
                    <Button
                      onClick={handleResetSettings}
                      disabled={!electionSettings.canUpdateSettings}
                      variant="outline"
                      className="px-6"
                    >
                      Reset
                    </Button>
                  </div>

                  {!electionSettings.canUpdateSettings && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">
                            Settings Locked
                          </p>
                          <p className="text-sm text-amber-700">
                            Election timeline cannot be modified while deadlines
                            are active. Settings will be unlocked after the
                            voting period ends.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Current Election Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Registration Status:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          electionSettings.isRegistrationOpen
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {electionSettings.isRegistrationOpen
                          ? "Open"
                          : "Closed"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Voting Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          electionSettings.isVotingOpen
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {electionSettings.isVotingOpen ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Settings Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          electionSettings.canUpdateSettings
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {electionSettings.canUpdateSettings
                          ? "Editable"
                          : "Locked"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-900 mb-3">
                      Timeline Summary
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Registration Deadline:
                        </span>
                        <span className="font-mono text-xs">
                          {electionSettings.registrationDeadline
                            ? new Date(
                                electionSettings.registrationDeadline
                              ).toLocaleString()
                            : "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Voting Period:</span>
                        <span className="font-mono text-xs">
                          {electionSettings.votingStartTime &&
                          electionSettings.votingEndTime
                            ? `${new Date(
                                electionSettings.votingStartTime
                              ).toLocaleDateString()} - ${new Date(
                                electionSettings.votingEndTime
                              ).toLocaleDateString()}`
                            : "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contract Address:</span>
                        <span className="font-mono text-xs">
                          {import.meta.env.VITE_CONTRACT_ADDRESS?.substring(
                            0,
                            10
                          ) || "Not set"}
                          ...
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Audit Trail
              </h3>
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
                    <p className="text-gray-500 text-center py-4">
                      No voters registered yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {auditData.voters.map((voter, index) => (
                        <div key={index} className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {voter.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                ID: #{voter.id}
                              </p>
                              <p className="text-xs text-gray-400 font-mono">
                                {voter.voterAddress}
                              </p>
                            </div>
                            <div className="text-right">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  voter.hasVoted
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {voter.hasVoted ? "Voted" : "Registered"}
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
                    <p className="text-gray-500 text-center py-4">
                      No votes cast yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {auditData.votes.map((vote, index) => (
                        <div key={index} className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                Voter #{vote.voterId}
                              </p>
                              <p className="text-sm text-gray-600">
                                Candidate ID: {vote.candidateId}
                              </p>
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
