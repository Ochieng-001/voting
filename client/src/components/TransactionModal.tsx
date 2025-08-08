import { Dialog, DialogContent } from '@/components/ui/dialog';

interface TransactionModalProps {
  open: boolean;
  txHash?: string;
  status?: string;
}

export function TransactionModal({ open, txHash, status = "Processing transaction..." }: TransactionModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Transaction</h3>
        <p className="text-gray-600 mb-4">{status}</p>
        {txHash && (
          <p className="text-xs text-gray-500 font-mono break-all">{txHash}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
