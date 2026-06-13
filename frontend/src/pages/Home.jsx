import {
  useEffect,
  useState
} from 'react';

import api from '../api/axios';
import {
  Link
} from 'react-router-dom';

import { checkoutOrder }
  from '../api/orders';

import './Home.css';

function Home() {
  const [products,
    setProducts] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [cart,
    setCart] =
    useState([]);

  const [showCart,
    setShowCart] =
    useState(false);

  const user = JSON.parse(
    localStorage.getItem(
      'user'
    )
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {
      try {
        const response =
          await api.get(
            '/api/orders/products'
          );

        setProducts(
          response.data.data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const addToCart =
    product => {
      setCart(prev => [
        ...prev,
        product
      ]);
    };

  const handleCheckout =
    async () => {
      if (!user) {
        alert(
          'Please login first'
        );
        return;
      }

      try {
        for (const item of cart) {
          await checkoutOrder({
            productId:
              item.id,
            quantity: 1,
            email:
              user.email
          });
        }

        alert(
          'Order successful!'
        );

        setCart([]);

        setShowCart(
          false
        );

        fetchProducts();
      } catch (error) {
        console.error(
          error
        );

        alert(
          'Checkout failed'
        );
      }
    };

  const handleLogout =
    () => {
      localStorage.removeItem(
        'token'
      );

      localStorage.removeItem(
        'user'
      );

      window.location.reload();
    };

  const productImages =
    {
      Laptop:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',

      Smartphone:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',

      Headphones:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
    };

  if (loading) {
    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero">
        <h1>
          🛍️ Saheed
          Digital Store
        </h1>

        <p>
          Premium Tech
          Products Powered
          by AWS
          Microservices
        </p>

        <div
          style={{
            marginTop:
              '20px'
          }}
        >
          {!user ? (
            <>
              <Link to="/login">
                <button>
                  Login
                </button>
              </Link>

              <Link to="/register">
                <button
                  style={{
                    marginLeft:
                      '10px'
                  }}
                >
                  Register
                </button>
              </Link>
            </>
          ) : (
            <>
              <h3>
                Welcome,
                {user.name}
              </h3>

              <button
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() =>
            setShowCart(
              true
            )
          }
          style={{
            marginTop:
              '20px'
          }}
        >
          🛒 Cart (
          {cart.length})
        </button>
      </section>

      <section className="products-section">
        <h2>
          Products
        </h2>

        <div className="products-grid">
          {products.map(
            product => (
              <div
                key={
                  product.id
                }
                className="product-card"
              >
                <img
                  src={
                    productImages[
                      product
                        .name
                    ]
                  }
                  alt={
                    product.name
                  }
                  className="product-image"
                />

                <div className="product-content">
                  <h3>
                    {
                      product.name
                    }
                  </h3>

                  <p>
                    $
                    {
                      product.price
                    }
                  </p>

                  <p>
                    Stock:
                    {
                      product.stock
                    }
                  </p>

                  <button
                    disabled={
                      product.stock ===
                      0
                    }
                    onClick={() =>
                      addToCart(
                        product
                      )
                    }
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {showCart && (
        <div
          style={{
            position:
              'fixed',
            top: 0,
            left: 0,
            width:
              '100%',
            height:
              '100%',
            background:
              'rgba(0,0,0,0.5)',
            display:
              'flex',
            justifyContent:
              'center',
            alignItems:
              'center'
          }}
        >
          <div
            style={{
              background:
                'white',
              padding:
                '30px',
              borderRadius:
                '10px',
              width:
                '400px'
            }}
          >
            <h2>
              Shopping Cart
            </h2>

            {cart.length ===
            0 ? (
              <p>
                Cart is
                empty
              </p>
            ) : (
              <>
                {cart.map(
                  (
                    item,
                    index
                  ) => (
                    <p
                      key={
                        index
                      }
                    >
                      {
                        item.name
                      }{' '}
                      - $
                      {
                        item.price
                      }
                    </p>
                  )
                )}

                <button
                  onClick={
                    handleCheckout
                  }
                >
                  Checkout
                </button>
              </>
            )}

            <button
              style={{
                marginTop:
                  '20px'
              }}
              onClick={() =>
                setShowCart(
                  false
                )
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;




// import { useEffect, useState } from 'react';
// import api from '../api/axios';
// import './Home.css';

// function Home() {
//   const [products, setProducts] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts =
//     async () => {
//       try {
//         const response =
//           await api.get(
//             '/api/orders/products'
//           );

//         setProducts(
//           response.data.data
//         );
//       } catch (error) {
//         console.error(
//           'Error fetching products:',
//           error
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//   // Product images
//   const productImages = {
//     Laptop:
//       'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',

//     Smartphone:
//       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',

//     Headphones:
//       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
//   };

//   if (loading) {
//     return (
//       <div className="loading">
//         Loading products...
//       </div>
//     );
//   }

//   return (
//     <div className="home">
//       {/* Hero Section */}
//       <section className="hero">
//         <h1>
//           🛍️ Saheed Digital Store
//         </h1>

//         <p>
//           Premium Tech Products
//           Powered by AWS
//           Microservices
//         </p>
//       </section>

//       {/* Products */}
//       <section className="products-section">
//         <h2>
//           Featured Products
//         </h2>

//         <div className="products-grid">
//           {products.map(
//             product => (
//               <div
//                 className="product-card"
//                 key={product.id}
//               >
//                 <img
//                   src={
//                     productImages[
//                       product.name
//                     ]
//                   }
//                   alt={product.name}
//                   className="product-image"
//                 />

//                 <div className="product-content">
//                   <h3>
//                     {product.name}
//                   </h3>

//                   <p className="price">
//                     $
//                     {product.price.toFixed(
//                       2
//                     )}
//                   </p>

//                   <p className="stock">
//                     {product.stock >
//                     0
//                       ? `${product.stock} in stock`
//                       : 'Out of stock'}
//                   </p>

//                   <button
//                     disabled={
//                       product.stock ===
//                       0
//                     }
//                   >
//                     {product.stock >
//                     0
//                       ? 'Add to Cart'
//                       : 'Out of Stock'}
//                   </button>
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Home;