class ShoppingCart {
    constructor() {
        const savedCart = localStorage.getItem("shopping_cart");
        this.articles = savedCart ? JSON.parse(savedCart) : []; 

        this.updateUI();
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
                    const updateResponse = await fetch(`/products/${id}/decrease-stock`,{
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!updateResponse.ok) {
                        throw new Error("Error while updating the stock on the server");
                    }

                    const result = await updateResponse.json();

                    if (result.success) {
                        existingItem.quantity += 1;
                        console.log(result.message);
                    }
                    
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

            // update local storage
            localStorage.setItem("shopping_cart", JSON.stringify(this.articles));

            alert(`${data.product_name} has been added to your shopping cart.`);

        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    }

    // remove an item
    async removeItem(id) {
        try {
            const existingItem = this.articles.find(item => item.id === id);
            if (!existingItem) return;

            // Server-Request to increase the stock
            const updateResponse = await fetch(`/products/${id}/increase-stock`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!updateResponse.ok) {
                throw new Error("Error while updating the stock on the server");
            }

            const result = await updateResponse.json();

            if (result.success) {
                console.log(result.message);

                // decrease local value in shopping cart
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                } else {
                    // if the quantity was one, simply remove the cart item
                    this.articles = this.articles.filter(item => item.id !== id);
                }

                // update local cache and update UI
                localStorage.setItem("shopping_cart", JSON.stringify(this.articles));
                this.updateUI();
            } else {
                alert("Server error: Could not restock product.");
            }

        } catch (error) {
            console.error("Error removing product from cart:", error);
        }
    }

    // compute total price
    getTotalPrice() {
        return  this.articles.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    updateUI() {
        const listElements = document.getElementById("cart-items-list");
        const sumElement = document.getElementById("total-price");
        
        if (!listElements || !sumElement) return;

        if (this.articles.length == 0) {
            listElements.innerHTML = "<tr><td colspan='4'>Your shopping cart is empty.</td></tr>";
            sumElement.textContent = "Total: 0.00 €";
            return;
        }

        listElements.innerHTML = "";
        this.articles.forEach(item => {
            const tr = document.createElement("tr");

            // row 1: name
            const tdName = document.createElement("td");
            tdName.textContent = item.name;
            tr.appendChild(tdName);

            // row 2: price
            const tdPrice = document.createElement("td");
            tdPrice.textContent = `${item.price.toFixed(2)} €`;
            tr.appendChild(tdPrice);

            // row 3: quantity
            const tdQuantity = document.createElement("td");
            tdQuantity.textContent = `${item.quantity}x`;
            tr.appendChild(tdQuantity);

            // row 4: cancel-Button
            const tdAction = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Cancel product";
            
            // event-listener for deleting
            deleteButton.addEventListener("click", () => {
                this.removeItem(item.id);
            });

            tdAction.appendChild(deleteButton);
            tr.appendChild(tdAction);

            // append line to the table
            listElements.appendChild(tr);
        });

        sumElement.textContent = `Total: ${this.getTotalPrice().toFixed(2)} €`;
    }
}

const myCart = new ShoppingCart();