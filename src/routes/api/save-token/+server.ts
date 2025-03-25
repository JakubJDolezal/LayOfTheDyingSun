// import { fail, json, redirect } from "@sveltejs/kit";
//
// export const POST = async ({ request, locals }) => {
//   console.log("Received request to save OAuth token...");
//
//   if (!locals?.supabase || !locals?.safeGetSession) {
//     console.error("Supabase or safeGetSession is missing in locals.");
//     return fail(500, { errorMessage: "Server misconfiguration." });
//   }
//
//   const { session, user } = await locals.safeGetSession();
//   console.log("Session:", session);
//   console.log("User:", user);
//
//   if (!session || !user?.id) {
//     console.warn("User is not authenticated. Redirecting...");
//     throw redirect(303, "/login");
//   }
//
//   try {
//     const { provider, token } = await request.json();
//     console.log("Received OAuth Token:", { provider, token: token?.slice(0, 10) + "..." });
//
//     if (!provider || !token) {
//       console.error("Missing provider or token.");
//       return fail(400, { errorMessage: "Provider and token are required." });
//     }
//
//     // Save token to Supabase under the user's profile
//     const { error } = await locals.supabase
//       .from("profiles")
//       .update({ oauth_provider: provider, oauth_token: token })
//       .eq("id", user.id);
//
//     if (error) {
//       console.error("Error saving OAuth token:", error);
//       return fail(500, { errorMessage: "Failed to save OAuth token." });
//     }
//
//     return json({ success: true });
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     return fail(500, { errorMessage: "Unexpected error occurred." });
//   }
// };
