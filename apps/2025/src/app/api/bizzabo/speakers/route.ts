import { NextRequest, NextResponse } from "next/server";
import { getBizzaboClient } from "@/lib/bizzabo-api";
import { FALLBACK_SPEAKERS } from "@/types/fallback-data";

export async function GET(request: NextRequest) {
  try {
    const client = getBizzaboClient();

    // Try to get speakers, but handle the case where they might not exist yet
    let speakers: any[] = [];

    try {
      speakers = await client.getSpeakers();
    } catch (apiError) {
      console.error("Speakers not available yet, using fallback data");
    }

    // If no speakers from Bizzabo, use fallback data
    if (speakers.length === 0) {
      speakers = FALLBACK_SPEAKERS;
    }

    // Transform Bizzabo speakers to match our component's expected format
    const transformedSpeakers = speakers.map((speaker: any) => {
      // Try to find matching fallback speaker data
      const fallbackSpeaker = FALLBACK_SPEAKERS.find(
        (fallback) =>
          fallback.firstName.toLowerCase() ===
            speaker.firstname?.toLowerCase() &&
          fallback.lastName.toLowerCase() === speaker.lastname?.toLowerCase()
      );

      return {
        id: speaker.id,
        name: `${speaker.firstname} ${speaker.lastname}`,
        title: fallbackSpeaker?.title || "",
        company: fallbackSpeaker?.company || "",
        bio: fallbackSpeaker?.bio || "",
        imageUrl:
          speaker.photoSet?.large ||
          speaker.photoSet?.medium ||
          speaker.photoSet?.small ||
          fallbackSpeaker?.imageUrl,
        socialLinks: {
          linkedin: speaker.linkedIn || fallbackSpeaker?.socialLinks?.linkedin,
          twitter:
            speaker.twitterHandle || fallbackSpeaker?.socialLinks?.twitter,
          website: speaker.web || fallbackSpeaker?.socialLinks?.website,
        },
      };
    });

    return NextResponse.json(transformedSpeakers);
  } catch (error) {
    console.error("Error fetching speakers from Bizzabo:", error);
    return NextResponse.json(
      { error: "Failed to fetch speakers" },
      { status: 500 }
    );
  }
}
