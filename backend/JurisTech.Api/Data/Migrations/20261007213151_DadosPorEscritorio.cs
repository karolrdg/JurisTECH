using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JurisTech.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class DadosPorEscritorio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Processos_NumeroProcesso",
                table: "Processos");

            migrationBuilder.DropIndex(
                name: "IX_Clientes_Cpf",
                table: "Clientes");

            migrationBuilder.DropIndex(
                name: "IX_Atividades_Data",
                table: "Atividades");

            migrationBuilder.AddColumn<Guid>(
                name: "UsuarioId",
                table: "Tarefas",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UsuarioId",
                table: "Processos",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UsuarioId",
                table: "Prazos",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UsuarioId",
                table: "Clientes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UsuarioId",
                table: "Atividades",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            // Registros que já existiam passam a pertencer à conta de demonstração
            // (ou ao primeiro usuário cadastrado, se ela não existir).
            migrationBuilder.Sql(@"
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
");

            migrationBuilder.CreateIndex(
                name: "IX_Tarefas_UsuarioId",
                table: "Tarefas",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Processos_UsuarioId",
                table: "Processos",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Processos_UsuarioId_NumeroProcesso",
                table: "Processos",
                columns: new[] { "UsuarioId", "NumeroProcesso" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Prazos_UsuarioId",
                table: "Prazos",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_UsuarioId",
                table: "Clientes",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_UsuarioId_Cpf",
                table: "Clientes",
                columns: new[] { "UsuarioId", "Cpf" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Atividades_UsuarioId",
                table: "Atividades",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Atividades_UsuarioId_Data",
                table: "Atividades",
                columns: new[] { "UsuarioId", "Data" });

            migrationBuilder.AddForeignKey(
                name: "FK_Atividades_Usuarios_UsuarioId",
                table: "Atividades",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Clientes_Usuarios_UsuarioId",
                table: "Clientes",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Prazos_Usuarios_UsuarioId",
                table: "Prazos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Processos_Usuarios_UsuarioId",
                table: "Processos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tarefas_Usuarios_UsuarioId",
                table: "Tarefas",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Atividades_Usuarios_UsuarioId",
                table: "Atividades");

            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Usuarios_UsuarioId",
                table: "Clientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Prazos_Usuarios_UsuarioId",
                table: "Prazos");

            migrationBuilder.DropForeignKey(
                name: "FK_Processos_Usuarios_UsuarioId",
                table: "Processos");

            migrationBuilder.DropForeignKey(
                name: "FK_Tarefas_Usuarios_UsuarioId",
                table: "Tarefas");

            migrationBuilder.DropIndex(
                name: "IX_Tarefas_UsuarioId",
                table: "Tarefas");

            migrationBuilder.DropIndex(
                name: "IX_Processos_UsuarioId",
                table: "Processos");

            migrationBuilder.DropIndex(
                name: "IX_Processos_UsuarioId_NumeroProcesso",
                table: "Processos");

            migrationBuilder.DropIndex(
                name: "IX_Prazos_UsuarioId",
                table: "Prazos");

            migrationBuilder.DropIndex(
                name: "IX_Clientes_UsuarioId",
                table: "Clientes");

            migrationBuilder.DropIndex(
                name: "IX_Clientes_UsuarioId_Cpf",
                table: "Clientes");

            migrationBuilder.DropIndex(
                name: "IX_Atividades_UsuarioId",
                table: "Atividades");

            migrationBuilder.DropIndex(
                name: "IX_Atividades_UsuarioId_Data",
                table: "Atividades");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Tarefas");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Processos");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Prazos");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Atividades");

            migrationBuilder.CreateIndex(
                name: "IX_Processos_NumeroProcesso",
                table: "Processos",
                column: "NumeroProcesso",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_Cpf",
                table: "Clientes",
                column: "Cpf",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Atividades_Data",
                table: "Atividades",
                column: "Data");
        }
    }
}
