import { ethers } from 'ethers';
import { type Voter, type Candidate, type Vote } from '@shared/schema';

// Smart contract ABI - based on the provided contract
const VOTER_REGISTRY_ABI = [
  // Events
  "event CandidateAdded(uint id, string name, string party, string photo)",
  "event VoterRegistered(address indexed voterAddress, uint id, string name)",
  "event VoteCast(address indexed voterAddress, uint candidateId)",
  
  // Functions
  "function addCandidate(uint _id, string memory _name, string memory _party, string memory _photo) public",
  "function registerVoter(uint _id, string memory _name, address _voterAddress) public returns (tuple(uint id, string name, address voterAddress, bool isRegistered, bool hasVoted))",
  "function castVote(uint _candidateId, address _voterAddress) public returns (tuple(uint candidateId, uint voterId, bool isVoted))",
  "function getVoteCount(uint _candidateId) public view returns (uint)",
  "function getRegisteredVotersCount() public view returns (uint)",
  "function getCastVotesCount() public view returns (uint)",
  "function getAudits() public view returns (tuple(uint id, string name, address voterAddress, bool isRegistered, bool hasVoted)[] memory, tuple(uint candidateId, uint voterId, bool isVoted)[] memory)",
  
  // Public mappings and arrays
  "function voters(address) public view returns (uint id, string name, address voterAddress, bool isRegistered, bool hasVoted)",
  "function votes(address) public view returns (uint candidateId, uint voterId, bool isVoted)",
  "function voteCounts(uint) public view returns (uint)",
  "function registeredVoters(uint) public view returns (uint id, string name, address voterAddress, bool isRegistered, bool hasVoted)",
  "function castVotes(uint) public view returns (uint candidateId, uint voterId, bool isVoted)",
  "function candidates(uint) public view returns (uint id, string name, string party, string photo)"
];

export class VoterRegistryContract {
  private contract: ethers.Contract;
  private contractAddress: string;

  constructor(contractAddress: string, signerOrProvider: ethers.JsonRpcSigner | ethers.Provider) {
    this.contractAddress = contractAddress;
    this.contract = new ethers.Contract(contractAddress, VOTER_REGISTRY_ABI, signerOrProvider);
  }

  // Voter Registration
  async registerVoter(id: number, name: string, voterAddress: string): Promise<{ voter: Voter; txHash: string }> {
    try {
      const tx = await this.contract.registerVoter(id, name, voterAddress);
      const receipt = await tx.wait();
      
      // Get the registered voter data
      const voterData = await this.contract.voters(voterAddress);
      
      const voter: Voter = {
        id: Number(voterData.id),
        name: voterData.name,
        voterAddress: voterData.voterAddress,
        isRegistered: voterData.isRegistered,
        hasVoted: voterData.hasVoted
      };

      return {
        voter,
        txHash: receipt.hash
      };
    } catch (error: any) {
      if (error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Add Candidate (Admin only)
  async addCandidate(id: number, name: string, party: string, photo: string): Promise<{ txHash: string }> {
    try {
      const tx = await this.contract.addCandidate(id, name, party, photo);
      const receipt = await tx.wait();
      
      return {
        txHash: receipt.hash
      };
    } catch (error: any) {
      if (error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Failed to add candidate: ${error.message}`);
    }
  }

  // Cast Vote
  async castVote(candidateId: number, voterAddress: string): Promise<{ vote: Vote; txHash: string }> {
    try {
      const tx = await this.contract.castVote(candidateId, voterAddress);
      const receipt = await tx.wait();
      
      // Get the vote data
      const voteData = await this.contract.votes(voterAddress);
      
      const vote: Vote = {
        candidateId: Number(voteData.candidateId),
        voterId: Number(voteData.voterId),
        isVoted: voteData.isVoted
      };

      return {
        vote,
        txHash: receipt.hash
      };
    } catch (error: any) {
      if (error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Voting failed: ${error.message}`);
    }
  }

  // Get voter info
  async getVoter(address: string): Promise<Voter | null> {
    try {
      const voterData = await this.contract.voters(address);
      
      if (!voterData.isRegistered) {
        return null;
      }

      return {
        id: Number(voterData.id),
        name: voterData.name,
        voterAddress: voterData.voterAddress,
        isRegistered: voterData.isRegistered,
        hasVoted: voterData.hasVoted
      };
    } catch (error) {
      console.error('Error fetching voter:', error);
      return null;
    }
  }

  // Get candidate by index
  async getCandidate(index: number): Promise<Candidate | null> {
    try {
      const candidateData = await this.contract.candidates(index);
      
      if (!candidateData.name) {
        return null;
      }

      return {
        id: Number(candidateData.id),
        name: candidateData.name,
        party: candidateData.party,
        photo: candidateData.photo
      };
    } catch (error) {
      return null;
    }
  }

  // Get all candidates
  async getAllCandidates(): Promise<Candidate[]> {
    const candidates: Candidate[] = [];
    let index = 0;
    
    while (true) {
      const candidate = await this.getCandidate(index);
      if (!candidate) break;
      candidates.push(candidate);
      index++;
    }
    
    return candidates;
  }

  // Get vote count for candidate
  async getVoteCount(candidateId: number): Promise<number> {
    try {
      const count = await this.contract.getVoteCount(candidateId);
      return Number(count);
    } catch (error) {
      console.error('Error fetching vote count:', error);
      return 0;
    }
  }

  // Get total registered voters
  async getTotalVoters(): Promise<number> {
    try {
      const count = await this.contract.getRegisteredVotersCount();
      return Number(count);
    } catch (error) {
      console.error('Error fetching total voters:', error);
      return 0;
    }
  }

  // Get total cast votes
  async getTotalVotes(): Promise<number> {
    try {
      const count = await this.contract.getCastVotesCount();
      return Number(count);
    } catch (error) {
      console.error('Error fetching total votes:', error);
      return 0;
    }
  }

  // Get audit data
  async getAudits(): Promise<{ voters: Voter[]; votes: Vote[] }> {
    try {
      const [votersData, votesData] = await this.contract.getAudits();
      
      const voters: Voter[] = votersData.map((voter: any) => ({
        id: Number(voter.id),
        name: voter.name,
        voterAddress: voter.voterAddress,
        isRegistered: voter.isRegistered,
        hasVoted: voter.hasVoted
      }));

      const votes: Vote[] = votesData.map((vote: any) => ({
        candidateId: Number(vote.candidateId),
        voterId: Number(vote.voterId),
        isVoted: vote.isVoted
      }));

      return { voters, votes };
    } catch (error) {
      console.error('Error fetching audit data:', error);
      return { voters: [], votes: [] };
    }
  }

  // Get contract address
  getAddress(): string {
    return this.contractAddress;
  }
}
