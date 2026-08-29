# CivicLens Karnataka — Product Requirements Document

## 1. Product Overview

**Product Name:** CivicLens Karnataka

**Tagline:**
**See it. Verify it. Route it. Track it. Get recognized.**

CivicLens is a citizen-first civic technology web application that allows citizens to photograph visible public problems and receive AI-assisted identification, location confirmation, civic-asset context, project/contract information from synthetic data, complaint preparation, mock government routing, status tracking, and public contributor recognition.

CivicLens is an **independent prototype and must not present itself as an official Karnataka Government product.**

---

## 2. Problem

Citizens frequently encounter public problems such as potholes, garbage dumping, broken streetlights, water leakage, drainage overflow and damaged footpaths.

The problem is not only reporting the issue.

Citizens may not know:

* What the issue should be called
* Which department handles it
* What evidence is useful
* How to describe it properly
* Whether someone already reported it
* Which public asset is involved
* Whether a project or maintenance period may be relevant
* What happens after submitting a complaint
* What a government status actually means

Existing public-service systems may provide complaint mechanisms, but the citizen journey can still be fragmented and difficult to understand.

---

## 3. Product Vision

CivicLens creates a simple citizen-facing layer:

**Photo → AI detection → Location → Civic Asset → Project → Tender → Maintenance Context → Authority → Complaint → Tracking → Recognition**

The product does not replace government systems.

The long-term vision is:

> Government systems remain the official systems of record, while CivicLens becomes a simple citizen experience layer that helps people understand, prepare and track civic cases.

---

## 4. Target Users

### Primary users

* Indian citizens using mobile browsers
* People with limited digital experience
* Citizens who notice public infrastructure problems
* Citizens who want transparent complaint progress

### Secondary users

* Students
* Young people helping parents/family
* Community contributors
* Residents who repeatedly encounter unresolved civic issues

---

## 5. Supported Issue Categories

CivicLens architecture should support:

1. Pothole
2. Road damage
3. Broken streetlight
4. Garbage dumping
5. Water leakage
6. Drainage overflow
7. Damaged footpath
8. Fallen tree
9. Public poster/advertisement issue
10. Public littering
11. Damaged public property
12. Construction/debris obstruction

The hackathon demo should focus primarily on **pothole detection and the complete journey**.

---

## 6. Core Citizen Journey

### Step 1

Citizen opens CivicLens.

### Step 2

Citizen selects:

**Report a Problem**

### Step 3

Citizen takes or uploads a photo.

### Step 4

OpenAI analyzes the image.

Example:

> Pothole detected
> Confidence: 96%
> Severity: High

### Step 5

Citizen confirms or changes the AI classification.

### Step 6

Citizen confirms the location.

### Step 7

CivicLens matches the location with a synthetic civic-asset database.

### Step 8

Show relevant synthetic information:

* Road
* Ward
* Civic asset
* Project
* Tender reference
* Contractor
* Completion date
* Maintenance/defect-liability period
* Relevant authority/office

### Step 9

Use deterministic rules to calculate whether the simulated maintenance period is active.

### Step 10

Check whether a similar complaint already exists nearby.

### Step 11

Generate a factual complaint using AI.

### Step 12

Citizen reviews and edits the complaint.

### Step 13

Citizen submits.

The prototype performs a **mock government submission**.

### Step 14

Show case reference.

### Step 15

Show a transparent timeline.

### Step 16

Simulate inspection, repair and resolution.

### Step 17

Recognize the citizen with a CivicLens contributor badge.

---

## 7. Main Differentiator

CivicLens is not:

> “Upload pothole → submit complaint.”

It is:

> **“Upload evidence → understand the public asset and project context → prepare a factual case → know where it goes → understand what happens next.”**

The key product moment is the Civic Intelligence screen.

---

## 8. Civic Intelligence

The system should visually connect:

**PHOTO**

↓

**CIVIC ASSET**

↓

**PROJECT**

↓

**TENDER**

↓

**MAINTENANCE**

↓

**AUTHORITY**

Example synthetic record:

* Asset: ROAD-DEMO-1042
* Road: Demo Main Road
* Project: Demo Road Improvement Package
* Tender: DEMO-TND-2025-104
* Contractor: Demo Infrastructure Pvt Ltd.
* Completion: 15 March 2025
* Maintenance: 24 months
* Authority: Demo Municipal Road Division

