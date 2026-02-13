# BachavSetu

BachavSetu is a disaster relief platform that makes emergency management faster, more transparent, and more efficient for affected communities, responders, NGOs, and authorities.

---
## Live Demo

- **Frontend:** [https://bachav-setu.vercel.app](https://bachav-setu.vercel.app)
- **Backend:** [https://bachavsetu-9ygx.onrender.com](https://bachavsetu-9ygx.onrender.com)
- **Video Demo** [https://drive.google.com/file/d/108p6_b4BJFXB5W_FjiCnZEUcmK6Eul1A/view?usp=sharing](https://drive.google.com/file/d/108p6_b4BJFXB5W_FjiCnZEUcmK6Eul1A/view?usp=sharing)
---

## Key Features

- **Incident Reporting**: Report emergencies with location, severity, media, and requested supplies
- **Supply Requests**: Track approval and delivery of relief materials  
- **Resource Tracking**: Monitor inventory and supply deployment in real time
- **Assignment Management**: Assign and track responder tasks from dispatch to resolution
- **Role-Based Access**: Separate workflows for citizens, responders, and admins
- **Geospatial Queries**: Find nearby incidents/responders using 2dsphere indexes

---
## Optimizations

- **2dsphere Indexes**: O(1) geospatial proximity queries for nearby incidents/responders
- **Schema Enums**: Prevent invalid data at database level, reduce API validation
- **ObjectId References**: Normalized data, avoid duplication, lean documents
- **Populate Queries**: Selective joins only when needed, avoid over-fetching
- **Pre-save Hooks**: Auto-generate unique IDs without controller logic
- **Timestamps**: Built-in audit trail for status tracking and analytics
- **Sparse Indexes**: Efficient unique constraints (registration numbers) without null issues

---

## Technical Highlights

- **MongoDB Schemas**: User, Incident, Assignment, Supply, SupplyRequest with ObjectId references and GeoJSON location fields
- **2dsphere Indexes**: Efficient proximity queries for "nearby incidents/responders" 
- **REST API Design**: Modular routes (`/incidents`, `/assignments`, `/supplies`, `/supply-requests`)
- **Validation**: Schema-level enums, regex validation, and middleware protection
- **Pre-save Hooks**: Auto-generate unique `hash` IDs for assignments using `nanoid`
- **Population**: Dynamic joins via `.populate()` for related data (reporter, assignments, supplies)

---

## How to Use

1. **Live Platform**: [BachavSetu Frontend](https://bachav-setu.vercel.app)
2. **Register/Login**: User/responder/admin accounts
3. **Report Incident**: Location + category + severity + supplies needed
4. **Track Progress**: Real-time status updates and assignments
5. **Manage Supplies**: Inventory tracking and request fulfillment

---


Empowering communities with rapid, organized disaster response.
