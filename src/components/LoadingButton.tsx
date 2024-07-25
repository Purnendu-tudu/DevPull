import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("felx items-center gap-2", className)}
      {...props}
    >
        {loading && <Loader2 className="soze-5 animate-spin"/>}
        {props.children}

    </Button>
  );
}
