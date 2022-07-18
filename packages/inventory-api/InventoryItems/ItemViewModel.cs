namespace Darragh.DaprInventory.Services.Inventory.API.InventoryItems;

public record ItemViewModel(
    int Id,
    string LocationId,
    string ProductId,
    int AvailableStock);
