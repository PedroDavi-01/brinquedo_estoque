"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, X, Save, Plus, Package } from "lucide-react";
import { createProduto, updateProduto } from "@/lib/actions/produtos";

interface ProdutoModalProps {
  produto?: any;
  onSuccess?: () => void;
}

export function ProdutoModal({ produto, onSuccess }: ProdutoModalProps) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(produto && produto.id);

  useEffect(() => {
    if (open) {
      setImagePreview(produto?.imagem ? `data:image/png;base64,${produto.imagem}` : null);
    }
  }, [open, produto]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    const base64Limpo = imagePreview?.includes(",") 
      ? imagePreview.split(",")[1] 
      : imagePreview;

    const res = isEditing 
      ? await updateProduto(produto.id, { ...data, imagem: base64Limpo }) 
      : await createProduto({ ...data, imagem: base64Limpo });

    if (res.success) {
      setOpen(false);
      onSuccess?.();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50 rounded-xl px-4 h-9">
            Editar
          </Button>
        ) : (
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-[22px] h-12 px-6 font-bold flex gap-2 shadow-lg shadow-blue-100">
            <Plus size={20} /> Novo Produto
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="rounded-[40px] sm:max-w-[480px] border-none p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 italic uppercase">
            <Package className="text-blue-600" size={24} />
            {isEditing ? "Editar Cadastro" : "Novo Brinquedo"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
          <div className="flex flex-col items-center gap-3">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative w-full h-44 rounded-[32px] border-4 border-dashed border-slate-100 bg-slate-50 flex items-center justify-center cursor-pointer overflow-hidden hover:bg-blue-50 transition-all"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <ImagePlus size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Foto</span>
                </div>
              )}
            </div>
            {imagePreview && (
              <button type="button" onClick={() => setImagePreview(null)} className="text-[10px] font-black text-red-400 uppercase flex items-center gap-1">
                <X size={12} /> Remover Foto
              </button>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome</label>
              <Input name="nome" defaultValue={produto?.nome} required className="rounded-2xl h-12 bg-slate-50 border-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Categoria</label>
                <Input name="categoria" defaultValue={produto?.categoria} placeholder="Ex: Bonecos" required className="rounded-2xl h-12 bg-slate-50 border-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Idade</label>
                <Input name="faixaEtaria" defaultValue={produto?.faixaEtaria} placeholder="Ex: 5+" required className="rounded-2xl h-12 bg-slate-50 border-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Preço (R$)</label>
              <Input name="preco" type="number" step="0.01" defaultValue={produto?.preco} required className="rounded-2xl h-12 bg-slate-50 border-none font-bold text-blue-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Estoque Atual</label>
                <Input name="qtdAtual" type="number" defaultValue={produto?.qtdAtual} required className="rounded-2xl h-12 bg-slate-50 border-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Estoque Mínimo</label>
                <Input name="qtdMinima" type="number" defaultValue={produto?.qtdMinima} required className="rounded-2xl h-12 bg-slate-50 border-none" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-16 rounded-[24px] font-black text-md shadow-xl shadow-blue-100 flex gap-2">
              <Save size={20} />
              {isEditing ? "SALVAR ALTERAÇÕES" : "CADASTRAR"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}