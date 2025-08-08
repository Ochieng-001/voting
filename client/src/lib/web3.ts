import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  async connectWallet(): Promise<{ provider: ethers.BrowserProvider; signer: ethers.JsonRpcSigner; address: string }> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      const address = await this.signer.getAddress();
      const network = await this.provider.getNetwork();
      
      return {
        provider: this.provider,
        signer: this.signer,
        address
      };
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('Please connect your MetaMask wallet to continue.');
      }
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  async getNetwork() {
    if (!this.provider) {
      throw new Error('No provider available');
    }
    return await this.provider.getNetwork();
  }

  async getBalance(address: string) {
    if (!this.provider) {
      throw new Error('No provider available');
    }
    return await this.provider.getBalance(address);
  }

  async switchToNetwork(chainId: string) {
    if (!window.ethereum) {
      throw new Error('MetaMask is not available');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error: any) {
      throw new Error(`Failed to switch network: ${error.message}`);
    }
  }

  onAccountsChanged(callback: (accounts: string[]) => void) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  onChainChanged(callback: (chainId: string) => void) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }

  removeListeners() {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  }
}

export const web3Service = new Web3Service();
