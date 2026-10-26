import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const rootDir = process.cwd();
const buildDir = path.join(rootDir, "temp_docx_build");
const outputDocx = path.join(rootDir, "SecureOps_Project_Presentation_Guide.docx");

// Clean or create build directory
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir, { recursive: true });
fs.mkdirSync(path.join(buildDir, "_rels"), { recursive: true });
fs.mkdirSync(path.join(buildDir, "word"), { recursive: true });
fs.mkdirSync(path.join(buildDir, "word", "_rels"), { recursive: true });

// 1. [Content_Types].xml
const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;
fs.writeFileSync(path.join(buildDir, "[Content_Types].xml"), contentTypesXml, "utf8");

// 2. _rels/.rels
const packageRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
fs.writeFileSync(path.join(buildDir, "_rels", ".rels"), packageRelsXml, "utf8");

// 3. word/_rels/document.xml.rels
const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
fs.writeFileSync(path.join(buildDir, "word", "_rels", "document.xml.rels"), docRelsXml, "utf8");

// 4. word/styles.xml
const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="22"/>
        <w:color w:val="1E293B"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="160" w:line="276" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>

  <!-- Title Style -->
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:pPr>
      <w:spacing w:before="240" w:after="120"/>
      <w:jc w:val="center"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="52"/>
      <w:color w:val="1E3A8A"/>
    </w:rPr>
  </w:style>

  <!-- Subtitle Style -->
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:pPr>
      <w:spacing w:before="60" w:after="240"/>
      <w:jc w:val="center"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:i/>
      <w:sz w:val="26"/>
      <w:color w:val="2563EB"/>
    </w:rPr>
  </w:style>

  <!-- Heading 1 (Slide / Section) -->
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr>
      <w:spacing w:before="360" w:after="140"/>
      <w:pBdr>
        <w:bottom w:val="single" w:sz="18" w:space="6" w:color="2563EB"/>
      </w:pBdr>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="34"/>
      <w:color w:val="0F172A"/>
    </w:rPr>
  </w:style>

  <!-- Heading 2 (Subsection) -->
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr>
      <w:spacing w:before="240" w:after="100"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="26"/>
      <w:color w:val="1D4ED8"/>
    </w:rPr>
  </w:style>

  <!-- Heading 3 -->
  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:pPr>
      <w:spacing w:before="160" w:after="80"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="23"/>
      <w:color w:val="0F172A"/>
    </w:rPr>
  </w:style>

  <!-- Speaker Box -->
  <w:style w:type="paragraph" w:styleId="SpeakerBox">
    <w:name w:val="SpeakerBox"/>
    <w:pPr>
      <w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/>
      <w:pBdr>
        <w:left w:val="single" w:sz="36" w:space="12" w:color="2563EB"/>
      </w:pBdr>
      <w:spacing w:before="160" w:after="160"/>
      <w:ind w:left="240" w:right="240"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:sz w:val="20"/>
      <w:color w:val="1E293B"/>
    </w:rPr>
  </w:style>
