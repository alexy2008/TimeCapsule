using System;
using System.Threading.Tasks;
using HelloTimeWinUI.Models;
using HelloTimeWinUI.Services;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Windows.ApplicationModel.DataTransfer;

namespace HelloTimeWinUI.Views;

public sealed partial class CreateView : Page
{
    private readonly AppState _appState;
    private readonly ApiClient _apiClient;

    public CreateView()
    {
        InitializeComponent();
        var app = (App)Application.Current;
        _appState = app.AppState;
        _apiClient = app.ApiClient;
        OpenDateInput.Date = DateTimeOffset.Now.AddDays(30);
    }

    private async void OnCreateClicked(object sender, RoutedEventArgs e)
    {
        ErrorText.Visibility = Visibility.Collapsed;
        CreateProgress.IsActive = true;
        CreateButton.IsEnabled = false;

        try
        {
            if (string.IsNullOrWhiteSpace(TitleInput.Text) || string.IsNullOrWhiteSpace(ContentInput.Text))
            {
                throw new ApiException("标题和内容不能为空。");
            }

            if (OpenDateInput.Date.Date < DateTimeOffset.Now.Date)
            {
                throw new ApiException("开启日期不能早于今天。");
            }

            var shouldCreate = await ShowConfirmDialogAsync(
                "确认创建",
                $"确定要创建标题为“{TitleInput.Text.Trim()}”的时间胶囊吗？创建后将无法修改内容和开启时间。");

            if (!shouldCreate)
            {
                return;
            }

            var created = await _apiClient.CreateCapsuleAsync(new CreateCapsuleRequest
            {
                Title = TitleInput.Text.Trim(),
                Content = ContentInput.Text.Trim(),
                Creator = string.IsNullOrWhiteSpace(CreatorInput.Text) ? "匿名访客" : CreatorInput.Text.Trim(),
                OpenAt = OpenDateInput.Date,
            });

            _appState.SetLatestCreatedCapsule(created);
            CreatedCodeText.Text = created.Code;
            CopyHintText.Visibility = Visibility.Collapsed;
            FormPanel.Visibility = Visibility.Collapsed;
            SuccessPanel.Visibility = Visibility.Visible;
            _appState.SetStatus($"已创建新胶囊：{created.Code}");
        }
        catch (Exception ex)
        {
            ErrorText.Text = ex.Message;
            ErrorText.Visibility = Visibility.Visible;
        }
        finally
        {
            CreateProgress.IsActive = false;
            CreateButton.IsEnabled = true;
        }
    }

    private void OnCreateAnotherClicked(object sender, RoutedEventArgs e)
    {
        TitleInput.Text = string.Empty;
        ContentInput.Text = string.Empty;
        CreatorInput.Text = string.Empty;
        OpenDateInput.Date = DateTimeOffset.Now.AddDays(30);
        CopyHintText.Visibility = Visibility.Collapsed;
        SuccessPanel.Visibility = Visibility.Collapsed;
        FormPanel.Visibility = Visibility.Visible;
    }

    private void OnGoOpenClicked(object sender, RoutedEventArgs e)
    {
        _appState.NavigateTo(AppPage.Open);
        Frame?.Navigate(typeof(OpenView));
    }

    private void OnCopyCodeClicked(object sender, RoutedEventArgs e)
    {
        if (string.IsNullOrWhiteSpace(CreatedCodeText.Text))
        {
            return;
        }

        var dataPackage = new DataPackage();
        dataPackage.SetText(CreatedCodeText.Text);
        Clipboard.SetContent(dataPackage);
        CopyHintText.Text = "已复制到剪贴板";
        CopyHintText.Visibility = Visibility.Visible;
        _appState.SetStatus($"已复制胶囊码：{CreatedCodeText.Text}");
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
