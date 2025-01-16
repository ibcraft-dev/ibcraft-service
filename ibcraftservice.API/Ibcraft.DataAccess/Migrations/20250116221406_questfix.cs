using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ibcraft.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class questfix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionnairePlayerEntity_Users_UserID",
                table: "QuestionnairePlayerEntity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_QuestionnairePlayerEntity",
                table: "QuestionnairePlayerEntity");

            migrationBuilder.RenameTable(
                name: "QuestionnairePlayerEntity",
                newName: "Questions");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Questions",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_QuestionnairePlayerEntity_UserID",
                table: "Questions",
                newName: "IX_Questions_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Questions",
                table: "Questions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Users_UserId",
                table: "Questions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Users_UserId",
                table: "Questions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Questions",
                table: "Questions");

            migrationBuilder.RenameTable(
                name: "Questions",
                newName: "QuestionnairePlayerEntity");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "QuestionnairePlayerEntity",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Questions_UserId",
                table: "QuestionnairePlayerEntity",
                newName: "IX_QuestionnairePlayerEntity_UserID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuestionnairePlayerEntity",
                table: "QuestionnairePlayerEntity",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionnairePlayerEntity_Users_UserID",
                table: "QuestionnairePlayerEntity",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
