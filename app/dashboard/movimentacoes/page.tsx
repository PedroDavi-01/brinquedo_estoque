"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { History, Calendar, User, Package, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { ModalMovimentacao } from "@/components/modal-movimentacao";
import { getMovimentacoesData } from "@/lib/actions/movimentacoes"; 

export default function MovimentacoesPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ listaProdutos: any[], todasMovimentacoes: any[] }>({
    listaProdutos: [],
    todasMovimentacoes: []
  });

  // Busca os dados do banco via Action
  useEffect(() => {
    async function fetchData() {
      const res = await getMovimentacoesData();
      setData(res);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Captura os parâmetros da URL para abrir o modal automaticamente
  const deveAbrirModal = searchParams.get("novo") === "true";
  const produtoIdPreSelecionado = searchParams.get("produtoId");

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="font-black italic uppercase text-slate-400 tracking-tighter">Carregando Fluxo...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <History size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Relatórios de Estoque</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 italic uppercase leading-none tracking-tighter -mt-1">
            Histórico de Fluxo
          </h1>
          <p className="text-slate-500 font-medium mt-2 leading-none">
            Acompanhe as entradas e saídas do <span className="text-blue-600 font-bold leading-none">Recanto da Infância</span>.
          </p>
        </div>

        {/* MODAL: Passamos o ID vindo da URL como default */}
        <ModalMovimentacao 
          produtos={data.listaProdutos} 
          defaultOpen={deveAbrirModal}
          defaultProdutoId={produtoIdPreSelecionado}
        />
      </div>

      {/* TABELA "PUDIM" */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantidade</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsável</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.todasMovimentacoes.length > 0 ? (
              data.todasMovimentacoes.map((mov) => (
                <tr key={mov.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <Package size={16} />
                      </div>
                      <span className="text-sm font-black text-slate-900 uppercase italic leading-none">
                        {mov.produtoNome}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight leading-none ${
                      mov.tipo === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {mov.tipo === 'ENTRADA' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {mov.tipo}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-sm font-black italic leading-none ${mov.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                      {mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.quantidade}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <User size={14} className="text-slate-400" />
                      <span className="text-xs font-bold uppercase tracking-tighter leading-none">
                        {mov.usuarioNome}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="inline-flex items-center gap-2 text-slate-400">
                      <Calendar size={14} />
                      <span className="text-xs font-bold leading-none">
                        {new Date(mov.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                   <p className="text-sm text-slate-400 font-bold uppercase italic tracking-widest">Nenhuma movimentação.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}