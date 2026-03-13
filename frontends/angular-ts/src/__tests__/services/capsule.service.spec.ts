import { CapsuleService } from '../../app/services/capsule.service';
import * as api from '../../app/api';
import type { Capsule } from '../../app/types';

describe('CapsuleService', () => {
  let service: CapsuleService;

  const mockCapsule: Capsule = {
    code: 'ABCD1234',
    title: '测试胶囊',
    content: '测试内容',
    creator: '测试者',
    openAt: '2030-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    opened: false,
  };

  beforeEach(() => {
    service = new CapsuleService();
  });

  it('should initialize with null capsule', () => {
    expect(service.capsule()).toBeNull();
    expect(service.loading()).toBeFalse();
    expect(service.error()).toBeNull();
  });

  it('should create capsule successfully', async () => {
    spyOn(api, 'createCapsule').and.returnValue(
      Promise.resolve({ success: true, data: mockCapsule })
    );

    const result = await service.create({
      title: '测试胶囊',
      content: '测试内容',
      creator: '测试者',
      openAt: '2030-01-01T00:00',
    });

    expect(result.code).toBe('ABCD1234');
    expect(service.capsule()).toEqual(mockCapsule);
    expect(service.loading()).toBeFalse();
    expect(service.error()).toBeNull();
  });

  it('should set error on create failure', async () => {
    spyOn(api, 'createCapsule').and.returnValue(
      Promise.reject(new Error('网络错误'))
    );

    await expectAsync(
      service.create({ title: '测试', content: '内容', creator: '测试者', openAt: '2030-01-01T00:00' })
    ).toBeRejected();

    expect(service.error()).toBe('网络错误');
    expect(service.loading()).toBeFalse();
  });

  it('should get capsule successfully', async () => {
    spyOn(api, 'getCapsule').and.returnValue(
      Promise.resolve({ success: true, data: mockCapsule })
    );

    const result = await service.get('ABCD1234');

    expect(result.code).toBe('ABCD1234');
    expect(service.capsule()).toEqual(mockCapsule);
  });

  it('should set error on get failure', async () => {
    spyOn(api, 'getCapsule').and.returnValue(
      Promise.reject(new Error('胶囊不存在'))
    );

    await expectAsync(service.get('NOTFOUND')).toBeRejected();
    expect(service.error()).toBe('胶囊不存在');
  });
});
