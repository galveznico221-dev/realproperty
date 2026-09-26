import React, { useState } from 'react';
import type { InstallmentPeriod, TaxPaymentRequestDto } from '../types/treasury';

// 1. Define the component's input contract (Props)
interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    taxYear: number;
    baseTax: number;
    isSubmitting: boolean;
    onSubmit: (payment: TaxPaymentRequestDto, isAmnesty: boolean) => Promise<void>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    taxYear,
    baseTax,
    isSubmitting,
    onSubmit,
}) => {
    // If the modal isn't open, render nothing (null)
    if (!isOpen) return null;

    // 2. Local form states with TypeScript types
    const [period, setPeriod] = useState<InstallmentPeriod>('FULL_YEAR');
    const [amountPaid, setAmountPaid] = useState<number>(baseTax);
    const [orBasic, setOrBasic] = useState('');
    const [orSef, setOrSef] = useState('');
    const [datePaid, setDatePaid] = useState(new Date().toISOString().split('T')[0]); // Defaults to today (YYYY-MM-DD)
    const [isAmnesty, setIsAmnesty] = useState(false);

    // 3. Form submit handler with React.FormEvent type
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents page reload
        await onSubmit(
            {
                period,
                amountPaid: Number(amountPaid),
                orBasic,
                orSef: orSef.trim() === '' ? undefined : orSef,
                datePaid,
            },
            isAmnesty
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between border-b pb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Post Tax Payment</h3>
                        <p className="text-xs text-slate-500">Tax Year {taxYear} • Base Due: ₱{baseTax.toFixed(2)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600">Installment Period</label>
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value as InstallmentPeriod)}
                                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-600 focus:outline-none"
                            >
                                <option value="FULL_YEAR">FULL YEAR (100%)</option>
                                <option value="Q1">Quarter 1 (25%)</option>
                                <option value="Q2">Quarter 2 (25%)</option>
                                <option value="Q3">Quarter 3 (25%)</option>
                                <option value="Q4">Quarter 4 (25%)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600">Date Paid</label>
                            <input
                                type="date"
                                value={datePaid}
                                onChange={(e) => setDatePaid(e.target.value)}
                                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-600 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600">Amount Paid (PHP)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                            className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600">O.R. No. (Basic Tax)</label>
                            <input
                                type="text"
                                value={orBasic}
                                onChange={(e) => setOrBasic(e.target.value)}
                                placeholder="e.g. 8910243"
                                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-600 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600">O.R. No. (SEF)</label>
                            <input
                                type="text"
                                value={orSef}
                                onChange={(e) => setOrSef(e.target.value)}
                                placeholder="e.g. 8910244"
                                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Statutory Tax Amnesty Checkbox */}
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 border border-slate-100">
                        <input
                            type="checkbox"
                            id="amnesty"
                            checked={isAmnesty}
                            onChange={(e) => setIsAmnesty(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        />
                        <label htmlFor="amnesty" className="text-xs text-slate-700 select-none cursor-pointer">
                            Apply Tax Amnesty (Waive 100% of accumulated penalties)
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Posting...' : 'Confirm & Post Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};