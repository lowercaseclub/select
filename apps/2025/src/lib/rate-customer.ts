interface CustomerioSegment {
  id: number;
  name: string;
  description: string;
}

interface CustomerRating {
  score: number; // 0-100
  tier: "tier1" | "tier2" | "tier3" | "tier4";
  factors: string[];
}

export function rateCustomer(segments: CustomerioSegment[]): CustomerRating {
  let score = 0;
  const factors: string[] = [];

  // Convert segments to a set of names for easier checking
  const segmentNames = new Set(segments.map((s) => s.name.toLowerCase()));

  // High-value indicators (positive scoring)
  if (segmentNames.has("on enterprise plan")) {
    score += 40;
    factors.push("Enterprise plan subscriber");
  } else if (segmentNames.has("on team plan")) {
    score += 25;
    factors.push("Team plan subscriber");
  } else if (segmentNames.has("on pro plan")) {
    score += 15;
    factors.push("Pro plan subscriber");
  } else if (segmentNames.has("on free plan")) {
    score += 5;
    factors.push("Free plan user");
  }

  if (segmentNames.has("previous launch week signups")) {
    score += 8;
    factors.push("Previous launch week signup");
  }

  if (segmentNames.has("current launch week signups")) {
    score += 8;
    factors.push("Current launch week signup");
  }

  // Product activation indicators
  const activationSegments = [
    "auth activated at exists",
    "func activated at exists",
    "real time activated at exists",
    "rest activated at exists",
    "storage activated at exists",
  ];

  const activatedServices = activationSegments.filter((segment) =>
    segmentNames.has(segment)
  ).length;

  if (activatedServices > 0) {
    score += activatedServices * 3;
    factors.push(`${activatedServices} Supabase services activated`);
  }

  // Determine tier based on score
  let tier: "tier1" | "tier2" | "tier3" | "tier4";
  if (score >= 60) {
    tier = "tier1";
  } else if (score >= 40) {
    tier = "tier2";
  } else if (score >= 20) {
    tier = "tier3";
  } else {
    tier = "tier4";
  }

  // Cap score at 100
  score = Math.min(score, 100);

  return {
    score,
    tier,
    factors,
  };
}
