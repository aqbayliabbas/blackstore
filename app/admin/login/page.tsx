"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/admin/dashboard");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 sm:px-6">
            <div className="w-full max-w-md space-y-8 rounded-[2rem] bg-white p-6 sm:p-10 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-black shadow-lg">
                        <ShoppingBag className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Admin Login</h1>
                    <p className="mt-2 text-sm font-medium text-zinc-400">Access your store dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-xs font-medium text-red-600">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-black"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-black py-4 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98]"
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
