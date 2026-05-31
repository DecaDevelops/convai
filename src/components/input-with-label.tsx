import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes } from "react";

type InputProps = {
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;
function InputWithLabel({ label, ...props }: InputProps) {
  return (
    <div className="w-full">
      <Label className="flex flex-col items-start">
        {label}
        <Input {...props} />
      </Label>
    </div>
  );
}

export { InputWithLabel };
