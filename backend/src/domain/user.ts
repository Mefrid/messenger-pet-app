export class User {
  constructor(
    public readonly id: UUID,
    public readonly name: string,
    public readonly surname: string,
    public readonly login: string,
    public readonly avatarUrl: string,
    public readonly birthDate?: Date,
    public readonly passwordHash?: string,
    public readonly online?: boolean,
  ) {}
}

export type UserDTO = Omit<User, 'passwordHash'>