</w:styles>`;
fs.writeFileSync(path.join(buildDir, "word", "styles.xml"), stylesXml, "utf8");

// Helpers for OpenXML generation
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function p(text: string, style?: string, isCenter = false, isBold = false): string {
  const pPr = [];
  if (style) pPr.push(`<w:pStyle w:val="${style}"/>`);
  if (isCenter) pPr.push(`<w:jc w:val="center"/>`);
  const rPr = [];
  if (isBold) rPr.push(`<w:b/>`);

  return `<w:p>
    ${pPr.length ? `<w:pPr>${pPr.join("")}</w:pPr>` : ""}
    <w:r>
      ${rPr.length ? `<w:rPr>${rPr.join("")}</w:rPr>` : ""}
      <w:t xml:space="preserve">${escapeXml(text)}</w:t>
    </w:r>
  </w:p>`;
}

function bullet(boldPrefix: string, text: string): string {
  return `<w:p>
    <w:pPr>
      <w:ind w:left="480" w:hanging="240"/>
    </w:pPr>
    <w:r>
      <w:rPr><w:b/><w:color w:val="2563EB"/></w:rPr>
      <w:t>• </w:t>
    </w:r>
    <w:r>
      <w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr>
      <w:t xml:space="preserve">${escapeXml(boldPrefix)}: </w:t>
    </w:r>
    <w:r>
      <w:t xml:space="preserve">${escapeXml(text)}</w:t>
    </w:r>
  </w:p>`;
}

function speakerBox(instruction: string, speakingPoints: string[]): string {
  let xml = `<w:p>
    <w:pPr>
      <w:pStyle w:val="SpeakerBox"/>
    </w:pPr>
    <w:r>
      <w:rPr><w:b/><w:color w:val="1E3A8A"/></w:rPr>
      <w:t>🎤 PRESENTER DEFENSE INSTRUCTIONS &amp; TALKING POINTS</w:t>
    </w:r>
  </w:p>`;

  xml += `<w:p>
    <w:pPr><w:pStyle w:val="SpeakerBox"/></w:pPr>
    <w:r>
      <w:rPr><w:i/></w:rPr>
      <w:t xml:space="preserve">${escapeXml(instruction)}</w:t>
    </w:r>
  </w:p>`;

  for (const pt of speakingPoints) {
    xml += `<w:p>
      <w:pPr><w:pStyle w:val="SpeakerBox"/><w:ind w:left="360" w:hanging="200"/></w:pPr>
      <w:r><w:rPr><w:b/><w:color w:val="2563EB"/></w:rPr><w:t>👉 </w:t></w:r>
      <w:r><w:t xml:space="preserve">${escapeXml(pt)}</w:t></w:r>
    </w:p>`;
  }

  return xml;
}

function table(headers: string[], rows: string[][]): string {
  let xml = `<w:tbl>
    <w:tblPr>
      <w:tblW w:w="9400" w:type="dxa"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        <w:left w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
        <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
      </w:tblBorders>
      <w:tblCellMar>
        <w:top w:w="120" w:type="dxa"/>
        <w:bottom w:w="120" w:type="dxa"/>
        <w:left w:w="160" w:type="dxa"/>
        <w:right w:w="160" w:type="dxa"/>
      </w:tblCellMar>
    </w:tblPr>`;

  // Header
  xml += `<w:tr>
    <w:trPr><w:tblHeader/></w:trPr>`;
  for (const h of headers) {
    xml += `<w:tc>
      <w:tcPr>
        <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
      </w:tcPr>
      <w:p>
        <w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>${escapeXml(h)}</w:t></w:r>
      </w:p>
    </w:tc>`;
  }
  xml += `</w:tr>`;

  // Rows
  for (const r of rows) {
    xml += `<w:tr>`;
    for (const cell of r) {
      xml += `<w:tc>
        <w:p>
          <w:r><w:t>${escapeXml(cell)}</w:t></w:r>
        </w:p>
      </w:tc>`;
    }
    xml += `</w:tr>`;
  }

  xml += `</w:tbl>`;
  return xml;
}

let doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>`;

// Title & Meta
doc += p("SecureOps: Autonomous Telemetric Security Platform", "Title");
doc += p("Comprehensive Project Defense Dossier & PowerPoint Presentation Guide", "Subtitle");
doc += p("Core Project Engineering Team:", "Heading3", true, true);
doc += p("Adeel Sahto (Backend Developer)  •  Safiullah Halepoto (Frontend Developer)  •  Mehtab Ali (Requirements Analyst & Documentation Lead)", undefined, true);
doc += p("Official Project Contact: halepoto2003@gmail.com  |  Framework: Next.js 15, TypeScript & Google Gemini API", undefined, true);
doc += p("────────────────────────────────────────────────────────────────────────────────────────", undefined, true);

