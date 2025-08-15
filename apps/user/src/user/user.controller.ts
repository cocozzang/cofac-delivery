import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UserMicroService } from '@app/common';

@Controller('user')
export class UserController implements UserMicroService.UserServiceController {
  constructor(private readonly userService: UserService) {}

  getUserinfo(request: UserMicroService.GetUserInfoRequest) {
    return this.userService.getUserById(request.userId);
  }
}
