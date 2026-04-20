"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  LayoutDashboard, 
  AlertTriangle,
  ClipboardList
} from "lucide-react";
import { toast } from "sonner"; // ADICIONADO: Import do toast
import { BtnRelatorio } from "@/components/btn-relatorio";

import { getDashboardData } from "@/lib/actions/dashboard"; 

export default function DashboardPage() {
  const [cargo, setCargo] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCargo(localStorage.getItem("user_cargo"));
    
    async function fetchData() {
      try {
        const res = await getDashboardData();
        setData(res);
        // ADICIONADO: Feedback visual ao terminar de carregar
        toast.success("Dados atualizados com sucesso!");
      } catch (error) {
        toast.error("Erro ao carregar os dados do painel.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !data) return <div className="p-8 font-black uppercase italic text-slate-400">Carregando Dashboard...</div>;

  return (
    <div className="p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <LayoutDashboard size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Visão Geral</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 italic uppercase leading-none tracking-tighter">
          Painel de Controle
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* CARDS DE MÉTRICAS (VISÍVEL PARA TODOS) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <Package className="text-blue-600 mb-4" size={24} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Produtos</p>
            <h2 className="text-3xl font-black text-slate-900 italic uppercase">{data.totalProdutos}</h2>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <ArrowUpRight className="text-green-600 mb-4" size={24} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entradas (Mês)</p>
            <h2 className="text-3xl font-black text-slate-900 italic uppercase">{data.totalEntradas}</h2>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <AlertTriangle className="text-orange-500 mb-4" size={24} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estoque Baixo</p>
            <h2 className="text-3xl font-black text-slate-900 italic uppercase">{data.estoqueBaixo}</h2>
          </div>

          {/* TABELA DE ÚLTIMAS MOVIMENTAÇÕES (VISÍVEL PARA TODOS) */}
          <div className="md:col-span-3 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black uppercase italic text-slate-900 flex items-center gap-2">
                <ClipboardList size={18} className="text-blue-600" /> Fluxo Recente
              </h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Qtd</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.ultimasMovimentacoes.map((mov: any) => (
                  <tr key={mov.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-4 text-xs font-bold uppercase">{mov.produtoNome}</td>
                    <td className="px-8 py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${mov.tipo === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {mov.tipo}
                      </span>
                    </td>
                    <td className={`px-8 py-4 text-right font-black italic text-xs ${mov.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                      {mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.quantidade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIDEBAR DE AÇÕES */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-blue-900/20">
            <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none mb-2">Ações Rápidas</h3>
            <p className="text-slate-400 text-[10px] mb-8 font-bold uppercase tracking-widest">
              Nível: <span className="text-blue-400">{cargo || "Verificando..."}</span>
            </p>
            
            <div className="space-y-3">
              <Link href="/dashboard/movimentacoes?novo=true&tipo=ENTRADA" className="block">
                <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-[22px] font-black uppercase text-xs transition-all active:scale-95 shadow-lg shadow-blue-600/20 leading-none">
                  Nova Entrada
                </button>
              </Link>

              {cargo !== "FUNCIONARIO" && (
                <>
                  <Link href="/dashboard/movimentacoes?novo=true&tipo=SAIDA" className="block">
                    <button className="w-full bg-white/5 hover:bg-white/10 py-4 rounded-[22px] font-black uppercase text-xs transition-all active:scale-95 leading-none">
                      Registrar Saída
                    </button>
                  </Link>
                  
                  <BtnRelatorio dados={data.listaProdutos} />
                </>
              )}

              {cargo === "ADMIN" && (
                <Link href="/dashboard/estoque" className="block pt-4 border-t border-white/10">
                  <button className="w-full text-slate-400 hover:text-white py-2 font-black uppercase text-[10px] transition-all">
                    Configurações de Inventário
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className="bg-blue-600 rounded-[40px] p-8 text-white">
            <p className="text-[10px] font-black uppercase opacity-60 mb-1">Usuário Ativo</p>
            <h4 className="font-black uppercase italic leading-none">{localStorage.getItem("user_nome") || "Usuário"}</h4>
          </div>
        </div>

      </div>
    </div>
  );
}