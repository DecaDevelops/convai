import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, TextareaHTMLAttributes, useEffect, useRef } from "react";
import { Label } from "./ui/label";
type TextAreaProps = {
  label?: string;
  maxHeight?: number;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;
function TextAreaWithLabel({
  label,
  maxHeight,
  onChange,
  ...props
}: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleInput = () => {
    const el = textAreaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const newHeight = el?.scrollHeight + 1;
    if (maxHeight && newHeight > maxHeight) {
      el.style.height = `${maxHeight}px`;
      el.style.overflowY = "auto";
    } else {
      el.style.height = `${newHeight}px`;
      el.style.overflowY = "scroll";
    }
  };
  return (
    <div className="w-full">
      <Label className="flex flex-col items-start">
        {label}
        <Textarea
          {...props}
          ref={textAreaRef}
          onChange={(e) => {
            handleInput();
            onChange?.(e);
          }}
        />
      </Label>
    </div>
  );
}

export { TextAreaWithLabel };
