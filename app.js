const { butterfly, db } = require('./butterfly.js'); // Adjust path if necessary

(async () => {
    try {
        // 1. Adding Complex Objects to Different Indexes
        console.log("Adding complex objects...");
        
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

        // 2. Retrieving Complex Objects and Accessing Nested Properties
        console.log("Retrieving complex objects and accessing nested properties...");
        
        const retrievedUser = await db.getKey(butterfly.INDEX_2, 'user_1');
        console.log("User Email:", retrievedUser.email);
        console.log("User Address:", retrievedUser.address.city, retrievedUser.address.state);
        console.log("User Preferences:", retrievedUser.preferences);

        const retrievedProduct = await db.getKey(butterfly.INDEX_3, 'product_101');
        console.log("Product Name:", retrievedProduct.name);
        console.log("Product Specifications:", retrievedProduct.specifications);

        // 3. Updating Complex Objects and Preserving Data Integrity
        console.log("Updating complex objects...");
        
        retrievedUser.preferences.theme = "light";
        retrievedProduct.stock -= 1; // Simulating a purchase

        await db.setKey(butterfly.INDEX_2, 'user_1', retrievedUser);
        await db.setKey(butterfly.INDEX_3, 'product_101', retrievedProduct);

        console.log("Updated User Preferences:", (await db.getKey(butterfly.INDEX_2, 'user_1')).preferences);
        console.log("Updated Product Stock:", (await db.getKey(butterfly.INDEX_3, 'product_101')).stock);

        // 4. Searching and Filtering Data with Nested Object Properties
        console.log("Searching products with 'Bluetooth' in the description...");
        const searchResults = await db.searchKeys(butterfly.INDEX_3, 'Bluetooth');
        console.log("Search Results:", searchResults);

        // 5. Deleting Complex Objects and Checking Deletion
        console.log("Deleting a complex object...");
        
        await db.deleteKey(butterfly.INDEX_2, 'user_1');
        const deletedUser = await db.getKey(butterfly.INDEX_2, 'user_1');
        console.log("Deleted User:", deletedUser); // Should be null

        // 6. Adding and Managing Nested Objects within Arrays
        console.log("Managing nested objects within arrays...");
        
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

        const retrievedOrder = await db.getKey(butterfly.INDEX_4, 'order_5001');
        console.log("Order Products:", retrievedOrder.products);

        // 7. Generating a New ID for Complex Data Structures
        console.log("Generating a new ID for products...");
        
        const newProductId = await db.getNewID(butterfly.INDEX_3);
        console.log("New Product ID:", newProductId);
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();
