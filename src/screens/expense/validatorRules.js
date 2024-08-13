/* eslint-disable prettier/prettier */
// Sample validation rules for a registration form
const reset= {   
    category_id: "",  
    amount: "",     
    date : new Date()
  }
const expenseRules = {
  rules: {
     category_id: [
      {
        pattern: /^.+$/,
        message: 'category is required'
      }      
    ],   
    date: [
      {
        pattern: /^.+$/,
        message: 'date is required'
      }      
    ],
    amount: [
      { pattern: /^\d+(\.\d+)?$/, message: 'amount is required' },
      {
        pattern: /^.{0,9}$/,
        message: 'amount must be no more than 9 characters'
      }
    ]    
  },
  reset : reset,
  fields: {
    ...reset
  },
  
}

export { expenseRules }