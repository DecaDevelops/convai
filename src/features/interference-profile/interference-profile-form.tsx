"use client";
import React, { memo, SyntheticEvent, useState } from "react";
import { InterferenceProfileRequest } from "./interference-profile-types";
import useModels from "../model/model-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelSelect } from "../model/model-types";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT: InterferenceProfileRequest = {
  name: "",
  description: "",
  modelId: "",
  topK: 70,
  topP: 0.7,
  temperature: 0.7,
  maxResponseTokens: 300,
};

const ModelSelectItem: React.FC<{ model: ModelSelect }> = memo(({ model }) => {
  return <SelectItem value={model.id}>{model.name}</SelectItem>;
});

ModelSelectItem.displayName = "ModelSelectItem";

export default function InterferenceProfileForm({
  onSendForm,
  isPending,
  _interferenceProfile,
}: {
  onSendForm: (req: InterferenceProfileRequest) => void;
  isPending: boolean;
  _interferenceProfile?: InterferenceProfileRequest;
}) {
  const { models } = useModels();

  const [profile, setProfile] = useState(_interferenceProfile ?? DEFAULT);
  const onSubmitForm = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    onSendForm(profile);
  };
  return (
    <form onSubmit={onSubmitForm} className="space-y-2 w-full">
      <Field>
        <FieldLabel htmlFor="nickname">Nickname</FieldLabel>
        <Input
          id="nickname"
          value={profile.name ?? ""}
          placeholder="Nickname"
          onChange={(e) => setProfile((c) => ({ ...c, name: e.target.value }))}
        />
        <FieldDescription className="text-sm">
          This is the nickname for your ease
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          value={profile.description ?? ""}
          onChange={(e) =>
            setProfile((c) => ({ ...c, description: e.target.value }))
          }
          placeholder="Description"
          className="h-32 max-h-32 resize-none"
        />
        <FieldDescription className="text-sm">
          A description to remind you what this model was for
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="model">
          Model<span className="text-red-500">*</span>
        </FieldLabel>
        <Select
          required
          onValueChange={(e) => setProfile((c) => ({ ...c, modelId: e }))}
          value={profile.modelId ?? ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent align="start">
            {models.map((x) => (
              <ModelSelectItem model={x} key={x.id} />
            ))}
          </SelectContent>
        </Select>
        <FieldDescription className="text-sm">
          Select the model to use with this profile
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="temperature">
          Temperature<span className="text-red-500">*</span>
        </FieldLabel>
        <Input
          required
          id="temperature"
          type="number"
          max={1.0}
          min={0.0}
          step={0.1}
          placeholder="Example: 70"
          autoComplete="off"
          value={profile.temperature}
          onChange={(e) =>
            setProfile((c) => ({ ...c, temperature: Number(e.target.value) }))
          }
        />
        <FieldDescription className="text-sm">
          Controls randomness in the output (0-100)
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="topK">Top K</FieldLabel>
        <Input
          id="topK"
          min={0}
          max={100}
          step={1}
          type="number"
          placeholder="Example: 70"
          autoComplete="off"
          value={profile.topK}
          onChange={(e) =>
            setProfile((c) => ({ ...c, topK: Number(e.target.value) }))
          }
        />
        <FieldDescription className="text-sm">
          Limits the number of tokens to consider (default: 70)
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="topP">Top P</FieldLabel>
        <Input
          id="topP"
          min={0}
          max={1.0}
          step={0.1}
          type="number"
          placeholder="Example: 40"
          autoComplete="off"
          value={profile.topP}
          onChange={(e) =>
            setProfile((c) => ({ ...c, topP: Number(e.target.value) }))
          }
        />
        <FieldDescription className="text-sm">
          Nucleus sampling threshold (default: 40)
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="maxResponseTokens">Max Response Tokens</FieldLabel>
        <Input
          id="maxResponseTokens"
          type="number"
          min={10}
          placeholder="Example: 300"
          autoComplete="off"
          value={profile.maxResponseTokens ?? ""}
          onChange={(e) =>
            setProfile((c) => ({
              ...c,
              maxResponseTokens: parseInt(e.target.value),
            }))
          }
        />
        <FieldDescription className="text-sm">
          Maximum number of tokens in the response (default: 300)
        </FieldDescription>
      </Field>
      <div className="w-fit ml-auto">
        <Button className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
          <Save /> <span>Create Profile</span>
        </Button>
      </div>
    </form>
  );
}
