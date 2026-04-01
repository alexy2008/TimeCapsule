const BASE_URL = '/api/v1';
async function request(url, options = {}) {
    const { headers: customHeaders, ...rest } = options;
    const response = await fetch(`${BASE_URL}${url}`, {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            ...customHeaders,
        },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || `请求失败 (${response.status})`);
    }
    return data;
}
export function createCapsule(form) {
    return request('/capsules', {
        method: 'POST',
        body: JSON.stringify({
            ...form,
            openAt: new Date(form.openAt).toISOString(),
        }),
    });
}
export function getCapsule(code) {
    return request(`/capsules/${code}`);
}
export function adminLogin(password) {
    return request('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
    });
}
export function getAdminCapsules(token, page = 0, size = 20) {
    return request(`/admin/capsules?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}
/**
 * 删除指定的胶囊（管理员权限）
 * @param token 管理员认证令牌
 * @param code 胶囊的唯一代码
 * @returns 返回删除操作的结果
 */
export function deleteAdminCapsule(token, code) {
    return request(`/admin/capsules/${code}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}
export function getHealthInfo() {
    return request('/health');
}
