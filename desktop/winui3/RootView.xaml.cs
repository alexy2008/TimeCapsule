using System;
using System.Threading.Tasks;
using HelloTimeWinUI.Models;
using HelloTimeWinUI.Services;
using HelloTimeWinUI.Views;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace HelloTimeWinUI;

/// <summary>
/// 根视图负责顶部导航、主题切换和页面装载。
/// </summary>
public sealed partial class RootView : UserControl
{
    private readonly AppState _appState;
    private readonly ApiClient _apiClient;

    public RootView()
    {
        InitializeComponent();

        var app = (App)Application.Current;
        _appState = app.AppState;
        _apiClient = app.ApiClient;
        DataContext = _appState;
        RequestedTheme = _appState.RequestedTheme;
        Loaded += OnLoaded;
    }

    private async void OnLoaded(object sender, RoutedEventArgs e)
    {
        NavigateTo(AppPage.Home);
        await RefreshHealthAsync();
    }

    private async Task RefreshHealthAsync()
    {
        try
        {
            var (techStack, error) = await _apiClient.GetBackendTechStackWithDetailsAsync();
            if (!string.IsNullOrEmpty(error))
            {
                System.Diagnostics.Debug.WriteLine($"[HealthError] {error}");
                _appState.ApplyBackendTechStack(null);
                _appState.SetStatus($"连接后端失败: {error} | WinUI 3 · C#");
                return;
            }

            _appState.ApplyBackendTechStack(techStack);
            _appState.SetStatus("HelloTime · 时间胶囊 · WinUI 3 · C# · " +
                (techStack?.Framework ?? "Backend") + " · " +
                (techStack?.Language ?? "Language") + " · SQLite");
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"[RefreshCrash] {ex}");
            _appState.ApplyBackendTechStack(null);
            _appState.SetStatus($"刷新异常: {ex.Message}");
        }
    }

    private void OnNavigateHome(object sender, RoutedEventArgs e) => NavigateTo(AppPage.Home);

    private void OnNavigateCreate(object sender, RoutedEventArgs e) => NavigateTo(AppPage.Create);

    private void OnNavigateOpen(object sender, RoutedEventArgs e) => NavigateTo(AppPage.Open);

    private void OnNavigateAbout(object sender, RoutedEventArgs e) => NavigateTo(AppPage.About);

    private void OnNavigateAdmin(object sender, RoutedEventArgs e) => NavigateTo(AppPage.Admin);

    private void OnToggleTheme(object sender, RoutedEventArgs e)
    {
        _appState.ToggleTheme();
        RequestedTheme = _appState.RequestedTheme;
    }

    public void NavigateTo(AppPage page)
    {
        _appState.NavigateTo(page);

        var pageType = page switch
        {
            AppPage.Home => typeof(HomeView),
            AppPage.Create => typeof(CreateView),
            AppPage.Open => typeof(OpenView),
            AppPage.About => typeof(AboutView),
            AppPage.Admin => typeof(AdminView),
            _ => typeof(HomeView),
        };

        if (ContentFrame.CurrentSourcePageType != pageType)
        {
            ContentFrame.Navigate(pageType);
        }
    }
}
