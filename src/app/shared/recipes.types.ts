export interface Recipe {
  recipes: IndividualRecipe[];
}

export interface IndividualRecipe {
  id: string;
  name: string;
  variant: string;
  size: number;
  description: string;
  starttemp: number;
  maintemp: number;
  intervals: number[];
}
