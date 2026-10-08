# 🌹 The Gulabi Baker — Artisanal Haute Confectionery

<p align="center">
  <em>An artisanal haute confectionery storefront and order management ecosystem, delivering royal taste, bespoke gifting, and handcrafted luxury pastries.</em>
</p>

<p align="center">
  <a href="#-key-features"><img src="https://img.shields.io/badge/Storefront-Vanilla%20JS%20%7C%20CSS3-ff69b4.svg?style=flat-square" alt="Frontend"></a>
  <a href="#-backend--api-architecture"><img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933.svg?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="#-database-schema"><img src="https://img.shields.io/badge/Database-PostgreSQL-336791.svg?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="#-security--authentication"><img src="https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-orange.svg?style=flat-square" alt="Auth"></a>
  <a href="#-deployment"><img src="https://img.shields.io/badge/Deploy-Vercel%20%7C%20Render-black.svg?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/License-ISC-purple.svg?style=flat-square" alt="License"></a>
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Environment Configuration](#environment-configuration)
  - [Database Initialization & Seeding](#database-initialization--seeding)
  - [Running the Application](#running-the-application)
- [Admin & Atelier Control Suite](#-admin--atelier-control-suite)
- [API Documentation](#-api-documentation)
  - [Public Endpoints](#public-endpoints)
  - [Customer Endpoints](#customer-endpoints)
  - [Admin Endpoints](#admin-endpoints)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🌸 Overview

**The Gulabi Baker** is a full-stack digital confectionery boutique designed to evoke the elegance of royal Indian confectionery fused with contemporary French pâtisserie. 

The platform features:
1. **Haute Confectionery Storefront**: An immersive, high-conversion customer shopping experience with curated catalogs, category filters, interactive cart, seamless checkout, and customer profiles.
2. **Atelier Control Suite (`/admin`)**: A dedicated command center for bakery owners to track live orders, update statuses, manage products & pricing, modify inventory, and oversee registered clientele.
3. **Robust REST API & PostgreSQL Engine**: Secure backend service featuring dual JWT authentication realms (Customer vs. Admin), role-based permissions, and relational integrity.

---

## ✨ Key Features

### 🛍️ Client Experience (Storefront)
* **Bespoke Product Showcase**: Browse artisanal cakes, delicate macarons, royal mithai fusions, and gift hampers with high-resolution imagery and rich descriptions.
* **Smart Filter & Category Navigation**: Instant filtering across categories with availability status and promotional badges.
* **Persistent Cart & Live Totals**: Client-side cart persistence with real-time tax, delivery, and discount calculations.
* **Seamless Authentication**: Customer signup and login backed by JWT session tokens, with Google OAuth integration support.
* **Order History & Tracking**: Dedicated client order review dashboard with status progression.

### 👑 Atelier Control Suite (Admin Portal)
* **Stealth Owner Sign-In**: Owners can sign in directly through the public storefront or access `/admin.html` with automatic role-based dashboard redirection.
* **Product Catalog Management**: Create, edit, tag, discount, or remove products and toggle live availability in real time.
* **Live Order Pipeline**: Track incoming orders, inspect itemized lists, and transition order stages (`pending` → `confirmed` → `in_preparation` → `out_for_delivery` → `delivered`).
* **Customer Directory**: View verified customer accounts, order histories, and contact records.
* **1-Click Instant Demo Fallback**: Embedded offline demo mode for instant evaluation without an active PostgreSQL instance.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["💻 Client Tier"]
        Storefront["Storefront (index.html / styles / scripts)"]
        AdminSuite["Atelier Admin Portal (admin.html)"]
    end

    subgraph Server["⚡ Dev & Application Gateway"]
        DevServer["Unified Dev Server (dev.js :3000)"]
        APIGateway["Express.js Server (src/app.js :5000)"]
    end

    subgraph Security["🛡️ Security & Middleware"]
        Helmet["Helmet HTTP Headers"]
        Cors["CORS Policy Guard"]
        JWTCust["JWT Customer Auth Guard"]
        JWTAdmin["JWT Admin Auth Guard"]
        Validator["express-validator"]
    end

    subgraph Database["💾 Data Layer (PostgreSQL)"]
        Pool["pg Pool Connection"]
        DB[("gulabi_baker DB\n• categories\n• products\n• customers\n• admins\n• orders\n• order_items")]
    end

    Storefront -->|Port 3000| DevServer
    AdminSuite -->|Port 3000| DevServer
    DevServer -->|Reverse Proxy /api| APIGateway

    APIGateway --> Helmet
    APIGateway --> Cors
    APIGateway --> Validator

    Validator --> JWTCust --> Pool
    Validator --> JWTAdmin --> Pool
    Pool --> DB
