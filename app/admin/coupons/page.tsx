'use client';
import { useState } from 'react';

interface CouponInfo {
    id: number;
    code: string;
    discountValue: number;
    discountType: 'Percentage' | 'Fixed Amount';
    uses: number;
    limit: number;
    salesGenerated: number;
    discountGiven: number;
    status: 'Active' | 'Expired';
    validUntil: string;
}

const INITIAL_COUPONS: CouponInfo[] = [];

export default function AdminCouponManagementDashboard() {
    const [coupons, setCoupons] = useState<CouponInfo[]>(INITIAL_COUPONS);
    
    // Form States
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed Amount'>('Percentage');
    const [discountValue, setDiscountValue] = useState<number>(10);
    const [limit, setLimit] = useState<number>(500);
    const [validUntil, setValidUntil] = useState('2026-12-31');

    const handleCreateCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        const newCoupon: CouponInfo = {
            id: Date.now(),
            code: code.trim().toUpperCase(),
            discountValue: Number(discountValue),
            discountType,
            uses: 0,
            limit: Number(limit),
            salesGenerated: 0,
            discountGiven: 0,
            status: 'Active',
            validUntil
        };

        setCoupons([newCoupon, ...coupons]);
        setCode('');
        setDiscountValue(10);
        setLimit(500);
    };

    const handleDelete = (id: number) => {
        setCoupons(coupons.filter(c => c.id !== id));
    };

    // Derived Metrics
    const totalCouponsCount = coupons.length;
    const activeCouponsCount = coupons.filter(c => c.status === 'Active').length;
    const totalDiscountGiven = coupons.reduce((sum, c) => sum + c.discountGiven, 0);

    return (
        <main className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-6 max-w-[1440px] mx-auto min-h-screen">
            
            <header className="mb-6 border-b border-outline-variant/30 pb-4">
                <h2 className="text-xl font-bold text-on-surface">Coupons &amp; Offers</h2>
                <p className="text-xs text-on-surface-variant mt-1">Create new discount codes and track usage performance, sales, and total discount metrics.</p>
            </header>

            {/* KPI Cards Section */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="glass-card bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between text-on-surface-variant mb-1">
                        <span className="font-semibold text-[10px] uppercase tracking-wider">Active Coupons</span>
                        <span className="material-symbols-outlined text-tertiary text-base">check_circle</span>
                    </div>
                    <div className="mt-2">
                        <p className="text-xl font-bold text-on-surface leading-none">{activeCouponsCount}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">Live promotional offers</p>
                    </div>
                </div>

                <div className="glass-card bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between text-on-surface-variant mb-1">
                        <span className="font-semibold text-[10px] uppercase tracking-wider">Total Coupons</span>
                        <span className="material-symbols-outlined text-primary text-base">confirmation_number</span>
                    </div>
                    <div className="mt-2">
                        <p className="text-xl font-bold text-on-surface leading-none">{totalCouponsCount}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">Total campaign codes created</p>
                    </div>
                </div>

                <div className="glass-card bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between text-on-surface-variant mb-1">
                        <span className="font-semibold text-[10px] uppercase tracking-wider">Total Discount Given</span>
                        <span className="material-symbols-outlined text-secondary text-base">payments</span>
                    </div>
                    <div className="mt-2">
                        <p className="text-xl font-bold text-on-surface leading-none">Rs. {totalDiscountGiven.toLocaleString()}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">Total savings passed to users</p>
                    </div>
                </div>
            </section>

            {/* Creation and List Columns */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Coupon Creation Form */}
                <div className="xl:col-span-4">
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
                        <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">add_box</span>
                            Create New Coupon
                        </h3>
                        <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-on-surface-variant mb-1">Coupon Code</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                    placeholder="e.g. FESTIVE50" 
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block font-semibold text-on-surface-variant mb-1">Discount Type</label>
                                    <select 
                                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none"
                                        value={discountType}
                                        onChange={(e) => setDiscountType(e.target.value as any)}
                                    >
                                        <option value="Percentage">Percentage (%)</option>
                                        <option value="Fixed Amount">Fixed (Rs.)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-semibold text-on-surface-variant mb-1">Value</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                        min={1}
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block font-semibold text-on-surface-variant mb-1">Usage Limit</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                        min={1}
                                        value={limit}
                                        onChange={(e) => setLimit(Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-on-surface-variant mb-1">Expiry Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                        value={validUntil}
                                        onChange={(e) => setValidUntil(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-primary text-on-primary font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-1.5 mt-2"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                Add Coupon Code
                            </button>
                        </form>
                    </div>
                </div>

                {/* Coupon Performance Table */}
                <div className="xl:col-span-8">
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-outline-variant/20 bg-surface-container/30">
                            <h3 className="text-xs font-bold text-on-surface">Coupon Usage & Performance</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-outline-variant/30 bg-background/50 text-on-surface-variant text-xs uppercase tracking-wider">
                                        <th className="py-3 px-4 font-semibold">Code</th>
                                        <th className="py-3 px-4 font-semibold">Discount</th>
                                        <th className="py-3 px-4 font-semibold text-right">Uses</th>
                                        <th className="py-3 px-4 font-semibold text-right">Sales Generated</th>
                                        <th className="py-3 px-4 font-semibold text-right">Savings Given</th>
                                        <th className="py-3 px-4 font-semibold text-center">Status</th>
                                        <th className="py-3 px-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/20 text-xs text-on-surface">
                                    {coupons.map((coupon) => (
                                        <tr key={coupon.id} className="hover:bg-surface-container-low transition-colors duration-150 group">
                                            <td className="py-3 px-4 font-bold text-primary">{coupon.code}</td>
                                            <td className="py-3 px-4">
                                                {coupon.discountType === 'Percentage' ? `${coupon.discountValue}%` : `Rs. ${coupon.discountValue}`} OFF
                                            </td>
                                            <td className="py-3 px-4 text-right font-medium">
                                                {coupon.uses} / {coupon.limit}
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold text-on-surface">
                                                Rs. {coupon.salesGenerated.toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4 text-right text-on-surface-variant">
                                                Rs. {coupon.discountGiven.toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    coupon.status === 'Active' 
                                                        ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' 
                                                        : 'bg-outline-variant/30 text-on-surface-variant'
                                                }`}>
                                                    <span className={`w-1 h-1 rounded-full ${
                                                        coupon.status === 'Active' ? 'bg-tertiary' : 'bg-outline'
                                                    }`}></span>
                                                    {coupon.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button 
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="p-1 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-all"
                                                    title="Delete Coupon"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {coupons.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-on-surface-variant text-xs">
                                                No coupon codes available. Create one to get started!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
