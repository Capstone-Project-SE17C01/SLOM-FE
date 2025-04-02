"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const disabled =
    props.value === "" || props.value === undefined || props.disabled;
  const handleCopy = (
    e:
      | React.ClipboardEvent<HTMLInputElement>
      | React.DragEvent<HTMLInputElement>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div className="relative">
      <Input
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onCopy={handleCopy}
        onCut={handleCopy}
        onDrag={handleCopy}
        onDrop={handleCopy}
        onPaste={handleCopy}
        onSelect={handleCopy}
        {...props}
        type={showPassword ? "text" : "password"}
      />
      <Button
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        disabled={disabled}
        size="sm"
        type="button"
        variant="ghost"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword && !disabled ? (
          <EyeIcon aria-hidden="true" className="h-4 w-4" />
        ) : (
          <EyeOffIcon aria-hidden="true" className="h-4 w-4" />
        )}
      </Button>

      <style>
        {`
			.hide-password-toggle::-ms-reveal,
			.hide-password-toggle::-ms-clear {
				visibility: hidden;
				pointer-events: none;
				display: none;
			}
		`}
      </style>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
