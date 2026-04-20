"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, Trash2, Edit, ShieldCheck, X, Loader2 } from "lucide-react";
import { getUsuarios, deleteUsuario, createUsuario } from "@/lib/actions/usuarios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "FUNCIONARIO"
  });

  async function carregarUsuarios() {
    setLoading(true);
    const dados = await getUsuarios();
    setUsuarios(dados);
    setLoading(false);
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await createUsuario(formData);
    
    if (res.success) {
      setIsModalOpen(false);
      setFormData({ nome: "", email: "", senha: "", cargo: "FUNCIONARIO" });
      carregarUsuarios();
    } else {
      alert("Erro ao criar usuário.");
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja realmente excluir este usuário? Isso é irreversível.")) {
      const res = await deleteUsuario(id);
      if (res.success) {
        carregarUsuarios();
      } else {
        alert("Erro ao excluir usuário.");
      }
    }
  };

  if (loading) return <div className="p-8 font-black uppercase italic text-slate-400">Carregando Usuários...</div>;

  return (
    <div className="p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Users size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Administração</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 italic uppercase leading-none tracking-tighter">
            Gestão de Usuários
          </h1>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-[22px] font-black uppercase text-xs transition-all active:scale-95 shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          <UserPlus size={18} /> Novo Usuário
        </button>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome / E-mail</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {usuarios.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-6">
                  <p className="text-sm font-black uppercase italic text-slate-900">{user.nome}</p>
                  <p className="text-[10px] font-bold text-slate-400">{user.email}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1 w-fit ${
                    user.cargo === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                    user.cargo === 'GERENTE' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <ShieldCheck size={12} /> {user.cargo}
                  </span>
                </td>
                <td className="px-8 py-6 text-right space-x-2">
                  <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CRIAÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black uppercase italic text-slate-900">Novo Usuário</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome Completo</label>
                <Input 
                  required 
                  className="rounded-2xl border-slate-100" 
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">E-mail</label>
                <Input 
                  required type="email" 
                  className="rounded-2xl border-slate-100"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Senha Inicial</label>
                <Input 
                  required type="password" 
                  className="rounded-2xl border-slate-100"
                  value={formData.senha}
                  onChange={e => setFormData({...formData, senha: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Cargo / Nível</label>
                <select 
                  className="w-full h-10 px-3 rounded-2xl border border-slate-100 text-sm font-bold uppercase"
                  value={formData.cargo}
                  onChange={e => setFormData({...formData, cargo: e.target.value})}
                >
                  <option value="FUNCIONARIO">Funcionário</option>
                  <option value="GERENTE">Gerente</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <Button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl font-black uppercase text-xs shadow-lg shadow-blue-100 mt-4"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : "Criar Conta"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}