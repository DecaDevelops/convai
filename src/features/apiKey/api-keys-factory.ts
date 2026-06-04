import { v4 as uuidv4 } from "uuid";
import {
  ApiKeyRequest,
  ApiKeysInsert,
  ApiKeysSelect as ApiKeySelect,
} from "./api-keys-types";
export class ApiKeysFactory {
  public static Create(req: ApiKeyRequest): ApiKeysInsert {
    const date = new Date();
    return {
      id: uuidv4(),
      name: req.name,
      value: req.value,
      description: req.description,
      createdAt: date,
      updatedAt: date,
    };
  }

  public static Update(
    apiKey: ApiKeySelect,
    req: ApiKeyRequest,
  ): ApiKeysInsert {
    return {
      ...apiKey,
      name: req.name,
      description: req.description,
      value: req.value,
      updatedAt: new Date(),
    };
  }
}
