"use client";
import usePersonas from "@/features/persona/persona-context";
import React from "react";
import PersonaCard from "@/features/persona/persona-card";
export default function Client() {
  const { personas } = usePersonas();
  return (
    <div className="my-5">
      <div className="flex flex-wrap justify-center flex-1">
        {personas.map((x) => (
          <PersonaCard key={x.id} persona={x} />
        ))}
      </div>
    </div>
  );
}
