import { Test, TestingModule } from '@nestjs/testing';
import { NotasController } from './notas.controller';
import { NotasService } from './notas.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { FindAllQueryDto } from './dto/get-notas.dto';
import { AuthRequest } from 'src/types/HttpRequest';
import { FindNotas, FindOneNotaParams } from './dto/find-notas.dto';
import { AuthGuard } from '../auth/auth.guard';

describe('NotasController', () => {
  let controller: NotasController;
  let serviceMock: DeepMockProxy<NotasService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotasController],
      providers: [{ provide: NotasService, useValue: mockDeep<NotasService>() }],
    }).overrideGuard(AuthGuard) // Sobrescreve o AuthGuard
      .useValue({
        canActivate: jest.fn(() => true), // Sempre permite a requisição
      })
      .compile();

    controller = module.get<NotasController>(NotasController);
    serviceMock = module.get(NotasService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma nova nota', async () => {
      const mockNota = {
        id: 'uuid-nota',
        title: 'Teste',
        description: 'Desc',
        type: 'tipo',
        userId: 'uuid-user',
        createdAt: new Date(),
        iat: Date.now() // Adicionando a propriedade esperada
      };
      serviceMock.create.mockResolvedValue(mockNota);

      const mockRequest = { user: { id: 'uuid-user' } } as AuthRequest;
      const result = await controller.create({ title: 'Teste', description: 'Desc', type: 'tipo' }, mockRequest);


      expect(result).toEqual(mockNota);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as notas do usuário', async () => {
      const mockNotas = [{ id: 'uuid-nota', title: 'Teste', description: 'Desc', type: 'tipo', userId: 'uuid-user', createdAt: new Date() }];
      serviceMock.findAll.mockResolvedValue({ data: mockNotas, total_items: 1, offset: 0, limit: 10 });

      const queryDto: FindAllQueryDto = { offset: 0, limit: 10, type: 'someType', order: 'asc', search: undefined };
      const mockRequest = { user: { id: 'uuid-user' } } as AuthRequest;
      const result = await controller.findAll(queryDto, mockRequest);

      expect(result).toEqual({ data: mockNotas, total_items: 1, offset: 0, limit: 10 });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma nota específica', async () => {
      const mockNota = { id: 'uuid-nota', title: 'Teste', description: 'Desc', type: 'tipo', userId: 'uuid-user', createdAt: new Date() };
      serviceMock.findOne.mockResolvedValue(mockNota);

      const mockRequest = { user: { id: 'uuid-user' } } as AuthRequest;
      const result = await controller.findOne({ id: 'uuid-nota' }, mockRequest);
      expect(result).toEqual(mockNota);
    });

    it('deve retornar null se a nota não for encontrada', async () => {
      serviceMock.findOne.mockResolvedValue(null);

      const result = await controller.findOne({ id: 'uuid-nota' }, { user: { id: 'uuid-user' } } as AuthRequest);

      expect(result).toBeNull();
    });


  });

  describe('update', () => {
    it('deve atualizar uma nota existente', async () => {
      const mockNota = { id: 'uuid-nota', title: 'Atualizado', description: 'Atualizado', type: 'Atualizado', userId: 'uuid-user', createdAt: new Date() };
      serviceMock.update.mockResolvedValue(mockNota);

      const params = { id: 'uuid-nota' } as FindOneNotaParams;
      const mockRequest = { user: { id: 'uuid-user' } } as AuthRequest;

      const result = await controller.update(params, { title: 'Atualizado', description: 'Atualizado', type: 'Atualizado' }, mockRequest);

      expect(result).toEqual(mockNota);


    });
  });

  describe('remove', () => {
    it('deve remover uma nota existente', async () => {
      const mockNota = { id: 'uuid-nota', title: 'Teste', description: 'Desc', type: 'tipo', userId: 'uuid-user', createdAt: new Date() };
      serviceMock.remove.mockResolvedValue(mockNota);

      const params = { id: 'uuid-nota' } as FindOneNotaParams;
      const mockRequest = { user: { id: 'uuid-user' } } as AuthRequest;

      const result = await controller.remove(params, mockRequest);
      expect(result).toEqual(mockNota);
    });
  });

  describe('removeMany', () => {
    it('deve remover múltiplas notas existentes', async () => {
      serviceMock.removeMany.mockResolvedValue({ count: 2 });

      const params = { ids: ['uuid-nota-1', 'uuid-nota-2'] } as FindNotas;
      const mockRequest = { user: { id: 'uuid-user' } } as AuthRequest;

      const result = await controller.removeMany(params, mockRequest);

      expect(result).toEqual({ count: 2 });

    });
  });
});
