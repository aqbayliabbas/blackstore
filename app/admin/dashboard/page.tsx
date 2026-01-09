"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    LogOut,
    ChevronRight,
    Package,
    Search,
    Filter,
    ArrowUpRight,
    Calendar,
    Phone,
    MapPin,
    Truck,
    Info,
    RefreshCw,
    X,
    Menu
} from "lucide-react";

interface Order {
    id: string;
    created_at: string;
    full_name: string;
    phone: string;
    wilaya: string;
    commune: string;
    address: string;
    delivery_type: string;
    total_price: number;
    status: string;
}

export default function Dashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"overview" | "orders">("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
            } else {
                fetchOrders();
            }
        };
        checkUser();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from("orders")
            .update({ status: newStatus })
            .eq("id", id);

        if (!error) {
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            if (selectedOrder?.id === id) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    // KPI Calculations
    const stats = useMemo(() => {
        const totalRevenue = orders.reduce((acc, curr) => acc + (curr.status !== 'cancelled' ? curr.total_price : 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'delivered').length;

        return {
            revenue: totalRevenue,
            totalOrders: orders.length,
            pending: pendingOrders,
            success: orders.length > 0 ? Math.round((confirmedOrders / orders.length) * 100) : 0
        };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.phone.includes(searchQuery) ||
                order.wilaya.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === "all" || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

    if (loading && orders.length === 0) return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-zinc-50 font-sans selection:bg-black selection:text-white">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 z-40 h-screen w-72 border-r border-zinc-200 bg-white p-6 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
                <div className="mb-10 flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black transform transition-transform hover:rotate-6">
                            <ShoppingBag className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">BLACK<span className="font-light">ADMIN</span></h2>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Store Manager</span>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 lg:hidden text-zinc-400">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1">
                    <button
                        onClick={() => { setActiveTab("overview"); setIsSidebarOpen(false); }}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "overview"
                            ? "bg-zinc-100 text-black ring-1 ring-zinc-200"
                            : "text-zinc-500 hover:bg-zinc-50"
                            }`}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Aperçu Global
                    </button>
                    <button
                        onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "orders"
                            ? "bg-zinc-100 text-black ring-1 ring-zinc-200"
                            : "text-zinc-500 hover:bg-zinc-50"
                            }`}
                    >
                        <Package className="h-4 w-4" />
                        Commandes
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-zinc-50">
                        <Users className="h-4 w-4" />
                        Clients
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-zinc-50">
                        <TrendingUp className="h-4 w-4" />
                        Analyses
                    </button>
                </nav>

                <div className="mt-auto border-t border-zinc-100 pt-6">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 transition-all duration-300 lg:ml-72 min-h-screen">
                {/* Mobile Top Bar */}
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-100 bg-white/80 p-4 backdrop-blur-md lg:hidden">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
                            <ShoppingBag className="h-4 w-4 text-white" />
                        </div>
                        <h2 className="text-sm font-bold tracking-tight uppercase">BlackAdmin</h2>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="rounded-lg bg-zinc-50 p-2 text-zinc-600">
                        <Menu size={20} />
                    </button>
                </div>

                <div className="p-4 md:p-8 lg:p-10">
                    <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
                                {activeTab === "overview" ? "Tableau de Bord" : "Gestion des Commandes"}
                            </h1>
                            <p className="text-sm text-zinc-500 mt-1 flex items-center gap-2">
                                {activeTab === "overview"
                                    ? "Suivez vos performances en temps réel"
                                    : `Vous avez ${orders.length} commandes au total`}
                                <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
                                <span className="hidden sm:inline text-[10px] font-bold uppercase text-zinc-400">Màj: {new Date().toLocaleTimeString()}</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                            <button
                                onClick={fetchOrders}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition-all hover:bg-zinc-50 hover:text-black"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-black' : ''}`} />
                            </button>
                            <div className="relative flex-1 md:flex-none">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black text-zinc-900 md:w-72"
                                />
                            </div>
                        </div>
                    </header>

                    {activeTab === "overview" && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            {/* KPI Grid */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                                <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="absolute -right-4 -top-4 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:rotate-12">
                                        <TrendingUp size={120} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                                            <TrendingUp className="h-6 w-6" />
                                        </div>
                                        <div className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-600">
                                            <ArrowUpRight className="h-3 w-3" /> 12%
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Revenus Nets</p>
                                        <h3 className="text-xl font-black mt-1 tracking-tight text-zinc-900 md:text-2xl">{stats.revenue.toLocaleString()} DA</h3>
                                    </div>
                                </div>

                                <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="absolute -right-4 -top-4 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:rotate-12">
                                        <ShoppingBag size={120} />
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                        <ShoppingBag className="h-6 w-6" />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Commandes</p>
                                        <h3 className="text-xl font-black mt-1 tracking-tight text-zinc-900 md:text-2xl">{stats.totalOrders}</h3>
                                    </div>
                                </div>

                                <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="absolute -right-4 -top-4 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:rotate-12">
                                        <Clock size={120} />
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">À Confirmer</p>
                                        <h3 className="text-xl font-black mt-1 tracking-tight text-zinc-900 md:text-2xl">{stats.pending}</h3>
                                    </div>
                                </div>

                                <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="absolute -right-4 -top-4 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:rotate-12">
                                        <CheckCircle2 size={120} />
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Taux de Succès</p>
                                        <h3 className="text-xl font-black mt-1 tracking-tight text-zinc-900 md:text-2xl">{stats.success}%</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Table */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold tracking-tight text-zinc-900">Flux Récent</h2>
                                    <button
                                        onClick={() => setActiveTab("orders")}
                                        className="text-xs font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-black flex items-center gap-1.5 group"
                                    >
                                        Consulter tous <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                                <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-x-auto lg:overflow-x-visible">
                                    <table className="w-full text-left">
                                        <thead className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                            <tr>
                                                <th className="px-6 py-4">Client</th>
                                                <th className="hidden sm:table-cell px-6 py-4">Destination</th>
                                                <th className="px-6 py-4 text-center">Statut</th>
                                                <th className="px-6 py-4 text-right">Montant</th>
                                                <th className="hidden sm:table-cell px-6 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                            {orders.slice(0, 5).map((order) => (
                                                <tr key={order.id} className="group hover:bg-zinc-50/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-sm text-zinc-900 truncate max-w-[120px] sm:max-w-none">{order.full_name}</div>
                                                        <div className="text-[11px] text-zinc-500">{order.phone}</div>
                                                    </td>
                                                    <td className="hidden sm:table-cell px-6 py-4">
                                                        <div className="text-sm font-medium text-zinc-700">{order.wilaya}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <StatusBadge status={order.status} />
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-black text-sm text-zinc-900 whitespace-nowrap">
                                                        {order.total_price.toLocaleString()} <span className="text-[10px] opacity-40">DA</span>
                                                    </td>
                                                    <td className="hidden sm:table-cell px-6 py-4 text-right">
                                                        <Info className="h-4 w-4 text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "orders" && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Status Filter Bar */}
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                    {[
                                        { id: 'all', label: 'Tous', icon: Package },
                                        { id: 'pending', label: 'En attente', icon: Clock },
                                        { id: 'confirmed', label: 'Confirmé', icon: CheckCircle2 },
                                        { id: 'shipped', label: 'Expédié', icon: Truck },
                                        { id: 'delivered', label: 'Livré', icon: CheckCircle2 },
                                        { id: 'cancelled', label: 'Annulé', icon: XCircle },
                                    ].map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setStatusFilter(s.id)}
                                            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all ${statusFilter === s.id
                                                ? "bg-black text-white shadow-lg shadow-black/10"
                                                : "bg-white text-zinc-500 border border-zinc-200 hover:border-black hover:text-black"
                                                }`}
                                        >
                                            <s.icon className="h-3.5 w-3.5" />
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Résultats: {filteredOrders.length}</span>
                                    <button className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-700 hover:bg-zinc-50">
                                        <Filter className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Filtres</span>
                                    </button>
                                </div>
                            </div>

                            {/* Desktop Table View & Mobile Card View */}
                            <div className="space-y-4">
                                {/* Mobile View: Cards */}
                                <div className="grid grid-cols-1 gap-4 lg:hidden">
                                    {filteredOrders.length === 0 ? (
                                        <div className="rounded-[32px] border border-zinc-200 bg-white p-12 text-center">
                                            <div className="mx-auto flex flex-col items-center justify-center space-y-4">
                                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50">
                                                    <Search className="h-8 w-8 text-zinc-200" />
                                                </div>
                                                <p className="font-bold text-zinc-900 uppercase tracking-tight">Aucun résultat</p>
                                            </div>
                                        </div>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                onClick={() => setSelectedOrder(order)}
                                                className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm active:scale-[0.98] transition-all"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                                    </div>
                                                    <StatusBadge status={order.status} />
                                                </div>

                                                <div className="mb-4">
                                                    <h3 className="text-lg font-black tracking-tight text-zinc-900">{order.full_name}</h3>
                                                    <div className="flex items-center gap-1.5 mt-1 text-sm font-medium text-zinc-500">
                                                        <Phone className="h-3.5 w-3.5" /> {order.phone}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 uppercase">
                                                        <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                                                        {order.wilaya}
                                                    </div>
                                                    <div className="text-lg font-black tracking-tight text-black">
                                                        {order.total_price.toLocaleString()} <span className="text-[10px] font-bold text-zinc-400 uppercase">DA</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Desktop View: Table */}
                                <div className="hidden lg:block overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">
                                                <tr>
                                                    <th className="px-8 py-6">Date</th>
                                                    <th className="px-8 py-6">Client</th>
                                                    <th className="px-8 py-6">Localisation</th>
                                                    <th className="px-8 py-6">Type</th>
                                                    <th className="px-8 py-6">Total</th>
                                                    <th className="px-8 py-6">Statut</th>
                                                    <th className="px-8 py-6"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-50">
                                                {filteredOrders.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={7} className="px-8 py-32 text-center">
                                                            <div className="mx-auto flex max-w-[300px] flex-col items-center justify-center space-y-4">
                                                                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-50">
                                                                    <Search className="h-10 w-10 text-zinc-200" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="font-bold text-zinc-900 uppercase tracking-tight">Aucun résultat</p>
                                                                    <p className="text-xs text-zinc-500 font-medium">Réessayez avec des critères de recherche ou de filtrage différents.</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : filteredOrders.map((order) => (
                                                    <tr key={order.id} className="group hover:bg-zinc-50/30 transition-all cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                {new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="font-black text-sm tracking-tight text-zinc-900">{order.full_name}</div>
                                                            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-medium text-zinc-500">
                                                                <Phone className="h-3 w-3" /> {order.phone}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 uppercase tracking-tighter">
                                                                <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                                                                {order.wilaya}
                                                            </div>
                                                            <div className="ml-5 text-[10px] font-medium text-zinc-400">{order.commune}</div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <span className={`rounded-lg px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest ${order.delivery_type === 'home'
                                                                ? 'bg-indigo-50 text-indigo-700'
                                                                : 'bg-zinc-100 text-zinc-600'
                                                                }`}>
                                                                {order.delivery_type === 'home' ? 'Domicile' : 'Bureau'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="text-sm font-black tracking-tight text-zinc-900 md:text-base">
                                                                {order.total_price.toLocaleString()} <span className="text-[10px] font-bold text-zinc-400 uppercase">DA</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                                className="h-10 w-full min-w-[130px] rounded-xl border border-zinc-200 bg-white px-3 text-[11px] font-black uppercase tracking-widest outline-none transition-all focus:ring-1 focus:ring-black text-zinc-900"
                                                            >
                                                                <option value="pending">🟡 En attente</option>
                                                                <option value="confirmed">🟢 Confirmé</option>
                                                                <option value="shipped">🔵 Expédié</option>
                                                                <option value="delivered">🟣 Livré</option>
                                                                <option value="cancelled">🔴 Annulé</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 group-hover:bg-black group-hover:text-white transition-all duration-300 text-zinc-500">
                                                                <ChevronRight className="h-4 w-4" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Order Details Modal Popup */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                        onClick={() => setSelectedOrder(null)}
                    ></div>

                    <div className="relative z-10 w-full h-full sm:h-auto max-w-2xl max-h-screen sm:max-h-[90vh] overflow-hidden sm:rounded-[32px] border border-zinc-200 bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                        <div className="flex flex-col h-full sm:max-h-[90vh]">
                            {/* Sticky Header */}
                            <header className="flex items-center justify-between p-6 sm:p-8 pb-4 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
                                <div className="space-y-1">
                                    <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-zinc-900 leading-tight">Détails Commande</h2>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                        <Package className="h-3 w-3" /> ID: {selectedOrder.id.split('-')[0]}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-500 transition-all hover:bg-black hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </header>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8 pt-4 space-y-10 scrollbar-hide">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                                    {/* Left Column: Customer & Status */}
                                    <div className="space-y-8 sm:space-y-10">
                                        <section className="space-y-4 sm:space-y-6">
                                            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">
                                                <Users className="h-3.5 w-3.5" /> Information Client
                                            </h3>
                                            <div className="rounded-2xl sm:rounded-3xl border border-zinc-100 bg-zinc-50/50 p-5 sm:p-6 space-y-6">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400/60">Nom Complet</p>
                                                    <p className="text-lg sm:text-xl font-black text-zinc-800">{selectedOrder.full_name}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400/60">Téléphone</p>
                                                    <a href={`tel:${selectedOrder.phone}`} className="inline-flex items-center gap-2 text-base sm:text-lg font-black text-black hover:opacity-70 transition-opacity">
                                                        <Phone className="h-4 w-4 text-zinc-400" /> {selectedOrder.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="space-y-4 sm:space-y-6">
                                            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">
                                                <RefreshCw className="h-3.5 w-3.5" /> Statut de l'ordre
                                            </h3>
                                            <div className="grid grid-cols-1 gap-2 p-1 rounded-2xl sm:rounded-3xl border border-zinc-100 bg-zinc-50/50">
                                                {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
                                                    <button
                                                        key={st}
                                                        onClick={() => updateStatus(selectedOrder.id, st)}
                                                        className={`flex items-center justify-between rounded-xl sm:rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.1em] transition-all ${selectedOrder.status === st
                                                            ? "bg-black text-white shadow-xl"
                                                            : "text-zinc-400 hover:text-black hover:bg-white"
                                                            }`}
                                                    >
                                                        {st === 'pending' ? 'En attente' : st === 'confirmed' ? 'Confirmé' : st === 'shipped' ? 'Expédié' : st === 'delivered' ? 'Livré' : 'Annulé'}
                                                        {selectedOrder.status === st && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right Column: Logistics */}
                                    <div className="space-y-8 sm:space-y-10">
                                        <section className="space-y-4 sm:space-y-6">
                                            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">
                                                <Truck className="h-3.5 w-3.5" /> Logistique
                                            </h3>
                                            <div className="rounded-2xl sm:rounded-3xl border border-zinc-100 bg-zinc-50/50 p-5 sm:p-6 space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400/60">Wilaya</p>
                                                        <p className="font-black text-zinc-800">{selectedOrder.wilaya}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400/60">Commune</p>
                                                        <p className="font-black text-zinc-800">{selectedOrder.commune}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400/60">Adresse</p>
                                                    <div className="rounded-xl bg-white p-4 text-xs font-medium leading-relaxed shadow-sm border border-zinc-50">
                                                        {selectedOrder.address}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between rounded-xl bg-zinc-900 px-4 py-3 text-white">
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Livraison</span>
                                                    <span className="text-[11px] font-black uppercase">{selectedOrder.delivery_type === 'home' ? 'Domicile' : 'Bureau'}</span>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Quick Actions */}
                                        <section className="space-y-3 sm:space-y-4 border-t border-zinc-100 pt-8 mt-2 md:border-none md:pt-0 md:mt-0">
                                            <button className="w-full flex items-center justify-center gap-3 rounded-xl sm:rounded-2xl bg-black py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800">
                                                Imprimer Facture
                                            </button>
                                            <button className="w-full rounded-xl sm:rounded-2xl border border-red-100 py-4 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all">
                                                Supprimer cette commande
                                            </button>
                                        </section>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Price Block */}
                            <footer className="p-6 sm:p-8 pt-4 flex-shrink-0 bg-white border-t border-zinc-50 sm:border-none">
                                <div className="flex items-center justify-between p-5 sm:p-6 sm:px-10 rounded-2xl sm:rounded-[32px] bg-zinc-900 text-white shadow-xl shadow-zinc-200/50">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Total à payer</p>
                                        <p className="text-2xl sm:text-3xl font-black tracking-tighter">{selectedOrder.total_price.toLocaleString()} DA</p>
                                    </div>
                                    <CheckCircle2 size={32} className="opacity-20 translate-x-2 sm:translate-x-4 sm:w-10 sm:h-10" />
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'pending':
            return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-600 shrink-0">🟡 En attente</span>;
        case 'confirmed':
            return <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-green-600 shrink-0">🟢 Confirmé</span>;
        case 'shipped':
            return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-600 shrink-0">🔵 Expédié</span>;
        case 'delivered':
            return <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-600 shrink-0">🟣 Livré</span>;
        case 'cancelled':
            return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-600 shrink-0">🔴 Annulé</span>;
        default: return <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{status}</span>;
    }
}
