"use client";

import Header from "./components/Header";
import ProductGallery from "./components/ProductGallery";
import OrderForm from "./components/OrderForm";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Droplets, Wind, Zap, CheckCircle2 } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";

export default function HomePage() {
    const { t, language } = useLanguage();

    const productImages = [
        "/images produit/Image (1).webp",
        "/images produit/Image (2).webp",
        "/images produit/Image (3).webp",
        "/images produit/Image (4).webp",
        "/images produit/Image (5).webp",
        "/images produit/Image (10).webp",
    ];

    const isAr = language === 'ar';

    return (
        <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans antialiased overflow-x-hidden">
            <Header />

            <main className="mx-auto max-w-6xl px-4 pt-24 lg:px-6 lg:pt-32 pb-32">
                {/* Product Identity */}
                <div className="mb-12 lg:mb-20 flex flex-col items-center text-center">
                    {/* Optimized Responsive Title */}
                    <h1 className={`font-black uppercase tracking-tighter leading-[0.8] w-full ${isAr ? 'text-[clamp(2rem,12vw,12rem)] mb-4' : 'text-[clamp(1.75rem,10vw,10rem)] mb-4'}`}>
                        {t.hero.title}
                    </h1>

                    <p className={`mt-4 lg:mt-8 text-zinc-500 font-medium max-w-2xl px-4 ${isAr ? 'text-xl lg:text-2xl leading-relaxed' : 'text-lg lg:text-xl'}`}>
                        {t.hero.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">

                    {/* Left Column: Visuals */}
                    <div className="space-y-12 lg:sticky lg:top-32">
                        <div className="relative">
                            <ProductGallery images={productImages} />
                        </div>

                        {/* Specs - Hidden on mobile, shown later for better conversion flow */}
                        <div className="hidden lg:block bg-white border-t-2 border-black pt-12">
                            <span className={`font-black uppercase tracking-[0.5em] text-zinc-400 mb-10 block ${isAr ? 'text-[14px]' : 'text-[11px]'}`}>
                                {t.specs.title}
                            </span>
                            <div className="grid grid-cols-2 gap-y-12 gap-x-8">
                                {[
                                    { ...t.specs.structure, icon: <Droplets size={14} /> },
                                    { ...t.specs.visibility, icon: <Zap size={14} /> },
                                    { ...t.specs.waterproof, icon: <Wind size={14} /> },
                                    { ...t.specs.care, icon: <RotateCcw size={14} /> }
                                ].map((spec, i) => (
                                    <div key={i} className={`flex flex-col ${isAr ? 'items-start' : 'items-start'}`}>
                                        <div className="text-black mb-4">{spec.icon}</div>
                                        <dt className={`font-black uppercase tracking-widest text-zinc-300 mb-2 ${isAr ? 'text-[12px]' : 'text-[9px]'}`}>{spec.label}</dt>
                                        <dd className={`font-bold tracking-tight text-black ${isAr ? 'text-lg' : 'text-base'}`}>{spec.value}</dd>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Information & Form */}
                    <div className="flex flex-col lg:pl-12 lg:border-l lg:border-zinc-100">
                        <div className="space-y-12 text-center lg:text-start">
                            <div className="space-y-8">
                                <div className="flex flex-col items-center lg:items-start gap-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl lg:text-7xl font-black tracking-tighter leading-none">{t.pricing.current}</span>
                                        <span className={`font-bold text-zinc-400 ${isAr ? 'text-xl' : 'text-lg'}`}>{isAr ? "دج" : "DZD"}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl lg:text-2xl text-zinc-300 line-through font-bold">{t.pricing.original}</span>
                                        <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                            {isAr ? "خصم ٢٥٪" : "REMISE 25%"}
                                        </span>
                                    </div>
                                </div>

                                <p className={`leading-relaxed text-zinc-600 font-medium max-w-xl mx-auto lg:mx-0 ${isAr ? 'text-xl lg:text-2xl' : 'text-lg lg:text-xl'}`}>
                                    {t.description}
                                </p>

                                <div className={`flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-zinc-500 pt-4`}>
                                    {[
                                        isAr ? "مقاومة كاملة" : "PROTECTION TOTALE",
                                        isAr ? "تحمل عالي" : "HAUTE DURABILITÉ",
                                        isAr ? "شحن فوري" : "LIVRAISON EXPRESS"
                                    ].map((check, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-black" />
                                            <span className={`font-black tracking-tighter uppercase ${isAr ? 'text-[13px]' : 'text-[10px]'}`}>{check}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div id="order-form" className="relative scroll-mt-32">
                                <OrderForm />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { icon: <Truck size={18} />, title: t.features.shipping.title, text: t.features.shipping.text },
                                    { icon: <ShieldCheck size={18} />, title: t.features.verification.title, text: t.features.verification.text }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start text-start p-6 bg-zinc-50 rounded-2xl">
                                        <div className="mt-1 text-black">{item.icon}</div>
                                        <div className="space-y-1">
                                            <h4 className={`font-black uppercase tracking-widest ${isAr ? 'text-[12px]' : 'text-[10px]'}`}>{item.title}</h4>
                                            <p className={`text-zinc-500 font-medium ${isAr ? 'text-[14px]' : 'text-[12px]'}`}>{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Specs Column - Shown for mobile here instead */}
                            <div className="lg:hidden bg-white border-t-2 border-black pt-12 text-start">
                                <span className={`font-black uppercase tracking-[0.5em] text-zinc-400 mb-10 block ${isAr ? 'text-[14px]' : 'text-[11px]'}`}>
                                    {t.specs.title}
                                </span>
                                <div className="grid grid-cols-2 gap-y-12 gap-x-8">
                                    {[
                                        { ...t.specs.structure, icon: <Droplets size={14} /> },
                                        { ...t.specs.visibility, icon: <Zap size={14} /> },
                                        { ...t.specs.waterproof, icon: <Wind size={14} /> },
                                        { ...t.specs.care, icon: <RotateCcw size={14} /> }
                                    ].map((spec, i) => (
                                        <div key={i} className="flex flex-col items-start">
                                            <div className="text-black mb-4">{spec.icon}</div>
                                            <dt className={`font-black uppercase tracking-widest text-zinc-300 mb-2 ${isAr ? 'text-[12px]' : 'text-[9px]'}`}>{spec.label}</dt>
                                            <dd className={`font-bold tracking-tight text-black ${isAr ? 'text-lg' : 'text-base'}`}>{spec.value}</dd>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Editorial Sections */}
                <section className="mt-32 lg:mt-48 pt-20 lg:pt-40 border-t-2 border-black">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="space-y-10 lg:space-y-12">
                            <span className={`font-black uppercase tracking-[0.5em] text-zinc-400 ${isAr ? 'text-[14px]' : 'text-[11px]'}`}>{t.editorial.badge}</span>
                            <h2 className={`font-black tracking-tighter leading-[0.85] uppercase ${isAr ? 'text-5xl lg:text-7xl' : 'text-6xl lg:text-8xl'}`}>{t.editorial.title}</h2>
                            <p className={`text-zinc-500 leading-relaxed font-medium ${isAr ? 'text-lg lg:text-2xl' : 'text-base lg:text-xl'}`}>
                                {t.editorial.text}
                            </p>
                            <div className="pt-4 lg:pt-8 grid grid-cols-1 gap-6">
                                {[t.editorial.point1, t.editorial.point2, t.editorial.point3].map((point, i) => (
                                    <div key={i} className="flex items-baseline gap-4 lg:gap-6 border-b border-zinc-100 pb-4">
                                        <span className="font-black text-black text-xs uppercase tracking-widest">0{i + 1}</span>
                                        <span className={`font-bold text-black uppercase tracking-tight ${isAr ? 'text-xl lg:text-2xl font-black' : 'text-lg lg:text-xl'}`}>{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden rounded-2xl">
                            <Image
                                src="/images produit/Image (6).webp"
                                fill
                                className="object-cover"
                                alt="Technical detail"
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ - Brute Aesthetic */}
                <section className="mt-32 lg:mt-48 pt-0 border-t-2 border-black">
                    <div className="max-w-4xl mx-auto pt-20 lg:pt-32">
                        <div className="text-start mb-20 lg:mb-24 border-b border-zinc-100 pb-12">
                            <span className={`font-black uppercase tracking-[0.6em] text-zinc-400 mb-6 lg:mb-8 block ${isAr ? 'text-[15px]' : 'text-[11px]'}`}>{t.faq.title}</span>
                            <h3 className={`font-black tracking-tighter uppercase ${isAr ? 'text-5xl lg:text-7xl' : 'text-4xl lg:text-6xl'}`}>
                                {isAr ? "الأسئلة المتكررة" : "FAQ"}
                            </h3>
                        </div>
                        <div className="space-y-24 lg:space-y-32">
                            {[t.faq.q1, t.faq.q2, t.faq.q3].map((faq, i) => (
                                <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                                    <div className={`lg:col-span-12 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-200`}>
                                        PRO_LOG_0{i + 1}
                                    </div>
                                    <div className="lg:col-span-12 space-y-4 lg:space-y-8">
                                        <h4 className={`font-black tracking-tighter uppercase ${isAr ? 'text-3xl lg:text-4xl' : 'text-2xl lg:text-3xl'}`}>{faq.q}</h4>
                                        <p className={`text-zinc-600 leading-relaxed font-medium max-w-2xl ${isAr ? 'text-lg lg:text-2xl' : 'text-base lg:text-xl'}`}>{faq.a}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            <footer className="bg-black py-32 lg:py-40 px-6 lg:px-12 text-white">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 lg:gap-16 text-center">
                    <div className="text-4xl lg:text-5xl font-black tracking-[0.2em] uppercase">
                        BLACK<span className="text-zinc-700">STORE</span>
                    </div>
                    <div className="w-12 lg:w-16 h-1 bg-white" />
                    <p className={`text-zinc-600 tracking-[0.4em] lg:tracking-[0.8em] font-black uppercase ${isAr ? 'text-[12px] lg:text-[14px]' : 'text-[9px] lg:text-[10px]'}`}>{t.footer.rights}</p>
                </div>
            </footer>

            {/* Mobile Sticky CTA */}
            <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-zinc-100 p-4 pb-8 transition-transform duration-500`}>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{isAr ? "السعر الإجمالي" : "PRIX TOTAL"}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black">{t.pricing.current}</span>
                            <span className="text-xs font-bold text-zinc-500">{isAr ? "دج" : "DZD"}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex-1 bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-transform"
                    >
                        {isAr ? "اطلب الآن" : "COMMANDER"}
                    </button>
                </div>
            </div>
        </div>
    );
}
