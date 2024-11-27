import { AtSign, CircleUserRound, Globe, UserRound } from "lucide-react"
import CompanyInfo from '@/components/welcome/companyInfo/companyInfo'

const tabs = [
  {
    name: 'Company Info',
    icon: <UserRound /> ,
    component: <CompanyInfo />,
  },
  {
    name: 'Founding Info',
    icon: <CircleUserRound /> ,
    component: null,
  },
  {
    name: 'Social Media Profile',
    icon: <Globe /> ,
    component: null,
  },
  {
    name: 'Contact',
    icon: <AtSign /> ,
    component: null,
  },
]

const welcome = () => {}

export default welcome