import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedPath = requestUrl.searchParams.get("next");
  const next =
    requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
      ? requestedPath
      : "/auth/update-password";

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/error?error=Missing recovery code", requestUrl.origin),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const errorUrl = new URL("/auth/error", requestUrl.origin);
    errorUrl.searchParams.set("error", error.message);
    return NextResponse.redirect(errorUrl);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
