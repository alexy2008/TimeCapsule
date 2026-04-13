<?php

namespace App\Services;

use App\Models\Capsule;
use Carbon\Carbon;

class CapsuleService
{
    public function create(array $data): Capsule
    {
        $openAt = Carbon::parse($data['openAt'])->utc();

        if ($openAt->isPast()) {
            throw new \InvalidArgumentException('openAt must be in the future');
        }

        $code = $this->generateUniqueCode();

        return Capsule::create([
            'code' => $code,
            'title' => $data['title'],
            'content' => $data['content'],
            'creator' => $data['creator'],
            'open_at' => $openAt->toIso8601ZuluString(),
            'created_at' => now()->utc()->toIso8601ZuluString(),
        ]);
    }

    public function getByCode(string $code): ?array
    {
        $capsule = Capsule::where('code', $code)->first();
        if (!$capsule) {
            return null;
        }
        return $this->formatCapsule($capsule, !$capsule->isOpened());
    }

    public function listPaginated(int $page = 0, int $size = 20): array
    {
        $query = Capsule::orderBy('created_at', 'desc');
        $total = $query->count();
        $items = $query->skip($page * $size)->take($size)->get();

        return [
            'content' => $items->map(fn($c) => $this->formatCapsule($c, false))->toArray(),
            'totalElements' => $total,
            'totalPages' => (int) ceil($total / $size),
            'number' => $page,
            'size' => $size,
        ];
    }

    public function delete(string $code): bool
    {
        $capsule = Capsule::where('code', $code)->first();
        if (!$capsule) {
            return false;
        }
        $capsule->delete();
        return true;
    }

    private function formatCapsule(Capsule $capsule, bool $hideContent): array
    {
        $opened = $capsule->isOpened();
        return [
            'code' => $capsule->code,
            'title' => $capsule->title,
            'content' => $hideContent ? null : $capsule->content,
            'creator' => $capsule->creator,
            'openAt' => $capsule->open_at->toIso8601ZuluString(),
            'createdAt' => $capsule->created_at->toIso8601ZuluString(),
            'opened' => $opened,
        ];
    }

    private function generateUniqueCode(): string
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for ($attempt = 0; $attempt < 10; $attempt++) {
            $code = '';
            for ($i = 0; $i < 8; $i++) {
                $code .= $chars[random_int(0, 35)];
            }
            if (!Capsule::where('code', $code)->exists()) {
                return $code;
            }
        }
        throw new \RuntimeException('Failed to generate unique capsule code');
    }
}
