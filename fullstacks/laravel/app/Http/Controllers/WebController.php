<?php

namespace App\Http\Controllers;

use App\Services\AdminService;
use App\Services\CapsuleService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class WebController extends Controller
{
    public function __construct(
        private CapsuleService $capsuleService,
        private AdminService $adminService,
    ) {}

    public function home(): View
    {
        return view('pages.home', [
            'techItems' => $this->techItems(),
        ]);
    }

    public function createForm(): View
    {
        return view('pages.create', [
            'minOpenAt' => now()->addMinutes(1)->format('Y-m-d\TH:i'),
        ]);
    }

    public function createSubmit(Request $request): View|RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'required|string',
            'creator' => 'required|string|max:30',
            'openAt' => 'required|string',
        ]);

        try {
            // Convert datetime-local (no timezone) to ISO 8601 with UTC assumption
            $openAt = Carbon::createFromFormat('Y-m-d\TH:i', $validated['openAt'], 'UTC')->toIso8601ZuluString();
            $validated['openAt'] = $openAt;

            $capsule = $this->capsuleService->create($validated);
            return view('pages.create', [
                'createdCapsule' => [
                    'code' => $capsule->code,
                    'openAt' => $capsule->open_at->toIso8601ZuluString(),
                ],
                'minOpenAt' => now()->addMinutes(1)->format('Y-m-d\TH:i'),
            ]);
        } catch (\InvalidArgumentException $e) {
            return view('pages.create', [
                'createError' => $e->getMessage(),
                'minOpenAt' => now()->addMinutes(1)->format('Y-m-d\TH:i'),
            ])->withInput();
        }
    }

    public function openForm(): View
    {
        return view('pages.open');
    }

    public function openByCode(Request $request, string $code): View
    {
        $code = strtoupper(trim($code));
        $data = $this->capsuleService->getByCode($code);

        if (!$data) {
            return view('pages.open', [
                'openError' => '未找到该胶囊，请确认胶囊码是否正确。',
                'lookupCode' => $code,
            ]);
        }

        return view('pages.open', ['capsule' => $data]);
    }

    public function openSearch(Request $request): RedirectResponse
    {
        $code = strtoupper(trim($request->query('code', '')));
        if (!$code) {
            return redirect('/open');
        }
        return redirect('/open/' . $code);
    }

    public function about(): View
    {
        return view('pages.about', [
            'techItems' => $this->techItems(),
        ]);
    }

    public function admin(Request $request): View
    {
        if (!session('admin_logged_in')) {
            return view('pages.admin');
        }

        $page = (int) $request->query('page', 0);
        $pageData = $this->capsuleService->listPaginated($page, 20);

        return view('pages.admin', [
            'capsules' => $pageData['content'],
            'totalPages' => $pageData['totalPages'],
            'totalElements' => $pageData['totalElements'],
            'currentPage' => $page,
        ]);
    }

    public function adminLogin(Request $request): View|RedirectResponse
    {
        $password = $request->input('password', '');
        $token = $this->adminService->login($password);

        if (!$token) {
            return view('pages.admin', ['adminError' => '密码错误，请重试。']);
        }

        session(['admin_logged_in' => true]);
        return redirect('/admin');
    }

    public function adminLogout(): RedirectResponse
    {
        session()->forget('admin_logged_in');
        return redirect('/admin');
    }

    public function adminDelete(Request $request, string $code): RedirectResponse
    {
        if (!session('admin_logged_in')) {
            return redirect('/admin');
        }

        $this->capsuleService->delete($code);
        $page = (int) $request->query('page', 0);
        return redirect('/admin?page=' . $page);
    }

    private function techItems(): array
    {
        return [
            ['src' => '/stack-logos/laravel.svg', 'alt' => 'Laravel', 'label' => 'Laravel', 'version' => app()->version()],
            ['src' => '/stack-logos/php.svg', 'alt' => 'PHP', 'label' => 'PHP', 'version' => PHP_VERSION],
            ['src' => '/stack-logos/blade.svg', 'alt' => 'Blade', 'label' => 'Blade', 'version' => 'Templates'],
            ['src' => '/stack-logos/alpinejs.svg', 'alt' => 'Alpine.js', 'label' => 'Alpine.js', 'version' => 'v3'],
            ['src' => '/stack-logos/sqlite.svg', 'alt' => 'SQLite', 'label' => 'SQLite', 'version' => '3'],
        ];
    }
}
