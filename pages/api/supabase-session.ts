import type { NextApiRequest, NextApiResponse } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/lib/supabase/types"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Sunucu tarafı Supabase client
    // Not: next/headers sadece app router'da, burada req.cookies kullanılmalı
    const supabase = createServerComponentClient<Database>({ cookies: () => req.cookies })
    const { data, error } = await supabase.auth.getSession()
    if (error) return res.status(500).json({ error })
    return res.status(200).json({ session: data.session })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : error })
  }
} 