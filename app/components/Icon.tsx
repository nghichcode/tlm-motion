import * as React from "react"
import { ComponentType } from "react"
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"

export type IconTypes = keyof typeof iconRegistry

interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md)
 */
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper: ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
    ? TouchableOpacity
    : View

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Image
        style={[
          $imageStyle,
          color && { tintColor: color },
          size && { width: size, height: size },
          $imageStyleOverride,
        ]}
        source={iconRegistry[icon]}
      />
    </Wrapper>
  )
}

export const iconRegistry = {
  back: require("../../assets/icons/back.png"),
  bell: require("../../assets/icons/back.png"),
  caretLeft: require("../../assets/icons/back.png"),
  caretRight: require("../../assets/icons/back.png"),
  check: require("../../assets/icons/back.png"),
  clap: require("../../assets/icons/back.png"),
  community: require("../../assets/icons/back.png"),
  components: require("../../assets/icons/back.png"),
  debug: require("../../assets/icons/back.png"),
  github: require("../../assets/icons/back.png"),
  heart: require("../../assets/icons/back.png"),
  hidden: require("../../assets/icons/back.png"),
  ladybug: require("../../assets/icons/back.png"),
  lock: require("../../assets/icons/back.png"),
  menu: require("../../assets/icons/back.png"),
  more: require("../../assets/icons/back.png"),
  pin: require("../../assets/icons/back.png"),
  podcast: require("../../assets/icons/back.png"),
  settings: require("../../assets/icons/back.png"),
  slack: require("../../assets/icons/back.png"),
  view: require("../../assets/icons/back.png"),
  x: require("../../assets/icons/back.png"),
}

const $imageStyle: ImageStyle = {
  resizeMode: "contain",
}
