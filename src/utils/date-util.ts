import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export class DateUtil {
  static isValidDate(date: string): boolean {
    return dayjs(date, "DD/MM/YYYY", true).isValid();
  }
  static isValidDateUS(date: string): boolean {
    return dayjs(date, "YYYY-MM-DD", true).isValid();
  }
}
