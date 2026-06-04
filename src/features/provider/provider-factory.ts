import {
  ProviderInsert,
  ProviderRequest,
  ProviderSelect,
} from "./provider-types";
import { v4 as uuidv4 } from "uuid";
export class ProviderFactory {
  public static Create(req: ProviderRequest): ProviderInsert {
    const date = new Date();
    return {
      id: uuidv4(),
      apiKeyId: req.apiKeyId,
      description: req.description,
      name: req.name,
      path: req.path,
      createdAt: date,
      updatedAt: date,
    };
  }

  public static CreateUpdate(
    provider: ProviderSelect,
    req: ProviderRequest,
  ): ProviderInsert {
    return {
      ...provider,
      apiKeyId: req.apiKeyId,
      description: req.description,
      name: req.name,
      path: req.path,
      updatedAt: new Date(),
    };
  }
}
