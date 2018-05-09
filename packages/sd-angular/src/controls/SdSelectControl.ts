import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Injector, Input, Output} from "@angular/core";
import {Exception} from "../../../sd-core/src/exceptions/Exception";
import {JsonConvert} from "../../../sd-core/src/utils/JsonConvert";
import {SdThemeString} from "../helpers/types";
import {SdButtonGroupControl} from "./SdButtonGroupControl";

@Component({
  selector: "sd-select",
  template: `
    <select [ngClass]="styleClass"
            [disabled]="disabled"
            [ngStyle]="getStyle()"
            [value]="valueJson"
            [required]="required"
            (change)="onChange($event)">
      <ng-content></ng-content>
    </select>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SdSelectControl {
  @Output() public readonly valueChange = new EventEmitter<any>();
  @Input() public keyField: string | undefined;
  @Input() public theme?: SdThemeString;
  @Input() public required = false;
  private readonly _style: { [key: string]: any } = {};
  private _size?: string = undefined;

  @Input()
  public set size(value: string) {
    if (!["xxs", "xs", "sm", "default", "lg", "xl", "xxl"].includes(value)) {
      throw new Exception(`'sd-select.size'에 잘못된값 '${JSON.stringify(value)}'가 입력되었습니다.`);
    }
    this._size = value;
  }

  private _inline = false;

  @Input()
  public set inline(value: boolean) {
    if (typeof value !== "boolean") {
      throw new Exception(`'sd-select.inline'에 잘못된값 '${JSON.stringify(value)}'가 입력되었습니다.`);
    }
    this._inline = value;
  }

  private _disabled = false;

  public get disabled(): any {
    return this._disabled;
  }

  @Input()
  public set disabled(value: any) {
    this._disabled = !!value;
  }

  private _value: any;

  @Input()
  public set value(value: any) {
    this._value = value;
  }

  @Input()
  public set focusable(value: boolean) {
    if (typeof value !== "boolean") {
      throw new Exception(`'sd-select.focusable'에 잘못된값 '${JSON.stringify(value)}'가 입력되었습니다.`);
    }

    const $button = $(this._elementRef.nativeElement).children().first();
    if (value) {
      $button.off("focus.sd.disabled");
    }
    else {
      $button.on("focus.sd.disabled", e => {
        e.preventDefault();
        $button.trigger("blur");
      });
    }
  }

  public get styleClass(): string[] {
    // tslint:disable-next-line:no-null-keyword
    const parentButtonGroup = this._injector.get(SdButtonGroupControl, null as any, undefined);
    return [
      this._inline ? "_inline" : "",
      this._size ? `_size-${this._size}` : (parentButtonGroup && parentButtonGroup.size ? `_size-${parentButtonGroup.size}` : ""),
      this.theme ? `_theme-${this.theme}` : ""
    ].filter(item => item);
  }

  @Input()
  public set style(value: string) {
    const styles = value.split(";");
    for (const style of styles) {
      if (style.includes(":")) {
        const name = style.split(":")[0];
        this._style[name] = style.split(":")[1];
      }
    }
  }

  public get valueJson(): string {
    if (this.keyField) {
      const selectedOptionElem = $(this._elementRef.nativeElement).find("option").toArray()
        .single(elem => {
          const itemValueJson = $(elem).attr("value");
          const itemValue = JsonConvert.parse(itemValueJson);
          if (this._value === undefined && itemValue === undefined) {
            return true;
          }
          else if (this._value !== undefined && itemValue !== undefined) {
            return itemValue[this.keyField!] === this._value[this.keyField!];
          }
          else {
            return false;
          }
        }) as HTMLOptionElement;

      return selectedOptionElem ? selectedOptionElem.value : JsonConvert.stringify(undefined);
    }
    else {
      return JsonConvert.stringify(this._value);
    }
  }

  public constructor(private readonly _elementRef: ElementRef,
                     private readonly _injector: Injector) {
  }

  public getStyle(): { [key: string]: any } {
    return this._style;
  }

  public onChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    this._value = value === undefined ? undefined : JsonConvert.parse(value);
    this.valueChange.emit(this._value);
  }
}

@Component({
  selector: "option", // tslint:disable-line:component-selector
  template: `
    <ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionControl {
  @Input()
  public set value(value: any) {
    $(this._elementRef.nativeElement).attr("value", JsonConvert.stringify(value));
  }

  public constructor(private readonly _elementRef: ElementRef) {
  }
}