// ==========================================
// SLIDE 1
// ==========================================
doc += p("Slide 1: Title Slide & Project Overview", "Heading1");
doc += p("Slide Title: SecureOps — Autonomous Real-Time Telemetric Security Platform");
doc += p("Slide Subtitle: Bridging Residents, Security Personnel, Fleet Agencies, and Law Enforcement into an Intelligent Unified Grid");
doc += bullet("Project Category", "Smart City Infrastructure, Autonomous Incident Management & Telemetric Patrols");
doc += bullet("Target Stakeholders", "Residential Gated Communities, Commercial Complexes, Private Security Agencies, and Municipal Police");
doc += bullet("Key Core Differentiator", "Hardware GPS satellite geofencing with instant verification and cross-portal emergency SOS dispatching");
doc += speakerBox(
  "Open with confidence. State your names, individual project roles, and the exact problem domain before showing any code.",
  [
    "Good morning/afternoon, honorable evaluators. We are presenting SecureOps, a unified telemetric security operations platform.",
    "Introduce Adeel Sahto who engineered the backend REST architecture, data models, and NextAuth security pipelines.",
    "Introduce Safiullah Halepoto who built the responsive Next.js 15 frontend, tactical Leaflet radar maps, and cross-tab synchronization.",
    "Introduce Mehtab Ali who led business requirements gathering, operational security workflows, and presentation documentation.",
    "Key Hook: Traditional physical security relies on paper logbooks and unverified guard patrols. SecureOps transforms physical security into an auditable, real-time digital defense system."
  ]
);

// ==========================================
// SLIDE 2
// ==========================================
doc += p("Slide 2: Problem Statement & Industry Vulnerabilities", "Heading1");
doc += p("Why does traditional security operations fail today?");
doc += bullet("Vulnerability 1: Phantom Guarding & Falsified Logbooks", "Guards frequently sign manual paper attendance rosters while abandoning their perimeter posts. Property managers have zero telemetric proof of guard presence.");
doc += bullet("Vulnerability 2: Delayed & Disconnected Emergency SOS", "When a burglary, fire, or intrusion occurs, residents scramble for phone numbers. Standard 911/police response is disconnected from local on-duty compound guards.");
doc += bullet("Vulnerability 3: Lack of Police PSARA Regulatory Compliance", "Unvetted private security agencies deploy guards with unchecked criminal backgrounds and forged credentials, violating statutory PSARA regulations.");
doc += bullet("Vulnerability 4: Zero Situational Awareness for Residents", "Residents paying security maintenance fees cannot verify if any guards are active or nearby when walking at night.");
doc += speakerBox(
  "Focus on the tangible security risks of paper logbooks. Mention that security guards are often paid for shifts they never physically attended.",
  [
    "Ask the evaluators: 'How do you know the night guard was actually at the back gate at 3:00 AM rather than sleeping at home?'",
    "Point out that paper muster rolls cannot be audited, and phone-based emergency calls waste crucial minutes while criminals escape.",
    "Emphasize that law enforcement has no centralized dashboard to inspect private security licenses in real time."
  ]
);

// ==========================================
// SLIDE 3
// ==========================================
doc += p("Slide 3: Proposed Solution — The SecureOps Ecosystem", "Heading1");
doc += p("SecureOps replaces fragmented operations with a 4-portal telemetric architecture:");
doc += bullet("Autonomous Hardware GPS Geofencing", "Guards verify attendance using live device GPS coordinates matched against an authorized 500-meter post radius. The system calculates distance variance instantly.");
doc += bullet("Sub-Second SOS Cross-Portal Dispatch", "A 1-click resident panic button broadcasts emergency incidents across guard devices and police dispatch terminals simultaneously.");
doc += bullet("Interactive Neighborhood Patrol Radar", "Residents monitor active guards nearby, compute real-time walking distance, and request escort units via tactical live map.");
doc += bullet("Police PSARA Audit & Clearance Portal", "Law enforcement inspects guard dossiers, verifies identity documents, and grants or revokes official security licenses.");
doc += speakerBox(
  "Explain that SecureOps is not just a 'guard attendance app'—it is a four-way synchronized operations hub.",
  [
    "Show how all 4 user groups (Resident, Guard, Agency, Police) interact within the same live ecosystem.",
    "Stress that when an emergency occurs, everyone sees the exact same incident data simultaneously without manual phone calls."
  ]
);

