import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Injector,
  Input
} from "@angular/core";
import {SdTypeValidate} from "../decorator/SdTypeValidate";
import {SdControlBase, SdStyleProvider} from "../provider/SdStyleProvider";

@Component({
  selector: "sd-modal",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="_backdrop" (click)="onBackdropClick()"></div>
    <div class="_dialog" tabindex="0">
      <sd-dock-container>
        <sd-dock class="_header sd-background-primary-default">
          <h5 class="_title">{{ title }}</h5>
          <a class="_close-button"
             (click)="onCloseButtonClick()"
             *ngIf="!hideCloseButton">
            <sd-icon [icon]="'times'" [fixedWidth]="true"></sd-icon>
          </a>
        </sd-dock>

        <sd-pane class="_content">
          <ng-content></ng-content>
        </sd-pane>
      </sd-dock-container>
    </div>`
})
export class SdModalControl extends SdControlBase {
  public sdInitStyle(vars: SdStyleProvider): string {
    return /* language=LESS */ `
      :host {
        display: block;
        position: absolute;
        z-index: ${vars.zIndex.modal};
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        padding-top: 25px;

        > ._backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, .6);
        }

        > ._dialog {
          position: relative;
          display: inline-block;
          text-align: left;
          margin: 0 auto;
          //background: get($theme-color, bluegrey, darkest);
          background: white;
          overflow: hidden;
          max-width: 100%;
          min-width: 240px;
          max-height: calc(100% - 50px);
          //border: 1px solid get($trans-color, default);

          &:focus {
            outline-color: transparent;
          }

          > sd-dock-container {
            > ._header {
              /*border-bottom: 1px solid get($trans-color, default);*/

              > ._title {
                display: inline-block;
                padding: ${vars.gap.sm} ${vars.gap.default};
              }

              > ._close-button {
                float: right;
                cursor: pointer;
                text-align: center;
                padding: ${vars.gap.sm} ${vars.gap.default};

                &:hover {
                  background: rgba(0, 0, 0, .1);
                }

                &:active {
                  background: rgba(0, 0, 0, .2);
                }
              }
            }
          }
        }

        opacity: 0;
        transition: opacity .3s ease-in-out;
        pointer-events: none;

        > ._dialog {
          transform: translateY(-25px);
          transition: transform .3s ease-in-out;
        }

        &[sd-open=true] {
          opacity: 1;
          pointer-events: auto;

          > ._dialog {
            transform: none;
          }
        }

        @media ${vars.media.mobile} {
          padding-top: 0;

          > ._dialog {
            width: 100%;
            height: 100%;
            max-height: 100%;
          }
        }
      }`;
  }

  @Input()
  @SdTypeValidate({type: String, notnull: true})
  public title!: string;

  @Input()
  @SdTypeValidate(Boolean)
  public hideCloseButton?: boolean;

  @Input()
  @SdTypeValidate(Boolean)
  @HostBinding("attr.sd-open")
  public open?: boolean;

  public close = new EventEmitter<any>();

  public constructor(injector: Injector) {
    super(injector);
  }

  public onBackdropClick(): void {
    if (this.hideCloseButton) {
      return;
    }

    this.onCloseButtonClick();
  }

  public onCloseButtonClick(): void {
    this.open = false;
    this.close.emit();
  }

  @HostListener("keydown", ["$event"])
  public onKeydown(event: KeyboardEvent): void {
    if (this.hideCloseButton) {
      return;
    }

    if (event.key === "Escape") {
      this.onCloseButtonClick();
    }
  }

  @HostListener("document:backbutton", ["$event"])
  public onAndroidBackButtonTouch(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.hideCloseButton) {
      return;
    }

    this.onCloseButtonClick();
  }
}