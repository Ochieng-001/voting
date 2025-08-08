import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCandidates, useVoterData, useCastVote } from "@/hooks/use-contract";
import { useElectionSettings } from "@/hooks/use-election-settings";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { Vote, Clock, AlertCircle } from "lucide-react";

export function VotingInterface() {
  const { isConnected } = useWallet();
  const { data: candidates = [], isLoading: candidatesLoading } =
    useCandidates();
  const { data: voterData } = useVoterData();
  const castVoteMutation = useCastVote();
  const { settings: electionSettings } = useElectionSettings();
  const { toast } = useToast();

  const handleVote = async (candidateId: number, candidateName: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your MetaMask wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!voterData?.isRegistered) {
      toast({
        title: "Not Registered",
        description: "You must register to vote before casting your ballot.",
        variant: "destructive",
      });
      return;
    }

    if (voterData.hasVoted) {
      toast({
        title: "Already Voted",
        description: "You have already cast your vote in this election.",
        variant: "destructive",
      });
      return;
    }

    if (!electionSettings.isVotingOpen) {
      toast({
        title: "Voting Closed",
        description: "The voting period is not currently active.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await castVoteMutation.mutateAsync({ candidateId });

      toast({
        title: "Vote Cast Successfully!",
        description: `Your vote for ${candidateName} has been recorded. Transaction: ${result.txHash.substring(
          0,
          10
        )}...`,
      });
    } catch (error: any) {
      toast({
        title: "Voting Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (candidatesLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            <span className="ml-2">Loading candidates...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (candidates.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">No candidates available for voting.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const canVote =
    voterData?.isRegistered &&
    !voterData?.hasVoted &&
    electionSettings.isVotingOpen;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <Vote className="text-secondary w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Cast Your Vote
              </CardTitle>
              <p className="text-gray-600">Choose your preferred candidate</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Voting Status</p>
            <p className="font-semibold text-green-600">Active</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!canVote && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              {!electionSettings.isVotingOpen ? (
                <AlertCircle className="text-red-600 mr-2 w-5 h-5" />
              ) : (
                <Clock className="text-yellow-600 mr-2 w-5 h-5" />
              )}
              <p
                className={
                  !electionSettings.isVotingOpen
                    ? "text-red-800"
                    : "text-yellow-800"
                }
              >
                {!electionSettings.isVotingOpen
                  ? "Voting is currently closed. Check the election timeline for voting hours."
                  : !voterData?.isRegistered
                  ? "You must register to vote before casting your ballot."
                  : "You have already voted in this election."}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className="border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <img
                    src={
                      candidate.photo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        candidate.name
                      )}&size=96&background=random`
                    }
                    alt={candidate.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
                    onError={(e) => {
                      (
                        e.target as HTMLImageElement
                      ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        candidate.name
                      )}&size=96&background=random`;
                    }}
                  />
                  <h4 className="text-lg font-semibold text-gray-900">
                    {candidate.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {candidate.party}
                  </p>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() => handleVote(candidate.id, candidate.name)}
                    disabled={!canVote || castVoteMutation.isPending}
                    className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {castVoteMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Voting...
                      </>
                    ) : (
                      `Vote for ${candidate.name}`
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
