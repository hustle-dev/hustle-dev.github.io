import React from 'react'
import { IconWrapper } from '../IconWrapper'
import Mail from '@/images/mail.svg'
import Facebook from '@/images/facebook.svg'
import Linkedin from '@/images/linkedin.svg'
import Github from '@/images/github.svg'

export const IconList = () => (
  <>
    <IconWrapper href="mailto:dlwoabsdk@gmail.com">
      <Mail />
    </IconWrapper>
    <IconWrapper href="https://www.facebook.com/jeongminiminimini/">
      <Facebook />
    </IconWrapper>
    <IconWrapper href="https://www.linkedin.com/in/jeongmin-lee-5ab898202/">
      <Linkedin />
    </IconWrapper>
    <IconWrapper href="https://github.com/hustle-dev">
      <Github />
    </IconWrapper>
  </>
)
