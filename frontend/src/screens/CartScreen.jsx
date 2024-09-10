import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice'; // import action

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // get the cart state
  const cart = useSelector((state) => state.cart);
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;

  // NOTE: no need for an async function here as we are not awaiting the
  // resolution of a Promise
  const addToCartHandler = (product, qty) => {
    // 카트에 물건을 담은 사람과 다른 사람이 로그인 하면 카트를 클리어 함
    // clear local storage entirely and so remove the cart, userInfo and expirationTime.

    // 카트에 물건을 담은 사람과 같은 사람이 로그인 하면 카트에 담음.
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  // 로그인이 안됐으면 로그인 페이지로 logged in 돼있으면 /shipping 페이지로 redirect
  // http://localhost:3000/login?redirect=/shipping
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              <span>총 상품 가격 : </span>${itemsPrice} <br />
              <span>세금 : </span>${taxPrice} <br />
              <span>배송비 : </span>${shippingPrice}
              <br />
              <span>총 결제 금액 : </span>${totalPrice}
              {/* {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)} */}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
