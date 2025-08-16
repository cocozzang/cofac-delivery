import { Controller, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcInterceptor, UserMicroService } from '@app/common';

@UseInterceptors(GrpcInterceptor)
@Controller()
@UserMicroService.UserServiceControllerMethods()
export class UserController implements UserMicroService.UserServiceController {
  constructor(private readonly userService: UserService) {}

  getUserinfo(request: UserMicroService.GetUserInfoRequest) {
    return this.userService.getUserById(request.userId);
  }
}
