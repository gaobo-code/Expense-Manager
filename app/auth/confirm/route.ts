import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const code = searchParams.get("code");
  const type = searchParams.get("type") as EmailOtpType | null;
  const requestedPath = searchParams.get("next");
  const next =
    requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
      ? requestedPath
      : type === "recovery"
        ? "/auth/update-password"
        : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }

    const errorUrl = new URL("/auth/error", request.url);
    errorUrl.searchParams.set("error", error.message);
    return NextResponse.redirect(errorUrl);
  }

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }

    const errorUrl = new URL("/auth/error", request.url);
    errorUrl.searchParams.set("error", error.message);
    return NextResponse.redirect(errorUrl);
  }

  const errorUrl = new URL("/auth/error", request.url);
  errorUrl.searchParams.set("error", "The password reset link is invalid or incomplete.");
  return NextResponse.redirect(errorUrl);
}
