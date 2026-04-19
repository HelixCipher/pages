import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("hold"), 100);
    const exitTimer = setTimeout(() => setPhase("exit"), 2200);
    const doneTimer = setTimeout(onComplete, 2800);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Scanline overlay */}
      <div className="scanline absolute inset-0" />

      {/* Cipher logo */}
      <div
        className={`relative transition-all duration-700 ${
          phase === "enter" ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Outer ring */}
        <div className="animate-cipher-spin absolute inset-0 flex items-center justify-center">
          <div className="h-28 w-28 rounded-full border border-primary/30" />
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: "cipher-spin 5s linear infinite reverse" }}
        >
          <div className="h-20 w-20 rounded-full border border-dashed border-primary/20" />
        </div>

        <div className="relative flex h-28 w-28 items-center justify-center">
          <Shield className="h-12 w-12 text-primary text-glow animate-pulse-glow" />
        </div>
      </div>

      {/* Title */}
      <div
        className={`mt-8 transition-all duration-500 delay-300 ${
          phase === "enter" ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <h1 className="text-2xl font-bold tracking-widest text-primary text-glow">
          HELIX<span className="text-foreground">CIPHER</span>
        </h1>
        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <span>initializing</span>
          <span className="animate-pulse-glow">...</span>
        </div>
      </div>

      {/* Loading bar */}
      <div
        className={`mt-6 h-px w-48 overflow-hidden bg-border transition-opacity duration-500 delay-500 ${
          phase === "enter" ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className="h-full bg-primary"
          style={{
            animation: "typewriter 2s ease-in-out forwards",
            width: "0%",
          }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
