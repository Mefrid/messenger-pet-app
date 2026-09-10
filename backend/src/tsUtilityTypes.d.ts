// Only for debug
type Prettify<T> = { [K in keyof T]: T[K] } & {}

type PartialWithSomeRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>

type Replace<T, R extends Partial<Record<keyof T, unknown>>> = Omit<T, keyof R> & R
