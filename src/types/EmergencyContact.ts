export type EmergencyContact = {
  id?: number
  full_name: string
  relationship: "parent" | "spouse" | "sibling" | "child" | "other"
  relationship_specific?: string
  phone_number: string
  email?: string
}