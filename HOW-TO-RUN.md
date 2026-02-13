# ▶️ HOW TO RUN - 9LMNTS Studio (Super Simple!)

## 🎯 The Easiest Way

Open PowerShell and copy-paste these commands one at a time:

### **Step 1: Go to Project Folder**
```powershell
cd C:\Users\me\V9
```

### **Step 2: Start the Website (Frontend)**
```powershell
npm run dev
```

**You'll see:**
```
VITE v6.3.5  ready in 1234 ms

➜ Local:   http://localhost:5173/
➜ press h to show help
```

✅ **Your website is now running!** Open `http://localhost:5173` in your browser.

---

## 📌 That's It for the Website!

Your full website is now available at **http://localhost:5173**

Test it:
- Click on "Services"
- Click on any service
- Fill the form
- Click submit

---

## 🚀 Want to Also Run the Backend? (Optional)

If you want to run the automation system too:

### **Step 1: Open a NEW PowerShell Window**
Press `Ctrl+Shift+`` inside your current IDE, or open a new PowerShell window separately.

### **Step 2: Go to Project Folder Again**
```powershell
cd C:\Users\me\V9
```

### **Step 3: Start the Backend**
```powershell
python working-automation.py
```

**You'll see automation output starting.**

---

## 🎮 Now You Have Both Running!

| What | Where | How to Stop |
|-----|-------|------------|
| **Website** | http://localhost:5173 | Press `Ctrl+C` in PowerShell |
| **Backend** | Running in background | Press `Ctrl+C` in PowerShell |

---

## ✅ Checklist - Is It Working?

- [ ] Website opens at http://localhost:5173
- [ ] Click "Services" loads without errors
- [ ] Can fill out the form
- [ ] Form submission doesn't crash
- [ ] No red error messages in browser

---

## 🆘 If Something Goes Wrong

### **"Port 5173 already in use"**
```powershell
# Kill the process using port 5173
netstat -ano | findstr :5173
taskkill /PID <number> /F
```

### **"npm: The term 'npm' is not recognized"**
- Install Node.js from https://nodejs.org
- Close and reopen PowerShell

### **"Module not found"**
```powershell
npm install
```

### **"Python not found"**
- Install Python from https://python.org
- Close and reopen PowerShell

### **"ModuleNotFoundError: No module named..."**
```powershell
pip install -r requirements.txt
```

---

## 📱 How to Access Website

1. **Local (Your Computer):**
   - Open http://localhost:5173 in your browser

2. **From Other Computer (Same Network):**
   - Find your computer's IP: `ipconfig` in PowerShell
   - Use: http://YOUR_IP:5173

3. **From Phone (Same Network):**
   - Same as above with your computer's IP

---

## 🛑 How to Stop Everything

```powershell
Ctrl+C
```

Press this in each PowerShell window to stop.

---

## 📂 Project Structure (Quick Reference)

```
C:\Users\me\V9\
├── src/              ← Website code (React/TypeScript)
├── package.json      ← Website dependencies
├── working-automation.py  ← Backend automation
└── requirements.txt   ← Python dependencies
```

---

## 🎯 Common Commands

```powershell
# Start website
npm run dev

# Build for production
npm run build

# Start backend
python working-automation.py

# Install dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Check what's using port 5173
netstat -ano | findstr :5173
```

---

## 💡 Pro Tips

1. **Keep PowerShell Window Open**: Don't close it while developing
2. **Save Changes**: TypeScript files auto-reload (HMR)
3. **Two Windows**: Keep backend and frontend in separate PowerShell windows
4. **Check Errors**: Look at the browser console (F12) for errors
5. **Restart**: If something breaks, stop and restart with `npm run dev`

---

## 🎉 Next Steps After Running

1. Visit http://localhost:5173
2. Explore the website
3. Test clicking buttons
4. Try the form
5. Check if automation works

---

**That's all you need! You're ready to go! 🚀**

Any issues? Let me know what error message you see!
