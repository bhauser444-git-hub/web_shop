class CartItem {
    constructor(id, name, category, price, quantity, stock) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = parseFloat(price);
        this.quantity = quantity;
        this.stock = stock;
    }

    get totalPrice() {
        return this.price * this.quantity;
    }
}