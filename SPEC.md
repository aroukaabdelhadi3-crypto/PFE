# PFE - Distance Learning Platform Specification

## 1. Project Overview

**Project Name:** PFE - Plateforme de Formation à Distance  
**Project Type:** Web Application (Django + React.js)  
**Core Functionality:** A digital platform to automate the manual process of sending training courses, controls, and corrections to distant trainees through multiple sending phases.  
**Target Users:** Admin, Instructors, Coordinators, Supervisors, Trainees

---

## 2. User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Creates all accounts, manages technical aspects, platform updates |
| **Instructor** | Adds courses to subjects, creates controls, provides corrections |
| **Coordinator** | Follows up on trainee training progress |
| **Supervisor** | Follows training more closely than coordinator |
| **Trainee** | Receives courses, submits control answers |

---

## 3. Training Workflow (4 Sends)

### Send 1 (Part 1):
- Instructor sends Part 1 courses
- Instructor sends Part 1 controls
- **Deadline:** Trainee must send Part 1 control answers by specified date

### Send 2 (Part 2):
- Instructor sends Part 1 corrections
- Instructor sends a research topic/subject
- Instructor sends Part 2 courses
- Instructor sends Part 2 controls

### Send 3 (Part 3):
- Instructor sends Part 2 corrections
- Instructor sends Part 3 courses
- Instructor sends Part 3 controls

### Send 4 (Part 4):
- Instructor sends Part 3 corrections
- Instructor sends Part 4 courses
- Instructor sends Part 4 controls
- **Trainee sends:** Part 4 control answers + Research topic answer

---

## 4. Technology Stack

### Backend:
- **Framework:** Django 4.x with Django REST Framework
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Database:** SQLite (default for development)

### Frontend:
- **Framework:** React.js 18
- **UI Library:** Custom CSS inspired by Udemy
- **HTTP Client:** Axios

---

## 5. Database Schema

### User Model (Extended Django User)
- email (unique)
- role (admin/instructor/coordinator/supervisor/trainee)
- first_name
- last_name

### Subject Model
- name
- description
- instructor (FK to User)

### Course Model
- subject (FK to Subject)
- title
- content (text/file)
- part_number (1-4)
- created_by (FK to User)

### Control Model
- subject (FK to Subject)
- course (FK to Course)
- title
- description
- part_number (1-4)
- due_date
- created_by (FK to User)

### TraineeSubmission Model
- trainee (FK to User)
- control (FK to Control)
- answer_file
- submitted_at
- status (pending/graded)

### Correction Model
- instructor (FK to User)
- control (FK to Control)
- correction_file
- part_number
- created_at

### ResearchTopic Model
- title
- description
- instructor (FK to User)
- due_date
- part_number (2)

### ResearchSubmission Model
- trainee (FK to User)
- research_topic (FK to ResearchTopic)
- answer_file
- submitted_at

---

## 6. UI/UX Design (Udemy-inspired)

### Color Palette:
- **Primary:** #1A1A1A (Dark)
- **Secondary:** #F7F9FA (Light Gray)
- **Accent:** #A435F0 (Purple - Udemy inspired)
- **Success:** #1CB954 (Green)
- **Warning:** #F7B731 (Orange)
- **Danger:** #EB455F (Red)

### Typography:
- **Headings:** 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Body:** 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif

### Layout:
- Responsive sidebar navigation
- Top header with user info and logout
- Card-based content display
- Clean forms with validation

---

## 7. Pages Required

### Authentication:
- Login Page (Email + Password only - no registration)

### Admin Dashboard:
- Dashboard overview
- User management (CRUD)
- Platform settings

### Instructor Dashboard:
- Manage subjects/courses
- Create/manage controls
- Send courses and controls to trainees
- Upload corrections
- Create research topics

### Trainee Dashboard:
- View received courses by part
- Download and submit controls
- View corrections
- Submit research topic answers

### Coordinator/Supervisor Dashboard:
- View trainee progress
- Track training completion

---

## 8. API Endpoints

### Authentication:
- POST /api/auth/login/
- POST /api/auth/logout/
- GET /api/auth/user/

### Users:
- GET /api/users/ (admin only)
- POST /api/users/ (admin only)
- GET /api/users/{id}/
- PUT /api/users/{id}/
- DELETE /api/users/{id}/

### Subjects:
- GET /api/subjects/
- POST /api/subjects/
- GET /api/subjects/{id}/
- PUT /api/subjects/{id}/

### Courses:
- GET /api/courses/
- POST /api/courses/
- GET /api/courses/{id}/
- GET /api/courses/part/{part_number}/

### Controls:
- GET /api/controls/
- POST /api/controls/
- GET /api/controls/{id}/
- GET /api/controls/part/{part_number}/

### Submissions:
- GET /api/submissions/
- POST /api/submissions/
- GET /api/submissions/trainee/{id}/

### Corrections:
- GET /api/corrections/
- POST /api/corrections/
- GET /api/corrections/part/{part_number}/

### Research Topics:
- GET /api/research/
- POST /api/research/
- GET /api/research/{id}/

### Research Submissions:
- GET /api/research-submissions/
- POST /api/research-submissions/

---

## 9. Acceptance Criteria

1. ✅ Only Admin can create accounts (no self-registration)
2. ✅ Login requires email + password
3. ✅ Each user role has appropriate dashboard and permissions
4. ✅ Instructor can create courses, controls, corrections, research topics
5. ✅ Trainee can view courses, download controls, submit answers
6. ✅ Training workflow follows the 4-send process
7. ✅ Coordinator and Supervisor can track trainee progress
8. ✅ UI is inspired by Udemy platform
9. ✅ Application is fully functional with Django + React.js

---

## 10. Project Structure

```
PFE/
├── backend/                 # Django backend
│   ├── pfe/                # Main Django project
│   ├── accounts/          # User authentication & management
│   ├── training/           # Training management
│   ├── courses/           # Course management
│   ├── controls/          # Controls/exams management
│   └── requirements.txt
│
└── frontend/               # React.js frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── styles/
    │   └── App.js
    └── package.json
```

---

*Document created for PFE - Distance Learning Platform*
*Technology: Django + React.js*
*Design Inspiration: Udemy*
