import ColorBends from "@/components/reactbits/colorBends";
import Prism from "@/components/reactbits/prism";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen text-foreground flex flex-col overflow-hidden">
      {/* Background wrapper — required */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Prism
          animationType="3drotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-700">
          A <span className="text-primary">smarter</span>,{" "}
          <span className="text-accent">cleaner</span> social experience is
          coming....
        </h1>

        <Link href="/waitlist">
          <Button className="px-8 py-6 text-lg">Join the Waitlist</Button>
        </Link>

        <p className="text-sm opacity-75">
          No spam. We’ll notify you when we open.
        </p>
      </div>
    </div>
  );
}
