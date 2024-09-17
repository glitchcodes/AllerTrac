import { Author } from "@/types/Author";

export type Fact = {
  id: number
  title: string
  description: string
  category: string
  cover_image: string
  references: string
  author: Author
}