"use client";
import usePersonas from "@/features/persona/persona-context";
import PersonaCard from "@/features/persona/persona-card";
import UploadPersona from "./components/upload-persona";
export default function Client() {
  const { personas } = usePersonas();
  return (
    <div className="my-5">
      <div className="w-fit ml-auto my-2 mx-5">
        <UploadPersona />
      </div>
      <div className="flex flex-wrap justify-center flex-1 gap-3">
        {personas.map((x) => (
          <PersonaCard key={x.id} persona={x} />
        ))}
      </div>
    </div>
  );
}
