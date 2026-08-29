# CivicLens Karnataka — Development Plan

## 1. Objective

Build one polished end-to-end citizen journey rather than many incomplete features.

Primary demo:

**Pothole → AI → Location → Civic Intelligence → Complaint → Mock Submission → Tracking → Resolution → Badge**

---

# PHASE 1 — PROJECT SETUP

Install/configure:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Firebase
* Cloudinary
* OpenAI SDK
* MapLibre
* GitHub

Create:

```text
.env.local
```

Keep secrets server-side.

### Deliverable

Next.js app runs locally.

---

# PHASE 2 — STITCH UI

Use Stitch MCP to design:

1. Home
2. Capture
3. AI Analysis
4. Location
5. Civic Intelligence
6. Duplicate Check
7. Complaint Review
8. Submitted
9. Tracking
10. Nearby
11. Profile
12. Badge

Review all screens for consistent design.

### Deliverable

Complete polished UI direction.

---

# PHASE 3 — FRONTEND JOURNEY

Implement:

```text
/
 /report
 /analyze
 /location
 /intelligence
 /review
 /submitted
 /track/[id]
 /nearby
 /profile
 /badge/[slug]
```

Initially use synthetic local data.

### Deliverable

Clickable journey from start to finish.

---

# PHASE 4 — FIREBASE

Create Firestore collections:

```text
users
civicIssues
issueEvidence
civicAssets
projects
tenders
contractors
authorities
complaints
complaintEvents
badges
contributorProfiles
```

Seed synthetic records.

Recommended demo seed:

* 100+ civic assets
* 30+ projects
* 30+ tender records
* 20+ authorities
* 50+ civic issues
* multiple complaint timelines

Every record:

```text
dataSource = SYNTHETIC_DEMO
```

### Deliverable

Frontend reads actual prototype data from Firebase.

---

# PHASE 5 — CLOUDINARY

Implement:

* image upload
* file validation
* media URL
* evidence association

### Deliverable

Citizen uploads an image and sees it attached to the issue.

---

# PHASE 6 — OPENAI

Create server endpoint:

```text
POST /api/analyze-image
```

Return:

```text
issueType
confidence
severity
description
evidenceNotes
```

Add fallback:

If AI fails:

> Select issue manually.

### Deliverable

Real OpenAI-powered image analysis.

---

# PHASE 7 — CIVIC INTELLIGENCE

Implement:

```text
Location
 ↓
Civic Asset
 ↓
Project
 ↓
Tender
 ↓
Contractor
 ↓
Authority
 ↓
Maintenance status
```

Use deterministic matching.

### Deliverable

The pothole demo location produces a complete synthetic civic record.

---

# PHASE 8 — DUPLICATE DETECTION

Search nearby active cases.

If found:

> This issue may already be reported nearby.

Allow:

> Add My Evidence

### Deliverable

Duplicate workflow works.

---

# PHASE 9 — AI COMPLAINT

Create:

```text
POST /api/complaints/draft
```

Generate factual complaint.

Citizen can edit.

### Deliverable

Citizen receives a high-quality complaint without needing to write it manually.

---

# PHASE 10 — MOCK GOVERNMENT ROUTING

Create:

```text
POST /api/mock-government/submit
```

Return:

```text
DEMO-CIV-10482
```

Show:

> Government submission is simulated in this prototype.

### Deliverable

Submission feels realistic but is clearly mocked.

---

# PHASE 11 — TRACKING

Implement:

```text
RECEIVED
VERIFIED
ROUTED
INSPECTION
REPAIR
RESOLVED
```

Add plain-language explanations.

### Deliverable

Judge can understand every status.

---

# PHASE 12 — CONTRIBUTOR BADGE

When case becomes resolved:

```text
resolved
 ↓
verified contribution
 ↓
badge
 ↓
share card
```

### Deliverable

Complete positive ending.

---

# PHASE 13 — NEARBY ISSUES

Add simple map/list.

Show:

* potholes
* garbage
* streetlights
* water
* drainage

### Deliverable

Secondary discovery experience.

---

# PHASE 14 — POLISH

Test:

* 360px
* 390px
* 430px
* 768px
* 1440px

Test:

* slow network
* AI failure
* upload failure
* location denied
* no asset match
* duplicate issue
* mock submission failure

Remove:

* dead buttons
* console errors
* placeholder text
* broken routes

---

# PHASE 15 — DEPLOYMENT

Deploy:

```text
GitHub
 ↓
Vercel
 ↓
Public URL
```

Set:

* Firebase config
* Cloudinary config
* OpenAI key

Test public URL in incognito.

Test from a phone.

Ensure no access request is required.

---

# PHASE 16 — DEMO PREPARATION

Prepare:

### Image

One clear pothole image.

### Location

One known demo location.

### Asset

One matching synthetic road asset.

### Project

One matching synthetic project.

### Tender

One synthetic tender.

### Maintenance

Active synthetic maintenance period.

### Duplicate

One nearby existing issue.

### Resolution

One case capable of reaching simulated resolution.

### Badge

One contributor badge.

---

# 2-MINUTE VIDEO

## First minute — citizen demo

### 0:00–0:10

Show pothole.

### 0:10–0:20

Upload photo.

AI detects pothole.

### 0:20–0:30

Confirm location.

### 0:30–0:45

Show Civic Intelligence.

Project → tender → maintenance → authority.

### 0:45–0:55

Review AI-generated complaint.

### 0:55–1:00

Submit mock case.

---

## Second minute — explanation

### 1:00–1:15

Explain citizen problem.

### 1:15–1:30

Explain OpenAI image analysis and complaint assistance.

### 1:30–1:45

Explain Next.js + Firebase + Cloudinary architecture.

### 1:45–1:55

Explain synthetic data and mock government routing.

### 1:55–2:00

Show resolved case and contributor badge.

---

# PRIORITY ORDER

If time is short:

1. Working report flow
2. AI detection
3. Civic Intelligence
4. Complaint review
5. Mock submission
6. Tracking
7. Badge
8. Nearby map
9. Additional issue categories
10. Animations

Never sacrifice the complete citizen journey for extra features.

---

# FINAL QUALITY GATE

Before submission:

* [ ] Public URL works
* [ ] No access request
* [ ] Mobile works
* [ ] Desktop works
* [ ] AI works
* [ ] Firebase works
* [ ] Cloudinary works
* [ ] Mock routing works
* [ ] Tracking works
* [ ] Badge works
* [ ] No government logo imitation
* [ ] Synthetic data clearly disclosed
* [ ] No real sensitive information
* [ ] No unsupported accusations
* [ ] No dead buttons
* [ ] No console errors
* [ ] 2-minute demo is repeatable
