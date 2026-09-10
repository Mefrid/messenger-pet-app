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

  update(id: T[K], newObject: T): ObjectValueSet<T, K> {
    const objects = Object.values(this.objects) as T[]
    const newObjects = objects.map((obj) => {
      if (obj[this.keyProperty] === id) {
        return newObject
      }
      return obj
    })
    return new ObjectValueSet(newObjects, this.keyProperty)
  }

  private hasObject(obj: T) {
    const key = obj[this.keyProperty] as Extract<T[K], string>
    return Object.keys(this.objects).includes(key)
  }
}
