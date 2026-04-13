@extends('layouts.app')
@section('title', '开启 - 时间胶囊-Laravel')

@section('content')
<section id="view-search" class="view active">
    <div class="view-header">
        <a class="btn-back" href="{{ isset($capsule) || isset($openError) ? '/open' : '/' }}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            返回
        </a>
        <h2>
            @if(empty($capsule))
                打开时间胶囊
            @elseif($capsule['opened'])
                状态: 已解锁
            @else
                状态: 锁定中
            @endif
        </h2>
    </div>

    @if(empty($capsule))
    <div class="view-shell">
        <div class="cyber-glass create-form-card">
            <form method="get" action="/open" class="search-form">
                <div class="search-input-wrapper">
                    <label for="capsuleCode">胶囊码</label>
                    <input id="capsuleCode" name="code" type="text" maxlength="8" class="cyber-input mono-font search-input" placeholder="输入 8 位胶囊码" value="{{ $lookupCode ?? '' }}" required />
                </div>
                @if(isset($openError))
                <div style="color: var(--magenta); text-align: center;">{{ $openError }}</div>
                @endif
                <div style="display: flex; justify-content: center;">
                    <button type="submit" class="btn btn-primary">开启胶囊</button>
                </div>
            </form>
        </div>
    </div>
    @else
    @php $opened = $capsule['opened']; @endphp
    <div class="cyber-glass capsule-card-shell {{ $opened ? 'capsule-unlocked-card' : 'capsule-locked-card' }}">
        <div class="locked-header" style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <div class="mono-font">胶囊码：<span>{{ $capsule['code'] }}</span></div>
            <span class="badge {{ $opened ? 'badge-unlocked badge-success' : 'badge-locked' }}">{{ $opened ? '已解锁' : '未到时间' }}</span>
        </div>

        @if(!$opened)
        <div class="capsule-content-body">
            <h3>{{ $capsule['title'] }}</h3>
            <div class="capsule-meta mono-font">
                <span>发布者: {{ $capsule['creator'] }}</span>
                <span>创建时间: {{ \Carbon\Carbon::parse($capsule['createdAt'])->format('Y-m-d H:i') }}</span>
            </div>
        </div>

        <div class="countdown-display">
            <div class="countdown-ring">
                <div class="countdown-title">距离开启剩余时间</div>
                <div class="countdown-text" data-countdown-target="{{ $capsule['openAt'] }}">
                    <div class="time-block"><span data-countdown-block>00</span><small>天</small></div>
                    <div class="colon">:</div>
                    <div class="time-block"><span data-countdown-block>00</span><small>时</small></div>
                    <div class="colon">:</div>
                    <div class="time-block"><span data-countdown-block>00</span><small>分</small></div>
                    <div class="colon">:</div>
                    <div class="time-block"><span data-countdown-block>00</span><small>秒</small></div>
                </div>
                <div class="countdown-status" data-countdown-status>等待开启时间到达</div>
            </div>
        </div>

        <div class="data-encryption-visual">
            <div class="mono-font" style="display: flex; justify-content: space-between; gap: 1rem; color: var(--text-secondary);">
                <span>{{ substr($capsule['code'], 0, 4) }}...</span>
                <span>内容已被锁定</span>
                <span>...{{ substr($capsule['code'], 4) }}</span>
            </div>
            <div class="encryption-strip"></div>
            <div class="mono-font" style="margin-top: 1rem; color: var(--cyan);">开启时间: {{ \Carbon\Carbon::parse($capsule['openAt'])->format('Y-m-d H:i') }}</div>
        </div>
        @else
        <div class="capsule-content-area capsule-content-body">
            <div class="decrypt-animation-overlay">
                <div class="scanner-beam"></div>
                <div class="binary-rain mono-font">01001000 01100101 01101100 01101100 01101111 01010100 01101001 01101101 01100101 00100000 01010101 01001110 01001100 01001111 01000011 01001011 01000101 01000100 00100000 01000011 01000001 01010000 01010011 01010101 01001100 01000101</div>
            </div>
            <h3>{{ $capsule['title'] }}</h3>
            <div class="capsule-meta mono-font">
                <span>发布者: {{ $capsule['creator'] }}</span>
                <span>开启时间: {{ \Carbon\Carbon::parse($capsule['openAt'])->format('Y-m-d H:i') }}</span>
            </div>
            <div class="capsule-message" style="margin-top: 1.5rem;">{{ $capsule['content'] }}</div>
        </div>
        @endif
    </div>
    @endif
</section>
@endsection
