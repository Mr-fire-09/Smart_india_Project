import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { BlockchainHash } from "@shared/schema";

interface BlockchainHashDisplayProps {
  hash: BlockchainHash;
}

export function BlockchainHashDisplay({ hash }: BlockchainHashDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash.documentHash);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Hash copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card data-testid="card-blockchain">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="font-heading text-lg">Blockchain Verification</CardTitle>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Check className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        </div>
        <CardDescription>
          Document verified on blockchain at {new Date(hash.timestamp).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Document Hash</label>
          <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
            <code className="flex-1 text-xs font-mono break-all" data-testid="text-hash">
              {hash.documentHash}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              data-testid="button-copy-hash"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Block Number</p>
            <p className="font-mono font-semibold" data-testid="text-block-number">{hash.blockNumber}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Timestamp</p>
            <p className="font-mono text-sm" data-testid="text-timestamp">
              {new Date(hash.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
