# Feature Specification: Static Preview Alpha (Local-Storage Only)

**Feature Branch**: `002-static-preview-alpha`  
**Created**: 2026-02-24  
**Status**: Draft  
**Input**: User description: "Create a v1 release that has NO back-end API required and fully runs out of user local memory. This is to get an early version of the site out for review without having to create a full API implementation. This will be hosted on GitHub Pages and be clearly marked a preview-alpha release BUT allow a user to get a full experience of what logging in, reviewing comments, and interacting with the site using ONLY user local storage."

## Clarifications

### Session 2026-02-24

- Q: Which client-side routing strategy for GitHub Pages — hash-based, 404.html fallback, or basename prefix? → A: Hash-based routing (`/#/dashboard`, `/#/conversation/1`)
- Q: Should invited supporters auto-accept instantly, show as pending first, or auto-accept after a brief delay? → A: Auto-accept instantly with a generated mock user profile and sample conversations in "Following"
- Q: Should pre-seeded demo data populate "My Journey" only, "Following" only, or both? → A: Both — 1-2 conversations owned by user in "My Journey" + 1-2 from a pre-seeded supporter in "Following"
- Q: How should the system handle local storage approaching its size limit? → A: Passive storage indicator — show a warning bar when approaching 80% capacity, pointing to "Reset Demo Data"
- Q: Which GitHub Pages deployment method — auto-deploy via GitHub Actions, manual deploy, or release-tag triggered? → A: GitHub Actions auto-deploy on push to branch

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Time Visitor Registers and Explores (Priority: P1)

A first-time visitor lands on the SupportSpark preview site hosted on GitHub Pages. They see a clear "Preview Alpha" banner indicating this is an early demonstration. They register with an email and name, which is stored entirely in their browser's local storage. After registration they are taken to the dashboard where they see pre-seeded sample conversations and can explore the full interface including creating updates, reading conversations, and replying to messages — all without any network requests to a backend.

**Why this priority**: This is the core value proposition — letting stakeholders and early reviewers experience the full product flow without requiring server infrastructure. If only one story ships, this delivers the most insight.

**Independent Test**: Visit the GitHub Pages URL in a fresh browser, complete registration, navigate the dashboard, and open a pre-seeded conversation to verify content displays. Verify no network errors appear and all data persists across page refreshes within the same browser.

**Acceptance Scenarios**:

1. **Given** a user visits the site for the first time, **When** the page loads, **Then** a visible "Preview Alpha" banner is displayed on every page indicating data is stored locally and this is not a production release
2. **Given** a first-time visitor on the auth page, **When** they fill in email, name, and password and click Register, **Then** a user profile is created in local storage and they are redirected to the dashboard
3. **Given** a registered user on the dashboard, **When** they view the page, **Then** they see pre-seeded sample conversations in both "My Journey" (1-2 conversations owned by the user) and "Following" (1-2 conversations from a pre-seeded supporter)
4. **Given** a registered user, **When** they refresh the browser, **Then** their session and all data persist from local storage

---

### User Story 2 - User Creates and Manages Conversations (Priority: P1)

A logged-in user creates a new conversation (update) from the dashboard. They provide a title and initial message. The conversation appears in their "My Journey" section. They can open the conversation, read messages, and post replies. All data round-trips through local storage only.

**Why this priority**: Conversations are the primary feature of SupportSpark. Demonstrating the full create-read-reply loop is essential for any meaningful product review.

**Independent Test**: Log in, create a new conversation, verify it appears on the dashboard, open it, post a reply message, close and reopen it to verify the reply persists.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the dashboard, **When** they click "New Update" and submit a title and message, **Then** a new conversation is created in local storage and appears in the "My Journey" feed
2. **Given** a user viewing a conversation, **When** they type a reply and click send, **Then** the reply is appended to the conversation's message list and visible immediately
3. **Given** a user with existing conversations, **When** they return to the dashboard after navigating away, **Then** all their conversations and messages are intact from local storage

---

### User Story 3 - User Manages Support Network (Priority: P2)

A user navigates to the Supporters page and invites a supporter by email. Since there is no backend, the invitation is simulated — the system creates a mock supporter record in local storage and accepts it automatically (or shows it as pending). The user sees their support network grow. This demonstrates the supporter management flow for reviewers.

