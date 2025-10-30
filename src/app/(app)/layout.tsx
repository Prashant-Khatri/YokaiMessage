"use client"
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathname=usePathname()
    const hideNavbar=pathname.startsWith('/u/');
  return (
    <div>
      {
        !hideNavbar && <Navbar/>
      }
        {children}
    </div>
  );
}
