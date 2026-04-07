using System;
using System.Threading.Tasks;
using HelloTimeWinUI.Models;
using HelloTimeWinUI.Services;
using Microsoft.UI.Dispatching;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media.Animation;

namespace HelloTimeWinUI.Views;

public sealed partial class OpenView : Page
{
    private readonly AppState _appState;
    private readonly ApiClient _apiClient;
    private readonly DispatcherQueueTimer _countdownTimer;
    private Capsule? _currentCapsule;

    public OpenView()
    {
        InitializeComponent();
        var app = (App)Application.Current;
        _appState = app.AppState;
        _apiClient = app.ApiClient;
        _countdownTimer = DispatcherQueue.GetForCurrentThread().CreateTimer();
        _countdownTimer.Interval = TimeSpan.FromSeconds(1);
        _countdownTimer.Tick += (_, _) => RefreshCountdown();
        Unloaded += (_, _) => _countdownTimer.Stop();
    }

    private async void OnOpenClicked(object sender, RoutedEventArgs e)
    {
        await QueryCapsuleAsync();
    }

    private void RenderCapsule(Capsule capsule)
    {
        CapsuleTitleText.Text = capsule.Title;
        CapsuleMetaText.Text = $"发布者：{capsule.Creator}  ·  创建于：{capsule.CreatedAt.LocalDateTime:yyyy-MM-dd HH:mm}";
        CapsulePanel.Visibility = Visibility.Visible;
        RefreshCapsuleButton.Visibility = Visibility.Collapsed;

        if (capsule.IsUnlocked)
        {
            CapsuleStateText.Text = "状态：已解锁";
            CapsuleBadgeText.Text = "已解锁";
            CapsuleBadge.Background = (Microsoft.UI.Xaml.Media.Brush)Application.Current.Resources["CyberSuccessBrush"];
            CountdownText.Text = $"开启时间：{capsule.OpenAt.LocalDateTime:yyyy-MM-dd HH:mm}";
            CapsuleContentText.Text = string.IsNullOrWhiteSpace(capsule.Content) ? "内容为空。" : capsule.Content;
            UnlockProgressBar.Value = 1;
            _countdownTimer.Stop();
            PlayDecryptAnimation();
            return;
        }

        CapsuleStateText.Text = "状态：尚未到开启时间";
        CapsuleBadgeText.Text = "未到时间";
        CapsuleBadge.Background = new Microsoft.UI.Xaml.Media.SolidColorBrush(Microsoft.UI.ColorHelper.FromArgb(0x33, 0x56, 0xCC, 0xF2));
        CapsuleContentText.Text = "内容已被时间锁定，只有到达开启时间后才会显示。";
        RefreshCountdown();
        _countdownTimer.Start();
    }

    private void RefreshCountdown()
    {
        if (_currentCapsule is null || _currentCapsule.IsUnlocked)
        {
            _countdownTimer.Stop();
            return;
        }

        var remaining = _currentCapsule.OpenAt - DateTimeOffset.UtcNow;
        if (remaining <= TimeSpan.Zero)
        {
            _countdownTimer.Stop();
            CountdownText.Text = "已到开启时间，请重新查询以查看内容。";
            UnlockProgressBar.Value = 1;
            RefreshCapsuleButton.Visibility = Visibility.Visible;
            return;
        }

        CountdownText.Text = $"{remaining.Days:00}:{remaining.Hours:00}:{remaining.Minutes:00}:{remaining.Seconds:00}";
        UnlockProgressBar.Value = GetUnlockProgress(_currentCapsule);
    }

    private async void OnRefreshCapsuleClicked(object sender, RoutedEventArgs e)
    {
        await QueryCapsuleAsync();
    }

    private async Task QueryCapsuleAsync()
    {
        OpenErrorText.Visibility = Visibility.Collapsed;
        OpenProgress.IsActive = true;
        OpenButton.IsEnabled = false;
        RefreshCapsuleButton.IsEnabled = false;
        DecryptOverlay.Visibility = Visibility.Collapsed;
        DecryptOverlay.Opacity = 0;

        try
        {
            if (string.IsNullOrWhiteSpace(CodeInput.Text) || CodeInput.Text.Trim().Length != 8)
            {
                throw new ApiException("请输入 8 位胶囊码。");
            }

            _currentCapsule = await _apiClient.GetCapsuleAsync(CodeInput.Text.Trim().ToUpperInvariant());
            CodeInput.Text = _currentCapsule.Code;
            _appState.SetFetchedCapsule(_currentCapsule);
            RenderCapsule(_currentCapsule);
            _appState.SetStatus($"已查询胶囊：{_currentCapsule.Code}");
        }
        catch (Exception ex)
        {
            OpenErrorText.Text = ex.Message;
            OpenErrorText.Visibility = Visibility.Visible;
            CapsulePanel.Visibility = Visibility.Collapsed;
            _countdownTimer.Stop();
        }
        finally
        {
            OpenProgress.IsActive = false;
            OpenButton.IsEnabled = true;
            RefreshCapsuleButton.IsEnabled = true;
        }
    }

    private static double GetUnlockProgress(Capsule capsule)
    {
        var total = capsule.OpenAt - capsule.CreatedAt;
        if (total <= TimeSpan.Zero)
        {
            return 1;
        }

        var elapsed = DateTimeOffset.UtcNow - capsule.CreatedAt;
        return Math.Clamp(elapsed.TotalSeconds / total.TotalSeconds, 0, 1);
    }

    private void PlayDecryptAnimation()
    {
        DecryptOverlay.Visibility = Visibility.Visible;
        DecryptOverlay.Opacity = 1;

        var fadeAnimation = new DoubleAnimation
        {
            From = 1,
            To = 0,
            Duration = new Duration(TimeSpan.FromSeconds(2.2)),
        };

        var storyboard = new Storyboard();
        storyboard.Children.Add(fadeAnimation);
        Storyboard.SetTarget(fadeAnimation, DecryptOverlay);
        Storyboard.SetTargetProperty(fadeAnimation, "Opacity");
        storyboard.Completed += (_, _) => DecryptOverlay.Visibility = Visibility.Collapsed;
        storyboard.Begin();
    }
}
