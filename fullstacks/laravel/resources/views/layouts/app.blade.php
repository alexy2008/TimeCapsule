<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@yield('title', '时间胶囊-Laravel')</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/css/cyber.css" />
    <link rel="stylesheet" href="/css/app.css" />
    <script src="/js/app.js" defer></script>
    <script>
        (function(){var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}})();
    </script>
</head>
<body>
<div class="background-grid"></div>
<div class="ambient-glow"></div>
<div class="app-shell">
    @include('components.header')
    <main class="app-main">
        @yield('content')
    </main>
    @include('components.footer')
</div>
</body>
</html>
