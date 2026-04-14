<?php

namespace Tests\Feature;

use App\Models\Capsule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CapsuleApiTest extends TestCase
{
    use RefreshDatabase;

    // ── Health ───────────────────────────────────────────────────────────────

    public function test_health_endpoint_returns_up(): void
    {
        $response = $this->getJson('/api/v1/health');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'UP')
            ->assertJsonStructure([
                'data' => ['status', 'timestamp', 'techStack' => ['framework', 'language', 'database']],
            ]);
    }

    // ── Create capsule ────────────────────────────────────────────────────────

    public function test_create_capsule_returns_201_with_code(): void
    {
        $response = $this->postJson('/api/v1/capsules', [
            'title'   => '时间胶囊测试',
            'content' => '未来的你好',
            'creator' => 'alex',
            'openAt'  => '2099-01-01T00:00:00Z',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['code', 'title', 'creator', 'openAt', 'createdAt']]);

        $code = $response->json('data.code');
        $this->assertEquals(8, strlen($code));
        $this->assertMatchesRegularExpression('/^[A-Z0-9]{8}$/', $code);
    }

    public function test_create_capsule_rejects_past_date(): void
    {
        $response = $this->postJson('/api/v1/capsules', [
            'title'   => '过去',
            'content' => '内容',
            'creator' => 'alex',
            'openAt'  => '2000-01-01T00:00:00Z',
        ]);

        $response->assertStatus(400)
            ->assertJsonPath('success', false)
            ->assertJsonPath('errorCode', 'VALIDATION_ERROR');
    }

    public function test_create_capsule_validates_required_fields(): void
    {
        $response = $this->postJson('/api/v1/capsules', []);

        // Laravel ValidationException is mapped to 400 in bootstrap/app.php
        $response->assertStatus(400)
            ->assertJsonPath('success', false)
            ->assertJsonPath('errorCode', 'VALIDATION_ERROR');
    }

    // ── Get capsule ───────────────────────────────────────────────────────────

    public function test_get_capsule_hides_content_before_open_time(): void
    {
        $create = $this->postJson('/api/v1/capsules', [
            'title'   => '未来消息',
            'content' => '秘密',
            'creator' => 'test',
            'openAt'  => '2099-01-01T00:00:00Z',
        ]);
        $code = $create->json('data.code');

        $response = $this->getJson("/api/v1/capsules/{$code}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.content', null)
            ->assertJsonPath('data.opened', false);
    }

    public function test_get_capsule_returns_404_for_unknown_code(): void
    {
        $response = $this->getJson('/api/v1/capsules/XXXXXXXX');

        $response->assertStatus(404)
            ->assertJsonPath('success', false)
            ->assertJsonPath('errorCode', 'CAPSULE_NOT_FOUND');
    }

    // ── Admin login ───────────────────────────────────────────────────────────

    public function test_admin_login_succeeds_with_correct_password(): void
    {
        $response = $this->postJson('/api/v1/admin/login', [
            'password' => 'timecapsule-admin',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['token']]);

        $this->assertNotEmpty($response->json('data.token'));
    }

    public function test_admin_login_fails_with_wrong_password(): void
    {
        $response = $this->postJson('/api/v1/admin/login', [
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('errorCode', 'UNAUTHORIZED');
    }

    // ── Admin list & delete ───────────────────────────────────────────────────

    public function test_admin_can_list_capsules_with_jwt(): void
    {
        $this->postJson('/api/v1/capsules', [
            'title'   => '管理员可见',
            'content' => '内容',
            'creator' => 'alex',
            'openAt'  => '2099-01-01T00:00:00Z',
        ]);

        $token = $this->postJson('/api/v1/admin/login', ['password' => 'timecapsule-admin'])
            ->json('data.token');

        $response = $this->getJson('/api/v1/admin/capsules', [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['content', 'totalElements', 'totalPages', 'number', 'size'],
            ]);

        $this->assertGreaterThanOrEqual(1, $response->json('data.totalElements'));
    }

    public function test_admin_list_requires_jwt(): void
    {
        $response = $this->getJson('/api/v1/admin/capsules');

        $response->assertStatus(401);
    }

    public function test_admin_can_delete_capsule_with_jwt(): void
    {
        $code = $this->postJson('/api/v1/capsules', [
            'title'   => '待删除',
            'content' => '内容',
            'creator' => 'alex',
            'openAt'  => '2099-01-01T00:00:00Z',
        ])->json('data.code');

        $token = $this->postJson('/api/v1/admin/login', ['password' => 'timecapsule-admin'])
            ->json('data.token');

        $response = $this->deleteJson("/api/v1/admin/capsules/{$code}", [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertNull(Capsule::where('code', $code)->first());
    }

    public function test_admin_delete_nonexistent_capsule_returns_404(): void
    {
        $token = $this->postJson('/api/v1/admin/login', ['password' => 'timecapsule-admin'])
            ->json('data.token');

        $response = $this->deleteJson('/api/v1/admin/capsules/XXXXXXXX', [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertStatus(404)
            ->assertJsonPath('errorCode', 'CAPSULE_NOT_FOUND');
    }
}
