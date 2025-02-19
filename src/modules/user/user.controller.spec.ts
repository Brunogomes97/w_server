import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('deve criar um usuário com sucesso', async () => {
    const mockUser: CreateUserDTO = {
      username: 'testuser',
      email: 'test@example.com',
      password: '123456',
    };

    const mockResponse = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
    };

    jest.spyOn(userService, 'create').mockResolvedValue(mockResponse);

    const result = await userController.create(mockUser);

    const createSpy = jest.spyOn(userService, 'create');

    expect(result).toEqual(mockResponse);
    expect(createSpy).toHaveBeenCalledWith(mockUser);
  });

  it('deve capturar erros e repassá-los', async () => {
    jest.spyOn(userService, 'create').mockRejectedValue(new Error('Erro ao criar usuário'));

    await expect(userController.create({ username: 'testuser', email: 'test@example.com', password: '123456' }))
      .rejects.toThrow('Erro ao criar usuário');
  });
});
