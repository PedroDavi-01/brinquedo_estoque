/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { criarMovimentacao } from "@/lib/actions/movimentacoes";
import { useSearchParams } from "next/navigation";

interface ModalProps {
  produtos: any[];
  defaultOpen?: boolean;
  defaultProdutoId?: string | null;
}

export function ModalMovimentacao({ produtos, defaultOpen, defaultProdutoId }: ModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const searchParams = useSearchParams();

  // Sincroniza o estado de abertura e o ID do usuário
  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (id) setUserId(Number(id));

    if (defaultOpen) {
      setOpen(true);
    }
  }, [defaultOpen]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) return alert("Usuário não identificado!");
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await criarMovimentacao({
      produtoId: Number(formData.get("produtoId")),
      tipo: formData.get("tipo") as "ENTRADA" | "SAIDA",
      quantidade: Number(formData.get("quantidade")),
      usuarioId: userId,
    });

    if (res.success) {
      setOpen(false);
      window.location.reload(); 
    } else {
      alert(res.error || "Erro ao salvar");
    }
    setLoading(false);
  }

  // Captura o tipo da URL para o rádio vir marcado (SAIDA ou ENTRADA)
  const tipoUrl = searchParams.get("tipo")?.toUpperCase();

  if (!open) return (
    <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs transition-all active:scale-95 shadow-lg shadow-blue-600/20 leading-none">
      <Plus size={18} /> Nova Movimentação
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black italic uppercase text-slate-900 leading-none">Registrar Fluxo</h2>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Produto</label>
            <select 
              name="produtoId" 
              required 
              defaultValue={defaultProdutoId || ""} 
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold mt-1 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            >
              <option value="" disabled>Selecione um produto</option>
              {produtos.map(p => (
                <option key={p.id} value={p.id}>{p.nome} (Estoque: {p.qtdAtual})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Operação</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <label className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-slate-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 cursor-pointer transition-all">
                <input 
                  type="radio" 
                  name="tipo" 
                  value="ENTRADA" 
                  defaultChecked={tipoUrl !== "SAIDA"} 
                  className="hidden" 
                />
                <span className="text-xs font-black uppercase italic">Entrada</span>
              </label>
              <label className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-slate-50 has-[:checked]:border-red-600 has-[:checked]:bg-red-50 cursor-pointer transition-all">
                <input 
                  type="radio" 
                  name="tipo" 
                  value="SAIDA" 
                  defaultChecked={tipoUrl === "SAIDA"} 
                  className="hidden" 
                />
                <span className="text-xs font-black uppercase italic">Saída</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Quantidade</label>
            <input type="number" name="quantidade" required min="1" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold mt-1 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black uppercase italic tracking-tighter hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 mt-4">
            {loading ? "Processando..." : "Confirmar Movimentação"}
          </button>
        </form>
      </div>
    </div>
  );
}