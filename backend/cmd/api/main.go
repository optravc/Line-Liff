package main

import (
	"backend/internal/database"
	"backend/internal/routes"

	"github.com/gin-contrib/cors" 
	"github.com/gin-gonic/gin"
)

func main() {
	database.InitDB()
	r := gin.Default()

	// ตั้งค่า CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000", "https://line-liff-2p7b.vercel.app/"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))

	routes.SetupBookingRoutes(r)
	r.Run(":8080")
}