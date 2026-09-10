export class ChatParticipant {
  constructor(
    public readonly userId: UUID,
    public readonly joined?: Date,
  ) {}
}
