# 🚀 DEPLOY GLOW — Quick Start Guide

## **FASTEST: Deploy to Vercel (2 minutes)**

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Navigate to project**
```bash
cd path/to/glow-climate
```

### **Step 3: Deploy**
```bash
vercel --prod
```

**That's it!** Vercel will give you a live URL instantly.

---

## **Alternative 1: Netlify Drop (No CLI needed)**

1. Go to: https://app.netlify.com/drop
2. Drag the entire `glow-climate` folder onto the page
3. Get instant live URL

---

## **Alternative 2: GitHub Pages**

### **Step 1: Create GitHub repo**
```bash
cd glow-climate
git init
git add .
git commit -m "Initial commit"
gh repo create glow-climate --public --source=. --push
```

### **Step 2: Enable Pages**
1. Go to repo Settings → Pages
2. Set source to "main" branch
3. Save

Live at: `https://[your-username].github.io/glow-climate`

---

## **Alternative 3: CodeSandbox (Instant Preview)**

1. Go to: https://codesandbox.io/s/
2. Click "Import from GitHub" or "Upload folder"
3. Select the `glow-climate` folder
4. Get instant live preview + shareable link

---

## **Local Development (Before Deploying)**

```bash
# Option A: Node
node server.js

# Option B: Python
python3 -m http.server 8080

# Open: http://localhost:8080
```

---

## **What You'll Deploy:**

```
glow-climate/
├── index.html          ← Entry point
├── css/styles.css      ← Styles
├── js/
│   ├── main.js         ← ES6 module entry
│   ├── config.js       ← Data constants
│   ├── GlowParticle.js ← Particle physics
│   └── SceneManager.js ← Scene controller
├── assets/
│   └── shape*.png      ← Glow shapes
├── package.json        ← Project config
├── vercel.json         ← Vercel config
└── server.js           ← Local dev server
```

---

## **🎯 RECOMMENDED: Vercel**

**Why:**
- ✅ Instant deployment
- ✅ Auto HTTPS
- ✅ CDN included
- ✅ Free for personal projects
- ✅ Custom domain support
- ✅ One command: `vercel --prod`

**Install Vercel:**
```bash
npm install -g vercel
```

**Deploy:**
```bash
cd glow-climate
vercel --prod
```

**Done!** 🎉

---

## **Troubleshooting:**

### **"Module not found" error:**
- Make sure you're serving via HTTP (not file://)
- ES6 modules require a server

### **Blank screen:**
- Open DevTools console (F12)
- Check for JavaScript errors
- Verify all files loaded (Network tab)

### **GSAP not loading:**
- Check internet connection
- CDN might be blocked
- Try refreshing page

---

## **Next Steps After Deploy:**

1. ✅ Test on mobile
2. ✅ Share preview with team
3. ✅ Get feedback
4. ✅ Iterate on scenes
5. ✅ Optimize performance
6. ✅ Add analytics (optional)

---

Built with ☀️ for Nightingale
