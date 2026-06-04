import {
  InterferenceProfileInsert,
  InterferenceProfileRequest,
  InterferenceProfileSelect,
} from "./interference-profile-types";
import { v4 as uuidv4 } from "uuid";
export class InterferenceProfileFactory {
  public static Create(
    req: InterferenceProfileRequest,
  ): InterferenceProfileInsert {
    const date = new Date();
    return {
      id: uuidv4(),
      description: req.description,
      name: req.name,
      temperature: Math.round(req.temperature * 100),
      maxResponseTokens: req.maxResponseTokens ?? 300,
      modelId: req.modelId,
      topK: req.topK ?? 70,
      topP: Math.round(req?.topP ? req.topP * 100 : 70),
      createdAt: date,
      updatedAt: date,
    };
  }

  public static Update(
    profile: InterferenceProfileSelect,
    req: InterferenceProfileRequest,
  ): InterferenceProfileInsert {
    return {
      ...profile,
      name: req.name,
      description: req.description,
      temperature: req.temperature,
      topK: req.topK,
      topP: req.topP,
      maxResponseTokens: req.maxResponseTokens,
      modelId: req.modelId,
      updatedAt: new Date(),
    };
  }
}
