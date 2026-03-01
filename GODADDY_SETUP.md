# 🌐 Connect marvinscontracting.com to Your Site

## Step-by-Step GoDaddy DNS Configuration

### Step 1: Log into GoDaddy
1. Go to https://www.godaddy.com
2. Sign in to your account
3. Click **"My Products"**
4. Find **marvinscontracting.com** and click **"DNS"** or **"Manage DNS"**

---

### Step 2: Configure DNS Records

You'll need to add/modify these records in GoDaddy:

#### Option A: Using CNAME (Recommended)

**For www.marvinscontracting.com:**
```
Type: CNAME
Name: www
Value: contractor-elite.preview.emergentagent.com
TTL: 600 seconds (or default)
```

**For marvinscontracting.com (root domain):**
```
Type: CNAME
Name: @
Value: contractor-elite.preview.emergentagent.com
TTL: 600 seconds (or default)
```

> ⚠️ **Note**: Some DNS providers don't allow CNAME on root (@). If GoDaddy gives an error, use Option B below.

#### Option B: Using A Records (If CNAME doesn't work)

**We need the IP address from Emergent platform.**
Let me help you get this information.

---

### Step 3: In GoDaddy DNS Manager

**Visual Guide:**

1. **Delete existing records** (if any):
   - Look for any existing A or CNAME records for @ and www
   - Click the **trash icon** to delete them

2. **Add new CNAME record for www:**
   - Click **"Add"** or **"Add Record"**
   - Select **"CNAME"** from dropdown
   - **Name**: `www`
   - **Value**: `contractor-elite.preview.emergentagent.com`
   - **TTL**: Leave default (usually 1 hour or 600 seconds)
   - Click **"Save"**

3. **Add CNAME for root domain:**
   - Click **"Add"** again
   - Select **"CNAME"**
   - **Name**: `@`
   - **Value**: `contractor-elite.preview.emergentagent.com`
   - **TTL**: Leave default
   - Click **"Save"**

---

### Step 4: GoDaddy Forwarding (Alternative/Additional)

If CNAME for @ doesn't work, you can use GoDaddy's domain forwarding:

1. In GoDaddy, go to your domain settings
2. Find **"Forwarding"** section
3. Set up **Domain Forwarding**:
   - Forward: `marvinscontracting.com`
   - To: `https://www.marvinscontracting.com`
   - Forward type: **Permanent (301)**
   - Settings: **Forward only**

This ensures `marvinscontracting.com` → `www.marvinscontracting.com`

---

### Step 5: Configure Custom Domain on Emergent

**IMPORTANT**: You need to tell Emergent platform about your custom domain.

This typically involves:
1. Going to your Emergent dashboard/settings
2. Adding `marvinscontracting.com` as a custom domain
3. Emergent will provision SSL certificate automatically

**I'll help you with this step - let me check the Emergent configuration.**

---

## ⏱️ Timeline

**DNS Propagation**: 5 minutes to 48 hours (usually 15-30 minutes)

**To Check Progress:**
1. Open https://dnschecker.org
2. Enter: `marvinscontracting.com`
3. Select: `CNAME`
4. Click **"Search"**
5. Wait until most locations show your target

---

## 🧪 Testing Your Domain

After DNS propagates:

1. **Test HTTP (might not work initially):**
   ```
   http://marvinscontracting.com
   http://www.marvinscontracting.com
   ```

2. **Test HTTPS (after SSL provisioned):**
   ```
   https://marvinscontracting.com
   https://www.marvinscontracting.com
   ```

3. **Test on mobile:**
   - Clear browser cache
   - Open in incognito/private mode
   - Visit your domain

---

## 🔒 SSL Certificate

SSL (the padlock 🔒) should be **automatically provisioned** by Emergent once:
- DNS points to their servers
- Custom domain is configured in their dashboard

Usually takes: **5-15 minutes** after DNS propagates

---

## ⚠️ Common Issues

### Issue 1: "DNS_PROBE_FINISHED_NXDOMAIN"
**Solution**: DNS not propagated yet. Wait 30 more minutes.

### Issue 2: "Your connection is not private" (SSL error)
**Solution**: SSL certificate being provisioned. Wait 15 minutes.

### Issue 3: Shows old site or parking page
**Solution**: 
- Clear browser cache
- Wait for DNS propagation
- Try incognito mode

### Issue 4: CNAME not allowed on root (@)
**Solution**: 
- Use domain forwarding (Step 4 above)
- OR contact Emergent support for A record IP address

---

## 📧 Email (Important!)

**If you plan to use email** (info@marvinscontracting.com):

⚠️ **WAIT before changing DNS** - Set up email first!

Options:
1. **GoDaddy Email** - Configure before DNS change
2. **Google Workspace** - Set up MX records
3. **Forward to existing email** - Set up forwarding

Let me know if you need email setup help!

---

## 🎯 Current Status:

- ✅ Domain purchased: marvinscontracting.com
- ⏳ DNS configuration: Ready to configure
- ⏳ Custom domain on Emergent: Needs configuration
- ⏳ SSL certificate: Will auto-provision

**Next: Follow Step 2 in GoDaddy, then I'll help configure Emergent side!**
