import type { IDeviceStorage } from './deviceStorage'

export class LocalStorageProvider implements IDeviceStorage {
  get<Data>(key: string): Promise<Data | null> {
    const rawData = localStorage.getItem(key)
    if (rawData === null) {
      return Promise.resolve(null)
    }

    const data = JSON.parse(rawData) as Data
    return Promise.resolve(data)
  }

  save(key: string, data: unknown): Promise<void> {
    const serializedData = JSON.stringify(data)
    localStorage.setItem(key, serializedData)
    return Promise.resolve()
  }

  clear(key: string): Promise<void> {
    return Promise.resolve(localStorage.removeItem(key))
  }
}
