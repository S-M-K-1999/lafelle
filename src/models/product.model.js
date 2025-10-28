const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  imageFileId: { type: String }, // Store ImageKit fileId for deletion
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);