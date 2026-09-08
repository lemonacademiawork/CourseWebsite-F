# 🎟️ Coupon & 👨‍🏫 Trainer Applications — REST API Documentation

Comprehensive API guide for promotional coupon management and the "Become a Trainer" application request workflow.

- **Base URL (Production)**: `https://lemonwebsite-backend.onrender.com/api/v1`
- **Base URL (Local)**: `http://localhost:5000/api/v1`
- **Auth Scheme**: Bearer JWT (`Authorization: Bearer <token>`)

---

## 🎟️ 1. Coupon API (`/api/v1/coupons`)

Provides coupon creation, administration, public promotional listings, and discount validation logic for student checkouts.

### Endpoint Overview

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/coupons/validate` | Public / Auth | Validate promo code, verify constraints & compute discount |
| `GET` | `/api/v1/coupons/public` | Public | List active, non-expired promotional coupons for banners |
| `GET` | `/api/v1/coupons` | Admin | List all coupons with search, status filters & pagination |
| `POST` | `/api/v1/coupons` | Admin | Create a new discount coupon (`PERCENTAGE` / `FLAT`) |
| `GET` | `/api/v1/coupons/:id` | Admin | View coupon details and redemption log (`CouponUsage`) |
| `PATCH` | `/api/v1/coupons/:id` | Admin | Update coupon rules, limits, and active status |
| `DELETE` | `/api/v1/coupons/:id` | Admin | Delete coupon record |

---

### 1.1 Validate Coupon (`POST /api/v1/coupons/validate`)
Validates a coupon against cart items, minimum order value, user usage limits, and expiration dates.

#### Request Body
```json
{
  "code": "LEMONFIRST10",
  "courseId": "c1f7a08b-9e23-4567-8901-abcdef123456",
  "amount": 2999
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "couponId": "coup_991823a",
    "code": "LEMONFIRST10",
    "discountType": "PERCENTAGE",
    "discountValue": 10,
    "discountAmount": 299.9,
    "finalAmount": 2699.1,
    "description": "10% off on all artisan courses"
  }
}
```

---

### 1.2 Get Public Coupons (`GET /api/v1/coupons/public`)
Returns all active, non-expired promotional coupons displayed in site banners and announcements.

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "coup_991823a",
      "code": "WELCOME10",
      "discountType": "PERCENTAGE",
      "discountValue": 10,
      "minOrderAmount": 999,
      "maxDiscountAmount": 500,
      "expiresAt": "2026-12-31T23:59:59.000Z",
      "description": "10% discount on your first course enrollment"
    }
  ]
}
```

---

### 1.3 Create Coupon (`POST /api/v1/coupons`)
*Requires `ADMIN` role.*

#### Request Body
```json
{
  "code": "SPRING500",
  "discountType": "FLAT",
  "discountValue": 500,
  "minOrderAmount": 1999,
  "maxDiscountAmount": 500,
  "usageLimit": 100,
  "userLimit": 1,
  "courseId": null,
  "expiresAt": "2026-05-01T00:00:00.000Z",
  "isActive": true,
  "description": "Flat ₹500 off on spring skincare masterclasses"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "id": "coup_spring500",
    "code": "SPRING500",
    "discountType": "FLAT",
    "discountValue": 500,
    "isActive": true
  }
}
```

---

## 👨‍🏫 2. Trainer Applications API (`/api/v1/trainer-requests`)

Allows skilled artisans and instructors to apply to become trainers on Lemon Academy. Admins can review applications, evaluate portfolios/videos, and automatically promote approved applicants to `TRAINER` role.

### Endpoint Overview

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/trainer-requests` | Public / Auth | Submit "Become a Trainer" application form |
| `GET` | `/api/v1/trainer-requests/me` | Auth | Check user's own application status (`PENDING` / `APPROVED` / `REJECTED`) |
| `GET` | `/api/v1/trainer-requests` | Admin | List all submitted applications with status & search filtering |
| `GET` | `/api/v1/trainer-requests/:id` | Admin | Get full applicant resume, video & portfolio details |
| `PATCH` | `/api/v1/trainer-requests/:id/status` | Admin | Approve or reject application (with automatic `TRAINER` promotion) |
| `DELETE` | `/api/v1/trainer-requests/:id` | Admin | Delete application record |

---

### 2.1 Submit Trainer Application (`POST /api/v1/trainer-requests`)
Submits a trainer application request. If the user is logged in, their `userId` is linked automatically.

#### Request Body
```json
{
  "fullName": "Ananya Sharma",
  "email": "ananya.sharma@example.com",
  "phone": "+919876543210",
  "expertise": "Cold Process Soap Making & Botanical Skincare",
  "yearsOfExperience": 6,
  "bio": "Certified organic cosmetic formulator with 6 years running an artisan studio.",
  "portfolioUrl": "https://instagram.com/ananya_soaps",
  "sampleVideoUrl": "https://youtube.com/watch?v=sample123",
  "resumeUrl": "https://res.cloudinary.com/ovxjar28/raw/upload/v1/resumes/ananya_resume.pdf"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Trainer application submitted successfully! Our team will review your application within 2-3 business days.",
  "data": {
    "id": "tr_req_892348",
    "fullName": "Ananya Sharma",
    "email": "ananya.sharma@example.com",
    "status": "PENDING",
    "createdAt": "2026-09-08T10:30:00.000Z"
  }
}
```

---

### 2.2 Get My Application Status (`GET /api/v1/trainer-requests/me`)
*Requires Authentication.*

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "tr_req_892348",
    "status": "PENDING",
    "expertise": "Cold Process Soap Making & Botanical Skincare",
    "adminFeedback": null,
    "submittedAt": "2026-09-08T10:30:00.000Z",
    "reviewedAt": null
  }
}
```

---

### 2.3 Review Application (`PATCH /api/v1/trainer-requests/:id/status`)
*Requires `ADMIN` role.*
Approving the application automatically updates the applicant's account role to `TRAINER` and provisions a `TrainerProfile`.

#### Request Body
```json
{
  "status": "APPROVED",
  "feedbackNotes": "Exceptional soap crafting experience and clear teaching style. Welcome aboard!"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Application approved successfully. User has been promoted to TRAINER.",
  "data": {
    "id": "tr_req_892348",
    "status": "APPROVED",
    "feedbackNotes": "Exceptional soap crafting experience and clear teaching style. Welcome aboard!",
    "user": {
      "id": "usr_91238",
      "email": "ananya.sharma@example.com",
      "role": "TRAINER"
    }
  }
}
```
