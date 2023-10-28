import qs from "qs";

import { mGet, mPost, mPut } from "./util.js";

export async function getReaderList(
  param = {
    keyword: "",
    filter: 1, // 1正常 2冻结 0全部
    page_num: 1,
    page_size: 1000,
    order_by: "create_time",
    desc: 1,
  }
) {
  return mGet(`/api/reader/list?${qs.stringify(param)}`);
}

// 自动分配卡号
export async function autoGetCardNum() {
  return mGet("/api/reader/card_num");
}

export async function createCardForStudent(data) {
  return mPost("/api/reader", data);
}

export async function editCard(data) {
  return mPut("/api/reader", data);
}
