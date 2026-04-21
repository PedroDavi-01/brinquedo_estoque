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
import { ImagePlus, X, Save, Plus, Package, Loader2 } from "lucide-react";
import { createProduto, updateProduto } from "@/lib/actions/produtos";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";

interface ProdutoModalProps {
  produto?: any;
  onSuccess?: () => void;
}

export function ProdutoModal({ produto, onSuccess }: ProdutoModalProps) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(produto && produto.id);

  useEffect(() => {
    if (open) {
      // Ajustado para aceitar webp ou png no preview
      setImagePreview(produto?.imagem ? `data:image/webp;base64,${produto.imagem}` : null);
    }
  }, [open, produto]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const toastId = toast.loading("Otimizando imagem...");

    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: 0.90
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        toast.success("Imagem otimizada!", { id: toastId });
        setIsCompressing(false);
      };
    } catch (error) {
      toast.error("Erro ao processar imagem.", { id: toastId });
      setIsCompressing(false);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    // Remove o prefixo data:image/... para salvar apenas a string base64 pura
    const base64Limpo = imagePreview?.includes(",") 
      ? imagePreview.split(",")[1] 
      : imagePreview;

    const res = isEditing 
      ? await updateProduto(produto.id, { ...data, imagem: base64Limpo }) 
      : await createProduto({ ...data, imagem: base64Limpo });

    if (res.success) {
      setOpen(false);
      onSuccess?.();
    } else {
      toast.error("Erro ao salvar produto.");
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
      
      <DialogContent className="rounded-[32px] sm:max-w-[480px] border-none p-6 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 italic uppercase">
            <Package className="text-blue-600" size={22} />
            {isEditing ? "Editar Cadastro" : "Novo Brinquedo"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex flex-col items-center gap-2">
            <div 
              onClick={() => !isCompressing && fileInputRef.current?.click()}
              className="group relative w-full h-40 rounded-[24px] border-4 border-dashed border-slate-100 bg-slate-50 flex items-center justify-center cursor-pointer overflow-hidden hover:bg-blue-50 transition-all"
            >
              {isCompressing ? (
                <Loader2 className="animate-spin text-blue-600" size={32} />
              ) : imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-400">
                  <ImagePlus size={28} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Adicionar Foto</span>
                </div>
              )}
            </div>
            {imagePreview && !isCompressing && (
              <button type="button" onClick={() => setImagePreview(null)} className="text-[10px] font-black text-red-400 uppercase flex items-center gap-1">
                <X size={12} /> Remover Foto
              </button>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome do Brinquedo</label>
              <Input name="nome" defaultValue={produto?.nome} required className="rounded-xl h-11 bg-slate-50 border-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Categoria</label>
                <Input name="categoria" defaultValue={produto?.categoria} placeholder="Ex: Bonecos" required className="rounded-xl h-11 bg-slate-50 border-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Idade</label>
                <Input name="faixaEtaria" defaultValue={produto?.faixaEtaria} placeholder="Ex: 5+" required className="rounded-xl h-11 bg-slate-50 border-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Preço de Venda (R$)</label>
              <Input name="preco" type="number" step="0.01" defaultValue={produto?.preco} required className="rounded-xl h-11 bg-slate-50 border-none font-bold text-blue-600" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Qtd Atual</label>
                <Input name="qtdAtual" type="number" defaultValue={produto?.qtdAtual} required className="rounded-xl h-11 bg-slate-50 border-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Qtd Mínima</label>
                <Input name="qtdMinima" type="number" defaultValue={produto?.qtdMinima} required className="rounded-xl h-11 bg-slate-50 border-none" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isCompressing} className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-[20px] font-black shadow-lg shadow-blue-100 flex gap-2">
              <Save size={18} />
              {isEditing ? "SALVAR ALTERAÇÕES" : "FINALIZAR CADASTRO"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}