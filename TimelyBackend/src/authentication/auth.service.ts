import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserWithoutPassword } from 'src/user/type/user-without-password.type';

@Injectable()
export class AuthService 
{
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) 
    {}

    async validateUser(email: string, password: string): Promise<UserWithoutPassword | null>
    {
        const user = await this.userService.findUserWithPasswordByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) 
        {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    //use in login
    async login(user: UserWithoutPassword)
    {
        const payload = { sub : user.id, username: user.username, email: user.email, fullname: user.fullname };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
