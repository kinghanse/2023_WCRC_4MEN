export const SafetyLevelEnum = {
  Safe: 1,
  Caution: 2,
  Warning: 3,
  Danger: 4,
  VeryDangerous: 5,
} as const;
export type SafetyLevelEnum =
  (typeof SafetyLevelEnum)[keyof typeof SafetyLevelEnum];

export const ProcessFlagEnum = {
  Waiting: 1,
  ToBeVerified: 2,
  InProgress: 3,
  Completed: 4,
  OnHold: 5,
} as const;
export type ProcessFlagEnum =
  (typeof ProcessFlagEnum)[keyof typeof ProcessFlagEnum];
