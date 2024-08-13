/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { VACCINES } from "../configs/vaccines";

export interface Vaccine {
  vaccine_id: string;
  name: string;
  description: string;
  dosage: string;
  uri?: string;
}

const queryAllVaccines =():  Vaccine[] => {
   return VACCINES.sort((a, b) => a.name.localeCompare(b.name));
};

const queryVaccineById = (vaccine_id: string): Vaccine | undefined => {
  return VACCINES.find(vaccine => vaccine?.vaccine_id === vaccine_id);
};

export {  
  queryVaccineById,
  queryAllVaccines,
};