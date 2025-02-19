import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import { EntityAlreadyExistsError } from 'src/errors/entityAlreadyExists.error';
import { PrismaService } from '../../db/prisma.service';

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaService;

  //Registro de Providers
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve criar um usuário com sucesso', async () => {
    const mockUser: CreateUserDTO = {
      username: 'testuser',
      email: 'test@example.com',
      password: '123456',
    };

    //Simulando o comportamento do banco
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
    jest.spyOn(prisma.user, 'create').mockResolvedValue({
      id: '1',
      ...mockUser,
      password: 'hashedPassword',
    });

    const result = await userService.create(mockUser);

    //Resultado esperado
    expect(result).toEqual({
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
    });

    const findFirstSpy = jest.spyOn(prisma.user, 'findFirst');
    const createSpy = jest.spyOn(prisma.user, 'create');


    expect(findFirstSpy).toHaveBeenCalledWith({
      where: { email: mockUser.email },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        username: mockUser.username,
        email: mockUser.email,
        password: 'hashedPassword',
      },
    })
  });

  it('deve lançar um erro se o usuário já existir', async () => {
    const findFirstSpy = jest.spyOn(prisma.user, 'findFirst');
    const createSpy = jest.spyOn(prisma.user, 'create');

    //Simulando o comportamento do banco
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
    });


    await expect(userService.create({ username: 'testuser', email: 'test@example.com', password: '123456' }))
      .rejects.toThrow(EntityAlreadyExistsError);

    expect(findFirstSpy).toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
  });
});
