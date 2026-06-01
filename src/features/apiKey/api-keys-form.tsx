"use client";
import { InputWithLabel } from "@/components/input-with-label";
import { TextAreaWithLabel } from "@/components/textarea-with-label";
import React, { SyntheticEvent, useState } from "react";
import { ApiKeyRequest } from "./api-keys-types";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const DEFAULT: ApiKeyRequest = {
  value: "",
  description: "",
  name: "",
};
export default function ApiKeysForm({
  sendForm,
}: {
  sendForm: (req: ApiKeyRequest) => void;
}) {
  const [apiKey, setApiKey] = useState<ApiKeyRequest>(DEFAULT);
  const onSendForm = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendForm(apiKey);
  };
  return (
    <form onSubmit={onSendForm}>
      <InputWithLabel
        label="Display name (optional)"
        value={apiKey.name ?? ""}
        onChange={(e) => setApiKey((c) => ({ ...c, name: e.target.value }))}
      />
      <TextAreaWithLabel
        label="Description (optional)"
        value={apiKey.description ?? ""}
        onChange={(e) =>
          setApiKey((c) => ({ ...c, description: e.target.value }))
        }
      />
      <InputWithLabel
        label="Key Value"
        value={apiKey.value}
        onChange={(e) => setApiKey((c) => ({ ...c, value: e.target.value }))}
      />
      <Button className="bg-blue-600 hover:bg-blue-500 text-white ml-auto">
        <Save /> <span>Save key</span>
      </Button>
    </form>
  );
}
