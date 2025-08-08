import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@/hooks/use-wallet';
import { type Candidate, type Voter, type CandidateResult } from '@shared/schema';

export function useVoterData() {
  const { contract, address } = useWallet();
  
  return useQuery({
    queryKey: ['voter', address],
    queryFn: async () => {
      if (!contract || !address) return null;
      return await contract.getVoter(address);
    },
    enabled: !!contract && !!address,
  });
}

export function useCandidates() {
  const { contract } = useWallet();
  
  return useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      if (!contract) return [];
      return await contract.getAllCandidates();
    },
    enabled: !!contract,
  });
}

export function useElectionStats() {
  const { contract } = useWallet();
  
  return useQuery({
    queryKey: ['election-stats'],
    queryFn: async () => {
      if (!contract) return { totalVoters: 0, totalVotes: 0, totalCandidates: 0 };
      
      const [totalVoters, totalVotes, candidates] = await Promise.all([
        contract.getTotalVoters(),
        contract.getTotalVotes(),
        contract.getAllCandidates(),
      ]);
      
      return {
        totalVoters,
        totalVotes,
        totalCandidates: candidates.length,
      };
    },
    enabled: !!contract,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useElectionResults() {
  const { contract } = useWallet();
  
  return useQuery({
    queryKey: ['election-results'],
    queryFn: async (): Promise<CandidateResult[]> => {
      if (!contract) return [];
      
      const candidates = await contract.getAllCandidates();
      const totalVotes = await contract.getTotalVotes();
      
      const results = await Promise.all(
        candidates.map(async (candidate) => {
          const votes = await contract.getVoteCount(candidate.id);
          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
          
          return {
            ...candidate,
            votes,
            percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
          };
        })
      );
      
      // Sort by vote count (highest first)
      return results.sort((a, b) => b.votes - a.votes);
    },
    enabled: !!contract,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useAuditData() {
  const { contract } = useWallet();
  
  return useQuery({
    queryKey: ['audit-data'],
    queryFn: async () => {
      if (!contract) return { voters: [], votes: [] };
      return await contract.getAudits();
    },
    enabled: !!contract,
  });
}

export function useRegisterVoter() {
  const { contract, address } = useWallet();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      if (!contract || !address) throw new Error('Wallet not connected');
      return await contract.registerVoter(id, name, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voter'] });
      queryClient.invalidateQueries({ queryKey: ['election-stats'] });
      queryClient.invalidateQueries({ queryKey: ['audit-data'] });
    },
  });
}

export function useAddCandidate() {
  const { contract } = useWallet();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, name, party, photo }: { id: number; name: string; party: string; photo: string }) => {
      if (!contract) throw new Error('Wallet not connected');
      return await contract.addCandidate(id, name, party, photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['election-stats'] });
      queryClient.invalidateQueries({ queryKey: ['election-results'] });
    },
  });
}

export function useCastVote() {
  const { contract, address } = useWallet();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ candidateId }: { candidateId: number }) => {
      if (!contract || !address) throw new Error('Wallet not connected');
      return await contract.castVote(candidateId, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voter'] });
      queryClient.invalidateQueries({ queryKey: ['election-stats'] });
      queryClient.invalidateQueries({ queryKey: ['election-results'] });
      queryClient.invalidateQueries({ queryKey: ['audit-data'] });
    },
  });
}
