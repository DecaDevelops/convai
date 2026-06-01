"use client";
import React, { memo, SyntheticEvent, useState } from "react";
import { ModelRequest } from "./model-types";
import { InputWithLabel } from "@/components/input-with-label";
import useProvider from "../provider/provider-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProviderSelect } from "../provider/provider-types";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TextAreaWithLabel } from "@/components/textarea-with-label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
const DEFAULT: ModelRequest = {
  providerModelName: "",
  contextSize: "",
  description: "",
  maxTokenResponse: null,
  name: "",
  providerId: "",
};

const ModelSelectItem: React.FC<{
  value: ProviderSelect;
}> = memo(({ value }) => {
  return <SelectItem value={value.id}>{value.name}</SelectItem>;
});

ModelSelectItem.displayName = "ModelSelectItem";
export default function ModelForm({
  isPending,
  onSendForm,
}: {
  onSendForm: (req: ModelRequest) => void;
  isPending: boolean;
}) {
  const { providers } = useProvider();
  const [model, setModel] = useState(DEFAULT);

  const onHandleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    onSendForm(model);
  };
  return (
    <form className="space-y-4" onSubmit={onHandleSubmit}>
      <Field>
        <FieldLabel htmlFor="provider">Selected Provider</FieldLabel>
        <Select
          onValueChange={(e) => setModel((c) => ({ ...c, providerId: e }))}
        >
          <SelectTrigger id="provider" className="w-full">
            <SelectValue placeholder="Select value-" />
          </SelectTrigger>
          <SelectContent align="start" id="">
            {providers.map((x) => (
              <ModelSelectItem value={x} key={x.id} />
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel>Model Name</FieldLabel>
        <Input
          value={model.providerModelName ?? ""}
          onChange={(e) =>
            setModel((c) => ({ ...c, providerModelName: e.target.value }))
          }
        />
        <FieldDescription className="text-xs">
          This must be the <span className="font-bold">EXACT</span> model name
          for example: {'"deepseek-chat"'}
        </FieldDescription>
      </Field>
      <TextAreaWithLabel
        label="Description"
        className="max-h-32 resize-none"
        value={model.description ?? ""}
        onChange={(e) =>
          setModel((c) => ({ ...c, description: e.target.value }))
        }
      />
      <InputWithLabel
        label="Custom name"
        value={model.name ?? ""}
        onChange={(e) => setModel((c) => ({ ...c, name: e.target.value }))}
      />
      <InputWithLabel
        label="Context size(e.g: 632K)"
        value={model.contextSize ?? ""}
        onChange={(e) =>
          setModel((c) => ({ ...c, contextSize: e.target.value }))
        }
      />
      {/* <InputWithLabel label="Max size (optional)" /> */}
      <div className="w-fit ml-auto">
        <Button className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
          <Plus /> <span>Register model</span>
        </Button>
      </div>
    </form>
  );
}
