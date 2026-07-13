# Frontend Documentation

## สิ่งที่แก้ไข
- อัพเดต `next.config.ts` เพื่ออนุญาตให้ `next/image` โหลดรูปจาก CDN ภายนอก
- แก้การใช้งาน `next/image` ใน `src/app/features/booking/Bookingpage.tsx`
- เพิ่มการตรวจสอบและโหลดโปรไฟล์จาก LIFF
- สร้างฟอร์มการจองที่เชื่อมต่อกับ backend booking API

## ไฟล์สำคัญ
- `next.config.ts`
  - ตั้งค่า `images.domains` สำหรับ `cdn-icons-png.flaticon.com` และ `profile.line-scdn.net`
- `src/app/features/booking/Bookingpage.tsx`
  - ใช้ `useEffect` เพื่อ initialize LIFF และดึง `profile.pictureUrl`, `userId`, `displayName`
  - ใช้ `Image` จาก `next/image` เพื่อแสดงรูปโปรไฟล์
  - ส่งข้อมูลจองคิวไปยัง backend ผ่าน `createBooking`

## imports ที่ใช้
- `import React, { useEffect, useState, type ChangeEvent } from 'react';`
- `import Image from 'next/image';`
- `import liff from '@line/liff';`
- `import { createBooking, type BookingRequest } from '../../../services/bookingService';`

## npm packages ที่ใช้งาน
- `next` - สำหรับรัน Next.js application
- `react` - UI library
- `react-dom` - DOM rendering สำหรับ React
- `@line/liff` - เชื่อมต่อกับ LINE Front-end Framework
- `typescript` - type checking
- `eslint` - linting
- `@tailwindcss/postcss`, `tailwindcss` - สำหรับ styling หากมีใช้งานใน project

## จุดสำคัญของโค้ด
- `defaultProfile.pictureUrl` ตั้งค่าสำหรับกรณีที่ยังโหลดรูปจาก LINE ไม่ได้
- `process.env.NEXT_PUBLIC_LIFF_ID` ต้องถูกเซ็ตใน environment เพื่อให้ LIFF ทำงาน
- `Image` ต้องโหลดจาก hostname ที่กำหนดใน `next.config.ts`
- ฟอร์มส่ง `bookingDate` ในรูปแบบ ISO string เช่น `YYYY-MM-DDTHH:MM`

---

# Backend Documentation

## สิ่งที่แก้ไข
- สร้าง backend structure แยกเป็น `controllers`, `services`, `models`, `routes`, `middlewares`, `utils`
- แก้ `backend/src/index.ts` ให้ตั้งค่า Express app และ route
- สร้าง `bookingsRoutes.ts` สำหรับ expose endpoint `/api/bookings`
- สร้าง `bookingsController.ts` เพื่อ validate request และเรียก service
- สร้าง `bookingService.ts` เพื่อ logic การสร้าง booking และส่ง notification ไปยัง LINE
- สร้าง `bookingModel.ts` เพื่อเขียน logic query กับ Prisma
- สร้าง `prismaClient.ts` เพื่อเชื่อม Prisma client
- อนุญาตให้ใช้ `next/image` ของ frontend โดยแก้ config ของ frontend (อยู่ frontend side)

## ไฟล์สำคัญ
- `src/index.ts`
  - สร้าง Express application
  - ใช้ `cors`, `express.json()`, router และ global error handler
- `src/routes/bookingsRoutes.ts`
  - สร้าง Router ของ `express`
  - กำหนด `POST /` เพื่อสร้าง booking
- `src/controllers/bookingsController.ts`
  - validate body request
  - parse `bookingDate`
  - return response JSON
- `src/services/bookingService.ts`
  - call `createBookingModel`
  - ถ้ามี LINE configuration ให้เรียก `pushBookingNotification`
- `src/models/bookingModel.ts`
  - call `prisma.booking.create`
- `src/utils/prismaClient.ts`
  - import `PrismaClient` จาก generated Prisma client
- `src/middlewares/errorHandler.ts`
  - จัดการ error response กลาง

## imports ที่ใช้
- `import express from 'express';`
- `import cors from 'cors';`
- `import dotenv from 'dotenv';`
- `import { Router } from 'express';`
- `import type { Request, Response, NextFunction } from 'express';`
- `import { PrismaClient } from '../generated/prisma/client.ts';`
- `import { createBooking as createBookingModel, type NewBookingData } from '../models/bookingModel.ts';`
- `import { isLineConfigured, pushBookingNotification } from '../utils/lineClient.ts';`
- `import prisma from '../utils/prismaClient.ts';`
- `import type { Booking } from '../generated/prisma/client.ts';`

## npm packages ที่ใช้งาน
- `express` - สร้าง backend API
- `cors` - เปิด CORS สำหรับ frontend request
- `dotenv` - โหลด environment variables
- `@line/bot-sdk` - ส่ง notification ไปยัง LINE
- `@prisma/client` - Prisma client สำหรับ query database
- `prisma` - Prisma CLI / generator
- `ts-node` - รัน TypeScript โดยตรงใน runtime
- `typescript` - type checking
- `nodemon` - รีสตาร์ท server ระหว่างพัฒนา
- `@types/express`, `@types/cors`, `@types/node` - type definitions สำหรับ TypeScript

## จุดสำคัญของโค้ด
- `backend/src/utils/prismaClient.ts` ต้อง import path แบบ explicit `.ts` เพราะใช้ `module: nodenext` และ `type: module` ใน backend
- `bookingService.ts` แยก responsibility ของธุรกิจ logic ออกจาก controller และ model
- `bookingsController.ts` ตรวจสอบ request input ก่อนสร้าง booking
- `bookingsRoutes.ts` ทำหน้าที่เป็น route layer ที่ไม่รับ logic ซับซ้อน
- `src/index.ts` ใช้ `dotenv.config()` ก่อนเรียก config ใด ๆ

## คำแนะนำเพิ่มเติม
- ถ้าต้องการสั่ง backend ในโหมดพัฒนา ให้ใช้ `npm run dev` จากโฟลเดอร์ `backend`
- ถ้าต้องการ build frontend ใช้ `npm run build` จากโฟลเดอร์ `frontend`
- ตรวจสอบว่า `NEXT_PUBLIC_LIFF_ID` ถูกเซ็ตใน environment variable ของ frontend
- ตรวจสอบว่า backend endpoint ตรงกับ `createBooking` service ของ frontend
