import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertCandidateSchema } from '@shared/schema';
import { useAddCandidate } from '@/hooks/use-contract';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

type AddCandidateFormData = z.infer<typeof insertCandidateSchema>;

interface AddCandidateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCandidateModal({ open, onOpenChange }: AddCandidateModalProps) {
  const addCandidateMutation = useAddCandidate();
  const { toast } = useToast();

  const form = useForm<AddCandidateFormData>({
    resolver: zodResolver(insertCandidateSchema),
    defaultValues: {
      id: 0,
      name: '',
      party: '',
      photo: '',
    },
  });

  const onSubmit = async (data: AddCandidateFormData) => {
    try {
      const result = await addCandidateMutation.mutateAsync(data);
      
      toast({
        title: "Candidate Added Successfully!",
        description: `${data.name} has been added to the election. Transaction: ${result.txHash.substring(0, 10)}...`,
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Failed to Add Candidate",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
              Candidate ID
            </Label>
            <Input
              id="id"
              type="number"
              {...form.register('id', { valueAsNumber: true })}
              placeholder="Enter candidate ID"
            />
            {form.formState.errors.id && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.id.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Enter candidate name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="party" className="block text-sm font-medium text-gray-700 mb-2">
              Political Party
            </Label>
            <Input
              id="party"
              {...form.register('party')}
              placeholder="Enter political party"
            />
            {form.formState.errors.party && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.party.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
              Photo URL (Optional)
            </Label>
            <Input
              id="photo"
              type="url"
              {...form.register('photo')}
              placeholder="Enter photo URL"
            />
            {form.formState.errors.photo && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.photo.message}</p>
            )}
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addCandidateMutation.isPending}
              className="flex-1 bg-accent hover:bg-orange-600 text-white"
            >
              {addCandidateMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Adding...
                </>
              ) : (
                'Add Candidate'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
