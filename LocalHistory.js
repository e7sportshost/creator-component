export default (routeName) => {
  return JSON.parse(localStorage.getItem(`${ routeName }_query`)) || {};
}