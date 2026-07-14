package main

import (
	"backend/internal/database"
	"backend/internal/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	database.InitDB()
	r := gin.Default()
	routes.SetupBookingRoutes(r)
	r.Run(":8080")
}
