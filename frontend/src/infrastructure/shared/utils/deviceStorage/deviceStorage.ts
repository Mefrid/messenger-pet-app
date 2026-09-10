export interface IDeviceStorage {
  save(key: string, data: unknown): Promise<void>

  get<Data>(key: string): Promise<Data | null>

  clear(key: string): Promise<void>
}
