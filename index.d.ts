/* eslint-disable @typescript-eslint/no-empty-object-type,@typescript-eslint/no-explicit-any */
// noinspection JSUnusedGlobalSymbols

import {
  AllowedComponentProps,
  ComponentCustomProps,
  MethodOptions,
  VNodeProps,
} from 'vue';

declare type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps;

declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export declare type EmitFn<Options = ObjectEmitsOptions, Event extends keyof Options = keyof Options> =
    Options extends Array<infer V>
      ? (e: V, ...args: any[]) => void
      : {} extends Options
          ? (e: string, ...args: any[]) => void
          : UnionToIntersection<
            {
              [key in Event]: Options[key] extends (...args: infer Args) => any ? (e: key, ...args: Args) => void : (e: key, ...args: any[]) => void;
            }[Event]
          >;

export type DefineComponent<P = {}, S = {}, E = {}, M = {}> = {
  new(): {
    $props: P & PublicProps;
    $slots: S;
    $emit: E;
  } & M;
};

export type CountType = 'day' | 'night';

export interface TravelDatePickerEmitsOptions {
  'update:model-value'(value: Date[] | null): void;
}

export declare type TravelDatePickerEmits = EmitFn<TravelDatePickerEmitsOptions>;

export interface TravelDatePickerProps {
  countType: CountType;
  minDate?: Date;
  maxDate?: Date;
  minRangeSelection?: number;
  maxRangeSelection?: number;
}

export interface TravelDatePickerMethods extends MethodOptions {
  open: () => void;
}

declare const TravelDatePicker: DefineComponent<
  TravelDatePickerProps,
  {},
  TravelDatePickerEmits,
  TravelDatePickerMethods
>;

declare module 'vue' {
  export interface GlobalComponents {
    TravelDatePicker: DefineComponent<TravelDatePickerProps, {}, TravelDatePickerEmits, TravelDatePickerMethods>;
  }
}

export default TravelDatePicker;
