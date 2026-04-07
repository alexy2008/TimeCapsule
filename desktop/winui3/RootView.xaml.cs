using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HelloTimeWinUI.Models;
using HelloTimeWinUI.Services;
using HelloTimeWinUI.Views;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;

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
            var techStack = await _apiClient.GetBackendTechStackAsync();
            _appState.ApplyBackendTechStack(techStack);
        }
        catch (Exception)
        {
            _appState.ApplyBackendTechStack(null);
            _appState.SetStatus("暂未连通 8080 后端，页面骨架仍可继续开发。");
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

        UpdateNavigationState(page);
    }

    private void UpdateNavigationState(AppPage currentPage)
    {
        var activeBrush = new SolidColorBrush(Microsoft.UI.ColorHelper.FromArgb(0x44, 0x56, 0xCC, 0xF2));
        var inactiveBrush = new SolidColorBrush(Microsoft.UI.ColorHelper.FromArgb(0x22, 0x1B, 0x33, 0x54));

        var navButtons = new Dictionary<AppPage, Button>
        {
            [AppPage.Home] = HomeNavButton,
            [AppPage.Create] = CreateNavButton,
            [AppPage.Open] = OpenNavButton,
            [AppPage.About] = AboutNavButton,
            [AppPage.Admin] = AdminNavButton,
        };

        foreach (var pair in navButtons)
        {
            pair.Value.Background = pair.Key == currentPage ? activeBrush : inactiveBrush;
        }
    }
}
