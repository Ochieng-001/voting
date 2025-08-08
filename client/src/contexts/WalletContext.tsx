import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { web3Service } from "@/lib/web3";
import { VoterRegistryContract } from "@/lib/contract";
import { ethers } from "ethers";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: VoterRegistryContract | null;
  networkName: string;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

// Use environment variable for contract address, fallback to a default for development
const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  "0x79D3d4e2c2a1313A16FE4dB9D35540338E1eE5E3";

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<VoterRegistryContract | null>(null);
  const [networkName, setNetworkName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        provider: newProvider,
        signer: newSigner,
        address: newAddress,
      } = await web3Service.connectWallet();

      setProvider(newProvider);
      setSigner(newSigner);
      setAddress(newAddress);
      setIsConnected(true);

      // Create contract instance
      const contractInstance = new VoterRegistryContract(
        CONTRACT_ADDRESS,
        newSigner
      );
      setContract(contractInstance);

      // Get network info
      const network = await newProvider.getNetwork();
      setNetworkName(
        network.name === "unknown"
          ? `Chain ID: ${network.chainId}`
          : network.name
      );
    } catch (err: any) {
      setError(err.message);
      console.error("Wallet connection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setNetworkName("");
    setError(null);
    web3Service.removeListeners();
  };

  useEffect(() => {
    // Set up event listeners for account and network changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== address) {
        setAddress(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      // Reload the page when network changes
      window.location.reload();
    };

    web3Service.onAccountsChanged(handleAccountsChanged);
    web3Service.onChainChanged(handleChainChanged);

    return () => {
      web3Service.removeListeners();
    };
  }, [address]);

  const value: WalletContextType = {
    isConnected,
    address,
    provider,
    signer,
    contract,
    networkName,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
