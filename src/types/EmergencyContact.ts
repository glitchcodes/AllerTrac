export type EmergencyContact = {
  id?: number
  full_name: string
  relationship: "parent" | "spouse" | "sibling" | "child" | "other"
  phone_number: string
  email?: string
}