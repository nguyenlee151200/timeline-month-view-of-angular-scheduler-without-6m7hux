import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { extend } from '@syncfusion/ej2-base';
import { ScheduleComponent, EventRenderedArgs, View, TimelineMonthService, GroupModel, EventSettingsModel, ResizeService, DragAndDropService
} from '@syncfusion/ej2-angular-schedule';
import { timelineResourceData, resourceData } from './data';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [TimelineMonthService, ResizeService, DragAndDropService]
})

export class AppComponent {
    
    @ViewChild('scheduleObj')
    public scheduleObj: ScheduleComponent;

    public selectedDate: Date = new Date(2018, 3, 4);
    public currentView: View = 'TimelineMonth';
    public group: GroupModel = {
        resources: ['Projects', 'Categories']
    };
    public projectDataSource: Object[] = [
        { text: 'PROJECT 1', id: 1, color: '#cb6bb2' },
        { text: 'PROJECT 2', id: 2, color: '#56ca85' },
    ];
    public categoryDataSource: Object[] = [
        { text: 'Nancy', id: 1, groupId: 1, color: '#df5286' },
        { text: 'Robert', id: 3, groupId: 2, color: '#ea7a57' },
        { text: 'Smith', id: 4, groupId: 2, color: '#5978ee' },
    ];
    public allowMultiple: Boolean = true;
    public eventSettings: EventSettingsModel = {
        dataSource: <Object[]>extend([], resourceData.concat(timelineResourceData), null, true)
    };
    private dayWidth: number = null;
    onActionComplete(args): void {
        if (
          args.requestType === 'viewNavigate' ||
          args.requestType === 'dateNavigate'
        ) {
          this.dayWidth = null;
        }
      }
    onEventRendered(args: EventRenderedArgs) {
        if (this.currentView === 'TimelineMonth') {
          this.dayWidth = this.dayWidth ??
            document.querySelector('.e-date-header-wrap').clientWidth /
              (new Date(
                this.selectedDate.getFullYear(),
                this.selectedDate.getMonth() + 1,
                0
              ).getDate() * this.scheduleObj.activeViewOptions.interval); //to calculate the width of a work cell    
          const diffInDay = args.data.data.count; //to calculate number of days an event rendered.
          const td: HTMLElement= (document.querySelector('.e-work-cells[data-date="' + this.resetTime(args.data.StartTime).getTime() + '"]')); //to find the work cell element in which the appointment started
          const left = (td) ? td.offsetLeft: args.element.style.left; //to calculate the left position of that work cell
          args.element.style.left = left + 'px'; //to assign the above left position to the appointment element
          args.element.style.width = (diffInDay) * this.dayWidth + 'px'; //to set width for the appointment element.
        }
      }
    resetTime(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
}
