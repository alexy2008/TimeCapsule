<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Capsule extends Model
{
    protected $table = 'capsules';
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'code', 'title', 'content', 'creator', 'open_at', 'created_at',
    ];

    protected function casts(): array
    {
        return [
            'open_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function isOpened(): bool
    {
        return now()->greaterThanOrEqualTo($this->open_at);
    }
}
