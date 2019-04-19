import isEmpty from 'is-empty'

export const validateData = data => {
  const errors = {}

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
