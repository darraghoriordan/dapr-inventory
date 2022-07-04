namespace Darragh.DaprInventory.Services.Inventory.API.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class InventoryItemController : ControllerBase
{
    private readonly InventoryDbContext _context;

    public InventoryItemController(InventoryDbContext context)
    {
        _context = context;
        _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }

    [HttpGet("items/by_productId")]
    [ProducesResponseType(typeof(List<InventoryItem>), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<List<InventoryItem>>> ItemsByProductIdAsync([FromQuery] string productId)
    {
        if (!string.IsNullOrEmpty(productId))
        {
            var items = await _context.InventoryItems
                .Where(ci => ci.ProductId.Equals(productId))
                .Select(item => new ItemViewModel(
                    item.Id,
                    item.ProductId,
                    item.LocationId,
                    item.AvailableStock))
                .ToListAsync();

            return Ok(items);

        }

        return BadRequest("Id value is invalid.");
    }


    [HttpGet("items/by_locationId")]
    [ProducesResponseType(typeof(List<InventoryItem>), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<List<InventoryItem>>> ItemsByLocationIdAsync([FromQuery] string locationId)
    {
        if (!string.IsNullOrEmpty(locationId))
        {
            var items = await _context.InventoryItems
                .Where(ci => ci.LocationId.Equals(locationId))
                .Select(item => new ItemViewModel(
                    item.Id,
                    item.ProductId,
                    item.LocationId,
                    item.AvailableStock))
                .ToListAsync();

            return Ok(items);

        }

        return BadRequest("Id value is invalid.");
    }

}
