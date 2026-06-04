"use client";

import {
  BaseDialogProps,
  DialogClose,
  DialogDescription,
  DialogFooter,
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
import { timeOut } from "@/lib/timeout-func";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
  const { doUpdateInterferenceProfileAsync } =
    useInterferenceProfileMutations();
  const onUpdateAsync = async (req: InterferenceProfileRequest) => {
    try {
      if (!profile) return;
      await doUpdateInterferenceProfileAsync({ profileId: profile.id, req });
      setOpen(false);
      await timeOut();
      setProfile(null);
    } catch {}
  };
  return (
    <BaseDialog open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>Edit {profile?.name ?? ""}</DialogTitle>
      </DialogHeader>
      <DialogDescription>Edit an existing profile</DialogDescription>
      <InterferenceProfileForm
        isPending={false}
        onSendForm={onUpdateAsync}
        _interferenceProfile={
          profile
            ? {
                temperature: profile.temperature / 100,
                description: profile.description,
                maxResponseTokens: profile.maxResponseTokens,
                modelId: profile.modelId,
                name: profile.name,
                topK: profile.topK,
                topP: profile.topP / 100,
              }
            : undefined
        }
      />
      <DialogFooter>
        <DialogClose
          onClick={async () => {
            await timeOut();
            setProfile(null);
          }}
        >
          Cancel
        </DialogClose>
      </DialogFooter>
    </BaseDialog>
  );
};

export const DeleteInterferenceProfileDialog: React.FC<
  InterferenceProfileDialogProps
> = ({ open, setOpen, profile, setProfile }) => {
  const { doDeleteInterferenceProfileAsync, isPending } =
    useInterferenceProfileMutations();
  const onDeleteAsync = async () => {
    try {
      if (isPending || !profile) return;
      await doDeleteInterferenceProfileAsync(profile?.id);
      setOpen(false);
      await timeOut();
      setProfile(null);
    } catch {}
  };
  return (
    <BaseDialog open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>Edit {profile?.name ?? ""}</DialogTitle>
      </DialogHeader>
      <DialogDescription>Edit an existing profile</DialogDescription>
      <DialogFooter>
        <Button onClick={onDeleteAsync}>
          <Trash2 /> <span>Delete profile</span>
        </Button>
        <DialogClose
          onClick={async () => {
            await timeOut();
            setProfile(null);
          }}
        >
          Cancel
        </DialogClose>
      </DialogFooter>
    </BaseDialog>
  );
};
