import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapsuleFormComponent } from '../../app/components/capsule-form/capsule-form.component';

describe('CapsuleFormComponent', () => {
  let fixture: ComponentFixture<CapsuleFormComponent>;
  let component: CapsuleFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapsuleFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapsuleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate empty fields', () => {
    const valid = component.validate();
    expect(valid).toBeFalse();
    expect(component.errors.title).toBeTruthy();
    expect(component.errors.content).toBeTruthy();
    expect(component.errors.creator).toBeTruthy();
    expect(component.errors.openAt).toBeTruthy();
  });

  it('should validate past openAt date', () => {
    component.form.title = '测试标题';
    component.form.content = '测试内容';
    component.form.creator = '测试者';
    component.form.openAt = '2000-01-01T00:00';
    const valid = component.validate();
    expect(valid).toBeFalse();
    expect(component.errors.openAt).toContain('未来');
  });

  it('should pass validation with valid data', () => {
    component.form.title = '测试标题';
    component.form.content = '测试内容';
    component.form.creator = '测试者';
    component.form.openAt = '2099-12-31T23:59';
    const valid = component.validate();
    expect(valid).toBeTrue();
  });

  it('should emit formSubmit with valid data', () => {
    const emitSpy = spyOn(component.formSubmit, 'emit');
    component.form = {
      title: '测试标题',
      content: '测试内容',
      creator: '测试者',
      openAt: '2099-12-31T23:59',
    };
    component.handleSubmit();
    expect(emitSpy).toHaveBeenCalledWith({
      title: '测试标题',
      content: '测试内容',
      creator: '测试者',
      openAt: '2099-12-31T23:59',
    });
  });

  it('should not emit formSubmit with invalid data', () => {
    const emitSpy = spyOn(component.formSubmit, 'emit');
    component.handleSubmit();
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
