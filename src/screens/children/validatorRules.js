/* eslint-disable prettier/prettier */
// Sample validation rules for a registration form
const reset= {
    first_name: "",
    last_name: "",
    gender: "",
    uri : "",
    genotype: "",     
    dateOfBirth : new Date()
  }
const childRules = {
  rules: {
     gender: [
      {
        pattern: /^.+$/,
        message: 'Gender is required'
      }      
    ],
    genotype: [
      {
        pattern: /^.+$/,
        message: 'Genotype is required'
      }      
    ],
    dateOfBirth: [
      {
        pattern: /^.+$/,
        message: 'Date of birth is required'
      },
      {
        pattern: /^.{0,50}$/,
        message: 'Date of birth must be no more than 50 characters'
      }
    ],
   first_name: [
      {
        pattern: /^.+$/,
        message: 'firstname is required'
      },
      {
        pattern: /^.{0,50}$/,
        message: 'firstname must be no more than 50 characters'
      }
    ],
    last_name: [
      {
        pattern: /^.+$/,
        message: 'lastname is required'
      },
      {
        pattern: /^.{0,50}$/,
        message: 'lastname must be no more than 50 characters'
      }
    ]   
  },
  reset : reset,
  fields: {
    ...reset
  },
  
}

export { childRules }