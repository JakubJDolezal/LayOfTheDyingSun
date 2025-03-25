import { redirect } from "@sveltejs/kit";
import { isAuthApiError } from "@supabase/supabase-js";
export const GET = async ({ url, locals: { supabase, supabaseServiceRole } }) => {
  const code = url.searchParams.get("code");
  if (!code) {
    console.error("No auth code found in URL.");
    throw redirect(303, "/login");
  }

  try {
    const { data: session, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;

  const user = session?.user;
  if (!user || !user.email) {
    console.error("Missing user data.");
    throw redirect(303, "/login");
  }

  const provider = user.app_metadata?.provider || "unknown";


  console.log("Identities:", session?.user?.identities);
  if (error) {
    console.error("Error getting session:", error)
  } else if (session) {
      const { provider_token, provider_refresh_token } = session.session
      console.log("Google Provider Token:", provider_token)
      console.log("Google Provider Refresh Token:", provider_refresh_token)
      const {
        expires_in
      } = session.session || {};

      const expires_at = Date.now() + expires_in * 1000;

      await supabaseServiceRole.from("service_info").upsert({
        user_id: user.id,
        email: user.email,
        provider,
        access_token:provider_token,
        refresh_token:provider_refresh_token,
        expires_at
      });
      await supabaseServiceRole
        .from("profiles")
        .update({
          full_name: user.user_metadata?.full_name ?? "Unnamed User",
          company_name: "Default Company",
          website: "https://example.com",
          updated_at: new Date().toISOString(), // if your table uses timestamps
          unsubscribed: false // or whatever your logic is
        })
        .eq("id", user.id);
  }

  } catch (error) {
    console.error("OAuth callback error:", error);
    if (isAuthApiError(error)) {
      throw redirect(303, "/login/sign_in?verified=true");
    } else {
      throw error;
    }
  }



  // const next = url.searchParams.get("next");
  throw redirect(303,  "/account/create_profile");
};
