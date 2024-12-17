import axios from "@/api/axios";

export default class ProductService {

  getCategoriesForTabs() {
    return axios
        .get("/ecommerce/getCategoriesForTabs")
        .then((res) => res.data)
        .then((d) => d.data);
}

  getProducts() {
    return axios
      .get("/inventory/getAllProductsUngrouped")
      .then((res) => res.data)
      .then((d) => d.data);
  }

  getProductsPos() {
    return axios
      .get("/inventory/getAllProductsUngroupedPos")
      .then((res) => res.data)
      .then((d) => d.data);
  }

  getProductsSmall() {
    return axios
      .get("/dashboard/getRecentlySoldProducts")
      .then((res) => res.data)
      .then((d) => d.data);
  }

  getCustomerCountByProvince() {
    return axios
      .get("/dashboard/getCustomerCountByProvince")
      .then((res) => res.data)
      .then((d) => d.data);
  }

  getOrderCounts() {
    return axios
      .get("/dashboard/getOrderCounts")
      .then((res) => res.data)
      .then((d) => d.data);
  }

  getMonthlySalesData() {
    return axios
      .get("/dashboard/getMonthlySalesData")
      .then((res) => res.data)
      .then((d) => d.data);
  }

  getTopProductByCategoryEcommerce(categoryName) {
    return axios
        .get(`/ecommerce/showTopProduct/${categoryName}`)
        .then((res) => res.data)
        .then((d) => d.data);
  }

  getTopProductByCategory(basis) {
    return axios
        .get(`/dashboard/displayBestSellingProducts/${basis}`)
        .then((res) => res.data)
        .then((d) => d.data);
  }

  getAllProductsByCategory(categoryName) {
      return axios
          .get(`/ecommerce/getAllProductsByCategory/${categoryName}`)
          .then((res) => res.data)
          .then((d) => d.data);
  }


  getLowStockProducts() {
    return axios
      .get("/inventory/getAllProductsUngroupedWithLowStock")
      .then((res) => res.data)
      .then((d) => d.data);
  }

  getTotalDiscount() {
    return axios
      .get("/dashboard/getTotalDiscount")
      .then((res) => res.data)
      .then((d) => d.data);
  }

  fetchProductDetailsForSalesReport() {
    return axios
      .get("/ecommerce/fetchProductDetailsForSalesReport")
      .then((res) => res.data)
      .then((d) => d.data);
  }

  deleteProductsByIds(productIds) {
      return axios
        .delete("/inventory/deleteProduct", { data: { productIds } })
        .then((res) => res.data);
  }

  restoreProductsByIds(productIds) {
    return axios
      .patch("/inventory/restoreProduct", { productIds })
      .then((res) => res.data);
  }

  downloadReport(format) {
    return axios.get(`/inventory/exportProductsUsingTemplate/${format}`, {
        responseType: 'blob'
    }).then(response => {
        const contentType = response.headers['content-type'];
        
        let blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; 
        let defaultFileName = 'download.xlsx';
        if (contentType && contentType.includes('application/pdf')) {
            blobType = 'application/pdf';
            defaultFileName = 'download.pdf';
        }
        
        const url = window.URL.createObjectURL(new Blob([response.data], { type: blobType }));
        const contentDisposition = response.headers['content-disposition'];
        let fileName = defaultFileName; 
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (fileNameMatch && fileNameMatch[1]) {
                fileName = fileNameMatch[1];
            }
        }

        const link = document.createElement('a');
        link.href = url;
        return url;
    }).catch(err => {
        console.error('Error downloading report:', err);
        throw err;
    });
}

}
