import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapsuleCardComponent } from '../../app/components/capsule-card/capsule-card.component';
import type { Capsule } from '../../app/types';

describe('CapsuleCardComponent', () => {
  let fixture: ComponentFixture<CapsuleCardComponent>;
  let component: CapsuleCardComponent;

  const openedCapsule: Capsule = {
    code: 'ABCD1234',
    title: '已开启的胶囊',
    content: '这是胶囊的内容',
    creator: '测试者',
    openAt: '2020-01-01T00:00:00Z',
    createdAt: '2019-01-01T00:00:00Z',
    opened: true,
  };

  const lockedCapsule: Capsule = {
    code: 'LOCK9999',
    title: '未开启的胶囊',
    creator: '测试者',
    openAt: '2099-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    opened: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapsuleCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapsuleCardComponent);
    component = fixture.componentInstance;
  });

  it('should display title and creator', () => {
    component.capsule = openedCapsule;
    fixture.detectChanges();
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('已开启的胶囊');
    expect(text).toContain('测试者');
  });

  it('should show content when capsule is opened', () => {
    component.capsule = openedCapsule;
    fixture.detectChanges();
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('这是胶囊的内容');
    expect(text).toContain('已开启');
  });

  it('should hide content when capsule is locked', () => {
    component.capsule = lockedCapsule;
    fixture.detectChanges();
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('未开启的胶囊');
    expect(text).not.toContain('这是胶囊的内容');
    expect(text).toContain('未到时间');
  });

  it('should display capsule code', () => {
    component.capsule = openedCapsule;
    fixture.detectChanges();
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('ABCD1234');
  });
});
