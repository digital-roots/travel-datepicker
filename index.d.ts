import {ComputedOptions, DefineComponent, MethodOptions} from "vue";

export type CountType = 'day' | 'night';

export interface TravelDatePickerEvents {
  $emit: (event: 'update:model-value', value: Date[] | null) => void;
}

export interface TravelDatePickerProps {
  countType: CountType;
  minDate?: Date;
  maxDate?: Date;
  minRangeSelection?: number;
  maxRangeSelection?: number;
}

export interface PublicMethods extends MethodOptions {
  open: () => void;
}

export type Props = TravelDatePickerEvents & TravelDatePickerProps & {
  $props: Readonly<TravelDatePickerProps>
};

declare const _default: DefineComponent<
  {},
  Props,
  {},
  ComputedOptions,
  PublicMethods
>;

export default _default;