**Why this priority**: The support network is a differentiating feature. Showing it in the preview helps stakeholders evaluate the social model, but it is less critical than the core conversation flow.

**Independent Test**: Navigate to Supporters, invite a supporter via email, verify the supporter appears in the list. Refresh the page and confirm persistence.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the Supporters page, **When** they invite a supporter by email, **Then** a supporter record is instantly created with "accepted" status, a mock user profile is generated for the invited email, and the supporter appears in their network list
2. **Given** a user with invited supporters, **When** they view the Supporters page, **Then** they see the full list of their supporters all showing "accepted" status
3. **Given** an auto-accepted supporter invitation, **When** the user navigates to the dashboard, **Then** the mock supporter's sample conversations are visible in the "Following" section

---

### User Story 4 - User Logs In and Out (Priority: P2)

A returning user who previously registered can log in with their email and password. The credentials are validated against local storage. They can also log out, which clears their active session but preserves their stored data. Logging back in restores access to all their conversations and supporters.

**Why this priority**: Login/logout demonstrates the full authentication lifecycle that reviewers need to evaluate, but depends on registration (US1) being complete first.

**Independent Test**: Register, log out, log back in with correct credentials, verify dashboard shows all previous data. Try logging in with wrong password and verify rejection.

**Acceptance Scenarios**:

1. **Given** a previously registered user on the login page, **When** they enter their correct email and password, **Then** they are authenticated against local storage and redirected to the dashboard with all their data
2. **Given** a logged-in user, **When** they click logout, **Then** their session ends but their data remains in local storage for next login
3. **Given** a user on the login page, **When** they enter incorrect credentials, **Then** they see a clear error message and are not authenticated

---

### User Story 5 - Static Site Deployment on GitHub Pages (Priority: P1)

The application builds as a fully static site (HTML, CSS, JS) with no server-side runtime requirements. It deploys to GitHub Pages via a standard build-and-deploy workflow. The deployed site operates entirely client-side with all API interactions replaced by local storage operations.

**Why this priority**: Without successful static deployment, no reviewer can access the preview. This is a prerequisite for all other stories to deliver value.

**Independent Test**: Run the build command, verify the output is a static folder with no server-side code. Deploy to GitHub Pages and verify the site loads and functions without 404s or API errors.

**Acceptance Scenarios**:

1. **Given** the project source code, **When** a static build is executed, **Then** the output contains only client-side assets (HTML, CSS, JS) with no server dependencies
2. **Given** a built static site, **When** deployed to GitHub Pages, **Then** all routes resolve correctly using hash-based routing (`/#/dashboard`, `/#/conversation/:id`, etc.)
3. **Given** a deployed site on GitHub Pages, **When** a user navigates through all pages, **Then** no network requests to external APIs are made and no console errors related to missing endpoints appear

---

### Edge Cases

