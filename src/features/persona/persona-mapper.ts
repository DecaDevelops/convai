import { PersonaRequest, PersonaSelect } from "./persona-types";

export class PersonaMapper {
  public static mapToRequest(persona: PersonaSelect): PersonaRequest {
    return {
      name: persona.name,
      description: persona.description,
    };
  }
}
