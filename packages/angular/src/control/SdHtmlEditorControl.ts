import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Injector, Input, Output} from "@angular/core";
import {SdTypeValidate} from "../decorator/SdTypeValidate";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {SdControlBase, SdStyleProvider} from "../provider/SdStyleProvider";

@Component({
  selector: "sd-html-editor",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sd-dock-container>
      <sd-dock class="_toolbar" *ngIf="!disabled">
        <a (click)="viewState = 'preview'" [class._selected]="viewState === 'preview'">
          <sd-icon [icon]="'eye'"></sd-icon>
        </a>
        <a (click)="viewState = 'edit'" [class._selected]="viewState === 'edit'">
          <sd-icon [icon]="'pen'"></sd-icon>
        </a>
        <a (click)="viewState = 'code'" [class._selected]="viewState === 'code'">
          <sd-icon [icon]="'code'"></sd-icon>
        </a>
        <ng-container *ngIf="rowsButton && !inset && viewState === 'code'">
          |
          <a (click)="rows = rows + 1">
            <sd-icon [icon]="'plus'"></sd-icon>
          </a>
          <a (click)="rows = rows - 1" *ngIf="rows > 1">
            <sd-icon [icon]="'minus'"></sd-icon>
          </a>
        </ng-container>
      </sd-dock>

      <sd-pane>
        <div *ngIf="viewState !== 'code' || disabled"
             [attr.contenteditable]="viewState === 'edit' && !disabled"
             [innerHTML]="content"
             (input)="onContentInput($event)"></div>
        <textarea *ngIf="viewState === 'code' && !disabled"
                  [value]="value || ''"
                  [rows]="inset ? undefined : rows"
                  [style.resize]="inset ? 'none' : resize"
                  (input)="onTextareaInput($event)"></textarea>
      </sd-pane>
    </sd-dock-container>`
})
export class SdHtmlEditorControl extends SdControlBase {
  public sdInitStyle(vars: SdStyleProvider): string {
    return /* language=LESS */ `
      :host {
        display: block;
        border: 1px solid ${vars.transColor.default};

        > sd-dock-container {
          > ._toolbar {
            user-select: none;

            > a {
              display: inline-block;
              padding: ${vars.gap.sm} 0;
              text-align: center;
              width: ${vars.stripUnit(vars.gap.sm) * 2 + vars.stripUnit(vars.lineHeight) * vars.stripUnit(vars.fontSize.default)}px;

              &:hover {
                background: rgba(0, 0, 0, .05);
              }

              &._selected {
                background: ${vars.themeColor.primary.default};
                color: ${vars.textReverseColor.default};
              }
            }
          }

          > sd-pane {
            > div {
              ${vars.formControlBase};
              height: 100%;

              &[contenteditable=true] {
                cursor: text;
                background: ${vars.themeColor.info.lightest};
              }
            }

            > textarea {
              ${vars.formControlBase};
              height: 100%;
              background: ${vars.themeColor.info.lightest};
              border: none;
              transition: outline-color .1s linear;
              outline: 1px solid transparent;
              outline-offset: -1px;

              &::-webkit-input-placeholder {
                color: ${vars.textColor.lighter};
              }

              &:focus {
                outline-color: ${vars.themeColor.primary.default};
              }
            }
          }
        }

        &[sd-inset=true] {
          height: 100%;
          border: none;
        }
      }`;
  }

  @Input()
  @SdTypeValidate(String)
  public get value(): string | undefined {
    return this._value;
  }

  public set value(value: string | undefined) {
    if (this._value !== value) {
      this._value = value;
      this.content = this._sanitizer.bypassSecurityTrustHtml(value || "");
    }
  }

  private _value?: string;

  @Output()
  public readonly valueChange = new EventEmitter<string>();

  @Input()
  @SdTypeValidate({type: String, validator: value => ["preview", "edit", "code"].includes(value)})
  public viewState: "preview" | "edit" | "code" = "edit";

  @Input()
  @SdTypeValidate({type: Boolean, notnull: true})
  public rowsButton = true;

  @Input()
  @SdTypeValidate({type: Number, notnull: true})
  public rows = 3;

  @Input()
  @SdTypeValidate(Boolean)
  @HostBinding("attr.sd-inset")
  public inset?: boolean;

  @Input()
  @SdTypeValidate(Boolean)
  @HostBinding("attr.sd-disabled")
  public disabled?: boolean;

  @Input()
  @SdTypeValidate({
    type: String,
    notnull: true,
    validator: value => ["both", "horizontal", "vertical", "none"].includes(value)
  })
  public resize = "vertical";

  public content: SafeHtml = "";

  public constructor(injector: Injector,
                     private readonly _sanitizer: DomSanitizer) {
    super(injector);
  }

  public onTextareaInput(event: Event): void {
    const textareaEl = event.target as HTMLTextAreaElement;
    this._value = textareaEl.value;
    this.valueChange.emit(this._value);
  }

  public onContentInput(event: Event): void {
    const editorEl = event.target as HTMLDivElement;
    this._value = editorEl.innerHTML;
    this.valueChange.emit(this._value);
  }
}