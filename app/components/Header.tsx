import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Header() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        <div className="w-24">
          <button
            onClick={() => setLanguage(language === "ar" ? "fr" : "ar")}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
          >
            {language === "ar" ? "Français" : "العربية"}
          </button>
        </div>

        <Link href="/" className="text-xl font-semibold tracking-tight absolute left-1/2 -translate-x-1/2">
          BLACK<span className="font-light">STORE</span>
        </Link>

        <div className="w-24" /> {/* Spacer to keep logo centered */}
      </div>
    </header>
  );
}
