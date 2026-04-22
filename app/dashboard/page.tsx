"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, 
  ArrowUpRight, 
  LayoutDashboard, 
  AlertTriangle,
  ClipboardList
} from "lucide-react";
import { toast } from "sonner";
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
        toast.success("Dados atualizados!");
      } catch (error) {
        toast.error("Erro ao carregar o painel.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 font-black uppercase italic text-slate-400 animate-pulse">
        Carregando Dashboard...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-[#F8FAFC] min-h-screen pb-24 lg:pb-8">
      
      {/* HEADER - Ajustado para mobile */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <LayoutDashboard size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Visão Geral</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 italic uppercase leading-tight tracking-tighter">
          Painel de Controle
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* COLUNA PRINCIPAL (MÉTRICAS E TABELA) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* CARDS DE MÉTRICAS - No mobile fica 1 por linha, no tablet 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm">
              <Package className="text-blue-600 mb-4" size={24} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Produtos</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 italic uppercase">{data.totalProdutos}</h2>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm">
              <ArrowUpRight className="text-green-600 mb-4" size={24} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entradas (Mês)</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 italic uppercase">{data.totalEntradas}</h2>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm">
              <AlertTriangle className="text-orange-500 mb-4" size={24} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estoque Baixo</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 italic uppercase">{data.estoqueBaixo}</h2>
            </div>
          </div>

          {/* TABELA DE ÚLTIMAS MOVIMENTAÇÕES - Com scroll horizontal no mobile */}
          <div className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black uppercase italic text-slate-900 flex items-center gap-2 text-sm md:text-base">
                <ClipboardList size={18} className="text-blue-600" /> Fluxo Recente
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                    <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                    <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Qtd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.ultimasMovimentacoes.map((mov: any) => (
                    <tr key={mov.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 md:px-8 py-4 text-xs font-bold uppercase truncate max-w-[150px]">{mov.produtoNome}</td>
                      <td className="px-6 md:px-8 py-4">
                        <span className={`text-[9px] md:text-[10px] font-black px-2 py-1 rounded-full uppercase ${mov.tipo === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {mov.tipo}
                        </span>
                      </td>
                      <td className={`px-6 md:px-8 py-4 text-right font-black italic text-xs ${mov.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                        {mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.quantidade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* COLUNA LATERAL (AÇÕES RÁPIDAS) - No mobile vai para baixo da tabela */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-white shadow-2xl shadow-blue-900/20">
            <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none mb-2">Ações Rápidas</h3>
            <p className="text-slate-400 text-[10px] mb-6 md:mb-8 font-bold uppercase tracking-widest">
              Nível: <span className="text-blue-400">{cargo || "Verificando..."}</span>
            </p>
            
            <div className="space-y-3">
              <Link href="/dashboard/movimentacoes?novo=true&tipo=ENTRADA" className="block">
                <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-[20px] font-black uppercase text-xs transition-all active:scale-95 shadow-lg shadow-blue-600/20 leading-none">
                  Nova Entrada
                </button>
              </Link>

              {cargo !== "FUNCIONARIO" && (
                <>
                  <Link href="/dashboard/movimentacoes?novo=true&tipo=SAIDA" className="block">
                    <button className="w-full bg-white/5 hover:bg-white/10 py-4 rounded-[20px] font-black uppercase text-xs transition-all active:scale-95 leading-none">
                      Registrar Saída
                    </button>
                  </Link>
                  <BtnRelatorio dados={data.listaProdutos} />
                </>
              )}
            </div>
          </div>

          <div className="bg-blue-600 rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-white">
            <p className="text-[10px] font-black uppercase opacity-60 mb-1">Usuário Ativo</p>
            <h4 className="font-black uppercase italic leading-none truncate">
              {typeof window !== "undefined" ? localStorage.getItem("user_nome") : "Usuário"}
            </h4>
          </div>
        </div>

      </div>
    </div>
  );
}