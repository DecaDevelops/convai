"use client";
import React, { memo, SyntheticEvent, useState } from "react";
import { ProviderRequest } from "./provider-types";
import useApiKeys from "../apiKey/api-keys-context";
import { InputWithLabel } from "@/components/input-with-label";
import { TextAreaWithLabel } from "@/components/textarea-with-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiKeysSelect } from "../apiKey/api-keys-types";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
const DEFAULT: ProviderRequest = {
  apiKeyId: "",
  description: "",
  name: "",
  path: "",
};
const ApiKeySelectItem: React.FC<{ apiKey: ApiKeysSelect }> = memo(
  ({ apiKey }) => {
    return <SelectItem value={apiKey.id}>{apiKey.name}</SelectItem>;
  },
);

ApiKeySelectItem.displayName = "ApiKeySelectItem";
export default function ProviderForm({
  onSendForm,
  isPending,
  _provider,
}: {
  _provider?: ProviderRequest;
  onSendForm: (req: ProviderRequest) => void;
  isPending: boolean;
}) {
  const { apiKeys } = useApiKeys();

  const [provider, setProvider] = useState(_provider ?? DEFAULT);
  const onSubmitForm = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    onSendForm(provider);
  };
  return (
    <form onSubmit={onSubmitForm} className="space-y-2 w-full">
      <InputWithLabel
        label="Name"
        value={provider.name ?? ""}
        onChange={(e) => setProvider((c) => ({ ...c, name: e.target.value }))}
      />
      <Field>
        <FieldLabel htmlFor="path">
          Provider URL<span className="text-red-500">*</span>
        </FieldLabel>
        <Input
          required
          id="path"
          placeholder="example: https://api.deepseek.com"
          autoComplete="off"
          value={provider.path ?? ""}
          onChange={(e) => setProvider((c) => ({ ...c, path: e.target.value }))}
        />
        <FieldDescription className="text-sm">
          Check with your provider to find the correct endpoint
        </FieldDescription>
      </Field>
      <TextAreaWithLabel
        label="Description"
        value={provider.description ?? ""}
        onChange={(e) =>
          setProvider((c) => ({ ...c, description: e.target.value }))
        }
      />
      <Select
        value={provider.apiKeyId ?? ""}
        onValueChange={(e) => setProvider((c) => ({ ...c, apiKeyId: e }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select value-" />
        </SelectTrigger>
        <SelectContent align="start">
          {apiKeys.map((x) => (
            <ApiKeySelectItem apiKey={x} key={x.id} />
          ))}
        </SelectContent>
      </Select>
      <div className="w-fit ml-auto">
        <Button className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
          <Save /> <span>Register Provider</span>
        </Button>
      </div>
    </form>
  );
}
