/**
 * Set class implementing custom object equality function
 */
export class ObjectValueSet<T extends object, K extends Extract<keyof T, string | number>> {
  private objects: Partial<Record<Extract<T[K], string | number | symbol>, T>> = {}
  private keyProperty: K

  constructor(initialObjects: T[], keyProperty: K) {
    this.keyProperty = keyProperty

    for (const obj of initialObjects) {
      this.add(obj)
    }
  }

  add(obj: T) {
    if (!this.hasObject(obj)) {
      const key = obj[this.keyProperty] as Extract<T[K], string | number | symbol>
      this.objects[key] = obj
    }
  }

  addMultiple(objects: T[]) {
    for (const obj of objects) {
      this.add(obj)
    }
  }

  get(key: T[K]): T | undefined {
    const _key = key as Extract<T[K], string | number | symbol>
    return this.objects[_key]
  }

  remove(obj: T) {
    if (this.hasObject(obj)) {
      const key = obj[this.keyProperty] as Extract<T[K], string | number | symbol>
      delete this.objects[key]
    }
  }

  update(key: T[K], newObjectProperties: Omit<Partial<T>, K>) {
    const _key = key as Extract<T[K], string | number | symbol>
    const existingObj = this.objects[_key]

    if (!existingObj) {
      console.warn(`There is no object with key ${key} in ObjectValueSet`)
      return
    }

    const newObject = {
      ...existingObj,
      ...newObjectProperties,
    } as typeof existingObj

    this.objects[_key] = newObject
  }

  private hasObject(obj: T) {
    const key = obj[this.keyProperty] as Extract<T[K], string>
    return Object.keys(this.objects).includes(key)
  }
}
