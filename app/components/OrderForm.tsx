"use client";

import { useState, useMemo } from "react";
import wilayas from "../data/wilayas.json";
import { supabase } from "@/app/lib/supabase";
import { useLanguage } from "../context/LanguageContext";

const PRODUCT_PRICE = 3200;

export default function OrderForm() {
    const { t, language } = useLanguage();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        wilaya: "",
        commune: "",
        address: "",
        deliveryType: "home" as "home" | "office",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    const deliveryPrice = useMemo(() => {
        if (!formData.wilaya) return 0;
        return formData.deliveryType === "office" ? 300 : 450;
    }, [formData.wilaya, formData.deliveryType]);

    const totalPrice = PRODUCT_PRICE + deliveryPrice;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { error } = await supabase
            .from("orders")
            .insert([{
                full_name: formData.fullName,
                phone: formData.phone,
                wilaya: formData.wilaya,
                commune: formData.commune,
                address: formData.address,
                delivery_type: formData.deliveryType,
                product_price: PRODUCT_PRICE,
                delivery_price: deliveryPrice,
                total_price: totalPrice,
                status: 'pending'
            }]);

        if (error) {
            console.error("Error saving order:", error);
            alert(language === "ar" ? "حدث خطأ. يرجى المحاولة مرة أخرى." : "Une erreur est survenue. Veuillez réessayer.");
            setIsSubmitting(false);
        } else {
            setIsSubmitting(false);
            setIsSuccess(true);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 rounded-3xl bg-green-50 p-8 text-center ring-1 ring-green-200">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-200">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-green-900 uppercase tracking-tight">{t.form.success}</h3>
                </div>

                <div className="pt-4 flex flex-col items-center gap-4 w-full">
                    <button
                        onClick={() => setIsSuccess(false)}
                        className="text-xs font-bold uppercase tracking-widest text-green-700/60 transition-colors hover:text-green-800"
                    >
                        {language === "ar" ? "ارسال طلب آخر" : "Passer une autre commande"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-3xl bg-zinc-50 p-6 shadow-sm ring-1 ring-zinc-200">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">{t.form.title}</h2>
                <span className="rounded-full bg-black/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                    {t.form.paymentMethod}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-bold text-zinc-900">
                        {t.form.fullName}
                    </label>
                    <input
                        type="text"
                        placeholder="..."
                        className="w-full rounded-xl border-zinc-200 bg-white px-5 py-4 text-base focus:border-black transition-all outline-none border focus:ring-0"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-zinc-900">
                        {t.form.phone}
                    </label>
                    <input
                        type="tel"
                        placeholder="05.. / 06.. / 07.."
                        className="w-full rounded-xl border-zinc-200 bg-white px-5 py-4 text-base focus:border-black transition-all outline-none border focus:ring-0"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-900">
                            {t.form.wilaya}
                        </label>
                        <select
                            className={`w-full rounded-xl border-zinc-200 bg-white px-5 py-4 text-base focus:border-black transition-all outline-none border focus:ring-0 appearance-none bg-no-repeat bg-[length:20px] ${language === 'ar' ? 'bg-[left_1.25rem_center]' : 'bg-[right_1.25rem_center]'
                                }`}
                            style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20d%3D%22m7%2010%205%205%205-5%22%2F%3E%3C%2Fsvg%3E")` }}
                            value={formData.wilaya}
                            onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                            required
                        >
                            <option value="">...</option>
                            {wilayas.map((wilaya) => (
                                <option key={wilaya} value={wilaya}>
                                    {wilaya}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-900">
                            {t.form.commune}
                        </label>
                        <input
                            type="text"
                            placeholder="..."
                            className="w-full rounded-xl border-zinc-200 bg-white px-5 py-4 text-base focus:border-black transition-all outline-none border focus:ring-0"
                            value={formData.commune}
                            onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-zinc-900">
                        {t.form.deliveryType}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, deliveryType: "home" })}
                            className={`flex flex-col items-center justify-center rounded-xl border-2 py-4 px-2 transition-all ${formData.deliveryType === "home"
                                ? "border-black bg-black text-white"
                                : "border-zinc-100 bg-white hover:border-zinc-200"
                                }`}
                        >
                            <span className="text-sm font-bold">{t.form.deliveryHome}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, deliveryType: "office" })}
                            className={`flex flex-col items-center justify-center rounded-xl border-2 py-4 px-2 transition-all ${formData.deliveryType === "office"
                                ? "border-black bg-black text-white"
                                : "border-zinc-100 bg-white hover:border-zinc-200"
                                }`}
                        >
                            <span className="text-sm font-bold">{t.form.deliveryOffice}</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-zinc-900">
                        {t.form.address}
                    </label>
                    <textarea
                        placeholder="..."
                        rows={3}
                        className="w-full rounded-xl border-zinc-200 bg-white px-5 py-4 text-base focus:border-black transition-all outline-none border focus:ring-0 resize-none"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                    />
                </div>

                {/* Price Breakdown */}
                <div className="mt-8 space-y-2 border-t border-dashed border-zinc-300 pt-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">{t.form.productPrice}</span>
                        <span className="font-medium text-zinc-900">{PRODUCT_PRICE.toLocaleString()} {language === "ar" ? "دج" : "DZD"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">{t.form.deliveryPrice}</span>
                        <span className="font-medium text-zinc-900">
                            {formData.wilaya ? `${deliveryPrice.toLocaleString()} ${language === "ar" ? "دج" : "DZD"}` : "—"}
                        </span>
                    </div>
                    <div className="flex justify-between border-t border-zinc-200 pt-2">
                        <span className="text-base font-bold tracking-tight">{t.form.total}</span>
                        <span className="text-xl font-bold tracking-tight text-black">
                            {formData.wilaya ? `${totalPrice.toLocaleString()} ${language === "ar" ? "دج" : "DZD"}` : `${PRODUCT_PRICE.toLocaleString()} ${language === "ar" ? "دج" : "DZD"}`}
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative mt-6 w-full overflow-hidden rounded-2xl bg-black py-4 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t.form.processing}
                        </span>
                    ) : (
                        t.form.submit
                    )}
                </button>
            </form>
        </div>
    );
}
