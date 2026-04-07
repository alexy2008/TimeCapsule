using System;
using System.Globalization;
using System.Threading.Tasks;
using HelloTimeWinUI.Models;
using HelloTimeWinUI.Services;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Data;

namespace HelloTimeWinUI.Views;

public sealed partial class AdminView : Page
{
    private readonly AppState _appState;
    private readonly ApiClient _apiClient;

    public AdminView()
    {
        InitializeComponent();
        var app = (App)Application.Current;
        _appState = app.AppState;
        _apiClient = app.ApiClient;
        CapsuleListView.ItemsSource = _appState.AdminCapsules;
        UpdateViewState();
    }

    private async void OnLoginClicked(object sender, RoutedEventArgs e)
    {
        LoginErrorText.Visibility = Visibility.Collapsed;
        LoginProgress.IsActive = true;
        LoginButton.IsEnabled = false;

        try
        {
            if (string.IsNullOrWhiteSpace(PasswordInput.Password))
            {
                throw new ApiException("请输入管理员密码。");
            }

            var token = await _apiClient.AdminLoginAsync(PasswordInput.Password);
            _appState.SetAdminToken(token.Token);
            PasswordInput.Password = string.Empty;
            await LoadAdminCapsulesAsync();
            UpdateViewState();
        }
        catch (Exception ex)
        {
            LoginErrorText.Text = ex.Message;
            LoginErrorText.Visibility = Visibility.Visible;
        }
        finally
        {
            LoginProgress.IsActive = false;
            LoginButton.IsEnabled = true;
        }
    }

    private async void OnRefreshClicked(object sender, RoutedEventArgs e)
    {
        await LoadAdminCapsulesAsync(_appState.AdminCurrentPage);
    }

    private void OnLogoutClicked(object sender, RoutedEventArgs e)
    {
        _appState.SetAdminToken(null);
        _appState.SetAdminCapsules([], 0, 1);
        AdminErrorText.Visibility = Visibility.Collapsed;
        UpdateViewState();
    }

    private async void OnPrevPageClicked(object sender, RoutedEventArgs e)
    {
        await LoadAdminCapsulesAsync(Math.Max(0, _appState.AdminCurrentPage - 1));
    }

    private async void OnNextPageClicked(object sender, RoutedEventArgs e)
    {
        await LoadAdminCapsulesAsync(Math.Min(_appState.AdminTotalPages - 1, _appState.AdminCurrentPage + 1));
    }

    private async void OnDeleteClicked(object sender, RoutedEventArgs e)
    {
        if (sender is not Button button || button.Tag is not string code || string.IsNullOrWhiteSpace(_appState.AdminToken))
        {
            return;
        }

        AdminErrorText.Visibility = Visibility.Collapsed;

        try
        {
            var shouldDelete = await ShowConfirmDialogAsync("确认删除", $"确定要删除胶囊 {code} 吗？此操作不可恢复。");
            if (!shouldDelete)
            {
                return;
            }

            await _apiClient.DeleteAdminCapsuleAsync(_appState.AdminToken!, code);
            _appState.RemoveAdminCapsule(code);
            _appState.SetStatus($"已删除胶囊：{code}");
            UpdatePagingButtons();
            UpdateEmptyState();
        }
        catch (Exception ex)
        {
            AdminErrorText.Text = ex.Message;
            AdminErrorText.Visibility = Visibility.Visible;
        }
    }

    private async Task LoadAdminCapsulesAsync(int page = 0)
    {
        AdminErrorText.Visibility = Visibility.Collapsed;

        try
        {
            if (string.IsNullOrWhiteSpace(_appState.AdminToken))
            {
                throw new ApiException("当前没有管理员登录状态。");
            }

            var result = await _apiClient.GetAdminCapsulesAsync(_appState.AdminToken!, page);
            _appState.SetAdminCapsules(result.Content, result.Number, Math.Max(1, result.TotalPages));
            PageText.Text = $"{_appState.AdminCurrentPage + 1} / {_appState.AdminTotalPages}";
            UpdatePagingButtons();
            UpdateEmptyState();
        }
        catch (Exception ex)
        {
            AdminErrorText.Text = ex.Message;
            AdminErrorText.Visibility = Visibility.Visible;
        }
    }

    private void UpdateViewState()
    {
        LoginPanel.Visibility = _appState.IsAdminLoggedIn ? Visibility.Collapsed : Visibility.Visible;
        DashboardPanel.Visibility = _appState.IsAdminLoggedIn ? Visibility.Visible : Visibility.Collapsed;
        PageText.Text = $"{_appState.AdminCurrentPage + 1} / {_appState.AdminTotalPages}";
        UpdatePagingButtons();
        UpdateEmptyState();
    }

    private void UpdatePagingButtons()
    {
        PrevPageButton.IsEnabled = _appState.AdminCurrentPage > 0;
        NextPageButton.IsEnabled = _appState.AdminCurrentPage < _appState.AdminTotalPages - 1;
    }

    private void UpdateEmptyState()
    {
        EmptyStateText.Visibility = _appState.AdminCapsules.Count == 0 && _appState.IsAdminLoggedIn
            ? Visibility.Visible
            : Visibility.Collapsed;
    }

    private async Task<bool> ShowConfirmDialogAsync(string title, string content)
    {
        var dialog = new ContentDialog
        {
            Title = title,
            Content = content,
            PrimaryButtonText = "确认",
            CloseButtonText = "取消",
            DefaultButton = ContentDialogButton.Primary,
            XamlRoot = XamlRoot,
        };

        return await dialog.ShowAsync() == ContentDialogResult.Primary;
    }
}

public sealed class DateTimeOffsetConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        return value is DateTimeOffset date
            ? date.LocalDateTime.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture)
            : string.Empty;
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language) => throw new NotSupportedException();
}

public sealed class CapsuleStateConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        return value is bool unlocked && unlocked ? "已解锁" : "锁定";
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language) => throw new NotSupportedException();
}
