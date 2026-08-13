"use client";
export default function AdminCreateConfigureCoupon() {
    return (
        <main className="flex-grow py-12 px-margin-mobile md:px-margin-desktop">
<div className="max-w-[800px] mx-auto space-y-8">

<section className="bg-surface-container-lowest rounded-xl shadow-organic p-8">
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 border-b border-surface-variant pb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">sell</span>
                    Basic Information
                </h2>
<div className="space-y-6">
<div>
<label className="form-label" htmlFor="coupon-code">Coupon Code</label>
<div className="relative flex items-center">
<input className="form-input pr-32 font-bold uppercase" id="coupon-code" placeholder="e.g. INDEPENDENCE80" type="text" />
<button className="absolute right-2 px-4 py-1.5 rounded bg-surface-container-high text-on-surface-variant font-label-md text-xs hover:bg-primary-container hover:text-on-primary-container transition-colors" type="button">
                                Generate
                            </button>
</div>
<p className="mt-2 text-sm text-on-surface-variant">Customers will enter this code at checkout.</p>
</div>
<div>
<label className="form-label" htmlFor="description">Description (Internal)</label>
<textarea className="form-input resize-none" id="description" placeholder="Brief note about the purpose of this coupon..." rows={3}></textarea>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-xl shadow-organic p-8">
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 border-b border-surface-variant pb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">percent</span>
                    Discount Configuration
                </h2>
<div className="space-y-8">

<div>
<label className="form-label mb-3">Discount Type</label>
<div className="flex p-1 bg-surface-container-low rounded-lg inline-flex w-full md:w-auto">
<label className="flex-1 cursor-pointer">
<input defaultChecked className="peer sr-only" name="discount-type" type="radio" />
<div className="px-6 py-2.5 rounded-md text-center font-label-md text-label-md text-on-surface-variant peer-checked:bg-surface-container-lowest peer-checked:shadow-sm peer-checked:text-on-surface transition-all">
                                    Fixed Amount (₹)
                                </div>
</label>
<label className="flex-1 cursor-pointer">
<input className="peer sr-only" name="discount-type" type="radio" />
<div className="px-6 py-2.5 rounded-md text-center font-label-md text-label-md text-on-surface-variant peer-checked:bg-surface-container-lowest peer-checked:shadow-sm peer-checked:text-on-surface transition-all">
                                    Percentage (%)
                                </div>
</label>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="form-label" htmlFor="discount-value">Discount Value</label>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">₹</span>
<input className="form-input pl-8" id="discount-value" placeholder="0.00" type="number" />
</div>
</div>
<div>
<label className="form-label flex justify-between" htmlFor="max-discount">
                                Max Discount
                                <span className="text-xs text-outline font-normal normal-case">(Optional)</span>
</label>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">₹</span>
<input className="form-input pl-8" disabled id="max-discount" placeholder="0.00" type="number" />
</div>
<p className="mt-1 text-xs text-on-surface-variant">Applies only to percentage discounts.</p>
</div>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-xl shadow-organic p-8">
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 border-b border-surface-variant pb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">rule</span>
                    Conditions &amp; Eligibility
                </h2>
<div className="space-y-8">

<div>
<label className="form-label mb-4">Applicable To</label>
<div className="space-y-3">
<label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
<input defaultChecked className="text-primary focus:ring-primary h-5 w-5 border-outline-variant" name="applicable-to" type="radio" />
<span className="font-body-md text-on-surface">All Courses</span>
</label>
<label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
<input className="text-primary focus:ring-primary h-5 w-5 border-outline-variant" name="applicable-to" type="radio" />
<span className="font-body-md text-on-surface">Selected Courses</span>
</label>
<label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
<input className="text-primary focus:ring-primary h-5 w-5 border-outline-variant" name="applicable-to" type="radio" />
<span className="font-body-md text-on-surface">Selected Categories</span>
</label>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="form-label flex justify-between" htmlFor="min-order">
                                Min. Order Value
                                <span className="text-xs text-outline font-normal normal-case">(Optional)</span>
</label>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">₹</span>
<input className="form-input pl-8" id="min-order" placeholder="0.00" type="number" />
</div>
</div>
<div>
<label className="form-label" htmlFor="user-segment">User Segment</label>
<select className="form-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234c4636%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[position:right_1rem_center] bg-no-repeat pr-10" id="user-segment">
<option value="everyone">Everyone</option>
<option value="new">New Students (First Purchase)</option>
<option value="returning">Returning Students</option>
</select>
</div>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-xl shadow-organic p-8">
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 border-b border-surface-variant pb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">schedule</span>
                    Usage Limits &amp; Validity
                </h2>
<div className="space-y-8">

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="form-label flex justify-between" htmlFor="total-usage">
                                Total Usage Limit
                                <span className="text-xs text-outline font-normal normal-case">(Optional)</span>
</label>
<input className="form-input" id="total-usage" placeholder="e.g. 100" type="number" />
</div>
<div>
<label className="form-label flex justify-between" htmlFor="per-user">
                                Limit Per User
                            </label>
<input className="form-input" id="per-user" placeholder="e.g. 1" type="number" value="1" />
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="form-label" htmlFor="start-date">Start Date &amp; Time</label>
<input className="form-input" id="start-date" type="datetime-local" />
</div>
<div>
<label className="form-label flex justify-between" htmlFor="end-date">
                                End Date &amp; Time
                                <span className="text-xs text-outline font-normal normal-case">(Optional)</span>
</label>
<input className="form-input" id="end-date" type="datetime-local" />
</div>
</div>
</div>
</section>
</div>
</main>
    );
}
