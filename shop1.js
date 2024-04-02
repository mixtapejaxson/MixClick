// Define the shop
let shop = {
    items: [
        { name: 'Item 1', cost: 50000 },
        { name: 'Item 2', cost: 20 },
        { name: 'Item 3', cost: 30 },
    ]
};

// Define the player
let player = {
    coins: 50,
    inventory: [],
};

// Function to buy an item
function buyItem(itemName) {
    // Find the item in the shop
    let item = shop.items.find(i => i.name === itemName);

    // If the item doesn't exist, return an error
    if (!item) {
        return 'Item not found in shop';
    }

    // If the player doesn't have enough coins, return an error
    if (player.coins < item.cost) {
        return 'Not enough coins';
    }

    // Subtract the cost from the player's coins
    player.coins -= item.cost;

    // Add the item to the player's inventory
    player.inventory.push(item);

    return `You bought ${itemName}!`;
}

