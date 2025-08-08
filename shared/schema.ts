import { z } from "zod";

// Voter schema based on the smart contract
export const voterSchema = z.object({
  id: z.number(),
  name: z.string(),
  voterAddress: z.string(),
  isRegistered: z.boolean(),
  hasVoted: z.boolean(),
});

export const insertVoterSchema = voterSchema.pick({
  id: true,
  name: true,
  voterAddress: true,
});

// Candidate schema based on the smart contract
export const candidateSchema = z.object({
  id: z.number(),
  name: z.string(),
  party: z.string(),
  photo: z.string(),
});

export const insertCandidateSchema = candidateSchema.pick({
  id: true,
  name: true,
  party: true,
  photo: true,
});

// Vote schema based on the smart contract
export const voteSchema = z.object({
  candidateId: z.number(),
  voterId: z.number(),
  isVoted: z.boolean(),
});

// UI specific schemas
export const voteReceiptSchema = z.object({
  voterId: z.number(),
  candidateName: z.string(),
  timestamp: z.string(),
  txHash: z.string(),
});

export const electionStatsSchema = z.object({
  totalVoters: z.number(),
  totalVotes: z.number(),
  totalCandidates: z.number(),
  timeRemaining: z.string(),
  registrationStatus: z.string(),
  votingStatus: z.string(),
});

export const candidateResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  party: z.string(),
  photo: z.string(),
  votes: z.number(),
  percentage: z.number(),
});

export type Voter = z.infer<typeof voterSchema>;
export type InsertVoter = z.infer<typeof insertVoterSchema>;
export type Candidate = z.infer<typeof candidateSchema>;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Vote = z.infer<typeof voteSchema>;
export type VoteReceipt = z.infer<typeof voteReceiptSchema>;
export type ElectionStats = z.infer<typeof electionStatsSchema>;
export type CandidateResult = z.infer<typeof candidateResultSchema>;
