import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./decorators/public.decorator";
import { REQUIRED_ROLE_KEY } from "./decorators/admin.decorator";
import { TemporaryAccessService } from "./temporary-access.service";
import { Role } from "@domain/users/enums/user-role.enum";

type JwtUser = {
  userId: string;
  email: string;
  role: Role;
  roleDescription?: string;
};

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector, private readonly access: TemporaryAccessService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const allowed = await super.canActivate(context);
    const request = context.switchToHttp().getRequest<{ user: { role: Role; folderIds: string[] }; method: string; params: Record<string, string>; body: unknown }>();
    if (request.user.role === Role.TEMPORARY) {
      await this.access.authorize(context.getClass().name, request.method, request.params, request.body, request.user.folderIds);
    }
    return Boolean(allowed);
  }

  handleRequest<TUser = JwtUser>(
    err: unknown,
    user: unknown,
    info: unknown,
    context: ExecutionContext,
  ): TUser {
    if (!user || typeof user !== "object" || !("userId" in user)) {
      throw new UnauthorizedException("Token inválido");
    }

    const requiredRole = this.reflector.getAllAndOverride<Role>(
      REQUIRED_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRole) {
      const jwtUser = user as JwtUser;

      if (jwtUser.role !== requiredRole) {
        throw new ForbiddenException("Acesso permitido somente para admins");
      }
    }

    return user as TUser;
  }
}
