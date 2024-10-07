export interface EdamamResult {
  from: number;
  to: number;
  count: number;
  _links: EdamamLinks;
  hits: EdamamRecipes[];
}

export interface EdamamLinks {
  next: EdamamLink;
}

export interface EdamamLink {
  href: string;
  title: string;
}

export interface EdamamRecipes {
  recipe: EdamamRecipe;
  _links: EdamamLinks;
}

export interface EdamamRecipe {
  uri: string;
  label: string;
  image: string;
  images: EdamamImages;
  source: string;
  url: string;
  shareAs: string;
  yield: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  ingredientLines: string[];
  ingredients: EdamamIngredient[];
  calories: number;
  totalCO2Emissions: number;
  co2EmissionsClass: string;
  totalWeight: number;
  totalTime: number;
  cuisineType: string[];
  mealType: string[];
  dishType: string[];
  totalNutrients: EdamamNutrients;
  totalDaily: EdamamNutrients;
  digest: EdamamDigest[];
}

export interface EdamamImages {
  [key: string]: EdamamImage;
}

export interface EdamamImage {
  url: string;
  width: number;
  height: number;
}

export interface EdamamIngredient {
  foodId: string;
  food: string;
  foodCategory: string;
  text: string
  image: string;
  quantity: number;
  measure: string;
  weight: number;
}

export interface EdamamNutrients {
  [key: string]: EdamamNutrient;
}

export interface EdamamNutrient {
  label: string;
  quantity: number;
  unit: string;
}

export interface EdamamDigest {
  label: string;
  tag: string;
  schemaOrgTag: string;
  total: number;
  hasRDI: boolean;
  daily: number;
  unit: string;
}