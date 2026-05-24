# Manual Commands

Yeh project manually run karne ke liye basic commands hain.

## 1. Backend run karna

Project root se:

```powershell
cd backend
.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Agar pehle se port busy ho ya backend restart karna ho:

```powershell
taskkill /IM python.exe /F
cd backend
.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## 2. Frontend run karna

Project root se:

```powershell
cd frontend
npm install
npm.cmd run dev
```

Note: `npm` PowerShell execution policy ki wajah se block ho sakta hai, is liye PowerShell me `npm.cmd` use karo.

Frontend ka `package.json` dev script already yeh run karta hai:

```powershell
next dev . -H 127.0.0.1 -p 3000
```

Agar browser me purana UI aa raha ho ya port 3000 busy ho:

```powershell
netstat -ano | findstr ":3000"
taskkill /PID <PID> /F
cd frontend
npm.cmd run dev
```

## 3. Production build check

```powershell
cd frontend
npm run build
```

## 4. App open karna

Frontend:

```text
http://127.0.0.1:3000
```

Backend API:

```text
http://127.0.0.1:8000
```

## 5. Vercel frontend ko local backend se chalana

Vercel par deployed frontend `localhost` ko directly access nahin kar sakta. Is liye backend ke samne tunnel chalani hogi.

Backend start:

```powershell
cd backend
.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Tunnel start karne ki example commands:

```powershell
ngrok http 8000
```

ya

```powershell
cloudflared tunnel --url http://127.0.0.1:8000
```

Tunnel aapko ek public URL dega, jese:

```text
https://abc123.ngrok-free.app
```

Phir Vercel Project Settings me yeh env set karo:

```text
NEXT_PUBLIC_API_URL=https://abc123.ngrok-free.app
```

Backend `.env` me Vercel domain CORS ke liye already allow hai:

```text
https://supply-chain-mangament-system.vercel.app
```

## 6. Login test

```text
Email: admin@supplychain.com
Password: password123
```

## 7. Important note

SQL Server local machine par chalna chahiye aur database name yeh hona chahiye:

```text
SupplyChain_Management
```

Backend config file:

```text
backend/.env
```

## 8. Jo major changes ho chuki hain

- supplier create flow fix ho chuka hai
- suppliers page par filter aur export working hain
- admin ke liye settings page add ho chuka hai
- supplier / warehouse / client / logistics ke role-based dashboard aur sidebar update ho chuke hain
- signup/login ke baad role labels local profile ke mutabiq aa rahe hain

## 9. Important changed files

```text
frontend/src/app/dashboard/page.tsx
frontend/src/app/suppliers/page.tsx
frontend/src/app/settings/page.tsx
frontend/src/components/Sidebar.tsx
frontend/src/lib/api.ts
frontend/src/context/AuthContext.tsx
frontend/src/app/signup/page.tsx
backend/routes/suppliers.py
backend/database.py
```
