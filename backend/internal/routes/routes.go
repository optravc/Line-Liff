package routes

import (
	"backend/internal/controllers"

	"github.com/gin-gonic/gin"
)

func SetupBookingRoutes(r *gin.Engine) {
	api := r.Group("/api")
	bookingGroup := api.Group("/bookings")
	{
		bookingGroup.POST("", controllers.CreateBookingController)
		bookingGroup.GET("", controllers.GetBookingStatusController)
		bookingGroup.DELETE("/:id", controllers.DeleteBookingController)
	}
}
