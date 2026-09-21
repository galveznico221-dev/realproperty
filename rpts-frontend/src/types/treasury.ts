export type PropertyKind = 'LA' | 'BL' | 'MC';
export type Taxability = 'TAXABLE' | 'EXEMPT';
export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID';
export type InstallmentPeriod = 'FULL_YEAR' | 'Q1_Q3' | 'Q2_Q4';

export interface PropertyAccount {
    id: number;
    pin: string;
    taxDeclarationNo: string;
    ownerName: string;
    address?: string;
    location?: string;
    area?: number;
    kind: PropertyKind;
    taxability: Taxability;
    generalRevision?: string;
    currentAssessedValue: number;
    entryDate?: string;
}

export interface TaxPaymentRequestDto {
    period: InstallmentPeriod;
    amountPaid: number;
    discountOrPenalty?: number;
    orBasic: string;
    orSef?: string;
    datePaid: string;
}
export interface LedgerBillSummaryDto {
    id: number;
    taxYear: number;
    assessedValue: number;
    basicTax: number;
    sefTax: number;
    baseTax: number;
    discountAmount: number;
    penaltyMonths: number;
    monthlyRate: number;
    penaltyRate: number;
    penaltyAmount: number;
    netDue: number;
    amountPaid: number;
    status: PaymentStatus;
}

export interface SpringPage<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface TaxPaymentResponseDto {
    id: number;
    period: InstallmentPeriod;
    amountPaid: number;
    discountOrPenalty: number;
    orBasic: string;
    orSef: string;
    datePaid: string;
}