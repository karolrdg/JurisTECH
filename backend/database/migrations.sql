IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE TABLE [Atividades] (
        [Id] uniqueidentifier NOT NULL,
        [Descricao] nvarchar(300) NOT NULL,
        [Data] datetime2 NOT NULL,
        CONSTRAINT [PK_Atividades] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE TABLE [Clientes] (
        [Id] uniqueidentifier NOT NULL,
        [NomeCompleto] nvarchar(120) NOT NULL,
        [Cpf] nvarchar(11) NOT NULL,
        [Email] nvarchar(160) NOT NULL,
        [Telefone] nvarchar(20) NOT NULL,
        [DataCadastro] date NOT NULL,
        [Observacoes] nvarchar(1000) NULL,
        [Status] nvarchar(20) NOT NULL,
        CONSTRAINT [PK_Clientes] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE TABLE [Usuarios] (
        [Id] uniqueidentifier NOT NULL,
        [Nome] nvarchar(120) NOT NULL,
        [Email] nvarchar(160) NOT NULL,
        [SenhaHash] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_Usuarios] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE TABLE [Processos] (
        [Id] uniqueidentifier NOT NULL,
        [NumeroProcesso] nvarchar(30) NOT NULL,
        [ClienteId] uniqueidentifier NOT NULL,
        [Titulo] nvarchar(150) NOT NULL,
        [AreaJuridica] nvarchar(30) NOT NULL,
        [Status] nvarchar(30) NOT NULL,
        [DataAbertura] date NOT NULL,
        [DataEncerramento] date NULL,
        [Descricao] nvarchar(2000) NULL,
        [Observacoes] nvarchar(1000) NULL,
        [AtualizadoEm] date NOT NULL,
        CONSTRAINT [PK_Processos] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Processos_Clientes_ClienteId] FOREIGN KEY ([ClienteId]) REFERENCES [Clientes] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE TABLE [Prazos] (
        [Id] uniqueidentifier NOT NULL,
        [ProcessoId] uniqueidentifier NOT NULL,
        [Titulo] nvarchar(150) NOT NULL,
        [Descricao] nvarchar(1000) NULL,
        [DataLimite] date NOT NULL,
        [Prioridade] nvarchar(20) NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        CONSTRAINT [PK_Prazos] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Prazos_Processos_ProcessoId] FOREIGN KEY ([ProcessoId]) REFERENCES [Processos] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE TABLE [Tarefas] (
        [Id] uniqueidentifier NOT NULL,
        [ProcessoId] uniqueidentifier NOT NULL,
        [Titulo] nvarchar(150) NOT NULL,
        [Descricao] nvarchar(1000) NULL,
        [Responsavel] nvarchar(80) NOT NULL,
        [Prazo] date NOT NULL,
        [Prioridade] nvarchar(20) NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        CONSTRAINT [PK_Tarefas] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Tarefas_Processos_ProcessoId] FOREIGN KEY ([ProcessoId]) REFERENCES [Processos] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE INDEX [IX_Atividades_Data] ON [Atividades] ([Data]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Clientes_Cpf] ON [Clientes] ([Cpf]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE INDEX [IX_Prazos_ProcessoId] ON [Prazos] ([ProcessoId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE INDEX [IX_Processos_ClienteId] ON [Processos] ([ClienteId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Processos_NumeroProcesso] ON [Processos] ([NumeroProcesso]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE INDEX [IX_Tarefas_ProcessoId] ON [Tarefas] ([ProcessoId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Usuarios_Email] ON [Usuarios] ([Email]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007184923_Inicial'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261007184923_Inicial', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007193303_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261007193303_InitialCreate', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    DROP INDEX [IX_Processos_NumeroProcesso] ON [Processos];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    DROP INDEX [IX_Clientes_Cpf] ON [Clientes];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    DROP INDEX [IX_Atividades_Data] ON [Atividades];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    ALTER TABLE [Tarefas] ADD [UsuarioId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    ALTER TABLE [Processos] ADD [UsuarioId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    ALTER TABLE [Prazos] ADD [UsuarioId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    ALTER TABLE [Clientes] ADD [UsuarioId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    ALTER TABLE [Atividades] ADD [UsuarioId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN

    DECLARE @dono uniqueidentifier = (SELECT TOP 1 Id FROM Usuarios WHERE Email = 'demo@jurismaistech.com');
    IF @dono IS NULL SET @dono = (SELECT TOP 1 Id FROM Usuarios);
    IF @dono IS NOT NULL
    BEGIN
        UPDATE Clientes   SET UsuarioId = @dono WHERE UsuarioId = '00000000-0000-0000-0000-000000000000';
        UPDATE Processos  SET UsuarioId = @dono WHERE UsuarioId = '00000000-0000-0000-0000-000000000000';
        UPDATE Prazos     SET UsuarioId = @dono WHERE UsuarioId = '00000000-0000-0000-0000-000000000000';
        UPDATE Tarefas    SET UsuarioId = @dono WHERE UsuarioId = '00000000-0000-0000-0000-000000000000';
        UPDATE Atividades SET UsuarioId = @dono WHERE UsuarioId = '00000000-0000-0000-0000-000000000000';
    END
    DELETE FROM Atividades WHERE UsuarioId = '00000000-0000-0000-0000-000000000000';

END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    CREATE INDEX [IX_Tarefas_UsuarioId] ON [Tarefas] ([UsuarioId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    CREATE INDEX [IX_Processos_UsuarioId] ON [Processos] ([UsuarioId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Processos_UsuarioId_NumeroProcesso] ON [Processos] ([UsuarioId], [NumeroProcesso]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    CREATE INDEX [IX_Prazos_UsuarioId] ON [Prazos] ([UsuarioId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    CREATE INDEX [IX_Clientes_UsuarioId] ON [Clientes] ([UsuarioId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Clientes_UsuarioId_Cpf] ON [Clientes] ([UsuarioId], [Cpf]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    CREATE INDEX [IX_Atividades_UsuarioId] ON [Atividades] ([UsuarioId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    CREATE INDEX [IX_Atividades_UsuarioId_Data] ON [Atividades] ([UsuarioId], [Data]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    ALTER TABLE [Atividades] ADD CONSTRAINT [FK_Atividades_Usuarios_UsuarioId] FOREIGN KEY ([UsuarioId]) REFERENCES [Usuarios] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    ALTER TABLE [Clientes] ADD CONSTRAINT [FK_Clientes_Usuarios_UsuarioId] FOREIGN KEY ([UsuarioId]) REFERENCES [Usuarios] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    ALTER TABLE [Prazos] ADD CONSTRAINT [FK_Prazos_Usuarios_UsuarioId] FOREIGN KEY ([UsuarioId]) REFERENCES [Usuarios] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    ALTER TABLE [Processos] ADD CONSTRAINT [FK_Processos_Usuarios_UsuarioId] FOREIGN KEY ([UsuarioId]) REFERENCES [Usuarios] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    ALTER TABLE [Tarefas] ADD CONSTRAINT [FK_Tarefas_Usuarios_UsuarioId] FOREIGN KEY ([UsuarioId]) REFERENCES [Usuarios] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261007213151_DadosPorEscritorio'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261007213151_DadosPorEscritorio', N'8.0.8');
END;
GO

COMMIT;
GO

