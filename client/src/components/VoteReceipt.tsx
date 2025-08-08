import { Card, CardContent } from '@/components/ui/card';
import { useVoterData, useCandidates } from '@/hooks/use-contract';
import { CheckCircle } from 'lucide-react';

export function VoteReceipt() {
  const { data: voterData } = useVoterData();
  const { data: candidates = [] } = useCandidates();

  if (!voterData?.hasVoted) {
    return null;
  }

  // In a real implementation, you would store the vote receipt data
  // For now, we'll show a generic receipt since the contract doesn't store which candidate was voted for per voter
  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
      <CardContent className="p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="text-secondary w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Vote Successfully Cast!</h3>
        <p className="text-gray-600 mb-6">Your vote has been recorded on the blockchain</p>
        
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4">Vote Receipt</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Voter ID:</span>
              <span className="font-mono">#{voterData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Voter Name:</span>
              <span>{voterData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600 font-medium">Vote Recorded</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timestamp:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This receipt serves as proof of your participation in the election
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
