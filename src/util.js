import nodeXlsx from "node-xlsx";
import { X_Token } from "./config.js";

// 读取Excel文件
export function readXlsx(path) {
  return nodeXlsx.parse(path);
}

const HEADERS = {
  Accept: " application/json, text/plain, */*",
  "Accept-Language": "en,en-US;q=0.9",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  Pragma: "no-cache",
  Referer: "https://yuntu.yidivip.com/admin/reader/list",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  "X-Token": X_Token,
  "sec-ch-ua":
    '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
};

export async function mGet(api = "") {
  const response = await fetch(`https://yuntu.yidivip.com${api}`, {
    headers: HEADERS,
    method: "GET",
  });
  return response.json();
}

export async function mPost(api = "", data) {
  const response = await fetch(`https://yuntu.yidivip.com${api}`, {
    headers: HEADERS,
    body: JSON.stringify(data),
    method: "POST",
  });
  return response.json();
}

export async function mPut(api = "", data) {
  const response = await fetch(`https://yuntu.yidivip.com${api}`, {
    headers: HEADERS,
    body: JSON.stringify(data),
    method: "PUT",
  });
  return response.json();
}

export function getGradeAndClass(grade_class) {
  // 五（4）班
  let grade = "";
  let classNum = grade_class[2];
  switch (grade_class[0]) {
    case "一":
      grade = "4";
      break;
    case "二":
      grade = "5";
      break;
    case "三":
      grade = "6";
      break;
    case "四":
      grade = "7";
      break;
    case "五":
      grade = "8";
      break;
  }
  return { grade, classNum };
}

// 并发请求函数
export const concurrencyController = (tasks, maxNum) => {
  return new Promise((resolve) => {
    if (tasks.length === 0) {
      resolve([]);
      return;
    }
    const results = [];
    let index = 0; // 下一个请求的下标
    let count = 0; // 当前请求完成的数量

    // 发送请求
    async function request() {
      if (index === tasks.length) return;
      const i = index; // 保存序号，使result和tasks相对应
      const task = tasks[index];
      index++;
      try {
        const resp = await task();
        // resp 加入到results
        results[i] = resp;
      } catch (err) {
        // err 加入到results
        results[i] = err;
      } finally {
        count++;
        // 判断是否所有的请求都已完成
        if (count === tasks.length) {
          console.log("完成了");
          resolve(results);
        }
        request();
      }
    }

    // maxNum和tasks.length取最小进行调用
    const times = Math.min(maxNum, tasks.length);
    for (let i = 0; i < times; i++) {
      request();
    }
  });
};
