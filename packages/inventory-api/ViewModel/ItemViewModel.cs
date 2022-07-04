namespace Darragh.DaprInventory.Services.Inventory.API.ViewModel;

public record ItemViewModel(
    int Id,
    string LocationId,
    string ProductId,
    int AvailableStock);
