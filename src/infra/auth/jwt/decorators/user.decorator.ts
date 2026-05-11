import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../jwt.type";

export const User = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext): JwtPayload => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = request.user;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data ? user?.[data] : user;
  },
);
