import type { IPasswordHasher } from '../../application/ports/passwordHasher.js'
import argon2 from 'argon2'

export class ArgonPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return argon2.hash(password)
  }

  verify(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password)
  }
}