- What happens when local storage is full or unavailable (private browsing)? If local storage is completely unavailable, the system displays a clear warning that the preview requires local storage. If storage approaches the ~5MB browser limit (80% capacity), a warning bar appears directing the user to the "Reset Demo Data" action to free space.
- What happens when a user clears their browser data? All preview data is lost; the user sees the registration page again as a fresh visitor. This is expected and documented in the preview banner.
- What happens when multiple users try to use the same browser? Each "user" shares the same local storage namespace. The preview supports a single-user experience per browser. This limitation is documented.
- What happens with client-side routing on GitHub Pages? The app uses hash-based routing (`/#/path`) which works reliably on GitHub Pages without any server configuration or 404.html workarounds.
- What happens when pre-seeded demo data conflicts with user-created data? Demo data uses reserved ID ranges that won't collide with user-generated IDs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST operate entirely client-side with zero backend API dependencies
- **FR-002**: System MUST store all user data (accounts, conversations, messages, supporters) in the browser's local storage
- **FR-003**: System MUST display a persistent "Preview Alpha" banner on every page indicating: (a) this is not a production release, (b) data is stored locally in the browser only, (c) clearing browser data will erase all information
- **FR-004**: System MUST allow users to register with email, first name, last name, and password, storing credentials locally
- **FR-005**: System MUST authenticate users against locally stored credentials (email + password match)
- **FR-006**: System MUST pre-seed the application on first registration with: (a) 1-2 sample conversations owned by the registered user appearing in "My Journey", (b) 1 pre-seeded supporter with "accepted" status, and (c) 1-2 sample conversations from that supporter appearing in "Following"
- **FR-007**: System MUST allow users to create new conversations with a title and initial message
- **FR-008**: System MUST allow users to view conversation details and read all messages in a thread
- **FR-009**: System MUST allow users to post reply messages to existing conversations
- **FR-010**: System MUST allow users to navigate to the Supporters page and invite supporters by email; invitations are instantly auto-accepted with a generated mock user profile and sample conversations attributed to that supporter
- **FR-011**: System MUST persist all data across page refreshes and browser sessions via local storage
- **FR-012**: System MUST build as a fully static site deployable to GitHub Pages with no server runtime
- **FR-013**: System MUST use hash-based client-side routing (e.g., `/#/dashboard`, `/#/conversation/1`) for reliable navigation on GitHub Pages without server configuration
- **FR-014**: System MUST provide login and logout functionality using local storage session management
- **FR-015**: System MUST reuse existing React components (shadcn/ui, pages, layouts) from the current codebase with minimal modification
- **FR-016**: System MUST validate user input (email format, password length) using the existing Zod schemas on the client side
- **FR-017**: System MUST show quotes on the Home page and dashboard. The Home page quote carousel MUST be sourced from a static import of `data/quotes.json` (replacing the existing `/api/quotes` fetch). The dashboard displays a hardcoded daily reflection quote (existing behavior). Home.tsx MUST be modified to import bundled quote data instead of calling the server API
- **FR-018**: System MUST provide a "Reset Demo Data" action allowing users to clear all local data and return to the initial seeded state
- **FR-019**: System MUST display a warning bar when local storage usage exceeds 80% of the browser's available quota, directing the user to the "Reset Demo Data" action to free space
- **FR-020**: System MUST include a GitHub Actions workflow that automatically builds and deploys the static site to GitHub Pages on every push to the feature branch

### Key Entities

- **User**: A registered preview user with id, email, firstName, lastName, and password. Stored in local storage. Passwords are not hashed in the preview (no security requirement for client-only local data).
- **Conversation**: A discussion thread with id, memberId (owner), title, creation date, and a list of messages. Stored in local storage.
- **Message**: An individual post within a conversation with id, authorId, authorName, content, timestamp, optional images, and optional replies. Stored as part of the conversation data.
- **Supporter**: A relationship between two users with id, memberId, supporterId, status (always "accepted" in preview), and creation date. Stored in local storage. On invitation, a mock user profile and 1-2 sample conversations are auto-generated for the supporter.
- **Session**: The currently logged-in user reference. Stored as a separate local storage key. Cleared on logout; checked on page load to restore session.

## Assumptions

- Passwords stored in local storage are in plaintext since this is a client-only preview with no security boundary. Users are informed via the preview banner that this is not production software.
- The existing React component library (shadcn/ui, Radix UI) and page layouts are reused as-is. The primary change is swapping the data layer from API calls to local storage operations.
- A single user per browser is sufficient for the preview. Multi-user simulation within one browser is not required.
- Pre-seeded demo data includes 1-2 conversations owned by the user in "My Journey" plus 1 pre-seeded supporter with 1-2 conversations in "Following", giving reviewers an immediate sense of both perspectives.
- The existing Vite build toolchain is used. A separate static build configuration targets GitHub Pages output.
- GitHub Pages deployment uses a GitHub Actions workflow that auto-deploys on push to the feature branch. No manual deploy steps required.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can complete the full journey (register, create conversation, post reply, manage supporters) in under 5 minutes with zero technical setup required
- **SC-002**: The deployed site on GitHub Pages loads and is fully interactive with no console errors related to missing APIs or failed network requests
- **SC-003**: All user-created data persists across page refreshes and browser sessions without loss
- **SC-004**: 100% of existing UI pages (Home, Auth, Dashboard, ConversationView, Supporters, Demo) render correctly in the static preview build
- **SC-005**: The static build produces output under 5MB total (excluding source maps), suitable for GitHub Pages hosting
- **SC-006**: The "Preview Alpha" banner is visible on every page (including Home and Auth), ensuring no reviewer mistakes this for a production system
- **SC-007**: A user with no technical knowledge can access the GitHub Pages URL and use the full application without instructions beyond what the UI provides
