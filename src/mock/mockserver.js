import Mock from "mockjs";
import shopData from "./data.json";
import shops from "./shops.json";

Mock.mock("/api/getShopData", { code: 0, data: shopData });

Mock.mock(/^\/api\/getShop\/\d+$/, function(options) {
  // /api/shop/12 /^\/api\/getShop\/\d+$/
  // 得到请求params参数id
  const id = options.url.substring(13);  //substring() 方法用于提取字符串中介于两个指定下标之间的字符。
  // 找到对应shops
  console.log('id...', id)
  const shop = shops.find((shop) => shop.id == id);
  console.log("/api/getShop", options, shop || shops[0]);
  // 返回一个动态数据
  return Mock.mock({ code: 0, data: shop || shops[0] });
}); // 
console.log("mockServer....");
