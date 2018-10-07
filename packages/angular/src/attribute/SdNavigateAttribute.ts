import {Directive, HostListener, Input} from "@angular/core";
import * as querystring from "querystring";
import {Router} from "@angular/router";
import {JsonConvert} from "@simplism/core";

@Directive({
  selector: "[sdNavigate]"
})
export class SdNavigateAttribute {
  @Input()
  public sdNavigate?: [string, object | undefined];

  public constructor(private readonly _router: Router) {
  }

  @HostListener("click", ["$event"])
  public async onClick(event: MouseEvent): Promise<void> {
    if (!this.sdNavigate) return;

    const obj = this.sdNavigate[1];
    let newObj: { [key: string]: string } | undefined;
    if (obj) {
      newObj = {};
      for (const key of Object.keys(obj)) {
        newObj[key] = JsonConvert.stringify(obj[key])!;
      }
    }

    if (event.ctrlKey) {
      window.open(location.pathname + `#${this.sdNavigate[0]};${this.sdNavigate[1] ? querystring.stringify(newObj) : ""}`, "_blank");
    }
    else {
      await this._router.navigate([`${this.sdNavigate[0]}`, ...(newObj ? [newObj] : [])]);
    }
  }
}