@extends('layouts.app')
@section('title', '管理 - 时间胶囊-Laravel')

@section('content')
<section id="view-admin" class="view active">
    <div class="view-header">
        <a class="btn-back" href="/">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            返回
        </a>
        <h2>系统管理</h2>
    </div>

    @if(!session('admin_logged_in'))
    <div class="admin-login-card cyber-glass">
        <h3 style="text-align: center; margin-bottom: 1.5rem;">管理员登录</h3>
        <form method="post" action="/admin/login" class="create-form-grid">
            @csrf
            <div class="form-field">
                <label for="adminPassword">管理员密码</label>
                <input id="adminPassword" type="password" name="password" class="cyber-input mono-font" required />
            </div>
            @if(isset($adminError))
            <div style="color: var(--magenta); text-align: center;">{{ $adminError }}</div>
            @endif
            <div style="display: flex; justify-content: center;">
                <button type="submit" class="btn btn-primary">登录</button>
            </div>
        </form>
    </div>
    @else
    <div class="cyber-glass admin-panel">
        <div class="dashboard-header">
            <h3>胶囊列表</h3>
            <form method="post" action="/admin/logout">
                @csrf
                <button type="submit" class="btn btn-outline btn-sm">退出登录</button>
            </form>
        </div>

        <div class="table-panel">
            <div class="table-toolbar">
                <p class="text-secondary">管理员可以查看和删除所有胶囊。</p>
                <a href="/admin?page={{ $currentPage ?? 0 }}" class="btn btn-outline btn-sm">刷新列表</a>
            </div>

            <div class="table-scroll cyber-glass-sm">
                @if(!empty($capsules))
                <table class="capsule-table">
                    <thead>
                    <tr>
                        <th>胶囊码</th>
                        <th>标题</th>
                        <th>发布者</th>
                        <th>开启时间</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($capsules as $capsule)
                    <tr>
                        <td class="capsule-code mono-font">{{ $capsule['code'] }}</td>
                        <td>{{ $capsule['title'] }}</td>
                        <td>{{ $capsule['creator'] }}</td>
                        <td class="mono-font">{{ \Carbon\Carbon::parse($capsule['openAt'])->format('Y-m-d H:i') }}</td>
                        <td>
                            <span class="badge {{ $capsule['opened'] ? 'badge-unlocked' : 'badge-locked' }}">{{ $capsule['opened'] ? '已解锁' : '未到时间' }}</span>
                        </td>
                        <td>
                            <form method="post" action="/admin/capsules/{{ $capsule['code'] }}/delete" data-delete-form>
                                @csrf
                                <button type="submit" class="btn btn-danger-outline btn-sm">删除</button>
                            </form>
                        </td>
                    </tr>
                    @endforeach
                    </tbody>
                </table>
                @else
                <div class="table-empty">暂无胶囊</div>
                @endif
            </div>

            @if(isset($totalPages) && $totalPages > 1)
            <div class="pagination-bar">
                <a href="/admin?page={{ max(0, ($currentPage ?? 0) - 1) }}" class="btn btn-outline btn-sm {{ ($currentPage ?? 0) == 0 ? 'disabled' : '' }}">上一页</a>
                <span class="pagination-info">第 {{ ($currentPage ?? 0) + 1 }} / {{ $totalPages }} 页</span>
                <a href="/admin?page={{ ($currentPage ?? 0) + 1 }}" class="btn btn-outline btn-sm {{ ($currentPage ?? 0) + 1 >= $totalPages ? 'disabled' : '' }}">下一页</a>
            </div>
            @endif
        </div>
    </div>

    <div class="confirm-overlay" data-confirm-dialog>
        <div class="confirm-panel">
            <h3>确认删除</h3>
            <p class="confirm-message">确定要删除这枚胶囊吗？此操作不可恢复。</p>
            <div class="confirm-actions">
                <button type="button" class="btn btn-outline" data-dialog-cancel>取消</button>
                <button type="button" class="btn btn-primary" data-dialog-confirm>确认删除</button>
            </div>
        </div>
    </div>
    @endif
</section>
@endsection
