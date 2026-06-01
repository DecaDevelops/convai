import {
  InterferenceProfileInsert,
  InterferenceProfileRequest,
} from "./interference-profile-types";
import { v4 as uuidv4 } from "uuid";
export class InterferenceProfileFactory {
  public static Create(
    req: InterferenceProfileRequest,
  ): InterferenceProfileInsert {
    const date = new Date();
    return {
      id: uuidv4(),
      temperature: Math.round(req.temperature * 100),
      maxResponseTokens: req.maxResponseTokens ?? 300,
      modelId: req.modelId,
      topK: req.topK ?? 70,
      topP: Math.round(req.topP ?? 0.7 * 100),
      createdAt: date,
      updatedAt: date,
    };
  }
}
