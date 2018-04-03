import {Exception} from "@simplism/core";

export abstract class SdModalControlBase<I, O> {
    param!: I;

    async abstract sdBeforeOpen(): Promise<void>;

    close(value?: O): void {
        throw new Exception("모달이 초기화되어있지 않습니다.");
    }
}