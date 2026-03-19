import { Controller, Get } from '@nestjs/common';
import { ProfileIntakeService } from './profile-intake.service';
import { Profile } from './dto/profile.dto';

@Controller('profile')
export class ProfileIntakeController {
  constructor(private readonly profileIntakeService: ProfileIntakeService) {}

  @Get('current')
  getCurrentProfile(): Promise<Profile> {
    return this.profileIntakeService.currentProfile();
  }
}
