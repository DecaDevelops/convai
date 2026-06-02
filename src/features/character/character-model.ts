import { characterRequest } from "./character-type";

export class CharacterModel implements characterRequest {
  public updatedAt: Date;
  constructor(
    public name: string,
    public description: string,
    public personality: string,
    public exampleDialogue: string,
    public instructions: string,
    public scenario: string,
    public tags: string[],
    public greeting: string,
  ) {
    this.updatedAt = new Date();
  }
}