// ==========================================
// SLIDE 4
// ==========================================
doc += p("Slide 4: Operational Roles & Multi-Portal Matrix", "Heading1");
doc += p("Detailed breakdown of permissions and capabilities across the 4 specialized portals:");

doc += table(
  ["Portal Role", "Target User", "Primary Operational Capabilities", "Direct Route"],
  [
    ["USER", "Residents / Owners", "Tactical radar map, 1-click SOS broadcast, vetted agency directory", "/user/dashboard"],
    ["GUARD", "On-Duty Patrol Guard", "Real GPS geofenced check-in, active SOS alert banner, tactical radio chat", "/guard/dashboard"],
    ["AGENCY", "Security Fleet Admin", "Live muster roll, 360° radar boundary scanner, guard roster & metrics", "/agency/guards"],
    ["POLICE", "Law Enforcement Command", "Central dispatch queue, detailed incident investigation, PSARA license vetting", "/police/dashboard"]
  ]
);

doc += speakerBox(
  "Highlight role-based separation of concerns. Each user sees only what is relevant to their job.",
  [
    "Guards get an action-oriented mobile terminal with large buttons for GPS locking and incident acknowledgement.",
    "Agencies get fleet management with real-time muster roll and perimeter boundary breach alerts.",
    "Police get compliance tools and prioritized crime dispatch queues (Critical, High, Medium)."
  ]
);

// ==========================================
// SLIDE 5
// ==========================================
doc += p("Slide 5: Methodology & Complete Operational Workflow", "Heading1");
doc += p("The system follows a continuous 5-step operational lifecycle:");

doc += bullet("Step 1: Satellite GPS Lock & Geofenced Check-In", "The guard opens /guard/dashboard. The browser invokes the HTML5 Geolocation API with highAccuracy=true. The system computes the Haversine distance between current coordinates and duty post base (22.77579° N, 86.14683° E). If distance <= 500m, attendance is marked 'Present'; otherwise flagged as 'Absent (Geofence Breach)'.");

doc += bullet("Step 2: Continuous Patrol Telemetry & Radar Surveillance", "Guard coordinates stream to the Agency Threat Radar (/agency/alerts). If a guard steps outside their authorized zone by more than 500m, an acoustic alert triggers and logs a perimeter variance.");

doc += bullet("Step 3: Resident SOS Emergency Dispatch", "A resident experiencing an intrusion, fire, or medical distress opens /user/alert, selects incident type and severity (CRITICAL), and clicks 'Broadcast Emergency Alert'. A unique tracking ID (e.g. SEC-2025-912) is minted.");

doc += bullet("Step 4: Real-Time Cross-Dashboard Sync & Guard En-Route", "The alert instantly triggers a window.dispatchEvent('secureops_store_updated'). A red pulsing dispatch card appears on on-duty guard terminals. Guard clicks 'Acknowledge & Set En Route'. Status updates to 'Dispatched' on Police Dispatch and Resident Ledger simultaneously.");

doc += bullet("Step 5: Police Investigation & PSARA Background Vetting", "Police Command reviews suspect descriptions, dispatches backup units, and audits private security agencies via /police/verification to confirm guard training and criminal clearances.");

doc += speakerBox(
  "Walk the evaluators through this exact step-by-step methodology. This proves that your project has a complete, working lifecycle.",
  [
    "Point out that the methodology is closed-loop: Verification -> Patrol -> Incident -> Dispatch -> Resolution -> Police Audit.",
    "Highlight that our system works both offline (using an intelligent client store) and online with MongoDB."
  ]
);

// ==========================================
// SLIDE 6
// ==========================================
doc += p("Slide 6: Technology Stack & Modern Architecture", "Heading1");
doc += p("Built on an enterprise-grade, modern JavaScript/TypeScript stack:");

