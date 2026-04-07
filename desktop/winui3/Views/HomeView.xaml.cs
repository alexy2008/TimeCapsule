using HelloTimeWinUI.Models;
using Microsoft.UI.Xaml.Controls;

namespace HelloTimeWinUI.Views;

public sealed partial class HomeView : Page
{
    public HomeView()
    {
        InitializeComponent();
    }

    private void OnGoCreateClicked(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
    {
        if (Microsoft.UI.Xaml.Application.Current is App app)
        {
            app.AppState.NavigateTo(AppPage.Create);
        }

        Frame?.Navigate(typeof(CreateView));
    }

    private void OnGoOpenClicked(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
    {
        if (Microsoft.UI.Xaml.Application.Current is App app)
        {
            app.AppState.NavigateTo(AppPage.Open);
        }

        Frame?.Navigate(typeof(OpenView));
    }
}
