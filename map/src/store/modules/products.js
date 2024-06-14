import ProductService from '@/service/ProductService';
const productService = new ProductService();

const state = {
    products: [],
    lowStockProducts: [],
    stockWarning: ''
};

const mutations = {
    SET_PRODUCTS(state, products) {
        state.products = products;
    },
    SET_LOW_STOCK_PRODUCTS(state, lowStockProducts) {
        state.lowStockProducts = lowStockProducts;
    },
    SET_STOCK_WARNING(state, value) {
        state.stockWarning = value;
    },
};

const actions = {
    async fetchProducts({ commit }) {
        try {
            const products = await productService.getProducts();
    
            commit('SET_PRODUCTS', products);
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },
    async fetchLowStockProducts({ commit }) {
        try {
            const products = await productService.getLowStockProducts();
    
            commit('SET_LOW_STOCK_PRODUCTS', products);
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }
};

const getters = {
    products: state => state.products
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};