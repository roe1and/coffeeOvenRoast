export interface Recipe {
  recipes: IndividualRecipe[];
}

export interface IndividualRecipe {
  name: string;
  variant: string;
  description: string;
  starttemp: number;
  maintemp: number;
  intervals: number[];
}
