using System;
using HelloTimeWinUI.Models;
using HelloTimeWinUI.Services;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media.Animation;

namespace HelloTimeWinUI.Views;

public sealed partial class AboutView : Page
{
    private int _orbClickCount;
    private readonly AppState _appState;

    public AboutView()
    {
        InitializeComponent();
        _appState = ((App)Application.Current).AppState;
        Loaded += OnLoaded;
    }

    private void OnLoaded(object sender, RoutedEventArgs e)
    {
        var animation = new DoubleAnimation
        {
            From = 0,
            To = 360,
            Duration = new Duration(TimeSpan.FromSeconds(14)),
            RepeatBehavior = RepeatBehavior.Forever,
        };

        var storyboard = new Storyboard();
        storyboard.Children.Add(animation);
        Storyboard.SetTarget(animation, OrbRotateTransform);
        Storyboard.SetTargetProperty(animation, "Angle");
        storyboard.Begin();
        UpdateTechStackDisplay();
    }

    private void OnOrbClicked(object sender, RoutedEventArgs e)
    {
        _orbClickCount++;

        HiddenHintText.Text = _orbClickCount >= 5
            ? "隐藏入口已触发，正在前往管理员界面。"
            : $"再点击 {5 - _orbClickCount} 次进入管理员界面。";

        if (_orbClickCount < 5)
        {
            return;
        }

        if (Application.Current is not App app)
        {
            return;
        }

        app.AppState.NavigateTo(AppPage.Admin);
        Frame?.Navigate(typeof(AdminView));
    }

    private void UpdateTechStackDisplay()
    {
        var items = _appState.TechStackItems;
        if (items.Count < 5)
        {
            return;
        }

        BackendFrameworkText.Text = items[2].Name;
        BackendFrameworkSubText.Text = "服务框架";
        BackendLanguageText.Text = items[3].Name;
        BackendLanguageSubText.Text = "服务语言";
        DatabaseText.Text = items[4].Name;
        DatabaseSubText.Text = "数据存储";
    }
}
