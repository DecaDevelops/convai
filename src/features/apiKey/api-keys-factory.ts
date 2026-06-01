import { v4 as uuidv4 } from "uuid";
import { ApiKeyRequest, ApiKeysInsert } from "./api-keys-types";
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
}
