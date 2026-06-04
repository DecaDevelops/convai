"use client";

import {
  BaseDialogProps,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InterferenceProfileRequest,
  InterferenceProfileSelect,
} from "./interference-profile-types";
import { Dispatch, SetStateAction, useState } from "react";
import { BaseDialog } from "@/components/BaseDialog";
import InterferenceProfileForm from "./interference-profile-form";
import useInterferenceProfileMutations from "./use-interference-profile-mutations";

type InterferenceProfileDialogProps = BaseDialogProps & {
  profile: InterferenceProfileSelect | null;
  setProfile: Dispatch<SetStateAction<InterferenceProfileSelect | null>>;
};

export const CreateInterferenceProfileDialog: React.FC<BaseDialogProps> = ({
  open,
  setOpen,
}) => {
  const [version, setVersion] = useState(0);
  const { doCreateInterferenceProfileAsync, isPending } =
    useInterferenceProfileMutations();
  const onCreate = async (req: InterferenceProfileRequest) => {
    try {
      if (isPending) return;
      await doCreateInterferenceProfileAsync(req);
      setVersion(version + 1);
    } catch {}
  };
  return (
    <BaseDialog open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>Create Interference Profile</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Configure model parameters for fine-tuned control over AI responses
      </DialogDescription>
      <InterferenceProfileForm
        isPending={isPending}
        key={version}
        onSendForm={onCreate}
      />
    </BaseDialog>
  );
};

export const UpdateInterferenceProfileDialog: React.FC<
  InterferenceProfileDialogProps
> = ({ open, profile, setOpen, setProfile }) => {
  return <BaseDialog open={open} setOpen={setOpen}></BaseDialog>;
};
