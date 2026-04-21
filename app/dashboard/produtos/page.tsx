'use client';

import { useEffect, useState, useCallback, Suspense } from "react";
import { getProdutos, deleteProduto } from "@/lib/actions/produtos";
import { ProdutoModal } from "../../../components/novo-produto";
import { toast } from "sonner";
import Image from "next/image";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Filter, Package, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ProdutosPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-2 text-slate-400 font-bold italic">
          <Loader2 className="animate-spin" size={32} />
          <span>Sincronizando Estoque...</span>
        </div>
      </div>
    }>
      <ProdutosContent />
    </Suspense>
  );
}

function ProdutosContent() {
  const [listaProdutos, setListaProdutos] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [cargo, setCargo] = useState<string | null>(null);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await getProdutos(busca);
      setListaProdutos(dados || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao sincronizar produtos com o servidor.");
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cargoSalvo = localStorage.getItem("user_cargo");
      if (cargoSalvo) {
        setCargo(cargoSalvo.toUpperCase());
      }
    }
    
    const timeoutId = setTimeout(carregarDados, 300);
    return () => clearTimeout(timeoutId);
  }, [carregarDados]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
            Recanto <span className="text-blue-600">Estoque</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Gestão de brinquedos e produtos.</p>
        </div>
        
        {cargo !== "FUNCIONARIO" && (
          <ProdutoModal onSuccess={() => {
            carregarDados();
            toast.success("Operação realizada com sucesso!");
          }} />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Pesquisar no Recanto..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-12 h-14 rounded-[22px] border-none bg-white shadow-sm text-[16px]"
            />
          </div>
          <Button variant="outline" className="h-14 w-14 rounded-[22px] border-none bg-white shadow-sm">
            <Filter size={20} className="text-slate-600" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-black text-slate-400 uppercase text-[10px] pl-8 h-14">Foto</TableHead>
              <TableHead className="font-black text-slate-400 uppercase text-[10px]">Brinquedo</TableHead>
              <TableHead className="font-black text-slate-400 uppercase text-[10px]">Categoria / Idade</TableHead>
              <TableHead className="font-black text-slate-400 uppercase text-[10px]">Preço</TableHead>
              <TableHead className="font-black text-slate-400 uppercase text-[10px]">Estoque</TableHead>
              <TableHead className="font-black text-slate-400 uppercase text-[10px] text-right pr-8">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carregando ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-400 font-bold italic">
                    <Loader2 className="animate-spin" size={18} />
                    Sincronizando...
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              listaProdutos.map((prod) => (
                <TableRow key={prod.id} className="group hover:bg-slate-50/40 border-slate-50">
<TableCell className="pl-8 py-4">
  <div className="relative w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-50 shrink-0">
    {prod.imagem ? (
      <Image 
        src={`data:image/webp;base64,${prod.imagem}`} 
        alt={prod.nome}
        fill 
        className="object-cover" 
        sizes="56px" 
        unoptimized 
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <Package size={22} className="text-slate-300" />
      </div>
    )}
  </div>
</TableCell>

                  <TableCell className="font-bold text-slate-900">{prod.nome}</TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">
                        {prod.categoria}
                      </span>
                      <span className="text-slate-400 font-bold text-[11px]">/ {prod.faixaEtaria}</span>
                    </div>
                  </TableCell>

                  <TableCell className="font-black text-slate-900">R$ {prod.preco}</TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className={`font-black ${Number(prod.qtdAtual) <= Number(prod.qtdMinima) ? 'text-red-500' : 'text-slate-900'}`}>
                          {prod.qtdAtual} un.
                        </span>
                        {Number(prod.qtdAtual) <= Number(prod.qtdMinima) && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Mín: {prod.qtdMinima}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                      {(cargo === "ADMIN" || cargo === "GERENTE") && (
                        <ProdutoModal produto={prod} onSuccess={() => {
                          carregarDados();
                          toast.success("Produto editado!");
                        }} />
                      )}
                      
                      {cargo === "ADMIN" && (
                        <button
                          onClick={async () => {
                            if (confirm(`Excluir "${prod.nome}" permanentemente?`)) {
                              const res = await deleteProduto(prod.id);
                              if (res.success) {
                                toast.success("Produto removido com sucesso.");
                                carregarDados();
                              } else {
                                toast.error("Não foi possível excluir o produto.");
                              }
                            }
                          }}
                          className="text-[12px] font-black text-red-500 uppercase hover:bg-red-100 px-4 py-2 rounded-xl transition-all active:scale-95 border border-transparent hover:border-red-200"
                        >
                          Excluir
                        </button>
                      )}

                      {cargo === "FUNCIONARIO" && (
                        <span className="text-[9px] font-black uppercase text-slate-300 italic">Somente Leitura</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}