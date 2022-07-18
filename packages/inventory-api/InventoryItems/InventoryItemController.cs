

using Darragh.DaprInventory.Services.Inventory.API.InventoryItems;

[Route("api/v1/[controller]")]
[ApiController]
public class InventoryItemController : ControllerBase
{
    private readonly InventoryDbContext _context;
    private readonly ILogger<InventoryItemController> _logger;
    private readonly DaprClient _daprClient;
    public InventoryItemController(InventoryDbContext context, ILogger<InventoryItemController> logger, DaprClient daprClient)
    {
        _context = context;
        _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        _logger = logger;
        _daprClient = daprClient;
    }

    [HttpGet("product/{productId}")]
    [ProducesResponseType(typeof(List<InventoryItem>), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<List<InventoryItem>>> ItemsByProductIdAsync(string productId)
    {
        _logger.LogInformation("getting product {productId}", productId);

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

    [Route("location/{locationId}/{productId}/{stockAmount}")]
    [HttpPut]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> UpdateStockAsync(string locationId, string productId, int stockAmount)
    {
        // should have failure handling
        var result = await _context.InventoryItems.Where(ci => ci.LocationId.Equals(locationId)

        && ci.ProductId.Equals(productId)).FirstOrDefaultAsync();

        if (result == null)
        {
            return NotFound("Location/product not found");
        }

        this._logger.LogInformation("Existing amount", result);

        result.SetStock(stockAmount);
        _context.Update(result);

        this._logger.LogInformation("New amount", result);

        _context.ChangeTracker.DetectChanges();
        this._logger.LogInformation("Logging changes detected in context", _context.ChangeTracker.DebugView.LongView);

        await _context.SaveChangesAsync();

        return Ok();
    }


    [Route("location")]
    [HttpPost]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> CreateLocationAsync([FromBody] AddInventoryItemDto item)
    {
        // should have failure handling
        // should it check that the product exists!!??
        var result = await _context.InventoryItems.Where(
            ci => ci.LocationId.Equals(item.LocationId)
            && ci.ProductId.Equals(item.ProductId))
            .FirstOrDefaultAsync();
        if (result != null)
        {
            return BadRequest("Location id already exists");
        }

        _context.InventoryItems.Add(new InventoryItem(0, item.ProductId, item.LocationId, item.AvailableStock));
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("location/{locationId}")]
    [ProducesResponseType(typeof(List<InventoryItem>), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<List<InventoryItem>>> ItemsByLocationIdAsync(string locationId)
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
