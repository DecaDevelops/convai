import { v4 as uuidv4 } from "uuid";
import { ChatInsert, ChatRequest } from "./types";
export class ChatFactory {
  public static Create(req: ChatRequest): ChatInsert {
    const date = new Date();
    return {
      id: uuidv4(),
      characterId: req.characterId,
      interferenceProfileId: req.interferenceProfileId,
      personaId: req.personaId,
      createdAt: date,
      updatedAt: date,
    };
  }
}
