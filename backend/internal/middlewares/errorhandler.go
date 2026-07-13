package middlewares

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// GlobalErrorHandler ทำหน้าที่ดักจับ Error ที่ส่งผ่านมาทาง c.Error()
func GlobalErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		// รัน Request ต่อไปให้เสร็จสิ้นก่อน
		c.Next()

		// ตรวจสอบว่ามี Error เกิดขึ้นระหว่างทางหรือไม่
		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err
			
			// บันทึก Error ลง Log
			// ใน Go เราใช้แพ็กเกจ log หรือ zap/zerolog ในระดับ production
			println("Backend error:", err.Error())

			// ส่ง Response กลับไปที่ Client
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "เกิดข้อผิดพลาดในระบบหลังบ้าน โปรดลองอีกครั้ง",
			})
		}
	}
}