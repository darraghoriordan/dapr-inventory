namespace Darragh.DaprInventory.Services.Inventory.API.Infrastructure;

public class InventoryDbContext : DbContext
{
    public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();

    public InventoryDbContext(DbContextOptions<InventoryDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfiguration(new InventoryItemEntityTypeConfiguration());
    }
}
