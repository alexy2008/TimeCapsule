@extends('layouts.app')
@section('title', '关于 - 时间胶囊-Laravel')

@section('content')
<section id="view-about" class="view active">
    <div class="view-header">
        <a class="btn-back" href="/">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            返回
        </a>
        <h2>关于时间胶囊 (HelloTime)</h2>
    </div>

    <div class="about-content-wrapper">
        <div class="cyber-glass p-8 mb-8">
            <div class="flex-row gap-8">
                <div class="about-hero-text">
                    <h3 class="text-glow-cyan mb-4">Laravel 全栈演示</h3>
                    <p class="text-secondary mb-6">
                        这一套实现使用 <strong class="cyan-text text-glow">Laravel + Blade + Alpine.js</strong>，
                        展示服务端模板渲染、会话态管理与客户端交互如何在同一应用中协同工作。
                    </p>
                    <p class="text-secondary">
                        与其他 JavaScript 全栈实现不同，这里由服务器主导页面状态，Alpine.js 仅负责在局部交互时提升流畅度。
                    </p>
                </div>
                <div class="about-hero-deco">
                    <button type="button" class="tech-orb tech-orb-button" aria-label="隐藏管理入口" data-secret-admin>
                        <span class="orb-core"></span>
                        <span class="orb-ring ring-1"></span>
                        <span class="orb-ring ring-2"></span>
                    </button>
                </div>
            </div>
        </div>

        <div class="about-grid mb-8">
            <div class="cyber-glass p-6">
                <div class="feature-header mb-4">
                    <div class="f-icon">🐘</div>
                    <h4>服务端优先</h4>
                </div>
                <p class="text-muted text-sm">控制器直接返回 Blade 模板页面，首屏即带完整内容与状态，无需等待客户端首次拉数。</p>
            </div>
            <div class="cyber-glass p-6">
                <div class="feature-header mb-4">
                    <div class="f-icon">🏔️</div>
                    <h4>Alpine.js 交互</h4>
                </div>
                <p class="text-muted text-sm mt-3">主题切换、确认弹窗与倒计时使用轻量级 Alpine.js，不必引入完整前端框架。</p>
            </div>
            <div class="cyber-glass p-6">
                <div class="feature-header mb-4">
                    <div class="f-icon">🗃️</div>
                    <h4>持久化内聚</h4>
                </div>
                <p class="text-muted text-sm mt-3">应用、页面、API 与 SQLite 数据层都封装在同一 Laravel 进程中。</p>
            </div>
        </div>

        <div class="cyber-glass p-8 mb-8">
            <h3 class="text-glow-cyan mb-6">核心驱动 (Core Technologies)</h3>
            <div class="tech-logos-grid" style="align-items: flex-start; margin-top: 3rem;">
                @foreach($techItems as $item)
                <div class="tech-item" style="flex-direction: column; gap: 1.5rem;">
                    <img src="{{ $item['src'] }}" class="stack-icon" style="width: 64px; height: 64px;" alt="{{ $item['label'] }}" />
                    <div class="text-center">
                        <div class="text-glow" style="font-size: 1.1rem; font-weight: bold;">{{ $item['label'] }}</div>
                        <div class="text-tertiary mono-font mt-2" style="font-size: 0.9rem;">{{ $item['version'] ?? '' }}</div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </div>
</section>
@endsection
