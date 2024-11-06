import type { Allergen } from "@/types/Allergen";

export type FoodvisorResponse = {
  analysis_id: string
  items: FoodvisorItem[]
}

export type FoodvisorItem = {
  position: FoodvisorPosition
  food: FoodvisorFood[]
}

export type FoodvisorPosition = {
  x: number
  y: number
  width: number
  height: number
}

export type FoodvisorFood = {
  confidence: number
  ingredients: string[]
  food_info: FoodvisorFoodInfo
}

export type FoodvisorFoodInfo = {
  food_id: string
  fv_grade: string
  display_name: string
  allergens: Allergen[]
}