import { fail, json, redirect } from "@sveltejs/kit";
import {
  AZURE_URL,
  GCP_URL
} from "$env/static/private";
export const POST = async ({ request, locals }) => {
  console.log("Received request to save graph...");

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
    const data = await request.json();
    console.log("Graph Data Received:", data);

    if (!data?.graph) {
      console.error("No graph data provided.");
      return fail(400, { errorMessage: "Graph data is required" });
    }

    // Save to Supabase
    const { error } = await locals.supabaseServiceRole
      .from("service_info")
      .update({ graph: data.graph })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error saving graph:", error);
      return fail(500, { errorMessage: "Failed to save graph" });
    }


    const provider = user.app_metadata?.provider || "unknown";
    const email = user.email;
    // const endpoint =
    //   provider === "azure"
    //     ? `${AZURE_URL}/update-labels-user/${email}`
    //     : provider === "google"
    //     ? `${GCP_URL}/update-labels-user/${email}`
    //     : null;
    //
    // if (!endpoint) {
    //   console.warn("Unknown provider, skipping label update call.");
    // } else {
    //   try {
    //     const res = await fetch(endpoint, { method: "POST" });
    //     if (!res.ok) {
    //       console.error(`Label update failed (${res.status}):`, await res.text());
    //     } else {
    //       console.log("Label update succeeded.");
    //     }
    //   } catch (err) {
    //     console.error("Error calling label update endpoint:", err);
    //   }
    // }
    const endpoint =
      provider === "azure"
        ? `${AZURE_URL}/refresh-gmail-watch-user/`
        : provider === "google"
        ? `${GCP_URL}/refresh-gmail-watch-user/`
        : null;

    if (!endpoint) {
      console.warn("Unknown provider, skipping label update call.");
    } else {
      try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: email
            })
          });
        if (!res.ok) {
          console.error(`Label update failed (${res.status}):`, await res.text());
        } else {
          console.log("Label update succeeded.");
        }
      } catch (err) {
        console.error("Error calling label update endpoint:", err);
      }
    }

    return json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return fail(500, { errorMessage: "Unexpected error occurred" });
  }
};