doc += bullet("Frontend Framework", "Next.js 15 (App Router with Server & Client Component hybrid architecture), React 19, TypeScript.");
doc += bullet("Styling & UX Design", "Tailwind CSS with glassmorphic cards, custom animations, dynamic status badges, and mobile-responsive layout.");
doc += bullet("Mapping & Spatial Telemetry", "Leaflet.js and React-Leaflet for 360° tactical radar maps, dynamic geofence circles, and distance calculations.");
doc += bullet("State Synchronization Engine", "Custom event-driven pub/sub architecture (secureops_store_updated) paired with reactive localStorage persistence for instant sub-second cross-tab synchronization.");
doc += bullet("Database & ORM", "MongoDB with Prisma ORM. Engineered with fault-tolerant isDbConfigured guards to ensure zero runtime downtime even during database maintenance.");
doc += bullet("AI Integration (Google Gemini API)", "We integrate the Google Gemini API in a clean, straightforward manner to power two essential features: (1) AI-driven Guard Deployment Recommendations based on area incident density, and (2) Automated Incident Risk Assessment to recommend immediate tactical actions.");

doc += speakerBox(
  "Emphasize the tech stack choices and explain the role of Google Gemini API simply as requested.",
  [
    "State clearly: 'For intelligent recommendations, we integrate the Google Gemini API. When an agency views their fleet metrics, Gemini analyzes active incident density and provides plain-English deployment suggestions.'",
    "Reassure evaluators that the AI integration is practical and focused—enhancing operator decision-making without adding unnecessary complexity."
  ]
);

// ==========================================
// SLIDE 7
// ==========================================
doc += p("Slide 7: Database Schema & Entity Relationships", "Heading1");
doc += p("The system models 6 core entities with strict relational integrity:");

doc += p("1. User Entity (Personnel & Residents)", "Heading3");
doc += table(
  ["Field Name", "Data Type", "Constraint", "Description"],
  [
    ["id", "String (ObjectId)", "Primary Key", "Unique identifier for all system users"],
    ["name", "String", "Required", "Full legal name (e.g., Adeel Sahto, Muhammad Tariq)"],
    ["email", "String", "Unique, Required", "Authentication and notification address"],
    ["role", "Enum", "USER | GUARD | AGENCY | POLICE", "Access control role for portal routing"],
    ["verified", "Boolean", "Default: false", "Police background clearance indicator"],
    ["image", "String (URL)", "Optional", "Profile photo or national ID avatar"]
  ]
);

doc += p("2. Guard Entity (Security Personnel Dossier)", "Heading3");
doc += table(
  ["Field Name", "Data Type", "Constraint", "Description"],
  [
    ["id", "String (ObjectId)", "Primary Key", "Unique database record ID"],
    ["badgeId", "String", "Unique, Indexed", "Official Guard ID badge (e.g., GRD-101, GRD-102)"],
    ["name", "String", "Required", "Full name of deployed guard"],
    ["phone", "String", "Required", "Emergency cellular contact number"],
    ["shift", "Enum", "Morning | Evening | Night", "Assigned operational duty shift"],
    ["verified", "Boolean", "Required", "Police PSARA clearance verification flag"],
    ["rating", "Float", "Range: 1.0 - 5.0", "Aggregated performance score from resident reviews"],
    ["agencyId", "String (FK)", "References Agency.id", "Employing security agency"],
    ["location", "Object", "lat, lng, name, status", "Real-time hardware GPS telemetry and boundary state"]
  ]
);

doc += p("3. Attendance Entity (Geofenced Muster Roll)", "Heading3");
doc += table(
  ["Field Name", "Data Type", "Constraint", "Description"],
  [
    ["id", "String", "Primary Key", "Muster roll transaction ID"],
    ["userId", "String (FK)", "References Guard.id", "Associated security guard"],
    ["guardBadgeId", "String", "Required", "Human-readable Guard ID (e.g., GRD-101)"],
    ["guardName", "String", "Required", "Guard full name"],
    ["checkIn", "DateTime / String", "Required", "Exact timestamp of verified check-in"],
    ["location", "String", "Required", "Hardware GPS coordinates and geofence verification log"],
    ["present", "Boolean", "Required", "True if inside 500m geofence post radius"],
    ["status", "Enum", "Present | Absent", "Official attendance standing"]
  ]
);

