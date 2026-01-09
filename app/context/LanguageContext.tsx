"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations";
import { usePathname } from "next/navigation";

type Language = "ar" | "fr";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations.ar;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("ar");
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    useEffect(() => {
        if (isAdmin) {
            setLanguage("fr");
            return;
        }
        const saved = localStorage.getItem("language") as Language;
        if (saved && (saved === "ar" || saved === "fr")) {
            setLanguage(saved);
        }
    }, [isAdmin]);

    const handleSetLanguage = (lang: Language) => {
        if (isAdmin) return; // Prevent changing language in admin
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const value = {
        language: isAdmin ? "fr" : language,
        setLanguage: handleSetLanguage,
        t: isAdmin ? translations.fr : translations[language]
    };

    const isRtl = !isAdmin && language === "ar";

    return (
        <LanguageContext.Provider value={value}>
            <div
                dir={isRtl ? "rtl" : "ltr"}
                className={isRtl ? "font-cairo" : "font-sans"}
            >
                {children}
            </div>
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

