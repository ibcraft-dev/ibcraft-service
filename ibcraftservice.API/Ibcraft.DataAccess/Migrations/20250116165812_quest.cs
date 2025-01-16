using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ibcraft.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class quest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QuestionnairePlayerEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserID = table.Column<Guid>(type: "uuid", nullable: false),
                    Age = table.Column<int>(type: "integer", nullable: false),
                    AcceptRule = table.Column<bool>(type: "boolean", nullable: false),
                    PlayingServer = table.Column<bool>(type: "boolean", nullable: false),
                    LicenseMinecraft = table.Column<bool>(type: "boolean", nullable: false),
                    BuildingLevel = table.Column<int>(type: "integer", nullable: false),
                    AdequacyLevel = table.Column<int>(type: "integer", nullable: false),
                    Discription = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionnairePlayerEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionnairePlayerEntity_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionnairePlayerEntity_UserID",
                table: "QuestionnairePlayerEntity",
                column: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuestionnairePlayerEntity");
        }
    }
}
