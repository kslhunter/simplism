import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  QueryList
} from "@angular/core";

@Component({
  selector: "sd-chart-donut-item",
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SdChartDonutItemControl {
  @Input() public value = 0;
  @Input() public theme = "primary";
  @Input() public label = "";
}

@Component({
  selector: "sd-chart-donut",
  template: `
    <svg [attr.viewBox]="'0 0 200 200'"
         xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle r="80"
                cy="100"
                cx="100"
                stroke-width="40"
                fill="none"></circle>
        <circle *ngFor="let itemControl of itemControlList?.toArray()?.reverse(); trackBy: itemControlTrackByFn"
                r="80"
                cy="100"
                cx="100"
                stroke-width="40"
                fill="none"
                stroke-dasharray="502.6548245743669"
                [attr.stroke-dashoffset]="getStrokeDashOffset(itemControl) + 'px'"
                [attr.class]="'_theme-' + itemControl.theme"
                [attr.data-value]="itemControl.value"
                [attr.data-label]="itemControl.label"></circle>
      </g>
      <text x="100"
            y="90"
            text-anchor="middle"
            alignment-baseline="middle"
            font-size="24px"
            fill="black"></text>
      <text x="100"
            y="120"
            text-anchor="middle"
            alignment-baseline="middle"
            font-size="24px"
            fill="black"></text>
    </svg>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SdChartDonutControl {
  @Input() public maxValue = 1;

  @ContentChildren(SdChartDonutItemControl)
  public itemControlList: QueryList<SdChartDonutItemControl> | undefined;

  public constructor(private readonly _elementRef: ElementRef,
                     private readonly _appRef: ApplicationRef) {
    const $this = $(this._elementRef.nativeElement);
    $this.on("mouseover", "circle[class]", event => {
      const $circle = $(event.target);
      const label = $circle.data("label");
      const percent = `${Math.round(Math.min((Number($circle.data("value")) / this.maxValue), 1) * 10000) / 100}%`;

      const $text = $this.find("text");
      $text.eq(0).text(label);
      $text.eq(1).text(percent);

      this._appRef.tick();
    });

    $this.on("mouseleave", () => {
      const $text = $this.find("text");
      $text.text("");
    });
  }

  public itemControlTrackByFn(index: number, value: SdChartDonutItemControl): number {
    return index;
  }

  public getStrokeDashOffset(itemControl: SdChartDonutItemControl): number {
    const index = this.itemControlList!.toArray().indexOf(itemControl);

    const prevPixel = index > 0 ? 502.6548245743669 - this.getStrokeDashOffset(this.itemControlList!.toArray()[index - 1]) : 0;

    return ((1 - Math.min((itemControl.value / this.maxValue), 1)) * 502.6548245743669) - prevPixel;
  }
}

@Component({
  selector: "circle", // tslint:disable-line:component-selector
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleControl {
}
