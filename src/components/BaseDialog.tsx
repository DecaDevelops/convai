import { PropsWithChildren } from "react";
import { BaseDialogProps, Dialog, DialogContent } from "./ui/dialog";

export const BaseDialog: React.FC<BaseDialogProps & PropsWithChildren> = ({
  children,
  open,
  setOpen,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
