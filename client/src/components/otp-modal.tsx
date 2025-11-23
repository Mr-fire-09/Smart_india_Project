import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

interface OTPModalProps {
  open: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<boolean>;
  phone: string;
  purpose: string;
}

export function OTPModal({ open, onClose, onVerify, phone, purpose }: OTPModalProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 6 digits",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    const success = await onVerify(otp);
    setIsVerifying(false);

    if (success) {
      toast({
        title: "Verified!",
        description: "OTP verified successfully",
      });
      setOtp("");
      onClose();
    } else {
      toast({
        title: "Verification Failed",
        description: "Invalid or expired OTP. Please try again.",
        variant: "destructive",
      });
      setOtp("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-otp">
        <DialogHeader>
          <DialogTitle>Verify OTP</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code sent to {phone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            data-testid="input-otp"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1" data-testid="button-cancel-otp">
              Cancel
            </Button>
            <Button 
              onClick={handleVerify} 
              disabled={otp.length !== 6 || isVerifying}
              className="flex-1"
              data-testid="button-verify-otp"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
