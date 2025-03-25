import { json, fail, redirect } from "@sveltejs/kit";

export const GET = async ({ locals }) => {
  console.log("Received request to load graph...");

  if (!locals?.supabase || !locals?.safeGetSession) {
    console.error("Supabase or safeGetSession is missing in locals.");
    return fail(500, { errorMessage: "Server misconfiguration." });
  }

  const { session, user } = await locals.safeGetSession();
  console.log("Session:", session);
  console.log("User:", user);

  if (!session || !user?.id) {
    console.warn("User is not authenticated. Redirecting...");
    throw redirect(303, "/login");
  }

  try {
    const { data, error } = await locals.supabaseServiceRole
      .from("service_info")
      .select("graph")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error loading graph:", error);
      return fail(500, { errorMessage: "Failed to load graph" });
    }

    console.log("Graph Data Loaded:", data?.graph || "No data found");

    return json({ graph: data?.graph || { nodes: [], edges: [] } });
  } catch (error) {
    console.error("Unexpected error:", error);
    return fail(500, { errorMessage: "Unexpected error occurred" });
  }
};
