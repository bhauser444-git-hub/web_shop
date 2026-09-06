class ShoppingCart {
    constructor() {
        const savedCart = localStorage.getItem("shopping_cart");
        this.articles = savedCart ? JSON.parse(savedCart) : []; 

        this.actualiseUI();
    }

    // add an item or increase quantity
    async addItem(id) {
        try {
            // fetch live stock 
            const response = await fetch(`/products/${id}`);
            const data = await response.json();
            const currentStock = data.stock;

            // check if item already exists in cart
            const existingItem = this.articles.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.stock = currentStock;

                if (existingItem.quantity < existingItem.stock) {
                    existingItem.quantity += 1; 
                } else {
                    alert(`Error: There are only ${existingItem.stock} items in 
                        stock for ${existingItem.name}.`);
                    return;
                }        
            } else {
                // if the item does not exist in the cart
                if (currentStock > 0) {
                    const name = data.product_name;
                    const category = data.category;
                    const price = parseFloat(data.price);

                    const newItem = new CartItem(id, name, category, price, 1, currentStock);
                    this.articles.push(newItem);
                } else {
                    alert("Error: This item is out of stock.");
                    return;
                }
            }

            this.actualiseUI();
            alert(`${data.product_name} has been added to your shopping cart.`);

        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    }

    // remove an item
    removeItem(id) {
        this.articles = this.articles.filter(item => item.id !== id);
        this.actualiseUI();
    }

    // compute total price
    getTotalPrice() {
        return  this.articles.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    actualiseUI() {
        const listElements = document.getElementById("cart-items-list");
        const sumElement = document.getElementById("total-price");
        
        localStorage.setItem("shopping_cart", JSON.stringify(this.articles));

        if (!listElements || !sumElement) return;

        if (this.articles.length == 0) {
            listElements.innerHTML = "<li>Your shopping cart is empty.</li>";
            sumElement.textContent = "Total: 0.00 €";
            return;
        }

        listElements.innerHTML = "";
        this.articles.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - ${item.price.toFixed(2)} € x ${item.quantity} `;
            listElements.appendChild(li);
        });

        sumElement.textContent = `Total: ${this.getTotalPrice().toFixed(2)} €`;
    }
}

const myCart = new ShoppingCart();