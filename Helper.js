
const deviceType = () => {
  const platform = navigator.userAgent.toLowerCase();
  if (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/.test(platform)) {
      return 'mobile';
  } else if (/mac|win|linux/i.test(platform)) {
      return 'desktop';
  } else if (/tablet|ipad/i.test(platform)) {
      return 'tablet';
  }
  return 'unknown';
}

export {
  deviceType
}