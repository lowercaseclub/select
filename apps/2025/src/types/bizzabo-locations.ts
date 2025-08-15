// We need to hard-code locations because there is no locations endpoint to determine between main stage, build stage, common area, etc. So, we map the locationId retrieved from each session into these display-friendly names.

// Location mapping types (used to map Bizzabo location IDs to display names)
// These types help transform Bizzabo's location IDs into human-readable stage names

export interface BizzaboLocation {
  id: number;
  name: string;
  nameId: string;
  description: string;
}

// Environment-specific location mappings
const DEV_LOCATIONS: BizzaboLocation[] = [
  {
    id: 131741,
    name: "Main Stage",
    nameId: "main-stage",
    description: "HQ Building 1",
  },
  {
    id: 131743,
    name: "Build Stage",
    nameId: "build-stage",
    description: "520 YC",
  },
];

const PROD_LOCATIONS: BizzaboLocation[] = [
  {
    id: 131723,
    name: "Main Stage",
    nameId: "main-stage",
    description: "HQ Building 1",
  },
  {
    id: 131724,
    name: "Build Stage",
    nameId: "build-stage",
    description: "520 YC",
  },
  {
    id: 131725,
    name: "Common Area",
    nameId: "common-area",
    description: "Common Area",
  },
];

// Use prod locations if NEXT_PUBLIC_VERCEL_ENV is production, otherwise use dev
export const BIZZABO_LOCATIONS: BizzaboLocation[] =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? PROD_LOCATIONS
    : DEV_LOCATIONS;
