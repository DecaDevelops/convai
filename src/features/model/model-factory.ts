import { ModelInsert, ModelRequest, ModelSelect } from "./model-types";
import { v4 as uuidv4 } from "uuid";
export class ModelFactory {
  public static Create(req: ModelRequest): ModelInsert {
    const date = new Date();
    return {
      id: uuidv4(),
      name: req.name,
      providerModelName: req.providerModelName,
      contextSize: req.contextSize,
      description: req.description,
      maxTokenResponse: req.maxTokenResponse,
      providerId: req.providerId,
      tags: req.tags,
      createdAt: date,
      updatedAt: date,
    };
  }

  public static Update(model: ModelSelect, req: ModelRequest): ModelInsert {
    return {
      ...model,
      contextSize: req.contextSize,
      description: req.description,
      maxTokenResponse: req.maxTokenResponse,
      name: req.name,
      providerId: req.providerId,
      providerModelName: req.providerModelName,
      tags: req.tags,
      updatedAt: new Date(),
    };
  }
}
