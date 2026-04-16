using System.Text.RegularExpressions;
using Dapper;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var connectionString = builder.Configuration["SUPABASE_DB_CONNECTION"];

if (string.IsNullOrWhiteSpace(connectionString))
{
    connectionString = builder.Configuration.GetConnectionString("Supabase");
}

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Connection string is missing. Set ConnectionStrings:Supabase or SUPABASE_DB_CONNECTION.");
}

builder.Services.AddSingleton(new NpgsqlDataSourceBuilder(connectionString).Build());

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapPost("/api/auth/register", async (RegisterRequest request, NpgsqlDataSource dataSource, CancellationToken ct) =>
{
    var validationErrors = RequestValidator.ValidateRegister(request);
    if (validationErrors.Count > 0)
    {
        return Results.ValidationProblem(validationErrors);
    }

    var nickname = request.Nickname.Trim();
    var email = string.IsNullOrWhiteSpace(request.Email)
        ? null
        : request.Email.Trim().ToLowerInvariant();
    var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

    const string sql = """
        insert into public.shapix_player_accounts (nickname, email, password_hash)
        values (@Nickname, @Email, @PasswordHash)
        returning id, nickname, email, created_at as CreatedAt, updated_at as UpdatedAt;
        """;

    try
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);

        var created = await connection.QuerySingleAsync<AccountResponse>(
            new CommandDefinition(
                sql,
                new
                {
                    Nickname = nickname,
                    Email = email,
                    PasswordHash = passwordHash
                },
                cancellationToken: ct));

        return Results.Created($"/api/users/{created.Id}", created);
    }
    catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.UniqueViolation)
    {
        return ex.ConstraintName switch
        {
            "shapix_player_accounts_nickname_key" => Results.Conflict(new ErrorResponse("Nickname already exists.")),
            "shapix_player_accounts_email_key" => Results.Conflict(new ErrorResponse("Email already exists.")),
            _ => Results.Conflict(new ErrorResponse("Account already exists."))
        };
    }
    catch (PostgresException ex)
    {
        return Results.Problem(
            title: "Database error",
            detail: ex.SqlState + ": " + ex.MessageText,
            statusCode: StatusCodes.Status500InternalServerError);
    }
    catch (NpgsqlException ex)
    {
        return Results.Problem(
            title: "Database connection error",
            detail: ex.Message,
            statusCode: StatusCodes.Status500InternalServerError);
    }
    catch (Exception ex)
    {
        return Results.Problem(
            title: "Unexpected server error",
            detail: ex.Message,
            statusCode: StatusCodes.Status500InternalServerError);
    }
});

app.MapPost("/api/auth/login", async (LoginRequest request, NpgsqlDataSource dataSource, CancellationToken ct) =>
{
    var validationErrors = RequestValidator.ValidateLogin(request);
    if (validationErrors.Count > 0)
    {
        return Results.ValidationProblem(validationErrors);
    }

    const string sql = """
        select id, nickname, email, password_hash as PasswordHash, created_at as CreatedAt, updated_at as UpdatedAt
        from public.shapix_player_accounts
        where nickname = @Nickname
        limit 1;
        """;

    await using var connection = await dataSource.OpenConnectionAsync(ct);

    var account = await connection.QuerySingleOrDefaultAsync<AccountWithPassword>(
        new CommandDefinition(
            sql,
            new { Nickname = request.Nickname.Trim() },
            cancellationToken: ct));

    if (account is null || !BCrypt.Net.BCrypt.Verify(request.Password, account.PasswordHash))
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new AccountResponse(
        account.Id,
        account.Nickname,
        account.Email,
        account.CreatedAt,
        account.UpdatedAt));
});

app.MapGet("/api/users/{id:guid}", async (Guid id, NpgsqlDataSource dataSource, CancellationToken ct) =>
{
    const string sql = """
        select id, nickname, email, created_at as CreatedAt, updated_at as UpdatedAt
        from public.shapix_player_accounts
        where id = @Id;
        """;

    await using var connection = await dataSource.OpenConnectionAsync(ct);

    var account = await connection.QuerySingleOrDefaultAsync<AccountResponse>(
        new CommandDefinition(sql, new { Id = id }, cancellationToken: ct));

    return account is null ? Results.NotFound() : Results.Ok(account);
});

app.MapGet("/api/users", async (int? limit, int? offset, NpgsqlDataSource dataSource, CancellationToken ct) =>
{
    var safeLimit = Math.Clamp(limit ?? 20, 1, 100);
    var safeOffset = Math.Max(offset ?? 0, 0);

    const string sql = """
        select id, nickname, email, created_at as CreatedAt, updated_at as UpdatedAt
        from public.shapix_player_accounts
        order by created_at desc
        limit @Limit offset @Offset;
        """;

    await using var connection = await dataSource.OpenConnectionAsync(ct);

    var accounts = await connection.QueryAsync<AccountResponse>(
        new CommandDefinition(
            sql,
            new { Limit = safeLimit, Offset = safeOffset },
            cancellationToken: ct));

    return Results.Ok(accounts);
});

app.Run();

public sealed record RegisterRequest(string Nickname, string? Email, string Password);

public sealed record LoginRequest(string Nickname, string Password);

public sealed record AccountResponse(
    Guid Id,
    string Nickname,
    string? Email,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);

public sealed record AccountWithPassword(
    Guid Id,
    string Nickname,
    string? Email,
    string PasswordHash,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);

public sealed record ErrorResponse(string Message);

public static class RequestValidator
{
    private static readonly Regex EmailRegex = new(
        "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$",
        RegexOptions.IgnoreCase | RegexOptions.CultureInvariant,
        TimeSpan.FromMilliseconds(250));

    public static Dictionary<string, string[]> ValidateRegister(RegisterRequest request)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);

        var nickname = request.Nickname?.Trim() ?? string.Empty;
        var password = request.Password ?? string.Empty;
        var email = request.Email?.Trim();

        if (nickname.Length < 2 || nickname.Length > 50)
        {
            AddError(errors, nameof(request.Nickname), "Nickname must contain from 2 to 50 characters.");
        }

        if (password.Length < 8 || password.Length > 50)
        {
            AddError(errors, nameof(request.Password), "Password must contain from 8 to 50 characters.");
        }

        if (!string.IsNullOrWhiteSpace(email))
        {
            if (email.Length > 50)
            {
                AddError(errors, nameof(request.Email), "Email must be at most 50 characters.");
            }
            else if (!EmailRegex.IsMatch(email))
            {
                AddError(errors, nameof(request.Email), "Email format is invalid.");
            }
        }

        return errors;
    }

    public static Dictionary<string, string[]> ValidateLogin(LoginRequest request)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);

        if (string.IsNullOrWhiteSpace(request.Nickname))
        {
            AddError(errors, nameof(request.Nickname), "Nickname is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            AddError(errors, nameof(request.Password), "Password is required.");
        }

        return errors;
    }

    private static void AddError(IDictionary<string, string[]> errors, string key, string message)
    {
        if (errors.TryGetValue(key, out var existing))
        {
            errors[key] = existing.Concat(new[] { message }).Distinct(StringComparer.Ordinal).ToArray();
            return;
        }

        errors[key] = new[] { message };
    }
}