import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Metadata } from "next"; 

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"] 
});

export const metadata: Metadata = {
  title: "Recanto da Infância",
  description: "Gestão de Estoque",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={`${poppins.className} text-[14px] 2xl:text-[16px] bg-[#F8FAFC]`}>
        {children}
        <Toaster richColors position="top-center" /> 
      </body>
    </html>
  );
}