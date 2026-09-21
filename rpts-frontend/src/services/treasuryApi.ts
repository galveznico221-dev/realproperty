import axios from 'axios';
import type {
    PropertyAccount,
    LedgerBillSummaryDto,
    TaxPaymentRequestDto,
    TaxPaymentResponseDto,
    SpringPage
} from '../types/treasury';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'api/v1';
const TREASURY_API = `${API_BASE_URL}/treasury`;

export const treasuryApi = {
    /**
     * 
     * @param ownerName 
     * @param page 
     * @param size 
     * @returns response.data
     * galing sa controller hee hee
     * apipage<T> pasa natin property account 
     * get<<>> (path), params
     */
    searchProperties: async (
        ownerName: string,
        page = 0,
        size = 10
    ): Promise<SpringPage<PropertyAccount>> => {
        const response = await axios.get<SpringPage<PropertyAccount>>(
            `${TREASURY_API}/properties`,
            {
                params: {
                    ownerName, page, size
                },

            }
        );
        return response.data;
    },
    getLedgers: async (
        accountId: number,
        page = 0,
        size = 10
    ): Promise<SpringPage<LedgerBillSummaryDto>> => {
        const response = await axios.get<SpringPage<LedgerBillSummaryDto>>(
            `${TREASURY_API}/properties/${accountId}/ledgers`, {
            params: {
                page, size, sort: 'taxYear,desc'
            }
        },
        );
        return response.data;
    },

    postPayment: async (
        ledgerId: number,
        payment: TaxPaymentRequestDto,
        isAmnesty = false
    ): Promise<void> => {
        await axios.post(
            `${TREASURY_API}/ledgers/${ledgerId}/payments`,
            payment,
            {
                params:
                    { isAmnesty },
            }
        );
    },
    //lagi nalilimutan after ng promise ung => {}
    getReceipts: async (
        ledgerId: number,
        page = 0,
        size = 10,
    ): Promise<SpringPage<TaxPaymentResponseDto>> => {
        const response = await axios.get<SpringPage<TaxPaymentResponseDto>>(
            `${TREASURY_API}/ledgers/${ledgerId}/payments`,
            { params: { page, size } }
        );
        return response.data
    }
}