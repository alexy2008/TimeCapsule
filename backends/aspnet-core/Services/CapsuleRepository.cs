using HelloTime.AspNetCore.Configuration;
using HelloTime.AspNetCore.Models;
using Microsoft.Data.Sqlite;

namespace HelloTime.AspNetCore.Services;

public sealed class CapsuleRepository
{
    private readonly string _connectionString;

    public CapsuleRepository(AppOptions options, IWebHostEnvironment environment)
    {
        var databasePath = Path.GetFullPath(options.DatabasePath, environment.ContentRootPath);
        var databaseDirectory = Path.GetDirectoryName(databasePath);
        if (!string.IsNullOrEmpty(databaseDirectory))
        {
            Directory.CreateDirectory(databaseDirectory);
        }

        _connectionString = new SqliteConnectionStringBuilder
        {
            DataSource = databasePath
        }.ToString();

        Initialize();
    }

    public async Task<CapsuleEntity?> FindByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        await using var connection = await OpenConnectionAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, code, title, content, creator, open_at, created_at
            FROM capsules
            WHERE code = $code
            """;
        command.Parameters.AddWithValue("$code", code);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        return await reader.ReadAsync(cancellationToken) ? Map(reader) : null;
    }

    public async Task<bool> CodeExistsAsync(string code, CancellationToken cancellationToken = default)
    {
        await using var connection = await OpenConnectionAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM capsules WHERE code = $code";
        command.Parameters.AddWithValue("$code", code);
        var result = (long)(await command.ExecuteScalarAsync(cancellationToken) ?? 0L);
        return result > 0;
    }

    public async Task CreateAsync(CapsuleEntity capsule, CancellationToken cancellationToken = default)
    {
        await using var connection = await OpenConnectionAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO capsules (code, title, content, creator, open_at, created_at)
            VALUES ($code, $title, $content, $creator, $openAt, $createdAt)
            """;
        command.Parameters.AddWithValue("$code", capsule.Code);
        command.Parameters.AddWithValue("$title", capsule.Title);
        command.Parameters.AddWithValue("$content", capsule.Content);
        command.Parameters.AddWithValue("$creator", capsule.Creator);
        command.Parameters.AddWithValue("$openAt", capsule.OpenAt);
        command.Parameters.AddWithValue("$createdAt", capsule.CreatedAt);
        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task<(IReadOnlyList<CapsuleEntity> Content, int Total)> ListAsync(
        int page,
        int size,
        CancellationToken cancellationToken = default)
    {
        await using var connection = await OpenConnectionAsync(cancellationToken);

        await using var countCommand = connection.CreateCommand();
        countCommand.CommandText = "SELECT COUNT(*) FROM capsules";
        var total = Convert.ToInt32(await countCommand.ExecuteScalarAsync(cancellationToken) ?? 0);

        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, code, title, content, creator, open_at, created_at
            FROM capsules
            ORDER BY created_at DESC
            LIMIT $size OFFSET $offset
            """;
        command.Parameters.AddWithValue("$size", size);
        command.Parameters.AddWithValue("$offset", page * size);

        var content = new List<CapsuleEntity>();
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            content.Add(Map(reader));
        }

        return (content, total);
    }

    public async Task<bool> DeleteAsync(string code, CancellationToken cancellationToken = default)
    {
        await using var connection = await OpenConnectionAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM capsules WHERE code = $code";
        command.Parameters.AddWithValue("$code", code);
        var changes = await command.ExecuteNonQueryAsync(cancellationToken);
        return changes > 0;
    }

    private async Task<SqliteConnection> OpenConnectionAsync(CancellationToken cancellationToken)
    {
        var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);
        return connection;
    }

    private void Initialize()
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();

        using var pragma = connection.CreateCommand();
        pragma.CommandText = "PRAGMA journal_mode = WAL;";
        pragma.ExecuteNonQuery();

        using var createTable = connection.CreateCommand();
        createTable.CommandText = """
            CREATE TABLE IF NOT EXISTS capsules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code VARCHAR(8) NOT NULL UNIQUE,
                title VARCHAR(100) NOT NULL,
                content TEXT NOT NULL,
                creator VARCHAR(30) NOT NULL,
                open_at TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_capsules_code ON capsules(code);
            CREATE INDEX IF NOT EXISTS idx_capsules_created_at ON capsules(created_at);
            """;
        createTable.ExecuteNonQuery();
    }

    private static CapsuleEntity Map(SqliteDataReader reader)
        => new()
        {
            Id = reader.GetInt64(0),
            Code = reader.GetString(1),
            Title = reader.GetString(2),
            Content = reader.GetString(3),
            Creator = reader.GetString(4),
            OpenAt = reader.GetString(5),
            CreatedAt = reader.GetString(6)
        };
}
