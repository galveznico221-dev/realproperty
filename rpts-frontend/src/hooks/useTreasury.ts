import { useMutation, useQueryClient } from '@tanstack/react-query';
import { treasuryApi } from '../services/treasuryApi';
import type {
    TaxPaymentRequestDto
} from '../types/treasury';
export const usePostPayments = (propertyAccountId: number | null) => {
    //usequery client it gives access to global query cache
    const queryClient = useQueryClient();
    //useMutation({}:{})
    return useMutation({
        mutationFn: ({
            ledgerId,
            payment,
            isAmnesty,
        }: {
            ledgerId: number;
            payment: TaxPaymentRequestDto;
            isAmnesty: boolean;
        }) => treasuryApi.postPayment(ledgerId, payment, isAmnesty),

        onSuccess: () => {
            // for automatic refresh
            queryClient.invalidateQueries({
                queryKey: ['ledgers', propertyAccountId],
            });
        },
    });
};