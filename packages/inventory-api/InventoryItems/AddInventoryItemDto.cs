using System.ComponentModel.DataAnnotations;

namespace Darragh.DaprInventory.Services.Inventory.API.InventoryItems;

public class AddInventoryItemDto
{
    [Required]
    [StringLength(100)]
    public string ProductId { get; set; }
    [Required]
    [StringLength(100)]
    public string LocationId { get; set; }

    [Required]
    public int AvailableStock { get; set; }

    public AddInventoryItemDto(

        string productId, string locationId, int availableStock)
    {

        ProductId = productId;
        LocationId = locationId;
        AvailableStock = availableStock;
    }

}
