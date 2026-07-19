function ProductTable({ products }) {
  return (
    <div className="card shadow">
      <div className="card-header bg-primary text-white">
        Products
      </div>

      <div className="table-responsive">

        <table className="table table-hover table-striped mb-0">

          <thead>

            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>

          </thead>

          <tbody>

            {products.map((product) => (

              <tr key={product.id}>

                <td>{product.id}</td>

                <td>{product.name}</td>

                <td>{product.description}</td>

                <td>${product.price}</td>

                <td>{product.quantity}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ProductTable;
