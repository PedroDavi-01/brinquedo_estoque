"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  AlertTriangle, 
  PieChart as PieChartIcon, 
  BarChart3, 
  ArrowRight, 
  Loader2 
} from "lucide-react";
import { getDadosEstoque } from "@/lib/actions/estoque";
import Link from "next/link";

// Imports Dinâmicos para evitar erros de SSR com Recharts
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import("recharts").then(m => m.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then(m => m.Pie), { ssr: false });
const BarChart = dynamic(() => import("recharts").then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then(m => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false });

export default function EstoquePage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-black italic uppercase text-slate-400 tracking-tighter">Preparando Dashboard...</p>
      </div>
    }>
      <EstoqueContent />
    </Suspense>
  );
}

function EstoqueContent() {
  const [mounted, setMounted] = useState(false);
  const [dados, setDados] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cargo, setCargo] = useState<string | null>(null); 

  useEffect(() => {
    setMounted(true);
    setCargo(localStorage.getItem("user_cargo")); 

    async function carregarDados() {
      try {
        const res = await getDadosEstoque();
        setDados(res);
      } catch (error) {
        console.error("Erro ao carregar dados do estoque:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  if (!mounted || loading || !dados) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-black italic uppercase text-slate-400 tracking-tighter">
          Sincronizando Banco de Dados...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <Package size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Dados em Tempo Real</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 italic uppercase leading-none tracking-tighter -mt-1">
          Inteligência de Estoque
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GRÁFICOS  */}
        <Card className="rounded-[40px] border-none shadow-sm bg-white p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><PieChartIcon size={20} /></div>
              <CardTitle className="text-sm font-black uppercase italic text-slate-900">Saúde do Inventário</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] p-0 flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dados.saude}
                  cx="50%" cy="50%" innerRadius={70} outerRadius={95}
                  paddingAngle={5} dataKey="value" isAnimationActive={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6]" /> Em Dia ({dados.saude[0]?.value || 0})
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]" /> Crítico ({dados.saude[1]?.value || 0})
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[40px] border-none shadow-sm bg-white p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><BarChart3 size={20} /></div>
              <CardTitle className="text-sm font-black uppercase italic text-slate-900">Itens por Categoria</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] p-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados.categorias} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="900" tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight="900" tick={{ fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="total" fill="#6366f1" radius={[12, 12, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* PRODUTOS CRÍTICOS */}
      <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><AlertTriangle size={24} /></div>
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Produtos em Alerta</h3>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Abaixo do estoque mínimo definido</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dados.produtosCriticos.map((prod: any) => (
            <div key={prod.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[30px] border border-slate-100 transition-all hover:bg-white hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-red-500 font-black italic">!</div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase italic leading-none">{prod.nome}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-md font-black italic">
                      {prod.quantidade} UNIDADES
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Mín: {prod.estoqueMinimo}</span>
                  </div>
                </div>
              </div>

              {cargo !== "FUNCIONARIO" && (
                <Link href={`/dashboard/movimentacoes?novo=true&produtoId=${prod.id}`}>
                  <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-all active:scale-95">
                    <ArrowRight size={18} />
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}