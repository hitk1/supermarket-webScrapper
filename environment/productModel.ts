import mongoose from 'mongoose'

export interface ICategory extends mongoose.Document{
    category: string,
    url: string
}

export interface IProduct extends mongoose.Document{
    product: string,
    price: number,
    promotion: boolean,
    onlineShop: boolean,
    UN: string,
    category: mongoose.Types.ObjectId,
    market: mongoose.Types.ObjectId
}

const categorySchema = new mongoose.Schema({
    category: {type: String, required: true},
    url: {type: String, required: true}
})

const productSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    promotion: {
        type: Boolean,
        required: true,
        default: false
    },
    onlineShop: {
        type: Boolean,
        required: true,
        default: false
    },
    UN: {
        type: String,
        required: true,
        default: 'UN'
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Categorias',
        required: true
    },
    market: {
        type: mongoose.Types.ObjectId,
        ref: 'Mercados',
        required: true
    }
})

export const categoryModel = mongoose.model<ICategory>('Categorias', categorySchema, 'Categorias')
export const productModel = mongoose.model<IProduct>('Produtos', productSchema, 'Produtos')