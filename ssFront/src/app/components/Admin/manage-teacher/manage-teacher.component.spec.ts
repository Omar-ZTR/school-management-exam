import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTeacherComponent } from './manage-teacher.component';

describe('ManageTeacherComponent', () => {
  let component: ManageTeacherComponent;
  let fixture: ComponentFixture<ManageTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTeacherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// [
//   {
//     group__id: 2,
//     Rank: 2,
//     group__name: 'group k',
//     subject: 'reacts',
//     createdAt: '2024-06-08T02:29:45.000Z',
//     updatedAt: '2024-06-08T02:29:45.000Z',
//   },
//   {
//     group__id: 3,
//     Rank: 3,
//     group__name: 'group B',
//     subject: 'angular',
//     createdAt: '2024-06-08T02:30:45.000Z',
//     updatedAt: '2024-06-08T02:30:45.000Z',
//   },
//   {
//     group__id: 4,
//     Rank: 4,
//     group__name: 'group C',
//     subject: 'vue',
//     createdAt: '2024-06-08T02:31:45.000Z',
//     updatedAt: '2024-06-08T02:31:45.000Z',
//   },
//   {
//     group__id: 5,
//     Rank: 5,
//     group__name: 'group D',
//     subject: 'nodejs',
//     createdAt: '2024-06-08T02:32:45.000Z',
//     updatedAt: '2024-06-08T02:32:45.000Z',
//   },
//   {
//     group__id: 6,
//     Rank: 6,
//     group__name: 'group E',
//     subject: 'express',
//     createdAt: '2024-06-08T02:33:45.000Z',
//     updatedAt: '2024-06-08T02:33:45.000Z',
//   },
// ][
//   ({
//     group__id: 2,
//     Rank: 2,
//     group__name: 'group k',
//     subject: 'reacts',
//     createdAt: '2024-06-08T02:29:45.000Z',
//     updatedAt: '2024-06-08T02:29:45.000Z',
//     TeacherGroup: { user__id: 3, group__id: 2 },
//   },
//   {
//     group__id: 3,
//     Rank: 3,
//     group__name: 'group B',
//     subject: 'angular',
//     createdAt: '2024-06-08T02:30:45.000Z',
//     updatedAt: '2024-06-08T02:30:45.000Z',
//     TeacherGroup: { user__id: 3, group__id: 3 },
//   },
//   {
//     group__id: 4,
//     Rank: 4,
//     group__name: 'group C',
//     subject: 'vue',
//     createdAt: '2024-06-08T02:31:45.000Z',
//     updatedAt: '2024-06-08T02:31:45.000Z',
//     TeacherGroup: { user__id: 3, group__id: 4 },
//   },
//   {
//     group__id: 5,
//     Rank: 5,
//     group__name: 'group D',
//     subject: 'nodejs',
//     createdAt: '2024-06-08T02:32:45.000Z',
//     updatedAt: '2024-06-08T02:32:45.000Z',
//     TeacherGroup: { user__id: 3, group__id: 5 },
//   },
//   {
//     group__id: 6,
//     Rank: 6,
//     group__name: 'group E',
//     subject: 'express',
//     createdAt: '2024-06-08T02:33:45.000Z',
//     updatedAt: '2024-06-08T02:33:45.000Z',
//     TeacherGroup: { user__id: 3, group__id: 6 },
//   })
// ];
