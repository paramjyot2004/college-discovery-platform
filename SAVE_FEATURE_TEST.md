# Save/Unsave Colleges Feature - Complete Integration Test

## Feature Overview
The college discovery platform now has full save/unsave functionality with database persistence through Prisma and JSON adapter. Users can bookmark colleges, view their shortlist, and have all data persist across sessions.

## Architecture Components

### 1. **Database Schema** (`prisma/schema.prisma`)
- ✅ `User` model with `savedColleges` relationship
- ✅ `College` model with `savedBy` relationship
- ✅ `SavedCollege` junction table with `userId` + `collegeId` unique constraint
- ✅ Cascade deletes configured (deletes saved records when user/college deleted)

### 2. **Server API Endpoints** (`server.ts`)

#### `GET /api/saved-colleges` (Authenticated)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ savedColleges: College[], savedIds: string[] }`
- **Logic**: 
  - Validates user token
  - Filters SavedCollege records for user ID
  - Hydrates with full College objects
  - Returns saved IDs for UI state sync

#### `POST /api/saved-colleges/toggle` (Authenticated)
- **Headers**: `Authorization: Bearer {token}`, `Content-Type: application/json`
- **Body**: `{ collegeId: string }`
- **Response**: `{ saved: boolean, savedIds: string[] }`
- **Logic**:
  - Validates token and collegeId
  - Checks if SavedCollege record exists for user+college
  - Removes if exists (unsave), adds if doesn't (save)
  - Returns new saved state + updated ID list
  - **Toast Feedback**: 
    - Save: "Added to shortlist" (success tone)
    - Unsave: "Removed from shortlist" (info tone)

### 3. **Auth Context** (`src/context/AuthContext.tsx`)

#### State Management
- `user: User | null` - Current authenticated user
- `savedIds: string[]` - List of college IDs user has saved
- `loading: boolean` - Loading state during session initialization

#### Key Methods

**`login(email, password)`**
- Calls `/api/auth/login`
- Stores token in localStorage
- Calls `loadSaved()` to fetch user's saved colleges
- Toast: "Signed in" (success)
- **Token Storage**: Uses Bearer token in localStorage as `auth_token`

**`signup(email, password)`**
- Calls `/api/auth/signup`
- Creates new user and token
- Initializes savedIds to empty array
- Toast: "Account created" (success)

**`logout()`**
- Removes token from localStorage
- Clears user and savedIds state
- Toast: "Signed out" (info)

**`toggleSaved(collegeId)`**
- Calls `/api/saved-colleges/toggle` with college ID
- Updates `savedIds` state with response
- Shows appropriate toast based on saved state
- Returns boolean: `true` if saved, `false` if unsaved
- **Error Handling**: Shows error toast if network fails
- **Auth Gate**: Opens login modal if no token

**`loadSaved(token)`**
- Called after login/signup or session restore
- Fetches `/api/saved-colleges` with token
- Updates `savedIds` state for immediate UI reflection

**`refreshSaved()`**
- Public method to manually refresh saved colleges
- Called by SavedPage after toggling to ensure hydrated list

### 4. **UI Components**

#### CollegeCard (`src/components/CollegeCard.tsx`)
- `isSaved` prop shows heart button state (filled red if saved)
- `onToggleSaved` callback triggered on heart click
- **Button Feedback**: Heart changes color instantly on click
- **Visual States**:
  - Saved: Red background `bg-red-500`, white text
  - Unsaved: White background with hover effect

#### SavedPage (`src/pages/SavedPage.tsx`)
- Fetches `/api/saved-colleges` on mount
- Displays "Shortlist Locked" gate if unauthenticated
- Shows "Hydrating bookmarks..." spinner during load
- Error banner if fetch fails
- Empty state with "Browse Directions" CTA if no saved colleges
- Grid displays all saved colleges with full details
- **Dependency Trigger**: Re-fetches when `user` or `savedIds` changes

#### Feedback System (`src/components/Feedback.tsx`)
- Toast notifications on all save/unsave actions
- Auto-dismiss after 3.8 seconds
- Max 4 concurrent toasts
- Color-coded by tone: success (green), error (red), info (gray)

## Test Scenarios

### Scenario 1: Sign Up & Save a College
```
1. Click "Sign up" on Navbar
2. Enter email (e.g., student@example.com) and password
3. Modal closes, toast shows "Account created"
4. Navigate to Explore page
5. Click heart icon on any college card
6. Heart fills red, toast shows "Added to shortlist"
7. Check localStorage → auth_token should exist
```

**Expected Result**: College ID appears in `savedIds`, heart button is filled

---

### Scenario 2: Navigate to Saved Page
```
1. Continue from Scenario 1
2. Click "My Shortlist" in Navbar
3. Page shows "Hydrating bookmarks..." briefly
4. Grid displays the 1 saved college with full details
5. College card shows heart filled in red
```

**Expected Result**: SavedPage fetches and displays hydrated college objects

---

### Scenario 3: Save Multiple Colleges & Unsave One
```
1. Go to Explore page
2. Save 3 different colleges (hearts fill, toasts appear)
3. Navigate to My Shortlist
4. See all 3 colleges in grid
5. Click heart on first college
6. Heart unfills, toast shows "Removed from shortlist"
7. Grid updates: only 2 colleges remain
```

**Expected Result**: Unsave removes college immediately from UI and updates savedIds

---

