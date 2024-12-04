// models/Cart.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'ProviderApplication' },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number
    }],
    total: { type: Number, default: 0 }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
