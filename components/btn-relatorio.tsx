"use client";

import { FileText } from "lucide-react";

export function BtnRelatorio({ dados }: { dados: any[] }) {
  const gerarPDF = async () => {
    // Importação dinâmica apenas na hora do clique para não travar o servidor
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();
    doc.text("RECANTO DA INFANCIA - INVENTARIO", 14, 20);
    
    autoTable(doc, {
      startY: 30,
      head: [['Produto', 'Qtd Atual', 'Status']],
      body: dados.map(p => [
        p.nome, 
        p.qtdAtual, 
        p.qtdAtual <= p.qtdMinima ? 'CRITICO' : 'OK'
      ]),
    });

    doc.save("estoque.pdf");
  };

  return (
    <button 
      onClick={gerarPDF}
      className="w-full bg-slate-800 py-4 rounded-[22px] font-black text-blue-400 border border-slate-700 mt-4 uppercase text-[10px] tracking-widest leading-none flex items-center justify-center gap-2"
    >
      <FileText size={14} />
      Gerar Relatório PDF
    </button>
  );
}