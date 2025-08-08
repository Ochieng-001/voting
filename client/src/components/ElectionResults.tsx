import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useElectionResults, useElectionStats } from '@/hooks/use-contract';
import { BarChart3, TrendingUp } from 'lucide-react';

export function ElectionResults() {
  const { data: results = [], isLoading } = useElectionResults();
  const { data: stats } = useElectionStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            <span className="ml-2">Loading results...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <BarChart3 className="text-purple-600 w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Election Results</CardTitle>
              <p className="text-gray-600">Live results from the blockchain</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Votes</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalVotes || 0}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No votes have been cast yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((candidate, index) => (
              <div key={candidate.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={candidate.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&size=48&background=random`}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&size=48&background=random`;
                      }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                        {index === 0 && candidate.votes > 0 && (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{candidate.party}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{candidate.votes}</p>
                    <p className="text-sm text-gray-600">{candidate.percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      index === 0 ? 'bg-secondary' : 
                      index === 1 ? 'bg-primary' : 
                      'bg-accent'
                    }`}
                    style={{ width: `${candidate.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
