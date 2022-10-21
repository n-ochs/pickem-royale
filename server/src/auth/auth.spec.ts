// import { Response } from 'express';

// import { AuthController } from '@auth/auth.controller';
// import { AuthService } from '@auth/auth.service';
// import { AuthDto } from '@auth/dto';
// import { Test, TestingModule } from '@nestjs/testing';

// describe('testing the tests', () => {
// 	it.todo('should pass');
// });

// describe('Auth', () => {
// 	let authController: AuthController;
// 	let authService: AuthService;
// 	let dto: AuthDto;
// 	let res: Response;

// 	beforeEach(async () => {
// 		const moduleRef: TestingModule = await Test.createTestingModule({
// 			controllers: [AuthController],
// 			providers: [AuthService]
// 		}).compile();

// 		authService = moduleRef.get<AuthService>(AuthService);
// 		authController = moduleRef.get<AuthController>(AuthController);
// 		// prismaService = moduleRef.get<PrismaService>(PrismaService);
// 		dto = new AuthDto();
// 		dto.email = 'nick.ochs@yahoo.com';
// 		dto.password = process.env.ADMIN_PW;
// 	});

// 	describe('signIn', () => {
// 		it('should sign a user in', async () => {
// 			const result: void = null;
// 			jest.spyOn(authService, 'signIn').mockImplementation(async () => result);

// 			expect(await authController.signIn(dto, res)).toBe(result);
// 		});
// 	});
// });
