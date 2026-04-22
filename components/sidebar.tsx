"use client";

import { usePathname, useRouter } from "next/navigation";
import { 
  Package, 
  Boxes, 
  ArrowLeftRight, 
  LogOut, 
  User, 
  LayoutDashboard, 
  Users 
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logoutAction } from "@/lib/actions/auth";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState<string | null>(null);

  useEffect(() => {
    setNome(localStorage.getItem("user_nome") || "Usuário");
    setCargo(localStorage.getItem("user_cargo"));
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAction();
      localStorage.clear();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const menuItems = [
    { name: "Visão Geral", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { name: "Estoque", icon: <Package size={20} />, href: "/dashboard/estoque" },
    { name: "Produtos", icon: <Boxes size={20} />, href: "/dashboard/produtos" },
    { name: "Movimentações", icon: <ArrowLeftRight size={20} />, href: "/dashboard/movimentacoes" },
  ];

  if (cargo === "ADMIN") {
    menuItems.push({ 
      name: "Usuários", 
      icon: <Users size={20} />, 
      href: "/dashboard/usuarios" 
    });
  }

  return (
    <aside className={`w-64 bg-white border-r border-slate-100 flex flex-col h-full ${className}`}>
      <div className="p-6">
        <h2 className="text-blue-600 font-black text-xl tracking-tighter italic leading-none">RECANTO</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sistema de Gestão</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]" 
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {item.icon}
              <span className="text-sm uppercase tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-50 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl">
          <div className="bg-blue-100 p-2 rounded-xl text-blue-600 shrink-0">
            <User size={18} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">{nome}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase leading-none italic">
              {cargo || "Online"}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all active:scale-95"
        >
          <LogOut size={20} />
          <span className="text-sm uppercase tracking-wide">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
}