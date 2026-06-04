"use client";

import { BaseDialog } from "@/components/BaseDialog";
import {
  BaseDialogProps,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApiKeysForm from "./api-keys-form";
import { ApiKeyRequest, ApiKeysSelect } from "./api-keys-types";
import useApiKeysMutations from "./api-keys-mutations";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { timeOut } from "@/lib/timeout-func";

export const CreateApiKeyDialog: React.FC<BaseDialogProps> = ({
  open,
  setOpen,
}) => {
  const [version, setVersion] = useState(0);
  const { doCreateApiKeyAsync, isPending } = useApiKeysMutations();
  const onCreateAsync = async (e: ApiKeyRequest) => {
    try {
      await doCreateApiKeyAsync(e);
      setVersion(version + 1);
    } catch (error) {}
  };
  return (
    <BaseDialog open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>Register Api key</DialogTitle>
      </DialogHeader>
      <DialogDescription>You can create a quick api key here</DialogDescription>
      <ApiKeysForm
        isPending={isPending}
        sendForm={onCreateAsync}
        key={version}
      />
    </BaseDialog>
  );
};

export const UpdateApiKeyDialog: React.FC<
  BaseDialogProps & {
    apiKey: ApiKeysSelect | null;
    setApiKey: Dispatch<SetStateAction<ApiKeysSelect | null>>;
  }
> = ({ apiKey, open, setApiKey, setOpen }) => {
  const { doUpdateApiKeyAsync, isPending } = useApiKeysMutations();

  const onUpdateApiKeyAsync = async (req: ApiKeyRequest) => {
    try {
      if (!apiKey) return;
      await doUpdateApiKeyAsync({ apiKeyId: apiKey.id, req });
      setOpen(false);
      await timeOut();
      setApiKey(null);
    } catch {}
  };
  return (
    <BaseDialog open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>Update {apiKey?.name ?? ""}</DialogTitle>
      </DialogHeader>
      <DialogDescription>Update api key</DialogDescription>
      <ApiKeysForm
        _apiKey={
          apiKey
            ? {
                value: apiKey.value,
                description: apiKey.description,
                name: apiKey.name,
              }
            : undefined
        }
        sendForm={onUpdateApiKeyAsync}
        isPending={isPending}
      />
      <DialogFooter>
        <DialogClose
          onClick={async () => {
            await timeOut();
            setApiKey(null);
          }}
        >
          Cancel
        </DialogClose>
      </DialogFooter>
    </BaseDialog>
  );
};

export const DeleteApiKeyDialog: React.FC<
  BaseDialogProps & {
    apiKey: ApiKeysSelect | null;
    setApiKey: Dispatch<SetStateAction<ApiKeysSelect | null>>;
  }
> = ({ apiKey, open, setApiKey, setOpen }) => {
  const { doDeleteApiKeyAsync, isPending } = useApiKeysMutations();
  const onDeleteApiKeyAsync = async () => {
    try {
      if (!apiKey) return;
      await doDeleteApiKeyAsync(apiKey?.id);
      setOpen(false);
      await timeOut();
      setApiKey(null);
    } catch {}
  };
  return (
    <BaseDialog open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>Delete {apiKey?.name ?? ""}</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Once deleted, this api key cannot be recovered
      </DialogDescription>
      <DialogFooter>
        <Button onClick={onDeleteApiKeyAsync}>
          <Trash2 /> <span>Delete Api key</span>
        </Button>
        <DialogClose
          onClick={async () => {
            await timeOut();
            setApiKey(null);
          }}
        >
          Cancel
        </DialogClose>
      </DialogFooter>
    </BaseDialog>
  );
};
