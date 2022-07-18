using Darragh.DaprInventory.Services.Inventory.API.InventoryItems;

namespace Darragh.DaprInventory.Services.Inventory.API.Infrastructure.EntityConfigurations;

public class InventoryItemEntityTypeConfiguration : IEntityTypeConfiguration<InventoryItem>
{
    public void Configure(EntityTypeBuilder<InventoryItem> builder)
    {
        builder.ToTable("InventoryItem");

        builder.HasKey(il => il.Id);

        builder.Property(il => il.ProductId)
              .IsRequired()
            .HasMaxLength(100);

        builder.Property(il => il.AvailableStock)
             .IsRequired()
           .HasDefaultValue(0);

        builder.Property(il => il.LocationId)
  .IsRequired()
.HasMaxLength(100);

        builder.HasData(
            new InventoryItem(1, "product1", "warehouse1", 100),
            new InventoryItem(2, "product2", "warehouse1", 100),
             new InventoryItem(3, "product3", "shopify", 100),
              new InventoryItem(4, "product3", "pointofsale1", 100));


    }
}
