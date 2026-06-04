"use client";

import { toast } from "sonner";

export async function setClipboard(text: string) {
  const type = "text/plain";
  const clipboardItemData = {
    [type]: text,
  };
  const clipboardItem = new ClipboardItem(clipboardItemData);
  await navigator.clipboard.write([clipboardItem]);
  toast.success("Copied to clipboard");
}
