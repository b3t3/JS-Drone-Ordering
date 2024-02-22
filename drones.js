//declare max coordinates of the grid and other useful variables
const maxX = 280, maxY = 280;
const pickUpWait = 5;
const fullCharge = 20;
let time = 0.0;

//create wherehouse class
class Wherehouse{
    constructor(x,y,name){
        this.x = x;
        this.y = y;
        this.name = name;
    }
}

//create customers class
class Customers{
    constructor(id,x,y,name){
        this.id = id;
        this.x = x;
        this.y = y;
        this.name = name;
    }
}

//create orders class and define a function to find the closest wherehouse 
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
    
        return coordWherehouses.reduce((closest, warehouse) => {
          const distance = Math.abs(customer.x - warehouse.x) + Math.abs(customer.y - warehouse.y);
          if (!closest || distance < closest.distance) {
            return { warehouse, distance };
          }
          return closest;
        }, null).warehouse;
      }

}

//create the types of drones class
class Drones {
    constructor(capacity, consumption,typeName) {
      this.capacity = capacity;
      this.consumption = consumption;
      this.typeName = typeName;
    }
}

//instance the wherehouses
const coordWherehouses = [
    new Wherehouse(100,100,"First Wherehouse"),
    new Wherehouse(200,200,"Second Wherehouse")
]

//instance the customers
const coordCustomers = [
    new Customers(1,10,10,"John Stocks"),
    new Customers(2,213,187,"Alfred Derrick"),
    new Customers(3,108,15,"Richard Brune")
] 

//instance the customer orders
const custOrders = [
    new Orders(1, {tomatoes: 5,cucumber: 5,cheese: 1,milk: 2}),
    new Orders(1, {eggs: 10,cucumber: 2,cheese: 1,ham: 2}),
    new Orders(2, {eggs: 10,tomatoes: 2,bananas: 5,carrots: 15,bread: 2,onion: 6})
]

//instance the drones
const typesOfDrones = [
    new Drones(500, 1,"Type One"),
    new Drones(1000, 3,"Type Two"),
    new Drones(2000,5,"Type Three")
];
  
// Task A) & C) calculate delivery time and consumption
function deliveryTimeAndConsumption(order, droneType) {
    let time = 0;
    let consumption = 0;
  
    const customer = coordCustomers.find(c => c.id === order.customerId);
    const closestWarehouse = order.findWarehouse();
  
    if (!customer || !closestWarehouse) {
      console.error(`Customer or warehouse not found for order with ID ${order.customerId}.`);
      return { time, consumption };
    }
  
    const distanceToCustomer = Math.abs(customer.x - closestWarehouse.x) + Math.abs(customer.y - closestWarehouse.y);
  
    time = distanceToCustomer * 2;
    consumption = droneType.consumption * distanceToCustomer;
  
    return {
      time,
      consumption
    };
  }
  
  function deliverOrders(orders, drones) {
    let totalDeliveryTime = 0;
    let totalConsumption = 0;
  
    for (const order of orders) {
      const customer = coordCustomers.find(c => c.id === order.customerId);
      const closestWarehouse = order.findWarehouse();
  
      const deliveryInfo = deliveryTimeAndConsumption(order, drones[0]); 
      totalDeliveryTime += deliveryInfo.time;
      totalConsumption += deliveryInfo.consumption;
    }
  
    return { totalDeliveryTime, totalConsumption };
  }
  
  // Task B) - Calculate number of drones used
  function totalDrones(orders, drones) {
    let totalDronesUsed = 0;
  
    for (const order of orders) {
      const customer = coordCustomers.find(c => c.id === order.customerId);
      const closestWarehouse = order.findWarehouse();
      totalDronesUsed++;
    }
  
    return totalDronesUsed;
  }
  
  // Example usage for Task A), B), and C)
  const result = deliverOrders(custOrders, typesOfDrones);
  console.log(`Total drones used: ${totalDrones(custOrders, typesOfDrones)}`);
  console.log(`Total delivery time: ${result.totalDeliveryTime} minutes`);
  console.log(`Total consumption: ${result.totalConsumption} kW`);
  