doc += p("4. Incident Entity (Emergency SOS Broadcasts)", "Heading3");
doc += table(
  ["Field Name", "Data Type", "Constraint", "Description"],
  [
    ["id", "String", "Primary Key", "Internal unique incident ID"],
    ["incidentID", "String", "Unique, Indexed", "Tracking identifier (e.g., SEC-2025-912)"],
    ["from", "String", "Required", "Reporting resident email or identifier"],
    ["subject", "String", "Required", "Incident title (e.g., Theft in Progress)"],
    ["type", "String", "Required", "Theft | Fire Hazard | Medical Distress | Suspicious"],
    ["priority", "Enum", "CRITICAL | HIGH | MEDIUM", "Urgency level determining alert color and sound"],
    ["status", "Enum", "Active | Dispatched | Resolved", "Real-time dispatch state machine"],
    ["location", "String", "Required", "Physical address or tagged GPS coordinates"],
    ["suspectDescription", "String", "Optional", "Physical details of perpetrators for police dispatch"]
  ]
);

doc += p("5. Agency Entity (Security Fleet Company)", "Heading3");
doc += table(
  ["Field Name", "Data Type", "Constraint", "Description"],
  [
    ["id", "String", "Primary Key", "Unique agency license ID"],
    ["name", "String", "Required", "Company name (e.g., Apex Tactical Defense)"],
    ["email", "String", "Required", "Agency operations email"],
    ["phone", "String", "Required", "Dispatch hotline number"],
    ["activeGuardsCount", "Integer", "Required", "Number of currently active deployed personnel"],
    ["specialization", "String", "Required", "Patrol specialty (e.g., Geofenced Residential Patrols)"]
  ]
);

doc += speakerBox(
  "Point out that the database schema is fully aligned with the real operations of the platform.",
  [
    "Explain that every check-in records not just a timestamp, but the exact hardware GPS coordinates and distance to post.",
    "Explain that Incidents act as a state machine: Active -> Dispatched -> Resolved, ensuring accountability at every step."
  ]
);

// ==========================================
// SLIDE 8
// ==========================================
doc += p("Slide 8: Deployed Guard Fleet & Live Roster", "Heading1");
doc += p("Real operational guard personnel deployed in the system:");

doc += table(
  ["Guard ID", "Full Name", "Assigned Shift", "Assigned Duty Post", "Security Agency", "Clearance"],
  [
    ["GRD-101", "Muhammad Tariq", "Night Shift", "Main Perimeter Gate, Sector 4", "Apex Tactical Defense", "Verified ✅"],
    ["GRD-102", "Bilal Ahmed Khan", "Morning Shift", "West Entrance Checkpoint", "Apex Tactical Defense", "Verified ✅"],
    ["GRD-103", "Zubair Ali Shah", "Evening Shift", "Outer Industrial Zone Depot", "Sentinel Shield Operations", "Pending ⏳"],
    ["GRD-104", "Abdul Rasheed Baloch", "Morning Shift", "Retail Center Surveillance Booth", "Apex Tactical Defense", "Verified ✅"],
    ["GRD-105", "Farhan Murtaza", "Night Shift", "North Residential Tower Access", "Sentinel Shield Operations", "Verified ✅"]
  ]
);

doc += speakerBox(
  "Explain that each guard has an authentic Guard ID and belongs to an authorized agency.",
  [
    "Highlight that Guard ID GRD-103 (Zubair Ali Shah) is deliberately shown as 'Pending Clearance' to demonstrate how police vetting catches unverified guards.",
    "Show how guards are distributed across Morning, Evening, and Night shifts to cover 24/7 security."
  ]
);

// ==========================================
// SLIDE 9
// ==========================================
doc += p("Slide 9: Live Demo Script & Step-by-Step Walkthrough", "Heading1");
doc += p("Follow this exact step-by-step walkthrough during your live demonstration:");

doc += bullet("Step 1: Open the Landing Page (http://localhost:3000)", "Show the modern landing interface, feature highlights, and the About Team section featuring Adeel Sahto, Safiullah Halepoto, and Mehtab Ali.");

doc += bullet("Step 2: Demonstrate Resident SOS Broadcast (http://localhost:3000/user/alert)", "Select 'Theft / Burglary in Progress', choose 'CRITICAL', and click 'Broadcast Emergency Alert'. Show the instant confirmation with tracking ID SEC-XXXX.");

