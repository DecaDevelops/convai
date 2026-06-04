"use client";

import { BaseDialog } from "@/components/BaseDialog";
import { Button } from "@/components/ui/button";
import {
  BaseDialogProps,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProviderForm from "@/features/provider/provider-form";
import {
  ProviderRequest,
  ProviderSelect,
} from "@/features/provider/provider-types";
import useProviderMutations from "@/features/provider/use-provider-mutation";
import { Trash } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export const DeleteProviderDialog: React.FC<
  BaseDialogProps & {
    provider: ProviderSelect | null;
    setProvider: Dispatch<SetStateAction<ProviderSelect | null>>;
  }
> = ({ open, setOpen, provider, setProvider }) => {
  const { doDeleteProviderAsync } = useProviderMutations();
  const onDeleteProviderAsync = async () => {
    if (!provider) return;
    try {
      await doDeleteProviderAsync(provider.id);
      setOpen(false);
      await new Promise((res) => setTimeout(() => res("resolved"), 100));
      setProvider(null);
    } catch {}
  };
  return (
    <BaseDialog open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>
          Are you sure you want to delete {provider?.name ?? ""}?
        </DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Once deleting, this action cannot be undone
      </DialogDescription>
      <DialogFooter>
        <Button onClick={onDeleteProviderAsync}>
          <Trash /> <span>Delete</span>
        </Button>
        <DialogClose
          onClick={() => {
            setProvider(null);
          }}
        >
          Cancel
        </DialogClose>
      </DialogFooter>
    </BaseDialog>
  );
};

export const CreateProviderDialog: React.FC<BaseDialogProps> = ({
  open,
  setOpen,
}) => {
  const [version, setVersion] = useState(0);
  const { doCreateProviderAsync, isPending } = useProviderMutations();
  const onCreateAsync = async (e: ProviderRequest) => {
    try {
      await doCreateProviderAsync(e);
      setVersion(version + 1);
    } catch {}
  };
  return (
    <BaseDialog open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>Register a new Provider</DialogTitle>
      </DialogHeader>
      <ProviderForm
        isPending={isPending}
        onSendForm={onCreateAsync}
        key={version}
      />
      <DialogFooter>
        <DialogClose>Cancel</DialogClose>
      </DialogFooter>
    </BaseDialog>
  );
};

export const UpdateProviderDialog: React.FC<
  BaseDialogProps & {
    provider: ProviderSelect | null;
    setProvider: Dispatch<SetStateAction<ProviderSelect | null>>;
  }
> = ({ open, provider, setOpen, setProvider }) => {
  const { doUpdateProviderAsync, isPending } = useProviderMutations();

  const onUpdateAsync = async (req: ProviderRequest) => {
    try {
      if (!provider) return;
      await doUpdateProviderAsync({ providerId: provider.id, req });
      setOpen(false);
      await new Promise((res) => setTimeout(() => res, 100));
      setProvider(null);
    } catch {}
  };
  return (
    <BaseDialog open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>Update provider {provider?.name ?? ""}</DialogTitle>
      </DialogHeader>
      <DialogDescription>Update existing provider</DialogDescription>
      <ProviderForm
        _provider={provider ?? undefined}
        isPending={isPending}
        onSendForm={onUpdateAsync}
      />
      <DialogFooter>
        <DialogClose
          onClick={async () => {
            await new Promise((resolve) => setTimeout(() => resolve, 100));
            setProvider(null);
          }}
        >
          Cancel
        </DialogClose>
      </DialogFooter>
    </BaseDialog>
  );
};
