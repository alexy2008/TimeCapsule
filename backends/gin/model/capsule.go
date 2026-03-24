// Package model GORM 数据模型
package model

// Capsule 时间胶囊实体
type Capsule struct {
	ID        int64     `gorm:"primaryKey;autoIncrement"`
	Code      string    `gorm:"type:varchar(8);uniqueIndex;not null"`
	Title     string    `gorm:"type:varchar(100);not null"`
	Content   string    `gorm:"type:text;not null"`
	Creator   string    `gorm:"type:varchar(30);not null"`
	OpenAt    string    `gorm:"column:open_at;type:text;not null"`
	CreatedAt string    `gorm:"column:created_at;type:text;not null"`
}

// TableName 指定表名
func (Capsule) TableName() string {
	return "capsules"
}
