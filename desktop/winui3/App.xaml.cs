using Microsoft.UI.Xaml;
using HelloTimeWinUI.Services;

namespace HelloTimeWinUI;

public partial class App : Application
{
    private Window? _window;

    public AppState AppState { get; } = new();

    public ApiClient ApiClient { get; } = new();

    public App()
    {
        InitializeComponent();
    }

    protected override void OnLaunched(Microsoft.UI.Xaml.LaunchActivatedEventArgs args)
    {
        _window = new MainWindow();
        _window.Activate();
    }
}
