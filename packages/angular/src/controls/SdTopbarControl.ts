import {ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, Output} from "@angular/core";
import {SdSidebarContainerControl} from "./SdSidebarControl";

@Component({
    selector: "sd-topbar-container",
    template: `
        <ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SdTopbarContainerControl {
}

@Component({
    selector: "sd-topbar",
    template: `
        <a class="_sidebar-toggle-button"
           *ngIf="main"
           (click)="toggleSidebar()">
            <span></span>
            <span></span>
            <span></span>
        </a>
        <a class="_close-button"
           *ngIf="closable"
           (click)="onCloseButtonClick()">
            <i class="fas fa-fw fa-times"></i>
        </a>
        <ng-content></ng-content>
        <div class="_button-group">
            <ng-content select="sd-topbar-button,sd-topbar-file-button"></ng-content>
        </div>`,
    host: {
        "[class._not-main]": "!main"
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SdTopbarControl {
    @Input() main = true;
    @Input() closable = false;
    @Output("close.click") closeClick = new EventEmitter<void>();

    constructor(private _injector: Injector) {
    }

    toggleSidebar(): void {
        //tslint:disable-next-line:no-null-keyword
        const sidebarContainer = this._injector.get(SdSidebarContainerControl, null);
        sidebarContainer.toggled = !sidebarContainer.toggled;
    }

    onCloseButtonClick(): void {
        this.closeClick.emit();
    }
}

@Component({
    selector: "sd-topbar-button",
    template: `
        <a>
            <ng-content></ng-content>
        </a>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SdTopbarButtonControl {
}

@Component({
    selector: "sd-topbar-file-button",
    template: `
        <label>
            <input type="file"
                   hidden
                   (change)="onChange($event)"/>
            <ng-content></ng-content>
        </label>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SdTopbarFileButtonControl {
    @Output("file.change") fileChange = new EventEmitter<File>();

    onChange(event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        this.fileChange.emit(event.target!["files"][0]);
        $(event.target!).val("");
    }
}