using Darragh.DaprInventory.Services.Inventory.API.InventoryItems;

namespace Darragh.DaprInventory.Services.Inventory.API.SyncTest;

[Route("api/v1/[controller]")]
[ApiController]
public class SyncTestController : ControllerBase
{

    private readonly ILogger<SyncTestController> _logger;
    private readonly DaprClient _daprClient;

    public SyncTestController(ILogger<SyncTestController> logger, DaprClient daprClient)
    {
        _logger = logger;
        _daprClient = daprClient;
    }

    [HttpGet("productsawssdk")]
    [ProducesResponseType(typeof(List<InventoryItem>), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<List<InventoryItem>>> ItemsHelloAsync()
    {
        _logger.LogInformation("getting hello");

        var result = await _daprClient.InvokeMethodAsync<dynamic>(HttpMethod.Get, "products-api", "products/awssdk");

        return Ok("Result: " + result);
    }

    [HttpGet("productsdapr")]
    [ProducesResponseType(typeof(List<InventoryItem>), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<List<InventoryItem>>> ItemsHelloDaprStateAsync()
    {
        _logger.LogInformation("getting hello with dapr state");

        var result = await _daprClient.InvokeMethodAsync<dynamic>(HttpMethod.Get, "products-api", "products/dapr");

        return Ok("Result: " + result);
    }


}