### Scenario 4: Login with Saved Colleges
```
1. From Scenario 3 with 2 saved colleges, logout
2. Toast: "Signed out"
3. Click "My Shortlist" → Shows "Shortlist is Locked" gate
4. Click "Sign In"
5. Enter same email and password from Scenario 1
6. Modal closes, toast shows "Signed in"
7. Navigate to My Shortlist
8. See all 2 saved colleges restored
```

**Expected Result**: Login restores `savedIds` from database, no data loss

---

### Scenario 5: Cross-Tab Persistence
```
1. Open platform in Tab A, login and save 2 colleges
2. Open platform in Tab B (same URL)
3. Tab B auto-restores session (checks localStorage)
4. Click "My Shortlist" in Tab B
5. See 2 saved colleges from Tab A
6. In Tab A, save a 3rd college
7. Refresh Tab B
8. Tab B now shows 3 colleges
```

**Expected Result**: All tabs share same localStorage, database persists on refresh

---

### Scenario 6: Error Recovery
```
1. Logout
2. Manually clear localStorage: `localStorage.removeItem("auth_token")`
3. Reload page
4. Try to click heart on college card
5. Auth modal opens (prompting to login)
6. Login successfully
7. Click heart again
8. College saves successfully, toast appears
```

**Expected Result**: System gracefully handles missing token by opening auth modal

---

### Scenario 7: Concurrent Save/Unsave
```
1. Open Explore page with 5 college cards visible
2. Rapidly click heart buttons on 3 different cards
3. Toast notifications queue (max 4 shown)
4. Navigate to My Shortlist
5. All 3 colleges appear
```

**Expected Result**: Multiple rapid requests handled correctly, no duplicates or missing colleges

---

## Code Walkthrough - Data Flow

### Flow: User Saves a College

```
User clicks heart → CollegeCard.onToggleSaved()
    ↓
useAuth().toggleSaved(collegeId)
    ↓
POST /api/saved-colleges/toggle with college ID + Bearer token
    ↓
server.ts validates token, checks SavedCollege existence
    ↓
If not exists: creates new SavedCollege record
If exists: deletes SavedCollege record
    ↓
Returns { saved: boolean, savedIds: string[] }
    ↓
AuthContext.setSavedIds(response.savedIds)
    ↓
showToast() called with success/info message
    ↓
CollegeCard re-renders with updated isSaved prop (from context)
    ↓
Heart button fills/unfills with color change
```

### Flow: User Loads SavedPage

```
SavedPage mounts → useEffect runs
    ↓
Reads localStorage for auth_token
    ↓
GET /api/saved-colleges with Bearer token
    ↓
server.ts filters SavedCollege records for userId
    ↓
Looks up College objects for all saved IDs
    ↓
Returns { savedColleges: College[], savedIds: string[] }
    ↓
setSavedColleges(response.savedColleges)
    ↓
Maps grid of <CollegeCard> components
    ↓
Each card gets isSaved={savedIds.includes(college.id)}
```

### Flow: User Logs In

```
User enters credentials → AuthContext.login()
    ↓
POST /api/auth/login with email/password
    ↓
server.ts authenticates and returns { user, token }
    ↓
localStorage.setItem("auth_token", token)
    ↓
setUser(response.user)
    ↓
loadSaved(token) called automatically
    ↓
GET /api/saved-colleges with new token
    ↓
setSavedIds(response.savedIds)
    ↓
showToast("Signed in")
    ↓
All UI components re-render with user context
```

## Debugging Checklist

### If Save Button Doesn't Work
- [ ] Check browser Console for errors (F12)
- [ ] Verify localStorage has `auth_token` key
- [ ] Open Network tab (F12) → check POST `/api/saved-colleges/toggle` response
- [ ] Check server logs for auth validation errors

### If SavedPage Shows Empty
- [ ] Verify user is logged in (Navbar shows email)
- [ ] Check Network tab → GET `/api/saved-colleges` response includes colleges
- [ ] Check if `savedIds` from AuthContext is empty (`console.log(savedIds)`)
- [ ] Clear localStorage and login again (fresh session)

### If Toast Doesn't Appear
- [ ] Check FeedbackProvider is wrapping root (App.tsx)
- [ ] Verify console for showToast() errors
- [ ] Check if ToastHost component is rendered in DOM

### If Data Lost After Logout/Login
- [ ] Verify `server/db.json` exists and contains SavedCollege records
- [ ] Check Prisma schema has `savedColleges` defined correctly
- [ ] Ensure `onDelete: Cascade` is configured

## Files to Review

- [server.ts](server.ts) - API endpoints for /api/saved-colleges
- [prisma/schema.prisma](prisma/schema.prisma) - Database models
- [src/context/AuthContext.tsx](src/context/AuthContext.tsx) - Auth + save state management
- [src/components/CollegeCard.tsx](src/components/CollegeCard.tsx) - Heart button UI
- [src/pages/SavedPage.tsx](src/pages/SavedPage.tsx) - Shortlist display
- [src/components/Feedback.tsx](src/components/Feedback.tsx) - Toast notifications

## Summary

The save/unsave feature is **fully implemented** with:
- ✅ Prisma schema for SavedCollege persistence
- ✅ Authenticated API endpoints (/api/saved-colleges)
- ✅ AuthContext managing saved state and toggle logic
- ✅ UI components reflecting saved state (heart button, SavedPage)
- ✅ Error handling with user-friendly toasts
- ✅ Session restoration on page reload
- ✅ Responsive design (mobile/tablet/desktop)

**Ready for production testing!**
