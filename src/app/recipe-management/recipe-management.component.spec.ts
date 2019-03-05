import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeManagementPage } from './recipe-management.page';

describe('RecipeManagementPage', () => {
  let component: RecipeManagementPage;
  let fixture: ComponentFixture<RecipeManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeManagementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
