# Advent Star Digital Operations Platform

Advent Star is a digital operations platform designed for a real B2B uniform supplier. It aims to streamline customer enquiries, quotation workflows, and day-to-day business operations.

The goal is to reduce manual administrative work, improve response times, and provide better business visibility through software and AI-assisted workflows.

## Overview

Many small and medium businesses still manage enquiries, quotations, and customer communication through WhatsApp, email, and spreadsheets. This often leads to:

1. Slow response times
2. Lost customer enquiries
3. Manual quotation generation
4. Limited visibility into business performance
5. Difficulty tracking customer relationships

Advent Star is intended to centralize these processes in one platform.

## Solution

The platform is designed to bring together:

- A customer-facing enquiry portal
- An internal admin dashboard
- A quotation management workflow
- Customer relationship management (CRM)
- Business analytics
- An AI-powered business assistant

## Key Features

### Customer Portal

- Submit uniform enquiries
- Upload requirements
- Request quotations
- Track enquiry status

### Admin Dashboard

- Manage enquiries
- Manage quotations
- Track orders
- Maintain a customer database
- Review business analytics

### AI Assistant

- Draft quotations
- Generate follow-up emails
- Answer operational questions
- Provide business insights using natural language

Example questions:

- Which customers have not been followed up in the last 7 days?
- What were our top-selling products this month?
- Show quotations pending approval.

## Current Repo Status

This repository currently contains:

- A `Next.js` frontend in [frontend/adventstar](./frontend/adventstar)
- A `FastAPI` backend in [backend](./backend)
- Backend routes currently wired for customers and enquiries
- Backend models and schemas for quotes, orders, and auth-related entities that can support future expansion

## System Architecture

```text
Frontend (Next.js + React + TypeScript)
        |
        v
Backend API (FastAPI)
        |
        v
PostgreSQL Database
```

Planned future architecture may also include an AI layer for workflow assistance and business insights.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL

### Planned AI Layer

- LangChain
- OpenAI API or Claude API

### DevOps

- GitHub
- Vercel
- Docker

## Future Enhancements

- Inventory management
- Purchase order tracking
- Automated customer segmentation
- Predictive sales analytics
- AI-powered lead qualification

## Why I Built This

This project was developed around the needs of a real uniforms business with existing customers.

The aim is to apply software engineering and AI to solve operational challenges faced by SMEs and to demonstrate how modern software systems can improve business efficiency and decision-making.
