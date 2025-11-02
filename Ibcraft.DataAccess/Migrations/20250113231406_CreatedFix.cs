using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ibcraft.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class CreatedFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Users",
                newName: "Created_at");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Created_at",
                table: "Users",
                newName: "created_at");
        }
    }
}
