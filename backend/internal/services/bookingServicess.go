package services

import (
	"errors"
	"backend/internal/database"
	"backend/internal/models"
	"time"
)

// BookingInput คือ Struct ที่ใช้รับข้อมูลจาก Controller
type BookingInput struct {
	ID          string   
	LineUserID  string
	DisplayName string
	Service     string
	BookingDate time.Time
	Phone       string
	Note        string
}

// CreateBooking บันทึกข้อมูลลง Database
func CreateBooking(input BookingInput) (*models.Booking, error) {
	newBooking := models.Booking{
		ID:          input.ID, // <-- 2. รับ ID ที่ส่งมาจาก Controller มาใส่ให้ Database Model
		UserID:      input.LineUserID,
		DisplayName: input.DisplayName,
		Service:     input.Service,
		BookingDate: input.BookingDate,
		Phone:       input.Phone,
		Note:        input.Note,
		Status:      "PENDING",
	}

	result := database.DB.Create(&newBooking)
	if result.Error != nil {
		return nil, result.Error
	}

	return &newBooking, nil
}

// ListBookingsByUserID ดึงรายการจองของผู้ใช้จาก LINE User ID
func ListBookingsByUserID(lineUserID string) ([]models.Booking, error) {
	var bookings []models.Booking

	result := database.DB.
		Where("lineUserId = ?", lineUserID).
		Order("booking_date DESC").
		Find(&bookings)

	if result.Error != nil {
		return nil, result.Error
	}

	return bookings, nil
}

// DeleteBookingByID ลบข้อมูลหรือเปลี่ยนสถานะการจอง
func DeleteBookingByID(bookingID string) error {
	// ใช้ GORM ลบข้อมูลที่ ID ตรงกัน
	result := database.DB.Where("id = ?", bookingID).Delete(&models.Booking{})
	
	if result.Error != nil {
		return result.Error
	}
	
	// ถ้าไม่มีแถวไหนถูกลบเลย แปลว่าหารหัสไม่เจอ
	if result.RowsAffected == 0 {
		return errors.New("ไม่พบข้อมูลการจองนี้")
	}

	return nil
}