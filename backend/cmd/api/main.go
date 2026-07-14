package main

import (
	"backend/internal/database"
	"backend/internal/routes"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// นี่คือ Handler สำหรับ Vercel
func Handler(w http.ResponseWriter, r *http.Request) {
	app := setupRouter()
	app.ServeHTTP(w, r)
}

// นี่คือฟังก์ชันตั้งค่า Router เพื่อใช้ร่วมกัน
func setupRouter() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	routes.SetupBookingRoutes(r)
	return r
}

func main() {
	// ถ้ามี environment variable "VERCEL" แสดงว่ารันบน Vercel
	if os.Getenv("VERCEL") == "1" {
		return 
	}

	// ถ้าไม่ใช่อยู่บน Vercel ให้รันแบบปกติในเครื่อง
	database.InitDB()
	r := setupRouter()
	r.Run(":8080")
}