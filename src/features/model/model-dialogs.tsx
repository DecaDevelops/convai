import {
  BaseDialogProps,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModelRequest, ModelSelect } from "./model-types";
import { Dispatch, SetStateAction, useState } from "react";
import { BaseDialog } from "@/components/BaseDialog";
import { timeOut } from "@/lib/timeout-func";
import ModelForm from "./model-form";
import useModelMutations from "./use-model-mutation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
type BaseModelDialogProps = BaseDialogProps & {
  model: ModelSelect | null;
  setModel: Dispatch<SetStateAction<ModelSelect | null>>;
};

export const CreateModelDialog: React.FC<BaseDialogProps> = ({
  open,
  setOpen,
}) => {
  const [version, setVersion] = useState(0);
  const { doCreateModelAsync, isPending } = useModelMutations();
  const onCreateAsync = async (req: ModelRequest) => {
    try {
      if (isPending) return;
      await doCreateModelAsync(req);
      setVersion(version + 1);
    } catch {}
  };
  return (
    <BaseDialog open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>Create Model</DialogTitle>
      </DialogHeader>
      <ModelForm
        onSendForm={onCreateAsync}
        key={version}
        isPending={isPending}
      />
      <DialogFooter>
        <DialogClose>Cancel</DialogClose>
      </DialogFooter>
    </BaseDialog>
  );
};

export const EditModelDialog: React.FC<BaseModelDialogProps> = ({
  model,
  open,
  setModel,
  setOpen,
}) => {
  const { doUpdateAsync, isPending } = useModelMutations();
  const onUpdateAsync = async (req: ModelRequest) => {
    try {
      if (!model) return;
      await doUpdateAsync({ modelId: model.id, req });
      setOpen(false);
      await timeOut();
      setModel(null);
    } catch (error) {}
  };
  return (
    <BaseDialog open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>Edit model {model?.name ?? ""}</DialogTitle>
      </DialogHeader>
      <DialogDescription>Edit model</DialogDescription>
      <ModelForm
        onSendForm={onUpdateAsync}
        isPending={isPending}
        _model={
          model
            ? {
                providerModelName: model.providerModelName,
                contextSize: model.contextSize,
                description: model.description,
                maxTokenResponse: model.maxTokenResponse,
                name: model.name,
                providerId: model.providerId,
                tags: model.tags,
              }
            : undefined
        }
      />
      <DialogFooter>
        <DialogClose
          onClick={async () => {
            await timeOut();
            setModel(null);
          }}
        >
          Cancel
        </DialogClose>
      </DialogFooter>
    </BaseDialog>
  );
};

export const DeleteModelDialog: React.FC<BaseModelDialogProps> = ({
  model,
  open,
  setModel,
  setOpen,
}) => {
  const { doDeleteAsync, isPending } = useModelMutations();
  const onDeleteAsync = async () => {
    try {
      if (!model || isPending) return;
      await doDeleteAsync(model.id);
      setOpen(false);
      await timeOut();
      setModel(null);
    } catch {}
  };
  return (
    <BaseDialog open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>
          Are you sure you want to delete {model?.name ?? ""}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription>
        This model cannot be recovered once deleted
      </DialogDescription>
      <DialogFooter>
        <Button onClick={onDeleteAsync}>
          <Trash2 /> <span>Delete model</span>
        </Button>
        <DialogClose>Close</DialogClose>
      </DialogFooter>
    </BaseDialog>
  );
};
