import { getPersona } from "@/features/persona/persona-action";
import React from "react";
import Client from "./client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const persona = await getPersona(id);
  if (!persona) return "persona not found";
  return <Client persona={persona} key={id} />;
}
