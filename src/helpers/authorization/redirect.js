// Let's import current page store
import { stores } from "@sapper/app";

export default () => {
  const { page } = stores();

  // Let's now subscribe to this store and get
  // out needed information
  page.subscribe((data) => {
    if (data.query.return != null) {
      let returnURL = data.query.return;
  
      if (returnURL.split('').includes("@")) {
        window.location.href = "http://" + returnURL;
      } else {
        window.location.href = returnURL;
      }
    } else {
      window.location.href = "/settings";
    }
  });
};