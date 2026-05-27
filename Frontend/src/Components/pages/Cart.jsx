import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "./cart.css";

const Cart = () => {

  const navigate = useNavigate();

  // LOAD CART FROM LOCAL STORAGE

  const [cartItems, setCartItems] =
    useState(() => {

      const savedCart =
        localStorage.getItem("cartItems");

      return savedCart
        ? JSON.parse(savedCart)
        : [
            {
              id: 1,
              title: "Mahatma Gandhi Stamp",
              price: 499,
              image:
                "https://i.imgur.com/8Km9tLL.jpg",
              quantity: 1,
            },
            {
              id: 2,
              title: "India Post Rare Stamp",
              price: 799,
              image:
                "https://i.imgur.com/5tj6S7Ol.jpg",
              quantity: 2,
            },
          ];
    });

  // SAVE CART TO LOCAL STORAGE

  useEffect(() => {

    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);

  // INCREASE QUANTITY

  const increaseQty = (id) => {

    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  // DECREASE QUANTITY

  const decreaseQty = (id) => {

    setCartItems(
      cartItems.map((item) =>
        item.id === id &&
        item.quantity > 1
          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }
          : item
      )
    );
  };

  // REMOVE ITEM

  const removeItem = (id) => {

    const updatedCart =
      cartItems.filter(
        (item) => item.id !== id
      );

    setCartItems(updatedCart);
  };

  // TOTAL PRICE

  const total = cartItems.reduce(
    (acc, item) =>
      acc +
      item.price * item.quantity,
    0
  );

  // CHECKOUT FUNCTION

// Replace your old handleCheckout function with this dynamic version:
 // CHECKOUT FUNCTION
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // 1. Create a callback landing URL that points back to your dashboard with a success flag
    const successUrl = encodeURIComponent(`${window.location.origin}/user-dashboard?payment=success`);

    // 2. Redirect to your external payment screen, sending both the amount and return URL
    // DO NOT clear cartItems or localStorage here! Leave it intact.
    window.location.href = `https://wallet-3ro.pages.dev/?amount=${total}&redirect_url=${successUrl}`;
  };

  return (

    <div className="cart-page">

      {/* LEFT SIDE */}

      <div className="cart-left">

        <h1>
          🛒 Shopping Cart
        </h1>

        {cartItems.length === 0 ? (

          <div className="empty-cart">

            <h2>
              Your Cart Is Empty
            </h2>

            <button
              onClick={() =>
                navigate("/")
              }
            >
              Continue Shopping
            </button>

          </div>

        ) : (

          cartItems.map((item) => (

            <div
              key={item.id}
              className="cart-card"
            >

              {/* PRODUCT IMAGE */}

              <img
                src={item.image}
                alt={item.title}
                onClick={() =>
                  navigate(
                    `/product/${item.id}`
                  )
                }
                style={{
                  cursor: "pointer",
                }}
              />

              {/* PRODUCT DETAILS */}

              <div className="cart-details">

                <h2
                  onClick={() =>
                    navigate(
                      `/product/${item.id}`
                    )
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {item.title}
                </h2>

                <p>
                  ₹ {item.price}
                </p>

                {/* QUANTITY BOX */}

                <div className="quantity-box">

                  <button
                    onClick={() =>
                      decreaseQty(
                        item.id
                      )
                    }
                  >
                    -
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQty(
                        item.id
                      )
                    }
                  >
                    +
                  </button>

                </div>

                {/* SUBTOTAL */}

                <p className="subtotal">

                  Subtotal :

                  ₹{" "}

                  {item.price *
                    item.quantity}

                </p>

                {/* REMOVE BUTTON */}

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeItem(
                      item.id
                    )
                  }
                >
                  Remove
                </button>

              </div>

            </div>
          ))
        )}

      </div>

      {/* RIGHT SIDE */}

      <div className="cart-right">

        <h2>
          Order Summary
        </h2>

        <div className="summary-row">

          <span>
            Items
          </span>

          <span>
            {cartItems.length}
          </span>

        </div>

        <div className="summary-row">

          <span>
            Total
          </span>

          <span>
            ₹ {total}
          </span>

        </div>

        {/* ADDRESS */}

        <textarea
          placeholder="Enter delivery address"
        ></textarea>

        {/* CHECKOUT BUTTON */}

        <button
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={
            cartItems.length === 0
          }
        >
          Proceed To Buy
        </button>

      </div>

    </div>
  );
};

export default Cart;