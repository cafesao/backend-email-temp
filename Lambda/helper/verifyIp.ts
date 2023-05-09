import ipRangeCheck from 'ip-range-check'

import whiteListIp from './whitelist'

export default function verifyIp(ip: string) {
  return ipRangeCheck(ip, whiteListIp)
}
