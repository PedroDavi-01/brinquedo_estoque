"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await loginAction({ email, senha });

      if (res.success && res.user) {
        localStorage.setItem("user_cargo", res.user.cargo);
        localStorage.setItem("user_nome", res.user.nome);
        localStorage.setItem("user_id", String(res.user.id)); 
        
        toast.success(`Bem-vindo, ${res.user.nome}!`);

        router.push("/dashboard");
        router.refresh();
      } else {
        const mensagemErro = res.message || "Erro ao realizar login.";
        setErro(mensagemErro);
        toast.error(mensagemErro);
      }
    } catch (err) {
      setErro("Erro crítico de conexão.");
      toast.error("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {/* Ajustes de escala para 768p:
          - max-w-[340px]: menos largo para não parecer "gordo".
          - scale-95: reduz o tamanho total em 5% para caber na altura da tela.
      */}
      <Card className="w-full max-w-[340px] border-none shadow-2xl rounded-[24px] bg-white overflow-hidden transform scale-95 md:scale-100">
        <CardHeader className="text-center pt-8 pb-2 space-y-1">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
              <Package size={24} />
            </div>
          </div>
          <CardTitle className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">
            Recanto <span className="text-blue-600">Infância</span>
          </CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
            Gestão de Estoque e Inventário
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-wider">
                E-mail de acesso
              </label>
              <Input 
                className="h-[42px] text-[14px] border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all rounded-xl px-4" 
                type="email"
                placeholder="exemplo@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-wider">
                Senha
              </label>
              <Input 
                className="h-[42px] text-[14px] border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all rounded-xl px-4" 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && (
              <div className="flex items-center gap-2 text-[10px] text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100 font-bold animate-in fade-in zoom-in duration-200">
                <AlertCircle size={12} />
                {erro}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={carregando}
              className="w-full bg-blue-600 hover:bg-blue-700 h-[46px] text-[14px] font-black uppercase italic rounded-xl shadow-lg shadow-blue-100 transition-all mt-2 active:scale-95 flex gap-2"
            >
              {carregando ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Verificando...
                </>
              ) : (
                "Entrar no Sistema"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}