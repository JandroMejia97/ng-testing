import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HighlightDirective } from 'src/app/directives/highlight.directive';
import { ReversePipe } from 'src/app/pipes/reverse.pipe';

import { OthersComponent } from './others.component';

describe('OthersComponent', () => {
  let component: OthersComponent;
  let fixture: ComponentFixture<OthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OthersComponent, HighlightDirective, ReversePipe],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
