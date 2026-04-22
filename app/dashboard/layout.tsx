// app/dashboard/layout.tsx
import { Sidebar } from "@/components/sidebar";
import { Menu } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger, 
  DialogTitle, 
  DialogHeader 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50" suppressHydrationWarning>
      
      {/* HEADER MOBILE */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b sticky top-0 z-[100] w-full h-20">
        <h2 className="text-blue-600 font-black text-2xl tracking-tighter italic leading-none">RECANTO</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-slate-50 border-slate-200 text-slate-900 h-12 w-12 rounded-xl"
            >
              <Menu size={28} />
            </Button>
          </DialogTrigger>

          <DialogContent 
            className="fixed inset-y-0 left-0 z-[120] w-72 h-screen p-0 border-none rounded-none bg-white 
            !translate-x-0 !translate-y-0 !top-0 !left-0 !flex !flex-col !justify-start !items-stretch
            data-[state=open]:animate-in data-[state=closed]:animate-out 
            data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left 
            duration-300 sm:max-w-none shadow-2xl"
          >
            <DialogHeader className="sr-only">
              <VisuallyHidden.Root>
                <DialogTitle>Menu</DialogTitle>
              </VisuallyHidden.Root>
            </DialogHeader>
            
            {/* Sidebar agora vai ser empurrada para o topo do Dialog */}
            <div className="flex-1 w-full h-full overflow-y-auto">
                <Sidebar className="w-full h-full border-none" />
            </div>
          </DialogContent>
        </Dialog>
      </header>

      {/* SIDEBAR DESKTOP */}
      <Sidebar className="hidden lg:flex shrink-0 h-screen sticky top-0" />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-x-hidden" suppressHydrationWarning>
        {children}
      </main>
    </div>
  );
}