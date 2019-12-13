import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';
import connectDb from '../../utils/connectDb';

connectDb()

const { ObjectId } = mongoose.Types; 

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await handleGetRequest(req, res);
            break;
        case "PUT":
            await handlePutRequest(req, res);
            break;
        default:
            res.status(405).send(`Method ${req.method} not allowed`)
            break;

    }
}
 async function handleGetRequest (req, res){
    if (!("authorization" in req.headers)) {
        return res.status(401).send("No authorization token");
    }
    try {
        const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        //get user cartbased on userID
        const cart = await Cart.findOne({ user: userId });
        // check if product already exists in cart
        const productExists= cart.products.some(doc => ObjectId(productId) === doc.product);
        //if so, increment quantity (by number provided to request)
        if (productExists)  {
            await Cart.findOneAndUpdate(
                {_id: cart._id, "products.product": productId },
                { $inc: { "products.$.quantity": quantity } }
            )
        }else{
            const newProduct = { quantity, product: productId }
            await Cart.findByIdAndUpdate(
                { _id: cart.id },
                { $addToSet: { products: newProduct } }
            )
        }
        res.status(200).send("Cart updated")
        }
        // if not, add new product with given quantity 
        const cart = await Cart.findOne({ user: userId }).populate({
            path: "products.product", 
            model: "Product"
        })
        res.status(200).json(cart.products)
    } catch (error) {
        console.error(error)
        res.status(403).send("Please login again")
    }
}

async function handlePutRequest (req, res) {
     const { quantity, productId } = req.body;
     if (!("authorization" in req.headers)) {
        return res.status(401).send("No authorization token");
    }
    try {
        const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)

    } catch (error) {
        console.error(error)
        res.status(403).send("Please login again");
    }
}