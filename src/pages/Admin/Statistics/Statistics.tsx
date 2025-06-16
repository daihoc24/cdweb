import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import ApexCharts from "react-apexcharts";
import { listProduct } from "../../../interfaces/product";
import { productService } from "../../../services/product";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts";

const StatisticsPage: React.FC = () => {
  const [productList, setProductList] = useState<listProduct[]>([]);

  // Lấy dữ liệu sản phẩm từ API
  const getProductListApi = async () => {
    try {
      const result = await productService.fetchProductApi();
      setProductList(result.data.content);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getProductListApi();
  }, []);
  const calculateSalesByType = () => {
    const salesByType: { [key: string]: number } = {};
    const revenueByType: { [key: string]: number } = {}; // Thêm đối tượng cho doanh thu

    productList.forEach((product) => {
      const { products_type, quantitySold, products_price } = product;

      // Tính số lượng bán theo loại
      if (!salesByType[products_type]) {
        salesByType[products_type] = 0;
      }
      salesByType[products_type] += quantitySold;

      // Tính doanh thu theo loại
      if (!revenueByType[products_type]) {
        revenueByType[products_type] = 0;
      }
      revenueByType[products_type] += quantitySold * products_price; // Doanh thu = quantitySold * products_price
    });

    return { salesByType, revenueByType };
  };

  // Chuyển đổi dữ liệu cho BarChart
  const { salesByType, revenueByType } = calculateSalesByType();
  const categories = Object.keys(salesByType); // Các loại sản phẩm
  const salesData = Object.values(salesByType); // Số lượng bán cho mỗi loại
  const revenueData = Object.values(revenueByType); // Doanh thu cho mỗi loại

  const calculateProductRevenue = () => {
    const revenueData = productList.map((product) => {
      const { products_name, products_price, quantitySold } = product;
      const revenue = products_price * quantitySold; // Doanh thu = giá * số lượng bán
      return {
        label: products_name,
        value: revenue,
      };
    });

    // Sắp xếp theo doanh thu giảm dần và lấy Top 5 sản phẩm
    const topProducts = revenueData
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Lấy Top 5 sản phẩm

    return topProducts;
  };
  const topProducts = calculateProductRevenue();

  return (
    <div>
      <h2 style={{ marginBottom: "80px" }}>Thống kê</h2>

      <div>
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ marginBottom: "30px" }}>
            Tổng số lượng bán theo loại sản phẩm
          </h2>
          <BarChart
            series={[{ data: salesData }]} // Dữ liệu theo số lượng bán
            height={500}
            width={700}
            xAxis={[
              {
                data: categories,
                scaleType: "band",
                colorMap: {
                  type: "piecewise",
                  thresholds: [new Date(2021, 1, 1), new Date(2023, 1, 1)],
                  colors: ["#00bbff"],
                },
              },
            ]} // Hiển thị các loại sản phẩm ở trục x
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </div>

        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ marginBottom: "30px" }}>Tổng doanh thu theo loại sản phẩm</h2>
          <BarChart
            series={[{ data: revenueData }]} // Dữ liệu theo doanh thu
            height={500}
            width={700}
            xAxis={[
              {
                data: categories,
                scaleType: "band",
                colorMap: {
                  type: "piecewise",
                  thresholds: [new Date(2021, 1, 1), new Date(2023, 1, 1)],
                  colors: ["#f30000a3"],
                },
              },
            ]} // Hiển thị các loại sản phẩm ở trục x
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </div>
        <div style={{ marginBottom: "50px" }}>
          
          <h2 style={{ marginBottom: "30px" }}>Top 5 Sản phẩm có doanh thu cao nhất</h2>
          <PieChart series={[{ data: topProducts }]} width={700} height={200} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
