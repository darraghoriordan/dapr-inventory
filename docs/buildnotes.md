create simple architecture

Products - add a product / pre populate () - use dynamo normal consistency? maybe with redis
POs - create a po, change po state - use postgres?
Inventory - product stock adjustments (updates PO), low stock level alert - strong consistency dynamo
SOs - create sales order, change SO state - use postgres?
Shipping - print label, pick items (updates SO) - no store?

# add products package

-   use nestjs for this one
-   use dynamo with normal consistency

added a basic nestjs app
pre-populate, only have GET?
display on a ui for customer
added docker compose for the products api
added dapr configurations
used dapr config to populate settings
added full tracing to the node app

## model

name
description
inventoryId

# add po's

-   use kotlin
-   use postgres

## Raises Events

POCreated
POCanceled
POCompleted

## listens to events

# Add Inventory

-   .net
-   strong consistency dynamo

## model

inventoryID: string
value: number

## commands

AdjustInventory
GetInventory

## Raises Events

## Listens to events

POCompleted

-- phase 2!!!

# add so's

-   use .net
-   postgres

# add shipping

-   nest js
