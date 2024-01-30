const createErrorFactory = name =>
  class CustomError extends Error {
    constructor (message) {
      super(message)
      this.name = name
    }
  }

export const InitError = createErrorFactory('Initialization Error')