doc += bullet("Step 3: Show Guard Emergency Banner (http://localhost:3000/guard/dashboard)", "Switch to the Guard Terminal. Point out the flashing red banner: '🚨 ACTIVE RESIDENTIAL EMERGENCY'. Click 'Acknowledge & En Route'. Show the status change immediately.");

doc += bullet("Step 4: Show Guard GPS Geofence Check-In (http://localhost:3000/guard/dashboard)", "Click 'Instant GPS Fetch'. Show how the system acquires the real hardware latitude and longitude, checks the 500m geofence, and marks attendance.");

doc += bullet("Step 5: Show Agency Muster Roll (http://localhost:3000/agency/attendance)", "Navigate to the Agency portal. Show that Guard Muhammad Tariq (Guard ID: GRD-101) appears on the verified muster roll with his exact check-in time and GPS coordinates.");

doc += bullet("Step 6: Show Police Dispatch Command (http://localhost:3000/police/dashboard)", "Show how the incident appears at the top of the Police Central Dispatch queue with the 'CRITICAL' badge and 'Dispatched' status.");

doc += bullet("Step 7: Show Police PSARA Audit (http://localhost:3000/police/verification)", "Click 'Audit & Verify' on a pending guard to approve their background check, updating their clearance status across all systems.");

doc += speakerBox(
  "Rehearse this demo script with your team before presenting. Following these 7 steps covers 100% of the project features in under 4 minutes.",
  [
    "Keep two browser tabs open side by side: one on /user/alert and one on /guard/dashboard.",
    "When you click 'Broadcast' in the user tab, point at the guard tab to show the emergency banner appearing instantly without a page refresh."
  ]
);

// ==========================================
// SLIDE 10
// ==========================================
doc += p("Slide 10: Future Roadmap & Project Conclusion", "Heading1");
doc += p("Planned future enhancements for SecureOps 2.0:");
doc += bullet("Automated Drone Dispatch", "Integrating autonomous aerial drones to arrive at geofenced incident coordinates within 45 seconds of an SOS broadcast.");
doc += bullet("Facial Recognition Checkpoints", "AI camera integration at complex access gates to cross-verify guard shift handovers automatically.");
doc += bullet("Offline SMS / GSM Fallback Gateways", "Ensuring SOS alerts transmit even during cellular internet blackouts via encrypted SMS telemetry.");
doc += bullet("Smart Municipal Police Integration", "Direct API integration with national police dispatch networks (e.g. 15 / 911 / 112).");

doc += p("Concluding Defense Statement:", "Heading3");
doc += p("SecureOps delivers an accountable, real-time, and legally compliant security ecosystem. By combining satellite GPS geofencing, sub-second SOS dispatching, and police regulatory vetting, SecureOps eliminates paper fraud, accelerates emergency response times, and restores trust to community safety.", undefined, false, true);

doc += speakerBox(
  "Conclude strongly and thank the evaluators. Open the floor for questions.",
  [
    "Thank the committee for their time and attention.",
    "State: 'SecureOps represents the future of physical and digital security integration. We are now open for your questions and technical review.'"
  ]
);

doc += `  </w:body>
</w:document>`;

fs.writeFileSync(path.join(buildDir, "word", "document.xml"), doc, "utf8");
console.log("Full document.xml written successfully.");

// Compress using .NET System.IO.Compression.ZipFile (reliable, zero progress bar error, supports .docx directly)
const psCommand = `powershell -ExecutionPolicy Bypass -Command "$ProgressPreference = 'SilentlyContinue'; Add-Type -AssemblyName System.IO.Compression.FileSystem; if (Test-Path '${outputDocx}') { Remove-Item -Force '${outputDocx}' }; [System.IO.Compression.ZipFile]::CreateFromDirectory('${buildDir}', '${outputDocx}')"`;
console.log("Executing packaging command with .NET ZipFile...");
execSync(psCommand, { stdio: "inherit" });
console.log(`Document successfully created at: ${outputDocx}`);
