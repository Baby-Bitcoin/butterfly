# 🦋 butterfly.js

The smallest in-memory database software in the world.

## Features

- Lightweight and fast JSON in-memory database (2.42KB minified).
- Works with JSON out of the box (100% JSON data structure support).
- Persistent storage using NDJSON log files.
- Support for multiple indexes.
- CRUD operations and basic search capabilities.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/butterfly-db.git
    ```

2. Navigate to the project directory and install dependencies:
    ```bash
    npm install
    ```

## Usage

### Adding and Managing Complex Objects

```js
const { butterfly, db } = require('./butterfly.js'); // Adjust path if necessary

(async () => {
    // Adding a complex user object
    const complexUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        address: {
            street: "123 Main St",
            city: "Springfield",
            state: "IL",
            postalCode: "62704"
        },
        preferences: {
            theme: "dark",
            notifications: true
        },
        roles: ["admin", "editor"]
    };
    
    await db.setKey(butterfly.INDEX_2, 'user_1', complexUser);

    // Retrieving and updating complex objects
    const retrievedUser = await db.getKey(butterfly.INDEX_2, 'user_1');
    retrievedUser.preferences.theme = "light"; // Update a nested property

    await db.setKey(butterfly.INDEX_2, 'user_1', retrievedUser); // Save the updated user object
})();
```

### Working with Products and Orders

```js
const product = {
    id: 101,
    name: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones with Bluetooth connectivity.",
    price: 299.99,
    stock: 150,
    categories: ["Electronics", "Audio"],
    specifications: {
        batteryLife: "30 hours",
        weight: "250g",
        color: "Black"
    }
};

await db.setKey(butterfly.INDEX_3, 'product_101', product);

// Creating and managing an order object
const order = {
    id: 5001,
    userId: 1,
    products: [
        { productId: 101, quantity: 2 },
        { productId: 102, quantity: 1 }
    ],
    totalAmount: 599.97,
    status: "Processing"
};

await db.setKey(butterfly.INDEX_4, 'order_5001', order);
```

### Searching and Filtering Data

```js
// Searching for products that have 'Bluetooth' in the description
const searchResults = await db.searchKeys(butterfly.INDEX_3, "Bluetooth");
console.log("Search Results:", searchResults);
```

### Generating New IDs

```js
// Generating a new ID for a product
const newProductId = await db.getNewID(butterfly.INDEX_3);
console.log("New Product ID:", newProductId);
```


### Contributing

Contributions are welcome! If you have ideas for improvements or new features, please open an issue or submit a pull request.


### License
This project is licensed under the GNU General Public License v3.0. See the LICENSE file for more details.
