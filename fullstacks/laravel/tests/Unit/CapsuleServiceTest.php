<?php

namespace Tests\Unit;

use App\Models\Capsule;
use App\Services\CapsuleService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CapsuleServiceTest extends TestCase
{
    use RefreshDatabase;

    private CapsuleService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new CapsuleService();
    }

    public function test_create_capsule_returns_capsule_with_code(): void
    {
        $capsule = $this->service->create([
            'title' => '测试胶囊',
            'content' => '胶囊内容',
            'creator' => 'alex',
            'openAt' => '2099-01-01T00:00:00Z',
        ]);

        $this->assertInstanceOf(Capsule::class, $capsule);
        $this->assertNotEmpty($capsule->code);
        $this->assertEquals(8, strlen($capsule->code));
        $this->assertMatchesRegularExpression('/^[A-Z0-9]{8}$/', $capsule->code);
        $this->assertEquals('测试胶囊', $capsule->title);
        $this->assertEquals('alex', $capsule->creator);
    }

    public function test_create_capsule_rejects_past_date(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('openAt must be in the future');

        $this->service->create([
            'title' => '过去的胶囊',
            'content' => '内容',
            'creator' => 'alex',
            'openAt' => '2000-01-01T00:00:00Z',
        ]);
    }

    public function test_get_by_code_returns_null_for_unknown_code(): void
    {
        $result = $this->service->getByCode('XXXXXXXX');
        $this->assertNull($result);
    }

    public function test_get_by_code_hides_content_when_locked(): void
    {
        $this->service->create([
            'title' => '未来',
            'content' => '秘密内容',
            'creator' => 'alex',
            'openAt' => '2099-01-01T00:00:00Z',
        ]);

        $capsule = Capsule::first();
        $result = $this->service->getByCode($capsule->code);

        $this->assertNotNull($result);
        $this->assertNull($result['content']);
        $this->assertFalse($result['opened']);
    }

    public function test_list_paginated_returns_correct_structure(): void
    {
        $this->service->create([
            'title' => '胶囊1',
            'content' => '内容1',
            'creator' => 'alex',
            'openAt' => '2099-01-01T00:00:00Z',
        ]);

        $result = $this->service->listPaginated(0, 20);

        $this->assertArrayHasKey('content', $result);
        $this->assertArrayHasKey('totalElements', $result);
        $this->assertArrayHasKey('totalPages', $result);
        $this->assertArrayHasKey('number', $result);
        $this->assertArrayHasKey('size', $result);
        $this->assertEquals(1, $result['totalElements']);
        $this->assertEquals(0, $result['number']);
    }

    public function test_delete_existing_capsule_returns_true(): void
    {
        $this->service->create([
            'title' => '要删除的胶囊',
            'content' => '内容',
            'creator' => 'alex',
            'openAt' => '2099-01-01T00:00:00Z',
        ]);

        $capsule = Capsule::first();
        $result = $this->service->delete($capsule->code);

        $this->assertTrue($result);
        $this->assertNull(Capsule::where('code', $capsule->code)->first());
    }

    public function test_delete_nonexistent_capsule_returns_false(): void
    {
        $result = $this->service->delete('XXXXXXXX');
        $this->assertFalse($result);
    }
}
