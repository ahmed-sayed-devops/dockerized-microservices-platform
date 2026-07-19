import api from "../api";

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const deleteProduct = async (id) => {
  return await api.delete(`/products/${id}`);
};
