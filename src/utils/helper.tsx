import { customAlphabet } from 'nanoid';
// import * as crypto from 'crypto';

export class Helper {
  static convertToSlug(Text: any) {
    return Text.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
  static convertToUnderlined(Text: any) {
    return Text.toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '');
  }
  static generateRamdomByLength(length: any) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  /**
   * @description: Tạo số ngẫu nhiên
   * @param {number} length
   * @param {*} placeholder
   * @return {*}
   */
  static generateRandomCustom(
    length: number,
    placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
  ): string {
    const customNanoid = customAlphabet(placeholder, length);
    return customNanoid();
  }
  static getTimeNow(name_log?: string) {
    const today = new Date();
    const all_time =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate() +
      ' ' +
      today.getHours() +
      ':' +
      today.getMinutes() +
      ':' +
      today.getSeconds() +
      ':' +
      today.getMilliseconds();
    console.log(name_log, all_time);
  }
  static getTime() {
    const today = new Date();
    const all_time =
      today.getFullYear().toString() +
      (today.getMonth() + 1).toString() +
      today.getDate().toString() +
      '_' +
      today.getHours().toString() +
      today.getMinutes().toString() +
      today.getSeconds().toString() +
      today.getMilliseconds().toString();
    return all_time;
  }
  static getCycleName() {
    const today = new Date();
    const all_time =
      today.getFullYear().toString() +
      (today.getMonth() + 1).toString().padStart(2, '0');
    return all_time;
  }
  static convertObjToParam(body: any) {
    return Object.keys(body)
      .sort()
      .map(function (key) {
        return key + '=' + body[key];
      })
      .join('&');
  }
   static convertObjectToQueryString(params: Record<string, any>): string {
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      cleanParams[key] = String(value); // ép thành string
    });
    // 🔹 StorageId
    try {
      const projectRaw = localStorage.getItem('project');
      if (projectRaw) {
        const project = JSON.parse(projectRaw);
        if (project?.projectId) {
          cleanParams["StorageId"] = String(project.projectId);
        }
      }
    } catch {
      // ignore parse error
    }
    return new URLSearchParams(cleanParams).toString();
  }
  // static makeSignature(data:any, hash_key:any) {
  //   const hash_data = Helper.convertObjToParam(data);
  //   console.log(hash_data);
  //   return crypto
  //     .createHmac('sha256', hash_key)
  //     .update(hash_data)
  //     .digest('hex'); // Secret Passphrase
  // }
  static createFormData(body: any) {
    const data = new FormData();
    Object.keys(body).forEach((key) => {
      if (typeof body[key] === 'object')
        data.append(key, JSON.stringify(body[key]));
      else if (body[key] || body[key] === 0 || body[key] === '')
        data.append(key, body[key]);
    });
    return data;
  }
  static isJSON(str: any) {
    try {
      return JSON.parse(str) && !!str;
    } catch (e) {
      return false;
    }
  }
  static sumColumnOfArray(arr: any, _column: any) {
    return arr.reduce((accumulator: any, object: any) => {
      return accumulator + object[_column];
    }, 0);
  }
  static newObjectByPropertyNotNull(body: any) {
    Object.keys(body).forEach(key => {
      if (body[key] && typeof body[key] === "object") body[key] = body.key
    })
    return body
  }
  static _isString(e: any) {
    switch (e) {
      case "":
      // case 0:
      // case "0":
      case null:
      case false:
      case undefined:
        return true;
      default:
        return false;
    }
  }
  static formatCurrencyV2(value: any) {
    var number = value.replace(/[,.]/g, '');
    return new Intl.NumberFormat().format(number).replace(/\./g, ',');
  }
  static refreshObject(object: any) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        if (typeof object[key] === 'string') object[key] = '';
        else object[key] = undefined;
      };
    };
    return object;
  };
  static formatDMY = (d?: Date | string | null) => {
    if (!d) return "";

    const date = d instanceof Date ? d : new Date(d);

    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();

    return `${day}-${m}-${y}`;
  };
  static formatYMDLocal = (d?: Date | string | null) => {
    if (!d) return "";

    const date = d instanceof Date ? d : new Date(d);

    if (isNaN(date.getTime())) return "";

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
  };
  static parseMoney = (value: string | number): number => {
  if (!value) return 0;

  if (typeof value === "number") return value;

  // Loại bỏ tất cả dấu phẩy
  const numStr = value.replace(/,/g, "");
  return Number(numStr);
};
   static toDayString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  // Lấy ngày cách đây 7 ngày dạng yyyy-MM-dd
  static lastWeekString() {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  static formatDMYLocal(date?: string | Date | null) {
    if (!date) return "";

    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }

    if (typeof date === "string") {
      return date.split("T")[0];
    }

    return "";
  }
    // format tiền VN
  static formatCurrency(value: string) {
      if (!value) return "";
      // Giữ lại dấu âm nếu có
      const isNegative = value.startsWith("-");

      // Lấy số và bỏ ký tự khác
      const numeric = value.replace(/[^0-9]/g, "");

      // Format dạng 1.234.567
      const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      // Trả lại số âm nếu ban đầu là âm
      return isNegative ? "-" + formatted : formatted;
  };
  static camelToSnake(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(v => this.camelToSnake(v));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        acc[snakeKey] = this.camelToSnake(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  }
  static toInt (v: any){
     return v == null ? "" : typeof v === "number" ? v : parseInt(String(v).replace(/\D/g, ""), 10) || "";
  }
  static diffDays = (fromDate: string | Date): number => {
    const from = new Date(fromDate);
    const today = new Date();

    from.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - from.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };
  static getMonthlyCycles = () => {
      const currentYear = new Date().getFullYear();
      const years = [currentYear - 1, currentYear, currentYear + 1];

      const cycles: string[] = [];

      years.forEach(year => {
        for (let month = 1; month <= 12; month++) {
          const mm = month.toString().padStart(2, "0");
          cycles.push(`${mm}${year}`);
        }
      });
      return cycles;
  };
  static getNextMonthCycle = (cycle: string) => {
    const month = parseInt(cycle.slice(0, 2), 10);
    const year = parseInt(cycle.slice(2), 10);

    if (month === 12) {
      return `01${year + 1}`;
    }
    return `${String(month + 1).padStart(2, "0")}${year}`;
  };
  static getCurrentMonthCycle = () => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    return `${mm}${yyyy}`;
  };
  static findBreadcrumb(
    items: any[],
    pathname: string,
    parents: any[] = []
  ): any[] | null {
    for (const item of items) {
    const current = [...parents, item];

    // match chính xác
    if (item.route === pathname) {
      return current;
    }

    // match route con (trừ '/')
    if (
      item.route &&
      item.route !== '/' &&
      pathname.startsWith(item.route + '/')
    ) {
      return current;
    }

    if (item.items && item.items.length > 0) {
      const found = this.findBreadcrumb(item.items, pathname, current);
      if (found?.length) return found;
    }
  }
  return [];
  }
}
