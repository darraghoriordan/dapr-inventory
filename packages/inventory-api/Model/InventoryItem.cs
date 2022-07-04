namespace Darragh.DaprInventory.Services.Inventory.API.Model;

public class InventoryItem
{
    public int Id { get; private set; }
    public string ProductId { get; private set; }
    public string LocationId { get; private set; }

    public int AvailableStock { get; private set; }

    public InventoryItem(
    int id,
        string productId, string locationId, int availableStock)
    {
        Id = id;
        ProductId = productId;
        LocationId = locationId;
        AvailableStock = availableStock;
    }

    public int AdjustStock(int quantity)
    {
        AvailableStock += quantity;

        return AvailableStock;
    }

}
