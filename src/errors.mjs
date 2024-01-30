const createErrorFactory = name =>
  class CustomError extends Error {
    constructor (message) {
      super(message)
      this.name = name
    }
  }

export const InputError = createErrorFactory('InputError')