Every such record must clearly show:

> **SYNTHETIC DEMO DATA — NOT AN OFFICIAL GOVERNMENT RECORD**

---

## 9. Accountability Principle

CivicLens must never automatically declare:

* An officer guilty
* A contractor guilty
* Corruption
* Fraud
* Criminal conduct
* Legal liability

Instead use:

> **Relevant project/maintenance information identified for authority review.**

The platform identifies relationships and evidence. It does not determine legal responsibility.

---

## 10. Duplicate Issue Detection

If another citizen has already reported the same type of issue nearby:

> **This issue may already be reported nearby.**

Provide:

* Existing case
* Distance
* Status
* First reported date

Actions:

**Add My Evidence**

or

**Report Separately**

This reduces duplicate complaints and allows multiple citizens to strengthen an existing case.

---

## 11. Contributor Recognition

Do not use government reward points.

Use public CivicLens recognition.

Possible badges:

* Verified Civic Contributor
* Road Watcher
* Public Safety Contributor
* Clean City Contributor
* Evidence Contributor

Recognition should depend on useful/verified/resolved contributions, not complaint quantity.

Badge disclaimer:

> **CivicLens recognition. Not a government credential or endorsement.**

---

## 12. Shareable Contributor Profile

Citizen can share:

* Display name/alias
* Badge
* Verified contributions
* Resolved issues
* Evidence contributions

Do not expose:

* Aadhaar
* PAN
* phone number
* precise private address
* private government information

---

## 13. Functional Requirements

### FR-01 Image Upload

Support camera capture and image upload.

### FR-02 AI Detection

Detect likely issue type and produce confidence/severity/evidence description.

### FR-03 Human Confirmation

Citizen must be able to accept or modify AI classification.

### FR-04 Location

Support current location, manual location and demo location.

### FR-05 Civic Asset Matching

Match location against synthetic civic records.

### FR-06 Project Context

Display synthetic project/tender/maintenance information.

### FR-07 Complaint Generation

Generate factual complaint text.

### FR-08 Review

Citizen can edit before submission.

### FR-09 Mock Government Routing

Create simulated case reference.

### FR-10 Tracking

Show case lifecycle.

### FR-11 Status Explanation

Explain every status in plain language.

### FR-12 Duplicate Detection

Detect nearby similar cases.

### FR-13 Contributor Recognition

Unlock badge after simulated verified/resolved contribution.

### FR-14 Share

Generate public contributor card.

---

## 14. Non-Functional Requirements

* Mobile-first
* Responsive
* Fast-feeling
* Accessible
* Low cognitive load
* Large touch targets
* Simple language
* Graceful failures
* Public browser access
* No sensitive real-world data

---

## 15. Safety and Honesty

Never use:

* Real Aadhaar numbers
* Real PAN
* Real OTPs
* Real passwords
* Real payment information
* Private citizen information
* Private government credentials

Government/project/tender/contractor/authority information in the prototype should be synthetic.

Government routing and status changes should be simulated.

---

## 16. Out of Scope

* Real government complaint submission
* Real government API access
* Private API reverse engineering
* Scraping restricted data
* Real officer blame
* Real contractor accusations
* Real payment processing
* Real OTP
* Native Android/iOS application
* Full government administrative dashboard

---

## 17. Prototype Success Criteria

A judge should be able to:

1. Upload a pothole image.
2. Receive AI analysis.
3. Confirm location.
4. See related synthetic civic information.
5. Understand maintenance context.
6. Review a generated complaint.
7. Submit a mock case.
8. Track the case.
9. Simulate resolution.
10. Receive a contributor badge.

The entire journey should feel coherent and complete.

---

## 18. Core Demo Story

A citizen sees a pothole.

They take a photo.

CivicLens identifies it.

The citizen confirms the location.

CivicLens identifies the related synthetic public asset and project.

The system explains the maintenance context.

The citizen reviews an AI-generated factual complaint.

The case is routed through a mock government channel.

The citizen tracks the case.

The issue is resolved in the prototype.

The citizen receives a CivicLens Verified Contributor badge.

---

## 19. Final Product Statement

> **CivicLens turns a citizen's photo of a public problem into a traceable civic case by connecting evidence with location, public assets, project context, responsible authorities and a transparent citizen journey.**
