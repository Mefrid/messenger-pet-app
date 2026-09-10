export default interface IUseCase<T> {
  call(...parameters: unknown[]): T | Promise<T>
}
