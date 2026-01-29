# 🔧 Troubleshooting Guide - 404 NOT_FOUND Error

## ❌ Error: `404: NOT_FOUND`

यह error तब आता है जब Supabase में database tables नहीं बने हैं।

---

## ✅ Solution: Step-by-Step Fix

### Step 1: Supabase Dashboard खोलें
1. [supabase.com](https://supabase.com) पर जाएं
2. अपने project में login करें
3. Left sidebar में **"SQL Editor"** click करें

### Step 2: Database Tables Create करें
1. SQL Editor में जाएं
2. **"New Query"** button click करें
3. `supabase-setup.sql` file का **सारा content** copy करें
4. SQL Editor में paste करें
5. **"Run"** button click करें (या `Ctrl+Enter`)

✅ **Success होने पर** आपको ये tables दिखेंगे:
- `users`
- `conversations`
- `conversation_participants`
- `messages`
- `message_reactions`
- `message_reads`
- `typing_indicators`

### Step 3: Storage Bucket Create करें
1. Left sidebar में **"Storage"** click करें
2. **"New bucket"** button click करें
3. Name: `media` (exactly यही name)
4. **Public bucket**: ✅ Enable करें
5. **"Create bucket"** click करें

### Step 4: Storage Policies Set करें
1. `media` bucket पर click करें
2. **"Policies"** tab पर जाएं
3. **"New Policy"** click करें
4. Policy name: `Allow authenticated uploads`
5. Policy definition:
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'media');
```

या **Simpler way**:
1. Storage → Policies → New Policy
2. **"For full customization"** select करें
3. Policy name: `Public Access`
4. Allowed operations: ✅ SELECT, ✅ INSERT
5. Target roles: `authenticated`
6. Save करें

### Step 5: Realtime Enable करें
1. Left sidebar में **"Database"** → **"Replication"** जाएं
2. ये tables enable करें:
   - ✅ `conversations`
   - ✅ `messages`
   - ✅ `message_reactions`
   - ✅ `typing_indicators`

### Step 6: App Restart करें
1. Terminal में app stop करें (`Ctrl+C`)
2. फिर से start करें:
```bash
npm run dev
```

---

## 🔍 Verify Setup

### Check 1: Tables Exist?
1. Supabase Dashboard → **"Table Editor"**
2. Left sidebar में सभी tables दिखने चाहिए

### Check 2: Storage Bucket?
1. Supabase Dashboard → **"Storage"**
2. `media` bucket दिखना चाहिए

### Check 3: RLS Enabled?
1. Table Editor में किसी table पर click करें
2. **"RLS"** tab check करें
3. ✅ Enabled होना चाहिए

---

## 🐛 Common Issues

### Issue 1: "relation does not exist"
**Solution**: SQL script properly run नहीं हुआ
- SQL Editor में फिर से run करें
- Errors check करें

### Issue 2: "permission denied"
**Solution**: RLS policies properly set नहीं हैं
- `supabase-setup.sql` में policies section check करें
- फिर से run करें

### Issue 3: "bucket not found"
**Solution**: Storage bucket create नहीं हुआ
- Storage में `media` bucket create करें
- Public enable करें

### Issue 4: "Realtime not working"
**Solution**: Realtime enable नहीं है
- Database → Replication में tables enable करें

---

## 📝 Quick Checklist

- [ ] SQL script run किया (`supabase-setup.sql`)
- [ ] सभी tables create हुए
- [ ] Storage bucket `media` create किया
- [ ] Storage policies set किए
- [ ] Realtime enabled किया
- [ ] App restart किया
- [ ] `.env` file में credentials सही हैं

---

## 🆘 Still Not Working?

1. **Browser Console Check करें**:
   - `F12` press करें
   - Console tab में errors देखें
   - Exact error message share करें

2. **Supabase Logs Check करें**:
   - Dashboard → Logs
   - Recent errors देखें

3. **Network Tab Check करें**:
   - Browser → Network tab
   - Failed requests देखें

---

## ✅ Success Indicators

जब सब कुछ सही होगा:
- ✅ Login screen दिखेगा
- ✅ Google login काम करेगा
- ✅ Email/Password login काम करेगा
- ✅ No 404 errors
- ✅ Tables accessible होंगे

---

अगर अभी भी problem है, तो exact error message share करें!

