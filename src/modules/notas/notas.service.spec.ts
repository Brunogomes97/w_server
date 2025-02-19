import { Test, TestingModule } from '@nestjs/testing';
import { NotasService } from './notas.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { FindAllQueryDto } from './dto/get-notas.dto';
import { Nota } from './entities/nota.entity';
import { FindAllResponse } from 'src/types/querys';
import { EntityNotFoundError } from 'src/errors/entityNotFound.error';
import { PrismaService } from '../../db/prisma.service';

describe('NotasService', () => {
  let service: NotasService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotasService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    service = module.get<NotasService>(NotasService);
    prismaMock = module.get(PrismaService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma nova nota', async () => {
      const mockNota = { id: 'uuid-nota', title: 'Teste', description: 'Desc', type: 'tipo', userId: 'uuid-user', createdAt: new Date() };
      const userMock = { id: 'uuid-user', username: "testuser", email: "test@example.com" };
      prismaMock.notas.create.mockResolvedValue(mockNota);

      const result = await service.create({ title: 'Teste', description: 'Desc', type: 'tipo' }, userMock);

      expect(result).toEqual(expect.objectContaining({
        id: 'uuid-nota',
        title: 'Teste',
        description: 'Desc',
        type: 'tipo',
      }));


    });
  });

  describe('findAll', () => {
    it('deve retornar todas as notas do usuário', async () => {
      const mockNotas = [
        {
          id: 'uuid-nota',
          title: 'Teste',
          description: 'Desc',
          type: 'tipo',
          userId: 'uuid-user',
          createdAt: new Date(),
        },
      ];


      prismaMock.notas.findMany.mockResolvedValue(mockNotas);
      prismaMock.notas.count.mockResolvedValue(1);

      const queryDto: FindAllQueryDto = {
        offset: 0,
        limit: 10,
        type: 'someType',
        order: 'asc',
        search: undefined,
      };

      const result: FindAllResponse = await service.findAll(queryDto, { id: 'uuid-user', username: "testuser", email: "test@example.com" });


      const baseData: Nota = {
        id: 'uuid-nota',
        title: 'Teste',
        description: 'Desc',
        type: 'tipo',
        userId: 'uuid-user',
        createdAt: mockNotas[0].createdAt,
      };

      expect(result).toEqual(expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.arrayContaining([
          expect.objectContaining(baseData),
        ]),
        total_items: 1,
        offset: 0,
        limit: 10,
      }));


    });
  });

  describe('findOne', () => {
    it('deve retornar uma nota específica', async () => {
      const mockNota = { id: 'uuid-nota', title: 'Teste', description: 'Desc', type: 'tipo', userId: 'uuid-user', createdAt: new Date() };
      prismaMock.notas.findFirst.mockResolvedValue(mockNota);

      const result = await service.findOne('uuid-nota', { id: 'uuid-user', username: "testuser", email: "test@example.com" });
      expect(result).toEqual(mockNota);
    });

    it('deve retornar null se a nota não for encontrada', async () => {
      prismaMock.notas.findFirst.mockResolvedValue(null);

      const result = await service.findOne('uuid-nota', { id: 'uuid-user', username: "testuser", email: "test@example.com" });

      expect(result).toBeNull();
    });

  });

  describe('update', () => {
    it('deve atualizar uma nota existente', async () => {
      const mockNota = { id: 'uuid-nota', title: 'Teste', description: 'Desc', type: 'tipo', userId: 'uuid-user', createdAt: new Date() };
      prismaMock.notas.findFirst.mockResolvedValue(mockNota);
      prismaMock.notas.update.mockResolvedValue(mockNota);

      const result = await service.update('uuid-nota', { title: 'Atualizado', description: 'Atualizado', type: 'Atualizado' },
        { id: 'uuid-user', username: "testuser", email: "test@example.com" });
      expect(result).toEqual(mockNota);
    });

    it('deve lançar erro se a nota não existir', async () => {
      prismaMock.notas.findFirst.mockResolvedValue(null);

      await expect(service.update('uuid-nota', { title: 'Atualizado', description: 'Atualizado', type: 'Atualizado' },
        { id: 'uuid-user', username: "testuser", email: "test@example.com" }
      )).rejects.toThrow(EntityNotFoundError);
    });

  });

  describe('remove', () => {
    it('deve remover uma nota existente', async () => {
      const mockNota = { id: 'uuid-nota', title: 'Teste', description: 'Desc', type: 'tipo', userId: 'uuid-user', createdAt: new Date() };
      prismaMock.notas.findFirst.mockResolvedValue(mockNota);
      prismaMock.notas.delete.mockResolvedValue(mockNota);

      const result = await service.remove('uuid-nota', { id: 'uuid-user', username: "testuser", email: "test@example.com" });
      expect(result).toEqual(mockNota);
    });
    it('deve lançar erro se a nota não existir', async () => {
      prismaMock.notas.findFirst.mockResolvedValue(null);
      await expect(service.remove('uuid-nota', { id: 'uuid-user', username: "testuser", email: "test@example.com" })
      ).rejects.toThrow(EntityNotFoundError);
    });
  });


  describe('removeMany', () => {
    it('deve remover múltiplas notas existentes', async () => {
      const mockNotas = [
        { id: 'uuid-nota-1', title: 'Teste 1', description: 'Desc 1', type: 'tipo', userId: 'uuid-user', createdAt: new Date() },
        { id: 'uuid-nota-2', title: 'Teste 2', description: 'Desc 2', type: 'tipo', userId: 'uuid-user', createdAt: new Date() }
      ];

      prismaMock.notas.findMany.mockResolvedValue(mockNotas);
      prismaMock.notas.deleteMany.mockResolvedValue({ count: 2 });

      const result = await service.removeMany(['uuid-nota-1', 'uuid-nota-2'], { id: 'uuid-user', username: "testuser", email: "test@example.com" });

      expect(result).toEqual({ count: 2 });
    });

    it('deve lançar erro se alguma nota não for encontrada', async () => {
      const mockNotas = [{ id: 'uuid-nota-1', title: 'Teste 1', description: 'Desc 1', type: 'tipo', userId: 'uuid-user', createdAt: new Date() }];

      prismaMock.notas.findMany.mockResolvedValue(mockNotas);

      await expect(service.removeMany(['uuid-nota-1', 'uuid-nota-2'], { id: 'uuid-user', username: "testuser", email: "test@example.com" })
      ).rejects.toThrow(EntityNotFoundError);
    });
  });

});
