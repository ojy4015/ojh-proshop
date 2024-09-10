// import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
// import products from '../products';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
// import Meta from '../components/Meta';
import Product from '../components/Product';
// import axios from 'axios';

const HomeScreen = () => {
  // products are part of our state
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data } = await axios.get('http://localhost:5000/api/products');
  //     setProducts(data);
  //   };
  //   fetchProducts();
  // }, []);

  // <Route
  //       path="/search/:keyword/page/:pageNumber"
  //       element={<HomeScreen />}
  //     />
  const { keyword, pageNumber } = useParams(); // get pageNumber from the URL // <Route path="/page/:pageNumber" element={<HomeScreen />} />

  const {
    data, //  res.json({ products, page, pages: Math.ceil(count / pageSize) }); // page: 현재페이지, pages: 전체 페이지 수
    error,
    isLoading,
  } = useGetProductsQuery({ keyword, pageNumber });

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          GO Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data.message || error.error}</Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
