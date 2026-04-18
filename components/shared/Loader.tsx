import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  Extrapolation,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Ellipse,
  Circle,
  Path,
  Rect,
  Line,
  G,
} from 'react-native-svg';
import { useThemeColors } from '../../theme/useThemeColors';

const AnimatedG = Animated.createAnimatedComponent(G);

interface LoaderProps {
  size?: number;
  text?: string;
}

const NOODLE_IN = [0, 0.18, 0.35, 0.62, 0.78, 0.88, 1.0];
const NOODLE_TX = [0, -1, -3, 2, 0, 0, 0];
const NOODLE_TY = [0, -8, -30, -24, 0, 0, 0];
const NOODLE_SX = [1, 0.92, 0.70, 0.72, 1.22, 0.97, 1];
const NOODLE_SY = [1, 1.10, 1.45, 1.38, 0.76, 1.04, 1];

const STEAM_T  = [0, 0.07, 0.65, 0.92, 1.0];
const STEAM_OP = [0, 0.50, 0.22, 0.04, 0];

export default function Loader({ size = 200, text }: LoaderProps) {
  const colors = useThemeColors();
  const height = Math.round(size * (220 / 200));
  const uid = React.useId().replace(/:/g, '');

  const wokBowlId = `${uid}-wokBowl`;
  const shellId   = `${uid}-shell`;
  const skinId    = `${uid}-skin`;

  const [reduceMotion, setReduceMotion] = useState(false);

  const wokProg    = useSharedValue(0);
  const noodleProg = useSharedValue(0);
  const flameLProg = useSharedValue(0);
  const flameCProg = useSharedValue(0);
  const flameRProg = useSharedValue(0);
  const steamProg  = useSharedValue(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(wokProg);
      cancelAnimation(noodleProg);
      cancelAnimation(flameLProg);
      cancelAnimation(flameCProg);
      cancelAnimation(flameRProg);
      cancelAnimation(steamProg);
      return;
    }
    const ease = Easing.inOut(Easing.ease);
    wokProg.value    = 0;
    noodleProg.value = 0;
    steamProg.value  = 0;
    flameLProg.value = 0;
    flameCProg.value = 0;
    flameRProg.value = 0;

    wokProg.value    = withRepeat(withTiming(1, { duration: 1200, easing: ease }), -1, false);
    noodleProg.value = withRepeat(withTiming(1, { duration: 1200, easing: ease }), -1, false);
    flameLProg.value = withRepeat(withTiming(1, { duration: 310,  easing: ease }), -1, true);
    flameCProg.value = withRepeat(withTiming(1, { duration: 430,  easing: ease }), -1, true);
    flameRProg.value = withRepeat(withTiming(1, { duration: 270,  easing: ease }), -1, true);
    steamProg.value  = withRepeat(withTiming(1, { duration: 2500, easing: Easing.linear }), -1, false);

    return () => {
      cancelAnimation(wokProg);
      cancelAnimation(noodleProg);
      cancelAnimation(flameLProg);
      cancelAnimation(flameCProg);
      cancelAnimation(flameRProg);
      cancelAnimation(steamProg);
    };
  }, [reduceMotion]);

  // Wok tilt — rotate around pivot (105, 200) using translate→rotate→translate
  const wokAnimProps = useAnimatedProps(() => {
    const deg = interpolate(wokProg.value, [0, 0.25, 0.5, 0.72, 1.0], [0, -8, 0, 5, 0]);
    return {
      transform: [
        { translateX: -105 }, { translateY: -200 },
        { rotate: `${deg}deg` },
        { translateX: 105 }, { translateY: 200 },
      ],
    };
  });

  // Noodles — scale around pivot (cx,cy) then translate (tx,ty)
  // order: T(-cx,-cy) → scaleX/Y → T(cx+tx, cy+ty)
  const noodle1AnimProps = useAnimatedProps(() => {
    const t  = (noodleProg.value + 0) % 1;
    const tx = interpolate(t, NOODLE_IN, NOODLE_TX, Extrapolation.CLAMP);
    const ty = interpolate(t, NOODLE_IN, NOODLE_TY, Extrapolation.CLAMP);
    const sx = interpolate(t, NOODLE_IN, NOODLE_SX, Extrapolation.CLAMP);
    const sy = interpolate(t, NOODLE_IN, NOODLE_SY, Extrapolation.CLAMP);
    return {
      transform: [
        { translateX: -98 }, { translateY: -174 },
        { scaleX: sx }, { scaleY: sy },
        { translateX: 98 + tx }, { translateY: 174 + ty },
      ],
    };
  });

  const noodle2AnimProps = useAnimatedProps(() => {
    const t  = (noodleProg.value + 0.075) % 1;
    const tx = interpolate(t, NOODLE_IN, NOODLE_TX, Extrapolation.CLAMP);
    const ty = interpolate(t, NOODLE_IN, NOODLE_TY, Extrapolation.CLAMP);
    const sx = interpolate(t, NOODLE_IN, NOODLE_SX, Extrapolation.CLAMP);
    const sy = interpolate(t, NOODLE_IN, NOODLE_SY, Extrapolation.CLAMP);
    return {
      transform: [
        { translateX: -101 }, { translateY: -181 },
        { scaleX: sx }, { scaleY: sy },
        { translateX: 101 + tx }, { translateY: 181 + ty },
      ],
    };
  });

  const noodle3AnimProps = useAnimatedProps(() => {
    const t  = (noodleProg.value + 0.15) % 1;
    const tx = interpolate(t, NOODLE_IN, NOODLE_TX, Extrapolation.CLAMP);
    const ty = interpolate(t, NOODLE_IN, NOODLE_TY, Extrapolation.CLAMP);
    const sx = interpolate(t, NOODLE_IN, NOODLE_SX, Extrapolation.CLAMP);
    const sy = interpolate(t, NOODLE_IN, NOODLE_SY, Extrapolation.CLAMP);
    return {
      transform: [
        { translateX: -96 }, { translateY: -187 },
        { scaleX: sx }, { scaleY: sy },
        { translateX: 96 + tx }, { translateY: 187 + ty },
      ],
    };
  });

  const noodle4AnimProps = useAnimatedProps(() => {
    const t  = (noodleProg.value + 0.225) % 1;
    const tx = interpolate(t, NOODLE_IN, NOODLE_TX, Extrapolation.CLAMP);
    const ty = interpolate(t, NOODLE_IN, NOODLE_TY, Extrapolation.CLAMP);
    const sx = interpolate(t, NOODLE_IN, NOODLE_SX, Extrapolation.CLAMP);
    const sy = interpolate(t, NOODLE_IN, NOODLE_SY, Extrapolation.CLAMP);
    return {
      transform: [
        { translateX: -99 }, { translateY: -192 },
        { scaleX: sx }, { scaleY: sy },
        { translateX: 99 + tx }, { translateY: 192 + ty },
      ],
    };
  });

  // Flames — scale around each flame's center-bottom pivot
  const flameLAnimProps = useAnimatedProps(() => {
    const sx = interpolate(flameLProg.value, [0, 1], [1.00, 0.85]);
    const sy = interpolate(flameLProg.value, [0, 1], [0.80, 1.28]);
    return {
      transform: [
        { translateX: -88 }, { translateY: -196 },
        { scaleX: sx }, { scaleY: sy },
        { translateX: 88 }, { translateY: 196 },
      ],
    };
  });

  const flameCAnimProps = useAnimatedProps(() => {
    const sx = interpolate(flameCProg.value, [0, 1], [1.05, 0.88]);
    const sy = interpolate(flameCProg.value, [0, 1], [0.70, 1.35]);
    return {
      transform: [
        { translateX: -105 }, { translateY: -200 },
        { scaleX: sx }, { scaleY: sy },
        { translateX: 105 }, { translateY: 200 },
      ],
    };
  });

  const flameRAnimProps = useAnimatedProps(() => {
    const sx = interpolate(flameRProg.value, [0, 1], [1.00, 0.90]);
    const sy = interpolate(flameRProg.value, [0, 1], [0.85, 1.22]);
    return {
      transform: [
        { translateX: -122 }, { translateY: -196 },
        { scaleX: sx }, { scaleY: sy },
        { translateX: 122 }, { translateY: 196 },
      ],
    };
  });

  // Steam wisps — pure translate + opacity
  const steam1AnimProps = useAnimatedProps(() => {
    const t       = (steamProg.value + 0) % 1;
    const ty      = interpolate(t, [0, 0.92, 1.0], [0, -42, -46], Extrapolation.CLAMP);
    const tx      = interpolate(t, [0, 0.92, 1.0], [0, 7, 8], Extrapolation.CLAMP);
    const opacity = interpolate(t, STEAM_T, STEAM_OP, Extrapolation.CLAMP);
    return { transform: [{ translateX: tx }, { translateY: ty }], opacity };
  });

  const steam2AnimProps = useAnimatedProps(() => {
    const t       = (steamProg.value + 0.333) % 1;
    const ty      = interpolate(t, [0, 0.92, 1.0], [0, -42, -46], Extrapolation.CLAMP);
    const tx      = interpolate(t, [0, 0.92, 1.0], [0, 7, 8], Extrapolation.CLAMP);
    const opacity = interpolate(t, STEAM_T, STEAM_OP, Extrapolation.CLAMP);
    return { transform: [{ translateX: tx }, { translateY: ty }], opacity };
  });

  const steam3AnimProps = useAnimatedProps(() => {
    const t       = (steamProg.value + 0.667) % 1;
    const ty      = interpolate(t, [0, 0.92, 1.0], [0, -42, -46], Extrapolation.CLAMP);
    const tx      = interpolate(t, [0, 0.92, 1.0], [0, 7, 8], Extrapolation.CLAMP);
    const opacity = interpolate(t, STEAM_T, STEAM_OP, Extrapolation.CLAMP);
    return { transform: [{ translateX: tx }, { translateY: ty }], opacity };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={height} viewBox="0 0 200 220">
        <Defs>
          <LinearGradient id={wokBowlId} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%"   stopColor="#5A5A5A" />
            <Stop offset="100%" stopColor="#242424" />
          </LinearGradient>
          <RadialGradient id={shellId} cx="38%" cy="30%" r="70%">
            <Stop offset="0%"   stopColor="#7D8E42" />
            <Stop offset="100%" stopColor="#48592A" />
          </RadialGradient>
          <RadialGradient id={skinId} cx="35%" cy="30%" r="65%">
            <Stop offset="0%"   stopColor="#8CC46C" />
            <Stop offset="100%" stopColor="#6A9050" />
          </RadialGradient>
        </Defs>

        {/* ── LAYER 1 — TURTLE BODY (behind wok) ── */}

        <Ellipse cx="90" cy="158" rx="50" ry="30" fill={`url(#${shellId})`} />
        <Path d="M90,130 Q73,144 69,158"   stroke="#3E5020" strokeWidth="1.5" fill="none" opacity="0.65" />
        <Path d="M90,130 Q107,144 111,158"  stroke="#3E5020" strokeWidth="1.5" fill="none" opacity="0.65" />
        <Path d="M67,147 Q79,153 90,155"   stroke="#3E5020" strokeWidth="1.5" fill="none" opacity="0.65" />
        <Path d="M113,147 Q101,153 90,155"  stroke="#3E5020" strokeWidth="1.5" fill="none" opacity="0.65" />
        <Path d="M67,163 Q79,161 90,164"   stroke="#3E5020" strokeWidth="1.5" fill="none" opacity="0.65" />
        <Path d="M113,163 Q101,161 90,164"  stroke="#3E5020" strokeWidth="1.5" fill="none" opacity="0.65" />
        <Path d="M50,148 Q60,130 90,128 Q120,130 130,148"
          fill="none" stroke="#8A9C48" strokeWidth="1" opacity="0.35" />

        <Path d="M50,156 Q56,146 70,147"
          stroke="#527840" strokeWidth="12" fill="none" strokeLinecap="round" />
        <Path d="M50,156 Q56,146 70,147"
          stroke={`url(#${skinId})`} strokeWidth="10" fill="none" strokeLinecap="round" />
        <Path d="M142,150 Q152,147 159,153"
          stroke="#527840" strokeWidth="12" fill="none" strokeLinecap="round" />
        <Path d="M142,150 Q152,147 159,153"
          stroke={`url(#${skinId})`} strokeWidth="10" fill="none" strokeLinecap="round" />

        {/* ── LAYER 2 — FLAMES ── */}

        <AnimatedG animatedProps={flameLAnimProps}>
          <Path d="M88,196 C77,184,78,168,88,161 C98,168,99,184,88,196 Z"  fill="#C85818" />
          <Path d="M88,193 C81,183,82,170,88,164 C94,170,95,183,88,193 Z"  fill="#E8820A" />
          <Path d="M88,189 C84,181,84,172,88,167 C92,172,92,181,88,189 Z"  fill="#F5A828" />
          <Ellipse cx="88" cy="189" rx="3" ry="2.5" fill="#FDD060" opacity="0.8" />
        </AnimatedG>

        <AnimatedG animatedProps={flameCAnimProps}>
          <Path d="M105,200 C90,188,91,170,105,158 C119,170,120,188,105,200 Z"  fill="#B04C14" />
          <Path d="M105,197 C93,186,94,170,105,160 C116,170,117,186,105,197 Z"  fill="#C85818" />
          <Path d="M105,193 C96,182,97,170,105,162 C113,170,114,182,105,193 Z"  fill="#E8820A" />
          <Path d="M105,188 C99,179,100,170,105,165 C110,170,111,179,105,188 Z" fill="#F5A828" />
          <Ellipse cx="105" cy="188" rx="3.5" ry="3" fill="#FDD060" opacity="0.8" />
        </AnimatedG>

        <AnimatedG animatedProps={flameRAnimProps}>
          <Path d="M122,196 C111,184,112,168,122,161 C132,168,133,184,122,196 Z"  fill="#C85818" />
          <Path d="M122,193 C115,183,116,170,122,164 C128,170,129,183,122,193 Z"  fill="#E8820A" />
          <Path d="M122,189 C118,181,118,172,122,167 C126,172,126,181,122,189 Z"  fill="#F5A828" />
          <Ellipse cx="122" cy="189" rx="3" ry="2.5" fill="#FDD060" opacity="0.8" />
        </AnimatedG>

        {/* ── LAYER 3 — WOK (tilts, noodles inside) ── */}

        <AnimatedG animatedProps={wokAnimProps}>
          <Path d="M58,158 C58,194,80,202,105,202 C130,202,152,194,152,158"
            fill={`url(#${wokBowlId})`} />

          <Ellipse cx="105" cy="158" rx="47" ry="12" fill="#545454" />
          <Ellipse cx="105" cy="158" rx="47" ry="12"
            fill="none" stroke="#767676" strokeWidth="1.5" />
          <Path d="M62,155 Q105,147 148,155"
            fill="none" stroke="#909090" strokeWidth="1" opacity="0.4" />

          <Path d="M70,161 C70,192,87,197,105,197 C123,197,140,192,140,161" fill="#222222" />
          <Path d="M74,162 C74,188,88,193,105,193 Q118,191 126,183"
            fill="none" stroke="#404040" strokeWidth="1.5" opacity="0.55" />

          <Path d="M150,162 C155,158,163,157,168,158 C173,159,174,163,173,166 C172,169,165,170,158,168 C153,166,150,165,150,162 Z"
            fill="#484848" stroke="#626262" strokeWidth="1" />
          <Line x1="161" y1="157.5" x2="160" y2="169.5" stroke="#686868" strokeWidth="1.5" opacity="0.55" />
          <Line x1="165" y1="157.5" x2="164" y2="169.5" stroke="#686868" strokeWidth="1.5" opacity="0.55" />

          <AnimatedG animatedProps={noodle1AnimProps}>
            <Path d="M80,168 Q87,162 94,168 Q101,174 108,168 Q113,164 116,168"
              stroke="#E8D5A3" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </AnimatedG>
          <AnimatedG animatedProps={noodle2AnimProps}>
            <Path d="M83,175 Q90,169 97,175 Q104,181 111,175 Q116,171 119,175"
              stroke="#D0BC8A" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </AnimatedG>
          <AnimatedG animatedProps={noodle3AnimProps}>
            <Path d="M77,181 Q85,175 92,181 Q99,187 106,181 Q111,177 115,181"
              stroke="#EDD9AA" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </AnimatedG>
          <AnimatedG animatedProps={noodle4AnimProps}>
            <Path d="M84,186 Q92,180 99,186 Q106,192 113,186"
              stroke="#E8D5A3" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </AnimatedG>
        </AnimatedG>

        {/* ── LAYER 4 — TURTLE HEAD + HAT ── */}

        <Path d="M82,118 Q83,108 90,107 Q97,108 98,118" fill="#6A9050" />

        <Circle cx="90" cy="107" r="22" fill="#527840" />
        <Circle cx="90" cy="107" r="20" fill={`url(#${skinId})`} />
        <Ellipse cx="86" cy="99" rx="10" ry="7" fill="#9AD070" opacity="0.30" />

        <Circle cx="82" cy="103" r="8" fill="white" />
        <Circle cx="83.2" cy="104.2" r="5.2" fill="#1A1A1A" />
        <Circle cx="84.8" cy="102.5" r="1.9" fill="white" />
        <Circle cx="98" cy="103" r="8" fill="white" />
        <Circle cx="99.2" cy="104.2" r="5.2" fill="#1A1A1A" />
        <Circle cx="100.8" cy="102.5" r="1.9" fill="white" />

        <Path d="M84,112 Q90,118 96,112"
          stroke="#3E6030" strokeWidth="2.2" fill="none" strokeLinecap="round" />

        <Rect x="67" y="83" width="46" height="9" rx="4.5" fill="#F5F5F0" />
        <Rect x="67" y="83" width="46" height="9" rx="4.5"
          fill="none" stroke="#D8D4C8" strokeWidth="0.8" />
        <Path d="M70,91 Q90,94 110,91" fill="none" stroke="#C8C4B8" strokeWidth="1" opacity="0.4" />

        <Rect x="73" y="44" width="34" height="42" rx="3" fill="#F5F5F0" />
        <Rect x="73" y="44" width="34" height="42" rx="3"
          fill="none" stroke="#D8D4C8" strokeWidth="0.8" />
        <Line x1="81" y1="47" x2="81" y2="84" stroke="#DDD9CE" strokeWidth="1" opacity="0.65" />
        <Line x1="90" y1="45" x2="90" y2="84" stroke="#DDD9CE" strokeWidth="1" opacity="0.65" />
        <Line x1="99" y1="47" x2="99" y2="84" stroke="#DDD9CE" strokeWidth="1" opacity="0.65" />

        <Ellipse cx="90" cy="45" rx="20" ry="13" fill="#F5F5F0" />
        <Ellipse cx="90" cy="45" rx="20" ry="13"
          fill="none" stroke="#D8D4C8" strokeWidth="0.8" />
        <Ellipse cx="85" cy="40" rx="8" ry="5" fill="white" opacity="0.5" />

        {/* ── LAYER 5 — STEAM WISPS ── */}

        <AnimatedG animatedProps={steam1AnimProps}>
          <Path d="M91,150 Q87,142 91,135 Q95,128 91,121"
            stroke="#C4BCB4" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.65" />
        </AnimatedG>
        <AnimatedG animatedProps={steam2AnimProps}>
          <Path d="M106,147 Q110,139 106,132 Q102,125 106,118"
            stroke="#C4BCB4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.60" />
        </AnimatedG>
        <AnimatedG animatedProps={steam3AnimProps}>
          <Path d="M119,150 Q115,142 119,135 Q123,128 119,121"
            stroke="#C4BCB4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
        </AnimatedG>
      </Svg>

      {text && (
        <Text style={[styles.label, { color: colors.text.primary }]}>
          {text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
});
