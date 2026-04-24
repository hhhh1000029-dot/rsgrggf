# Security Specification & "Dirty Dozen" Payloads

## 1. Data Invariants
- A **UserProfile** must exist for the user to be a verified creator.
- **WeekData** (levels) belong to a `creatorUid` which must match the authenticated `request.auth.uid` during creation and updates. Immutable after creation.
- A **Chunk** must strictly belong to a Week authored by the current user.
- A **Like** on a Week or Post must set `uid` to the liker's UID and increment the total count securely.
- A **Comment** on a Week must match the user's UID and enforce character limits.
- **Post** objects belong to a `uid` that equals the authenticated user.
- **Counters** (e.g. `users`) can only be incremented by authenticated users creating profiles, or edited by an admin.

## 2. The "Dirty Dozen" Payloads
1. **Identity Spoofing**: Create a `weeks` doc where `creatorUid` is someone else's ID.
2. **Ghost Field Injection**: Add `isVerified: true` to `users` profile payload.
3. **Array Limit Breach**: Create a post with 1000 links instead of max 5.
4. **Denial of Wallet (String Size)**: Create a `weeks` doc with a 2MB string in `name`.
5. **Privilege Escalation**: Update a profile to set `role: "admin"`.
6. **Orphaned Chunk**: Upload a chunk to a week that doesn't exist.
7. **Cross-week Chunk Upload**: Upload a chunk to a week owned by another user.
8. **Malicious Counter Manipulation**: Increment the `users` counter by 100 instead of 1.
9. **Fake Likes Bypass**: Increment `likesCount` on a week without creating a corresponding `likes/{uid}` document in the same transaction.
10. **Terminal State Evasion**: Not explicitly applicable to states here, but update `createdAt` of a week.
11. **Spoofed Email via Rules**: Access admin-only operations without `email_verified == true`.
12. **PII Leakage**: Try to fetch other users' sensitive private data (profiles are public here, so test limits).

## 3. Test Runner Definition
(Implemented in `firestore.rules.test.ts`)
