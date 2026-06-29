import { LenisProvider } from "@/hooks/useLenis";
import { GSAPInitializer } from "@/hooks/useGSAP";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GSAPInitializer />
      <CustomCursor />
      
      <LenisProvider>
        <div className="frontend-wrap">
          <Navbar />
          {children}
        </div>
      </LenisProvider>
    </>
  );
}
