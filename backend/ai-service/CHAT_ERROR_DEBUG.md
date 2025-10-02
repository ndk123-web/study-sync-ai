# Chat API 400 Error - Debugging Guide

## Error Description
You're getting **400 Bad Request** errors when trying to:
1. GET `/api/v1/chat/fetch-chats?courseId=...&role=video`
2. POST `/api/v1/chat/send-chat` with role="video"

## Root Cause

When `role="video"`, the `courseId` parameter contains an **encrypted video URL** (Base64 encoded string). The system tries to find an enrollment record where `videoLink` matches this encrypted URL.

The error occurs because:
1. **The enrollment doesn't exist** - User hasn't enrolled in this video yet
2. **String mismatch** - URL encoding differences between what's stored vs what's being searched

### Example from your logs:
```
courseId: U2FsdGVkX1+XXxcv6zdYK8Rg/M77zu8rnB+4fbfaTK+X7UrNUZc+b8gLLY9ECP+H5Vvqn+mQbnibrNtCz1Mu1w==
```

This encrypted string contains special characters (`+`, `/`, `=`) that can be problematic during URL encoding/decoding.

## Solutions Applied

### 1. Enhanced Error Messages
- Now shows exactly what video link was being searched
- Displays all video enrollments for the user
- Helps identify if enrollment exists

### 2. Robust Video Link Matching
Added `find_enrollment_by_video()` function with 3 strategies:
- **Strategy 1**: Exact match
- **Strategy 2**: URL-decoded match
- **Strategy 3**: Normalized comparison fallback

### 3. Debug Script
Run `debug_enrollments.py` to check your database:
```bash
cd backend/ai-service
python debug_enrollments.py
```

This will show:
- If user exists
- All video enrollments
- Whether the specific video link exists
- Exact vs approximate matches

## How to Fix

### Option 1: Ensure Video is Enrolled First

The video must be enrolled before chatting about it. Check if this endpoint was called:

```javascript
POST /api/v1/video/load-video
Body: {
  "videoUrl": "U2FsdGVkX1+XXxcv6zdYK8Rg/M77zu8rnB+4fbfaTK+X7UrNUZc+b8gLLY9ECP+H5Vvqn+mQbnibrNtCz1Mu1w=="
}
```

This creates an enrollment record in the `enrollmentcourses` collection.

### Option 2: Check Database Directly

Connect to MongoDB and check:

```javascript
// Find user
db.users.findOne({ uid: "AVGxnJqSfjYcUVPNk2YN09hXZSt2" })

// Find video enrollments
db.enrollmentcourses.find({ 
  userId: ObjectId("..."), // from above query
  type: "video"
})
```

Look for a record with matching `videoLink`.

### Option 3: Frontend Flow Check

Ensure the frontend:
1. Calls Load Video API first (enrolls the video)
2. Then allows user to chat about it
3. Uses the same encrypted string for both operations

## Testing After Changes

1. **Restart AI Service**:
   ```bash
   cd backend/ai-service
   # Stop current process
   # Start again
   python main.py
   ```

2. **Test with fresh enrollment**:
   - Enroll a new video
   - Immediately try to chat
   - Check console logs for DEBUG messages

3. **Expected Console Output**:
   ```
   DEBUG: Found X video enrollments for user
     - videoLink: U2FsdGVkX1+...
   DEBUG: Searching for videoLink: U2FsdGVkX1+...
   DEBUG: Found enrollment with exact match
   ```

## API Flow for Video Chat

```
1. User clicks on video → Frontend encrypts URL
2. Frontend calls /api/v1/video/load-video → Creates enrollment
3. User types chat message
4. Frontend calls /api/v1/chat/send-chat with same encrypted URL
5. Backend finds enrollment using encrypted URL as key
6. Saves chat linked to enrollment
```

## Common Issues

### Issue 1: Video Not Enrolled
**Error**: "Enrollment not found for this video"
**Fix**: Call load-video endpoint first

### Issue 2: Different Encryption
**Error**: No exact match in database
**Fix**: Ensure same encryption key used everywhere (check `ENCRYPTION_SECRET` env var)

### Issue 3: URL Encoding Mismatch
**Fix**: Already handled by new `normalize_video_link()` function

## Monitoring

Watch console logs for:
- ✅ `DEBUG: Found enrollment with exact match` - Good!
- ⚠️ `DEBUG: Found enrollment with normalized match` - Works, but inconsistent encoding
- ❌ `DEBUG: No enrollment found` - Need to enroll video first

## Next Steps

1. Run `debug_enrollments.py` to check current state
2. Look at console output from your request
3. Check if video was enrolled
4. Try with a fresh video enrollment
5. Report back with console output if issue persists
