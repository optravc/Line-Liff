package models

import (
	"time"
	"gorm.io/gorm"
)

// นี่คือ Model (โครงสร้างข้อมูลที่ Mapping กับ Database)
type Booking struct {
	// 1. เปลี่ยนชนิดข้อมูลจาก uint เป็น string
	// 2. เพิ่ม type:varchar(255) เข้าไปใน gorm tag
	ID          string         `gorm:"primaryKey;type:varchar(255)" json:"id"`
	UserID      string         `gorm:"column:lineUserId" json:"lineUserId"` // ระบุชื่อคอลัมน์ใน DB
	DisplayName string         `gorm:"size:255" json:"displayName"`
	Service     string         `gorm:"size:100" json:"service"`
	BookingDate time.Time      `json:"bookingDate"`
	Phone       string         `json:"phone"`
	Note        string         `json:"note"`
	Status      string         `gorm:"default:'PENDING'" json:"status"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"` // รองรับ Soft Delete
}