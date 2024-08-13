/* eslint-disable prettier/prettier */
// Sample validation rules for a registration form
const reset= {
    vaccine_id: "",    
    time: new Date(),
    provider: "",       
    date : new Date(),
    reminder : 0,
    status : 0
  }
const cardRules = {

  rules: {
     vaccine_id: [
      {
        pattern: /^.+$/,
        message: 'Vaccine is required'
      }      
    ],    
    date: [
      {
        pattern: /^.+$/,
        message: 'Date is required'
      }      
    ],
    time: [
      {
        pattern: /^.+$/,
        message: 'Time is required'
      }      
    ],
    provider: [
      {
        pattern: /^.+$/,
        message: 'Provider location is required'
      }      
    ],
  },
  reset : reset,
  fields: {
    ...reset
  },
  
}

export { cardRules }