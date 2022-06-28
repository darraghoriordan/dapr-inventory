create simple architecture

Products - add a product / pre populate () - use dynamo normal consistency? maybe with redis
POs - create a po, change po state - use postgres?
Inventory - product stock adjustments (updates PO), low stock level alert - strong consistency dynamo
SOs - create sales order, change SO state - use postgres?
Shipping - print label, pick items (updates SO) - no store?

add products package

- use nestjs for this one
- use dynamo with normal consistency

add po's

- use kotlin
- use postgres

add inventory

- .net
- strong consistency dynamo

add so's

- use .net
- postgres

add shipping

- nest js
