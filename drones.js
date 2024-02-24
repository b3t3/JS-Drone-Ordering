
class Wherehouse {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
  }
}

class Customers {
  constructor(id, x, y, name) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.name = name;
  }
}

class Orders {
  constructor(customerId, productList) {
    this.customerId = customerId;
    this.productList = productList;
  }

  findWarehouse() {
    const customer = coordCustomers.find(c => c.id === this.customerId);
  
    if (!customer) {
      console.error(`Customer with ID ${this.customerId} not found.`);
      return null;
    }
  
    const closestWarehouse = coordWherehouses.reduce((closest, warehouse) => {
      const distance = Math.abs(customer.x - warehouse.x) + Math.abs(customer.y - warehouse.y);
      if (!closest || distance < closest.distance) {
        return { warehouse, distance };
      }
      return closest;
    }, null);
  
    return closestWarehouse ? closestWarehouse.warehouse : null;
  }
  
}
class Drones {
  constructor(capacity, consumption, typeName) {
    this.capacity = capacity;
    this.consumption = consumption;
    this.typeName = typeName;
  }
}

const coordWherehouses = [
  new Wherehouse(100, 100, "First Wherehouse"),
  new Wherehouse(200, 200, "Second Wherehouse"),
];

const coordCustomers = [
  new Customers(1, 10, 10, "John Stocks"),
  new Customers(2, 213, 187, "Alfred Derrick"),
  new Customers(3, 15, 85, "Richard Brune"),
];

const custOrders = [
  new Orders(1, { tomatoes: 5, cucumber: 5, cheese: 1, milk: 2 }),
  new Orders(1, { eggs: 10, cucumber: 2, cheese: 1, ham: 2 }),
  new Orders(2, { eggs: 10, tomatoes: 2, bananas: 5, carrots: 15, bread: 2, onion: 6 }),
];

const typesOfDrones = [
  new Drones(500, 1, "Type One"),
  new Drones(1000, 3, "Type Two"),
  new Drones(2000, 5, "Type Three"),
];

// Function to simulate drone delivery for a single order
function deliverOrder(order, droneType, customer) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const deliveryInfo = calculateDeliveryTimeAndConsumption(order, droneType, customer);
      resolve(deliveryInfo);
    }, 2000); 
  });
}


// Function to simulate drone delivery for all orders
async function deliverAllOrders(orders, drones, playbackSpeed, outputEnabled) {
  let totalDeliveryTime = 0;
  let totalConsumption = 0;

  for (const order of orders) {
    const customer = coordCustomers.find(c => c.id === order.customerId);
    const closestWarehouse = order.findWarehouse();
    const suitableDrone = findSuitableDrone(order, drones);

    if (suitableDrone) {
      const deliveryInfo = await deliverOrder(order, suitableDrone, customer);
      totalDeliveryTime += deliveryInfo.time;
      totalConsumption += deliveryInfo.consumption;

      if (outputEnabled) {
        console.log(`Order delivered in ${deliveryInfo.time} minutes. Consumption: ${deliveryInfo.consumption} kW`);
      }
    }
  }

  return { totalDeliveryTime, totalConsumption };
}

// Function to find a suitable drone for the order
function findSuitableDrone(order, drones) {
  return drones.find(drone => drone.capacity >= calculateOrderWeight(order));
}

// Function to calculate the weight of an order
function calculateOrderWeight(order) {
  return Object.values(order.productList).reduce((sum, quantity) => sum + quantity, 0);
}

function calculateDeliveryTimeAndConsumption(order, droneType, customer) {
  const closestWarehouse = order.findWarehouse();

  if (!closestWarehouse) {
    console.error(`No warehouse found for order with customer ID ${order.customerId}.`);
    return { time: 0, consumption: 0 };
  }

  const distanceX = Math.abs(customer.x - closestWarehouse.x);
  const distanceY = Math.abs(customer.y - closestWarehouse.y);
  const totalDistance = distanceX + distanceY;

  const time = totalDistance * 2; // To go and then return from a customer
  const consumption = droneType.consumption * totalDistance;

  return { time, consumption };
}

// Function to calculate total drones used
function calculateTotalDronesUsed(orders, drones) {
  return orders.reduce((totalDronesUsed, order) => {
    const customer = coordCustomers.find(c => c.id === order.customerId);
    const closestWarehouse = order.findWarehouse();
    return totalDronesUsed + 1;
  }, 0);
}

// Main function to run the simulation
async function runSimulation(playbackSpeed, outputEnabled) {
  const startTimestamp = Date.now();

  const totalDronesUsed = calculateTotalDronesUsed(custOrders, typesOfDrones);
  console.log(`Total drones used: ${totalDronesUsed}`);

  const result = await deliverAllOrders(custOrders, typesOfDrones, playbackSpeed, outputEnabled);

  const endTimestamp = Date.now();
  const elapsedMilliseconds = (endTimestamp - startTimestamp) / playbackSpeed;

  console.log(`Total delivery time: ${result.totalDeliveryTime} minutes`);
  console.log(`Total consumption: ${result.totalConsumption} kW`);

  if (outputEnabled) {
    console.log(`Simulation took ${elapsedMilliseconds} milliseconds.`);
  }
}

// Example usage for Task A), B), and C)
const playbackSpeed = 10; // 10x speed
const outputEnabled = true; // Enable output
runSimulation(playbackSpeed, outputEnabled);