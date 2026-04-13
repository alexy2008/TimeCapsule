@extends('layouts.app')
@section('title', '创建 - 时间胶囊-Laravel')

@section('content')
@if(empty($createdCapsule))
<section id="view-create" class="view active">
    <div class="view-header">
        <a class="btn-back" href="/">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            返回
        </a>
        <h2>创建时间胶囊</h2>
    </div>

    <div class="cyber-glass create-form-card">
        <form method="post" action="/create" class="create-form-grid" data-create-form>
            @csrf
            @if(isset($createError))
            <div style="color: var(--magenta); text-align: center;">{{ $createError }}</div>
            @endif
            <div class="form-field">
                <label for="title">标题</label>
                <input id="title" type="text" name="title" class="cyber-input" value="{{ old('title') }}" maxlength="100" required />
                @error('title')<div class="field-error">{{ $message }}</div>@enderror
            </div>

            <div class="form-field">
                <label for="content">内容</label>
                <textarea id="content" name="content" class="cyber-input textarea" rows="7" maxlength="5000" required>{{ old('content') }}</textarea>
                @error('content')<div class="field-error">{{ $message }}</div>@enderror
            </div>

            <div class="form-row-split">
                <div class="form-field">
                    <label for="creator">发布者</label>
                    <input id="creator" type="text" name="creator" class="cyber-input" value="{{ old('creator') }}" maxlength="30" placeholder="你的昵称" required />
                    @error('creator')<div class="field-error">{{ $message }}</div>@enderror
                </div>
                <div class="form-field">
                    <label for="openAt">开启时间</label>
                    <div class="datetime-input-shell">
                        <input id="openAt" type="datetime-local" name="openAt" class="cyber-input" value="{{ old('openAt') }}" min="{{ $minOpenAt }}" required />
                        <span class="datetime-input-icon" aria-hidden="true">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </span>
                    </div>
                    @error('openAt')<div class="field-error">{{ $message }}</div>@enderror
                </div>
            </div>

            <div class="form-actions" style="margin-top: 0.5rem;">
                <button type="submit" class="btn btn-primary">封存胶囊</button>
            </div>
        </form>
    </div>

    <div class="confirm-overlay" data-confirm-dialog>
        <div class="confirm-panel">
            <h3>确认创建</h3>
            <p class="confirm-message">确定要创建这枚时间胶囊吗？

胶囊一经创建，内容和开启时间将无法修改，也无法删除。</p>
            <div class="confirm-actions">
                <button type="button" class="btn btn-outline" data-dialog-cancel>取消</button>
                <button type="button" class="btn btn-primary" data-dialog-confirm>确认</button>
            </div>
        </div>
    </div>
</section>
@else
<section id="view-created" class="view active">
    <div class="success-container cyber-glass text-center">
        <div class="status-icon success-glow">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        </div>
        <h2>胶囊创建成功</h2>
        <p>您的时间胶囊已成功封存。</p>
        <div class="capsule-key-box">
            <span class="label">胶囊码</span>
            <div class="code-display mono-font glow-text">{{ $createdCapsule['code'] }}</div>
            <button type="button" class="btn btn-icon btn-copy" data-copy-code="{{ $createdCapsule['code'] }}" aria-label="Copy code">复制</button>
        </div>
        <div class="cyber-glass" style="margin-top: 1.25rem; padding: 1rem 1.25rem; border-color: rgba(0, 240, 255, 0.28); background: rgba(0, 240, 255, 0.07); text-align: left;">
            <div class="mono-font" style="color: var(--cyan); font-size: 0.8rem; margin-bottom: 0.4rem;">SAVE THIS CODE</div>
            <div style="margin: 0; color: var(--text-primary); line-height: 1.7;">
                请务必妥善保存胶囊码。它是开启此胶囊的唯一凭证，丢失后将无法找回或补发。
            </div>
        </div>
        <a class="btn btn-outline mt-6" href="/">返回首页</a>
    </div>
</section>
@endif
@endsection
