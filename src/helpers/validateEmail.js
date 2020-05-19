// oof. Very strange function, isn't it? But
// it just validates email.
export default (mail) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true
  };
  return false;
}