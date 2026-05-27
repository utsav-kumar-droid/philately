import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";

export const useStamps = () => {

  /* ======================================= */
  /* STATES */
  /* ======================================= */

  const [stamps, setStamps] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ======================================= */
  /* TOKEN */
  /* ======================================= */

  const token = localStorage.getItem("token");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /* ======================================= */
  /* FETCH ALL STAMPS */
  /* ======================================= */

  const fetchStamps = useCallback(async () => {

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/stamps`
      );

      setStamps(res.data);

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to fetch stamps"
      );

    } finally {
      setLoading(false);
    }

  }, []);

  /* ======================================= */
  /* GET SINGLE STAMP */
  /* ======================================= */

  const getStampById = async (id) => {

    try {

      const res = await axios.get(
        `${API_URL}/stamps/${id}`
      );

      return res.data;

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to fetch stamp"
      );
    }
  };

  /* ======================================= */
  /* CREATE STAMP (ADMIN) */
  /* ======================================= */

  const createStamp = async (stampData) => {

    try {

      const res = await axios.post(
        `${API_URL}/stamps`,
        stampData,
        authHeaders
      );

      setStamps((prev) => [
        res.data,
        ...prev,
      ]);

      toast.success(
        "📮 Stamp added successfully"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to create stamp"
      );
    }
  };

  /* ======================================= */
  /* UPDATE STAMP */
  /* ======================================= */

  const updateStamp = async (
    id,
    updatedData
  ) => {

    try {

      const res = await axios.put(
        `${API_URL}/stamps/${id}`,
        updatedData,
        authHeaders
      );

      setStamps((prev) =>
        prev.map((stamp) =>
          stamp._id === id
            ? res.data
            : stamp
        )
      );

      toast.success(
        "✏️ Stamp updated"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to update stamp"
      );
    }
  };

  /* ======================================= */
  /* DELETE STAMP */
  /* ======================================= */

  const deleteStamp = async (id) => {

    try {

      await axios.delete(
        `${API_URL}/stamps/${id}`,
        authHeaders
      );

      setStamps((prev) =>
        prev.filter(
          (stamp) => stamp._id !== id
        )
      );

      toast.success(
        "🗑️ Stamp deleted"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to delete stamp"
      );
    }
  };

  /* ======================================= */
  /* ADD TO CART */
  /* ======================================= */

  const addToCart = async (stamp) => {

    try {

      const existing = cart.find(
        (item) => item._id === stamp._id
      );

      if (existing) {

        setCart((prev) =>
          prev.map((item) =>
            item._id === stamp._id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
          )
        );

      } else {

        setCart((prev) => [
          ...prev,
          {
            ...stamp,
            quantity: 1,
          },
        ]);
      }

      toast.success(
        "🛒 Added to cart"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to add to cart"
      );
    }
  };

  /* ======================================= */
  /* REMOVE FROM CART */
  /* ======================================= */

  const removeFromCart = (id) => {

    setCart((prev) =>
      prev.filter(
        (item) => item._id !== id
      )
    );

    toast.info("Removed from cart");
  };

  /* ======================================= */
  /* CLEAR CART */
  /* ======================================= */

  const clearCart = () => {

    setCart([]);

    toast.info("Cart cleared");
  };

  /* ======================================= */
  /* BUY NOW USING WALLET */
  /* ======================================= */

  const buyNow = async ({
    items,
    address,
  }) => {

    try {

      const res = await axios.post(
        `${API_URL}/orders/buy`,
        {
          items,
          address,
          paymentMethod: "wallet",
        },
        authHeaders
      );

      toast.success(
        "✅ Order placed successfully"
      );

      clearCart();

      return res.data;

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Purchase failed"
      );
    }
  };

  /* ======================================= */
  /* RETURN */
  /* ======================================= */

  return {

    /* STATES */
    stamps,
    cart,
    loading,

    /* STAMPS */
    fetchStamps,
    getStampById,
    createStamp,
    updateStamp,
    deleteStamp,

    /* CART */
    addToCart,
    removeFromCart,
    clearCart,

    /* BUY */
    buyNow,
  };
};