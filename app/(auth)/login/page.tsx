"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner"; // ADICIONADO: Import do toast

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
      <Card className="w-full max-w-[380px] border-none shadow-2xl rounded-[32px] bg-white overflow-hidden">
        <CardHeader className="text-center pt-10 pb-4 space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Package size={32} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
            RECANTO DA INFÂNCIA
          </CardTitle>
          <CardDescription className="text-sm font-medium text-slate-400">
            Gestão de Estoque e Inventário
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase ml-1">
                E-mail de acesso
              </label>
              <Input 
                className="h-[48px] text-[16px] border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all rounded-2xl px-4" 
                type="email"
                placeholder="exemplo@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase ml-1">
                Senha
              </label>
              <Input 
                className="h-[48px] text-[16px] border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all rounded-2xl px-4" 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && (
              <div className="flex items-center gap-2 text-[11px] text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-bold animate-in fade-in zoom-in duration-200">
                <AlertCircle size={14} />
                {erro}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={carregando}
              className="w-full bg-blue-600 hover:bg-blue-700 h-[50px] text-[16px] font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all mt-2 active:scale-95 flex gap-2"
            >
              {carregando ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
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