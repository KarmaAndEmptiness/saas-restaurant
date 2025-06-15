import http from '@/utils/request'
export interface Dish {
  cost_price: string,
      cover_img: string|null,
      description: string|null,
      dish_category_id: number,
      dish_id: number,
      dish_name: string,
      dish_price: string,
      is_deleted: number,
      origin_price: string,
      sort_order: string|null,
      status: string|null,
     tenant_id: number,
category?:string | null,
stock?: number | null,
sales?: number | null,

}
export interface DishCategory {
 category_id: number,
    category_name: string,
    created_at:string| null,
    parent_id: number,
    sort_order: number,
    tenant_id: number
}

//获取菜品列表
export const getDishes = () => {
  return http.get('/api/dish');
}

//添加菜品
export const createDish = (data:Dish) => {
  return http.post('/api/dish',{...data,is_deleted:0});
}

//更新菜品
export const updateDish = (dishId:number,data:Dish) => {
  return http.put('/api/dish/'+dishId,data);
}

//删除用户
export const deleteDish = (dishId:number) => {
  return http.put('/api/dish/'+dishId, {dish_id:dishId, is_deleted: 1 });
}

//获取菜品分类
export const getDishCategories = () => {
  return http.get<DishCategory[]>('/api/dishcategory');
}
//根据菜品分类ID获取菜品分类
export const getDishCategory = (dishCategoryId:number) => {
  return http.get<DishCategory>('/api/dishcategory/'+dishCategoryId);
}

//获取推荐菜品列表
export const getRecommendedDishes = () => {
  return http.get<Dish[]>('/api/dish/hot');
}

