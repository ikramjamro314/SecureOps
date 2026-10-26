export interface MockGuard {
  id: string;
  badgeId: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: "MALE" | "FEMALE";
  address: string;
  role: "GUARD";
  shift: "Morning" | "Evening" | "Night";
  verified: boolean;
  rating: number;
  image?: string;
  updatedAt: string;
  location: {
    lat: number;
    lng: number;
    name: string;
    status: "inside" | "outside";
    lastPing: string;
  };
  prevExperience: {
    workPlace: string;
    experinceYears: number;
    joiningData: string;
  }[];
  ratingsReceived: {
    id: string;
    author: string;
    location: string;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
  agencyId: string;
  agencyName: string;
}

export interface MockAttendance {
  id: string;
  userId: string;
  guardBadgeId?: string;
  guardName: string;
  checkIn: string;
  checkOut: string;
  location: string;
  present: boolean;
  status: "Present" | "Absent";
  shift: string;
  date: string;
  coords?: { lat: number; lng: number };
}

export interface MockIncident {
  id: string;
  incidentID: string;
  from: string;
  subject: string;
  type: string;
  message: string;
  location: string;
  received: string;
  time: string;
  status: "Active" | "Pending" | "Dispatched" | "Resolved";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  suspectDescription?: string;
}

export interface MockAgency {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  activeGuardsCount: number;
  description: string;
  specialization: string;
  users: Partial<MockGuard>[];
}

export const INITIAL_GUARDS: MockGuard[] = [
  {
    id: "65b1234567890abcde100101",
    badgeId: "GRD-101",
    name: "Muhammad Tariq",
    email: "tariq.guard@secureops.com",
    phone: "+92 300 1234567",
    age: 34,
    gender: "MALE",
    address: "Main Perimeter Gate, Sector 4 Complex",
    role: "GUARD",
    shift: "Night",
    verified: true,
    rating: 4.9,
    image: "/assets/logo.png",
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    location: {
      lat: 22.7757945,
      lng: 86.1468304,
      name: "Main Perimeter Gate, Sector 4",
      status: "inside",
      lastPing: "Just now",
    },
    prevExperience: [
      { workPlace: "Z-Plus Tactical Facility Security", experinceYears: 4, joiningData: "2019-03-10" },
      { workPlace: "Metro Corporate Security Corp", experinceYears: 3, joiningData: "2023-01-15" },
    ],
    ratingsReceived: [
      {
        id: "r1",
        author: "Alice Watson",
        location: "Flat 302, Tower 1",
        rating: 5,
        comment: "Extremely vigilant during late night rounds. Prevented suspicious parking.",
        createdAt: "2025-02-14",
      },
      {
        id: "r2",
        author: "Robert Chen",
        location: "Commercial Arcade",
        rating: 4.8,
        comment: "Punctual, disciplined, and very polite with residents.",
        createdAt: "2025-02-10",
      },
    ],
    agencyId: "agency-1",
    agencyName: "Apex Tactical Defense",
  },
  {
    id: "65b1234567890abcde100102",
    badgeId: "GRD-102",
    name: "Bilal Ahmed Khan",
    email: "bilal.ahmed@secureops.com",
    phone: "+92 321 9876543",
    age: 29,
    gender: "MALE",
    address: "West Commercial Plaza, Checkpoint 2",
    role: "GUARD",
    shift: "Morning",
    verified: true,
    rating: 4.7,
    image: "/assets/logo.png",
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    location: {
      lat: 22.7771,
      lng: 86.1482,
      name: "West Entrance Checkpoint",
      status: "inside",
      lastPing: "5 mins ago",
    },
    prevExperience: [
      { workPlace: "G4S Tactical Security Services", experinceYears: 3, joiningData: "2021-06-01" },
    ],
    ratingsReceived: [
      {
        id: "r3",
        author: "Pooja Hegde",
        location: "Villa 12",
        rating: 4.6,
        comment: "Great response time during visitor check-ins.",
        createdAt: "2025-02-12",
      },
    ],
    agencyId: "agency-1",
    agencyName: "Apex Tactical Defense",
  },
  {
    id: "65b1234567890abcde100103",
    badgeId: "GRD-103",
    name: "Zubair Ali Shah",
    email: "zubair.shah@secureops.com",
    phone: "+92 333 4567890",
    age: 38,
    gender: "MALE",
    address: "Outer Industrial Zone, Depot 8",
    role: "GUARD",
    shift: "Evening",
    verified: false,
    rating: 4.3,
    image: "/assets/logo.png",
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    location: {
      lat: 22.7600000,
      lng: 86.1400000,
      name: "Outer Industrial Zone Depot",
      status: "outside",
      lastPing: "18 mins ago",
    },
    prevExperience: [
      { workPlace: "Industrial Safety Guards", experinceYears: 5, joiningData: "2018-02-11" },
    ],
    ratingsReceived: [
      {
        id: "r4",
        author: "Director Menon",
        location: "Admin Wing",
        rating: 4.3,
        comment: "Reliable patrol record, currently operating in outer sector depot.",
        createdAt: "2025-01-28",
      },
    ],
    agencyId: "agency-2",
    agencyName: "Sentinel Shield Operations",
  },
  {
    id: "65b1234567890abcde100104",
    badgeId: "GRD-104",
    name: "Abdul Rasheed Baloch",
    email: "rasheed.baloch@secureops.com",
    phone: "+92 345 6789012",
    age: 36,
    gender: "MALE",
    address: "Retail Center Surveillance Booth, Sector 2",
    role: "GUARD",
    shift: "Morning",
    verified: true,
    rating: 4.8,
    image: "/assets/logo.png",
    updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    location: {
      lat: 22.7762,
      lng: 86.1471,
      name: "Retail Center Surveillance Booth",
      status: "inside",
      lastPing: "1 min ago",
    },
    prevExperience: [
      { workPlace: "Diplomatic Enclave Protection", experinceYears: 4, joiningData: "2020-11-20" },
    ],
    ratingsReceived: [
      {
        id: "r5",
        author: "Kavita Rao",
        location: "Central Mall Plaza",
        rating: 5.0,
        comment: "Excellent surveillance handling and swift crowd management.",
        createdAt: "2025-02-15",
      },
    ],
    agencyId: "agency-1",
    agencyName: "Apex Tactical Defense",
  },
  {
    id: "65b1234567890abcde100105",
    badgeId: "GRD-105",
    name: "Farhan Murtaza",
    email: "farhan.murtaza@secureops.com",
    phone: "+92 312 3456789",
    age: 31,
    gender: "MALE",
    address: "North Residential Tower Access, Block C",
    role: "GUARD",
    shift: "Night",
    verified: true,
    rating: 4.7,
    image: "/assets/logo.png",
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    location: {
      lat: 22.7768,
      lng: 86.1479,
      name: "North Tower Entrance",
      status: "inside",
      lastPing: "2 mins ago",
    },
    prevExperience: [
      { workPlace: "Elite Corporate Protection", experinceYears: 3, joiningData: "2022-04-15" },
    ],
    ratingsReceived: [
      {
        id: "r6",
        author: "Sarah Jenkins",
        location: "Tower C Resident",
        rating: 4.8,
        comment: "Very polite, always checks resident vehicle tags strictly.",
        createdAt: "2025-02-11",
      },
    ],
    agencyId: "agency-2",
    agencyName: "Sentinel Shield Operations",
  },
];

export const INITIAL_ATTENDANCE: MockAttendance[] = [
  {
    id: "att-1",
    userId: "65b1234567890abcde100101",
    guardBadgeId: "GRD-101",
    guardName: "Muhammad Tariq",
    checkIn: new Date().toLocaleDateString() + " 22:00",
    checkOut: "Ongoing Shift",
    location: "Main Perimeter Gate, Sector 4",
    present: true,
    status: "Present",
    shift: "Night",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "att-2",
    userId: "65b1234567890abcde100102",
    guardBadgeId: "GRD-102",
    guardName: "Bilal Ahmed Khan",
    checkIn: new Date().toLocaleDateString() + " 06:00",
    checkOut: new Date().toLocaleDateString() + " 14:00",
    location: "West Entrance Checkpoint",
    present: true,
    status: "Present",
    shift: "Morning",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "att-3",
    userId: "65b1234567890abcde100103",
    guardBadgeId: "GRD-103",
    guardName: "Zubair Ali Shah",
    checkIn: new Date().toLocaleDateString() + " 14:15",
    checkOut: "Ongoing Shift",
    location: "Outer Perimeter Depot (Warning: Geofence Discrepancy)",
    present: true,
    status: "Present",
    shift: "Evening",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "att-4",
    userId: "65b1234567890abcde100104",
    guardBadgeId: "GRD-104",
    guardName: "Abdul Rasheed Baloch",
    checkIn: new Date().toLocaleDateString() + " 06:05",
    checkOut: new Date().toLocaleDateString() + " 14:00",
    location: "Retail Center Surveillance Booth",
    present: true,
    status: "Present",
    shift: "Morning",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "att-5",
    userId: "65b1234567890abcde100105",
    guardBadgeId: "GRD-105",
    guardName: "Farhan Murtaza",
    checkIn: new Date().toLocaleDateString() + " 22:00",
    checkOut: "Ongoing Shift",
    location: "North Tower Entrance",
    present: true,
    status: "Present",
    shift: "Night",
    date: new Date().toISOString().split("T")[0],
  },
];

export const INITIAL_INCIDENTS: MockIncident[] = [
  {
    id: "inc-1",
    incidentID: "SEC-2025-912",
    from: "resident.care@gmail.com",
    subject: "Theft Report & ATM Alarm",
    type: "Theft Alert",
    message: "Unauthorized access detected around SBI ATM corner near Sector 4 Gate.",
    location: "Kadma Sonari Link Road, Sector 4",
    received: "2025-02-15",
    time: "02:45 AM IST",
    status: "Active",
    priority: "CRITICAL",
    suspectDescription: "Male, approx 5'9, dark jacket, observed loitering near back ATM entrance.",
  },
  {
    id: "inc-2",
    incidentID: "SEC-2025-884",
    from: "commercial.manager@secureops.demo",
    subject: "Vandalism near East Wing",
    type: "Suspicious Activity",
    message: "Graffiti and damaged lock found on power substation outer door.",
    location: "East Wing Power Facility",
    received: "2025-02-14",
    time: "02:15 PM IST",
    status: "Dispatched",
    priority: "HIGH",
    suspectDescription: "Two individuals on motorcycle fleeing towards highway junction.",
  },
  {
    id: "inc-3",
    incidentID: "SEC-2025-720",
    from: "safety.patrol@secureops.demo",
    subject: "Traffic Block & Parking Dispute",
    type: "Other",
    message: "Unregistered freight vehicle blocking emergency exit lane at Gate 2.",
    location: "Commercial Delivery Bay",
    received: "2025-02-13",
    time: "04:45 PM IST",
    status: "Resolved",
    priority: "MEDIUM",
    suspectDescription: "Commercial delivery truck, driver cooperated with security relocation.",
  },
];

export const INITIAL_AGENCIES: MockAgency[] = [
  {
    id: "agency-1",
    name: "Apex Tactical Defense",
    email: "contact@apextactical.demo",
    phone: "+91 99887 76655",
    address: "Cyber City Hub, Tower 3, Suite 400",
    rating: 4.8,
    activeGuardsCount: 42,
    description: "Specialized in 24/7 AI-supervised physical security, event escort, and residential community protection.",
    specialization: "AI-Monitored Geofenced Patrols",
    users: INITIAL_GUARDS.slice(0, 3),
  },
  {
    id: "agency-2",
    name: "Sentinel Shield Operations",
    email: "dispatch@sentinelshield.demo",
    phone: "+91 99887 76644",
    address: "Central Industrial Park, Building 7",
    rating: 4.6,
    activeGuardsCount: 28,
    description: "Rapid incident response, perimeter patrol surveillance, and background-vetted personnel.",
    specialization: "Critical Infrastructure & Industrial Security",
    users: INITIAL_GUARDS.slice(2, 5),
  },
];

// Helper to access / persist in browser localStorage
export const getLocalStore = () => {
  if (typeof window === "undefined") {
    return {
      guards: INITIAL_GUARDS,
      attendance: INITIAL_ATTENDANCE,
      incidents: INITIAL_INCIDENTS,
      agencies: INITIAL_AGENCIES,
    };
  }

  try {
    let guards = JSON.parse(localStorage.getItem("secureops_guards") || "null");
    // Migrate stale cache or old placeholder names to new real guards
    if (!guards || !Array.isArray(guards) || guards.some((g: any) => g.name === "Vikram Rathore" || !g.badgeId)) {
      guards = INITIAL_GUARDS;
      localStorage.setItem("secureops_guards", JSON.stringify(INITIAL_GUARDS));
    }

    let attendance = JSON.parse(localStorage.getItem("secureops_attendance") || "null");
    // Migrate stale attendance records
    if (!attendance || !Array.isArray(attendance) || attendance.some((a: any) => a.guardName === "Vikram Rathore" || !a.guardBadgeId)) {
      attendance = INITIAL_ATTENDANCE;
      localStorage.setItem("secureops_attendance", JSON.stringify(INITIAL_ATTENDANCE));
    }

    const incidents = JSON.parse(localStorage.getItem("secureops_incidents") || "null") || INITIAL_INCIDENTS;
    const agencies = JSON.parse(localStorage.getItem("secureops_agencies") || "null") || INITIAL_AGENCIES;

    return { guards, attendance, incidents, agencies };
  } catch {
    return {
      guards: INITIAL_GUARDS,
      attendance: INITIAL_ATTENDANCE,
      incidents: INITIAL_INCIDENTS,
      agencies: INITIAL_AGENCIES,
    };
  }
};

export const saveLocalStore = (data: {
  guards?: MockGuard[];
  attendance?: MockAttendance[];
  incidents?: MockIncident[];
  agencies?: MockAgency[];
}) => {
  if (typeof window === "undefined") return;
  try {
    if (data.guards) localStorage.setItem("secureops_guards", JSON.stringify(data.guards));
    if (data.attendance) localStorage.setItem("secureops_attendance", JSON.stringify(data.attendance));
    if (data.incidents) localStorage.setItem("secureops_incidents", JSON.stringify(data.incidents));
    if (data.agencies) localStorage.setItem("secureops_agencies", JSON.stringify(data.agencies));
    window.dispatchEvent(new Event("secureops_store_updated"));
  } catch (e) {
    console.error("Storage error:", e);
  }
};
