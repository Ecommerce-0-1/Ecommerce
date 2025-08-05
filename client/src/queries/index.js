// ===============================
// QUERY FUNCTIONS INDEX
// ===============================
// Import all query functions from organized files

// Re-export everything from getQueryFns (which imports from all other files)
export * from './getQueryFns';

// Direct exports from individual files for specific use cases
export * as CategoriesAPI from './categoriesQueryFns';
export * as ProductsAPI from './productsQueryFns';
export * as DiscountsAPI from './discountsQueryFns';
export * as BestSellingAPI from './bestSellingQueryFns';
export * as AuthAPI from './authQueryFns';
export * as OrdersAPI from './ordersQueryFns';
export * as OrderItemsAPI from './orderItemsQueryFns';
