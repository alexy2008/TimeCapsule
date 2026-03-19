// Package tests 管理员 API 端点测试
package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

// login 辅助函数：登录并返回 token
func login(r *http.Handler, t *testing.T) string {
	body, _ := json.Marshal(map[string]string{
		"password": "timecapsule-admin",
	})

	req := httptest.NewRequest(http.MethodPost, "/api/v1/admin/login", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	(*r).ServeHTTP(w, req)

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	return resp["data"].(map[string]interface{})["token"].(string)
}

func TestLoginCorrectPassword(t *testing.T) {
	r, _ := setupTestRouter()

	body, _ := json.Marshal(map[string]string{
		"password": "timecapsule-admin",
	})

	req := httptest.NewRequest(http.MethodPost, "/api/v1/admin/login", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
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
	if _, ok := data["token"]; !ok {
		t.Error("期望响应包含 token")
	}
}

func TestLoginWrongPassword(t *testing.T) {
	r, _ := setupTestRouter()

	body, _ := json.Marshal(map[string]string{
		"password": "wrong",
	})

	req := httptest.NewRequest(http.MethodPost, "/api/v1/admin/login", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("期望状态码 401，得到 %d", w.Code)
	}

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)

	if resp["success"] != false {
		t.Error("期望 success 为 false")
	}
	if resp["errorCode"] != "UNAUTHORIZED" {
		t.Errorf("期望 errorCode 为 'UNAUTHORIZED'，得到 %v", resp["errorCode"])
	}
}

func TestListCapsulesWithoutToken(t *testing.T) {
	r, _ := setupTestRouter()

	req := httptest.NewRequest(http.MethodGet, "/api/v1/admin/capsules", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("期望状态码 401，得到 %d", w.Code)
	}
}

func TestListCapsulesWithToken(t *testing.T) {
	r, _ := setupTestRouter()

	var handler http.Handler = r
	token := login(&handler, t)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/admin/capsules", nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
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
	if _, ok := data["content"]; !ok {
		t.Error("期望响应包含 content")
	}
	if _, ok := data["totalElements"]; !ok {
		t.Error("期望响应包含 totalElements")
	}
	if _, ok := data["totalPages"]; !ok {
		t.Error("期望响应包含 totalPages")
	}
}

func TestDeleteCapsuleWithToken(t *testing.T) {
	r, _ := setupTestRouter()
	var handler http.Handler = r

	token := login(&handler, t)

	// 先创建一个胶囊
	future := time.Now().UTC().Add(30 * 24 * time.Hour).Format(time.RFC3339)
	createBody, _ := json.Marshal(map[string]string{
		"title":   "待删除",
		"content": "内容",
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

	// 删除
	deleteReq := httptest.NewRequest(http.MethodDelete, fmt.Sprintf("/api/v1/admin/capsules/%s", code), nil)
	deleteReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	deleteW := httptest.NewRecorder()
	r.ServeHTTP(deleteW, deleteReq)

	if deleteW.Code != http.StatusOK {
		t.Errorf("期望状态码 200，得到 %d", deleteW.Code)
	}

	var deleteResp map[string]interface{}
	json.Unmarshal(deleteW.Body.Bytes(), &deleteResp)
	if deleteResp["success"] != true {
		t.Error("期望 success 为 true")
	}

	// 验证已删除
	getReq := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/v1/capsules/%s", code), nil)
	getW := httptest.NewRecorder()
	r.ServeHTTP(getW, getReq)

	if getW.Code != http.StatusNotFound {
		t.Errorf("期望状态码 404，得到 %d", getW.Code)
	}
}
