import type React from "react"
import type { Metadata } from "next"
import ProfileLayoutClient from "./ProfileLayoutClient"

export const metadata: Metadata = {
  title: "Profil | LootOre",
  description: "LootOre kullanıcı profil sayfası",
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <ProfileLayoutClient children={children} />
}
