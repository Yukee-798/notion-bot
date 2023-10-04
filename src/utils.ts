import fs from "fs";
import cron from "node-cron";

export const readFile = async (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const bufferString = data.toString("utf8");
        resolve(bufferString);
      }
    });
  });
};

/**
 * Retrieves a list of files from the specified directory.
 *
 * @param {string} dir - The directory path.
 * @return {Promise<string[]>} A promise that resolves with an array of file names.
 */
export const getFiles = async (dir: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
};

// 每隔指定秒数执行一次任务
export const pollInSeconds = (callback: () => void, seconds: number) => {
  const interval = `*/${seconds} * * * * *`;
  cron.schedule(interval, callback);
};

// 每隔指定小时数执行一次任务
export const pollInHours = (callback: () => void, hours: number) => {
  const interval = `0 */${hours} * * *`;
  cron.schedule(interval, callback);
};

// 在固定时间执行一次任务，time 取值为 0 ~ 23，分别表示当天的时间
export const pollInFixedTime = (callback: () => void, time: number) => {
  const task = cron.schedule(`0 ${time} * * *`, callback, {
    scheduled: true, // 启用定时任务
    timezone: "Asia/Shanghai", // 设置时区，根据需要进行调整
  });

  // 启动定时任务
  task.start();
};

export const pollInHoliday = (callback: () => void) => {};
