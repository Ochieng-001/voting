import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWallet } from '@/hooks/use-wallet';
import { AlertCircle, Wallet, X } from 'lucide-react';

export function WalletConnection() {
  const { isConnected, address, networkName, isLoading, error, connectWallet, disconnectWallet } = useWallet();

  if (isLoading) {
    return (
      <Button disabled className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2">
        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
        <span>Connecting...</span>
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <div>
        <Button 
          onClick={connectWallet}
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
        >
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </Button>
        
        {error && (
          <Card className="mt-4 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Button className="bg-secondary hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2">
        <Wallet className="w-4 h-4" />
        <span>Connected</span>
      </Button>
    </div>
  );
}

export function WalletBanner() {
  const { isConnected, address, networkName, disconnectWallet } = useWallet();

  if (!isConnected) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-primary p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <Wallet className="text-primary mr-3 w-5 h-5" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Connected to <span className="text-primary font-semibold">{networkName}</span>
            </p>
            <p className="text-sm text-gray-600">
              Account: <span className="font-mono">{address}</span>
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectWallet}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
