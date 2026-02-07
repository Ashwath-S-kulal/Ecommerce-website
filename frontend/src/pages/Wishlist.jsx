import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import axios from 'axios';
import { setWishlist, setCart } from '@/redux/productSlice';
import { toast } from 'sonner';

export default function Wishlist() {

    const { wishlist } = useSelector(store => store.product);
    const dispatch = useDispatch();

    const API = "/api/wishlist";
    const CART_API = "/api/cart";
    const accessToken = localStorage.getItem('accessToken');

    const loadWishlist = async () => {
        try {
            const res = await axios.get(`${API}/get`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (res.data.success) {
                dispatch(setWishlist(res.data.wishlist || { items: [] }));
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleRemove = async (productId) => {
        try {
            const res = await axios.delete(`${API}/remove`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                data: { productId }, // 👈 DELETE sends body via `data`
            });

            if (res.data.success) {
                dispatch(setWishlist(res.data.wishlist));
                toast.success("Removed from wishlist");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to remove item");
        }
    };

    const handleMoveToCart = async (productId) => {
        try {
            const res = await axios.post(`${CART_API}/add`, { productId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (res.data.success) {
                dispatch(setCart(res.data.cart));
                toast.success("Added to cart");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadWishlist();
    }, [dispatch]);

    return (
        <div className="pt-20 bg-gray-50 min-h-screen px-4">
            {wishlist?.items?.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                        <Heart className="text-pink-600" /> Your Wishlist
                    </h1>

                    <div className="flex flex-col gap-5">
                        {wishlist.items.map((item, index) => (
                            <Card key={index}>
                                <div className="flex justify-between items-center pr-7">
                                    <div className="flex items-center w-[350px]">
                                        <img
                                            src={item.productId?.productImg?.[0]?.url}
                                            alt="img"
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                        <div className="w-[280px]">
                                            <h1 className="font-semibold truncate">
                                                {item.productId?.productName}
                                            </h1>
                                            <h2 className="font-bold text-pink-600">
                                                ₹{item.productId?.productPrice}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Button
                                            onClick={() => handleMoveToCart(item.productId._id)}
                                            className="bg-pink-600 text-white"
                                        >
                                            Add to Cart
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            onClick={() => handleRemove(item.productId._id)}
                                            className="text-red-500"
                                        >
                                            <Trash2 /> Remove
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-6 mt-20">
                    <div className="bg-gray-100 p-10 rounded-full">
                        <ShoppingBag size={80} className="text-gray-300" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Save items you love to buy later ❤️
                        </p>
                    </div>
                    <Button asChild className="bg-pink-600 hover:bg-pink-700 px-8">
                        <Link to="/products">Browse Products</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
