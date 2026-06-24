import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Provider } from "@/providers";
import { Toaster } from "@/components/ui/toaster";

// const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ weight: "400", subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Data-X",
  description: "Mangement System",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className}  bg-custom-app-bg`} style={{background: "#f7f7f7", color: "#333333"}}>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}