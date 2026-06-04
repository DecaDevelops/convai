"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createInterferenceProfile,
  deleteInterferenceProfile,
  updateInterferenceProfile,
} from "./interference-profile.action";
import { toast } from "sonner";

export default function useInterferenceProfileMutations() {
  const queryClient = useQueryClient();
  const invalidateQueries = () =>
    queryClient.invalidateQueries({ queryKey: ["profiles"] });

  const {
    mutateAsync: doCreateInterferenceProfileAsync,
    isPending: isPendingCreate,
  } = useMutation({
    mutationFn: createInterferenceProfile,
    onSuccess: () => {
      toast.success("Interference Profile has been created");
      invalidateQueries();
    },
    onError: (err) => toast.error(err.message),
  });

  const {
    mutate: doDeleteInterferenceProfile,
    mutateAsync: doDeleteInterferenceProfileAsync,
    isPending: isPendingDelete,
  } = useMutation({
    mutationFn: deleteInterferenceProfile,
    onSuccess: () => {
      toast.success("Interference Profile has been deleted");
      invalidateQueries();
    },
    onError: (err) => toast.error(err.message),
  });

  const {
    mutateAsync: doUpdateInterferenceProfileAsync,
    isPending: isPendingUpdate,
  } = useMutation({
    mutationFn: updateInterferenceProfile,
    onSuccess: () => {
      toast.success("Interference Profile has been updated");
      invalidateQueries();
    },
    onError: (err) => toast.error(err.message),
  });
  const isPending = isPendingCreate || isPendingDelete || isPendingUpdate;
  return {
    doCreateInterferenceProfileAsync,
    doDeleteInterferenceProfile,
    doDeleteInterferenceProfileAsync,
    doUpdateInterferenceProfileAsync,
    isPending,
  };
}
