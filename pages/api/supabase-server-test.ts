import type { NextApiRequest, NextApiResponse } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/supabase/types"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const supabase = createServerComponentClient<Database>({ cookies: () => req.cookies })
    // Basit bir tabloya erişim testi (ör: users)
    const { data, error } = await supabase.from("users").select("id").limit(1)
    if (error) return res.status(500).json({ success: false, error })
    return res.status(200).json({ success: true, data })
  } catch (error) {
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : error })
  }
} 