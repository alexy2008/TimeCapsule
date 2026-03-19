// Package dto 请求/响应数据传输对象
// JSON 序列化使用 camelCase，与前端 API 契约保持一致
package dto

// ApiResponse 统一响应格式
type ApiResponse struct {
	Success   bool        `json:"success"`
	Data      interface{} `json:"data"`
	Message   *string     `json:"message,omitempty"`
	ErrorCode *string     `json:"errorCode,omitempty"`
}

// OK 成功响应
func OK(data interface{}, message string) ApiResponse {
	var msg *string
	if message != "" {
		msg = &message
	}
	return ApiResponse{
		Success: true,
		Data:    data,
		Message: msg,
	}
}

// Error 错误响应
func Error(message string, errorCode string) ApiResponse {
	return ApiResponse{
		Success:   false,
		Data:      nil,
		Message:   &message,
		ErrorCode: &errorCode,
	}
}

// ===== 请求 =====

// CreateCapsuleRequest 创建胶囊请求
type CreateCapsuleRequest struct {
	Title   string `json:"title" binding:"required,max=100"`
	Content string `json:"content" binding:"required"`
	Creator string `json:"creator" binding:"required,max=30"`
	OpenAt  string `json:"openAt" binding:"required"`
}

// AdminLoginRequest 管理员登录请求
type AdminLoginRequest struct {
	Password string `json:"password" binding:"required"`
}

// ===== 响应 =====

// CapsuleResponse 胶囊响应
type CapsuleResponse struct {
	Code      string  `json:"code"`
	Title     string  `json:"title"`
	Content   *string `json:"content"`
	Creator   string  `json:"creator"`
	OpenAt    string  `json:"openAt"`
	CreatedAt *string `json:"createdAt,omitempty"`
	Opened    *bool   `json:"opened,omitempty"`
}

// AdminTokenResponse 管理员 token 响应
type AdminTokenResponse struct {
	Token string `json:"token"`
}

// PageResponse 分页响应
type PageResponse struct {
	Content       interface{} `json:"content"`
	TotalElements int64       `json:"totalElements"`
	TotalPages    int         `json:"totalPages"`
	Number        int         `json:"number"`
	Size          int         `json:"size"`
}
