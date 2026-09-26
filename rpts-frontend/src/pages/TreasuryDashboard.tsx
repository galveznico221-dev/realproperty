import React, { useState, useEffect, useMemo } from 'react';
import type { PropertyAccount, LedgerBillSummaryDto, InstallmentPeriod } from '../types/treasury';
import { usePropertyLedgers } from '../hooks/usePropertyLedgers';
import { usePostPayments } from '../hooks/useTreasury';
import { treasuryApi } from '../services/treasuryApi';
import axios from 'axios';

interface TreasuryDashboardProps {
    initialPin?: string;
}

const Icons = {
    Check: () => (
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    ),
    Close: () => (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
};

export const TreasuryDashboard: React.FC<TreasuryDashboardProps> = ({ initialPin = '002-0021' }) => {
    // -------------------------------------------------------------
    // 1. Form & Selection State
    // -------------------------------------------------------------
    const [propertiesList, setPropertiesList] = useState<PropertyAccount[]>([]);
    const [selectedPropertyPin, setSelectedPropertyPin] = useState<string>(initialPin);
    const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [remarks, setRemarks] = useState<string>('');

    // Selected ledger for payment execution modal
    const [targetLedgerForPayment, setTargetLedgerForPayment] = useState<{
        id: number;
        taxYear: number;
        totalTaxDue: number;
        basicTax: number;
        sefTax: number;
        discountAmount: number;
        penaltyAmount: number;
    } | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<InstallmentPeriod>('FULL_YEAR');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [orBasicInput, setOrBasicInput] = useState<string>('2026-0005');
    const [orSefInput, setOrSefInput] = useState<string>('2026-0006');
    const [receiptData, setReceiptData] = useState<{
        orNo: string;
        taxpayer: string;
        pin: string;
        taxYear: number;
        basicTax: number;
        sefTax: number;
        discount: number;
        penalty: number;
        total: number;
    } | null>(null);

    // Toast State
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isToastError, setIsToastError] = useState<boolean>(false);
    // Inside TreasuryDashboard.tsx, derive the active modal amount:
    const activeModalDue = useMemo(() => {
        if (!targetLedgerForPayment) return 0;

        // 1. If FULL_YEAR, use the ledger row's full-year total
        if (selectedPeriod === 'FULL_YEAR') {
            return targetLedgerForPayment.totalTaxDue;
        }

        // 2. Each quarter is 25% of annual base tax
        const quarterBase = (targetLedgerForPayment.basicTax + targetLedgerForPayment.sefTax) * 0.25;

        const [yearStr, monthStr] = paymentDate.split('-');
        const payYear = Number(yearStr);
        const payMonth = Number(monthStr);
        const taxYear = targetLedgerForPayment.taxYear;

        let discount = 0;

        const quarterCutoff =
            selectedPeriod === 'Q1' ? 3 :
                selectedPeriod === 'Q2' ? 6 :
                    selectedPeriod === 'Q3' ? 9 : 12;

        if (payYear < taxYear) {
            // Advance discount (December only)
            if (payMonth === 12) {
                discount = quarterBase * 0.20;
            }
        } else if (payYear === taxYear && payMonth <= quarterCutoff) {
            // Current year on time: only Q1 paid on or before March earns 10% prompt discount
            if (selectedPeriod === 'Q1' && payMonth <= 3) {
                discount = quarterBase * 0.10;
            }
        }

        // 3. Unified statutory penalty months: includes elapsed years!
        const penaltyMonths = Math.max(0, ((payYear - taxYear) * 12) + payMonth - quarterCutoff);
        const penaltyRate = Math.min(penaltyMonths * 0.02, 0.72);
        const penalty = quarterBase * penaltyRate;

        return Number((quarterBase - discount + penalty).toFixed(2));
    }, [targetLedgerForPayment, selectedPeriod, paymentDate]);

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                setToastMessage(null);
                setIsToastError(false);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const showToast = (msg: string, isErr = false) => {
        setToastMessage(msg);
        setIsToastError(isErr);
    };

    useEffect(() => {
        if (initialPin) {
            setSelectedPropertyPin(initialPin);
        }
    }, [initialPin]);

    // -------------------------------------------------------------
    // 2. Load Properties
    // -------------------------------------------------------------
    useEffect(() => {
        treasuryApi.searchProperties('', 0, 50).then((res) => {
            if (res.content && res.content.length > 0) {
                setPropertiesList(res.content);

                if (!initialPin) {
                    setSelectedPropertyPin(res.content[0].pin);
                }
            } else {
                const seedProperties: PropertyAccount[] = [
                    {
                        id: 1,
                        pin: '002-0021',
                        taxDeclarationNo: 'TD-2025-00101',
                        ownerName: 'DELA CRUZ, MARIA L.',
                        location: 'Brgy. San Isidro (Lot 7, Blk 2)',
                        kind: 'LA',
                        taxability: 'TAXABLE',
                        currentAssessedValue: 240000.0,
                    },
                    {
                        id: 2,
                        pin: '002-040',
                        taxDeclarationNo: 'TD-2026-00451',
                        ownerName: 'TIMONER Y RAMOS, LOURDES C.',
                        location: 'Brgy. Binanuaan (Lot 14, Cad-291-D)',
                        kind: 'LA',
                        taxability: 'TAXABLE',
                        currentAssessedValue: 192000.0,
                    },
                ];
                setPropertiesList(seedProperties);
                if (!initialPin) {
                    setSelectedPropertyPin('002-0021');
                }
            }
        });
    }, [initialPin]);

    const currentProperty =
        propertiesList.find((p) => p.pin === selectedPropertyPin) || propertiesList[0];

    // -------------------------------------------------------------
    // 3. Backend Queries & Real-Time Sync
    // -------------------------------------------------------------
    const { data: ledgerData } = usePropertyLedgers(currentProperty?.id ?? null, 0);
    const postPaymentMutation = usePostPayments(currentProperty?.id ?? null);

    // -------------------------------------------------------------
    // 4. Live Multi-Year Statutory Calculations Table
    // -------------------------------------------------------------
    const assessedValFallback = currentProperty?.currentAssessedValue ?? 240000.0;

    // If backend ledgers exist, use them; otherwise, seed sample display years
    const rawLedgers: (LedgerBillSummaryDto | { id: number; taxYear: number; assessedValue: number; baseTax: number; status: 'UNPAID' | 'PARTIAL' | 'PAID' })[] = useMemo(() => {
        if (ledgerData?.content && ledgerData.content.length > 0) {
            // Check if the upcoming advance year (e.g. 2027) already exists in the backend
            const currentYear = new Date().getFullYear();
            const advanceYear = currentYear + 1;
            const hasAdvanceYear = ledgerData.content.some((l) => l.taxYear === advanceYear);

            if (!hasAdvanceYear) {
                // Prepend advance year so staff can process advance payments
                return [
                    {
                        id: 0, // Pending backend persistence or virtual ledger ID
                        taxYear: advanceYear,
                        assessedValue: assessedValFallback,
                        baseTax: assessedValFallback * 0.02,
                        status: 'UNPAID' as const,
                    },
                    ...ledgerData.content,
                ];
            }
            return ledgerData.content;
        }

        // Fallback seed when backend ledgers are empty
        return [
            { id: 100, taxYear: 2027, assessedValue: assessedValFallback, baseTax: assessedValFallback * 0.02, status: 'UNPAID' },
            { id: 101, taxYear: 2026, assessedValue: assessedValFallback, baseTax: assessedValFallback * 0.02, status: 'UNPAID' },
            { id: 102, taxYear: 2025, assessedValue: assessedValFallback, baseTax: assessedValFallback * 0.02, status: 'PAID' },
            { id: 103, taxYear: 2024, assessedValue: assessedValFallback, baseTax: assessedValFallback * 0.02, status: 'PAID' },
        ];
    }, [ledgerData, assessedValFallback]);
    const computedLedgers = useMemo(() => {
        const [yearStr, monthStr] = paymentDate.split('-');
        const payYear = Number(yearStr);
        const payMonth = Number(monthStr);

        return rawLedgers.map((ledger) => {
            const isSettled = ledger.status === 'PAID';
            const baseTax = ledger.baseTax || (ledger.assessedValue * 0.02);
            const basicDue = baseTax / 2;
            const sefDue = baseTax / 2;

            const isAdvanceYear = ledger.taxYear > payYear;
            const isAdvanceLocked = isAdvanceYear && payMonth !== 12;


            const unpaidOlderYears = rawLedgers
                .filter((l) => l.taxYear < ledger.taxYear && l.status !== 'PAID'
                ).map((l) => l.taxYear);

            const isBlockedByPriorDelinquency = unpaidOlderYears.length > 0;


            if (isSettled) {
                return {
                    ...ledger,
                    basicDue: 0,
                    sefDue: 0,
                    penaltyMonths: 0,
                    penaltyRate: 0,
                    penaltyAmount: 0,
                    discountAmount: 0,
                    totalTaxDue: 0,
                    isSettled: true,
                    isBlockedByPriorDelinquency: false,
                };
            }

            let penaltyMonths = 0;
            let discountAmount = 0;
            let penaltyRate = 0;

            if (payYear < ledger.taxYear) {
                if (payMonth === 12) {
                    discountAmount = baseTax * 0.20;
                }
            } else if (payYear === ledger.taxYear) {
                if (payMonth <= 3) {
                    discountAmount = baseTax * 0.10;
                } else {
                    penaltyMonths = payMonth;
                    penaltyRate = penaltyMonths * 0.02;
                }
            } else {
                const yearsElapsed = payYear - ledger.taxYear;
                penaltyMonths = (yearsElapsed * 12) + payMonth;
                const calculatedRate = penaltyMonths * 0.02;
                penaltyRate = calculatedRate > 0.72 ? 0.72 : calculatedRate;
            }

            const penaltyAmount = baseTax * penaltyRate;
            const totalTaxDue = baseTax - discountAmount + penaltyAmount;

            return {
                ...ledger,
                basicDue,
                sefDue,
                penaltyMonths,
                penaltyRate,
                penaltyAmount,
                discountAmount,
                totalTaxDue,
                isSettled: false,
                isAdvanceLocked,
                isBlockedByPriorDelinquency,
                priorDelinquentYears: unpaidOlderYears,
            };
        });
    }, [rawLedgers, paymentDate]);

    // Overall totals across all years
    const cumulativeSummary = useMemo(() => {
        return computedLedgers.reduce(
            (acc, item) => {
                acc.totalDue += item.totalTaxDue;
                acc.totalPenalty += item.penaltyAmount;
                acc.totalDiscount += item.discountAmount;
                acc.totalBasic += item.basicDue;
                acc.totalSef += item.sefDue;
                return acc;
            },
            { totalDue: 0, totalPenalty: 0, totalDiscount: 0, totalBasic: 0, totalSef: 0 }
        );
    }, [computedLedgers]);

    // Trigger payment modal for specific year
    const handleOpenPaymentModal = (item: typeof computedLedgers[0]) => {
        const cleanPin = currentProperty.pin.trim().replace(/[\s/]+/g, '-');
        setOrBasicInput(`${item.taxYear}-${cleanPin}-B`);
        setOrSefInput(`${item.taxYear}-${cleanPin}-S`);

        setTargetLedgerForPayment({
            id: item.id,
            taxYear: item.taxYear,
            totalTaxDue: item.totalTaxDue,
            basicTax: item.basicDue,
            sefTax: item.sefDue,
            discountAmount: item.discountAmount,
            penaltyAmount: item.penaltyAmount,
        });

        // If partial, set to next payable quarter; otherwise default to FULL_YEAR
        if (item.status === 'PARTIAL' && item.nextPayablePeriod) {
            setSelectedPeriod(item.nextPayablePeriod);
        } else {
            setSelectedPeriod('FULL_YEAR');
        }

        setIsConfirmModalOpen(true);
    };
    // -------------------------------------------------------------
    // 5. Submit Payment Handler
    // -------------------------------------------------------------
    const handleProcessPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProperty || !targetLedgerForPayment) return;

        try {
            await postPaymentMutation.mutateAsync({
                ledgerId: targetLedgerForPayment.id,
                payment: {
                    period: selectedPeriod,
                    orBasic: orBasicInput.trim(),
                    orSef: orSefInput.trim() || undefined,
                    datePaid: paymentDate,
                    amountPaid: activeModalDue,
                },
                isAmnesty: false,
            });

            setIsConfirmModalOpen(false);
            setReceiptData({
                orNo: orBasicInput,
                taxpayer: currentProperty.ownerName,
                pin: currentProperty.pin,
                taxYear: targetLedgerForPayment.taxYear,
                basicTax: targetLedgerForPayment.basicTax,
                sefTax: targetLedgerForPayment.sefTax,
                discount: targetLedgerForPayment.discountAmount,
                penalty: targetLedgerForPayment.penaltyAmount,
                total: targetLedgerForPayment.totalTaxDue,
            });
            showToast(`Payment recorded for TY ${targetLedgerForPayment.taxYear}. OR No. ${orBasicInput}`);
        } catch (err: unknown) {
            setIsConfirmModalOpen(false);
            let errorMsg = 'Transaction rejected by server.';
            if (axios.isAxiosError(err)) {
                if (err.response?.data?.message) {
                    errorMsg = err.response.data.message;
                } else if (typeof err.response?.data === 'string') {
                    errorMsg = err.response.data;
                } else if (err.response?.status === 500) {
                    errorMsg = 'Official Receipt already issued or ledger already paid.';
                }
            }
            showToast(errorMsg, true);
        }
    };

    const peso = (n: number) =>
        '₱ ' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="content">
            {/* 1. TOP SELECTION BAR */}
            <div className="print-only" style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ margin: 0, fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Republic of the Philippines
                </p>
                <p style={{ margin: 0, fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Province of Camarines Norte
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                    Municipality of Talisay
                </p>
                <h2 style={{ margin: '6px 0 2px', fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Office of the Municipal Treasurer
                </h2>
                <div style={{ margin: '8px auto', width: '80px', height: '2px', background: '#000' }} />
                <h3 style={{ margin: '8px 0 0', fontSize: '14px', fontWeight: 700, letterSpacing: '1px' }}>
                    REAL PROPERTY TAX STATEMENT OF ACCOUNT
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#475569' }}>
                    As of calculation date: {paymentDate}
                </p>
            </div>
            <div className="card">
                <div className="card__head">
                    <h3>Statement of Account — Account Ledger</h3>
                    <span className="step-pill">Unified Multi-Year Assessment</span>
                </div>

                <div className="filters">
                    <div className="field">
                        <label htmlFor="txPin">Select Property Record (PIN — Owner)</label>
                        <select
                            id="txPin"
                            className="input"
                            value={selectedPropertyPin}
                            onChange={(e) => setSelectedPropertyPin(e.target.value)}
                        >
                            {propertiesList.map((p) => (
                                <option key={p.pin} value={p.pin}>
                                    {p.pin} — {p.ownerName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field" style={{ minWidth: '180px' }}>
                        <label htmlFor="txDate">Calculation Date</label>
                        <input
                            id="txDate"
                            className="input"
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                        />
                    </div>

                    <div className="field" style={{ minWidth: '240px' }}>
                        <label htmlFor="txRemarks">Notes / Audit Remarks</label>
                        <input
                            id="txRemarks"
                            className="input"
                            type="text"
                            placeholder="e.g. Over-the-counter inquiry..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>
                </div>

                {/* Property Metadata Strip */}
                <div className="prop-mini" style={{ marginTop: '12px', marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                            <b>{currentProperty?.ownerName}</b>
                            <div className="mono muted">
                                PIN: {currentProperty?.pin} | TD: {currentProperty?.taxDeclarationNo} | Location: {currentProperty?.location || 'Talisay, Cam. Norte'}
                            </div>
                        </div>
                        <div className="ta-r">
                            <span className="muted small">Assessed Value Base</span>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--navy)' }}>
                                {peso(currentProperty?.currentAssessedValue ?? 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ONE WHOLE LEDGER STATEMENT TABLE */}
            {/* 2. CLEAN MULTI-YEAR STATEMENT TABLE */}
            <div className="card">
                <div className="card__head" style={{ marginBottom: '14px' }}>
                    <div>
                        <h3>Annual Tax Liability Schedule</h3>
                        <p className="muted small">
                            Statutory assessment breakdown computed as of {paymentDate}
                        </p>
                    </div>
                </div>
                {/* ----------------- OFFICIAL PRINT SIGNATORIES ----------------- */}
                <div className="print-only" style={{ marginTop: '40px', pageBreakInside: 'avoid' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', textAlign: 'center' }}>
                        {/* Left Signatory: Prepared By */}
                        <div>
                            <p style={{ fontSize: '11.5px', margin: 0, textAlign: 'left', color: '#475569' }}>
                                Prepared and Computed by:
                            </p>
                            <div style={{ marginTop: '44px', borderBottom: '1px solid #000', width: '80%', marginInline: 'auto' }} />
                            <b style={{ display: 'block', fontSize: '12px', marginTop: '6px', textTransform: 'uppercase' }}>
                                Liquidating Officer / Deputy Assessor
                            </b>
                            <span style={{ fontSize: '11px', color: '#475569' }}>RPT Division — Staff</span>
                        </div>

                        {/* Right Signatory: Municipal Treasurer */}
                        <div>
                            <p style={{ fontSize: '11.5px', margin: 0, textAlign: 'left', color: '#475569' }}>
                                Certified Correct:
                            </p>
                            <div style={{ marginTop: '44px', borderBottom: '1px solid #000', width: '80%', marginInline: 'auto' }} />
                            <b style={{ display: 'block', fontSize: '12px', marginTop: '6px', textTransform: 'uppercase' }}>
                                Municipal Treasurer
                            </b>
                            <span style={{ fontSize: '11px', color: '#475569' }}>Office of the Municipal Treasurer</span>
                        </div>
                    </div>

                    {/* Official Statutory Disclaimer */}
                    <p style={{ marginTop: '28px', fontSize: '9.5px', color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>
                        Notice: This Statement of Account is an estimate based on statutory records pursuant to RA 7160 (Local Government Code of 1991).
                        Final payment amounts are subject to change based on actual settlement dates and counter audit verification.
                    </p>
                </div>

                <div className="table-wrap">
                    <table className="table" style={{ width: '100%', minWidth: '780px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid var(--line-2)' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tax Year</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Assessed Value</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Base Tax (2%)</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Discount</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Penalty</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Net Due</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {computedLedgers.map((row) => (
                                <tr
                                    key={row.taxYear}
                                    style={{
                                        borderBottom: '1px solid #edf2f7',
                                        background: row.isSettled ? '#fcfdfd' : '#fff',
                                    }}
                                >
                                    <td style={{ padding: '14px 16px' }}>
                                        <b className="mono" style={{ fontSize: '14px', color: 'var(--navy)' }}>
                                            {row.taxYear}
                                        </b>
                                    </td>
                                    <td className="ta-r" style={{ padding: '14px 16px' }}>
                                        {peso(row.assessedValue)}
                                    </td>
                                    <td className="ta-r" style={{ padding: '14px 16px' }}>
                                        {peso(row.isSettled ? 0 : row.basicDue + row.sefDue)}
                                    </td>
                                    <td
                                        className="ta-r"
                                        style={{
                                            padding: '14px 16px',
                                            color: row.discountAmount > 0 ? 'var(--green)' : 'inherit',
                                        }}
                                    >
                                        {row.discountAmount > 0 ? `− ${peso(row.discountAmount)}` : '₱ 0.00'}
                                    </td>
                                    <td
                                        className="ta-r"
                                        style={{
                                            padding: '14px 16px',
                                            color: row.penaltyAmount > 0 ? 'var(--red)' : 'inherit',
                                        }}
                                    >
                                        {row.penaltyAmount > 0 ? (
                                            <div>
                                                <b>+ {peso(row.penaltyAmount)}</b>
                                                <span className="muted small block" style={{ fontSize: '11px' }}>
                                                    ({row.penaltyMonths} mos @ 2%)
                                                </span>
                                            </div>
                                        ) : (
                                            '₱ 0.00'
                                        )}
                                    </td>
                                    <td className="ta-r" style={{ padding: '14px 16px' }}>
                                        <b
                                            style={{
                                                fontSize: '14px',
                                                color: row.totalTaxDue > 0 ? 'var(--navy)' : 'var(--muted)',
                                            }}
                                        >
                                            {peso(row.totalTaxDue)}
                                        </b>
                                    </td>
                                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                        <span
                                            className={`badge ${row.isSettled
                                                ? 'badge--paid'
                                                : row.status === 'PARTIAL'
                                                    ? 'badge--partial'
                                                    : 'badge--unpaid'
                                                }`}
                                        >
                                            {row.isSettled ? 'PAID' : 'UNPAID'}
                                        </span>
                                    </td>
                                    <td className="ta-r" style={{ padding: '14px 16px' }}>
                                        {row.isSettled ? (
                                            <button
                                                type="button"
                                                disabled
                                                className="btn btn--ghost btn--sm"
                                                style={{ opacity: 0.6 }}
                                            >
                                                Settled
                                            </button>
                                        ) : row.isAdvanceLocked ? (
                                            <button
                                                type="button"
                                                disabled
                                                className="btn btn--ghost btn--sm"
                                                title={`TY ${row.taxYear} advance payment is only accepted in December`}
                                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                            >
                                                Opens Dec {row.taxYear - 1}
                                            </button>
                                        ) : row.isBlockedByPriorDelinquency ? (
                                            <button
                                                type="button"
                                                disabled
                                                className="btn btn--ghost btn--sm"
                                                title={`Cannot pay TY ${row.taxYear}. Please settle older delinquent year(s) first: ${row.priorDelinquentYears.join(', ')}`}
                                                style={{
                                                    opacity: 0.5,
                                                    cursor: 'not-allowed',
                                                    color: 'var(--red)',
                                                    borderColor: 'var(--red)'
                                                }}
                                            >
                                                Settle Year {Math.min(...row.priorDelinquentYears)} First
                                            </button>
                                        )
                                            : (
                                                <button
                                                    type="button"
                                                    className="btn btn--primary btn--sm"
                                                    onClick={() => handleOpenPaymentModal(row)}
                                                >
                                                    Accept Payment
                                                </button>
                                            )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ background: '#f8fafc', borderTop: '2px solid var(--navy)' }}>
                                <td style={{ padding: '14px 16px' }}>
                                    <b style={{ color: 'var(--navy)' }}>TOTAL DUE</b>
                                </td>
                                <td style={{ padding: '14px 16px' }}></td>
                                <td className="ta-r" style={{ padding: '14px 16px' }}>
                                    <b>{peso(cumulativeSummary.totalBasic + cumulativeSummary.totalSef)}</b>
                                </td>
                                <td className="ta-r" style={{ padding: '14px 16px', color: 'var(--green)' }}>
                                    <b>− {peso(cumulativeSummary.totalDiscount)}</b>
                                </td>
                                <td className="ta-r" style={{ padding: '14px 16px', color: 'var(--red)' }}>
                                    <b>+ {peso(cumulativeSummary.totalPenalty)}</b>
                                </td>
                                <td className="ta-r" style={{ padding: '14px 16px', fontSize: '15px' }}>
                                    <b style={{ color: 'var(--navy)' }}>{peso(cumulativeSummary.totalDue)}</b>
                                </td>
                                <td colSpan={2} style={{ padding: '14px 16px' }}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div
                    className="btn-row"
                    style={{
                        marginTop: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div className="formula-note" style={{ margin: 0, padding: '8px 14px' }}>
                        <b>Legal Standard:</b> 2% monthly penalty up to 72% statutory cap (RA 7160 Sec. 255)[cite: 2, 3].
                    </div>
                    <button type="button" className="btn btn--ghost" onClick={() => window.print()}>
                        Print Statement of Account
                    </button>
                </div>
            </div>

            {/* 3. MODAL FOR POSTING PAYMENT */}
            {isConfirmModalOpen && targetLedgerForPayment && (
                <div className="modal">
                    <div className="modal__backdrop" onClick={() => setIsConfirmModalOpen(false)} />
                    <div className="modal__box modal__box--sm">
                        <div className="modal__actions">
                            <div>
                                <b>Post Payment for Tax Year {targetLedgerForPayment.taxYear}</b>
                                <span className="muted small block">Assign Official Receipts and commit</span>
                            </div>
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={() => setIsConfirmModalOpen(false)}
                            >
                                <Icons.Close />
                            </button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <form className="form" onSubmit={handleProcessPayment}>
                                <div className="prop-mini" style={{ marginBottom: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="muted">Taxpayer:</span>
                                        <b>{currentProperty?.ownerName}</b>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                        <span className="muted">Tax Year:</span>
                                        <b>{targetLedgerForPayment.taxYear}</b>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                        <span className="muted">Total Tax Due:</span>
                                        <b style={{ color: 'var(--blue)' }}>{peso(activeModalDue)}</b>
                                    </div>
                                </div>

                                <div className="field">
                                    <label htmlFor="modalPeriod">Installment Period</label>
                                    <select
                                        id="modalPeriod"
                                        className="input"
                                        value={selectedPeriod}
                                        onChange={(e) => setSelectedPeriod(e.target.value as InstallmentPeriod)}
                                        disabled={rawLedgers.find(l => l.id === targetLedgerForPayment.id)?.status === 'PARTIAL'}
                                    >
                                        <option value="FULL_YEAR">FULL YEAR (100%)</option>
                                        <option value="Q1">Quarter 1 (25%)</option>
                                        <option value="Q2">Quarter 2 (25%)</option>
                                        <option value="Q3">Quarter 3 (25%)</option>
                                        <option value="Q4">Quarter 4 (25%)</option>
                                    </select>
                                </div>
                                <div className="field">
                                    <label htmlFor="modalOrBasic">O.R. No. (Basic Tax)</label>
                                    <input
                                        id="modalOrBasic"
                                        type="text"
                                        required
                                        className="input"
                                        value={orBasicInput}
                                        onChange={(e) => setOrBasicInput(e.target.value)}
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="modalOrSef">O.R. No. (SEF)</label>
                                    <input
                                        id="modalOrSef"
                                        type="text"
                                        className="input"
                                        value={orSefInput}
                                        onChange={(e) => setOrSefInput(e.target.value)}
                                    />
                                </div>

                                <div className="btn-row" style={{ justifyContent: 'flex-end', marginTop: '16px' }}>
                                    <button
                                        type="button"
                                        className="btn btn--ghost"
                                        onClick={() => setIsConfirmModalOpen(false)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={postPaymentMutation.isPending}
                                        className="btn btn--primary"
                                    >
                                        {postPaymentMutation.isPending ? 'Posting...' : 'Confirm & Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. SUCCESS RECEIPT POPUP */}
            {receiptData && (
                <div className="modal">
                    <div className="modal__backdrop" onClick={() => setReceiptData(null)} />
                    <div className="modal__box modal__box--sm">
                        <div className="modal__actions">
                            <button
                                type="button"
                                className="btn btn--ghost btn--sm"
                                onClick={() => setReceiptData(null)}
                            >
                                Close
                            </button>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn--ghost btn--sm"
                                    onClick={() => window.print()}
                                >
                                    Print Receipt
                                </button>
                                <button
                                    type="button"
                                    className="btn btn--primary btn--sm"
                                    onClick={() => setReceiptData(null)}
                                >
                                    Done
                                </button>
                            </div>
                        </div>

                        <div className="receipt">
                            <div className="receipt__check" aria-hidden="true">
                                <dt>Billing Period</dt>
                                <dd>{receiptData.period === 'FULL_YEAR' ? 'Full Year (100%)' : receiptData.period}</dd>
                                <Icons.Check />
                            </div>
                            <div className="receipt__title">Payment Recorded Successfully</div>
                            <div className="receipt__sub">Official receipt generated</div>
                            <div className="receipt__or">
                                <span>OFFICIAL RECEIPT NO.</span>
                                <b>{receiptData.orNo}</b>
                            </div>
                            <dl className="dl">
                                <dt>Property PIN</dt>
                                <dd className="mono">{receiptData.pin}</dd>
                                <dt>Taxpayer</dt>
                                <dd>{receiptData.taxpayer}</dd>
                                <dt>Tax Year</dt>
                                <dd>{receiptData.taxYear}</dd>
                                <dt>1% Basic RPT Tax</dt>
                                <dd>{peso(receiptData.basicTax)}</dd>
                                <dt>1% SEF Tax</dt>
                                <dd>{peso(receiptData.sefTax)}</dd>
                                <dt>Penalty</dt>
                                <dd>+ {peso(receiptData.penalty)}</dd>
                            </dl>
                            <div className="receipt__total">
                                <span>Total Amount Paid</span>
                                <span>{peso(receiptData.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. TOAST */}
            <div className={`toast ${toastMessage ? 'is-show' : ''} ${isToastError ? 'toast--error' : ''}`}>
                {toastMessage}
            </div>
        </div>
    );
};