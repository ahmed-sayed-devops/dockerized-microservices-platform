function StatsCards({ products }) {

  const totalProducts = products.length;

  const totalQuantity = products.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalValue = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (

    <div className="row my-4">

      <div className="col-md-4 mb-3">

        <div className="card shadow">

          <div className="card-body">

            <h5>Total Products</h5>

            <h2>{totalProducts}</h2>

          </div>

        </div>

      </div>

      <div className="col-md-4 mb-3">

        <div className="card shadow">

          <div className="card-body">

            <h5>Total Quantity</h5>

            <h2>{totalQuantity}</h2>

          </div>

        </div>

      </div>

      <div className="col-md-4 mb-3">

        <div className="card shadow">

          <div className="card-body">

            <h5>Inventory Value</h5>

            <h2>${totalValue}</h2>

          </div>

        </div>

      </div>

    </div>

  );

}

export default StatsCards;
