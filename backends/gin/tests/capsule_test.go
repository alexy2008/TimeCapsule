// Package tests 胶囊 API 端点测试
package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/alexhe/hellotime-gin/model"
	"github.com/alexhe/hellotime-gin/router"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// setupTestRouter 创建测试用的 Gin 引擎和内存数据库
func setupTestRouter() (*gin.Engine, *gorm.DB) {
	gin.SetMode(gin.TestMode)

	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		panic("无法创建测试数据库: " + err.Error())
	}

	db.AutoMigrate(&model.Capsule{})

	r := gin.New()
	router.Setup(r, db)

	return r, db
}

func TestHealth(t *testing.T) {
	r, _ := setupTestRouter()

	req := httptest.NewRequest(http.MethodGet, "/api/v1/health", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("期望状态码 200，得到 %d", w.Code)
	}

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)

	if resp["success"] != true {
		t.Error("期望 success 为 true")
	}

	data := resp["data"].(map[string]interface{})
	if data["status"] != "UP" {
		t.Errorf("期望 status 为 UP，得到 %v", data["status"])
	}
}

func TestCreateCapsule(t *testing.T) {
	r, _ := setupTestRouter()

	future := time.Now().UTC().Add(30 * 24 * time.Hour).Format(time.RFC3339)
	body, _ := json.Marshal(map[string]string{
		"title":   "测试胶囊",
		"content": "测试内容",
		"creator": "测试者",
		"openAt":  future,
	})

	req := httptest.NewRequest(http.MethodPost, "/api/v1/capsules", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("期望状态码 201，得到 %d; body: %s", w.Code, w.Body.String())
	}

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)

	if resp["success"] != true {
		t.Error("期望 success 为 true")
	}

	data := resp["data"].(map[string]interface{})
	code := data["code"].(string)
	if len(code) != 8 {
		t.Errorf("期望 code 长度为 8，得到 %d", len(code))
	}
	if data["title"] != "测试胶囊" {
		t.Errorf("期望 title 为 '测试胶囊'，得到 %v", data["title"])
	}
	if resp["message"] != "胶囊创建成功" {
		t.Errorf("期望 message 为 '胶囊创建成功'，得到 %v", resp["message"])
	}
}

func TestCreateCapsuleMissingFields(t *testing.T) {
	r, _ := setupTestRouter()

	body, _ := json.Marshal(map[string]string{
		"title": "测试",
	})

	req := httptest.NewRequest(http.MethodPost, "/api/v1/capsules", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("期望状态码 400，得到 %d", w.Code)
	}

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)

	if resp["success"] != false {
		t.Error("期望 success 为 false")
	}
	if resp["errorCode"] != "VALIDATION_ERROR" {
		t.Errorf("期望 errorCode 为 'VALIDATION_ERROR'，得到 %v", resp["errorCode"])
	}
}

func TestGetNonexistentCapsule(t *testing.T) {
	r, _ := setupTestRouter()

	req := httptest.NewRequest(http.MethodGet, "/api/v1/capsules/NONEXIST", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("期望状态码 404，得到 %d", w.Code)
	}

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)

	if resp["success"] != false {
		t.Error("期望 success 为 false")
	}
	if resp["errorCode"] != "CAPSULE_NOT_FOUND" {
		t.Errorf("期望 errorCode 为 'CAPSULE_NOT_FOUND'，得到 %v", resp["errorCode"])
	}
}

func TestGetUnopenedCapsuleHidesContent(t *testing.T) {
	r, _ := setupTestRouter()

	// 先创建一个未来胶囊
	future := time.Now().UTC().Add(365 * 24 * time.Hour).Format(time.RFC3339)
	createBody, _ := json.Marshal(map[string]string{
		"title":   "未来胶囊",
		"content": "秘密内容",
		"creator": "测试者",
		"openAt":  future,
	})

	createReq := httptest.NewRequest(http.MethodPost, "/api/v1/capsules", bytes.NewReader(createBody))
	createReq.Header.Set("Content-Type", "application/json")
	createW := httptest.NewRecorder()
	r.ServeHTTP(createW, createReq)

	var createResp map[string]interface{}
	json.Unmarshal(createW.Body.Bytes(), &createResp)
	code := createResp["data"].(map[string]interface{})["code"].(string)

	// 查询胶囊
	getReq := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/capsules/%s", code), nil)
	getW := httptest.NewRecorder()
	r.ServeHTTP(getW, getReq)

	if getW.Code != http.StatusOK {
		t.Errorf("期望状态码 200，得到 %d", getW.Code)
	}

	var getResp map[string]interface{}
	json.Unmarshal(getW.Body.Bytes(), &getResp)
	data := getResp["data"].(map[string]interface{})

	if data["opened"] != false {
		t.Error("期望 opened 为 false")
	}
	if data["content"] != nil {
		t.Errorf("期望 content 为 null，得到 %v", data["content"])
	}
}
