export default (cb, time) => {
  let timer;
  return (event) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      cb();
    }, time || 200, event)
  }
}