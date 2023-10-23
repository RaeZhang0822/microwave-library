import nodeXlsx from "node-xlsx";

// 读取Excel文件
function readXlsx(path) {
  return nodeXlsx.parse(path);
}

export { readXlsx };
