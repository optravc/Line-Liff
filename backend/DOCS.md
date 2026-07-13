# Backend Documentation

## สิ่งที่แก้ไข
- สร้างโครงสร้าง backend แยกตาม layer: `controllers`, `services`, `models`, `routes`, `middlewares`, `utils`
- ปรับ `src/index.ts` ให้เป็น Express API entry point
- สร้าง route `POST /api/bookings` และ controller สำหรับ validate request
- แยก business logic ไป `bookingService.ts`
- สร้าง model layer ใน `bookingModel.ts` เพื่อเรียก Prisma
- สร้าง Prisma client singleton ใน `prismaClient.ts`
- ตั้งค่า error handler กลางใน `middlewares/errorHandler.ts`

## ไฟล์สำคัญ
- `src/index.ts`
  - imports: `express`, `cors`, `dotenv`, `bookingsRouter`, `errorHandler`
  - config: `dotenv.config()`, `app.use(cors())`, `app.use(express.json())`, route `/api/bookings`, และ `app.use(errorHandler)`
- `src/routes/bookingsRoutes.ts`
  - imports: `Router` จาก `express`, `createBookingController`
  - route: `router.post('/', createBookingController)`
- `src/controllers/bookingsController.ts`
  - imports: `Request`, `Response`, `NextFunction`, `createBooking`
  - validate body และ parse `bookingDate`
- `src/services/bookingService.ts`
  - imports: `createBooking as createBookingModel`, `isLineConfigured`, `pushBookingNotification`
  - สร้าง booking และส่ง LINE notification หากตั้งค่า LINE ถูกต้อง
- `src/models/bookingModel.ts`
  - imports: `prisma`, `Booking` type
  - function `createBooking(data)` เรียก `prisma.booking.create({ data })`
- `src/utils/prismaClient.ts`
  - imports: `PrismaClient` จาก generated Prisma client
  - export default PrismaClient instance

## imports ที่ใช้
- `express`
- `cors`
- `dotenv`
- `@line/bot-sdk`
- `@prisma/client`
- `type Request, Response, NextFunction` จาก `express`
- `PrismaClient` จาก `../generated/prisma/client.ts`
- `prisma` singleton จาก `../utils/prismaClient.ts`

## npm packages ที่ใช้งาน
- `express`
- `cors`
- `dotenv`
- `@line/bot-sdk`
- `@prisma/client`
- `prisma`
- `ts-node`
- `typescript`
- `nodemon`
- `@types/express`
- `@types/cors`
- `@types/node`

## สิ่งที่ควรรู้
- Backend ใช้ TypeScript ในโหมด ESM (`type: module`) จึงต้อง import path แบบ explicit และใช้นามสกุล `.ts` ใน imports ภายใน
- `prismaClient.ts` เก็บ Prisma client instance เดียว เพื่อป้องกัน connection leak
- `bookingService.ts` เป็น layer ที่เชื่อม controller กับ database และ external notification
- `bookingsController.ts` ตรวจสอบข้อมูลก่อนส่งให้ service
- ถ้าเกิด error ใน service หรือ model จะถูกส่งต่อไปยัง middleware สำหรับจัดการ response
