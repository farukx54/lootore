import { NextRequest } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/lib/supabase/types"

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data, error } = await supabase.auth.getSession()
    if (error) return Response.json({ error }, { status: 500 })
    return Response.json({ session: data.session })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : error }, { status: 500 })
  }
} 