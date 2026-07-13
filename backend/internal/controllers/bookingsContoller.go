package controllers

import (
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"backend/internal/services"
	"github.com/gin-gonic/gin"
)

// 1. Struct สำหรับรับข้อมูลจาก Request Body
type CreateBookingRequest struct {
	LineUserID  string `json:"lineUserId"`
	DisplayName string `json:"displayName"`
	Service     string `json:"service"`
	BookingDate string `json:"bookingDate"`
	Phone       string `json:"phone"`
	Note        string `json:"note"`
}

// 2. ฟังก์ชันตรวจสอบและแปลงรูปแบบวันที่
func parseBookingDate(input string) (time.Time, error) {
	layouts := []string{
		time.RFC3339,
		"2006-01-02T15:04",
		"2006-01-02T15:04:05",
	}

	for _, layout := range layouts {
		parsedTime, err := time.ParseInLocation(layout, input, time.Local)
		if err == nil {
			return parsedTime, nil
		}
	}

	return time.Time{}, errors.New("invalid booking date format")
}

// 3. ฟังก์ชันแปลงชื่อบริการเป็นตัวย่อภาษาอังกฤษ (Prefix)
func getServicePrefix(serviceName string) string {
	switch serviceName {
	case "อุดฟัน":
		return "FIL" 
	case "รักษารากฟัน":
		return "RCT" 
	case "รักษาโรคเหงือก":
		return "PER" 
	case "ฟอกสีฟัน":
		return "WHT" 
	case "ศัลยกรรม":
		return "SUR" 
	case "จัดฟัน":
		return "ORT" 
	case "รากเทียม":
		return "IMP" 
	case "ใส่ฟัน":
		return "DEN" 
	case "ครอบฟัน":
		return "CRW" 
	case "ทันตกรรมเลเซอร์":
		return "LSR" 
	case "การรักษาอาการนอนกรน":
		return "SNO" 
	case "เอ็กซเรย์":
		return "XRY" 
	default:
		return "GEN" // General (อื่นๆ)
	}
}

// 4. Controller สร้างการจอง
func CreateBookingController(c *gin.Context) {
	var req CreateBookingRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "รูปแบบข้อมูลไม่ถูกต้อง",
		})
		return
	}

	if req.LineUserID == "" || req.DisplayName == "" || req.Service == "" || req.BookingDate == "" || req.Phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ข้อมูลไม่ครบถ้วน โปรดระบุชื่อผู้ใช้ บริการ วันที่ เวลา และเบอร์โทรศัพท์",
		})
		return
	}

	parsedBookingDate, err := parseBookingDate(req.BookingDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "วันที่และเวลาที่ส่งมาผิดรูปแบบ",
		})
		return
	}

	// สร้าง Custom Booking ID
	prefix := getServicePrefix(req.Service)
	currentTime := time.Now()
	dateStr := currentTime.Format("20060102") 
	
	randomNum := rand.Intn(10000)
	customID := fmt.Sprintf("%s-%s-%04d", prefix, dateStr, randomNum)

	bookingData := services.BookingInput{
		ID:          customID,
		LineUserID:  req.LineUserID,
		DisplayName: req.DisplayName,
		Service:     req.Service,
		BookingDate: parsedBookingDate,
		Phone:       req.Phone,
		Note:        req.Note,
	}

	booking, err := services.CreateBooking(bookingData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "ไม่สามารถบันทึกข้อมูลการจองได้",
		})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    booking,
	})
}

// 5. Controller ดูสถานะการจอง
func GetBookingStatusController(c *gin.Context) {
	lineUserID := c.Query("lineUserId")
	if lineUserID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "กรุณาระบุ lineUserId",
		})
		return
	}

	bookings, err := services.ListBookingsByUserID(lineUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "ไม่สามารถดึงสถานะการจองได้",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    bookings,
	})
}

// 6. Controller สำหรับยกเลิกการจอง
func DeleteBookingController(c *gin.Context) {
	// ดึง ID จาก URL Parameter (เช่น /api/booking/FIL-20260713-1234)
	bookingID := c.Param("id") 
	
	if bookingID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "กรุณาระบุรหัสการจอง",
		})
		return
	}

	err := services.DeleteBookingByID(bookingID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "ยกเลิกการจองสำเร็จ",
	})
}