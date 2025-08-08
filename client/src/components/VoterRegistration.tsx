import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertVoterSchema } from '@shared/schema';
import { useRegisterVoter, useVoterData } from '@/hooks/use-contract';
import { useWallet } from '@/hooks/use-wallet';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, CheckCircle } from 'lucide-react';
import { z } from 'zod';

const registrationFormSchema = insertVoterSchema.omit({ voterAddress: true });
type RegistrationFormData = z.infer<typeof registrationFormSchema>;

export function VoterRegistration() {
  const { isConnected, address } = useWallet();
  const { data: voterData } = useVoterData();
  const registerVoterMutation = useRegisterVoter();
  const { toast } = useToast();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      id: 0,
      name: '',
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your MetaMask wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await registerVoterMutation.mutateAsync(data);
      
      toast({
        title: "Registration Successful!",
        description: `You are now registered to vote. Transaction hash: ${result.txHash.substring(0, 10)}...`,
      });
      
      form.reset();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // If voter is already registered, show success message
  if (voterData?.isRegistered) {
    return (
      <Card className="bg-green-50 border border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <CheckCircle className="text-secondary mr-3 w-6 h-6" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Registration Successful!</h4>
              <p className="text-sm text-green-700 mt-1">
                You are registered as: <strong>{voterData.name}</strong> (ID: {voterData.id})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <UserPlus className="text-primary w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Voter Registration</CardTitle>
            <p className="text-gray-600">Register to participate in the election</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Enter your full name"
              className="w-full"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
              Voter ID
            </Label>
            <Input
              id="id"
              type="number"
              {...form.register('id', { valueAsNumber: true })}
              placeholder="Enter your voter ID"
              className="w-full"
            />
            {form.formState.errors.id && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.id.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={!isConnected || registerVoterMutation.isPending}
            className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {registerVoterMutation.isPending ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Registering...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Register to Vote</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
