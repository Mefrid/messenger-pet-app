export interface IValidationResult {
  errors?: string[]
}

export default interface IValidator<T> {
  validate(target: Partial<T>): IValidationResult
}
