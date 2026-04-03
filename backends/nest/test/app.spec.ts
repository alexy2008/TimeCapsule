import { Test } from '@nestjs/testing';
import { CapsulesService } from '../src/capsules/capsules.service';
import { DatabaseService } from '../src/database/database.service';
import { HealthService } from '../src/health/health.service';
import { CapsulesModule } from '../src/capsules/capsules.module';
import { HealthModule } from '../src/health/health.module';

describe('Nest backend', () => {
  let capsulesService: CapsulesService;
  let healthService: HealthService;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CapsulesModule, HealthModule],
    }).compile();

    capsulesService = moduleRef.get(CapsulesService);
    healthService = moduleRef.get(HealthService);
    databaseService = moduleRef.get(DatabaseService);
  });

  beforeEach(() => {
    databaseService.exec('DELETE FROM capsules');
  });

  it('health returns UP', () => {
    const health = healthService.getHealth();
    expect(health.status).toBe('UP');
    expect(health.techStack.framework).toBe('NestJS 11');
  });

  it('can create and fetch a locked capsule', () => {
    const created = capsulesService.createCapsule({
      title: 'Nest 测试',
      content: '秘密',
      creator: '测试者',
      openAt: new Date(Date.now() + 60_000).toISOString(),
    });

    expect(created.code).toHaveLength(8);
    expect('content' in created).toBe(false);

    const fetched = capsulesService.getCapsule(created.code);
    expect(fetched.opened).toBe(false);
    expect(fetched.content).toBeNull();
  });
});
