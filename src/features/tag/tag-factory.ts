import { v4 } from "uuid";
import { TagInsert, TagRequest, TagSelect } from "./tag-types";

export class TagFactory {
  public static Create(req: TagRequest): TagInsert {
    const date = new Date();
    return {
      name: req.name,
      description: req.description,
      createdAt: date,
      updatedAt: date,
    };
  }

  public static Update(tag: TagSelect, req: TagRequest): TagInsert {
    return {
      id: tag.id,
      name: req.name,
      description: req.description,
      createdAt: tag.createdAt,
      updatedAt: new Date(),
    };
  }
}
