import { verticalScale, moderateScale } from "react-native-size-matters";

export const scale = (size:number, percentage = 0.5) => {
  return moderateScale(size, percentage);
};

export const scaleVertically = (size:number) => {
  return verticalScale(size);
};
