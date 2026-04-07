using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using HelloTimeWinUI.Models;
using Microsoft.UI.Xaml;

namespace HelloTimeWinUI.Services;

/// <summary>
/// 统一维护桌面端的页面、主题和技术栈展示状态。
/// </summary>
public sealed class AppState : INotifyPropertyChanged
{
    private static readonly string ThemePreferencePath = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "HelloTime",
        "winui3-theme.txt");

    private AppPage _currentPage = AppPage.Home;
    private ElementTheme _requestedTheme;
    private string _statusMessage = "等待连接本地后端...";
    private Capsule? _latestCreatedCapsule;
    private Capsule? _fetchedCapsule;
    private string? _adminToken;
    private int _adminCurrentPage;
    private int _adminTotalPages = 1;

    public event PropertyChangedEventHandler? PropertyChanged;

    public ObservableCollection<TechStackItem> TechStackItems { get; } =
    [
        new() { Name = "WinUI 3", Category = "Desktop Framework" },
        new() { Name = "C#", Category = "Desktop Language" },
        new() { Name = "Backend", Category = "Backend Framework" },
        new() { Name = "Language", Category = "Backend Language" },
        new() { Name = "SQLite", Category = "Database" },
    ];

    public ObservableCollection<Capsule> AdminCapsules { get; } = [];

    public AppState()
    {
        _requestedTheme = LoadThemePreference();
    }

    public AppPage CurrentPage
    {
        get => _currentPage;
        private set => SetProperty(ref _currentPage, value);
    }

    public ElementTheme RequestedTheme
    {
        get => _requestedTheme;
        private set => SetProperty(ref _requestedTheme, value);
    }

    public string StatusMessage
    {
        get => _statusMessage;
        private set => SetProperty(ref _statusMessage, value);
    }

    public Capsule? LatestCreatedCapsule
    {
        get => _latestCreatedCapsule;
        private set => SetProperty(ref _latestCreatedCapsule, value);
    }

    public Capsule? FetchedCapsule
    {
        get => _fetchedCapsule;
        private set => SetProperty(ref _fetchedCapsule, value);
    }

    public string? AdminToken
    {
        get => _adminToken;
        private set => SetProperty(ref _adminToken, value);
    }

    public bool IsAdminLoggedIn => !string.IsNullOrWhiteSpace(AdminToken);

    public int AdminCurrentPage
    {
        get => _adminCurrentPage;
        private set => SetProperty(ref _adminCurrentPage, value);
    }

    public int AdminTotalPages
    {
        get => _adminTotalPages;
        private set => SetProperty(ref _adminTotalPages, value);
    }

    public void NavigateTo(AppPage page)
    {
        CurrentPage = page;
    }

    public void ToggleTheme()
    {
        RequestedTheme = RequestedTheme == ElementTheme.Dark ? ElementTheme.Light : ElementTheme.Dark;
        SaveThemePreference(RequestedTheme);
        StatusMessage = RequestedTheme == ElementTheme.Dark ? "已切换到暗色主题" : "已切换到明亮主题";
    }

    public void ApplyBackendTechStack(BackendTechStack? techStack)
    {
        TechStackItems[2] = new TechStackItem { Name = techStack?.Framework ?? "Backend", Category = "Backend Framework" };
        TechStackItems[3] = new TechStackItem { Name = techStack?.Language ?? "Language", Category = "Backend Language" };
        TechStackItems[4] = new TechStackItem { Name = techStack?.Database ?? "SQLite", Category = "Database" };

        OnPropertyChanged(nameof(TechStackItems));
        StatusMessage = techStack is null ? "未连接到后端，先使用占位技术栈。" : "已同步后端技术栈展示。";
    }

    public void SetStatus(string message)
    {
        StatusMessage = message;
    }

    public void SetLatestCreatedCapsule(Capsule? capsule)
    {
        LatestCreatedCapsule = capsule;
    }

    public void SetFetchedCapsule(Capsule? capsule)
    {
        FetchedCapsule = capsule;
    }

    public void SetAdminToken(string? token)
    {
        AdminToken = token;
        OnPropertyChanged(nameof(IsAdminLoggedIn));
    }

    public void SetAdminCapsules(IEnumerable<Capsule> capsules, int currentPage, int totalPages)
    {
        AdminCapsules.Clear();
        foreach (var capsule in capsules)
        {
            AdminCapsules.Add(capsule);
        }

        AdminCurrentPage = currentPage;
        AdminTotalPages = totalPages;
    }

    public void RemoveAdminCapsule(string code)
    {
        var target = AdminCapsules.FirstOrDefault(item => item.Code == code);
        if (target is not null)
        {
            AdminCapsules.Remove(target);
        }
    }

    private void SetProperty<T>(ref T field, T value, [CallerMemberName] string? propertyName = null)
    {
        if (Equals(field, value))
        {
            return;
        }

        field = value;
        OnPropertyChanged(propertyName);
    }

    private void OnPropertyChanged([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    private static ElementTheme LoadThemePreference()
    {
        try
        {
            if (!File.Exists(ThemePreferencePath))
            {
                return ElementTheme.Dark;
            }

            var storedValue = File.ReadAllText(ThemePreferencePath).Trim();
            return Enum.TryParse<ElementTheme>(storedValue, ignoreCase: true, out var theme)
                ? theme
                : ElementTheme.Dark;
        }
        catch
        {
            return ElementTheme.Dark;
        }
    }

    private static void SaveThemePreference(ElementTheme theme)
    {
        try
        {
            Directory.CreateDirectory(Path.GetDirectoryName(ThemePreferencePath)!);
            File.WriteAllText(ThemePreferencePath, theme.ToString());
        }
        catch
        {
            // Ignore local preference persistence errors in development mode.
        }
    }
}
