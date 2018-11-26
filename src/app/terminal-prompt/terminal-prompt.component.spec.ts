import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalPromptComponent } from './terminal-prompt.component';

describe('TerminalPromptComponent', () => {
  let component: TerminalPromptComponent;
  let fixture: ComponentFixture<TerminalPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
