import { NextRequest } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/lib/supabase/types"

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data, error } = await supabase.from("users").select("id").limit(1)
    if (error) return Response.json({ success: false, error }, { status: 500 })
    return Response.json({ success: true, data })
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : error }, { status: 500 })
  }
}
