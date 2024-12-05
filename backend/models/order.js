const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    provider: { 
        type: Schema.Types.ObjectId, 
        ref: 'ProviderApplication', 
        required: true 
    },
    items: [{
        product: { 
            type: Schema.Types.ObjectId, 
            ref: 'Product',
            required: true 
        },
        quantity: { 
            type: Number,
            required: true,
            min: 1 
        },
        price: { 
            type: Number,
            required: true 
        },
    }],
    total: { 
        type: Number, 
        required: true 
    },
    platformProfit: { 
        type: Number, 
        required: true 
    },
    providerProfit: { 
        type: Number, 
        required: true 
    },
    driverStatus: { 
        type: String, 
        enum: ['pending', 'accepted', 'ready', 'on the way', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    providerStatus: { 
        type: String, 
        enum: ['pending', 'received', 'preparing', 'ready'], 
        default: 'pending' 
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    info: String,
    driver: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    paymentMethod: { 
        type: String, 
        enum: ['cash', 'paypal'], 
        required: true 
    }
}, {
    timestamps: true  // This will add createdAt and updatedAt automatically
});

// Add a pre-save middleware to calculate profits if not set
orderSchema.pre('save', function(next) {
    if (!this.platformProfit || !this.providerProfit) {
        // Platform takes 10% of the total
        this.platformProfit = Math.round(this.total * 0.10);
        // Provider gets 90% of the total
        this.providerProfit = this.total - this.platformProfit;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);