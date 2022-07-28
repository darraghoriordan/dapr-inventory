import {Controller, Get} from "@nestjs/common";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import SubTopicDto from "./dto/suptopic.dto";

@ApiTags("dapr pubsub")
@Controller("dapr")
export class DaprPubSubController {
    constructor() {}

    @ApiOkResponse()
    @Get("subscribe")
    getDaprSubscriptionTopics(): SubTopicDto[] {
        return [
            {
                pubsubname: "daprinventory-pubsub-rmq",
                topic: "etl.inventory.availableProductInventory",
                routes: {default: "/products/dapr/updatestock"},
            },
            {
                pubsubname: "daprinventory-pubsub-sqs",
                topic: "etl.inventory.availableProductInventory",
                routes: {default: "/products/awssdk/updatestock"},
            },
        ];
    }
}
