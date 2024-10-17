import type { EdamamRecipes } from "@/types/Edamam";

export type BookmarkMeal = {
  URIs: BookmarkURI[],
  meals: EdamamRecipes[]
}

export type BookmarkURI = {
  id: number;
  uri: string;
}