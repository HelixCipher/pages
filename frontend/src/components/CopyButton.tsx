import { useState, memo } from "react";
import { Copy, Check } from "lucide-react";

const CopyButton = memo(function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy code"
      className="absolute right-2 top-2 rounded border border-border bg-background/80 p-1.5 text-muted-foreground opacity-0 transition-all hover:text-primary group-hover:opacity-100"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
});

export default CopyButton;
