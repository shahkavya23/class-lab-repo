import Order from "../models/order.models.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto"

export const createPaymentOrder = async (req, res) => {
    try {
        const user = req.user;
        const { shippingAddress } = req.body;

        // 1. Validate shipping address fields
        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.phone ||
            !shippingAddress.addressLine1 ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "All shipping address fields are required"
            });
        }

        // 2. Validate cart existence
        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty. Cannot place an order."
            });
        }

        // 3. Populate latest product data from DB
        await user.populate("cart.product");

        let totalAmount = 0;
        const orderItems = [];

        // 4. Verify each product exists and has sufficient stock
        for (const item of user.cart) {
            if (!item.product) {
                return res.status(400).json({
                    success: false,
                    message: "A product in your cart is no longer available"
                });
            }

            if (item.quantity > item.product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`
                });
            }

            // Calculate price based on latest database price
            totalAmount += item.product.price * item.quantity;

            // Build snapshot
            orderItems.push({
                product: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                image: item.product.image
            });
        }

        // 5. Create pending ShopKart order in MongoDB
        const shopKartOrder = new Order({
            user: user._id,
            items: orderItems,
            shippingAddress,
            totalAmount,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT"
        });

        await shopKartOrder.save();

        // 6. Create Razorpay Order (amount in paise)
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100), // e.g. 7497 * 100 = 749700 paise
            currency: "INR",
            receipt: shopKartOrder._id.toString()
        });

        // 7. Save the razorpayOrderId to our order
        shopKartOrder.razorpayOrderId = razorpayOrder.id;
        await shopKartOrder.save();

        // 8. Return safe checkout info to frontend
        return res.status(200).json({
            success: true,
            shopKartOrderId: shopKartOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Error creating payment order:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create payment order",
            error: error.message
        });
    }
};



export const verifyPayment =  async (req,res) => {
    try{
        const {shopKartOrderId , razorpay_order_id , razorpay_payment_id , razorpay_signature} = req.body

        const user = req.user;


        const order = await Order.findById(shopKartOrderId);

        if (!order){
            return res.status(404).json({
                success : false,
                message : "Order not found"
            });
        }


        if (order.user.toString() !== user._id.toString()){
            return res.status(403).json({success : false , message : "Unauthorized access to order"});
        }

        const body = order.razorpayOrderId + "|" + razorpay_payment_id;


        const expectedSignature = crypto
        .createHmac("sha256" , process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");


        if(expectedSignature !== razorpay_signature){
            order.paymentStatus = "FAILED";
            await order.save();
            return res.status(400).json({
                success : false,
                message : "Invalid payment signature . Payment verification failed"
            })
        }


        //Payment verified now 
        order.paymentStatus = "PAID"
        order.status =  "PLACED"
        order.razorpayPaymentId =  razorpay_payment_id;
        await order.save();

        //Clear the cart
        user.cart = []
        await user.save()


        return res.status(200).json({
            success : true,
            message : "Payment verified successfully",
            order
        })

    }

    catch(error){
        console.log("Error verifiying payment:" , error);
        return res.status(500).json({
            success : false , 
            message : "Internal server error during verification",
            error : error.message 
        })
    }
}


// Task 7: Get all orders for the logged-in user
export const getMyOrders = async (req, res) => {
    try {
        const user = req.user;

        // Fetch orders belonging only to this user, sorted newest first
        const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};

// Task 17: Get single order by ID with ownership enforcement
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Security check: Must belong to the requesting user!
        if (order.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied: You do not own this order"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Error fetching single order:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order details",
            error: error.message
        });
    }
};

