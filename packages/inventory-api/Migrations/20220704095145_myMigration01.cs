using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Darragh.DaprInventory.Services.Inventory.API.Migrations
{
    public partial class myMigration01 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InventoryItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProductId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LocationId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AvailableStock = table.Column<int>(type: "integer", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryItem", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "InventoryItem",
                columns: new[] { "Id", "AvailableStock", "LocationId", "ProductId" },
                values: new object[,]
                {
                    { 1, 100, "warehouse1", "product1" },
                    { 2, 100, "warehouse1", "product2" },
                    { 3, 100, "shopify", "product3" },
                    { 4, 100, "pointofsale1", "product3" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InventoryItem");
        }
    }
}
