import { Icon } from "@chakra-ui/icon"

// const shade1 = "#DF5960"
// const shade2 = "#EE9398"
// const shade3 = "#CF373E"

const shade1 = "#3b3b3b"
const shade2 = "#727272"
const shade3 = "#000000"

export const WethIcon = () => (
  <Icon viewBox="0 0 48 96" focusable={false}>
    <path d="M23.9913 8.91397L23.4668 10.6955V62.3857L23.9913 62.909L47.9848 48.7262L23.9913 8.91397Z" fill={shade1} />
    <path d="M23.9942 8.91397L0 48.7262L23.9942 62.909V37.82V8.91397Z" fill={shade2} />
    <path d="M23.9909 67.4524L23.6953 67.8128V86.2252L23.9909 87.0881L47.9985 53.2773L23.9909 67.4524Z" fill={shade1} />
    <path d="M23.9935 87.0879V67.4522L0 53.2772L23.9935 87.0879Z" fill={shade2} />
    <path d="M23.9941 62.9063L47.987 48.7239L23.9941 37.818V62.9063Z" fill={shade3} />
    <path d="M0 48.7242L23.9935 62.9066V37.8183L0 48.7242Z" fill={shade1} />
  </Icon>
)
