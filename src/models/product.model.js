const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: false },
}, {
    timestamps: true, // This adds 'createdAt' and 'updatedAt' timestamps
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;