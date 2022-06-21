import tinycolor from "tinycolor2";
import invariant from "tiny-invariant";
import {Theme} from "./useTheme";

interface AdjustedColor{
    color:string;
    background:string;
}

export function calculateBrightness(color:string, brightness:number, alpha:number) {
    let tc = tinycolor(color);
    const currentBrightnessPercentage = (tc.getBrightness() / 255) * 100;
    tc.lighten((100 - currentBrightnessPercentage) * brightness);
    tc.setAlpha(alpha);
    return tc;
}

export function adjustColor(props:{color:string, brightness:number, alpha:number},theme:Theme):AdjustedColor {
    const {color,brightness,alpha} = props;
    const result:AdjustedColor = {color:'',background:''};
    invariant(color,'Color is mandatory');
    let tc = calculateBrightness(color, brightness, alpha);
    result.background = tc.toRgbString();
    if (tc.isDark()) {
        result.color = theme.lightColor;
    } else {
        result.color = theme.darkColor;
    }
    return result;
}