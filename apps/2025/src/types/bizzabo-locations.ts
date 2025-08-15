// We need to hard-code locations because there is no locations endpoint to determine between main stage, build stage, common area, etc. So, we map the locationId retrieved from each session into these display-friendly names.

// Location mapping types (used to map Bizzabo location IDs to display names)
// These types help transform Bizzabo's location IDs into human-readable stage names

export interface BizzaboLocation {
  id: number;
  name: string;
  nameId: string;
  description: string;
}

export const BIZZABO_LOCATIONS: BizzaboLocation[] = [
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
  // {
  //   id: 131725,
  //   name: "Common Area",
  //   nameId: "common-area",
  //   description: "Common Area",
  // },
];
