"use client";

import { CharacterImport } from "./character-import-types";
import { FormDataConverter } from "@/lib/form-data";
import { CharacterImportMapper } from "./character-import-mapper";
import { createCharacter } from "../character-action";

export const onImportCharacter = async (req: CharacterImport[]) => {
  for (const character of req) {
    const formData = FormDataConverter.toFormData(
      CharacterImportMapper.toRequest(character),
    );
    const image = character?.image?.[0];
    if (image instanceof Blob) {
      formData.append("file", image, "character_1.webp");
    }

    await createCharacter(formData);
  }
  return true;
};
