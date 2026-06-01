import { ProviderInsert, ProviderRequest } from "./provider-types";
import { v4 as uuidv4 } from "uuid";
export class ProviderFactory {
  public static Create(req: ProviderRequest): ProviderInsert {
    const date = new Date();

    return {
      id: uuidv4(),
      apiKeyId: req.apiKeyId,
      description: req.description,
      name: req.name,
      path: req.name,
      createdAt: date,
      updatedAt: date,
    };
  }
}
