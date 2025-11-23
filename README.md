<div align="center">

# 🌐 **Smart Digital Governance Platform**
### _AI-Powered • Blockchain-Verified • 30-Day Auto Approval System_

<img src="https://i.imgur.com/0ZtmI2u.gif" width="600"/>

A next-generation governance system enabling transparent application processing,  
AI delay monitoring, blockchain verification & real-time citizen services.

</div>

---

## 🚀 **Features at a Glance**

- ✔️ Online Application Submission  
- ✔️ Real-Time Tracking with Timeline  
- ✔️ Role-Based Dashboards (Citizen / Official / Admin)  
- ✔️ AI Delay Detection (>7 days)  
- ✔️ Auto-Approval After 30 Days  
- ✔️ Blockchain SHA-256 Hash Verification  
- ✔️ OTP-Verified Feedback System  
- ✔️ Official Performance Metrics  
- ✔️ Admin Analytics Dashboard  
- ✔️ Dark/Light Mode UI  
- ✔️ Government-Themed UI  

---

<div align="center">

<img src="https://i.imgur.com/vyLhDUx.gif" width="600"/>

</div>



---

# 🏗️ **Tech Stack**

### **Frontend**
- ⚛️ React + TypeScript  
- 🧭 Wouter (Routing)  
- 📡 TanStack Query  
- 🎨 Shadcn UI + Tailwind CSS  
- ✨ Framer Motion Animations  

### **Backend**
- 🚀 Express.js + TypeScript  
- 🔐 JWT Authentication  
- 📦 In-Memory Storage  
- 🔎 Drizzle ORM  
- 🤖 AI Monitoring Service  
- 🔗 SHA-256 Blockchain Simulation  

---

# 👥 **User Roles**

| Role | Description |
|------|-------------|
| 🧑‍💼 Citizen | Submit applications, track status, give feedback, view blockchain hash |
| 👨‍💻 Official | Accept apps, update status, monitor delays |
| 🛡️ Admin | System-wide analytics, performance metrics |

---

# ⚡ **Quick Start**

```sh
npm install
npm run dev


http://localhost:5000


📁 client
   └── src/
        ├── pages/
        ├── components/
        ├── contexts/
        ├── lib/
📁 server
   ├── routes.ts
   ├── storage.ts
   ├── app.ts
   ├── index-dev.ts
   ├── index-prod.ts
📁 shared
   └── schema.ts


POST /api/auth/register
{
  "username": "example@mail.com",
  "password": "password123",
  "role": "citizen",
  "fullName": "John Doe"
}


POST /api/auth/login
{
  "username": "example@mail.com",
  "password": "password123"
}


Authorization: Bearer <token>
🔁 Application Workflow

Citizen submits application → Tracking ID generated

Official accepts → Assigned

Official updates → In Progress

Approve/Reject → Blockchain hash created

Citizen gives OTP-verified feedback

No action for 30 days → Auto-approved

🤖 AI Monitoring System
Feature	Description
⏰ Delay Detection	Flags apps pending > 7 days
🔄 Auto Approval	Auto-approve at 30 days
📩 Notifications	Real-time alerts
🔗 Blockchain Hash	SHA-256 based final approval
🌐 API Summary
Auth:
POST /api/auth/register
POST /api/auth/login

Applications:
GET /api/applications
POST /api/applications
PUT /api/applications/:id
GET /api/applications/track/:id

Feedback:
POST /api/feedback
GET /api/feedback/:applicationId

OTP:
POST /api/otp/generate
POST /api/otp/verify

Notifications:
GET /api/notifications
PUT /api/notifications/:id

<div align="center"> <img src="https://i.imgur.com/0G0P0mW.gif" width="600"/> </div>
📊 Admin Dashboard Contains

System-wide analytics

Official performance metrics

Delay warnings

Auto-approval history

Blockchain records

🛠️ Build & Deploy
Build for Production
npm run build

Start Production
npm start


Build output:

dist/index.js
client/dist/

🧪 Testing Scenarios

✔️ Citizen submits app
✔️ Official accepts & updates
✔️ Admin monitors analytics
✔️ OTP verification flow
✔️ Auto-approval test
✔️ Blockchain hash validation

🎨 Customization

Modify UI:

client/src/components/


Modify backend logic:

server/routes.ts
server/storage.ts


Modify data models:

shared/schema.ts

⭐ Support This Project

If you like this project, please ⭐ star the repo on GitHub!