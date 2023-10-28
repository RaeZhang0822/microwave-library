// 并发请求函数
const concurrencyController = (tasks, maxNum) => {
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
