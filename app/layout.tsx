import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/Providers";
import { cookies } from "next/headers";
import ClientLayout from "./components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasSession = !!cookieStore.get("manager-session");

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}>
        <Providers>
          <ClientLayout hasSession={hasSession}>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
